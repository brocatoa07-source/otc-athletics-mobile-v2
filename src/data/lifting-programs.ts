import { Ionicons } from '@expo/vector-icons';

/* ────────────────────────────────────────────────────
 * PERIODIZED LIFTING PROGRAMS — by Mover Type
 * 3 types × 3 phases × weekly blocks × daily sessions
 * ──────────────────────────────────────────────────── */

export type MoverType = 'static' | 'spring' | 'hybrid';
export type LiftingPhase = 'offseason' | 'preseason' | 'in-season';

export interface LiftingExercise {
  name: string;
  sets: string;       // e.g. "4 × 6", "3 × 8-10"
  cue: string;
  videoUrl?: string;
}

export interface LiftingDay {
  dayNumber: number;
  label: string;      // e.g. "Day 1 — Lower Power"
  focus: string;
  exercises: LiftingExercise[];
}

export interface LiftingWeek {
  weekNumber: number;
  title: string;      // e.g. "Week 1 — Foundation"
  focus: string;
  days: LiftingDay[];
}

export interface LiftingPhaseData {
  key: LiftingPhase;
  title: string;
  subtitle: string;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
  durationWeeks: number;
  volumeLevel: 'low' | 'moderate' | 'high';
  intensityLevel: 'low' | 'moderate' | 'high';
  keyLifts: string[];
  weeks: LiftingWeek[];
}

export interface LiftingProgram {
  moverType: MoverType;
  label: string;
  color: string;
  tagline: string;
  totalWeeks: number;
  phases: LiftingPhaseData[];
}

/* ── Phase Colors & Icons ── */

export const PHASE_COLORS: Record<LiftingPhase, string> = {
  offseason: '#22c55e',
  preseason: '#f59e0b',
  'in-season': '#3b82f6',
};

export const PHASE_ICONS: Record<LiftingPhase, keyof typeof Ionicons.glyphMap> = {
  offseason: 'build-outline',
  preseason: 'flash-outline',
  'in-season': 'trophy-outline',
};

/* ── Mover Type Config ── */

interface MoverConfig {
  label: string;
  color: string;
  tagline: string;
  phases: Omit<LiftingPhaseData, 'weeks'>[];
}

const MOVER_CONFIG: Record<MoverType, MoverConfig> = {
  static: {
    label: 'Static-Dominant',
    color: '#ef4444',
    tagline: 'Strong engine. Stiff chassis. Time to unlock range and elasticity.',
    phases: [
      {
        key: 'offseason',
        title: 'Offseason',
        subtitle: 'Build mobility, eccentric strength, and movement quality.',
        color: '#22c55e',
        icon: 'build-outline',
        durationWeeks: 12,
        volumeLevel: 'high',
        intensityLevel: 'moderate',
        keyLifts: ['Trap Bar DL', 'Front Squat', 'RDL', 'DB Bench', 'Pull-Ups'],
      },
      {
        key: 'preseason',
        title: 'Preseason',
        subtitle: 'Convert strength to rotational power and speed.',
        color: '#f59e0b',
        icon: 'flash-outline',
        durationWeeks: 8,
        volumeLevel: 'moderate',
        intensityLevel: 'high',
        keyLifts: ['Hang Clean', 'Box Squat', 'Med Ball Rotational', 'Band Work'],
      },
      {
        key: 'in-season',
        title: 'In-Season',
        subtitle: 'Maintain strength, recover fast, stay explosive.',
        color: '#3b82f6',
        icon: 'trophy-outline',
        durationWeeks: 16,
        volumeLevel: 'low',
        intensityLevel: 'moderate',
        keyLifts: ['Trap Bar DL', 'DB Press', 'Band Pulls', 'Core Work'],
      },
    ],
  },
  spring: {
    label: 'Spring-Dominant',
    color: '#22c55e',
    tagline: 'Elastic and fast. Time to add strength and control to the explosiveness.',
    phases: [
      {
        key: 'offseason',
        title: 'Offseason',
        subtitle: 'Build raw strength and structural durability.',
        color: '#22c55e',
        icon: 'build-outline',
        durationWeeks: 12,
        volumeLevel: 'high',
        intensityLevel: 'moderate',
        keyLifts: ['Back Squat', 'Bench Press', 'Deadlift', 'Rows', 'Lunges'],
      },
      {
        key: 'preseason',
        title: 'Preseason',
        subtitle: 'Pair strength with speed. Power conversion phase.',
        color: '#f59e0b',
        icon: 'flash-outline',
        durationWeeks: 8,
        volumeLevel: 'moderate',
        intensityLevel: 'high',
        keyLifts: ['Power Clean', 'Jump Squats', 'Weighted Throws', 'Sprints'],
      },
      {
        key: 'in-season',
        title: 'In-Season',
        subtitle: 'Keep the spring loaded. Low volume, high intent.',
        color: '#3b82f6',
        icon: 'trophy-outline',
        durationWeeks: 16,
        volumeLevel: 'low',
        intensityLevel: 'moderate',
        keyLifts: ['Squat Variation', 'DB Press', 'Plyo Maintenance', 'Recovery'],
      },
    ],
  },
  hybrid: {
    label: 'Hybrid',
    color: '#f59e0b',
    tagline: 'Balanced mover. Develop both ends — strength and elasticity.',
    phases: [
      {
        key: 'offseason',
        title: 'Offseason',
        subtitle: 'Strengthen weak links and build a complete foundation.',
        color: '#22c55e',
        icon: 'build-outline',
        durationWeeks: 12,
        volumeLevel: 'high',
        intensityLevel: 'moderate',
        keyLifts: ['Trap Bar DL', 'Front Squat', 'DB Bench', 'RDL', 'Pull-Ups'],
      },
      {
        key: 'preseason',
        title: 'Preseason',
        subtitle: 'Blend strength and speed into game-ready power.',
        color: '#f59e0b',
        icon: 'flash-outline',
        durationWeeks: 8,
        volumeLevel: 'moderate',
        intensityLevel: 'high',
        keyLifts: ['Hang Clean', 'Box Jumps', 'Med Ball Work', 'Sprint Drills'],
      },
      {
        key: 'in-season',
        title: 'In-Season',
        subtitle: 'Maintain balance. Recover smart. Perform when it counts.',
        color: '#3b82f6',
        icon: 'trophy-outline',
        durationWeeks: 16,
        volumeLevel: 'low',
        intensityLevel: 'moderate',
        keyLifts: ['Trap Bar DL', 'Push/Pull Superset', 'Core', 'Mobility'],
      },
    ],
  },
};

/* ── Program Builder ── */

export function buildLiftingProgram(moverType: MoverType): LiftingProgram {
  const config = MOVER_CONFIG[moverType];

  return {
    moverType,
    label: config.label,
    color: config.color,
    tagline: config.tagline,
    totalWeeks: config.phases.reduce((sum, p) => sum + p.durationWeeks, 0),
    phases: config.phases.map((phase) => ({
      ...phase,
      weeks: Array.from({ length: phase.durationWeeks }, (_, i) => ({
        weekNumber: i + 1,
        title: `Week ${i + 1}`,
        focus: '',
        days: Array.from({ length: phase.key === 'in-season' ? 3 : 4 }, (_, d) => ({
          dayNumber: d + 1,
          label: `Day ${d + 1}`,
          focus: '',
          exercises: [], // Placeholder — real content slots in here
        })),
      })),
    })),
  };
}

/* ── Add-On Meta ── */

export const LIFTING_PROGRAM_META = {
  title: 'Periodized Lifting Program',
  price: '$199',
  priceCents: 19900,
  bullets: [
    '6-9 month periodized program',
    'Tailored to your mover type (Static / Spring / Hybrid)',
    '3 phases: Offseason, Preseason, In-Season',
    'Weekly blocks with daily sessions',
    'Coaching cues on every exercise',
  ],
  disclaimer: 'One-time purchase. Requires Mover Type Quiz. Content unlocks permanently.',
};
