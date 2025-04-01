
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";

interface BreathingCircleProps {
  phase: "inhale" | "exhale" | "hold" | "idle";
  duration: number;
  size?: "sm" | "md" | "lg";
}

const BreathingCircle = ({ phase, duration, size = "lg" }: BreathingCircleProps) => {
  const circleRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [timeRemaining, setTimeRemaining] = useState(duration);
  
  const sizeClasses = {
    sm: "w-32 h-32",
    md: "w-48 h-48",
    lg: "w-64 h-64",
  };

  useEffect(() => {
    // Reset timer when phase or duration changes
    setTimeRemaining(duration);
    
    if (circleRef.current) {
      // Set the CSS variable for animation duration
      if (phase === "inhale") {
        circleRef.current.style.setProperty("--breathe-in-duration", `${duration}s`);
      } else if (phase === "exhale") {
        circleRef.current.style.setProperty("--breathe-out-duration", `${duration}s`);
      } else if (phase === "hold") {
        circleRef.current.style.setProperty("--breathe-hold-duration", `${duration}s`);
      }
    }
  }, [phase, duration]);
  
  // Countdown timer
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
    <div 
      ref={circleRef}
      className={`breathing-circle ${sizeClasses[size]} ${phase !== "idle" ? phase : ""}`}
      style={{ 
        transform: phase === "idle" ? "scale(1)" : undefined
      }}
    >
      <div className="text-center flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-primary-foreground">
          {phase !== "idle" ? phase.charAt(0).toUpperCase() + phase.slice(1) : "Ready"}
        </span>
        {phase !== "idle" && (
          <span className="text-xl text-primary-foreground mt-1">
            {Math.max(0, Math.ceil(timeRemaining))}
          </span>
        )}
      </div>
    </div>
  );
};

export default BreathingCircle;
