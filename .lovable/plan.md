# OXIA Paywall Implementation Plan

## Goal
Make the subscription model explicit and consistent across the app:
- **Free (no account)**: 10 breathing sessions, then registration required.
- **Free (registered)**: unlimited built-in exercises, learning content, session history, basic streaks, and custom exercises.
- **Premium (€4.99/mo, 7-day trial)**: emotion tracking, AI Wellness Journal, effectiveness ranking, mood/stress insights, optimal-time analysis, and PDF wellness reports.

## Current state
- Project memory already defines the above tiers, but the code is inconsistent.
- `useEmotionTracking.ts` already gates emotion tracking behind `is_subscribed`.
- `OtherSettings.tsx` currently lets any signed-in user toggle emotion tracking on/off regardless of subscription.
- Premium features (insights, AI journal, PDF report) exist in UI but lack clear paywall screens.
- `profiles` has `is_subscribed` and `subscription_expires_at`, protected by a trigger from client updates.
- No trial-state column exists yet, so a 7-day trial cannot be tracked safely.

## Implementation steps

1. **Database: add trial tracking**
   - Add `trial_started_at` (nullable timestamptz) and `trial_ends_at` (nullable timestamptz) to `public.profiles`.
   - Protect them with the same `protect_subscription_fields` pattern so only service_role can write them.
   - Add a helper function `public.is_premium(user_id uuid)` that returns true when `is_subscribed` is true OR the current time is between `trial_started_at` and `trial_ends_at`.

2. **Unify emotion-tracking gating**
   - Update `OtherSettings.tsx` so the toggle is disabled for non-premium users and shows a "Premium" upsell row.
   - Keep `useEmotionTracking.ts` using the same `is_premium()` logic.
   - Ensure pre/post exercise emotion check-ins are hidden behind the same gate.

3. **Premium gates on premium-only screens**
   - Progress/Insights cards: effectiveness ranking, mood insights, stress insights, and wellness report button show a blurred/premium overlay with a CTA when not premium.
   - Wellness Journal page: full-screen paywall overlay for non-premium users.
   - Optimal-time analysis (if surfaced in UI): gated similarly.

4. **Add reusable premium upsell components**
   - `PremiumFeatureCard` — blurred preview with padlock and upgrade CTA.
   - `PremiumModal` — full-screen or bottom-sheet upsell with trial hook.
   - `TrialBadge` — small "7-day free trial" badge shown in upsells.

5. **Payment provider setup**
   - Run `payments--recommend_payment_provider` to confirm provider choice.
   - Enable the chosen provider (Paddle/Stripe/Shopify) and create the subscription product at €4.99/month with a 7-day trial.

6. **Subscription lifecycle**
   - Edge function to verify current subscription/trial state and refresh `profiles.is_subscribed` / `subscription_expires_at` from provider webhooks.
   - Webhook handler for `checkout.completed`, `subscription.activated`, `subscription.cancelled`, etc.
   - Ensure `protect_subscription_fields` still blocks client-side tampering.

7. **Settings and account UI**
   - Add a "Subscription" section in Settings showing current plan, trial status, and a "Manage subscription" button.
   - Add "Restore purchases" button for mobile store reconciliation.

8. **Testing**
   - Verify free user sees paywalls and cannot access premium features.
   - Verify trial user gets full premium access for 7 days.
   - Verify subscribed user retains access.
   - Verify emotion tracking cannot be enabled without premium/trial.

## Technical notes
- Use `is_premium()` in RLS policies where premium tables need read access (e.g., wellness_reflections, emotion_tracking).
- Keep free features (history, streaks, custom exercises) accessible to authenticated users only.
- Do not expose raw provider secrets in the client; all payment verification happens via Supabase Edge Functions.
- Update `docs/PRD.md` and project memory `mem://business/monetization-strategy` after implementation.

## Out of scope for this plan
- Actual payment-provider-specific checkout code will be implemented after provider selection.
- Pricing changes beyond the agreed €4.99/month + 7-day trial.
