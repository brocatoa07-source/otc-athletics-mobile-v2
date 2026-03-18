/**
 * OTC STRENGTH PROFILE
 *
 * Stores the athlete's strength profile:
 *   - Mover type (from existing 20-question quiz)
 *   - Position (baseball position group)
 *   - Deficiency (primary movement limitation)
 *   - Days per week (training frequency)
 *   - Season phase (periodization context)
 *
 * These five inputs drive program generation.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

/* ─── Types ──────────────────────────────────────── */

export type StrengthArchetype = 'static' | 'spring' | 'hybrid';
export type BaseballPosition = 'outfielder' | 'infielder' | 'catcher';
export type MovementDeficiency = 'hip_mobility' | 'shoulder_stability' | 'acceleration_weakness';
export type DaysPerWeek = 1 | 2 | 3 | 4 | 5;
export type SeasonPhase = 'IN_SEASON' | 'PRESEASON' | 'OFFSEASON';

export interface StrengthProfile {
  archetype: StrengthArchetype;
  position: BaseballPosition;
  deficiency: MovementDeficiency;
  daysPerWeek?: DaysPerWeek;    // optional for backward compat
  seasonPhase?: SeasonPhase;    // optional for backward compat
  updatedAt: string; // ISO date
}

/** Safe defaults for older profiles missing new fields. */
export const STRENGTH_PROFILE_DEFAULTS = {
  daysPerWeek: 3 as DaysPerWeek,
  seasonPhase: 'OFFSEASON' as SeasonPhase,
};

/* ─── Display Data ───────────────────────────────── */

export const ARCHETYPE_META: Record<StrengthArchetype, { label: string; tagline: string; color: string }> = {
  static: {
    label: 'Static Engine',
    tagline: 'Strong engine. Stiff chassis. Time to unlock range and elasticity.',
    color: '#3b82f6',
  },
  spring: {
    label: 'Spring Athlete',
    tagline: 'Elastic and fast. Time to add strength and control to the explosiveness.',
    color: '#ef4444',
  },
  hybrid: {
    label: 'Hybrid Athlete',
    tagline: 'Balanced mover. Develop both ends — strength and elasticity.',
    color: '#22c55e',
  },
};

export const POSITION_META: Record<BaseballPosition, { label: string; description: string; icon: string }> = {
  outfielder: {
    label: 'Outfielder',
    description: 'Sprint speed, arm strength, and rotational power for throws from distance.',
    icon: 'speedometer-outline',
  },
  infielder: {
    label: 'Infielder',
    description: 'Lateral quickness, first-step explosion, and short-burst acceleration.',
    icon: 'flash-outline',
  },
  catcher: {
    label: 'Catcher',
    description: 'Hip durability, pop time, blocking mobility, and lower-body endurance.',
    icon: 'shield-outline',
  },
};

export const DEFICIENCY_META: Record<MovementDeficiency, { label: string; description: string; icon: string }> = {
  hip_mobility: {
    label: 'Hip Mobility',
    description: 'Limited hip range restricts rotation, squat depth, and sprint mechanics.',
    icon: 'body-outline',
  },
  shoulder_stability: {
    label: 'Shoulder Stability',
    description: 'Weak scapular control limits overhead strength and throwing durability.',
    icon: 'fitness-outline',
  },
  acceleration_weakness: {
    label: 'Acceleration Weakness',
    description: 'Slow first step and limited explosive power off the start.',
    icon: 'rocket-outline',
  },
};

/* ─── Days Per Week Metadata ─────────────────────── */

export const DAYS_PER_WEEK_OPTIONS: { value: DaysPerWeek; label: string; description: string }[] = [
  { value: 1, label: '1 Day', description: 'Minimum effective dose — one full-body session' },
  { value: 2, label: '2 Days', description: 'Low-frequency development and maintenance' },
  { value: 3, label: '3 Days', description: 'Balanced development model' },
  { value: 4, label: '4 Days', description: 'Expanded split with dedicated speed work' },
  { value: 5, label: '5 Days', description: 'Highest commitment — full development bandwidth' },
];

/* ─── Season Phase Metadata ──────────────────────── */

export const SEASON_PHASE_META: Record<SeasonPhase, { label: string; description: string; icon: string; color: string }> = {
  IN_SEASON: {
    label: 'In-Season',
    description: 'Maintain strength and power. Prioritize freshness and minimize soreness.',
    icon: 'baseball-outline',
    color: '#22c55e',
  },
  PRESEASON: {
    label: 'Preseason',
    description: 'Sharpen explosiveness. Transfer strength to speed and prepare for competition.',
    icon: 'trending-up-outline',
    color: '#f59e0b',
  },
  OFFSEASON: {
    label: 'Offseason',
    description: 'Biggest development window. Build strength, durability, and physical capacity.',
    icon: 'construct-outline',
    color: '#3b82f6',
  },
};

/* ─── Storage ────────────────────────────────────── */

const STORAGE_KEY = 'otc:strength-profile';

export async function loadStrengthProfile(): Promise<StrengthProfile | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function saveStrengthProfile(profile: StrengthProfile): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export async function clearStrengthProfile(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
