import { useState } from "react";
import { Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import ExerciseCard from "@/components/breathing/ExerciseCard";
import CreateExerciseModal from "@/components/breathing/CreateExerciseModal";
import { Button } from "@/components/ui/button";
import { useBreathingExercise } from "@/context/BreathingExerciseContext";
import { useToast } from "@/hooks/use-toast";

const BreathePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { exercises, setCurrentExercise, deleteExercise } = useBreathingExercise();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectExercise = (exercise: any) => {
    setCurrentExercise(exercise);
    navigate("/");
  };

  const handleDeleteExercise = (id: string) => {
    deleteExercise(id);
    toast({
      title: "Exercise deleted",
      description: "The breathing exercise has been removed.",
    });
  };

  return (
    <MainLayout>
      <div className="container pt-24 pb-12 max-w-4xl">
        <div className="mb-8 px-1">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/70 mb-2">
            Library
          </p>
          <h1 className="text-3xl font-bold text-foreground mb-2">Breathing exercises</h1>
          <p className="text-sm text-muted-foreground max-w-md">
            Choose a technique, calm your mind, and begin your journey inward.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 pb-20">
          {exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onSelect={handleSelectExercise}
              onDelete={handleDeleteExercise}
            />
          ))}
        </div>

        {/* Floating + Button */}
        {user && (
          <Button
            onClick={() => setIsModalOpen(true)}
            className="fixed md:bottom-6 right-6 h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_12px_28px_-8px_hsl(213_81%_19%_/_0.45)] transition-all duration-200 active:scale-95"
            style={{
              bottom: 'calc(6rem + env(safe-area-inset-bottom))'
            }}
            size="icon"
          >
            <Plus className="h-6 w-6" />
          </Button>
        )}

        <CreateExerciseModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      </div>
    </MainLayout>
  );
};

export default BreathePage;
