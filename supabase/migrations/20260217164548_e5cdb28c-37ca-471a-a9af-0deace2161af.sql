
-- Allow users to delete their own profile
CREATE POLICY "Users can delete their own profile"
ON public.profiles
FOR DELETE
USING (auth.uid() = id);

-- Allow users to delete their own notification settings
CREATE POLICY "Users can delete their own notification settings"
ON public.notification_settings
FOR DELETE
USING (auth.uid() = user_id);

-- Allow users to delete their own streaks
CREATE POLICY "Users can delete their own streaks"
ON public.user_streaks
FOR DELETE
USING (auth.uid() = user_id);
