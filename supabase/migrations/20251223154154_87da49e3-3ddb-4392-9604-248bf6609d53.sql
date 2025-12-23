
-- Drop old constraints that expect 1-7 range
ALTER TABLE public.emotion_tracking DROP CONSTRAINT IF EXISTS emotion_tracking_pre_arousal_check;
ALTER TABLE public.emotion_tracking DROP CONSTRAINT IF EXISTS emotion_tracking_post_arousal_check;
ALTER TABLE public.emotion_tracking DROP CONSTRAINT IF EXISTS emotion_tracking_pre_valence_check;
ALTER TABLE public.emotion_tracking DROP CONSTRAINT IF EXISTS emotion_tracking_post_valence_check;

-- Add new constraints with correct ranges
-- Valence (mood): 1-7 scale
-- Arousal (stress): 0-100 scale
ALTER TABLE public.emotion_tracking ADD CONSTRAINT emotion_tracking_pre_valence_check CHECK (pre_valence >= 1 AND pre_valence <= 7);
ALTER TABLE public.emotion_tracking ADD CONSTRAINT emotion_tracking_post_valence_check CHECK (post_valence >= 1 AND post_valence <= 7);
ALTER TABLE public.emotion_tracking ADD CONSTRAINT emotion_tracking_pre_arousal_check CHECK (pre_arousal >= 0 AND pre_arousal <= 100);
ALTER TABLE public.emotion_tracking ADD CONSTRAINT emotion_tracking_post_arousal_check CHECK (post_arousal >= 0 AND post_arousal <= 100);
