
import { useMemo } from "react";
import { useBreath } from "@/context/BreathContext";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSessionOperations } from "./hooks/useSessionOperations";
import SessionList from "./SessionList";
import SessionHistoryHeader from "./SessionHistoryHeader";
import { LoadingState, EmptyState, NoSessionsForDateState } from "./SessionHistoryStates";
import { BreathSession } from "@/types/breath";

interface SessionHistoryProps {
  selectedDate?: Date;
}

const SessionHistory = ({ selectedDate }: SessionHistoryProps) => {
  const { sessions } = useBreath();
  const { user } = useAuth();
  
  // Use React Query for consistent data fetching
  const { data: onlineSessions = [], isLoading, refetch } = useQuery({
    queryKey: ["breathSessions", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      console.log("=== FETCH SESSIONS START ===");
      console.log("Fetching sessions for user:", user.id);
      
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
        return formattedSessions;
      } else {
        console.log("No sessions found");
        console.log("=== FETCH SESSIONS END ===");
        return [];
      }
    },
    enabled: !!user
  });

  // Determine which sessions to display based on user authentication
  const allSessions = user ? onlineSessions : sessions;

  // Filter sessions by selected date
  const displaySessions = useMemo(() => {
    if (!selectedDate) return allSessions;
    
    return allSessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate.toDateString() === selectedDate.toDateString();
    });
  }, [allSessions, selectedDate]);

  const { handleUpdateSession, handleDeleteSession } = useSessionOperations(
    refetch,
    onlineSessions
  );
  
  if (isLoading) {
    return <LoadingState />;
  }

  if (allSessions.length === 0) {
    return <EmptyState />;
  }

  return (
    <Card className="w-full max-w-3xl mx-auto border-none shadow-md bg-white">
      <SessionHistoryHeader 
        selectedDate={selectedDate} 
        displaySessions={displaySessions} 
      />
      <CardContent>
        {displaySessions.length === 0 && selectedDate ? (
          <NoSessionsForDateState selectedDate={selectedDate} />
        ) : (
          <SessionList 
            sessions={displaySessions} 
            onUpdateSession={handleUpdateSession}
            onDeleteSession={handleDeleteSession}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default SessionHistory;
