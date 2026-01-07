import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BreathSession, EmotionData } from "@/types/breath";
import { useBreathingExercise } from "@/context/BreathingExerciseContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import EmotionTrackingFields from "@/components/emotion/EmotionTrackingFields";

interface AddSessionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (newSession: BreathSession, emotionData?: EmotionData) => void;
}

const AddSessionModal = ({ open, onOpenChange, onSave }: AddSessionModalProps) => {
  const { exercises } = useBreathingExercise();
  const { user } = useAuth();
  const [isEmotionTrackingEnabled, setIsEmotionTrackingEnabled] = useState(false);
  
  const [formData, setFormData] = useState({
    exerciseTitle: exercises[0]?.title || "",
    date: format(new Date(), "yyyy-MM-dd"),
    time: format(new Date(), "HH:mm"),
    breathCount: "10",
  });

  // Emotion tracking state
  const [beforeMood, setBeforeMood] = useState(5);
  const [beforeStress, setBeforeStress] = useState(50);
  const [afterMood, setAfterMood] = useState(5);
  const [afterStress, setAfterStress] = useState(50);
  const [note, setNote] = useState("");

  // Check if emotion tracking is enabled for the user
  useEffect(() => {
    const checkEmotionTracking = async () => {
      if (!user) {
        setIsEmotionTrackingEnabled(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("emotion_tracking_enabled, is_subscribed")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        const enabled = data?.is_subscribed && data?.emotion_tracking_enabled;
        setIsEmotionTrackingEnabled(enabled || false);
      } catch (error) {
        console.error("Error checking emotion tracking status:", error);
        setIsEmotionTrackingEnabled(false);
      }
    };

    if (open) {
      checkEmotionTracking();
    }
  }, [user, open]);

  // Calculate total duration based on selected exercise and breath count
  const calculateTotalDuration = (exerciseTitle: string, breathCount: number) => {
    const selectedExercise = exercises.find(ex => ex.title === exerciseTitle);
    if (!selectedExercise) return 60; // fallback
    
    const singleBreathDuration = 
      selectedExercise.inhaleDuration + 
      selectedExercise.firstHoldDuration + 
      selectedExercise.exhaleDuration + 
      selectedExercise.secondHoldDuration;
    
    return singleBreathDuration * breathCount;
  };

  const handleSave = () => {
    const combinedDateTime = new Date(`${formData.date}T${formData.time}`);
    const breathCount = parseInt(formData.breathCount) || 1;
    const totalDuration = calculateTotalDuration(formData.exerciseTitle, breathCount);
    
    // Calculate average hold duration from the selected exercise
    const selectedExercise = exercises.find(ex => ex.title === formData.exerciseTitle);
    const holdDuration = selectedExercise 
      ? Math.round((selectedExercise.firstHoldDuration + selectedExercise.secondHoldDuration) / 2)
      : 4; // fallback
    
    const newSession: BreathSession = {
      id: uuidv4(),
      exerciseTitle: formData.exerciseTitle,
      date: combinedDateTime.toISOString(),
      breathCount: breathCount,
      totalDuration: totalDuration,
      holdDuration: holdDuration,
      repetitions: breathCount, // Using breathCount as repetitions for consistency
    };

    // Prepare emotion data if tracking is enabled
    let emotionData: EmotionData | undefined;
    if (isEmotionTrackingEnabled) {
      emotionData = {
        preValence: beforeMood,
        preStress: beforeStress,
        postValence: afterMood,
        postStress: afterStress,
        note: note || null,
      };
    }

    onSave(newSession, emotionData);
    
    // Reset form
    setFormData({
      exerciseTitle: exercises[0]?.title || "",
      date: format(new Date(), "yyyy-MM-dd"),
      time: format(new Date(), "HH:mm"),
      breathCount: "10",
    });
    setBeforeMood(5);
    setBeforeStress(50);
    setAfterMood(5);
    setAfterStress(50);
    setNote("");
    
    onOpenChange(false);
  };

  const currentTotalTime = calculateTotalDuration(formData.exerciseTitle, parseInt(formData.breathCount) || 1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Custom Session</DialogTitle>
          <DialogDescription>
            Add a breathing session to your progress history.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 min-h-0 pr-4 -mr-4">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="exercise">Exercise</Label>
              <Select value={formData.exerciseTitle} onValueChange={(value) => setFormData(prev => ({ ...prev, exerciseTitle: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select exercise" />
                </SelectTrigger>
                <SelectContent>
                  {exercises.map((exercise) => (
                    <SelectItem key={exercise.id} value={exercise.title}>
                      {exercise.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="breaths">Breaths</Label>
              <Input
                id="breaths"
                type="number"
                min="1"
                value={formData.breathCount}
                onChange={(e) => setFormData(prev => ({ ...prev, breathCount: e.target.value }))}
                onFocus={(e) => e.target.select()}
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Total Time</Label>
              <div className="bg-muted border border-border rounded-md px-3 py-2 text-sm text-muted-foreground">
                {Math.floor(currentTotalTime / 60)}m {currentTotalTime % 60}s
              </div>
            </div>

            {/* Emotion Tracking Section - only shown when enabled */}
            {isEmotionTrackingEnabled && (
              <>
                <EmotionTrackingFields
                  label="Before exercise"
                  mood={beforeMood}
                  stress={beforeStress}
                  onMoodChange={setBeforeMood}
                  onStressChange={setBeforeStress}
                />
                <EmotionTrackingFields
                  label="After exercise"
                  mood={afterMood}
                  stress={afterStress}
                  note={note}
                  showNote
                  onMoodChange={setAfterMood}
                  onStressChange={setAfterStress}
                  onNoteChange={setNote}
                />
              </>
            )}
          </div>
        </ScrollArea>
        
        <DialogFooter className="gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Add Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSessionModal;
