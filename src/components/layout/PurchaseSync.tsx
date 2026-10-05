import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { initPurchases, syncOwnedPurchases, PREMIUM_UPDATED_EVENT } from "@/lib/purchases";

/**
 * Connects to the store as soon as a signed-in user opens the app, so any
 * paid-but-unconfirmed subscription is verified automatically.
 */
const PurchaseSync = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    const onUpdated = () => queryClient.invalidateQueries({ queryKey: ["premiumStatus"] });
    window.addEventListener(PREMIUM_UPDATED_EVENT, onUpdated);
    return () => window.removeEventListener(PREMIUM_UPDATED_EVENT, onUpdated);
  }, [queryClient]);

  useEffect(() => {
    if (!user || !Capacitor.isNativePlatform()) return;
    initPurchases()
      .then(() => syncOwnedPurchases())
      .catch((err) => console.warn("Purchase sync failed", err));
  }, [user]);

  return null;
};

export default PurchaseSync;
