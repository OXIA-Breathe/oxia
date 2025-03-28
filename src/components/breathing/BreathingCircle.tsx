
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
  
  const sizeClasses = {
    sm: "w-32 h-32",
    md: "w-48 h-48",
    lg: "w-64 h-64",
  };

  useEffect(() => {
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
  
  return (
    <div 
      ref={circleRef}
      className={`breathing-circle ${sizeClasses[size]} ${phase !== "idle" ? phase : ""}`}
      style={{ 
        transform: phase === "idle" ? "scale(1)" : undefined
      }}
    >
      <div className="text-center">
        <span className="text-2xl font-bold text-primary-foreground">{phase !== "idle" ? phase.charAt(0).toUpperCase() + phase.slice(1) : "Ready"}</span>
      </div>
    </div>
  );
};

export default BreathingCircle;
