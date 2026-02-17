import { useState } from "react";
import { Plus, Sparkles, TrendingUp, Calendar, BarChart3, History } from "lucide-react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { ActivityCalendar } from "@/components/consistency/ActivityCalendar";
import SessionHistory from "@/components/history/SessionHistory";
import ProgressStats from "@/components/profile/ProgressStats";
import MoodInsightsCard from "@/components/progress/MoodInsightsCard";
import StressInsightsCard from "@/components/progress/StressInsightsCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddSessionModal from "@/components/history/AddSessionModal";
import SignInEmptyState from "@/components/layout/SignInEmptyState";
import { BreathSession, EmotionData } from "@/types/breath";
import { useBreath } from "@/context/BreathContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

const ConsistencyPage = () => {
  const { user } = useAuth();
  const { addSession } = useBreath();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | undefined>(undefined);

  // Fetch activity dates from breath sessions - using same query key pattern
  const { data: activityDates = [], isLoading } = useQuery({
    queryKey: ["activityDates", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data: sessionsData, error } = await supabase
        .from("breath_sessions")
        .select("date")
        .eq("user_id", user.id);
        
      if (error) throw error;
      
      // Get unique dates from breath sessions
      const uniqueDates = [...new Set(
        sessionsData?.map(session => {
          const sessionDate = new Date(session.date);
          // Reset time to get just the date part
          return new Date(sessionDate.getFullYear(), sessionDate.getMonth(), sessionDate.getDate());
        }) || []
      )];
      
      return uniqueDates;
    },
    enabled: !!user
  });

  const handleAddSession = async (newSession: BreathSession, emotionData?: EmotionData) => {
    if (user) {
      // Add to Supabase for authenticated users
      try {
        // First, insert the breath session
        const { data: sessionData, error: sessionError } = await supabase
          .from("breath_sessions")
          .insert({
            id: newSession.id,
            user_id: user.id,
            date: newSession.date,
            breath_count: newSession.breathCount,
            total_duration: newSession.totalDuration,
            hold_duration: newSession.holdDuration,
            exercise_title: newSession.exerciseTitle,
            repetitions: newSession.repetitions,
          })
          .select()
          .single();

        if (sessionError) throw sessionError;

        // If emotion data is provided, insert it
        if (emotionData && sessionData) {
          const { error: emotionError } = await supabase
            .from("emotion_tracking")
            .insert({
              user_id: user.id,
              session_id: sessionData.id,
              pre_valence: emotionData.preValence,
              pre_arousal: emotionData.preStress, // Map stress to arousal column
              post_valence: emotionData.postValence,
              post_arousal: emotionData.postStress, // Map stress to arousal column
              note: emotionData.note,
            });

          if (emotionError) {
            console.error("Error saving emotion data:", emotionError);
            // Don't fail the whole operation if emotion save fails
          }
        }
        
        // Invalidate all related queries immediately to ensure consistent data
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["breathSessions", user.id] }),
          queryClient.invalidateQueries({ queryKey: ["userStats", user.id] }),
          queryClient.invalidateQueries({ queryKey: ["activityDates", user.id] }),
          queryClient.invalidateQueries({ queryKey: ["emotionalStats", user.id] })
        ]);
        
        toast({
          title: "Session added",
          description: "Your custom breathing session has been successfully added.",
        });
      } catch (error) {
        console.error("Error adding session:", error);
        toast({
          title: "Error",
          description: "Failed to add the session. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      // Add locally for non-authenticated users
      addSession(newSession);
      toast({
        title: "Session added",
        description: "Your custom breathing session has been successfully added.",
      });
    }
  };
  return (
    <MainLayout>
      <div className="container pt-24 pb-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">My Progress</h1>
        
        {isLoading ? (
          <div className="flex justify-center">
            <p>Loading your progress data...</p>
          </div>
        ) : !user ? (
          <SignInEmptyState
            title="Track Your Progress"
            description="Sign in to see your activity calendar, session history, mood insights, and breathing streaks."
          >
            {/* Mock preview cards */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Mock Stats Card */}
              <Card className="border-none shadow-md bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="text-card-foreground">Statistics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div><p className="text-2xl font-bold text-card-foreground">12</p><p className="text-xs text-muted-foreground">Sessions</p></div>
                  <div><p className="text-2xl font-bold text-card-foreground">48m</p><p className="text-xs text-muted-foreground">Total Time</p></div>
                  <div><p className="text-2xl font-bold text-card-foreground">5</p><p className="text-xs text-muted-foreground">Day Streak</p></div>
                  <div><p className="text-2xl font-bold text-card-foreground">3</p><p className="text-xs text-muted-foreground">Exercises</p></div>
                </CardContent>
              </Card>

              {/* Mock Calendar Card */}
              <Card className="border-none shadow-md bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-card-foreground">Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 28 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-6 w-6 rounded-md ${
                          [3, 4, 7, 10, 11, 14, 17, 18, 21, 24, 25].includes(i)
                            ? "bg-breath/60"
                            : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Mock Mood Card */}
              <Card className="border-none shadow-md bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    <span className="text-card-foreground">Mood Insights</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-2 h-20">
                    {[40, 60, 35, 80, 55, 70, 90].map((h, i) => (
                      <div key={i} className="flex-1 bg-breath/40 rounded-t-sm" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Mock Sessions Card */}
              <Card className="border-none shadow-md bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <History className="h-4 w-4 text-primary" />
                    <span className="text-card-foreground">My Sessions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {["Box Breathing", "4-7-8 Relaxing", "Deep Calm"].map((name) => (
                    <div key={name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="text-sm text-card-foreground">{name}</span>
                      <span className="text-xs text-muted-foreground">4m 30s</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </SignInEmptyState>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <ProgressStats />
            <ActivityCalendar 
              activityDates={activityDates} 
              onDateSelect={setSelectedCalendarDate}
              selectedDate={selectedCalendarDate}
            />
            
            {/* Emotional Insights */}
            <div className="md:col-span-2">
              <MoodInsightsCard />
            </div>
            <div className="md:col-span-2">
              <StressInsightsCard />
            </div>
            
            {/* Session History */}
            <div className="md:col-span-2">
              <SessionHistory selectedDate={selectedCalendarDate} />
            </div>

            {/* AI Wellness Journal */}
            <div className="md:col-span-2">
              <Card className="border-none shadow-md bg-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-semibold text-card-foreground">AI Wellness Journal</h3>
                        <p className="text-sm text-muted-foreground">Get personalized insights from your data</p>
                      </div>
                    </div>
                    <Button asChild className="bg-breath hover:bg-breath/90">
                      <Link to="/journal">Open</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Floating + Button for adding custom sessions */}
        {user && (
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="fixed md:bottom-6 right-6 h-14 w-14 rounded-full bg-breath hover:bg-breath/90 shadow-[0_4px_20px_rgba(0,0,0,0.3)] border-2 border-white/80"
            style={{
              bottom: 'calc(6rem + env(safe-area-inset-bottom))'
            }}
            size="icon"
          >
            <Plus className="h-6 w-6" />
          </Button>
        )}

        <AddSessionModal
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          onSave={handleAddSession}
        />
      </div>
    </MainLayout>
  );
};

export default ConsistencyPage;
