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
  type: string;
  state: string;
}

// Normalised transaction shape sent to the server.
interface CordovaTransaction {
  id?: string;
  transactionId?: string;
  products?: Array<{ id: string }>;
  receipt?: string;
  signature?: string;
  originalTransactionId?: string;
}

// cordova-plugin-purchase v13 exposes its API on window.CdvPurchase.
declare global {
  interface Window {
    CdvPurchase?: any;
  }
}

let initPromise: Promise<void> | null = null;
let pending: { resolve: () => void; reject: (e: unknown) => void } | null = null;

const isNative = () => Capacitor.isNativePlatform();

const getCdv = () => (typeof window === "undefined" ? undefined : window.CdvPurchase);
const getStore = () => getCdv()?.store;

/** Convert a v13 transaction into the payload our server expects. */
const normaliseTransaction = (t: any): CordovaTransaction => {
  const native = t?.nativePurchase ?? {};
  const isApple = Capacitor.getPlatform() === "ios";
  return {
    id: t?.products?.[0]?.id,
    products: t?.products,
    transactionId: t?.transactionId ?? native.orderId ?? "",
    receipt: isApple
      ? t?.parentReceipt?.nativeData?.appStoreReceipt ?? ""
      : native.purchaseToken ?? t?.purchaseId ?? "",
    signature: native.signature ?? t?.parentReceipt?.signature ?? "",
    originalTransactionId: native.originalTransactionId ?? t?.originalTransactionId ?? "",
  };
};

/**
 * Initialise the in-app purchase store.
 * Safe to call on web — it resolves immediately with no side effects.
 */
export const initPurchases = async (): Promise<void> => {
  if (!isNative()) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const Cdv = getCdv();
    const store = getStore();
    if (!Cdv || !store) {
      console.warn("cordova-plugin-purchase store not available");
      return;
    }
    const platform =
      Capacitor.getPlatform() === "ios" ? Cdv.Platform.APPLE_APPSTORE : Cdv.Platform.GOOGLE_PLAY;

    try {
      store.verbosity = Cdv.LogLevel?.WARNING ?? 1;
      store.register([
        { id: PRODUCT_IDS.monthly, type: Cdv.ProductType.PAID_SUBSCRIPTION, platform },
        { id: PRODUCT_IDS.yearly, type: Cdv.ProductType.PAID_SUBSCRIPTION, platform },
      ]);

      store.when().approved(async (t: any) => {
        try {
          await verifyPurchaseOnServer(normaliseTransaction(t));
          await t.finish();
          pending?.resolve();
        } catch (err) {
          console.error("Purchase verification failed", err);
          pending?.reject(err);
        } finally {
          pending = null;
        }
      });

      store.error((err: any) => console.warn("Store error", err));

      await Promise.race([
        store.initialize([platform]),
        new Promise((r) => setTimeout(r, 5000)),
      ]);
    } catch (err) {
      console.error("Failed to initialise purchase store", err);
    }
  })();

  return initPromise;
};

/** Localised recurring price of a v13 product (skips the free-trial phase). */
const productPrice = (p: any): { price: string; micros: number; currency: string; period?: string } => {
  const phases: any[] = p?.getOffer?.()?.pricingPhases ?? p?.offers?.[0]?.pricingPhases ?? [];
  const paid = [...phases].reverse().find((ph) => ph.priceMicros > 0) ?? phases[0] ?? p?.pricing ?? {};
  return {
    price: paid.price ?? "",
    micros: paid.priceMicros ?? 0,
    currency: paid.currency ?? "",
    period: paid.billingPeriod,
  };
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
    .filter((p: any) => !!p)
    .map((p: any) => {
      const pr = productPrice(p);
      return {
        id: p.id,
        title: p.title ?? "",
        description: p.description ?? "",
        price: pr.price,
        priceMicros: pr.micros,
        currency: pr.currency,
        billingPeriod: pr.period,
        type: String(p.type ?? ""),
        state: "valid",
      };
    })
    .filter((p) => !!p.price);
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

  const product = store.get(PRODUCT_IDS[plan]);
  const offer = product?.getOffer?.();
  if (!offer) {
    throw new Error("This plan isn't available right now. Please try again later.");
  }

  const done = new Promise<void>((resolve, reject) => {
    pending = { resolve, reject };
  });

  const err = await offer.order();
  if (err) {
    pending = null;
    if (err.code === getCdv()?.ErrorCode?.PAYMENT_CANCELLED) {
      throw new Error("Purchase cancelled.");
    }
    throw new Error(err.message ?? "Purchase failed.");
  }

  await done;
};

/** Result of the last verify-purchase call, kept so QA can quote a trace ID. */
export interface VerificationRecord {
  at: string;
  status: "success" | "error";
  code: string;
  traceId: string | null;
  message: string;
  plan?: SubscriptionPlan | null;
}

const VERIFICATION_STORAGE_KEY = "oxia:last-purchase-verification";

/** Error thrown when the server refuses a purchase; carries the QA trace ID. */
export class PurchaseVerificationError extends Error {
  code: string;
  traceId: string | null;

  constructor(message: string, code: string, traceId: string | null) {
    super(message);
    this.name = "PurchaseVerificationError";
    this.code = code;
    this.traceId = traceId;
  }
}

const recordVerification = (record: VerificationRecord) => {
  try {
    localStorage.setItem(VERIFICATION_STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Storage unavailable (private mode) — tracing then relies on the logs only.
  }
};

/** Read the last verification attempt (used by the internal premium debug view). */
export const getLastVerification = (): VerificationRecord | null => {
  try {
    const raw = localStorage.getItem(VERIFICATION_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as VerificationRecord) : null;
  } catch {
    return null;
  }
};

/**
 * Send the purchase receipt to the Edge Function for validation
 * and profile update.
 */
const verifyPurchaseOnServer = async (transaction: CordovaTransaction): Promise<void> => {
  const productId = transaction.products?.[0]?.id ?? transaction.id ?? "";

  const payload = {
    platform: Capacitor.getPlatform(), // "ios" | "android"
    productId,
    transactionId: transaction.transactionId ?? transaction.id ?? "",
    receipt: transaction.receipt ?? "",
    signature: transaction.signature ?? "",
    originalTransactionId: transaction.originalTransactionId ?? "",
  };

  const { data, error } = await supabase.functions.invoke("verify-purchase", {
    body: payload,
  });

  if (error) {
    // The Edge Function returns { error, code, traceId } — read it from the
    // FunctionsHttpError response body so the trace ID is not lost.
    let body: any = null;
    try {
      body = await (error as any)?.context?.json?.();
    } catch {
      body = null;
    }

    const code = body?.code ?? "unknown_error";
    const traceId = body?.traceId ?? null;
    const message = body?.error ?? error.message ?? "Purchase verification failed.";

    recordVerification({ at: new Date().toISOString(), status: "error", code, traceId, message });
    throw new PurchaseVerificationError(message, code, traceId);
  }

  recordVerification({
    at: new Date().toISOString(),
    status: "success",
    code: "verified",
    traceId: (data as any)?.traceId ?? null,
    message: "Subscription activated.",
    plan: (data as any)?.plan ?? null,
  });
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

/** Android application id — required by the Play subscription deep link. */
const ANDROID_PACKAGE_NAME = "app.lovable.d3590b81c81449329e6d4fbda085725b";

/**
 * Open the platform subscription management screen, where the user can cancel
 * or change their plan. Cancelling is always handled by the store (Google Play
 * or Apple), never in-app — the store then notifies our webhook, which clears
 * `is_subscribed`. The user's practice data is never touched.
 */
export const openSubscriptionManagement = (plan?: SubscriptionPlan): void => {
  const platform = Capacitor.getPlatform();

  const url =
    platform === "ios"
      ? "https://apps.apple.com/account/subscriptions"
      : `https://play.google.com/store/account/subscriptions?package=${ANDROID_PACKAGE_NAME}${
          plan ? `&sku=${PRODUCT_IDS[plan]}` : ""
        }`;

  window.open(url, "_blank", "noopener,noreferrer");
};
