import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ACCOUNT_BENEFITS } from "@/constants/planBenefits";

interface SignUpPromptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** "limit" = all 10 free sessions used; "invite" = friendly suggestion. */
  variant?: "limit" | "invite";
}

export const SignUpPromptModal = ({ open, onOpenChange, variant = "limit" }: SignUpPromptModalProps) => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    onOpenChange(false);
    navigate("/auth");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-2xl bg-white/95 backdrop-blur">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {variant === "limit" ? "Trial Limit Reached" : "Nice first session!"}
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            {variant === "limit"
              ? "You've completed your 10 free trial sessions. Create a free account to keep breathing with unlimited access."
              : "Create a free account to keep your progress and get more out of OXIA."}
          </DialogDescription>
        </DialogHeader>
        <ul className="space-y-1.5">
          {ACCOUNT_BENEFITS.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
              <Check className="h-4 w-4 mt-0.5 text-primary shrink-0" />
              {b}
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-3 pt-2">
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
