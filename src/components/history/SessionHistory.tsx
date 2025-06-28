
import { useState } from "react";
import { useBreath } from "@/context/BreathContext";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { History } from "lucide-react";
import ExportButton from "./ExportButton";
import { useSessionData } from "./hooks/useSessionData";
import SessionList from "./SessionList";
import { BreathSession } from "@/types/breath";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const SessionHistory = () => {
  const { sessions, updateSession, deleteSession } = useBreath();
  const { user } = useAuth();
  const { toast } = useToast();
  const { isLoading, onlineSessions, refreshSessions } = useSessionData(user);
  
  // Determine which sessions to display based on user authentication
  const displaySessions = user ? onlineSessions : sessions;

  const handleUpdateSession = async (updatedSession: BreathSession) => {
    if (user) {
      // Update in Supabase for authenticated users
      try {
        const { error } = await supabase
          .from("breath_sessions")
          .update({
            date: updatedSession.date,
            breath_count: updatedSession.breathCount,
            total_duration: updatedSession.totalDuration,
            exercise_title: updatedSession.exerciseTitle,
          })
          .eq("id", updatedSession.id);

        if (error) throw error;
        
        // Refresh the sessions from the server
        await refreshSessions();
        
        toast({
          title: "Session updated",
          description: "Your breathing session has been successfully updated.",
        });
      } catch (error) {
        console.error("Error updating session:", error);
        toast({
          title: "Error",
          description: "Failed to update the session. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      // Update locally for non-authenticated users
      updateSession(updatedSession);
      toast({
        title: "Session updated",
        description: "Your breathing session has been successfully updated.",
      });
    }
  };

  const handleDeleteSession = async (session: BreathSession) => {
    if (user) {
      // Delete from Supabase for authenticated users
      try {
        const { error } = await supabase
          .from("breath_sessions")
          .delete()
          .eq("id", session.id);

        if (error) throw error;
        
        // Refresh the sessions from the server
        await refreshSessions();
        
        toast({
          title: "Session deleted",
          description: "Your breathing session has been successfully deleted.",
        });
      } catch (error) {
        console.error("Error deleting session:", error);
        toast({
          title: "Error",
          description: "Failed to delete the session. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      // Delete locally for non-authenticated users
      deleteSession(session.id);
      toast({
        title: "Session deleted",
        description: "Your breathing session has been successfully deleted.",
      });
    }
  };
  
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
        <SessionList 
          sessions={displaySessions} 
          onUpdateSession={handleUpdateSession}
          onDeleteSession={handleDeleteSession}
        />
      </CardContent>
    </Card>
  );
};

export default SessionHistory;
