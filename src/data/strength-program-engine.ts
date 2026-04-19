/**
 * OTC STRENGTH PROGRAM ENGINE v3
 *
 * Template-first generation:
 *   1. Look up archetype×month template (18 pre-authored templates)
 *   2. Select days based on daysPerWeek
 *   3. Apply season phase volume/block modifiers
 *   4. Apply week progression (Intro → Volume → Peak → Deload)
 *   5. Apply position modifiers
 *   6. Apply deficiency overrides
 *   7. Apply strength profile overrides (bias injections, swaps, suppressions)
 *
 * Produces meaningfully different programs for different athletes.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  applyProfileOverrides,
  collectBiasTags,
  type GeneratedBlock,
} from '@/features/strength/services/applyProfileOverrides';
import { validateSessionCoherence } from '@/features/strength/services/validateSessionCoherence';
import { auditSessionMetadata } from '@/features/strength/services/auditMetadata';
import {
  type OtcsArchetype,
  type OtcsPosition,
  type OtcsDeficiency,
  type OtcsDaysPerWeek,
  type OtcsSeasonPhase,
  type OtcsMonthTemplate,
  type OtcsDay,
  type OtcsBlock,
  type OtcsExercise,
  type OtcsWeekType,
  type OtcsBlockKey,
  type OtcsDayKey,
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

/* ═══════════════════════════════════════════════════
 * SEASON PHASE → WEEK PROGRESSION SETS
 *
 * Each season phase has its own set/rep scheme per
 * week type. This is the primary volume lever.
 * ═══════════════════════════════════════════════════ */

const SEASON_WEEK_SETS: Record<OtcsSeasonPhase, Record<OtcsWeekType, { sets: number; reps: number }>> = {
  OFFSEASON: {
    intro:  { sets: 3, reps: 6 },
    volume: { sets: 4, reps: 6 },
    peak:   { sets: 5, reps: 5 },
    deload: { sets: 3, reps: 5 },
  },
  PRESEASON: {
    intro:  { sets: 3, reps: 5 },
    volume: { sets: 3, reps: 6 },
    peak:   { sets: 4, reps: 5 },
    deload: { sets: 2, reps: 5 },
  },
  IN_SEASON: {
    intro:  { sets: 2, reps: 6 },
    volume: { sets: 3, reps: 5 },
    peak:   { sets: 3, reps: 4 },
    deload: { sets: 2, reps: 5 },
  },
};

/* ═══════════════════════════════════════════════════
 * SEASON PHASE → BLOCK TRIMMING
 *
 * Controls which blocks are dropped or trimmed per
 * season phase to reduce session density.
 * ═══════════════════════════════════════════════════ */

interface SeasonBlockConfig {
  /** Blocks removed entirely from lift days */
  dropBlocks: OtcsBlockKey[];
  /** Max exercises kept per block (Infinity = no trim) */
  maxExercisesPerBlock: number;
}

const SEASON_BLOCK_CONFIG: Record<OtcsSeasonPhase, SeasonBlockConfig> = {
  OFFSEASON: {
    dropBlocks: [],
    maxExercisesPerBlock: Infinity,
  },
  PRESEASON: {
    dropBlocks: [],
    maxExercisesPerBlock: 3,
  },
  IN_SEASON: {
    dropBlocks: ['accessory-circuit'],
    maxExercisesPerBlock: 2,
  },
};

/* ═══════════════════════════════════════════════════
 * DAYS PER WEEK → DAY SELECTION
 *
 * Each template has 5 days (3 lift + 2 sprint).
 * We select a subset based on the athlete's schedule.
 * ═══════════════════════════════════════════════════ */

/** Day keys selected for each daysPerWeek value. */
const DAY_SELECTION: Record<OtcsDaysPerWeek, OtcsDayKey[]> = {
  1: ['full-power'],
  2: ['lower-accel', 'upper-shoulder'],
  3: ['lower-accel', 'upper-shoulder', 'full-power'],
  4: ['lower-accel', 'upper-shoulder', 'full-power', 'sprint-1'],
  5: ['lower-accel', 'upper-shoulder', 'full-power', 'sprint-1', 'sprint-2'],
};

/**
 * For 1-day programs, we merge essential blocks from all lift days
 * into a single comprehensive session. This ensures the athlete
 * gets power + strength + rotational + shoulder durability in one workout.
 */
function buildSingleDaySession(template: OtcsMonthTemplate): OtcsDay {
  const fullPower = template.days.find(d => d.key === 'full-power');
  const lower = template.days.find(d => d.key === 'lower-accel');
  const upper = template.days.find(d => d.key === 'upper-shoulder');
  const sprint = template.days.find(d => d.key === 'sprint-1');

  // Start with full-power day as the base
  const base = fullPower ?? template.days[0];

  // Build a merged block list — take essential blocks
  const getBlock = (day: OtcsDay | undefined, key: OtcsBlockKey): OtcsBlock | undefined =>
    day?.blocks.find(b => b.key === key);

  const blocks: OtcsBlock[] = [];

  // Plyometrics from full-power (best overall explosive primer)
  const plyo = getBlock(base, 'plyometrics');
  if (plyo) blocks.push({ ...plyo, exercises: plyo.exercises.slice(0, 2) });

  // Loaded power from full-power
  const loadedPower = getBlock(base, 'loaded-power');
  if (loadedPower) blocks.push(loadedPower);

  // Main strength: take first exercise from lower + first from upper for balanced stimulus
  const lowerStrength = getBlock(lower, 'main-strength');
  const upperStrength = getBlock(upper, 'main-strength');
  const mergedStrength: OtcsExercise[] = [];
  if (lowerStrength?.exercises[0]) mergedStrength.push(lowerStrength.exercises[0]);
  if (upperStrength?.exercises[0]) mergedStrength.push(upperStrength.exercises[0]);
  if (mergedStrength.length > 0) {
    blocks.push({ key: 'main-strength', exercises: mergedStrength });
  }

  // Rotational core from full-power
  const rotCore = getBlock(base, 'rotational-core');
  if (rotCore) blocks.push({ ...rotCore, exercises: rotCore.exercises.slice(0, 2) });

  // Shoulder durability from upper
  const shoulderDur = getBlock(upper, 'shoulder-durability') ?? getBlock(base, 'shoulder-durability');
  if (shoulderDur) blocks.push({ ...shoulderDur, exercises: shoulderDur.exercises.slice(0, 2) });

  // Sprint warmup drills (minimal speed exposure)
  const sprintDrills = getBlock(sprint, 'sprint-drills');
  if (sprintDrills) blocks.push({ ...sprintDrills, exercises: sprintDrills.exercises.slice(0, 2) });

  return {
    ...base,
    key: 'full-power',
    dayNumber: 1,
    label: 'Full Body + Speed',
    focus: 'Power + Strength + Rotational + Speed (full body)',
    blocks,
  };
}

function selectDays(template: OtcsMonthTemplate, daysPerWeek: OtcsDaysPerWeek): OtcsDay[] {
  if (daysPerWeek === 1) {
    return [buildSingleDaySession(template)];
  }

  const selectedKeys = DAY_SELECTION[daysPerWeek];
  const days: OtcsDay[] = [];

  for (const key of selectedKeys) {
    const day = template.days.find(d => d.key === key);
    if (day) {
      days.push({ ...day, dayNumber: days.length + 1 });
    }
  }

  return days;
}

const WEEK_LABELS: Record<OtcsWeekType, string> = {
  intro:  'Intro Week',
  volume: 'Volume Week',
  peak:   'Peak Week',
  deload: 'Deload Week',
};

/* ─── Set Adjustment ────────────────────────────── */

/**
 * Adjust sets string based on week type + season phase.
 *
 * Block-aware progression:
 *   - loaded-power: only scale set count, preserve base reps
 *   - all other blocks: scale both sets and reps
 */
function adjustSetsForWeek(
  baseSets: string,
  weekType: OtcsWeekType,
  scales: boolean,
  seasonPhase: OtcsSeasonPhase,
  blockKey?: OtcsBlockKey,
): string {
  if (!scales) return baseSets;

  const { sets, reps } = SEASON_WEEK_SETS[seasonPhase][weekType];

  const match = baseSets.match(/^(\d+)×(\d+)(\/side)?$/);
  if (!match) return baseSets;

  const baseReps = parseInt(match[2], 10);
  const suffix = match[3] ?? '';

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
  seasonPhase: OtcsSeasonPhase,
): OtcsGeneratedExercise {
  return {
    name: exercise.name,
    sets: adjustSetsForWeek(exercise.sets, weekType, exercise.scalesWithWeek ?? false, seasonPhase, blockKey),
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
  seasonPhase: OtcsSeasonPhase,
  maxExercises: number,
): OtcsGeneratedBlock {
  const exercises = block.exercises.slice(0, maxExercises);
  return {
    key: block.key,
    label: getBlockLabel(block.key),
    exercises: exercises.map((ex) => generateExercise(ex, block.key, weekType, seasonPhase)),
  };
}

/* ─── Day Generation ─────────────────────────────── */

/** Optional strength profile data for profile-driven overrides */
interface ProfileOverrideData {
  biasTags: string[];
  avoidTags: string[];
}

function generateDay(
  day: OtcsDay,
  weekType: OtcsWeekType,
  monthNumber: number,
  position: OtcsPosition,
  deficiency: OtcsDeficiency,
  seasonPhase: OtcsSeasonPhase,
  profileOverride?: ProfileOverrideData,
  templatePhase?: string,
): OtcsGeneratedDay {
  const blockConfig = SEASON_BLOCK_CONFIG[seasonPhase];

  let blocks = day.blocks
    .filter((block) => !blockConfig.dropBlocks.includes(block.key))
    .map((block) => {
      const genBlock = generateBlock(block, weekType, seasonPhase, blockConfig.maxExercisesPerBlock);

      // Apply modifiers to each exercise
      for (let i = 0; i < genBlock.exercises.length; i++) {
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
          continue;
        }

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

  // Step 7: Apply strength profile overrides (inject, swap, suppress)
  if (profileOverride && profileOverride.biasTags.length > 0) {
    const overrideResult = applyProfileOverrides(
      blocks as GeneratedBlock[],
      { biasTags: profileOverride.biasTags, avoidTags: profileOverride.avoidTags },
      blockConfig.maxExercisesPerBlock ?? 6,
    );
    blocks = overrideResult.blocks as typeof blocks;

    if (__DEV__ && overrideResult.log.length > 0) {
      console.log(`[program-engine] Profile overrides for ${day.key}:`,
        overrideResult.log.join(' | '));
    }

    // Step 8: Session coherence validation (final cleanup)
    const coherence = validateSessionCoherence(
      blocks as GeneratedBlock[],
      templatePhase ?? 'gpp',
      profileOverride.avoidTags,
      blockConfig.maxExercisesPerBlock ?? 6,
    );
    blocks = coherence.blocks as typeof blocks;

    if (__DEV__ && coherence.warnings.length > 0) {
      console.log(`[program-engine] Coherence for ${day.key}:`,
        coherence.warnings.join(' | '));
    }

    // Step 9: Metadata coverage audit (dev only)
    if (__DEV__) {
      auditSessionMetadata(blocks as GeneratedBlock[], true);
    }
  }

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
  days: OtcsDay[],
  weekIndex: number,
  globalWeekNumber: number,
  monthNumber: number,
  position: OtcsPosition,
  deficiency: OtcsDeficiency,
  seasonPhase: OtcsSeasonPhase,
  profileOverride?: ProfileOverrideData,
  templatePhase?: string,
): OtcsGeneratedWeek {
  const weekType = MONTH_WEEK_ORDER[weekIndex];

  return {
    weekNumber: weekIndex + 1,
    globalWeekNumber,
    weekType,
    weekLabel: WEEK_LABELS[weekType],
    days: days.map((day) =>
      generateDay(day, weekType, monthNumber, position, deficiency, seasonPhase, profileOverride, templatePhase),
    ),
  };
}

/* ═══════════════════════════════════════════════════
 * FULL PROGRAM GENERATION
 *
 * Combines archetype templates with:
 *   - daysPerWeek → day selection
 *   - seasonPhase → volume/block modifiers
 *   - position → exercise substitutions
 *   - deficiency → exercise overrides
 *   - strengthProfile → profile-driven bias overrides
 * ═══════════════════════════════════════════════════ */

/** Optional generated strength profile for profile-driven overrides */
export interface StrengthProfileOverride {
  prep_bias?: string[];
  plyo_bias?: string[];
  sprint_bias?: string[];
  strength_bias?: string[];
  accessory_bias?: string[];
  conditioning_bias?: string[];
  recovery_bias?: string[];
  avoid_overemphasis?: string[];
}

export function generateProgram(profile: {
  archetype: OtcsArchetype;
  position: OtcsPosition;
  deficiency: OtcsDeficiency;
  daysPerWeek?: OtcsDaysPerWeek;
  seasonPhase?: OtcsSeasonPhase;
  /** Program duration in months (1-12). Defaults to 6. */
  programDurationMonths?: number;
  strengthProfile?: StrengthProfileOverride;
}): OtcsGeneratedProgram {
  const daysPerWeek: OtcsDaysPerWeek = profile.daysPerWeek ?? 3;
  const seasonPhase: OtcsSeasonPhase = profile.seasonPhase ?? 'OFFSEASON';
  const totalMonths = Math.max(1, Math.min(12, profile.programDurationMonths ?? 6));

  // Build profile override data if strength profile is provided
  const profileOverride: ProfileOverrideData | undefined = profile.strengthProfile
    ? {
        biasTags: collectBiasTags(profile.strengthProfile),
        avoidTags: profile.strengthProfile.avoid_overemphasis ?? [],
      }
    : undefined;

  if (__DEV__) {
    console.log('[program-engine] Generating:', totalMonths, 'months,',
      daysPerWeek, 'days/week,', seasonPhase,
      profileOverride ? `(${profileOverride.biasTags.length} bias tags)` : '');
  }

  const months: OtcsGeneratedMonth[] = [];
  let globalWeek = 0;

  for (let m = 1; m <= totalMonths; m++) {
    // Templates cycle through 1-6, so month 7 reuses month 1 template, etc.
    const templateMonth = ((m - 1) % 6) + 1;
    const template = getTemplate(profile.archetype, templateMonth);
    const phaseMeta = OTCS_PHASE_META[template.phase];

    // Select days based on frequency
    const selectedDays = selectDays(template, daysPerWeek);

    const weeks: OtcsGeneratedWeek[] = [];
    for (let w = 0; w < 4; w++) {
      globalWeek++;
      weeks.push(
        generateWeek(selectedDays, w, globalWeek, m, profile.position, profile.deficiency, seasonPhase, profileOverride, template.phase),
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
    daysPerWeek,
    seasonPhase,
    months,
    totalWeeks: totalMonths * 4,
    generatedAt: new Date().toISOString(),
    version: 3,
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
  /** ISO date (YYYY-MM-DD) of the last completed workout — used for daily gating */
  lastCompletedDate?: string;
}

export async function saveGeneratedProgram(program: OtcsGeneratedProgram): Promise<void> {
  if (__DEV__) {
    console.log('[strength-engine] saveGeneratedProgram — daysPerWeek:', program.daysPerWeek,
      'seasonPhase:', program.seasonPhase, 'months:', program.months.length,
      'days/month1:', program.months[0]?.weeks[0]?.days.length);
  }
  await AsyncStorage.setItem(PROGRAM_STORAGE_KEY, JSON.stringify(program));
}

export async function loadGeneratedProgram(): Promise<OtcsGeneratedProgram | null> {
  try {
    const raw = await AsyncStorage.getItem(PROGRAM_STORAGE_KEY);
    if (!raw) {
      if (__DEV__) console.log('[strength-engine] loadGeneratedProgram — no stored program');
      return null;
    }
    const parsed = JSON.parse(raw);
    // v1/v2 programs lack new fields — return null to force re-generation
    if (!parsed.version || parsed.version < 3) {
      if (__DEV__) console.log('[strength-engine] loadGeneratedProgram — stale version:', parsed.version);
      return null;
    }
    // v3 programs generated before daysPerWeek/seasonPhase support lack those fields —
    // return null to force re-generation with current profile settings
    if (parsed.daysPerWeek == null || parsed.seasonPhase == null) {
      if (__DEV__) console.log('[strength-engine] loadGeneratedProgram — missing daysPerWeek/seasonPhase, forcing regen');
      return null;
    }
    if (__DEV__) {
      console.log('[strength-engine] loadGeneratedProgram — loaded OK, daysPerWeek:',
        parsed.daysPerWeek, 'seasonPhase:', parsed.seasonPhase);
    }
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Load program and validate it matches the current stored profile.
 * Returns null if program settings (daysPerWeek, seasonPhase) diverge from
 * the saved profile, forcing the UI to show "regenerate" state.
 */
export async function loadValidatedProgram(): Promise<OtcsGeneratedProgram | null> {
  const [program, profileRaw] = await Promise.all([
    loadGeneratedProgram(),
    AsyncStorage.getItem('otc:strength-profile'),
  ]);
  if (!program) return null;
  if (!profileRaw) return program; // no profile to compare — use program as-is

  try {
    const p = JSON.parse(profileRaw);
    const profileDays = p.daysPerWeek ?? 3;
    const profileSeason = p.seasonPhase ?? 'OFFSEASON';
    const profileArchetype = p.archetype ?? null;
    const profilePosition = p.position ?? null;
    const profileDeficiency = p.deficiency ?? null;

    const mismatch =
      program.daysPerWeek !== profileDays ||
      program.seasonPhase !== profileSeason ||
      program.archetype !== profileArchetype ||
      program.position !== profilePosition ||
      program.deficiency !== profileDeficiency;

    if (mismatch) {
      if (__DEV__) {
        console.log('[strength-engine] loadValidatedProgram — profile/program MISMATCH, forcing regen.', {
          programDays: program.daysPerWeek, profileDays,
          programSeason: program.seasonPhase, profileSeason,
          programArchetype: program.archetype, profileArchetype,
          programPosition: program.position, profilePosition,
          programDeficiency: program.deficiency, profileDeficiency,
        });
      }
      return null;
    }
  } catch {
    // profile parse failed — use program as-is
  }
  return program;
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

/**
 * Regenerate a program from the saved profile.
 * Loads the stored profile, generates a fresh program, saves it, and resets progress.
 * Returns the new program, or null if no valid profile exists.
 */
export async function regenerateFromProfile(
  /** Optional generated strength profile biases from Supabase */
  strengthProfileBiases?: StrengthProfileOverride,
): Promise<OtcsGeneratedProgram | null> {
  try {
    const { loadStrengthProfile } = await import('./strength-profile');
    const profile = await loadStrengthProfile();
    if (!profile) {
      if (__DEV__) console.log('[strength-engine] regenerateFromProfile — no profile found');
      return null;
    }

    if (__DEV__) {
      console.log('[strength-engine] regenerateFromProfile — generating from profile:',
        { archetype: profile.archetype, position: profile.position, deficiency: profile.deficiency,
          daysPerWeek: profile.daysPerWeek, seasonPhase: profile.seasonPhase,
          hasStrengthProfile: !!strengthProfileBiases });
    }

    const program = generateProgram({
      ...profile,
      strengthProfile: strengthProfileBiases,
    });
    await saveGeneratedProgram(program);
    await initStrengthProgress();

    if (__DEV__) {
      console.log('[strength-engine] regenerateFromProfile — OK, months:', program.months.length,
        'daysPerWeek:', program.daysPerWeek, 'seasonPhase:', program.seasonPhase);
    }

    return program;
  } catch (err) {
    console.error('[strength-engine] regenerateFromProfile FAILED:', err);
    return null;
  }
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
/**
 * Get today's workout. Enforces one-lift-per-day rule:
 * - If today's lift is already completed, returns it with `alreadyDone: true`
 * - If a lift was completed today, the next lift is locked until tomorrow
 * - At midnight local time, the next lift becomes available
 */
export function getNextWorkout(
  program: OtcsGeneratedProgram,
  progress: StrengthProgress,
): { month: number; week: number; day: number; workout: OtcsGeneratedDay; alreadyDone?: boolean } | null {
  const today = new Date().toISOString().slice(0, 10);

  // If a workout was already completed today, return it as done (no advancement)
  if (progress.lastCompletedDate === today) {
    // Find the workout that was last completed today
    const monthData = program.months[progress.currentMonth - 1];
    if (!monthData) return null;
    const weekData = monthData.weeks[progress.currentWeek - 1];
    if (!weekData) return null;

    // Find the most recently completed workout in current context
    for (const workout of [...weekData.days].reverse()) {
      const key = getWorkoutKey(progress.currentMonth, progress.currentWeek, workout.dayNumber);
      if (progress.completedWorkouts[key]) {
        return {
          month: progress.currentMonth,
          week: progress.currentWeek,
          day: workout.dayNumber,
          workout,
          alreadyDone: true,
        };
      }
    }
  }

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
