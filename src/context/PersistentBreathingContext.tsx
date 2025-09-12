import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface BreathingSessionState {
  phase: "inhale" | "exhale" | "hold1" | "hold2" | "idle" | "countdown";
  isActive: boolean;
  currentRepetition: number;
  breathCount: number;
  timeElapsed: number;
  sessionStartTime: number | null;
  phaseTimeRemaining: number | null;
  exerciseSettings: any;
}

interface PersistentBreathingContextType {
  sessionState: BreathingSessionState | null;
  saveSessionState: (state: BreathingSessionState) => void;
  clearSessionState: () => void;
  hasActiveSession: boolean;
}

const PersistentBreathingContext = createContext<PersistentBreathingContextType | undefined>(undefined);

const STORAGE_KEY = "breathing_session_state";

export const PersistentBreathingProvider = ({ children }: { children: ReactNode }) => {
  const [sessionState, setSessionState] = useState<BreathingSessionState | null>(null);

  // Load session state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        // Only restore if the session was active and not too old (within 1 hour)
        if (parsedState.isActive && parsedState.sessionStartTime) {
          const now = Date.now();
          const timeDiff = now - parsedState.sessionStartTime;
          if (timeDiff < 60 * 60 * 1000) { // 1 hour
            setSessionState(parsedState);
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch (error) {
        console.error("Error parsing saved session state:", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const saveSessionState = (state: BreathingSessionState) => {
    if (state.isActive && state.phase !== "idle") {
      setSessionState(state);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } else {
      // Clear state if session is not active or idle
      clearSessionState();
    }
  };

  const clearSessionState = () => {
    setSessionState(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const hasActiveSession = sessionState?.isActive && sessionState?.phase !== "idle";

  return (
    <PersistentBreathingContext.Provider value={{
      sessionState,
      saveSessionState,
      clearSessionState,
      hasActiveSession: !!hasActiveSession
    }}>
      {children}
    </PersistentBreathingContext.Provider>
  );
};

export const usePersistentBreathing = () => {
  const context = useContext(PersistentBreathingContext);
  if (context === undefined) {
    throw new Error("usePersistentBreathing must be used within a PersistentBreathingProvider");
  }
  return context;
};