/**
 * Route chunk preloading.
 *
 * Pages are code-split with React.lazy, which means the first visit to a page
 * downloads its chunk on demand — that is the visible "loading" step when
 * switching tabs. Warming the chunks while the device is idle removes it.
 */
type Loader = () => Promise<unknown>;

const loaders: Record<string, Loader> = {
  "/": () => import("@/pages/Index"),
  "/breathe": () => import("@/pages/BreathePage"),
  "/learn": () => import("@/pages/LearnPage"),
  "/progress": () => import("@/pages/ConsistencyPage"),
  "/settings": () => import("@/pages/SettingsPage"),
  "/profile": () => import("@/pages/ProfilePage"),
  "/journal": () => import("@/pages/WellnessJournalPage"),
};

const started = new Set<string>();

export const preloadRoute = (path: string) => {
  const loader = loaders[path];
  if (!loader || started.has(path)) return;
  started.add(path);
  void loader().catch(() => started.delete(path));
};

/** Warm every main tab chunk once the app is idle. */
export const preloadMainRoutes = () => {
  const run = () => Object.keys(loaders).forEach(preloadRoute);
  if (typeof window === "undefined") return;
  if ("requestIdleCallback" in window) {
    (window as Window & {
      requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number;
    }).requestIdleCallback(run, { timeout: 3000 });
  } else {
    window.setTimeout(run, 1500);
  }
};
