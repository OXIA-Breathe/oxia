
import { useState, useEffect, useRef } from "react";

interface BreathingCircleProps {
  phase: "inhale" | "exhale" | "hold1" | "hold2" | "idle";
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
  onCircleClick,
  isPaused = false
}: BreathingCircleProps) => {
  const innerCircleRef = useRef<HTMLDivElement>(null);
  const lastProgressRef = useRef<number>(-1);
  
  const sizeClasses = {
    sm: "w-32 h-32",
    md: "w-48 h-48",
    lg: "w-64 h-64",
  };

  const getPhaseDisplayName = () => {
    switch (phase) {
      case "hold1":
      case "hold2":
        return "Hold";
      case "inhale":
        return "Inhale";
      case "exhale":
        return "Exhale";
      default:
        return "Breathe";
    }
  };

  // Handle circle animation based on phase and time
  useEffect(() => {
    if (innerCircleRef.current) {
      if (phase === "idle" || isPaused) {
        const scale = phase === "idle" ? 0.5 : (phase === "inhale" || phase === "hold1" ? 1 : 0.5);
        innerCircleRef.current.style.transform = `scale(${scale})`;
        innerCircleRef.current.style.transition = "transform 0.3s ease";
        lastProgressRef.current = -1; // Reset progress tracking
      } else if (duration > 0 && timeRemaining >= 0) {
        // Calculate progress (0 to 1) - how much of the phase has completed
        const progress = Math.max(0, Math.min(1, (duration - timeRemaining) / duration));
        
        // Only update if progress has changed significantly (reduce excessive updates)
        if (Math.abs(progress - lastProgressRef.current) < 0.05 && lastProgressRef.current >= 0) {
          return;
        }
        
        lastProgressRef.current = progress;
        let targetScale = 0.5;
        
        if (phase === "inhale") {
          // Scale from 0.5 to 1.0 during inhale
          targetScale = 0.5 + (0.5 * progress);
        } else if (phase === "hold1") {
          // Stay at 1.0 during first hold (after inhale)
          targetScale = 1.0;
        } else if (phase === "exhale") {
          // Scale from 1.0 to 0.5 during exhale
          targetScale = 1.0 - (0.5 * progress);
        } else if (phase === "hold2") {
          // Stay at 0.5 during second hold (after exhale)
          targetScale = 0.5;
        }
        
        innerCircleRef.current.style.transform = `scale(${targetScale})`;
        innerCircleRef.current.style.transition = "transform 0.1s ease-in-out";
      }
    }
  }, [phase, timeRemaining, duration, isPaused]);
  
  return (
    <div className="relative flex flex-col items-center justify-center">
      <div 
        className={`${sizeClasses[size]} relative cursor-pointer`}
        onClick={onCircleClick}
      >
        <div className="absolute inset-0 rounded-full border-4 border-white border-opacity-30"></div>
        
        <div 
          ref={innerCircleRef}
          className="absolute inset-0 m-auto rounded-full flex items-center justify-center"
          style={{ 
            transformOrigin: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(59, 130, 246, 0.3)',
            backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <div className="text-center flex flex-col items-center justify-center">
            {phase === "idle" ? (
              <span className="text-xl font-bold text-white">
                Breathe
              </span>
            ) : (
              <>
                <span className="text-lg font-bold text-white">
                  {isPaused ? "Paused" : getPhaseDisplayName()}
                </span>
                <span className="text-base text-white mt-1">
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
