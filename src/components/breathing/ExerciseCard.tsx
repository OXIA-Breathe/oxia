import { Trash2, Info, Wind } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BreathingExercise } from "@/types/breathingExercise";
import { useNavigate } from "react-router-dom";

interface ExerciseCardProps {
  exercise: BreathingExercise;
  onSelect: (exercise: BreathingExercise) => void;
  onDelete: (id: string) => void;
}

const ExerciseCard = ({ exercise, onSelect, onDelete }: ExerciseCardProps) => {
  const navigate = useNavigate();

  const getBreathingPattern = () => {
    if (exercise.secondHoldDuration > 0) {
      return `${exercise.inhaleDuration}-${exercise.firstHoldDuration}-${exercise.exhaleDuration}-${exercise.secondHoldDuration}`;
    }
    return `${exercise.inhaleDuration}-${exercise.firstHoldDuration}-${exercise.exhaleDuration}`;
  };

  const getDisplayTitle = () => exercise.title.replace(/\s*\([^)]*\)/g, "").trim();

  const handleCardClick = () => onSelect(exercise);
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(exercise.id);
  };
  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/breathe/${exercise.id}`);
  };

  return (
    <Card
      className="group relative p-5 cursor-pointer hover:shadow-[0_12px_28px_-12px_hsl(213_81%_19%_/_0.25)] transition-all active:scale-[0.98] bg-card rounded-3xl h-full flex flex-col"
      onClick={handleCardClick}
    >
      {/* Top: icon chip + actions */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
          <Wind className="h-6 w-6 text-primary" />
        </div>
        <div className="flex items-center gap-1 -mr-1 -mt-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full hover:bg-secondary"
            onClick={handleInfoClick}
            aria-label="Exercise info"
          >
            <Info className="h-4 w-4 text-muted-foreground" />
          </Button>
          {exercise.isCustom && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-full text-destructive hover:text-destructive/80 hover:bg-destructive/10"
              onClick={handleDeleteClick}
              aria-label="Delete exercise"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-base font-bold text-card-foreground leading-snug mb-1">
        {getDisplayTitle()}
      </h3>
      {exercise.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
          {exercise.description}
        </p>
      )}

      {/* Footer: pattern pill */}
      <div className="mt-auto pt-2">
        <span className="inline-flex items-center text-[11px] font-semibold tracking-wide text-primary bg-secondary px-2.5 py-1 rounded-full tabular-nums">
          {getBreathingPattern()}
        </span>
      </div>
    </Card>
  );
};

export default ExerciseCard;
