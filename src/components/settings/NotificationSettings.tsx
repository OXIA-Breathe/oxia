
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLocalNotifications } from "@/hooks/useLocalNotifications";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import NotificationCard from "./NotificationCard";
import AddNotificationCard from "./AddNotificationCard";
import NotificationModal from "./NotificationModal";

interface NotificationSettingsType {
  enabled: boolean;
  frequency: number;
}

interface NotificationSchedule {
  id: string;
  title: string;
  time: string;
  days: number[];
}

const NotificationSettings = () => {
  const { user } = useAuth();
  const { hasPermission, requestPermissions, syncNotifications } = useLocalNotifications();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<NotificationSettingsType>({
    enabled: false,
    frequency: 3,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState<NotificationSchedule | undefined>();

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

  // Query to fetch notification schedules
  const { data: schedules, isLoading: schedulesLoading } = useQuery({
    queryKey: ["notificationSchedules", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("notification_schedules")
        .select("*")
        .eq("user_id", user.id)
        .order("time");

      if (error) {
        console.error("Error fetching notification schedules:", error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!user && settings.enabled
  });

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

  // Mutation to save/update notification schedule
  const saveScheduleMutation = useMutation({
    mutationFn: async (schedule: Omit<NotificationSchedule, 'id'> & { id?: string }) => {
      if (!user) throw new Error("User not authenticated");
      
      if (schedule.id) {
        // Update existing
        const { error } = await supabase
          .from("notification_schedules")
          .update({
            title: schedule.title,
            time: schedule.time,
            days: schedule.days,
            updated_at: new Date().toISOString(),
          })
          .eq("id", schedule.id);
        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase
          .from("notification_schedules")
          .insert({
            user_id: user.id,
            title: schedule.title,
            time: schedule.time,
            days: schedule.days,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificationSchedules", user?.id] });
      toast({
        title: "Notification saved",
        description: "Your notification schedule has been updated",
      });
    },
    onError: (error) => {
      console.error("Error saving notification schedule:", error);
      toast({
        title: "Error",
        description: "Could not save your notification schedule",
        variant: "destructive",
      });
    }
  });

  // Mutation to delete notification schedule
  const deleteScheduleMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("notification_schedules")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificationSchedules", user?.id] });
      toast({
        title: "Notification deleted",
        description: "Your notification schedule has been removed",
      });
    },
    onError: (error) => {
      console.error("Error deleting notification schedule:", error);
      toast({
        title: "Error",
        description: "Could not delete your notification schedule",
        variant: "destructive",
      });
    }
  });

  const handleSaveSettings = async () => {
    if (!user) return;

    try {
      await saveSettingsMutation.mutateAsync(settings);
      
      // Request notification permissions if enabling notifications
      if (settings.enabled && !hasPermission) {
        await requestPermissions();
      }
      
      // Sync notifications with schedules
      await syncNotifications();
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  const handleEditNotification = (notification: NotificationSchedule) => {
    setEditingNotification(notification);
    setIsModalOpen(true);
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      await deleteScheduleMutation.mutateAsync(id);
      
      // Sync notifications after deleting
      await syncNotifications();
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleSaveNotification = async (notification: Omit<NotificationSchedule, 'id'> & { id?: string }) => {
    try {
      await saveScheduleMutation.mutateAsync(notification);
      
      // Sync notifications after saving
      await syncNotifications();
      
      setIsModalOpen(false);
      setEditingNotification(undefined);
    } catch (error) {
      console.error("Error saving notification:", error);
    }
  };

  const handleAddNotification = () => {
    setEditingNotification(undefined);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <p className="text-center text-gray-800">Loading your notification preferences...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <p className="text-red-500 text-sm">
          Failed to load your notification settings. Please try refreshing the page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
          <div className="space-y-4">
            {schedulesLoading ? (
              <p className="text-center text-gray-600">Loading your notification schedules...</p>
            ) : (
              <>
                {schedules && schedules.length > 0 && (
                  <div className="space-y-3">
                    {schedules.map((schedule) => (
                      <NotificationCard
                        key={schedule.id}
                        notification={schedule}
                        onEdit={handleEditNotification}
                        onDelete={handleDeleteNotification}
                      />
                    ))}
                  </div>
                )}
                
                <AddNotificationCard onClick={handleAddNotification} />
              </>
            )}
          </div>
        )}

        <Button 
          onClick={handleSaveSettings} 
          disabled={saveSettingsMutation.isPending}
          className="w-full"
        >
          {saveSettingsMutation.isPending ? "Saving..." : "Save Settings"}
        </Button>

        <NotificationModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          notification={editingNotification}
          onSave={handleSaveNotification}
        />
    </div>
  );
};

export default NotificationSettings;
