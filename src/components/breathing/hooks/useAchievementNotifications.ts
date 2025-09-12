import { useNotificationQueue } from "@/hooks/useNotificationQueue";
import { 
  breathBadgeDefinitions, 
  sessionBadgeDefinitions, 
  streakBadgeDefinitions, 
  exerciseBadgeDefinitions, 
  oxiaBadgeDefinitions 
} from "./badgeDefinitions";

export const useAchievementNotifications = () => {
  const { queueNotifications } = useNotificationQueue();

  const showAchievementToast = (
    badgeName: string, 
    badgeDescription: string, 
    category: 'breath' | 'session' | 'streak' | 'exercise' | 'oxia' = 'breath'
  ) => {
    const categoryEmojis = {
      breath: "🫁",
      session: "🎯", 
      streak: "🔥",
      exercise: "🧘‍♀️",
      oxia: "✨"
    };

    const categoryMessages = {
      breath: "Your breathing practice is growing stronger!",
      session: "Your dedication is paying off!",
      streak: "Your consistency is incredible!",
      exercise: "Your exploration journey continues!",
      oxia: "You're a true OXIA champion!"
    };

    queueNotifications([{
      title: `${categoryEmojis[category]} Achievement Unlocked!`,
      description: `Congratulations! You've earned "${badgeName}" - ${badgeDescription}. ${categoryMessages[category]}`,
      duration: 3000
    }]);
  };

  const checkBreathAchievements = (totalBreaths: number, previousTotal: number) => {
    const newBadge = breathBadgeDefinitions.find(badge => 
      badge.threshold <= totalBreaths && badge.threshold > previousTotal
    );
    
    if (newBadge) {
      showAchievementToast(newBadge.name, newBadge.description, 'breath');
    }
  };

  const checkSessionAchievements = (totalSessions: number, previousTotal: number) => {
    const newBadge = sessionBadgeDefinitions.find(badge => 
      badge.threshold <= totalSessions && badge.threshold > previousTotal
    );
    
    if (newBadge) {
      showAchievementToast(newBadge.name, newBadge.description, 'session');
    }
  };

  const checkStreakAchievements = (currentStreak: number, previousStreak: number) => {
    const newBadge = streakBadgeDefinitions.find(badge => 
      badge.threshold <= currentStreak && badge.threshold > previousStreak
    );
    
    if (newBadge) {
      showAchievementToast(newBadge.name, newBadge.description, 'streak');
    }
  };

  const checkExerciseAchievements = (completedExercises: any[], isNewExercise: boolean) => {
    if (!isNewExercise) return;

    const customCount = completedExercises.filter(ex => ex.is_custom).length;
    const uniqueExercises = completedExercises.length;

    // Check custom exercise badge
    const customBadge = exerciseBadgeDefinitions.find(badge => 
      badge.type === "custom" && customCount >= badge.threshold
    );
    if (customBadge && customCount === customBadge.threshold) {
      showAchievementToast(customBadge.name, customBadge.description, 'exercise');
    }

    // Check exploration badges - only show the exact threshold match
    const explorationBadge = exerciseBadgeDefinitions.find(badge => 
      badge.type === "different" && uniqueExercises === badge.threshold
    );
    if (explorationBadge) {
      showAchievementToast(explorationBadge.name, explorationBadge.description, 'exercise');
    }

    // Check full spectrum badge (all 11 default exercises)
    const nonCustomExercises = completedExercises.filter(ex => !ex.is_custom);
    if (nonCustomExercises.length === 11) {
      const fullSpectrumBadge = exerciseBadgeDefinitions.find(badge => badge.type === "all");
      if (fullSpectrumBadge) {
        showAchievementToast(fullSpectrumBadge.name, fullSpectrumBadge.description, 'exercise');
      }
    }
  };

  const showShareAchievement = () => {
    const shareBadge = oxiaBadgeDefinitions.find(badge => badge.id === "oxia-share");
    if (shareBadge) {
      showAchievementToast(shareBadge.name, shareBadge.description, 'oxia');
    }
  };

  return {
    showAchievementToast,
    checkBreathAchievements,
    checkSessionAchievements,
    checkStreakAchievements,
    checkExerciseAchievements,
    showShareAchievement
  };
};