
import { useState } from "react";
import { useBreath } from "@/context/BreathContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

const SessionHistory = () => {
  const { sessions } = useBreath();
  
  if (sessions.length === 0) {
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
      <CardHeader>
        <CardTitle className="text-xl">Session History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] rounded-md">
          <div className="space-y-4">
            {sessions.map((session) => (
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
