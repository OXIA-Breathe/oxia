import { lazy, type ComponentType } from "react";

const RELOAD_FLAG = "oxia:chunk-reloaded";

/**
 * React.lazy with recovery for stale chunk URLs.
 *
 * After a new deploy the old HTML references hashed chunks that no longer
 * exist, so the dynamic import rejects with "Failed to fetch dynamically
 * imported module" and the screen goes blank. Retry once, then force a single
 * hard reload to pick up the fresh asset manifest.
 */
export function lazyWithRetry<T extends ComponentType<never>>(
  factory: () => Promise<{ default: T }>
) {
  return lazy(async () => {
    try {
      const mod = await factory();
      sessionStorage.removeItem(RELOAD_FLAG);
      return mod;
    } catch (error) {
      // second chance: transient network failure
      try {
        const mod = await factory();
        sessionStorage.removeItem(RELOAD_FLAG);
        return mod;
      } catch (retryError) {
        const alreadyReloaded = sessionStorage.getItem(RELOAD_FLAG) === "1";
        if (!alreadyReloaded) {
          sessionStorage.setItem(RELOAD_FLAG, "1");
          window.location.reload();
          // keep Suspense pending while the page reloads
          return new Promise<{ default: T }>(() => {});
        }
        throw retryError;
      }
    }
  });
}
