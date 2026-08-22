import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGIN = "https://d3590b81-c814-4932-9e6d-4fbda085725b.lovable.app";

const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PACKAGE_NAME = "app.lovable.d3590b81c81449329e6d4fbda085725b";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - No valid authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { platform, productId, transactionId, receipt, signature } = body;

    if (!platform || !productId || !transactionId || !receipt) {
      return new Response(
        JSON.stringify({ error: "Missing required purchase fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let isValid = false;
    let expiresAt: Date | null = null;
    let plan: "monthly" | "yearly" | null = null;

    if (platform === "android") {
      const result = await verifyGooglePlayPurchase(productId, receipt);
      isValid = result.isValid;
      expiresAt = result.expiresAt;
      plan = mapProductToPlan(productId);
    } else if (platform === "ios") {
      const result = await verifyAppleReceipt(receipt, productId);
      isValid = result.isValid;
      expiresAt = result.expiresAt;
      plan = mapProductToPlan(productId);
    } else {
      return new Response(
        JSON.stringify({ error: "Unsupported platform" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!isValid || !expiresAt || !plan) {
      return new Response(
        JSON.stringify({ error: "Purchase verification failed" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update profile using service role (bypasses RLS and subscription field protection)
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
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
      console.error("Profile update error:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to activate subscription" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, plan, expiresAt: expiresAt.toISOString() }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("verify-purchase error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function mapProductToPlan(productId: string): "monthly" | "yearly" | null {
  if (productId.includes("monthly")) return "monthly";
  if (productId.includes("yearly")) return "yearly";
  return null;
}

async function verifyGooglePlayPurchase(productId: string, purchaseToken: string): Promise<{ isValid: boolean; expiresAt: Date | null }> {
  const serviceAccountJson = Deno.env.get("GOOGLE_PLAY_SERVICE_ACCOUNT_JSON");
  if (!serviceAccountJson) {
    console.error("GOOGLE_PLAY_SERVICE_ACCOUNT_JSON not configured");
    return { isValid: false, expiresAt: null };
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

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      console.error("Google OAuth failed:", tokenData);
      return { isValid: false, expiresAt: null };
    }

    const url = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${PACKAGE_NAME}/purchases/subscriptions/${productId}/tokens/${purchaseToken}`;
    const verifyRes = await fetch(url, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!verifyRes.ok) {
      console.error("Google Play verification failed:", await verifyRes.text());
      return { isValid: false, expiresAt: null };
    }

    const verifyData = await verifyRes.json();
    const expiryMillis = verifyData.expiryTimeMillis;
    if (!expiryMillis) {
      return { isValid: false, expiresAt: null };
    }

    return { isValid: true, expiresAt: new Date(Number(expiryMillis)) };
  } catch (error) {
    console.error("Google Play verification error:", error);
    return { isValid: false, expiresAt: null };
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

async function verifyAppleReceipt(receipt: string, productId: string): Promise<{ isValid: boolean; expiresAt: Date | null }> {
  const sharedSecret = Deno.env.get("APPLE_SHARED_SECRET");
  if (!sharedSecret) {
    console.error("APPLE_SHARED_SECRET not configured");
    return { isValid: false, expiresAt: null };
  }

  try {
    const isSandbox = receipt.length < 1000; // Heuristic; prefer environment flag in production
    const verifyUrl = isSandbox
      ? "https://sandbox.itunes.apple.com/verifyReceipt"
      : "https://buy.itunes.apple.com/verifyReceipt";

    const res = await fetch(verifyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "receipt-data": receipt, password: sharedSecret }),
    });

    const data = await res.json();

    if (data.status !== 0 || !Array.isArray(data.latest_receipt_info)) {
      console.error("Apple verification failed:", data);
      return { isValid: false, expiresAt: null };
    }

    const matching = data.latest_receipt_info
      .filter((tx: any) => tx.product_id === productId)
      .sort((a: any, b: any) => Number(b.expires_date_ms) - Number(a.expires_date_ms))[0];

    if (!matching) {
      return { isValid: false, expiresAt: null };
    }

    return {
      isValid: true,
      expiresAt: new Date(Number(matching.expires_date_ms)),
    };
  } catch (error) {
    console.error("Apple verification error:", error);
    return { isValid: false, expiresAt: null };
  }
}
