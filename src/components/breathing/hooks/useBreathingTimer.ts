
import { useState, useEffect, useMemo, useCallback } from "react";

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
    
    setDuration(phaseDuration);
    
    // If we have a saved phase time remaining, use it, otherwise start fresh
    if (phaseTimeRemaining !== null && phase !== "idle") {
      setTimeRemaining(phaseTimeRemaining);
      setPhaseTimeRemaining(null);
    } else if (phase !== "idle") {
      setTimeRemaining(phaseDuration);
      // Trigger voice prompt immediately when new phase starts
      if (onVoicePrompt) {
        onVoicePrompt(phase);
      }
    }
  }, [phase, memoizedSettings, phaseTimeRemaining, setPhaseTimeRemaining, onVoicePrompt]);

  // Main timer effect
  useEffect(() => {
    let phaseTimer: number;
    
    if (isActive && phase !== "idle" && timeRemaining > 0) {
      phaseTimer = window.setInterval(() => {
        setTimeRemaining((prev) => {
          const newValue = Math.max(0, prev - 0.1);
          
          if (newValue <= 0) {
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
            
            // Only trigger phase change, voice will be handled by phase change effect
            setTimeout(() => onPhaseComplete(nextPhase), 0);
          }
          
          return newValue;
        });
      }, 100);
    }
    
    return () => {
      if (phaseTimer) {
        clearInterval(phaseTimer);
      }
    };
  }, [isActive, phase, timeRemaining, onPhaseComplete, memoizedSettings]);

  return { duration, timeRemaining };
};
