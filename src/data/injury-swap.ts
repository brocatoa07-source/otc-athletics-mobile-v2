import type { BlockKey, SessionExercise } from '@/data/session-blocks';

/* ────────────────────────────────────────────────────
 * INJURY / SWAP ENGINE
 *
 * Athletes can flag body-part limitations (sore shoulder,
 * tweaked knee, etc.). The engine:
 *   1. Identifies which exercises stress that area
 *   2. Removes them from the session
 *   3. Replaces with safe alternatives
 *
 * This keeps the athlete training smart even when
 * dealing with minor dings — the most common scenario
 * for high-school and college athletes.
 * ──────────────────────────────────────────────────── */

export type BodyPart =
  | 'shoulder'
  | 'elbow'
  | 'wrist'
  | 'lower-back'
  | 'hip'
  | 'knee'
  | 'ankle'
  | 'hamstring'
  | 'quad';

export interface BodyPartMeta {
  key: BodyPart;
  label: string;
  icon: string;
  color: string;
}

export const BODY_PARTS: BodyPartMeta[] = [
  { key: 'shoulder',   label: 'Shoulder',    icon: 'body-outline',    color: '#ef4444' },
  { key: 'elbow',      label: 'Elbow / Arm', icon: 'hand-left-outline', color: '#f59e0b' },
  { key: 'wrist',      label: 'Wrist / Hand',icon: 'hand-right-outline',color: '#f59e0b' },
  { key: 'lower-back', label: 'Lower Back',  icon: 'fitness-outline', color: '#ef4444' },
  { key: 'hip',        label: 'Hip / Groin', icon: 'walk-outline',    color: '#8b5cf6' },
  { key: 'knee',       label: 'Knee',        icon: 'walk-outline',    color: '#3b82f6' },
  { key: 'ankle',      label: 'Ankle / Foot',icon: 'footsteps-outline', color: '#3b82f6' },
  { key: 'hamstring',  label: 'Hamstring',   icon: 'trending-up-outline', color: '#8b5cf6' },
  { key: 'quad',       label: 'Quad',        icon: 'trending-up-outline', color: '#06b6d4' },
];

export interface ActiveInjury {
  bodyPart: BodyPart;
  since: string; // ISO date
}

/**
 * Map of exercise name patterns → body parts they stress.
 * If an athlete has flagged a body part, exercises matching
 * these patterns will be swapped out.
 */
const STRESS_MAP: Record<BodyPart, RegExp[]> = {
  shoulder: [
    /bench press/i, /overhead press/i, /incline.*press/i, /push-up/i,
    /pull-up/i, /chin-up/i, /landmine press/i, /lat pulldown/i,
    /face pull/i, /lateral raise/i, /shoulder car/i, /plyo push/i,
    /overhead carry/i, /band pull-apart/i, /band external/i,
    /dead hang/i, /chin-up bar hang/i, /wall slide/i,
  ],
  elbow: [
    /bench press/i, /push-up/i, /pull-up/i, /chin-up/i,
    /curl/i, /pushdown/i, /overhead press/i, /landmine press/i,
    /ab wheel/i, /plyo push/i,
  ],
  wrist: [
    /bench press/i, /push-up/i, /front squat/i,
    /deadlift/i, /farmer/i, /kettlebell/i, /wrist/i,
    /fat grip/i, /plate pinch/i, /towel hang/i,
    /ab wheel/i, /plyo push/i,
  ],
  'lower-back': [
    /deadlift/i, /squat/i, /rdl/i, /row/i,
    /good morning/i, /overhead press/i, /farmer/i,
    /sled/i, /sandbag/i, /kettlebell swing/i,
    /broad jump/i, /nordic/i,
  ],
  hip: [
    /squat/i, /lunge/i, /split squat/i, /hip thrust/i,
    /rdl/i, /deadlift/i, /lateral bound/i, /broad jump/i,
    /box jump/i, /skater/i, /sprint/i, /pigeon/i,
    /frog stretch/i, /adductor/i, /copenhagen/i,
    /clamshell/i, /hip 90/i, /hip flexor/i,
  ],
  knee: [
    /squat/i, /lunge/i, /split squat/i, /leg press/i,
    /box jump/i, /tuck jump/i, /depth drop/i, /broad jump/i,
    /sprint/i, /shuttle/i, /t-drill/i, /lateral bound/i,
    /nordic/i, /tke/i, /wall sit/i, /hurdle hop/i,
  ],
  ankle: [
    /squat/i, /lunge/i, /jump/i, /sprint/i,
    /bound/i, /shuttle/i, /t-drill/i, /ladder/i,
    /calf raise/i, /ankle/i, /skater/i,
    /hurdle hop/i, /hill sprint/i,
  ],
  hamstring: [
    /rdl/i, /deadlift/i, /nordic/i, /hamstring/i,
    /sprint/i, /broad jump/i, /lunge/i,
    /single-leg rdl/i, /inchworm/i, /hill sprint/i,
  ],
  quad: [
    /squat/i, /lunge/i, /split squat/i, /leg press/i,
    /box jump/i, /tuck jump/i, /depth drop/i,
    /sprint/i, /sled push/i, /wall sit/i, /couch stretch/i,
    /quad/i, /tke/i,
  ],
};

/** Safe swap alternatives when an exercise is removed due to injury */
interface SwapAlt {
  name: string;
  sets: string;
  cue: string;
  block: BlockKey;
}

const SWAP_ALTERNATIVES: Record<BodyPart, SwapAlt[]> = {
  shoulder: [
    { name: 'Band Pull-Apart (light)', sets: '3 × 15', cue: 'Very light band. Rehab range only. No pain.', block: 'accessory' },
    { name: 'Pallof Press', sets: '3 × 10/side', cue: 'Anti-rotation. No shoulder stress.', block: 'secondary-lift' },
    { name: 'Hip Thrust', sets: '3 × 10', cue: 'Shoulder-safe lower body. Full extension.', block: 'primary-lift' },
    { name: 'Goblet Squat', sets: '3 × 10', cue: 'Pain-free pressing position. Modify if needed.', block: 'primary-lift' },
  ],
  elbow: [
    { name: 'Leg Press', sets: '3 × 10', cue: 'No arm involvement. Full range of motion.', block: 'primary-lift' },
    { name: 'Hip Thrust', sets: '3 × 10', cue: 'Lower body focus. No elbow stress.', block: 'secondary-lift' },
    { name: 'Plank', sets: '3 × 30 sec', cue: 'On forearms — no wrist extension needed.', block: 'accessory' },
  ],
  wrist: [
    { name: 'Trap Bar Deadlift (neutral grip)', sets: '3 × 5', cue: 'Neutral wrist position. Modify grip if needed.', block: 'primary-lift' },
    { name: 'Leg Press', sets: '3 × 10', cue: 'No grip required. Full range of motion.', block: 'primary-lift' },
    { name: 'Side Plank', sets: '3 × 20 sec/side', cue: 'On forearm. No wrist load.', block: 'accessory' },
  ],
  'lower-back': [
    { name: 'Belt Squat / Goblet Squat (light)', sets: '3 × 10', cue: 'Upright torso. Zero spinal compression.', block: 'primary-lift' },
    { name: 'Leg Press', sets: '3 × 10', cue: 'Supported back. Controlled range.', block: 'primary-lift' },
    { name: 'Pallof Press', sets: '3 × 10/side', cue: 'Anti-rotation. Core engagement without flexion.', block: 'accessory' },
    { name: 'Bird Dog', sets: '3 × 8/side', cue: 'Neutral spine. Controlled movement. Core stability.', block: 'accessory' },
  ],
  hip: [
    { name: 'Bench Press', sets: '3 × 8', cue: 'Upper body focus. No hip involvement.', block: 'primary-lift' },
    { name: 'Pull-Ups', sets: '3 × max', cue: 'Upper body pull. No hip stress.', block: 'primary-lift' },
    { name: 'Band Pull-Apart', sets: '3 × 20', cue: 'Upper body accessory. Shoulder health.', block: 'accessory' },
    { name: 'Bike (easy)', sets: '5 min', cue: 'Pain-free range only. Easy spin for blood flow.', block: 'conditioning' },
  ],
  knee: [
    { name: 'Hip Thrust', sets: '3 × 10', cue: 'Minimal knee flexion. Glute dominant.', block: 'primary-lift' },
    { name: 'Romanian Deadlift', sets: '3 × 8', cue: 'Soft knee bend. Hip hinge focus.', block: 'primary-lift' },
    { name: 'Bench Press', sets: '3 × 8', cue: 'Upper body. Zero knee involvement.', block: 'secondary-lift' },
    { name: 'Light Bike', sets: '5 min', cue: 'Pain-free range only. Easy spin.', block: 'conditioning' },
  ],
  ankle: [
    { name: 'Hip Thrust', sets: '3 × 10', cue: 'Flat foot. No ankle range needed.', block: 'primary-lift' },
    { name: 'Bench Press', sets: '3 × 8', cue: 'Upper body. No ankle stress.', block: 'primary-lift' },
    { name: 'Seated Exercises Only', sets: '—', cue: 'Avoid standing explosive work until cleared.', block: 'cns-primer' },
    { name: 'Bike (easy)', sets: '5 min', cue: 'Low impact. Pain-free pedaling.', block: 'conditioning' },
  ],
  hamstring: [
    { name: 'Goblet Squat', sets: '3 × 10', cue: 'Quad dominant. Upright torso. Controlled depth.', block: 'primary-lift' },
    { name: 'Leg Press', sets: '3 × 10', cue: 'Controlled range. No extreme stretch.', block: 'primary-lift' },
    { name: 'Bench Press', sets: '3 × 8', cue: 'Upper body. No hamstring involvement.', block: 'secondary-lift' },
    { name: 'Bike (easy)', sets: '5 min', cue: 'Limited range. Easy spin for blood flow.', block: 'conditioning' },
  ],
  quad: [
    { name: 'Romanian Deadlift', sets: '3 × 8', cue: 'Hip hinge. Minimal quad load.', block: 'primary-lift' },
    { name: 'Hip Thrust', sets: '3 × 10', cue: 'Glute dominant. Limited knee flexion.', block: 'primary-lift' },
    { name: 'Pull-Ups', sets: '3 × max', cue: 'Upper body. No quad involvement.', block: 'secondary-lift' },
    { name: 'Bike (easy)', sets: '5 min', cue: 'Pain-free range only.', block: 'conditioning' },
  ],
};

/** Check if an exercise stresses a flagged body part */
export function exerciseStressesPart(exerciseName: string, bodyPart: BodyPart): boolean {
  const patterns = STRESS_MAP[bodyPart];
  return patterns.some((re) => re.test(exerciseName));
}

/** Check if an exercise conflicts with any active injuries */
export function hasConflict(exerciseName: string, injuries: ActiveInjury[]): BodyPart | null {
  for (const injury of injuries) {
    if (exerciseStressesPart(exerciseName, injury.bodyPart)) {
      return injury.bodyPart;
    }
  }
  return null;
}

/**
 * Apply injury swaps to a built session.
 * Returns the modified session with flagged exercises replaced.
 */
export function applyInjurySwaps(
  session: Record<BlockKey, SessionExercise[]>,
  injuries: ActiveInjury[],
): Record<BlockKey, SessionExercise[]> {
  if (injuries.length === 0) return session;

  const modified = { ...session };
  const usedSwaps = new Set<string>();

  for (const blockKey of Object.keys(modified) as BlockKey[]) {
    const exercises = modified[blockKey];
    const newExercises: SessionExercise[] = [];

    for (const ex of exercises) {
      const conflict = hasConflict(ex.name, injuries);
      if (!conflict) {
        newExercises.push(ex);
        continue;
      }

      // Find a swap alternative for this body part + block
      const alts = SWAP_ALTERNATIVES[conflict];
      const swap = alts.find(
        (a) => a.block === blockKey && !usedSwaps.has(a.name),
      ) ?? alts.find((a) => !usedSwaps.has(a.name));

      if (swap) {
        usedSwaps.add(swap.name);
        newExercises.push({
          name: swap.name,
          sets: swap.sets,
          cue: `[SWAP: ${ex.name} → ${swap.name}] ${swap.cue}`,
          block: blockKey,
        });
      }
      // If no swap available, exercise is simply removed
    }

    modified[blockKey] = newExercises;
  }

  return modified;
}

/** Get a summary of what was swapped for display */
export function getSwapSummary(
  original: Record<BlockKey, SessionExercise[]>,
  modified: Record<BlockKey, SessionExercise[]>,
): { removed: string[]; added: string[] } {
  const origNames = new Set(
    Object.values(original).flatMap((exs) => exs.map((e) => e.name)),
  );
  const modNames = new Set(
    Object.values(modified).flatMap((exs) => exs.map((e) => e.name)),
  );

  const removed = [...origNames].filter((n) => !modNames.has(n));
  const added = [...modNames].filter((n) => !origNames.has(n));

  return { removed, added };
}
