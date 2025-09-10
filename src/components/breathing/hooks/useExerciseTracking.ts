import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// Map app exercise IDs to database UUIDs
const EXERCISE_ID_MAP: Record<string, string> = {
  "box-breathing": "033c2c54-30ce-4f3b-a83c-5a0ff225c8d6",
  "4-7-8-breathing": "6a19c050-d9d7-42fb-86ac-cc61f0696cc6",
  "alternate-nostril": "8dc97fef-dc8f-40ad-87c7-84103d899eaf",
  "bee-breath": "a2fa3372-c007-4021-91d5-56e9c580a79b",
  "breath-focus": "7773961b-59e4-42ea-90ff-3224de1876dd",
  "diaphragmatic": "124d30c6-da02-4c49-b7f4-2dac66c1bfbe",
  "dirga-pranayama": "519fe82d-3bd9-480b-a31a-e300f7d90d87",
  "equal-breathing": "295879fa-a5d9-4c14-9dd9-c0a595529505",
  "lions-breath": "153f0804-7e51-4ad1-a62a-02029876462a",
  "pursed-lip": "0e68881e-6d3b-4119-bc31-5bb70cefec67",
  "sitali": "f4ed8e4c-8009-4e9c-a166-92f934cb6eec"
};

export const useExerciseTracking = () => {
  const { user } = useAuth();

  const trackExerciseCompletion = async (exerciseId: string, exerciseTitle: string, isCustom: boolean = false) => {
    if (!user) return;

    // Map app exercise ID to database UUID
    const dbExerciseId = isCustom ? exerciseId : EXERCISE_ID_MAP[exerciseId];
    
    if (!dbExerciseId && !isCustom) {
      console.warn("Unknown exercise ID:", exerciseId);
      return;
    }

    console.log("=== EXERCISE TRACKING ===");
    console.log("App Exercise ID:", exerciseId);
    console.log("DB Exercise ID:", dbExerciseId);
    console.log("Exercise Title:", exerciseTitle);
    console.log("Is Custom:", isCustom);
    console.log("User ID:", user.id);

    try {
      // Insert exercise completion (UNIQUE constraint will prevent duplicates)
      const { data, error } = await supabase
        .from("user_exercise_completions")
        .insert({
          user_id: user.id,
          exercise_id: dbExerciseId || exerciseId,
          exercise_title: exerciseTitle,
          is_custom: isCustom
        })
        .select();

      if (error) {
        console.error("Exercise tracking error:", error);
      } else {
        console.log("Exercise tracking success:", data);
      }
    } catch (error) {
      // Ignore unique constraint violations - user already completed this exercise
      console.log("Exercise completion already tracked or error:", error);
    }
  };

  return { trackExerciseCompletion };
};