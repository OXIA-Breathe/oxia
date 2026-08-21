import { useState } from "react";
import { Crown, Sparkles, FileText, Calendar, Loader2, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";
import { purchaseSubscription, restorePurchases, SubscriptionPlan } from "@/lib/purchases";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const SubscriptionSettings = () => {
  const {
    isPremium,
    isSubscribed,
    isTrialActive,
    trialEndsAt,
    subscriptionPlan,
    subscriptionExpiresAt,
    isLoading,
  } = usePremiumStatus();
  const { toast } = useToast();
  const [purchasingPlan, setPurchasingPlan] = useState<SubscriptionPlan | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);

  if (isLoading) {
    return (
      <Card className="border-none shadow-md bg-card">
        <CardContent className="p-6 flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading subscription…</span>
        </CardContent>
      </Card>
    );
  }

  const planLabel = subscriptionPlan === "yearly" ? "Yearly" : subscriptionPlan === "monthly" ? "Monthly" : null;

  const formatDate = (iso: string | null) => {
    if (!iso) return null;
    try {
      return format(new Date(iso), "d MMMM yyyy");
    } catch {
      return iso;
    }
  };

  return (
    <Card className={`border-none shadow-md ${isPremium ? "bg-gradient-to-br from-amber-500/10 to-transparent" : "bg-card"}`}>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-card-foreground flex items-center gap-2">
              {isPremium ? (
                <>
                  <Crown className="h-4 w-4 text-amber-500" />
                  OXIA Premium
                </>
              ) : (
                "Free Plan"
              )}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isPremium
                ? "You have access to all premium features."
                : "Unlock emotion tracking, AI insights, and wellness reports."}
            </p>
          </div>
          {isPremium && (
            <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-500">
              Active
            </span>
          )}
        </div>

        {isPremium && (
          <div className="space-y-2 text-sm">
            {isTrialActive && trialEndsAt && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>Trial active until {formatDate(trialEndsAt)}</span>
              </div>
            )}
            {isSubscribed && (
              <>
                {planLabel && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{planLabel} subscription</span>
                  </div>
                )}
                {subscriptionExpiresAt && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="h-4 w-4 text-primary" />
                    <span>Renews on {formatDate(subscriptionExpiresAt)}</span>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {!isPremium && (
          <div className="space-y-3">
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                AI Wellness Journal
              </li>
              <li className="flex items-center gap-2">
                <Crown className="h-3.5 w-3.5 text-amber-500" />
                Emotion & stress insights
              </li>
              <li className="flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-amber-500" />
                Monthly PDF wellness reports
              </li>
            </ul>
            <Button className="w-full bg-amber-500 hover:bg-amber-500/90 text-white">
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Premium
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              €2.99/month or €26.99/year (25% off) with a 7-day free trial.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionSettings;