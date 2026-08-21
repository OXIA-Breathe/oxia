import { useState } from "react";
import { Lock, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import PremiumModal from "@/components/premium/PremiumModal";

interface InsufficientDataOverlayProps {
  daysCount: number;
  minDays?: number;
  type?: "data" | "premium" | "disabled";
}

const InsufficientDataOverlay = ({ daysCount, minDays = 3, type = "data" }: InsufficientDataOverlayProps) => {
  const [premiumOpen, setPremiumOpen] = useState(false);

  const getMessage = () => {
    switch (type) {
      case "premium":
        return {
          title: "Premium Feature",
          description: "Upgrade to premium to unlock emotional insights and track your progress over time.",
        };
      case "disabled":
        return {
          title: "Tracking Disabled",
          description: "Enable Emotional State Tracking in Settings to start collecting data for insights.",
        };
      case "data":
      default:
        return {
          title: "No Data Yet",
          description: "Start tracking your emotions during exercises to see insights here.",
        };
    }
  };

  const { title, description } = getMessage();
  const isPremiumUpsell = type === "premium";

  return (
    <>
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
        <div className="text-center p-6 max-w-xs">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
            {isPremiumUpsell ? (
              <Crown className="h-5 w-5 text-amber-500" />
            ) : (
              <Lock className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <h4 className="font-semibold text-foreground mb-1">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
          {isPremiumUpsell && (
            <Button
              className="mt-4 bg-amber-500 hover:bg-amber-500/90 text-white"
              onClick={() => setPremiumOpen(true)}
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Premium
            </Button>
          )}
        </div>
      </div>

      {isPremiumUpsell && (
        <PremiumModal
          open={premiumOpen}
          onOpenChange={setPremiumOpen}
          highlight="Unlock mood, stress and exercise effectiveness insights."
        />
      )}
    </>
  );
};

export default InsufficientDataOverlay;
