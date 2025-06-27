
import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { useBreath } from "@/context/BreathContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useBreathingSession = () => {
  const { settings, addSession } = useBreath();
  const { user } = useAuth();
  const { toast } = useToast();

  const [phase, setPhase] = useState<"inhale" | "exhale" | "hold" | "idle">("idle");
  const [isActive, setIsActive] = useState(false);
  const [currentRepetition, setCurrentRepetition] = useState(0);
  const [breathCount, setBreathCount] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [phaseTimeRemaining, setPhaseTimeRemaining] = useState<number | null>(null);

  const saveSessionToSupabase = async (sessionData: any) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from("breath_sessions")
        .insert({
          id: sessionData.id,
          user_id: user.id,
          date: sessionData.date,
          repetitions: sessionData.repetitions,
          hold_duration: sessionData.holdDuration,
          total_duration: sessionData.totalDuration,
          breath_count: sessionData.breathCount
        });
        
      if (error) {
        console.error("Error saving session to Supabase:", error);
        toast({
          title: "Error saving session",
          description: "Your session was saved locally but not to your account.",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error("Exception saving session:", err);
    }
  };

  const completeSession = useCallback((finalBreathCount: number) => {
    const sessionEndTime = Date.now();
    const totalDuration = sessionStartTime ? Math.floor((sessionEndTime - sessionStartTime) / 1000) : 0;
    
    const newSession = {
      id: uuidv4(),
      date: new Date().toISOString(),
      repetitions: settings.repetitions,
      holdDuration: settings.holdDuration,
      totalDuration,
      breathCount: finalBreathCount,
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
  }, [addSession, sessionStartTime, settings, toast, user]);

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
      // Starting or resuming - set session start time if not already set
      if (sessionStartTime === null) {
        setSessionStartTime(Date.now());
      }
      
      setIsActive(true);
      
      // If resuming from pause, phase should already be set
      if (phase === "idle") {
        setPhase("inhale");
        setPhaseTimeRemaining(null);
      }
    } else {
      setIsActive(false);
      // When pausing, store the current time remaining in the phase
      if (phaseTimeRemaining === null && phase !== "idle") {
        // This will be set by the parent component
      }
    }
  };

  const handlePhaseComplete = useCallback((nextPhase: "inhale" | "exhale" | "hold") => {
    if (nextPhase === "inhale") {
      // Increment breath count first
      setBreathCount((prevBreathCount) => {
        const newBreathCount = prevBreathCount + 1;
        
        // Then handle repetition logic
        setCurrentRepetition((prevRep) => {
          const newRep = prevRep + 1;
          if (newRep >= settings.repetitions) {
            // Complete session with the updated breath count
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
  }, [settings.repetitions, completeSession]);

  return {
    phase,
    isActive,
    currentRepetition,
    breathCount,
    timeElapsed,
    sessionStartTime,
    phaseTimeRemaining,
    setTimeElapsed,
    setPhaseTimeRemaining,
    resetExercise,
    toggleExercise,
    handlePhaseComplete,
    settings
  };
};
