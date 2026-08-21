import { useState } from "react";
import { Crown, Sparkles, FileText, BarChart3, Loader2, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { purchaseSubscription, restorePurchases, SubscriptionPlan } from "@/lib/purchases";
import { useToast } from "@/hooks/use-toast";

interface PremiumModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Optional context line, e.g. "Unlock mood insights". */
  highlight?: string;
}

const BENEFITS = [
  { icon: Sparkles, label: "AI Wellness Journal" },
  { icon: BarChart3, label: "Mood, stress & effectiveness insights" },
  { icon: FileText, label: "Monthly PDF wellness reports" },
];

const PremiumModal = ({ open, onOpenChange, highlight }: PremiumModalProps) => {
  const { toast } = useToast();
  const [purchasingPlan, setPurchasingPlan] = useState<SubscriptionPlan | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);

  const handlePurchase = async (plan: SubscriptionPlan) => {
    setPurchasingPlan(plan);
    try {
      await purchaseSubscription(plan);
      toast({
        title: "Purchase started",
        description: "Complete the checkout in the store dialog.",
      });
      onOpenChange(false);
    } catch (error: any) {
      console.error("Purchase error:", error);
      toast({
        title: "Purchase unavailable",
        description: error?.message || "Could not start purchase. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPurchasingPlan(null);
    }
  };

  const handleRestore = async () => {
    setIsRestoring(true);
    try {
      await restorePurchases();
      toast({
        title: "Restored",
        description: "Any previous purchases have been restored.",
      });
    } catch (error) {
      console.error("Restore error:", error);
      toast({
        title: "Restore failed",
        description: "Could not restore purchases. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-2xl bg-white/95 backdrop-blur">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-card-foreground">
            <Crown className="h-5 w-5 text-amber-500" />
            OXIA Premium
          </DialogTitle>
          <DialogDescription>
            {highlight || "Unlock deeper insight into how your practice changes how you feel."}
          </DialogDescription>
        </DialogHeader>

        <ul className="space-y-2 text-sm">
          {BENEFITS.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2 text-muted-foreground">
              <Icon className="h-4 w-4 text-amber-500 shrink-0" />
              <span>{label}</span>
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button
            className="min-h-[44px] bg-amber-500 hover:bg-amber-500/90 text-white"
            onClick={() => handlePurchase("monthly")}
            disabled={purchasingPlan !== null}
          >
            {purchasingPlan === "monthly" ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            €2.99/mo
          </Button>
          <Button
            className="min-h-[44px] bg-amber-500 hover:bg-amber-500/90 text-white"
            onClick={() => handlePurchase("yearly")}
            disabled={purchasingPlan !== null}
          >
            {purchasingPlan === "yearly" ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            €26.99/yr
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="w-full min-h-[44px] text-muted-foreground hover:text-foreground"
          onClick={handleRestore}
          disabled={isRestoring}
        >
          {isRestoring ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Restore purchases
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          7-day free trial, then €2.99/month or €26.99/year (25% off). Billed through Google Play or the App Store, cancel anytime.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumModal;
