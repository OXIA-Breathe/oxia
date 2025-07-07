
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface VoiceCacheEntry {
  audio: HTMLAudioElement;
  isLoaded: boolean;
}

interface UseVoiceCacheOptions {
  voice?: string;
  volume?: number;
  useElevenLabs?: boolean;
}

export const useVoiceCache = (options: UseVoiceCacheOptions = {}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const cacheRef = useRef<Map<string, VoiceCacheEntry>>(new Map());

  const prompts = ['Breathe in', 'Hold', 'Breathe out'];

  const preGenerateVoices = async () => {
    if (!options.useElevenLabs) {
      setIsReady(true);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const cache = new Map<string, VoiceCacheEntry>();

      // Generate voice prompts sequentially to avoid concurrent request limits
      for (const text of prompts) {
        try {
          console.log(`Generating voice for: "${text}"`);
          
          const { data, error } = await supabase.functions.invoke('text-to-speech', {
            body: { 
              text, 
              voice: options.voice || 'Aria'
            }
          });

          if (error || !data?.audioData) {
            console.error(`Failed to generate voice for "${text}":`, error);
            // Create fallback entry
            cache.set(text, {
              audio: new Audio(), // Empty audio as fallback
              isLoaded: false
            });
            continue;
          }

          // Create audio from base64 data
          const audioBlob = new Blob(
            [Uint8Array.from(atob(data.audioData), c => c.charCodeAt(0))],
            { type: 'audio/mpeg' }
          );
          const audioUrl = URL.createObjectURL(audioBlob);
          
          const audio = new Audio(audioUrl);
          audio.volume = options.volume || 0.8;
          
          // Preload the audio
          await new Promise<void>((resolve, reject) => {
            audio.oncanplaythrough = () => resolve();
            audio.onerror = () => reject(new Error('Audio load failed'));
            audio.load();
          });

          cache.set(text, {
            audio,
            isLoaded: true
          });

          console.log(`Successfully cached voice for: "${text}"`);

        } catch (error) {
          console.error(`Failed to generate voice for "${text}":`, error);
          // Create fallback entry
          cache.set(text, {
            audio: new Audio(), // Empty audio as fallback
            isLoaded: false
          });
        }

        // Add a small delay between requests to be respectful to the API
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      cacheRef.current = cache;
      setIsReady(true);

    } catch (error) {
      console.error('Voice cache initialization failed:', error);
      setIsReady(false);
    } finally {
      setIsLoading(false);
    }
  };

  const playVoice = (text: string) => {
    const cacheEntry = cacheRef.current.get(text);
    if (cacheEntry && cacheEntry.isLoaded) {
      // Reset and play the cached audio
      cacheEntry.audio.currentTime = 0;
      cacheEntry.audio.play().catch(error => {
        console.error('Failed to play cached voice:', error);
      });
      return true;
    }
    return false;
  };

  const stopAllVoices = () => {
    cacheRef.current.forEach(entry => {
      if (entry.audio) {
        entry.audio.pause();
        entry.audio.currentTime = 0;
      }
    });
  };

  // Initialize cache when options change
  useEffect(() => {
    if (options.useElevenLabs !== false) {
      preGenerateVoices();
    } else {
      setIsReady(true);
      setIsLoading(false);
    }

    // Cleanup function
    return () => {
      cacheRef.current.forEach(entry => {
        if (entry.audio.src) {
          URL.revokeObjectURL(entry.audio.src);
        }
      });
      cacheRef.current.clear();
    };
  }, [options.voice, options.useElevenLabs]);

  return {
    isLoading,
    isReady,
    playVoice,
    stopAllVoices,
    preGenerateVoices
  };
};
