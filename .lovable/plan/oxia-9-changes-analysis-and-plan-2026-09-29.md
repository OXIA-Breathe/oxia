# OXIA – 9 changes: analysis and plan

All nine are doable. New screens (items 2, 7, 8, 9) are described below as layouts. They reuse the current OXIA style: white cards, navy primary buttons, rounded-2xl, max-w-sm. Nothing that exists today gets restyled.

## 1. "Keep screen on" setting — doable, recommended
- New toggle in Settings → Audio/Other: **"Keep screen on during exercises"**, default ON.
- When it's ON, the screen stays awake only while an exercise is running. It goes back to normal when the exercise ends, is paused, or the user leaves the page. This protects the battery.
- The web preview has no effect; you'll only see it in the phone app.

## 2. Confirmation email opens the OXIA app, plus a Welcome modal
**Cause:** in the phone app the link is built from the app's internal address (`localhost`), so it points nowhere.
**Fix:**
- In the phone app, the confirmation link uses an OXIA app link (`oxia://verify-email`). Tapping it in the email opens OXIA directly. The web version keeps the normal web link.
- Once the app opens, it finishes the sign-in and shows the **Welcome modal**.
- **Something you need to do (one time):** in the Supabase dashboard → Authentication → URL Configuration, add `oxia://**` to the allowed Redirect URLs. I'll give you the exact steps.

Welcome modal layout:
```text
[ OXIA logo ]
Welcome, Kristo!
Enjoy using the app and breathe well.
With your account you can:
  - Unlimited breathing sessions
  - Session history and streaks, synced across devices
  - Custom exercises saved to your account
  - Badges, reminders, progress stats
------------------------------------------
Go further with Premium
  - AI Wellness Journal
  - Stress & mood tracking before/after sessions
  - Mood, stress and exercise-effectiveness insights
  - Monthly PDF wellness report
[ Try Premium – 7 days free ]   (opens the existing Premium purchase)
[ Skip for today ]
```

## 3. Default repetitions
Current → new: Box 15→15, 4-7-8 4→4, Pursed Lip 30→30, Diaphragmatic 20→30, Breath Focus 10→30, Lion's 5→10, Alternate Nostril 24→30, Equal 12→15, Sitali 10→15, Bee 10→30, Resonant 50→50.
- Update the built-in values.
- One-time update on existing phones: an exercise gets the new number only if the user never changed its repetitions. Numbers a user set themselves are kept.

## 4. Friendlier cancel message
- A cancel is not an error. It won't show a red message anymore. It shows a soft, neutral message, or nothing at all (Calm, Headspace and Spotify just close the sheet silently).
- Proposed: title **"No worries"**, text **"You weren't charged. Premium is here whenever you're ready."**
- Real failures (not cancels): **"Something went wrong"** / "We couldn't reach Google Play. Please check your connection and try again."

## 5. Settings plan heading
- "Free plan" → **"Current plan: Free"**, or **"Current plan: Premium Monthly"** / **"Premium Yearly"**. The plan type is read from the saved subscription.

## 6. Add-session button hidden under the paywall cards
- The paywall overlay layer sits above the floating button while you scroll. Fix: put the floating button above the overlays (and above the bottom menu area). No visual change.

## 7. "Well done!" completion screen
Replaces the small toast for everyone (guest, free, premium). For Premium users with tracking on, the stress/mood check-in comes after this screen.
```text
   ( progress ring / check icon, soft animation )
            Well done!
 Take a breath and relax, regain your normal breathing speed.
 Your results
   Exercise:     Box Breathing
   Repetitions:  15
   Total time:   4 min 00 s
 [ Save ]  (primary)
 [ Restart ]   [ Delete ]   (outline)
```
- **Save:** the session goes into Progress statistics and counts toward streaks/trial.
- **Delete / Restart:** first ask "Are you sure? This session won't be saved." [Yes] [No]. Yes → session is discarded and you return to the home breathing circle. Restart also resets the circle, ready to start again.
- **Change in behaviour:** today sessions save automatically. From now on, a session saves only when the user taps Save. If the app is closed on this screen, the session is not saved.
- Guests: tapping Save uses one of the 10 free sessions, as it does today.

## 8. Premium slide in the introduction
- Add one slide before the sign-up slide: "OXIA Premium", listing the 4 Premium benefits and "7-day free trial".
- Its button **"I want Premium"** takes the user to sign-up and remembers that choice. After the email is confirmed, the Welcome modal (item 2) opens with the Premium section already highlighted. Buying works the same way as in Settings.

## 9. When to ask users to sign up or go Premium
- **Guests:** after session 1, and again after session 10 (trial used up), a modal suggests creating an account and lists what an account gives you. Buttons: [Create account] [Maybe later]. After session 10 it's the existing trial limit screen, updated with the same list.
- **Registered free users:** the Premium modal appears before the 2nd session, then again after the 10th, 20th and 100th sessions if they skipped. It never appears twice for the same milestone.
  - Text: "Track how breathing changes you — Premium asks how you feel before and after each session and shows your stress and mood trends over time." [Try Premium] [Skip]
  - If they subscribe: emotion tracking turns on automatically, they return to the exercise, and the before-session check-in opens right away.
- Which milestones were already shown is saved per user.

## Technical details
- Item 1: add `@capacitor-community/keep-awake`. Add an `oxia.keepScreenOn` localStorage setting (default true). Call keepAwake/allowSleep in `useBreathingSession` on start/pause/complete/unmount.
- Item 2: add `@capacitor/app`. In `AuthContext`, use `emailRedirectTo = Capacitor.isNativePlatform() ? 'oxia://verify-email' : origin + '/verify-email'` (same for resend in `AuthPage`). Add an intent-filter for scheme `oxia` in AndroidManifest, and an `appUrlOpen` listener that exchanges the code or sets the session from the URL, then navigates to `/verify-email`. New `WelcomeModal` component. The name comes from `user_metadata.full_name`. A `welcome_shown` flag is kept per user.
- Item 3: edit `defaultBreathingExercises`. Add a migration in `loadLocalDefaults`: keep the saved reps only if they differ from the *old* default. Bump the version to "2.6" without wiping.
- Item 4: `PremiumModal` `isCancellation` branch → no destructive toast. Inline message uses the new copy. Also fix `SubscriptionSettings` and `purchases.ts` messages.
- Item 5: `SubscriptionSettings` reads the product id from `usePremiumStatus` / `subscription_receipts` to label Monthly vs Yearly.
- Item 6: FAB in `ConsistencyPage` gets `z-30`. The overlay stays `z-10`.
- Item 7: new `SessionCompleteModal`. `useBreathingSession` completion now holds the session as pending instead of inserting it. Save → insert (plus trial increment for guests). Delete/Restart → discard, then reset the timer. The flow chains into `PostExerciseTracking` when tracking is enabled.
- Item 8: add a slide to `OnboardingCarousel`. `localStorage oxia.intent = 'premium'` is read by the Welcome modal.
- Item 9: new `useUpsellPrompts` hook storing milestone flags (localStorage, keyed by user id or guest). It uses the saved session count. Reuses `SignUpPromptModal` (extended) and `PremiumModal` with a new "tracking" intro variant. After purchase: enable tracking, then open `PreExerciseCheckIn`.
- Version bump to 1.3.0 (versionCode 5) after these changes (new features).

## Order of work
3, 4, 5, 6 (quick fixes) → 1 → 7 → 2 → 8 → 9
