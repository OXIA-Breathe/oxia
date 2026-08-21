import { Capacitor } from "@capacitor/core";
import { supabase } from "@/integrations/supabase/client";

// Product IDs must match exactly what is configured in
// Google Play Console (Android) and App Store Connect (iOS).
export const PRODUCT_IDS = {
  monthly: "oxia_premium_monthly",
  yearly: "oxia_premium_yearly",
} as const;

export type SubscriptionPlan = "monthly" | "yearly";

export interface PurchaseProduct {
  id: string;
  title: string;
  description: string;
  price: string;
  priceMicros: number;
  currency: string;
  billingPeriod?: string;
  trialPeriod?: string;
  type: "paid subscription" | "subscription" | string;
  state: "valid" | "invalid" | string;
}

interface CordovaStore {
  register(product: {
    id: string;
    type: "paid subscription";
    platform?: string;
  }): void;
  refresh(): void;
  get(productId: string): PurchaseProduct | undefined;
  order(productId: string): Promise<void>;
  when(productId?: string): {
    updated(callback: (product: PurchaseProduct) => void): void;
    approved(callback: (transaction: any) => void): void;
    verified(callback: (transaction: any) => void): void;
    unverified(callback: (transaction: any) => void): void;
    owned(callback: (product: PurchaseProduct) => void): void;
    error(callback: (error: any) => void): void;
  };
  validator?: string;
  verbosity?: number;
  ready(callback: () => void): void;
  error(callback: (error: any) => void): void;
}

declare global {
  interface Window {
    store?: CordovaStore;
  }
}

let initPromise: Promise<void> | null = null;

const isNative = () => Capacitor.isNativePlatform();

const getStore = (): CordovaStore | undefined => {
  if (typeof window === "undefined") return undefined;
  return window.store;
};

/**
 * Initialise the in-app purchase store.
 * Safe to call on web — it resolves immediately with no side effects.
 */
export const initPurchases = async (): Promise<void> => {
  if (!isNative()) return;
  if (initPromise) return initPromise;

  initPromise = new Promise((resolve, reject) => {
    const store = getStore();
    if (!store) {
      reject(new Error("cordova-plugin-purchase store not available"));
      return;
    }

    store.verbosity = 0;

    // Register both subscription products
    store.register({ id: PRODUCT_IDS.monthly, type: "paid subscription" });
    store.register({ id: PRODUCT_IDS.yearly, type: "paid subscription" });

    // Refresh products from the stores
    store.refresh();

    // Listen for ownership / validation events
    store.when()
      .approved((transaction: any) => {
        // Server-side validation happens here; do not finish locally until verified.
        transaction.verify();
      })
      .verified(async (transaction: any) => {
        try {
          await verifyPurchaseOnServer(transaction);
          transaction.finish();
        } catch (err) {
          console.error("Purchase verification failed", err);
        }
      })
      .unverified((transaction: any) => {
        console.warn("Purchase could not be verified", transaction);
      });

    store.ready(() => resolve());

    // Fallback timeout so the promise doesn't hang forever
    setTimeout(() => resolve(), 3000);
  });

  return initPromise;
};

/**
 * Get available subscription products with localised pricing.
 * Returns an empty array on web.
 */
export const getProducts = async (): Promise<PurchaseProduct[]> => {
  await initPurchases();
  const store = getStore();
  if (!store) return [];

  return [PRODUCT_IDS.monthly, PRODUCT_IDS.yearly]
    .map((id) => store.get(id))
    .filter((p): p is PurchaseProduct => !!p && p.state === "valid");
};

/**
 * Start the purchase flow for the selected plan.
 */
export const purchaseSubscription = async (plan: SubscriptionPlan): Promise<void> => {
  if (!isNative()) {
    throw new Error("In-app purchases are only available in the native app.");
  }

  await initPurchases();
  const store = getStore();
  if (!store) throw new Error("Purchase store not initialised");

  const productId = PRODUCT_IDS[plan];
  await store.order(productId);
};

/**
 * Send the purchase receipt to the Edge Function for validation
 * and profile update.
 */
const verifyPurchaseOnServer = async (transaction: any): Promise<void> => {
  const payload = {
    platform: Capacitor.getPlatform(), // "ios" | "android"
    productId: transaction.products?.[0]?.id ?? transaction.id,
    transactionId: transaction.transactionId ?? transaction.id,
    receipt: transaction.receipt,
    signature: transaction.signature,
    originalTransactionId: transaction.originalTransactionId,
  };

  const { error } = await supabase.functions.invoke("verify-purchase", {
    body: payload,
  });

  if (error) throw error;
};

/**
 * Restore previous purchases / subscriptions.
 */
export const restorePurchases = async (): Promise<void> => {
  if (!isNative()) return;
  const store = getStore();
  if (!store) return;
  store.refresh();
};
