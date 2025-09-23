import { useRef, useEffect } from 'react';

export const useCountdownSound = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const playCountdownBeep = () => {
    try {
      // Create a simple beep sound using Web Audio API for a gentle countdown
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Gentle, soft beep sound
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
      oscillator.type = 'sine';
      
      // Soft envelope for gentle sound
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.4);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.4);

    } catch (error) {
      console.error('Failed to play countdown beep:', error);
    }
  };

  const startCountdownBeeps = () => {
    let count = 0;
    intervalRef.current = setInterval(() => {
      playCountdownBeep();
      count++;
      if (count >= 3) {
        stopCountdownBeeps();
      }
    }, 1000);
  };

  const stopCountdownBeeps = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCountdownBeeps();
    };
  }, []);

  return {
    playCountdownBeep,
    startCountdownBeeps,
    stopCountdownBeeps
  };
};