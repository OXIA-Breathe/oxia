
CREATE TABLE public.user_custom_exercises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  detailed_description TEXT,
  inhale_duration INTEGER NOT NULL,
  first_hold_duration INTEGER NOT NULL,
  exhale_duration INTEGER NOT NULL,
  second_hold_duration INTEGER NOT NULL,
  repetitions INTEGER NOT NULL,
  step_by_step_instructions TEXT[],
  when_to_use TEXT[],
  how_it_helps TEXT,
  common_mistakes TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_custom_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own custom exercises"
ON public.user_custom_exercises FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own custom exercises"
ON public.user_custom_exercises FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own custom exercises"
ON public.user_custom_exercises FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own custom exercises"
ON public.user_custom_exercises FOR DELETE
USING (auth.uid() = user_id);

CREATE TRIGGER update_user_custom_exercises_updated_at
BEFORE UPDATE ON public.user_custom_exercises
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
