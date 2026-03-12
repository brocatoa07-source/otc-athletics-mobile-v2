export type MetricType =
  | 'exit_velocity_mph'
  | 'sprint_60yd_seconds'
  | 'throw_velocity_mph'
  | 'sprint_10yd_seconds'
  | 'bat_speed_mph'
  | 'vertical_jump_inches'
  | 'broad_jump_inches'
  | 'rot_power_watts'
  | 'strength_index';

/** The 5 key metrics that determine Development Verified status */
export type KeyMetric =
  | 'exit_velocity_mph'
  | 'sprint_10yd_seconds'
  | 'throw_velocity_mph'
  | 'rot_power_watts'
  | 'strength_index';

export const KEY_METRICS: KeyMetric[] = [
  'exit_velocity_mph',
  'sprint_10yd_seconds',
  'throw_velocity_mph',
  'rot_power_watts',
  'strength_index',
];

export type DevelopmentStatus = 'verified' | 'unverified';
export type StandardStatus = 'below' | 'on' | 'above';

export interface MetricReading {
  value: number;
  recordedAt: string;
  delta: number | null; // positive = better, negative = worse
}

export interface MetricConfig {
  label: string;
  unit: string;
  icon: string;
  higherIsBetter: boolean;
}

export const METRIC_CONFIG: Record<MetricType, MetricConfig> = {
  exit_velocity_mph: {
    label: 'Exit Velo',
    unit: 'mph',
    icon: 'flash',
    higherIsBetter: true,
  },
  sprint_60yd_seconds: {
    label: '60-Yard',
    unit: 'sec',
    icon: 'timer',
    higherIsBetter: false,
  },
  throw_velocity_mph: {
    label: 'Throw Velo',
    unit: 'mph',
    icon: 'arrow-forward-circle',
    higherIsBetter: true,
  },
  sprint_10yd_seconds: {
    label: '10-Yard',
    unit: 'sec',
    icon: 'stopwatch',
    higherIsBetter: false,
  },
  bat_speed_mph: {
    label: 'Bat Speed',
    unit: 'mph',
    icon: 'flash',
    higherIsBetter: true,
  },
  vertical_jump_inches: {
    label: 'Vertical',
    unit: 'in',
    icon: 'trending-up',
    higherIsBetter: true,
  },
  broad_jump_inches: {
    label: 'Broad Jump',
    unit: 'in',
    icon: 'resize',
    higherIsBetter: true,
  },
  rot_power_watts: {
    label: 'Rot. Power',
    unit: 'W',
    icon: 'refresh-circle',
    higherIsBetter: true,
  },
  strength_index: {
    label: 'Strength Index',
    unit: '',
    icon: 'barbell',
    higherIsBetter: true,
  },
};

export interface ProgressEntry {
  id: string;
  athlete_id: string;
  metric_type: MetricType;
  value: number;
  notes?: string;
  recorded_at: string;
  created_at: string;
}
