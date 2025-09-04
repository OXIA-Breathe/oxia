import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const useBreathStreakMigration = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const migrateBreathStreaks = async () => {
    if (!user) return;

    try {
      // Get all breath sessions ordered by date
      const { data: sessions, error: sessionsError } = await supabase
        .from("breath_sessions")
        .select("date")
        .eq("user_id", user.id)
        .order("date", { ascending: true });

      if (sessionsError) throw sessionsError;

      if (!sessions || sessions.length === 0) {
        console.log("No breath sessions found for migration");
        return;
      }

      // Get unique dates (in case multiple sessions per day)
      const uniqueDates = [...new Set(sessions.map(session => 
        new Date(session.date).toISOString().split('T')[0]
      ))].sort();

      console.log("Unique session dates:", uniqueDates);

      // Calculate streaks
      let currentStreak = 0;
      let longestStreak = 0;
      let lastProcessedDate: Date | null = null;

      for (const dateStr of uniqueDates) {
        const currentDate = new Date(dateStr);
        
        if (lastProcessedDate === null) {
          // First session
          currentStreak = 1;
          longestStreak = 1;
        } else {
          const daysDiff = Math.floor((currentDate.getTime() - lastProcessedDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysDiff === 1) {
            // Consecutive day
            currentStreak++;
            longestStreak = Math.max(longestStreak, currentStreak);
          } else {
            // Gap in days - reset current streak
            currentStreak = 1;
          }
        }
        
        lastProcessedDate = currentDate;
      }

      // Check if the last session was recent enough to maintain current streak
      const today = new Date();
      const lastSessionDate = new Date(uniqueDates[uniqueDates.length - 1]);
      const daysSinceLastSession = Math.floor((today.getTime() - lastSessionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // If more than 1 day since last session, current streak should be 0
      if (daysSinceLastSession > 1) {
        currentStreak = 0;
      }

      console.log(`Calculated streaks - Current: ${currentStreak}, Longest: ${longestStreak}`);

      // Update user_streaks table
      const { error: updateError } = await supabase
        .from("user_streaks")
        .upsert({
          user_id: user.id,
          current_breath_streak: currentStreak,
          longest_breath_streak: longestStreak,
          last_breath_session_date: daysSinceLastSession <= 1 ? uniqueDates[uniqueDates.length - 1] : null,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (updateError) throw updateError;

      toast({
        title: "✅ Breath Streaks Updated",
        description: `Current streak: ${currentStreak} days, Longest streak: ${longestStreak} days`,
        duration: 5000,
      });

    } catch (error) {
      console.error("Error migrating breath streaks:", error);
      toast({
        title: "Migration Error",
        description: "Failed to update breath streaks from historical data",
        variant: "destructive"
      });
    }
  };

  return { migrateBreathStreaks };
};