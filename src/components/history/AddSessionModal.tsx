
import { useState } from "react";
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
import { v4 as uuidv4 } from "uuid";

interface AddSessionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (newSession: BreathSession) => void;
}

const AddSessionModal = ({ open, onOpenChange, onSave }: AddSessionModalProps) => {
  const { exercises } = useBreathingExercise();
  const [formData, setFormData] = useState({
    exerciseTitle: exercises[0]?.title || "",
    date: format(new Date(), "yyyy-MM-dd"),
    time: format(new Date(), "HH:mm"),
    breathCount: "10",
    totalDuration: "60",
    holdDuration: "5",
  });

  const handleSave = () => {
    const combinedDateTime = new Date(`${formData.date}T${formData.time}`);
    
    const newSession: BreathSession = {
      id: uuidv4(),
      exerciseTitle: formData.exerciseTitle,
      date: combinedDateTime.toISOString(),
      breathCount: parseInt(formData.breathCount) || 1,
      totalDuration: parseInt(formData.totalDuration) || 1,
      holdDuration: parseInt(formData.holdDuration) || 1,
      repetitions: parseInt(formData.breathCount) || 1, // Using breathCount as repetitions for consistency
    };

    onSave(newSession);
    
    // Reset form
    setFormData({
      exerciseTitle: exercises[0]?.title || "",
      date: format(new Date(), "yyyy-MM-dd"),
      time: format(new Date(), "HH:mm"),
      breathCount: "10",
      totalDuration: "60",
      holdDuration: "5",
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Custom Session</DialogTitle>
          <DialogDescription>
            Add a breathing session to your progress history.
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
            <Label htmlFor="holdDuration">Hold Duration (seconds)</Label>
            <Input
              id="holdDuration"
              type="number"
              min="1"
              value={formData.holdDuration}
              onChange={(e) => setFormData(prev => ({ ...prev, holdDuration: e.target.value }))}
              onFocus={(e) => e.target.select()}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="totalTime">Total Time (seconds)</Label>
            <Input
              id="totalTime"
              type="number"
              min="1"
              value={formData.totalDuration}
              onChange={(e) => setFormData(prev => ({ ...prev, totalDuration: e.target.value }))}
              onFocus={(e) => e.target.select()}
            />
          </div>
        </div>
        
        <DialogFooter className="gap-2">
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
