
import { useEffect, useRef } from 'react';
import { useTextToSpeech } from './useTextToSpeech';

interface UseBreathingVoiceProps {
  phase: "inhale" | "exhale" | "hold1" | "hold2" | "idle";
  isActive: boolean;
  exerciseTitle?: string;
}

export const useBreathingVoice = ({ phase, isActive, exerciseTitle }: UseBreathingVoiceProps) => {
  const { speak, stop, isSupported } = useTextToSpeech({
    rate: 0.9,
    pitch: 1.1,
    volume: 0.7
  });
  
  const lastPhaseRef = useRef<string>('');

  useEffect(() => {
    // Only speak if the exercise is active and phase has changed
    if (!isActive || !isSupported || phase === 'idle' || phase === lastPhaseRef.current) {
      return;
    }

    // Update the last phase
    lastPhaseRef.current = phase;

    // Map phases to voice prompts
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
      // Small delay to ensure smooth transition
      setTimeout(() => {
        speak(voicePrompt);
      }, 100);
    }
  }, [phase, isActive, speak, isSupported]);

  // Clean up when exercise stops
  useEffect(() => {
    if (!isActive && lastPhaseRef.current !== '') {
      stop();
      lastPhaseRef.current = '';
    }
  }, [isActive, stop]);

  // Reset when exercise starts
  useEffect(() => {
    if (isActive && phase === 'inhale' && lastPhaseRef.current === '') {
      // Welcome message when starting
      setTimeout(() => {
        speak(`Starting ${exerciseTitle || 'breathing exercise'}`);
      }, 500);
    }
  }, [isActive, phase, exerciseTitle, speak]);

  return {
    isVoiceSupported: isSupported,
    stopVoice: stop
  };
};
