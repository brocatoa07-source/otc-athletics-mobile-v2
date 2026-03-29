/**
 * Hitting Weekly Training Plans
 *
 * Prescriptive weekly plans based on focus areas.
 * Support 3, 4, and 5-day templates.
 */

import type { ProgressionStage } from './hitting-vault-sections';

export interface WeeklyPlanDrill {
  name: string;
  sectionKey: string;
  progression: ProgressionStage;
}

export interface WeeklyPlanDay {
  dayLabel: string;
  focus: string;
  drills: WeeklyPlanDrill[];
  notes?: string;
}

export interface WeeklyTrainingPlan {
  key: string;
  label: string;
  description: string;
  daysPerWeek: number;
  bestFor: string;
  days: WeeklyPlanDay[];
}

export const HITTING_WEEKLY_PLANS: WeeklyTrainingPlan[] = [

  // ── 3-Day General Development ─────────────────────────────────────────
  {
    key: '3day-general',
    label: '3-Day General Development',
    description: 'Balanced week: foundation + skill + competition. Good starting point for any hitter.',
    daysPerWeek: 3,
    bestFor: 'Any level. Balanced development.',
    days: [
      {
        dayLabel: 'Day 1',
        focus: 'High Tee + Timing',
        drills: [
          { name: 'High Tee Normal Swing', sectionKey: 'foundations', progression: 'tee' },
          { name: 'Inside Tee', sectionKey: 'foundations', progression: 'tee' },
          { name: 'Away Tee', sectionKey: 'foundations', progression: 'tee' },
          { name: 'Command Drill', sectionKey: 'timing', progression: 'flips' },
          { name: 'Normal Front Toss', sectionKey: 'foundations', progression: 'flips' },
        ],
      },
      {
        dayLabel: 'Day 2',
        focus: 'Adjustability + Machine',
        drills: [
          { name: 'High Tee Normal Swing', sectionKey: 'foundations', progression: 'tee' },
          { name: '2-Ball High/Low Tee', sectionKey: 'adjustability', progression: 'tee' },
          { name: 'Variable Front Toss', sectionKey: 'adjustability', progression: 'flips' },
          { name: 'Fastball Only Machine', sectionKey: 'machine-training', progression: 'machine' },
          { name: 'Random Pitch Machine', sectionKey: 'machine-training', progression: 'machine' },
        ],
      },
      {
        dayLabel: 'Day 3',
        focus: 'Competition + Approach',
        drills: [
          { name: 'High Tee Normal Swing', sectionKey: 'foundations', progression: 'tee' },
          { name: 'Zone Hunting Round', sectionKey: 'approach', progression: 'flips' },
          { name: 'Line Drive Challenge', sectionKey: 'competition', progression: 'competition' },
          { name: '2-Strike Battle Round', sectionKey: 'competition', progression: 'competition' },
        ],
      },
    ],
  },

  // ── 3-Day Timing Focus ────────────────────────────────────────────────
  {
    key: '3day-timing',
    label: '3-Day Timing Focus',
    description: 'For hitters who are late, out of rhythm, or struggling with velocity.',
    daysPerWeek: 3,
    bestFor: 'Hitters with timing issues. Late on fastballs.',
    days: [
      {
        dayLabel: 'Day 1',
        focus: 'Timing Drills + Foundation',
        drills: [
          { name: 'Rhythm Rocker Drill', sectionKey: 'timing', progression: 'tee' },
          { name: 'High Tee Normal Swing', sectionKey: 'foundations', progression: 'tee' },
          { name: 'Load → Launch → Swing', sectionKey: 'timing', progression: 'tee' },
          { name: 'Go Drill', sectionKey: 'timing', progression: 'flips' },
          { name: 'Normal Front Toss', sectionKey: 'foundations', progression: 'flips' },
        ],
      },
      {
        dayLabel: 'Day 2',
        focus: 'Velocity + Machine Transfer',
        drills: [
          { name: 'High Tee Normal Swing', sectionKey: 'foundations', progression: 'tee' },
          { name: 'Heel Load Drill', sectionKey: 'timing', progression: 'tee' },
          { name: 'Fastball Only Machine', sectionKey: 'machine-training', progression: 'machine' },
          { name: 'Velocity Ladder', sectionKey: 'machine-training', progression: 'machine' },
        ],
      },
      {
        dayLabel: 'Day 3',
        focus: 'Timing Under Pressure',
        drills: [
          { name: 'Walk Through Timing Drill', sectionKey: 'timing', progression: 'flips' },
          { name: 'Sit Fastball Round', sectionKey: 'approach', progression: 'machine' },
          { name: 'Line Drive Challenge', sectionKey: 'competition', progression: 'competition' },
        ],
      },
    ],
  },

  // ── 4-Day Development ─────────────────────────────────────────────────
  {
    key: '4day-development',
    label: '4-Day Full Development',
    description: 'Complete hitter development across all skill areas.',
    daysPerWeek: 4,
    bestFor: 'Serious hitters with 4 training days available.',
    days: [
      {
        dayLabel: 'Day 1',
        focus: 'High Tee Foundation',
        drills: [
          { name: 'High Tee Normal Swing', sectionKey: 'foundations', progression: 'tee' },
          { name: 'High Tee — Stop at Contact', sectionKey: 'foundations', progression: 'tee' },
          { name: 'Inside Tee', sectionKey: 'foundations', progression: 'tee' },
          { name: 'Away Tee', sectionKey: 'foundations', progression: 'tee' },
          { name: 'Deep Tee', sectionKey: 'foundations', progression: 'tee' },
          { name: 'Out Front Tee', sectionKey: 'foundations', progression: 'tee' },
        ],
      },
      {
        dayLabel: 'Day 2',
        focus: 'Timing + Adjustability',
        drills: [
          { name: 'High Tee Normal Swing', sectionKey: 'foundations', progression: 'tee' },
          { name: 'Command Drill', sectionKey: 'timing', progression: 'flips' },
          { name: '2-Ball High/Low Tee', sectionKey: 'adjustability', progression: 'tee' },
          { name: 'Variable Front Toss', sectionKey: 'adjustability', progression: 'flips' },
          { name: 'Random Front Toss', sectionKey: 'foundations', progression: 'flips' },
        ],
      },
      {
        dayLabel: 'Day 3',
        focus: 'Machine Transfer',
        drills: [
          { name: 'High Tee Normal Swing', sectionKey: 'foundations', progression: 'tee' },
          { name: 'Fastball Only Machine', sectionKey: 'machine-training', progression: 'machine' },
          { name: 'Fastball In — Machine', sectionKey: 'machine-training', progression: 'machine' },
          { name: 'Fastball Away — Machine', sectionKey: 'machine-training', progression: 'machine' },
          { name: 'Random Pitch Machine', sectionKey: 'machine-training', progression: 'machine' },
        ],
      },
      {
        dayLabel: 'Day 4',
        focus: 'Approach + Competition',
        drills: [
          { name: 'Zone Hunting Round', sectionKey: 'approach', progression: 'flips' },
          { name: 'Count Hitting Round', sectionKey: 'approach', progression: 'flips' },
          { name: 'Line Drive Challenge', sectionKey: 'competition', progression: 'competition' },
          { name: '2-Strike Battle Round', sectionKey: 'competition', progression: 'competition' },
        ],
      },
    ],
  },

  // ── 5-Day Advanced ────────────────────────────────────────────────────
  {
    key: '5day-advanced',
    label: '5-Day Advanced',
    description: 'High-volume week for committed hitters. Foundation + skill + machine + approach + compete.',
    daysPerWeek: 5,
    bestFor: 'Off-season or serious committed hitters.',
    days: [
      {
        dayLabel: 'Day 1',
        focus: 'Full Tee Progression',
        drills: [
          { name: 'High Tee Normal Swing', sectionKey: 'foundations', progression: 'tee' },
          { name: 'High Tee — Bat on Shoulder, No Stride', sectionKey: 'foundations', progression: 'tee' },
          { name: 'Inside Tee', sectionKey: 'foundations', progression: 'tee' },
          { name: 'Away Tee', sectionKey: 'foundations', progression: 'tee' },
          { name: 'Deep Tee', sectionKey: 'foundations', progression: 'tee' },
          { name: 'Out Front Tee', sectionKey: 'foundations', progression: 'tee' },
        ],
      },
      {
        dayLabel: 'Day 2',
        focus: 'Timing + Flips',
        drills: [
          { name: 'Rhythm Rocker Drill', sectionKey: 'timing', progression: 'tee' },
          { name: 'Go Drill', sectionKey: 'timing', progression: 'flips' },
          { name: 'Normal Front Toss', sectionKey: 'foundations', progression: 'flips' },
          { name: 'Random Front Toss', sectionKey: 'foundations', progression: 'flips' },
          { name: 'Variable Front Toss', sectionKey: 'adjustability', progression: 'flips' },
        ],
      },
      {
        dayLabel: 'Day 3',
        focus: 'Machine Training',
        drills: [
          { name: 'High Tee Normal Swing', sectionKey: 'foundations', progression: 'tee' },
          { name: 'Fastball Only Machine', sectionKey: 'machine-training', progression: 'machine' },
          { name: 'Velocity Ladder', sectionKey: 'machine-training', progression: 'machine' },
          { name: 'Random Pitch Machine', sectionKey: 'machine-training', progression: 'machine' },
        ],
      },
      {
        dayLabel: 'Day 4',
        focus: 'Approach + Direction',
        drills: [
          { name: 'Zone Hunting Round', sectionKey: 'approach', progression: 'flips' },
          { name: 'Opposite Field Only Round', sectionKey: 'adjustability', progression: 'flips' },
          { name: 'Count Hitting Round', sectionKey: 'approach', progression: 'flips' },
          { name: 'Trout Step Drill', sectionKey: 'posture', progression: 'tee' },
        ],
      },
      {
        dayLabel: 'Day 5',
        focus: 'Competition Day',
        drills: [
          { name: 'Line Drive Challenge', sectionKey: 'competition', progression: 'competition' },
          { name: '2-Strike Battle Round', sectionKey: 'competition', progression: 'competition' },
          { name: '21 Outs Game', sectionKey: 'competition', progression: 'competition' },
        ],
      },
    ],
  },

  // ── 3-Day Pull-Off Fix ────────────────────────────────────────────────
  {
    key: '3day-pull-off',
    label: '3-Day Pull-Off Fix',
    description: 'For hitters who pull off the ball, pull everything, and have no opposite field.',
    daysPerWeek: 3,
    bestFor: 'Hitters with direction and posture problems.',
    days: [
      {
        dayLabel: 'Day 1',
        focus: 'High Tee + Oppo Direction',
        drills: [
          { name: 'High Tee Normal Swing', sectionKey: 'foundations', progression: 'tee' },
          { name: 'Away Tee', sectionKey: 'foundations', progression: 'tee' },
          { name: 'Freddie\'s Drill', sectionKey: 'posture', progression: 'tee' },
          { name: 'Trout Step Drill', sectionKey: 'posture', progression: 'tee' },
          { name: 'Bottom Hand Throws', sectionKey: 'posture', progression: 'tee' },
        ],
      },
      {
        dayLabel: 'Day 2',
        focus: 'Connection + Extension',
        drills: [
          { name: 'High Tee Normal Swing', sectionKey: 'foundations', progression: 'tee' },
          { name: 'Connection Ball Drill', sectionKey: 'connection', progression: 'tee' },
          { name: 'No Roll Overs', sectionKey: 'extension', progression: 'tee' },
          { name: 'Opposite Field Only Round', sectionKey: 'adjustability', progression: 'flips' },
        ],
      },
      {
        dayLabel: 'Day 3',
        focus: 'Machine Away + Oppo Competition',
        drills: [
          { name: 'Fastball Away — Machine', sectionKey: 'machine-training', progression: 'machine' },
          { name: 'Opposite Field Machine', sectionKey: 'machine-training', progression: 'machine' },
          { name: 'Opposite Field Challenge', sectionKey: 'competition', progression: 'competition' },
        ],
      },
    ],
  },

  // ── 3-Day Steep Path Fix ──────────────────────────────────────────────
  {
    key: '3day-steep-path',
    label: '3-Day Steep Path Fix',
    description: 'For hitters who pop up, swing under the ball, or have a swing plane issue.',
    daysPerWeek: 3,
    bestFor: 'Hitters with pop-ups, swing-under issues, steep barrel.',
    days: [
      {
        dayLabel: 'Day 1',
        focus: 'High Tee + Plane Matching',
        drills: [
          { name: 'High Tee Normal Swing', sectionKey: 'foundations', progression: 'tee' },
          { name: 'High Tee — Stop at Contact', sectionKey: 'foundations', progression: 'tee' },
          { name: 'Middle Tee — Preset Posture', sectionKey: 'foundations', progression: 'tee' },
          { name: 'PVC Pipe Swings', sectionKey: 'posture', progression: 'tee' },
          { name: 'Low Away Tee (Preset Posture)', sectionKey: 'posture', progression: 'tee' },
        ],
      },
      {
        dayLabel: 'Day 2',
        focus: 'Barrel Turn + Connection',
        drills: [
          { name: 'High Tee Normal Swing', sectionKey: 'foundations', progression: 'tee' },
          { name: 'Steering Wheel Turns', sectionKey: 'barrel-turn', progression: 'tee' },
          { name: 'Connection Ball Drill', sectionKey: 'connection', progression: 'tee' },
          { name: 'Finish Through the Middle', sectionKey: 'extension', progression: 'tee' },
          { name: 'Front Toss — Stop at Contact', sectionKey: 'foundations', progression: 'flips' },
        ],
      },
      {
        dayLabel: 'Day 3',
        focus: 'Machine + Line Drive Competition',
        drills: [
          { name: 'High Tee Normal Swing', sectionKey: 'foundations', progression: 'tee' },
          { name: 'Fastball Only Machine', sectionKey: 'machine-training', progression: 'machine' },
          { name: 'High Fastball Machine', sectionKey: 'machine-training', progression: 'machine' },
          { name: 'Line Drive Challenge', sectionKey: 'competition', progression: 'competition' },
        ],
      },
    ],
  },

  // ── 3-Day Weak Contact Fix ────────────────────────────────────────────
  {
    key: '3day-weak-contact',
    label: '3-Day Weak Contact Fix',
    description: 'For hitters who make contact but it\'s always soft. No hard-hit balls.',
    daysPerWeek: 3,
    bestFor: 'Hitters with weak contact, no damage, low exit velo.',
    days: [
      {
        dayLabel: 'Day 1',
        focus: 'Foundation + Intent',
        drills: [
          { name: 'High Tee Normal Swing', sectionKey: 'foundations', progression: 'tee' },
          { name: 'Inside Tee', sectionKey: 'foundations', progression: 'tee' },
          { name: 'Out Front Tee', sectionKey: 'foundations', progression: 'tee' },
          { name: 'Out Front Tee Drill', sectionKey: 'extension', progression: 'tee' },
          { name: 'Damage Round', sectionKey: 'approach', progression: 'flips' },
        ],
        notes: 'Every swing at max intent. No easy swings.',
      },
      {
        dayLabel: 'Day 2',
        focus: 'Extension + Direction',
        drills: [
          { name: 'High Tee Normal Swing', sectionKey: 'foundations', progression: 'tee' },
          { name: 'No Roll Overs', sectionKey: 'extension', progression: 'tee' },
          { name: 'Finish Through the Middle', sectionKey: 'extension', progression: 'tee' },
          { name: 'Freddie\'s Drill', sectionKey: 'posture', progression: 'tee' },
          { name: 'Front Toss — Stop at Contact', sectionKey: 'foundations', progression: 'flips' },
        ],
      },
      {
        dayLabel: 'Day 3',
        focus: 'Machine Damage + Competition',
        drills: [
          { name: 'Fastball Only Machine', sectionKey: 'machine-training', progression: 'machine' },
          { name: 'Velocity Ladder', sectionKey: 'machine-training', progression: 'machine' },
          { name: 'Consecutive Hard-Hit Challenge', sectionKey: 'competition', progression: 'competition' },
        ],
        notes: 'Measure contact quality. Max intent every swing.',
      },
    ],
  },

  // ── 3-Day Game Transfer Fix ───────────────────────────────────────────
  {
    key: '3day-game-transfer',
    label: '3-Day Game Transfer',
    description: 'For hitters who hit great in BP but can\'t take it to games.',
    daysPerWeek: 3,
    bestFor: 'BP hitters. Good in practice, bad in games.',
    days: [
      {
        dayLabel: 'Day 1',
        focus: 'Foundation + Approach Training',
        drills: [
          { name: 'High Tee Normal Swing', sectionKey: 'foundations', progression: 'tee' },
          { name: 'Zone Hunting Round', sectionKey: 'approach', progression: 'flips' },
          { name: 'Count Hitting Round', sectionKey: 'approach', progression: 'flips' },
          { name: '3-Pitch At-Bat Simulation', sectionKey: 'approach', progression: 'flips' },
        ],
      },
      {
        dayLabel: 'Day 2',
        focus: 'Machine with Game Counts',
        drills: [
          { name: 'High Tee Normal Swing', sectionKey: 'foundations', progression: 'tee' },
          { name: 'Random Pitch Machine', sectionKey: 'machine-training', progression: 'machine' },
          { name: '2 Strike Machine', sectionKey: 'machine-training', progression: 'machine' },
          { name: 'Game Situation Machine ABs', sectionKey: 'machine-training', progression: 'machine' },
        ],
      },
      {
        dayLabel: 'Day 3',
        focus: 'Full Competition Day',
        drills: [
          { name: '2-Strike Battle Round', sectionKey: 'competition', progression: 'competition' },
          { name: '21 Outs Game', sectionKey: 'competition', progression: 'competition' },
          { name: 'Line Drive Challenge', sectionKey: 'competition', progression: 'competition' },
        ],
        notes: 'Practice should feel like a game. Points, consequences, pressure.',
      },
    ],
  },
];
