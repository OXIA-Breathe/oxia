// Mood icons
import irritatedIcon from "@/assets/moods/irritated.png";
import sadIcon from "@/assets/moods/sad.png";
import tiredIcon from "@/assets/moods/tired.png";
import anxiousIcon from "@/assets/moods/anxious.png";
import calmIcon from "@/assets/moods/calm.png";
import happyIcon from "@/assets/moods/happy.png";
import excitedIcon from "@/assets/moods/excited.png";

export interface MoodConfig {
  value: number;
  label: string;
  color: string;
  bgColor: string;
  icon: string;
}

export const MOODS: MoodConfig[] = [
  { value: 1, label: "Irritated", color: "hsl(0, 70%, 55%)", bgColor: "hsl(0, 70%, 95%)", icon: irritatedIcon },
  { value: 2, label: "Sad", color: "hsl(210, 60%, 50%)", bgColor: "hsl(210, 60%, 92%)", icon: sadIcon },
  { value: 3, label: "Tired", color: "hsl(200, 50%, 60%)", bgColor: "hsl(200, 50%, 92%)", icon: tiredIcon },
  { value: 4, label: "Anxious", color: "hsl(270, 50%, 65%)", bgColor: "hsl(270, 50%, 92%)", icon: anxiousIcon },
  { value: 5, label: "Calm", color: "hsl(120, 45%, 55%)", bgColor: "hsl(120, 45%, 92%)", icon: calmIcon },
  { value: 6, label: "Happy", color: "hsl(45, 90%, 50%)", bgColor: "hsl(45, 90%, 92%)", icon: happyIcon },
  { value: 7, label: "Excited", color: "hsl(15, 80%, 60%)", bgColor: "hsl(15, 80%, 92%)", icon: excitedIcon },
];

export const getMoodConfig = (value: number): MoodConfig => {
  return MOODS.find(m => m.value === value) || MOODS[4]; // Default to Calm
};

export const getMoodLabel = (value: number): string => {
  return getMoodConfig(value).label;
};

// Stress Level helpers (0-100 scale)
export interface StressCategory {
  label: string;
  min: number;
  max: number;
  color: string;
  bgColor: string;
}

export const STRESS_CATEGORIES: StressCategory[] = [
  { label: "Very Low", min: 0, max: 19, color: "hsl(142, 70%, 45%)", bgColor: "hsl(142, 70%, 92%)" },
  { label: "Low", min: 20, max: 39, color: "hsl(120, 55%, 50%)", bgColor: "hsl(120, 55%, 92%)" },
  { label: "Moderate", min: 40, max: 59, color: "hsl(45, 90%, 50%)", bgColor: "hsl(45, 90%, 92%)" },
  { label: "High", min: 60, max: 79, color: "hsl(25, 85%, 55%)", bgColor: "hsl(25, 85%, 92%)" },
  { label: "Very High", min: 80, max: 100, color: "hsl(0, 70%, 55%)", bgColor: "hsl(0, 70%, 92%)" },
];

export const getStressCategory = (value: number): StressCategory => {
  return STRESS_CATEGORIES.find(c => value >= c.min && value <= c.max) || STRESS_CATEGORIES[2];
};

export const getStressLabel = (value: number): string => {
  return getStressCategory(value).label;
};

export const getStressColor = (value: number): string => {
  return getStressCategory(value).color;
};

export const getStressBgColor = (value: number): string => {
  return getStressCategory(value).bgColor;
};
