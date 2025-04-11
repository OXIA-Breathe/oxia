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

  const resetExercise = () => {
    setPhase("idle");
    setIsActive(false);
    setCurrentRepetition(0);
    setBreathCount(0);
    setTimeElapsed(0);
    setSessionStartTime(null);
  };

  const toggleExercise = () => {
    if (!isActive) {
      setIsActive(true);
      setSessionStartTime(Date.now());
      setPhase("inhale");
    } else {
      setIsActive(false);
    }
  };

  const handleCircleClick = () => {
    if (phase === "idle") {
      toggleExercise();
    } else {
      toggleExercise();
    }
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

  useEffect(() => {
    let phaseTimer: number;
    
    if (isActive) {
      switch (phase) {
        case "inhale":
          phaseTimer = window.setTimeout(() => {
            setPhase("hold");
          }, settings.inhaleDuration * 1000);
          break;
        
        case "hold":
          phaseTimer = window.setTimeout(() => {
            setPhase("exhale");
          }, settings.holdDuration * 1000);
          break;
        
        case "exhale":
          phaseTimer = window.setTimeout(() => {
            setBreathCount((prev) => prev + 1);
            setCurrentRepetition((prev) => prev + 1);
            
            if (currentRepetition + 1 >= settings.repetitions) {
              completeSession();
            } else {
              setPhase("inhale");
            }
          }, settings.exhaleDuration * 1000);
          break;
      }
    }
    
    return () => {
      if (phaseTimer) clearTimeout(phaseTimer);
    };
  }, [isActive, phase, currentRepetition, settings, completeSession]);

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
          phase={phase} 
          duration={
            phase === "inhale" 
              ? settings.inhaleDuration 
              : phase === "exhale" 
              ? settings.exhaleDuration 
              : settings.holdDuration
          }
          onCircleClick={handleCircleClick}
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
          <span>{isActive ? "Pause" : "Start"}</span>
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
