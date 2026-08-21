import { useState, useEffect } from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Heart, Crown, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";
import PremiumModal from "@/components/premium/PremiumModal";

const OtherSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isPremium, isEmotionTrackingEnabled, isLoading: isPremiumLoading } = usePremiumStatus();
  const [emotionTrackingEnabled, setEmotionTrackingEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [premiumOpen, setPremiumOpen] = useState(false);

  // Fetch current setting
  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("emotion_tracking_enabled")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        
        setEmotionTrackingEnabled(data?.emotion_tracking_enabled || false);
      } catch (error) {
        console.error("Error fetching emotion tracking settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [user]);

  // Sync local toggle with premium-aware canonical state
  useEffect(() => {
    setEmotionTrackingEnabled(isEmotionTrackingEnabled);
  }, [isEmotionTrackingEnabled]);

  const handleToggleEmotionTracking = async (enabled: boolean) => {
    if (!user || !isPremium) return;

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

  if (isLoading || isPremiumLoading) {
    return <div className="text-sm text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="h-4 w-4" />
          <Label className="text-base font-medium">Emotional State Tracking</Label>
        </div>
        {isPremium ? (
          <Switch
            checked={emotionTrackingEnabled}
            onCheckedChange={handleToggleEmotionTracking}
            aria-label="Toggle emotional state tracking"
          />
        ) : (
          <div className="flex items-center gap-2 text-amber-500">
            <Lock className="h-4 w-4" />
            <Crown className="h-4 w-4" />
          </div>
        )}
      </div>
      <p className="text-sm text-muted-foreground">
        Track your emotional state before and after breathing exercises to see how they affect your mood.
        {!isPremium && (
          <span className="block mt-1 text-amber-500 font-medium">
            Premium feature — subscribe to unlock.
          </span>
        )}
      </p>
      {!isPremium && (
        <Button
          className="w-full bg-amber-500 hover:bg-amber-500/90 text-white"
          onClick={() => setPremiumOpen(true)}
        >
          <Crown className="h-4 w-4 mr-2" />
          Upgrade to Premium
        </Button>
      )}
      <PremiumModal
        open={premiumOpen}
        onOpenChange={setPremiumOpen}
        highlight="Unlock emotional state tracking and the insights built on it."
      />
    </div>
  );
};

export default OtherSettings;
