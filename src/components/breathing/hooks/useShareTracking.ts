import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useShareTracking = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const trackShareAction = async () => {
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

      // Show achievement toast
      toast({
        title: "🎉 Achievement Unlocked!",
        description: "Congratulations! You've earned the \"Share the Calm\" badge for sharing OXIA with friends!",
        duration: 6000,
      });
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
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        await trackShareAction();
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareData.url);
        toast({
          title: "Link copied!",
          description: "Share link has been copied to your clipboard",
        });
        await trackShareAction();
      }
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  return { shareApp, trackShareAction };
};