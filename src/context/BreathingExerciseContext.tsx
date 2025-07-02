
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
    console.log("=== BREATHING EXERCISES INITIALIZATION ===");
    try {
      const savedExercises = localStorage.getItem("breathingExercises");
      console.log("Raw localStorage data:", savedExercises);
      
      if (savedExercises) {
        const parsedExercises = JSON.parse(savedExercises);
        console.log("Parsed exercises from localStorage:", parsedExercises);
        
        // Ensure we always have the default exercises, even if localStorage is corrupted
        const exerciseIds = parsedExercises.map((ex: BreathingExercise) => ex.id);
        const missingDefaults = defaultBreathingExercises.filter(
          defaultEx => !exerciseIds.includes(defaultEx.id)
        );
        
        const finalExercises = [...parsedExercises, ...missingDefaults];
        console.log("Final exercises list:", finalExercises);
        console.log("Custom exercises found:", finalExercises.filter(ex => ex.isCustom));
        
        return finalExercises;
      } else {
        console.log("No saved exercises found, using defaults");
        return defaultBreathingExercises;
      }
    } catch (error) {
      console.error("Error loading breathing exercises from localStorage:", error);
      return defaultBreathingExercises;
    }
  });

  const [currentExercise, setCurrentExercise] = useState<BreathingExercise | null>(() => {
    console.log("=== CURRENT EXERCISE INITIALIZATION ===");
    try {
      const savedCurrent = localStorage.getItem("currentBreathingExercise");
      console.log("Raw current exercise data:", savedCurrent);
      
      if (savedCurrent) {
        const parsed = JSON.parse(savedCurrent);
        console.log("Parsed current exercise:", parsed);
        
        // Verify the saved exercise still exists in our exercises
        const exerciseExists = exercises.some(ex => ex.id === parsed.id);
        console.log("Current exercise exists in list:", exerciseExists);
        
        if (exerciseExists) {
          return parsed;
        } else {
          console.log("Current exercise not found in exercises list, falling back");
        }
      }
    } catch (error) {
      console.error("Error loading current exercise from localStorage:", error);
    }
    
    // Fallback to first available exercise
    const fallback = exercises[0] || defaultBreathingExercises[0] || null;
    console.log("Using fallback exercise:", fallback?.title);
    return fallback;
  });

  // Save exercises to localStorage whenever they change
  useEffect(() => {
    console.log("Saving exercises to localStorage:", exercises.length, "exercises");
    console.log("Custom exercises being saved:", exercises.filter(ex => ex.isCustom).length);
    
    try {
      localStorage.setItem("breathingExercises", JSON.stringify(exercises));
      console.log("Successfully saved exercises to localStorage");
    } catch (error) {
      console.error("Error saving breathing exercises to localStorage:", error);
    }
  }, [exercises]);

  // Save current exercise to localStorage whenever it changes
  useEffect(() => {
    if (currentExercise) {
      console.log("Saving current exercise to localStorage:", currentExercise.title);
      try {
        localStorage.setItem("currentBreathingExercise", JSON.stringify(currentExercise));
        console.log("Successfully saved current exercise to localStorage");
      } catch (error) {
        console.error("Error saving current exercise to localStorage:", error);
      }
    }
  }, [currentExercise]);

  const addExercise = (exercise: BreathingExercise) => {
    console.log("=== ADDING NEW EXERCISE ===");
    console.log("Adding exercise:", exercise.title, exercise.isCustom);
    
    setExercises((prev) => {
      const newExercises = [...prev, exercise];
      console.log("New exercises count:", newExercises.length);
      console.log("Custom exercises count:", newExercises.filter(ex => ex.isCustom).length);
      return newExercises;
    });
  };

  const deleteExercise = (id: string) => {
    console.log("=== DELETING EXERCISE ===");
    console.log("Deleting exercise with ID:", id);
    
    setExercises((prev) => {
      const exerciseToDelete = prev.find(ex => ex.id === id);
      console.log("Exercise to delete:", exerciseToDelete?.title);
      
      const filteredExercises = prev.filter((exercise) => exercise.id !== id);
      console.log("Remaining exercises count:", filteredExercises.length);
      
      // If deleting current exercise, fallback to first available exercise
      if (currentExercise?.id === id) {
        const newCurrent = filteredExercises[0] || null;
        console.log("Setting new current exercise:", newCurrent?.title);
        setCurrentExercise(newCurrent);
      }
      
      return filteredExercises;
    });
  };

  console.log("=== BREATHING EXERCISE CONTEXT RENDER ===");
  console.log("Current exercises count:", exercises.length);
  console.log("Custom exercises:", exercises.filter(ex => ex.isCustom).map(ex => ex.title));
  console.log("Current exercise:", currentExercise?.title);

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
