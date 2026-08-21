## Status check + delete-account audit trail

### What is already applied

Redesign: new palette tokens (Quartz/Glacier/Lapis/Abyss) are in `src/index.css`, and Plus Jakarta Sans is installed and imported in `src/main.tsx`.

Delete account flow (`src/components/profile/ProfileActions.tsx`) — all five items are in place:
- Radix `AlertDialog` with focus trap, ESC guarded while deleting, `aria-labelledby` / `aria-describedby` / `aria-invalid`
- Type-to-confirm "DELETE" input, action button disabled until it matches
- Explicit "Cancel — keep my account" button that only closes the dialog
- On success: toast, then `signOut()`, then `navigate("/", { replace: true })`
- "Request received" toast fires immediately on submit

Edge function (`supabase/functions/delete-user-account/index.ts`): origin-locked CORS, `getUser()` JWT validation, service-role deletion, no user-ID logging.

### What is missing

1. No audit logging in the edge function — nothing is written before deletion.
2. No `account_deletion_audit` table (confirmed: it does not exist in the database) and no migration file for it.

### Plan

**1. Create the audit table via migration**

`account_deletion_audit` with: `id uuid pk`, `user_id uuid`, `user_email text`, `ip_address text`, `user_agent text`, `status text`, `created_at timestamptz default now()`.

Security: grants to `service_role` only (no `anon`/`authenticated` grants), RLS enabled with no permissive user policies, so the table is reachable only from the edge function. This keeps deletion records intact after the user row is gone (no FK to `auth.users`).

**2. Write the audit row in the edge function**

After `getUser()` succeeds and before `admin.deleteUser()`, insert a row using the service-role client with `status: 'requested'`, capturing `user.email`, `x-forwarded-for` (first hop) and `user-agent`. After the delete resolves, update the row to `completed` or `failed`. Audit insert failures must never block the deletion — wrap in try/catch.

### Notes

The migration runs against the connected Supabase project (`phhyfmztzgkorxhasyaw`) through the migration tool, so no manual SQL-editor step is needed here. If you also want the table in the remix project, run the same SQL there manually.
