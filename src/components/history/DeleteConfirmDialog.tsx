
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
import { BreathSession } from "@/types/breath";

interface DeleteConfirmDialogProps {
  session: BreathSession | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (session: BreathSession) => void;
}

const DeleteConfirmDialog = ({ session, open, onOpenChange, onConfirm }: DeleteConfirmDialogProps) => {
  const handleConfirm = () => {
    if (session) {
      onConfirm(session);
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Session</AlertDialogTitle>
          <AlertDialogDescription>
            Are you really sure about deleting this session? This action cannot be undone and will affect your breathing statistics and achievements.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>No</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} className="bg-red-600 hover:bg-red-700">
            Yes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmDialog;
