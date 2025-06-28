
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BreathSession } from "@/types/breath";
import SessionCard from "./SessionCard";
import ModifySessionDialog from "./ModifySessionDialog";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

interface SessionListProps {
  sessions: BreathSession[];
  onUpdateSession: (updatedSession: BreathSession) => void;
  onDeleteSession: (sessionId: string) => void;
}

const SessionList = ({ sessions, onUpdateSession, onDeleteSession }: SessionListProps) => {
  const [modifySession, setModifySession] = useState<BreathSession | null>(null);
  const [deleteSession, setDeleteSession] = useState<BreathSession | null>(null);

  const handleModify = (session: BreathSession) => {
    setModifySession(session);
  };

  const handleDelete = (session: BreathSession) => {
    setDeleteSession(session);
  };

  const handleSaveModification = (updatedSession: BreathSession) => {
    onUpdateSession(updatedSession);
  };

  const handleConfirmDelete = (session: BreathSession) => {
    onDeleteSession(session.id);
  };

  return (
    <>
      <ScrollArea className="h-[500px] rounded-md">
        <div className="space-y-4">
          {sessions.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">
              No breathing sessions found.
            </div>
          ) : (
            sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onModify={handleModify}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </ScrollArea>

      <ModifySessionDialog
        session={modifySession}
        open={!!modifySession}
        onOpenChange={(open) => !open && setModifySession(null)}
        onSave={handleSaveModification}
      />

      <DeleteConfirmDialog
        session={deleteSession}
        open={!!deleteSession}
        onOpenChange={(open) => !open && setDeleteSession(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default SessionList;
