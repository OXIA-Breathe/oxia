
import { ScrollArea } from "@/components/ui/scroll-area";
import { BreathSession } from "@/types/breath";
import SessionCard from "./SessionCard";

interface SessionListProps {
  sessions: BreathSession[];
}

const SessionList = ({ sessions }: SessionListProps) => {
  return (
    <ScrollArea className="h-[500px] rounded-md">
      <div className="space-y-4">
        {sessions.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
      </div>
    </ScrollArea>
  );
};

export default SessionList;
