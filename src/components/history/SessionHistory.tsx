
import { useState } from "react";
import { useBreath } from "@/context/BreathContext";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ExportButton from "./ExportButton";
import { useSessionData } from "./hooks/useSessionData";
import SessionList from "./SessionList";

const SessionHistory = () => {
  const { sessions } = useBreath();
  const { user } = useAuth();
  const { isLoading, onlineSessions } = useSessionData(user);
  
  // Determine which sessions to display based on user authentication
  const displaySessions = user ? onlineSessions : sessions;
  
  if (isLoading) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl text-center">Loading sessions...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (displaySessions.length === 0) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl text-center">No sessions yet</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          Complete a breathing session to see your history
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Session History</CardTitle>
        <ExportButton sessions={displaySessions} />
      </CardHeader>
      <CardContent>
        <SessionList sessions={displaySessions} />
      </CardContent>
    </Card>
  );
};

export default SessionHistory;
