
export interface BreathSession {
  id: string;
  date: string;
  repetitions: number;
  holdDuration: number;
  totalDuration: number;
  breathCount: number;
  exerciseTitle?: string;
}
