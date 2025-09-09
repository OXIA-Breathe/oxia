-- Fix RLS policies for user_achievements table
-- Drop the current insert policy that allows users to insert their own achievements
DROP POLICY IF EXISTS "Users can insert their own achievements" ON public.user_achievements;

-- Create a more restrictive policy that only allows system/service role to insert
-- Users can only view their achievements, not insert them
CREATE POLICY "System can insert achievements" 
ON public.user_achievements 
FOR INSERT 
WITH CHECK (false); -- No one can insert via normal user auth

-- Allow service role to insert (for system-generated achievements)
ALTER TABLE public.user_achievements FORCE ROW LEVEL SECURITY;