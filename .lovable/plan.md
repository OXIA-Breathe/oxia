

## Authentication Audit Fix Plan

### Fix Order (by risk and effort)

**1. Fix branding on Reset Password page**
Change "Breathify" to "OXIA" in `src/pages/ResetPasswordPage.tsx`. Remove unused `useSearchParams` import. Quick win, no risk.

**2. Remove duplicate RLS policies on `breath_sessions`**
Drop the redundant INSERT and SELECT policies (two identical pairs exist). Database migration, low risk.

**3. Remove production logging of user IDs in `delete-user-account`**
Strip `console.log` lines that output `userId` from `supabase/functions/delete-user-account/index.ts`. Per your security architecture memory, sensitive data must not be logged.

**4. Restrict CORS in `delete-user-account`**
Replace `Access-Control-Allow-Origin: *` with the actual app domain. Prevents cross-origin abuse of the deletion endpoint.

**5. Fix `delete-user-account` auth — replace `getClaims` with `getUser`**
`getClaims` is not a standard Supabase JS method. Replace with `supabase.auth.getUser()` which properly validates the JWT server-side. This is a correctness bug that could cause the function to fail entirely.

**6. Strengthen password policy**
Update minimum length from 6 to 8 characters in both `ResetPasswordPage.tsx` and `ChangePasswordModal.tsx`. Add complexity hints (uppercase, number). Low effort, meaningful security improvement.

**7. Harden the trial counter (longer-term)**
`useTrialCounter.ts` uses `localStorage` only — trivially bypassed. This requires a backend-backed solution if the trial limit is meant to be enforced. Flag for future work unless it's a priority now.

### Technical Details

- Steps 1, 3, 4, 5, 6 are code-only changes (no migrations)
- Step 2 requires a database migration to drop duplicate policies
- Step 7 requires architectural discussion before implementation

