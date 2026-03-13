/* ────────────────────────────────────────────────
 * MENTAL RECOMMENDATION ENGINE
 *
 * Takes athlete context → returns a small, ranked
 * tool stack (max 3 tools + 1 reflection prompt).
 *
 * Sits ON TOP of existing Mental Quick Fix pools.
 * Does not modify MENTAL_QUICK_FIXES or any
 * scoring/diagnostic logic.
 *
 * Mirrors drillRecommendationEngine.ts architecture.
 * ──────────────────────────────────────────────── */

import type { MentalStruggle } from '@/data/mental-struggles-data';
import type { MentalProfile } from '@/data/mental-profile-data';
import {
  MENTAL_QUICK_FIXES,
  STRUGGLE_TO_QUICKFIX,
  STRUGGLE_SECONDARY_QUICKFIX,
  getMentalToolMeta,
  getReflectionTools,
  type MentalToolMeta,
} from '@/data/mental-tool-catalog';
import type { SkillJournalType } from '@/data/skill-journal-prompts';

/* ─── Types ───────────────────────────────────────── */

export interface MentalRecommendationInput {
  primaryStruggle: MentalStruggle;
  secondaryStruggle: MentalStruggle;
  mentalProfile: MentalProfile | null;
  recentTools: string[];
}

export interface MentalToolRecommendation {
  /** 2 tools targeting the primary struggle */
  primaryTools: string[];
  /** 1 tool targeting the secondary struggle */
  secondarySupport: string[];
  /** 1 reflection prompt (journal type) */
  optionalReflection: string | null;
}

/* ─── Scoring constants ───────────────────────────── */

const PROFILE_AFFINITY_BOOST = 3;
const RECENT_TOOL_PENALTY = -5;
const ROLE_PRIMARY_BOOST = 1;

/* ─── Struggle → Journal type mapping ────────────── */

const STRUGGLE_TO_JOURNAL: Partial<Record<MentalStruggle, SkillJournalType>> = {
  overthinking: 'skill_focus',
  pregame_nerves: 'skill_composure',
  confidence_drop: 'skill_confidence',
  emotional_frustration: 'skill_emotional_control',
  focus_loss: 'skill_focus',
  fear_of_failure: 'skill_resilience',
  burnout: 'skill_awareness',
  imposter_syndrome: 'skill_confidence',
};

/* ─── Helpers ─────────────────────────────────────── */

interface ScoredTool {
  name: string;
  meta: MentalToolMeta | undefined;
  score: number;
}

function rankTools(
  pool: string[],
  mentalProfile: MentalProfile | null,
  recentTools: Set<string>,
  dayIndex: number,
): ScoredTool[] {
  return pool
    .map((name, idx) => {
      const meta = getMentalToolMeta(name);
      let score = 10;

      if (idx === dayIndex % pool.length) score += 1;

      if (mentalProfile && meta?.profileAffinity.includes(mentalProfile)) {
        score += PROFILE_AFFINITY_BOOST;
      }

      if (recentTools.has(name)) {
        score += RECENT_TOOL_PENALTY;
      }

      if (meta?.roles.includes('primary')) {
        score += ROLE_PRIMARY_BOOST;
      }

      return { name, meta, score };
    })
    .sort((a, b) => b.score - a.score);
}

function filterRecentTools(
  pool: string[],
  recentTools: Set<string>,
): string[] {
  const filtered = pool.filter((t) => !recentTools.has(t));
  return filtered.length > 0 ? filtered : pool;
}

function getReflectionForStruggle(
  primaryStruggle: MentalStruggle,
  alreadyPicked: Set<string>,
  dayIndex: number,
): string | null {
  const journalType = STRUGGLE_TO_JOURNAL[primaryStruggle];
  if (journalType) return journalType;

  const reflections = getReflectionTools();
  if (reflections.length === 0) return null;

  const available = reflections.filter((t) => !alreadyPicked.has(t.name));
  if (available.length > 0) {
    return available[dayIndex % available.length].name;
  }

  return reflections[dayIndex % reflections.length].name;
}

/* ─── Main engine ─────────────────────────────────── */

/**
 * Generate a personalized mental tool recommendation stack.
 *
 * Returns max 3 tools + 1 reflection:
 *   - 2 primary tools
 *   - 1 secondary support tool
 *   - 1 optional reflection/journal prompt
 */
export function getRecommendedMentalTools(
  input: MentalRecommendationInput,
): MentalToolRecommendation {
  const {
    primaryStruggle,
    secondaryStruggle,
    mentalProfile,
    recentTools,
  } = input;

  const dayIndex = Math.floor(Date.now() / 86_400_000);
  const recentSet = new Set(recentTools);
  const picked = new Set<string>();

  // ── Step 1: Resolve quick fix pools ────────────────
  const primaryKey = STRUGGLE_TO_QUICKFIX[primaryStruggle];
  let secondaryKey = STRUGGLE_TO_QUICKFIX[secondaryStruggle];

  if (primaryKey === secondaryKey) {
    secondaryKey =
      STRUGGLE_SECONDARY_QUICKFIX[secondaryStruggle] ??
      STRUGGLE_SECONDARY_QUICKFIX[primaryStruggle] ??
      Object.keys(MENTAL_QUICK_FIXES).find((k) => k !== primaryKey) ??
      primaryKey;
  }

  const primaryPool = MENTAL_QUICK_FIXES[primaryKey]?.tools ?? [];
  const secondaryPool = MENTAL_QUICK_FIXES[secondaryKey]?.tools ?? [];

  // ── Step 2: Rank primary pool ─────────────────────
  const rankedPrimary = rankTools(
    filterRecentTools(primaryPool, recentSet),
    mentalProfile,
    recentSet,
    dayIndex,
  );

  const primaryTools: string[] = [];
  for (const tool of rankedPrimary) {
    if (primaryTools.length >= 2) break;
    if (!picked.has(tool.name)) {
      primaryTools.push(tool.name);
      picked.add(tool.name);
    }
  }

  // ── Step 3: Rank secondary pool ───────────────────
  const rankedSecondary = rankTools(
    filterRecentTools(secondaryPool, recentSet),
    mentalProfile,
    recentSet,
    dayIndex,
  );

  const secondarySupport: string[] = [];
  for (const tool of rankedSecondary) {
    if (secondarySupport.length >= 1) break;
    if (!picked.has(tool.name)) {
      secondarySupport.push(tool.name);
      picked.add(tool.name);
    }
  }

  // ── Step 4: Reflection prompt ─────────────────────
  const optionalReflection = getReflectionForStruggle(
    primaryStruggle,
    picked,
    dayIndex,
  );

  return {
    primaryTools,
    secondarySupport,
    optionalReflection,
  };
}

/* ─── Flat output helper ──────────────────────────── */

export interface FlatMentalTool {
  name: string;
  role: 'primary' | 'secondary' | 'reflection';
}

/**
 * Convenience: flatten a MentalToolRecommendation into an ordered array.
 */
export function flattenMentalRecommendation(rec: MentalToolRecommendation): FlatMentalTool[] {
  const result: FlatMentalTool[] = [];

  for (const name of rec.primaryTools) {
    result.push({ name, role: 'primary' });
  }

  for (const name of rec.secondarySupport) {
    result.push({ name, role: 'secondary' });
  }

  if (rec.optionalReflection) {
    result.push({ name: rec.optionalReflection, role: 'reflection' });
  }

  return result;
}
