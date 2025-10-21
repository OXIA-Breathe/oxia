import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useFirebaseAnalytics } from './useFirebaseAnalytics';

const routeToScreenName: Record<string, string> = {
  '/': 'Home',
  '/breathe': 'Breathe',
  '/learn': 'Learn',
  '/progress': 'Progress',
  '/profile': 'Profile',
  '/settings': 'Settings',
  '/auth': 'Auth',
};

export const useScreenTracking = () => {
  const location = useLocation();
  const { logScreenView } = useFirebaseAnalytics();

  useEffect(() => {
    const screenName = routeToScreenName[location.pathname] || location.pathname;
    logScreenView(screenName);
  }, [location.pathname, logScreenView]);
};
