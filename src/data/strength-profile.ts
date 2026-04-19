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
export type ProgramDuration = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type PrimaryGoal = 'get_stronger' | 'get_faster' | 'maintain_in_season' | 'improve_mobility' | 'return_from_layoff';
export type GymAccess = 'full_gym' | 'limited_gym' | 'home_bodyweight';

export interface StrengthProfile {
  archetype: StrengthArchetype;
  position: BaseballPosition;
  deficiency: MovementDeficiency;
  daysPerWeek?: DaysPerWeek;
  seasonPhase?: SeasonPhase;
  /** Program duration in months (1-12) */
  programDurationMonths?: ProgramDuration;
  /** Athlete's primary training goal */
  primaryGoal?: PrimaryGoal;
  /** Gym equipment access level */
  gymAccess?: GymAccess;
  /** Free-text injury/limitation notes */
  limitations?: string;
  updatedAt: string;
}

/** Safe defaults for older profiles missing new fields. */
export const STRENGTH_PROFILE_DEFAULTS = {
  daysPerWeek: 3 as DaysPerWeek,
  seasonPhase: 'OFFSEASON' as SeasonPhase,
  programDurationMonths: 6 as ProgramDuration,
  primaryGoal: 'get_stronger' as PrimaryGoal,
  gymAccess: 'full_gym' as GymAccess,
};

/* ─── Program Duration Metadata ─────────────────── */

export const DURATION_OPTIONS: { value: ProgramDuration; label: string; description: string }[] = [
  { value: 1, label: '1 Month', description: 'Quick focus block' },
  { value: 2, label: '2 Months', description: 'Short development cycle' },
  { value: 3, label: '3 Months', description: 'Standard training block' },
  { value: 4, label: '4 Months', description: 'Extended development' },
  { value: 5, label: '5 Months', description: 'Deep training phase' },
  { value: 6, label: '6 Months', description: 'Full periodization cycle' },
  { value: 7, label: '7 Months', description: 'Extended periodization' },
  { value: 8, label: '8 Months', description: 'Long-range development' },
  { value: 9, label: '9 Months', description: 'Full offseason + preseason' },
  { value: 10, label: '10 Months', description: 'Nearly full year plan' },
  { value: 11, label: '11 Months', description: 'Almost annual plan' },
  { value: 12, label: '12 Months', description: 'Full annual plan' },
];

/* ─── Primary Goal Metadata ─────────────────────── */

export const GOAL_META: Record<PrimaryGoal, { label: string; description: string; icon: string; color: string }> = {
  get_stronger: { label: 'Get Stronger', description: 'Build force production, max strength, and overall power.', icon: 'barbell-outline', color: '#3b82f6' },
  get_faster: { label: 'Get Faster', description: 'Improve sprint speed, acceleration, and reactive power.', icon: 'flash-outline', color: '#ef4444' },
  maintain_in_season: { label: 'Maintain In-Season', description: 'Preserve strength and freshness during competition.', icon: 'shield-outline', color: '#22c55e' },
  improve_mobility: { label: 'Improve Mobility', description: 'Restore movement access, reduce limitations, improve positions.', icon: 'body-outline', color: '#0891b2' },
  return_from_layoff: { label: 'Return From Layoff', description: 'Rebuild safely after time off, injury, or detraining.', icon: 'medkit-outline', color: '#f59e0b' },
};

/* ─── Gym Access Metadata ───────────────────────── */

export const GYM_ACCESS_META: Record<GymAccess, { label: string; description: string; icon: string }> = {
  full_gym: { label: 'Full Gym', description: 'Barbells, dumbbells, machines, cables, racks.', icon: 'barbell-outline' },
  limited_gym: { label: 'Limited Gym', description: 'Dumbbells, bands, some machines. No full rack.', icon: 'fitness-outline' },
  home_bodyweight: { label: 'Home / Bodyweight', description: 'Minimal equipment. Bodyweight, bands, maybe dumbbells.', icon: 'home-outline' },
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
