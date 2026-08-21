/**
 * Connector-ready health tracker schema.
 *
 * Adding a new tracker = adding one entry to HEALTH_TRACKERS.
 * Nothing else in the app needs to change: sessions and stress readings
 * store a `provider` id + optional `sourceApp`, so existing rows stay valid
 * (missing provider === "manual").
 */

export type HealthTrackerId =
  | "manual"
  | "health_connect"
  | "apple_health"
  | "fitbit"
  | "garmin"
  | "whoop"
  | "oura"
  | "polar";

/** Metrics a tracker can expose. New metrics can be appended safely. */
export type HealthMetric =
  | "hrv"
  | "heart_rate"
  | "resting_heart_rate"
  | "respiratory_rate"
  | "sleep"
  | "stress_score"
  | "spo2";

export type TrackerPlatform = "android" | "ios" | "cloud";

export type TrackerAuthKind = "none" | "system_permission" | "oauth";

export type TrackerStatus = "available" | "planned";

export interface HealthTrackerDefinition {
  id: HealthTrackerId;
  /** Human label shown in UI. */
  name: string;
  /** Short line describing where the data comes from. */
  description: string;
  platforms: TrackerPlatform[];
  auth: TrackerAuthKind;
  /** Metrics we intend to read from this tracker. */
  metrics: HealthMetric[];
  /** Whether the tracker reports a stress score directly, or we derive it from HRV. */
  stressSource: "native" | "derived" | "manual";
  status: TrackerStatus;
}

export const HEALTH_TRACKERS: HealthTrackerDefinition[] = [
  {
    id: "manual",
    name: "Manual entry",
    description: "You set your stress level with the slider.",
    platforms: ["android", "ios"],
    auth: "none",
    metrics: [],
    stressSource: "manual",
    status: "available",
  },
  {
    id: "health_connect",
    name: "Health Connect",
    description: "Android hub for Samsung Health, Fitbit, Google Fit and more.",
    platforms: ["android"],
    auth: "system_permission",
    metrics: ["hrv", "heart_rate", "resting_heart_rate", "respiratory_rate", "sleep"],
    stressSource: "derived",
    status: "available",
  },
  {
    id: "apple_health",
    name: "Apple Health",
    description: "HealthKit data from iPhone and Apple Watch.",
    platforms: ["ios"],
    auth: "system_permission",
    metrics: ["hrv", "heart_rate", "resting_heart_rate", "respiratory_rate", "sleep"],
    stressSource: "derived",
    status: "planned",
  },
  {
    id: "fitbit",
    name: "Fitbit",
    description: "Cloud sync including the Fitbit stress management score.",
    platforms: ["cloud"],
    auth: "oauth",
    metrics: ["hrv", "heart_rate", "resting_heart_rate", "sleep", "stress_score", "spo2"],
    stressSource: "native",
    status: "planned",
  },
  {
    id: "garmin",
    name: "Garmin",
    description: "Garmin Connect stress score and Body Battery inputs.",
    platforms: ["cloud"],
    auth: "oauth",
    metrics: ["hrv", "heart_rate", "resting_heart_rate", "sleep", "stress_score"],
    stressSource: "native",
    status: "planned",
  },
  {
    id: "whoop",
    name: "WHOOP",
    description: "Recovery and strain metrics from the WHOOP API.",
    platforms: ["cloud"],
    auth: "oauth",
    metrics: ["hrv", "heart_rate", "resting_heart_rate", "sleep", "respiratory_rate"],
    stressSource: "derived",
    status: "planned",
  },
  {
    id: "oura",
    name: "Oura Ring",
    description: "Readiness, HRV and sleep data from the Oura API.",
    platforms: ["cloud"],
    auth: "oauth",
    metrics: ["hrv", "heart_rate", "resting_heart_rate", "sleep", "spo2"],
    stressSource: "derived",
    status: "planned",
  },
  {
    id: "polar",
    name: "Polar",
    description: "Polar Flow training and recovery data.",
    platforms: ["cloud"],
    auth: "oauth",
    metrics: ["hrv", "heart_rate", "resting_heart_rate", "sleep"],
    stressSource: "derived",
    status: "planned",
  },
];

export const DEFAULT_TRACKER_ID: HealthTrackerId = "health_connect";

export const getTracker = (id?: string | null): HealthTrackerDefinition =>
  HEALTH_TRACKERS.find((t) => t.id === id) ??
  HEALTH_TRACKERS.find((t) => t.id === "manual")!;

export const METRIC_LABELS: Record<HealthMetric, string> = {
  hrv: "Heart Rate Variability (HRV)",
  heart_rate: "Heart rate",
  resting_heart_rate: "Resting heart rate",
  respiratory_rate: "Respiratory rate",
  sleep: "Sleep",
  stress_score: "Stress score",
  spo2: "Blood oxygen (SpO₂)",
};

/**
 * A single stress reading, provider-agnostic.
 * Stored alongside a session so historical rows never need migrating when a
 * new tracker is added.
 */
export interface StressReading {
  /** 0-100, normalised across every provider. */
  value: number;
  provider: HealthTrackerId;
  /** Upstream app that produced the data, e.g. "Samsung Health". */
  sourceApp?: string;
  /** Which raw metric the value was derived from. */
  derivedFrom?: HealthMetric;
  /** Provider confidence 0-1 when available. */
  confidence?: number;
  measuredAt: string; // ISO timestamp
}

/** Pre/post stress payload attached to a breathing session. */
export interface SessionHealthData {
  schemaVersion: 1;
  pre?: StressReading;
  post?: StressReading;
}

export const attributionLabel = (reading?: StressReading): string => {
  if (!reading) return "No reading";
  const tracker = getTracker(reading.provider);
  if (tracker.id === "manual") return "Entered manually";
  const metric = reading.derivedFrom ? METRIC_LABELS[reading.derivedFrom] : "Health data";
  return reading.sourceApp
    ? `${metric} from ${reading.sourceApp} via ${tracker.name}`
    : `${metric} from ${tracker.name}`;
};
