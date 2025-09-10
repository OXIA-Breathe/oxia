
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useAchievementNotifications } from "./useAchievementNotifications";

export const useAchievements = () => {
  const { user } = useAuth();
  const { checkBreathAchievements } = useAchievementNotifications();

  const checkForNewAchievements = async (newTotalBreaths: number) => {
    if (!user) return;

    try {
      // Get current total breaths from database to compare
      const { data, error } = await supabase
        .from("breath_sessions")
        .select("breath_count")
        .eq("user_id", user.id);
        
      if (error) throw error;
      
      const previousTotalBreaths = data ? data.reduce((sum, session) => sum + session.breath_count, 0) : 0;
      
      // Check for new breath achievements using the comprehensive notification system
      checkBreathAchievements(newTotalBreaths, previousTotalBreaths);
    } catch (err) {
      console.error("Error checking achievements:", err);
    }
  };

  return { checkForNewAchievements };
};
