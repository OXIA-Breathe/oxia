
import { useEffect, useState } from "react";

interface BreathingCircleProps {
  phase: "inhale" | "exhale" | "hold1" | "hold2" | "idle";
  duration: number;
  timeRemaining: number;
  onCircleClick: () => void;
  isPaused?: boolean;
}

const BreathingCircle = ({ 
  phase, 
  duration, 
  timeRemaining, 
  onCircleClick, 
  isPaused = false
}: BreathingCircleProps) => {
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (phase !== "idle" && !isPaused) {
      setAnimationKey(prev => prev + 1);
    }
  }, [phase, isPaused]);

  const getOuterCircleClasses = () => {
    return "w-64 h-64 rounded-full border-4 border-white/30 flex items-center justify-center cursor-pointer relative shadow-2xl bg-transparent";
  };

  const getInnerCircleClasses = () => {
    const baseClasses = "absolute rounded-full flex items-center justify-center transition-all duration-300";
    
    if (phase === "idle") {
      return `${baseClasses} w-32 h-32 bg-gradient-to-br from-breath-light to-breath`;
    }

    if (isPaused) {
      return `${baseClasses} w-32 h-32 bg-gradient-to-br from-gray-400 to-gray-600`;
    }

    const phaseStyles = {
      inhale: "bg-gradient-to-br from-green-400 to-blue-500",
      exhale: "bg-gradient-to-br from-purple-400 to-pink-500", 
      hold1: "bg-gradient-to-br from-yellow-400 to-orange-500",
      hold2: "bg-gradient-to-br from-yellow-400 to-orange-500"
    };

    return `${baseClasses} w-32 h-32 ${phaseStyles[phase]}`;
  };

  const getInnerCircleAnimationStyle = () => {
    if (phase === "idle" || isPaused) return {};

    const animationDuration = `${duration}s`;
    
    return {
      '--breathe-in-duration': phase === 'inhale' ? animationDuration : '4s',
      '--breathe-out-duration': phase === 'exhale' ? animationDuration : '4s',
      '--breathe-hold-duration': (phase === 'hold1' || phase === 'hold2') ? animationDuration : '4s',
      animation: phase === 'inhale' ? `breathe-in ${animationDuration} ease-in-out forwards` :
               phase === 'exhale' ? `breathe-out ${animationDuration} ease-in-out forwards` :
               (phase === 'hold1' || phase === 'hold2') ? `breathe-hold ${animationDuration} ease-in-out infinite` : 'none'
    } as React.CSSProperties;
  };

  const getDisplayText = () => {
    if (phase === "idle") {
      return (
        <div className="text-center">
          <div className="text-lg font-semibold text-white">Breathe</div>
        </div>
      );
    }

    if (isPaused) {
      return (
        <div className="text-center">
          <div className="text-lg font-semibold text-white">Paused</div>
        </div>
      );
    }

    const phaseLabels = {
      inhale: "Breathe In",
      exhale: "Breathe Out", 
      hold1: "Hold",
      hold2: "Hold"
    };

    return (
      <div className="text-center">
        <div className="text-lg font-semibold text-white mb-1">
          {phaseLabels[phase]}
        </div>
        <div className="text-sm text-white/80">
          {Math.ceil(timeRemaining)}s
        </div>
      </div>
    );
  };

  return (
    <div 
      className={getOuterCircleClasses()} 
      onClick={onCircleClick}
    >
      <div 
        key={animationKey}
        className={getInnerCircleClasses()}
        style={getInnerCircleAnimationStyle()}
      >
        {getDisplayText()}
      </div>
    </div>
  );
};

export default BreathingCircle;
