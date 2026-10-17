# OXIA – next release plan (merging both research conclusions)

## How the new conclusion compares with our previous plan

| Previous plan item | Status after new review |
| --- | --- |
| Soft chimes + haptics for eyes-closed practice | Keep. Add separate volume for voice, music, cues, and reach them from the breathing screen |
| "Make it gentler" control during a session | Keep. Becomes the start of the "comfort" idea below |
| Sensory grounding alternative | Move later. Review does not ask for it |
| Guilt-free weekly consistency | Keep, reworded as the Progress "what have I noticed" summary |
| "Most effective for you" badges | Change. Review says medals after 2 sessions are misleading. Replace with "Your exercise results" with sample sizes |

## What the review says we must fix first (we don't have this yet)

1. **Honest numbers on Progress**
   - Mood: remove the "+2.4 avg" score. Show the most common recorded change, e.g. "Anxious → Calm: 4 sessions".
   - Stress: lead with "Reported stress 73 → 31, 42 points lower across 6 sessions with both check-ins". Drop the "-58%". Rename to "Average reported change". Show how many sessions had both check-ins. Use straight lines instead of smooth curves.
   - Exercise ranking: rename to "Your exercise results", remove medals, label "Early observations" until there are enough sessions, round percentages.
2. **Same numbers everywhere.** Progress, history, PDF report and AI reflection must use one shared calculation for the same period. The AI gets the finished numbers and only explains them.
3. **Careful wording.** Fix resonant breathing (6 s in + 6 s out = 5 breaths/min). Soften claims like "hemispheric harmony", "emotional unblocking", guaranteed vagal effects, "clinically validated". Say "self-reported" stress and mood.
4. **AI reflection** gets a fixed shape: Observation → Evidence → Limitation → Optional next step. Show the period it covers and when it was made. No effort-grading tone. Consider renaming "AI Wellness Journal" to "Practice reflection".

## Next: smoother everyday use

5. **Home:** clear "Start" label, tappable exercise name ("Change exercise"), estimated duration before start, "Repeat last session" button for returning users.
6. **Exercise list:** filters Calm · Sleep · Focus · Gentle start · All; each card shows duration, whether it has holds, and whether it needs humming or sound. Favourites/recent.
7. **Bottom menu:** short text labels under each icon; make sure nothing is hidden behind it at the end of a page.
8. **History cards:** show "Stress 62 → 45" at a glance; move edit/delete into a small menu; mark manually added sessions.
9. **Comfort check** (optional, after a session): Comfortable · Too slow · Holds difficult · Felt unwell. "Felt unwell" shows a short "stop and breathe normally" message.
10. **Free plan wording:** "Unlock detailed mood and stress insights" instead of "Unlock emotion tracking" (recording stays free if that's what we want).

## Later: the differentiating feature

11. **Personal breathing plan (simple rules first):** pick a purpose (Wind down, Break, Focus, Just practise) → suggest an exercise you rated comfortable and that helped before, with the reason in one sentence. Always allow "Use my usual exercise". Test it before building anything smarter.
12. Wearables, sequences, sensory grounding — only after users show they want them.

## Decisions I need from you (the review contradicts things you asked for)

- **Save screen:** you chose "nothing saves until Save". The review suggests saving automatically with an undo. Keep yours, or switch?
- **Premium prompts after sessions 2/10/20/100:** the review says remove them and show Premium only when someone asks for deeper insights. Keep, reduce, or remove?
- **Rename "AI Wellness Journal" to "Practice reflection"?**
- **Short sessions:** count a session ended early (e.g. 90 s) as a real session?

## Testing on your phone (I can't verify these from here)
Screen-off playback, phone calls interrupting, pause/resume, saving offline, Premium restore.

## Technical details
- New `src/lib/insightStats.ts`: single deterministic calculator (paired records, missing count, period, up/down/unchanged counts, mood transition counts). Used by MoodInsightsCard, StressInsightsCard, ExerciseEffectivenessCard, wellness PDF, and passed into `ai-wellness-insights` prompt. Unit tests for paired averages and transition counts.
- Chart `type="linear"` in StressInsightsCard.
- Copy edits in `src/types/breathingExercise.ts` descriptions (bump defaults version without wiping user reps).
- Exercise metadata fields: `purpose[]`, `hasHolds`, `needsSound`, `estimatedSeconds` derived from timings x reps.
- Comfort check stored in a new nullable column on the session/emotion record (migration with RLS unchanged scope).
- Audio: per-channel volume in `audioSettings`, quick sheet on BreathePage.
- Version bump to 1.4.0 when done.

## Order of work
1–4 (credibility) → answer decisions → 5–10 → 11 → 12
