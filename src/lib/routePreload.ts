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
  if (typeof window === "undefined") return;
  const run = () => Object.keys(loaders).forEach(preloadRoute);
  const idle = (window as unknown as {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  }).requestIdleCallback;
  if (idle) {
    idle(run, { timeout: 3000 });
  } else {
    setTimeout(run, 1500);
  }
};
