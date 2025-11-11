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

  // Request exact alarm permissions (Android 12+)
  const requestExactAlarmPermission = async () => {
    try {
      // Check if exact alarms can be scheduled
      const canSchedule = await (LocalNotifications as any).canScheduleExactNotifications?.();
      
      if (canSchedule === false) {
        console.info('Requesting SCHEDULE_EXACT_ALARM permission...');
        toast({
          title: "Precise Timing",
          description: "For accurate notifications, please allow exact alarms in the next screen",
        });
        
        // This will open system settings for exact alarm permission
        await (LocalNotifications as any).requestExactNotificationPermission?.();
      } else {
        console.info('Exact alarm permission already granted or not needed');
      }
    } catch (error) {
      console.warn('Exact alarm permission request failed or unsupported:', error);
    }
  };

  // Purge legacy notifications that may be stuck
  const purgeLegacyNotifications = async () => {
    try {
      console.info('Purging legacy notifications...');
      
      // Cancel known legacy notification IDs
      const legacyIds = [5122, 5123, 5124, 5125]; // Known problematic IDs
      await LocalNotifications.cancel({
        notifications: legacyIds.map(id => ({ id }))
      });
      
      // Delete old channel (this will prevent "No Channel found" errors)
      try {
        await (LocalNotifications as any).deleteChannel?.({ id: 'oxia_reminders' });
        console.info('Deleted legacy channel: oxia_reminders');
      } catch (e) {
        console.warn('Could not delete legacy channel (may not exist):', e);
      }
      
      console.info('Legacy notifications purged');
    } catch (error) {
      console.warn('Failed to purge legacy notifications:', error);
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

      // Purge any legacy notifications from old channel
      await purgeLegacyNotifications();
      
      // Request exact alarm permission for precise timing
      if (result.display === 'granted') {
        await requestExactAlarmPermission();
      }
    } catch (error) {
      console.error('Local notifications not supported:', error);
    }
  };

  // Clear all scheduled notifications - thorough cleanup
  const clearAllNotifications = async () => {
    try {
      // 1. Get and cancel all pending notifications
      const pending = await (LocalNotifications as any).getPending?.();
      if (pending?.notifications?.length) {
        console.info(`Canceling ${pending.notifications.length} pending notifications`);
        await LocalNotifications.cancel({ notifications: pending.notifications });
      }
      
      // 2. Remove all delivered notifications
      await (LocalNotifications as any).removeAllDeliveredNotifications?.();
      
      // 3. Try to delete old channel as fallback (Android)
      try {
        await (LocalNotifications as any).deleteChannel?.({ id: 'oxia_reminders' });
      } catch {}
      
      console.info('Cleared all pending and delivered notifications');
    } catch (e) {
      console.warn('Failed to clear notifications (non-fatal):', e);
    }
  };

  // Get pending notifications for debugging
  const getPendingNotifications = async () => {
    try {
      const pending = await (LocalNotifications as any).getPending?.();
      return pending?.notifications || [];
    } catch (e) {
      console.warn('Failed to get pending notifications:', e);
      return [];
    }
  };

  // Schedule notifications based on user's schedules
  const scheduleNotifications = async (schedules: NotificationSchedule[]) => {
    if (!hasPermission) {
      const granted = await requestPermissions();
      if (!granted) return;
    }

    try {
      // Always clear all existing notifications first
      await clearAllNotifications();

      // If no schedules, we're done (everything is cleared)
      if (!schedules || schedules.length === 0) {
        console.info('No schedules to schedule, all notifications cleared');
        return;
      }

      const notifications = [];

      for (const schedule of schedules) {
        const [hours, minutes] = schedule.time.split(':').map(Number);

        // Schedule for each day
        for (const day of schedule.days) {
          // Generate a stable numeric ID from UUID + day
          const hashCode = schedule.id.slice(0, 8).split('').reduce((acc, char) => {
            return acc + char.charCodeAt(0);
          }, 0);
          const notificationId = (hashCode * 10) + day;

          // Get personalized message based on notification time
          const category = getCategoryByTime(schedule.time);
          const personalizedMessage = getRandomMessage(category);

          // Use schedule.on for reliable weekly repeating notifications
          // Capacitor weekday: 1=Sunday, 2=Monday, ..., 7=Saturday
          // Our day: 0=Sunday, 1=Monday, ..., 6=Saturday
          const capacitorWeekday = day + 1;

          const notificationPayload = {
            id: notificationId,
            title: schedule.title,
            body: personalizedMessage,
            schedule: {
              on: {
                weekday: capacitorWeekday,
                hour: hours,
                minute: minutes,
              },
              repeats: true,
              allowWhileIdle: true,
            },
            smallIcon: 'ic_notification',
            channelId: 'oxia_reminders_v2',
          };

          console.info('📅 Scheduling notification:', {
            id: notificationId,
            time: `${hours}:${minutes.toString().padStart(2, '0')}`,
            weekday: capacitorWeekday,
            dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day],
            title: schedule.title,
          });

          notifications.push(notificationPayload);
        }
      }

      if (notifications.length > 0) {
        await LocalNotifications.schedule({ notifications });
        console.info(`✅ Successfully scheduled ${notifications.length} notifications`);
        
        // Verify what was actually scheduled
        const pending = await getPendingNotifications();
        console.info(`📋 Total pending notifications: ${pending.length}`, pending.map((n: any) => ({
          id: n.id,
          title: n.title,
          schedule: n.schedule,
        })));
      } else {
        console.info('No notifications to schedule');
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
        // Notifications disabled - clear everything
        await clearAllNotifications();
        console.info('Notifications disabled, cleared all');
        return;
      }

      // Get user's schedules
      const { data: schedules } = await supabase
        .from('notification_schedules')
        .select('*')
        .eq('user_id', user.id);

      // Schedule notifications (this will clear all first, then schedule new ones)
      await scheduleNotifications((schedules || []) as NotificationSchedule[]);
    } catch (error) {
      console.error('Error syncing notifications:', error);
    }
  };

  // Cancel notifications for a specific schedule
  const cancelSchedule = async (schedule: NotificationSchedule) => {
    // When a schedule is deleted, just resync everything
    // This ensures clean state without tracking individual notifications
    await syncNotifications();
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
    requestExactAlarmPermission,
    scheduleNotifications,
    syncNotifications,
    cancelSchedule,
    clearAllNotifications,
    getPendingNotifications,
    purgeLegacyNotifications,
  };
};
