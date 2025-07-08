
import { useEffect, useRef, useState } from 'react';

interface StaticAudioEntry {
  audio: HTMLAudioElement;
  isLoaded: boolean;
}

interface UseStaticAudioOptions {
  volume?: number;
}

export const useStaticAudio = (options: UseStaticAudioOptions = {}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const cacheRef = useRef<Map<string, StaticAudioEntry>>(new Map());

  const audioFiles = {
    'Breathe in': '/audio/breathe-in.mp3',
    'Hold': '/audio/hold.mp3',
    'Breathe out': '/audio/breathe-out.mp3'
  };

  const preloadAudioFiles = async () => {
    try {
      setIsLoading(true);
      const cache = new Map<string, StaticAudioEntry>();

      for (const [text, filePath] of Object.entries(audioFiles)) {
        try {
          console.log(`Loading audio file for: "${text}"`);
          
          const audio = new Audio(filePath);
          audio.volume = options.volume || 0.8;
          audio.preload = 'auto';
          
          // Preload the audio
          await new Promise<void>((resolve, reject) => {
            audio.oncanplaythrough = () => resolve();
            audio.onerror = () => reject(new Error(`Failed to load audio: ${filePath}`));
            audio.load();
          });

          cache.set(text, {
            audio,
            isLoaded: true
          });

          console.log(`Successfully loaded audio for: "${text}"`);

        } catch (error) {
          console.error(`Failed to load audio for "${text}":`, error);
          // Create fallback entry
          cache.set(text, {
            audio: new Audio(), // Empty audio as fallback
            isLoaded: false
          });
        }
      }

      cacheRef.current = cache;
      setIsReady(true);

    } catch (error) {
      console.error('Audio preloading failed:', error);
      setIsReady(false);
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = (text: string) => {
    const cacheEntry = cacheRef.current.get(text);
    if (cacheEntry && cacheEntry.isLoaded) {
      // Reset and play the cached audio
      cacheEntry.audio.currentTime = 0;
      cacheEntry.audio.play().catch(error => {
        console.error('Failed to play audio:', error);
      });
      return true;
    }
    return false;
  };

  const stopAllAudio = () => {
    cacheRef.current.forEach(entry => {
      if (entry.audio) {
        entry.audio.pause();
        entry.audio.currentTime = 0;
      }
    });
  };

  // Initialize audio cache
  useEffect(() => {
    preloadAudioFiles();

    // Cleanup function
    return () => {
      cacheRef.current.forEach(entry => {
        if (entry.audio.src) {
          entry.audio.src = '';
        }
      });
      cacheRef.current.clear();
    };
  }, [options.volume]);

  return {
    isLoading,
    isReady,
    playAudio,
    stopAllAudio,
    preloadAudioFiles
  };
};
