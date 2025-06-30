
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BreathSession } from "@/types/breath";
import { formatTime } from "./utils/formatTime";
import { Edit, Trash2 } from "lucide-react";

interface SessionCardProps {
  session: BreathSession;
  onModify: (session: BreathSession) => void;
  onDelete: (session: BreathSession) => void;
}

const SessionCard = ({ session, onModify, onDelete }: SessionCardProps) => {
  return (
    <Card className="p-4 hover:bg-accent/50 transition-colors">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
        <div>
          <h3 className="font-medium text-base">
            {session.exerciseTitle || "Breathing Exercise"}
          </h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            {format(new Date(session.date), "MMMM d, yyyy")}
            <span>•</span>
            {format(new Date(session.date), "h:mm a")}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs text-muted-foreground">Breaths</p>
            <p className="font-semibold">{session.breathCount}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Time</p>
            <p className="font-semibold">{formatTime(session.totalDuration)}</p>
          </div>
        </div>
        
        <div className="flex gap-2 justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onModify(session)}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(session)}
            className="h-8 w-8 p-0 hover:bg-gray-100 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SessionCard;
