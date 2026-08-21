
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

interface BreathingControlsProps {
  isActive: boolean;
  phase: "inhale" | "exhale" | "hold1" | "hold2" | "idle" | "countdown";
  currentRepetition: number;
  onToggle: () => void;
  onReset: () => void;
  isAuthenticated: boolean;
  remainingSessions: number;
}

const BreathingControls = ({ 
  isActive, 
  phase, 
  currentRepetition, 
  onToggle, 
  onReset,
  isAuthenticated,
  remainingSessions
}: BreathingControlsProps) => {
  return (
    <div className="flex flex-col items-center gap-3">
      {!isAuthenticated && (
        <p className="text-sm text-muted-foreground">
          {remainingSessions > 0
            ? `${remainingSessions} free ${remainingSessions === 1 ? 'session' : 'sessions'} remaining`
            : 'Sign up to continue'}
        </p>
      )}

      <div className="flex gap-6 sm:gap-8 px-4">
        <Button
          onClick={onToggle}
          variant="default"
          size="icon"
          className="h-16 w-16 rounded-full bg-primary text-primary-foreground shadow-[0_8px_24px_-8px_hsl(211_60%_33%_/_0.5)] hover:bg-primary/90"
        >
          {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
        </Button>

        <Button
          onClick={onReset}
          variant="outline"
          size="icon"
          className="h-16 w-16 rounded-full bg-card/80 backdrop-blur-sm border-border text-muted-foreground hover:text-foreground hover:bg-card"
          disabled={(phase === "idle" || phase === "countdown") && currentRepetition === 0}
        >
          <RotateCcw className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default BreathingControls;
