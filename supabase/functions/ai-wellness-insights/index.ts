import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MOOD_LABELS: Record<number, string> = {
  1: "Irritated",
  2: "Sad",
  3: "Tired",
  4: "Anxious",
  5: "Calm",
  6: "Happy",
  7: "Excited",
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

    // Define 30-day period
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const periodStr = `${thirtyDaysAgo.toLocaleDateString("en-GB", { day: "numeric", month: "long" })} – ${now.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`;

    // Fetch last 30 days of sessions
    const { data: sessions } = await supabase
      .from("breath_sessions")
      .select("*")
      .eq("user_id", user.id)
      .gte("created_at", thirtyDaysAgo.toISOString())
      .order("created_at", { ascending: false });

    if (!sessions?.length) {
      return new Response(JSON.stringify({
        sections: null,
        hasData: false,
        message: "You haven't completed any breathing sessions in the last 30 days. Start practicing to build your wellness reflection.",
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Fetch emotion data for same period
    const { data: emotions } = await supabase
      .from("emotion_tracking")
      .select("*")
      .eq("user_id", user.id)
      .gte("created_at", thirtyDaysAgo.toISOString())
      .order("created_at", { ascending: false });

    // Fetch streak data
    const { data: streaks } = await supabase
      .from("user_streaks")
      .select("*")
      .eq("user_id", user.id)
      .single();

    // Fetch daily activity for consistency days
    const { data: dailyActivity } = await supabase
      .from("daily_activity")
      .select("*")
      .eq("user_id", user.id)
      .eq("completed_breath_session", true)
      .gte("date", thirtyDaysAgo.toISOString().split("T")[0]);

    // ── Compute stats ──────────────────────────────────────────────
    const totalSessions = sessions.length;
    const totalMinutes = Math.round(sessions.reduce((s, r) => s + r.total_duration, 0) / 60);
    const favExercise = mode(sessions.map((s) => s.exercise_title).filter(Boolean) as string[]) ?? "Various";
    const consistencyDays = dailyActivity?.length ?? 0;
    const longestStreak = streaks?.longest_breath_streak ?? 0;

    // Stress stats
    let avgStressBefore: number | null = null;
    let avgStressAfter: number | null = null;
    let stressChangePct: number | null = null;

    if (emotions?.length) {
      const preAro = emotions.filter((e) => e.pre_arousal != null).map((e) => e.pre_arousal!);
      const postAro = emotions.filter((e) => e.post_arousal != null).map((e) => e.post_arousal!);
      if (preAro.length) avgStressBefore = Math.round(avg(preAro));
      if (postAro.length) avgStressAfter = Math.round(avg(postAro));
      if (avgStressBefore != null && avgStressAfter != null && avgStressBefore > 0) {
        stressChangePct = Math.round(((avgStressBefore - avgStressAfter) / avgStressBefore) * 100);
      }
    }

    // Mood stats
    let mostCommonMoodBefore: string | null = null;
    let mostCommonMoodAfter: string | null = null;

    if (emotions?.length) {
      const preVals = emotions.filter((e) => e.pre_valence != null).map((e) => e.pre_valence!);
      const postVals = emotions.filter((e) => e.post_valence != null).map((e) => e.post_valence!);
      const preModeVal = modeNum(preVals);
      const postModeVal = modeNum(postVals);
      if (preModeVal != null) mostCommonMoodBefore = MOOD_LABELS[preModeVal] ?? null;
      if (postModeVal != null) mostCommonMoodAfter = MOOD_LABELS[postModeVal] ?? null;
    }

    // ── Build prompt using the template ───────────────────────────
    const dataBlock = `Period: ${periodStr}
Total sessions: ${totalSessions}
Total minutes practiced: ${totalMinutes}
Most used exercise: ${favExercise}
Average stress before sessions: ${avgStressBefore != null ? avgStressBefore : "Not enough data"}
Average stress after sessions: ${avgStressAfter != null ? avgStressAfter : "Not enough data"}
Stress change percent: ${stressChangePct != null ? `${stressChangePct}%` : "Not enough data"}
Most common mood before: ${mostCommonMoodBefore ?? "Not enough data"}
Most common mood after: ${mostCommonMoodAfter ?? "Not enough data"}
Consistency days: ${consistencyDays}
Longest streak: ${longestStreak} days`;

    const systemPrompt = `You are an AI reflection assistant inside the OXIA breathing app.

Your role is to generate structured, neutral, and data-based reflections.

You do not diagnose, treat, or provide medical or psychological advice.

You only summarize observable patterns from the provided breathing and emotional tracking data.

Tone:
- Calm
- Professional
- Supportive
- Non-judgmental
- Non-dramatic
- No exaggeration

Rules:
- Do not speculate beyond the data.
- Do not use medical language.
- Do not promise outcomes.
- Do not say "this means you have anxiety" or similar.
- Keep each section between 30–45 words.
- Use simple, grounded language.
- If data is missing for a section (e.g. "Not enough data"), acknowledge it briefly and encourage tracking.`;

    const userPrompt = `Generate a structured reflection based on the following data:

${dataBlock}

Structure the output in exactly 4 sections using the tool provided.`;

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
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_wellness_reflection",
              description: "Return the 4-section wellness reflection as structured data.",
              parameters: {
                type: "object",
                properties: {
                  practiceOverview: {
                    type: "string",
                    description: "A 30–45 word summary of the user's practice habits over the period.",
                  },
                  stressPattern: {
                    type: "string",
                    description: "A 30–45 word neutral summary of stress levels before and after sessions.",
                  },
                  emotionalShift: {
                    type: "string",
                    description: "A 30–45 word neutral description of emotional patterns observed.",
                  },
                  consistencyInsight: {
                    type: "string",
                    description: "A 30–45 word reflection on the user's consistency and streaks.",
                  },
                },
                required: ["practiceOverview", "stressPattern", "emotionalShift", "consistencyInsight"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_wellness_reflection" } },
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
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall) {
      throw new Error("No structured response from AI");
    }

    const sections = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify({
      hasData: true,
      sections,
      summary: {
        totalSessions,
        totalMinutes,
        favExercise,
        consistencyDays,
        longestStreak,
        avgStressBefore,
        avgStressAfter,
        stressChangePct,
        mostCommonMoodBefore,
        mostCommonMoodAfter,
        period: periodStr,
      },
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
  arr.forEach((v) => { freq[v] = (freq[v] || 0) + 1; });
  return Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
}

function modeNum(arr: number[]): number | null {
  if (!arr.length) return null;
  const freq: Record<number, number> = {};
  arr.forEach((v) => { freq[v] = (freq[v] || 0) + 1; });
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  return parseInt(sorted[0][0]);
}
