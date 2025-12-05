import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Heart, Zap, ChevronRight } from "lucide-react";

interface PreExerciseCheckInProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (valence: number, arousal: number) => void;
  onSkip: () => void;
}

const getValenceLabel = (value: number) => {
  const labels = ["Very Negative", "Negative", "Slightly Negative", "Neutral", "Slightly Positive", "Positive", "Very Positive"];
  return labels[value - 1];
};

const getArousalLabel = (value: number) => {
  const labels = ["Very Calm", "Calm", "Slightly Calm", "Neutral", "Slightly Energized", "Energized", "Very Energized"];
  return labels[value - 1];
};

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
      <DialogContent 
        className="bg-card/50 backdrop-blur border-primary/20 rounded-2xl max-w-sm mx-auto"
        overlayClassName="bg-[#77a9e8]/50"
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Quick check-in
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            How are you feeling right now?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-2">
          {/* Valence Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <Heart className="h-4 w-4 text-rose-400" />
                Mood
              </label>
              <span className="text-xs text-primary font-medium px-2 py-1 bg-primary/10 rounded-full">
                {getValenceLabel(valence)}
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
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Negative</span>
              <span>Positive</span>
            </div>
          </div>

          {/* Arousal Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-400" />
                Energy
              </label>
              <span className="text-xs text-primary font-medium px-2 py-1 bg-primary/10 rounded-full">
                {getArousalLabel(arousal)}
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
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Calm</span>
              <span>Energized</span>
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
