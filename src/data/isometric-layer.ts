import type { Position, TrainingExperience, ScProfile } from '@/hooks/useAthleteScProfile';
import type { Dimension, DeficiencyScores } from '@/data/deficiency-engine';

/* ────────────────────────────────────────────────────
 * ISOMETRIC LAYER
 *
 * Isometric holds build strength at specific joint angles.
 * Critical for baseball athletes:
 *   - Bat lag position (rotational isometrics)
 *   - Landing mechanics (eccentric → iso hold)
 *   - Deceleration control
 *   - Joint stability and injury prevention
 *
 * These can be inserted into the session as supplemental
 * work or as standalone isometric blocks.
 * ──────────────────────────────────────────────────── */

export interface IsometricExercise {
  name: string;
  holdTime: string;
  sets: string;
  cue: string;
  category: IsometricCategory;
  targets: Dimension[];
  positions?: Position[];
  minExperience?: TrainingExperience;
}

export type IsometricCategory =
  | 'lower-body'
  | 'upper-body'
  | 'core-rotational'
  | 'baseball-specific';

export interface IsoCategoryMeta {
  key: IsometricCategory;
  label: string;
  icon: string;
  color: string;
  desc: string;
}

export const ISO_CATEGORIES: IsoCategoryMeta[] = [
  { key: 'lower-body',        label: 'Lower Body Iso',      icon: 'fitness-outline',   color: '#3b82f6', desc: 'Build unbreakable legs and deceleration control.' },
  { key: 'upper-body',        label: 'Upper Body Iso',      icon: 'barbell-outline',   color: '#8b5cf6', desc: 'Shoulder stability and pressing strength.' },
  { key: 'core-rotational',   label: 'Core & Rotational',   icon: 'sync-outline',      color: '#f59e0b', desc: 'Anti-rotation and positional strength through the core.' },
  { key: 'baseball-specific', label: 'Baseball-Specific',   icon: 'baseball-outline',  color: '#ef4444', desc: 'Holds that transfer directly to the swing and throw.' },
];

export const ISOMETRIC_EXERCISES: IsometricExercise[] = [
  /* ─── Lower Body ─── */
  {
    name: 'Wall Sit',
    holdTime: '30-45 sec',
    sets: '3 sets',
    cue: 'Back flat against wall. Thighs parallel to floor. Breathe through it.',
    category: 'lower-body',
    targets: ['strength', 'durability'],
  },
  {
    name: 'Split Squat Iso Hold',
    holdTime: '20-30 sec/side',
    sets: '3 sets',
    cue: 'Bottom of split squat. Front thigh parallel. Vertical torso. Hold.',
    category: 'lower-body',
    targets: ['strength', 'mobility'],
  },
  {
    name: 'RDL Iso Hold (mid-range)',
    holdTime: '15-20 sec',
    sets: '3 sets',
    cue: 'Hinge to mid-shin. Hold. Feel hamstrings loaded. Keep back flat.',
    category: 'lower-body',
    targets: ['strength', 'durability'],
    minExperience: 'intermediate',
  },
  {
    name: 'Single-Leg Glute Bridge Hold',
    holdTime: '20 sec/side',
    sets: '3 sets',
    cue: 'Hips up. One leg extended. Squeeze glute at top. No sagging.',
    category: 'lower-body',
    targets: ['durability', 'strength'],
  },
  {
    name: 'Goblet Squat Pause',
    holdTime: '5 sec pause × 6 reps',
    sets: '3 sets',
    cue: 'Pause at bottom of squat for 5 sec each rep. Maintain form under fatigue.',
    category: 'lower-body',
    targets: ['strength', 'mobility'],
  },
  {
    name: 'Catcher Squat Hold',
    holdTime: '30-45 sec',
    sets: '3 sets',
    cue: 'Deep squat position. Heels down. Elbows inside knees. Breathe.',
    category: 'lower-body',
    targets: ['mobility', 'durability'],
    positions: ['C'],
  },
  {
    name: 'Nordic Eccentric Pause',
    holdTime: '5 sec at 45°',
    sets: '3 × 4 reps',
    cue: 'Lower slowly. Pause halfway down for 5 sec. Control the descent.',
    category: 'lower-body',
    targets: ['strength', 'durability'],
    minExperience: 'intermediate',
  },

  /* ─── Upper Body ─── */
  {
    name: 'Push-Up Iso Hold (bottom)',
    holdTime: '15-20 sec',
    sets: '3 sets',
    cue: 'Lower to 2 inches off floor. Hold. Elbows at 45°. Core braced.',
    category: 'upper-body',
    targets: ['strength'],
  },
  {
    name: 'Chin-Up Bar Hang (flexed arm)',
    holdTime: '15-20 sec',
    sets: '3 sets',
    cue: 'Pull chin over bar. Hold at top. Squeeze lats and biceps.',
    category: 'upper-body',
    targets: ['strength'],
    minExperience: 'intermediate',
  },
  {
    name: 'Dead Hang',
    holdTime: '30-45 sec',
    sets: '3 sets',
    cue: 'Relaxed shoulders. Decompress spine. Grip endurance.',
    category: 'upper-body',
    targets: ['durability', 'mobility'],
  },
  {
    name: 'Overhead Carry Hold',
    holdTime: '20-30 sec/arm',
    sets: '3 sets',
    cue: 'Single DB overhead. Locked arm. Ribs down. Walk or hold in place.',
    category: 'upper-body',
    targets: ['strength', 'durability'],
  },
  {
    name: 'Band Pull-Apart Hold',
    holdTime: '10 sec × 8 reps',
    sets: '3 sets',
    cue: 'Pull band apart. Hold at full retraction for 10 sec. Rear delts fire.',
    category: 'upper-body',
    targets: ['durability'],
  },

  /* ─── Core & Rotational ─── */
  {
    name: 'Pallof Press & Hold',
    holdTime: '10 sec × 6 reps/side',
    sets: '3 sets',
    cue: 'Press out. Hold at full extension. Resist the rotation. Do not let cable win.',
    category: 'core-rotational',
    targets: ['strength', 'durability'],
  },
  {
    name: 'Plank',
    holdTime: '30-60 sec',
    sets: '3 sets',
    cue: 'Elbows under shoulders. Squeeze glutes. No sagging. Breathe.',
    category: 'core-rotational',
    targets: ['durability'],
  },
  {
    name: 'Side Plank',
    holdTime: '25-40 sec/side',
    sets: '3 sets',
    cue: 'Elbow under shoulder. Hips high. Top arm reaches up.',
    category: 'core-rotational',
    targets: ['durability', 'strength'],
  },
  {
    name: 'Half-Kneeling Anti-Rotation Hold',
    holdTime: '15 sec/side',
    sets: '3 sets',
    cue: 'Band or cable at chest height. Arms extended. Resist rotation. Core fires.',
    category: 'core-rotational',
    targets: ['strength', 'power'],
  },
  {
    name: 'Hollow Body Hold',
    holdTime: '20-30 sec',
    sets: '3 sets',
    cue: 'Lower back pressed into floor. Arms overhead. Legs extended. No arch.',
    category: 'core-rotational',
    targets: ['strength', 'durability'],
  },

  /* ─── Baseball-Specific ─── */
  {
    name: 'Bat Lag Position Hold',
    holdTime: '10 sec × 6 reps',
    sets: '3 sets',
    cue: 'Load position with bat. Hands back, front hip open. Hold the separation. Feel the stretch.',
    category: 'baseball-specific',
    targets: ['power', 'mobility'],
  },
  {
    name: 'Landing Iso (stride foot)',
    holdTime: '5 sec × 8 reps',
    sets: '3 sets',
    cue: 'Mimic stride landing. Front foot plants, brace into ground. Hold the block.',
    category: 'baseball-specific',
    targets: ['power', 'durability'],
  },
  {
    name: 'Rotational Cable Hold (mid-swing)',
    holdTime: '8 sec/side',
    sets: '3 × 5 reps/side',
    cue: 'Cable at hip height. Rotate to mid-swing position. Hold. Resist the pull back.',
    category: 'baseball-specific',
    targets: ['power', 'strength'],
  },
  {
    name: 'Throwing Arm Deceleration Hold',
    holdTime: '10 sec/side',
    sets: '3 sets',
    cue: 'Band attached. Arm in follow-through position. Hold against band. Posterior shoulder fires.',
    category: 'baseball-specific',
    targets: ['durability'],
  },
  {
    name: 'Hip Block Iso (catcher)',
    holdTime: '15 sec/side',
    sets: '3 sets',
    cue: 'Athletic stance. Band at knee. Push out and hold. Hip abductors + glute med.',
    category: 'baseball-specific',
    targets: ['durability', 'strength'],
    positions: ['C'],
  },
];

/** Filter isometric exercises based on profile */
export function getFilteredIsometrics(profile: ScProfile): IsometricExercise[] {
  const expRank = { beginner: 0, intermediate: 1, advanced: 2 };

  return ISOMETRIC_EXERCISES.filter((ex) => {
    if (ex.minExperience && expRank[ex.minExperience] > expRank[profile.experience]) {
      return false;
    }
    return true;
  });
}

/** Get isometric exercises prioritized by deficiency */
export function getPrioritizedIsometrics(
  profile: ScProfile,
  deficiencies?: DeficiencyScores,
): IsometricExercise[] {
  const filtered = getFilteredIsometrics(profile);

  if (!deficiencies) return filtered;

  return [...filtered].sort((a, b) => {
    let aScore = 0;
    let bScore = 0;

    for (const dim of a.targets) {
      aScore += Math.max(0, 60 - (deficiencies[dim] ?? 50));
    }
    for (const dim of b.targets) {
      bScore += Math.max(0, 60 - (deficiencies[dim] ?? 50));
    }

    // Position match bonus
    if (a.positions?.includes(profile.position)) aScore += 15;
    if (b.positions?.includes(profile.position)) bScore += 15;

    return bScore - aScore;
  });
}

/** Get a curated isometric block for a session (3-4 exercises) */
export function getIsometricBlock(
  profile: ScProfile,
  deficiencies?: DeficiencyScores,
): IsometricExercise[] {
  const prioritized = getPrioritizedIsometrics(profile, deficiencies);
  // Pick one from each category if possible
  const picked: IsometricExercise[] = [];
  const usedCategories = new Set<IsometricCategory>();

  for (const ex of prioritized) {
    if (picked.length >= 4) break;
    if (!usedCategories.has(ex.category)) {
      picked.push(ex);
      usedCategories.add(ex.category);
    }
  }

  return picked;
}
