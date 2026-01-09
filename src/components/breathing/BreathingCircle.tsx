
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
        <div className="absolute inset-0 rounded-full border-4 border-white border-opacity-30"></div>
        
        <div 
          ref={innerCircleRef}
          className="absolute inset-0 m-auto rounded-full flex items-center justify-center overflow-hidden"
          style={{ 
            transformOrigin: 'center',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(145deg, #e0edf5 0%, #77A9E8 100%)',
            boxShadow: 'inset 0 4px 20px rgba(0, 0, 0, 0.15), inset 0 -4px 15px rgba(255, 255, 255, 0.25), 0 0 30px rgba(119, 169, 232, 0.4)',
            backdropFilter: 'blur(8px)'
          }}
        >
          {/* Fluid air-like animation layers */}
          {phase !== "idle" && !isPaused && (
            <>
              <div className="absolute inset-0 animate-fluid-1" 
                style={{
                  background: 'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.4) 0%, transparent 50%)',
                  filter: 'blur(20px)'
                }}
              />
              <div className="absolute inset-0 animate-fluid-2" 
                style={{
                  background: 'radial-gradient(circle at 70% 60%, rgba(147,197,253,0.5) 0%, transparent 50%)',
                  filter: 'blur(25px)'
                }}
              />
              <div className="absolute inset-0 animate-fluid-3" 
                style={{
                  background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 60%)',
                  filter: 'blur(30px)'
                }}
              />
            </>
          )}
          <div className="text-center flex flex-col items-center justify-center">
            {phase === "idle" ? (
              <span className="text-[1.5rem] font-bold text-white">
                Breathe
              </span>
            ) : (
              <>
                <span className="text-[1.5rem] font-bold text-white">
                  {isPaused ? "Paused" : getPhaseDisplayName()}
                </span>
                <span className="text-[1.5rem] text-white mt-1">
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
