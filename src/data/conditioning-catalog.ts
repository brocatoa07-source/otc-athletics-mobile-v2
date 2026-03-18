/* ────────────────────────────────────────────────
 * Static Conditioning Catalog
 * 5 categories with proper metadata-based tagging.
 * ──────────────────────────────────────────────── */

export interface ConditioningExercise {
  name: string;
  sets: string;
  cue: string;
  mainCategory: ConditioningCategory;
  subCategory: string;
  energySystem?: string;
  distance?: string;
  restInterval?: string;
  goal?: string;
}

export type ConditioningCategory =
  | 'recovery'
  | 'aerobic'
  | 'cod'
  | 'sprint'
  | 'game';

export interface ConditioningCategoryDef {
  key: ConditioningCategory;
  label: string;
  icon: string;
  color: string;
}

export const CONDITIONING_CATEGORIES: ConditioningCategoryDef[] = [
  { key: 'recovery', label: 'Recovery', icon: 'leaf-outline', color: '#22c55e' },
  { key: 'aerobic', label: 'Aerobic', icon: 'heart-outline', color: '#3b82f6' },
  { key: 'cod', label: 'Change of Direction', icon: 'swap-horizontal-outline', color: '#f59e0b' },
  { key: 'sprint', label: 'Sprint', icon: 'flash-outline', color: '#ef4444' },
  { key: 'game', label: 'Game Conditioning', icon: 'baseball-outline', color: '#8b5cf6' },
];

export const CONDITIONING_SUBCATEGORY_LABELS: Record<string, string> = {
  // Recovery
  'walk': 'Walk',
  'light-jog': 'Light Jog',
  'cool-down': 'Cool Down',
  'flush': 'Flush Run',
  // Aerobic
  'tempo-run': 'Tempo Run',
  'steady-state': 'Steady State',
  'pole-run': 'Pole Run',
  'long-run': 'Long Run',
  // COD
  'shuttle': 'Shuttle',
  'pro-agility': 'Pro Agility',
  'lateral': 'Lateral',
  'reactive': 'Reactive',
  // Sprint
  'acceleration': 'Acceleration',
  'build-up': 'Build-Up',
  'fly': 'Fly Sprint',
  'resisted': 'Resisted',
  // Game
  'base-running': 'Base Running',
  'position-specific': 'Position-Specific',
  'interval': 'Interval',
};

/* ─── RECOVERY ────────────────────────────────── */

const RECOVERY: ConditioningExercise[] = [
  {
    name: 'Recovery Walk',
    sets: '10–15 min',
    cue: 'Easy pace, focus on breathing and relaxation.',
    mainCategory: 'recovery',
    subCategory: 'walk',
    energySystem: 'aerobic',
    goal: 'Active recovery and blood flow',
  },
  {
    name: 'Light Recovery Jog',
    sets: '8–12 min',
    cue: 'Conversational pace — if you can\'t talk easily, slow down.',
    mainCategory: 'recovery',
    subCategory: 'light-jog',
    energySystem: 'aerobic',
    goal: 'Promote blood flow without added fatigue',
  },
  {
    name: 'Cool-Down Jog',
    sets: '5–8 min',
    cue: 'Gradually decrease pace from working speed to easy jog.',
    mainCategory: 'recovery',
    subCategory: 'cool-down',
    energySystem: 'aerobic',
    goal: 'Transition from high intensity to rest',
  },
  {
    name: 'Flush Run',
    sets: '12–15 min',
    cue: 'Low-intensity continuous movement to clear metabolic waste.',
    mainCategory: 'recovery',
    subCategory: 'flush',
    energySystem: 'aerobic',
    goal: 'Reduce soreness and promote recovery',
  },
  {
    name: 'Walking Lunge Cool-Down',
    sets: '2 × 20 yd',
    cue: 'Slow, controlled walking lunges as active recovery.',
    mainCategory: 'recovery',
    subCategory: 'cool-down',
    energySystem: 'aerobic',
    goal: 'Light stretch under movement',
  },
];

/* ─── AEROBIC ─────────────────────────────────── */

const AEROBIC: ConditioningExercise[] = [
  {
    name: 'Tempo Run',
    sets: '6–8 × 200 yd',
    cue: '~70% effort, controlled breathing. Walk back to start between reps.',
    mainCategory: 'aerobic',
    subCategory: 'tempo-run',
    energySystem: 'aerobic',
    distance: '200 yd',
    restInterval: 'Walk back (~60s)',
    goal: 'Build aerobic base without taxing CNS',
  },
  {
    name: 'Pole-to-Pole Tempo',
    sets: '8–10 × foul pole',
    cue: 'Jog foul pole to foul pole at ~65% effort. Walk the curve.',
    mainCategory: 'aerobic',
    subCategory: 'pole-run',
    energySystem: 'aerobic',
    distance: 'Foul pole to foul pole',
    restInterval: 'Walk the curve',
    goal: 'Sport-specific aerobic conditioning',
  },
  {
    name: 'Steady State Run',
    sets: '15–20 min',
    cue: 'Maintain consistent ~65–70% heart rate. Not a race.',
    mainCategory: 'aerobic',
    subCategory: 'steady-state',
    energySystem: 'aerobic',
    goal: 'Build aerobic engine and endurance',
  },
  {
    name: 'Long Jog',
    sets: '20–25 min',
    cue: 'Conversational pace. Build time on feet.',
    mainCategory: 'aerobic',
    subCategory: 'long-run',
    energySystem: 'aerobic',
    goal: 'Aerobic endurance and mental toughness',
  },
  {
    name: '100yd Tempo Intervals',
    sets: '10 × 100 yd',
    cue: '~70% effort. Walk 50yd between reps.',
    mainCategory: 'aerobic',
    subCategory: 'tempo-run',
    energySystem: 'aerobic',
    distance: '100 yd',
    restInterval: '50 yd walk',
    goal: 'Short-distance aerobic repeats',
  },
];

/* ─── CHANGE OF DIRECTION ─────────────────────── */

const COD: ConditioningExercise[] = [
  {
    name: '5-10-5 Shuttle (Pro Agility)',
    sets: '4–6 reps',
    cue: 'Explode laterally, plant hard, drive through each direction change.',
    mainCategory: 'cod',
    subCategory: 'pro-agility',
    energySystem: 'anaerobic alactic',
    distance: '25 yd total',
    restInterval: '60–90s',
    goal: 'Lateral quickness and change of direction',
  },
  {
    name: 'Lateral Shuffle to Sprint',
    sets: '4–6 reps',
    cue: 'Shuffle 10yd then explode into a linear sprint for 20yd.',
    mainCategory: 'cod',
    subCategory: 'lateral',
    energySystem: 'anaerobic alactic',
    distance: '30 yd total',
    restInterval: '60–90s',
    goal: 'Transition from lateral to linear speed',
  },
  {
    name: '20yd Shuttle Run',
    sets: '4–6 reps',
    cue: 'Sprint 5yd, touch, sprint 10yd, touch, sprint 5yd.',
    mainCategory: 'cod',
    subCategory: 'shuttle',
    energySystem: 'anaerobic alactic',
    distance: '20 yd',
    restInterval: '60–90s',
    goal: 'Short-area quickness and deceleration',
  },
  {
    name: 'Lateral Bound to Sprint',
    sets: '3–4 reps each side',
    cue: 'Bound laterally 3 times then transition to a 15yd sprint.',
    mainCategory: 'cod',
    subCategory: 'lateral',
    energySystem: 'anaerobic alactic',
    restInterval: '60s',
    goal: 'Power transfer from lateral to linear',
  },
  {
    name: 'Reactive T-Drill',
    sets: '4–5 reps',
    cue: 'Sprint forward, shuffle left/right on coach cue, backpedal to start.',
    mainCategory: 'cod',
    subCategory: 'reactive',
    energySystem: 'anaerobic alactic',
    restInterval: '90s',
    goal: 'Reactive agility and multi-directional speed',
  },
  {
    name: 'L-Drill (3-Cone)',
    sets: '4–6 reps',
    cue: 'Sprint 5yd, plant, sprint 5yd, round the cone, sprint back.',
    mainCategory: 'cod',
    subCategory: 'shuttle',
    energySystem: 'anaerobic alactic',
    distance: '~15 yd total',
    restInterval: '60–90s',
    goal: 'Short-area change of direction and acceleration',
  },
];

/* ─── SPRINT ──────────────────────────────────── */

const SPRINT: ConditioningExercise[] = [
  {
    name: '10yd Acceleration Sprint',
    sets: '4–6 reps',
    cue: 'Drive out of stance. Max effort for 10 yards.',
    mainCategory: 'sprint',
    subCategory: 'acceleration',
    energySystem: 'anaerobic alactic',
    distance: '10 yd',
    restInterval: '60–90s',
    goal: 'First-step explosion and acceleration mechanics',
  },
  {
    name: '20yd Build-Up Sprint',
    sets: '4–6 reps',
    cue: 'Accelerate progressively — 60% → 80% → 100% by 20yd.',
    mainCategory: 'sprint',
    subCategory: 'build-up',
    energySystem: 'anaerobic alactic',
    distance: '20 yd',
    restInterval: '60–90s',
    goal: 'Speed development with controlled acceleration',
  },
  {
    name: '30yd Fly Sprint',
    sets: '3–4 reps',
    cue: '10yd jog-in, then hit max speed for 30yd.',
    mainCategory: 'sprint',
    subCategory: 'fly',
    energySystem: 'anaerobic alactic',
    distance: '30 yd (+ 10yd approach)',
    restInterval: '2–3 min',
    goal: 'Top-end speed development',
  },
  {
    name: 'Resisted Sprint (Sled)',
    sets: '4–6 × 15 yd',
    cue: 'Drive against sled resistance, maintain forward lean.',
    mainCategory: 'sprint',
    subCategory: 'resisted',
    energySystem: 'anaerobic alactic',
    distance: '15 yd',
    restInterval: '90s–2 min',
    goal: 'Acceleration strength and power output',
  },
  {
    name: 'Falling Start Sprint',
    sets: '4–5 reps',
    cue: 'Lean forward until you fall, then sprint 15yd.',
    mainCategory: 'sprint',
    subCategory: 'acceleration',
    energySystem: 'anaerobic alactic',
    distance: '15 yd',
    restInterval: '60–90s',
    goal: 'Acceleration mechanics and first-step speed',
  },
  {
    name: 'Half-Kneeling Start Sprint',
    sets: '4–5 reps each side',
    cue: 'Start in half-kneeling position, explode to full sprint for 20yd.',
    mainCategory: 'sprint',
    subCategory: 'acceleration',
    energySystem: 'anaerobic alactic',
    distance: '20 yd',
    restInterval: '60–90s',
    goal: 'Drive phase and low-to-high transition',
  },
  {
    name: 'Wall Drive March',
    sets: '3 × 10 each side',
    cue: 'Hands on wall, drive knee to chest alternating. Focus on piston action.',
    mainCategory: 'sprint',
    subCategory: 'acceleration',
    energySystem: 'anaerobic alactic',
    goal: 'Sprint mechanics and hip drive activation',
  },
];

/* ─── GAME CONDITIONING ───────────────────────── */

const GAME: ConditioningExercise[] = [
  {
    name: 'Home-to-First Sprint',
    sets: '4–6 reps',
    cue: 'Simulate a ground ball — sprint 90ft from home to first.',
    mainCategory: 'game',
    subCategory: 'base-running',
    energySystem: 'anaerobic alactic',
    distance: '90 ft',
    restInterval: '60–90s',
    goal: 'Game-speed base running',
  },
  {
    name: 'Home-to-Second Sprint',
    sets: '3–4 reps',
    cue: 'Sprint home to first, round the bag, sprint to second.',
    mainCategory: 'game',
    subCategory: 'base-running',
    energySystem: 'anaerobic lactic',
    distance: '180 ft',
    restInterval: '90s–2 min',
    goal: 'Extended base running and rounding mechanics',
  },
  {
    name: 'Outfield Reaction Sprint',
    sets: '4–6 reps',
    cue: 'Start at position, react to cue and sprint 30yd to simulated fly ball.',
    mainCategory: 'game',
    subCategory: 'position-specific',
    energySystem: 'anaerobic alactic',
    distance: '30 yd',
    restInterval: '60–90s',
    goal: 'Position-specific reactive speed',
  },
  {
    name: 'Infield Sprint Shuttle',
    sets: '4–5 reps',
    cue: 'Sprint to ball, field, throw to first, sprint back to position.',
    mainCategory: 'game',
    subCategory: 'position-specific',
    energySystem: 'anaerobic alactic',
    restInterval: '60–90s',
    goal: 'Infield conditioning with game movements',
  },
  {
    name: '60/120 Intervals',
    sets: '6–8 reps',
    cue: 'Sprint 60yd, jog 120yd. Repeat without stopping.',
    mainCategory: 'game',
    subCategory: 'interval',
    energySystem: 'anaerobic lactic / aerobic',
    distance: '60yd sprint / 120yd jog',
    restInterval: 'Jog is the rest',
    goal: 'Game-level work-to-rest conditioning',
  },
  {
    name: '30/30 Intervals',
    sets: '8–10 reps',
    cue: 'Sprint 30s, walk/jog 30s. Maintain intensity each rep.',
    mainCategory: 'game',
    subCategory: 'interval',
    energySystem: 'anaerobic lactic',
    restInterval: '30s walk/jog',
    goal: 'High-intensity game-like conditioning',
  },
];

/* ─── COMBINED CATALOG ────────────────────────── */

export const CONDITIONING_CATALOG: ConditioningExercise[] = [
  ...RECOVERY,
  ...AEROBIC,
  ...COD,
  ...SPRINT,
  ...GAME,
];

/** Quick lookup by category */
export function getConditioningByCategory(cat: ConditioningCategory): ConditioningExercise[] {
  return CONDITIONING_CATALOG.filter((e) => e.mainCategory === cat);
}
