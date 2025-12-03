import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Heart, Zap, ChevronRight, X } from "lucide-react";

// Design Preview Component - Shows both pre and post exercise tracking concepts
export const EmotionTrackingPreview = () => {
  const [preValence, setPreValence] = useState(4);
  const [preArousal, setPreArousal] = useState(4);
  const [postValence, setPostValence] = useState(5);
  const [postArousal, setPostArousal] = useState(3);
  const [note, setNote] = useState("");
  const [showPreCheckIn, setShowPreCheckIn] = useState(true);

  const getValenceLabel = (value: number) => {
    const labels = ["Very Negative", "Negative", "Slightly Negative", "Neutral", "Slightly Positive", "Positive", "Very Positive"];
    return labels[value - 1];
  };

  const getArousalLabel = (value: number) => {
    const labels = ["Very Calm", "Calm", "Slightly Calm", "Neutral", "Slightly Energized", "Energized", "Very Energized"];
    return labels[value - 1];
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Emotion Tracking UI Preview</h1>
        <p className="text-muted-foreground text-sm">This is a design mockup - not functional yet</p>
      </div>

      {/* Pre-Exercise Quick Check-in */}
      <Card className="max-w-md mx-auto border-primary/20 bg-card/50 backdrop-blur">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Quick Check-in
            </CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">How are you feeling right now?</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Valence Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <Heart className="h-4 w-4 text-rose-400" />
                Mood
              </label>
              <span className="text-xs text-primary font-medium px-2 py-1 bg-primary/10 rounded-full">
                {getValenceLabel(preValence)}
              </span>
            </div>
            <Slider
              value={[preValence]}
              onValueChange={(v) => setPreValence(v[0])}
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
                {getArousalLabel(preArousal)}
              </span>
            </div>
            <Slider
              value={[preArousal]}
              onValueChange={(v) => setPreArousal(v[0])}
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

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">Skip</Button>
            <Button className="flex-1">
              Continue
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-muted-foreground text-sm">↓ After breathing exercise ↓</div>

      {/* Post-Exercise Tracking (Integrated into completion) */}
      <Card className="max-w-md mx-auto border-green-500/20 bg-gradient-to-b from-green-500/5 to-transparent">
        <CardHeader className="pb-3 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-3">
            <Sparkles className="h-8 w-8 text-green-500" />
          </div>
          <CardTitle className="text-xl">Session Complete!</CardTitle>
          <p className="text-sm text-muted-foreground">5 minutes • 12 breaths • Box Breathing</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 rounded-lg bg-card/50 space-y-5">
            <p className="text-sm font-medium text-center text-muted-foreground">How do you feel now?</p>
            
            {/* Post Valence */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Heart className="h-4 w-4 text-rose-400" />
                  Mood
                </label>
                <span className="text-xs text-green-500 font-medium px-2 py-1 bg-green-500/10 rounded-full">
                  {getValenceLabel(postValence)}
                </span>
              </div>
              <Slider
                value={[postValence]}
                onValueChange={(v) => setPostValence(v[0])}
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

            {/* Post Arousal */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-400" />
                  Energy
                </label>
                <span className="text-xs text-green-500 font-medium px-2 py-1 bg-green-500/10 rounded-full">
                  {getArousalLabel(postArousal)}
                </span>
              </div>
              <Slider
                value={[postArousal]}
                onValueChange={(v) => setPostArousal(v[0])}
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
            <Button variant="outline" className="flex-1">Skip Tracking</Button>
            <Button className="flex-1 bg-green-600 hover:bg-green-700">
              Save & Finish
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Change indicator */}
      <Card className="max-w-md mx-auto border-primary/20">
        <CardContent className="pt-4">
          <p className="text-sm text-center text-muted-foreground mb-3">Example: Session Impact</p>
          <div className="flex justify-around text-center">
            <div>
              <p className="text-xs text-muted-foreground">Mood</p>
              <p className="text-lg font-bold text-green-500">+1 ↑</p>
              <p className="text-xs text-muted-foreground">More positive</p>
            </div>
            <div className="w-px bg-border" />
            <div>
              <p className="text-xs text-muted-foreground">Energy</p>
              <p className="text-lg font-bold text-blue-500">-1 ↓</p>
              <p className="text-xs text-muted-foreground">More calm</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmotionTrackingPreview;
