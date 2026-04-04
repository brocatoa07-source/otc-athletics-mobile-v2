/**
 * Athlete-Facing Profile Language
 *
 * Translates internal profile engine outputs into plain-English copy
 * that athletes see on their profile card, Daily Work, and My Path screens.
 *
 * NO internal labels like 'elastic_reactive', 'speed_rotation',
 * or 'maintain_force_low_volume' should reach the product surface.
 */

import type { StrengthArchetype, StrengthNeed, DailyWorkFocus, MyPathStartPoint } from '../types/strengthProfile';
import { getPrescriptionOutput } from './prescriptionOutputs';

// ── Archetype Display Names ─────────────────────────────────────────────────

export const ARCHETYPE_DISPLAY: Record<StrengthArchetype, {
  title: string;
  subtitle: string;
  color: string;
}> = {
  static: {
    title: 'Static Force Athlete',
    subtitle: 'You produce strength through grinding, controlled force. Your power comes from the ground up — deliberate, heavy, stable.',
    color: '#3b82f6',
  },
  spring: {
    title: 'Spring Elastic Athlete',
    subtitle: 'You produce power through bounce, reactivity, and speed. Your system is fast and explosive — but may need a stronger base beneath it.',
    color: '#ef4444',
  },
  hybrid: {
    title: 'Hybrid Balanced Athlete',
    subtitle: 'You have balanced force and elastic qualities. Your training should be driven by your biggest need, not a blanket approach.',
    color: '#22c55e',
  },
};

// ── Need Display Names ──────────────────────────────────────────────────────

export const NEED_DISPLAY: Record<StrengthNeed, {
  label: string;
  description: string;
}> = {
  mobility: {
    label: 'Movement Access',
    description: 'Limited joint access is blocking your positions. You need better range before you can load or transfer effectively.',
  },
  stability_control: {
    label: 'Positional Control',
    description: 'Force leaks are limiting transfer. Your body loses position under speed and load — control must improve before chaos increases.',
  },
  strength: {
    label: 'Base Strength',
    description: 'You need more raw force production. Build the foundation before chasing speed or complexity.',
  },
  elasticity: {
    label: 'Elastic & Reactive Qualities',
    description: 'You need better stiffness, rebound, and conversion of force into quickness. Your strength is there — now make it faster.',
  },
  speed_rotation: {
    label: 'Speed & Rotation Transfer',
    description: 'You have capacity but poor transfer to sprint and rotational outputs. Sharpen the expression, not the engine.',
  },
};

// ── Daily Work Display ──────────────────────────────────────────────────────

export const DAILY_WORK_DISPLAY: Record<DailyWorkFocus, {
  title: string;
  description: string;
}> = {
  mobility_access: {
    title: 'Movement Access',
    description: 'Daily mobility and position ownership work — hip, ankle, T-spine, shoulder.',
  },
  position_control: {
    title: 'Position Control',
    description: 'Daily stability and control work — pelvis, single-leg, trunk, anti-rotation.',
  },
  strength_base: {
    title: 'Strength Support',
    description: 'Daily isometric, posterior chain, and trunk strength support.',
  },
  elastic_reactivity: {
    title: 'Elastic Reactivity',
    description: 'Daily stiffness, rebound, and reactive quality work.',
  },
  speed_rotation: {
    title: 'Speed & Rotation',
    description: 'Daily acceleration mechanics, separation, and rotational speed drills.',
  },
};

// ── My Path Display ─────────────────────────────────────────────────────────

export const MY_PATH_DISPLAY: Record<MyPathStartPoint, {
  title: string;
  description: string;
}> = {
  own_positions: {
    title: 'Own Your Positions',
    description: 'Start by improving movement access and positional control before adding load.',
  },
  build_strength_base: {
    title: 'Build Your Strength Base',
    description: 'Start by improving base force output with simpler, honest strength progressions.',
  },
  build_elasticity: {
    title: 'Build Elasticity',
    description: 'Start by improving stiffness and rebound to convert your strength into quickness.',
  },
  improve_acceleration: {
    title: 'Improve Acceleration',
    description: 'Start by sharpening first-step mechanics and force transfer to sprint outputs.',
  },
  improve_rotation: {
    title: 'Improve Rotation',
    description: 'Start by improving separation access, sequencing, and rotational speed expression.',
  },
};

// ── Full Profile Summary Generator ──────────────────────────────────────────

export interface AthleteProfileSummary {
  /** "You are a Static Force Athlete" */
  whoYouAre: string;
  /** "Your biggest need right now is..." */
  biggestNeed: string;
  /** "Your program will emphasize..." */
  programEmphasis: string;
  /** "It will reduce..." */
  programReduces: string;
  /** Daily Work label and description */
  dailyWork: { title: string; description: string };
  /** My Path label and description */
  myPath: { title: string; description: string };
  /** What to stop overdoing */
  stopOverdoing: string[];
  /** Accent color for UI */
  accentColor: string;
}

/**
 * Generate the full athlete-facing profile summary.
 * Uses locked prescription outputs when available, falls back to generic display.
 */
export function generateAthleteProfileSummary(
  archetype: StrengthArchetype,
  need: StrengthNeed,
  dailyWorkFocus: DailyWorkFocus,
  myPathStart: MyPathStartPoint,
): AthleteProfileSummary {
  const archetypeDisplay = ARCHETYPE_DISPLAY[archetype];
  const needDisplay = NEED_DISPLAY[need];
  const dailyWorkDisplay = DAILY_WORK_DISPLAY[dailyWorkFocus];
  const myPathDisplay = MY_PATH_DISPLAY[myPathStart];

  // Use locked prescription output if available for sharper copy
  const locked = getPrescriptionOutput(archetype, need);

  return {
    whoYouAre: `You are a ${archetypeDisplay.title}. ${archetypeDisplay.subtitle}`,
    biggestNeed: locked
      ? locked.athleteNeedLabel
      : `Your biggest need right now is ${needDisplay.label.toLowerCase()}. ${needDisplay.description}`,
    programEmphasis: locked
      ? locked.programEmphasis
      : `Your program will emphasize building ${needDisplay.label.toLowerCase()} through targeted training.`,
    programReduces: locked
      ? locked.programReduces
      : 'It will reduce volume in areas where you are already strong to make room for what you need most.',
    dailyWork: dailyWorkDisplay,
    myPath: myPathDisplay,
    stopOverdoing: locked?.stopOverdoing ?? [],
    accentColor: archetypeDisplay.color,
  };
}
