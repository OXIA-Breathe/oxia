CREATE TABLE public.account_deletion_audit (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  user_email text,
  ip_address text,
  user_agent text,
  status text NOT NULL DEFAULT 'requested',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT ALL ON public.account_deletion_audit TO service_role;

ALTER TABLE public.account_deletion_audit ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_account_deletion_audit_user_id ON public.account_deletion_audit (user_id);