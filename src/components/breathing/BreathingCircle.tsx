
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
  const circleRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const sizeClasses = {
    sm: "w-32 h-32",
    md: "w-48 h-48",
    lg: "w-64 h-64",
  };

  useEffect(() => {
    if (circleRef.current) {
      const scale = phase === "idle" || isPaused ? 1 : null;
      
      if (scale !== null) {
        // Set static scale when idle or paused
        circleRef.current.style.transform = `scale(${scale})`;
        // Remove animation classes to pause the animation
        circleRef.current.classList.remove('inhale', 'exhale', 'hold');
        if (isPaused) {
          // Add the paused class to retain the visual state but stop animation
          circleRef.current.classList.add(`${phase}-paused`);
        }
      } else {
        // Restore animation classes when active
        circleRef.current.style.removeProperty('transform');
        // Add the appropriate animation class based on current phase
        circleRef.current.style.setProperty("--breathe-in-duration", `${duration}s`);
        circleRef.current.style.setProperty("--breathe-out-duration", `${duration}s`);
        circleRef.current.style.setProperty("--breathe-hold-duration", `${duration}s`);
        // Set animation progress based on remaining time
        const progress = 1 - (timeRemaining / duration);
        circleRef.current.style.setProperty("--animation-progress", `${progress}`);
      }
    }
  }, [phase, duration, isPaused, timeRemaining]);
  
  return (
    <div className="relative flex flex-col items-center justify-center">
      <div 
        ref={circleRef}
        className={`breathing-circle ${sizeClasses[size]} ${!isPaused && phase !== "idle" ? phase : ""} backdrop-blur-md bg-opacity-50 shadow-lg relative z-10 cursor-pointer`}
        onClick={onCircleClick}
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
      
      {/* Circle outline */}
      <div className="absolute inset-0 rounded-full border-4 border-white border-opacity-20 z-0 flex items-center justify-center">
        {/* Create a semi-circle progress indicator */}
        <svg className="absolute inset-0 rotate-270" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="white"
            strokeWidth="4"
            strokeOpacity="0.4"
            strokeDasharray="301"
            strokeDashoffset="75"
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </svg>
      </div>
    </div>
  );
};

export default BreathingCircle;
