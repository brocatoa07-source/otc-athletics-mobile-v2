import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

/* ────────────────────────────────────────────────────
 * PERFORMANCE TREND — Snapshot-Based Testing System
 *
 * Athletes log full testing snapshots every ~4 weeks.
 * All past snapshots are stored — never overwritten.
 * Strength Index is auto-calculated from lift inputs.
 * ──────────────────────────────────────────────────── */

const STORAGE_KEY = 'otc:performance-trend-snapshots';

/* ─── Snapshot Model ─────────────────────────────── */

export interface PerformanceTrendSnapshot {
  id: string;
  createdAt: string;
  testDate: string;
  note: string;

  bodyweight: number | null;
  exitVelo: number | null;
  throwingVelo: number | null;
  sixtyYard: number | null;
  tenYard: number | null;
  batSpeed: number | null;
  verticalJump: number | null;
  broadJump: number | null;
  rotationalPower: number | null;

  trapBarDeadlift: number | null;
  frontSquat: number | null;
  splitSquat: number | null;

  strengthIndex: number | null;
}

/* ─── Metric Field Keys (for iteration) ──────────── */

export type TrendMetricKey =
  | 'bodyweight'
  | 'exitVelo'
  | 'throwingVelo'
  | 'sixtyYard'
  | 'tenYard'
  | 'batSpeed'
  | 'verticalJump'
  | 'broadJump'
  | 'rotationalPower';

export type StrengthInputKey = 'trapBarDeadlift' | 'frontSquat' | 'splitSquat';

/* ─── Metric Config ──────────────────────────────── */

export interface TrendMetricConfig {
  key: TrendMetricKey | StrengthInputKey | 'strengthIndex';
  label: string;
  unit: string;
  icon: keyof typeof Ionicons.glyphMap;
  higherIsBetter: boolean;
  description: string;
  group: 'performance' | 'strength';
}

export const TREND_METRICS: TrendMetricConfig[] = [
  {
    key: 'bodyweight',
    label: 'Bodyweight',
    unit: 'lbs',
    icon: 'scale-outline',
    higherIsBetter: true,
    description: 'Your current bodyweight. Used to calculate relative strength and compare performance changes over time.',
    group: 'performance',
  },
  {
    key: 'exitVelo',
    label: 'Exit Velo',
    unit: 'mph',
    icon: 'flash-outline',
    higherIsBetter: true,
    description: 'Your hardest tracked exit velocity. Measures how hard you can hit the ball and shows quality of contact and power output.',
    group: 'performance',
  },
  {
    key: 'throwingVelo',
    label: 'Throwing Velo',
    unit: 'mph',
    icon: 'arrow-forward-circle-outline',
    higherIsBetter: true,
    description: 'Your top throwing velocity. Shows arm speed and throwing power.',
    group: 'performance',
  },
  {
    key: 'sixtyYard',
    label: '60-Yard Dash',
    unit: 'sec',
    icon: 'timer-outline',
    higherIsBetter: false,
    description: 'Your 60-yard sprint time. Measures top-end running speed and longer sprint performance.',
    group: 'performance',
  },
  {
    key: 'tenYard',
    label: '10-Yard Dash',
    unit: 'sec',
    icon: 'stopwatch-outline',
    higherIsBetter: false,
    description: 'Your 10-yard sprint time. Measures first-step burst and acceleration.',
    group: 'performance',
  },
  {
    key: 'batSpeed',
    label: 'Bat Speed',
    unit: 'mph',
    icon: 'flash-outline',
    higherIsBetter: true,
    description: 'Your tracked bat speed. Shows barrel speed and swing quickness.',
    group: 'performance',
  },
  {
    key: 'verticalJump',
    label: 'Vertical Jump',
    unit: 'in',
    icon: 'trending-up-outline',
    higherIsBetter: true,
    description: 'Your best vertical jump. Measures vertical lower-body explosiveness.',
    group: 'performance',
  },
  {
    key: 'broadJump',
    label: 'Broad Jump',
    unit: 'in',
    icon: 'resize-outline',
    higherIsBetter: true,
    description: 'Your best broad jump. Measures horizontal power and force production.',
    group: 'performance',
  },
  {
    key: 'rotationalPower',
    label: 'Rotational Power',
    unit: 'mph',
    icon: 'refresh-circle-outline',
    higherIsBetter: true,
    description: '8 lb med ball throw velocity. Shows how fast you create rotational force — highly relevant to hitting and throwing. Use same ball weight, setup, and throw style every time.',
    group: 'performance',
  },
];

export const STRENGTH_INPUTS: TrendMetricConfig[] = [
  {
    key: 'trapBarDeadlift',
    label: 'Trap Bar Deadlift',
    unit: 'lbs',
    icon: 'barbell-outline',
    higherIsBetter: true,
    description: 'Your trap bar deadlift max or working max. Used to calculate Strength Index.',
    group: 'strength',
  },
  {
    key: 'frontSquat',
    label: 'Front Squat',
    unit: 'lbs',
    icon: 'barbell-outline',
    higherIsBetter: true,
    description: 'Your front squat max or working max. Used to calculate Strength Index.',
    group: 'strength',
  },
  {
    key: 'splitSquat',
    label: 'RFE Split Squat',
    unit: 'lbs',
    icon: 'barbell-outline',
    higherIsBetter: true,
    description: 'Rear foot elevated split squat — log your weaker side. Used to calculate Strength Index.',
    group: 'strength',
  },
];

/* ─── Strength Index ─────────────────────────────── */

export function calculateStrengthIndex(
  bodyweight: number | null,
  trapBar: number | null,
  frontSquat: number | null,
  splitSquat: number | null,
): number | null {
  if (!bodyweight || bodyweight <= 0) return null;
  const lifts = [trapBar, frontSquat, splitSquat].filter((v): v is number => v !== null && v > 0);
  if (lifts.length === 0) return null;

  const ratios = lifts.map((l) => l / bodyweight);
  const avg = ratios.reduce((a, b) => a + b, 0) / ratios.length;
  return Math.round(avg * 100) / 100;
}

export interface StrengthBand {
  label: string;
  color: string;
  min: number;
  max: number;
}

export const STRENGTH_BANDS: StrengthBand[] = [
  { label: 'Very Underdeveloped', color: '#ef4444', min: 0, max: 1.0 },
  { label: 'Developing', color: '#f59e0b', min: 1.0, max: 1.4 },
  { label: 'Strong Base', color: '#22c55e', min: 1.4, max: 1.8 },
  { label: 'High-Level', color: '#3b82f6', min: 1.8, max: 2.2 },
  { label: 'Elite', color: '#8b5cf6', min: 2.2, max: 99 },
];

export function getStrengthBand(index: number): StrengthBand {
  return STRENGTH_BANDS.find((b) => index >= b.min && index < b.max) ?? STRENGTH_BANDS[0];
}

/* ─── Persistence ────────────────────────────────── */

export async function loadSnapshots(): Promise<PerformanceTrendSnapshot[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as PerformanceTrendSnapshot[];
  } catch {
    return [];
  }
}

export async function saveSnapshot(snapshot: PerformanceTrendSnapshot): Promise<void> {
  const existing = await loadSnapshots();
  existing.unshift(snapshot); // newest first
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

export async function getLatestSnapshot(): Promise<PerformanceTrendSnapshot | null> {
  const all = await loadSnapshots();
  return all[0] ?? null;
}

/* ─── Delta Helpers ──────────────────────────────── */

export function computeDelta(
  current: number | null,
  previous: number | null,
  higherIsBetter: boolean,
): { raw: number; display: string; improved: boolean } | null {
  if (current === null || previous === null) return null;
  const raw = current - previous;
  if (raw === 0) return null;
  const prefix = raw > 0 ? '+' : '';
  const display = `${prefix}${Number.isInteger(raw) ? raw : raw.toFixed(1)}`;
  const improved = higherIsBetter ? raw > 0 : raw < 0;
  return { raw, display, improved };
}

/* ─── Retest Logic ───────────────────────────────── */

export function getRetestInfo(snapshots: PerformanceTrendSnapshot[]): {
  lastTestDate: string | null;
  daysSince: number | null;
  suggestedNext: string | null;
  isDue: boolean;
} {
  if (snapshots.length === 0) {
    return { lastTestDate: null, daysSince: null, suggestedNext: null, isDue: true };
  }
  const latest = snapshots[0];
  const lastDate = new Date(latest.testDate);
  const now = new Date();
  const daysSince = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
  const nextDate = new Date(lastDate.getTime() + 28 * 24 * 60 * 60 * 1000);
  const suggestedNext = nextDate.toISOString().slice(0, 10);
  return {
    lastTestDate: latest.testDate,
    daysSince,
    suggestedNext,
    isDue: daysSince >= 28,
  };
}

/* ─── ID Generator ───────────────────────────────── */

export function generateSnapshotId(): string {
  return `snap_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
