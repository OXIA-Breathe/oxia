
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Calendar } from "lucide-react";

interface StreakStatsProps {
  streakData: any;
}

export const StreakStats = ({ streakData }: StreakStatsProps) => {
  return (
    <Card className="border-none shadow-md bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-breath" />
          <span className="text-gray-800">My Streaks</span>
        </CardTitle>
        <CardDescription className="text-gray-600">
          Keep up the consistent practice
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-breath/10 rounded-lg">
            <div className="text-2xl font-bold text-breath mb-1">
              {streakData.current_breath_streak}
            </div>
            <div className="text-sm text-gray-600">Current Breath Streak</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {streakData.current_login_streak}
            </div>
            <div className="text-sm text-gray-600">Current Login Streak</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {streakData.longest_breath_streak}
            </div>
            <div className="text-sm text-gray-600">Longest Breath Streak</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {streakData.longest_login_streak}
            </div>
            <div className="text-sm text-gray-600">Longest Login Streak</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
