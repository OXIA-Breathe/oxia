
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useStreakManager } from "./useStreakManager";
import { useAchievements } from "./useAchievements";

export const useSessionPersistence = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { updateBreathStreak } = useStreakManager();
  const { checkForNewAchievements } = useAchievements();

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
        // Update breath streak after successfully saving the session
        await updateBreathStreak(user.id);
        
        // Check for achievements after successfully saving the session
        // Calculate new total breaths including this session
        const { data: allSessions } = await supabase
          .from("breath_sessions")
          .select("breath_count")
          .eq("user_id", user.id);
          
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
