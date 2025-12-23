import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Heart, Activity, ArrowRight } from "lucide-react";
import { MOODS, getMoodConfig, getStressLabel, getStressColor, getStressBgColor } from "@/constants/emotionConfig";

interface PostExerciseTrackingProps {
  breathCount: number;
  duration: number;
  exerciseTitle?: string;
  preMood?: number;
  preStress?: number;
  onSubmit: (valence: number, stress: number, note: string) => void;
  onSkip: () => void;
}

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins > 0 && secs > 0) return `${mins} min ${secs} sec`;
  if (mins > 0) return `${mins} min`;
  return `${secs} sec`;
};

const PostExerciseTracking = ({ 
  breathCount, 
  duration, 
  exerciseTitle, 
  preMood,
  preStress,
  onSubmit, 
  onSkip 
}: PostExerciseTrackingProps) => {
  const [mood, setMood] = useState(5); // Default to Calm
  const [stress, setStress] = useState(30); // Default lower after exercise
  const [note, setNote] = useState("");

  const currentMood = getMoodConfig(mood);
  const preMoodConfig = preMood ? getMoodConfig(preMood) : null;

  const handleSubmit = () => {
    onSubmit(mood, stress, note);
  };

  const showImpact = preMood !== undefined && preStress !== undefined;

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

          {/* Stress Level Slider */}
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
            <Slider
              value={[stress]}
              onValueChange={(v) => setStress(v[0])}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
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

        {/* Session Impact - only show if we have pre-exercise data */}
        {showImpact && (
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
            <p className="text-sm font-medium text-center mb-3">Session Impact</p>
            <div className="space-y-3">
              {/* Mood change */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Mood</span>
                <div className="flex items-center gap-2">
                  {preMoodConfig && (
                    <>
                      <div className="flex items-center gap-1">
                        <img src={preMoodConfig.icon} alt={preMoodConfig.label} className="w-5 h-5" />
                        <span style={{ color: preMoodConfig.color }}>{preMoodConfig.label}</span>
                      </div>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    </>
                  )}
                  <div className="flex items-center gap-1">
                    <img src={currentMood.icon} alt={currentMood.label} className="w-5 h-5" />
                    <span style={{ color: currentMood.color }}>{currentMood.label}</span>
                  </div>
                </div>
              </div>
              {/* Stress change */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Stress</span>
                <div className="flex items-center gap-2">
                  <span style={{ color: getStressColor(preStress) }}>
                    {preStress}% ({getStressLabel(preStress)})
                  </span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <span style={{ color: getStressColor(stress) }}>
                    {stress}% ({getStressLabel(stress)})
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

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
