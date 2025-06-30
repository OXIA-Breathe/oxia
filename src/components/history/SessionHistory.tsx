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
import { useQueryClient } from "@tanstack/react-query";

const SessionHistory = () => {
  const { sessions, updateSession, deleteSession } = useBreath();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
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
        
        // Invalidate the user stats query to refresh statistics immediately
        queryClient.invalidateQueries({ queryKey: ["userStats", user.id] });
        
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
        console.log("=== DELETE OPERATION START ===");
        console.log("Attempting to delete session:", session.id);
        console.log("User ID:", user.id);
        console.log("Current sessions count before delete:", onlineSessions.length);
        console.log("Sessions before delete:", onlineSessions.map(s => s.id));
        
        // First, let's verify the session exists and belongs to the user
        const { data: existingSession, error: fetchError } = await supabase
          .from("breath_sessions")
          .select("*")
          .eq("id", session.id)
          .eq("user_id", user.id)
          .single();
          
        if (fetchError) {
          console.error("Error fetching session before delete:", fetchError);
          throw new Error("Session not found or access denied");
        }
        
        console.log("Session found, proceeding with delete:", existingSession);
        
        // Try a more direct delete approach
        const { error, data, count } = await supabase
          .from("breath_sessions")
          .delete({ count: 'exact' })
          .eq("id", session.id)
          .eq("user_id", user.id);

        console.log("Delete operation details:", { error, data, count });

        if (error) {
          console.error("Supabase delete error:", error);
          throw error;
        }
        
        console.log("Delete operation completed");
        console.log("Rows affected by delete:", count);
        
        // Force a complete refresh with longer delay
        console.log("=== DELETE OPERATION END ===");
        console.log("Forcing session refresh...");
        
        // Refresh from server immediately and then again after delay to ensure consistency
        await refreshSessions();
        
        // Invalidate the user stats query to refresh statistics immediately
        queryClient.invalidateQueries({ queryKey: ["userStats", user.id] });
        
        setTimeout(async () => {
          console.log("Delayed refresh starting...");
          await refreshSessions();
          console.log("Delayed refresh completed");
        }, 1000);
        
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
      console.log("Deleting local session:", session.id);
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
