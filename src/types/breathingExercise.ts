
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
  detailedDescription?: string;
  whenToUse?: string[];
  howItHelps?: string;
  commonMistakes?: string[];
  safetyNote?: string;
  stepByStepInstructions?: string[];
  parametersNote?: string;
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
    repetitions: 6,
    isCustom: false,
    detailedDescription: "Inhale, hold, exhale, hold — each for the same count. A steady, structured rhythm that calms the nervous system and restores focus.",
    whenToUse: [
      "Pre-meeting, public speaking, exam prep",
      "Stress spikes, jitters, overthinking", 
      "Quick reset to clarity"
    ],
    howItHelps: "Even, box-shaped cadence reduces breathing rate and promotes a parasympathetic shift. Brief holds improve CO₂ tolerance and create a sense of control under pressure.",
    commonMistakes: [
      "Forcing the holds / throat tension",
      "Lifting shoulders (chest breathing)",
      "Rushing counts; uneven box"
    ],
    parametersNote: "A typical box breathing session can range from one to five minutes for beginners, with experienced practitioners potentially extending sessions to 10-20 minutes or longer. Consistency is key, and sessions can be as short as a minute or two, especially when used to manage stress or anxiety throughout the day.",
    stepByStepInstructions: [
      "Sit or stand tall; relax jaw/shoulders.",
      "Inhale through the nose for 4.",
      "Hold gently for 4 (no strain).",
      "Exhale softly for 4 (nose or lips).",
      "Hold again for 4.",
      "Repeat, keeping the box smooth and unhurried."
    ],
    safetyNote: "Shorten holds or stop if you feel dizzy or uncomfortable. Follow clinician guidance if you have cardiopulmonary conditions."
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
    detailedDescription: "A calming technique designed to reduce anxiety and promote sleep.",
    whenToUse: ["Before sleep", "During anxiety", "To calm the mind"],
    howItHelps: "The extended exhale activates the parasympathetic nervous system, promoting relaxation and reducing stress.",
    commonMistakes: ["Holding breath too forcefully", "Not fully exhaling", "Rushing the sequence"],
    parametersNote: "Often practiced as 4 cycles at bedtime; increase gradually as comfort grows. Keep breath gentle and unforced.",
    stepByStepInstructions: [
      "Sit comfortably with your back straight.",
      "Inhale quietly through your nose for 4.",
      "Hold your breath for 7.",
      "Exhale completely through your mouth for 8.",
      "This completes one cycle.",
      "Repeat for 4 cycles total."
    ],
    safetyNote: "Stop if you feel lightheaded. Practice on an empty stomach for best results."
  },
];
