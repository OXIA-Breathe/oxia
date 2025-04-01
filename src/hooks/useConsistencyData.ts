
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
          .maybeSingle(); // Use maybeSingle instead of single to avoid errors when no data exists
        
        if (streakError && streakError.code !== 'PGRST116') {
          // Only throw if it's not the "no rows returned" error
          throw streakError;
        }
        
        // Fetch user daily activity
        const { data: activityData, error: activityError } = await supabase
          .from("daily_activity")
          .select("*")
          .eq("user_id", user.id)
          .order("date", { ascending: false });
          
        if (activityError) throw activityError;
        
        // Convert activity dates to Date objects for the calendar
        const dates = activityData
          ?.filter(day => day.completed_breath_session)
          .map(day => new Date(day.date)) || [];
        
        setStreakData(streakData);
        setActivityDates(dates);
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
