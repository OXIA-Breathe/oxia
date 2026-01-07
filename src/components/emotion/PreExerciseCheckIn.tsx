import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Heart, Activity, ChevronRight } from "lucide-react";
import { MOODS, getMoodConfig, getStressLabel, getStressColor, getStressBgColor } from "@/constants/emotionConfig";

interface PreExerciseCheckInProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (valence: number, stress: number) => void;
  onSkip: () => void;
}

const PreExerciseCheckIn = ({ open, onOpenChange, onSubmit, onSkip }: PreExerciseCheckInProps) => {
  const [mood, setMood] = useState(5); // Default to Calm
  const [stress, setStress] = useState(50); // Default to Moderate
  const [isStressSliderActive, setIsStressSliderActive] = useState(false);

  const currentMood = getMoodConfig(mood);

  const handleSubmit = () => {
    onSubmit(mood, stress);
    onOpenChange(false);
  };

  const handleSkip = () => {
    onSkip();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Quick check-in
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            How are you feeling right now?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-2">
          {/* Mood Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <Heart className="h-4 w-4 text-rose-400" />
                Mood
              </label>
              <span 
                className="text-xs font-medium px-2 py-1 rounded-full"
                style={{ 
                  color: currentMood.color, 
                  backgroundColor: currentMood.bgColor 
                }}
              >
                {currentMood.label}
              </span>
            </div>
            <Slider
              value={[mood]}
              onValueChange={(v) => setMood(v[0])}
              min={1}
              max={7}
              step={1}
              className="w-full"
            />
            {/* Mood icons row */}
            <div className="flex justify-between px-0.5">
              {MOODS.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMood(m.value)}
                  className={`w-8 h-8 rounded-full transition-all ${
                    mood === m.value 
                      ? "scale-110" 
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <img 
                    src={m.icon} 
                    alt={m.label} 
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Stress Level Slider - inverted: left=high(100), right=low(0) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4 text-amber-400" />
                Stress Level
              </label>
              <span 
                className="text-xs font-medium px-2 py-1 rounded-full"
                style={{ 
                  color: getStressColor(stress), 
                  backgroundColor: getStressBgColor(stress) 
                }}
              >
                {getStressLabel(stress)}
              </span>
            </div>
            <div 
              className="relative pt-7"
              onPointerDown={() => setIsStressSliderActive(true)}
              onPointerUp={() => setIsStressSliderActive(false)}
              onPointerLeave={() => setIsStressSliderActive(false)}
            >
              {isStressSliderActive && (
                <div 
                  className="absolute top-0 text-sm font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground -translate-x-1/2 pointer-events-none transition-opacity"
                  style={{ left: `${100 - stress}%` }}
                >
                  {stress}
                </div>
              )}
              <Slider
                value={[100 - stress]}
                onValueChange={(v) => setStress(100 - v[0])}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Very High</span>
              <span>Very Low</span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={handleSkip}>
              Skip
            </Button>
            <Button className="flex-1" onClick={handleSubmit}>
              Continue
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreExerciseCheckIn;
