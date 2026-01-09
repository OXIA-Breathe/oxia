
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
        {/* Ripple effects */}
        {phase !== "idle" && !isPaused && (
          <>
            <div 
              className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-ping"
              style={{ animationDuration: '2s' }}
            />
            <div 
              className="absolute inset-0 rounded-full border border-blue-300/20 animate-ping"
              style={{ animationDuration: '2s', animationDelay: '0.5s' }}
            />
          </>
        )}
        
        {/* Outer ring - same as original */}
        <div className="absolute inset-0 rounded-full border-4 border-white border-opacity-30"></div>
        
        <div 
          ref={innerCircleRef}
          className="absolute inset-0 m-auto rounded-full flex items-center justify-center overflow-hidden"
          style={{ 
            transformOrigin: 'center',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(180deg, rgba(96,165,250,0.7) 0%, rgba(59,130,246,0.8) 50%, rgba(37,99,235,0.9) 100%)',
            boxShadow: `
              0 0 30px rgba(59,130,246,0.4),
              0 0 60px rgba(37,99,235,0.3),
              inset 0 -20px 40px rgba(30,58,138,0.4)
            `,
            backdropFilter: 'blur(8px)'
          }}
        >
          {/* Wave animation layers */}
          {phase !== "idle" && !isPaused && (
            <>
              <div 
                className="absolute w-[150%] h-[50%] -left-[25%] rounded-[40%]"
                style={{
                  bottom: '60%',
                  background: 'rgba(255,255,255,0.15)',
                  animation: 'wave 3s ease-in-out infinite',
                }}
              />
              <div 
                className="absolute w-[150%] h-[50%] -left-[25%] rounded-[45%]"
                style={{
                  bottom: '55%',
                  background: 'rgba(96,165,250,0.25)',
                  animation: 'wave 4s ease-in-out infinite reverse',
                }}
              />
              <div 
                className="absolute w-[150%] h-[40%] -left-[25%] rounded-[50%]"
                style={{
                  bottom: '65%',
                  background: 'rgba(147,197,253,0.2)',
                  animation: 'wave 3.5s ease-in-out infinite 0.5s',
                }}
              />
            </>
          )}
          
          {/* Soft inner glow highlight */}
          <div 
            className="absolute top-[10%] left-[15%] w-[50%] h-[35%] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse, rgba(255,255,255,0.35) 0%, transparent 70%)',
              filter: 'blur(10px)',
            }}
          />
          
          <div className="text-center flex flex-col items-center justify-center relative z-10">
            {phase === "idle" ? (
              <span className="text-[1.5rem] font-bold text-white drop-shadow-lg">
                Breathe
              </span>
            ) : (
              <>
                <span className="text-[1.5rem] font-bold text-white drop-shadow-lg">
                  {isPaused ? "Paused" : getPhaseDisplayName()}
                </span>
                <span className="text-[1.5rem] text-white mt-1 drop-shadow-lg">
                  {Math.max(0, Math.ceil(timeRemaining))}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes wave {
          0%, 100% { transform: translateX(-25%) rotate(0deg); }
          50% { transform: translateX(0%) rotate(2deg); }
        }
      `}</style>
    </div>
  );
};

export default BreathingCircle;
