
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BreathSession } from "@/types/breath";
import { User } from "@supabase/supabase-js";

export const useSessionData = (user: User | null) => {
  const [isLoading, setIsLoading] = useState(false);
  const [onlineSessions, setOnlineSessions] = useState<BreathSession[]>([]);

  const fetchUserSessions = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { data: sessionsData, error: sessionsError } = await supabase
        .from("breath_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (sessionsError) {
        console.error("Error fetching sessions");
        throw sessionsError;
      }
      
      const { data: emotionData, error: emotionError } = await supabase
        .from("emotion_tracking")
        .select("*")
        .eq("user_id", user.id);

      if (emotionError) {
        console.error("Error fetching emotion data");
      }

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
              preStress: emotion.pre_arousal,
              postValence: emotion.post_valence,
              postStress: emotion.post_arousal,
              note: emotion.note,
            });
          }
        });
      }
      
      if (sessionsData) {
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
        
        setOnlineSessions(formattedSessions);
      } else {
        setOnlineSessions([]);
      }
    } catch (error) {
      console.error("Error fetching sessions");
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
