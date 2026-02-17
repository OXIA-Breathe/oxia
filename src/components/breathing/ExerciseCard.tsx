
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
    } else {
      return `${exercise.inhaleDuration}-${exercise.firstHoldDuration}-${exercise.exhaleDuration}`;
    }
  };

  const getDisplayTitle = () => {
    // Remove parentheses and their content for cleaner display
    return exercise.title.replace(/\s*\([^)]*\)/g, '').trim();
  };

  const handleCardClick = () => {
    onSelect(exercise);
  };

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
      className="p-4 cursor-pointer hover:shadow-md transition-shadow bg-card/90 backdrop-blur-sm"
      onClick={handleCardClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="flex-shrink-0">
            <Wind className="h-8 w-8 text-breath" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-card-foreground truncate">
              {getDisplayTitle()}
            </h3>
            {exercise.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {exercise.description}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 flex-shrink-0">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={handleInfoClick}
          >
            <Info className="h-4 w-4 text-muted-foreground" />
          </Button>
          
          {exercise.isCustom && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-destructive hover:text-destructive/80"
              onClick={handleDeleteClick}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ExerciseCard;
