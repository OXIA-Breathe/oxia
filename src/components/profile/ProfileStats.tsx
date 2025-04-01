
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

interface StatsData {
  totalSessions: number;
  totalRepetitions: number;
  totalBreaths: number;
  totalTime: number; // in seconds
}

const ProfileStats = () => {
  const { user } = useAuth();
  const { toast } = useToast();

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

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds} seconds`;
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes < 60) {
      return `${minutes} min ${remainingSeconds} sec`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    return `${hours} hr ${remainingMinutes} min`;
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading stats...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard 
        title="Total Sessions" 
        value={stats?.totalSessions || 0} 
        unit="sessions"
      />
      <StatCard 
        title="Total Repetitions" 
        value={stats?.totalRepetitions || 0} 
        unit="repetitions"
      />
      <StatCard 
        title="Total Breaths" 
        value={stats?.totalBreaths || 0} 
        unit="breaths"
      />
      <StatCard 
        title="Total Time" 
        value={stats?.totalTime ? formatTime(stats.totalTime) : "0 seconds"} 
        isFormatted
      />
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number | string;
  unit?: string;
  isFormatted?: boolean;
}

const StatCard = ({ title, value, unit, isFormatted = false }: StatCardProps) => (
  <div className="bg-accent/50 p-4 rounded-lg flex flex-col items-center justify-center text-center">
    <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
    <p className="text-2xl font-semibold">
      {isFormatted ? value : value.toLocaleString()}
    </p>
    {!isFormatted && unit && (
      <p className="text-xs text-muted-foreground mt-1">{unit}</p>
    )}
  </div>
);

export default ProfileStats;
