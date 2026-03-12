import type { Position, TrainingExperience, TrainingTimeline, Equipment, ScProfile } from '@/hooks/useAthleteScProfile';
import type { DeficiencyScores, Dimension } from '@/data/deficiency-engine';

/* ────────────────────────────────────────────────────
 * SESSION ARCHITECTURE — 8-block training structure
 * Each session follows a fixed flow:
 *   1. Soft Tissue & Prep
 *   2. Movement Prep / Mobility
 *   3. CNS Primer (power activation)
 *   4. Primary Lift
 *   5. Secondary Lift
 *   6. Accessory / Sport-Specific
 *   7. Conditioning
 *   8. Cool Down & Recovery
 *
 * Exercises are selected based on the athlete's
 * S&C profile (position, experience, equipment, timeline).
 * ──────────────────────────────────────────────────── */

export interface SessionExercise {
  name: string;
  sets: string;
  cue: string;
  /** Which session block this belongs to */
  block: BlockKey;
  /** Rest between sets, e.g. '2-3 min', '90s' */
  rest?: string;
  /** Which deficiency dimensions this exercise targets */
  targets?: Dimension[];
}

export type BlockKey =
  | 'soft-tissue'
  | 'movement-prep'
  | 'cns-primer'
  | 'primary-lift'
  | 'secondary-lift'
  | 'accessory'
  | 'conditioning'
  | 'cool-down';

export interface SessionBlock {
  key: BlockKey;
  label: string;
  tagline: string;
  icon: string; // Ionicons name
  color: string;
  durationMin: number; // estimated minutes
}

export const SESSION_BLOCKS: SessionBlock[] = [
  { key: 'soft-tissue',    label: 'Soft Tissue & Prep',      tagline: 'Wake up the tissue',         icon: 'bandage-outline',    color: '#a3e635', durationMin: 5  },
  { key: 'movement-prep',  label: 'Movement Prep',           tagline: 'Open up. Get loose.',        icon: 'body-outline',       color: '#22c55e', durationMin: 8  },
  { key: 'cns-primer',     label: 'CNS Primer',              tagline: 'Activate the nervous system', icon: 'flash-outline',      color: '#f59e0b', durationMin: 8  },
  { key: 'primary-lift',   label: 'Primary Lift',            tagline: 'The main movement',          icon: 'barbell-outline',    color: '#3b82f6', durationMin: 15 },
  { key: 'secondary-lift', label: 'Secondary Lift',          tagline: 'Supporting compound',        icon: 'barbell-outline',    color: '#8b5cf6', durationMin: 12 },
  { key: 'accessory',      label: 'Accessory & Sport Work',  tagline: 'Weak points + baseball',     icon: 'shield-outline',     color: '#06b6d4', durationMin: 10 },
  { key: 'conditioning',   label: 'Conditioning',            tagline: 'Energy system development',  icon: 'heart-outline',      color: '#ef4444', durationMin: 8  },
  { key: 'cool-down',      label: 'Cool Down & Recovery',    tagline: 'Earn the adaptation',        icon: 'leaf-outline',       color: '#a3e635', durationMin: 5  },
];

/* ────────────────────────────────────────────────────
 * Exercise pools by block + profile filters
 * ──────────────────────────────────────────────────── */

interface PoolEntry {
  name: string;
  sets: string;
  cue: string;
  /** Rest between sets, e.g. '2-3 min', '90s' */
  rest?: string;
  /** Position bias: if set, preferred for these positions */
  positions?: Position[];
  /** Minimum experience required */
  minExperience?: TrainingExperience;
  /** Equipment needed */
  equipment?: Equipment[];
  /** Which deficiency dimensions this exercise targets */
  targets?: Dimension[];
}

const EXPERIENCE_RANK: Record<TrainingExperience, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
};

/* ─── Block 1: Soft Tissue ─── */
const SOFT_TISSUE_POOL: PoolEntry[] = [
  { name: 'Foam Roll Full Body', sets: '5 min', cue: 'Quads, IT band, lats, T-spine, calves. 30 sec per area.', targets: ['mobility', 'durability'] },
  { name: 'Lacrosse Ball — Glutes', sets: '2 min', cue: 'Find the trigger point. Sit on it. Breathe through it.', targets: ['mobility', 'durability'] },
  { name: 'Lacrosse Ball — Shoulders', sets: '2 min', cue: 'Pin against wall. Work posterior shoulder and upper trap.', targets: ['mobility', 'durability'] },
  { name: 'Foam Roll T-Spine Extension', sets: '2 × 10', cue: 'Roller at mid-back. Hands behind head. Extend over roller.', targets: ['mobility'] },
  { name: 'Prone Press-Up (McKenzie)', sets: '2 × 8', cue: 'Face down. Press chest up. Hips stay on ground.', targets: ['mobility'] },
];

/* ─── Block 2: Movement Prep ─── */
const MOVEMENT_PREP_POOL: PoolEntry[] = [
  { name: 'Hip 90/90 Stretch', sets: '2 × 30 sec/side', cue: 'Tall spine. Let the external hip open.', positions: ['C', 'IF'], targets: ['mobility'] },
  { name: '90/90 Hip Transitions', sets: '2 × 8/side', cue: 'Flow between internal and external rotation.', targets: ['mobility'] },
  { name: 'Half Kneeling Hip Flexor Stretch', sets: '2 × 30 sec/side', cue: 'Squeeze glute on back leg. No arch.', targets: ['mobility'] },
  { name: 'Thoracic Rotation on Floor', sets: '2 × 8/side', cue: 'Side-lying. Open arm wide. Follow with eyes.', targets: ['mobility'] },
  { name: 'Cat-Cow', sets: '2 × 10', cue: 'Round fully, then arch fully. Drive movement from spine.', targets: ['mobility'] },
  { name: 'Wall Ankle Dorsiflexion', sets: '2 × 10/side', cue: 'Knee tracks over pinky toe. Keep heel down.', positions: ['C'], targets: ['mobility', 'durability'] },
  { name: 'Inchworm Walk-Out', sets: '2 × 6', cue: 'Walk hands out to plank. Walk feet to hands.', targets: ['mobility', 'strength'] },
  { name: 'Shoulder CARs', sets: '1 × 5/direction/side', cue: 'Controlled Articular Rotations. Biggest circle possible.', targets: ['mobility', 'durability'] },
  { name: 'Adductor Rock-Back', sets: '2 × 8/side', cue: 'One leg extended. Rock hips back. Keep chest proud.', positions: ['C', 'IF'], targets: ['mobility'] },
  { name: 'Dead Bug', sets: '2 × 8/side', cue: 'Back flat on floor. Opposite arm/leg extend.', targets: ['durability', 'strength'] },
  { name: 'World\'s Greatest Stretch', sets: '2 × 5/side', cue: 'Lunge, rotate, reach. Hits hips, T-spine, and hamstrings in one move.', targets: ['mobility'] },
  { name: 'Leg Swings (front-back + lateral)', sets: '2 × 10/direction/side', cue: 'Dynamic range of motion. Hold something for balance. Controlled swing.', targets: ['mobility', 'speed'] },
  { name: 'Glute Bridge (activation)', sets: '2 × 10', cue: 'Squeeze glutes hard at top. 2-sec hold. Wake up the posterior chain before lifting.', targets: ['strength', 'durability'] },
];

/* ─── Block 3: CNS Primer ─── */
const CNS_PRIMER_POOL: PoolEntry[] = [
  // Med Ball
  { name: 'Rotational Med Ball Throw', sets: '3 × 5/side', cue: 'Load hip, separate, explode. Reset each rep.', rest: '60-90s', targets: ['power'] },
  { name: 'Overhead Med Ball Slam', sets: '3 × 5', cue: 'Triple extend. Slam with intent.', rest: '60-90s', targets: ['power'] },
  { name: 'Scoop Toss (forward)', sets: '3 × 5', cue: 'Load hips. Snap through. Max intent.', rest: '60-90s', targets: ['power'] },
  // Jumps
  { name: 'Box Jump', sets: '3 × 3', cue: 'Max effort. Land soft. Step down.', rest: '60-90s', equipment: ['full-gym', 'home-gym'], targets: ['power', 'speed'] },
  { name: 'Broad Jump', sets: '3 × 3', cue: 'Triple extension + arm drive. Measure distance.', rest: '60-90s', targets: ['power', 'speed'] },
  { name: 'Lateral Bound', sets: '3 × 4/side', cue: 'Push off one leg, land on opposite. Stick 2 sec.', rest: '60-90s', positions: ['IF'], targets: ['power', 'speed'] },
  { name: 'Tuck Jump', sets: '3 × 5', cue: 'Vertical jump, pull knees to chest. Land soft.', rest: '60-90s', targets: ['power'] },
  // Reactive Strength
  { name: 'Drop Jump (reactive)', sets: '3 × 4', cue: 'Step off box, hit ground, immediately jump max height. Ground contact < 0.2 sec.', rest: '90s', equipment: ['full-gym', 'home-gym'], minExperience: 'intermediate', targets: ['power', 'speed'] },
  { name: 'Pogos (ankle)', sets: '3 × 15', cue: 'Stiff ankles. Bounce off ground like a pogo stick. Minimal knee bend. Train the Achilles.', rest: '60s', targets: ['speed', 'durability'] },
  { name: 'Depth Jump to Broad Jump', sets: '3 × 3', cue: 'Step off 18" box. Absorb, immediately broad jump. Elastic power.', rest: '90s', equipment: ['full-gym', 'home-gym'], minExperience: 'intermediate', targets: ['power', 'speed'] },
  // Sprint
  { name: 'Acceleration Sprint (10 yards)', sets: '4 × 1', cue: 'First 3 steps are everything. Max intent.', rest: '60-90s', positions: ['OF', 'IF'], targets: ['speed'] },
  // Beginner-friendly
  { name: 'High Knees', sets: '2 × 20 yards', cue: 'Quick ground contact. Arms pump fast.', rest: '60s', targets: ['speed'] },
];

/* ─── Block 4: Primary Lift ─── */
const PRIMARY_LIFT_POOL: PoolEntry[] = [
  // Lower body focus days
  { name: 'Trap Bar Deadlift', sets: '4 × 5', cue: 'Drive the floor away. Chest tall, hips back.', rest: '2-3 min', equipment: ['full-gym'], targets: ['strength', 'power'] },
  { name: 'Barbell Back Squat', sets: '4 × 5', cue: 'Hip crease below knee. Brace hard.', rest: '2-3 min', equipment: ['full-gym'], minExperience: 'intermediate', targets: ['strength'] },
  { name: 'Front Squat', sets: '4 × 5', cue: 'Elbows high. Core braced. Upright torso.', rest: '2-3 min', equipment: ['full-gym'], minExperience: 'intermediate', targets: ['strength', 'mobility'] },
  { name: 'Goblet Squat', sets: '4 × 8', cue: 'Hip crease below knee. Elbows inside knees.', rest: '90s-2 min', equipment: ['full-gym', 'home-gym'], targets: ['strength', 'mobility'] },
  // Upper body focus days
  { name: 'Barbell Bench Press', sets: '4 × 5', cue: 'Arch back slightly. Plant feet. Controlled descent.', rest: '2-3 min', equipment: ['full-gym'], targets: ['strength'] },
  { name: 'Pull-Ups / Chin-Ups', sets: '4 × max', cue: 'Full hang at bottom. Chin over bar. Control negative.', rest: '2-3 min', equipment: ['full-gym', 'home-gym'], targets: ['strength'] },
  { name: 'Barbell Row', sets: '4 × 6', cue: 'Hinge 45°. Pull to belly button. Squeeze blades.', rest: '2-3 min', equipment: ['full-gym'], targets: ['strength'] },
  { name: 'Overhead Press', sets: '4 × 5', cue: 'Brace core. Press overhead. Head through at top.', rest: '2-3 min', equipment: ['full-gym'], targets: ['strength', 'power'] },
  // Minimal equipment
  { name: 'Bulgarian Split Squat', sets: '4 × 8/side', cue: 'Rear foot elevated. Vertical shin.', rest: '90s-2 min', equipment: ['full-gym', 'home-gym', 'minimal'], targets: ['strength', 'durability'] },
  { name: 'Push-Up Variations', sets: '4 × 15', cue: 'Full range. Core tight. Controlled.', rest: '90s', equipment: ['minimal', 'home-gym'], targets: ['strength'] },
];

/* ─── Block 5: Secondary Lift ─── */
const SECONDARY_LIFT_POOL: PoolEntry[] = [
  { name: 'Romanian Deadlift (RDL)', sets: '3 × 8', cue: 'Hinge at hip. Feel hamstrings load.', rest: '90s-2 min', equipment: ['full-gym', 'home-gym'], targets: ['strength', 'mobility'] },
  { name: 'Incline Dumbbell Press', sets: '3 × 8', cue: '30-45° incline. Full stretch at bottom.', rest: '90s-2 min', equipment: ['full-gym', 'home-gym'], targets: ['strength'] },
  { name: 'Dumbbell Row', sets: '3 × 8/side', cue: 'One hand on bench. Row to hip. No rotation.', rest: '90s', equipment: ['full-gym', 'home-gym'], targets: ['strength'] },
  { name: 'Hip Thrust', sets: '3 × 10', cue: 'Shoulders on bench. Full extension. Squeeze glutes.', rest: '90s', equipment: ['full-gym', 'home-gym'], targets: ['strength', 'power'] },
  { name: 'Landmine Press', sets: '3 × 8/side', cue: 'Single arm. Core stable. Athletic position.', rest: '90s', equipment: ['full-gym'], targets: ['strength', 'power'] },
  { name: 'Walking Lunge', sets: '3 × 10/side', cue: 'Long stride. Upright torso. Drive through front heel.', rest: '90s', equipment: ['full-gym', 'home-gym', 'minimal'], targets: ['strength', 'durability'] },
  { name: 'Single-Leg RDL (dumbbell)', sets: '3 × 8/side', cue: 'Hips square. Hamstring loads on descent.', rest: '90s', equipment: ['full-gym', 'home-gym'], targets: ['strength', 'durability', 'mobility'] },
  { name: 'Lat Pulldown', sets: '3 × 10', cue: 'Wide grip. Pull to chest. Squeeze lats.', rest: '90s', equipment: ['full-gym'], targets: ['strength'] },
];

/* ─── Block 6: Accessory & Sport ─── */
const ACCESSORY_POOL: PoolEntry[] = [
  // Arm care (always included)
  { name: 'Band Pull-Apart', sets: '3 × 20', cue: 'Squeeze shoulder blades. Daily.', rest: '60s', targets: ['durability'] },
  { name: 'Band External Rotation', sets: '2 × 15/side', cue: 'Elbow at 90°. Rotate out. Controlled.', rest: '60s', targets: ['durability'] },
  { name: 'J-Band Throwing Warm-Up', sets: '1 × circuit', cue: 'Full J-band circuit: arm circles, internal/external rotation, Y/T raise, pull-apart.', rest: '60s', targets: ['durability', 'mobility'] },
  { name: 'Deceleration Eccentric Cuff', sets: '2 × 10/side', cue: 'Prone on bench. Light dumbbell. Slow eccentric external rotation. Protects the arm.', rest: '60s', equipment: ['full-gym', 'home-gym'], targets: ['durability'] },
  // Core
  { name: 'Pallof Press', sets: '3 × 10/side', cue: 'Anti-rotation. Press out, hold 2 sec.', rest: '60s', targets: ['strength', 'durability'] },
  { name: 'Hanging Leg Raise', sets: '3 × 10', cue: 'Controlled. No swinging. Slow descent.', rest: '60s', equipment: ['full-gym', 'home-gym'], targets: ['strength'] },
  { name: 'Ab Wheel Rollout', sets: '3 × 8', cue: 'Brace. Roll out. Do not let hips sag.', rest: '60-90s', equipment: ['full-gym', 'home-gym'], minExperience: 'intermediate', targets: ['strength'] },
  // Prehab
  { name: 'Copenhagen Plank', sets: '2 × 20 sec/side', cue: 'Adductor endurance. Hip stays high.', rest: '60s', minExperience: 'intermediate', targets: ['durability'] },
  { name: 'Nordic Hamstring Curl', sets: '3 × 4', cue: 'Eccentric control. Lower as slow as possible.', rest: '90s', minExperience: 'intermediate', targets: ['strength', 'durability'] },
  { name: 'Banded Lateral Walk', sets: '3 × 12/direction', cue: 'Stay low. Hip abductors fire.', rest: '60s', targets: ['durability', 'speed'] },
  { name: 'Clamshell', sets: '3 × 15/side', cue: 'Side-lying. Open top knee. Feel glute med.', rest: '60s', targets: ['durability'] },
  // Position-specific
  { name: 'Overload/Underload Bat Swings', sets: '3 × 6+6', cue: '6 heavy, 6 light. Feel the speed difference.', rest: '60-90s', targets: ['power', 'speed'] },
  { name: 'Scap Push-Up', sets: '3 × 12', cue: 'Only move the shoulder blades. Protract and retract.', rest: '60s', targets: ['durability'] },
  // Catchers
  { name: 'Terminal Knee Extension (TKE)', sets: '3 × 15/side', cue: 'Squeeze quad fully straight. VMO fires.', rest: '60s', positions: ['C'], targets: ['durability'] },
  { name: 'Single-Leg Glute Bridge', sets: '3 × 10/side', cue: 'Drive hips up. Squeeze glute at top.', rest: '60s', positions: ['C'], targets: ['strength', 'durability'] },
  { name: 'Catcher Squat Holds', sets: '3 × 30 sec', cue: 'Full catcher stance. Weight on balls of feet. Build endurance for late innings.', rest: '60s', positions: ['C'], targets: ['durability', 'strength'] },
  // Outfielders
  { name: 'Crow Hop Throw Drill', sets: '3 × 6', cue: 'Catch, crow-hop, throw to cutoff. Momentum through the throw. Long and on a line.', rest: '60-90s', positions: ['OF'], targets: ['power', 'speed'] },
  // Infielders
  { name: 'Lateral Quick-Feet Drill', sets: '3 × 8/side', cue: 'React and shuffle. Plant and throw. First-step quickness is everything for infielders.', rest: '60s', positions: ['IF'], targets: ['speed', 'power'] },
];

/* ─── Block 7: Conditioning ─── */
const CONDITIONING_POOL: PoolEntry[] = [
  { name: 'Sprint Intervals (90/90)', sets: '6 rounds', cue: '90-foot sprint, 90 sec rest. Baseball distances.', targets: ['speed'] },
  { name: 'Bike Sprints', sets: '6 × 20 sec on / 40 off', cue: 'Max RPM during work intervals.', equipment: ['full-gym'], targets: ['speed', 'power'] },
  { name: 'Med Ball Circuit', sets: '3 rounds × 6 each', cue: 'Slam, rotational throw, scoop toss. Minimal rest.', targets: ['power'] },
  { name: 'Bodyweight Complex', sets: '3 rounds', cue: '10 push-ups, 10 squats, 10 lunges, 10 mountain climbers.', targets: ['strength', 'durability'] },
  { name: 'Sled Push + Pull Combo', sets: '3 rounds', cue: 'Push 20 yards, pull 20 yards. 90 sec rest.', equipment: ['full-gym'], targets: ['strength', 'speed'] },
  { name: 'Jump Rope', sets: '3 × 2 min', cue: 'Light on feet. 60 sec rest between.', equipment: ['full-gym', 'home-gym'], targets: ['speed', 'durability'] },
  { name: 'Farmer\'s Carry + Sprint', sets: '3 rounds', cue: 'Carry 40 yards, drop, sprint 20. Rest 2 min.', equipment: ['full-gym', 'home-gym'], targets: ['strength', 'speed'] },
  { name: 'Sled Push', sets: '4 × 20 yards', cue: 'Low and drive. Short powerful steps. Arms locked. Rest 90 sec.', equipment: ['full-gym'], targets: ['strength', 'speed'] },
];

/* ─── Block 8: Cool Down ─── */
const COOL_DOWN_POOL: PoolEntry[] = [
  { name: 'Child\'s Pose', sets: '60 sec', cue: 'Knees wide, arms extended. Breathe deep.', targets: ['mobility'] },
  { name: 'Pigeon Stretch', sets: '45 sec/side', cue: 'Front shin parallel. Walk hands forward.', targets: ['mobility'] },
  { name: 'Seated Hamstring Stretch', sets: '30 sec/side', cue: 'Hinge at the hip — not the spine.', targets: ['mobility'] },
  { name: 'Dead Hang', sets: '2 × 30 sec', cue: 'Relax shoulders. Decompress the spine.', equipment: ['full-gym', 'home-gym'], targets: ['mobility', 'durability'] },
  { name: 'Supine Hamstring Stretch', sets: '30 sec/side', cue: 'Lying on back. Straight leg. Pull gently.', targets: ['mobility'] },
  { name: 'Cross-Body Shoulder Stretch', sets: '30 sec/side', cue: 'Pull arm across chest. Posterior shoulder.', targets: ['mobility', 'durability'] },
  { name: 'Light Walk', sets: '5 min', cue: 'Easy pace. Active blood flow. Clear the mind.', targets: ['durability'] },
  { name: 'Couch Stretch', sets: '45 sec/side', cue: 'Back foot against wall. Squeeze glute. Deep hip flexor and quad stretch.', targets: ['mobility'] },
  { name: 'Foam Roll Cool-Down', sets: '3-5 min', cue: 'Hit quads, IT band, lats, calves. 30 sec per area. Slow and intentional.', targets: ['mobility', 'durability'] },
];

/* ────────────────────────────────────────────────────
 * Session Builder — selects exercises for each block
 * based on the athlete's profile
 * ──────────────────────────────────────────────────── */

const ALL_POOLS: Record<BlockKey, PoolEntry[]> = {
  'soft-tissue': SOFT_TISSUE_POOL,
  'movement-prep': MOVEMENT_PREP_POOL,
  'cns-primer': CNS_PRIMER_POOL,
  'primary-lift': PRIMARY_LIFT_POOL,
  'secondary-lift': SECONDARY_LIFT_POOL,
  'accessory': ACCESSORY_POOL,
  'conditioning': CONDITIONING_POOL,
  'cool-down': COOL_DOWN_POOL,
};

/** Number of exercises to pick per block */
const BLOCK_COUNTS: Record<BlockKey, number> = {
  'soft-tissue': 3,
  'movement-prep': 4,
  'cns-primer': 3,
  'primary-lift': 2,
  'secondary-lift': 2,
  'accessory': 4,
  'conditioning': 2,
  'cool-down': 3,
};

/** In-season reduces volume */
const IN_SEASON_COUNTS: Record<BlockKey, number> = {
  'soft-tissue': 2,
  'movement-prep': 3,
  'cns-primer': 2,
  'primary-lift': 1,
  'secondary-lift': 1,
  'accessory': 3,
  'conditioning': 1,
  'cool-down': 3,
};

function filterPool(pool: PoolEntry[], profile: ScProfile): PoolEntry[] {
  const expRank = EXPERIENCE_RANK[profile.experience];

  return pool.filter((entry) => {
    // Equipment filter
    if (entry.equipment && !entry.equipment.includes(profile.equipment)) {
      return false;
    }
    // Experience filter
    if (entry.minExperience && EXPERIENCE_RANK[entry.minExperience] > expRank) {
      return false;
    }
    return true;
  });
}

/**
 * Score and sort: position-matched + deficiency-targeted exercises float to top.
 * Exercises that target the athlete's weakest dimensions get priority.
 */
function scoreAndSort(pool: PoolEntry[], position: Position, deficiencies?: DeficiencyScores): PoolEntry[] {
  return [...pool].sort((a, b) => {
    let aScore = 0;
    let bScore = 0;

    // Position match bonus
    if (a.positions?.includes(position)) aScore += 10;
    if (b.positions?.includes(position)) bScore += 10;

    // Deficiency targeting bonus — exercises that hit weak dimensions score higher
    if (deficiencies) {
      for (const dim of a.targets ?? []) {
        // Lower deficiency score = bigger gap = more bonus
        aScore += Math.max(0, 60 - (deficiencies[dim] ?? 50));
      }
      for (const dim of b.targets ?? []) {
        bScore += Math.max(0, 60 - (deficiencies[dim] ?? 50));
      }
    }

    return bScore - aScore;
  });
}

/** Deterministic-ish pick based on a seed (day of year) */
function seededPick<T>(arr: T[], count: number, seed: number): T[] {
  if (arr.length <= count) return arr;
  const shuffled = [...arr];
  // Simple Fisher-Yates with seed
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = (seed * (i + 1) + 7) % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

export function buildSession(
  profile: ScProfile,
  daySeed?: number,
  deficiencies?: DeficiencyScores,
): Record<BlockKey, SessionExercise[]> {
  const seed = daySeed ?? Math.floor(Date.now() / 86400000); // day-based seed
  const counts = profile.timeline === 'in-season' ? IN_SEASON_COUNTS : BLOCK_COUNTS;

  const session: Record<BlockKey, SessionExercise[]> = {} as any;

  for (const block of SESSION_BLOCKS) {
    const pool = ALL_POOLS[block.key];
    const filtered = filterPool(pool, profile);
    const sorted = scoreAndSort(filtered, profile.position, deficiencies);
    const picked = seededPick(sorted, counts[block.key], seed + block.key.length);

    session[block.key] = picked.map((e) => ({
      name: e.name,
      sets: e.sets,
      cue: e.cue,
      block: block.key,
      ...(e.rest ? { rest: e.rest } : {}),
      ...(e.targets?.length ? { targets: e.targets } : {}),
    }));
  }

  return session;
}

export function getEstimatedDuration(profile: ScProfile): number {
  const counts = profile.timeline === 'in-season' ? IN_SEASON_COUNTS : BLOCK_COUNTS;
  return SESSION_BLOCKS.reduce((sum, block) => {
    // Scale duration by ratio of exercises picked vs pool size
    const ratio = counts[block.key] / (BLOCK_COUNTS[block.key] || 1);
    return sum + Math.round(block.durationMin * ratio);
  }, 0);
}
