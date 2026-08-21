/**
 * Connector-ready stress importer.
 *
 * Takes raw readings freshly fetched from ANY tracker connector and maps them
 * onto existing breathing sessions as normalised `StressReading`s with correct
 * `stressSource` attribution.
 *
 * Design rules:
 * - Pure functions only. Connectors fetch, this module maps. No I/O here.
 * - Adding a tracker requires no change here: attribution is read from the
 *   tracker definition in `HEALTH_TRACKERS`.
 * - Never destroys existing data. Manual entries always win unless the caller
 *   explicitly opts into overwriting.
 * - Sessions without health data stay valid (missing provider === manual).
 */

import {
  getTracker,
  type HealthMetric,
  type HealthTrackerId,
  type SessionHealthData,
  type StressReading,
} from "@/types/healthTracker";

/** Whether a raw vendor value grows with stress or with wellbeing. */
export type ScaleDirection = "higher_is_more_stress" | "higher_is_better";

/** What a connector hands us before normalisation. */
export interface RawStressReading {
  provider: HealthTrackerId;
  /** Raw vendor value (any scale, described by `scale`). */
  value: number;
  /** ISO timestamp of the measurement. */
  measuredAt: string;
  /** Metric the value came from. Defaults to the tracker's primary metric. */
  metric?: HealthMetric;
  /** Upstream app, e.g. "Samsung Health", "Fitbit". */
  sourceApp?: string;
  /** Raw scale bounds + direction. Defaults to 0-100, higher = more stress. */
  scale?: { min: number; max: number; direction: ScaleDirection };
  /** Vendor confidence 0-1 when exposed. */
  confidence?: number;
}

/** How a reading ended up on a session. */
export type StressSourceKind = "native" | "derived" | "manual";

/** Minimal shape the importer needs; your session type can be richer. */
export interface ImportableSession {
  id: string;
  /** Session start, ISO timestamp. */
  date: string;
  /** Session length in seconds (used to place post-readings). */
  totalDuration?: number;
  health?: SessionHealthData;
}

export interface ImportOptions {
  /** How far from the session boundary a reading may sit. Default 30 min. */
  windowMinutes?: number;
  /** Replace readings that already exist on a session. Default false. */
  overwriteExisting?: boolean;
  /** Replace manual entries too. Default false — the user's own input wins. */
  overwriteManual?: boolean;
}

export interface ImportedStressReading extends StressReading {
  /** Attribution: how this number was produced. */
  stressSource: StressSourceKind;
  /** Raw vendor value, kept for auditing and re-normalisation. */
  rawValue: number;
}

export interface ImportSummary {
  readingsReceived: number;
  applied: number;
  skippedUnmatched: number;
  skippedExisting: number;
  perProvider: Record<string, number>;
}

export interface ImportResult<T extends ImportableSession> {
  sessions: T[];
  summary: ImportSummary;
}

const DEFAULT_WINDOW_MINUTES = 30;
const DEFAULT_SCALE = {
  min: 0,
  max: 100,
  direction: "higher_is_more_stress" as ScaleDirection,
};

const clamp = (n: number, min = 0, max = 100) => Math.min(max, Math.max(min, n));

/**
 * Maps a raw vendor value onto OXIA's canonical 0-100 stress scale
 * (0 = calm, 100 = highly stressed) and attaches attribution.
 */
export const normaliseReading = (raw: RawStressReading): ImportedStressReading => {
  const tracker = getTracker(raw.provider);
  const scale = raw.scale ?? DEFAULT_SCALE;
  const span = scale.max - scale.min || 1;

  const pct = ((raw.value - scale.min) / span) * 100;
  const oriented = scale.direction === "higher_is_better" ? 100 - pct : pct;

  return {
    value: Math.round(clamp(oriented)),
    rawValue: raw.value,
    provider: tracker.id,
    sourceApp: raw.sourceApp,
    derivedFrom: raw.metric ?? tracker.metrics[0],
    confidence: raw.confidence,
    measuredAt: raw.measuredAt,
    stressSource: tracker.stressSource,
  };
};

const ms = (iso: string) => new Date(iso).getTime();

type Slot = "pre" | "post";

interface Match {
  sessionId: string;
  slot: Slot;
  distanceMs: number;
}

/**
 * Decides whether a reading belongs to a session's pre or post slot.
 * Readings at/ before session start -> pre. After session end -> post.
 */
const matchSession = (
  reading: ImportedStressReading,
  session: ImportableSession,
  windowMs: number,
): Match | null => {
  const start = ms(session.date);
  const end = start + (session.totalDuration ?? 0) * 1000;
  const t = ms(reading.measuredAt);
  if (Number.isNaN(start) || Number.isNaN(t)) return null;

  if (t <= end) {
    const distance = Math.abs(start - t);
    if (distance <= windowMs) return { sessionId: session.id, slot: "pre", distanceMs: distance };
    return null;
  }
  const distance = t - end;
  if (distance <= windowMs) return { sessionId: session.id, slot: "post", distanceMs: distance };
  return null;
};

const canWrite = (
  existing: StressReading | undefined,
  options: ImportOptions,
): boolean => {
  if (!existing) return true;
  if (existing.provider === "manual") return options.overwriteManual === true;
  return options.overwriteExisting === true;
};

/**
 * Maps freshly fetched readings onto existing sessions.
 * Returns new session objects (input is never mutated).
 */
export const importStressReadings = <T extends ImportableSession>(
  sessions: T[],
  rawReadings: RawStressReading[],
  options: ImportOptions = {},
): ImportResult<T> => {
  const windowMs = (options.windowMinutes ?? DEFAULT_WINDOW_MINUTES) * 60_000;

  const summary: ImportSummary = {
    readingsReceived: rawReadings.length,
    applied: 0,
    skippedUnmatched: 0,
    skippedExisting: 0,
    perProvider: {},
  };

  // Clone health payloads so callers can diff/persist safely.
  const next = sessions.map((s) => ({
    ...s,
    health: s.health ? { ...s.health } : undefined,
  })) as T[];
  const byId = new Map(next.map((s) => [s.id, s]));

  // Best candidate per (session, slot): closest reading wins.
  const claims = new Map<string, { reading: ImportedStressReading; distanceMs: number }>();

  for (const raw of rawReadings) {
    const reading = normaliseReading(raw);

    let best: Match | null = null;
    for (const session of next) {
      const match = matchSession(reading, session, windowMs);
      if (match && (!best || match.distanceMs < best.distanceMs)) best = match;
    }

    if (!best) {
      summary.skippedUnmatched += 1;
      continue;
    }

    const key = `${best.sessionId}:${best.slot}`;
    const held = claims.get(key);
    if (!held || best.distanceMs < held.distanceMs) {
      claims.set(key, { reading, distanceMs: best.distanceMs });
      if (held) summary.skippedUnmatched += 1;
    } else {
      summary.skippedUnmatched += 1;
    }
  }

  for (const [key, { reading }] of claims) {
    const [sessionId, slot] = key.split(":") as [string, Slot];
    const session = byId.get(sessionId);
    if (!session) continue;

    const health: SessionHealthData = session.health ?? { schemaVersion: 1 };
    if (!canWrite(health[slot], options)) {
      summary.skippedExisting += 1;
      continue;
    }

    session.health = { ...health, schemaVersion: 1, [slot]: reading };
    summary.applied += 1;
    summary.perProvider[reading.provider] = (summary.perProvider[reading.provider] ?? 0) + 1;
  }

  return { sessions: next, summary };
};

/** Convenience: the stress delta a session achieved, or null when incomplete. */
export const sessionStressDelta = (session: ImportableSession): number | null => {
  const pre = session.health?.pre?.value;
  const post = session.health?.post?.value;
  if (pre === undefined || post === undefined) return null;
  return pre - post;
};

/** Human summary line for logs/toasts. */
export const describeImport = (summary: ImportSummary): string =>
  `${summary.applied} of ${summary.readingsReceived} readings mapped` +
  (summary.skippedExisting ? `, ${summary.skippedExisting} kept existing` : "") +
  (summary.skippedUnmatched ? `, ${summary.skippedUnmatched} unmatched` : "");
