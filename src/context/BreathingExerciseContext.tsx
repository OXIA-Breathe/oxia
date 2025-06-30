
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
    try {
      const savedExercises = localStorage.getItem("breathingExercises");
      const parsedExercises = savedExercises ? JSON.parse(savedExercises) : defaultBreathingExercises;
      
      // Ensure we always have the default exercises, even if localStorage is corrupted
      const exerciseIds = parsedExercises.map((ex: BreathingExercise) => ex.id);
      const missingDefaults = defaultBreathingExercises.filter(
        defaultEx => !exerciseIds.includes(defaultEx.id)
      );
      
      return [...parsedExercises, ...missingDefaults];
    } catch (error) {
      console.error("Error loading breathing exercises from localStorage:", error);
      return defaultBreathingExercises;
    }
  });

  const [currentExercise, setCurrentExercise] = useState<BreathingExercise | null>(() => {
    try {
      const savedCurrent = localStorage.getItem("currentBreathingExercise");
      if (savedCurrent) {
        const parsed = JSON.parse(savedCurrent);
        // Verify the saved exercise still exists in our exercises
        const exerciseExists = exercises.some(ex => ex.id === parsed.id);
        if (exerciseExists) {
          return parsed;
        }
      }
    } catch (error) {
      console.error("Error loading current exercise from localStorage:", error);
    }
    
    // Fallback to first available exercise
    return exercises[0] || defaultBreathingExercises[0] || null;
  });

  // Re-sync with localStorage on component mount and when exercises change
  useEffect(() => {
    try {
      localStorage.setItem("breathingExercises", JSON.stringify(exercises));
    } catch (error) {
      console.error("Error saving breathing exercises to localStorage:", error);
    }
  }, [exercises]);

  useEffect(() => {
    if (currentExercise) {
      try {
        localStorage.setItem("currentBreathingExercise", JSON.stringify(currentExercise));
      } catch (error) {
        console.error("Error saving current exercise to localStorage:", error);
      }
    }
  }, [currentExercise]);

  // Additional effect to handle hot reloads and ensure state consistency
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const savedExercises = localStorage.getItem("breathingExercises");
        if (savedExercises) {
          const parsedExercises = JSON.parse(savedExercises);
          setExercises(parsedExercises);
        }
      } catch (error) {
        console.error("Error handling storage change:", error);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addExercise = (exercise: BreathingExercise) => {
    setExercises((prev) => {
      const newExercises = [...prev, exercise];
      // Immediately sync to localStorage
      try {
        localStorage.setItem("breathingExercises", JSON.stringify(newExercises));
      } catch (error) {
        console.error("Error saving new exercise to localStorage:", error);
      }
      return newExercises;
    });
  };

  const deleteExercise = (id: string) => {
    setExercises((prev) => {
      const filteredExercises = prev.filter((exercise) => exercise.id !== id);
      
      // If deleting current exercise, fallback to first available exercise
      if (currentExercise?.id === id) {
        const newCurrent = filteredExercises[0] || null;
        setCurrentExercise(newCurrent);
      }
      
      // Immediately sync to localStorage
      try {
        localStorage.setItem("breathingExercises", JSON.stringify(filteredExercises));
      } catch (error) {
        console.error("Error saving exercises after delete to localStorage:", error);
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
