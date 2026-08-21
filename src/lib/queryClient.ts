import { QueryClient } from "@tanstack/react-query";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

/**
 * Shared query client.
 *
 * Defaults are tuned for a mobile app that should feel instant:
 * - data stays "fresh" for 5 minutes, so navigating back to a page does not refetch
 * - cached data lives for 24h and is restored from localStorage on cold start
 * - no refetch on window focus (annoying flicker on mobile tab switches)
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 24 * 60 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: true,
      retry: 1,
    },
  },
});

const safeStorage = (): Storage | undefined => {
  try {
    const testKey = "__oxia_storage_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch {
    return undefined;
  }
};

export const queryPersister = createSyncStoragePersister({
  storage: typeof window === "undefined" ? undefined : safeStorage(),
  key: "OXIA_QUERY_CACHE",
  throttleTime: 1000,
});
