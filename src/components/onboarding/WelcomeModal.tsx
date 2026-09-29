import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Check, Crown } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { PREMIUM_INTENT_KEY, WELCOME_PENDING_KEY } from "@/lib/authRedirect";
import { ACCOUNT_BENEFITS, PREMIUM_BENEFITS } from "@/constants/planBenefits";
import PremiumModal from "@/components/premium/PremiumModal";

/** Shown once, right after a new user confirms their email. */
const WelcomeModal = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [wantsPremium, setWantsPremium] = useState(false);

  useEffect(() => {
    if (!user || location.pathname === "/verify-email") return;
    if (localStorage.getItem(WELCOME_PENDING_KEY) === user.id) {
      localStorage.removeItem(WELCOME_PENDING_KEY);
      setWantsPremium(localStorage.getItem(PREMIUM_INTENT_KEY) === "premium");
      localStorage.removeItem(PREMIUM_INTENT_KEY);
      setOpen(true);
    }
  }, [user, location.pathname]);

  const name = (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0];

  const openPremium = () => {
    setOpen(false);
    setPremiumOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm rounded-2xl bg-white/95 backdrop-blur max-h-[85vh] min-h-0 overflow-y-auto">
          <div className="flex flex-col items-center text-center">
            <img
              src="/lovable-uploads/6d9cc0f0-addd-45b1-abab-238892b91dbf.png"
              alt="OXIA"
              className="h-10 w-auto object-contain mb-3"
            />
            <DialogTitle className="text-2xl font-bold text-card-foreground">
              Welcome{name ? `, ${name}` : ""}!
            </DialogTitle>
            <DialogDescription className="mt-1">
              Enjoy using the app and breathe well.
            </DialogDescription>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-card-foreground">With your account you can:</p>
            <ul className="space-y-1.5">
              {ACCOUNT_BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div
            className={`space-y-2 rounded-xl p-3 border ${
              wantsPremium ? "border-amber-500/60 bg-amber-500/10" : "border-border/60 bg-amber-500/5"
            }`}
          >
            <p className="text-sm font-semibold text-card-foreground flex items-center gap-2">
              <Crown className="h-4 w-4 text-amber-500" />
              Go further with Premium
            </p>
            <ul className="space-y-1.5">
              {PREMIUM_BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 mt-0.5 text-amber-500 shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              className="w-full min-h-[44px] rounded-full bg-amber-500 hover:bg-amber-500/90 text-white font-semibold"
              onClick={openPremium}
            >
              <Crown className="h-4 w-4 mr-2" />
              Try Premium – 7 days free
            </Button>
            <Button variant="ghost" className="w-full min-h-[44px]" onClick={() => setOpen(false)}>
              Skip for today
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <PremiumModal open={premiumOpen} onOpenChange={setPremiumOpen} />
    </>
  );
};

export default WelcomeModal;
