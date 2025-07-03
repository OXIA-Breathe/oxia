
import { useEffect, useRef } from 'react';
import { useTextToSpeech } from './useTextToSpeech';
import { useVoiceCache } from './useVoiceCache';

interface UseBreathingVoiceProps {
  phase: "inhale" | "exhale" | "hold1" | "hold2" | "idle";
  isActive: boolean;
  exerciseTitle?: string;
}

export const useBreathingVoice = ({ phase, isActive, exerciseTitle }: UseBreathingVoiceProps) => {
  const { speak, stop, isSupported } = useTextToSpeech({
    voice: 'Aria',
    volume: 0.8,
    useElevenLabs: true
  });

  const { isLoading, isReady, playVoice, stopAllVoices } = useVoiceCache({
    voice: 'Aria',
    volume: 0.8,
    useElevenLabs: true
  });
  
  const lastPhaseRef = useRef<string>('');

  useEffect(() => {
    // Only speak if the exercise is active and phase has changed
    if (!isActive || !isSupported || phase === 'idle' || !isReady) {
      return;
    }

    // Check if this is a new phase and announce immediately
    if (phase !== lastPhaseRef.current) {
      lastPhaseRef.current = phase;
      
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
        // Try to play cached voice first, fallback to real-time generation
        const played = playVoice(voicePrompt);
        if (!played) {
          // Fallback to real-time generation if cache failed
          speak(voicePrompt);
        }
      }
    }
  }, [phase, isActive, speak, isSupported, isReady, playVoice]);

  // Clean up when exercise stops
  useEffect(() => {
    if (!isActive && lastPhaseRef.current !== '') {
      stopAllVoices();
      stop();
      lastPhaseRef.current = '';
    }
  }, [isActive, stop, stopAllVoices]);

  return {
    isVoiceSupported: isSupported,
    isVoiceReady: isReady,
    isVoiceLoading: isLoading,
    stopVoice: () => {
      stopAllVoices();
      stop();
    }
  };
};
