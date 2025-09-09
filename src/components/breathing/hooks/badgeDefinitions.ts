
import { Award, BookOpen, TrendingUp, Zap, Trophy, Sparkles } from "lucide-react";

export const badgeDefinitions = [
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
