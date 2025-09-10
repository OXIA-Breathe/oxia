
import { Award, BookOpen, TrendingUp, Zap, Trophy, Sparkles, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Sprout, Flower2, Shrub, TreePine, Trees, MountainSnow, Dumbbell, Footprints, Compass, Earth, Radar, Hand, Crown } from "lucide-react";

export const breathBadgeDefinitions = [
  {
    id: "breaths-1",
    name: "First Breath",
    description: "Complete your first breath",
    icon: Sparkles,
    threshold: 1
  },
  {
    id: "breaths-50",
    name: "Breathing Beginner",
    description: "Complete 50 total breaths",
    icon: BookOpen,
    threshold: 50
  },
  {
    id: "breaths-150",
    name: "Breathing Intermediate",
    description: "Complete 150 total breaths",
    icon: Zap,
    threshold: 150
  },
  {
    id: "breaths-500",
    name: "Breathing Enthusiast",
    description: "Complete 500 total breaths",
    icon: TrendingUp,
    threshold: 500
  },
  {
    id: "breaths-1000",
    name: "Breathing Expert",
    description: "Complete 1000 total breaths",
    icon: Award,
    threshold: 1000
  },
  {
    id: "breaths-2000",
    name: "Breathing Master",
    description: "Complete 2000 total breaths",
    icon: Trophy,
    threshold: 2000
  }
];

export const sessionBadgeDefinitions = [
  {
    id: "sessions-1",
    name: "First Flow",
    description: "Your very first session",
    icon: Dice1,
    threshold: 1
  },
  {
    id: "sessions-10",
    name: "Finding Rhythm",
    description: "Complete 10 sessions",
    icon: Dice2,
    threshold: 10
  },
  {
    id: "sessions-25",
    name: "Habit Builder",
    description: "Complete 25 sessions",
    icon: Dice3,
    threshold: 25
  },
  {
    id: "sessions-50",
    name: "Momentum",
    description: "Complete 50 sessions",
    icon: Dice4,
    threshold: 50
  },
  {
    id: "sessions-100",
    name: "Consistency Pro",
    description: "Complete 100 sessions",
    icon: Dice5,
    threshold: 100
  },
  {
    id: "sessions-250",
    name: "Deep Practice",
    description: "Complete 250 sessions",
    icon: Dice6,
    threshold: 250
  }
];

export const streakBadgeDefinitions = [
  {
    id: "streak-7",
    name: "Spark Week",
    description: "Seven days of steady calm",
    icon: Sprout,
    threshold: 7
  },
  {
    id: "streak-30",
    name: "Habit Month",
    description: "Thirty days, habit locked",
    icon: Flower2,
    threshold: 30
  },
  {
    id: "streak-91",
    name: "Flow Quarter",
    description: "Three months in steady flow",
    icon: Shrub,
    threshold: 91
  },
  {
    id: "streak-182",
    name: "Steady Half-Year",
    description: "Six months of steady practice",
    icon: TreePine,
    threshold: 182
  },
  {
    id: "streak-273",
    name: "Unshakable Nine",
    description: "Nine months, nothing shakes you",
    icon: Trees,
    threshold: 273
  },
  {
    id: "streak-365",
    name: "Year of Breath",
    description: "365 days. Habit mastered",
    icon: MountainSnow,
    threshold: 365
  }
];

export const exerciseBadgeDefinitions = [
  {
    id: "exercise-creator",
    name: "Creator",
    description: "Your first custom exercise completed",
    icon: Dumbbell,
    threshold: 1,
    type: "custom"
  },
  {
    id: "exercise-explorer",
    name: "Explorer",
    description: "Three different techniques explored",
    icon: Footprints,
    threshold: 3,
    type: "different"
  },
  {
    id: "exercise-pathfinder",
    name: "Pathfinder",
    description: "Five different techniques explored",
    icon: Compass,
    threshold: 5,
    type: "different"
  },
  {
    id: "exercise-voyager",
    name: "Voyager",
    description: "Ten different techniques explored",
    icon: Earth,
    threshold: 10,
    type: "different"
  },
  {
    id: "exercise-full-spectrum",
    name: "Full Spectrum",
    description: "Every OXIA technique explored",
    icon: Radar,
    threshold: -1, // Special case for all exercises
    type: "all"
  }
];

export const oxiaBadgeDefinitions = [
  {
    id: "oxia-share",
    name: "Share the Calm",
    description: "Shared OXIA with friends",
    icon: Hand,
    threshold: 1
  },
  {
    id: "oxia-true",
    name: "True Oxian",
    description: "Every achievement, platinum status",
    icon: Crown,
    threshold: -1 // Special case for all achievements
  }
];
