CREATE TABLE public.subscription_receipts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  platform text NOT NULL CHECK (platform IN ('android','ios')),
  product_id text NOT NULL,
  plan text,
  purchase_token text,
  original_transaction_id text,
  latest_transaction_id text,
  expires_at timestamp with time zone,
  is_active boolean NOT NULL DEFAULT true,
  last_event text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX subscription_receipts_android_token_idx ON public.subscription_receipts (purchase_token) WHERE purchase_token IS NOT NULL;
CREATE UNIQUE INDEX subscription_receipts_ios_original_idx ON public.subscription_receipts (original_transaction_id) WHERE original_transaction_id IS NOT NULL;
CREATE INDEX subscription_receipts_user_idx ON public.subscription_receipts (user_id);

GRANT ALL ON public.subscription_receipts TO service_role;

ALTER TABLE public.subscription_receipts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No client access to subscription receipts"
ON public.subscription_receipts
FOR ALL
USING (false)
WITH CHECK (false);

CREATE TRIGGER update_subscription_receipts_updated_at
BEFORE UPDATE ON public.subscription_receipts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();