/** Remembers which sign-up / Premium prompts were already shown, per user (or guest). */
// Bumping the version resets previously recorded prompts once.
const key = (userId?: string | null) => `oxia.upsell.v2.${userId ?? "guest"}`;

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

