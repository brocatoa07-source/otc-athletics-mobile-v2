import type { OtcsPositionTweak, OtcsDeficiencyOverride } from './otcs-types';

/* ────────────────────────────────────────────────────
 * OTC-S POSITION & DEFICIENCY MODIFIERS
 *
 * Position tweaks swap specific exercises for position-
 * relevant alternatives (OF → fly sprints, IF → lateral,
 * C → hip mobility/durability).
 *
 * Deficiency overrides address movement limitations by
 * substituting exercises that target the weakness.
 * ──────────────────────────────────────────────────── */

/* ─── Position Tweaks ────────────────────────────── */

export const OTCS_POSITION_TWEAKS: OtcsPositionTweak[] = [
  /* ── Outfielder — sprint/speed emphasis ── */

  // Month 1-2: Sprint Day 2 — add fly sprint work
  { monthNumber: 1, dayKey: 'sprint-2', blockKey: 'sprint-work', exerciseIndex: 0, position: 'outfielder', altName: 'OF Route Sprint (drop step)', altSets: '4×1', note: 'OF routes build game-speed angular acceleration' },
  { monthNumber: 1, dayKey: 'sprint-2', blockKey: 'sprint-drills', exerciseIndex: 0, position: 'outfielder', altName: 'Drop Step to Crossover Sprint', altSets: '3×3/side', note: 'OF-specific first-step pattern' },
  { monthNumber: 2, dayKey: 'sprint-2', blockKey: 'sprint-work', exerciseIndex: 0, position: 'outfielder', altName: 'OF Route Sprint (curved)', altSets: '4×1', note: 'Curved sprint for reading fly balls' },
  { monthNumber: 2, dayKey: 'sprint-1', blockKey: 'sprint-work', exerciseIndex: 2, position: 'outfielder', altName: '30yd Fly Sprint', altSets: '3×1', note: 'OFs need top-end speed development' },

  // Month 3-4: More fly sprint emphasis
  { monthNumber: 3, dayKey: 'sprint-2', blockKey: 'sprint-work', exerciseIndex: 0, position: 'outfielder', altName: 'Flying 30yd', altSets: '4×1', note: 'OF max velocity development' },
  { monthNumber: 4, dayKey: 'sprint-2', blockKey: 'sprint-work', exerciseIndex: 0, position: 'outfielder', altName: 'Flying 30yd (max)', altSets: '4×1', note: 'OF peak speed phase' },
  { monthNumber: 4, dayKey: 'sprint-1', blockKey: 'sprint-drills', exerciseIndex: 0, position: 'outfielder', altName: 'Drop Step + Crossover Sprint', altSets: '3×3', note: 'OF game-speed routes with sled resistance' },

  // Month 5-6: Game transfer
  { monthNumber: 5, dayKey: 'sprint-2', blockKey: 'sprint-work', exerciseIndex: 0, position: 'outfielder', altName: 'OF Route Sprint (game speed)', altSets: '4×1', note: 'Game-speed route running' },
  { monthNumber: 6, dayKey: 'sprint-2', blockKey: 'sprint-work', exerciseIndex: 0, position: 'outfielder', altName: 'OF Route + Throw Combo', altSets: '3×1', note: 'Full game transfer — sprint, field, throw' },
  { monthNumber: 6, dayKey: 'sprint-1', blockKey: 'sprint-work', exerciseIndex: 2, position: 'outfielder', altName: 'OF Route Sprint', altSets: '3×1', note: 'Game-speed outfield routes' },

  /* ── Infielder — lateral/COD emphasis ── */

  // Month 1-2: Lateral movement foundation
  { monthNumber: 1, dayKey: 'sprint-2', blockKey: 'sprint-work', exerciseIndex: 0, position: 'infielder', altName: 'Lateral Shuffle to Field', altSets: '4×1', note: 'IF-specific lateral to fielding position' },
  { monthNumber: 1, dayKey: 'sprint-2', blockKey: 'sprint-drills', exerciseIndex: 0, position: 'infielder', altName: 'Crossover Step to Sprint (IF)', altSets: '3×3/side', note: 'IF first-step to backhand/forehand' },
  { monthNumber: 2, dayKey: 'sprint-2', blockKey: 'sprint-work', exerciseIndex: 0, position: 'infielder', altName: 'Pro Agility + Turn', altSets: '4×1', note: 'IF game-speed direction change' },
  { monthNumber: 2, dayKey: 'sprint-2', blockKey: 'sprint-drills', exerciseIndex: 0, position: 'infielder', altName: 'Lateral First Step to Throw', altSets: '3×3/side', note: 'IF-specific first step to throwing position' },

  // Month 3-4: COD intensity
  { monthNumber: 3, dayKey: 'sprint-2', blockKey: 'sprint-work', exerciseIndex: 0, position: 'infielder', altName: 'Box Drill (IF pattern)', altSets: '4×1', note: 'IF game-speed multi-directional' },
  { monthNumber: 4, dayKey: 'sprint-2', blockKey: 'sprint-work', exerciseIndex: 0, position: 'infielder', altName: 'Reactive Lateral + Sprint', altSets: '4×1', note: 'IF reactive first step' },
  { monthNumber: 4, dayKey: 'sprint-1', blockKey: 'sprint-drills', exerciseIndex: 0, position: 'infielder', altName: 'Lateral Sled Drag', altSets: '3×10yd/side', note: 'IF lateral strength under load' },

  // Month 5-6: Game transfer
  { monthNumber: 5, dayKey: 'sprint-2', blockKey: 'sprint-work', exerciseIndex: 0, position: 'infielder', altName: 'IF Lateral to Throw (game speed)', altSets: '4×1', note: 'Full-speed fielding simulation' },
  { monthNumber: 6, dayKey: 'sprint-2', blockKey: 'sprint-work', exerciseIndex: 0, position: 'infielder', altName: 'IF Fielding Combo (react + field + throw)', altSets: '3×1', note: 'Full game transfer — react, move, field, throw' },
  { monthNumber: 6, dayKey: 'sprint-1', blockKey: 'sprint-work', exerciseIndex: 2, position: 'infielder', altName: 'Double Play Turn Sprint', altSets: '3×1', note: 'IF game-speed double play simulation' },

  /* ── Catcher — hip mobility/durability emphasis ── */

  // Month 1-2: Hip mobility and squat durability
  { monthNumber: 1, dayKey: 'lower-accel', blockKey: 'accessory-circuit', exerciseIndex: 0, position: 'catcher', altName: 'Deep Squat Hold + Rotation', altSets: '2×30s', note: 'C squat mobility for receiving position' },
  { monthNumber: 1, dayKey: 'lower-accel', blockKey: 'plyometrics', exerciseIndex: 1, position: 'catcher', altName: 'Pop-Time Lateral Hop', altSets: '2×4/side', note: 'C lateral pop-up mechanics' },
  { monthNumber: 2, dayKey: 'lower-accel', blockKey: 'accessory-circuit', exerciseIndex: 0, position: 'catcher', altName: 'Catcher Squat to Block', altSets: '2×8/side', note: 'C blocking mobility + reaction' },
  { monthNumber: 2, dayKey: 'full-power', blockKey: 'accessory-circuit', exerciseIndex: 0, position: 'catcher', altName: 'Hip Circle Squat Hold', altSets: '2×20s', note: 'C hip endurance in squat' },

  // Month 3-4: Pop time and blocking
  { monthNumber: 3, dayKey: 'sprint-1', blockKey: 'sprint-drills', exerciseIndex: 0, position: 'catcher', altName: 'Pop-Time Sprint (catch to 2B)', altSets: '3×3', note: 'C pop-time specific speed' },
  { monthNumber: 3, dayKey: 'lower-accel', blockKey: 'plyometrics', exerciseIndex: 1, position: 'catcher', altName: 'Pop-Up to Throw', altSets: '3×4', note: 'C explosive pop-up from squat' },
  { monthNumber: 4, dayKey: 'sprint-1', blockKey: 'sprint-drills', exerciseIndex: 0, position: 'catcher', altName: 'Pop-Time Sprint (max effort)', altSets: '3×3', note: 'C peak pop-time development' },
  { monthNumber: 4, dayKey: 'lower-accel', blockKey: 'accessory-circuit', exerciseIndex: 0, position: 'catcher', altName: 'Weighted Catcher Squat Hold', altSets: '3×20s', note: 'C loaded squat endurance' },

  // Month 5-6: Game transfer
  { monthNumber: 5, dayKey: 'sprint-1', blockKey: 'sprint-work', exerciseIndex: 0, position: 'catcher', altName: 'Pop-Time Sprint (game speed)', altSets: '4×1', note: 'C max effort pop-time' },
  { monthNumber: 5, dayKey: 'lower-accel', blockKey: 'plyometrics', exerciseIndex: 1, position: 'catcher', altName: 'Reactive Pop-Up + Throw', altSets: '3×4', note: 'C reactive pop-up from signal' },
  { monthNumber: 6, dayKey: 'sprint-1', blockKey: 'sprint-work', exerciseIndex: 0, position: 'catcher', altName: 'Pop-Time Sprint + Throw', altSets: '4×1', note: 'C full game transfer — receive, pop, throw' },
  { monthNumber: 6, dayKey: 'lower-accel', blockKey: 'accessory-circuit', exerciseIndex: 0, position: 'catcher', altName: 'Catcher Recovery Squat Series', altSets: '2×10', note: 'C durability for full-season readiness' },
];

/* ─── Deficiency Overrides ───────────────────────── */

export const OTCS_DEFICIENCY_OVERRIDES: OtcsDeficiencyOverride[] = [
  /* ── Hip Mobility — more ROM work, mobility accessories ── */

  // All months: Lower day gets hip mobility swaps
  { monthNumber: 1, dayKey: 'lower-accel', blockKey: 'main-strength', exerciseIndex: 0, deficiency: 'hip_mobility', altName: 'Goblet Squat to Box (depth target)', note: 'Box provides depth reference for limited hip ROM' },
  { monthNumber: 1, dayKey: 'full-power', blockKey: 'accessory-circuit', exerciseIndex: 0, deficiency: 'hip_mobility', altName: '90/90 Hip Flow + Frog Stretch', altSets: '2×8', note: 'Extra hip mobility work to build range' },
  { monthNumber: 2, dayKey: 'lower-accel', blockKey: 'main-strength', exerciseIndex: 0, deficiency: 'hip_mobility', altName: 'Goblet Squat (elevated heels)', note: 'Heel elevation compensates for ankle/hip limitation' },
  { monthNumber: 2, dayKey: 'lower-accel', blockKey: 'accessory-circuit', exerciseIndex: 2, deficiency: 'hip_mobility', altName: 'Cossack Squat (mobility)', altSets: '2×6/side', note: 'Build lateral hip ROM under load' },
  { monthNumber: 3, dayKey: 'lower-accel', blockKey: 'main-strength', exerciseIndex: 0, deficiency: 'hip_mobility', altName: 'Front Squat (elevated heels)', note: 'Front squat forces upright torso, heel elevation helps ROM' },
  { monthNumber: 3, dayKey: 'full-power', blockKey: 'accessory-circuit', exerciseIndex: 0, deficiency: 'hip_mobility', altName: 'Deep Squat Hold + Rotation', altSets: '2×30s', note: 'Build comfort in deep hip flexion' },
  { monthNumber: 4, dayKey: 'lower-accel', blockKey: 'main-strength', exerciseIndex: 0, deficiency: 'hip_mobility', altName: 'Front Squat (heavy, elevated heels)', note: 'Maintain mobility-friendly position at heavy loads' },
  { monthNumber: 5, dayKey: 'lower-accel', blockKey: 'main-strength', exerciseIndex: 0, deficiency: 'hip_mobility', altName: 'Speed Squat (elevated heels)', note: 'Speed work with mobility-friendly setup' },
  { monthNumber: 6, dayKey: 'lower-accel', blockKey: 'main-strength', exerciseIndex: 0, deficiency: 'hip_mobility', altName: 'Speed Squat (maintain ROM gains)', note: 'Maintain hip ROM improvements in speed phase' },

  /* ── Shoulder Stability — more scap work, safer pressing ── */

  // All months: Upper day gets shoulder-safe swaps
  { monthNumber: 1, dayKey: 'upper-shoulder', blockKey: 'main-strength', exerciseIndex: 0, deficiency: 'shoulder_stability', altName: 'Floor Press (DB)', note: 'Limited ROM protects unstable shoulders' },
  { monthNumber: 1, dayKey: 'upper-shoulder', blockKey: 'shoulder-durability', exerciseIndex: 0, deficiency: 'shoulder_stability', altName: 'Bottoms-Up KB Press', altSets: '2×6/side', note: 'Builds shoulder stability through grip + stabilization' },
  { monthNumber: 2, dayKey: 'upper-shoulder', blockKey: 'main-strength', exerciseIndex: 0, deficiency: 'shoulder_stability', altName: 'Floor Press (eccentric 3s)', note: 'Eccentric loading in shoulder-safe position' },
  { monthNumber: 2, dayKey: 'upper-shoulder', blockKey: 'accessory-circuit', exerciseIndex: 0, deficiency: 'shoulder_stability', altName: 'Turkish Get-Up (light)', altSets: '2×3/side', note: 'Full-body shoulder stability under load' },
  { monthNumber: 3, dayKey: 'upper-shoulder', blockKey: 'main-strength', exerciseIndex: 0, deficiency: 'shoulder_stability', altName: 'DB Bench Press (neutral grip)', note: 'Neutral grip reduces shoulder stress at heavier loads' },
  { monthNumber: 3, dayKey: 'full-power', blockKey: 'loaded-power', exerciseIndex: 0, deficiency: 'shoulder_stability', altName: 'DB Snatch (controlled catch)', note: 'Control the catch position to protect shoulder' },
  { monthNumber: 4, dayKey: 'upper-shoulder', blockKey: 'main-strength', exerciseIndex: 0, deficiency: 'shoulder_stability', altName: 'Floor Press (heavy)', note: 'Max force in shoulder-safe ROM' },
  { monthNumber: 5, dayKey: 'upper-shoulder', blockKey: 'main-strength', exerciseIndex: 0, deficiency: 'shoulder_stability', altName: 'Speed Floor Press', note: 'Speed work in shoulder-safe position' },
  { monthNumber: 6, dayKey: 'upper-shoulder', blockKey: 'main-strength', exerciseIndex: 0, deficiency: 'shoulder_stability', altName: 'Speed DB Bench (neutral grip)', note: 'Maintain pressing speed with shoulder-safe grip' },

  /* ── Acceleration Weakness — more sprint work, plyos ── */

  // All months: Sprint days get acceleration-focused swaps
  { monthNumber: 1, dayKey: 'sprint-1', blockKey: 'sprint-work', exerciseIndex: 0, deficiency: 'acceleration_weakness', altName: '10yd Sprint (extra volume)', altSets: '6×10yd', note: 'More short acceleration reps to build first-step power' },
  { monthNumber: 1, dayKey: 'lower-accel', blockKey: 'plyometrics', exerciseIndex: 0, deficiency: 'acceleration_weakness', altName: 'Broad Jump (max distance)', altSets: '3×3', note: 'Horizontal force production for acceleration' },
  { monthNumber: 2, dayKey: 'sprint-1', blockKey: 'sprint-work', exerciseIndex: 0, deficiency: 'acceleration_weakness', altName: '10yd Sprint (extra volume)', altSets: '6×10yd', note: 'Continue building acceleration mechanics' },
  { monthNumber: 2, dayKey: 'sprint-1', blockKey: 'sprint-drills', exerciseIndex: 0, deficiency: 'acceleration_weakness', altName: 'Sled Sprint (acceleration focus)', altSets: '4×10yd', note: 'Resisted short sprints for drive phase' },
  { monthNumber: 3, dayKey: 'sprint-1', blockKey: 'sprint-work', exerciseIndex: 0, deficiency: 'acceleration_weakness', altName: '10yd Fly Sprint (extra volume)', altSets: '6×1', note: 'High-volume short acceleration' },
  { monthNumber: 3, dayKey: 'lower-accel', blockKey: 'loaded-power', exerciseIndex: 0, deficiency: 'acceleration_weakness', altName: 'Trap Bar Jump (heavy)', altSets: '4×3', note: 'Heavier loaded jumps for acceleration power' },
  { monthNumber: 4, dayKey: 'sprint-1', blockKey: 'sprint-work', exerciseIndex: 0, deficiency: 'acceleration_weakness', altName: 'Resisted Sprint (heavy sled)', altSets: '6×15yd', note: 'Max force in acceleration position' },
  { monthNumber: 5, dayKey: 'sprint-1', blockKey: 'sprint-work', exerciseIndex: 0, deficiency: 'acceleration_weakness', altName: 'Flying 10yd (extra volume)', altSets: '6×1', note: 'Short acceleration at max intent' },
  { monthNumber: 6, dayKey: 'sprint-1', blockKey: 'sprint-work', exerciseIndex: 0, deficiency: 'acceleration_weakness', altName: 'Base Steal Sprint (acceleration focus)', altSets: '6×1', note: 'Game-transfer acceleration work' },
];
