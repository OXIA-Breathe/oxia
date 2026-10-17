# Architecture rules

- Breathing sessions auto-save when they finish, including ones ended early with the reset button after at least one breath; the "Well done!" screen offers Undo, which deletes the saved row — no tap needed to keep a session, mistakes stay reversible.
- Native auth email links use the `oxia://` scheme (`src/lib/authRedirect.ts` + AndroidManifest intent-filter + `DeepLinkHandler`) — `window.location.origin` is `localhost` inside Capacitor.
- Sign-up prompt milestones are stored per user in localStorage (`src/lib/upsellPrompts.ts`) — so each prompt shows at most once per milestone.
