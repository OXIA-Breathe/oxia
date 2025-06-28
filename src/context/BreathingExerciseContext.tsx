
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { BreathingExercise, defaultBreathingExercises } from "@/types/breathingExercise";

interface BreathingExerciseContextType {
  exercises: BreathingExercise[];
  currentExercise: BreathingExercise | null;
  addExercise: (exercise: BreathingExercise) => void;
  deleteExercise: (id: string) => void;
  setCurrentExercise: (exercise: BreathingExercise) => void;
}

const BreathingExerciseContext = createContext<BreathingExerciseContextType | undefined>(undefined);

export const BreathingExerciseProvider = ({ children }: { children: ReactNode }) => {
  const [exercises, setExercises] = useState<BreathingExercise[]>(() => {
    const savedExercises = localStorage.getItem("breathingExercises");
    return savedExercises ? JSON.parse(savedExercises) : defaultBreathingExercises;
  });

  const [currentExercise, setCurrentExercise] = useState<BreathingExercise | null>(() => {
    const savedCurrent = localStorage.getItem("currentBreathingExercise");
    if (savedCurrent) {
      return JSON.parse(savedCurrent);
    }
    // If no saved exercise, use the first one from the exercises list
    const availableExercises = localStorage.getItem("breathingExercises");
    const exercisesList = availableExercises ? JSON.parse(availableExercises) : defaultBreathingExercises;
    return exercisesList[0] || null;
  });

  useEffect(() => {
    localStorage.setItem("breathingExercises", JSON.stringify(exercises));
  }, [exercises]);

  useEffect(() => {
    if (currentExercise) {
      localStorage.setItem("currentBreathingExercise", JSON.stringify(currentExercise));
    }
  }, [currentExercise]);

  const addExercise = (exercise: BreathingExercise) => {
    setExercises((prev) => [...prev, exercise]);
  };

  const deleteExercise = (id: string) => {
    setExercises((prev) => {
      const filteredExercises = prev.filter((exercise) => exercise.id !== id);
      // If deleting current exercise, fallback to first available exercise
      if (currentExercise?.id === id) {
        setCurrentExercise(filteredExercises[0] || null);
      }
      return filteredExercises;
    });
  };

  return (
    <BreathingExerciseContext.Provider value={{
      exercises,
      currentExercise,
      addExercise,
      deleteExercise,
      setCurrentExercise,
    }}>
      {children}
    </BreathingExerciseContext.Provider>
  );
};

export const useBreathingExercise = () => {
  const context = useContext(BreathingExerciseContext);
  if (context === undefined) {
    throw new Error("useBreathingExercise must be used within a BreathingExerciseProvider");
  }
  return context;
};
