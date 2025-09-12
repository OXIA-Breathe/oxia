import { usePersistentBreathing } from "@/context/PersistentBreathingContext";
import { Button } from "@/components/ui/button";
import { Wind, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export const ActiveSessionNotification = () => {
  const { hasActiveSession, clearSessionState } = usePersistentBreathing();
  const [dismissed, setDismissed] = useState(false);

  if (!hasActiveSession || dismissed) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
  };

  const handleEndSession = () => {
    clearSessionState();
    setDismissed(true);
  };

  return (
    <div className="fixed top-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80">
      <div className="bg-breath text-white p-4 rounded-lg shadow-lg border border-breath/20">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <Wind size={20} className="text-white flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Breathing session paused</p>
              <p className="text-xs text-white/80 mt-1">
                You have an active breathing session waiting to be resumed.
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-white/60 hover:text-white flex-shrink-0"
          >
            <X size={16} />
          </button>
        </div>
        <div className="flex gap-2 mt-3">
          <Link to="/breathe" className="flex-1">
            <Button size="sm" variant="secondary" className="w-full text-xs">
              Resume
            </Button>
          </Link>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleEndSession}
            className="text-xs border-white/20 text-white hover:bg-white/10"
          >
            End Session
          </Button>
        </div>
      </div>
    </div>
  );
};