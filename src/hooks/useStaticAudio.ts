
import { useEffect, useRef, useState } from 'react';

interface StaticAudioEntry {
  audio: HTMLAudioElement;
  isLoaded: boolean;
}

interface UseStaticAudioOptions {
  volume?: number;
  selectedVoice?: string;
}

export const useStaticAudio = (options: UseStaticAudioOptions = {}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const cacheRef = useRef<Map<string, StaticAudioEntry>>(new Map());

  const getAudioFiles = (selectedVoice: string = 'kristo') => {
    if (selectedVoice === 'mila') {
      return {
        'Breathe in': '/audio/voices/mila/breath_in_mila.wav',
        'Hold': '/audio/voices/mila/hold_1_mila.wav',
        'Hold2': '/audio/voices/mila/hold_2_mila.wav',
        'Breathe out': '/audio/voices/mila/breath_out_mila.wav'
      };
    }
    
    // Default to kristo voice files (or fallback)
    return {
      'Breathe in': '/audio/voices/kristo/breathe-in.mp3',
      'Hold': '/audio/voices/kristo/hold.mp3',
      'Breathe out': '/audio/voices/kristo/breathe-out.mp3'
    };
  };

  const preloadAudioFiles = async () => {
    try {
      setIsLoading(true);
      const cache = new Map<string, StaticAudioEntry>();
      const audioFiles = getAudioFiles(options.selectedVoice);
      
      console.log(`🎵 Preloading audio files for voice: ${options.selectedVoice}`, audioFiles);

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
    console.log(`🎵 Attempting to play audio: "${text}"`);
    const cacheEntry = cacheRef.current.get(text);
    if (cacheEntry && cacheEntry.isLoaded) {
      console.log(`🎵 Playing cached audio for: "${text}"`);
      // Reset and play the cached audio
      cacheEntry.audio.currentTime = 0;
      cacheEntry.audio.play().catch(error => {
        console.error('Failed to play audio:', error);
      });
      return true;
    } else {
      console.warn(`🎵 Audio not found or not loaded for: "${text}"`, { 
        hasEntry: !!cacheEntry, 
        isLoaded: cacheEntry?.isLoaded,
        availableAudio: Array.from(cacheRef.current.keys())
      });
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
  }, [options.volume, options.selectedVoice]);

  return {
    isLoading,
    isReady,
    playAudio,
    stopAllAudio,
    preloadAudioFiles
  };
};
