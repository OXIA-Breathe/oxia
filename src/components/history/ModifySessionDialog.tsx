
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
    breathCount: 0,
    totalDuration: 0,
  });

  useEffect(() => {
    if (session) {
      const sessionDate = new Date(session.date);
      setFormData({
        exerciseTitle: session.exerciseTitle || exercises[0]?.title || "",
        date: format(sessionDate, "yyyy-MM-dd"),
        time: format(sessionDate, "HH:mm"),
        breathCount: session.breathCount,
        totalDuration: session.totalDuration,
      });
    }
  }, [session, exercises]);

  const handleSave = () => {
    if (!session) return;

    const combinedDateTime = new Date(`${formData.date}T${formData.time}`);
    
    const updatedSession: BreathSession = {
      ...session,
      exerciseTitle: formData.exerciseTitle,
      date: combinedDateTime.toISOString(),
      breathCount: formData.breathCount,
      totalDuration: formData.totalDuration,
    };

    onSave(updatedSession);
    onOpenChange(false);
  };

  if (!session) return null;

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
              onChange={(e) => setFormData(prev => ({ ...prev, breathCount: parseInt(e.target.value) || 0 }))}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="totalTime">Total Time (seconds)</Label>
            <Input
              id="totalTime"
              type="number"
              min="1"
              value={formData.totalDuration}
              onChange={(e) => setFormData(prev => ({ ...prev, totalDuration: parseInt(e.target.value) || 0 }))}
            />
          </div>
        </div>
        
        <DialogFooter>
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
