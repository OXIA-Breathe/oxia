import { useState } from "react";
import { Crown, Sparkles, FileText, Calendar, Loader2, RefreshCw, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";
import {
  purchaseSubscription,
  restorePurchases,
  openSubscriptionManagement,
  SubscriptionPlan,
} from "@/lib/purchases";
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
    isRefreshing,
    refresh,
  } = usePremiumStatus();
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
            <div className="grid grid-cols-2 gap-2">
              <Button
                className="bg-amber-500 hover:bg-amber-500/90 text-white"
                onClick={() => handlePurchase("monthly")}
                disabled={purchasingPlan !== null}
              >
                {purchasingPlan === "monthly" ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Crown className="h-4 w-4 mr-2" />
                )}
                €2.99/mo
              </Button>
              <Button
                className="bg-amber-500 hover:bg-amber-500/90 text-white"
                onClick={() => handlePurchase("yearly")}
                disabled={purchasingPlan !== null}
              >
                {purchasingPlan === "yearly" ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Crown className="h-4 w-4 mr-2" />
                )}
                €26.99/yr
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-muted-foreground hover:text-foreground"
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
              7-day free trial, then €2.99/month or €26.99/year (25% off).
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionSettings;