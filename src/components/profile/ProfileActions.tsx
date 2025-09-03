
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
import { LogOut, Trash2, Key } from "lucide-react";
import ChangePasswordModal from "./ChangePasswordModal";

const ProfileActions = () => {
  const { signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
