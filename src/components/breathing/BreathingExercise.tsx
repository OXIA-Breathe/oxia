
import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { useBreath } from "@/context/BreathContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import BreathingCircle from "./BreathingCircle";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Play, Pause, RotateCcw } from "lucide-react";

const BreathingExercise = () => {
  const { settings, addSession } = useBreath();
  const { user } = useAuth();
  const { toast } = useToast();

  const [phase, setPhase] = useState<"inhale" | "exhale" | "hold" | "idle">("idle");
  const [isActive, setIsActive] = useState(false);
  const [currentRepetition, setCurrentRepetition] = useState(0);
  const [breathCount, setBreathCount] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  
  // New state to track the remaining time in the current phase when paused
  const [phaseTimeRemaining, setPhaseTimeRemaining] = useState<number | null>(null);

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
      if (sessionStartTime === null) {
        setSessionStartTime(Date.now());
      }
      // If resuming from pause, phase should already be set
      if (phase === "idle") {
        setPhase("inhale");
        setPhaseTimeRemaining(null);
      }
    } else {
      setIsActive(false);
      // When pausing, store the current time remaining in the phase
      if (phaseTimeRemaining === null && phase !== "idle") {
        setPhaseTimeRemaining(timeRemaining);
      }
    }
  };

  const handleCircleClick = () => {
    toggleExercise();
  };

  const saveSessionToSupabase = async (sessionData) => {
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

  const completeSession = useCallback(() => {
    const sessionEndTime = Date.now();
    const totalDuration = sessionStartTime ? Math.floor((sessionEndTime - sessionStartTime) / 1000) : 0;
    
    const newSession = {
      id: uuidv4(),
      date: new Date().toISOString(),
      repetitions: settings.repetitions,
      holdDuration: settings.holdDuration,
      totalDuration,
      breathCount,
    };
    
    addSession(newSession);
    
    if (user) {
      saveSessionToSupabase(newSession);
    }
    
    toast({
      title: "Session completed!",
      description: `You completed ${breathCount} breaths in ${totalDuration} seconds.`,
    });
    
    resetExercise();
  }, [addSession, breathCount, sessionStartTime, settings, toast, user]);

  // Track elapsed time only when active
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
  }, [isActive]);

  // States for the breathing animation tracking
  const [duration, setDuration] = useState(settings.inhaleDuration);
  const [timeRemaining, setTimeRemaining] = useState(duration);

  // Reset timeRemaining when phase or duration changes
  useEffect(() => {
    if (phase === "inhale") {
      setDuration(settings.inhaleDuration);
    } else if (phase === "hold") {
      setDuration(settings.holdDuration);
    } else if (phase === "exhale") {
      setDuration(settings.exhaleDuration);
    }
    
    // Use stored phaseTimeRemaining if available, otherwise use full duration
    if (phaseTimeRemaining !== null && phase !== "idle") {
      setTimeRemaining(phaseTimeRemaining);
      setPhaseTimeRemaining(null); // Reset the stored value after using it
    } else if (phase !== "idle") {
      setTimeRemaining(
        phase === "inhale" 
          ? settings.inhaleDuration 
          : phase === "exhale" 
          ? settings.exhaleDuration 
          : settings.holdDuration
      );
    }
  }, [phase, settings, phaseTimeRemaining]);

  // Handle phase transitions
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
              setPhase("hold");
            } else if (phase === "hold") {
              setPhase("exhale");
            } else if (phase === "exhale") {
              setBreathCount((prev) => prev + 1);
              setCurrentRepetition((prev) => {
                const newRep = prev + 1;
                if (newRep >= settings.repetitions) {
                  completeSession();
                  return 0;
                } else {
                  setPhase("inhale");
                  return newRep;
                }
              });
            }
          }
          return newValue;
        });
      }, 100);
    }
    
    return () => {
      if (phaseTimer) clearTimeout(phaseTimer);
    };
  }, [isActive, phase, timeRemaining, currentRepetition, settings.repetitions, completeSession]);

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <div className="w-full max-w-md">
        <div className="flex flex-col space-y-3 w-full">
          <div className="flex flex-row space-x-3 w-full">
            <StatsCard
              label="Reps"
              value={`${currentRepetition}/${settings.repetitions}`}
              className="flex-1"
            />
            <StatsCard
              label="Breaths"
              value={breathCount}
              className="flex-1"
            />
          </div>
          
          <StatsCard
            label="Time elapsed"
            value={formatTime(timeElapsed)}
            fullWidth
          />
        </div>
      </div>
      
      <div className="flex items-center justify-center my-8">
        <BreathingCircle 
          phase={isActive ? phase : "idle"} 
          duration={duration}
          timeRemaining={timeRemaining}
          onCircleClick={handleCircleClick}
          isPaused={!isActive && phase !== "idle"}
        />
      </div>
      
      <div className="flex space-x-4">
        <Button 
          onClick={toggleExercise} 
          variant="default"
          size="lg"
          className="flex items-center space-x-2"
        >
          {isActive ? <Pause size={20} /> : <Play size={20} />}
          <span>{isActive ? "Pause" : phase === "idle" ? "Start" : "Resume"}</span>
        </Button>
        
        <Button 
          onClick={resetExercise} 
          variant="outline"
          size="lg"
          className="flex items-center space-x-2 border-red-400 hover:bg-red-100 hover:text-red-600 text-red-500"
          disabled={!isActive && currentRepetition === 0}
        >
          <RotateCcw size={20} />
          <span>Reset</span>
        </Button>
      </div>
    </div>
  );
};

export default BreathingExercise;
