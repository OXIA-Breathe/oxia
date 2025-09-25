import { useRef, useEffect } from 'react';

export const useCountdownSound = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playCountdownTick = () => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio('/audio/countdown-tick.wav');
        audioRef.current.volume = 0.6;
      }
      
      // Reset audio to beginning and play
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => {
        console.error('Failed to play countdown tick:', error);
      });
    } catch (error) {
      console.error('Failed to play countdown tick:', error);
    }
  };

  const startCountdownTicks = () => {
    let count = 0;
    intervalRef.current = setInterval(() => {
      playCountdownTick();
      count++;
      if (count >= 3) {
        stopCountdownTicks();
      }
    }, 1000);
  };

  const stopCountdownTicks = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCountdownTicks();
    };
  }, []);

  return {
    playCountdownTick,
    startCountdownTicks,
    stopCountdownTicks
  };
};