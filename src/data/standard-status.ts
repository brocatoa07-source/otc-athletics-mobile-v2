import type { KeyMetric, MetricReading, StandardStatus } from '@/types/progress';
import { KEY_METRICS } from '@/types/progress';

/* ── Thresholds ───────────────────────────────────────────────────────────
 * higherIsBetter = true:  above ≥ hi, on = [lo, hi), below < lo
 * higherIsBetter = false: above ≤ lo, on = (lo, hi], below > hi
 * ──────────────────────────────────────────────────────────────────────── */
export const STATUS_THRESHOLDS: Record<KeyMetric, { lo: number; hi: number; higherIsBetter: boolean }> = {
  exit_velocity_mph:   { lo: 85,   hi: 96,   higherIsBetter: true  },
  sprint_10yd_seconds: { lo: 1.60, hi: 1.75, higherIsBetter: false },
  throw_velocity_mph:  { lo: 75,   hi: 88,   higherIsBetter: true  },
  rot_power_watts:     { lo: 500,  hi: 700,  higherIsBetter: true  },
  strength_index:      { lo: 5,    hi: 7,    higherIsBetter: true  },
};

export function computeStandardStatus(metric: KeyMetric, value: number): StandardStatus {
  const t = STATUS_THRESHOLDS[metric];
  if (t.higherIsBetter) {
    if (value >= t.hi) return 'above';
    if (value >= t.lo) return 'on';
    return 'below';
  } else {
    if (value <= t.lo) return 'above';
    if (value <= t.hi) return 'on';
    return 'below';
  }
}

export function aggregateStandardStatus(
  readings: Partial<Record<KeyMetric, MetricReading>>
): StandardStatus | null {
  const statuses: StandardStatus[] = [];
  for (const key of KEY_METRICS) {
    const r = readings[key];
    if (r) statuses.push(computeStandardStatus(key, r.value));
  }
  if (statuses.length === 0) return null;
  if (statuses.includes('below')) return 'below';
  if (statuses.every((s) => s === 'above')) return 'above';
  return 'on';
}
