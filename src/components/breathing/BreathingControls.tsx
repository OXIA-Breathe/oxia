
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

interface BreathingControlsProps {
  isActive: boolean;
  phase: "inhale" | "exhale" | "hold1" | "hold2" | "idle" | "countdown";
  currentRepetition: number;
  onToggle: () => void;
  onReset: () => void;
}

const BreathingControls = ({ 
  isActive, 
  phase, 
  currentRepetition, 
  onToggle, 
  onReset 
}: BreathingControlsProps) => {
  return (
    <div className="flex gap-3 sm:gap-4 px-4">
      <Button 
        onClick={onToggle} 
        variant="default"
        size="lg"
        className="flex items-center gap-2 flex-1 sm:flex-initial min-w-[120px]"
      >
        {isActive ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5" />}
        <span className="text-sm sm:text-base">{isActive ? "Pause" : (phase === "idle" || phase === "countdown") ? "Start" : "Resume"}</span>
      </Button>
      
      <Button 
        onClick={onReset} 
        variant="outline"
        size="lg"
        className="flex items-center gap-2 border-red-400 hover:bg-red-100 hover:text-red-600 text-red-500 flex-1 sm:flex-initial min-w-[120px]"
        disabled={(phase === "idle" || phase === "countdown") && currentRepetition === 0}
      >
        <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="text-sm sm:text-base">Reset</span>
      </Button>
    </div>
  );
};

export default BreathingControls;
