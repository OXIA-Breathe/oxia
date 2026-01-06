import { Lock } from "lucide-react";

interface InsufficientDataOverlayProps {
  daysCount: number;
  minDays?: number;
  type?: "data" | "premium" | "disabled";
}

const InsufficientDataOverlay = ({ daysCount, minDays = 3, type = "data" }: InsufficientDataOverlayProps) => {
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
          title: "More Data Needed",
          description: `We need at least ${minDays} days of tracking data to show meaningful insights. You have ${daysCount} day${daysCount !== 1 ? 's' : ''} so far.`,
        };
    }
  };

  const { title, description } = getMessage();

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
      <div className="text-center p-6 max-w-xs">
        <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
          <Lock className="h-5 w-5 text-muted-foreground" />
        </div>
        <h4 className="font-semibold text-foreground mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default InsufficientDataOverlay;
