
import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { useBreath } from "@/context/BreathContext";
import { useBreathingExercise } from "@/context/BreathingExerciseContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Award, BookOpen, TrendingUp, Zap, Trophy } from "lucide-react";

export const useBreathingSession = () => {
  const { addSession } = useBreath();
  const { currentExercise } = useBreathingExercise();
  const { user } = useAuth();
  const { toast } = useToast();

  // Define all possible badges
  const badgeDefinitions = [
    {
      id: "breaths-25",
      name: "Breathing Beginner",
      description: "Complete 25 total breaths",
      icon: BookOpen,
      threshold: 25
    },
    {
      id: "breaths-50",
      name: "Consistent Breather",
      description: "Complete 50 total breaths",
      icon: Zap,
      threshold: 50
    },
    {
      id: "breaths-100",
      name: "Breathing Enthusiast",
      description: "Complete 100 total breaths",
      icon: TrendingUp,
      threshold: 100
    },
    {
      id: "breaths-250",
      name: "Breathing Expert",
      description: "Complete 250 total breaths",
      icon: Award,
      threshold: 250
    },
    {
      id: "breaths-500",
      name: "Breathing Master",
      description: "Complete 500 total breaths",
      icon: Trophy,
      threshold: 500
    }
  ];

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

  const [phase, setPhase] = useState<"inhale" | "exhale" | "hold1" | "hold2" | "idle">("idle");
  const [isActive, setIsActive] = useState(false);
  const [currentRepetition, setCurrentRepetition] = useState(0);
  const [breathCount, setBreathCount] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [phaseTimeRemaining, setPhaseTimeRemaining] = useState<number | null>(null);

  const checkForNewAchievements = async (newTotalBreaths: number) => {
    if (!user) return;

    try {
      // Get current total breaths from database to compare
      const { data, error } = await supabase
        .from("breath_sessions")
        .select("breath_count")
        .eq("user_id", user.id);
        
      if (error) throw error;
      
      const previousTotalBreaths = data ? data.reduce((sum, session) => sum + session.breath_count, 0) : 0;
      
      // Find newly earned badges
      const newlyEarnedBadge = badgeDefinitions
        .filter(badge => 
          badge.threshold <= newTotalBreaths && // Badge threshold is now met
          badge.threshold > previousTotalBreaths // Badge threshold wasn't met before
        )
        .sort((a, b) => b.threshold - a.threshold)[0]; // Get the highest threshold badge
        
      if (newlyEarnedBadge) {
        // Show achievement toast
        toast({
          title: "🎉 Achievement Unlocked!",
          description: `Congratulations! You've earned the "${newlyEarnedBadge.name}" badge for completing ${newlyEarnedBadge.threshold} breaths!`,
          duration: 6000,
        });
      }
    } catch (err) {
      console.error("Error checking achievements:", err);
    }
  };

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
          breath_count: sessionData.breathCount,
          exercise_title: sessionData.exerciseTitle
        });
        
      if (error) {
        console.error("Error saving session to Supabase:", error);
        toast({
          title: "Error saving session",
          description: "Your session was saved locally but not to your account.",
          variant: "destructive"
        });
      } else {
        // Check for achievements after successfully saving the session
        // Calculate new total breaths including this session
        const { data: allSessions } = await supabase
          .from("breath_sessions")
          .select("breath_count")
          .eq("user_id", user.id);
          
        if (allSessions) {
          const newTotalBreaths = allSessions.reduce((sum, session) => sum + session.breath_count, 0);
          await checkForNewAchievements(newTotalBreaths);
        }
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
  }, [addSession, sessionStartTime, exerciseSettings, toast, user]);

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
      if (sessionStartTime === null) {
        setSessionStartTime(Date.now());
      }
      
      setIsActive(true);
      
      if (phase === "idle") {
        setPhase("inhale");
        setPhaseTimeRemaining(null);
      }
    } else {
      setIsActive(false);
    }
  };

  const handlePhaseComplete = useCallback((nextPhase: "inhale" | "exhale" | "hold1" | "hold2") => {
    if (nextPhase === "inhale") {
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
  }, [exerciseSettings.repetitions, completeSession]);

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
