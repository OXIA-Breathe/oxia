import { useEffect, useState } from "react";
import { Crown, Sparkles, FileText, BarChart3, Loader2, RefreshCw, AlertTriangle } from "lucide-react";
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
import { usePremiumStatus } from "@/hooks/usePremiumStatus";

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

interface PurchaseError {
  plan: SubscriptionPlan;
  message: string;
  cancelled: boolean;
}

const isCancellation = (error: any) => {
  const raw = `${error?.code ?? ""} ${error?.message ?? ""}`.toLowerCase();
  return raw.includes("cancel") || raw.includes("aborted") || error?.code === 6500;
};

const PremiumModal = ({ open, onOpenChange, highlight }: PremiumModalProps) => {
  const { toast } = useToast();
  const { refresh } = usePremiumStatus();
  const [purchasingPlan, setPurchasingPlan] = useState<SubscriptionPlan | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [purchaseError, setPurchaseError] = useState<PurchaseError | null>(null);
  const [restoreError, setRestoreError] = useState<string | null>(null);

  // Reset transient error state each time the modal is reopened.
  useEffect(() => {
    if (open) {
      setPurchaseError(null);
      setRestoreError(null);
    }
  }, [open]);

  const handlePurchase = async (plan: SubscriptionPlan) => {
    setPurchasingPlan(plan);
    setPurchaseError(null);
    try {
      await purchaseSubscription(plan);
      toast({
        title: "Purchase started",
        description: "Complete the checkout in the store dialog.",
      });
      await refresh();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Purchase error:", error);
      const cancelled = isCancellation(error);
      setPurchaseError({
        plan,
        cancelled,
        message: cancelled
          ? "Checkout was cancelled. You can try again or pick the other plan."
          : error?.message || "Could not start the purchase. Please try again.",
      });
      toast({
        title: cancelled ? "Purchase cancelled" : "Purchase unavailable",
        description: cancelled
          ? "Nothing was charged — you can try again any time."
          : error?.message || "Could not start purchase. Please try again.",
        variant: cancelled ? "default" : "destructive",
      });
    } finally {
      setPurchasingPlan(null);
    }
  };

  const handleRestore = async () => {
    setIsRestoring(true);
    setRestoreError(null);
    try {
      await restorePurchases();
      await refresh();
      toast({
        title: "Restored",
        description: "Any previous purchases have been restored.",
      });
    } catch (error: any) {
      console.error("Restore error:", error);
      setRestoreError(error?.message || "Could not restore purchases. Please try again.");
      toast({
        title: "Restore failed",
        description: "Could not restore purchases. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRestoring(false);
    }
  };

  const busy = purchasingPlan !== null;

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

        {purchaseError && (
          <div
            role="alert"
            aria-live="assertive"
            className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm"
          >
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-destructive" />
              <div className="space-y-2">
                <p className="text-card-foreground">{purchaseError.message}</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="min-h-[36px]"
                    onClick={() => handlePurchase(purchaseError.plan)}
                    disabled={busy}
                  >
                    <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                    Try {purchaseError.plan === "monthly" ? "monthly" : "yearly"} again
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="min-h-[36px]"
                    onClick={() => handlePurchase(purchaseError.plan === "monthly" ? "yearly" : "monthly")}
                    disabled={busy}
                  >
                    Switch to {purchaseError.plan === "monthly" ? "yearly" : "monthly"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button
            className="min-h-[44px] bg-amber-500 hover:bg-amber-500/90 text-white"
            onClick={() => handlePurchase("monthly")}
            disabled={busy}
          >
            {purchasingPlan === "monthly" ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            €2.99/mo
          </Button>
          <Button
            className="min-h-[44px] bg-amber-500 hover:bg-amber-500/90 text-white"
            onClick={() => handlePurchase("yearly")}
            disabled={busy}
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

        {restoreError && (
          <p role="alert" className="text-xs text-center text-destructive">
            {restoreError}
          </p>
        )}

        <p className="text-xs text-center text-muted-foreground">
          7-day free trial, then €2.99/month or €26.99/year (25% off). Billed through Google Play or the App Store, cancel anytime.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumModal;
