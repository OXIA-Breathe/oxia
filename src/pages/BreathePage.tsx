import { useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import ExerciseCard from "@/components/breathing/ExerciseCard";
import CreateExerciseModal from "@/components/breathing/CreateExerciseModal";
import { Button } from "@/components/ui/button";
import { useBreathingExercise } from "@/context/BreathingExerciseContext";
import { useToast } from "@/hooks/use-toast";

const BreathePage = () => {
  const navigate = useNavigate();
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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 text-foreground">Breathing Exercises</h1>
          <p className="text-center text-foreground/80 mb-8">
            Choose a technique, calm your mind, and begin your journey inward.
          </p>
        </div>
        
        <div className="space-y-4 pb-20">
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
        <Button
          onClick={() => setIsModalOpen(true)}
          className="fixed md:bottom-6 right-6 h-14 w-14 rounded-full bg-breath hover:bg-breath/90 shadow-lg"
          style={{
            bottom: 'calc(6rem + env(safe-area-inset-bottom))'
          }}
          size="icon"
        >
          <Plus className="h-6 w-6" />
        </Button>

        <CreateExerciseModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      </div>
    </MainLayout>
  );
};

export default BreathePage;
