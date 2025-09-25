
import { useEffect, useRef } from 'react';
import { useStaticAudio } from './useStaticAudio';

interface UseBreathingVoiceProps {
  phase: "inhale" | "exhale" | "hold1" | "hold2" | "idle";
  isActive: boolean;
  exerciseTitle?: string;
}

export const useBreathingVoice = ({ phase, isActive, exerciseTitle }: UseBreathingVoiceProps) => {
  // Get voice selection from localStorage
  const audioSettings = JSON.parse(localStorage.getItem('audioSettings') || '{}');
  const selectedVoice = audioSettings.voiceGuidance?.selected || 'kristo';
  
  console.log(`🎙️ Voice hook initialized - Selected voice: ${selectedVoice}, Phase: ${phase}, Active: ${isActive}`);
  
  const { isLoading, isReady, playAudio, stopAllAudio } = useStaticAudio({
    volume: 0.8,
    selectedVoice
  });
  
  const lastPhaseRef = useRef<string>('');
  const isPlayingRef = useRef<boolean>(false);

  // Create a precise voice trigger function
  const triggerVoicePrompt = (currentPhase: "inhale" | "exhale" | "hold1" | "hold2") => {
    console.log(`🎙️ Voice trigger called - Phase: ${currentPhase}, Active: ${isActive}, Ready: ${isReady}, Playing: ${isPlayingRef.current}`);
    
    if (!isActive || !isReady || isPlayingRef.current) {
      console.log(`🎙️ Voice trigger blocked - Active: ${isActive}, Ready: ${isReady}, Playing: ${isPlayingRef.current}`);
      return;
    }

    // Prevent duplicate voice prompts
    if (currentPhase === lastPhaseRef.current) {
      console.log(`🎙️ Voice trigger skipped - same phase as last: ${currentPhase}`);
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
        voicePrompt = selectedVoice === 'mila' ? 'Hold' : 'Hold';
        break;
      case 'hold2':
        voicePrompt = selectedVoice === 'mila' ? 'Hold2' : 'Hold';
        break;
      case 'exhale':
        voicePrompt = 'Breathe out';
        break;
    }

    if (voicePrompt) {
      console.log(`Playing audio prompt: ${voicePrompt} for phase: ${currentPhase}`);
      
      const played = playAudio(voicePrompt);
      if (!played) {
        console.warn(`Failed to play audio for: ${voicePrompt}`);
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
      stopAllAudio();
      lastPhaseRef.current = '';
      isPlayingRef.current = false;
    }
  }, [isActive, stopAllAudio]);

  return {
    isVoiceSupported: true, // Always supported with static files
    isVoiceReady: isReady,
    isVoiceLoading: isLoading,
    stopVoice: () => {
      console.log('Stopping all voice guidance');
      stopAllAudio();
      lastPhaseRef.current = '';
      isPlayingRef.current = false;
    },
    triggerVoicePrompt
  };
};
