
import { useState } from "react";
import { Plus } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { ActivityCalendar } from "@/components/consistency/ActivityCalendar";
import SessionHistory from "@/components/history/SessionHistory";
import ProgressStats from "@/components/profile/ProgressStats";
import { Button } from "@/components/ui/button";
import AddSessionModal from "@/components/history/AddSessionModal";
import { BreathSession } from "@/types/breath";
import { useBreath } from "@/context/BreathContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

const ConsistencyPage = () => {
  const { user } = useAuth();
  const { addSession } = useBreath();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | undefined>(undefined);

  // Fetch activity dates from breath sessions - using same query key pattern
  const { data: activityDates = [], isLoading } = useQuery({
    queryKey: ["activityDates", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data: sessionsData, error } = await supabase
        .from("breath_sessions")
        .select("date")
        .eq("user_id", user.id);
        
      if (error) throw error;
      
      // Get unique dates from breath sessions
      const uniqueDates = [...new Set(
        sessionsData?.map(session => {
          const sessionDate = new Date(session.date);
          // Reset time to get just the date part
          return new Date(sessionDate.getFullYear(), sessionDate.getMonth(), sessionDate.getDate());
        }) || []
      )];
      
      return uniqueDates;
    },
    enabled: !!user
  });

  const handleAddSession = async (newSession: BreathSession) => {
    if (user) {
      // Add to Supabase for authenticated users
      try {
        const { error } = await supabase
          .from("breath_sessions")
          .insert({
            user_id: user.id,
            date: newSession.date,
            breath_count: newSession.breathCount,
            total_duration: newSession.totalDuration,
            hold_duration: newSession.holdDuration,
            exercise_title: newSession.exerciseTitle,
            repetitions: newSession.repetitions,
          });

        if (error) throw error;
        
        // Invalidate all related queries immediately to ensure consistent data
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["breathSessions", user.id] }),
          queryClient.invalidateQueries({ queryKey: ["userStats", user.id] }),
          queryClient.invalidateQueries({ queryKey: ["activityDates", user.id] })
        ]);
        
        toast({
          title: "Session added",
          description: "Your custom breathing session has been successfully added.",
        });
      } catch (error) {
        console.error("Error adding session:", error);
        toast({
          title: "Error",
          description: "Failed to add the session. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      // Add locally for non-authenticated users
      addSession(newSession);
      toast({
        title: "Session added",
        description: "Your custom breathing session has been successfully added.",
      });
    }
  };

  return (
    <MainLayout>
      <div className="container pt-24 pb-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">My Progress</h1>
        
        {isLoading ? (
          <div className="flex justify-center">
            <p>Loading your progress data...</p>
          </div>
        ) : !user ? (
          <div className="text-center">
            <p className="text-muted-foreground">
              Please log in to view your progress data
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <ProgressStats />
            <ActivityCalendar 
              activityDates={activityDates} 
              onDateSelect={setSelectedCalendarDate}
              selectedDate={selectedCalendarDate}
            />
            
            {/* Session History */}
            <div className="md:col-span-2">
              <SessionHistory selectedDate={selectedCalendarDate} />
            </div>
          </div>
        )}

        {/* Floating + Button for adding custom sessions */}
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="fixed bottom-24 md:bottom-6 right-6 h-14 w-14 rounded-full bg-breath hover:bg-breath/90 shadow-lg"
          size="icon"
        >
          <Plus className="h-6 w-6" />
        </Button>

        <AddSessionModal
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          onSave={handleAddSession}
        />
      </div>
    </MainLayout>
  );
};

export default ConsistencyPage;
