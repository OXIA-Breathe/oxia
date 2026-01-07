import { BreathSession, EmotionData } from "@/types/breath";
import { useAuth } from "@/context/AuthContext";
import { useBreath } from "@/context/BreathContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export const useSessionOperations = (
  refreshSessions: () => Promise<any>,
  onlineSessions: BreathSession[]
) => {
  const { user } = useAuth();
  const { updateSession, deleteSession } = useBreath();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleUpdateSession = async (updatedSession: BreathSession, emotionData?: EmotionData) => {
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

        // Handle emotion data if provided
        if (emotionData) {
          // Check if emotion tracking record exists for this session
          const { data: existingEmotion } = await supabase
            .from("emotion_tracking")
            .select("id")
            .eq("session_id", updatedSession.id)
            .eq("user_id", user.id)
            .single();

          if (existingEmotion) {
            // Update existing emotion record
            const { error: emotionError } = await supabase
              .from("emotion_tracking")
              .update({
                pre_valence: emotionData.preValence,
                pre_arousal: emotionData.preStress,
                post_valence: emotionData.postValence,
                post_arousal: emotionData.postStress,
                note: emotionData.note,
              })
              .eq("id", existingEmotion.id);

            if (emotionError) {
              console.error("Error updating emotion data:", emotionError);
            }
          } else {
            // Insert new emotion record
            const { error: emotionError } = await supabase
              .from("emotion_tracking")
              .insert({
                user_id: user.id,
                session_id: updatedSession.id,
                pre_valence: emotionData.preValence,
                pre_arousal: emotionData.preStress,
                post_valence: emotionData.postValence,
                post_arousal: emotionData.postStress,
                note: emotionData.note,
              });

            if (emotionError) {
              console.error("Error inserting emotion data:", emotionError);
            }
          }
        }
        
        // Invalidate all related queries to refresh data immediately
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["breathSessions", user.id] }),
          queryClient.invalidateQueries({ queryKey: ["userStats", user.id] }),
          queryClient.invalidateQueries({ queryKey: ["activityDates", user.id] }),
          queryClient.invalidateQueries({ queryKey: ["emotionalStats", user.id] })
        ]);
        
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
        
        // First delete any associated emotion tracking data
        await supabase
          .from("emotion_tracking")
          .delete()
          .eq("session_id", session.id)
          .eq("user_id", user.id);
        
        const { error } = await supabase
          .from("breath_sessions")
          .delete()
          .eq("id", session.id)
          .eq("user_id", user.id);
          
        // Also delete any exercise completion tracking for this session's exercise
        // This ensures exercise achievements are properly reset when sessions are deleted
        if (!error && session.exerciseTitle) {
          await supabase
            .from("user_exercise_completions")
            .delete()
            .eq("user_id", user.id)
            .eq("exercise_title", session.exerciseTitle);
        }

        if (error) {
          console.error("Supabase delete error:", error);
          throw error;
        }
        
        console.log("Delete operation completed successfully");
        console.log("=== DELETE OPERATION END ===");
        
        // Invalidate all related queries to refresh data immediately
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["breathSessions", user.id] }),
          queryClient.invalidateQueries({ queryKey: ["userStats", user.id] }),
          queryClient.invalidateQueries({ queryKey: ["activityDates", user.id] }),
          queryClient.invalidateQueries({ queryKey: ["emotionalStats", user.id] })
        ]);
        
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
