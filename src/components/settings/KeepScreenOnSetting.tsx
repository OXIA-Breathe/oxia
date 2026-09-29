import { useState } from "react";
import { Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { getKeepScreenOn, setKeepScreenOn } from "@/lib/keepAwake";

const KeepScreenOnSetting = () => {
  const [on, setOn] = useState(getKeepScreenOn);

  const toggle = (value: boolean) => {
    setOn(value);
    setKeepScreenOn(value);
  };

  return (
    <div className="space-y-2 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sun className="h-4 w-4" />
          <Label htmlFor="keep-screen-on" className="text-base font-medium">
            Keep screen on during exercises
          </Label>
        </div>
        <Switch id="keep-screen-on" checked={on} onCheckedChange={toggle} />
      </div>
      <p className="text-sm text-muted-foreground">
        Your screen stays bright while an exercise is running, and dims normally again afterwards.
      </p>
    </div>
  );
};

export default KeepScreenOnSetting;
