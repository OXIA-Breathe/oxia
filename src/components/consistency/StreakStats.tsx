
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Award, Flame, LogIn } from "lucide-react";

interface StreakStatsProps {
  streakData: any;
}

export const StreakStats = ({ streakData }: StreakStatsProps) => {
  // Function to determine badge color based on streak length
  const getStreakBadgeVariant = (streak: number) => {
    if (streak >= 30) return "default";
    if (streak >= 14) return "secondary";
    return "outline";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Your Streaks
        </CardTitle>
        <CardDescription>
          Track your daily login and breathing consistency
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium flex items-center gap-2">
            <LogIn className="h-4 w-4" /> Login Streak
          </h3>
          <div className="mt-2 flex items-center gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Current</p>
              <Badge variant={getStreakBadgeVariant(streakData.current_login_streak)} className="mt-1">
                {streakData.current_login_streak} {streakData.current_login_streak === 1 ? 'day' : 'days'}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Longest</p>
              <Badge variant={getStreakBadgeVariant(streakData.longest_login_streak)} className="mt-1">
                {streakData.longest_login_streak} {streakData.longest_login_streak === 1 ? 'day' : 'days'}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Login</p>
              <p className="text-sm font-medium mt-1">
                {new Date(streakData.last_login_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Award className="h-4 w-4" /> Breathing Streak
          </h3>
          <div className="mt-2 flex items-center gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Current</p>
              <Badge variant={getStreakBadgeVariant(streakData.current_breath_streak)} className="mt-1">
                {streakData.current_breath_streak} {streakData.current_breath_streak === 1 ? 'day' : 'days'}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Longest</p>
              <Badge variant={getStreakBadgeVariant(streakData.longest_breath_streak)} className="mt-1">
                {streakData.longest_breath_streak} {streakData.longest_breath_streak === 1 ? 'day' : 'days'}
              </Badge>
            </div>
            {streakData.last_breath_session_date && (
              <div>
                <p className="text-sm text-muted-foreground">Last Session</p>
                <p className="text-sm font-medium mt-1">
                  {new Date(streakData.last_breath_session_date).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {(streakData.current_login_streak >= 7 || streakData.current_breath_streak >= 7) && (
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm">
              {streakData.current_login_streak >= 30 || streakData.current_breath_streak >= 30
                ? "Amazing consistency! You're a breathing master!"
                : streakData.current_login_streak >= 14 || streakData.current_breath_streak >= 14
                ? "Great job maintaining your streak! Keep going!"
                : "You're building a great habit! Consistency is key to mastery."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
