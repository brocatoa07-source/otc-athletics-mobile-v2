import type { KarteriaMonth } from './karteria-types';

/* ────────────────────────────────────────────────────
 * MONTH 4 — CONTRAST POWER & SPEED DEVELOPMENT PHASE
 * Contrast Training, Moderate-High Med Ball,
 * Faster Rotation, Elastic Stiffness,
 * Max V Sprinting, Overcoming Isos Heavy
 * ──────────────────────────────────────────────────── */

const month4: KarteriaMonth = {
  monthNumber: 4,
  title: 'Contrast Power & Speed Development',
  subtitle: 'Contrast Training, Moderate-High Med Ball, Faster Rotation, Elastic Stiffness, Max V Sprinting, Overcoming Isos Heavy',
  color: '#f59e0b',
  icon: 'flash-outline',
  volumeLevel: 'moderate',
  intensityLevel: 'high',
  keyFocus: [
    'Contrast Training',
    'Rotational Speed',
    'Elastic Stiffness',
    'Max V Sprinting',
    'Transfer Patterns',
  ],
  days: [
    /* ── DAY 1 — UPPER A ── */
    {
      key: 'upper-a',
      dayNumber: 1,
      label: 'Upper A — Contrast Power + High-Velocity Rotation',
      accent: '#ef4444',
      focus: 'Contrast Power + High-Velocity Rotation',
      blocks: [
        {
          key: 'prep',
          exercises: [
            { name: 'Foam Roll T-Spine', sets: '2 min', cue: 'Mid-back on roller, hands behind head, roll slowly' },
            { name: 'Lacrosse Ball — Posterior Shoulder', sets: '90s/side', cue: 'Pin against wall, work posterior delt and upper trap' },
            { name: 'T-Spine Rotation', sets: '2×8/side', cue: 'Open up' },
            { name: 'Wall Overhead Reach', sets: '2×10', cue: 'Extend fully' },
            { name: 'FAST Rib → Pelvis Dissociation', sets: '2×5', cue: 'Quick switch' },
            { name: 'Reactive Pogos', sets: '2×10s', cue: 'Bounce fast' },
          ],
        },
        {
          key: 'plyo',
          defaultRest: '60-90s',
          exercises: [
            { name: 'Fast MB Shot Put (standing)', sets: '3×4/side', cue: 'Explosive rotation — max CNS activation' },
            { name: 'Reactive Plyo Push-Up', sets: '3×4', cue: 'Pop off floor' },
            { name: 'Fast MB Shot Put (standing)', sets: '3×4/side', cue: 'Max velocity' },
            { name: 'Step-Behind Rotational MB Throw', sets: '2×4/side', cue: 'Full rotation' },
          ],
        },
        {
          key: 'loaded-power',
          defaultRest: '90s',
          exercises: [
            { name: 'Landmine Rotational Punch (high intent)', sets: '3×3/side', cue: 'Velocity focus' },
          ],
        },
        {
          key: 'main-lift',
          defaultRest: '2-3 min',
          exercises: [
            { name: 'DB Bench Press (heavy)', sets: '4×3', cue: '88-90% — strength' },
            { name: 'Plyo Chest Toss (light MB)', sets: '3×5', cue: 'Speed — right after heavy set' },
          ],
        },
        {
          key: 'secondary',
          defaultRest: '90s-2 min',
          exercises: [
            { name: 'Chest-Supported Row (moderate-heavy)', sets: '3×6', cue: 'Pull hard' },
            { name: 'Landmine Press (power-based)', sets: '3×5/side', cue: 'Speed focus' },
          ],
        },
        {
          key: 'accessories',
          defaultRest: '60s',
          exercises: [
            { name: 'Face Pull + ER Combo', sets: '2×10', cue: 'External rotate' },
            { name: 'Serratus Wall Circles', sets: '2×10', cue: 'Protract fully' },
            { name: 'Bottoms-Up Carry (light)', sets: '2×20yd', cue: 'Grip and walk' },
          ],
        },
        {
          key: 'core',
          defaultRest: '45-60s',
          exercises: [
            { name: 'Landmine 180s (high speed)', sets: '2×6', cue: 'Fast rotation' },
            { name: 'Med Ball Russian Twist (violent)', sets: '2×10', cue: 'Max intent' },
          ],
        },
        {
          key: 'finisher',
          defaultRest: '60s',
          exercises: [
            { name: 'Bike Intervals', sets: '5×:15 on/:45 off', cue: 'Short bursts' },
          ],
        },
      ],
    },

    /* ── DAY 2 — LOWER A ── */
    {
      key: 'lower-a',
      dayNumber: 2,
      label: 'Lower A — Contrast Jumps + Acceleration/Max V Transition',
      accent: '#22c55e',
      focus: 'Contrast Jumps + Acceleration/Max V Transition',
      blocks: [
        {
          key: 'prep',
          exercises: [
            { name: 'Foam Roll Quads & IT Band', sets: '2 min', cue: 'Roll from hip to just above knee, 30 sec per area' },
            { name: 'Lacrosse Ball — Glutes', sets: '90s/side', cue: 'Sit on ball, find trigger point, breathe through it' },
            { name: 'Hip Flexor Stretch', sets: '2×30s/side', cue: 'Open up' },
            { name: 'Ankle DF Stretch', sets: '2×30s', cue: 'Knee past toe' },
            { name: 'Block-Leg Rotation', sets: '2×5', cue: 'Fast lock' },
            { name: 'Dribbles (mid-height)', sets: '2×20yd', cue: 'Building stiffness' },
          ],
        },
        {
          key: 'plyo',
          defaultRest: '60-90s',
          exercises: [
            { name: 'Depth Drop → Jump (CNS Primer)', sets: '3×2', cue: 'Step off, absorb, explode — reactive CNS activation' },
            { name: 'Heiden → Rebound', sets: '3×3/side', cue: 'Aggressive lateral' },
            { name: 'Broad Jump → Bound', sets: '3×2', cue: 'Chain the jumps' },
            { name: 'Depth Drop (mid/high box) → Stick', sets: '3×2', cue: 'Absorb and stick' },
          ],
        },
        {
          key: 'loaded-power',
          defaultRest: '90s',
          exercises: [
            { name: 'Trap Bar Jump (moderate-heavy)', sets: '3×3', cue: 'Real load now' },
          ],
        },
        {
          key: 'main-lift',
          defaultRest: '2-3 min',
          exercises: [
            { name: 'Trap Bar Deadlift (heavy)', sets: '4×3', cue: '88-92% — max strength' },
            { name: 'Box Jump (medium height, reactive)', sets: '3×3', cue: 'Speed — right after heavy' },
          ],
        },
        {
          key: 'secondary',
          defaultRest: '90s-2 min',
          exercises: [
            { name: 'RDL (heavy, no tempo)', sets: '3×5', cue: 'Just strong' },
            { name: 'Lateral Lunge Power Step', sets: '3×5/side', cue: 'Explosive out' },
          ],
        },
        {
          key: 'accessories',
          defaultRest: '60s',
          exercises: [
            { name: 'Hamstring Curl', sets: '2×12', cue: 'Squeeze' },
            { name: 'Suitcase Hold (heavy)', sets: '2×20s/side', cue: 'Max load' },
            { name: 'Tib Raises', sets: '2×12', cue: 'Full range' },
          ],
        },
        {
          key: 'core',
          defaultRest: '45-60s',
          exercises: [
            { name: 'Pallof Press (medium load)', sets: '2×8/side', cue: 'Resist and press' },
            { name: 'Stir-the-Pot', sets: '2×10', cue: 'Circles on ball' },
          ],
        },
        {
          key: 'finisher',
          defaultRest: '60s',
          exercises: [
            { name: 'Flying 20s', sets: '3×10yd build → 20yd fly', cue: 'Real speed' },
          ],
        },
      ],
    },

    /* ── DAY 3 — AR DAY ── */
    {
      key: 'ar',
      dayNumber: 3,
      label: 'AR Day — Isometric Power + Elastic Flow + Light Mechanics',
      accent: '#3b82f6',
      focus: 'Isometric Power + Elastic Flow + Light Mechanics',
      blocks: [
        {
          key: 'prep',
          exercises: [
            { name: 'Foam Roll Full Body (light)', sets: '3 min', cue: 'Quads, IT band, lats, T-spine, calves — easy pressure' },
            { name: '90/90 Transitions', sets: '2×10', cue: 'Smooth' },
            { name: 'T-Spine Openers', sets: '2×8', cue: 'Open up' },
            { name: 'Hip ER Mobility', sets: '2×8', cue: 'External rotate' },
            { name: 'Pigeon Stretch', sets: '2×20s/side', cue: 'Hold' },
          ],
        },
        {
          key: 'plyo',
          defaultRest: '60-90s',
          exercises: [
            { name: 'Med Ball Slam (moderate)', sets: '2×4', cue: 'Moderate intent — CNS activation' },
            { name: 'Split Squat ISO vs Wall', sets: '2×:08', cue: 'Push hard' },
            { name: 'Wall Sprint ISO', sets: '2×:08', cue: 'Max drive' },
            { name: 'Anti-Rotation ISO', sets: '2×:08/side', cue: 'Resist max' },
          ],
        },
        {
          key: 'loaded-power',
          defaultRest: '90s',
          exercises: [
            { name: 'Pogos', sets: '2×12s', cue: 'Easy' },
            { name: 'Lateral Line Hops', sets: '2×10s', cue: 'Quick' },
          ],
        },
        {
          key: 'main-lift',
          defaultRest: '2-3 min',
          exercises: [
            { name: 'Straight-Leg Bounds (light)', sets: '2×20yd', cue: 'Technique' },
            { name: 'March → Skip → A-Run', sets: '1×progression', cue: 'Speed' },
          ],
        },
        {
          key: 'secondary',
          defaultRest: '90s-2 min',
          exercises: [
            { name: 'Physiological Sigh', sets: '3×cycles', cue: 'Deep reset' },
          ],
        },
      ],
    },

    /* ── DAY 4 — UPPER B ── */
    {
      key: 'upper-b',
      dayNumber: 4,
      label: 'Upper B — Contrast Pressing + Fast Scap + Dynamic Core',
      accent: '#f97316',
      focus: 'Contrast Pressing + Fast Scap + Dynamic Core',
      blocks: [
        {
          key: 'prep',
          exercises: [
            { name: 'Foam Roll T-Spine', sets: '2 min', cue: 'Mid-back on roller, hands behind head, roll slowly' },
            { name: 'Lacrosse Ball — Posterior Shoulder', sets: '90s/side', cue: 'Pin against wall, work posterior delt and upper trap' },
            { name: 'KB Arm Bar', sets: '2×30s/side', cue: 'Open shoulder' },
            { name: 'Thread the Needle', sets: '2×8/side', cue: 'Rotate' },
            { name: 'Rib → Pelvis Sequencing', sets: '2×5', cue: 'Quick pattern' },
            { name: 'Reactive Pogos', sets: '2×10s', cue: 'Bounce' },
          ],
        },
        {
          key: 'plyo',
          defaultRest: '60-90s',
          exercises: [
            { name: 'Fast MB Shot Put (standing)', sets: '3×4/side', cue: 'Explosive rotation — max CNS activation' },
            { name: 'MB Chest Pass (high speed)', sets: '3×5', cue: 'Max velocity' },
            { name: 'OH Med Ball Throw (fast)', sets: '3×5', cue: 'Drive up' },
            { name: 'Plyo Pull-Up', sets: '3×3', cue: 'Fast single rep' },
          ],
        },
        {
          key: 'loaded-power',
          defaultRest: '90s',
          exercises: [
            { name: 'DB Push Press (heavy-light contrast)', sets: '3×3', cue: 'Fast reps' },
          ],
        },
        {
          key: 'main-lift',
          defaultRest: '2-3 min',
          exercises: [
            { name: 'Landmine Press (heavy)', sets: '4×4', cue: 'Real load' },
            { name: 'Plyo Push-Up (light)', sets: '3×4', cue: 'Speed — after heavy' },
          ],
        },
        {
          key: 'secondary',
          defaultRest: '90s-2 min',
          exercises: [
            { name: 'TRX Row (weighted)', sets: '3×8', cue: 'Add load' },
            { name: 'Incline DB Press (moderate)', sets: '3×6', cue: 'Clean and strong' },
          ],
        },
        {
          key: 'accessories',
          defaultRest: '60s',
          exercises: [
            { name: 'Scap Protraction Push-Ups', sets: '2×12', cue: 'Plus at top' },
            { name: 'Face Pull Variations', sets: '2×12', cue: 'Squeeze' },
            { name: 'No-Money Band', sets: '2×12', cue: 'Elbows tight' },
          ],
        },
        {
          key: 'core',
          defaultRest: '45-60s',
          exercises: [
            { name: 'Hanging Leg Raise', sets: '2×8', cue: 'No swing' },
            { name: 'Scoop Toss (light MB)', sets: '2×6', cue: 'Fast hips' },
          ],
        },
        {
          key: 'finisher',
          defaultRest: '60s',
          exercises: [
            { name: 'Bike Moderate', sets: '1×5min', cue: 'Flush ride' },
          ],
        },
      ],
    },

    /* ── DAY 5 — LOWER B ── */
    {
      key: 'lower-b',
      dayNumber: 5,
      label: 'Lower B — Contrast Squat + High-Elasticity + Lateral Power',
      accent: '#eab308',
      focus: 'Contrast Squat + High-Elasticity + Lateral Power',
      blocks: [
        {
          key: 'prep',
          exercises: [
            { name: 'Foam Roll Quads & IT Band', sets: '2 min', cue: 'Roll from hip to just above knee, 30 sec per area' },
            { name: 'Lacrosse Ball — Glutes', sets: '90s/side', cue: 'Sit on ball, find trigger point, breathe through it' },
            { name: 'Cossack Mobility', sets: '2×6/side', cue: 'Full range' },
            { name: 'Hip Flexor Stretch', sets: '2×30s/side', cue: 'Open up' },
            { name: 'Pelvis Hinge → Rotate', sets: '2×5', cue: 'Quick' },
            { name: 'Block-Leg ISO', sets: '2×10s', cue: 'Hold position' },
            { name: 'High Dribbles', sets: '2×20yd', cue: 'Building' },
          ],
        },
        {
          key: 'plyo',
          defaultRest: '60-90s',
          exercises: [
            { name: 'Depth Drop → Jump (CNS Primer)', sets: '3×2', cue: 'Step off, absorb, explode — reactive CNS activation' },
            { name: 'Depth Drop → Bound', sets: '3×2', cue: 'Absorb → explode' },
            { name: 'Skier Hops (reactive)', sets: '3×6/side', cue: 'Fast' },
            { name: 'SL Box Jump (light)', sets: '3×3', cue: 'Drive up' },
          ],
        },
        {
          key: 'loaded-power',
          defaultRest: '90s',
          exercises: [
            { name: 'Landmine Skater Press (fast)', sets: '3×4/side', cue: 'Speed focus' },
          ],
        },
        {
          key: 'main-lift',
          defaultRest: '2-3 min',
          exercises: [
            { name: 'SSB or Back Squat (heavy)', sets: '4×3', cue: '90% — real load' },
            { name: 'Box Jump (light, reactive)', sets: '3×3', cue: 'Speed — after heavy' },
          ],
        },
        {
          key: 'secondary',
          defaultRest: '90s-2 min',
          exercises: [
            { name: 'Step-Up w/ Knee Drive (medium-fast)', sets: '3×6/side', cue: 'Speed up' },
            { name: 'SL RDL (moderate-heavy)', sets: '3×5/side', cue: 'Clean hinge' },
          ],
        },
        {
          key: 'accessories',
          defaultRest: '60s',
          exercises: [
            { name: 'Hip Airplane', sets: '2×4/side', cue: 'Full rotation' },
            { name: 'Glute Bridge ISO (top)', sets: '2×20s', cue: 'Squeeze' },
            { name: 'Tibialis Work', sets: '2×12', cue: 'Full range' },
          ],
        },
        {
          key: 'core',
          defaultRest: '45-60s',
          exercises: [
            { name: 'Farmer Carry (heavy)', sets: '2×30yd', cue: 'Max load' },
            { name: 'Anti-Lateral Flexion Hold', sets: '2×15-20s/side', cue: 'Resist' },
          ],
        },
        {
          key: 'finisher',
          defaultRest: '60s',
          exercises: [
            { name: 'Shuffle → Crossover → Sprint', sets: '3×20yd', cue: '80-85% — technical' },
          ],
        },
      ],
    },
  ],
};

export default month4;
