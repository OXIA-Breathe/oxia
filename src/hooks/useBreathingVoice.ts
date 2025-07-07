
import { useEffect, useRef, useCallback } from 'react';
import { useTextToSpeech } from './useTextToSpeech';
import { useVoiceCache } from './useVoiceCache';

interface UseBreathingVoiceProps {
  phase: "inhale" | "exhale" | "hold1" | "hold2" | "idle";
  isActive: boolean;
  exerciseTitle?: string;
  onPhaseStart?: (phase: "inhale" | "exhale" | "hold1" | "hold2") => void;
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
  const voiceTimeoutRef = useRef<number | null>(null);

  // Create a precise voice trigger function
  const triggerVoicePrompt = useCallback((currentPhase: "inhale" | "exhale" | "hold1" | "hold2") => {
    if (!isActive || !isSupported || !isReady) {
      return;
    }

    // Clear any pending voice prompts
    if (voiceTimeoutRef.current) {
      clearTimeout(voiceTimeoutRef.current);
      voiceTimeoutRef.current = null;
    }

    let voicePrompt = '';
    switch (currentPhase) {
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
  }, [isActive, isSupported, isReady, playVoice, speak]);

  // Handle immediate voice prompts when phase changes
  useEffect(() => {
    // Only speak if the exercise is active and phase has changed
    if (!isActive || phase === 'idle' || phase === lastPhaseRef.current) {
      return;
    }

    lastPhaseRef.current = phase;
    
    // Trigger voice prompt immediately with no delay
    triggerVoicePrompt(phase);
  }, [phase, isActive, triggerVoicePrompt]);

  // Clean up when exercise stops
  useEffect(() => {
    if (!isActive && lastPhaseRef.current !== '') {
      // Clear any pending voice prompts
      if (voiceTimeoutRef.current) {
        clearTimeout(voiceTimeoutRef.current);
        voiceTimeoutRef.current = null;
      }
      
      stopAllVoices();
      stop();
      lastPhaseRef.current = '';
    }
  }, [isActive, stop, stopAllVoices]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (voiceTimeoutRef.current) {
        clearTimeout(voiceTimeoutRef.current);
      }
    };
  }, []);

  return {
    isVoiceSupported: isSupported,
    isVoiceReady: isReady,
    isVoiceLoading: isLoading,
    stopVoice: () => {
      if (voiceTimeoutRef.current) {
        clearTimeout(voiceTimeoutRef.current);
        voiceTimeoutRef.current = null;
      }
      stopAllVoices();
      stop();
    },
    triggerVoicePrompt
  };
};
