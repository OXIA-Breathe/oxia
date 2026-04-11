import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

const TRIAL_LIMIT = 10;
const STORAGE_KEY = "breathing_trial_fingerprint";

// Generate a simple device fingerprint for tracking
function getDeviceFingerprint(): string {
  let fp = localStorage.getItem(STORAGE_KEY);
  if (!fp) {
    fp = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, fp);
  }
  return fp;
}

interface TrialResponse {
  allowed: boolean;
  sessionCount: number;
  remaining: number;
  limit: number;
}

async function callTrialApi(action: "check" | "increment"): Promise<TrialResponse> {
  const fingerprint = getDeviceFingerprint();
  
  const { data, error } = await supabase.functions.invoke("check-trial", {
    body: { action, fingerprint },
  });

  if (error) {
    console.error("Trial API error:", error);
    // Fallback: allow the session but don't track
    return { allowed: true, sessionCount: 0, remaining: TRIAL_LIMIT, limit: TRIAL_LIMIT };
  }

  return data as TrialResponse;
}

export const useTrialCounter = () => {
  const [trialCount, setTrialCount] = useState<number>(0);
  const [hasReachedLimit, setHasReachedLimit] = useState<boolean>(false);
  const [remainingSessions, setRemainingSessions] = useState<number>(TRIAL_LIMIT);
  const [isLoading, setIsLoading] = useState(true);

  // Check trial status on mount
  useEffect(() => {
    let cancelled = false;
    
    const checkTrial = async () => {
      const result = await callTrialApi("check");
      if (!cancelled) {
        setTrialCount(result.sessionCount);
        setHasReachedLimit(!result.allowed);
        setRemainingSessions(result.remaining);
        setIsLoading(false);
      }
    };

    checkTrial();
    return () => { cancelled = true; };
  }, []);

  const incrementTrial = useCallback(async () => {
    const result = await callTrialApi("increment");
    setTrialCount(result.sessionCount);
    setHasReachedLimit(!result.allowed);
    setRemainingSessions(result.remaining);
  }, []);

  const resetTrial = useCallback(() => {
    // No-op for server-side tracking — cannot be reset by client
  }, []);

  return {
    trialCount,
    hasReachedLimit,
    remainingSessions,
    incrementTrial,
    resetTrial,
    isLoading,
  };
};
