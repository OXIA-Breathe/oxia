
import { BreathSession } from "@/types/breath";
import { useAuth } from "@/context/AuthContext";
import { useBreath } from "@/context/BreathContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export const useSessionOperations = (
  refreshSessions: () => Promise<void>,
  onlineSessions: BreathSession[]
) => {
  const { user } = useAuth();
  const { updateSession, deleteSession } = useBreath();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  return {
    handleUpdateSession,
    handleDeleteSession
  };
};
