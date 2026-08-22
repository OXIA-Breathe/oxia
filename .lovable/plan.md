# Traceable subscription logging and error responses

Goal: when a purchase or store event fails, QA can copy one trace ID from the app or the store console and find every step of that request in the Edge Function logs, with a clear reason code instead of a generic "Purchase verification failed".

## Current state

- `verify-purchase` logs with bare `console.error("Receipt persist error:", ...)` strings — no trace ID, no user ID, no step name — and returns flat messages (`"Purchase verification failed"`, `"Failed to record purchase"`) that don't say which stage broke (Google OAuth, store lookup, expired receipt, DB write).
- `subscription-webhook` already has the pattern we want: a `traceId` per request, JSON `log()` / `logError()` helpers, and an event ledger row. It's inconsistent though — `getGoogleSubscriptionState` and `createGoogleJwt` still use raw `console.error` with no trace ID, and success/duplicate responses expose `traceId` while some early exits (401, 400, 405) don't.
- The client (`src/lib/purchases.ts`) discards the function's error body, so nothing traceable reaches the UI.

## What changes

### 1. Shared logging helper
New `supabase/functions/_shared/logging.ts` exporting a `createLogger(fn, req)` that returns `{ traceId, log, logError, jsonResponse }`:
- Every line is single-line JSON: `trace_id`, `fn`, `step`, `message`, plus safe extras.
- Never logs receipts, purchase tokens, JWTs, service-account fields, or emails — tokens are logged only as a short fingerprint (last 6 chars) so QA can correlate without leaking the credential.
- `jsonResponse` always attaches `traceId` and, on errors, a stable machine-readable `code`.

### 2. `verify-purchase`: trace + reason codes on every path
- Create the logger at request start; log `request_received` (platform, product ID, has-receipt boolean) and `request_completed` (status, duration ms).
- Replace each generic error with a coded response, all carrying `traceId`:
  - `missing_auth`, `invalid_token` (401)
  - `invalid_body`, `missing_fields` (400, with the field names)
  - `unsupported_platform` (400)
  - `store_not_configured` (503 — service-account/shared-secret secret absent, currently silently a 400)
  - `store_rejected` (402) with a `reason` from the store: Google HTTP status or Apple `status` number
  - `subscription_expired` (402) when the store verified but expiry is in the past
  - `receipt_persist_failed`, `profile_update_failed` (500)
  - `internal_error` (500)
- Google and Apple verifiers return `{ isValid, expiresAt, failure }` instead of swallowing the reason, and take the logger so each stage (`google_oauth`, `google_lookup`, `apple_verify`) logs its own outcome.
- Log `subscription_activated` with user ID, plan, expiry, and whether the receipt row was inserted or updated.

### 3. `subscription-webhook`: finish the pattern
- Route the remaining raw `console.error` calls in the Google helpers through `ctx.logError` with `step` names.
- Include `traceId` in the 405, 401, and 400 responses, and add `code` fields (`method_not_allowed`, `unauthorized`, `invalid_body`, `unrecognised_payload`) so a QA replay shows why a provider call was rejected.
- Log `webhook_received` at entry (provider guess, payload size) and `webhook_completed` (event type, outcome, duration).
- Persist the failure reason into `subscription_webhook_events.error_message` for store-verification failures too, not just thrown errors (no schema change — column exists).

### 4. Surface the trace to QA in the app
- `src/lib/purchases.ts`: read the error body from `functions.invoke`, and return/throw `{ code, traceId, message }` instead of dropping it.
- `PremiumModal` error state shows a friendly message plus a small monospace `Ref: <traceId>` line so a tester can paste it into a bug report.
- `/premium-debug` gains a "last verification result" panel showing the most recent code, trace ID, and timestamp from the last purchase attempt (in-memory/localStorage, no backend).

### 5. QA doc
Add a "Tracing failures" section to `docs/SUBSCRIPTION_SETUP.md`: the reason-code table with likely cause and fix, and how to search Edge Function logs by `trace_id`.

## Notes

No database migration and no change to when premium is granted — this is logging, error shape, and one client-side display of the reference ID.
