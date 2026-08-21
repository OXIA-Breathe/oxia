
import { useState, useEffect, useRef } from "react";

interface BreathingCircleProps {
  phase: "inhale" | "exhale" | "hold1" | "hold2" | "idle" | "countdown";
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
  
  // Responsive sizes using viewport units with min/max constraints
  const sizeClasses = {
    sm: "w-[min(40vw,128px)] h-[min(40vw,128px)]",
    md: "w-[min(50vw,192px)] h-[min(50vw,192px)]",
    lg: "w-[min(65vw,400px)] h-[min(65vw,400px)] max-w-[min(65vh,400px)] max-h-[min(65vh,400px)]",
  };

  const getPhaseDisplayName = () => {
    switch (phase) {
      case "countdown":
        return "Breathe in";
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
    if (!innerCircleRef.current) return;

    console.log(`Circle animation - Phase: ${phase}, Duration: ${duration}, TimeRemaining: ${timeRemaining}, isPaused: ${isPaused}`);
    
    if (phase === "idle" || phase === "countdown" || isPaused) {
      let scale = 0.5;
      if (phase === "idle" || phase === "countdown") {
        scale = 0.5; // Keep at small size during countdown
      } else if (phase === "inhale" || phase === "hold1") {
        scale = 1;
      } else {
        scale = 0.5;
      }
      innerCircleRef.current.style.transform = `scale(${scale})`;
      innerCircleRef.current.style.transition = "transform 0.3s ease";
      return;
    }

    if (duration > 0 && timeRemaining >= 0) {
      // Calculate progress (0 to 1) - how much of the phase has completed
      const progress = Math.max(0, Math.min(1, (duration - timeRemaining) / duration));
      console.log(`Animation progress: ${progress.toFixed(2)} for phase: ${phase}`);
      
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
      
      console.log(`Setting target scale: ${targetScale} for phase: ${phase}`);
      innerCircleRef.current.style.transform = `scale(${targetScale})`;
      innerCircleRef.current.style.transition = "transform 0.1s ease-in-out";
    }
  }, [phase, timeRemaining, duration, isPaused]);
  
  return (
    <div className="relative flex flex-col items-center justify-center">
      <div
        className={`${sizeClasses[size]} relative cursor-pointer`}
        onClick={onCircleClick}
      >
        {/* Outer ring track (Glacier) */}
        <div className="absolute inset-0 rounded-full border-[3px] border-glacier/60"></div>

        <div
          ref={innerCircleRef}
          className="absolute inset-0 m-auto rounded-full flex items-center justify-center overflow-hidden"
          style={{
            transformOrigin: 'center',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(145deg, #A9CBE0 0%, #225688 100%)',
            boxShadow: 'inset 0 4px 24px rgba(9, 44, 86, 0.20), inset 0 -4px 18px rgba(240, 245, 244, 0.30), 0 12px 40px -8px rgba(34, 86, 136, 0.45)',
          }}
        >
          {/* Fluid air-like animation layers */}
          {phase !== "idle" && !isPaused && (
            <>
              <div
                className="absolute inset-0 animate-fluid-1"
                style={{
                  background: 'radial-gradient(circle at 30% 40%, rgba(240,245,244,0.45) 0%, transparent 55%)',
                  filter: 'blur(20px)'
                }}
              />
              <div
                className="absolute inset-0 animate-fluid-2"
                style={{
                  background: 'radial-gradient(circle at 70% 60%, rgba(169,203,224,0.55) 0%, transparent 55%)',
                  filter: 'blur(25px)'
                }}
              />
              <div
                className="absolute inset-0 animate-fluid-3"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, rgba(240,245,244,0.35) 0%, transparent 60%)',
                  filter: 'blur(30px)'
                }}
              />
            </>
          )}
          <div className="text-center flex flex-col items-center justify-center text-primary-foreground">
            {phase === "idle" ? (
              <span className="text-[1.5rem] font-bold">Breathe</span>
            ) : (
              <>
                <span className="text-[1.5rem] font-bold">
                  {isPaused ? "Paused" : getPhaseDisplayName()}
                </span>
                <span className="text-[1.5rem] mt-1 tabular-nums opacity-90">
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
