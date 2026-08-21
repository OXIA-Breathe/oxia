
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Calendar } from "lucide-react";

interface StreakStatsProps {
  streakData: any;
}

export const StreakStats = ({ streakData }: StreakStatsProps) => {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-breath" />
          <span className="text-foreground">My Streaks</span>
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Keep up the consistent practice
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-breath/10 rounded-lg">
            <div className="text-2xl font-bold text-breath mb-1">
              {streakData.current_breath_streak}
            </div>
            <div className="text-sm text-muted-foreground">Current Breath Streak</div>
          </div>
          
          <div className="text-center p-4 bg-primary/10 rounded-lg">
            <div className="text-2xl font-bold text-primary mb-1">
              {streakData.current_login_streak}
            </div>
            <div className="text-sm text-muted-foreground">Current Login Streak</div>
          </div>
          
          <div className="text-center p-4 bg-success/10 rounded-lg">
            <div className="text-2xl font-bold text-success mb-1">
              {streakData.longest_breath_streak}
            </div>
            <div className="text-sm text-muted-foreground">Longest Breath Streak</div>
          </div>
          
          <div className="text-center p-4 bg-accent rounded-lg">
            <div className="text-2xl font-bold text-accent-foreground mb-1">
              {streakData.longest_login_streak}
            </div>
            <div className="text-sm text-muted-foreground">Longest Login Streak</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
