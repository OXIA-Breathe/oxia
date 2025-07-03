
import { useEffect, useRef } from 'react';
import { useTextToSpeech } from './useTextToSpeech';

interface UseBreathingVoiceProps {
  phase: "inhale" | "exhale" | "hold1" | "hold2" | "idle";
  isActive: boolean;
  exerciseTitle?: string;
}

export const useBreathingVoice = ({ phase, isActive, exerciseTitle }: UseBreathingVoiceProps) => {
  const { speak, stop, isSupported, isElevenLabsAvailable } = useTextToSpeech({
    voice: 'Aria', // Calming female voice for breathing exercises
    volume: 0.8,
    useElevenLabs: true // Enable ElevenLabs by default
  });
  
  const lastPhaseRef = useRef<string>('');
  const hasAnnouncedPhase = useRef<boolean>(false);

  useEffect(() => {
    // Only speak if the exercise is active and phase has changed
    if (!isActive || !isSupported || phase === 'idle') {
      return;
    }

    // Check if this is a new phase
    if (phase !== lastPhaseRef.current) {
      lastPhaseRef.current = phase;
      hasAnnouncedPhase.current = false;
    }

    // Announce phase immediately when it starts (not announced yet)
    if (!hasAnnouncedPhase.current) {
      hasAnnouncedPhase.current = true;
      
      let voicePrompt = '';
      switch (phase) {
        case 'inhale':
          voicePrompt = 'Breathe in';
          break;
        case 'hold1':
        case 'hold2':
          voicePrompt = 'Hold';
          break;
        case 'exhale':
          voicePrompt = 'Breathe out';
          break;
      }

      if (voicePrompt) {
        speak(voicePrompt);
      }
    }
  }, [phase, isActive, speak, isSupported]);

  // Clean up when exercise stops
  useEffect(() => {
    if (!isActive && lastPhaseRef.current !== '') {
      stop();
      lastPhaseRef.current = '';
      hasAnnouncedPhase.current = false;
    }
  }, [isActive, stop]);

  return {
    isVoiceSupported: isSupported,
    isElevenLabsAvailable,
    stopVoice: stop
  };
};
