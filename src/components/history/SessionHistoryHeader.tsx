
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
          <span className="text-gray-800">My Sessions</span>
          {selectedDate && (
            <span className="text-sm font-normal text-muted-foreground">
              - {selectedDate.toLocaleDateString()}
            </span>
          )}
        </CardTitle>
        <CardDescription className="text-gray-600">
          {selectedDate 
            ? `Showing ${displaySessions.length} session${displaySessions.length !== 1 ? 's' : ''} for selected date`
            : "View and export your breathing sessions"
          }
        </CardDescription>
      </div>
      <ExportButton sessions={displaySessions} />
    </CardHeader>
  );
};

export default SessionHistoryHeader;
