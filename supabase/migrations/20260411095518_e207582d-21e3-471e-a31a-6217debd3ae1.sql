
-- Table to track anonymous trial sessions by IP + device fingerprint
CREATE TABLE public.anonymous_trials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  device_fingerprint TEXT,
  session_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(ip_address, device_fingerprint)
);

-- No RLS needed - accessed only via service_role from edge function
ALTER TABLE public.anonymous_trials ENABLE ROW LEVEL SECURITY;

-- No public policies - only service_role can access
-- This prevents any client-side manipulation

-- Index for fast lookups
CREATE INDEX idx_anonymous_trials_ip_fingerprint ON public.anonymous_trials (ip_address, device_fingerprint);

-- Trigger for updated_at
CREATE TRIGGER update_anonymous_trials_updated_at
BEFORE UPDATE ON public.anonymous_trials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
