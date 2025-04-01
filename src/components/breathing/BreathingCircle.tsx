
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";

interface BreathingCircleProps {
  phase: "inhale" | "exhale" | "hold" | "idle";
  duration: number;
  size?: "sm" | "md" | "lg";
  riskLevel?: "Minimal" | "Low" | "Moderate" | "High";
  onCircleClick?: () => void;
}

const BreathingCircle = ({ 
  phase, 
  duration, 
  size = "lg", 
  riskLevel = "Minimal",
  onCircleClick
}: BreathingCircleProps) => {
  const circleRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [timeRemaining, setTimeRemaining] = useState(duration);
  
  const sizeClasses = {
    sm: "w-32 h-32",
    md: "w-48 h-48",
    lg: "w-64 h-64",
  };

  useEffect(() => {
    setTimeRemaining(duration);
    
    if (circleRef.current) {
      if (phase === "inhale") {
        circleRef.current.style.setProperty("--breathe-in-duration", `${duration}s`);
      } else if (phase === "exhale") {
        circleRef.current.style.setProperty("--breathe-out-duration", `${duration}s`);
      } else if (phase === "hold") {
        circleRef.current.style.setProperty("--breathe-hold-duration", `${duration}s`);
      }
    }
  }, [phase, duration]);
  
  useEffect(() => {
    if (phase === "idle") return;
    
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) return 0;
        return prev - 0.1;
      });
    }, 100);
    
    return () => clearInterval(timer);
  }, [phase]);
  
  return (
    <div className="relative flex flex-col items-center justify-center">
      <div 
        ref={circleRef}
        className={`breathing-circle ${sizeClasses[size]} ${phase !== "idle" ? phase : ""} backdrop-blur-md bg-opacity-50 shadow-lg relative z-10 cursor-pointer`}
        style={{ 
          transform: phase === "idle" ? "scale(1)" : undefined
        }}
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
                {phase.charAt(0).toUpperCase() + phase.slice(1)}
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
