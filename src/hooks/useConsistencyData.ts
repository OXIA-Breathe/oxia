
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useConsistencyData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [streakData, setStreakData] = useState<any>(null);
  const [activityDates, setActivityDates] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStreakData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        
        // Fetch user streak data
        const { data: streakData, error: streakError } = await supabase
          .from("user_streaks")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();
        
        if (streakError && streakError.code !== 'PGRST116') {
          throw streakError;
        }
        
        // Fetch breath sessions to get actual activity dates
        const { data: sessionsData, error: sessionsError } = await supabase
          .from("breath_sessions")
          .select("date")
          .eq("user_id", user.id);
          
        if (sessionsError) throw sessionsError;
        
        // Get unique dates from breath sessions
        const uniqueDates = [...new Set(
          sessionsData?.map(session => {
            const sessionDate = new Date(session.date);
            // Reset time to get just the date part
            return new Date(sessionDate.getFullYear(), sessionDate.getMonth(), sessionDate.getDate());
          }) || []
        )];
        
        console.log("Activity dates from breath sessions:", uniqueDates);
        
        setStreakData(streakData);
        setActivityDates(uniqueDates);
      } catch (error) {
        console.error("Error fetching consistency data:", error);
        toast({
          title: "Error",
          description: "Failed to load your consistency data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStreakData();
  }, [user, toast]);

  return {
    streakData,
    setStreakData,
    activityDates,
    isLoading
  };
};
