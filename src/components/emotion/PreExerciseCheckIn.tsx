import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Smile, Frown, BatteryFull, BatteryLow } from "lucide-react";

interface PreExerciseCheckInProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (valence: number, arousal: number) => void;
  onSkip: () => void;
}

const PreExerciseCheckIn = ({ open, onOpenChange, onSubmit, onSkip }: PreExerciseCheckInProps) => {
  const [valence, setValence] = useState(4);
  const [arousal, setArousal] = useState(4);

  const handleSubmit = () => {
    onSubmit(valence, arousal);
    onOpenChange(false);
  };

  const handleSkip = () => {
    onSkip();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card/98 backdrop-blur-md border-border/50 rounded-2xl max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">
            Quick check-in
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            How do you feel?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Valence Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Frown className="w-4 h-4" /> Negative
              </span>
              <span className="flex items-center gap-1">
                Positive <Smile className="w-4 h-4" />
              </span>
            </div>
            <Slider
              value={[valence]}
              onValueChange={(v) => setValence(v[0])}
              min={1}
              max={7}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground px-1">
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <span key={n} className={valence === n ? "font-bold text-primary" : ""}>
                  {n}
                </span>
              ))}
            </div>
          </div>

          {/* Arousal Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <BatteryLow className="w-4 h-4" /> Calm
              </span>
              <span className="flex items-center gap-1">
                Energized <BatteryFull className="w-4 h-4" />
              </span>
            </div>
            <Slider
              value={[arousal]}
              onValueChange={(v) => setArousal(v[0])}
              min={1}
              max={7}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground px-1">
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <span key={n} className={arousal === n ? "font-bold text-primary" : ""}>
                  {n}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={handleSkip}
            >
              Skip
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubmit}
            >
              Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreExerciseCheckIn;
