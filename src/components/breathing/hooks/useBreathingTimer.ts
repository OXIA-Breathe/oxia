
import { useState, useEffect, useCallback } from "react";

interface UseBreathingTimerProps {
  isActive: boolean;
  phase: "inhale" | "exhale" | "hold" | "idle";
  inhaleDuration: number;
  exhaleDuration: number;
  holdDuration: number;
  onPhaseComplete: (nextPhase: "inhale" | "exhale" | "hold") => void;
  phaseTimeRemaining: number | null;
  setPhaseTimeRemaining: (time: number | null) => void;
}

export const useBreathingTimer = ({
  isActive,
  phase,
  inhaleDuration,
  exhaleDuration,
  holdDuration,
  onPhaseComplete,
  phaseTimeRemaining,
  setPhaseTimeRemaining
}: UseBreathingTimerProps) => {
  const [duration, setDuration] = useState(inhaleDuration);
  const [timeRemaining, setTimeRemaining] = useState(duration);

  // Reset timeRemaining when phase or duration changes
  useEffect(() => {
    if (phase === "inhale") {
      setDuration(inhaleDuration);
    } else if (phase === "hold") {
      setDuration(holdDuration);
    } else if (phase === "exhale") {
      setDuration(exhaleDuration);
    }
    
    // Use stored phaseTimeRemaining if available, otherwise use full duration
    if (phaseTimeRemaining !== null && phase !== "idle") {
      setTimeRemaining(phaseTimeRemaining);
      setPhaseTimeRemaining(null); // Reset the stored value after using it
    } else if (phase !== "idle") {
      setTimeRemaining(
        phase === "inhale" 
          ? inhaleDuration 
          : phase === "exhale" 
          ? exhaleDuration 
          : holdDuration
      );
    }
  }, [phase, inhaleDuration, exhaleDuration, holdDuration, phaseTimeRemaining, setPhaseTimeRemaining]);

  // Handle phase transitions - synchronized timer updates
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
              onPhaseComplete("hold");
            } else if (phase === "hold") {
              onPhaseComplete("exhale");
            } else if (phase === "exhale") {
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
  }, [isActive, phase, timeRemaining, onPhaseComplete]);

  return { duration, timeRemaining };
};
