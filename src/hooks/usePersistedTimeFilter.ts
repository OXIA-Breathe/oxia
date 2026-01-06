import { useState, useEffect } from "react";
import { TimeFilter, DateRange } from "@/hooks/useEmotionalStatistics";

const STORAGE_KEY = "progress-time-filter";
const CUSTOM_RANGE_KEY = "progress-custom-range";

export const usePersistedTimeFilter = () => {
  const [filter, setFilter] = useState<TimeFilter>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return (saved as TimeFilter) || "weekly";
  });

  const [customRange, setCustomRange] = useState<DateRange | undefined>(() => {
    const saved = localStorage.getItem(CUSTOM_RANGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          start: new Date(parsed.start),
          end: new Date(parsed.end),
        };
      } catch {
        return undefined;
      }
    }
    return undefined;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, filter);
  }, [filter]);

  useEffect(() => {
    if (customRange) {
      localStorage.setItem(
        CUSTOM_RANGE_KEY,
        JSON.stringify({
          start: customRange.start.toISOString(),
          end: customRange.end.toISOString(),
        })
      );
    }
  }, [customRange]);

  return { filter, setFilter, customRange, setCustomRange };
};
