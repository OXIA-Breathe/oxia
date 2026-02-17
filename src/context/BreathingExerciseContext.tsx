
import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { BreathingExercise, defaultBreathingExercises } from "@/types/breathingExercise";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface BreathingExerciseContextType {
  exercises: BreathingExercise[];
  currentExercise: BreathingExercise | null;
  addExercise: (exercise: BreathingExercise) => void;
  deleteExercise: (id: string) => void;
  updateExercise: (id: string, updates: Partial<BreathingExercise>) => void;
  setCurrentExercise: (exercise: BreathingExercise) => void;
  isLoading: boolean;
}

const BreathingExerciseContext = createContext<BreathingExerciseContextType | undefined>(undefined);

// Helper: convert DB row to BreathingExercise
const dbToExercise = (row: any): BreathingExercise => ({
  id: row.id,
  title: row.title,
  description: row.description ?? undefined,
  detailedDescription: row.detailed_description ?? undefined,
  inhaleDuration: row.inhale_duration,
  firstHoldDuration: row.first_hold_duration,
  exhaleDuration: row.exhale_duration,
  secondHoldDuration: row.second_hold_duration,
  repetitions: row.repetitions,
  stepByStepInstructions: row.step_by_step_instructions ?? undefined,
  whenToUse: row.when_to_use ?? undefined,
  howItHelps: row.how_it_helps ?? undefined,
  commonMistakes: row.common_mistakes ?? undefined,
  isCustom: true,
});

// Helper: convert BreathingExercise to DB insert
const exerciseToDb = (exercise: BreathingExercise, userId: string) => ({
  id: exercise.id,
  user_id: userId,
  title: exercise.title,
  description: exercise.description ?? null,
  detailed_description: exercise.detailedDescription ?? null,
  inhale_duration: exercise.inhaleDuration,
  first_hold_duration: exercise.firstHoldDuration,
  exhale_duration: exercise.exhaleDuration,
  second_hold_duration: exercise.secondHoldDuration,
  repetitions: exercise.repetitions,
  step_by_step_instructions: exercise.stepByStepInstructions ?? null,
  when_to_use: exercise.whenToUse ?? null,
  how_it_helps: exercise.howItHelps ?? null,
  common_mistakes: exercise.commonMistakes ?? null,
});

// Load guest custom exercises from localStorage
const loadLocalCustomExercises = (): BreathingExercise[] => {
  try {
    const saved = localStorage.getItem("breathingExercises");
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return parsed.filter((ex: BreathingExercise) => ex.isCustom);
  } catch {
    return [];
  }
};

// Load default exercise repetitions overrides from localStorage
const loadLocalDefaults = (): BreathingExercise[] => {
  try {
    const currentVersion = "2.5";
    const savedVersion = localStorage.getItem("breathingExercisesVersion");
    const saved = localStorage.getItem("breathingExercises");

    if (savedVersion !== currentVersion) {
      localStorage.setItem("breathingExercisesVersion", currentVersion);
    }

    if (!saved || savedVersion !== currentVersion) {
      return defaultBreathingExercises;
    }

    const parsed = JSON.parse(saved);
    return defaultBreathingExercises.map(defaultEx => {
      const savedEx = parsed.find((ex: BreathingExercise) => ex.id === defaultEx.id);
      return savedEx && !savedEx.isCustom
        ? { ...defaultEx, repetitions: savedEx.repetitions }
        : defaultEx;
    });
  } catch {
    return defaultBreathingExercises;
  }
};

export const BreathingExerciseProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [customExercises, setCustomExercises] = useState<BreathingExercise[]>([]);
  const [defaults, setDefaults] = useState<BreathingExercise[]>(() => loadLocalDefaults());
  const [isLoading, setIsLoading] = useState(false);
  const [hasSynced, setHasSynced] = useState(false);

  const exercises = [...defaults, ...customExercises];

  const [currentExercise, setCurrentExercise] = useState<BreathingExercise | null>(() => {
    try {
      const savedCurrent = localStorage.getItem("currentBreathingExercise");
      if (savedCurrent) {
        return JSON.parse(savedCurrent);
      }
    } catch {}
    return defaultBreathingExercises[0] || null;
  });

  // Fetch custom exercises from Supabase when user logs in
  useEffect(() => {
    if (!user) {
      // Guest: load from localStorage
      setCustomExercises(loadLocalCustomExercises());
      setHasSynced(false);
      return;
    }

    const fetchAndMerge = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("user_custom_exercises")
          .select("*")
          .eq("user_id", user.id);

        if (error) {
          console.error("Error fetching custom exercises:", error);
          setCustomExercises(loadLocalCustomExercises());
          return;
        }

        const cloudExercises = (data || []).map(dbToExercise);

        // Merge localStorage custom exercises that aren't in cloud yet
        if (!hasSynced) {
          const localCustom = loadLocalCustomExercises();
          const newLocals = localCustom.filter(
            local => !cloudExercises.some(cloud => cloud.id === local.id)
          );

          if (newLocals.length > 0) {
            const inserts = newLocals.map(ex => exerciseToDb(ex, user.id));
            const { error: insertError } = await supabase
              .from("user_custom_exercises")
              .insert(inserts);

            if (!insertError) {
              // Clear localStorage custom exercises after successful merge
              const saved = localStorage.getItem("breathingExercises");
              if (saved) {
                const parsed = JSON.parse(saved);
                const withoutCustom = parsed.filter((ex: BreathingExercise) => !ex.isCustom);
                localStorage.setItem("breathingExercises", JSON.stringify(withoutCustom));
              }
              setCustomExercises([...cloudExercises, ...newLocals.map(ex => ({ ...ex, isCustom: true }))]);
            } else {
              console.error("Error syncing local exercises:", insertError);
              setCustomExercises(cloudExercises);
            }
          } else {
            setCustomExercises(cloudExercises);
          }
          setHasSynced(true);
        } else {
          setCustomExercises(cloudExercises);
        }
      } catch (err) {
        console.error("Error in fetchAndMerge:", err);
        setCustomExercises(loadLocalCustomExercises());
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndMerge();
  }, [user?.id]);

  // Save defaults to localStorage whenever they change
  useEffect(() => {
    try {
      const allForStorage = [...defaults, ...(!user ? customExercises : [])];
      localStorage.setItem("breathingExercises", JSON.stringify(allForStorage));
    } catch (error) {
      console.error("Error saving exercises to localStorage:", error);
    }
  }, [defaults, customExercises, user]);

  // Save current exercise to localStorage
  useEffect(() => {
    if (currentExercise) {
      try {
        localStorage.setItem("currentBreathingExercise", JSON.stringify(currentExercise));
      } catch {}
    }
  }, [currentExercise]);

  const addExercise = useCallback(async (exercise: BreathingExercise) => {
    const newExercise = { ...exercise, isCustom: true };
    setCustomExercises(prev => [...prev, newExercise]);

    if (user) {
      const { error } = await supabase
        .from("user_custom_exercises")
        .insert(exerciseToDb(newExercise, user.id));
      
      if (error) {
        console.error("Error saving custom exercise:", error);
      }
    }
  }, [user]);

  const deleteExercise = useCallback(async (id: string) => {
    setCustomExercises(prev => {
      const filtered = prev.filter(ex => ex.id !== id);
      return filtered;
    });

    if (currentExercise?.id === id) {
      setCurrentExercise(defaults[0] || null);
    }

    if (user) {
      const { error } = await supabase
        .from("user_custom_exercises")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error deleting custom exercise:", error);
      }
    }
  }, [user, currentExercise, defaults]);

  const updateExercise = useCallback(async (id: string, updates: Partial<BreathingExercise>) => {
    // Check if it's a default exercise (only repetitions can be updated)
    const isDefault = defaults.some(ex => ex.id === id);
    
    if (isDefault) {
      setDefaults(prev =>
        prev.map(ex => ex.id === id ? { ...ex, ...updates } : ex)
      );
    } else {
      setCustomExercises(prev =>
        prev.map(ex => ex.id === id ? { ...ex, ...updates } : ex)
      );

      if (user) {
        const dbUpdates: Record<string, any> = {};
        if (updates.title !== undefined) dbUpdates.title = updates.title;
        if (updates.description !== undefined) dbUpdates.description = updates.description;
        if (updates.detailedDescription !== undefined) dbUpdates.detailed_description = updates.detailedDescription;
        if (updates.inhaleDuration !== undefined) dbUpdates.inhale_duration = updates.inhaleDuration;
        if (updates.firstHoldDuration !== undefined) dbUpdates.first_hold_duration = updates.firstHoldDuration;
        if (updates.exhaleDuration !== undefined) dbUpdates.exhale_duration = updates.exhaleDuration;
        if (updates.secondHoldDuration !== undefined) dbUpdates.second_hold_duration = updates.secondHoldDuration;
        if (updates.repetitions !== undefined) dbUpdates.repetitions = updates.repetitions;
        if (updates.stepByStepInstructions !== undefined) dbUpdates.step_by_step_instructions = updates.stepByStepInstructions;
        if (updates.whenToUse !== undefined) dbUpdates.when_to_use = updates.whenToUse;
        if (updates.howItHelps !== undefined) dbUpdates.how_it_helps = updates.howItHelps;
        if (updates.commonMistakes !== undefined) dbUpdates.common_mistakes = updates.commonMistakes;

        if (Object.keys(dbUpdates).length > 0) {
          const { error } = await supabase
            .from("user_custom_exercises")
            .update(dbUpdates)
            .eq("id", id)
            .eq("user_id", user.id);

          if (error) {
            console.error("Error updating custom exercise:", error);
          }
        }
      }
    }

    if (currentExercise?.id === id) {
      setCurrentExercise(prev => prev ? { ...prev, ...updates } : prev);
    }
  }, [user, defaults, currentExercise]);

  return (
    <BreathingExerciseContext.Provider value={{
      exercises,
      currentExercise,
      addExercise,
      deleteExercise,
      updateExercise,
      setCurrentExercise,
      isLoading,
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
