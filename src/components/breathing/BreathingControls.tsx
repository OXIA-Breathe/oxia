
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
        className="flex items-center justify-center flex-1 sm:flex-initial min-w-[60px]"
      >
        {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
      </Button>
      
      <Button 
        onClick={onReset} 
        variant="outline"
        size="lg"
        className="flex items-center justify-center border-red-400 hover:bg-red-100 hover:text-red-600 text-red-500 flex-1 sm:flex-initial min-w-[60px]"
        disabled={(phase === "idle" || phase === "countdown") && currentRepetition === 0}
      >
        <RotateCcw className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default BreathingControls;
