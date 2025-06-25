
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";

interface BreathingCircleProps {
  phase: "inhale" | "exhale" | "hold" | "idle";
  duration: number;
  timeRemaining: number;
  size?: "sm" | "md" | "lg";
  riskLevel?: "Minimal" | "Low" | "Moderate" | "High";
  onCircleClick?: () => void;
  isPaused?: boolean;
}

const BreathingCircle = ({ 
  phase, 
  duration, 
  timeRemaining,
  size = "lg", 
  riskLevel = "Minimal",
  onCircleClick,
  isPaused = false
}: BreathingCircleProps) => {
  const innerCircleRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const sizeClasses = {
    sm: "w-32 h-32",
    md: "w-48 h-48",
    lg: "w-64 h-64",
  };

  useEffect(() => {
    if (innerCircleRef.current) {
      if (phase === "idle" || isPaused) {
        // When idle or paused, set static scale
        const scale = phase === "idle" ? 0.3 : (phase === "inhale" || phase === "hold" ? 1 : 0.3);
        innerCircleRef.current.style.transform = `scale(${scale})`;
        innerCircleRef.current.style.transition = "transform 0.3s ease";
      } else {
        // Calculate progress based on remaining time
        const progress = 1 - (timeRemaining / duration);
        let targetScale = 0.3;
        
        if (phase === "inhale") {
          // Scale from 0.3 to 1.0 during inhale
          targetScale = 0.3 + (0.7 * progress);
        } else if (phase === "hold") {
          // Stay at 1.0 during hold
          targetScale = 1.0;
        } else if (phase === "exhale") {
          // Scale from 1.0 to 0.3 during exhale
          targetScale = 1.0 - (0.7 * progress);
        }
        
        innerCircleRef.current.style.transform = `scale(${targetScale})`;
        innerCircleRef.current.style.transition = "transform 0.1s ease-in-out";
      }
    }
  }, [phase, timeRemaining, duration, isPaused]);
  
  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Outer Ring - Fixed transparent border */}
      <div 
        className={`${sizeClasses[size]} relative cursor-pointer`}
        onClick={onCircleClick}
      >
        <div className="absolute inset-0 rounded-full border-4 border-white border-opacity-30"></div>
        
        {/* Inner Ring - Animated breathing circle */}
        <div 
          ref={innerCircleRef}
          className="absolute inset-0 breathing-circle backdrop-blur-md bg-opacity-50 shadow-lg flex items-center justify-center"
          style={{ transformOrigin: 'center' }}
        >
          <div className="text-center flex flex-col items-center justify-center">
            {phase === "idle" ? (
              <>
                <span className="text-2xl font-bold text-white">
                  Breathe
                </span>
              </>
            ) : (
              <>
                <span className="text-2xl font-bold text-white">
                  {isPaused ? "Paused" : phase.charAt(0).toUpperCase() + phase.slice(1)}
                </span>
                <span className="text-xl text-white mt-1">
                  {Math.max(0, Math.ceil(timeRemaining))}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreathingCircle;
