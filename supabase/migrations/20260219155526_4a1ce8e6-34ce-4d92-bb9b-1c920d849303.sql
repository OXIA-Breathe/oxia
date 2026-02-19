
-- Create table to persist the last generated wellness reflection per user
CREATE TABLE public.wellness_reflections (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  practice_overview text NOT NULL,
  stress_pattern text NOT NULL,
  emotional_shift text NOT NULL,
  consistency_insight text NOT NULL,
  total_sessions integer NOT NULL DEFAULT 0,
  total_minutes integer NOT NULL DEFAULT 0,
  consistency_days integer NOT NULL DEFAULT 0,
  longest_streak integer NOT NULL DEFAULT 0,
  period text NOT NULL,
  generated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.wellness_reflections ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own wellness reflections"
  ON public.wellness_reflections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wellness reflections"
  ON public.wellness_reflections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wellness reflections"
  ON public.wellness_reflections FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wellness reflections"
  ON public.wellness_reflections FOR DELETE
  USING (auth.uid() = user_id);

-- Updated at trigger
CREATE TRIGGER update_wellness_reflections_updated_at
  BEFORE UPDATE ON public.wellness_reflections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
