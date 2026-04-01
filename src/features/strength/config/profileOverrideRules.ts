/**
 * Profile Override Rules — Maps bias tags to concrete exercise modifications.
 *
 * This is the layer that turns profile bias arrays into actual training changes.
 * It sits between template-based generation and final rendering.
 *
 * Three types of overrides:
 *   1. INJECT — Add exercises to a block when a bias tag is present
 *   2. SWAP — Replace a specific exercise when a bias tag is present
 *   3. SUPPRESS — Remove exercises that match avoid_overemphasis rules
 *
 * Phase still governs. These overrides only bias selection WITHIN the phase.
 */

// ── Override Types ──────────────────────────────────────────────────────────

export interface ExerciseInjection {
  /** Which block type this applies to */
  blockKey: string;
  /** Bias tag that triggers this injection */
  biasTag: string;
  /** Exercise to add */
  exercise: {
    name: string;
    sets: string;
    cue: string;
    rest?: string;
  };
  /** Position priority within block (lower = earlier) */
  priority: number;
}

export interface ExerciseSwap {
  /** Which block type this applies to */
  blockKey: string;
  /** Bias tag that triggers this swap */
  biasTag: string;
  /** Name of exercise to replace (substring match) */
  targetName: string;
  /** Replacement exercise */
  replacement: {
    name: string;
    sets: string;
    cue: string;
    rest?: string;
  };
}

import type { MetadataFilter } from '../types/exerciseMetadata';

export interface SuppressionRule {
  /** avoid_overemphasis tag that triggers this suppression */
  avoidTag: string;
  /** Which block types are affected */
  blockKeys: string[];
  /** How to suppress: cap = limit count, remove = delete matching exercises */
  action: 'cap' | 'remove';
  /** For 'cap': max exercise count in affected blocks */
  maxExercises?: number;
  /** For 'remove': name patterns to remove (substring match) — LEGACY, prefer metadataFilter */
  namePatterns?: string[];
  /** For 'remove': metadata-based filter — exercises matching this filter are removed */
  metadataFilter?: MetadataFilter;
  /** Note explaining why */
  note: string;
}

// ── INJECTION RULES ─────────────────────────────────────────────────────────
// These ADD exercises when a profile bias tag is present

export const INJECTION_RULES: ExerciseInjection[] = [
  // ── Prep block injections ──
  { blockKey: 'plyometrics', biasTag: 'hip_ir_er_access', priority: 0, exercise: { name: '90/90 Hip IR/ER Flow', sets: '2×6/side', cue: 'Own the position. Breathe through range.', rest: '30s' } },
  { blockKey: 'plyometrics', biasTag: 'tspine_rotation', priority: 0, exercise: { name: 'Open Book T-Spine Rotation', sets: '2×5/side', cue: 'Lead with the rib cage. Exhale into rotation.', rest: '30s' } },
  { blockKey: 'plyometrics', biasTag: 'ankle_df', priority: 0, exercise: { name: 'Wall Ankle Dorsiflexion Mobilization', sets: '2×8/side', cue: 'Knee tracks over pinky toe. Own the end range.', rest: '30s' } },
  { blockKey: 'plyometrics', biasTag: 'separation_access', priority: 0, exercise: { name: 'Half-Kneeling Chop/Lift', sets: '2×6/side', cue: 'Separate upper from lower. Control the rotation.', rest: '30s' } },
  { blockKey: 'plyometrics', biasTag: 'position_ownership', priority: 0, exercise: { name: 'Tall Kneeling Pallof Hold', sets: '2×20s/side', cue: 'Rib cage down. Own the position against the pull.' } },
  { blockKey: 'plyometrics', biasTag: 'rib_pelvis_control', priority: 0, exercise: { name: 'Dead Bug w/ Band', sets: '2×5/side', cue: 'Rib cage down. Pelvis stays. Breathe.' } },

  // ── Plyo block injections ──
  { blockKey: 'plyometrics', biasTag: 'elastic_reactive', priority: 5, exercise: { name: 'Ankle Stiffness Hops', sets: '2×10', cue: 'Stiff ankles. Quick contact. Bounce.' } },
  { blockKey: 'plyometrics', biasTag: 'pogo_progressions', priority: 5, exercise: { name: 'Pogo Hops (Progressive)', sets: '2×15s', cue: 'Stiffer each set. Minimize ground contact.' } },
  { blockKey: 'plyometrics', biasTag: 'controlled_landing', priority: 5, exercise: { name: 'Box Drop to Stick Landing', sets: '3×3', cue: 'Absorb and own. Quiet feet. Hold 3s.' } },
  { blockKey: 'plyometrics', biasTag: 'decel_stick', priority: 5, exercise: { name: 'Lateral Bound to Stick', sets: '2×4/side', cue: 'Stick the landing. Own the decel.' } },
  { blockKey: 'plyometrics', biasTag: 'pogos', priority: 6, exercise: { name: 'Line Hops — Quick', sets: '2×12s', cue: 'Quick. Light. Stiff ankles.' } },
  { blockKey: 'plyometrics', biasTag: 'rebound_work', priority: 6, exercise: { name: 'Hurdle Hops — Reactive', sets: '3×5', cue: 'Minimize ground time. Rebound.' } },

  // ── Sprint block injections ──
  { blockKey: 'sprint-work', biasTag: 'max_velocity', priority: 5, exercise: { name: 'Flying 20yd Sprint', sets: '3×1', cue: 'Max speed. Relaxed face. Rhythm.', rest: '2-3min' } },
  { blockKey: 'sprint-work', biasTag: 'dribbles', priority: 5, exercise: { name: 'Wicket Dribbles (Max V)', sets: '3×30yd', cue: 'Quick feet. High knees. Rhythm through wickets.', rest: '2min' } },
  { blockKey: 'sprint-work', biasTag: 'acceleration_resisted', priority: 5, exercise: { name: 'Sled March (Heavy)', sets: '4×15yd', cue: 'Drive. Lean. Force into the ground.', rest: '90s' } },
  { blockKey: 'sprint-work', biasTag: 'acceleration_mechanics', priority: 5, exercise: { name: 'Wall Drive to 10yd Sprint', sets: '4×1', cue: 'Push. Project. Accelerate.', rest: '90s' } },

  // ── Strength block injections ──
  { blockKey: 'main-strength', biasTag: 'eccentric_strength', priority: 8, exercise: { name: 'Eccentric RDL (4s Lower)', sets: '3×5', cue: '4 second eccentric. Control the entire descent.' } },
  { blockKey: 'main-strength', biasTag: 'yielding_isometrics', priority: 8, exercise: { name: 'Split Squat ISO Hold', sets: '3×20s/side', cue: 'Hold the bottom. Own the position under load.' } },
  { blockKey: 'main-strength', biasTag: 'overcoming_isometrics', priority: 8, exercise: { name: 'Pin Squat ISO (3s Push)', sets: '3×3', cue: 'Push into the pins. Maximum force for 3 seconds.' } },
  { blockKey: 'main-strength', biasTag: 'speed_strength', priority: 8, exercise: { name: 'Speed Squat (50-60%)', sets: '5×3', cue: 'Compensatory acceleration. Move the bar fast.', rest: '60s' } },
  { blockKey: 'main-strength', biasTag: 'contrast_work', priority: 8, exercise: { name: 'Heavy Trap Bar DL + Broad Jump', sets: '3×(2+3)', cue: 'Heavy pull, then explode. Contrast.' } },

  // ── Accessory block injections ──
  { blockKey: 'accessory-circuit', biasTag: 'posterior_chain', priority: 10, exercise: { name: 'Banded Hip Thrust', sets: '3×10', cue: 'Full hip extension. Squeeze at top.' } },
  { blockKey: 'accessory-circuit', biasTag: 'trunk_stiffness', priority: 10, exercise: { name: 'Anti-Rotation Press', sets: '3×8/side', cue: 'Lock the trunk. Resist the pull.' } },
  { blockKey: 'accessory-circuit', biasTag: 'single_leg_control', priority: 10, exercise: { name: 'Single Leg RDL Hold', sets: '2×20s/side', cue: 'Balance. Control. Own the position.' } },
  { blockKey: 'accessory-circuit', biasTag: 'unilateral_strength', priority: 10, exercise: { name: 'Rear Foot Elevated Split Squat', sets: '3×6/side', cue: 'Vertical shin. Stay tall. Push through the front foot.' } },
  { blockKey: 'accessory-circuit', biasTag: 'mobility_ownership', priority: 10, exercise: { name: 'Goblet Squat Hold (30s)', sets: '2×30s', cue: 'Elbows push knees out. Own the bottom position.' } },
  { blockKey: 'accessory-circuit', biasTag: 'adductors', priority: 10, exercise: { name: 'Copenhagen Plank', sets: '2×15s/side', cue: 'Adductor on. Rib cage down.' } },

  // ── Conditioning injections ──
  { blockKey: 'sprint-cooldown', biasTag: 'low_fatigue_speed_preserving', priority: 12, exercise: { name: 'Tempo Run 70% (200m)', sets: '3×1', cue: 'Easy pace. Recover between. Preserve speed quality.', rest: '90s' } },
  { blockKey: 'sprint-cooldown', biasTag: 'sled_based_conditioning', priority: 12, exercise: { name: 'Sled Push (Moderate)', sets: '4×30yd', cue: 'Controlled effort. Build work capacity without impact.', rest: '60s' } },
];

// ── SWAP RULES ──────────────────────────────────────────────────────────────
// These REPLACE specific exercises when a bias tag is present

export const SWAP_RULES: ExerciseSwap[] = [
  // Static archetype: swap heavy grind plyos for reactive/elastic work
  { blockKey: 'plyometrics', biasTag: 'elastic_reactive', targetName: 'Depth Jump', replacement: { name: 'Reactive Pogo to Sprint', sets: '3×5+10yd', cue: 'Quick contacts into a sprint. Convert stiffness to speed.' } },

  // Spring archetype: swap reactive plyos for controlled landing work
  { blockKey: 'plyometrics', biasTag: 'controlled_landing', targetName: 'Pogo Hops', replacement: { name: 'Box Drop to Stick (3s hold)', sets: '3×3', cue: 'Absorb quietly. Own the landing. Hold 3 seconds.' } },

  // Strength need: swap speed-strength for max-strength emphasis
  { blockKey: 'main-strength', biasTag: 'max_strength', targetName: 'Speed Squat', replacement: { name: 'Back Squat (Heavy)', sets: '4×4', cue: 'Controlled descent. Drive hard. Build max force.' } },

  // Mobility need: regress loaded exercises
  { blockKey: 'main-strength', biasTag: 'mobility_ownership', targetName: 'Back Squat', replacement: { name: 'Goblet Squat to Box', sets: '3×8', cue: 'Box provides depth reference. Own the position before adding load.' } },
];

// ── SUPPRESSION RULES ───────────────────────────────────────────────────────
// These REMOVE or CAP exercises based on avoid_overemphasis tags

export const SUPPRESSION_RULES: SuppressionRule[] = [
  {
    avoidTag: 'heavy_eccentric_overload',
    blockKeys: ['main-strength'],
    action: 'remove',
    namePatterns: ['Eccentric', 'Tempo', '5s Lower', '4s Lower'],
    metadataFilter: { contractionType: ['eccentric'] },
    note: 'Static archetype: maintain force, do not add eccentric overload.',
  },
  {
    avoidTag: 'excess_strength_volume',
    blockKeys: ['main-strength', 'accessory-circuit'],
    action: 'cap',
    maxExercises: 3,
    note: 'Static archetype: cap strength volume to preserve speed quality.',
  },
  {
    avoidTag: 'excess_reactive_volume',
    blockKeys: ['plyometrics'],
    action: 'cap',
    maxExercises: 3,
    note: 'Spring archetype: cap reactive volume to protect tissue capacity.',
  },
  {
    avoidTag: 'too_much_max_velocity',
    blockKeys: ['sprint-work'],
    action: 'remove',
    namePatterns: ['Flying', 'Max V', 'Wicket'],
    metadataFilter: { velocityType: ['max_velocity'], movementCategory: ['sprint'] },
    note: 'Spring archetype: reduce top-end velocity exposure until strength base improves.',
  },
  {
    avoidTag: 'loading_without_access',
    blockKeys: ['main-strength', 'loaded-power'],
    action: 'remove',
    namePatterns: ['Back Squat', 'Front Squat', 'Overhead'],
    metadataFilter: { maxComplexity: undefined, mobilityRequirements: ['hip_ir', 'tspine_rotation', 'shoulder_flexion', 'ankle_df'] },
    note: 'Mobility need: do not load positions that lack access.',
  },
  {
    avoidTag: 'chaotic_reactive_work_without_control',
    blockKeys: ['plyometrics', 'sprint-work'],
    action: 'remove',
    namePatterns: ['Depth Jump', 'Reactive', 'Flying'],
    metadataFilter: { contractionType: ['reactive', 'ballistic'], velocityType: ['max_velocity'] },
    note: 'Stability need: reduce chaotic/reactive work until control improves.',
  },
  {
    avoidTag: 'hiding_weakness_behind_complexity',
    blockKeys: ['loaded-power'],
    action: 'remove',
    namePatterns: ['Snatch', 'Clean Complex', 'Jerk'],
    metadataFilter: { movementCategory: ['ballistic'], maxComplexity: undefined },
    note: 'Strength need: simpler progressions. Build base before complexity.',
  },
  {
    avoidTag: 'unnecessary_specialization',
    blockKeys: [],
    action: 'cap',
    maxExercises: 4,
    note: 'Hybrid archetype: do not over-specialize any block.',
  },
  {
    avoidTag: 'high_fatigue_conditioning',
    blockKeys: ['sprint-cooldown'],
    action: 'remove',
    namePatterns: ['Repeat Sprint', 'Conditioning Circuit', 'Gasser'],
    note: 'Speed need: low-fatigue conditioning to preserve speed quality.',
  },
  {
    avoidTag: 'excess_grind_volume',
    blockKeys: ['main-strength', 'accessory-circuit'],
    action: 'cap',
    maxExercises: 3,
    note: 'Elasticity need: reduce grind volume to preserve elastic quality.',
  },
];
