-- Create breathing exercises table
CREATE TABLE public.breathing_exercises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  inhale_duration INTEGER NOT NULL,
  first_hold_duration INTEGER NOT NULL,
  exhale_duration INTEGER NOT NULL,
  second_hold_duration INTEGER NOT NULL,
  repetitions INTEGER NOT NULL,
  is_custom BOOLEAN NOT NULL DEFAULT false,
  detailed_description TEXT,
  when_to_use TEXT[],
  how_it_helps TEXT,
  common_mistakes TEXT[],
  safety_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.breathing_exercises ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing exercises (public read access)
CREATE POLICY "Anyone can view breathing exercises" 
ON public.breathing_exercises 
FOR SELECT 
USING (true);

-- Create policy for admin/system inserts (for now, allowing inserts for setup)
CREATE POLICY "System can create breathing exercises" 
ON public.breathing_exercises 
FOR INSERT 
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_breathing_exercises_updated_at
BEFORE UPDATE ON public.breathing_exercises
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default breathing exercises
INSERT INTO public.breathing_exercises (
  id, title, description, inhale_duration, first_hold_duration, 
  exhale_duration, second_hold_duration, repetitions, is_custom,
  detailed_description, when_to_use, how_it_helps, common_mistakes, safety_note
) VALUES 
(
  'box-breathing',
  'Box Breathing',
  'Calm and focus',
  4, 4, 4, 4, 6, false,
  'Inhale, hold, exhale, hold — each for the same count. A steady, structured rhythm that calms the nervous system and restores focus.',
  ARRAY['Pre-meeting, public speaking, exam prep', 'Stress spikes, jitters, overthinking', 'Quick reset to clarity'],
  'Even, box-shaped cadence reduces breathing rate and promotes a parasympathetic shift. Brief holds improve CO₂ tolerance and create a sense of control under pressure.',
  ARRAY['Forcing the holds / throat tension', 'Lifting shoulders (chest breathing)', 'Rushing counts; uneven box'],
  'Shorten holds or stop if you feel dizzy or uncomfortable. Follow clinician guidance if you have cardiopulmonary conditions.'
),
(
  '4-7-8-breathing',
  '4-7-8 Breathing',
  'Sleeping and anxiety',
  4, 7, 8, 0, 20, false,
  'A calming technique designed to reduce anxiety and promote sleep.',
  ARRAY['Before sleep', 'During anxiety', 'To calm the mind'],
  'The extended exhale activates the parasympathetic nervous system, promoting relaxation and reducing stress.',
  ARRAY['Holding breath too forcefully', 'Not fully exhaling', 'Rushing the sequence'],
  'Stop if you feel lightheaded. Practice on an empty stomach for best results.'
);