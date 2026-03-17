/**
 * OTC STRENGTH PROGRAM ENGINE v2
 *
 * Template-first generation:
 *   1. Look up archetype×month template (18 pre-authored templates)
 *   2. Apply week progression (Intro → Volume → Peak → Deload)
 *   3. Apply position modifiers
 *   4. Apply deficiency overrides
 *
 * Produces meaningfully different programs for different athletes.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  type OtcsArchetype,
  type OtcsPosition,
  type OtcsDeficiency,
  type OtcsMonthTemplate,
  type OtcsDay,
  type OtcsBlock,
  type OtcsExercise,
  type OtcsWeekType,
  type OtcsBlockKey,
  type OtcsGeneratedExercise,
  type OtcsGeneratedBlock,
  type OtcsGeneratedDay,
  type OtcsGeneratedWeek,
  type OtcsGeneratedMonth,
  type OtcsGeneratedProgram,
  MONTH_WEEK_ORDER,
  OTCS_PHASE_META,
  OTCS_ALL_BLOCKS,
} from './otcs-types';
import { getTemplate, getPositionTweak, getDeficiencyOverride } from './otcs-program';

// Re-export types for consumers
export type {
  OtcsGeneratedExercise,
  OtcsGeneratedBlock,
  OtcsGeneratedDay,
  OtcsGeneratedWeek,
  OtcsGeneratedMonth,
  OtcsGeneratedProgram,
} from './otcs-types';

// Backward-compat aliases for old types
export type GeneratedExercise = OtcsGeneratedExercise;
export type GeneratedWorkout = OtcsGeneratedDay;
export type GeneratedWeek = OtcsGeneratedWeek;
export type GeneratedMonth = OtcsGeneratedMonth;
export type GeneratedProgram = OtcsGeneratedProgram;

/* ─── Week Progression Sets ──────────────────────── */

const WEEK_SETS: Record<OtcsWeekType, { sets: number; reps: number }> = {
  intro:  { sets: 3, reps: 6 },
  volume: { sets: 4, reps: 6 },
  peak:   { sets: 5, reps: 5 },
  deload: { sets: 3, reps: 5 },
};

const WEEK_LABELS: Record<OtcsWeekType, string> = {
  intro:  'Intro Week',
  volume: 'Volume Week',
  peak:   'Peak Week',
  deload: 'Deload Week',
};

/**
 * Adjust sets string based on week type for exercises that scale.
 *
 * Block-aware progression:
 *   - loaded-power: only scale set count, preserve base reps (e.g. 3×3 → 4×3 → 5×3 → 3×3)
 *   - all other blocks: scale both sets and reps (e.g. 3×6 → 4×6 → 5×5 → 3×5)
 */
function adjustSetsForWeek(
  baseSets: string,
  weekType: OtcsWeekType,
  scales: boolean,
  blockKey?: OtcsBlockKey,
): string {
  if (!scales) return baseSets;

  const { sets, reps } = WEEK_SETS[weekType];

  // Parse base sets to determine format (e.g. "3×6", "3×4/side", "3×3")
  const match = baseSets.match(/^(\d+)×(\d+)(\/side)?$/);
  if (!match) return baseSets; // Can't parse — return as-is

  const baseReps = parseInt(match[2], 10);
  const suffix = match[3] ?? '';

  // Loaded power: preserve base reps, only scale set count
  if (blockKey === 'loaded-power') {
    return `${sets}×${baseReps}${suffix}`;
  }

  return `${sets}×${reps}${suffix}`;
}

/* ─── Block Label Lookup ─────────────────────────── */

function getBlockLabel(key: OtcsBlockKey): string {
  return OTCS_ALL_BLOCKS.find((b) => b.key === key)?.label ?? key;
}

/* ─── Exercise Generation ────────────────────────── */

function generateExercise(
  exercise: OtcsExercise,
  blockKey: OtcsBlockKey,
  weekType: OtcsWeekType,
): OtcsGeneratedExercise {
  return {
    name: exercise.name,
    sets: adjustSetsForWeek(exercise.sets, weekType, exercise.scalesWithWeek ?? false, blockKey),
    cue: exercise.cue,
    rest: exercise.rest,
    blockKey,
    isModified: false,
  };
}

/* ─── Block Generation ───────────────────────────── */

function generateBlock(
  block: OtcsBlock,
  weekType: OtcsWeekType,
): OtcsGeneratedBlock {
  return {
    key: block.key,
    label: getBlockLabel(block.key),
    exercises: block.exercises.map((ex) => generateExercise(ex, block.key, weekType)),
  };
}

/* ─── Day Generation ─────────────────────────────── */

function generateDay(
  day: OtcsDay,
  weekType: OtcsWeekType,
  monthNumber: number,
  position: OtcsPosition,
  deficiency: OtcsDeficiency,
): OtcsGeneratedDay {
  const blocks = day.blocks.map((block) => {
    const genBlock = generateBlock(block, weekType);

    // Apply modifiers to each exercise
    for (let i = 0; i < genBlock.exercises.length; i++) {
      // Deficiency overrides take priority
      const defOverride = getDeficiencyOverride(monthNumber, day.key, block.key, i, deficiency);
      if (defOverride) {
        genBlock.exercises[i] = {
          ...genBlock.exercises[i],
          name: defOverride.altName,
          sets: defOverride.altSets ?? genBlock.exercises[i].sets,
          isModified: true,
          modifiedBy: 'deficiency',
          modNote: defOverride.note,
        };
        continue; // Don't also apply position tweak
      }

      // Position tweaks
      const posTweak = getPositionTweak(monthNumber, day.key, block.key, i, position);
      if (posTweak) {
        genBlock.exercises[i] = {
          ...genBlock.exercises[i],
          name: posTweak.altName,
          sets: posTweak.altSets ?? genBlock.exercises[i].sets,
          isModified: true,
          modifiedBy: 'position',
          modNote: posTweak.note,
        };
      }
    }

    return genBlock;
  });

  return {
    key: day.key,
    dayNumber: day.dayNumber,
    label: day.label,
    accent: day.accent,
    focus: day.focus,
    type: day.type,
    blocks,
  };
}

/* ─── Week Generation ────────────────────────────── */

function generateWeek(
  template: OtcsMonthTemplate,
  weekIndex: number, // 0-3
  globalWeekNumber: number,
  position: OtcsPosition,
  deficiency: OtcsDeficiency,
): OtcsGeneratedWeek {
  const weekType = MONTH_WEEK_ORDER[weekIndex];

  return {
    weekNumber: weekIndex + 1,
    globalWeekNumber,
    weekType,
    weekLabel: WEEK_LABELS[weekType],
    days: template.days.map((day) =>
      generateDay(day, weekType, template.monthNumber, position, deficiency),
    ),
  };
}

/* ─── Full Program Generation ────────────────────── */

/**
 * Generate the full 6-month OTC-S program from athlete profile.
 *
 * Each archetype gets distinct pre-authored templates.
 * Position and deficiency modifiers further customize the output.
 * Week progression varies sets/reps across the 4-week cycle.
 */
export function generateProgram(profile: {
  archetype: OtcsArchetype;
  position: OtcsPosition;
  deficiency: OtcsDeficiency;
}): OtcsGeneratedProgram {
  const months: OtcsGeneratedMonth[] = [];
  let globalWeek = 0;

  for (let m = 1; m <= 6; m++) {
    const template = getTemplate(profile.archetype, m);
    const phaseMeta = OTCS_PHASE_META[template.phase];

    const weeks: OtcsGeneratedWeek[] = [];
    for (let w = 0; w < 4; w++) {
      globalWeek++;
      weeks.push(
        generateWeek(template, w, globalWeek, profile.position, profile.deficiency),
      );
    }

    months.push({
      month: m,
      phase: template.phase,
      title: template.title,
      subtitle: template.subtitle,
      color: template.color,
      icon: template.icon,
      phaseLabel: phaseMeta.label,
      weeks,
    });
  }

  return {
    archetype: profile.archetype,
    position: profile.position,
    deficiency: profile.deficiency,
    months,
    totalWeeks: 24,
    generatedAt: new Date().toISOString(),
    version: 2,
  };
}

/* ─── Persistence ────────────────────────────────── */

const PROGRAM_STORAGE_KEY = 'otc:strength-program';
const PROGRESS_STORAGE_KEY = 'otc:strength-progress';

export interface StrengthProgress {
  currentMonth: number;   // 1-6
  currentWeek: number;    // 1-4 within month
  completedWorkouts: Record<string, boolean>; // key: "m{month}w{week}d{day}"
  startDate: string;
}

export async function saveGeneratedProgram(program: OtcsGeneratedProgram): Promise<void> {
  await AsyncStorage.setItem(PROGRAM_STORAGE_KEY, JSON.stringify(program));
}

export async function loadGeneratedProgram(): Promise<OtcsGeneratedProgram | null> {
  try {
    const raw = await AsyncStorage.getItem(PROGRAM_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // v1 programs lack version field — return null to force re-generation
    if (!parsed.version || parsed.version < 2) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function loadStrengthProgress(): Promise<StrengthProgress | null> {
  try {
    const raw = await AsyncStorage.getItem(PROGRESS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function saveStrengthProgress(progress: StrengthProgress): Promise<void> {
  await AsyncStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
}

export async function initStrengthProgress(): Promise<StrengthProgress> {
  const progress: StrengthProgress = {
    currentMonth: 1,
    currentWeek: 1,
    completedWorkouts: {},
    startDate: new Date().toISOString().split('T')[0],
  };
  await saveStrengthProgress(progress);
  return progress;
}

export function getWorkoutKey(month: number, week: number, day: number): string {
  return `m${month}w${week}d${day}`;
}

export function getCompletionCount(progress: StrengthProgress): number {
  return Object.values(progress.completedWorkouts).filter(Boolean).length;
}

/**
 * Get the next uncompleted workout for today's work.
 */
export function getNextWorkout(
  program: OtcsGeneratedProgram,
  progress: StrengthProgress,
): { month: number; week: number; day: number; workout: OtcsGeneratedDay } | null {
  const monthData = program.months[progress.currentMonth - 1];
  if (!monthData) return null;

  const weekData = monthData.weeks[progress.currentWeek - 1];
  if (!weekData) return null;

  // Find first uncompleted workout in current week
  for (const workout of weekData.days) {
    const key = getWorkoutKey(progress.currentMonth, progress.currentWeek, workout.dayNumber);
    if (!progress.completedWorkouts[key]) {
      return {
        month: progress.currentMonth,
        week: progress.currentWeek,
        day: workout.dayNumber,
        workout,
      };
    }
  }

  // All workouts in current week done — try next week
  if (progress.currentWeek < 4) {
    const nextWeek = monthData.weeks[progress.currentWeek];
    if (nextWeek && nextWeek.days.length > 0) {
      return {
        month: progress.currentMonth,
        week: progress.currentWeek + 1,
        day: 1,
        workout: nextWeek.days[0],
      };
    }
  }

  // Try next month
  if (progress.currentMonth < 6) {
    const nextMonth = program.months[progress.currentMonth];
    if (nextMonth && nextMonth.weeks[0]?.days[0]) {
      return {
        month: progress.currentMonth + 1,
        week: 1,
        day: 1,
        workout: nextMonth.weeks[0].days[0],
      };
    }
  }

  return null; // Program complete
}
