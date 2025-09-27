import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBreathingExercise } from "@/context/BreathingExerciseContext";
import { useToast } from "@/hooks/use-toast";
import { BreathingExercise } from "@/types/breathingExercise";

interface EditExerciseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exercise: BreathingExercise;
}

const EditExerciseModal = ({ open, onOpenChange, exercise }: EditExerciseModalProps) => {
  const { updateExercise } = useBreathingExercise();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    detailedDescription: "",
    inhaleDuration: 4,
    firstHoldDuration: 4,
    exhaleDuration: 4,
    secondHoldDuration: 4,
    repetitions: 10,
    stepByStepInstructions: "",
    whenToUse: "",
    howItHelps: "",
    commonMistakes: "",
  });

  // Pre-fill form data when exercise changes or modal opens
  useEffect(() => {
    if (exercise && open) {
      setFormData({
        title: exercise.title || "",
        description: exercise.description || "",
        detailedDescription: exercise.detailedDescription || "",
        inhaleDuration: exercise.inhaleDuration,
        firstHoldDuration: exercise.firstHoldDuration,
        exhaleDuration: exercise.exhaleDuration,
        secondHoldDuration: exercise.secondHoldDuration,
        repetitions: exercise.repetitions,
        stepByStepInstructions: exercise.stepByStepInstructions ? exercise.stepByStepInstructions.join('\n') : "",
        whenToUse: exercise.whenToUse ? exercise.whenToUse.join('\n') : "",
        howItHelps: exercise.howItHelps || "",
        commonMistakes: exercise.commonMistakes ? exercise.commonMistakes.join('\n') : "",
      });
    }
  }, [exercise, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for your breathing exercise.",
        variant: "destructive",
      });
      return;
    }

    const updatedExercise = {
      title: formData.title,
      description: formData.description || undefined,
      detailedDescription: formData.detailedDescription || undefined,
      inhaleDuration: formData.inhaleDuration,
      firstHoldDuration: formData.firstHoldDuration,
      exhaleDuration: formData.exhaleDuration,
      secondHoldDuration: formData.secondHoldDuration,
      repetitions: formData.repetitions,
      stepByStepInstructions: formData.stepByStepInstructions ? 
        formData.stepByStepInstructions.split('\n').filter(step => step.trim()) : undefined,
      whenToUse: formData.whenToUse ? 
        formData.whenToUse.split('\n').filter(use => use.trim()) : undefined,
      howItHelps: formData.howItHelps || undefined,
      commonMistakes: formData.commonMistakes ? 
        formData.commonMistakes.split('\n').filter(mistake => mistake.trim()) : undefined,
    };

    updateExercise(exercise.id, updatedExercise);
    
    toast({
      title: "Success",
      description: "Breathing exercise updated successfully!",
    });
    
    onOpenChange(false);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Breathing Exercise</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter exercise name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Short Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Shown in the breathing exercises list"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="detailedDescription">Detailed Description</Label>
            <Textarea
              id="detailedDescription"
              value={formData.detailedDescription}
              onChange={(e) => handleInputChange("detailedDescription", e.target.value)}
              placeholder="Optional detailed description of what this breathing exercise does"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="inhale">Inhale (seconds)</Label>
              <Input
                id="inhale"
                type="number"
                min="1"
                max="30"
                value={formData.inhaleDuration}
                onChange={(e) => handleInputChange("inhaleDuration", parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="firstHold">First Hold (seconds)</Label>
              <Input
                id="firstHold"
                type="number"
                min="0"
                max="30"
                value={formData.firstHoldDuration}
                onChange={(e) => handleInputChange("firstHoldDuration", parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exhale">Exhale (seconds)</Label>
              <Input
                id="exhale"
                type="number"
                min="1"
                max="30"
                value={formData.exhaleDuration}
                onChange={(e) => handleInputChange("exhaleDuration", parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondHold">Second Hold (seconds)</Label>
              <Input
                id="secondHold"
                type="number"
                min="0"
                max="30"
                value={formData.secondHoldDuration}
                onChange={(e) => handleInputChange("secondHoldDuration", parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="repetitions">Number of Repetitions</Label>
            <Input
              id="repetitions"
              type="number"
              min="1"
              max="50"
              value={formData.repetitions}
              onChange={(e) => handleInputChange("repetitions", parseInt(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stepByStepInstructions">Step-by-Step Instructions (Optional)</Label>
            <Textarea
              id="stepByStepInstructions"
              value={formData.stepByStepInstructions}
              onChange={(e) => handleInputChange("stepByStepInstructions", e.target.value)}
              placeholder="Enter each instruction on a new line"
              rows={4}
            />
            <p className="text-xs text-muted-foreground">Each line will be a separate instruction step</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="whenToUse">When to Use (Optional)</Label>
            <Textarea
              id="whenToUse"
              value={formData.whenToUse}
              onChange={(e) => handleInputChange("whenToUse", e.target.value)}
              placeholder="Enter each use case on a new line"
              rows={3}
            />
            <p className="text-xs text-muted-foreground">Each line will be a separate use case</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="howItHelps">How it Helps (Optional)</Label>
            <Textarea
              id="howItHelps"
              value={formData.howItHelps}
              onChange={(e) => handleInputChange("howItHelps", e.target.value)}
              placeholder="Describe the benefits and how this exercise helps"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="commonMistakes">Common Mistakes (Optional)</Label>
            <Textarea
              id="commonMistakes"
              value={formData.commonMistakes}
              onChange={(e) => handleInputChange("commonMistakes", e.target.value)}
              placeholder="Enter each common mistake on a new line"
              rows={3}
            />
            <p className="text-xs text-muted-foreground">Each line will be a separate mistake</p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditExerciseModal;