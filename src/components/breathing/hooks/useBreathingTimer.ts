
import { useState, useEffect } from "react";

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
}

export const useBreathingTimer = ({
  isActive,
  phase,
  exerciseSettings,
  onPhaseComplete,
  phaseTimeRemaining,
  setPhaseTimeRemaining
}: UseBreathingTimerProps) => {
  const [duration, setDuration] = useState(exerciseSettings.inhaleDuration);
  const [timeRemaining, setTimeRemaining] = useState(exerciseSettings.inhaleDuration);

  // Update duration and timeRemaining when phase changes
  useEffect(() => {
    let phaseDuration = 0;
    
    switch (phase) {
      case "inhale":
        phaseDuration = exerciseSettings.inhaleDuration;
        break;
      case "hold1":
        phaseDuration = exerciseSettings.firstHoldDuration;
        break;
      case "exhale":
        phaseDuration = exerciseSettings.exhaleDuration;
        break;
      case "hold2":
        phaseDuration = exerciseSettings.secondHoldDuration;
        break;
      default:
        phaseDuration = exerciseSettings.inhaleDuration;
    }
    
    console.log("Phase changed:", { phase, phaseDuration, exerciseSettings });
    
    setDuration(phaseDuration);
    
    // If we have a saved phase time remaining, use it, otherwise start fresh
    if (phaseTimeRemaining !== null && phase !== "idle") {
      console.log("Using saved phase time:", phaseTimeRemaining);
      setTimeRemaining(phaseTimeRemaining);
      setPhaseTimeRemaining(null);
    } else if (phase !== "idle") {
      console.log("Starting fresh phase with duration:", phaseDuration);
      setTimeRemaining(phaseDuration);
    }
  }, [phase, exerciseSettings, phaseTimeRemaining, setPhaseTimeRemaining]);

  // Main timer effect
  useEffect(() => {
    let phaseTimer: number;
    
    console.log("Timer effect:", { isActive, phase, timeRemaining });
    
    if (isActive && phase !== "idle" && timeRemaining > 0) {
      console.log("Starting timer for phase:", phase);
      phaseTimer = window.setInterval(() => {
        setTimeRemaining((prev) => {
          const newValue = Math.max(0, prev - 0.1);
          
          if (newValue <= 0) {
            console.log("Phase completed, transitioning from:", phase);
            // Transition to next phase
            if (phase === "inhale") {
              onPhaseComplete(exerciseSettings.firstHoldDuration > 0 ? "hold1" : "exhale");
            } else if (phase === "hold1") {
              onPhaseComplete("exhale");
            } else if (phase === "exhale") {
              onPhaseComplete(exerciseSettings.secondHoldDuration > 0 ? "hold2" : "inhale");
            } else if (phase === "hold2") {
              onPhaseComplete("inhale");
            }
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
  }, [isActive, phase, timeRemaining, onPhaseComplete, exerciseSettings]);

  return { duration, timeRemaining };
};
