import { useState } from "react";
import { Settings, Minus, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { BreathingExercise, defaultBreathingExercises } from "@/types/breathingExercise";

interface ParametersModalProps {
  exercise: BreathingExercise;
  onSave: (parameters: Partial<BreathingExercise>) => void;
}

export const ParametersModal = ({ exercise, onSave }: ParametersModalProps) => {
  const [open, setOpen] = useState(false);
  const [inhaleDuration, setInhaleDuration] = useState(exercise.inhaleDuration);
  const [firstHoldDuration, setFirstHoldDuration] = useState(exercise.firstHoldDuration);
  const [exhaleDuration, setExhaleDuration] = useState(exercise.exhaleDuration);
  const [secondHoldDuration, setSecondHoldDuration] = useState(exercise.secondHoldDuration);

  // Get default values for reset functionality
  const getDefaultValues = () => {
    const defaultExercise = defaultBreathingExercises.find(ex => ex.id === exercise.id);
    if (defaultExercise) {
      return {
        inhaleDuration: defaultExercise.inhaleDuration,
        firstHoldDuration: defaultExercise.firstHoldDuration,
        exhaleDuration: defaultExercise.exhaleDuration,
        secondHoldDuration: defaultExercise.secondHoldDuration,
      };
    }
    // Fallback to current values if not found in defaults (for custom exercises)
    return {
      inhaleDuration: exercise.inhaleDuration,
      firstHoldDuration: exercise.firstHoldDuration,
      exhaleDuration: exercise.exhaleDuration,
      secondHoldDuration: exercise.secondHoldDuration,
    };
  };

  const defaults = getDefaultValues();
  const hasChangesFromDefaults = 
    exercise.inhaleDuration !== defaults.inhaleDuration ||
    exercise.firstHoldDuration !== defaults.firstHoldDuration ||
    exercise.exhaleDuration !== defaults.exhaleDuration ||
    exercise.secondHoldDuration !== defaults.secondHoldDuration;

  const handleSave = () => {
    onSave({
      inhaleDuration,
      firstHoldDuration,
      exhaleDuration,
      secondHoldDuration,
    });
    setOpen(false);
  };

  const handleCancel = () => {
    // Reset to current exercise values
    setInhaleDuration(exercise.inhaleDuration);
    setFirstHoldDuration(exercise.firstHoldDuration);
    setExhaleDuration(exercise.exhaleDuration);
    setSecondHoldDuration(exercise.secondHoldDuration);
    setOpen(false);
  };

  const handleResetToDefaults = () => {
    setInhaleDuration(defaults.inhaleDuration);
    setFirstHoldDuration(defaults.firstHoldDuration);
    setExhaleDuration(defaults.exhaleDuration);
    setSecondHoldDuration(defaults.secondHoldDuration);
  };

  const adjustValue = (
    currentValue: number,
    increment: number,
    setValue: (value: number) => void
  ) => {
    const newValue = Math.max(0, currentValue + increment);
    setValue(newValue);
  };

  const ParameterControl = ({
    label,
    value,
    setValue,
  }: {
    label: string;
    value: number;
    setValue: (value: number) => void;
  }) => (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600 min-w-[60px]">{label}</span>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => adjustValue(value, -1, setValue)}
          className="h-8 w-8"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <div className="text-center min-w-[40px]">
          <p className="text-lg font-bold text-gray-800">{value}s</p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => adjustValue(value, 1, setValue)}
          className="h-8 w-8"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Breathing Parameters</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {exercise.parameterSuggestion && (
            <p className="text-sm text-muted-foreground">
              {exercise.parameterSuggestion}
            </p>
          )}
          
          <div className="space-y-4">
            <ParameterControl
              label="Inhale"
              value={inhaleDuration}
              setValue={setInhaleDuration}
            />
            <ParameterControl
              label="Hold 1"
              value={firstHoldDuration}
              setValue={setFirstHoldDuration}
            />
            <ParameterControl
              label="Exhale"
              value={exhaleDuration}
              setValue={setExhaleDuration}
            />
            <ParameterControl
              label="Hold 2"
              value={secondHoldDuration}
              setValue={setSecondHoldDuration}
            />
          </div>

          {hasChangesFromDefaults && (
            <Button
              variant="outline"
              onClick={handleResetToDefaults}
              className="w-full"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Default Parameters
            </Button>
          )}
        </div>

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};