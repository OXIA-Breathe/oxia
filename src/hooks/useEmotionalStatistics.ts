import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { usePremiumStatus } from "./usePremiumStatus";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear, format, parseISO, isWithinInterval } from "date-fns";

export type TimeFilter = "weekly" | "monthly" | "quarterly" | "yearly" | "all-time" | "custom";

export interface DateRange {
  start: Date;
  end: Date;
}

export interface EmotionRecord {
  id: string;
  created_at: string;
  pre_valence: number | null;
  post_valence: number | null;
  pre_arousal: number | null;
  post_arousal: number | null;
}

export interface MoodCount {
  mood: number;
  label: string;
  count: number;
  color: string;
}

export interface DailyStressData {
  date: string;
  preBefore: number;
  postAfter: number;
}

export const getDateRange = (filter: TimeFilter, customRange?: DateRange): DateRange => {
  const now = new Date();
  
  switch (filter) {
    case "weekly":
      return { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) };
    case "monthly":
      return { start: startOfMonth(now), end: endOfMonth(now) };
    case "quarterly":
      return { start: startOfQuarter(now), end: endOfQuarter(now) };
    case "yearly":
      return { start: startOfYear(now), end: endOfYear(now) };
    case "custom":
      return customRange || { start: now, end: now };
    case "all-time":
    default:
      return { start: new Date(2020, 0, 1), end: now };
  }
};

export const useEmotionalStatistics = (filter: TimeFilter, customRange?: DateRange) => {
  const { user } = useAuth();
  const { isPremium, isEmotionTrackingEnabled, isLoading: isPremiumLoading } = usePremiumStatus();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["emotionalStatistics", user?.id, filter, customRange?.start?.toISOString(), customRange?.end?.toISOString()],
    queryFn: async () => {
      if (!user) return null;
      
      const dateRange = getDateRange(filter, customRange);
      
      const { data: records, error } = await supabase
        .from("emotion_tracking")
        .select("id, created_at, pre_valence, post_valence, pre_arousal, post_arousal")
        .eq("user_id", user.id)
        .gte("created_at", dateRange.start.toISOString())
        .lte("created_at", dateRange.end.toISOString())
        .order("created_at", { ascending: true });
      
      if (error) throw error;
      
      return records as EmotionRecord[];
    },
    enabled: !!user
  });

  // Calculate unique days with data
  const uniqueDays = new Set(
    data?.map(record => format(parseISO(record.created_at), "yyyy-MM-dd")) || []
  );
  
  // Only require data to exist - no minimum days requirement
  const hasEnoughData = uniqueDays.size > 0;

  return {
    records: data || [],
    isLoading: isLoading || isPremiumLoading,
    error,
    hasEnoughData,
    uniqueDaysCount: uniqueDays.size,
    isTrackingEnabled: isPremium && isEmotionTrackingEnabled,
    isPremium
  };
};

// Process mood data for pie charts - using soft pastel colors
export const processMoodData = (records: EmotionRecord[], type: "pre" | "post") => {
  const moodLabels: Record<number, { label: string; color: string }> = {
    1: { label: "Irritated", color: "hsl(0, 65%, 75%)" },
    2: { label: "Sad", color: "hsl(210, 55%, 70%)" },
    3: { label: "Tired", color: "hsl(200, 45%, 72%)" },
    4: { label: "Anxious", color: "hsl(270, 45%, 75%)" },
    5: { label: "Calm", color: "hsl(120, 40%, 70%)" },
    6: { label: "Happy", color: "hsl(45, 75%, 72%)" },
    7: { label: "Excited", color: "hsl(15, 70%, 75%)" },
  };

  const counts: Record<number, number> = {};
  
  records.forEach(record => {
    const value = type === "pre" ? record.pre_valence : record.post_valence;
    if (value !== null) {
      counts[value] = (counts[value] || 0) + 1;
    }
  });

  return Object.entries(counts).map(([mood, count]) => ({
    mood: parseInt(mood),
    label: moodLabels[parseInt(mood)]?.label || "Unknown",
    count,
    color: moodLabels[parseInt(mood)]?.color || "hsl(0, 0%, 50%)",
  }));
};

// Process stress data for line chart - aggregate by day
export const processStressData = (records: EmotionRecord[]): DailyStressData[] => {
  const dailyData: Record<string, { preSum: number; preCount: number; postSum: number; postCount: number }> = {};
  
  records.forEach(record => {
    const date = format(parseISO(record.created_at), "yyyy-MM-dd");
    
    if (!dailyData[date]) {
      dailyData[date] = { preSum: 0, preCount: 0, postSum: 0, postCount: 0 };
    }
    
    if (record.pre_arousal !== null) {
      dailyData[date].preSum += record.pre_arousal;
      dailyData[date].preCount++;
    }
    
    if (record.post_arousal !== null) {
      dailyData[date].postSum += record.post_arousal;
      dailyData[date].postCount++;
    }
  });

  return Object.entries(dailyData)
    .map(([date, data]) => ({
      date,
      preBefore: data.preCount > 0 ? Math.round(data.preSum / data.preCount) : 0,
      postAfter: data.postCount > 0 ? Math.round(data.postSum / data.postCount) : 0,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

// Calculate summary statistics — only sessions with BOTH check-ins count ("paired").
export const calculateMoodSummary = (records: EmotionRecord[]) => {
  const paired = records.filter(r => r.pre_valence !== null && r.post_valence !== null);
  const transitions: Record<string, { from: number; to: number; count: number }> = {};
  for (const r of paired) {
    const key = `${r.pre_valence}->${r.post_valence}`;
    transitions[key] = transitions[key] || { from: r.pre_valence as number, to: r.post_valence as number, count: 0 };
    transitions[key].count++;
  }
  const changed = Object.values(transitions).filter(t => t.from !== t.to).sort((a, b) => b.count - a.count);
  const topTransition = changed[0] ?? null;
  return {
    pairedCount: paired.length,
    missingCount: records.length - paired.length,
    unchangedCount: paired.filter(r => r.pre_valence === r.post_valence).length,
    topTransition,
  };
};

export const calculateStressSummary = (records: EmotionRecord[]) => {
  const paired = records.filter(r => r.pre_arousal !== null && r.post_arousal !== null);
  if (paired.length === 0) {
    return { pairedCount: 0, missingCount: records.length, avgPreStress: 0, avgPostStress: 0, avgChange: 0, lowerCount: 0, higherCount: 0, unchangedCount: 0 };
  }
  const avgPreStress = paired.reduce((a, r) => a + (r.pre_arousal as number), 0) / paired.length;
  const avgPostStress = paired.reduce((a, r) => a + (r.post_arousal as number), 0) / paired.length;
  return {
    pairedCount: paired.length,
    missingCount: records.length - paired.length,
    avgPreStress,
    avgPostStress,
    avgChange: avgPostStress - avgPreStress, // negative = reported stress went down
    lowerCount: paired.filter(r => (r.post_arousal as number) < (r.pre_arousal as number)).length,
    higherCount: paired.filter(r => (r.post_arousal as number) > (r.pre_arousal as number)).length,
    unchangedCount: paired.filter(r => r.post_arousal === r.pre_arousal).length,
  };
};
