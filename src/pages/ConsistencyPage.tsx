
import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Calendar as CalendarIcon, Flame, LogIn } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const ConsistencyPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [streakData, setStreakData] = useState<any>(null);
  const [activityDates, setActivityDates] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStreakData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        
        // Fetch user streak data
        const { data: streakData, error: streakError } = await supabase
          .from("user_streaks")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (streakError) throw streakError;
        
        // Fetch user daily activity
        const { data: activityData, error: activityError } = await supabase
          .from("daily_activity")
          .select("*")
          .eq("user_id", user.id)
          .order("date", { ascending: false });
          
        if (activityError) throw activityError;
        
        // Convert activity dates to Date objects for the calendar
        const dates = activityData
          .filter(day => day.completed_breath_session)
          .map(day => new Date(day.date));
        
        setStreakData(streakData);
        setActivityDates(dates);
      } catch (error) {
        console.error("Error fetching consistency data:", error);
        toast({
          title: "Error",
          description: "Failed to load your consistency data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStreakData();
  }, [user, toast]);

  // Function to determine badge color based on streak length
  const getStreakBadgeVariant = (streak: number) => {
    if (streak >= 30) return "default";
    if (streak >= 14) return "secondary";
    return "outline";
  };

  return (
    <MainLayout>
      <div className="container py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Consistency</h1>
        
        {isLoading ? (
          <div className="flex justify-center">
            <p>Loading your consistency data...</p>
          </div>
        ) : streakData ? (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Streak Stats */}
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
            
            {/* Calendar View */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Activity Calendar
                </CardTitle>
                <CardDescription>
                  Days with breathing sessions are highlighted
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="multiple"
                  selected={activityDates}
                  className="rounded-md border"
                  disabled={date => date > new Date()}
                />
                <p className="text-sm text-muted-foreground mt-4">
                  Highlighted days show your completed breathing sessions
                </p>
              </CardContent>
            </Card>
            
            {/* Achievement Badges */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Your Achievements
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
          </div>
        ) : (
          <div className="text-center">
            <p className="text-muted-foreground">
              Please log in to view your consistency data
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ConsistencyPage;
