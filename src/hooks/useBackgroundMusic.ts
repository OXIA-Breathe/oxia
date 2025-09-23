import { useEffect, useRef, useState } from 'react';

interface UseBackgroundMusicOptions {
  isEnabled: boolean;
  selectedMusic: string;
  volume?: number;
}

export const useBackgroundMusic = (options: UseBackgroundMusicOptions) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const musicFiles = {
    'Cosmic Exploration': '/audio/background/cosmic-exploration.mp3',
    'Gentle Ambient Melodies': '/audio/background/gentle-ambient-melodies.mp3',
    'Meditation Flow': '/audio/background/meditation-flow.mp3',
    'Nature Calm Piano': '/audio/background/nature-calm-piano.mp3',
    'Nature Dreamscape': '/audio/background/nature-dreamscape.mp3',
    'Peaceful Stream': '/audio/background/peaceful-stream.mp3',
    'Silent Universe': '/audio/background/silent-universe.mp3'
  };

  const fadeIn = (audio: HTMLAudioElement, duration: number = 1000) => {
    audio.volume = 0;
    const targetVolume = options.volume || 0.3;
    const steps = 50;
    const stepTime = duration / steps;
    const volumeStep = targetVolume / steps;
    let currentStep = 0;

    const fadeInterval = setInterval(() => {
      if (currentStep >= steps) {
        audio.volume = targetVolume;
        clearInterval(fadeInterval);
        return;
      }
      audio.volume = volumeStep * currentStep;
      currentStep++;
    }, stepTime);
  };

  const fadeOut = (audio: HTMLAudioElement, duration: number = 1000) => {
    const startVolume = audio.volume;
    const steps = 50;
    const stepTime = duration / steps;
    const volumeStep = startVolume / steps;
    let currentStep = 0;

    const fadeInterval = setInterval(() => {
      if (currentStep >= steps) {
        audio.volume = 0;
        audio.pause();
        setIsPlaying(false);
        clearInterval(fadeInterval);
        return;
      }
      audio.volume = startVolume - (volumeStep * currentStep);
      currentStep++;
    }, stepTime);
  };

  const startMusic = async () => {
    console.log('startMusic called with options:', options);
    if (!options.isEnabled || !options.selectedMusic) {
      console.log('Music not enabled or no music selected');
      return;
    }

    const musicPath = musicFiles[options.selectedMusic as keyof typeof musicFiles];
    console.log('Music path for', options.selectedMusic, ':', musicPath);
    if (!musicPath) {
      console.log('No music path found for:', options.selectedMusic);
      return;
    }

    try {
      console.log('Starting to load music:', musicPath);
      setIsLoading(true);
      
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const audio = new Audio(musicPath);
      audio.loop = true;
      audio.preload = 'auto';
      
      await new Promise<void>((resolve, reject) => {
        audio.oncanplaythrough = () => resolve();
        audio.onerror = () => reject(new Error(`Failed to load music: ${musicPath}`));
        audio.load();
      });

      audioRef.current = audio;
      
      console.log('Attempting to play music...');
      await audio.play();
      console.log('Music started playing successfully');
      setIsPlaying(true);
      fadeIn(audio, 1500);

    } catch (error) {
      console.error('Failed to start background music:', error, 'Path:', musicPath);
    } finally {
      setIsLoading(false);
    }
  };

  const stopMusic = () => {
    if (audioRef.current && isPlaying) {
      fadeOut(audioRef.current, 1000);
    }
  };

  const setVolume = (volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return {
    startMusic,
    stopMusic,
    setVolume,
    isLoading,
    isPlaying
  };
};