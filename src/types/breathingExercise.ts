
export interface BreathingExercise {
  id: string;
  title: string;
  description?: string;
  inhaleDuration: number;
  firstHoldDuration: number;
  exhaleDuration: number;
  secondHoldDuration: number;
  repetitions: number;
  isCustom: boolean;
}

export const defaultBreathingExercises: BreathingExercise[] = [
  {
    id: "box-breathing",
    title: "Box Breathing",
    description: "Calm and focus",
    inhaleDuration: 4,
    firstHoldDuration: 4,
    exhaleDuration: 4,
    secondHoldDuration: 4,
    repetitions: 20,
    isCustom: false,
  },
  {
    id: "4-7-8-breathing",
    title: "4-7-8 Breathing",
    description: "Sleeping and anxiety",
    inhaleDuration: 4,
    firstHoldDuration: 7,
    exhaleDuration: 8,
    secondHoldDuration: 0,
    repetitions: 20,
    isCustom: false,
  },
];
