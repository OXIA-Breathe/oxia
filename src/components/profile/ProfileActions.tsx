
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
import { LogOut, Trash2, Key, RotateCcw } from "lucide-react";
import ChangePasswordModal from "./ChangePasswordModal";

const ProfileActions = () => {
  const { signOut, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

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

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      
      // Delete user account from Supabase Auth
      // Fixed: The deleteUser method requires the user ID to be passed
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("User not found");
      
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      
      if (error) throw error;
      
      // Sign out the user after deletion
      await signOut();
      navigate("/auth");
      
      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted"
      });
    } catch (error: any) {
      toast({
        title: "Error deleting account",
        description: error.message || "An error occurred while deleting your account",
        variant: "destructive"
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
    <div className="flex flex-col sm:flex-row gap-4">
      <ChangePasswordModal>
        <Button variant="outline" className="flex items-center gap-2">
          <Key className="w-4 h-4" />
          <span>Change Password</span>
        </Button>
      </ChangePasswordModal>
      
      <Button 
        variant="outline" 
        className="flex items-center gap-2" 
        onClick={handleLogout}
        disabled={isLoggingOut}
      >
        <LogOut className="w-4 h-4" />
        <span>{isLoggingOut ? "Logging out..." : "Log Out"}</span>
      </Button>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 text-orange-600 border-orange-200 hover:bg-orange-50"
            disabled={isResetting}
          >
            <RotateCcw className="w-4 h-4" />
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
            <AlertDialogAction onClick={handleResetStats} className="bg-orange-600 hover:bg-orange-700">
              Reset Stats
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="destructive" 
            className="flex items-center gap-2"
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? "Deleting..." : "Delete Account"}</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove all your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAccount}>
              Delete Account
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProfileActions;
