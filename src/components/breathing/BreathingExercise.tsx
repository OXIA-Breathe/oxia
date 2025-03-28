
import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { useBreath } from "@/context/BreathContext";
import BreathingCircle from "./BreathingCircle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Play, Pause, RotateCcw } from "lucide-react";

const BreathingExercise = () => {
  const { settings, addSession } = useBreath();
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
    toast({
      title: "Session completed!",
      description: `You completed ${breathCount} breaths in ${totalDuration} seconds.`,
    });
    
    resetExercise();
  }, [addSession, breathCount, sessionStartTime, settings, toast]);

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
      <Card className="p-4 text-center">
        <p className="text-lg">
          <span className="font-semibold">Repetitions:</span> {currentRepetition}/{settings.repetitions}
        </p>
        <p className="text-lg">
          <span className="font-semibold">Breaths taken:</span> {breathCount}
        </p>
        <p className="text-lg">
          <span className="font-semibold">Time elapsed:</span> {formatTime(timeElapsed)}
        </p>
      </Card>
      
      <div className="flex items-center justify-center">
        <BreathingCircle 
          phase={phase} 
          duration={
            phase === "inhale" 
              ? settings.inhaleDuration 
              : phase === "exhale" 
              ? settings.exhaleDuration 
              : settings.holdDuration
          } 
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
          className="flex items-center space-x-2"
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
