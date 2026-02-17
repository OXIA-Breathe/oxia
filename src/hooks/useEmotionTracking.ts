import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface EmotionData {
  preValence: number | null;
  preStress: number | null;
  postValence: number | null;
  postStress: number | null;
  note: string | null;
  sessionId: string | null;
}

export const useEmotionTracking = () => {
  const { user } = useAuth();
  const [emotionData, setEmotionData] = useState<EmotionData>({
    preValence: null,
    preStress: null,
    postValence: null,
    postStress: null,
    note: null,
    sessionId: null,
  });
  const [isTrackingEnabled, setIsTrackingEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

      const enabled = data?.is_subscribed && data?.emotion_tracking_enabled;
      setIsTrackingEnabled(enabled || false);
      return enabled || false;
    } catch (error) {
      console.error("Error checking emotion tracking status");
      setIsTrackingEnabled(false);
      return false;
    }
  }, [user]);

  const setPreEmotion = useCallback((valence: number, stress: number) => {
    setEmotionData((prev) => ({
      ...prev,
      preValence: valence,
      preStress: stress,
    }));
  }, []);

  // Set post-exercise emotion and save to database
  // Note: Database still uses arousal columns, we map stress to arousal for storage
  const setPostEmotionAndSave = useCallback(
    async (valence: number, stress: number, note: string, sessionId?: string) => {
      if (!user) return;

      setIsLoading(true);
      try {
        const insertData = {
          user_id: user.id,
          session_id: sessionId || null,
          pre_valence: emotionData.preValence,
          pre_arousal: emotionData.preStress,
          post_valence: valence,
          post_arousal: stress,
          note: note || null,
        };

        const { error } = await supabase.from("emotion_tracking").insert(insertData).select();

        if (error) {
          console.error("Error saving emotion data");
          throw error;
        }

        setEmotionData({
          preValence: null,
          preStress: null,
          postValence: null,
          postStress: null,
          note: null,
          sessionId: null,
        });
      } catch (error) {
        console.error("Error saving emotion tracking data");
      } finally {
        setIsLoading(false);
      }
    },
    [user, emotionData.preValence, emotionData.preStress]
  );

  const resetEmotionTracking = useCallback(() => {
    setEmotionData({
      preValence: null,
      preStress: null,
      postValence: null,
      postStress: null,
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
