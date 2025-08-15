
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { BreathingExercise, defaultBreathingExercises } from "@/types/breathingExercise";

interface BreathingExerciseContextType {
  exercises: BreathingExercise[];
  currentExercise: BreathingExercise | null;
  addExercise: (exercise: BreathingExercise) => void;
  deleteExercise: (id: string) => void;
  updateExercise: (id: string, updates: Partial<BreathingExercise>) => void;
  setCurrentExercise: (exercise: BreathingExercise) => void;
}

const BreathingExerciseContext = createContext<BreathingExerciseContextType | undefined>(undefined);

export const BreathingExerciseProvider = ({ children }: { children: ReactNode }) => {
  const [exercises, setExercises] = useState<BreathingExercise[]>(() => {
    try {
      const savedExercises = localStorage.getItem("breathingExercises");
      
      if (savedExercises) {
        const parsedExercises = JSON.parse(savedExercises);
        
        // Ensure we always have the default exercises, even if localStorage is corrupted
        const exerciseIds = parsedExercises.map((ex: BreathingExercise) => ex.id);
        const missingDefaults = defaultBreathingExercises.filter(
          defaultEx => !exerciseIds.includes(defaultEx.id)
        );
        
        const finalExercises = [...parsedExercises, ...missingDefaults];
        return finalExercises;
      } else {
        return defaultBreathingExercises;
      }
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

  // Save exercises to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("breathingExercises", JSON.stringify(exercises));
    } catch (error) {
      console.error("Error saving breathing exercises to localStorage:", error);
    }
  }, [exercises]);

  // Save current exercise to localStorage whenever it changes
  useEffect(() => {
    if (currentExercise) {
      try {
        localStorage.setItem("currentBreathingExercise", JSON.stringify(currentExercise));
      } catch (error) {
        console.error("Error saving current exercise to localStorage:", error);
      }
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
        const newCurrent = filteredExercises[0] || null;
        setCurrentExercise(newCurrent);
      }
      
      return filteredExercises;
    });
  };

  const updateExercise = (id: string, updates: Partial<BreathingExercise>) => {
    setExercises((prev) => 
      prev.map((exercise) => 
        exercise.id === id ? { ...exercise, ...updates } : exercise
      )
    );
    
    // If updating current exercise, update it too
    if (currentExercise?.id === id) {
      setCurrentExercise({ ...currentExercise, ...updates });
    }
  };

  return (
    <BreathingExerciseContext.Provider value={{
      exercises,
      currentExercise,
      addExercise,
      deleteExercise,
      updateExercise,
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
