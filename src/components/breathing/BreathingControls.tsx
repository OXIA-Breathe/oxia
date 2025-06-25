
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

interface BreathingControlsProps {
  isActive: boolean;
  phase: "inhale" | "exhale" | "hold" | "idle";
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
    <div className="flex space-x-4">
      <Button 
        onClick={onToggle} 
        variant="default"
        size="lg"
        className="flex items-center space-x-2"
      >
        {isActive ? <Pause size={20} /> : <Play size={20} />}
        <span>{isActive ? "Pause" : phase === "idle" ? "Start" : "Resume"}</span>
      </Button>
      
      <Button 
        onClick={onReset} 
        variant="outline"
        size="lg"
        className="flex items-center space-x-2 border-red-400 hover:bg-red-100 hover:text-red-600 text-red-500"
        disabled={!isActive && currentRepetition === 0}
      >
        <RotateCcw size={20} />
        <span>Reset</span>
      </Button>
    </div>
  );
};

export default BreathingControls;
