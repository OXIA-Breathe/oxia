import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const useExerciseTracking = () => {
  const { user } = useAuth();

  const trackExerciseCompletion = async (exerciseId: string, exerciseTitle: string, isCustom: boolean = false) => {
    if (!user) return;

    try {
      // Insert exercise completion (UNIQUE constraint will prevent duplicates)
      await supabase
        .from("user_exercise_completions")
        .insert({
          user_id: user.id,
          exercise_id: exerciseId,
          exercise_title: exerciseTitle,
          is_custom: isCustom
        });
    } catch (error) {
      // Ignore unique constraint violations - user already completed this exercise
      console.log("Exercise completion already tracked or error:", error);
    }
  };

  return { trackExerciseCompletion };
};