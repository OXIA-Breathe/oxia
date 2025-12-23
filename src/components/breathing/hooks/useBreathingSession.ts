
import { useState, useCallback, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useBreath } from "@/context/BreathContext";
import { useBreathingExercise } from "@/context/BreathingExerciseContext";
import { useAuth } from "@/context/AuthContext";
import { useNotificationQueue } from "@/hooks/useNotificationQueue";
import { useSessionPersistence } from "./useSessionPersistence";
import { useFirebaseAnalytics } from "@/hooks/useFirebaseAnalytics";

export const useBreathingSession = (onSessionComplete?: (sessionData: { breathCount: number; duration: number; sessionId: string }) => void) => {
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
    repetitions: 20,
    isCustom: false,
  };

  const [phase, setPhase] = useState<"inhale" | "exhale" | "hold1" | "hold2" | "idle" | "countdown">("idle");
  const [isActive, setIsActive] = useState(false);
  const [currentRepetition, setCurrentRepetition] = useState(0);
  const [breathCount, setBreathCount] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [phaseTimeRemaining, setPhaseTimeRemaining] = useState<number | null>(null);
  
  // Use a ref to track session start time to avoid stale closure issues
  const sessionStartTimeRef = useRef<number | null>(null);

  const completeSession = useCallback((finalBreathCount: number) => {
    const sessionEndTime = Date.now();
    const totalDuration = sessionStartTimeRef.current ? Math.floor((sessionEndTime - sessionStartTimeRef.current) / 1000) : 0;
    
    console.log(`🕐 Session completion - Start: ${sessionStartTimeRef.current}, End: ${sessionEndTime}, Duration: ${totalDuration} seconds`);
    
    const sessionId = uuidv4();
    const newSession = {
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
    
    addSession(newSession);
    
    if (user) {
      saveSessionToSupabase(newSession);
    }
    
    logEvent('breathing_session_completed', {
      exercise_name: exerciseSettings.title,
      breath_count: finalBreathCount,
      duration_seconds: totalDuration,
      is_custom: exerciseSettings.isCustom || false,
    });
    
    // Call the callback with session data for emotion tracking
    if (onSessionComplete) {
      onSessionComplete({
        breathCount: finalBreathCount,
        duration: totalDuration,
        sessionId,
      });
    } else {
      // If no callback, show default notification
      queueNotifications([{
        title: "Session completed!",
        description: `You completed ${finalBreathCount} breaths in ${totalDuration} seconds.`,
        duration: 3000
      }]);
    }
    
    resetExercise();
  }, [addSession, exerciseSettings, queueNotifications, user, saveSessionToSupabase, onSessionComplete]);

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

  // Effect to handle session completion - avoids setState during render
  useEffect(() => {
    if (currentRepetition > 0 && currentRepetition >= exerciseSettings.repetitions) {
      // Use setTimeout to schedule the completion outside the render cycle
      const timeoutId = setTimeout(() => {
        completeSession(breathCount);
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [currentRepetition, exerciseSettings.repetitions, breathCount, completeSession]);

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
      // Only increment if we haven't reached the target
      setCurrentRepetition((prevRep) => {
        if (prevRep < exerciseSettings.repetitions) {
          return prevRep + 1;
        }
        return prevRep;
      });
      setBreathCount((prevBreathCount) => prevBreathCount + 1);
      setPhase("inhale");
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
  };
};
