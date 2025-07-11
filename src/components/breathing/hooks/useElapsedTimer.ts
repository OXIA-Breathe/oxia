
import { useEffect } from "react";

interface UseElapsedTimerProps {
  isActive: boolean;
  phase: "inhale" | "exhale" | "hold1" | "hold2" | "idle" | "countdown";
  setTimeElapsed: (updater: (prev: number) => number) => void;
}

export const useElapsedTimer = ({ isActive, phase, setTimeElapsed }: UseElapsedTimerProps) => {
  useEffect(() => {
    let timer: number;
    
    // Only count elapsed time when active and not in countdown phase
    if (isActive && phase !== "countdown") {
      timer = window.setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, phase, setTimeElapsed]);
};
