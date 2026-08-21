-- Add trial and plan columns to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS trial_started_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS trial_ends_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS subscription_plan text;

-- Update trigger to protect all subscription/trial fields from client updates
CREATE OR REPLACE FUNCTION public.protect_subscription_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  NEW.is_subscribed := OLD.is_subscribed;
  NEW.subscription_expires_at := OLD.subscription_expires_at;
  NEW.trial_started_at := OLD.trial_started_at;
  NEW.trial_ends_at := OLD.trial_ends_at;
  NEW.subscription_plan := OLD.subscription_plan;
  RETURN NEW;
END;
$$;

-- Helper: is the user currently premium (active subscription or active trial)?
CREATE OR REPLACE FUNCTION public.is_premium(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id
      AND (
        (is_subscribed = true AND (subscription_expires_at IS NULL OR subscription_expires_at > now()))
        OR (trial_started_at IS NOT NULL AND trial_ends_at IS NOT NULL AND now() BETWEEN trial_started_at AND trial_ends_at)
      )
  )
$$;

GRANT EXECUTE ON FUNCTION public.is_premium(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_premium(uuid) TO service_role;

-- Premium tables: only premium users can create new records
DROP POLICY IF EXISTS "Users can insert their own emotion tracking" ON public.emotion_tracking;
CREATE POLICY "Users can insert their own emotion tracking"
ON public.emotion_tracking
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND public.is_premium(auth.uid()));

DROP POLICY IF EXISTS "Users can insert their own wellness reflections" ON public.wellness_reflections;
CREATE POLICY "Users can insert their own wellness reflections"
ON public.wellness_reflections
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND public.is_premium(auth.uid()));