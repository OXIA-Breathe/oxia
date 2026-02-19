
-- Add unique constraint on user_id so upsert onConflict works
ALTER TABLE public.wellness_reflections ADD CONSTRAINT wellness_reflections_user_id_key UNIQUE (user_id);
