
export interface BreathSession {
  id: string;
  date: string;
  repetitions: number;
  holdDuration: number;
  totalDuration: number;
  breathCount: number;
  exerciseTitle?: string;
}

export type BreathingPhase = "inhale" | "exhale" | "hold1" | "hold2" | "idle" | "countdown";
