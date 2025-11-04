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
      console.info('LocalNotifications.checkPermissions result:', result);
      setHasPermission(result.display === 'granted');

      // Ensure Android notification channel exists (safe no-op on other platforms)
      try {
        await (LocalNotifications as any).createChannel?.({
          id: 'oxia_reminders',
          name: 'OXIA Reminders',
          description: 'Breathing exercise reminders',
          importance: 5,
          vibration: true,
        });
        console.info('Ensured notification channel exists: oxia_reminders');
      } catch (e) {
        console.warn('Channel creation failed or unsupported (non-fatal):', e);
      }
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
      // Cancel existing notifications safely (avoid empty array error)
      try {
        const pending = await (LocalNotifications as any).getPending?.();
        if (pending?.notifications?.length) {
          await LocalNotifications.cancel({ notifications: pending.notifications });
        }
        await (LocalNotifications as any).removeAllDeliveredNotifications?.();
      } catch (e) {
        console.warn('Failed to clear existing notifications (non-fatal):', e);
      }

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

          // Generate a valid numeric ID from UUID
          // Take first 8 chars of UUID, convert to numeric hash, combine with day
          const hashCode = schedule.id.slice(0, 8).split('').reduce((acc, char) => {
            return acc + char.charCodeAt(0);
          }, 0);
          const notificationId = (hashCode * 10) + day;

          notifications.push({
            id: notificationId,
            title: schedule.title,
            body: "Time for your breathing exercise! 🌬️",
            schedule: {
              at: scheduledDate,
              repeats: true,
              every: 'week',
            },
            channelId: 'oxia_reminders',
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
        description: `Failed to schedule notifications${(error as any)?.message ? ": " + (error as any).message : ""}`,
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
        try {
          const pending = await (LocalNotifications as any).getPending?.();
          if (pending?.notifications?.length) {
            await LocalNotifications.cancel({ notifications: pending.notifications });
          }
          await (LocalNotifications as any).removeAllDeliveredNotifications?.();
        } catch (e) {
          console.warn('Failed to cancel notifications (non-fatal):', e);
        }
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

  // Debug listeners for testing on device
  useEffect(() => {
    let sub1: any;
    let sub2: any;
    (async () => {
      try {
        sub1 = await LocalNotifications.addListener('localNotificationReceived', (notification) => {
          console.info('Local notification received:', notification);
        });
        sub2 = await LocalNotifications.addListener('localNotificationActionPerformed', (action) => {
          console.info('Local notification action performed:', action);
        });
      } catch (e) {
        console.warn('Failed to register LocalNotifications listeners:', e);
      }
    })();
    return () => {
      try { sub1?.remove?.(); } catch {}
      try { sub2?.remove?.(); } catch {}
    };
  }, []);

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
