
import React, { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseTextToSpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: string;
  useElevenLabs?: boolean;
}

export const useTextToSpeech = (options: UseTextToSpeechOptions = {}) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isElevenLabsAvailable, setIsElevenLabsAvailable] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Check if speech synthesis is supported
  React.useEffect(() => {
    if ('speechSynthesis' in window) {
      setIsSupported(true);
    }
  }, []);

  const speakWithElevenLabs = useCallback(async (text: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { 
          text, 
          voice: options.voice || 'Aria'
        }
      });

      if (error) {
        console.error('ElevenLabs error:', error);
        throw error;
      }

      if (data?.audioData) {
        // Create audio from base64 data
        const audioBlob = new Blob(
          [Uint8Array.from(atob(data.audioData), c => c.charCodeAt(0))],
          { type: 'audio/mpeg' }
        );
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Create and play audio
        const audio = new Audio(audioUrl);
        audio.volume = options.volume || 0.8;
        
        audioRef.current = audio;
        
        audio.onloadstart = () => setIsSpeaking(true);
        audio.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };
        audio.onerror = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          throw new Error('Audio playback failed');
        };

        await audio.play();
        return true;
      }
      
      throw new Error('No audio data received');
    } catch (error) {
      console.error('ElevenLabs TTS failed:', error);
      setIsElevenLabsAvailable(false);
      return false;
    }
  }, [options]);

  const speakWithBrowserTTS = useCallback((text: string) => {
    if (!isSupported || !text) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice settings
    utterance.rate = options.rate || 0.9;
    utterance.pitch = options.pitch || 1.1;
    utterance.volume = options.volume || 0.8;

    // Set voice if specified
    if (options.voice) {
      const voices = window.speechSynthesis.getVoices();
      const selectedVoice = voices.find(voice => voice.name.includes(options.voice!));
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [isSupported, options]);

  const speak = useCallback(async (text: string) => {
    if (!text) return;

    // Try ElevenLabs first (if available and not disabled)
    if (options.useElevenLabs !== false && isElevenLabsAvailable) {
      const success = await speakWithElevenLabs(text);
      if (success) return;
    }

    // Fallback to browser TTS
    speakWithBrowserTTS(text);
  }, [speakWithElevenLabs, speakWithBrowserTTS, options.useElevenLabs, isElevenLabsAvailable]);

  const stop = useCallback(() => {
    // Stop ElevenLabs audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Stop browser TTS
    if (isSupported) {
      window.speechSynthesis.cancel();
    }
    
    setIsSpeaking(false);
  }, [isSupported]);

  const pause = useCallback(() => {
    // Pause ElevenLabs audio
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      return;
    }

    // Pause browser TTS
    if (isSupported && isSpeaking) {
      window.speechSynthesis.pause();
    }
  }, [isSupported, isSpeaking]);

  const resume = useCallback(() => {
    // Resume ElevenLabs audio
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play();
      return;
    }

    // Resume browser TTS
    if (isSupported) {
      window.speechSynthesis.resume();
    }
  }, [isSupported]);

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    isSupported: isSupported || isElevenLabsAvailable,
    isElevenLabsAvailable
  };
};
