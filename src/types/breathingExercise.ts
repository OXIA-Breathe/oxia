
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
  {
    id: "pursed-lip",
    title: "Pursed Lip Breathing",
    description: "Relaxation and focus",
    inhaleDuration: 3,
    firstHoldDuration: 1,
    exhaleDuration: 6,
    secondHoldDuration: 0,
    repetitions: 6,
    isCustom: false,
    detailedDescription: "Slow nasal inhale, then a long, easy exhale through gently pursed lips. Calms the breath, reduces tension, and eases shortness of breath.",
    whenToUse: [
      "Feeling tense, anxious, or short of breath",
      "During or after exertion (e.g., stairs, brisk walk)", 
      "Cool-down after other practices; moments of overwhelm"
    ],
    howItHelps: "Lengthens the exhale, that helps the nervous system settle (parasympathetic shift). Creates a gentle back-pressure in the airways and with that it can reduce air trapping and breathlessness. Lowers breathing rate, can improve perceived ease of breathing and focus.",
    commonMistakes: [
      "Blowing too hard (creates tension)",
      "Inhaling through the mouth",
      "Exhale too short; cheeks puffing; shoulders lifted"
    ],
    parametersNote: "Pursed lip breathing should be practiced 3-4 times a day for about 10 minutes each time, ideally when you are not short of breath. It's a technique to help relieve shortness of breath and can be incorporated into your routine when you feel comfortable. When experiencing shortness of breath, you can use pursed lip breathing as needed to help regulate your breath and find relief.",
    stepByStepInstructions: [
      "Sit or stand tall; relax jaw/shoulders.",
      "Inhale quietly through the nose for 2–3 seconds.",
      "Purse lips softly (as if to whistle).",
      "Exhale slowly and steadily for 4–6 seconds; don't force.",
      "Keep belly soft; avoid puffing cheeks. Repeat."
    ],
    safetyNote: "Stop if dizzy, light-headed, chest pain, or worsening breathlessness. If you have a lung/heart condition, follow your clinician's guidance."
  },
  {
    id: "diaphragmatic-breathing",
    title: "Diaphragmatic (Belly) Breathing",
    description: "Reduces sympathetic arousal",
    inhaleDuration: 4,
    firstHoldDuration: 1,
    exhaleDuration: 5,
    secondHoldDuration: 0,
    repetitions: 10,
    isCustom: false,
    detailedDescription: "Slow, gentle nasal breathing that expands the belly and lower ribs on the inhale and softens on the exhale. Trains your primary breathing muscle (the diaphragm) for calmer, more efficient breath.",
    whenToUse: [
      "Any time you feel tense or 'breathing high in the chest'",
      "Pre-sleep wind-down, post-stress reset, or as a baseline daily practice", 
      "Helpful for anxiety, digestive tension, or voice prep"
    ],
    howItHelps: "Encourages lower, slower breathing → reduces sympathetic arousal, supports calm focus. Improves diaphragm mechanics, reduces shallow chest breathing and shoulder tension. Can enhance oxygen–CO₂ balance and perceived breathing ease over time.",
    commonMistakes: [
      "Lifting shoulders / breathing high into the chest",
      "Forcing the belly out or sucking it in (keep it easy)",
      "Noisy mouth breathing; rushing the exhale"
    ],
    parametersNote: "For optimal benefit, diaphragmatic breathing is recommended for 10-20 minutes daily, practiced in several short sessions or one longer session. Beginners may start with shorter durations, such as 5-10 minutes, several times a day, gradually increasing the time as they become more comfortable.",
    stepByStepInstructions: [
      "Sit or lie comfortably; relax jaw/shoulders. Place one hand on the belly, one on the upper chest.",
      "Inhale through the nose for 4–5 s: feel the belly and lower ribs expand outward into your hand. Upper chest stays relatively quiet.",
      "Optional gentle hold for 0–1 s (no strain).",
      "Exhale slowly for 5–6 s; feel belly soften back toward the spine.",
      "Keep the breath quiet and smooth; repeat 6–10 cycles.",
      "Mindful Practice: Focus on the sensation of your stomach rising and falling as you breathe, keeping your chest relatively still."
    ],
    safetyNote: "If you feel dizzy or uncomfortable, pause and return to normal breathing. If you have medical concerns, follow your clinician's guidance."
  },
  {
    id: "breathe-focus",
    title: "Breath Focus Technique",
    description: "Clarity and focus",
    inhaleDuration: 4,
    firstHoldDuration: 0,
    exhaleDuration: 6,
    secondHoldDuration: 0,
    repetitions: 10,
    isCustom: false,
    detailedDescription: "A mindful practice of gently placing attention on the breath—often paired with anchor words (e.g., 'in… out…') or imagery—to cultivate calm, clarity, and steady focus.",
    whenToUse: [
      "Before deep work or study; during stress or overwhelm",
      "As a daily centering practice (2–10 min)", 
      "Any time you want clarity without a strict breathing pattern"
    ],
    howItHelps: "Trains attentional control: noticing the breath, returning softly when the mind wanders. Engages the parasympathetic response (especially with a slightly longer exhale). Builds non-reactivity to thoughts and sensations; supports emotional regulation.",
    commonMistakes: [
      "Forcing the breath or 'doing it right'",
      "Trying to push thoughts away (just notice and return).",
      "Mouth breathing noisily; shoulders tense."
    ],
    parametersNote: "For breath focus techniques, a good starting point is 5-10 minutes a day. You can gradually increase the duration to 20 minutes or longer as you become more comfortable and find it beneficial. It's also recommended to practice it several times a day if possible.",
    stepByStepInstructions: [
      "Sit tall or lie comfortably; relax jaw/shoulders.",
      "Notice the natural breath (temperature at the nostrils, belly/ rib movement).",
      "Choose an anchor: words ('in… out…', 'calm… clear…'), a count (1–4), or imagery (wave/tide).",
      "Inhale gently; silently repeat your anchor (e.g., 'in… calm').",
      "Exhale slowly; repeat the pair (e.g., 'out… clear').",
      "When the mind wanders, notice–name–return (e.g., 'thinking… back to breath').",
      "Continue for the set cycles or time; finish with one longer, easy exhale."
    ],
    safetyNote: "Generally safe. If you feel dizzy or uncomfortable, return to natural breathing or pause. Follow clinician guidance if you have medical concerns."
  },
];
