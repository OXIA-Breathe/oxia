
export interface EmotionData {
  preValence: number | null;
  preStress: number | null;
  postValence: number | null;
  postStress: number | null;
  note: string | null;
}

export interface BreathSession {
  id: string;
  date: string;
  repetitions: number;
  holdDuration: number;
  totalDuration: number;
  breathCount: number;
  exerciseTitle?: string;
  emotionData?: EmotionData;
}

export type BreathingPhase = "inhale" | "exhale" | "hold1" | "hold2" | "idle" | "countdown";
