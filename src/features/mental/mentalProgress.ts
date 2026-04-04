/**
 * Mental Progress Tracking
 *
 * Tracks mental performance metrics and computes trends.
 * Stored locally with AsyncStorage.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'otc:mental-progress-logs';

// ── Types ───────────────────────────────────────────────────────────────────

export type MentalMetricKey =
  | 'confidence'
  | 'focus'
  | 'emotionalControl'
  | 'routineCompletion'
  | 'journalCompletion'
  | 'resetUsage';

export interface MentalMetricLog {
  date: string;
  metric: MentalMetricKey;
  value: number; // 1-10 for ratings, 0-100 for percentages
}

export interface MentalMetricConfig {
  key: MentalMetricKey;
  label: string;
  unit: string;
  scale: '1-10' | '%';
}

export const MENTAL_METRICS: MentalMetricConfig[] = [
  { key: 'confidence', label: 'Confidence', unit: '/10', scale: '1-10' },
  { key: 'focus', label: 'Focus', unit: '/10', scale: '1-10' },
  { key: 'emotionalControl', label: 'Emotional Control', unit: '/10', scale: '1-10' },
  { key: 'routineCompletion', label: 'Routine Completion', unit: '%', scale: '%' },
  { key: 'journalCompletion', label: 'Journal Completion', unit: '%', scale: '%' },
  { key: 'resetUsage', label: 'Reset Usage', unit: '%', scale: '%' },
];

// ── Storage ─────────────────────────────────────────────────────────────────

export async function logMentalMetric(metric: MentalMetricKey, value: number): Promise<void> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  const logs: MentalMetricLog[] = raw ? JSON.parse(raw) : [];
  logs.unshift({ date: new Date().toISOString().slice(0, 10), metric, value });
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(logs.slice(0, 200)));
}

export async function loadMentalLogs(): Promise<MentalMetricLog[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

// ── Trend Computation ───────────────────────────────────────────────────────

export type Trend = 'improving' | 'flat' | 'declining' | 'unknown';

export interface MentalMetricTrend {
  key: MentalMetricKey;
  label: string;
  latest: number | null;
  previous: number | null;
  trend: Trend;
  delta: number | null;
}

export async function computeMentalTrends(): Promise<MentalMetricTrend[]> {
  const logs = await loadMentalLogs();

  return MENTAL_METRICS.map(({ key, label }) => {
    const metricLogs = logs.filter(l => l.metric === key)
      .sort((a, b) => b.date.localeCompare(a.date));

    if (metricLogs.length < 2) {
      return {
        key, label,
        latest: metricLogs[0]?.value ?? null,
        previous: null,
        trend: 'unknown' as Trend,
        delta: null,
      };
    }

    const latest = metricLogs[0].value;
    const previous = metricLogs[1].value;
    const delta = latest - previous;

    // All mental metrics are higher-is-better
    let trend: Trend;
    if (delta > 0.5) trend = 'improving';
    else if (delta < -1) trend = 'declining';
    else trend = 'flat';

    return { key, label, latest, previous, trend, delta };
  });
}

// ── Mental Path Lanes ───────────────────────────────────────────────────────

export interface MentalLane {
  key: string;
  title: string;
  levels: Array<{ level: number; title: string; description: string }>;
}

export const MENTAL_LANES: MentalLane[] = [
  {
    key: 'confidence',
    title: 'Confidence',
    levels: [
      { level: 0, title: 'Awareness', description: 'Understand what confidence is and where yours stands.' },
      { level: 1, title: 'Building', description: 'Use visualization, self-talk, and preparation to build confidence.' },
      { level: 2, title: 'Competing', description: 'Maintain confidence under game pressure.' },
    ],
  },
  {
    key: 'focus',
    title: 'Focus',
    levels: [
      { level: 0, title: 'Awareness', description: 'Identify what breaks your focus.' },
      { level: 1, title: 'Training', description: 'Practice focus routines and reset tools.' },
      { level: 2, title: 'Competing', description: 'Stay locked in during pressure moments.' },
    ],
  },
  {
    key: 'emotional_control',
    title: 'Emotional Control',
    levels: [
      { level: 0, title: 'Recognition', description: 'Notice when emotions take over.' },
      { level: 1, title: 'Regulation', description: 'Use resets and breathing to stay level.' },
      { level: 2, title: 'Mastery', description: 'Channel emotions into performance, not distraction.' },
    ],
  },
  {
    key: 'routines',
    title: 'Routines',
    levels: [
      { level: 0, title: 'Awareness', description: 'Learn why routines matter.' },
      { level: 1, title: 'Building', description: 'Create pre-game, between-pitch, and post-game routines.' },
      { level: 2, title: 'Automatic', description: 'Routines run on autopilot — you trust the process.' },
    ],
  },
  {
    key: 'self_talk',
    title: 'Self-Talk',
    levels: [
      { level: 0, title: 'Awareness', description: 'Notice your internal dialogue.' },
      { level: 1, title: 'Redirecting', description: 'Replace negative self-talk with productive cues.' },
      { level: 2, title: 'Ownership', description: 'Your internal voice is a competitive advantage.' },
    ],
  },
  {
    key: 'pressure',
    title: 'Pressure',
    levels: [
      { level: 0, title: 'Understanding', description: 'Learn how pressure affects performance.' },
      { level: 1, title: 'Managing', description: 'Use tools to stay calm and compete under pressure.' },
      { level: 2, title: 'Thriving', description: 'Seek out pressure and perform your best when it matters most.' },
    ],
  },
];
