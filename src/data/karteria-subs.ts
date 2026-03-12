import type { MoverSubstitution } from './karteria-types';

/* ────────────────────────────────────────────────────
 * MOVER-TYPE SUBSTITUTION ANNOTATIONS
 *
 * Universal Karteria program with swap suggestions
 * for Static, Spring, and Hybrid movers.
 * ──────────────────────────────────────────────────── */

export const KARTERIA_SUBS: MoverSubstitution[] = [
  /* ── Month 1 ── */
  // Day 1 Upper A — Main Lift: Neutral Grip DB Bench
  { monthNumber: 1, dayKey: 'upper-a', blockKey: 'main-lift', exerciseIndex: 0, moverType: 'static', altName: 'Floor Press', note: 'Limits ROM — safer for stiff shoulders' },
  // Day 2 Lower A — Main Lift: Goblet Squat
  { monthNumber: 1, dayKey: 'lower-a', blockKey: 'main-lift', exerciseIndex: 0, moverType: 'static', altName: 'Goblet Box Squat', note: 'Box gives depth target for limited hip mobility' },
  { monthNumber: 1, dayKey: 'lower-a', blockKey: 'main-lift', exerciseIndex: 0, moverType: 'spring', altName: 'Goblet Squat (add pause)', note: 'Springs: add 2s pause at bottom to build control' },
  // Day 5 Lower B — Main Lift: Trap Bar DL
  { monthNumber: 1, dayKey: 'lower-b', blockKey: 'main-lift', exerciseIndex: 0, moverType: 'static', altName: 'Elevated Trap Bar DL', note: 'Raise handles — reduces demand on hip hinge range' },

  /* ── Month 2 ── */
  // Day 1 Upper A — Main Lift: Eccentric DB Bench
  { monthNumber: 2, dayKey: 'upper-a', blockKey: 'main-lift', exerciseIndex: 0, moverType: 'spring', altName: 'Eccentric DB Bench (5s lowering)', note: 'Springs: slower eccentric to build structural control' },
  // Day 2 Lower A — Main Lift: Eccentric Goblet Squat
  { monthNumber: 2, dayKey: 'lower-a', blockKey: 'main-lift', exerciseIndex: 0, moverType: 'static', altName: 'Eccentric Goblet Box Squat', note: 'Box target for controlled range' },
  // Day 5 Lower B — Main Lift: Trap Bar DL 3s eccentric
  { monthNumber: 2, dayKey: 'lower-b', blockKey: 'main-lift', exerciseIndex: 0, moverType: 'static', altName: 'Elevated Trap Bar DL (3s eccentric)', note: 'Raised handles — build hinge pattern with tempo' },
  // Day 2 Lower A — Secondary: RDL 3s eccentric
  { monthNumber: 2, dayKey: 'lower-a', blockKey: 'secondary', exerciseIndex: 0, moverType: 'static', altName: 'DB RDL (3s eccentric)', note: 'DBs allow more hip freedom for stiff movers' },

  /* ── Month 3 ── */
  // Day 1 Upper A — Main Lift: Barbell Bench
  { monthNumber: 3, dayKey: 'upper-a', blockKey: 'main-lift', exerciseIndex: 0, moverType: 'static', altName: 'DB Bench Press', note: 'DBs give shoulder freedom for stiff movers' },
  // Day 2 Lower A — Main Lift: Trap Bar DL heavy
  { monthNumber: 3, dayKey: 'lower-a', blockKey: 'main-lift', exerciseIndex: 0, moverType: 'spring', altName: 'Trap Bar DL (controlled descent)', note: 'Springs: focus on controlling the eccentric' },
  // Day 5 Lower B — Main Lift: Back Squat
  { monthNumber: 3, dayKey: 'lower-b', blockKey: 'main-lift', exerciseIndex: 0, moverType: 'static', altName: 'Front Squat', note: 'Forces upright torso — better for limited hip mobility' },
  { monthNumber: 3, dayKey: 'lower-b', blockKey: 'main-lift', exerciseIndex: 0, moverType: 'spring', altName: 'SSB Squat', note: 'SSB loads the back less — lets springs focus on leg drive' },

  /* ── Month 4 ── */
  // Day 1 Upper A — Main Lift: DB Bench heavy (contrast)
  { monthNumber: 4, dayKey: 'upper-a', blockKey: 'main-lift', exerciseIndex: 0, moverType: 'static', altName: 'Floor Press', note: 'Limited ROM protects stiff shoulders at heavy loads' },
  // Day 2 Lower A — Main Lift: Trap Bar DL heavy (contrast)
  { monthNumber: 4, dayKey: 'lower-a', blockKey: 'main-lift', exerciseIndex: 0, moverType: 'static', altName: 'Elevated Trap Bar DL', note: 'Raised handles — heavier pull with less demand on range' },
  // Day 5 Lower B — Main Lift: SSB/Back Squat heavy (contrast)
  { monthNumber: 4, dayKey: 'lower-b', blockKey: 'main-lift', exerciseIndex: 0, moverType: 'static', altName: 'Front Squat', note: 'Forces upright torso — better mobility demand at heavy loads' },
  // Day 2 Lower A — Plyo: Depth Drop (index shifted +1 for CNS primer prepend)
  { monthNumber: 4, dayKey: 'lower-a', blockKey: 'plyo', exerciseIndex: 3, moverType: 'static', altName: 'Depth Drop (lower box)', note: 'Use lower box — stiff movers need less drop height' },

  /* ── Month 5 ── */
  // Day 2 Lower A — Plyo: Depth Drop high box (index shifted +1 for CNS primer prepend)
  { monthNumber: 5, dayKey: 'lower-a', blockKey: 'plyo', exerciseIndex: 3, moverType: 'static', altName: 'Depth Drop (mid box)', note: 'Mid box — build elastic capacity without overstressing joints' },
  // Day 1 Upper A — Main Lift: DB Bench fast
  { monthNumber: 5, dayKey: 'upper-a', blockKey: 'main-lift', exerciseIndex: 0, moverType: 'spring', altName: 'DB Bench (moderate load, max speed)', note: 'Springs: slightly heavier load, max intent on speed' },
  // Day 5 Lower B — Main Lift: SSB Squat fast
  { monthNumber: 5, dayKey: 'lower-b', blockKey: 'main-lift', exerciseIndex: 0, moverType: 'static', altName: 'Front Squat (speed)', note: 'Upright torso — fast reps with mobility-friendly position' },
  // Day 2 Lower A — Finisher: Flying 20s
  { monthNumber: 5, dayKey: 'lower-a', blockKey: 'finisher', exerciseIndex: 0, moverType: 'static', altName: 'Flying 15s', note: 'Shorter fly zone — stiff movers build speed gradually' },

  /* ── Month 6 ── */
  // Day 1 Upper A — Main Lift: Speed Bench
  { monthNumber: 6, dayKey: 'upper-a', blockKey: 'main-lift', exerciseIndex: 0, moverType: 'static', altName: 'Speed Floor Press', note: 'Limited ROM — max speed in a shoulder-safe position' },
  // Day 2 Lower A — Main Lift: Speed Trap Bar DL
  { monthNumber: 6, dayKey: 'lower-a', blockKey: 'main-lift', exerciseIndex: 0, moverType: 'static', altName: 'Speed Elevated Trap Bar DL', note: 'Raised handles — peak speed at a safe range' },
  // Day 5 Lower B — Main Lift: Speed SSB Squat
  { monthNumber: 6, dayKey: 'lower-b', blockKey: 'main-lift', exerciseIndex: 0, moverType: 'static', altName: 'Speed Front Squat', note: 'Upright position — max speed with mobility preserved' },
  { monthNumber: 6, dayKey: 'lower-b', blockKey: 'main-lift', exerciseIndex: 0, moverType: 'spring', altName: 'Speed SSB Squat (lighter)', note: 'Springs: drop load 10%, max concentric velocity' },
  // Day 5 Lower B — Finisher: Baseball Transfer
  { monthNumber: 6, dayKey: 'lower-b', blockKey: 'finisher', exerciseIndex: 0, moverType: 'hybrid', altName: 'Combo: OF Route + Base Steal', note: 'Hybrids: do both patterns — you need both' },
];
