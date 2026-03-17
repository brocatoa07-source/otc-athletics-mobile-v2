/**
 * OTC STRENGTH PROFILE
 *
 * Stores the athlete's strength profile:
 *   - Mover type (from existing 20-question quiz)
 *   - Position (baseball position group)
 *   - Deficiency (primary movement limitation)
 *
 * These three inputs drive program generation.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

/* ─── Types ──────────────────────────────────────── */

export type StrengthArchetype = 'static' | 'spring' | 'hybrid';
export type BaseballPosition = 'outfielder' | 'infielder' | 'catcher';
export type MovementDeficiency = 'hip_mobility' | 'shoulder_stability' | 'acceleration_weakness';

export interface StrengthProfile {
  archetype: StrengthArchetype;
  position: BaseballPosition;
  deficiency: MovementDeficiency;
  updatedAt: string; // ISO date
}

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
