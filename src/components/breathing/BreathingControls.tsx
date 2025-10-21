
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
    <div className="flex gap-8 sm:gap-10 px-4">
      <Button 
        onClick={onToggle} 
        variant="default"
        size="icon"
        className="h-16 w-16 rounded-full"
      >
        {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
      </Button>
      
      <Button 
        onClick={onReset} 
        variant="outline"
        size="icon"
        className="h-16 w-16 rounded-full border-red-400 hover:bg-red-100 hover:text-red-600 text-red-500"
        disabled={(phase === "idle" || phase === "countdown") && currentRepetition === 0}
      >
        <RotateCcw className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default BreathingControls;
