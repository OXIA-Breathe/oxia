
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
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StreakCard
          title="Current Breath"
          value={streakData.current_breath_streak || 0}
          tone="primary"
        />
        <StreakCard
          title="Current Login"
          value={streakData.current_login_streak || 0}
          tone="secondary"
        />
        <StreakCard
          title="Longest Breath"
          value={streakData.longest_breath_streak || 0}
          tone="secondary"
        />
        <StreakCard
          title="Longest Login"
          value={streakData.longest_login_streak || 0}
          tone="primary"
        />
      </div>
    </div>
  );
};

interface StreakCardProps {
  title: string;
  value: number;
  tone: "primary" | "secondary";
}

const StreakCard = ({ title, value, tone }: StreakCardProps) => (
  <div
    className={`p-4 rounded-2xl flex flex-col items-center justify-center text-center border border-border/50 ${
      tone === "primary"
        ? "bg-primary text-primary-foreground"
        : "bg-secondary text-secondary-foreground"
    }`}
  >
    <p className="text-2xl font-bold tabular-nums">{value}</p>
    <p
      className={`text-[10px] uppercase tracking-wide mt-1 font-medium ${
        tone === "primary" ? "text-primary-foreground/80" : "text-secondary-foreground/70"
      }`}
    >
      {title}
    </p>
    <p
      className={`text-[10px] mt-0.5 ${
        tone === "primary" ? "text-primary-foreground/60" : "text-secondary-foreground/60"
      }`}
    >
      days
    </p>
  </div>
);

export default ProfileStreaks;
