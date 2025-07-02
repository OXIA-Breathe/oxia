import { supabase } from "@/integrations/supabase/client";

export const useStreakManager = () => {
  const updateBreathStreak = async (userId: string) => {
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      
      // Update daily activity to mark breath session completion
      const { error: activityError } = await supabase
        .from("daily_activity")
        .upsert({
          user_id: userId,
          date: today,
          completed_breath_session: true,
          logged_in: true // Also mark as logged in
        }, {
          onConflict: 'user_id,date'
        });
        
      if (activityError) {
        console.error("Error updating daily activity:", activityError);
        return;
      }

      // Get the user's streak data
      const { data: streakData, error: streakError } = await supabase
        .from("user_streaks")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
        
      if (streakError && streakError.code !== 'PGRST116') {
        console.error("Error fetching streak data:", streakError);
        return;
      }

      const lastBreathDate = streakData?.last_breath_session_date;
      const currentStreak = streakData?.current_breath_streak || 0;
      const longestStreak = streakData?.longest_breath_streak || 0;
      
      let newCurrentStreak = 1;
      
      if (lastBreathDate) {
        const lastDate = new Date(lastBreathDate);
        const todayDate = new Date(today);
        const daysDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 0) {
          // Same day - keep current streak
          newCurrentStreak = currentStreak;
        } else if (daysDiff === 1) {
          // Consecutive day - increment streak
          newCurrentStreak = currentStreak + 1;
        } else {
          // Streak broken - reset to 1
          newCurrentStreak = 1;
        }
      }
      
      const newLongestStreak = Math.max(longestStreak, newCurrentStreak);
      
      // Update streak data
      const { error: updateError } = await supabase
        .from("user_streaks")
        .upsert({
          user_id: userId,
          last_breath_session_date: today,
          current_breath_streak: newCurrentStreak,
          longest_breath_streak: newLongestStreak,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });
        
      if (updateError) {
        console.error("Error updating breath streak:", updateError);
      }
      
    } catch (error) {
      console.error("Error updating breath streak:", error);
    }
  };

  return { updateBreathStreak };
};
