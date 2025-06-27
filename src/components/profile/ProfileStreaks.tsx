
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const ProfileStreaks = () => {
  const { user } = useAuth();

  // Fetch user streak data
  const { data: streakData, isLoading } = useQuery({
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

  if (isLoading) {
    return <div className="text-center p-4">Loading streaks...</div>;
  }

  if (!streakData) {
    return (
      <div className="text-center p-4">
        <p className="text-muted-foreground">No streak data available yet. Start your breathing practice to track your consistency!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
      <StreakCard 
        title="Current Breath Streak" 
        value={streakData.current_breath_streak || 0} 
        color="bg-breath/10 text-breath"
      />
      <StreakCard 
        title="Current Login Streak" 
        value={streakData.current_login_streak || 0} 
        color="bg-blue-50 text-blue-600"
      />
      <StreakCard 
        title="Longest Breath Streak" 
        value={streakData.longest_breath_streak || 0} 
        color="bg-green-50 text-green-600"
      />
      <StreakCard 
        title="Longest Login Streak" 
        value={streakData.longest_login_streak || 0} 
        color="bg-purple-50 text-purple-600"
      />
    </div>
  );
};

interface StreakCardProps {
  title: string;
  value: number;
  color: string;
}

const StreakCard = ({ title, value, color }: StreakCardProps) => (
  <div className={`p-3 sm:p-4 rounded-lg flex flex-col items-center justify-center text-center ${color}`}>
    <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">{title}</h3>
    <p className="text-xl sm:text-2xl font-semibold">
      {value}
    </p>
    <p className="text-xs text-muted-foreground mt-1">days</p>
  </div>
);

export default ProfileStreaks;
