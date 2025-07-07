
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
  const isPlayingRef = useRef<boolean>(false);

  // Create a precise voice trigger function
  const triggerVoicePrompt = (currentPhase: "inhale" | "exhale" | "hold1" | "hold2") => {
    if (!isActive || !isSupported || !isReady || isPlayingRef.current) {
      return;
    }

    // Prevent duplicate voice prompts
    if (currentPhase === lastPhaseRef.current) {
      return;
    }

    lastPhaseRef.current = currentPhase;
    isPlayingRef.current = true;

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
      console.log(`Triggering voice prompt: ${voicePrompt} for phase: ${currentPhase}`);
      
      // Try to play cached voice first, fallback to real-time generation
      const played = playVoice(voicePrompt);
      if (!played) {
        // Fallback to real-time generation if cache failed
        speak(voicePrompt);
      }

      // Reset playing flag after a short delay
      setTimeout(() => {
        isPlayingRef.current = false;
      }, 500);
    }
  };

  // Clean up when exercise stops
  useEffect(() => {
    if (!isActive && lastPhaseRef.current !== '') {
      console.log('Cleaning up voice guidance - exercise stopped');
      stopAllVoices();
      stop();
      lastPhaseRef.current = '';
      isPlayingRef.current = false;
    }
  }, [isActive, stop, stopAllVoices]);

  return {
    isVoiceSupported: isSupported,
    isVoiceReady: isReady,
    isVoiceLoading: isLoading,
    stopVoice: () => {
      console.log('Stopping all voice guidance');
      stopAllVoices();
      stop();
      lastPhaseRef.current = '';
      isPlayingRef.current = false;
    },
    triggerVoicePrompt
  };
};
