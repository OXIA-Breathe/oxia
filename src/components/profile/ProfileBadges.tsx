
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Award, BookOpen, TrendingUp, Zap, Trophy } from "lucide-react";

interface BadgeItem {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  threshold: number;
  achieved: boolean;
}

const ProfileBadges = () => {
  const { user } = useAuth();

  // Define all possible badges
  const badgeDefinitions: Omit<BadgeItem, 'achieved'>[] = [
    {
      id: "breaths-1",
      name: "First Breath",
      description: "Complete your first breath",
      icon: BookOpen,
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

  // Fetch user stats
  const { data: stats, isLoading } = useQuery({
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

  // Prepare badges with achieved status
  const badges: BadgeItem[] = badgeDefinitions.map(badge => ({
    ...badge,
    achieved: stats?.totalBreaths ? stats.totalBreaths >= badge.threshold : false
  }));

  if (isLoading) {
    return <div className="text-center p-4">Loading badges...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Breaths</h3>
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
            {badge.achieved ? "Unlocked" : `${stats?.totalBreaths || 0}/${badge.threshold} breaths`}
          </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileBadges;
