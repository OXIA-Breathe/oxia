
import { Award, BookOpen, TrendingUp, Zap, Trophy } from "lucide-react";

export const badgeDefinitions = [
  {
    id: "breaths-25",
    name: "Breathing Beginner",
    description: "Complete 25 total breaths",
    icon: BookOpen,
    threshold: 25
  },
  {
    id: "breaths-50",
    name: "Consistent Breather",
    description: "Complete 50 total breaths",
    icon: Zap,
    threshold: 50
  },
  {
    id: "breaths-100",
    name: "Breathing Enthusiast",
    description: "Complete 100 total breaths",
    icon: TrendingUp,
    threshold: 100
  },
  {
    id: "breaths-250",
    name: "Breathing Expert",
    description: "Complete 250 total breaths",
    icon: Award,
    threshold: 250
  },
  {
    id: "breaths-500",
    name: "Breathing Master",
    description: "Complete 500 total breaths",
    icon: Trophy,
    threshold: 500
  }
];
