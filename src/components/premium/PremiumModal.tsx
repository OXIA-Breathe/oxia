import { useEffect, useState } from "react";
import { Crown, Sparkles, FileText, BarChart3, HeartPulse, Loader2, RefreshCw, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  purchaseSubscription,
  restorePurchases,
  PurchaseVerificationError,
  SubscriptionPlan,
} from "@/lib/purchases";
import { useToast } from "@/hooks/use-toast";
import { CANCEL_TOAST, isPurchaseCancellation, purchaseErrorToast } from "@/lib/purchaseMessages";
import { useLocalizedPrices } from "@/hooks/useLocalizedPrices";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";

interface PremiumModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Optional context line, e.g. "Unlock mood insights". */
  highlight?: string;
  /** Called after a successful purchase. */
  onPurchased?: () => void;
}

const BENEFITS = [
  {
    icon: Sparkles,
    label: "AI Wellness Journal",
    description: "A personal journal that looks over your last 30 days of breathing and check-ins, and writes you a gentle reflection — with one small thing worth trying.",
  },
  {
    icon: HeartPulse,
    label: "Stress & mood tracking",
    description: "A quick check-in before and after each session, so you can see how your mood and stress actually shift when you breathe.",
  },
  {
    icon: BarChart3,
    label: "What works for you",
    description: "Not generic advice — a ranking of which technique truly calms you: box breathing, 4-7-8, or something else entirely.",
  },
  {
    icon: FileText,
    label: "Monthly wellness report",
    description: "A downloadable summary of your month. Keep it for yourself, or bring it along to a therapist, physician or coach.",
  },
];

interface PurchaseError {
  plan: SubscriptionPlan;
  message: string;
  cancelled: boolean;
  /** Server trace ID, shown so testers can quote it in a bug report. */
  traceId?: string | null;
  code?: string | null;
}

const isCancellation = isPurchaseCancellation;

const PremiumModal = ({ open, onOpenChange, highlight, onPurchased }: PremiumModalProps) => {
  const { toast } = useToast();
  const { refresh } = usePremiumStatus();
  const prices = useLocalizedPrices();
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
      onPurchased?.();
    } catch (error: any) {
      console.error("Purchase error:", error);
      const cancelled = isCancellation(error);
      if (cancelled) {
        // A cancel is a normal choice, not an error.
        toast(CANCEL_TOAST);
        return;
      }
      const verification = error instanceof PurchaseVerificationError ? error : null;
      const t = purchaseErrorToast(error);
      setPurchaseError({
        plan,
        cancelled: false,
        traceId: verification?.traceId ?? null,
        code: verification?.code ?? null,
        message: t.description,
      });
      toast(t);
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
      const linkedElsewhere = error?.code === "linked_to_other_account";
      const msg = linkedElsewhere
        ? "This phone's subscription belongs to a different OXIA account. Sign in with that account to use Premium."
        : "Could not restore purchases. Please try again.";
      setRestoreError(msg);
      toast({
        title: linkedElsewhere ? "Linked to another account" : "Restore failed",
        description: msg,
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
        <div className="flex flex-col items-center text-center pt-1">
          <div className="relative h-24 w-24 mb-3 animate-scale-in">
            <div className="absolute inset-0 rounded-full bg-amber-500/10 animate-pulse" />
            <div className="absolute inset-2 rounded-full border-4 border-amber-500 flex items-center justify-center bg-card">
              <Crown className="h-10 w-10 text-amber-500" />
            </div>
          </div>
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-3xl font-bold text-card-foreground">
              OXIA Premium
            </DialogTitle>
            <DialogDescription>
              {highlight ||
                "You've already built the habit — now see what it's doing for you. Notice how your mood lifts and your stress settles, session by session."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="rounded-xl bg-secondary/60 p-4 space-y-3">
          {BENEFITS.map(({ icon: Icon, label, description }) => (
            <div key={label} className="flex items-start gap-3 text-left">
              <div className="mt-0.5 rounded-full bg-amber-500/10 p-1.5 shrink-0">
                <Icon className="h-3.5 w-3.5 text-amber-500" />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-card-foreground">{label}</p>
                <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
              </div>
            </div>
          ))}
        </div>

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
                {purchaseError.traceId && (
                  <p className="font-mono text-[11px] text-muted-foreground break-all">
                    Ref: {purchaseError.traceId}
                    {purchaseError.code ? ` · ${purchaseError.code}` : ""}
                  </p>
                )}
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
            {prices.monthly}/mo
          </Button>
          <Button
            className="min-h-[44px] bg-amber-500 hover:bg-amber-500/90 text-white"
            onClick={() => handlePurchase("yearly")}
            disabled={busy}
          >
            {purchasingPlan === "yearly" ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            {prices.yearly}/yr
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
          Start with 7 days free — then {prices.monthly}/month or {prices.yearly}/year (25% off). Billed through Google Play or the App Store, cancel anytime.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumModal;
