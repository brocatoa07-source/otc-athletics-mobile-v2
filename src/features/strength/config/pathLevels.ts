/**
 * My Path Levels System
 *
 * Defines progression levels for each development lane.
 * Each lane has ordered levels that the athlete progresses through
 * based on program month and progression engine decisions.
 */

export interface PathLevel {
  level: number;
  title: string;
  description: string;
  focus: string[];
}

export interface PathLane {
  key: string;
  title: string;
  levels: PathLevel[];
  /** Pillar this lane belongs to */
  pillar: 'hitting' | 'strength' | 'mental';
}

// ── Movement Lane ───────────────────────────────────────────────────────────

const MOVEMENT_LANE: PathLane = {
  key: 'movement',
  title: 'Movement',
  pillar: 'strength',
  levels: [
    {
      level: 0, title: 'Own Positions',
      description: 'Restore movement access and learn to control your body.',
      focus: ['Hip IR/ER', 'Ankle DF', 'T-spine rotation', 'Position ownership'],
    },
    {
      level: 1, title: 'Movement Access',
      description: 'Improve range of motion and earn positions under load.',
      focus: ['Loaded mobility', 'Active end-range', 'Controlled depth', 'Full ROM lifts'],
    },
    {
      level: 2, title: 'Position Control',
      description: 'Own positions under speed, chaos, and fatigue.',
      focus: ['Single-leg control', 'Landing ownership', 'Reactive stability', 'Sport transfer'],
    },
  ],
};

// ── Strength Lane ───────────────────────────────────────────────────────────

const STRENGTH_LANE: PathLane = {
  key: 'strength',
  title: 'Strength',
  pillar: 'strength',
  levels: [
    {
      level: 0, title: 'Strength Base',
      description: 'Build foundational force output.',
      focus: ['Bilateral compounds', 'Posterior chain', 'Core stability', 'Eccentric control'],
    },
    {
      level: 1, title: 'Build Strength',
      description: 'Develop eccentric, isometric, and unilateral strength.',
      focus: ['Eccentric loading', 'Isometric holds', 'Unilateral progressions', 'Trunk strength'],
    },
    {
      level: 2, title: 'Max Strength',
      description: 'Express peak force and transfer to sport.',
      focus: ['Heavy compounds', 'Speed-strength contrast', 'Force-velocity profiling', 'Sport transfer'],
    },
  ],
};

// ── Elastic Lane ────────────────────────────────────────────────────────────

const ELASTIC_LANE: PathLane = {
  key: 'elastic',
  title: 'Elasticity',
  pillar: 'strength',
  levels: [
    {
      level: 0, title: 'Foundation',
      description: 'Build tendon capacity and basic stiffness.',
      focus: ['Pogos', 'Ankle stiffness', 'Low-level rebounds', 'Tendon prep'],
    },
    {
      level: 1, title: 'Stiffness',
      description: 'Develop reactive stiffness and rebound quality.',
      focus: ['Line hops', 'Drop sticks', 'Stiffness isos', 'Landing quality'],
    },
    {
      level: 2, title: 'Reactive',
      description: 'Convert stiffness into reactive power.',
      focus: ['Depth jumps', 'Reactive bounds', 'Hurdle hops', 'Speed contacts'],
    },
    {
      level: 3, title: 'Max Velocity',
      description: 'Apply elasticity to top-end speed.',
      focus: ['Flying sprints', 'Wickets', 'Dribbles', 'Max V rhythm'],
    },
    {
      level: 4, title: 'Transfer',
      description: 'Transfer elastic qualities to baseball movement.',
      focus: ['Baseball acceleration', 'Rotational speed', 'Position-specific movement'],
    },
  ],
};

// ── Speed / Rotation Lane ───────────────────────────────────────────────────

const SPEED_ROTATION_LANE: PathLane = {
  key: 'speed_rotation',
  title: 'Speed & Rotation',
  pillar: 'strength',
  levels: [
    {
      level: 0, title: 'Pattern',
      description: 'Learn sprint and rotational movement patterns.',
      focus: ['Wall drives', 'A-skips', 'Separation drills', 'Med ball patterns'],
    },
    {
      level: 1, title: 'Power',
      description: 'Build rotational and linear power.',
      focus: ['Resisted sprints', 'Med ball speed', 'Short acceleration', 'Rotational decel'],
    },
    {
      level: 2, title: 'Game Speed',
      description: 'Express speed and rotation at game intensity.',
      focus: ['Flying sprints', 'Max effort throws', 'Live acceleration', 'Position-specific movement'],
    },
  ],
};

// ── Hitting Lane ────────────────────────────────────────────────────────────

const HITTING_LANE: PathLane = {
  key: 'hitting',
  title: 'Hitting Development',
  pillar: 'hitting',
  levels: [
    {
      level: 0, title: 'Foundation',
      description: 'Build core swing movements and contact.',
      focus: ['Tee work', 'Contact point', 'Barrel control', 'Direction'],
    },
    {
      level: 1, title: 'Skill Building',
      description: 'Develop adjustability and timing.',
      focus: ['Flips', 'Front toss', 'Variable speed', 'Pitch height adjustment'],
    },
    {
      level: 2, title: 'Transfer',
      description: 'Transfer skills to live competition.',
      focus: ['Machine training', 'Live ABs', 'Approach rounds', 'Compete challenges'],
    },
  ],
};

// ── Mental Lane ─────────────────────────────────────────────────────────────

const MENTAL_LANE: PathLane = {
  key: 'mental',
  title: 'Mental Performance',
  pillar: 'mental',
  levels: [
    {
      level: 0, title: 'Awareness',
      description: 'Understand your mental profile and identity.',
      focus: ['Self-assessment', 'Archetype discovery', 'Habit identification'],
    },
    {
      level: 1, title: 'Skills',
      description: 'Build core mental performance skills.',
      focus: ['Visualization', 'Breathing', 'Focus routines', 'Confidence tools'],
    },
    {
      level: 2, title: 'Competition',
      description: 'Apply mental skills under game pressure.',
      focus: ['Pre-game routines', 'At-bat approach', 'Pressure management', 'Recovery after failure'],
    },
  ],
};

// ── All Lanes ───────────────────────────────────────────────────────────────

export const ALL_PATH_LANES: PathLane[] = [
  HITTING_LANE,
  STRENGTH_LANE,
  MOVEMENT_LANE,
  ELASTIC_LANE,
  SPEED_ROTATION_LANE,
  MENTAL_LANE,
];

/**
 * Get lanes available for a pillar.
 */
export function getLanesForPillar(pillar: 'hitting' | 'strength' | 'mental'): PathLane[] {
  return ALL_PATH_LANES.filter(l => l.pillar === pillar);
}

/**
 * Get the current level within a lane, clamped to lane max.
 */
export function getCurrentLevel(lane: PathLane, step: number): PathLevel {
  const clamped = Math.max(0, Math.min(step, lane.levels.length - 1));
  return lane.levels[clamped];
}

/**
 * Get progress percentage within a lane.
 */
export function getLaneProgress(lane: PathLane, step: number): number {
  if (lane.levels.length <= 1) return step >= 1 ? 100 : 0;
  return Math.round((Math.min(step, lane.levels.length - 1) / (lane.levels.length - 1)) * 100);
}
