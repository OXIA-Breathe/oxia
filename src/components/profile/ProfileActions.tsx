
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, Trash2, Key, RotateCcw, ShieldAlert } from "lucide-react";
import ChangePasswordModal from "./ChangePasswordModal";

const ProfileActions = () => {
  const { signOut, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const CONFIRM_PHRASE = "DELETE";
  const canDelete = confirmText.trim().toUpperCase() === CONFIRM_PHRASE;

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      navigate("/auth");
      toast({
        title: "Logged out",
        description: "You have been successfully logged out"
      });
    } catch (error: any) {
      toast({
        title: "Error logging out",
        description: error.message || "An error occurred while logging out",
        variant: "destructive"
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const closeDeleteDialog = () => {
    if (isDeleting) return;
    setDeleteOpen(false);
    setConfirmText("");
  };

  const handleDeleteAccount = async () => {
    if (!canDelete) return;
    try {
      setIsDeleting(true);

      // Immediate acknowledgement that the server has the request.
      toast({
        title: "Request received",
        description: "We're processing your account deletion…",
      });

      const { data, error } = await supabase.functions.invoke("delete-user-account");
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast({
        title: "Account deleted",
        description: "Your account and all related data have been removed.",
      });

      setDeleteOpen(false);
      setConfirmText("");

      // Sign out and send the user back to the landing page in a signed-out state.
      await signOut();
      navigate("/", { replace: true });
    } catch (error: any) {
      toast({
        title: "Couldn't delete your account",
        description:
          error.message ||
          "Something went wrong on our side. Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResetStats = async () => {
    if (!user) return;
    
    try {
      setIsResetting(true);
      
      // Delete all user data in parallel
      await Promise.all([
        // Delete all breath sessions
        supabase
          .from("breath_sessions")
          .delete()
          .eq("user_id", user.id),
        
        // Delete all exercise completions
        supabase
          .from("user_exercise_completions")
          .delete()
          .eq("user_id", user.id),
        
        // Delete all achievements
        supabase
          .from("user_achievements")
          .delete()
          .eq("user_id", user.id),
        
        // Reset streaks to default values
        supabase
          .from("user_streaks")
          .update({
            current_login_streak: 1,
            longest_login_streak: 1,
            current_breath_streak: 0,
            longest_breath_streak: 0,
            last_login_date: new Date().toISOString().split('T')[0],
            last_breath_session_date: null
          })
          .eq("user_id", user.id),
        
        // Reset daily activity
        supabase
          .from("daily_activity")
          .delete()
          .eq("user_id", user.id)
      ]);
      
      toast({
        title: "Stats reset",
        description: "All your stats, achievements, and history have been reset"
      });
      
      // Force page refresh to clear any cached achievement data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      toast({
        title: "Error resetting stats",
        description: error.message || "An error occurred while resetting your stats",
        variant: "destructive"
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <ChangePasswordModal>
        <Button variant="outline" className="w-full justify-start gap-2 rounded-full border-border/70 bg-secondary/40 hover:bg-secondary text-foreground">
          <Key className="w-4 h-4 text-primary" />
          <span>Change Password</span>
        </Button>
      </ChangePasswordModal>

      <Button
        variant="outline"
        className="w-full justify-start gap-2 rounded-full border-border/70 bg-secondary/40 hover:bg-secondary text-foreground"
        onClick={handleLogout}
        disabled={isLoggingOut}
      >
        <LogOut className="w-4 h-4 text-primary" />
        <span>{isLoggingOut ? "Logging out..." : "Log Out"}</span>
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start gap-2 rounded-full border-border/70 bg-secondary/40 hover:bg-secondary text-foreground"
            disabled={isResetting}
          >
            <RotateCcw className="w-4 h-4 text-primary" />
            <span>{isResetting ? "Resetting..." : "Reset Stats"}</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset all statistics?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all your:
              <br />• Breathing session history
              <br />• Exercise achievements and badges
              <br />• Activity streaks
              <br />• Daily activity records
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetStats} className="bg-primary hover:bg-primary/90">
              Reset Stats
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          if (!open && isDeleting) return;
          setDeleteOpen(open);
          if (!open) setConfirmText("");
        }}
      >
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start gap-2 rounded-full border-destructive/30 bg-destructive/5 text-destructive hover:bg-destructive/10 hover:text-destructive"
            disabled={isDeleting}
            aria-haspopup="dialog"
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
            <span>{isDeleting ? "Deleting..." : "Delete Account"}</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent
          className="rounded-3xl border-border/60"
          onEscapeKeyDown={(e) => {
            if (isDeleting) e.preventDefault();
          }}
        >
          <AlertDialogHeader>
            <div
              className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-2"
              aria-hidden="true"
            >
              <ShieldAlert className="h-6 w-6" />
            </div>
            <AlertDialogTitle className="text-center text-foreground">
              Delete your OXIA account?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-muted-foreground">
              This permanently removes your profile, sessions, streaks, achievements,
              and journal reflections. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>


          <div className="space-y-2 rounded-2xl bg-destructive/5 border border-destructive/20 p-4">
            <Label htmlFor="confirm-delete" className="text-sm text-foreground">
              Type <span className="font-semibold text-destructive">{CONFIRM_PHRASE}</span> to confirm
            </Label>
            <Input
              id="confirm-delete"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={CONFIRM_PHRASE}
              autoComplete="off"
              aria-label={`Type ${CONFIRM_PHRASE} to confirm account deletion`}
              aria-required="true"
              aria-invalid={confirmText.length > 0 && !canDelete}
              className="rounded-xl bg-card min-h-11"
            />
          </div>

          <AlertDialogFooter className="gap-2 sm:gap-2">
            <AlertDialogCancel
              onClick={closeDeleteDialog}
              disabled={isDeleting}
              className="rounded-full min-h-11"
              aria-label="Cancel and keep my account"
            >
              Cancel — keep my account
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteAccount();
              }}
              disabled={!canDelete || isDeleting}
              aria-label="Permanently delete my account"
              className="rounded-full min-h-11 bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50 disabled:pointer-events-none"
            
            >
              {isDeleting ? "Deleting..." : "Delete forever"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProfileActions;
