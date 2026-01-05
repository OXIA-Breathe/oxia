import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Heart, Activity, ArrowRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
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

const getPraiseMessage = (moodImproved: boolean, stressReduced: boolean, moodLabel: string): string => {
  if (moodImproved && stressReduced) {
    return `Amazing work! You've lifted your mood to ${moodLabel} and lowered your stress. That's the power of intentional breathing.`;
  } else if (moodImproved) {
    return `Great job! Your mood has improved to ${moodLabel}. Every breath brings you closer to balance.`;
  } else if (stressReduced) {
    return `Well done! You've managed to reduce your stress levels. Your body thanks you for this moment of calm.`;
  } else {
    return `You showed up for yourself today. Consistency is key — keep breathing, and the benefits will follow.`;
  }
};

const PostExerciseTracking = ({
  breathCount,
  duration,
  exerciseTitle,
  preMood,
  preStress,
  onSubmit,
  onSkip,
}: PostExerciseTrackingProps) => {
  const [mood, setMood] = useState(5); // Default to Calm
  const [stress, setStress] = useState(30); // Default lower after exercise
  const [note, setNote] = useState("");
  const [showImpactSummary, setShowImpactSummary] = useState(false);

  const currentMood = getMoodConfig(mood);
  const preMoodConfig = preMood ? getMoodConfig(preMood) : null;

  const hasPreData = preMood !== undefined && preStress !== undefined;
  const moodImproved = hasPreData && mood > preMood;
  const stressReduced = hasPreData && stress < preStress;

  const handleContinue = () => {
    if (hasPreData && !showImpactSummary) {
      // Show impact summary first
      setShowImpactSummary(true);
    } else {
      // Submit and close
      onSubmit(mood, stress, note);
    }
  };

  const handleBack = () => {
    setShowImpactSummary(false);
  };

  // Impact Summary View
  if (showImpactSummary && hasPreData) {
    const praiseMessage = getPraiseMessage(moodImproved, stressReduced, currentMood.label);

    return (
      <Card className="border-green-500/20 bg-gradient-to-b from-green-500/5 to-transparent max-w-sm mx-auto max-h-[calc(100vh-8rem)] overflow-y-auto">
        <CardHeader className="pb-3 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-3">
            <Sparkles className="h-8 w-8 text-green-500" />
          </div>
          <CardTitle className="text-xl">Session Impact</CardTitle>
          <p className="text-sm text-muted-foreground">
            {formatDuration(duration)} • {breathCount} breaths{exerciseTitle ? ` • ${exerciseTitle}` : ""}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Praise Message */}
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 text-center">
            <p className="text-sm text-foreground leading-relaxed">{praiseMessage}</p>
          </div>

          {/* Stats Cards */}
          <div className="space-y-3">
            {/* Mood Change Card */}
            <div
              className="p-4 rounded-lg"
              style={{
                background: `linear-gradient(135deg, ${preMoodConfig?.bgColor || "transparent"} 0%, ${currentMood.bgColor} 100%)`,
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-rose-400" />
                  <span className="text-sm font-medium">Mood</span>
                </div>
                {moodImproved ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : mood < (preMood || 0) ? (
                  <TrendingDown className="h-4 w-4 text-amber-500" />
                ) : (
                  <Minus className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="flex items-center justify-center gap-3 mt-3">
                <div className="flex flex-col items-center gap-1">
                  <img src={preMoodConfig?.icon} alt={preMoodConfig?.label} className="w-10 h-10" />
                  <span className="text-xs" style={{ color: preMoodConfig?.color }}>
                    {preMoodConfig?.label}
                  </span>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                <div className="flex flex-col items-center gap-1">
                  <img src={currentMood.icon} alt={currentMood.label} className="w-10 h-10" />
                  <span className="text-xs" style={{ color: currentMood.color }}>
                    {currentMood.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Stress Change Card */}
            <div
              className="p-4 rounded-lg"
              style={{
                background: `linear-gradient(135deg, ${getStressBgColor(preStress)} 0%, ${getStressBgColor(stress)} 100%)`,
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-medium">Stress Level</span>
                </div>
                {stressReduced ? (
                  <TrendingDown className="h-4 w-4 text-green-500" />
                ) : stress > preStress ? (
                  <TrendingUp className="h-4 w-4 text-amber-500" />
                ) : (
                  <Minus className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="flex items-center justify-center gap-4 mt-3">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold" style={{ color: getStressColor(preStress) }}>
                    {preStress}%
                  </span>
                  <span className="text-xs text-muted-foreground">{getStressLabel(preStress)}</span>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold" style={{ color: getStressColor(stress) }}>
                    {stress}%
                  </span>
                  <span className="text-xs text-muted-foreground">{getStressLabel(stress)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Note Display */}
          {note && (
            <div className="p-3 rounded-lg bg-card/50 border border-border/50">
              <p className="text-xs text-muted-foreground mb-1">Your note</p>
              <p className="text-sm">{note}</p>
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={handleBack}>
              Back
            </Button>
            <Button className="flex-1" onClick={handleContinue}>
              Done
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Input View (default)
  return (
    <Card className="border-green-500/20 bg-gradient-to-b from-green-500/5 to-transparent max-w-sm mx-auto max-h-[calc(100vh-8rem)] overflow-y-auto">
      <CardHeader className="pb-3 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-3">
          <Sparkles className="h-8 w-8 text-green-500" />
        </div>
        <CardTitle className="text-xl">Session Complete!</CardTitle>
        <p className="text-sm text-muted-foreground">
          {formatDuration(duration)} • {breathCount} breaths{exerciseTitle ? ` • ${exerciseTitle}` : ""}
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
                  backgroundColor: currentMood.bgColor,
                }}
              >
                {currentMood.label}
              </span>
            </div>
            <Slider value={[mood]} onValueChange={(v) => setMood(v[0])} min={1} max={7} step={1} className="w-full" />
            {/* Mood icons row */}
            <div className="flex justify-between px-0.5">
              {MOODS.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMood(m.value)}
                  className={`w-8 h-8 rounded-full transition-all ${
                    mood === m.value ? "scale-110" : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={m.icon} alt={m.label} className="w-full h-full object-contain" />
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
                  backgroundColor: getStressBgColor(stress),
                }}
              >
                {getStressLabel(stress)}
              </span>
            </div>
            <Slider
              value={[100 - stress]}
              onValueChange={(v) => setStress(100 - v[0])}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Very High</span>
              <span>Very Low</span>
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
          <Button className="flex-1" onClick={handleContinue}>
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostExerciseTracking;
