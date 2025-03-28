
export interface BreathSession {
  id: string;
  date: string;
  repetitions: number;
  holdDuration: number;
  totalDuration: number;
  breathCount: number;
}

export interface BreathSettings {
  inhaleDuration: number;
  exhaleDuration: number;
  holdDuration: number;
  repetitions: number;
}
