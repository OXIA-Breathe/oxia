import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useAchievementNotifications } from "./useAchievementNotifications";
import { useNotificationQueue } from "@/hooks/useNotificationQueue";

export const useShareTracking = () => {
  const { user } = useAuth();
  const { showShareAchievement } = useAchievementNotifications();
  const { queueNotifications } = useNotificationQueue();

  const trackShareAction = async (isNewAchievement: boolean = false) => {
    if (!user) return;

    try {
      // Mark sharing achievement as unlocked
      await supabase
        .from("user_achievements")
        .insert({
          user_id: user.id,
          achievement_id: "oxia-share",
          achievement_type: "oxia"
        });

      // If this is a new achievement, show it
      if (isNewAchievement) {
        showShareAchievement();
      }
    } catch (error) {
      // Ignore unique constraint violations - user already has this achievement
      console.log("Share achievement already unlocked or error:", error);
    }
  };

  const shareApp = async () => {
    const shareData = {
      title: 'OXIA - Breathing Practice App',
      text: 'Discover the power of breath with OXIA - a beautiful breathing practice app that helps you find calm and focus.',
      url: window.location.origin
    };

    try {
      // Check if user already has the achievement
      const { data: existingAchievement } = await supabase
        .from("user_achievements")
        .select("id")
        .eq("user_id", user?.id)
        .eq("achievement_id", "oxia-share")
        .single();

      const isNewAchievement = !existingAchievement;

      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        await trackShareAction(isNewAchievement);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareData.url);
        
        // Queue notifications in the correct order
        const notifications = [
          {
            title: "Link copied!",
            description: "Share link has been copied to your clipboard",
            duration: 3000
          }
        ];

        // Add achievement notification if it's new
        if (isNewAchievement) {
          notifications.push({
            title: "🎉 Achievement Unlocked!",
            description: "Ambassador - You shared OXIA with others!",
            duration: 4000
          });
        }

        queueNotifications(notifications);
        await trackShareAction(isNewAchievement);
      }
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  return { shareApp, trackShareAction };
};