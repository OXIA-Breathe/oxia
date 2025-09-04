import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export const useDailyStreakTracker = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const trackDailyUsage = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        
        // Check if we already tracked usage today
        const { data: activityData, error: activityError } = await supabase
          .from("daily_activity")
          .select("*")
          .eq("user_id", user.id)
          .eq("date", today)
          .maybeSingle();
          
        if (activityError && activityError.code !== 'PGRST116') {
          console.error("Error checking daily activity:", activityError);
          return;
        }
        
        // If already tracked today, skip
        if (activityData) {
          return;
        }
        
        // Mark today as active
        const { error: insertError } = await supabase
          .from("daily_activity")
          .insert({
            user_id: user.id,
            date: today,
            logged_in: true
          });
          
        if (insertError) {
          console.error("Error creating daily activity:", insertError);
          return;
        }
        
        // Update login streak
        await updateLoginStreak(user.id, today);
        
      } catch (error) {
        console.error("Error tracking daily usage:", error);
      }
    };

    trackDailyUsage();
  }, [user]);
};

const updateLoginStreak = async (userId: string, today: string) => {
  try {
    // Get current streak data
    const { data: streakData, error: streakError } = await supabase
      .from("user_streaks")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
      
    if (streakError && streakError.code !== 'PGRST116') {
      console.error("Error checking streak data:", streakError);
      return;
    }
    
    // Calculate new login streak
    const lastLoginDate = streakData?.last_login_date;
    const currentStreak = streakData?.current_login_streak || 0;
    const longestStreak = streakData?.longest_login_streak || 0;
    
    let newCurrentStreak = 1;
    
    if (lastLoginDate) {
      const lastDate = new Date(lastLoginDate);
      const todayDate = new Date(today);
      const daysDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        // Consecutive day - continue streak
        newCurrentStreak = currentStreak + 1;
      } else if (daysDiff > 1) {
        // Gap in days - reset streak
        newCurrentStreak = 1;
      } else {
        // Same day (shouldn't happen due to check above, but safety)
        newCurrentStreak = currentStreak;
      }
    }
    
    const newLongestStreak = Math.max(longestStreak, newCurrentStreak);
    
    // Update streak data
    const { error: updateStreakError } = await supabase
      .from("user_streaks")
      .upsert({
        user_id: userId,
        last_login_date: today,
        current_login_streak: newCurrentStreak,
        longest_login_streak: newLongestStreak,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });
      
    if (updateStreakError) {
      console.error("Error updating login streak:", updateStreakError);
    }
    
  } catch (error) {
    console.error("Error updating login streak:", error);
  }
};