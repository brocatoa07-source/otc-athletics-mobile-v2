import type { Position, TrainingExperience, TrainingTimeline, ScProfile } from '@/hooks/useAthleteScProfile';
import type { DeficiencyScores, Dimension } from '@/data/deficiency-engine';
import { getTopDeficiencies } from '@/data/deficiency-engine';

/* ────────────────────────────────────────────────────
 * 6-MONTH DEVELOPMENT MAP
 *
 * A periodized training plan broken into 6 mesocycles
 * (4-week blocks). Each block has a specific focus,
 * volume/intensity targets, and key exercises.
 *
 * Adapts based on:
 *   - Training timeline (offseason/preseason/in-season)
 *   - Position (OF/IF/C)
 *   - Top deficiencies from assessment
 *   - Experience level
 * ──────────────────────────────────────────────────── */

export interface MesoCycle {
  month: number;         // 1-6
  title: string;
  focus: string;
  tagline: string;
  color: string;
  volumeLevel: 'low' | 'moderate' | 'high';
  intensityLevel: 'low' | 'moderate' | 'high';
  keyLifts: string[];
  keyDrills: string[];
  dimensionFocus: Dimension[];
  weeklyStructure: string;
}

export interface DevMap {
  startTimeline: TrainingTimeline;
  position: Position;
  totalWeeks: number;
  mesoCycles: MesoCycle[];
}

/* ────────────────────────────────────────────────────
 * MESOCYCLE TEMPLATES BY TIMELINE
 * ──────────────────────────────────────────────────── */

const OFFSEASON_TEMPLATE: Omit<MesoCycle, 'dimensionFocus'>[] = [
  {
    month: 1,
    title: 'Foundation',
    focus: 'General Physical Prep',
    tagline: 'Build the base. Earn the right to train hard.',
    color: '#22c55e',
    volumeLevel: 'high',
    intensityLevel: 'low',
    keyLifts: ['Goblet Squat', 'RDL', 'DB Bench', 'Pull-Ups'],
    keyDrills: ['Mobility circuits', 'Bodyweight complexes', 'Med ball basics'],
    weeklyStructure: '4 days: 2 full body + 1 upper + 1 lower',
  },
  {
    month: 2,
    title: 'Accumulation',
    focus: 'Hypertrophy & Work Capacity',
    tagline: 'Add muscle. Build the engine.',
    color: '#3b82f6',
    volumeLevel: 'high',
    intensityLevel: 'moderate',
    keyLifts: ['Back Squat', 'Bench Press', 'Barbell Row', 'Walking Lunge'],
    keyDrills: ['Sled work', 'Med ball rotational', 'Jump rope conditioning'],
    weeklyStructure: '4 days: Upper/Lower split',
  },
  {
    month: 3,
    title: 'Strength',
    focus: 'Max Strength Development',
    tagline: 'Get strong. Everything builds on this.',
    color: '#8b5cf6',
    volumeLevel: 'moderate',
    intensityLevel: 'high',
    keyLifts: ['Trap Bar Deadlift', 'Back Squat', 'Bench Press', 'Overhead Press'],
    keyDrills: ['Heavy carries', 'Isometric holds', 'Plyo prep'],
    weeklyStructure: '4 days: Heavy/Light Upper/Lower',
  },
  {
    month: 4,
    title: 'Power Conversion',
    focus: 'Turning Strength into Speed',
    tagline: 'Translate the force. Become explosive.',
    color: '#f59e0b',
    volumeLevel: 'moderate',
    intensityLevel: 'high',
    keyLifts: ['Front Squat', 'Hip Thrust', 'Landmine Press', 'Single-Leg RDL'],
    keyDrills: ['Box jumps', 'Broad jumps', 'Med ball throws', 'Sprint work'],
    weeklyStructure: '4 days: Strength + Power paired',
  },
  {
    month: 5,
    title: 'Sport Speed',
    focus: 'Baseball-Specific Power & Speed',
    tagline: 'Train the way the game demands.',
    color: '#ef4444',
    volumeLevel: 'low',
    intensityLevel: 'high',
    keyLifts: ['Bulgarian Split Squat', 'Pull-Ups', 'Pallof Press', 'RDL'],
    keyDrills: ['Sprint intervals', 'Rotational throws', 'Lateral bounds', 'Bat speed'],
    weeklyStructure: '3-4 days: Sport-specific emphasis',
  },
  {
    month: 6,
    title: 'Peak & Maintain',
    focus: 'Peaking for Competition',
    tagline: 'Sharp. Fast. Ready.',
    color: '#06b6d4',
    volumeLevel: 'low',
    intensityLevel: 'moderate',
    keyLifts: ['Trap Bar DL', 'DB Press', 'Chin-Ups', 'Hip Thrust'],
    keyDrills: ['Game-speed sprints', 'Reactive drills', 'Arm care daily', 'Recovery focus'],
    weeklyStructure: '3 days: Maintain strength, maximize recovery',
  },
];

const PRESEASON_TEMPLATE: Omit<MesoCycle, 'dimensionFocus'>[] = [
  {
    month: 1,
    title: 'Strength Maintain',
    focus: 'Hold Gains, Sharpen Movement',
    tagline: 'Don\'t lose what you built.',
    color: '#3b82f6',
    volumeLevel: 'moderate',
    intensityLevel: 'moderate',
    keyLifts: ['Trap Bar DL', 'Back Squat', 'Bench Press', 'Row'],
    keyDrills: ['Mobility daily', 'Light plyo', 'Arm care'],
    weeklyStructure: '3-4 days: Full body emphasis',
  },
  {
    month: 2,
    title: 'Power Transfer',
    focus: 'Convert Strength to Game Speed',
    tagline: 'Be explosive when it counts.',
    color: '#f59e0b',
    volumeLevel: 'low',
    intensityLevel: 'high',
    keyLifts: ['Front Squat', 'Hip Thrust', 'Landmine Press', 'Pull-Ups'],
    keyDrills: ['Med ball rotational', 'Box jumps', 'Sprint intervals', 'Bat speed'],
    weeklyStructure: '3 days: Speed/Power focus',
  },
  {
    month: 3,
    title: 'Game Ready',
    focus: 'Peak Performance',
    tagline: 'You\'re built for this. Go compete.',
    color: '#ef4444',
    volumeLevel: 'low',
    intensityLevel: 'moderate',
    keyLifts: ['Bulgarian Split Squat', 'DB Row', 'Hip Thrust'],
    keyDrills: ['Game-speed baserunning', 'Reactive agility', 'Arm care', 'Recovery'],
    weeklyStructure: '2-3 days: Maintain + recover',
  },
  {
    month: 4,
    title: 'In-Season Maintain',
    focus: 'Stay Strong, Stay Healthy',
    tagline: 'The season is the priority.',
    color: '#06b6d4',
    volumeLevel: 'low',
    intensityLevel: 'low',
    keyLifts: ['Trap Bar DL', 'Push-Ups', 'Chin-Ups', 'Pallof Press'],
    keyDrills: ['Arm care', 'Hip mobility', 'Light conditioning', 'Recovery protocols'],
    weeklyStructure: '2 days: Full body, low volume',
  },
  {
    month: 5,
    title: 'Mid-Season Check',
    focus: 'Address Weak Links',
    tagline: 'Stay sharp. Don\'t fade.',
    color: '#8b5cf6',
    volumeLevel: 'low',
    intensityLevel: 'moderate',
    keyLifts: ['Goblet Squat', 'DB Bench', 'Single-Leg RDL', 'Face Pull'],
    keyDrills: ['Prehab circuits', 'Sprint maintenance', 'Mental reset tools'],
    weeklyStructure: '2 days: Targeted maintenance',
  },
  {
    month: 6,
    title: 'Finish Strong',
    focus: 'Late-Season Performance',
    tagline: 'Championships are won in September.',
    color: '#22c55e',
    volumeLevel: 'low',
    intensityLevel: 'low',
    keyLifts: ['Hip Thrust', 'Pull-Ups', 'Band Work', 'Core'],
    keyDrills: ['Recovery priority', 'Arm care', 'Mental performance', 'Nutrition focus'],
    weeklyStructure: '2 days: Recovery-first approach',
  },
];

const IN_SEASON_TEMPLATE: Omit<MesoCycle, 'dimensionFocus'>[] = [
  {
    month: 1,
    title: 'Maintain & Recover',
    focus: 'Preserve Strength, Prioritize Recovery',
    tagline: 'Win games, not gym PRs.',
    color: '#06b6d4',
    volumeLevel: 'low',
    intensityLevel: 'moderate',
    keyLifts: ['Trap Bar DL', 'Push-Ups', 'Chin-Ups', 'Hip Thrust'],
    keyDrills: ['Arm care daily', 'Hip mobility', 'Light conditioning'],
    weeklyStructure: '2 days: Full body, game-day aware',
  },
  {
    month: 2,
    title: 'Stay Sharp',
    focus: 'Performance Maintenance',
    tagline: 'Don\'t regress. Stay dangerous.',
    color: '#3b82f6',
    volumeLevel: 'low',
    intensityLevel: 'moderate',
    keyLifts: ['Goblet Squat', 'DB Row', 'Landmine Press', 'Single-Leg Work'],
    keyDrills: ['Sprint touch-ups', 'Prehab', 'Recovery protocols'],
    weeklyStructure: '2 days: Upper/Lower or Full Body',
  },
  {
    month: 3,
    title: 'Grind Phase',
    focus: 'Fight Fatigue',
    tagline: 'This is where weak players fade.',
    color: '#f59e0b',
    volumeLevel: 'low',
    intensityLevel: 'low',
    keyLifts: ['Band Work', 'Bodyweight Circuits', 'Core', 'Carries'],
    keyDrills: ['Recovery focus', 'Sleep protocol', 'Nutrition timing', 'Mental tools'],
    weeklyStructure: '2 days: Minimum effective dose',
  },
  {
    month: 4,
    title: 'Playoff Push',
    focus: 'Peak When It Matters',
    tagline: 'Be the best version of yourself now.',
    color: '#ef4444',
    volumeLevel: 'low',
    intensityLevel: 'moderate',
    keyLifts: ['Hip Thrust', 'Pull-Ups', 'Pallof Press'],
    keyDrills: ['Game-speed movement', 'Arm care', 'Breathing/recovery'],
    weeklyStructure: '1-2 days: Strategic maintenance only',
  },
  {
    month: 5,
    title: 'Transition',
    focus: 'Active Recovery & Assessment',
    tagline: 'Rest smart. Rebuild smarter.',
    color: '#22c55e',
    volumeLevel: 'low',
    intensityLevel: 'low',
    keyLifts: ['Light full body', 'Mobility circuits', 'Yoga/stretch'],
    keyDrills: ['Active recovery', 'Movement reassessment', 'Goal setting'],
    weeklyStructure: '2-3 days: Recovery + light movement',
  },
  {
    month: 6,
    title: 'Rebuild',
    focus: 'Begin Offseason Foundation',
    tagline: 'The next version starts here.',
    color: '#8b5cf6',
    volumeLevel: 'moderate',
    intensityLevel: 'low',
    keyLifts: ['Goblet Squat', 'RDL', 'DB Bench', 'Rows'],
    keyDrills: ['GPP circuits', 'Mobility work', 'Bodyweight basics'],
    weeklyStructure: '3-4 days: Foundation rebuilding',
  },
];

/* ────────────────────────────────────────────────────
 * DEV MAP BUILDER
 * ──────────────────────────────────────────────────── */

function getTemplate(timeline: TrainingTimeline): Omit<MesoCycle, 'dimensionFocus'>[] {
  switch (timeline) {
    case 'offseason': return OFFSEASON_TEMPLATE;
    case 'preseason': return PRESEASON_TEMPLATE;
    case 'in-season': return IN_SEASON_TEMPLATE;
    default: {
      const _exhaustive: never = timeline;
      return _exhaustive;
    }
  }
}

/** Maps deficiency dimensions to mesocycle focus distribution */
function assignDimensionFocus(
  template: Omit<MesoCycle, 'dimensionFocus'>[],
  deficiencies?: DeficiencyScores,
): MesoCycle[] {
  const topDefs = deficiencies ? getTopDeficiencies(deficiencies, 3) : [];

  return template.map((cycle, i) => {
    // Default dimension focus per phase
    let dims: Dimension[];
    switch (i) {
      case 0: dims = ['mobility', 'durability']; break;     // Foundation
      case 1: dims = ['strength', 'durability']; break;     // Build
      case 2: dims = ['strength', 'power']; break;          // Peak strength
      case 3: dims = ['power', 'speed']; break;             // Convert
      case 4: dims = ['speed', 'power']; break;             // Sport speed
      case 5: dims = ['durability', 'mobility']; break;     // Maintain
      default: dims = ['strength', 'mobility'];
    }

    // Inject top deficiency into early phases (months 1-3)
    if (topDefs.length > 0 && i < 3) {
      const injected = topDefs[0];
      if (!dims.includes(injected)) {
        dims = [injected, dims[0]];
      }
    }

    return { ...cycle, dimensionFocus: dims };
  });
}

export function buildDevMap(profile: ScProfile, deficiencies?: DeficiencyScores): DevMap {
  const template = getTemplate(profile.timeline);
  const mesoCycles = assignDimensionFocus(template, deficiencies);

  return {
    startTimeline: profile.timeline,
    position: profile.position,
    totalWeeks: 24,
    mesoCycles,
  };
}

/** Get the current month (1-6) based on profile creation date */
export function getCurrentMonth(completedAt: string | null): number {
  const start = new Date(completedAt ?? new Date().toISOString());
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
  const month = Math.floor(diffWeeks / 4) + 1;
  return Math.min(Math.max(month, 1), 6);
}
