import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createLogger, fingerprint } from "../_shared/logging.ts";


/**
 * Subscription webhook.
 *
 * Receives provider-side lifecycle events and keeps
 * `profiles.is_subscribed` / `profiles.subscription_expires_at` in sync.
 *
 * - Android: Google Play Real-time Developer Notifications (RTDN) pushed
 *   through a Pub/Sub push subscription.
 * - iOS: App Store Server Notifications V2 (signedPayload JWS).
 *
 * Both providers are configured with the URL:
 *   https://<project>.supabase.co/functions/v1/subscription-webhook?token=<SUBSCRIPTION_WEBHOOK_SECRET>
 *
 * The shared token is the only caller authentication (providers cannot send
 * a Supabase JWT), so the function is deployed with verify_jwt = false.
 */

const PACKAGE_NAME = "app.lovable.d3590b81c81449329e6d4fbda085725b";

const jsonHeaders = { "Content-Type": "application/json" };

// Google Play notificationType values
const GOOGLE_ACTIVE_TYPES = new Set([1, 2, 4, 7]); // recovered, renewed, purchased, restarted
const GOOGLE_INACTIVE_TYPES = new Set([3, 5, 10, 12, 13]); // cancelled, on hold, paused, revoked, expired

// Apple notificationType values that end access immediately
const APPLE_INACTIVE_TYPES = new Set(["EXPIRED", "REVOKE", "REFUND", "GRACE_PERIOD_EXPIRED"]);

serve(async (req) => {
  const logger = createLogger("subscription-webhook");
  const { traceId, log, logError, ok, fail } = logger;

  if (req.method !== "POST") {
    return fail("method_not_allowed", 405, "Method not allowed.", { method: req.method });
  }

  const secret = Deno.env.get("SUBSCRIPTION_WEBHOOK_SECRET");
  const token = new URL(req.url).searchParams.get("token");

  if (!secret || !token || token !== secret) {
    return fail("unauthorized", 401, "Unauthorized.", {
      secret_configured: Boolean(secret),
      token_supplied: Boolean(token),
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const ctx: WebhookCtx = { traceId, log, logError };

  let eventRowId: string | null = null;

  try {
    const raw = await req.text();
    let body: any = null;
    try {
      body = raw ? JSON.parse(raw) : null;
    } catch {
      body = null;
    }
    if (!body) {
      return fail("invalid_body", 400, "Request body must be valid JSON.", {
        body_bytes: raw.length,
      });
    }

    log("webhook_received", {
      provider: body.message?.data ? "google" : body.signedPayload ? "apple" : "unknown",
      body_bytes: raw.length,
    });


    // ---- Google Play RTDN (Pub/Sub push envelope) ----
    if (body.message?.data) {
      const decoded = JSON.parse(atob(body.message.data));
      const sub = decoded.subscriptionNotification;
      const voided = decoded.voidedPurchaseNotification;
      const eventType = voided
        ? "google:voided"
        : `google:${sub?.notificationType ?? "unknown"}`;
      const eventKey =
        body.message.messageId ??
        `${sub?.purchaseToken ?? voided?.purchaseToken ?? "unknown"}:${decoded.eventTimeMillis ?? ""}:${eventType}`;

      const claim = await claimEvent(admin, ctx, "google", eventKey, eventType, decoded);
      if (!claim.shouldProcess) {
        log("duplicate_event_skipped", { event_key: eventKey, event_type: eventType });
        return new Response(JSON.stringify({ success: true, duplicate: true, traceId }), {
          status: 200,
          headers: jsonHeaders,
        });
      }
      eventRowId = claim.id;

      log("processing_event", { provider: "google", event_key: eventKey, event_type: eventType });
      await handleGoogleNotification(admin, decoded, ctx);
      await finishEvent(admin, ctx, eventRowId, "processed");

      // Always 200 so Pub/Sub does not redeliver indefinitely.
      return new Response(JSON.stringify({ success: true, traceId }), { status: 200, headers: jsonHeaders });
    }

    // ---- Apple App Store Server Notifications V2 ----
    if (body.signedPayload) {
      const payload = decodeJws(body.signedPayload);
      const eventType = payload.subtype
        ? `apple:${payload.notificationType}:${payload.subtype}`
        : `apple:${payload.notificationType}`;
      const eventKey = payload.notificationUUID ?? `${eventType}:${payload.signedDate ?? ""}`;

      const claim = await claimEvent(admin, ctx, "apple", eventKey, eventType, payload);
      if (!claim.shouldProcess) {
        log("duplicate_event_skipped", { event_key: eventKey, event_type: eventType });
        return new Response(JSON.stringify({ success: true, duplicate: true, traceId }), {
          status: 200,
          headers: jsonHeaders,
        });
      }
      eventRowId = claim.id;

      log("processing_event", { provider: "apple", event_key: eventKey, event_type: eventType });
      await handleAppleNotification(admin, body.signedPayload, ctx);
      await finishEvent(admin, ctx, eventRowId, "processed");

      return new Response(JSON.stringify({ success: true, traceId }), { status: 200, headers: jsonHeaders });
    }

    logError("unrecognised_payload");
    return new Response(JSON.stringify({ error: "Unrecognised notification payload" }), {
      status: 400,
      headers: jsonHeaders,
    });
  } catch (error) {
    logError("unhandled_error", { error: error instanceof Error ? error.message : String(error) });
    if (eventRowId) {
      await finishEvent(admin, ctx, eventRowId, "failed", error instanceof Error ? error.message : String(error));
    }
    // Unexpected failures return 500 so the provider retries later.
    return new Response(JSON.stringify({ error: "Internal server error", traceId }), {
      status: 500,
      headers: jsonHeaders,
    });
  }
});

/* -------------------------------------------------------------------------- */
/* Idempotency + tracing                                                      */
/* -------------------------------------------------------------------------- */

interface WebhookCtx {
  traceId: string;
  log: (message: string, extra?: Record<string, unknown>) => void;
  logError: (message: string, extra?: Record<string, unknown>) => void;
}

/**
 * Reserve an event row. Returns shouldProcess = false when this provider event
 * key was already handled (or is currently being handled), which makes repeated
 * provider deliveries a no-op instead of re-applying profile updates.
 */
async function claimEvent(
  admin: any,
  ctx: WebhookCtx,
  provider: string,
  eventKey: string,
  eventType: string,
  payload: unknown
): Promise<{ shouldProcess: boolean; id: string | null }> {
  const { data, error } = await admin
    .from("subscription_webhook_events")
    .insert({
      provider,
      event_key: eventKey,
      event_type: eventType,
      trace_id: ctx.traceId,
      payload,
      status: "processing",
    })
    .select("id")
    .maybeSingle();

  if (!error && data) return { shouldProcess: true, id: data.id };

  // Insert failed — most commonly a unique violation (23505) from a duplicate
  // provider delivery. Look up the existing ledger row to decide what to do.
  const { data: existing } = await admin
    .from("subscription_webhook_events")
    .select("id, status, trace_id")
    .eq("provider", provider)
    .eq("event_key", eventKey)
    .maybeSingle();

  if (existing) {
    ctx.log("existing_event_found", {
      event_key: eventKey,
      status: existing.status,
      original_trace_id: existing.trace_id,
    });
    if (existing.status === "failed") {
      // Allow a retry of a previously failed event.
      await admin
        .from("subscription_webhook_events")
        .update({ status: "processing", trace_id: ctx.traceId, error_message: null })
        .eq("id", existing.id);
      return { shouldProcess: true, id: existing.id };
    }
    return { shouldProcess: false, id: existing.id };
  }

  ctx.logError("claim_event_failed", { error: error?.message ?? "unknown" });
  // Do not block processing when the ledger itself is unavailable.
  return { shouldProcess: true, id: null };
}

async function finishEvent(
  admin: any,
  ctx: WebhookCtx,
  id: string | null,
  status: "processed" | "failed",
  errorMessage?: string
) {
  if (!id) return;
  const { error } = await admin
    .from("subscription_webhook_events")
    .update({
      status,
      error_message: errorMessage ?? null,
      processed_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) ctx.logError("finish_event_failed", { error: error.message });
  else ctx.log("event_finished", { status });
}


/* -------------------------------------------------------------------------- */
/* Google Play                                                                */
/* -------------------------------------------------------------------------- */

async function handleGoogleNotification(admin: any, notification: any, ctx: WebhookCtx) {
  const sub = notification.subscriptionNotification;
  const voided = notification.voidedPurchaseNotification;

  if (voided?.purchaseToken) {
    await applyState(admin, { platform: "android", purchaseToken: voided.purchaseToken }, {
      isActive: false,
      expiresAt: new Date(),
      event: "voided",
    }, ctx);
    return;
  }

  if (!sub?.purchaseToken) {
    ctx.log("google_notification_without_subscription");
    return;
  }

  const notificationType = Number(sub.notificationType);
  const purchaseToken: string = sub.purchaseToken;
  const productId: string = sub.subscriptionId ?? "";

  // Fetch authoritative state from Google so we never trust the event alone.
  const verified = await getGoogleSubscriptionState(productId, purchaseToken);

  let isActive: boolean;
  if (verified) {
    isActive = verified.expiresAt.getTime() > Date.now();
  } else {
    isActive = GOOGLE_ACTIVE_TYPES.has(notificationType) && !GOOGLE_INACTIVE_TYPES.has(notificationType);
  }

  await applyState(
    admin,
    { platform: "android", purchaseToken },
    {
      isActive,
      expiresAt: verified?.expiresAt ?? null,
      plan: mapProductToPlan(productId),
      event: `google:${notificationType}`,
    },
    ctx
  );
}

async function getGoogleSubscriptionState(
  productId: string,
  purchaseToken: string
): Promise<{ expiresAt: Date } | null> {
  const serviceAccountJson = Deno.env.get("GOOGLE_PLAY_SERVICE_ACCOUNT_JSON");
  if (!serviceAccountJson || !productId) return null;

  try {
    const serviceAccount = JSON.parse(serviceAccountJson);
    const jwt = await createGoogleJwt(serviceAccount);

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt,
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      console.error("Google OAuth failed");
      return null;
    }

    const url = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${PACKAGE_NAME}/purchases/subscriptions/${productId}/tokens/${purchaseToken}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${tokenData.access_token}` } });
    if (!res.ok) {
      console.error("Google subscription lookup failed:", res.status);
      return null;
    }

    const data = await res.json();
    if (!data.expiryTimeMillis) return null;
    return { expiresAt: new Date(Number(data.expiryTimeMillis)) };
  } catch (error) {
    console.error("Google subscription lookup error:", error);
    return null;
  }
}

async function createGoogleJwt(serviceAccount: any): Promise<string> {
  const header = { alg: "RS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: serviceAccount.client_email,
    sub: serviceAccount.client_email,
    scope: "https://www.googleapis.com/auth/androidpublisher",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };

  const b64url = (input: string) =>
    btoa(input).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  const signingInput = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(payload))}`;

  const privateKey = String(serviceAccount.private_key).replace(/\\n/g, "\n");
  const keyData = privateKey.replace(/-----[^-]+-----/g, "").replace(/\s/g, "");
  const binaryKey = Uint8Array.from(atob(keyData), (c) => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryKey.buffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", cryptoKey, new TextEncoder().encode(signingInput));
  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${signingInput}.${signatureB64}`;
}

/* -------------------------------------------------------------------------- */
/* Apple                                                                      */
/* -------------------------------------------------------------------------- */

function decodeJws(jws: string): any {
  const parts = jws.split(".");
  if (parts.length !== 3) throw new Error("Malformed JWS");
  const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  const padded = payload + "=".repeat((4 - (payload.length % 4)) % 4);
  return JSON.parse(atob(padded));
}

async function handleAppleNotification(admin: any, signedPayload: string, ctx: WebhookCtx) {
  const payload = decodeJws(signedPayload);
  const notificationType: string = payload.notificationType ?? "";
  const subtype: string = payload.subtype ?? "";

  const transactionInfo = payload.data?.signedTransactionInfo
    ? decodeJws(payload.data.signedTransactionInfo)
    : null;
  const renewalInfo = payload.data?.signedRenewalInfo ? decodeJws(payload.data.signedRenewalInfo) : null;

  const originalTransactionId: string | undefined =
    transactionInfo?.originalTransactionId ?? renewalInfo?.originalTransactionId;

  if (!originalTransactionId) {
    ctx.log("apple_notification_without_original_transaction_id");
    return;
  }

  const expiresAt = transactionInfo?.expiresDate ? new Date(Number(transactionInfo.expiresDate)) : null;

  let isActive: boolean;
  if (APPLE_INACTIVE_TYPES.has(notificationType)) {
    isActive = false;
  } else if (expiresAt) {
    isActive = expiresAt.getTime() > Date.now();
  } else {
    isActive = true;
  }

  await applyState(
    admin,
    { platform: "ios", originalTransactionId },
    {
      isActive,
      expiresAt,
      plan: mapProductToPlan(transactionInfo?.productId ?? ""),
      event: subtype ? `apple:${notificationType}:${subtype}` : `apple:${notificationType}`,
      latestTransactionId: transactionInfo?.transactionId ?? null,
    },
    ctx
  );
}

/* -------------------------------------------------------------------------- */
/* Shared state application                                                   */
/* -------------------------------------------------------------------------- */

function mapProductToPlan(productId: string): "monthly" | "yearly" | null {
  if (productId.includes("monthly")) return "monthly";
  if (productId.includes("yearly")) return "yearly";
  return null;
}

interface ReceiptLookup {
  platform: "android" | "ios";
  purchaseToken?: string;
  originalTransactionId?: string;
}

interface StateUpdate {
  isActive: boolean;
  expiresAt: Date | null;
  plan?: "monthly" | "yearly" | null;
  event: string;
  latestTransactionId?: string | null;
}

async function applyState(admin: any, lookup: ReceiptLookup, update: StateUpdate, ctx: WebhookCtx) {
  let query = admin.from("subscription_receipts").select("*").eq("platform", lookup.platform);

  if (lookup.purchaseToken) {
    query = query.eq("purchase_token", lookup.purchaseToken);
  } else if (lookup.originalTransactionId) {
    query = query.eq("original_transaction_id", lookup.originalTransactionId);
  }

  const { data: receipt, error } = await query.maybeSingle();

  if (error) {
    ctx.logError("receipt_lookup_failed", { error: error.message, event: update.event });
    throw error;
  }

  if (!receipt) {
    // Unknown purchase — most often an event that arrived before the client
    // finished verifying the purchase. Nothing to sync yet.
    ctx.log("no_matching_receipt", { event: update.event, platform: lookup.platform });
    return;
  }

  const receiptUpdate: Record<string, unknown> = {
    is_active: update.isActive,
    last_event: update.event,
  };
  if (update.expiresAt) receiptUpdate.expires_at = update.expiresAt.toISOString();
  if (update.plan) receiptUpdate.plan = update.plan;
  if (update.latestTransactionId) receiptUpdate.latest_transaction_id = update.latestTransactionId;

  const { error: receiptError } = await admin
    .from("subscription_receipts")
    .update(receiptUpdate)
    .eq("id", receipt.id);

  if (receiptError) {
    ctx.logError("receipt_update_failed", { error: receiptError.message, event: update.event });
    throw receiptError;
  }

  const profileUpdate: Record<string, unknown> = {
    is_subscribed: update.isActive,
  };
  if (update.expiresAt) profileUpdate.subscription_expires_at = update.expiresAt.toISOString();
  if (update.plan) profileUpdate.subscription_plan = update.plan;

  const { error: profileError } = await admin.from("profiles").update(profileUpdate).eq("id", receipt.user_id);

  if (profileError) {
    ctx.logError("profile_update_failed", { error: profileError.message, user_id: receipt.user_id });
    throw profileError;
  }

  await admin
    .from("subscription_webhook_events")
    .update({ user_id: receipt.user_id })
    .eq("trace_id", ctx.traceId);

  ctx.log("subscription_state_synced", {
    event: update.event,
    user_id: receipt.user_id,
    is_active: update.isActive,
    expires_at: update.expiresAt ? update.expiresAt.toISOString() : null,
    plan: update.plan ?? null,
  });
}
