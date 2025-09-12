-- Add RLS DELETE policies so users can fully reset their data

-- Allow users to delete their own achievements
CREATE POLICY IF NOT EXISTS "Users can delete their own achievements"
ON public.user_achievements
FOR DELETE
USING (auth.uid() = user_id);

-- Allow users to delete their own exercise completions
CREATE POLICY IF NOT EXISTS "Users can delete their own exercise completions"
ON public.user_exercise_completions
FOR DELETE
USING (auth.uid() = user_id);

-- Allow users to delete their own daily activity rows
CREATE POLICY IF NOT EXISTS "Users can delete their own daily activity"
ON public.daily_activity
FOR DELETE
USING (auth.uid() = user_id);
