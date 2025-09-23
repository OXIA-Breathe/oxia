
import { useState, useEffect, useMemo, useCallback, useRef } from "react";

interface UseBreathingTimerProps {
  isActive: boolean;
  phase: "inhale" | "exhale" | "hold1" | "hold2" | "idle" | "countdown";
  exerciseSettings: {
    inhaleDuration: number;
    exhaleDuration: number;
    firstHoldDuration: number;
    secondHoldDuration: number;
  };
  onPhaseComplete: (nextPhase: "inhale" | "exhale" | "hold1" | "hold2" | "countdown") => void;
  phaseTimeRemaining: number | null;
  setPhaseTimeRemaining: (time: number | null) => void;
}

export const useBreathingTimer = ({
  isActive,
  phase,
  exerciseSettings,
  onPhaseComplete,
  phaseTimeRemaining,
  setPhaseTimeRemaining,
}: UseBreathingTimerProps) => {
  const [duration, setDuration] = useState(exerciseSettings.inhaleDuration);
  const [timeRemaining, setTimeRemaining] = useState(exerciseSettings.inhaleDuration);
  const timerRef = useRef<number | null>(null);
  const phaseRef = useRef<string>('');

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
    // Only update if phase actually changed
    if (phaseRef.current === phase) return;
    
    console.log(`Phase changed from ${phaseRef.current} to: ${phase}`);
    phaseRef.current = phase;
    
    let phaseDuration = 0;
    
    switch (phase) {
      case "countdown":
        phaseDuration = 3; // 3 seconds countdown
        break;
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
    
    // If we have a saved phase time remaining, use it, otherwise start fresh
    if (phaseTimeRemaining !== null && phase !== "idle") {
      console.log(`Resuming with saved time: ${phaseTimeRemaining}`);
      setTimeRemaining(phaseTimeRemaining);
      setPhaseTimeRemaining(null);
    } else if (phase !== "idle") {
      console.log(`Starting fresh with duration: ${phaseDuration}`);
      setTimeRemaining(phaseDuration);
    }
  }, [phase, memoizedSettings, phaseTimeRemaining, setPhaseTimeRemaining]);

  // Main timer effect - separated from phase updates
  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Only start timer if active and not idle
    if (isActive && phase !== "idle") {
      console.log(`Starting timer for phase: ${phase}`);
      
      timerRef.current = window.setInterval(() => {
        setTimeRemaining((prev) => {
          const newValue = Math.max(0, prev - 0.1);
          
          if (newValue <= 0) {
            console.log(`Phase ${phase} completed, determining next phase`);
            
            // Clear the timer immediately when phase completes
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            
            let nextPhase: "inhale" | "exhale" | "hold1" | "hold2" | "countdown";
            
            // Determine next phase
            if (phase === "countdown") {
              nextPhase = "inhale"; // Start with inhale after countdown
            } else if (phase === "inhale") {
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
            
            return 0;
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
  }, [isActive, phase, onPhaseComplete, memoizedSettings]);

  return { duration, timeRemaining };
};
