import type { BlockKey } from '@/data/session-blocks';

/* ────────────────────────────────────────────────────
 * READINESS AUTO-REGULATION ENGINE
 *
 * Pre-session check-in that adjusts training load:
 *   - Sleep quality
 *   - Soreness / body feel
 *   - Energy / motivation
 *   - Stress level
 *
 * Produces a ReadinessScore (1-10) that maps to a
 * training zone: PUSH, NORMAL, DELOAD, or REST.
 * ──────────────────────────────────────────────────── */

export type ReadinessZone = 'push' | 'normal' | 'deload' | 'rest';

export interface ReadinessQuestion {
  key: string;
  question: string;
  icon: string;
  options: ReadinessOption[];
}

export interface ReadinessOption {
  label: string;
  value: number; // 1-4
  emoji: string;
}

export interface ReadinessResult {
  score: number; // 1-10
  zone: ReadinessZone;
  answers: Record<string, number>;
  completedAt: string;
}

export const READINESS_QUESTIONS: ReadinessQuestion[] = [
  {
    key: 'sleep',
    question: 'How did you sleep last night?',
    icon: 'moon-outline',
    options: [
      { label: 'Terrible (<5 hrs)', value: 1, emoji: '😴' },
      { label: 'Poor (5-6 hrs)', value: 2, emoji: '😐' },
      { label: 'Good (7-8 hrs)', value: 3, emoji: '😊' },
      { label: 'Great (8+ hrs)', value: 4, emoji: '💪' },
    ],
  },
  {
    key: 'soreness',
    question: 'How does your body feel?',
    icon: 'body-outline',
    options: [
      { label: 'Very sore / hurt', value: 1, emoji: '🤕' },
      { label: 'Pretty sore', value: 2, emoji: '😣' },
      { label: 'Slightly sore', value: 3, emoji: '👌' },
      { label: 'Fresh & ready', value: 4, emoji: '🔥' },
    ],
  },
  {
    key: 'energy',
    question: 'Energy & motivation level?',
    icon: 'flash-outline',
    options: [
      { label: 'Exhausted', value: 1, emoji: '😩' },
      { label: 'Low energy', value: 2, emoji: '😶' },
      { label: 'Normal', value: 3, emoji: '⚡' },
      { label: 'Fired up', value: 4, emoji: '🚀' },
    ],
  },
  {
    key: 'stress',
    question: 'Stress level today?',
    icon: 'pulse-outline',
    options: [
      { label: 'Overwhelmed', value: 1, emoji: '😰' },
      { label: 'High stress', value: 2, emoji: '😤' },
      { label: 'Manageable', value: 3, emoji: '😌' },
      { label: 'Calm & focused', value: 4, emoji: '🧘' },
    ],
  },
];

/** Compute readiness score (1-10) from answers */
export function computeReadinessScore(answers: Record<string, number>): number {
  const values = Object.values(answers);
  if (values.length === 0) return 5;
  const sum = values.reduce((a, b) => a + b, 0);
  // Raw sum is 4-16 → map to 1-10
  const raw = ((sum - 4) / 12) * 9 + 1;
  return Math.round(Math.min(10, Math.max(1, raw)));
}

/** Map score to training zone */
export function getReadinessZone(score: number): ReadinessZone {
  if (score <= 3) return 'rest';
  if (score <= 5) return 'deload';
  if (score <= 8) return 'normal';
  return 'push';
}

export interface ZoneMeta {
  key: ReadinessZone;
  label: string;
  color: string;
  icon: string;
  desc: string;
}

export const ZONE_META: Record<ReadinessZone, ZoneMeta> = {
  push: {
    key: 'push',
    label: 'Push Day',
    color: '#22c55e',
    icon: 'rocket-outline',
    desc: 'You\'re firing on all cylinders. Push intensity and volume today.',
  },
  normal: {
    key: 'normal',
    label: 'Normal Day',
    color: '#3b82f6',
    icon: 'checkmark-circle-outline',
    desc: 'Solid readiness. Train as planned — full session, full intent.',
  },
  deload: {
    key: 'deload',
    label: 'Deload Day',
    color: '#f59e0b',
    icon: 'trending-down-outline',
    desc: 'Reduce volume and intensity. Focus on movement quality over load.',
  },
  rest: {
    key: 'rest',
    label: 'Active Recovery',
    color: '#ef4444',
    icon: 'bed-outline',
    desc: 'Your body is telling you to recover. Light movement only — no heavy lifting.',
  },
};

/** Volume multiplier per zone */
export const ZONE_VOLUME_MULTIPLIER: Record<ReadinessZone, number> = {
  push: 1.0,
  normal: 1.0,
  deload: 0.6,
  rest: 0.3,
};

/** Blocks to skip in rest zone */
export const REST_SKIP_BLOCKS: BlockKey[] = [
  'cns-primer',
  'primary-lift',
  'secondary-lift',
  'conditioning',
];

/** Blocks to reduce in deload zone */
export const DELOAD_REDUCE_BLOCKS: BlockKey[] = [
  'cns-primer',
  'primary-lift',
  'secondary-lift',
  'conditioning',
];

/**
 * Adjust exercise counts per block based on readiness zone.
 * Returns the modified count for a given block.
 */
export function getAdjustedBlockCount(
  blockKey: BlockKey,
  baseCount: number,
  zone: ReadinessZone,
): number {
  if (zone === 'push' || zone === 'normal') return baseCount;

  if (zone === 'rest') {
    if (REST_SKIP_BLOCKS.includes(blockKey)) return 0;
    return Math.max(1, Math.ceil(baseCount * 0.5));
  }

  // deload
  if (DELOAD_REDUCE_BLOCKS.includes(blockKey)) {
    return Math.max(1, Math.ceil(baseCount * 0.6));
  }
  return baseCount;
}

/**
 * Adjust sets string for deload/rest zones.
 * e.g. "4 × 5" → "3 × 5" (deload) or "2 × 5" (rest)
 */
export function adjustSets(sets: string, zone: ReadinessZone): string {
  if (zone === 'push' || zone === 'normal') return sets;

  // Try to parse "N × M" or "N x M" pattern
  const match = sets.match(/^(\d+)\s*[×x]\s*(.+)$/i);
  if (!match) return sets;

  const setCount = parseInt(match[1], 10);
  const reps = match[2];

  if (zone === 'rest') {
    const newSets = Math.max(1, Math.ceil(setCount * 0.5));
    return `${newSets} × ${reps}`;
  }

  // deload: reduce sets by ~25%
  const newSets = Math.max(1, Math.ceil(setCount * 0.75));
  return `${newSets} × ${reps}`;
}
