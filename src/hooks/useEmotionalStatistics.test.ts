import { describe, it, expect } from "vitest";
import { calculateStressSummary, calculateMoodSummary, type EmotionRecord } from "./useEmotionalStatistics";

const r = (pv: number | null, qv: number | null, pa: number | null, qa: number | null): EmotionRecord =>
  ({ id: Math.random().toString(), created_at: "2026-10-01", pre_valence: pv, post_valence: qv, pre_arousal: pa, post_arousal: qa });

describe("insight summaries use only paired check-ins", () => {
  it("stress averages ignore sessions missing one check-in", () => {
    const s = calculateStressSummary([r(null, null, 80, 40), r(null, null, 60, 30), r(null, null, 90, null)]);
    expect(s.pairedCount).toBe(2);
    expect(s.missingCount).toBe(1);
    expect(s.avgPreStress).toBe(70);
    expect(s.avgPostStress).toBe(35);
    expect(s.lowerCount).toBe(2);
  });
  it("mood reports the most frequent changed transition", () => {
    const m = calculateMoodSummary([r(4, 5, null, null), r(4, 5, null, null), r(1, 2, null, null), r(5, 5, null, null)]);
    expect(m.topTransition).toEqual({ from: 4, to: 5, count: 2 });
    expect(m.unchangedCount).toBe(1);
  });
});
