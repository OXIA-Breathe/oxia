import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Crown, RefreshCw, Check, X, Loader2 } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";
import PremiumModal from "@/components/premium/PremiumModal";

/**
 * Internal debug view for the subscription/premium gating.
 * Not linked from the main navigation — reachable via /premium-debug
 * and the "Premium debug" link at the bottom of Settings.
 */

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start justify-between gap-3 py-1.5 text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-mono text-right text-card-foreground break-all">{value}</span>
  </div>
);

const GateRow = ({
  label,
  path,
  unlocked,
}: {
  label: string;
  path?: string;
  unlocked: boolean;
}) => (
  <div className="flex items-center justify-between gap-3 py-1.5 text-sm">
    <div className="min-w-0">
      {path ? (
        <Link to={path} className="text-card-foreground underline underline-offset-2">
          {label}
        </Link>
      ) : (
        <span className="text-card-foreground">{label}</span>
      )}
      {path && <span className="ml-2 font-mono text-xs text-muted-foreground">{path}</span>}
    </div>
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
        unlocked ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
      }`}
    >
      {unlocked ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
      {unlocked ? "unlocked" : "gated"}
    </span>
  </div>
);

const PremiumDebugPage = () => {
  const { user } = useAuth();
  const status = usePremiumStatus();
  const [modalOpen, setModalOpen] = useState(false);

  // Internal tool only — never reachable in production builds.
  if (!import.meta.env.DEV) {
    return <Navigate to="/" replace />;
  }

  const fmt = (value: unknown) =>
    value === null || value === undefined || value === "" ? "—" : String(value);

  return (
    <MainLayout>
      <div className="space-y-4 pb-24">
        <div className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-amber-500" />
          <h1 className="text-xl font-semibold text-foreground">Premium debug</h1>
        </div>

        <Card className="border-none shadow-md bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">usePremiumStatus()</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            <Row label="user.id" value={fmt(user?.id)} />
            <Row label="isLoading" value={String(status.isLoading)} />
            <Row label="isPremium" value={String(status.isPremium)} />
            <Row label="is_subscribed" value={String(status.isSubscribed)} />
            <Row label="subscription_plan" value={fmt(status.subscriptionPlan)} />
            <Row label="subscription_expires_at" value={fmt(status.subscriptionExpiresAt)} />
            <Row label="isTrialActive" value={String(status.isTrialActive)} />
            <Row label="trial_started_at" value={fmt(status.trialStartedAt)} />
            <Row label="trial_ends_at" value={fmt(status.trialEndsAt)} />
            <Row label="emotion_tracking_enabled" value={String(status.isEmotionTrackingEnabled)} />
            <Row
              label="last checked"
              value={status.lastCheckedAt ? new Date(status.lastCheckedAt).toLocaleTimeString() : "—"}
            />
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Gating across premium surfaces</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            <GateRow label="AI Wellness Journal" path="/journal" unlocked={status.isPremium} />
            <GateRow label="Mood insights card" path="/progress" unlocked={status.isPremium} />
            <GateRow label="Stress insights card" path="/progress" unlocked={status.isPremium} />
            <GateRow label="Exercise effectiveness card" path="/progress" unlocked={status.isPremium} />
            <GateRow label="Monthly wellness PDF button" path="/progress" unlocked={status.isPremium} />
            <GateRow
              label="Emotion tracking toggle"
              path="/settings"
              unlocked={status.isPremium}
            />
            <GateRow
              label="Emotion check-in during sessions"
              unlocked={status.isPremium && status.isEmotionTrackingEnabled}
            />
          </CardContent>
        </Card>

        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            className="min-h-[44px]"
            onClick={() => status.refresh()}
            disabled={status.isRefreshing}
          >
            {status.isRefreshing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Re-check premium status now
          </Button>
          <Button
            className="min-h-[44px] bg-amber-500 hover:bg-amber-500/90 text-white"
            onClick={() => setModalOpen(true)}
          >
            <Crown className="h-4 w-4 mr-2" />
            Open PremiumModal
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Status auto-refreshes every 5 minutes and on app focus, so a delayed store webhook
          resolves itself without a restart.
        </p>

        <PremiumModal open={modalOpen} onOpenChange={setModalOpen} highlight="Debug purchase flow" />
      </div>
    </MainLayout>
  );
};

export default PremiumDebugPage;
