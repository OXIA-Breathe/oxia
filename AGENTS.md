# Architecture rules

- Breathing sessions are saved only when the user taps Save on the "Well done!" screen (`useBreathingSession.saveSession`) — users can discard or restart without polluting stats.
- Native auth email links use the `oxia://` scheme (`src/lib/authRedirect.ts` + AndroidManifest intent-filter + `DeepLinkHandler`) — `window.location.origin` is `localhost` inside Capacitor.
- Sign-up/Premium prompt milestones are stored per user in localStorage (`src/lib/upsellPrompts.ts`) — so each prompt shows at most once per milestone.
