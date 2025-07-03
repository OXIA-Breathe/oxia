
import { useEffect, useState } from "react";

interface BreathingCircleProps {
  phase: "inhale" | "exhale" | "hold1" | "hold2" | "idle" | "countdown";
  duration: number;
  timeRemaining: number;
  onCircleClick: () => void;
  isPaused?: boolean;
  countdownValue?: number;
}

const BreathingCircle = ({ 
  phase, 
  duration, 
  timeRemaining, 
  onCircleClick, 
  isPaused = false,
  countdownValue = 0
}: BreathingCircleProps) => {
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (phase !== "idle" && !isPaused) {
      setAnimationKey(prev => prev + 1);
    }
  }, [phase, isPaused]);

  const getCircleClasses = () => {
    const baseClasses = "w-64 h-64 rounded-full border-4 border-white/30 flex items-center justify-center cursor-pointer transition-all duration-300 shadow-2xl";
    
    if (phase === "countdown") {
      return `${baseClasses} bg-gradient-to-br from-yellow-400 to-orange-500 animate-pulse`;
    }
    
    if (phase === "idle") {
      return `${baseClasses} bg-gradient-to-br from-breath-light to-breath hover:from-breath to-breath-dark`;
    }

    if (isPaused) {
      return `${baseClasses} bg-gradient-to-br from-gray-400 to-gray-600`;
    }

    const phaseStyles = {
      inhale: "bg-gradient-to-br from-green-400 to-blue-500",
      exhale: "bg-gradient-to-br from-purple-400 to-pink-500", 
      hold1: "bg-gradient-to-br from-yellow-400 to-orange-500",
      hold2: "bg-gradient-to-br from-yellow-400 to-orange-500"
    };

    return `${baseClasses} ${phaseStyles[phase]}`;
  };

  const getAnimationStyle = () => {
    if (phase === "idle" || phase === "countdown" || isPaused) return {};

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
    if (phase === "countdown") {
      return (
        <div className="text-center">
          <div className="text-6xl font-bold text-white mb-2">
            {countdownValue}
          </div>
          <div className="text-lg text-white/80">
            Get Ready
          </div>
        </div>
      );
    }
    
    if (phase === "idle") {
      return (
        <div className="text-center">
          <div className="text-2xl font-semibold text-white mb-2">Ready to Begin</div>
          <div className="text-sm text-white/80">Tap to start</div>
        </div>
      );
    }

    if (isPaused) {
      return (
        <div className="text-center">
          <div className="text-2xl font-semibold text-white mb-2">Paused</div>
          <div className="text-sm text-white/80">Tap to resume</div>
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
        <div className="text-2xl font-semibold text-white mb-2">
          {phaseLabels[phase]}
        </div>
        <div className="text-lg text-white/80">
          {Math.ceil(timeRemaining)}s
        </div>
      </div>
    );
  };

  return (
    <div 
      key={animationKey}
      className={getCircleClasses()} 
      style={getAnimationStyle()}
      onClick={onCircleClick}
    >
      {getDisplayText()}
    </div>
  );
};

export default BreathingCircle;
