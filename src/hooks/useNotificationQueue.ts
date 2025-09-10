import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface QueuedNotification {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

export const useNotificationQueue = () => {
  const { toast } = useToast();
  
  const showNotificationsInSequence = useCallback(async (notifications: QueuedNotification[]) => {
    for (let i = 0; i < notifications.length; i++) {
      const notification = notifications[i];
      
      // Show the notification
      toast(notification);
      
      // Wait for the specified duration or default before showing next
      if (i < notifications.length - 1) { // Don't wait after the last notification
        const delay = notification.duration || 3000; // Default 3 seconds
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }, [toast]);

  const queueNotifications = useCallback((notifications: QueuedNotification[]) => {
    showNotificationsInSequence(notifications);
  }, [showNotificationsInSequence]);

  return { queueNotifications };
};