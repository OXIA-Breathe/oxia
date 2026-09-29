
import { useState, useCallback, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useBreath } from "@/context/BreathContext";
import { useBreathingExercise } from "@/context/BreathingExerciseContext";
import { useAuth } from "@/context/AuthContext";
import { useNotificationQueue } from "@/hooks/useNotificationQueue";
import { useSessionPersistence } from "./useSessionPersistence";
import { useFirebaseAnalytics } from "@/hooks/useFirebaseAnalytics";

export interface PendingSession {
  id: string;
  date: string;
  repetitions: number;
  holdDuration: number;
  totalDuration: number;
  breathCount: number;
  exerciseTitle: string;
  exerciseId: string;
  isCustom: boolean;
}

export const useBreathingSession = (onSessionComplete?: (sessionData: { breathCount: number; duration: number; sessionId: string; session: PendingSession }) => void) => {
  const { addSession } = useBreath();
  const { currentExercise } = useBreathingExercise();
  const { user } = useAuth();
  const { queueNotifications } = useNotificationQueue();
  const { saveSessionToSupabase } = useSessionPersistence();
  const { logEvent } = useFirebaseAnalytics();

  // Use current exercise or fallback to Box Breathing default
  const exerciseSettings = currentExercise || {
    id: "box-breathing",
    title: "Box Breathing",
    description: "Calm and focus",
    inhaleDuration: 4,
    firstHoldDuration: 4,
    exhaleDuration: 4,
    secondHoldDuration: 4,
    repetitions: 15,
    isCustom: false,
  };

  const [phase, setPhase] = useState<"inhale" | "exhale" | "hold1" | "hold2" | "idle" | "countdown">("idle");
  const [isActive, setIsActive] = useState(false);
  const [currentRepetition, setCurrentRepetition] = useState(0);
  const [breathCount, setBreathCount] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [phaseTimeRemaining, setPhaseTimeRemaining] = useState<number | null>(null);
  
  // Use refs to track session state without causing re-renders
  const sessionStartTimeRef = useRef<number | null>(null);
  const isCompletingRef = useRef(false);
  const completionDataRef = useRef<{ breathCount: number } | null>(null);

  // Build the finished session; it is only stored when the user taps Save.
  const completeSession = useCallback((finalBreathCount: number) => {
    const sessionEndTime = Date.now();
    const totalDuration = sessionStartTimeRef.current ? Math.floor((sessionEndTime - sessionStartTimeRef.current) / 1000) : 0;

    const sessionId = uuidv4();
    const newSession: PendingSession = {
      id: sessionId,
      date: new Date().toISOString(),
      repetitions: exerciseSettings.repetitions,
      holdDuration: exerciseSettings.firstHoldDuration,
      totalDuration,
      breathCount: finalBreathCount,
      exerciseTitle: exerciseSettings.title,
      exerciseId: exerciseSettings.id,
      isCustom: exerciseSettings.isCustom || false,
    };

    if (onSessionComplete) {
      onSessionComplete({ breathCount: finalBreathCount, duration: totalDuration, sessionId, session: newSession });
    } else {
      saveSession(newSession);
      queueNotifications([{
        title: "Session completed!",
        description: `You completed ${finalBreathCount} breaths in ${totalDuration} seconds.`,
        duration: 3000
      }]);
    }

    resetExercise();
  }, [exerciseSettings, queueNotifications, onSessionComplete]);

  const saveSession = useCallback(async (session: PendingSession) => {
    addSession(session);
    if (user) {
      await saveSessionToSupabase(session);
    }
    logEvent('breathing_session_completed', {
      exercise_name: session.exerciseTitle,
      breath_count: session.breathCount,
      duration_seconds: session.totalDuration,
      is_custom: session.isCustom,
    });
  }, [addSession, user, saveSessionToSupabase, logEvent]);

  const resetExercise = () => {
    setPhase("idle");
    setIsActive(false);
    setCurrentRepetition(0);
    setBreathCount(0);
    setTimeElapsed(0);
    setSessionStartTime(null);
    sessionStartTimeRef.current = null;
    setPhaseTimeRemaining(null);
  };

  const toggleExercise = () => {
    if (!isActive) {
      setIsActive(true);
      
      if (phase === "idle") {
        // Start with countdown, don't set session start time yet
        setPhase("countdown");
        setPhaseTimeRemaining(null);
      }
    } else {
      setIsActive(false);
    }
  };

  // Effect to handle session completion - processes queued completion
  useEffect(() => {
    if (completionDataRef.current && !isCompletingRef.current) {
      isCompletingRef.current = true;
      const data = completionDataRef.current;
      completionDataRef.current = null;
      
      // Run completion synchronously now that we're in effect
      completeSession(data.breathCount);
      isCompletingRef.current = false;
    }
  });

  const handlePhaseComplete = useCallback((nextPhase: "inhale" | "exhale" | "hold1" | "hold2" | "countdown") => {
    if (nextPhase === "countdown") {
      // Countdown complete, start the actual exercise and set start time
      if (sessionStartTimeRef.current === null) {
        const startTime = Date.now();
        console.log(`🕐 Session starting at: ${startTime}`);
        setSessionStartTime(startTime);
        sessionStartTimeRef.current = startTime;
      }
      // After setting start time, move to inhale phase
      setPhase("inhale");
    } else if (nextPhase === "inhale") {
      setBreathCount((prevBreathCount) => {
        const newBreathCount = prevBreathCount + 1;
        
        setCurrentRepetition((prevRep) => {
          const newRep = prevRep + 1;
          if (newRep >= exerciseSettings.repetitions) {
            // Queue completion to be processed by useEffect
            completionDataRef.current = { breathCount: newBreathCount };
            return newRep;
          }
          setPhase("inhale");
          return newRep;
        });
        
        return newBreathCount;
      });
    } else {
      setPhase(nextPhase);
    }
  }, [exerciseSettings.repetitions]);

  return {
    phase,
    isActive,
    currentRepetition,
    breathCount,
    timeElapsed,
    sessionStartTime,
    phaseTimeRemaining,
    exerciseSettings,
    setTimeElapsed,
    setPhaseTimeRemaining,
    resetExercise,
    toggleExercise,
    handlePhaseComplete,
    saveSession,
  };
};
