import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useMemo } from "react";

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
}

export const usePremiumStatus = (): PremiumStatus => {
  const { user } = useAuth();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["premiumStatus", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("is_subscribed, subscription_expires_at, trial_started_at, trial_ends_at, subscription_plan")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

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
        isLoading,
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
      isLoading,
    };
  }, [profile, user, isLoading]);
};
