import { useEffect, useRef } from 'react';

interface UsePageVisibilityProps {
  onPageHidden: () => void;
  onPageVisible: () => void;
  isActive: boolean;
}

export const usePageVisibility = ({ 
  onPageHidden, 
  onPageVisible, 
  isActive 
}: UsePageVisibilityProps) => {
  const wasActiveRef = useRef(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden - pause if currently active
        if (isActive) {
          wasActiveRef.current = true;
          onPageHidden();
        }
      } else {
        // Page is visible - resume if it was active when hidden
        if (wasActiveRef.current) {
          wasActiveRef.current = false;
          onPageVisible();
        }
      }
    };

    const handleBeforeUnload = () => {
      // Page is being unloaded - pause if currently active
      if (isActive) {
        onPageHidden();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isActive, onPageHidden, onPageVisible]);

  // Reset the ref when session is manually stopped
  useEffect(() => {
    if (!isActive) {
      wasActiveRef.current = false;
    }
  }, [isActive]);
};