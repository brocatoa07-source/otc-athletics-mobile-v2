/* ────────────────────────────────────────────────
 * DRILL RECOMMENDATION ENGINE
 *
 * Takes athlete context → returns a small, ranked
 * drill stack (max 4 drills).
 *
 * Sits ON TOP of existing Quick Fix pools.
 * Does not modify QUICK_FIXES, ISSUE_TO_QUICKFIX,
 * or any scoring/diagnostic logic.
 *
 * Consumers: Daily Work, My Path, Troubleshooting,
 * future AI assistant ("Broc").
 * ──────────────────────────────────────────────── */

import type { MechanicalIssue } from '@/data/hitting-mechanical-diagnostic-data';
import type { MoverType } from '@/data/hitting-mover-type-data';
import {
  QUICK_FIXES,
  ISSUE_TO_QUICKFIX,
} from '@/data/quick-fix-data';
import {
  getDrillMeta,
  getFoundationDrills,
  type DrillMeta,
} from '@/data/drill-catalog';

/* ─── Types ───────────────────────────────────────── */

export interface RecommendationInput {
  primaryIssue: MechanicalIssue;
  secondaryIssue: MechanicalIssue;
  moverType: MoverType | null;
  age: number | null;
  recentDrills: string[];
}

export interface DrillRecommendation {
  /** 2 drills targeting the primary issue */
  primaryFix: string[];
  /** 1 drill targeting the secondary issue */
  secondarySupport: string[];
  /** 1 foundation/reset drill (youth or unstable pattern) */
  optionalReset: string | null;
  /** Challenge placeholder — reserved for future use */
  challenge: string | null;
}

/* ─── Scoring constants ───────────────────────────── */

const MOVER_AFFINITY_BOOST = 3;
const RECENT_DRILL_PENALTY = -5;
const ROLE_PRIMARY_BOOST = 1;
const ROLE_SUPPORT_BOOST = 0;

/* ─── Secondary fallback (mirrors ISSUE_SECONDARY_QUICKFIX) ── */

const SECONDARY_FALLBACK: Partial<Record<MechanicalIssue, string>> = {
  early_rotation: 'pulling-off',
  barrel_path: 'rolling-over',
  swing_plane: 'barrel-path',
  disconnection: 'rolling-over',
};

/* ─── Helpers ─────────────────────────────────────── */

interface ScoredDrill {
  name: string;
  meta: DrillMeta | undefined;
  score: number;
}

/**
 * Score and rank drills from a pool.
 * Higher score = better fit for this athlete.
 */
function rankDrills(
  pool: string[],
  moverType: MoverType | null,
  recentDrills: Set<string>,
  dayIndex: number,
): ScoredDrill[] {
  return pool
    .map((name, idx) => {
      const meta = getDrillMeta(name);
      let score = 10; // base score

      // Day-based rotation: slight preference for today's rotation slot
      if (idx === dayIndex % pool.length) score += 1;

      // Mover affinity boost
      if (moverType && meta?.moverAffinity.includes(moverType)) {
        score += MOVER_AFFINITY_BOOST;
      }

      // Recency penalty
      if (recentDrills.has(name)) {
        score += RECENT_DRILL_PENALTY;
      }

      // Role boost
      if (meta?.roles.includes('primary')) {
        score += ROLE_PRIMARY_BOOST;
      } else if (meta?.roles.includes('support')) {
        score += ROLE_SUPPORT_BOOST;
      }

      return { name, meta, score };
    })
    .sort((a, b) => b.score - a.score);
}

/**
 * Filter out recent drills unless the pool would become empty.
 */
function filterRecentDrills(
  pool: string[],
  recentDrills: Set<string>,
): string[] {
  const filtered = pool.filter((d) => !recentDrills.has(d));
  return filtered.length > 0 ? filtered : pool;
}

/**
 * Pick an optional reset/foundation drill for youth athletes
 * or when the pattern suggests instability (same primary + secondary).
 */
function getOptionalResetDrill(
  age: number | null,
  primaryIssue: MechanicalIssue,
  secondaryIssue: MechanicalIssue,
  alreadyPicked: Set<string>,
  dayIndex: number,
): string | null {
  const isYouth = age !== null && age <= 14;
  const isUnstable = primaryIssue === secondaryIssue;

  if (!isYouth && !isUnstable) return null;

  const foundations = getFoundationDrills();
  if (foundations.length === 0) return null;

  // Prefer foundations related to the primary issue
  const primaryKey = ISSUE_TO_QUICKFIX[primaryIssue];
  const relevant = foundations.filter(
    (d) => d.issues.includes(primaryKey) && !alreadyPicked.has(d.name),
  );

  if (relevant.length > 0) {
    return relevant[dayIndex % relevant.length].name;
  }

  // Fallback: any foundation not already picked
  const available = foundations.filter((d) => !alreadyPicked.has(d.name));
  if (available.length > 0) {
    return available[dayIndex % available.length].name;
  }

  return foundations[dayIndex % foundations.length].name;
}

/* ─── Main engine ─────────────────────────────────── */

/**
 * Generate a personalized drill recommendation stack.
 *
 * Returns max 4 drills:
 *   - 2 primary fix drills
 *   - 1 secondary support drill
 *   - 1 optional reset/foundation drill
 */
export function getRecommendedDrills(
  input: RecommendationInput,
): DrillRecommendation {
  const {
    primaryIssue,
    secondaryIssue,
    moverType,
    age,
    recentDrills,
  } = input;

  const dayIndex = Math.floor(Date.now() / 86_400_000);
  const recentSet = new Set(recentDrills);
  const picked = new Set<string>();

  // ── Step 1: Resolve quick fix pools ────────────────
  const primaryKey = ISSUE_TO_QUICKFIX[primaryIssue];
  let secondaryKey = ISSUE_TO_QUICKFIX[secondaryIssue];

  if (primaryKey === secondaryKey) {
    secondaryKey =
      SECONDARY_FALLBACK[secondaryIssue] ??
      SECONDARY_FALLBACK[primaryIssue] ??
      Object.keys(QUICK_FIXES).find((k) => k !== primaryKey) ??
      primaryKey;
  }

  const primaryPool = QUICK_FIXES[primaryKey]?.drills ?? [];
  const secondaryPool = QUICK_FIXES[secondaryKey]?.drills ?? [];

  // ── Step 2: Rank primary pool ─────────────────────
  const rankedPrimary = rankDrills(
    filterRecentDrills(primaryPool, recentSet),
    moverType,
    recentSet,
    dayIndex,
  );

  // Pick top 2 from primary
  const primaryFix: string[] = [];
  for (const drill of rankedPrimary) {
    if (primaryFix.length >= 2) break;
    if (!picked.has(drill.name)) {
      primaryFix.push(drill.name);
      picked.add(drill.name);
    }
  }

  // ── Step 3: Rank secondary pool ───────────────────
  const rankedSecondary = rankDrills(
    filterRecentDrills(secondaryPool, recentSet),
    moverType,
    recentSet,
    dayIndex,
  );

  // Pick top 1 from secondary (avoid duplicates)
  const secondarySupport: string[] = [];
  for (const drill of rankedSecondary) {
    if (secondarySupport.length >= 1) break;
    if (!picked.has(drill.name)) {
      secondarySupport.push(drill.name);
      picked.add(drill.name);
    }
  }

  // ── Step 4: Optional reset drill ──────────────────
  const optionalReset = getOptionalResetDrill(
    age,
    primaryIssue,
    secondaryIssue,
    picked,
    dayIndex,
  );

  return {
    primaryFix,
    secondarySupport,
    optionalReset,
    challenge: null,
  };
}

/* ─── Flat output helper ──────────────────────────── */

export interface FlatDrill {
  name: string;
  role: 'primary' | 'secondary' | 'reset';
}

/**
 * Convenience: flatten a DrillRecommendation into an ordered array.
 * Useful for screens that just want a simple drill list.
 */
export function flattenRecommendation(rec: DrillRecommendation): FlatDrill[] {
  const result: FlatDrill[] = [];

  if (rec.optionalReset) {
    result.push({ name: rec.optionalReset, role: 'reset' });
  }

  for (const name of rec.primaryFix) {
    result.push({ name, role: 'primary' });
  }

  for (const name of rec.secondarySupport) {
    result.push({ name, role: 'secondary' });
  }

  return result;
}
