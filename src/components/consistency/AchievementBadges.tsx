
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, LogIn } from "lucide-react";

interface AchievementBadgesProps {
  streakData: any;
}

export const AchievementBadges = ({ streakData }: AchievementBadgesProps) => {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          My Achievements
        </CardTitle>
        <CardDescription>
          Badges earned through your consistency
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          {streakData.current_login_streak >= 1 && (
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 p-4 rounded-full">
                <LogIn className="h-8 w-8 text-primary" />
              </div>
              <span className="text-sm font-medium mt-2">First Login</span>
            </div>
          )}
          
          {streakData.current_login_streak >= 7 && (
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 p-4 rounded-full">
                <LogIn className="h-8 w-8 text-primary" />
              </div>
              <span className="text-sm font-medium mt-2">Week Streak</span>
            </div>
          )}
          
          {streakData.current_breath_streak >= 1 && (
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 p-4 rounded-full">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <span className="text-sm font-medium mt-2">First Breath</span>
            </div>
          )}
          
          {streakData.current_breath_streak >= 7 && (
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 p-4 rounded-full">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <span className="text-sm font-medium mt-2">Breath Master</span>
            </div>
          )}
          
          {streakData.current_breath_streak < 1 && streakData.current_login_streak < 7 && (
            <p className="text-muted-foreground text-center w-full py-4">
              Complete more breathing sessions to earn badges!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
