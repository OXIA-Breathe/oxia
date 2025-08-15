-- Add step_by_step_instructions column to breathing_exercises table
ALTER TABLE public.breathing_exercises 
ADD COLUMN step_by_step_instructions TEXT[];

-- Update existing exercises with step-by-step instructions
UPDATE public.breathing_exercises 
SET step_by_step_instructions = ARRAY[
  'Sit or stand tall; relax jaw/shoulders.',
  'Inhale through the nose for 4.',
  'Hold gently for 4 (no strain).',
  'Exhale softly for 4 (nose or lips).',
  'Hold again for 4.',
  'Repeat, keeping the box smooth and unhurried.'
]
WHERE slug = 'box-breathing';

UPDATE public.breathing_exercises 
SET step_by_step_instructions = ARRAY[
  'Sit comfortably with your back straight.',
  'Inhale quietly through your nose for 4.',
  'Hold your breath for 7.',
  'Exhale completely through your mouth for 8.',
  'This completes one cycle.',
  'Repeat for 4 cycles total.'
]
WHERE slug = '4-7-8-breathing';