
import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { useBreath } from "@/context/BreathContext";
import { useBreathingExercise } from "@/context/BreathingExerciseContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useSessionPersistence } from "./useSessionPersistence";

export const useBreathingSession = () => {
  const { addSession } = useBreath();
  const { currentExercise } = useBreathingExercise();
  const { user } = useAuth();
  const { toast } = useToast();
  const { saveSessionToSupabase } = useSessionPersistence();

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

  const completeSession = useCallback((finalBreathCount: number) => {
    const sessionEndTime = Date.now();
    const totalDuration = sessionStartTime ? Math.floor((sessionEndTime - sessionStartTime) / 1000) : 0;
    
    const newSession = {
      id: uuidv4(),
      date: new Date().toISOString(),
      repetitions: exerciseSettings.repetitions,
      holdDuration: exerciseSettings.firstHoldDuration,
      totalDuration,
      breathCount: finalBreathCount,
      exerciseTitle: exerciseSettings.title,
    };
    
    addSession(newSession);
    
    if (user) {
      saveSessionToSupabase(newSession);
    }
    
    toast({
      title: "Session completed!",
      description: `You completed ${finalBreathCount} breaths in ${totalDuration} seconds.`,
    });
    
    resetExercise();
  }, [addSession, sessionStartTime, exerciseSettings, toast, user, saveSessionToSupabase]);

  const resetExercise = () => {
    setPhase("idle");
    setIsActive(false);
    setCurrentRepetition(0);
    setBreathCount(0);
    setTimeElapsed(0);
    setSessionStartTime(null);
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

  const handlePhaseComplete = useCallback((nextPhase: "inhale" | "exhale" | "hold1" | "hold2" | "countdown") => {
    if (nextPhase === "countdown") {
      // Countdown complete, start the actual exercise
      if (sessionStartTime === null) {
        setSessionStartTime(Date.now());
      }
      setPhase("inhale");
    } else if (nextPhase === "inhale") {
      setBreathCount((prevBreathCount) => {
        const newBreathCount = prevBreathCount + 1;
        
        setCurrentRepetition((prevRep) => {
          const newRep = prevRep + 1;
          if (newRep >= exerciseSettings.repetitions) {
            completeSession(newBreathCount);
            return 0;
          } else {
            setPhase("inhale");
            return newRep;
          }
        });
        
        return newBreathCount;
      });
    } else {
      setPhase(nextPhase);
    }
  }, [exerciseSettings.repetitions, completeSession, sessionStartTime]);

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
