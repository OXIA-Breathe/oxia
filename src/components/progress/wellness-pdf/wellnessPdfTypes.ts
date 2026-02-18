
import { BreathSession } from "@/types/breath";
import { ExerciseEffectivenessData } from "@/hooks/useExerciseEffectiveness";

export interface WellnessPDFData {
  sessions: BreathSession[];
  exerciseEffectiveness: ExerciseEffectivenessData[];
  emotionRecords: WellnessEmotionRecord[];
  streakData: {
    currentBreathStreak: number;
    longestBreathStreak: number;
    currentLoginStreak: number;
  } | null;
  reportMonth: string; // e.g. "January 2026"
  reportPeriod: { from: Date; to: Date };
  userName?: string;
}

export interface WellnessEmotionRecord {
  created_at: string;
  pre_valence: number | null;
  post_valence: number | null;
  pre_arousal: number | null;
  post_arousal: number | null;
}
