-- Update all existing breathing exercises to be non-custom (system exercises)
UPDATE breathing_exercises 
SET is_custom = false
WHERE title IN (
  'Box Breathing',
  '4-7-8 Breathing', 
  'Pursed Lip Breathing',
  'Diaphragmatic Breathing',
  'Breath Focus Technique',
  'Lion''s Breath',
  'Alternate Nostril Breathing',
  'Equal Breathing',
  'Sitali Breath',
  'Bee Breath',
  'Dirga Pranayama'
);