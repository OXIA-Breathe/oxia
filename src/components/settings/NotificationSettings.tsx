
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface NotificationSettingsType {
  enabled: boolean;
  frequency: number;
}

const NotificationSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<NotificationSettingsType>({
    enabled: false,
    frequency: 3,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotificationSettings();
    }
  }, [user]);

  const fetchNotificationSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("notification_settings")
        .select("*")
        .eq("user_id", user?.id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setSettings({
          enabled: data.enabled,
          frequency: data.frequency,
        });
      }
    } catch (error) {
      console.error("Error fetching notification settings:", error);
      toast({
        title: "Error",
        description: "Could not load your notification settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!user) return;
    
    try {
      setSaving(true);
      const { error } = await supabase
        .from("notification_settings")
        .update({
          enabled: settings.enabled,
          frequency: settings.frequency,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Settings saved",
        description: "Your notification preferences have been updated",
      });
    } catch (error) {
      console.error("Error updating notification settings:", error);
      toast({
        title: "Error",
        description: "Could not save your notification settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="max-w-md w-full mt-6">
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Loading your notification preferences...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="max-w-md w-full mt-6">
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>
          Configure how often you'd like to receive breathing reminders
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="notifications-enabled" className="flex flex-col space-y-1">
            <span>Enable Notifications</span>
            <span className="font-normal text-sm text-muted-foreground">
              Receive reminders to take breathing breaks
            </span>
          </Label>
          <Switch
            id="notifications-enabled"
            checked={settings.enabled}
            onCheckedChange={(checked) => setSettings({ ...settings, enabled: checked })}
          />
        </div>

        {settings.enabled && (
          <div className="space-y-2">
            <Label>
              Frequency: {settings.frequency} {settings.frequency === 1 ? "reminder" : "reminders"} per day
            </Label>
            <Slider
              min={1}
              max={10}
              step={1}
              value={[settings.frequency]}
              onValueChange={(value) => setSettings({ ...settings, frequency: value[0] })}
              className="py-4"
            />
          </div>
        )}

        <Button 
          onClick={handleSaveSettings} 
          disabled={saving}
          className="w-full"
        >
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
