import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Cloud, Smartphone, Watch } from "lucide-react";
import {
  HEALTH_TRACKERS,
  METRIC_LABELS,
  type HealthTrackerDefinition,
  type HealthTrackerId,
} from "@/types/healthTracker";

const platformIcon = (tracker: HealthTrackerDefinition) => {
  if (tracker.platforms.includes("cloud")) return Cloud;
  if (tracker.id === "manual") return Smartphone;
  return Watch;
};

interface TrackerSelectorProps {
  value: HealthTrackerId;
  onChange: (id: HealthTrackerId) => void;
}

const TrackerSelector = ({ value, onChange }: TrackerSelectorProps) => {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Choose a tracker</CardTitle>
        <CardDescription className="text-xs">
          Pick the source you want to configure. Planned sources are already supported by the data
          schema.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {HEALTH_TRACKERS.map((tracker) => {
          const Icon = platformIcon(tracker);
          const selected = tracker.id === value;
          return (
            <button
              key={tracker.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(tracker.id)}
              className={`w-full min-h-[44px] text-left rounded-xl border p-3 transition-colors ${
                selected
                  ? "border-primary bg-primary/10"
                  : "border-border bg-background hover:bg-muted/60"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 shrink-0 rounded-lg flex items-center justify-center ${
                    selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-foreground">{tracker.name}</span>
                    {tracker.status === "planned" && (
                      <Badge variant="secondary" className="text-[10px]">
                        Planned
                      </Badge>
                    )}
                    {tracker.stressSource === "native" && (
                      <Badge variant="outline" className="text-[10px]">
                        Native stress score
                      </Badge>
                    )}
                    {selected && <Check className="w-4 h-4 text-primary ml-auto" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{tracker.description}</p>
                  {tracker.metrics.length > 0 && (
                    <p className="text-[11px] text-muted-foreground/80 mt-1">
                      Reads: {tracker.metrics.map((m) => METRIC_LABELS[m]).join(" · ")}
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default TrackerSelector;
