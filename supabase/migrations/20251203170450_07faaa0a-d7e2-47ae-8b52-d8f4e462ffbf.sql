-- Create emotion_tracking table
CREATE TABLE public.emotion_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_id UUID REFERENCES public.breath_sessions(id) ON DELETE CASCADE,
  pre_valence INTEGER CHECK (pre_valence >= 1 AND pre_valence <= 7),
  pre_arousal INTEGER CHECK (pre_arousal >= 1 AND pre_arousal <= 7),
  post_valence INTEGER CHECK (post_valence >= 1 AND post_valence <= 7),
  post_arousal INTEGER CHECK (post_arousal >= 1 AND post_arousal <= 7),
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.emotion_tracking ENABLE ROW LEVEL SECURITY;

-- RLS policies for emotion_tracking
CREATE POLICY "Users can view their own emotion tracking"
ON public.emotion_tracking
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own emotion tracking"
ON public.emotion_tracking
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own emotion tracking"
ON public.emotion_tracking
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own emotion tracking"
ON public.emotion_tracking
FOR DELETE
USING (auth.uid() = user_id);

-- Add subscription-related columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN emotion_tracking_enabled BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN is_subscribed BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN subscription_expires_at TIMESTAMP WITH TIME ZONE;