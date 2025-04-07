
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { BreathSession } from "@/types/breath";
import { formatTime } from "./utils/formatTime";

interface SessionCardProps {
  session: BreathSession;
}

const SessionCard = ({ session }: SessionCardProps) => {
  return (
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
  );
};

export default SessionCard;
