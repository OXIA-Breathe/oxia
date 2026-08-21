# OXIA — Tracker Integrations Reference

> **Status:** Connector-ready schema is implemented. Cloud/OAuth tracker integrations are future work.
> 
> This document describes how each supported tracker produces a stress value, what is required to access it, and how its raw signal should be normalised into OXIA's 0–100 `StressReading.value` scale.

---

## 1. Connector schema (already in place)

The app stores a provider-agnostic reading alongside every breathing session:

```ts
interface StressReading {
  value: number;                 // 0-100, normalised across every provider
  provider: HealthTrackerId;     // e.g. "health_connect", "fitbit"
  sourceApp?: string;            // upstream app name, e.g. "Samsung Health"
  derivedFrom?: HealthMetric;    // hrv | heart_rate | resting_heart_rate | ...
  confidence?: number;           // 0-1, optional
  measuredAt: string;            // ISO timestamp
}
```

Adding a new tracker means adding one entry to `HEALTH_TRACKERS` in `src/types/healthTracker.ts`. Existing session rows stay valid because the schema is versioned and the tracker registry is looked up at read time.

---

## 2. Tracker-by-tracker reference

### Manual entry

| Field | Value |
|---|---|
| ID | `manual` |
| Stress source | User-entered 0–100 slider |
| Access | None |
| Auth kind | `none` |
| Normalisation | Value is already on the OXIA 0–100 scale. `derivedFrom` is omitted. |
| Notes | Used as fallback when no tracker is connected or when the user prefers self-assessment. |

---

### Health Connect (Android)

| Field | Value |
|---|---|
| ID | `health_connect` |
| Stress source | **Derived** — no native stress record type exists. Read HRV (RMSSD), resting heart rate, heart rate, respiratory rate, sleep. |
| Access | Android system permission (`android.permission.health.READ_*`). On-device only; no cloud API key. |
| Auth kind | `system_permission` |
| Normalisation | Run the HRV/RHR/sleep derivation engine (see §4 Future engine) to produce a 0–100 stress estimate. |
| Notes | Primary Android target. Samsung Health, Fitbit, Google Fit and others write into Health Connect. `sourceApp` should be captured from the record origin. |

---

### Apple Health (iOS)

| Field | Value |
|---|---|
| ID | `apple_health` |
| Stress source | **Derived** — HealthKit exposes HRV (SDNN/RMSSD), RHR, HR, respiratory rate, sleep. |
| Access | iOS `HKHealthStore` permissions. No cloud key. |
| Auth kind | `system_permission` |
| Normalisation | Same derivation engine as Health Connect. |
| Notes | Requires a Capacitor plugin or native Swift bridge. `HKQuantityTypeIdentifierHeartRateVariabilitySDNN` is the most common HRV metric. |

---

### Fitbit

| Field | Value |
|---|---|
| ID | `fitbit` |
| Stress source | **Native** — Fitbit Web API exposes `Stress Management Score` (1–100, higher = more stressed). Also HRV, RHR, sleep, SpO₂. |
| Access | OAuth 2.0 via Fitbit Web API. Client ID/secret must live in an Edge Function, never in the app. |
| Auth kind | `oauth` |
| Normalisation | If native stress score is present: invert if needed so higher value = higher stress, then map to 0–100. If absent, fall back to HRV/RHR/sleep derivation. |
| Notes | Fitbit has deprecated and changed Web API scopes in 2025–26. Verify current scopes (`stress`, `heartrate`, `sleep`, `spo2`) before shipping. Token refresh must be handled server-side. |

---

### Garmin

| Field | Value |
|---|---|
| ID | `garmin` |
| Stress source | **Native** — Garmin Connect exposes a stress score (0–100, higher = more stressed) and Body Battery. Also HRV, RHR, sleep. |
| Access | Garmin Health API is partner-only and requires an approved developer account. OAuth 2.0. |
| Auth kind | `oauth` |
| Normalisation | Native Garmin stress score is already 0–100 and direction-matched (higher = more stress). If unavailable, derive from HRV/RHR/sleep. |
| Notes | Garmin's partner program approval is a blocker. Plan for a long onboarding process. Store tokens in an Edge Function. |

---

### WHOOP

| Field | Value |
|---|---|
| ID | `whoop` |
| Stress source | **Derived** — WHOOP exposes recovery, strain, HRV, RHR, sleep, respiratory rate. No direct stress score. |
| Access | WHOOP API v1 uses OAuth 2.0. Requires developer registration. |
| Auth kind | `oauth` |
| Normalisation | Recovery score is inversely related to stress (lower recovery ≈ higher stress). Map recovery + strain into the 0–100 stress scale using the derivation engine. |
| Notes | Strain and recovery are strong signals. Consider a weighted formula that combines HRV, recovery %, and day strain. |

---

### Oura Ring

| Field | Value |
|---|---|
| ID | `oura` |
| Stress source | **Derived** — Readiness, HRV, RHR, sleep, SpO₂. Oura does not expose a single stress score. |
| Access | Oura Cloud API v2, OAuth 2.0 + personal access tokens for development. |
| Auth kind | `oauth` |
| Normalisation | Readiness score is inversely related to stress. Combine readiness, HRV, RHR, sleep into the 0–100 scale. |
| Notes | Oura's API is well-documented and stable. Personal access tokens are useful for early prototyping, but production must use OAuth. |

---

### Polar

| Field | Value |
|---|---|
| ID | `polar` |
| Stress source | **Derived** — Polar Flow exposes nightly recovery (ANS charge), HRV, RHR, sleep. No public stress score. |
| Access | Polar Accesslink API v3. OAuth 2.0 + partner approval for some endpoints. |
| Auth kind | `oauth` |
| Normalisation | Nightly recovery and ANS charge are inversely related to stress. Derive 0–100 stress estimate from these inputs. |
| Notes | Accesslink has rate limits and requires user consent per data type. |

---

## 3. Stress score direction and scale rules

| Provider | Raw metric | Raw range | Direction | Normalised to 0–100 stress |
|---|---|---|---|---|
| Manual | user slider | 0–100 | higher = more stress | `value` |
| Health Connect | derived composite | — | higher = more stress | output of engine |
| Apple Health | derived composite | — | higher = more stress | output of engine |
| Fitbit | stress management score | 1–100 | higher = more stress | `value` |
| Garmin | stress score | 0–100 | higher = more stress | `value` |
| WHOOP | recovery | 0–100 | lower = more stress | `100 - recovery` (then blended) |
| Oura | readiness | 0–100 | lower = more stress | `100 - readiness` (then blended) |
| Polar | nightly recovery / ANS charge | varies | lower = more stress | invert and scale |

When a native stress score is present, prefer it. When absent, derive from the composite engine.

---

## 4. Future work: shared stress derivation + normalisation engine

> **This is intentionally not implemented yet.** It is parked here as the next project once the first OAuth tracker is wired up.

### Goal

Build a single, testable engine that turns HRV, resting heart rate, sleep quality/quantity, and optional respiratory rate into a 0–100 stress estimate using the user's own baseline window.

### Why it matters

- Health Connect and Apple Health have no native stress score.
- WHOOP, Oura, and Polar only expose recovery/readiness proxies.
- A shared engine avoids duplicating logic per tracker and makes the score explainable to users.

### Proposed inputs

| Input | Source metric | Role |
|---|---|---|
| HRV (RMSSD or SDNN) | `hrv` | Primary inverse stress signal. Lower HRV ≈ higher stress. |
| Resting heart rate | `resting_heart_rate` | Secondary inverse signal. Elevated RHR ≈ higher stress. |
| Sleep | `sleep` | Tertiary signal. Poor sleep elevates stress. |
| Respiratory rate | `respiratory_rate` | Optional signal. Elevated RR ≈ higher stress. |

### Proposed algorithm (v1)

1. **Baseline window** — compute a rolling 14–30 day personal baseline for each metric from the user's history.
2. **Z-score / percentile** — for each reading, compute how far it deviates from the user's baseline.
3. **Weight and blend** — e.g. HRV 50%, RHR 25%, sleep 15%, RR 10%.
4. **Clamp and scale** — output a 0–100 value where 100 = highest relative stress for that user.
5. **Confidence** — reduce `confidence` when inputs are missing or stale (>24h).

### Proposed architecture

```
supabase/functions/stress-derivation-engine/
├── index.ts          # HTTP entry point (service_role / Edge Function caller)
├── derive.ts         # core algorithm
├── baseline.ts       # rolling baseline calculation
├── normalize.ts      # scale/direction helpers
└── tests/            # unit tests run with Deno test runner
```

### Unit test cases to include

- Baseline calculation with missing days.
- Direction inversion for readiness/recovery inputs.
- Confidence reduction when HRV is >24h old.
- Clamp to 0–100 boundary.
- Same raw values produce different stress scores for different baselines.
- Fallback to population defaults when baseline window is insufficient.

### Where it would be called

- Pre-breathing session: fetch latest health data → run engine → store `pre` reading.
- Post-breathing session: optionally re-run to measure immediate HRV shift.
- Background sync: update today's stress estimate when new health data arrives.

---

## 5. Security and implementation notes

- **Never store OAuth client secrets or refresh tokens in the mobile app.** Use a Supabase Edge Function for token exchange, refresh, and API calls.
- **Expected table:** `public.user_tracker_connections` with RLS so users can only see their own row.
- **OAuth flow:**
  1. App opens system browser to provider OAuth URL.
  2. Provider redirects to a deep-link handler (`app.lovable.d3590b81c81449329e6d4fbda085725b://oauth`).
  3. Edge Function exchanges code for tokens and stores them encrypted.
- **Health Connect / Apple Health** are on-device and do not need a backend, but they do need native permission prompts and a Capacitor bridge.
- Always set `derivedFrom` and `sourceApp` so users can see where a score came from.

---

## 6. Quick decision matrix

| Tracker | Effort | Stress signal quality | Recommended priority |
|---|---|---|---|
| Manual | None | User-defined | Already shipped |
| Health Connect | Medium (Android native) | Derived | High — primary Android path |
| Apple Health | Medium (iOS native) | Derived | High — primary iOS path |
| Fitbit | High (OAuth + scope stability) | Native + derived | Medium |
| Garmin | Very high (partner approval) | Native + derived | Low |
| WHOOP | High (OAuth) | Derived | Medium |
| Oura | High (OAuth) | Derived | Medium |
| Polar | High (OAuth + rate limits) | Derived | Low |
