
import { useState, useEffect, useMemo, useCallback, useRef } from "react";

interface UseBreathingTimerProps {
  isActive: boolean;
  phase: "inhale" | "exhale" | "hold1" | "hold2" | "idle";
  exerciseSettings: {
    inhaleDuration: number;
    exhaleDuration: number;
    firstHoldDuration: number;
    secondHoldDuration: number;
  };
  onPhaseComplete: (nextPhase: "inhale" | "exhale" | "hold1" | "hold2") => void;
  phaseTimeRemaining: number | null;
  setPhaseTimeRemaining: (time: number | null) => void;
  onVoicePrompt?: (phase: "inhale" | "exhale" | "hold1" | "hold2") => void;
}

export const useBreathingTimer = ({
  isActive,
  phase,
  exerciseSettings,
  onPhaseComplete,
  phaseTimeRemaining,
  setPhaseTimeRemaining,
  onVoicePrompt
}: UseBreathingTimerProps) => {
  const [duration, setDuration] = useState(exerciseSettings.inhaleDuration);
  const [timeRemaining, setTimeRemaining] = useState(exerciseSettings.inhaleDuration);
  const timerRef = useRef<number | null>(null);
  const lastPhaseRef = useRef<string>('');

  // Memoize the exercise settings to prevent infinite re-renders
  const memoizedSettings = useMemo(() => ({
    inhaleDuration: exerciseSettings.inhaleDuration,
    exhaleDuration: exerciseSettings.exhaleDuration,
    firstHoldDuration: exerciseSettings.firstHoldDuration,
    secondHoldDuration: exerciseSettings.secondHoldDuration,
  }), [
    exerciseSettings.inhaleDuration,
    exerciseSettings.exhaleDuration,
    exerciseSettings.firstHoldDuration,
    exerciseSettings.secondHoldDuration,
  ]);

  // Update duration and timeRemaining when phase changes
  useEffect(() => {
    console.log(`Phase changed to: ${phase}`);
    
    let phaseDuration = 0;
    
    switch (phase) {
      case "inhale":
        phaseDuration = memoizedSettings.inhaleDuration;
        break;
      case "hold1":
        phaseDuration = memoizedSettings.firstHoldDuration;
        break;
      case "exhale":
        phaseDuration = memoizedSettings.exhaleDuration;
        break;
      case "hold2":
        phaseDuration = memoizedSettings.secondHoldDuration;
        break;
      default:
        phaseDuration = memoizedSettings.inhaleDuration;
    }
    
    console.log(`Setting phase duration: ${phaseDuration} for phase: ${phase}`);
    setDuration(phaseDuration);
    
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // If we have a saved phase time remaining, use it, otherwise start fresh
    if (phaseTimeRemaining !== null && phase !== "idle") {
      console.log(`Resuming with saved time: ${phaseTimeRemaining}`);
      setTimeRemaining(phaseTimeRemaining);
      setPhaseTimeRemaining(null);
    } else if (phase !== "idle") {
      console.log(`Starting fresh with duration: ${phaseDuration}`);
      setTimeRemaining(phaseDuration);
      
      // Trigger voice prompt when new phase starts (only once per phase)
      if (onVoicePrompt && lastPhaseRef.current !== phase) {
        console.log(`Triggering voice for new phase: ${phase}`);
        lastPhaseRef.current = phase;
        onVoicePrompt(phase);
      }
    }
  }, [phase, memoizedSettings, phaseTimeRemaining, setPhaseTimeRemaining, onVoicePrompt]);

  // Main timer effect
  useEffect(() => {
    // Clear existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (isActive && phase !== "idle" && timeRemaining > 0) {
      console.log(`Starting timer for phase: ${phase}, timeRemaining: ${timeRemaining}`);
      
      timerRef.current = window.setInterval(() => {
        setTimeRemaining((prev) => {
          const newValue = Math.max(0, prev - 0.1);
          console.log(`Timer tick - Phase: ${phase}, Time remaining: ${newValue.toFixed(1)}`);
          
          if (newValue <= 0) {
            console.log(`Phase ${phase} completed, determining next phase`);
            
            let nextPhase: "inhale" | "exhale" | "hold1" | "hold2";
            
            // Determine next phase
            if (phase === "inhale") {
              nextPhase = memoizedSettings.firstHoldDuration > 0 ? "hold1" : "exhale";
            } else if (phase === "hold1") {
              nextPhase = "exhale";
            } else if (phase === "exhale") {
              nextPhase = memoizedSettings.secondHoldDuration > 0 ? "hold2" : "inhale";
            } else if (phase === "hold2") {
              nextPhase = "inhale";
            } else {
              nextPhase = "inhale";
            }
            
            console.log(`Moving to next phase: ${nextPhase}`);
            setTimeout(() => onPhaseComplete(nextPhase), 0);
          }
          
          return newValue;
        });
      }, 100);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isActive, phase, timeRemaining, onPhaseComplete, memoizedSettings]);

  // Reset phase tracking when exercise stops
  useEffect(() => {
    if (!isActive) {
      lastPhaseRef.current = '';
    }
  }, [isActive]);

  return { duration, timeRemaining };
};
