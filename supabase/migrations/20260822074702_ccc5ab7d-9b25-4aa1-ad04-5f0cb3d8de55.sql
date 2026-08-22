CREATE OR REPLACE FUNCTION public.protect_subscription_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Trusted server-side roles (edge functions using the service role, or
  -- direct admin/postgres access) are allowed to write subscription state.
  IF current_user IN ('service_role', 'supabase_admin', 'postgres')
     OR coalesce(current_setting('request.jwt.claim.role', true), '') = 'service_role'
     OR coalesce(current_setting('request.jwt.claims', true)::json->>'role', '') = 'service_role'
  THEN
    RETURN NEW;
  END IF;

  NEW.is_subscribed := OLD.is_subscribed;
  NEW.subscription_expires_at := OLD.subscription_expires_at;
  NEW.trial_started_at := OLD.trial_started_at;
  NEW.trial_ends_at := OLD.trial_ends_at;
  NEW.subscription_plan := OLD.subscription_plan;
  RETURN NEW;
END;
$$;