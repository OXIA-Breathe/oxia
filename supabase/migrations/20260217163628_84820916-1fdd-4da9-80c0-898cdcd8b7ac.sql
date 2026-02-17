
-- P0 Fix 1: Restrict breathing_exercises INSERT to service_role only
DROP POLICY IF EXISTS "System can create breathing exercises" ON public.breathing_exercises;

CREATE POLICY "Only service_role can create breathing exercises"
ON public.breathing_exercises
FOR INSERT
WITH CHECK (false);

-- P0 Fix 2: Prevent users from modifying subscription fields via client-side updates
CREATE OR REPLACE FUNCTION public.protect_subscription_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Always preserve the old subscription values on user-initiated updates
  -- Only service_role (server-side) can modify these via direct DB access
  NEW.is_subscribed := OLD.is_subscribed;
  NEW.subscription_expires_at := OLD.subscription_expires_at;
  RETURN NEW;
END;
$$;

CREATE TRIGGER protect_subscription_on_update
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.protect_subscription_fields();
