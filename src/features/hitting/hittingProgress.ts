/**
 * Hitting Progress Tracking
 *
 * Tracks hitting-specific metrics and computes trends.
 * Stored locally with AsyncStorage, later migratable to Supabase.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'otc:hitting-progress-logs';

// ── Types ───────────────────────────────────────────────────────────────────

export type HittingMetricKey =
  | 'exitVelo'
  | 'hardHitPct'
  | 'contactPct'
  | 'strikeoutPct'
  | 'oppoFieldPct'
  | 'pullPct'
  | 'lineDrivePct'
  | 'groundBallPct'
  | 'flyBallPct';

export interface HittingMetricLog {
  date: string;
  metric: HittingMetricKey;
  value: number;
}

export interface HittingMetricConfig {
  key: HittingMetricKey;
  label: string;
  unit: string;
  higherIsBetter: boolean;
}

export const HITTING_METRICS: HittingMetricConfig[] = [
  { key: 'exitVelo', label: 'Exit Velocity', unit: 'mph', higherIsBetter: true },
  { key: 'hardHitPct', label: 'Hard Hit %', unit: '%', higherIsBetter: true },
  { key: 'contactPct', label: 'Contact %', unit: '%', higherIsBetter: true },
  { key: 'strikeoutPct', label: 'Strikeout %', unit: '%', higherIsBetter: false },
  { key: 'oppoFieldPct', label: 'Opposite Field %', unit: '%', higherIsBetter: true },
  { key: 'pullPct', label: 'Pull %', unit: '%', higherIsBetter: false },
  { key: 'lineDrivePct', label: 'Line Drive %', unit: '%', higherIsBetter: true },
  { key: 'groundBallPct', label: 'Ground Ball %', unit: '%', higherIsBetter: false },
  { key: 'flyBallPct', label: 'Fly Ball %', unit: '%', higherIsBetter: false },
];

// ── Storage ─────────────────────────────────────────────────────────────────

export async function logHittingMetric(metric: HittingMetricKey, value: number): Promise<void> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  const logs: HittingMetricLog[] = raw ? JSON.parse(raw) : [];
  logs.unshift({ date: new Date().toISOString().slice(0, 10), metric, value });
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(logs.slice(0, 200)));
}

export async function loadHittingLogs(): Promise<HittingMetricLog[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

// ── Trend Computation ───────────────────────────────────────────────────────

export type Trend = 'improving' | 'flat' | 'declining' | 'unknown';

export interface HittingMetricTrend {
  key: HittingMetricKey;
  label: string;
  latest: number | null;
  previous: number | null;
  trend: Trend;
  delta: number | null;
}

/**
 * Compute trends for all hitting metrics from logged data.
 */
export async function computeHittingTrends(): Promise<HittingMetricTrend[]> {
  const logs = await loadHittingLogs();

  return HITTING_METRICS.map(({ key, label, higherIsBetter }) => {
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
    const pctChange = previous !== 0 ? (delta / previous) * 100 : 0;

    let trend: Trend;
    if (higherIsBetter) {
      trend = pctChange > 2 ? 'improving' : pctChange < -5 ? 'declining' : 'flat';
    } else {
      trend = pctChange < -2 ? 'improving' : pctChange > 5 ? 'declining' : 'flat';
    }

    return { key, label, latest, previous, trend, delta };
  });
}

// ── Hitting Path Stages ─────────────────────────────────────────────────────

export const HITTING_PATH_STAGES = [
  { key: 'learn', label: 'Learn Movement', description: 'Tee work — build the pattern', icon: 'fitness-outline' },
  { key: 'repeat', label: 'Repeat Movement', description: 'Flips — groove the pattern under motion', icon: 'repeat-outline' },
  { key: 'transfer_flips', label: 'Transfer to Flips', description: 'Front toss — test the pattern with variable speed', icon: 'flash-outline' },
  { key: 'transfer_machine', label: 'Transfer to Machine', description: 'Machine — apply the pattern at game speed', icon: 'speedometer-outline' },
  { key: 'compete', label: 'Compete', description: 'Live ABs — perform under pressure', icon: 'trophy-outline' },
] as const;
