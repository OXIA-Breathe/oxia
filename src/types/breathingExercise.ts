
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
    repetitions: 15,
    isCustom: false,
    detailedDescription: "Inhale, hold, exhale, hold — each for the same count. A steady, structured rhythm that calms the nervous system, helps to relax the body, clear the mind and improve focus.\n\nPeople with high stress jobs, such as soldiers and police officers, often use box breathing when their bodies are in fight, flight, or freeze mode. This technique is also relevant for anyone interested in recentering themselves or improving their concentration.",
    whenToUse: [
      "Pre-meeting, public speaking, exam prep",
      "Stress spikes, jitters, overthinking", 
      "Quick reset to clarity"
    ],
    howItHelps: "Research has shown that deep breathing techniques significantly reduce the production of hormones associated with stress, such as cortisol. It also can be helpful in the reduction of anxiety, depression and stress.\n\nWhen we are anxious, we breathe shallowly and quickly, which actually creates more anxiety. Using breathwork, we activate parasympathetic nervous system, where our body rests and digest.",
    commonMistakes: [
      "Forcing the holds / throat tension",
      "Lifting shoulders (chest breathing)",
      "Rushing counts; uneven box",
      "Not being conscious of how the air fills lungs and stomach"
    ],
    parametersNote: "Ideally, the session should be 4 minutes, or until calm returns. If it is challenging, shorten the period to 2-3 minutes. If experienced, you can potentially extend the sessions to 10-20 minutes or longer.\n\nConsistency is key, and sessions can be as short as a minute or two, especially when used to manage stress or anxiety throughout the day.",
    parameterSuggestion: "For beginners: Try 3-4 seconds for each phase. For experienced: 4-6 seconds works well for deeper relaxation.",
    stepByStepInstructions: [
      "Sit with your back supported, comfortably; relax jaw/shoulders.",
      "Inhale through the nose for 4.",
      "Hold gently for 4 (no strain).",
      "Exhale softly for 4 (nose or lips).",
      "Hold again for 4.",
      "Repeat, keeping the box smooth and unhurried."
    ],
    safetyNote: "Shorten holds or stop if you feel dizzy or uncomfortable. Follow doctor's guidance if you have cardiopulmonary conditions, you are pregnant or have high blood pressure."
  },
  {
    id: "4-7-8-breathing",
    title: "4-7-8 Breathing",
    description: "Sleeping and anxiety",
    inhaleDuration: 4,
    firstHoldDuration: 7,
    exhaleDuration: 8,
    secondHoldDuration: 0,
    repetitions: 4,
    isCustom: false,
    detailedDescription: "A calming technique designed to help us focus our mind and our body away from worries and repetitive thoughts. That way help us by reducing anxiety and promote sleep.\n\nAlso, according to a small study from 2022, practicing 4-7-8 breathing may improve heart rate variability and blood pressure in young adults. The researchers also suggest that it could be beneficial to people living with cardiovascular or pulmonary disease. It could potentially reduce your heart's workload and increase blood oxygen levels.",
    whenToUse: ["Before sleep", "During anxiety", "To calm the mind"],
    howItHelps: "Deep and mindful breathing activates what Dr. Herbert Benson called the relaxation response - the body's natural antidote to chronic stress. By calming the fight-or-flight system, it helps lower blood pressure, reduce anxiety, and support immune function.\n\nRegular practice improves sleep, focus, and emotional balance, while also easing pain and tension. In short, slow, conscious breathing restores both body and mind to a state of calm, clarity, and resilience.",
    commonMistakes: ["Holding breath too forcefully", "Overthinking about the technique", "Rushing the sequence"],
    parametersNote: "Often practiced as 4 cycles at bedtime; increase gradually as comfort grows. Keep breath gentle and unforced. Don't overthink. No one expects you to master your breath on the first try (or even the second or the 20th), so keep on practicing and consistency is key.",
    parameterSuggestion: "Classic 4-7-8 pattern is most effective. Beginners can try 3-5-6 if the full pattern feels too intense.",
    stepByStepInstructions: [
      "Sit comfortably with your back straight or lie down (especially if you want to fall asleep).",
      "Inhale quietly through your nose for 4.",
      "Hold your breath for 7.",
      "Exhale completely through your mouth for 8.",
      "This completes one cycle.",
      "Repeat for 4 cycles total."
    ],
    safetyNote: "Stop and take a break, if you feel lightheaded. Practice on an empty stomach for best results."
  },
  {
    id: "pursed-lip",
    title: "Pursed Lip Breathing",
    description: "Calming & stabilizing",
    inhaleDuration: 3,
    firstHoldDuration: 1,
    exhaleDuration: 6,
    secondHoldDuration: 0,
    repetitions: 30,
    isCustom: false,
    detailedDescription: "Pursed lip breathing is a slow breathing technique that enables a person to control how much air enters and leaves their lungs. Calms the breath, reduces tension, and eases shortness of breath.\n\nIn long term, it may strengthen the lungs and improve their efficiency. That way, it may help people with lung conditions, namely chronic obstructive pulmonary disease (COPD).",
    whenToUse: [
      "Feeling tense, anxious, or short of breath",
      "During or after exertion (e.g., stairs, brisk walk)",
      "Inability to take a deep breath"
    ],
    howItHelps: "Pursed-lip breathing is a simple yet powerful technique that slows your breathing, improves oxygen exchange, and helps you feel more in control. By exhaling slowly through lightly pursed lips, you create gentle back pressure in the lungs (PEEP), which keeps airways open longer and allows trapped carbon dioxide to escape.\n\nThis method is especially helpful for people with COPD or asthma, as it eases shortness of breath, increases oxygen levels, and enhances exercise endurance. Beyond physical benefits, it also calms the nervous system, reduces stress and anxiety, and restores a steady rhythm to your breath - bringing both body and mind into balance.",
    commonMistakes: [
      "Blowing too hard (creates tension)",
      "Inhaling through the mouth",
      "Exhale too short; cheeks puffing; shoulders lifted"
    ],
    parametersNote: "Pursed lip breathing should be practiced 3-4 times a day for about 10 minutes each time, ideally when you are not short of breath. It's a technique to help relieve shortness of breath and can be incorporated into your routine when you feel comfortable. When experiencing shortness of breath, you can use pursed lip breathing as needed to help regulate your breath and find relief.\n\nIt may take some time before the technique feels natural. However, with regular practice, it can become comfortable.",
    parameterSuggestion: "A 2:4 ratio (2s inhale, 4s exhale) is gentle for beginners. Advanced practitioners can try 3:6 or 4:8.",
    stepByStepInstructions: [
      "Sit and relax before starting, take a minute to drop the shoulders and release the tongue from the roof of the mouth.",
      "Inhale quietly through the nose for 2–3 seconds.",
      "Purse lips softly (as if to whistle or blow out the candle).",
      "Exhale slowly and steadily for 4–6 seconds; don't force.",
      "Keep belly soft; avoid puffing cheeks. Repeat."
    ],
    safetyNote: "Stop if dizzy, light-headed, chest pain, or worsening breathlessness. If you have a lung/heart condition, please seek advice from a healthcare professional before trying it."
  },
  {
    id: "diaphragmatic-breathing",
    title: "Diaphragmatic (Belly) Breathing",
    description: "Increase lung efficiency. When you breathe normally, you don't use your lungs to their full capacity. Diaphragmatic breathing allows you to use your lungs at 100% capacity to increase lung efficiency.",
    inhaleDuration: 4,
    firstHoldDuration: 1,
    exhaleDuration: 5,
    secondHoldDuration: 0,
    repetitions: 20,
    isCustom: false,
    detailedDescription: "Diaphragmatic breathing is a technique that helps you focus on your diaphragm, a muscle in your belly. It's sometimes called belly breathing or abdominal breathing. By \"training\" your diaphragm to open up your lungs, you can help your body breathe more efficiently.\nWhen you breathe normally, you don't use your lungs to their full capacity. Diaphragmatic breathing allows you to use your lungs at 100% capacity to increase lung efficiency.",
    whenToUse: [
      "Any time you feel tense or 'breathing high in the chest'",
      "Pre-sleep wind-down, post-stress reset, or as a baseline daily practice",
      "Helpful for anxiety, digestive tension, or voice prep"
    ],
    howItHelps: "That exercise strengthens your diaphragm and trains you to breathe more efficiently. By drawing air deep into the lungs, it improves oxygen flow, reduces tension, and activates the body's relaxation response. Regular practice helps calm the mind, lower stress, and support better posture and lung function. Even a few minutes a day can bring noticeable balance and ease to your body and breath. \nAs with learning anything new, the first few times you practice diaphragmatic breathing, it may be difficult. Take a couple of minutes each day to practice this new skill, which offers many benefits to your overall health and can help you relax.",
    commonMistakes: [
      "Lifting shoulders / chest is moving",
      "Forcing the belly out or sucking it in (keep it easy)",
      "Noisy mouth breathing; rushing the exhale",
      "Overthinking and putting too much pressure on yourself"
    ],
    parametersNote: "For optimal benefit, diaphragmatic breathing is recommended for 10-20 minutes daily, practiced in several short sessions or one longer session. Beginners may start with shorter durations, such as 5-10 minutes, several times a day, gradually increasing the time as they become more comfortable.",
    parameterSuggestion: "Start with 4:5 pattern (4s inhale, 5s exhale). As comfort increases, try 5:6 or 6:8 for deeper relaxation.",
    stepByStepInstructions: [
      "Sit or lie comfortably; relax shoulders. Place one hand on the belly, one on the upper chest.",
      "Inhale through the nose for 4–5 s: feel the belly and lower ribs expand outward into your hand. Upper chest stays relatively quiet.",
      "Optional gentle hold for 0–1 s (no strain).",
      "Exhale slowly through pursed lips for 5–6 s; feel belly soften back toward the spine.",
      "Keep the breath quiet and smooth.",
      "Mindful Practice: Focus on the sensation of your stomach rising and falling as you breathe, keeping your chest relatively still."
    ],
    safetyNote: "If you feel dizzy or uncomfortable, pause and return to normal breathing. If you have a condition like COPD, asthma or anxiety, talk to your provider about diaphragmatic breathing to see if it's right for you."
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
  {
    id: "sitali-breath",
    title: "Sitali (Cooling) Breath",
    description: "Reduces feelings of anger, restlessness",
    inhaleDuration: 4,
    firstHoldDuration: 0,
    exhaleDuration: 6,
    secondHoldDuration: 0,
    repetitions: 10,
    isCustom: false,
    detailedDescription: "A cooling breath that draws air over a rolled tongue (or gently through the teeth), then exhales through the nose. Soothes heat, irritability, and mental agitation.",
    whenToUse: [
      "Hot weather, post-exercise cool-down, or after a heated moment",
      "Emotional heat: frustration, irritability, anger",
      "Afternoon settle, pre-sleep wind-down (keep the exhale soft and long)"
    ],
    howItHelps: "Inhaling over a narrow, moistened channel creates a cooling sensation, helping down-regulate arousal. Longer nasal exhale engages the parasympathetic response → calm, steady mood. Can reduce feelings of overheating, anger, restlessness, and support gentle focus.",
    commonMistakes: [
      "Forcing the inhale (creates throat tension)",
      "Loud, windy mouth inhale; cheeks puffing",
      "Rushed or short exhale; shoulders lifting"
    ],
    safetyNote: "Avoid in very cold or very polluted/dry air (may irritate throat/airways). If you have asthma, chronic cough, or throat sensitivity, use very gently or choose a nasal-only practice instead. Stop if dizzy, light-headed, or uncomfortable; return to normal breathing.",
    stepByStepInstructions: [
      "Sit tall; relax jaw/shoulders.",
      "Sitali: roll the tongue into a tube and extend slightly past the lips. Sitkari (alternative): if you can't roll the tongue, part the teeth gently and rest the tongue tip behind them.",
      "Inhale slowly through the rolled tongue (or gently across the teeth) for ~4 s, feeling the cool air.",
      "Close the mouth; optionally pause 0–1 s without tension.",
      "Exhale through the nose for ~6 s, smooth and quiet.",
      "Repeat 6–10 rounds; keep face and throat soft."
    ],
    parametersNote: "Sitali (or Sheetali) Pranayama, the cooling breath, can be practiced for a few minutes to 10-15 minutes daily. Beginners may start with 5-10 minutes, gradually increasing the duration as they become comfortable. It's particularly beneficial during the hottest part of the day (around midday) or after physical activity to help cool down. ",
    parameterSuggestion: "Start with 4–6 rounds, build to 10+ as comfortable. For stronger calming, extend the exhale to 7–8 s. If the mouth gets dry, pause briefly and swallow; keep the pull gentle, not slurping."
  },
  {
    id: "bee-breath",
    title: "Bee Breath (Bhramari)",
    description: "Quiets mental noise and eases facial tension",
    inhaleDuration: 4,
    firstHoldDuration: 0,
    exhaleDuration: 6,
    secondHoldDuration: 0,
    repetitions: 10,
    isCustom: false,
    detailedDescription: "A gentle nasal inhale followed by a soft humming exhale (\"mmm…\") with closed lips. The vibration soothes the nervous system, quiets mental noise, and eases facial/jaw tension.",
    whenToUse: [
      "Evening wind-down or post-stress reset",
      "Moments of overthinking, screen fatigue, or jaw/face tightness",
      "Before meditation or deep work to center attention"
    ],
    howItHelps: "The humming vibration provides a calming sensory focus and may stimulate vagal tone. Long, steady exhale promotes a parasympathetic shift (rest-and-digest). Can reduce perceived anxiety, irritability, and mental chatter; supports focus and sleep wind-down.",
    commonMistakes: [
      "Forcing the hum (throat tension or loud buzzing)",
      "Mouth open (keep lips closed, nasal breathing only)",
      "Shoulders lifting; cheeks puffing"
    ],
    safetyNote: "Skip or be very gentle if you have ear infection, acute sinus issues, recent dental work, or throat irritation. Stop if dizzy, light-headed, or uncomfortable. If you have medical concerns, follow clinician guidance.",
    stepByStepInstructions: [
      "Sit tall; relax jaw/shoulders. Lightly touch tongue to the roof of the mouth (optional).",
      "Inhale quietly through the nose for ~4 s.",
      "With lips closed and jaw soft, exhale while humming \"mmm…\" for 6–8 s. Keep the sound gentle and steady.",
      "Feel the vibration around lips, cheeks, and sinuses; keep throat relaxed.",
      "Repeat 6–10 cycles; finish with 1–2 easy nasal breaths."
    ],
    parametersNote: "Bhramari Pranayama, or Bee Breath, can be practiced at any time of the day, but it's particularly beneficial when done in the morning or evening. A good starting point is 5-10 minutes, gradually increasing to 15-20 minutes as you become more comfortable. It can be incorporated into your daily routine or practiced before meditation or sleep according to yoga and wellness websites.",
    parameterSuggestion: "Start with 4–6 rounds, build to 10+ as comfortable. Keep the hum quiet and effortless—aim for smoothness, not loudness. If you feel agitated, lengthen the exhale (up to 8 s)."
  },
  {
    id: "dirga-breath",
    title: "Dirga Pranayama (Three-Part Breath)",
    description: "Promotes deep calm",
    inhaleDuration: 4,
    firstHoldDuration: 0,
    exhaleDuration: 6,
    secondHoldDuration: 0,
    repetitions: 10,
    isCustom: false,
    detailedDescription: "A smooth, full breath that expands in three parts—belly, lower ribs, then upper chest—followed by an easy, complete exhale. Re-educates healthy breathing mechanics and promotes deep calm.",
    whenToUse: [
      "As a daily baseline practice (morning/evening, 2–5 min)",
      "Before meditation, sleep wind-down, or after stress",
      "When you notice tight chest/short breaths and want to reset the pattern"
    ],
    howItHelps: "Trains the diaphragm and lateral ribs for efficient, low effort breathing. Reduces shallow chest breathing and shoulder/neck tension. Steadies the nervous system (especially with a slightly longer exhale). Useful foundation for all other breathing practices.",
    commonMistakes: [
      "Starting the inhale high in the chest (skip belly/ribs)",
      "Forcing the belly out or sucking it in; creating tension",
      "Noisy mouth breathing; raising shoulders; rushing the exhale"
    ],
    safetyNote: "Generally gentle and safe. If you feel dizzy or uncomfortable, shorten the counts, return to natural breathing, or pause. Follow clinician guidance for respiratory/cardiac conditions.",
    stepByStepInstructions: [
      "Sit or lie comfortably; relax jaw/shoulders. Place one hand on belly, the other on lower ribs/upper chest.",
      "Inhale through the nose (4–5 s) in three parts:",
      "Belly gently rises into your lower hand.",
      "Lower ribs widen sideways.",
      "Upper chest lifts softly at the end (no strain).",
      "Optional easeful pause (0–1 s).",
      "Exhale slowly (~ 6 s) - upper chest softens, ribs draw inward, belly gently returns toward spine.",
      "Keep the whole breath quiet, smooth, and effortless. Repeat 6–10 cycles."
    ],
    parametersNote: "For beginners, a good starting point for Dirga Pranayama (Three-Part Breath) is 5-10 minutes per session, gradually increasing as comfort and familiarity grow, with a total of 20-30 minutes of pranayama practice throughout the day.",
    parameterSuggestion: "Begin with 4–6 cycles, build to 10+ as natural. If you feel agitated, favor a longer exhale (e.g., 4–6 or 5–7). Keep movements subtle, avoid forcing the chest lift."
  },
];
