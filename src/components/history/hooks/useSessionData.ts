
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
      const { data, error } = await supabase
        .from("breath_sessions")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      
      if (data) {
        // Convert Supabase data to app format
        const formattedSessions: BreathSession[] = data.map(session => ({
          id: session.id,
          date: session.date,
          repetitions: session.repetitions,
          holdDuration: session.hold_duration,
          totalDuration: session.total_duration,
          breathCount: session.breath_count,
          exerciseTitle: session.exercise_title || undefined
        }));
        
        setOnlineSessions(formattedSessions);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchUserSessions();
    }
  }, [user, fetchUserSessions]);

  return { isLoading, onlineSessions, refreshSessions: fetchUserSessions };
};
