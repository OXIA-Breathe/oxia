
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { badgeDefinitions } from "./badgeDefinitions";

export const useAchievements = () => {
  const { user } = useAuth();
  const { toast } = useToast();

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
      
      // Find newly earned badges
      const newlyEarnedBadge = badgeDefinitions
        .filter(badge => 
          badge.threshold <= newTotalBreaths && // Badge threshold is now met
          badge.threshold > previousTotalBreaths // Badge threshold wasn't met before
        )
        .sort((a, b) => b.threshold - a.threshold)[0]; // Get the highest threshold badge
        
      if (newlyEarnedBadge) {
        // Show achievement toast
        toast({
          title: "🎉 Achievement Unlocked!",
          description: `Congratulations! You've earned the "${newlyEarnedBadge.name}" badge for completing ${newlyEarnedBadge.threshold} breaths!`,
          duration: 6000,
        });
      }
    } catch (err) {
      console.error("Error checking achievements:", err);
    }
  };

  return { checkForNewAchievements };
};
