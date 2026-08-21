import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { TimeFilter, DateRange, getDateRange } from "./useEmotionalStatistics";
import { usePremiumStatus } from "./usePremiumStatus";
import { format, parseISO } from "date-fns";

export interface ExerciseEffectivenessData {
  exerciseTitle: string;
  avgStressReduction: number;        // positive = stress went down (good)
  avgStressReductionPercent: number; // percentage reduction
  avgPreStress: number;
  avgPostStress: number;
  sessionCount: number;
}

export const useExerciseEffectiveness = (filter: TimeFilter, customRange?: DateRange) => {
  const { user } = useAuth();
  const { isPremium, isLoading: isPremiumLoading } = usePremiumStatus();

  const { data, isLoading } = useQuery({
    queryKey: ["exerciseEffectiveness", user?.id, filter, customRange?.start?.toISOString(), customRange?.end?.toISOString()],
    queryFn: async () => {
      if (!user) return [];

      const dateRange = getDateRange(filter, customRange);

      // Fetch emotion_tracking joined with breath_sessions via session_id
      const { data: emotionData, error } = await supabase
        .from("emotion_tracking")
        .select(`
          id,
          created_at,
          pre_arousal,
          post_arousal,
          session_id,
          breath_sessions!inner(exercise_title)
        `)
        .eq("user_id", user.id)
        .not("pre_arousal", "is", null)
        .not("post_arousal", "is", null)
        .not("session_id", "is", null)
        .gte("created_at", dateRange.start.toISOString())
        .lte("created_at", dateRange.end.toISOString());

      if (error) throw error;
      if (!emotionData || emotionData.length === 0) return [];

      // Group by exercise title
      const grouped: Record<string, { preSum: number; postSum: number; count: number }> = {};

      emotionData.forEach((record: any) => {
        const title = record.breath_sessions?.exercise_title || "Breathing Exercise";
        if (!grouped[title]) {
          grouped[title] = { preSum: 0, postSum: 0, count: 0 };
        }
        grouped[title].preSum += record.pre_arousal;
        grouped[title].postSum += record.post_arousal;
        grouped[title].count++;
      });

      // Build ranked list — require minimum 2 sessions
      const results: ExerciseEffectivenessData[] = Object.entries(grouped)
        .filter(([, g]) => g.count >= 2)
        .map(([title, g]) => {
          const avgPre = g.preSum / g.count;
          const avgPost = g.postSum / g.count;
          const reduction = avgPre - avgPost; // positive = good
          const reductionPercent = avgPre > 0 ? (reduction / avgPre) * 100 : 0;
          return {
            exerciseTitle: title,
            avgStressReduction: Math.round(reduction * 10) / 10,
            avgStressReductionPercent: Math.round(reductionPercent * 10) / 10,
            avgPreStress: Math.round(avgPre),
            avgPostStress: Math.round(avgPost),
            sessionCount: g.count,
          };
        })
        .sort((a, b) => b.avgStressReductionPercent - a.avgStressReductionPercent);

      return results;
    },
    enabled: !!user,
  });

  // Emotion tracking preference (only meaningful for premium users)
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("emotion_tracking_enabled")
        .eq("id", user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  return {
    data: data || [],
    isLoading: isLoading || isPremiumLoading,
    isPremium,
    isTrackingEnabled: isPremium && (profile?.emotion_tracking_enabled ?? false),
    hasData: (data?.length ?? 0) > 0,
  };
};
