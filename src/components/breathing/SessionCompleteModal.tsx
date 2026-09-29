import { useState } from "react";
import { Trophy } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  exerciseTitle: string;
  repetitions: number;
  durationSeconds: number;
  saving?: boolean;
  onSave: () => void;
  onDiscard: () => void;
}

const formatDuration = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m} min ${String(sec).padStart(2, "0")} s`;
};

const SessionCompleteModal = ({ open, exerciseTitle, repetitions, durationSeconds, saving, onSave, onDiscard }: Props) => {
  const [confirm, setConfirm] = useState<null | "delete" | "restart">(null);

  return (
    <>
      <Dialog open={open} onOpenChange={() => { /* choose an action */ }}>
        <DialogContent
          className="max-w-sm rounded-2xl bg-white/95 backdrop-blur [&>button]:hidden"
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <div className="flex flex-col items-center text-center pt-2">
            <div className="relative h-24 w-24 mb-4 animate-scale-in">
              <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
              <div className="absolute inset-2 rounded-full border-4 border-primary flex items-center justify-center bg-card">
                <Trophy className="h-10 w-10 text-primary" />
              </div>
            </div>
            <DialogTitle className="text-3xl font-bold text-card-foreground">Well done!</DialogTitle>
            <DialogDescription className="mt-2 text-sm">
              Take a breath and relax, regain your normal breathing speed.
            </DialogDescription>
          </div>

          <div className="rounded-xl bg-secondary/60 p-4 space-y-2 text-sm">
            <p className="font-semibold text-card-foreground">Here are your results</p>
            <div className="flex justify-between"><span className="text-muted-foreground">Exercise</span><span className="font-medium text-card-foreground text-right">{exerciseTitle}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Repetitions</span><span className="font-medium text-card-foreground">{repetitions}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Total time</span><span className="font-medium text-card-foreground">{formatDuration(durationSeconds)}</span></div>
          </div>

          <div className="flex flex-col gap-2">
            <Button className="w-full min-h-[44px] rounded-full font-semibold" onClick={onSave} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="min-h-[44px] rounded-full" onClick={() => setConfirm("restart")} disabled={saving}>
                Restart
              </Button>
              <Button variant="outline" className="min-h-[44px] rounded-full" onClick={() => setConfirm("delete")} disabled={saving}>
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirm !== null} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent className="max-w-sm rounded-2xl bg-white/95 backdrop-blur">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {confirm === "restart"
                ? "This session won't be saved, and you'll start the exercise again."
                : "This session won't be saved."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setConfirm(null);
                onDiscard();
              }}
            >
              Yes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SessionCompleteModal;
