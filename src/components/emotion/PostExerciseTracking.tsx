import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Heart, Zap } from "lucide-react";

interface PostExerciseTrackingProps {
  breathCount: number;
  duration: number;
  exerciseTitle?: string;
  onSubmit: (valence: number, arousal: number, note: string) => void;
  onSkip: () => void;
}

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins > 0 && secs > 0) return `${mins} min ${secs} sec`;
  if (mins > 0) return `${mins} min`;
  return `${secs} sec`;
};

const getValenceLabel = (value: number) => {
  const labels = ["Very Negative", "Negative", "Slightly Negative", "Neutral", "Slightly Positive", "Positive", "Very Positive"];
  return labels[value - 1];
};

const getArousalLabel = (value: number) => {
  const labels = ["Very Calm", "Calm", "Slightly Calm", "Neutral", "Slightly Energized", "Energized", "Very Energized"];
  return labels[value - 1];
};

const PostExerciseTracking = ({ breathCount, duration, exerciseTitle, onSubmit, onSkip }: PostExerciseTrackingProps) => {
  const [valence, setValence] = useState(4);
  const [arousal, setArousal] = useState(4);
  const [note, setNote] = useState("");

  const handleSubmit = () => {
    onSubmit(valence, arousal, note);
  };

  return (
    <Card className="border-green-500/20 bg-gradient-to-b from-green-500/5 to-transparent max-w-sm mx-auto">
      <CardHeader className="pb-3 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-3">
          <Sparkles className="h-8 w-8 text-green-500" />
        </div>
        <CardTitle className="text-xl">Session Complete!</CardTitle>
        <p className="text-sm text-muted-foreground">
          {formatDuration(duration)} • {breathCount} breaths{exerciseTitle ? ` • ${exerciseTitle}` : ''}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 rounded-lg bg-card/50 space-y-5">
          <p className="text-sm font-medium text-center text-muted-foreground">How do you feel now?</p>
          
          {/* Valence Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <Heart className="h-4 w-4 text-rose-400" />
                Mood
              </label>
              <span className="text-xs text-green-500 font-medium px-2 py-1 bg-green-500/10 rounded-full">
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
              <span className="text-xs text-green-500 font-medium px-2 py-1 bg-green-500/10 rounded-full">
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

          {/* Note field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Anything you want to remember? (optional)
            </label>
            <Textarea
              placeholder="e.g., Feeling much calmer after a stressful morning..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="resize-none h-20 bg-background/50"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onSkip}>
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
