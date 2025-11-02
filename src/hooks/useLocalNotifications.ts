import { useEffect, useState } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NotificationSchedule {
  id: string;
  title: string;
  time: string;
  days: number[];
}

export const useLocalNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [hasPermission, setHasPermission] = useState(false);

  // Request notification permissions
  const requestPermissions = async () => {
    try {
      const result = await LocalNotifications.requestPermissions();
      setHasPermission(result.display === 'granted');
      
      if (result.display === 'granted') {
        toast({
          title: "Notifications Enabled",
          description: "You'll receive reminders at your scheduled times",
        });
      }
      
      return result.display === 'granted';
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  };

  // Check if notifications are supported
  const checkSupport = async () => {
    try {
      const result = await LocalNotifications.checkPermissions();
      setHasPermission(result.display === 'granted');
    } catch (error) {
      console.error('Local notifications not supported:', error);
    }
  };

  // Schedule notifications based on user's schedules
  const scheduleNotifications = async (schedules: NotificationSchedule[]) => {
    if (!hasPermission) {
      const granted = await requestPermissions();
      if (!granted) return;
    }

    try {
      // Cancel existing notifications
      await LocalNotifications.cancel({ notifications: [] });

      const notifications = [];
      const now = new Date();

      for (const schedule of schedules) {
        const [hours, minutes] = schedule.time.split(':').map(Number);

        // Schedule for each day
        for (const day of schedule.days) {
          const scheduledDate = new Date();
          scheduledDate.setHours(hours, minutes, 0, 0);

          // Adjust to the correct day of week
          const currentDay = scheduledDate.getDay();
          const daysUntilScheduled = (day - currentDay + 7) % 7;
          scheduledDate.setDate(scheduledDate.getDate() + daysUntilScheduled);

          // If time has passed today, schedule for next week
          if (scheduledDate <= now && daysUntilScheduled === 0) {
            scheduledDate.setDate(scheduledDate.getDate() + 7);
          }

          notifications.push({
            id: parseInt(`${schedule.id.slice(0, 8)}${day}`),
            title: schedule.title,
            body: "Time for your breathing exercise! 🌬️",
            schedule: {
              at: scheduledDate,
              repeats: true,
              every: 'week',
            },
          });
        }
      }

      if (notifications.length > 0) {
        await LocalNotifications.schedule({ notifications });
        console.log(`Scheduled ${notifications.length} notifications`);
      }
    } catch (error) {
      console.error('Error scheduling notifications:', error);
      toast({
        title: "Notification Error",
        description: "Failed to schedule notifications",
        variant: "destructive",
      });
    }
  };

  // Sync notifications when schedules change
  const syncNotifications = async () => {
    if (!user) return;

    try {
      // Check if notifications are enabled
      const { data: settings } = await supabase
        .from('notification_settings')
        .select('enabled')
        .eq('user_id', user.id)
        .single();

      if (!settings?.enabled) {
        await LocalNotifications.cancel({ notifications: [] });
        return;
      }

      // Get user's schedules
      const { data: schedules } = await supabase
        .from('notification_schedules')
        .select('*')
        .eq('user_id', user.id);

      if (schedules && schedules.length > 0) {
        await scheduleNotifications(schedules as NotificationSchedule[]);
      }
    } catch (error) {
      console.error('Error syncing notifications:', error);
    }
  };

  // Initialize
  useEffect(() => {
    checkSupport();
  }, []);

  return {
    hasPermission,
    requestPermissions,
    scheduleNotifications,
    syncNotifications,
  };
};
