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
    detailedDescription:
      "Inhale, hold, exhale, hold — each for the same count. A steady, structured rhythm that calms the nervous system, helps to relax the body, clear the mind and improve focus.\n\nPeople with high stress jobs, such as soldiers and police officers, often use box breathing when their bodies are in fight, flight, or freeze mode. This technique is also relevant for anyone interested in recentering themselves or improving their concentration.",
    whenToUse: [
      "Pre-meeting, public speaking, exam prep",
      "Stress spikes, jitters, overthinking",
      "Quick reset to clarity",
    ],
    howItHelps:
      "Research has shown that deep breathing techniques significantly reduce the production of hormones associated with stress, such as cortisol. It also can be helpful in the reduction of anxiety, depression and stress.\n\nWhen we are anxious, we breathe shallowly and quickly, which actually creates more anxiety. Using breathwork, we activate parasympathetic nervous system, where our body rests and digest.",
    commonMistakes: [
      "Forcing the holds / throat tension",
      "Lifting shoulders (chest breathing)",
      "Rushing counts; uneven box",
      "Not being conscious of how the air fills lungs and stomach",
    ],
    parametersNote:
      "Ideally, the session should be 4 minutes, or until calm returns. If it is challenging, shorten the period to 2-3 minutes. If experienced, you can potentially extend the sessions to 10-20 minutes or longer.\n\nConsistency is key, and sessions can be as short as a minute or two, especially when used to manage stress or anxiety throughout the day.",
    parameterSuggestion:
      "For beginners: Try 3-4 seconds for each phase. For experienced: 4-6 seconds works well for deeper relaxation.",
    stepByStepInstructions: [
      "Sit with your back supported, comfortably; relax jaw/shoulders.",
      "Inhale through the nose for 4.",
      "Hold gently for 4 (no strain).",
      "Exhale softly for 4 (nose or lips).",
      "Hold again for 4.",
      "Repeat, keeping the box smooth and unhurried.",
    ],
    safetyNote:
      "Shorten holds or stop if you feel dizzy or uncomfortable. Follow doctor's guidance if you have cardiopulmonary conditions, you are pregnant or have high blood pressure.",
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
    detailedDescription:
      "A calming technique designed to help us focus our mind and our body away from worries and repetitive thoughts. That way help us by reducing anxiety and promote sleep.\n\nAlso, according to a small study from 2022, practicing 4-7-8 breathing may improve heart rate variability and blood pressure in young adults. The researchers also suggest that it could be beneficial to people living with cardiovascular or pulmonary disease. It could potentially reduce your heart's workload and increase blood oxygen levels.",
    whenToUse: ["Before sleep", "During anxiety", "To calm the mind"],
    howItHelps:
      "Deep and mindful breathing activates what Dr. Herbert Benson called the relaxation response - the body's natural antidote to chronic stress. By calming the fight-or-flight system, it helps lower blood pressure, reduce anxiety, and support immune function.\n\nRegular practice improves sleep, focus, and emotional balance, while also easing pain and tension. In short, slow, conscious breathing restores both body and mind to a state of calm, clarity, and resilience.",
    commonMistakes: ["Holding breath too forcefully", "Overthinking about the technique", "Rushing the sequence"],
    parametersNote:
      "Often practiced as 4 cycles at bedtime; increase gradually as comfort grows. Keep breath gentle and unforced. Don't overthink. No one expects you to master your breath on the first try (or even the second or the 20th), so keep on practicing and consistency is key.",
    parameterSuggestion:
      "Classic 4-7-8 pattern is most effective. Beginners can try 3-5-6 if the full pattern feels too intense.",
    stepByStepInstructions: [
      "Sit comfortably with your back straight or lie down (especially if you want to fall asleep).",
      "Inhale quietly through your nose for 4.",
      "Hold your breath for 7.",
      "Exhale completely through your mouth for 8.",
      "This completes one cycle.",
      "Repeat for 4 cycles total.",
    ],
    safetyNote: "Stop and take a break, if you feel lightheaded. Practice on an empty stomach for best results.",
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
    detailedDescription:
      "Pursed lip breathing is a slow breathing technique that enables a person to control how much air enters and leaves their lungs. Calms the breath, reduces tension, and eases shortness of breath.\n\nIn long term, it may strengthen the lungs and improve their efficiency. That way, it may help people with lung conditions, namely chronic obstructive pulmonary disease (COPD).",
    whenToUse: [
      "Feeling tense, anxious, or short of breath",
      "During or after exertion (e.g., stairs, brisk walk)",
      "Inability to take a deep breath",
    ],
    howItHelps:
      "Pursed-lip breathing is a simple yet powerful technique that slows your breathing, improves oxygen exchange, and helps you feel more in control. By exhaling slowly through lightly pursed lips, you create gentle back pressure in the lungs (PEEP), which keeps airways open longer and allows trapped carbon dioxide to escape.\n\nThis method is especially helpful for people with COPD or asthma, as it eases shortness of breath, increases oxygen levels, and enhances exercise endurance. Beyond physical benefits, it also calms the nervous system, reduces stress and anxiety, and restores a steady rhythm to your breath - bringing both body and mind into balance.",
    commonMistakes: [
      "Blowing too hard (creates tension)",
      "Inhaling through the mouth",
      "Exhale too short; cheeks puffing; shoulders lifted",
    ],
    parametersNote:
      "Pursed lip breathing should be practiced 3-4 times a day for about 10 minutes each time, ideally when you are not short of breath. It's a technique to help relieve shortness of breath and can be incorporated into your routine when you feel comfortable. When experiencing shortness of breath, you can use pursed lip breathing as needed to help regulate your breath and find relief.\n\nIt may take some time before the technique feels natural. However, with regular practice, it can become comfortable.",
    parameterSuggestion:
      "A 2:4 ratio (2s inhale, 4s exhale) is gentle for beginners. Advanced practitioners can try 3:6 or 4:8.",
    stepByStepInstructions: [
      "Sit and relax before starting, take a minute to drop the shoulders and release the tongue from the roof of the mouth.",
      "Inhale quietly through the nose for 2–3 seconds.",
      "Purse lips softly (as if to whistle or blow out the candle).",
      "Exhale slowly and steadily for 4–6 seconds; don't force.",
      "Keep belly soft; avoid puffing cheeks. Repeat.",
    ],
    safetyNote:
      "Stop if dizzy, light-headed, chest pain, or worsening breathlessness. If you have a lung/heart condition, please seek advice from a healthcare professional before trying it.",
  },
  {
    id: "diaphragmatic-breathing",
    title: "Diaphragmatic (Belly) Breathing",
    description: "Increase lung efficiency",
    inhaleDuration: 4,
    firstHoldDuration: 1,
    exhaleDuration: 5,
    secondHoldDuration: 0,
    repetitions: 20,
    isCustom: false,
    detailedDescription:
      "Diaphragmatic breathing is a technique that helps you focus on your diaphragm, a muscle in your belly. It's sometimes called belly breathing or abdominal breathing. By \"training\" your diaphragm to open up your lungs, you can help your body breathe more efficiently.\n\nWhen you breathe normally, you don't use your lungs to their full capacity. Diaphragmatic breathing allows you to use your lungs at 100% capacity to increase lung efficiency.",
    whenToUse: [
      'Any time you feel tense or "breathing high in the chest"',
      "Pre-sleep wind-down, post-stress reset, or as a baseline daily practice",
      "Helpful for anxiety, digestive tension, or voice prep",
    ],
    howItHelps:
      "That exercise strengthens your diaphragm and trains you to breathe more efficiently. By drawing air deep into the lungs, it improves oxygen flow, reduces tension, and activates the body's relaxation response. Regular practice helps calm the mind, lower stress, and support better posture and lung function. Even a few minutes a day can bring noticeable balance and ease to your body and breath.\n\nAs with learning anything new, the first few times you practice diaphragmatic breathing, it may be difficult. Take a couple of minutes each day to practice this new skill, which offers many benefits to your overall health and can help you relax.",
    commonMistakes: [
      "Lifting shoulders / chest is moving",
      "Forcing the belly out or sucking it in (keep it easy)",
      "Noisy mouth breathing; rushing the exhale",
      "Overthinking and putting too much pressure on yourself",
    ],
    parametersNote:
      "For optimal benefit, diaphragmatic breathing is recommended for 10-20 minutes daily, practiced in several short sessions or one longer session. Beginners may start with shorter durations, such as 5-10 minutes, several times a day, gradually increasing the time as they become more comfortable.",
    parameterSuggestion:
      "Start with 4:5 pattern (4s inhale, 5s exhale). As comfort increases, try 5:6 or 6:8 for deeper relaxation.",
    stepByStepInstructions: [
      "Sit or lie comfortably; relax shoulders. Place one hand on the belly, one on the upper chest.",
      "Inhale through the nose for 4–5 s: feel the belly and lower ribs expand outward into your hand. Upper chest stays relatively quiet.",
      "Optional gentle hold for 0–1 s (no strain).",
      "Exhale slowly through pursed lips for 5–6 s; feel belly soften back toward the spine.",
      "Keep the breath quiet and smooth.",
      "Mindful Practice: Focus on the sensation of your stomach rising and falling as you breathe, keeping your chest relatively still.",
    ],
    safetyNote:
      "If you feel dizzy or uncomfortable, pause and return to normal breathing. If you have a condition like COPD, asthma or anxiety, talk to your provider about diaphragmatic breathing to see if it's right for you.",
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
    detailedDescription:
      "A simple, mindful practice of gently placing attention on the breath - often paired with anchor words or imagery - to cultivate calm, clarity, and steady focus.\n\nChoose a word that makes you smile, feel relaxed or is simply neutral. For example, some use peace, let go, relax or simply breathe in and breathe out.",
    whenToUse: [
      "Before deep work or study, during stress or overwhelm",
      "As a daily centering practice (2–10 min)",
      "Any time you want clarity without a strict breathing pattern",
    ],
    howItHelps:
      'This practice strengthens your ability to focus by gently bringing your attention back to the breath whenever your mind starts to wander. Each time you notice distraction and return to your breathing, you train your mind to stay present with calm awareness.\n\nWhen thoughts arise, we often get caught up in them, which can trigger worry or negative emotions. By simply observing these thoughts without clinging to them, you develop non-reactivity - the ability to stay centered and composed even when your mind or emotions try to pull you off balance. Over time, this builds emotional regulation, mental clarity, and resilience.\n\nIt also activates the parasympathetic nervous system - your body\'s natural "rest and restore" mode - especially when you exhale slightly longer than you inhale. This helps lower stress, reduce emotional reactivity, and create a deep sense of inner calm.',
    commonMistakes: [
      'Forcing the breath or "doing it right"',
      "Trying to push thoughts away (just notice and return).",
      "Mouth breathing noisily; shoulders tense.",
    ],
    parametersNote:
      "For breath focus techniques, a good starting point is 5-10 minutes a day. You can gradually increase the duration to 20 minutes or longer as you become more comfortable and find it beneficial. It's also recommended to practice it several times a day if possible.",
    parameterSuggestion:
      "A gentle 4:6 ratio (4s inhale, 6s exhale) helps maintain focus. Adjust timing to match your natural rhythm.",
    stepByStepInstructions: [
      "Sit tall or lie comfortably; relax jaw/shoulders.",
      "Before starting the practice in the app, notice the natural breath (temperature at the nostrils, belly/ rib movement).",
      "Alternate between normal and deep breaths a few times. Notice any differences between normal breathing and deep breathing. Notice how your abdomen expands with deep inhalations.",
      "When you feel that you have focused on the sensation of breathing, you can start the practice (relaxing and building up focus before the practice helps you soothe in to exercise).",
      'Choose an anchor: words ("in… out…", "calm… clear…") or imagery (wave/tide).',
      "Inhale gently; silently repeat your anchor (e.g., 'in… calm').",
      "Exhale slowly; repeat the pair (e.g., 'out… clear').",
      'When the mind wanders, notice it – name it – return to breathing (e.g., "thinking… back to breath"). Be gentle, it is okay, when the mind wanders, just come back to breathing. Practice takes time to master.',
      "Continue for the set cycles or time; finish with one longer, easy exhale.",
    ],
    safetyNote:
      "Generally safe. If you feel dizzy or uncomfortable, return to natural breathing or pause. Follow doctor's guidance if you have medical concerns.",
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
    detailedDescription:
      "Lion's Breath (Simha Pranayama) is a powerful yogic breathing technique that releases physical tension and emotional blockages through an expressive exhalation. You inhale deeply through the nose, open your mouth wide, stretch out your tongue, and exhale with a strong \"haaa\" sound - like a lion's roar.\n\nUnlike most quiet breathing practices, this one is bold and freeing, engaging the diaphragm, vocal cords, and facial muscles. It brings awareness to the throat and upper chest, activates circulation, and invites a sense of openness, courage, and authentic expression.",
    whenToUse: [
      "Feeling down or having low energy",
      "Before stressful events, public speaking or creative work",
      "Feeling tense, frustrated or emotionally stuck",
      "At the end of yoga or breathing sessions to let go of lingering stress",
    ],
    howItHelps:
      "Lion's Breath works on multiple levels - physical, emotional, and psychological. Physiologically, it relaxes the jaw, face, and neck muscles, strengthens the diaphragm and vocal cords, and enhances lung capacity and oxygen flow. Studies on pranayama show it can improve respiratory endurance, reduce stress, anxiety, and high blood pressure, and even benefit conditions like COPD and asthma by improving airflow and oxygenation.\n\nEmotionally, it helps release suppressed anger, frustration, or fear, replacing them with a sense of empowerment and confidence. The facial movements and audible exhale calm the nervous system and lower cortisol, leading to deep relaxation and a clearer, lighter mind. Psychologically, it trains you to let go of self-consciousness - helping you speak up, express emotions, and face challenges with renewed courage and presence.\n\nIn essence, Lion's Breath is not just a breathing exercise - it's a powerful emotional reset that reconnects you to your inner strength, authenticity, and vitality.",
    commonMistakes: [
      "Forcing the exhale – think releasing, not pushing the air out",
      "Holding tension in the face or shoulders (goal is to let go and feeling natural)",
      "Overdoing the number of rounds → dizziness or dryness in the throat",
      "Skipping the inhale – take a full, deep breath in before the exhale",
    ],
    parametersNote:
      "Lion's breath, a type of pranayama (yogic breathing), is generally recommended for a few minutes at a time, with 5-10 repetitions per session. Practitioners often follow this with a few minutes of normal, deep breathing. It's best to start with a few rounds and gradually work up to a comfortable duration, avoiding overexertion",
    parameterSuggestion:
      "Keep it energizing: 3s inhale, 2s forceful exhale works well. Avoid longer timing to prevent strain.",
    stepByStepInstructions: [
      "Sit tall (kneeling or cross-legged) or stand; relax shoulders/neck; hands resting on your knees or thighs.",
      "Before starting the exercise, take a few deep breaths.",
      "Inhale through the nose for 3-4 sec, feel ribs expand.",
      "Exhale forcefully through the mouth with a 'haaa' sound 2-3 sec:",
      "Mouth wide, tongue extended toward chin.",
      "Eyes can look up between the brows (optional).",
      "Repeat for 5-10 rounds, then finish with a few calm nasal breaths.",
      "Sidenote: if you need, take few normal breaths in between rounds.",
    ],
    safetyNote:
      "Skip or reduce intensity if you have throat irritation, jaw/TMJ pain, recent dental work, or if dizziness appears. If you have cardiopulmonary conditions or are pregnant, avoid forceful breaths and follow clinician guidance.",
  },
  {
    id: "alternate-nostril",
    title: "Alternate Nostril Breathing",
    description: "Balancing & calming breath",
    inhaleDuration: 4,
    firstHoldDuration: 0,
    exhaleDuration: 4,
    secondHoldDuration: 0,
    repetitions: 24,
    isCustom: false,
    detailedDescription:
      "Alternate Nostril Breathing (Nadi Shodhana) is a traditional yogic pranayama technique where you gently breathe in through one nostril, close it with your fingers, and exhale through the other - then repeat in the opposite direction. The Sanskrit term Nadi Shodhana means \"channel purification,\" referring to the idea that breath moves through subtle energy pathways (nadis), clearing mental and physical blockages.\n\nIt's more than a simple breathing rhythm - it's a mindful balancing act between the left and right sides of the body and brain. The left nostril is linked to calm, introspective energy (the parasympathetic system), while the right nostril activates alertness and focus (the sympathetic system). By alternating between them, you bring both hemispheres into harmony, creating inner equilibrium.",
    whenToUse: [
      "Preparing for sleep, meditation, or deep work",
      "After intense activity or stressful events",
      "Any time you want a reset to mental balance",
    ],
    howItHelps:
      "Alternate Nostril Breathing is known for its ability to calm the mind, balance the nervous system, and enhance focus and emotional regulation. Scientifically, regular practice has been shown to lower blood pressure, steady the heart rate, improve lung capacity, and even sharpen memory and coordination.\n\nEnergetically, it helps restore flow and clarity, dissolving inner agitation or fatigue. It's particularly effective before meditation, sleep, or any task that requires calm concentration. For experienced practitioners, it deepens self-awareness and breath control. For beginners, it's an easy entry into mindfulness and relaxation.\n\nIn essence, this technique reconnects you with your natural rhythm - balancing logic with intuition, stillness with clarity, and the breath with the mind.",
    commonMistakes: [
      "Pressing too hard on the nose (light touch is enough)",
      "Forcing or over-controlling the breath (let it flow naturally)",
      "Holding tension in the shoulders or jaw",
      "Losing the sequence and awareness (use mental cues: 'Left-in, Right-out, Right-in, Left-out')",
      "Overcomplicating the process – simplicity is the key",
    ],
    stepByStepInstructions: [
      "Sit comfortably with a straight spine.",
      "Use your right thumb to close your right nostril.",
      "Inhale slowly through your left nostril for 4 seconds.",
      "Close your left nostril with your ring or little finger (may use both).",
      "Release your thumb and exhale through your right nostril for 4-6 seconds.",
      "Inhale through your right nostril for 4 seconds.",
      "Close your right nostril and exhale through your left for 4-6 seconds.",
      "That's one full cycle. Continue this breathing pattern for up to 5 minutes, keeping the breath quiet and even.",
      "Double the repetitions as in this app, the repetition is equal to one nostril side breathing.",
    ],
    parametersNote:
      "It can be practiced for varying lengths of time depending on individual needs and comfort levels. A good starting point is 3-5 minutes, but it can be extended to 5-10 minutes or longer as you become more comfortable with the technique. Some practitioners find it beneficial to do 3-5 rounds, while others may prefer a set number of breaths on each side.",
    parameterSuggestion:
      "A 4:4 rhythm is balanced and calming. If you want deeper relaxation, try 4:6 (shorter inhale, longer exhale).",
    safetyNote:
      "Safe for most. Avoid if you have a cold or severe nasal blockage. If one nostril is partially blocked, reduce pressure or skip this practice until breathing is clearer. Stop if dizzy or light-headed.",
  },
  {
    id: "equal-breathing",
    title: "Equal Breathing (Sama Vritti)",
    description: "Clarity and attention",
    inhaleDuration: 4,
    firstHoldDuration: 0,
    exhaleDuration: 4,
    secondHoldDuration: 0,
    repetitions: 12,
    isCustom: false,
    detailedDescription:
      "Equal Breathing (Sama Vritti Pranayama) is a steady and rhythmic breathing technique where the length of your inhale matches the length of your exhale - for example, 4 seconds in and 4 seconds out.\n\n\"Sama\" means equal and \"vritti\" means fluctuation or movement, describing the balanced rhythm this technique creates between body and mind.\n\nIt's a foundational breath practice used in yoga and meditation to develop control, focus, and a calm nervous system.",
    whenToUse: [
      "When you feel anxious, scattered or overstimulated",
      "Before bed, during breaks at work or before meditation/yoga practice",
      "During stressful situations as a quick \"reset\"",
    ],
    howItHelps:
      "Equal Breathing helps synchronize the mind and body through balance. Matching the length of inhalation and exhalation sends a powerful signal to the nervous system that you are safe, reducing stress and mental overactivity.\n\nIt improves lung efficiency, deepens oxygen flow, and stabilizes the heart rate. Practicing regularly enhances focus, emotional steadiness, and self-awareness - making it an excellent foundation for meditation, sleep preparation, or stress relief.\n\nEnergetically, it restores inner symmetry and equilibrium - perfect for grounding yourself in moments of overwhelm.",
    commonMistakes: [
      "Forcing the breath or speeding up at the end of the count",
      "Breathing high into the chest; let the lower ribs/belly move",
      "Tension in the shoulders or jaw",
      "Forgetting awareness. Stay mindful",
    ],
    safetyNote:
      "Gentle and safe for most people. Avoid pushing your breath beyond comfort - especially if you feel dizzy or short of breath. People with respiratory or cardiovascular conditions should practice with care and consult a professional if unsure.",
    stepByStepInstructions: [
      "Sit comfortably; relax jaw/shoulders.",
      "Inhale through the nose for your chosen count (e.g., 4).",
      "Exhale through the nose for the same count (e.g., 4).",
      "Keep the breath quiet, smooth, and effortless.",
      "If you want, you can add a slight pause for breath retention after each inhale and exhale if you feel comfortable. (Normal breathing involves a natural pause.)",
      "Continue for 8–12 cycles; finish with one easy, slightly longer exhale.",
    ],
    parametersNote:
      "The recommended time for practicing this technique is generally 5 to 10 minutes, but it can be adjusted based on individual needs and comfort levels. Beginners may start with shorter durations, like 2-3 minutes, and gradually increase the time as they become more comfortable. It's also beneficial to practice this technique for a few minutes before other practices like yoga asana or meditation.",
    parameterSuggestion:
      "Begin with 4–4 if you're new; progress to 5–5 or 6–6 as it feels natural. If you feel agitated, try slightly longer exhales for a few rounds (e.g., 4–5 or 5–6), then return to equal. Practise 2–5 minutes daily to make it your default calm rhythm.",
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
    detailedDescription:
      "Sitali Breath, or Cooling Breath, is a yogic pranayama technique that involves inhaling air through a rolled tongue or pursed lips and exhaling smoothly through the nose. As the air passes over the tongue, it creates a cooling effect on the body and soothes the nervous system.\n\nThe Sanskrit word sitali means \"cool\" or \"soothing,\" reflecting the breath's purpose - to lower internal heat, calm emotional intensity, and restore balance after physical or mental strain.",
    whenToUse: [
      "Cool down after intense exercise, heat exposure, or emotional stress",
      "Emotional heat: frustration, irritability, anger",
      "Soothe the nervous system before meditation or rest",
      "Reduce anxiety and balance body temperature during stressful days",
      "Refresh your mind when feeling overheated or mentally drained",
    ],
    howItHelps:
      "The main goal of Sitali Breath is to cool both the body and the mind. It helps regulate temperature, ease agitation, and reduce the \"fiery\" qualities associated with stress, anger, or overexertion. The slow, mindful breathing activates the parasympathetic nervous system, lowering heart rate and calming the body's stress response.\n\nThis technique also promotes mental clarity and emotional steadiness, making it particularly helpful in situations of tension or overwhelm. Regular practice can improve digestion, reduce fatigue, and help the body adapt better to heat - both external and emotional.",
    commonMistakes: [
      "Forcing the inhale (creates throat tension)",
      "Breathing too fast",
      "Tensing the tongue or face",
      "Exhaling through the mouth",
      "Practicing in cold conditions",
    ],
    safetyNote:
      "Avoid it in very cold weather or if you tend to get chills easily. Those with low blood pressure, respiratory infections, or chronic sinus issues should use caution or consult a professional before starting. If dizziness, shivering, or discomfort occurs, stop the practice and return to natural breathing.",
    stepByStepInstructions: [
      "Sit comfortably, relax jaw/shoulders.",
      "Sitali: roll the tongue into a tube and extend slightly past the lips. Sitkari (alternative): if you can't roll the tongue, part the teeth gently and rest the tongue tip behind them.",
      "As a third option, you can also purse your lips",
      "Inhale slowly through the rolled tongue (or gently across the teeth) for 4 seconds, feeling the cool air.",
      "Close the mouth (optionally pause 0–1 s without tension).",
      "Exhale through the nose for 6 s, smooth and effortless.",
      "Continue breathing like this at least 5-10 times to maximize the cooling effect.",
    ],
    parametersNote:
      "Start with 2-3 minutes of sitali breathing, gradually building up to a 5-10 minute practice. Beginners can begin with a shorter duration, and many sources suggest breaking the practice into sections, such as 2-3 minutes of sitali followed by a period of normal breathing, before repeating. You can practice daily or as needed, particularly when feeling overheated or stressed, and some recommend doing it in the morning or before bed.",
    parameterSuggestion:
      "Start with 4:6 ratio (inhale 4, exhale 6 seconds). For stronger calming, extend the exhale to 7–8 s. If the mouth gets dry, pause briefly and swallow; keep the pull gentle, not slurping.\n\nIf needed and feels natural, you can add a 1-2 seconds hold between the breathings.",
  },
  {
    id: "bee-breath",
    title: "Bee Breath (Bhramari)",
    description: "Quiet the mind, ease tension",
    inhaleDuration: 3,
    firstHoldDuration: 0,
    exhaleDuration: 6,
    secondHoldDuration: 0,
    repetitions: 10,
    isCustom: false,
    detailedDescription:
      "Bee Breathing, known in Sanskrit as Bhramari Pranayama, is a calming yogic breathing technique where you make a gentle humming sound during exhalation — like the soft buzz of a bee. You inhale deeply through the nose and exhale with lips closed, producing a low, steady vibration in the throat and head.\n\nThe name Bhramari comes from the Sanskrit word for \"bee.\" The practice uses sound resonance to quiet the mind, ease tension, and bring awareness inward. The subtle vibration creates a soothing massage effect on the brain and nervous system, making it one of the most grounding and meditative breath practices.",
    whenToUse: [
      "Calm racing thoughts or anxiety",
      "Reduce tension or headaches",
      "Soothe the nervous system after a stressful day",
      "Restore emotional balance and inner quiet",
    ],
    howItHelps:
      "The main purpose of Bee Breathing is to calm the nervous system and stabilize emotional fluctuations. The humming vibration activates the vagus nerve - the body's natural relaxation switch - lowering heart rate and blood pressure while reducing anxiety and agitation.\n\nThis sound-based breath harmonizes brainwave activity and brings the mind into a meditative state, similar to deep chanting or mantra work. Regular practice can improve focus, sleep, and emotional regulation while easing symptoms of stress, anger, or frustration. The gentle vibration also helps release tension in the head, face, and neck, creating a profound sense of stillness and inner quiet.",
    commonMistakes: [
      "Forcing the hum (throat tension or loud buzzing)",
      "Tensing the face or jaw",
      "Mouth open (keep lips closed, nasal breathing only)",
      "Ignoring the vibrating sensation – that's where the calming effect comes from",
    ],
    safetyNote:
      "Avoid practicing if you have severe ear infections, sinus congestion, or vertigo, as the internal pressure may worsen symptoms. If dizziness or discomfort appears, stop immediately and return to normal breathing.",
    stepByStepInstructions: [
      "Sit comfortably, relax jaw/shoulders. Lightly touch tongue to the roof of the mouth (optional).",
      "Place your first fingers on the tragus cartilage that partially covers your ear canal.",
      "Inhale for 3-4 seconds.",
      "Gently press your fingers into the cartilage as you exhale 6-8 seconds.",
      "When exhaling, keep your mouth closed and make a loud humming sound (like \"mmmm\").",
      "Focus on the vibration inside your head, chest or throat.",
      "Feel the vibration – this vibration is what calms your nervous system and quiets mental chatter.",
      "Keep the breath and humming smooth, steady and gentle.",
      "Repeat that cycle for 5-10 times. After your final round, sit quietly for a few breaths and observe the stillness and clarity left behind.",
    ],
    parametersNote:
      "Start with 5-10 minutes daily and gradually increase to 15-20 minutes as you become more comfortable. As it can be practiced at any time of the day, it is beneficial to practice on an empty stomach, and ideal times are early morning or late at night to help calm the mind and reduce stress.",
    parameterSuggestion:
      "Start with 4–6 rounds, build to 10+ as comfortable. Keep the hum quiet and effortless—aim for smoothness, not loudness. If you feel agitated, lengthen the exhale (up to 8 s). Keep the ratio comfortable, no breath retention needed.",
  },
  {
    id: "resonant-breathing",
    title: "Resonant Breathing",
    description: "Balanced & restorative rhythm",
    inhaleDuration: 6,
    firstHoldDuration: 0,
    exhaleDuration: 6,
    secondHoldDuration: 0,
    repetitions: 50,
    isCustom: false,
    detailedDescription:
      "Resonant Breathing, also known as Coherent Breathing, is a scientifically validated breathing technique that involves inhaling and exhaling at a steady, equal pace — typically around 5 to 6 breaths per minute (about 5-6 seconds in, 5-6 seconds out).\n\nThis rhythm aligns your breathing with your body's natural heart rate variability (HRV) - creating a resonance between the cardiovascular, respiratory, and nervous systems.\n\nIn simple terms, it means breathing in harmony with your body's own biological rhythm. The result is a deeply balanced, synchronized state that supports mental clarity, emotional regulation, and physiological calm.",
    whenToUse: [
      "Recover from stress or emotional overload",
      "Rebalance after intense exercise or conflict",
      "Calm your mind before sleep",
      "Regain composure during anxiety or tension",
      "Support heart, lung, and nervous system health through daily practice",
    ],
    howItHelps:
      "The purpose of Resonant Breathing is to bring your entire system - body, mind, and heart - into harmony. By breathing at a natural rhythm of around six breaths per minute, your cardiovascular and nervous systems begin to synchronize, creating a state of deep physiological balance known as coherence.\n\nThis steady rhythm activates the parasympathetic nervous system, helping you move from stress and overthinking into a calm, focused state of awareness. It balances emotional responses, sharpens mental clarity, and promotes restful sleep. Over time, it also enhances heart rate variability (HRV), which improves your resilience to stress and emotional turbulence. The effect is subtle yet powerful - a sense of inner steadiness and calm energy that lasts long after you stop breathing.",
    commonMistakes: [
      "Breathing too fast",
      "Forcing deep inhales",
      "Holding the breath – this exercise needs to keep the flow continuous and smooth",
      "Losing rhythm and awareness",
      "Ignoring posture – sit upright with relaxed shoulders",
    ],
    safetyNote:
      "If you experience dizziness, shortness of breath, or anxiety while slowing your breathing, return to your normal pace and try again later. Those with severe heart or lung conditions should consult a healthcare professional before starting.",
    stepByStepInstructions: [
      "Sit comfortably, relax jaw/shoulders.",
      "Inhale gently through the nose for 6 seconds.",
      "Exhale slowly through the nose for 6 seconds, without forcing it.",
      "Keep the breath quiet, smooth, and effortless.",
      "Continue this for preferred time (few minutes at least).",
    ],
    parametersNote:
      "Aim for 10 minutes to start, focusing on a steady rhythm of approximately 5 to 6 breaths per minute, meaning a 5 to 6-second inhale followed by a 5 to 6-second exhale. You can practice for longer, up to 20 minutes, as you become more comfortable.",
    parameterSuggestion:
      "As the breathing rate should be 5-6 breaths per minute, then the parameters should stay between 5-6 seconds for both - inhale and exhale. Breathing is smooth, nasal and continuous, so no holds. Keep the inhale and exhale equal.",
  },
];
