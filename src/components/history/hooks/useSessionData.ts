
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BreathSession } from "@/types/breath";
import { User } from "@supabase/supabase-js";

export const useSessionData = (user: User | null) => {
  const [isLoading, setIsLoading] = useState(false);
  const [onlineSessions, setOnlineSessions] = useState<BreathSession[]>([]);

  const fetchUserSessions = useCallback(async () => {
    if (!user) {
      console.log("No user, skipping session fetch");
      return;
    }
    
    try {
      console.log("=== FETCH SESSIONS START ===");
      console.log("Fetching sessions for user:", user.id);
      setIsLoading(true);
      
      // Fetch breath sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from("breath_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (sessionsError) {
        console.error("Error fetching sessions:", sessionsError);
        throw sessionsError;
      }
      
      // Fetch emotion tracking data for all sessions
      const { data: emotionData, error: emotionError } = await supabase
        .from("emotion_tracking")
        .select("*")
        .eq("user_id", user.id);

      if (emotionError) {
        console.error("Error fetching emotion data:", emotionError);
        // Continue without emotion data
      }

      // Create a map of session_id to emotion data
      const emotionMap = new Map<string, {
        preValence: number | null;
        preStress: number | null;
        postValence: number | null;
        postStress: number | null;
        note: string | null;
      }>();

      if (emotionData) {
        emotionData.forEach((emotion) => {
          if (emotion.session_id) {
            emotionMap.set(emotion.session_id, {
              preValence: emotion.pre_valence,
              preStress: emotion.pre_arousal, // arousal stores stress
              postValence: emotion.post_valence,
              postStress: emotion.post_arousal, // arousal stores stress
              note: emotion.note,
            });
          }
        });
      }
      
      console.log("Raw Supabase response:", sessionsData);
      console.log("Number of sessions fetched:", sessionsData?.length || 0);
      console.log("Emotion data entries:", emotionData?.length || 0);
      
      if (sessionsData) {
        // Convert Supabase data to app format
        const formattedSessions: BreathSession[] = sessionsData.map(session => {
          const emotionForSession = emotionMap.get(session.id);
          return {
            id: session.id,
            date: session.date,
            repetitions: session.repetitions,
            holdDuration: session.hold_duration,
            totalDuration: session.total_duration,
            breathCount: session.breath_count,
            exerciseTitle: session.exercise_title || "Breathing Exercise",
            emotionData: emotionForSession || undefined,
          };
        });
        
        console.log("Formatted sessions count:", formattedSessions.length);
        console.log("=== FETCH SESSIONS END ===");
        setOnlineSessions(formattedSessions);
      } else {
        console.log("No sessions found");
        console.log("=== FETCH SESSIONS END ===");
        setOnlineSessions([]);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
      setOnlineSessions([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchUserSessions();
    } else {
      setOnlineSessions([]);
    }
  }, [user, fetchUserSessions]);

  return { isLoading, onlineSessions, refreshSessions: fetchUserSessions };
};
