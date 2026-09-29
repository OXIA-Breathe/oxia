/** Remembers which sign-up / Premium prompts were already shown, per user (or guest). */
const key = (userId?: string | null) => `oxia.upsell.${userId ?? "guest"}`;

const read = (userId?: string | null): string[] => {
  try {
    return JSON.parse(localStorage.getItem(key(userId)) || "[]");
  } catch {
    return [];
  }
};

export const wasShown = (userId: string | null | undefined, milestone: string) =>
  read(userId).includes(milestone);

export const markShown = (userId: string | null | undefined, milestone: string) => {
  const list = read(userId);
  if (!list.includes(milestone)) {
    list.push(milestone);
    localStorage.setItem(key(userId), JSON.stringify(list));
  }
};

/** Session counts after which a free user is invited to Premium again. */
export const PREMIUM_REMINDER_MILESTONES = [10, 20, 100];
