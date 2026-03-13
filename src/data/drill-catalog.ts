/* ────────────────────────────────────────────────
 * DRILL METADATA CATALOG
 *
 * Lightweight metadata for ranking drills in the
 * recommendation engine. Does NOT duplicate vault
 * drill card content (fixes, howTo, focus, videoUrl).
 *
 * Every drill referenced by QUICK_FIXES or FOUNDATIONS
 * should have an entry here.
 * ──────────────────────────────────────────────── */

import type { MoverType } from './hitting-mover-type-data';

export type DrillRole = 'primary' | 'support' | 'reset' | 'foundation';
export type AgeGroup = 'youth' | 'all';

export interface DrillMeta {
  name: string;
  /** Quick fix categories this drill belongs to */
  issues: string[];
  /** Mover types this drill aligns with. Empty = no bias. */
  moverAffinity: MoverType[];
  /** 'youth' = age ≤ 14 only, 'all' = any age */
  ageGroup: AgeGroup;
  /** What role(s) this drill can serve in a recommendation stack */
  roles: DrillRole[];
}

/* ─── Catalog ─────────────────────────────────────── */

export const DRILL_CATALOG: DrillMeta[] = [
  // ── late pool ──────────────────────────────────────
  {
    name: 'Command Drill',
    issues: ['late'],
    moverAffinity: ['elastic'],
    ageGroup: 'all',
    roles: ['primary'],
  },
  {
    name: 'Swing at Release',
    issues: ['late'],
    moverAffinity: ['elastic'],
    ageGroup: 'all',
    roles: ['primary'],
  },
  {
    name: 'Heel Load Drill',
    issues: ['late'],
    moverAffinity: ['ground_force'],
    ageGroup: 'all',
    roles: ['primary', 'support'],
  },

  // ── lunging pool ───────────────────────────────────
  {
    name: 'Step Back Drill',
    issues: ['lunging'],
    moverAffinity: ['ground_force'],
    ageGroup: 'all',
    roles: ['primary'],
  },
  {
    name: 'Ball Roll Drill',
    issues: ['lunging'],
    moverAffinity: ['ground_force'],
    ageGroup: 'all',
    roles: ['primary', 'support'],
  },
  {
    name: "Belli's Drill",
    issues: ['lunging'],
    moverAffinity: ['ground_force'],
    ageGroup: 'all',
    roles: ['primary'],
  },

  // ── stuck pool ─────────────────────────────────────
  {
    name: 'Happy Gilmore Drill',
    issues: ['stuck'],
    moverAffinity: ['ground_force', 'elastic'],
    ageGroup: 'all',
    roles: ['primary'],
  },
  {
    name: "Hook'em Drill",
    issues: ['stuck'],
    moverAffinity: ['torque_engine'],
    ageGroup: 'all',
    roles: ['primary'],
  },
  {
    name: 'Bat on Shoulder Drill Series',
    issues: ['stuck'],
    moverAffinity: ['torque_engine'],
    ageGroup: 'all',
    roles: ['primary', 'support'],
  },

  // ── losing-posture pool ────────────────────────────
  {
    name: "Freddie's Drill",
    issues: ['losing-posture'],
    moverAffinity: ['linear_momentum'],
    ageGroup: 'all',
    roles: ['primary'],
  },
  {
    name: 'Mo Vaughn Drill',
    issues: ['losing-posture'],
    moverAffinity: ['linear_momentum'],
    ageGroup: 'all',
    roles: ['primary'],
  },
  {
    name: 'PVC Pipe Swings',
    issues: ['losing-posture'],
    moverAffinity: ['linear_momentum'],
    ageGroup: 'all',
    roles: ['primary', 'support'],
  },

  // ── pulling-off pool ───────────────────────────────
  {
    name: 'Trout Step Drill',
    issues: ['pulling-off'],
    moverAffinity: ['ground_force', 'elastic'],
    ageGroup: 'all',
    roles: ['primary'],
  },
  {
    name: 'Finish Over Tee',
    issues: ['pulling-off'],
    moverAffinity: ['linear_momentum'],
    ageGroup: 'all',
    roles: ['primary', 'support'],
  },
  {
    name: 'Bat Throws',
    issues: ['pulling-off'],
    moverAffinity: ['linear_momentum'],
    ageGroup: 'all',
    roles: ['primary'],
  },

  // ── casting pool ───────────────────────────────────
  {
    name: 'Steering Wheel Turns',
    issues: ['casting'],
    moverAffinity: ['torque_engine'],
    ageGroup: 'all',
    roles: ['primary'],
  },
  {
    name: 'Reverse Grip Drill',
    issues: ['casting'],
    moverAffinity: ['torque_engine'],
    ageGroup: 'all',
    roles: ['primary'],
  },
  {
    name: 'Deep Tee Series',
    issues: ['casting'],
    moverAffinity: ['torque_engine'],
    ageGroup: 'all',
    roles: ['primary', 'support'],
  },

  // ── rolling-over pool ──────────────────────────────
  {
    name: 'No Roll Overs',
    issues: ['rolling-over'],
    moverAffinity: ['linear_momentum'],
    ageGroup: 'all',
    roles: ['primary'],
  },
  {
    name: 'Top Hand Bregman Drill',
    issues: ['rolling-over'],
    moverAffinity: ['elastic'],
    ageGroup: 'all',
    roles: ['primary', 'foundation'],
  },
  {
    name: 'Out Front Tee Drill',
    issues: ['rolling-over'],
    moverAffinity: ['elastic'],
    ageGroup: 'all',
    roles: ['primary', 'support'],
  },

  // ── barrel-path pool ───────────────────────────────
  {
    name: 'Snap Series',
    issues: ['barrel-path'],
    moverAffinity: ['torque_engine'],
    ageGroup: 'all',
    roles: ['primary'],
  },
  {
    name: 'Top Hand Open / V-Grip Drill',
    issues: ['barrel-path'],
    moverAffinity: ['torque_engine'],
    ageGroup: 'all',
    roles: ['primary'],
  },
  {
    name: 'Split Grip Stop at Contact',
    issues: ['barrel-path'],
    moverAffinity: ['torque_engine'],
    ageGroup: 'all',
    roles: ['primary', 'support'],
  },

  // ── foundation drills ──────────────────────────────
  {
    name: 'Hold Finish',
    issues: ['losing-posture', 'inconsistent-contact'],
    moverAffinity: [],
    ageGroup: 'youth',
    roles: ['reset', 'foundation'],
  },
  {
    name: 'Slow Motion Swing',
    issues: ['casting', 'stuck'],
    moverAffinity: [],
    ageGroup: 'youth',
    roles: ['reset', 'foundation'],
  },
  {
    name: 'Arráez Drill',
    issues: ['late', 'inconsistent-contact'],
    moverAffinity: [],
    ageGroup: 'youth',
    roles: ['reset', 'foundation'],
  },
  {
    name: 'Bottom Hand Drill',
    issues: ['casting', 'rolling-over'],
    moverAffinity: [],
    ageGroup: 'youth',
    roles: ['reset', 'foundation'],
  },
];

/* ─── Lookup index (built once at import time) ───── */

const _byName = new Map<string, DrillMeta>();
for (const d of DRILL_CATALOG) {
  _byName.set(d.name, d);
}

/** Get drill metadata by name. Returns undefined if not cataloged. */
export function getDrillMeta(name: string): DrillMeta | undefined {
  return _byName.get(name);
}

/** Get all drills that can serve as foundation/reset drills. */
export function getFoundationDrills(): DrillMeta[] {
  return DRILL_CATALOG.filter((d) => d.roles.includes('foundation'));
}

/** Get all drills tagged for a specific issue. */
export function getDrillsForIssue(issueKey: string): DrillMeta[] {
  return DRILL_CATALOG.filter((d) => d.issues.includes(issueKey));
}
