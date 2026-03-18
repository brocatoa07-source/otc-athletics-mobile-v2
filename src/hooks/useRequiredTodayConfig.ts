import type { CanonicalTier } from '@/hooks/useTier';

export type RequiredTodayItemKey =
  | 'readiness'
  | 'training'
  | 'skillWork'
  | 'mental'
  | 'journal';

export type RequiredTodayEnabled = Record<RequiredTodayItemKey, boolean>;

/** Fixed display + priority order — order never changes, only visibility. */
export const REQUIRED_TODAY_ORDER: RequiredTodayItemKey[] = [
  'readiness',
  'training',
  'skillWork',
  'mental',
  'journal',
];

export const REQUIRED_TODAY_META: Record<
  RequiredTodayItemKey,
  { label: string; icon: string; route: string; description: string }
> = {
  readiness: {
    label: 'OTC Check-In',
    icon: 'pulse-outline',
    route: '/(app)/training/own-the-cost-checkin',
    description: 'Daily 4-question check-in — always required',
  },
  training: {
    label: "Today's Session",
    icon: 'barbell-outline',
    route: '/(app)/training/sc/workout',
    description: 'Your personalized lifting or training session',
  },
  skillWork: {
    label: 'Skill Work',
    icon: 'baseball-outline',
    route: '/(app)/training/mechanical',
    description: 'Hitting drills, tee work, or cage session',
  },
  mental: {
    label: 'Mental Session',
    icon: 'sparkles-outline',
    route: '/(app)/training/mental',
    description: 'Course, visualization, or mental tool',
  },
  journal: {
    label: 'Journal Entry',
    icon: 'journal-outline',
    route: '/(app)/training/mental/journals',
    description: 'Reflect on training and mindset',
  },
};

/* ─── Tier-based standard definitions ────────────── */

const TIER_KEYS: Record<string, RequiredTodayItemKey[]> = {
  WALK:     [],
  SINGLE:   ['readiness', 'mental', 'journal'],
  DOUBLE:   ['readiness', 'mental', 'journal', 'skillWork'],
  TRIPLE:   ['readiness', 'mental', 'journal', 'skillWork', 'training'],
  HOME_RUN: ['readiness', 'mental', 'journal', 'skillWork', 'training'],
};

/** Returns the ordered list of standard keys for a given tier. */
export function getStandardKeysForTier(tier: CanonicalTier | 'COACH'): RequiredTodayItemKey[] {
  if (tier === 'COACH') return TIER_KEYS.HOME_RUN;
  return TIER_KEYS[tier] ?? [];
}

/** Returns the enabled map for the accountability engine based on tier. */
export function getStandardsEnabledForTier(tier: CanonicalTier | 'COACH'): RequiredTodayEnabled {
  const keys = getStandardKeysForTier(tier);
  return {
    readiness: keys.includes('readiness'),
    training:  keys.includes('training'),
    skillWork: keys.includes('skillWork'),
    mental:    keys.includes('mental'),
    journal:   keys.includes('journal'),
  };
}
