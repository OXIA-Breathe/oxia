import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SignUpPromptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SignUpPromptModal = ({ open, onOpenChange }: SignUpPromptModalProps) => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    onOpenChange(false);
    navigate("/auth");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Trial Limit Reached</DialogTitle>
          <DialogDescription className="text-base pt-2">
            You've completed your 10 free trial sessions. Create an account to continue
            your breathing practice with unlimited access.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 pt-4">
          <Button onClick={handleSignUp} className="w-full">
            Create Free Account
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full">
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
