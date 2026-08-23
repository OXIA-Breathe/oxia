import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createLogger, fingerprint, type Logger } from "../_shared/logging.ts";

const ALLOWED_ORIGIN = "https://d3590b81-c814-4932-9e6d-4fbda085725b.lovable.app";

const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PACKAGE_NAME = "app.lovable.d3590b81c81449329e6d4fbda085725b";

/** Reason returned by a store verifier when a purchase could not be confirmed. */
interface StoreFailure {
  /** Machine-readable reason code surfaced to the client. */
  code:
    | "store_not_configured"
    | "store_rejected"
    | "store_unreachable"
    | "no_matching_transaction";
  /** Short, non-sensitive detail for QA (HTTP status, Apple status number, …). */
  reason: string;
}

interface StoreResult {
  isValid: boolean;
  expiresAt: Date | null;
  /** Apple's stable subscription identifier, used to match webhook events. */
  originalTransactionId?: string | null;
  failure?: StoreFailure;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const logger = createLogger("verify-purchase", corsHeaders);
  const { log, logError, ok, fail } = logger;

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return fail("missing_auth", 401, "Missing or malformed authorization header.");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return fail("invalid_token", 401, "Your session is no longer valid. Please sign in again.", {
        auth_error: userError?.message ?? null,
      });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return fail("invalid_body", 400, "Request body must be valid JSON.", { user_id: user.id });
    }

    const { platform, productId, transactionId, receipt } = body as Record<string, string>;

    const missing = ["platform", "productId", "transactionId", "receipt"].filter(
      (field) => !(body as Record<string, unknown>)[field],
    );
    if (missing.length > 0) {
      return fail("missing_fields", 400, `Missing purchase fields: ${missing.join(", ")}.`, {
        user_id: user.id,
        missing_fields: missing,
      });
    }

    log("request_received", {
      user_id: user.id,
      platform,
      product_id: productId,
      transaction_id: fingerprint(transactionId),
      receipt_fingerprint: fingerprint(receipt),
      receipt_length: receipt.length,
    });

    const plan = mapProductToPlan(productId);
    if (!plan) {
      return fail("unknown_product", 400, "This product is not a known OXIA subscription.", {
        user_id: user.id,
        product_id: productId,
      });
    }

    let result: StoreResult;
    if (platform === "android") {
      result = await verifyGooglePlayPurchase(productId, receipt, logger);
    } else if (platform === "ios") {
      result = await verifyAppleReceipt(receipt, productId, logger);
    } else {
      return fail("unsupported_platform", 400, `Unsupported platform "${platform}".`, {
        user_id: user.id,
      });
    }

    if (!result.isValid || !result.expiresAt) {
      const failure = result.failure ?? { code: "store_rejected" as const, reason: "unknown" };
      const status = failure.code === "store_not_configured"
        ? 503
        : failure.code === "store_unreachable"
        ? 502
        : 402;
      return fail(
        failure.code,
        status,
        failure.code === "store_not_configured"
          ? "Purchase verification is not configured on the server yet."
          : failure.code === "store_unreachable"
          ? "The store could not be reached. Please try again shortly."
          : "The store could not confirm this purchase.",
        { user_id: user.id, platform, product_id: productId, store_reason: failure.reason },
      );
    }

    const expiresAt = result.expiresAt;

    if (expiresAt.getTime() <= Date.now()) {
      return fail("subscription_expired", 402, "This subscription has already expired.", {
        user_id: user.id,
        platform,
        expires_at: expiresAt.toISOString(),
      });
    }

    // Update profile using service role (bypasses RLS and subscription field protection)
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Persist the store receipt so provider webhooks (renewal / cancellation /
    // refund) can resolve this purchase back to the user.
    const receiptRow: Record<string, unknown> = {
      user_id: user.id,
      platform,
      product_id: productId,
      plan,
      expires_at: expiresAt.toISOString(),
      is_active: true,
      last_event: "client_verified",
      latest_transaction_id: transactionId,
    };

    let receiptQuery = supabaseAdmin
      .from("subscription_receipts")
      .select("id")
      .eq("platform", platform);

    if (platform === "android") {
      receiptRow.purchase_token = receipt;
      receiptQuery = receiptQuery.eq("purchase_token", receipt);
    } else {
      receiptRow.original_transaction_id = transactionId;
      receiptQuery = receiptQuery.eq("original_transaction_id", transactionId);
    }

    const { data: existingReceipt, error: receiptLookupError } = await receiptQuery.maybeSingle();

    if (receiptLookupError) {
      logError("receipt_lookup_failed", {
        user_id: user.id,
        platform,
        error: receiptLookupError.message,
      });
    }

    const { error: receiptError } = existingReceipt
      ? await supabaseAdmin.from("subscription_receipts").update(receiptRow).eq("id", existingReceipt.id)
      : await supabaseAdmin.from("subscription_receipts").insert(receiptRow);

    if (receiptError) {
      return fail("receipt_persist_failed", 500, "Failed to record the purchase.", {
        user_id: user.id,
        platform,
        db_error: receiptError.message,
      });
    }

    log("receipt_persisted", {
      user_id: user.id,
      platform,
      mode: existingReceipt ? "updated" : "inserted",
    });

    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({
        is_subscribed: true,
        subscription_expires_at: expiresAt.toISOString(),
        subscription_plan: plan,
      })
      .eq("id", user.id);

    if (updateError) {
      return fail("profile_update_failed", 500, "Failed to activate the subscription.", {
        user_id: user.id,
        db_error: updateError.message,
      });
    }

    log("subscription_activated", {
      user_id: user.id,
      platform,
      plan,
      expires_at: expiresAt.toISOString(),
      receipt_mode: existingReceipt ? "updated" : "inserted",
    });
    log("request_completed", { status: 200, user_id: user.id });

    return ok({ success: true, plan, expiresAt: expiresAt.toISOString() });
  } catch (error) {
    logError("unhandled_error", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack?.split("\n").slice(0, 4).join(" | ") : undefined,
    });
    return fail("internal_error", 500, "Internal server error.");
  }
});

function mapProductToPlan(productId: string): "monthly" | "yearly" | null {
  if (productId.includes("monthly")) return "monthly";
  if (productId.includes("yearly")) return "yearly";
  return null;
}

async function verifyGooglePlayPurchase(
  productId: string,
  purchaseToken: string,
  logger: Logger,
): Promise<StoreResult> {
  const serviceAccountJson = Deno.env.get("GOOGLE_PLAY_SERVICE_ACCOUNT_JSON");
  if (!serviceAccountJson) {
    logger.logError("google_config_missing", { secret: "GOOGLE_PLAY_SERVICE_ACCOUNT_JSON" });
    return {
      isValid: false,
      expiresAt: null,
      failure: { code: "store_not_configured", reason: "GOOGLE_PLAY_SERVICE_ACCOUNT_JSON missing" },
    };
  }

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

    const tokenData = await tokenRes.json().catch(() => ({}));
    if (!tokenData.access_token) {
      logger.logError("google_oauth_failed", {
        http_status: tokenRes.status,
        google_error: tokenData.error ?? null,
        google_error_description: tokenData.error_description ?? null,
      });
      return {
        isValid: false,
        expiresAt: null,
        failure: {
          code: "store_rejected",
          reason: `oauth ${tokenRes.status} ${tokenData.error ?? "no_access_token"}`,
        },
      };
    }
    logger.log("google_oauth_ok");

    const url = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${PACKAGE_NAME}/purchases/subscriptions/${productId}/tokens/${purchaseToken}`;
    const verifyRes = await fetch(url, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!verifyRes.ok) {
      const detail = (await verifyRes.text().catch(() => "")).slice(0, 300);
      logger.logError("google_lookup_failed", {
        http_status: verifyRes.status,
        product_id: productId,
        token_fingerprint: fingerprint(purchaseToken),
        google_response: detail,
      });
      return {
        isValid: false,
        expiresAt: null,
        failure: { code: "store_rejected", reason: `lookup http ${verifyRes.status}` },
      };
    }

    const verifyData = await verifyRes.json();
    const expiryMillis = verifyData.expiryTimeMillis;
    if (!expiryMillis) {
      logger.logError("google_lookup_without_expiry", {
        payment_state: verifyData.paymentState ?? null,
        acknowledgement_state: verifyData.acknowledgementState ?? null,
      });
      return {
        isValid: false,
        expiresAt: null,
        failure: { code: "no_matching_transaction", reason: "no expiryTimeMillis in response" },
      };
    }

    const expiresAt = new Date(Number(expiryMillis));
    logger.log("google_lookup_ok", {
      expires_at: expiresAt.toISOString(),
      payment_state: verifyData.paymentState ?? null,
      auto_renewing: verifyData.autoRenewing ?? null,
    });
    return { isValid: true, expiresAt };
  } catch (error) {
    logger.logError("google_verification_error", {
      error: error instanceof Error ? error.message : String(error),
    });
    return {
      isValid: false,
      expiresAt: null,
      failure: {
        code: "store_unreachable",
        reason: error instanceof Error ? error.message : String(error),
      },
    };
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

  const encode = (obj: any) => btoa(JSON.stringify(obj)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  const signingInput = `${encode(header)}.${encode(payload)}`;

  // Import the private key and sign
  const privateKey = serviceAccount.private_key.replace(/\\n/g, "\n");
  const keyData = privateKey.replace(/-----.*?-----/g, "").replace(/\s/g, "");
  const binaryKey = Uint8Array.from(atob(keyData), (c) => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryKey.buffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    new TextEncoder().encode(signingInput)
  );

  const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${signingInput}.${signatureBase64}`;
}

async function verifyAppleReceipt(
  receipt: string,
  productId: string,
  logger: Logger,
): Promise<StoreResult> {
  const sharedSecret = Deno.env.get("APPLE_SHARED_SECRET");
  if (!sharedSecret) {
    logger.logError("apple_config_missing", { secret: "APPLE_SHARED_SECRET" });
    return {
      isValid: false,
      expiresAt: null,
      failure: { code: "store_not_configured", reason: "APPLE_SHARED_SECRET missing" },
    };
  }

  try {
    const isSandbox = receipt.length < 1000; // Heuristic; prefer environment flag in production
    const verifyUrl = isSandbox
      ? "https://sandbox.itunes.apple.com/verifyReceipt"
      : "https://buy.itunes.apple.com/verifyReceipt";

    logger.log("apple_verify_started", { environment: isSandbox ? "sandbox" : "production" });

    const res = await fetch(verifyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "receipt-data": receipt, password: sharedSecret }),
    });

    const data = await res.json().catch(() => ({}));

    if (data.status !== 0 || !Array.isArray(data.latest_receipt_info)) {
      logger.logError("apple_verify_rejected", {
        http_status: res.status,
        apple_status: data.status ?? null,
        environment: data.environment ?? (isSandbox ? "sandbox" : "production"),
      });
      return {
        isValid: false,
        expiresAt: null,
        failure: { code: "store_rejected", reason: `apple status ${data.status ?? "unknown"}` },
      };
    }

    const matching = data.latest_receipt_info
      .filter((tx: any) => tx.product_id === productId)
      .sort((a: any, b: any) => Number(b.expires_date_ms) - Number(a.expires_date_ms))[0];

    if (!matching) {
      logger.logError("apple_no_matching_transaction", {
        product_id: productId,
        transaction_count: data.latest_receipt_info.length,
      });
      return {
        isValid: false,
        expiresAt: null,
        failure: {
          code: "no_matching_transaction",
          reason: `no transaction for ${productId}`,
        },
      };
    }

    const expiresAt = new Date(Number(matching.expires_date_ms));
    logger.log("apple_verify_ok", { expires_at: expiresAt.toISOString() });
    return { isValid: true, expiresAt };
  } catch (error) {
    logger.logError("apple_verification_error", {
      error: error instanceof Error ? error.message : String(error),
    });
    return {
      isValid: false,
      expiresAt: null,
      failure: {
        code: "store_unreachable",
        reason: error instanceof Error ? error.message : String(error),
      },
    };
  }
}
