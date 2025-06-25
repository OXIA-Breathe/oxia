
import { useEffect } from "react";

interface UseElapsedTimerProps {
  isActive: boolean;
  setTimeElapsed: (updater: (prev: number) => number) => void;
}

export const useElapsedTimer = ({ isActive, setTimeElapsed }: UseElapsedTimerProps) => {
  useEffect(() => {
    let timer: number;
    
    if (isActive) {
      timer = window.setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, setTimeElapsed]);
};
