import { useState, useEffect } from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const OtherSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [emotionTrackingEnabled, setEmotionTrackingEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current setting
  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("emotion_tracking_enabled, is_subscribed")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        
        // For now, we'll allow toggling regardless of subscription
        // Later this will be gated behind subscription
        setEmotionTrackingEnabled(data?.emotion_tracking_enabled || false);
      } catch (error) {
        console.error("Error fetching emotion tracking settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [user]);

  const handleToggleEmotionTracking = async (enabled: boolean) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ emotion_tracking_enabled: enabled })
        .eq("id", user.id);

      if (error) throw error;

      setEmotionTrackingEnabled(enabled);
      toast({
        title: enabled ? "Emotional state tracking enabled" : "Emotional state tracking disabled",
        description: enabled 
          ? "You'll now see emotion check-ins before and after exercises." 
          : "Emotional state tracking has been turned off.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error updating emotion tracking:", error);
      toast({
        title: "Error",
        description: "Failed to update setting. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="h-4 w-4" />
          <Label className="text-base font-medium">Emotional State Tracking</Label>
        </div>
        <Switch
          checked={emotionTrackingEnabled}
          onCheckedChange={handleToggleEmotionTracking}
        />
      </div>
      <p className="text-sm text-muted-foreground">
        Track your emotional state before and after breathing exercises to see how they affect your mood.
      </p>
    </div>
  );
};

export default OtherSettings;
