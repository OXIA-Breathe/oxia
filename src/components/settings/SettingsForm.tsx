
import { useState } from "react";
import { useBreath } from "@/context/BreathContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const SettingsForm = () => {
  const { settings, updateSettings } = useBreath();
  const { toast } = useToast();
  
  const [formState, setFormState] = useState({
    inhaleDuration: settings.inhaleDuration,
    exhaleDuration: settings.exhaleDuration,
    holdDuration: settings.holdDuration,
    repetitions: settings.repetitions,
  });

  const handleChange = (name: keyof typeof formState, value: number | number[]) => {
    setFormState((prev) => ({
      ...prev,
      [name]: typeof value === "number" ? value : value[0],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formState);
    toast({
      title: "Settings updated",
      description: "Your breathing exercise settings have been saved.",
    });
  };

  return (
    <Card className="max-w-md w-full">
      <CardHeader>
        <CardTitle>Breathing Settings</CardTitle>
        <CardDescription>
          Customize your breathing exercise parameters
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="inhaleDuration">
              Inhale Duration: {formState.inhaleDuration} seconds
            </Label>
            <Slider
              id="inhaleDuration"
              min={1}
              max={10}
              step={1}
              value={[formState.inhaleDuration]}
              onValueChange={(value) => handleChange("inhaleDuration", value)}
              className="py-4"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="holdDuration">
              Hold Duration: {formState.holdDuration} seconds
            </Label>
            <Slider
              id="holdDuration"
              min={0}
              max={15}
              step={1}
              value={[formState.holdDuration]}
              onValueChange={(value) => handleChange("holdDuration", value)}
              className="py-4"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="exhaleDuration">
              Exhale Duration: {formState.exhaleDuration} seconds
            </Label>
            <Slider
              id="exhaleDuration"
              min={1}
              max={10}
              step={1}
              value={[formState.exhaleDuration]}
              onValueChange={(value) => handleChange("exhaleDuration", value)}
              className="py-4"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="repetitions">
              Repetitions per session: {formState.repetitions}
            </Label>
            <Slider
              id="repetitions"
              min={1}
              max={20}
              step={1}
              value={[formState.repetitions]}
              onValueChange={(value) => handleChange("repetitions", value)}
              className="py-4"
            />
          </div>

          <Button type="submit" className="w-full">Save Settings</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SettingsForm;
