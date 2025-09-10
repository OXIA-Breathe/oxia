
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useStreakManager } from "./useStreakManager";
import { useAchievements } from "./useAchievements";
import { useExerciseTracking } from "./useExerciseTracking";
import { useAchievementNotifications } from "./useAchievementNotifications";

export const useSessionPersistence = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { updateBreathStreak } = useStreakManager();
  const { checkForNewAchievements } = useAchievements();
  const { trackExerciseCompletion } = useExerciseTracking();
  const { checkSessionAchievements, checkExerciseAchievements } = useAchievementNotifications();

  const saveSessionToSupabase = async (sessionData: any) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from("breath_sessions")
        .insert({
          id: sessionData.id,
          user_id: user.id,
          date: sessionData.date,
          repetitions: sessionData.repetitions,
          hold_duration: sessionData.holdDuration,
          total_duration: sessionData.totalDuration,
          breath_count: sessionData.breathCount,
          exercise_title: sessionData.exerciseTitle
        });
        
      if (error) {
        console.error("Error saving session to Supabase:", error);
        toast({
          title: "Error saving session",
          description: "Your session was saved locally but not to your account.",
          variant: "destructive"
        });
      } else {
        // Get session count before tracking exercise completion to check for session achievements
        const { data: allSessions } = await supabase
          .from("breath_sessions")
          .select("id, breath_count")
          .eq("user_id", user.id);
          
        const previousSessionCount = allSessions ? allSessions.length - 1 : 0; // Subtract current session
        const currentSessionCount = allSessions ? allSessions.length : 1;
        
        // Check for session achievements
        checkSessionAchievements(currentSessionCount, previousSessionCount);
        
        // Track exercise completion if exercise ID and title are provided
        if (sessionData.exerciseId && sessionData.exerciseTitle) {
          // Get completed exercises before adding this one
          const { data: previousExercises } = await supabase
            .from("user_exercise_completions")
            .select("*")
            .eq("user_id", user.id);
            
          await trackExerciseCompletion(
            sessionData.exerciseId, 
            sessionData.exerciseTitle, 
            sessionData.isCustom || false
          );
          
          // Get updated completed exercises to check for exercise achievements
          const { data: updatedExercises } = await supabase
            .from("user_exercise_completions")
            .select("*")
            .eq("user_id", user.id);
            
          const isNewExercise = updatedExercises && previousExercises && 
            updatedExercises.length > previousExercises.length;
            
          if (updatedExercises && isNewExercise) {
            checkExerciseAchievements(updatedExercises, true);
          }
        }
        
        // Update breath streak after successfully saving the session
        await updateBreathStreak(user.id);
        
        // Check for breath achievements after successfully saving the session
        if (allSessions) {
          const newTotalBreaths = allSessions.reduce((sum, session) => sum + session.breath_count, 0);
          await checkForNewAchievements(newTotalBreaths);
        }
      }
    } catch (err) {
      console.error("Exception saving session:", err);
    }
  };

  return { saveSessionToSupabase };
};
