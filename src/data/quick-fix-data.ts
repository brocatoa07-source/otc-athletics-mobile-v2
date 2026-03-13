/**
 * Quick Fix definitions and mappings.
 *
 * Extracted from daily-work.ts to break the circular dependency
 * between daily-work.ts ↔ drillRecommendationEngine.ts.
 *
 * Both modules now import from this neutral file instead.
 */

import type { MechanicalIssue } from './hitting-mechanical-diagnostic-data';

/* ─── Quick Fix Definitions ──────────────────────────── */

export interface QuickFix {
  key: string;
  label: string;
  drills: string[];
}

export const QUICK_FIXES: Record<string, QuickFix> = {
  late: {
    key: 'late',
    label: 'Late',
    drills: ['Command Drill', 'Swing at Release', 'Heel Load Drill'],
  },
  lunging: {
    key: 'lunging',
    label: 'Lunging',
    drills: ['Step Back Drill', 'Ball Roll Drill', "Belli's Drill"],
  },
  stuck: {
    key: 'stuck',
    label: 'Stuck',
    drills: ['Happy Gilmore Drill', "Hook'em Drill", 'Bat on Shoulder Drill Series'],
  },
  'losing-posture': {
    key: 'losing-posture',
    label: 'Losing Posture',
    drills: ["Freddie's Drill", 'Mo Vaughn Drill', 'PVC Pipe Swings'],
  },
  'pulling-off': {
    key: 'pulling-off',
    label: 'Pulling Off',
    drills: ['Trout Step Drill', 'Finish Over Tee', 'Bat Throws'],
  },
  casting: {
    key: 'casting',
    label: 'Casting',
    drills: ['Steering Wheel Turns', 'Reverse Grip Drill', 'Deep Tee Series'],
  },
  'rolling-over': {
    key: 'rolling-over',
    label: 'Rolling Over',
    drills: ['No Roll Overs', 'Top Hand Bregman Drill', 'Out Front Tee Drill'],
  },
  'barrel-path': {
    key: 'barrel-path',
    label: 'Barrel Path',
    drills: ['Snap Series', 'Top Hand Open / V-Grip Drill', 'Split Grip Stop at Contact'],
  },
};

/* ─── Diagnostic Issue → Quick Fix mapping ───────────── */

export const ISSUE_TO_QUICKFIX: Record<MechanicalIssue, string> = {
  timing: 'late',
  weight_shift: 'lunging',
  early_rotation: 'stuck',
  disconnection: 'casting',
  swing_plane: 'losing-posture',
  barrel_path: 'barrel-path',
};

export const ISSUE_SECONDARY_QUICKFIX: Partial<Record<MechanicalIssue, string>> = {
  early_rotation: 'pulling-off',
  barrel_path: 'rolling-over',
  swing_plane: 'barrel-path',
  disconnection: 'rolling-over',
};

/* ─── Quick Fix → Focus Area (vault section label) ─── */

export const QUICKFIX_TO_FOCUS: Record<string, string[]> = {
  late: ['Timing'],
  lunging: ['Forward Move'],
  stuck: ['Forward Move', 'Connection'],
  'losing-posture': ['Posture'],
  'pulling-off': ['Direction'],
  casting: ['Barrel Turn'],
  'rolling-over': ['Extension'],
  'barrel-path': ['Barrel Turn'],
};
