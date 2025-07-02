
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface NotificationSettingsType {
  enabled: boolean;
  frequency: number;
}

const NotificationSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<NotificationSettingsType>({
    enabled: false,
    frequency: 3,
  });

  // Query to fetch notification settings
  const { data: fetchedSettings, isLoading, error } = useQuery({
    queryKey: ["notificationSettings", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      console.log("Fetching notification settings for user:", user.id);
      
      const { data, error } = await supabase
        .from("notification_settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching notification settings:", error);
        throw error;
      }
      
      console.log("Fetched notification settings:", data);
      return data;
    },
    enabled: !!user
  });

  // Update local state when data is fetched
  useEffect(() => {
    if (fetchedSettings) {
      setSettings({
        enabled: fetchedSettings.enabled,
        frequency: fetchedSettings.frequency,
      });
    }
  }, [fetchedSettings]);

  // Mutation to save settings
  const saveSettingsMutation = useMutation({
    mutationFn: async (newSettings: NotificationSettingsType) => {
      if (!user) throw new Error("User not authenticated");
      
      console.log("Saving notification settings:", newSettings);
      
      const { error } = await supabase
        .from("notification_settings")
        .update({
          enabled: newSettings.enabled,
          frequency: newSettings.frequency,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (error) {
        console.error("Error updating notification settings:", error);
        throw error;
      }
      
      console.log("Successfully saved notification settings");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificationSettings", user?.id] });
      toast({
        title: "Settings saved",
        description: "Your notification preferences have been updated",
      });
    },
    onError: (error) => {
      console.error("Error saving notification settings:", error);
      toast({
        title: "Error",
        description: "Could not save your notification settings",
        variant: "destructive",
      });
    }
  });

  const handleSaveSettings = () => {
    saveSettingsMutation.mutate(settings);
  };

  if (isLoading) {
    return (
      <Card className="max-w-md w-full mt-6">
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Loading your notification preferences...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="max-w-md w-full mt-6">
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Error loading notification settings</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500 text-sm">
            Failed to load your notification settings. Please try refreshing the page.
          </p>
        </CardContent>
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
          disabled={saveSettingsMutation.isPending}
          className="w-full"
        >
          {saveSettingsMutation.isPending ? "Saving..." : "Save Settings"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
