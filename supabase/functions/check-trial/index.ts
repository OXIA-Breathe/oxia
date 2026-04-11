import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGINS = [
  "https://d3590b81-c814-4932-9e6d-4fbda085725b.lovable.app",
  "https://id-preview--d3590b81-c814-4932-9e6d-4fbda085725b.lovable.app",
];

const TRIAL_LIMIT = 10;

function getCorsHeaders(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.some(o => origin.startsWith(o.replace(/\/$/, '')));
  return {
    "Access-Control-Allow-Origin": allowed ? origin! : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
}

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get client IP from headers (Supabase edge functions provide this)
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || req.headers.get("cf-connecting-ip")
      || "unknown";

    // Get device fingerprint from request body (optional)
    let fingerprint = "default";
    let action = "check"; // "check" or "increment"
    
    if (req.method === "POST") {
      const body = await req.json();
      fingerprint = typeof body.fingerprint === "string" ? body.fingerprint.slice(0, 64) : "default";
      action = body.action === "increment" ? "increment" : "check";
    }

    // Look up existing trial record
    const { data: existing, error: selectError } = await supabase
      .from("anonymous_trials")
      .select("id, session_count")
      .eq("ip_address", ip)
      .eq("device_fingerprint", fingerprint)
      .maybeSingle();

    if (selectError) {
      throw selectError;
    }

    let sessionCount = existing?.session_count ?? 0;

    if (action === "increment") {
      if (sessionCount >= TRIAL_LIMIT) {
        return new Response(
          JSON.stringify({
            allowed: false,
            sessionCount,
            remaining: 0,
            limit: TRIAL_LIMIT,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
        );
      }

      if (existing) {
        const { error: updateError } = await supabase
          .from("anonymous_trials")
          .update({ session_count: sessionCount + 1 })
          .eq("id", existing.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("anonymous_trials")
          .insert({ ip_address: ip, device_fingerprint: fingerprint, session_count: 1 });
        if (insertError) throw insertError;
      }
      sessionCount += 1;
    }

    const remaining = Math.max(0, TRIAL_LIMIT - sessionCount);
    const allowed = sessionCount < TRIAL_LIMIT;

    return new Response(
      JSON.stringify({ allowed, sessionCount, remaining, limit: TRIAL_LIMIT }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
