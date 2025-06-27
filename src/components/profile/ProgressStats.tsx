
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Wind } from "lucide-react";

interface StatsData {
  totalSessions: number;
  totalRepetitions: number;
  totalBreaths: number;
  totalTime: number; // in seconds
}

const ProgressStats = () => {
  const { user } = useAuth();

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
    if (seconds < 60) {
      // Less than 1 minute, round to nearest minute
      const roundedMinutes = seconds >= 30 ? 1 : 0;
      return roundedMinutes === 0 ? "0 min" : "1 min";
    }
    
    const totalMinutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (totalMinutes < 60) {
      // Less than 1 hour, round minutes based on seconds
      const roundedMinutes = remainingSeconds >= 30 ? totalMinutes + 1 : totalMinutes;
      return `${roundedMinutes} min`;
    }
    
    // 1 hour or more - round to nearest hour based on total minutes
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutesAfterHours = totalMinutes % 60;
    
    // Round to next hour if remaining minutes >= 30
    const roundedHours = remainingMinutesAfterHours >= 30 ? totalHours + 1 : totalHours;
    
    return `${roundedHours} hr`;
  };

  if (isLoading) {
    return (
      <Card className="border-none shadow-md bg-white">
        <CardContent className="p-6">
          <div className="text-center">Loading stats...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-md bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Wind className="h-5 w-5 text-breath" />
          <span className="text-gray-800">Breathing Statistics</span>
        </CardTitle>
        <CardDescription className="text-gray-600">
          Your overall breathing practice metrics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-breath/10 rounded-lg">
            <div className="text-2xl font-bold text-breath mb-1">
              {stats?.totalSessions || 0}
            </div>
            <div className="text-sm text-gray-600">Total Sessions</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {stats?.totalRepetitions || 0}
            </div>
            <div className="text-sm text-gray-600">Total Repetitions</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {stats?.totalBreaths || 0}
            </div>
            <div className="text-sm text-gray-600">Total Breaths</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {stats?.totalTime ? formatTime(stats.totalTime) : "0 min"}
            </div>
            <div className="text-sm text-gray-600">Total Time</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressStats;
