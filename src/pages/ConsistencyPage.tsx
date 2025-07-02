
import { useState } from "react";
import { Plus } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { ActivityCalendar } from "@/components/consistency/ActivityCalendar";
import { InitializeTracking } from "@/components/consistency/InitializeTracking";
import SessionHistory from "@/components/history/SessionHistory";
import { useConsistencyData } from "@/hooks/useConsistencyData";
import ProgressStats from "@/components/profile/ProgressStats";
import { Button } from "@/components/ui/button";
import AddSessionModal from "@/components/history/AddSessionModal";
import { BreathSession } from "@/types/breath";
import { useBreath } from "@/context/BreathContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const ConsistencyPage = () => {
  const { user } = useAuth();
  const { addSession } = useBreath();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { streakData, setStreakData, activityDates, isLoading } = useConsistencyData();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | undefined>(undefined);

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
        
        // Invalidate and refetch all related queries immediately
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["userStats", user.id] }),
          queryClient.invalidateQueries({ queryKey: ["breathSessions", user.id] }),
          queryClient.refetchQueries({ queryKey: ["userStats", user.id] }),
          queryClient.refetchQueries({ queryKey: ["breathSessions", user.id] })
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
      <div className="container py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">My Progress</h1>
        
        {isLoading ? (
          <div className="flex justify-center">
            <p>Loading your consistency data...</p>
          </div>
        ) : user && !streakData ? (
          <InitializeTracking onInitialized={setStreakData} />
        ) : streakData ? (
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
        ) : (
          <div className="text-center">
            <p className="text-muted-foreground">
              Please log in to view your consistency data
            </p>
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
