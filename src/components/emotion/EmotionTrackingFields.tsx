import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Activity, MessageSquare } from "lucide-react";
import { MOODS, getMoodConfig, getStressLabel, getStressColor, getStressBgColor } from "@/constants/emotionConfig";

export interface EmotionValues {
  mood: number;
  stress: number;
  note?: string;
}

interface EmotionTrackingFieldsProps {
  label: string;
  mood: number;
  stress: number;
  note?: string;
  showNote?: boolean;
  onMoodChange: (value: number) => void;
  onStressChange: (value: number) => void;
  onNoteChange?: (value: string) => void;
}

const EmotionTrackingFields = ({
  label,
  mood,
  stress,
  note = "",
  showNote = false,
  onMoodChange,
  onStressChange,
  onNoteChange,
}: EmotionTrackingFieldsProps) => {
  const [isStressSliderActive, setIsStressSliderActive] = useState(false);
  const currentMood = getMoodConfig(mood);

  return (
    <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border/50">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      
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
          onValueChange={(v) => onMoodChange(v[0])}
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
              onClick={() => onMoodChange(m.value)}
              className={`w-7 h-7 rounded-full transition-all ${
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
            onValueChange={(v) => onStressChange(100 - v[0])}
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

      {/* Note field (only for After section) */}
      {showNote && onNoteChange && (
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary/70" />
            Note (optional)
          </label>
          <Textarea
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
            placeholder="How did you feel during the session?"
            className="h-20 resize-none bg-background"
          />
        </div>
      )}
    </div>
  );
};

export default EmotionTrackingFields;
