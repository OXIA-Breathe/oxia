-- Fix the user_achievements INSERT policy to allow system insertions
DROP POLICY "System only can insert achievements" ON user_achievements;

-- Create a new policy that allows insertions for authenticated users
-- This allows the application code to insert achievements for users
CREATE POLICY "Allow authenticated users to insert achievements"
ON user_achievements
FOR INSERT
WITH CHECK (auth.uid() = user_id);