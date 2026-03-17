import type {
  OtcsArchetype,
  OtcsPosition,
  OtcsDeficiency,
  OtcsMonthTemplate,
  OtcsDayKey,
  OtcsBlockKey,
  OtcsPositionTweak,
  OtcsDeficiencyOverride,
} from './otcs-types';

/* ── Static (month 1-6) ── */
import staticMonth1 from './otcs-static-month-1';
import staticMonth2 from './otcs-static-month-2';
import staticMonth3 from './otcs-static-month-3';
import staticMonth4 from './otcs-static-month-4';
import staticMonth5 from './otcs-static-month-5';
import staticMonth6 from './otcs-static-month-6';

/* ── Spring (month 1-6) ── */
import springMonth1 from './otcs-spring-month-1';
import springMonth2 from './otcs-spring-month-2';
import springMonth3 from './otcs-spring-month-3';
import springMonth4 from './otcs-spring-month-4';
import springMonth5 from './otcs-spring-month-5';
import springMonth6 from './otcs-spring-month-6';

/* ── Hybrid (month 1-6) ── */
import hybridMonth1 from './otcs-hybrid-month-1';
import hybridMonth2 from './otcs-hybrid-month-2';
import hybridMonth3 from './otcs-hybrid-month-3';
import hybridMonth4 from './otcs-hybrid-month-4';
import hybridMonth5 from './otcs-hybrid-month-5';
import hybridMonth6 from './otcs-hybrid-month-6';

import { OTCS_POSITION_TWEAKS, OTCS_DEFICIENCY_OVERRIDES } from './otcs-subs';

/* ────────────────────────────────────────────────────
 * OTC-S PROGRAM BARREL
 *
 * Provides template lookup by archetype + month,
 * and modifier lookup for position/deficiency.
 * ──────────────────────────────────────────────────── */

/* ─── Template Registry ──────────────────────────── */

const TEMPLATES: Record<OtcsArchetype, OtcsMonthTemplate[]> = {
  static: [staticMonth1, staticMonth2, staticMonth3, staticMonth4, staticMonth5, staticMonth6],
  spring: [springMonth1, springMonth2, springMonth3, springMonth4, springMonth5, springMonth6],
  hybrid: [hybridMonth1, hybridMonth2, hybridMonth3, hybridMonth4, hybridMonth5, hybridMonth6],
};

/**
 * Get the base template for a given archetype and month (1-indexed).
 */
export function getTemplate(archetype: OtcsArchetype, month: number): OtcsMonthTemplate {
  const months = TEMPLATES[archetype];
  return months[Math.max(0, Math.min(month - 1, 5))];
}

/**
 * Get all 6 month templates for an archetype.
 */
export function getAllTemplates(archetype: OtcsArchetype): OtcsMonthTemplate[] {
  return TEMPLATES[archetype];
}

/* ─── Position Tweak Lookup ──────────────────────── */

export function getPositionTweak(
  monthNumber: number,
  dayKey: OtcsDayKey,
  blockKey: OtcsBlockKey,
  exerciseIndex: number,
  position: OtcsPosition,
): OtcsPositionTweak | undefined {
  return OTCS_POSITION_TWEAKS.find(
    (t) =>
      t.monthNumber === monthNumber &&
      t.dayKey === dayKey &&
      t.blockKey === blockKey &&
      t.exerciseIndex === exerciseIndex &&
      t.position === position,
  );
}

/* ─── Deficiency Override Lookup ──────────────────── */

export function getDeficiencyOverride(
  monthNumber: number,
  dayKey: OtcsDayKey,
  blockKey: OtcsBlockKey,
  exerciseIndex: number,
  deficiency: OtcsDeficiency,
): OtcsDeficiencyOverride | undefined {
  return OTCS_DEFICIENCY_OVERRIDES.find(
    (o) =>
      o.monthNumber === monthNumber &&
      o.dayKey === dayKey &&
      o.blockKey === blockKey &&
      o.exerciseIndex === exerciseIndex &&
      o.deficiency === deficiency,
  );
}

/* ─── Re-exports ─────────────────────────────────── */

export { OTCS_POSITION_TWEAKS, OTCS_DEFICIENCY_OVERRIDES };
