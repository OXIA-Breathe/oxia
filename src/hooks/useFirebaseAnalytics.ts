import { useEffect } from 'react';
import { FirebaseAnalytics } from '@capacitor-firebase/analytics';
import { Capacitor } from '@capacitor/core';

export const useFirebaseAnalytics = () => {
  const isNative = Capacitor.isNativePlatform();

  useEffect(() => {
    if (isNative) {
      // Initialize Firebase Analytics
      FirebaseAnalytics.setEnabled({ enabled: true });
    }
  }, [isNative]);

  const logEvent = async (eventName: string, params?: Record<string, any>) => {
    if (!isNative) return;
    
    try {
      await FirebaseAnalytics.logEvent({
        name: eventName,
        params: params || {},
      });
    } catch (error) {
      console.error('Firebase Analytics error:', error);
    }
  };

  const setUserId = async (userId: string) => {
    if (!isNative) return;
    
    try {
      await FirebaseAnalytics.setUserId({ userId });
    } catch (error) {
      console.error('Firebase Analytics setUserId error:', error);
    }
  };

  const setUserProperty = async (key: string, value: string) => {
    if (!isNative) return;
    
    try {
      await FirebaseAnalytics.setUserProperty({ key, value });
    } catch (error) {
      console.error('Firebase Analytics setUserProperty error:', error);
    }
  };

  const logScreenView = async (screenName: string, screenClass?: string) => {
    if (!isNative) return;
    
    try {
      await FirebaseAnalytics.logEvent({
        name: 'screen_view',
        params: {
          screen_name: screenName,
          screen_class: screenClass || screenName,
        },
      });
    } catch (error) {
      console.error('Firebase Analytics logScreenView error:', error);
    }
  };

  return {
    logEvent,
    setUserId,
    setUserProperty,
    logScreenView,
    isNative,
  };
};
