import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization header");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("Unauthorized");

    // Fetch last 30 sessions
    const { data: sessions } = await supabase
      .from("breath_sessions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(30);

    // Fetch last 30 emotion records
    const { data: emotions } = await supabase
      .from("emotion_tracking")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(30);

    // Fetch streak data
    const { data: streaks } = await supabase
      .from("user_streaks")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!sessions?.length) {
      return new Response(JSON.stringify({
        insights: "You haven't completed any breathing sessions yet. Start your first session to begin building your wellness journal!",
        hasData: false,
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Build context summary for the AI
    const totalSessions = sessions.length;
    const totalBreaths = sessions.reduce((s, r) => s + r.breath_count, 0);
    const totalMinutes = Math.round(sessions.reduce((s, r) => s + r.total_duration, 0) / 60);
    const favExercise = mode(sessions.map(s => s.exercise_title).filter(Boolean) as string[]);
    const avgDuration = Math.round(sessions.reduce((s, r) => s + r.total_duration, 0) / totalSessions);

    let emotionSummary = "No emotion tracking data available.";
    if (emotions?.length) {
      const preVals = emotions.filter(e => e.pre_valence != null).map(e => e.pre_valence!);
      const postVals = emotions.filter(e => e.post_valence != null).map(e => e.post_valence!);
      const preAro = emotions.filter(e => e.pre_arousal != null).map(e => e.pre_arousal!);
      const postAro = emotions.filter(e => e.post_arousal != null).map(e => e.post_arousal!);
      const notes = emotions.filter(e => e.note).map(e => e.note).slice(0, 5);

      emotionSummary = `Emotion tracking (${emotions.length} records):
- Pre-session mood avg: ${avg(preVals).toFixed(1)}/7, Post-session mood avg: ${avg(postVals).toFixed(1)}/7
- Pre-session stress avg: ${avg(preAro).toFixed(0)}/100, Post-session stress avg: ${avg(postAro).toFixed(0)}/100
- Mood improvement: ${(avg(postVals) - avg(preVals)).toFixed(1)} points on average
- Stress reduction: ${(avg(preAro) - avg(postAro)).toFixed(0)} points on average
${notes.length ? `- Recent notes: ${notes.join("; ")}` : ""}`;
    }

    const streakInfo = streaks
      ? `Current login streak: ${streaks.current_login_streak} days, longest: ${streaks.longest_login_streak}. Current breath streak: ${streaks.current_breath_streak}, longest: ${streaks.longest_breath_streak}.`
      : "No streak data.";

    const prompt = `You are a compassionate wellness AI journal assistant for a breathing meditation app. Analyze this user's data and provide personalized insights.

USER DATA (last 30 sessions):
- Total sessions: ${totalSessions}, Total breaths: ${totalBreaths}, Total practice time: ${totalMinutes} min
- Average session duration: ${avgDuration} seconds
- Most practiced exercise: ${favExercise || "varies"}
- ${emotionSummary}
- ${streakInfo}

Provide a warm, encouraging wellness journal entry with:
1. **Your Breathing Pattern** — observations about their practice habits
2. **Emotional Impact** — how breathing affects their mood/stress (if emotion data exists)
3. **Personalized Tip** — one actionable suggestion based on their data
4. **Encouragement** — a brief motivational note

Keep it concise (under 250 words), warm, and personal. Use emojis sparingly. Format with markdown.`;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please try again later." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const insights = aiData.choices?.[0]?.message?.content || "Unable to generate insights at this time.";

    return new Response(JSON.stringify({
      insights,
      hasData: true,
      summary: { totalSessions, totalBreaths, totalMinutes, favExercise, avgDuration },
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("Wellness insights error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function avg(arr: number[]): number {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}

function mode(arr: string[]): string | null {
  if (!arr.length) return null;
  const freq: Record<string, number> = {};
  arr.forEach(v => { freq[v] = (freq[v] || 0) + 1; });
  return Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
}
