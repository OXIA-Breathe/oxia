
import { useState, useEffect } from "react";
import { useBreath } from "@/context/BreathContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { BreathSession } from "@/types/breath";
import ExportButton from "./ExportButton";

const SessionHistory = () => {
  const { sessions, addSession } = useBreath();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [onlineSessions, setOnlineSessions] = useState<BreathSession[]>([]);
  
  useEffect(() => {
    if (user) {
      fetchUserSessions();
    }
  }, [user]);

  const fetchUserSessions = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("breath_sessions")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      
      if (data) {
        // Convert Supabase data to app format
        const formattedSessions: BreathSession[] = data.map(session => ({
          id: session.id,
          date: session.date,
          repetitions: session.repetitions,
          holdDuration: session.hold_duration,
          totalDuration: session.total_duration,
          breathCount: session.breath_count
        }));
        
        setOnlineSessions(formattedSessions);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const displaySessions = user ? onlineSessions : sessions;
  
  if (isLoading) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl text-center">Loading sessions...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (displaySessions.length === 0) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl text-center">No sessions yet</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          Complete a breathing session to see your history
        </CardContent>
      </Card>
    );
  }

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Session History</CardTitle>
        <ExportButton sessions={displaySessions} />
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] rounded-md">
          <div className="space-y-4">
            {displaySessions.map((session) => (
              <Card key={session.id} className="p-4 hover:bg-accent/50 transition-colors">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <h3 className="font-medium">
                      {format(new Date(session.date), "MMMM d, yyyy")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(session.date), "h:mm a")}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Repetitions</p>
                      <p className="font-semibold">{session.repetitions}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Hold Duration</p>
                      <p className="font-semibold">{session.holdDuration}s</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Breaths</p>
                      <p className="font-semibold">{session.breathCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Time</p>
                      <p className="font-semibold">{formatTime(session.totalDuration)}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SessionHistory;
