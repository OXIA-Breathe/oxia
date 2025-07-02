
import { useMemo } from "react";
import { useBreath } from "@/context/BreathContext";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { useSessionData } from "./hooks/useSessionData";
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
  const { isLoading, onlineSessions, refreshSessions } = useSessionData(user);
  
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
    refreshSessions,
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
