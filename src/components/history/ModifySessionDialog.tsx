
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
import { BreathSession } from "@/types/breath";
import { useBreathingExercise } from "@/context/BreathingExerciseContext";

interface ModifySessionDialogProps {
  session: BreathSession | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedSession: BreathSession) => void;
}

const ModifySessionDialog = ({ session, open, onOpenChange, onSave }: ModifySessionDialogProps) => {
  const { exercises } = useBreathingExercise();
  const [formData, setFormData] = useState({
    exerciseTitle: "",
    date: "",
    time: "",
    breathCount: "",
  });

  useEffect(() => {
    if (session) {
      const sessionDate = new Date(session.date);
      setFormData({
        exerciseTitle: session.exerciseTitle || exercises[0]?.title || "",
        date: format(sessionDate, "yyyy-MM-dd"),
        time: format(sessionDate, "HH:mm"),
        breathCount: session.breathCount.toString(),
      });
    }
  }, [session, exercises]);

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
    if (!session) return;

    const combinedDateTime = new Date(`${formData.date}T${formData.time}`);
    const breathCount = parseInt(formData.breathCount) || 1;
    const totalDuration = calculateTotalDuration(formData.exerciseTitle, breathCount);
    
    // Calculate average hold duration from the selected exercise
    const selectedExercise = exercises.find(ex => ex.title === formData.exerciseTitle);
    const holdDuration = selectedExercise 
      ? Math.round((selectedExercise.firstHoldDuration + selectedExercise.secondHoldDuration) / 2)
      : 4; // fallback
    
    const updatedSession: BreathSession = {
      ...session,
      exerciseTitle: formData.exerciseTitle,
      date: combinedDateTime.toISOString(),
      breathCount: breathCount,
      totalDuration: totalDuration,
      holdDuration: holdDuration,
      repetitions: breathCount, // Using breathCount as repetitions for consistency
    };

    onSave(updatedSession);
    onOpenChange(false);
  };

  if (!session) return null;

  const currentTotalTime = calculateTotalDuration(formData.exerciseTitle, parseInt(formData.breathCount) || 1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modify Session</DialogTitle>
          <DialogDescription>
            Update the details of your breathing session.
          </DialogDescription>
        </DialogHeader>
        
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
            <div className="bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-600">
              {Math.floor(currentTotalTime / 60)}m {currentTotalTime % 60}s
            </div>
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModifySessionDialog;
