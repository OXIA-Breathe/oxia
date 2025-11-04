import { useEffect, useState } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getCategoryByTime, getRandomMessage } from '@/constants/notificationMessages';

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

      // Ensure Android notification channel exists (v2 to avoid old cache)
      try {
        await (LocalNotifications as any).createChannel?.({
          id: 'oxia_reminders_v2',
          name: 'OXIA Reminders',
          description: 'Breathing exercise reminders',
          importance: 5,
          vibration: true,
        });
        console.info('Ensured notification channel exists: oxia_reminders_v2');
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

          // Get personalized message based on notification time
          const category = getCategoryByTime(schedule.time);
          const personalizedMessage = getRandomMessage(category);

          // Use schedule.on for more reliable weekly repeats on Android
          notifications.push({
            id: notificationId,
            title: schedule.title,
            body: personalizedMessage,
            schedule: {
              on: {
                weekday: day === 0 ? 7 : day, // Capacitor uses 1=Monday...7=Sunday
                hour: hours,
                minute: minutes,
              },
              // Remove exact/allowWhileIdle to prevent burst repeats on Android
            },
            smallIcon: 'ic_notification',
            channelId: 'oxia_reminders_v2', // Use v2 channel to avoid old cache
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
    } else {
      // No schedules: ensure any previously scheduled notifications are cleared
      try {
        const pending = await (LocalNotifications as any).getPending?.();
        if (pending?.notifications?.length) {
          await LocalNotifications.cancel({ notifications: pending.notifications });
        }
        await (LocalNotifications as any).removeAllDeliveredNotifications?.();
        console.info('No schedules found; cleared all pending/delivered notifications');
      } catch (e) {
        console.warn('Failed to clear notifications when no schedules (non-fatal):', e);
      }
    }
    } catch (error) {
      console.error('Error syncing notifications:', error);
    }
  };

  // Cancel notifications for a specific schedule (more reliable on Android)
  const cancelSchedule = async (schedule: NotificationSchedule) => {
    try {
      const cancels = schedule.days.map((day) => {
        const hashCode = schedule.id.slice(0, 8).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const notificationId = (hashCode * 10) + day;
        return { id: notificationId } as any;
      });
      if (cancels.length) {
        await LocalNotifications.cancel({ notifications: cancels });
      }
      await (LocalNotifications as any).removeAllDeliveredNotifications?.();
      console.info('Cancelled notifications for schedule', schedule.id);
    } catch (e) {
      console.warn('Failed to cancel specific schedule notifications (non-fatal):', e);
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

  // Force clear ALL notifications and reset channel (nuclear option for stuck alarms)
  const forceClearAll = async () => {
    try {
      // Cancel all pending
      const pending = await (LocalNotifications as any).getPending?.();
      if (pending?.notifications?.length) {
        await LocalNotifications.cancel({ notifications: pending.notifications });
      }
      // Remove all delivered
      await (LocalNotifications as any).removeAllDeliveredNotifications?.();
      
      // Delete old channels and recreate v2
      try {
        await (LocalNotifications as any).deleteChannel?.({ id: 'oxia_reminders' });
        await (LocalNotifications as any).deleteChannel?.({ id: 'oxia_reminders_v2' });
      } catch (e) {
        console.warn('Channel deletion not supported or failed:', e);
      }
      
      await (LocalNotifications as any).createChannel?.({
        id: 'oxia_reminders_v2',
        name: 'OXIA Reminders',
        description: 'Breathing exercise reminders',
        importance: 5,
        vibration: true,
      });
      
      console.info('Force cleared all notifications and reset channel');
      toast({
        title: "Notifications Cleared",
        description: "All scheduled notifications have been removed",
      });
    } catch (error) {
      console.error('Error force clearing notifications:', error);
      toast({
        title: "Clear Failed",
        description: "Could not clear all notifications",
        variant: "destructive",
      });
    }
  };

  return {
    hasPermission,
    requestPermissions,
    scheduleNotifications,
    syncNotifications,
    cancelSchedule,
    forceClearAll,
  };
};
