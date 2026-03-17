/**
 * OTC STRENGTH PROGRAM DATA
 *
 * 6-month periodized program template.
 * 3 phases: Foundation (months 1-2), Performance (months 3-4), Peak (months 5-6).
 * Each month defines exercise pools by section.
 * Program generation engine selects from these pools and applies modifiers.
 */

import type { StrengthArchetype, BaseballPosition, MovementDeficiency } from './strength-profile';

/* ─── Types ──────────────────────────────────────── */

export type ProgramPhase = 'foundation' | 'performance' | 'peak';

export interface ExerciseTemplate {
  name: string;
  sets: string;       // e.g. "4×6", "3×8-10"
  cue: string;        // coaching cue
  section: 'warmup' | 'strength' | 'power' | 'accessory' | 'conditioning' | 'cooldown';
}

export interface WorkoutTemplate {
  dayLabel: string;     // e.g. "Day 1 — Lower Power"
  focus: string;
  exercises: ExerciseTemplate[];
}

export interface WeekTemplate {
  weekNumber: number;
  title: string;
  workouts: WorkoutTemplate[];
}

export interface MonthTemplate {
  month: number;
  phase: ProgramPhase;
  title: string;
  focus: string;
  weeks: WeekTemplate[];
}

/* ─── Phase Metadata ─────────────────────────────── */

export const PHASE_META: Record<ProgramPhase, { label: string; color: string; description: string }> = {
  foundation: {
    label: 'Foundation',
    color: '#22c55e',
    description: 'Build movement quality, structural durability, and work capacity.',
  },
  performance: {
    label: 'Performance',
    color: '#f59e0b',
    description: 'Convert strength to rotational power and baseball-specific speed.',
  },
  peak: {
    label: 'Peak',
    color: '#3b82f6',
    description: 'Maintain strength, maximize explosiveness, recover fast.',
  },
};

/* ─── Exercise Pools by Month ────────────────────── */

const MONTH_1_EXERCISES: ExerciseTemplate[] = [
  // Warmup / Mobility
  { name: 'Foam Roll Full Body', sets: '2 min', cue: 'Slow, find tight spots', section: 'warmup' },
  { name: 'Hip 90/90 Stretch', sets: '2×8 ea', cue: 'Rotate from the hip, not the knee', section: 'warmup' },
  { name: 'Shoulder CARs', sets: '2×5 ea', cue: 'Full range, controlled tempo', section: 'warmup' },
  { name: "World's Greatest Stretch", sets: '2×5 ea', cue: 'Open the hip fully each rep', section: 'warmup' },
  { name: 'Dead Bug', sets: '2×8 ea', cue: 'Press low back to floor, opposite arm-leg', section: 'warmup' },
  // Strength
  { name: 'Goblet Squat', sets: '3×10', cue: 'Elbows inside knees, chest tall', section: 'strength' },
  { name: 'Trap Bar Deadlift', sets: '4×6', cue: 'Push the floor away, neutral spine', section: 'strength' },
  { name: 'Dumbbell Bench Press', sets: '3×10', cue: 'Controlled lower, drive through chest', section: 'strength' },
  { name: 'Dumbbell Row', sets: '3×10 ea', cue: 'Pull elbow past rib cage', section: 'strength' },
  { name: 'Bulgarian Split Squat', sets: '3×8 ea', cue: 'Front knee tracks over toes', section: 'strength' },
  { name: 'Hip Thrust', sets: '3×12', cue: 'Squeeze glutes at top, no arching', section: 'strength' },
  // Power
  { name: 'Box Jump', sets: '3×5', cue: 'Stick the landing, soft knees', section: 'power' },
  { name: 'Rotational Med Ball Throw', sets: '3×6 ea', cue: 'Hip snap drives the throw', section: 'power' },
  // Accessory
  { name: 'Face Pulls', sets: '3×15', cue: 'Pull to eye level, squeeze rear delts', section: 'accessory' },
  { name: 'Pallof Press', sets: '3×10 ea', cue: 'Resist rotation, brace core', section: 'accessory' },
  { name: "Farmer's Carry", sets: '3×40yd', cue: 'Tall posture, quiet shoulders', section: 'accessory' },
  // Conditioning
  { name: 'Bike Intervals', sets: '6×30s on/30s off', cue: 'Max effort sprint intervals', section: 'conditioning' },
  // Cooldown
  { name: 'Static Stretch — Hamstrings', sets: '30s ea', cue: 'Breathe into the stretch', section: 'cooldown' },
  { name: 'Static Stretch — Hip Flexors', sets: '30s ea', cue: 'Squeeze glute of trailing leg', section: 'cooldown' },
  { name: 'Diaphragmatic Breathing', sets: '2 min', cue: '4 count inhale, 6 count exhale', section: 'cooldown' },
];

const MONTH_2_EXERCISES: ExerciseTemplate[] = [
  // Warmup
  { name: 'Foam Roll T-Spine Extension', sets: '2 min', cue: 'Extend over the roller, arms crossed', section: 'warmup' },
  { name: '90/90 Hip Transitions', sets: '2×8 ea', cue: 'Smooth transition, no cheating', section: 'warmup' },
  { name: 'Inchworm Walk-Out', sets: '2×6', cue: 'Tight core, full extension', section: 'warmup' },
  { name: 'Cat-Cow', sets: '2×10', cue: 'Segment by segment, slow', section: 'warmup' },
  { name: 'Glute Bridge', sets: '2×12', cue: 'Drive through heels, squeeze top', section: 'warmup' },
  // Strength
  { name: 'Barbell Back Squat', sets: '4×6', cue: 'Sit back, drive knees out', section: 'strength' },
  { name: 'Romanian Deadlift (RDL)', sets: '3×10', cue: 'Hinge at hip, bar close to legs', section: 'strength' },
  { name: 'Barbell Bench Press', sets: '4×6', cue: 'Arch back, retract scaps, drive', section: 'strength' },
  { name: 'Pull-Ups / Chin-Ups', sets: '3×max', cue: 'Full hang, chin over bar', section: 'strength' },
  { name: 'Walking Lunge', sets: '3×10 ea', cue: 'Long stride, upright torso', section: 'strength' },
  { name: 'Incline Dumbbell Press', sets: '3×10', cue: '45 degree angle, control the weight', section: 'strength' },
  // Power
  { name: 'Broad Jump', sets: '4×4', cue: 'Load hips, explode forward', section: 'power' },
  { name: 'Overhead Med Ball Slam', sets: '3×8', cue: 'Full extension, slam through floor', section: 'power' },
  { name: 'Lateral Bound', sets: '3×6 ea', cue: 'Stick each landing 2 seconds', section: 'power' },
  // Accessory
  { name: 'Band Pull-Aparts', sets: '3×15', cue: 'Squeeze shoulder blades together', section: 'accessory' },
  { name: 'Cable Woodchop', sets: '3×10 ea', cue: 'Rotate from core, not arms', section: 'accessory' },
  { name: 'Suitcase Carry', sets: '3×40yd ea', cue: 'Stay level, resist the lean', section: 'accessory' },
  // Conditioning
  { name: 'Rowing Intervals', sets: '5×250m', cue: 'Drive with legs first', section: 'conditioning' },
  // Cooldown
  { name: 'Static Stretch — Quads', sets: '30s ea', cue: 'Keep knees together', section: 'cooldown' },
  { name: 'Pigeon Stretch', sets: '30s ea', cue: 'Square hips to floor', section: 'cooldown' },
  { name: 'Box Breathing (4-4-4-4)', sets: '2 min', cue: '4 in, 4 hold, 4 out, 4 hold', section: 'cooldown' },
];

const MONTH_3_EXERCISES: ExerciseTemplate[] = [
  // Warmup
  { name: 'Lacrosse Ball — Glutes', sets: '90s ea', cue: 'Find trigger points, breathe', section: 'warmup' },
  { name: 'Thoracic Rotation on Floor', sets: '2×8 ea', cue: 'Keep hips stacked', section: 'warmup' },
  { name: 'Half Kneeling Hip Flexor Stretch', sets: '2×30s ea', cue: 'Squeeze glute, lean forward', section: 'warmup' },
  { name: 'Leg Swings (front-back + lateral)', sets: '2×10 ea', cue: 'Controlled swing, brace core', section: 'warmup' },
  { name: 'Adductor Rock-Back', sets: '2×8 ea', cue: 'Sit back into the groin stretch', section: 'warmup' },
  // Strength
  { name: 'Front Squat', sets: '4×5', cue: 'Elbows high, sit between legs', section: 'strength' },
  { name: 'Trap Bar Deadlift', sets: '4×4', cue: 'Maximal intent, fast off floor', section: 'strength' },
  { name: 'Overhead Press', sets: '3×8', cue: 'Squeeze glutes, press straight up', section: 'strength' },
  { name: 'Barbell Row', sets: '4×8', cue: 'Pull to lower chest, squeeze back', section: 'strength' },
  { name: 'Single-Leg RDL', sets: '3×8 ea', cue: 'Flat back, reach long', section: 'strength' },
  // Power
  { name: 'Hang Clean', sets: '4×3', cue: 'Violent hip extension, catch soft', section: 'power' },
  { name: 'Scoop Toss (forward)', sets: '3×6', cue: 'Load hips low, explode up and forward', section: 'power' },
  { name: 'Tuck Jump', sets: '3×6', cue: 'Knees to chest, fast contact', section: 'power' },
  // Accessory
  { name: 'Lateral Raises', sets: '3×12', cue: 'Slight lean forward, controlled', section: 'accessory' },
  { name: 'Pallof Press', sets: '3×10 ea', cue: 'Anti-rotation, brace hard', section: 'accessory' },
  { name: "Farmer's Carry", sets: '3×50yd', cue: 'Heavy, tall posture', section: 'accessory' },
  // Conditioning
  { name: 'Shuttle Run', sets: '6×20yd', cue: 'Low start, explosive turns', section: 'conditioning' },
  { name: 'Sled Push', sets: '4×30yd', cue: 'Drive through the ground', section: 'conditioning' },
  // Cooldown
  { name: 'Static Stretch — Shoulders', sets: '30s ea', cue: 'Cross-body and overhead', section: 'cooldown' },
  { name: 'Supine Spinal Twist', sets: '30s ea', cue: 'Let gravity do the work', section: 'cooldown' },
  { name: 'Diaphragmatic Breathing', sets: '2 min', cue: 'Reset the nervous system', section: 'cooldown' },
];

const MONTH_4_EXERCISES: ExerciseTemplate[] = [
  // Warmup
  { name: 'Foam Roll Full Body', sets: '2 min', cue: 'Focus on problem areas', section: 'warmup' },
  { name: 'Shoulder CARs', sets: '2×5 ea', cue: 'Maximum range under control', section: 'warmup' },
  { name: 'Wall Ankle Dorsiflexion', sets: '2×10 ea', cue: 'Knee past toes, heel down', section: 'warmup' },
  { name: "World's Greatest Stretch", sets: '2×5 ea', cue: 'Add T-spine rotation reach', section: 'warmup' },
  { name: 'Dead Bug', sets: '2×10 ea', cue: 'Add resistance band', section: 'warmup' },
  // Strength
  { name: 'Barbell Back Squat', sets: '5×3', cue: 'Heavy, controlled descent, fast up', section: 'strength' },
  { name: 'Close-Grip Bench Press', sets: '4×6', cue: 'Tuck elbows, tricep drive', section: 'strength' },
  { name: 'Lat Pulldown', sets: '3×10', cue: 'Pull to upper chest, lean slightly', section: 'strength' },
  { name: 'Step-Ups', sets: '3×8 ea', cue: 'Drive through front foot only', section: 'strength' },
  { name: 'Leg Press', sets: '3×12', cue: 'Full range, controlled eccentric', section: 'strength' },
  // Power
  { name: 'Power Clean', sets: '4×3', cue: 'Triple extension — ankles, knees, hips', section: 'power' },
  { name: 'Depth Jump', sets: '3×5', cue: 'Step off, react instantly', section: 'power' },
  { name: 'Medicine Ball Chest Pass', sets: '3×8', cue: 'Snap from chest, follow through', section: 'power' },
  { name: 'Rotational Med Ball Throw', sets: '3×6 ea', cue: 'Separate hips from shoulders', section: 'power' },
  // Accessory
  { name: 'Face Pulls', sets: '3×15', cue: 'High pull, external rotation finish', section: 'accessory' },
  { name: 'Cable Woodchop', sets: '3×10 ea', cue: 'Anti-rotation transition', section: 'accessory' },
  // Conditioning
  { name: 'Hill Sprints', sets: '6×30yd', cue: 'Drive knees, pump arms', section: 'conditioning' },
  { name: 'Battle Ropes', sets: '4×30s', cue: 'Alternating waves, max effort', section: 'conditioning' },
  // Cooldown
  { name: 'Static Stretch — Hamstrings', sets: '30s ea', cue: 'Straight leg, hinge forward', section: 'cooldown' },
  { name: "Child's Pose", sets: '60s', cue: 'Reach arms long, breathe deep', section: 'cooldown' },
  { name: 'Box Breathing (4-4-4-4)', sets: '2 min', cue: 'Full recovery breathing', section: 'cooldown' },
];

const MONTH_5_EXERCISES: ExerciseTemplate[] = [
  // Warmup
  { name: 'Lacrosse Ball — Shoulders', sets: '90s ea', cue: 'External rotation position', section: 'warmup' },
  { name: '90/90 Hip Transitions', sets: '2×8 ea', cue: 'Speed with control', section: 'warmup' },
  { name: 'Inchworm Walk-Out', sets: '2×6', cue: 'Add push-up at bottom', section: 'warmup' },
  { name: 'Glute Bridge', sets: '2×15', cue: 'Single leg variation', section: 'warmup' },
  { name: 'Cat-Cow', sets: '2×8', cue: 'Full spinal waves', section: 'warmup' },
  // Strength
  { name: 'Trap Bar Deadlift', sets: '3×5', cue: 'Fast concentric, maintain quality', section: 'strength' },
  { name: 'Dumbbell Bench Press', sets: '3×8', cue: 'Explosive press, controlled lower', section: 'strength' },
  { name: 'Bulgarian Split Squat', sets: '3×6 ea', cue: 'Add load, maintain depth', section: 'strength' },
  { name: 'Pull-Ups / Chin-Ups', sets: '3×max', cue: 'Add weight if 10+ reps', section: 'strength' },
  // Power
  { name: 'Hang Clean', sets: '3×3', cue: 'Speed and precision, moderate load', section: 'power' },
  { name: 'Box Jump', sets: '3×4', cue: 'Increase height, stick landing', section: 'power' },
  { name: 'Hurdle Hops', sets: '3×5', cue: 'Minimal ground contact', section: 'power' },
  { name: 'Scoop Toss (forward)', sets: '3×5', cue: 'Maximal distance intent', section: 'power' },
  // Accessory
  { name: 'Band Pull-Aparts', sets: '3×20', cue: 'Fast reps, constant tension', section: 'accessory' },
  { name: 'Pallof Press', sets: '2×12 ea', cue: 'Walkout variation', section: 'accessory' },
  // Conditioning
  { name: 'Tempo Runs', sets: '4×60yd', cue: '80% effort, smooth mechanics', section: 'conditioning' },
  { name: 'Jump Rope Intervals', sets: '4×45s', cue: 'Light feet, rhythm', section: 'conditioning' },
  // Cooldown
  { name: 'Pigeon Stretch', sets: '30s ea', cue: 'Sink deeper each breath', section: 'cooldown' },
  { name: 'Seated Figure-4 Stretch', sets: '30s ea', cue: 'Press knee gently', section: 'cooldown' },
  { name: 'Diaphragmatic Breathing', sets: '3 min', cue: 'Full recovery protocol', section: 'cooldown' },
];

const MONTH_6_EXERCISES: ExerciseTemplate[] = [
  // Warmup
  { name: 'Foam Roll T-Spine Extension', sets: '90s', cue: 'Focus on thoracic extension', section: 'warmup' },
  { name: 'Hip 90/90 Stretch', sets: '2×6 ea', cue: 'Maintenance mobility', section: 'warmup' },
  { name: 'Shoulder CARs', sets: '2×4 ea', cue: 'Quality over quantity', section: 'warmup' },
  { name: 'Leg Swings (front-back + lateral)', sets: '2×8 ea', cue: 'Dynamic warm-up', section: 'warmup' },
  // Strength
  { name: 'Barbell Back Squat', sets: '3×4', cue: 'Maintain strength, don\'t peak', section: 'strength' },
  { name: 'Dumbbell Row', sets: '3×8 ea', cue: 'Pull heavy, squeeze', section: 'strength' },
  { name: 'Incline Dumbbell Press', sets: '3×8', cue: 'Moderate load, quality reps', section: 'strength' },
  { name: 'Romanian Deadlift (RDL)', sets: '3×8', cue: 'Hamstring tension, hinge clean', section: 'strength' },
  // Power
  { name: 'Push Press', sets: '3×4', cue: 'Dip and drive, full lockout', section: 'power' },
  { name: 'Rotational Med Ball Throw', sets: '3×5 ea', cue: 'Max velocity intent', section: 'power' },
  { name: 'Single-Leg Hop', sets: '3×4 ea', cue: 'Stick landing, maintain balance', section: 'power' },
  { name: 'Broad Jump', sets: '3×4', cue: 'Competition effort each rep', section: 'power' },
  // Accessory
  { name: 'Face Pulls', sets: '3×15', cue: 'Shoulder health maintenance', section: 'accessory' },
  { name: "Farmer's Carry", sets: '2×40yd', cue: 'Heavy, short distance', section: 'accessory' },
  // Conditioning
  { name: 'Prowler Sprint', sets: '4×25yd', cue: 'Low drive, maximal effort', section: 'conditioning' },
  // Cooldown
  { name: 'Static Stretch — Hip Flexors', sets: '30s ea', cue: 'Couch stretch variation', section: 'cooldown' },
  { name: 'Supine Spinal Twist', sets: '30s ea', cue: 'Full relaxation', section: 'cooldown' },
  { name: 'Box Breathing (4-4-4-4)', sets: '3 min', cue: 'End-of-session reset', section: 'cooldown' },
];

/* ─── All Exercise Pools ─────────────────────────── */

export const MONTH_EXERCISE_POOLS: ExerciseTemplate[][] = [
  MONTH_1_EXERCISES,
  MONTH_2_EXERCISES,
  MONTH_3_EXERCISES,
  MONTH_4_EXERCISES,
  MONTH_5_EXERCISES,
  MONTH_6_EXERCISES,
];

/* ─── Archetype Modifiers ────────────────────────── */

/** Extra exercises or substitutions per archetype */
export const ARCHETYPE_MODIFIERS: Record<StrengthArchetype, {
  add: ExerciseTemplate[];
  emphasize: string[]; // exercise names to prioritize
  deemphasize: string[]; // exercise names to reduce/skip
}> = {
  static: {
    add: [
      { name: 'Prone Press-Up (McKenzie)', sets: '2×10', cue: 'Extend spine, breathe at top', section: 'warmup' },
      { name: 'Wall Ankle Dorsiflexion', sets: '2×12 ea', cue: 'Load the ankle gradually', section: 'warmup' },
    ],
    emphasize: ['Hip 90/90 Stretch', '90/90 Hip Transitions', 'Lateral Bound', 'Broad Jump'],
    deemphasize: ['Trap Bar Deadlift'], // reduce volume, not remove
  },
  spring: {
    add: [
      { name: 'Barbell Back Squat', sets: '+1 set', cue: 'Build raw strength foundation', section: 'strength' },
      { name: 'Romanian Deadlift (RDL)', sets: '3×10', cue: 'Slow eccentric, build hamstring control', section: 'strength' },
    ],
    emphasize: ['Barbell Back Squat', 'Barbell Bench Press', 'Trap Bar Deadlift', "Farmer's Carry"],
    deemphasize: ['Box Jump', 'Tuck Jump'], // already explosive, reduce plyo volume
  },
  hybrid: {
    add: [],
    emphasize: ['Front Squat', 'Hang Clean', 'Rotational Med Ball Throw'],
    deemphasize: [],
  },
};

/* ─── Position Modifiers ─────────────────────────── */

export const POSITION_MODIFIERS: Record<BaseballPosition, {
  add: ExerciseTemplate[];
  emphasize: string[];
}> = {
  outfielder: {
    add: [
      { name: 'Tempo Runs', sets: '4×60yd', cue: 'Build sprint endurance', section: 'conditioning' },
    ],
    emphasize: ['Broad Jump', 'Hill Sprints', 'Rotational Med Ball Throw'],
  },
  infielder: {
    add: [
      { name: 'Lateral Bound', sets: '3×6 ea', cue: 'Quick lateral power', section: 'power' },
    ],
    emphasize: ['Shuttle Run', 'Lateral Bound', 'Single-Leg Hop'],
  },
  catcher: {
    add: [
      { name: 'Goblet Squat', sets: '3×12', cue: 'Deep squat, hip durability', section: 'strength' },
      { name: 'Adductor Rock-Back', sets: '2×10 ea', cue: 'Groin health for blocking', section: 'warmup' },
    ],
    emphasize: ['Hip Thrust', 'Hip 90/90 Stretch', 'Goblet Squat'],
  },
};

/* ─── Deficiency Modifiers ───────────────────────── */

export const DEFICIENCY_MODIFIERS: Record<MovementDeficiency, {
  add: ExerciseTemplate[];
  emphasize: string[];
}> = {
  hip_mobility: {
    add: [
      { name: 'Hip 90/90 Stretch', sets: '3×8 ea', cue: 'Daily hip opener', section: 'warmup' },
      { name: 'Adductor Rock-Back', sets: '2×10 ea', cue: 'Open groin, sit back', section: 'warmup' },
    ],
    emphasize: ['90/90 Hip Transitions', 'Hip 90/90 Stretch', 'Pigeon Stretch', 'Half Kneeling Hip Flexor Stretch'],
  },
  shoulder_stability: {
    add: [
      { name: 'Shoulder CARs', sets: '3×6 ea', cue: 'Extended sets for stability', section: 'warmup' },
      { name: 'Band Pull-Aparts', sets: '4×15', cue: 'Scapular control focus', section: 'accessory' },
    ],
    emphasize: ['Face Pulls', 'Band Pull-Aparts', 'Shoulder CARs', 'Lacrosse Ball — Shoulders'],
  },
  acceleration_weakness: {
    add: [
      { name: 'Sled Push', sets: '4×25yd', cue: 'Acceleration drill — drive hard', section: 'conditioning' },
      { name: 'Broad Jump', sets: '4×4', cue: 'Maximal horizontal power', section: 'power' },
    ],
    emphasize: ['Hill Sprints', 'Shuttle Run', 'Box Jump', 'Broad Jump', 'Prowler Sprint'],
  },
};

/* ─── Weekly Structure by Phase ──────────────────── */

export const WEEKLY_STRUCTURE: Record<ProgramPhase, { daysPerWeek: number; dayLabels: string[] }> = {
  foundation: {
    daysPerWeek: 4,
    dayLabels: ['Day 1 — Lower Strength', 'Day 2 — Upper Strength', 'Day 3 — Full Body Power', 'Day 4 — Accessory + Conditioning'],
  },
  performance: {
    daysPerWeek: 4,
    dayLabels: ['Day 1 — Lower Power', 'Day 2 — Upper Power', 'Day 3 — Total Body Strength', 'Day 4 — Speed + Conditioning'],
  },
  peak: {
    daysPerWeek: 3,
    dayLabels: ['Day 1 — Strength Maintenance', 'Day 2 — Power + Speed', 'Day 3 — Recovery + Mobility'],
  },
};
