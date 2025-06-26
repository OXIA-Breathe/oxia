
import { useState } from "react";
import { useBreath } from "@/context/BreathContext";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { History } from "lucide-react";
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
      <Card className="w-full max-w-3xl mx-auto border-none shadow-md bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-breath" />
            <span className="text-gray-800">Loading sessions...</span>
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (displaySessions.length === 0) {
    return (
      <Card className="w-full max-w-3xl mx-auto border-none shadow-md bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-breath" />
            <span className="text-gray-800">My Sessions</span>
          </CardTitle>
          <CardDescription className="text-gray-600">
            View and export your breathing sessions
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          Complete a breathing session to see your history
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto border-none shadow-md bg-white">
      <CardHeader className="pb-2 flex flex-row items-start justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-breath" />
            <span className="text-gray-800">My Sessions</span>
          </CardTitle>
          <CardDescription className="text-gray-600">
            View and export your breathing sessions
          </CardDescription>
        </div>
        <ExportButton sessions={displaySessions} />
      </CardHeader>
      <CardContent>
        <SessionList sessions={displaySessions} />
      </CardContent>
    </Card>
  );
};

export default SessionHistory;
