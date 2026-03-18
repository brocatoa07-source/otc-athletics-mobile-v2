import { Ionicons } from '@expo/vector-icons';

/* ────────────────────────────────────────────────────
 * OTC STRENGTH (OTC-S) PERIODIZED SYSTEM — Types
 *
 * 3 archetypes × 6 months = 18 templates
 * 5 days/week: 3 lift + 2 sprint
 * Lift days: 7 blocks per session
 * Sprint days: 4 blocks per session
 * 4-week progression: Intro → Volume → Peak → Deload
 * ──────────────────────────────────────────────────── */

/* ─── Archetype ──────────────────────────────────── */

export type OtcsArchetype = 'static' | 'spring' | 'hybrid';

/* ─── Block Keys ─────────────────────────────────── */

/** 7-block lift session structure */
export type OtcsLiftBlockKey =
  | 'plyometrics'
  | 'loaded-power'
  | 'main-strength'
  | 'antagonist'
  | 'accessory-circuit'
  | 'rotational-core'
  | 'shoulder-durability';

/** 4-block sprint session structure */
export type OtcsSprintBlockKey =
  | 'sprint-warmup'
  | 'sprint-drills'
  | 'sprint-work'
  | 'sprint-cooldown';

export type OtcsBlockKey = OtcsLiftBlockKey | OtcsSprintBlockKey;

/* ─── Day Keys ───────────────────────────────────── */

export type OtcsLiftDayKey = 'lower-accel' | 'upper-shoulder' | 'full-power';
export type OtcsSprintDayKey = 'sprint-1' | 'sprint-2';
export type OtcsDayKey = OtcsLiftDayKey | OtcsSprintDayKey;

/* ─── Week Progression ───────────────────────────── */

export type OtcsWeekType = 'intro' | 'volume' | 'peak' | 'deload';

export interface OtcsWeekProgression {
  type: OtcsWeekType;
  label: string;
  setsMultiplier: string; // e.g. '3×6', '4×6', '5×5', '3×5'
}

export const WEEK_PROGRESSIONS: Record<OtcsWeekType, OtcsWeekProgression> = {
  intro:  { type: 'intro',  label: 'Intro Week',  setsMultiplier: '3×6' },
  volume: { type: 'volume', label: 'Volume Week', setsMultiplier: '4×6' },
  peak:   { type: 'peak',   label: 'Peak Week',   setsMultiplier: '5×5' },
  deload: { type: 'deload', label: 'Deload Week', setsMultiplier: '3×5' },
};

export const MONTH_WEEK_ORDER: OtcsWeekType[] = ['intro', 'volume', 'peak', 'deload'];

/* ─── Exercise & Block ───────────────────────────── */

export interface OtcsExercise {
  name: string;
  /** Base sets string — adjusted by week progression for main lifts */
  sets: string;
  cue: string;
  videoUrl?: string;
  rest?: string;
  /** If true, sets are adjusted by week progression */
  scalesWithWeek?: boolean;
}

export interface OtcsBlock {
  key: OtcsBlockKey;
  exercises: OtcsExercise[];
  defaultRest?: string;
}

/* ─── Day ────────────────────────────────────────── */

export interface OtcsDay {
  key: OtcsDayKey;
  dayNumber: number;
  label: string;
  accent: string;
  focus: string;
  type: 'lift' | 'sprint';
  blocks: OtcsBlock[];
}

/* ─── Month Template ─────────────────────────────── */

export type OtcsPhaseName =
  | 'foundation'
  | 'strength-dev'
  | 'power-build'
  | 'max-force'
  | 'max-velocity'
  | 'performance-peak';

export interface OtcsMonthTemplate {
  monthNumber: number;
  archetype: OtcsArchetype;
  phase: OtcsPhaseName;
  title: string;
  subtitle: string;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
  volumeLevel: 'low' | 'moderate' | 'high';
  intensityLevel: 'low' | 'moderate' | 'high';
  keyFocus: string[];
  days: OtcsDay[];
}

/* ─── Position Modifiers ─────────────────────────── */

export type OtcsPosition = 'outfielder' | 'infielder' | 'catcher';

export interface OtcsPositionTweak {
  monthNumber: number;
  dayKey: OtcsDayKey;
  blockKey: OtcsBlockKey;
  exerciseIndex: number;
  position: OtcsPosition;
  /** Replace exercise name */
  altName: string;
  altSets?: string;
  note: string;
}

/* ─── Deficiency Overrides ───────────────────────── */

export type OtcsDeficiency = 'hip_mobility' | 'shoulder_stability' | 'acceleration_weakness';

export interface OtcsDeficiencyOverride {
  monthNumber: number;
  dayKey: OtcsDayKey;
  blockKey: OtcsBlockKey;
  exerciseIndex: number;
  deficiency: OtcsDeficiency;
  altName: string;
  altSets?: string;
  note: string;
}

/* ─── Generated Program (output of engine) ───────── */

export interface OtcsGeneratedExercise {
  name: string;
  sets: string;
  cue: string;
  rest?: string;
  blockKey: OtcsBlockKey;
  isModified: boolean;
  modifiedBy?: 'position' | 'deficiency';
  modNote?: string;
}

export interface OtcsGeneratedBlock {
  key: OtcsBlockKey;
  label: string;
  exercises: OtcsGeneratedExercise[];
}

export interface OtcsGeneratedDay {
  key: OtcsDayKey;
  dayNumber: number;
  label: string;
  accent: string;
  focus: string;
  type: 'lift' | 'sprint';
  blocks: OtcsGeneratedBlock[];
}

export interface OtcsGeneratedWeek {
  weekNumber: number;
  globalWeekNumber: number;
  weekType: OtcsWeekType;
  weekLabel: string;
  days: OtcsGeneratedDay[];
}

export interface OtcsGeneratedMonth {
  month: number;
  phase: OtcsPhaseName;
  title: string;
  subtitle: string;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
  phaseLabel: string;
  weeks: OtcsGeneratedWeek[];
}

export type OtcsDaysPerWeek = 1 | 2 | 3 | 4 | 5;
export type OtcsSeasonPhase = 'IN_SEASON' | 'PRESEASON' | 'OFFSEASON';

export interface OtcsGeneratedProgram {
  archetype: OtcsArchetype;
  position: OtcsPosition;
  deficiency: OtcsDeficiency;
  daysPerWeek: OtcsDaysPerWeek;
  seasonPhase: OtcsSeasonPhase;
  months: OtcsGeneratedMonth[];
  totalWeeks: number;
  generatedAt: string;
  version: 3;
}

/* ─── Block Metadata (for UI) ────────────────────── */

export interface OtcsBlockMeta {
  key: OtcsBlockKey;
  label: string;
  tagline: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

export const OTCS_LIFT_BLOCKS: OtcsBlockMeta[] = [
  { key: 'plyometrics',        label: 'Plyometrics',         tagline: 'CNS primer + explosive prep',          icon: 'flash-outline',   color: '#f59e0b' },
  { key: 'loaded-power',       label: 'Loaded Power',        tagline: 'Explosive loaded movements',           icon: 'rocket-outline',  color: '#ef4444' },
  { key: 'main-strength',      label: 'Main Strength',       tagline: 'Primary strength superset',            icon: 'barbell-outline', color: '#3b82f6' },
  { key: 'antagonist',         label: 'Antagonist Superset',  tagline: 'Opposing muscle balance',             icon: 'repeat-outline',  color: '#8b5cf6' },
  { key: 'accessory-circuit',  label: 'Accessory Circuit',   tagline: 'Weak point targeting',                 icon: 'shield-outline',  color: '#06b6d4' },
  { key: 'rotational-core',    label: 'Rotational Core',     tagline: 'Anti-rotation + rotational power',     icon: 'sync-outline',    color: '#f97316' },
  { key: 'shoulder-durability', label: 'Shoulder Durability', tagline: 'Arm care + scap health',               icon: 'fitness-outline', color: '#22c55e' },
];

export const OTCS_SPRINT_BLOCKS: OtcsBlockMeta[] = [
  { key: 'sprint-warmup',   label: 'Sprint Warmup',   tagline: 'Dynamic prep for speed work',    icon: 'body-outline',        color: '#22c55e' },
  { key: 'sprint-drills',   label: 'Sprint Drills',   tagline: 'Mechanics + technique work',      icon: 'walk-outline',        color: '#f59e0b' },
  { key: 'sprint-work',     label: 'Sprint Work',     tagline: 'Main speed/acceleration training', icon: 'speedometer-outline', color: '#ef4444' },
  { key: 'sprint-cooldown', label: 'Sprint Cooldown', tagline: 'Recovery + tissue care',           icon: 'heart-outline',       color: '#3b82f6' },
];

export const OTCS_ALL_BLOCKS: OtcsBlockMeta[] = [...OTCS_LIFT_BLOCKS, ...OTCS_SPRINT_BLOCKS];

/* ─── Day Config Metadata ────────────────────────── */

export const OTCS_DAY_CONFIG: { key: OtcsDayKey; label: string; accent: string; type: 'lift' | 'sprint' }[] = [
  { key: 'lower-accel',     label: 'Lower + Accel',    accent: '#22c55e', type: 'lift' },
  { key: 'upper-shoulder',  label: 'Upper + Shoulder',  accent: '#3b82f6', type: 'lift' },
  { key: 'full-power',      label: 'Full Body Power',   accent: '#ef4444', type: 'lift' },
  { key: 'sprint-1',        label: 'Sprint Day 1',      accent: '#f59e0b', type: 'sprint' },
  { key: 'sprint-2',        label: 'Sprint Day 2',      accent: '#8b5cf6', type: 'sprint' },
];

/* ─── Phase Metadata ─────────────────────────────── */

export const OTCS_PHASE_META: Record<OtcsPhaseName, { label: string; color: string; description: string }> = {
  'foundation':       { label: 'Foundation',       color: '#22c55e', description: 'Movement quality, mobility, tissue prep, acceleration mechanics, base strength' },
  'strength-dev':     { label: 'Strength Dev',     color: '#3b82f6', description: 'Force output, squat/hinge strength, acceleration power' },
  'power-build':      { label: 'Power Build',      color: '#8b5cf6', description: 'Convert strength to power, Olympic lifts, explosive sprints, rotational velocity' },
  'max-force':        { label: 'Max Force',         color: '#ef4444', description: 'Highest force phase, resisted speed, rotational torque' },
  'max-velocity':     { label: 'Max Velocity',      color: '#f59e0b', description: 'Sprint speed, elastic power, speed expression, lower volume strength' },
  'performance-peak': { label: 'Performance Peak',  color: '#e11d48', description: 'Baseball transfer, speed maintenance, explosive power, durability' },
};

export const MONTH_PHASE_MAP: OtcsPhaseName[] = [
  'foundation',
  'strength-dev',
  'power-build',
  'max-force',
  'max-velocity',
  'performance-peak',
];
