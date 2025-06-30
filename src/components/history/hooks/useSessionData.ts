
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
      console.log("Fetching sessions for user:", user.id);
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from("breath_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching sessions:", error);
        throw error;
      }
      
      console.log("Fetched sessions:", data);
      
      if (data) {
        // Convert Supabase data to app format
        const formattedSessions: BreathSession[] = data.map(session => ({
          id: session.id,
          date: session.date,
          repetitions: session.repetitions,
          holdDuration: session.hold_duration,
          totalDuration: session.total_duration,
          breathCount: session.breath_count,
          exerciseTitle: session.exercise_title || "Breathing Exercise"
        }));
        
        console.log("Formatted sessions:", formattedSessions);
        setOnlineSessions(formattedSessions);
      } else {
        console.log("No sessions found");
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
