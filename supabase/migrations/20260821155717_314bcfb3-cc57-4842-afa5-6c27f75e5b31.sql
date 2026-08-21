CREATE TABLE public.subscription_webhook_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider TEXT NOT NULL,
  event_key TEXT NOT NULL,
  event_type TEXT,
  trace_id TEXT,
  user_id UUID,
  payload JSONB,
  status TEXT NOT NULL DEFAULT 'received',
  error_message TEXT,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX subscription_webhook_events_provider_event_key_idx
  ON public.subscription_webhook_events (provider, event_key);

GRANT ALL ON public.subscription_webhook_events TO service_role;

ALTER TABLE public.subscription_webhook_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No client access to subscription webhook events"
  ON public.subscription_webhook_events
  FOR ALL
  USING (false)
  WITH CHECK (false);