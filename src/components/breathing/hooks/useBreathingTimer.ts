
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
  const [timeRemaining, setTimeRemaining] = useState(duration);

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
    
    setDuration(phaseDuration);
    
    if (phaseTimeRemaining !== null && phase !== "idle") {
      setTimeRemaining(phaseTimeRemaining);
      setPhaseTimeRemaining(null);
    } else if (phase !== "idle") {
      setTimeRemaining(phaseDuration);
    }
  }, [phase, exerciseSettings, phaseTimeRemaining, setPhaseTimeRemaining]);

  useEffect(() => {
    let phaseTimer: number;
    
    if (isActive && phase !== "idle" && timeRemaining > 0) {
      phaseTimer = window.setInterval(() => {
        setTimeRemaining((prev) => {
          const newValue = Math.max(0, prev - 0.1);
          if (newValue <= 0) {
            clearInterval(phaseTimer);
            
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
      if (phaseTimer) clearTimeout(phaseTimer);
    };
  }, [isActive, phase, timeRemaining, onPhaseComplete, exerciseSettings]);

  return { duration, timeRemaining };
};
