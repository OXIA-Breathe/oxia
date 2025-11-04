-- Update handle_new_user function to create default notification schedules
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', new.email));
  
  INSERT INTO public.notification_settings (user_id, enabled, frequency)
  VALUES (new.id, false, 3);
  
  INSERT INTO public.user_streaks (user_id)
  VALUES (new.id);
  
  INSERT INTO public.daily_activity (user_id)
  VALUES (new.id);
  
  -- Insert 3 default notification schedules
  -- Morning reset at 7:30 AM, every day
  INSERT INTO public.notification_schedules (user_id, title, time, days)
  VALUES (new.id, 'Morning reset', '07:30:00', ARRAY[0,1,2,3,4,5,6]);
  
  -- Midday pause at 1:30 PM, every day
  INSERT INTO public.notification_schedules (user_id, title, time, days)
  VALUES (new.id, 'Midday pause', '13:30:00', ARRAY[0,1,2,3,4,5,6]);
  
  -- Evening unwind at 8:30 PM, every day
  INSERT INTO public.notification_schedules (user_id, title, time, days)
  VALUES (new.id, 'Evening unwind', '20:30:00', ARRAY[0,1,2,3,4,5,6]);
  
  RETURN new;
END;
$function$;