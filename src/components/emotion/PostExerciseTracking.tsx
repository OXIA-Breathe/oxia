import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Smile, Frown, Battery, BatteryLow } from "lucide-react";

interface PostExerciseTrackingProps {
  breathCount: number;
  duration: number;
  onSubmit: (valence: number, arousal: number, note: string) => void;
  onSkip: () => void;
}

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins} min ${secs} sec`;
};

const PostExerciseTracking = ({ breathCount, duration, onSubmit, onSkip }: PostExerciseTrackingProps) => {
  const [valence, setValence] = useState(4);
  const [arousal, setArousal] = useState(4);
  const [note, setNote] = useState("");

  const handleSubmit = () => {
    onSubmit(valence, arousal, note);
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-none shadow-lg max-w-sm mx-auto">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-lg">
          Session Complete! 🎉
        </CardTitle>
        <p className="text-center text-sm text-muted-foreground">
          {breathCount} breaths • {formatDuration(duration)}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center text-sm font-medium text-muted-foreground">
          How do you feel now?
        </div>

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
              Energized <Battery className="w-4 h-4" />
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

        {/* Optional Note */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">
            Anything you want to remember? (optional)
          </label>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note..."
            className="resize-none h-20"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="ghost" className="flex-1" onClick={onSkip}>
            Skip
          </Button>
          <Button className="flex-1" onClick={handleSubmit}>
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostExerciseTracking;
