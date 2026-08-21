
import { History } from "lucide-react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BreathSession } from "@/types/breath";
import ExportButton from "./ExportButton";

interface SessionHistoryHeaderProps {
  selectedDate?: Date;
  displaySessions: BreathSession[];
}

const SessionHistoryHeader = ({ selectedDate, displaySessions }: SessionHistoryHeaderProps) => {
  return (
    <CardHeader className="pb-2 flex flex-row items-start justify-between">
      <div>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-breath" />
          <span className="text-foreground">My Sessions</span>
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {selectedDate 
            ? `Showing ${displaySessions.length} session${displaySessions.length !== 1 ? 's' : ''} for selected date`
            : "View and export your breathing sessions"
          }
        </CardDescription>
        {selectedDate && (
          <div className="text-sm text-muted-foreground mt-1">
            {selectedDate.toLocaleDateString()}
          </div>
        )}
      </div>
      <ExportButton sessions={displaySessions} />
    </CardHeader>
  );
};

export default SessionHistoryHeader;
