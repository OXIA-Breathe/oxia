
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

      const { data: sessionsData, error: sessionsError } = await supabase
        .from("breath_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (sessionsError) {
        console.error("Error fetching sessions:", sessionsError);
        throw sessionsError;
      }

      const sessionIds = (sessionsData ?? []).map((s) => s.id);

      // Fetch emotion data for these sessions (if any)
      const { data: emotionData, error: emotionError } = sessionIds.length
        ? await supabase
            .from("emotion_tracking")
            .select("session_id, pre_valence, pre_arousal, post_valence, post_arousal, note")
            .eq("user_id", user.id)
            .in("session_id", sessionIds)
        : { data: [], error: null };

      if (emotionError) {
        console.error("Error fetching emotion tracking:", emotionError);
        // Don't block session history if emotion fetch fails
      }

      const emotionMap = new Map(
        (emotionData ?? [])
          .filter((e) => !!e.session_id)
          .map((e) => [
            e.session_id as string,
            {
              preValence: e.pre_valence,
              preStress: e.pre_arousal,
              postValence: e.post_valence,
              postStress: e.post_arousal,
              note: e.note,
            },
          ])
      );

      // Convert Supabase data to app format (and attach emotion data)
      return (sessionsData ?? []).map((session) => ({
        id: session.id,
        date: session.date,
        repetitions: session.repetitions,
        holdDuration: session.hold_duration,
        totalDuration: session.total_duration,
        breathCount: session.breath_count,
        exerciseTitle: session.exercise_title || "Breathing Exercise",
        emotionData: emotionMap.get(session.id),
      })) as BreathSession[];
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
    <Card className="w-full max-w-3xl mx-auto shadow-md">
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
