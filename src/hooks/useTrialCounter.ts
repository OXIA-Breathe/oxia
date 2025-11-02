import { useState, useEffect } from "react";

const TRIAL_LIMIT = 5;
const STORAGE_KEY = "breathing_trial_count";

export const useTrialCounter = () => {
  const [trialCount, setTrialCount] = useState<number>(0);
  const [hasReachedLimit, setHasReachedLimit] = useState<boolean>(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const count = stored ? parseInt(stored, 10) : 0;
    setTrialCount(count);
    setHasReachedLimit(count >= TRIAL_LIMIT);
  }, []);

  const incrementTrial = () => {
    const newCount = trialCount + 1;
    setTrialCount(newCount);
    localStorage.setItem(STORAGE_KEY, newCount.toString());
    setHasReachedLimit(newCount >= TRIAL_LIMIT);
  };

  const resetTrial = () => {
    setTrialCount(0);
    localStorage.removeItem(STORAGE_KEY);
    setHasReachedLimit(false);
  };

  const remainingSessions = Math.max(0, TRIAL_LIMIT - trialCount);

  return {
    trialCount,
    hasReachedLimit,
    remainingSessions,
    incrementTrial,
    resetTrial,
  };
};
