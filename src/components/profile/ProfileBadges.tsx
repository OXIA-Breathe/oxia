import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { 
  breathBadgeDefinitions, 
  sessionBadgeDefinitions,
  streakBadgeDefinitions,
  exerciseBadgeDefinitions,
  oxiaBadgeDefinitions
} from "@/components/breathing/hooks/badgeDefinitions";

interface BadgeItem {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  threshold: number;
  achieved: boolean;
  progress?: string;
}

const ProfileBadges = () => {
  const { user } = useAuth();

  // Fetch user stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["userStats", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("breath_sessions")
        .select("*")
        .eq("user_id", user.id);
        
      if (error) throw error;
      
      if (!data || data.length === 0) {
        return {
          totalSessions: 0,
          totalRepetitions: 0,
          totalBreaths: 0,
          totalTime: 0
        };
      }
      
      // Calculate stats
      const totalSessions = data.length;
      const totalRepetitions = data.reduce((sum, session) => sum + session.repetitions, 0);
      const totalBreaths = data.reduce((sum, session) => sum + session.breath_count, 0);
      const totalTime = data.reduce((sum, session) => sum + session.total_duration, 0);
      
      return {
        totalSessions,
        totalRepetitions,
        totalBreaths,
        totalTime
      };
    },
    enabled: !!user
  });

  // Fetch user streak data
  const { data: streakData, isLoading: streakLoading } = useQuery({
    queryKey: ["streakData", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("user_streaks")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
        
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      return data;
    },
    enabled: !!user
  });

  // Fetch exercise completions
  const { data: exerciseData, isLoading: exerciseLoading } = useQuery({
    queryKey: ["exerciseCompletions", user?.id],
    queryFn: async () => {
      if (!user) return { customCount: 0, differentCount: 0, totalExercises: 0 };
      
      // Get user's exercise completions
      const { data: completions, error: completionsError } = await supabase
        .from("user_exercise_completions")
        .select("*")
        .eq("user_id", user.id);
        
      if (completionsError) throw completionsError;
      
      // Get total number of available exercises (excluding custom ones)
      const { data: allExercises, error: exercisesError } = await supabase
        .from("breathing_exercises")
        .select("id")
        .eq("is_custom", false);
        
      if (exercisesError) throw exercisesError;
      
      const customCount = completions?.filter(c => c.is_custom).length || 0;
      const differentCount = completions?.filter(c => !c.is_custom).length || 0;
      const totalExercises = allExercises?.length || 0;
      
      return {
        customCount,
        differentCount,
        totalExercises
      };
    },
    enabled: !!user
  });

  // Fetch OXIA achievements
  const { data: oxiaData, isLoading: oxiaLoading } = useQuery({
    queryKey: ["oxiaAchievements", user?.id],
    queryFn: async () => {
      if (!user) return { hasShared: false, totalAchievements: 0, unlockedAchievements: 0 };
      
      // Check if user has shared
      const { data: achievements, error: achievementsError } = await supabase
        .from("user_achievements")
        .select("achievement_id")
        .eq("user_id", user.id);
        
      if (achievementsError) throw achievementsError;
      
      const hasShared = achievements?.some(a => a.achievement_id === "oxia-share") || false;
      
      // Calculate total possible achievements vs unlocked
      const totalPossibleAchievements = 
        breathBadgeDefinitions.length + 
        sessionBadgeDefinitions.length + 
        streakBadgeDefinitions.length + 
        exerciseBadgeDefinitions.length + 
        1; // Share achievement (excluding True Oxian itself)
      
      const unlockedAchievements = achievements?.length || 0;
      
      return {
        hasShared,
        totalAchievements: totalPossibleAchievements,
        unlockedAchievements
      };
    },
    enabled: !!user
  });

  // Prepare badges with achieved status
  const breathBadges: BadgeItem[] = breathBadgeDefinitions.map(badge => ({
    ...badge,
    achieved: stats?.totalBreaths ? stats.totalBreaths >= badge.threshold : false,
    progress: `${stats?.totalBreaths || 0}/${badge.threshold} breaths`
  }));

  const sessionBadges: BadgeItem[] = sessionBadgeDefinitions.map(badge => ({
    ...badge,
    achieved: stats?.totalSessions ? stats.totalSessions >= badge.threshold : false,
    progress: `${stats?.totalSessions || 0}/${badge.threshold} sessions`
  }));

  const streakBadges: BadgeItem[] = streakBadgeDefinitions.map(badge => ({
    ...badge,
    achieved: streakData?.longest_breath_streak ? streakData.longest_breath_streak >= badge.threshold : false,
    progress: `${streakData?.longest_breath_streak || 0}/${badge.threshold} days`
  }));

  const exerciseBadges: BadgeItem[] = exerciseBadgeDefinitions.map(badge => {
    let achieved = false;
    let progress = "";
    
    if (badge.type === "custom") {
      achieved = (exerciseData?.customCount || 0) >= badge.threshold;
      progress = `${exerciseData?.customCount || 0}/${badge.threshold} custom`;
    } else if (badge.type === "different") {
      achieved = (exerciseData?.differentCount || 0) >= badge.threshold;
      progress = `${exerciseData?.differentCount || 0}/${badge.threshold} different`;
    } else if (badge.type === "all") {
      achieved = (exerciseData?.differentCount || 0) >= (exerciseData?.totalExercises || 1);
      progress = `${exerciseData?.differentCount || 0}/${exerciseData?.totalExercises || 0} exercises`;
    }
    
    return {
      ...badge,
      achieved,
      progress
    };
  });

  const oxiaBadges: BadgeItem[] = oxiaBadgeDefinitions.map(badge => {
    let achieved = false;
    let progress = "";
    
    if (badge.id === "oxia-share") {
      achieved = oxiaData?.hasShared || false;
      progress = achieved ? "Shared!" : "Share the app";
    } else if (badge.id === "oxia-true") {
      // True Oxian requires all other achievements
      const allOtherAchievements = 
        breathBadges.filter(b => b.achieved).length +
        sessionBadges.filter(b => b.achieved).length +
        streakBadges.filter(b => b.achieved).length +
        exerciseBadges.filter(b => b.achieved).length +
        (oxiaData?.hasShared ? 1 : 0);
      
      achieved = allOtherAchievements >= (oxiaData?.totalAchievements || 1);
      progress = `${allOtherAchievements}/${oxiaData?.totalAchievements || 0} achievements`;
    }
    
    return {
      ...badge,
      achieved,
      progress
    };
  });

  if (statsLoading || streakLoading || exerciseLoading || oxiaLoading) {
    return <div className="text-center p-4">Loading badges...</div>;
  }

  const renderBadgeSection = (title: string, badges: BadgeItem[]) => (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">{title}</h3>
      <div className="grid grid-cols-2 gap-4">
        {badges.map((badge) => (
          <div 
            key={badge.id}
            className={`p-4 rounded-lg border flex flex-col items-center text-center gap-2 transition-all ${
              badge.achieved 
                ? "bg-accent/50 border-accent" 
                : "bg-muted/30 border-muted opacity-50"
            }`}
          >
            <div className={`p-3 rounded-full ${badge.achieved ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              <badge.icon size={24} />
            </div>
            
            <h3 className="font-medium mt-1">{badge.name}</h3>
            
            <p className="text-xs text-muted-foreground">{badge.description}</p>
            
            <Badge variant={badge.achieved ? "default" : "outline"} className="mt-2">
              {badge.achieved ? "Unlocked" : badge.progress}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {renderBadgeSection("Breaths", breathBadges)}
      {renderBadgeSection("Sessions", sessionBadges)}
      {renderBadgeSection("Streaks", streakBadges)}
      {renderBadgeSection("Exercises", exerciseBadges)}
      {renderBadgeSection("OXIA", oxiaBadges)}
    </div>
  );
};

export default ProfileBadges;