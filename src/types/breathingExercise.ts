
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
  parameterSuggestion?: string;
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
    parameterSuggestion: "For beginners: Try 3-4 seconds for each phase. For experienced: 4-6 seconds works well for deeper relaxation.",
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
    parameterSuggestion: "Classic 4-7-8 pattern is most effective. Beginners can try 3-5-6 if the full pattern feels too intense.",
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
    parameterSuggestion: "A 2:4 ratio (2s inhale, 4s exhale) is gentle for beginners. Advanced practitioners can try 3:6 or 4:8.",
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
    parameterSuggestion: "Start with 4:5 pattern (4s inhale, 5s exhale). As comfort increases, try 5:6 or 6:8 for deeper relaxation.",
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
    parameterSuggestion: "A gentle 4:6 ratio (4s inhale, 6s exhale) helps maintain focus. Adjust timing to match your natural rhythm.",
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
  {
    id: "lions-breath",
    title: "Lion's Breath",
    description: "Energizes the body",
    inhaleDuration: 3,
    firstHoldDuration: 0,
    exhaleDuration: 2,
    secondHoldDuration: 0,
    repetitions: 5,
    isCustom: false,
    detailedDescription: "A tension-releasing breath with a bold, open-mouth exhale and tongue extended. Releases jaw/face tightness, energizes the body, and resets mental fatigue.",
    whenToUse: [
      "Mid-day slump, screen fatigue, creative block",
      "After periods of clenching teeth, jaw tightness, or over-focus", 
      "As a short 'reset' before returning to calm practices"
    ],
    howItHelps: "Actively relaxes jaw, tongue, and facial muscles → reduces 'clench' and stress load. The forceful 'haaa' longer exhale encourages parasympathetic settling after the burst. Stimulates awareness and energizes when feeling dull or mentally stuck. Can support vocal ease and expression by reducing throat/jaw tension.",
    commonMistakes: [
      "Forcing or squeezing in the throat/neck (keep the channel open)",
      "Jaw locking or clenching during the exhale (allow it to release)",
      "Overdoing the number of rounds → dizziness or dryness in the throat"
    ],
    parametersNote: "Lion's breath, a type of pranayama (yogic breathing), is generally recommended for a few minutes at a time, with 5-10 repetitions per session. Practitioners often follow this with a few minutes of normal, deep breathing. It's best to start with a few rounds and gradually work up to a comfortable duration, avoiding overexertion",
    parameterSuggestion: "Keep it energizing: 3s inhale, 2s forceful exhale works well. Avoid longer timing to prevent strain.",
    stepByStepInstructions: [
      "Sit tall (kneeling or cross-legged) or stand; relax shoulders/neck.",
      "Inhale through the nose for 3–4 s; feel ribs expand.",
      "Exhale forcefully through the mouth with a 'haaa' sound:",
      "  • Mouth wide, tongue extended toward chin.",
      "  • Eyes can look up between the brows (optional).",
      "Let the face return to neutral. Pause 1–2 easy nasal breaths.",
      "Repeat for 5–8 rounds, then finish with a few calm nasal breaths."
    ],
    safetyNote: "Skip or reduce intensity if you have throat irritation, jaw/TMJ pain, recent dental work, or if dizziness appears. If you have cardiopulmonary conditions or are pregnant, avoid forceful breaths and follow clinician guidance."
  },
  {
    id: "alternate-nostril",
    title: "Alternate Nostril Breathing",
    description: "Balance and calming nervous system",
    inhaleDuration: 4,
    firstHoldDuration: 0,
    exhaleDuration: 4,
    secondHoldDuration: 0,
    repetitions: 12,
    isCustom: false,
    detailedDescription: "A balancing breath: inhale through one nostril, exhale through the other, then switch. Calms the nervous system, steadies attention, and balances left–right activation.",
    whenToUse: [
      "Pre-focus ritual (study, creative work)",
      "Transition moments (between tasks, before sleep wind-down)", 
      "After stimulating breathwork to re-center"
    ],
    howItHelps: "Encourages coherent, even breathing → reduces stress arousal and promotes calm focus. The alternating flow may help balance hemispheric activity and attention. Slows respiratory rate; can reduce perceived anxiety and mental 'noise.'",
    commonMistakes: [
      "Forcing the pace or holds; creating throat/jaw tension",
      "Pressing too hard on the nose; noisy breathing",
      "Losing the sequence (use mental cues: 'Left-in, Right-out, Right-in, Left-out')"
    ],
    parametersNote: "Alternate nostril breathing, also known as Nadi Shodhana, can be practiced for varying lengths of time depending on individual needs and comfort levels. A good starting point is 3-5 minutes, but it can be extended to 5-10 minutes or longer as you become more comfortable with the technique. Some practitioners find it beneficial to do 3-5 rounds, while others may prefer a set number of breaths on each side.",
    parameterSuggestion: "Equal timing works best: 4:4 (4s inhale, 4s exhale) creates balance. Beginners can start with 3:3.",
    stepByStepInstructions: [
      "Sit tall, relax jaw/shoulders. Form a gentle nasal seal with your right hand (Vishnu mudra): index & middle finger folded, thumb closes the right nostril; ring finger closes the left.",
      "Close right nostril with the thumb. Inhale left for 4.",
      "Switch: close left, exhale right for 4–6.",
      "Inhale right for 4.",
      "Switch: close right, exhale left for 4–6.",
      "That's one full cycle. Continue 6–8 cycles, keeping the breath quiet and even.",
      "Continue this breathing pattern for up to 5 minutes."
    ],
    safetyNote: "Skip or modify if you have acute nasal congestion, sinus infection, or discomfort. Avoid long holds if pregnant or with cardiopulmonary issues; follow clinician guidance. Stop if dizzy or light-headed."
  },
  {
    id: "equal-breathing",
    title: "Equal Breathing (Sama Vritti)",
    description: "Clarity and attention",
    inhaleDuration: 5,
    firstHoldDuration: 0,
    exhaleDuration: 5,
    secondHoldDuration: 0,
    repetitions: 12,
    isCustom: false,
    detailedDescription: "A smooth, even rhythm where the inhale and exhale are the same length. Balances the nervous system, steadies attention, and promotes calm clarity.",
    whenToUse: [
      "Centering before work, calls, or study",
      "Transition moments (after stress, between tasks)",
      "Any time you want calm focus without breath holds"
    ],
    howItHelps: "The 1:1 cadence stabilizes breathing rate and supports a parasympathetic shift. Smooth, even breaths reduce \"air hunger\" and settle reactivity. Builds awareness of breath mechanics without strain; great as a daily baseline.",
    commonMistakes: [
      "Forcing the breath or speeding up at the end of the count",
      "Breathing high into the chest; let the lower ribs/belly move",
      "Mouth breathing or noisy exhale (aim for quiet nasal flow)"
    ],
    safetyNote: "Generally safe. If you feel dizzy or uncomfortable, reduce the count (e.g., from 6–6 to 4–4) or pause and return to natural breathing.",
    stepByStepInstructions: [
      "Sit or stand tall; relax jaw/shoulders.",
      "Inhale through the nose for your chosen count (e.g., 5).",
      "Exhale through the nose for the same count (e.g., 5).",
      "Keep the breath quiet, smooth, and effortless.",
      "Continue for 8–12 cycles; finish with one easy, slightly longer exhale."
    ],
    parametersNote: "The recommended time for practicing Equal Breathing (Sama Vritti) is generally 5 to 10 minutes, but it can be adjusted based on individual needs and comfort levels. Beginners may start with shorter durations, like 2-3 minutes, and gradually increase the time as they become more comfortable. It's also beneficial to practice this technique for a few minutes before other practices like yoga asana or meditation.",
    parameterSuggestion: "Begin with 4–4 if you're new; progress to 5–5 or 6–6 as it feels natural. If you feel agitated, try slightly longer exhales for a few rounds (e.g., 4–5 or 5–6), then return to equal. Practise 2–5 minutes daily to make it your default calm rhythm."
  },
];
