
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
      
      const { data, error } = await supabase
        .from("breath_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching sessions:", error);
        throw error;
      }
      
      console.log("Raw Supabase response:", data);
      console.log("Number of sessions fetched:", data?.length || 0);
      
      if (data) {
        // Convert Supabase data to app format
        const formattedSessions: BreathSession[] = data.map(session => {
          console.log("Processing session:", session.id, session.exercise_title);
          return {
            id: session.id,
            date: session.date,
            repetitions: session.repetitions,
            holdDuration: session.hold_duration,
            totalDuration: session.total_duration,
            breathCount: session.breath_count,
            exerciseTitle: session.exercise_title || "Breathing Exercise"
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

  // Removed the problematic query cache subscription that was causing infinite loops

  return { isLoading, onlineSessions, refreshSessions: fetchUserSessions };
};
