import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Fallback polling interval. The subscription webhook is the source of truth,
 * but if a provider event is delayed the UI would otherwise stay stale until a
 * full reload. Five minutes is cheap (one tiny row read) and React Query pauses
 * polling automatically while the tab/app is in the background.
 */
const PREMIUM_REFRESH_INTERVAL = 5 * 60 * 1000;

export interface PremiumStatus {
  isPremium: boolean;
  isSubscribed: boolean;
  isTrialActive: boolean;
  trialEndsAt: string | null;
  trialStartedAt: string | null;
  subscriptionPlan: "monthly" | "yearly" | null;
  subscriptionExpiresAt: string | null;
  isEmotionTrackingEnabled: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  lastCheckedAt: number | null;
  /** Force an immediate re-check, e.g. right after a purchase completes. */
  refresh: () => Promise<void>;
}

export const usePremiumStatus = (): PremiumStatus => {
  const { user } = useAuth();

  const queryClient = useQueryClient();

  const { data: profile, isLoading, isFetching, dataUpdatedAt } = useQuery({
    queryKey: ["premiumStatus", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("is_subscribed, subscription_expires_at, trial_started_at, trial_ends_at, subscription_plan, emotion_tracking_enabled")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
    staleTime: 60 * 1000,
    // Fallback in case the store webhook is delayed.
    refetchInterval: PREMIUM_REFRESH_INTERVAL,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["premiumStatus", user?.id] });
  }, [queryClient, user?.id]);

  return useMemo((): PremiumStatus => {
    if (!profile || !user) {
      return {
        isPremium: false,
        isSubscribed: false,
        isTrialActive: false,
        trialEndsAt: null,
        trialStartedAt: null,
        subscriptionPlan: null,
        subscriptionExpiresAt: null,
        isEmotionTrackingEnabled: false,
        isLoading,
        isRefreshing: isFetching,
        lastCheckedAt: dataUpdatedAt || null,
        refresh,
      };
    }

    const now = new Date();
    const trialStartedAt = profile.trial_started_at ? new Date(profile.trial_started_at) : null;
    const trialEndsAt = profile.trial_ends_at ? new Date(profile.trial_ends_at) : null;
    const subscriptionExpiresAt = profile.subscription_expires_at ? new Date(profile.subscription_expires_at) : null;

    const isTrialActive = !!trialStartedAt && !!trialEndsAt && now >= trialStartedAt && now <= trialEndsAt;
    const isSubscribed = !!profile.is_subscribed && (!subscriptionExpiresAt || subscriptionExpiresAt > now);
    const isPremium = isSubscribed || isTrialActive;

    return {
      isPremium,
      isSubscribed,
      isTrialActive,
      trialEndsAt: profile.trial_ends_at || null,
      trialStartedAt: profile.trial_started_at || null,
      subscriptionPlan: profile.subscription_plan === "yearly" ? "yearly" : profile.subscription_plan === "monthly" ? "monthly" : null,
      subscriptionExpiresAt: profile.subscription_expires_at || null,
      isEmotionTrackingEnabled: profile.emotion_tracking_enabled ?? false,
      isLoading,
      isRefreshing: isFetching,
      lastCheckedAt: dataUpdatedAt || null,
      refresh,
    };
  }, [profile, user, isLoading, isFetching, dataUpdatedAt, refresh]);
};
