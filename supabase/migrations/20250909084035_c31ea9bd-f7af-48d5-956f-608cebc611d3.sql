-- Create user_achievements table to track various achievements
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  achievement_id TEXT NOT NULL,
  achievement_type TEXT NOT NULL, -- 'breaths', 'sessions', 'streaks', 'exercises', 'oxia'
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Create user_exercise_completions table to track which exercises users have completed
CREATE TABLE public.user_exercise_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  exercise_id UUID NOT NULL,
  exercise_title TEXT NOT NULL,
  is_custom BOOLEAN NOT NULL DEFAULT false,
  first_completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, exercise_id)
);

-- Enable RLS on both tables
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_exercise_completions ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_achievements - users can only view their achievements, not insert them
CREATE POLICY "Users can view their own achievements" 
ON public.user_achievements 
FOR SELECT 
USING (auth.uid() = user_id);

-- Only system/service role can insert achievements (users cannot insert their own)
-- This policy blocks all user inserts
CREATE POLICY "System only can insert achievements" 
ON public.user_achievements 
FOR INSERT 
WITH CHECK (false);

-- RLS policies for user_exercise_completions
CREATE POLICY "Users can view their own exercise completions" 
ON public.user_exercise_completions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own exercise completions" 
ON public.user_exercise_completions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exercise completions" 
ON public.user_exercise_completions 
FOR UPDATE 
USING (auth.uid() = user_id);