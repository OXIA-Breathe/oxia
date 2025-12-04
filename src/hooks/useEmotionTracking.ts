import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface EmotionData {
  preValence: number | null;
  preArousal: number | null;
  postValence: number | null;
  postArousal: number | null;
  note: string | null;
  sessionId: string | null;
}

export const useEmotionTracking = () => {
  const { user } = useAuth();
  const [emotionData, setEmotionData] = useState<EmotionData>({
    preValence: null,
    preArousal: null,
    postValence: null,
    postArousal: null,
    note: null,
    sessionId: null,
  });
  const [isTrackingEnabled, setIsTrackingEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if emotion tracking is enabled for the user
  const checkTrackingEnabled = useCallback(async () => {
    if (!user) {
      setIsTrackingEnabled(false);
      return false;
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("emotion_tracking_enabled, is_subscribed")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      // User must be subscribed and have tracking enabled
      const enabled = data?.is_subscribed && data?.emotion_tracking_enabled;
      setIsTrackingEnabled(enabled || false);
      return enabled || false;
    } catch (error) {
      console.error("Error checking emotion tracking status:", error);
      setIsTrackingEnabled(false);
      return false;
    }
  }, [user]);

  // Set pre-exercise emotion
  const setPreEmotion = useCallback((valence: number, arousal: number) => {
    setEmotionData((prev) => ({
      ...prev,
      preValence: valence,
      preArousal: arousal,
    }));
  }, []);

  // Set post-exercise emotion and save to database
  const setPostEmotionAndSave = useCallback(
    async (valence: number, arousal: number, note: string, sessionId?: string) => {
      if (!user) return;

      setIsLoading(true);
      try {
        const { error } = await supabase.from("emotion_tracking").insert({
          user_id: user.id,
          session_id: sessionId || null,
          pre_valence: emotionData.preValence,
          pre_arousal: emotionData.preArousal,
          post_valence: valence,
          post_arousal: arousal,
          note: note || null,
        });

        if (error) throw error;

        // Reset emotion data after successful save
        setEmotionData({
          preValence: null,
          preArousal: null,
          postValence: null,
          postArousal: null,
          note: null,
          sessionId: null,
        });
      } catch (error) {
        console.error("Error saving emotion tracking data:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [user, emotionData.preValence, emotionData.preArousal]
  );

  // Reset emotion tracking state
  const resetEmotionTracking = useCallback(() => {
    setEmotionData({
      preValence: null,
      preArousal: null,
      postValence: null,
      postArousal: null,
      note: null,
      sessionId: null,
    });
  }, []);

  return {
    emotionData,
    isTrackingEnabled,
    isLoading,
    checkTrackingEnabled,
    setPreEmotion,
    setPostEmotionAndSave,
    resetEmotionTracking,
  };
};
