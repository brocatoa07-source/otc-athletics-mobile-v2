import type { KarteriaMonth } from './karteria-types';

/* ────────────────────────────────────────────────────
 * MONTH 5 — HIGH-VELOCITY POWER + SPEED + ELASTICITY PEAK
 * High-Velocity Plyos, Elastic Rebound,
 * Lateral & Rotational Burst, Max V,
 * Fast Med Ball, Transfer Isos
 * ──────────────────────────────────────────────────── */

const month5: KarteriaMonth = {
  monthNumber: 5,
  title: 'High-Velocity Power + Speed + Elasticity Peak',
  subtitle: 'High-Velocity Plyos, Elastic Rebound, Lateral & Rotational Burst, Max V, Fast Med Ball, Transfer Isos',
  color: '#3b82f6',
  icon: 'speedometer-outline',
  volumeLevel: 'low',
  intensityLevel: 'high',
  keyFocus: [
    'High-Velocity Plyos',
    'Elastic Rebound',
    'Max V Sprinting',
    'Rotational Speed',
    'Transfer Patterns',
  ],
  days: [
    /* ── DAY 1 — UPPER A ── */
    {
      key: 'upper-a',
      dayNumber: 1,
      label: 'Upper A — Fast Rotation + High-Velocity Plyos + Power',
      accent: '#ef4444',
      focus: 'Fast Rotation + High-Velocity Plyos + Power',
      blocks: [
        {
          key: 'prep',
          exercises: [
            { name: 'Foam Roll T-Spine', sets: '2 min', cue: 'Mid-back on roller, hands behind head, roll slowly' },
            { name: 'Lacrosse Ball — Posterior Shoulder', sets: '90s/side', cue: 'Pin against wall, work posterior delt and upper trap' },
            { name: 'T-Spine Rotation', sets: '2×8/side', cue: 'Open up' },
            { name: 'Wall Overhead Reach', sets: '2×10', cue: 'Extend' },
            { name: 'FAST Rib → Pelvis Dissociation', sets: '2×5', cue: 'Quick switch' },
            { name: 'Reactive Pogos', sets: '2×10s', cue: 'Bounce fast' },
          ],
        },
        {
          key: 'plyo',
          defaultRest: '60-90s',
          exercises: [
            { name: 'Fast MB Shot Put (standing)', sets: '3×4/side', cue: 'Max velocity rotation — peak CNS drive' },
            { name: 'Reactive Plyo Push-Up → Pop', sets: '3×4', cue: 'Explode up' },
            { name: 'Fast MB Shot Put (standing)', sets: '3×5/side', cue: 'Max velocity' },
            { name: 'Step-Behind Rotational MB Throw (full speed)', sets: '2×4/side', cue: '90-95%' },
          ],
        },
        {
          key: 'loaded-power',
          defaultRest: '90s',
          exercises: [
            { name: 'Landmine Rotational Punch (max intent)', sets: '3×3/side', cue: 'Velocity not load' },
          ],
        },
        {
          key: 'main-lift',
          defaultRest: '2-3 min',
          exercises: [
            { name: 'DB Bench (moderate load, fast concentric)', sets: '4×3', cue: 'Speed up phase' },
            { name: 'Plyo Chest Toss (very light ball)', sets: '3×6', cue: 'Max velocity after heavy' },
          ],
        },
        {
          key: 'secondary',
          defaultRest: '90s-2 min',
          exercises: [
            { name: 'Chest-Supported Row (faster tempo)', sets: '3×6', cue: 'Quick pull' },
            { name: 'Landmine Press (speed-focused)', sets: '3×5/side', cue: 'Drive fast' },
          ],
        },
        {
          key: 'accessories',
          defaultRest: '60s',
          exercises: [
            { name: 'Serratus Wall Slides (quick tempo)', sets: '2×12', cue: 'Fast protraction' },
            { name: 'Face Pulls', sets: '2×12', cue: 'External rotate' },
            { name: 'Bottoms-Up Carry (light)', sets: '2×20yd', cue: 'Grip walk' },
          ],
        },
        {
          key: 'core',
          defaultRest: '45-60s',
          exercises: [
            { name: 'Landmine 180s (fast)', sets: '2×6', cue: 'Max speed' },
            { name: 'Med Ball Russian Twist (violent)', sets: '2×10', cue: 'Max intent' },
          ],
        },
        {
          key: 'finisher',
          defaultRest: '60s',
          exercises: [
            { name: 'Row Intervals', sets: '5×:10 on/:50 off', cue: 'Short max bursts' },
          ],
        },
      ],
    },

    /* ── DAY 2 — LOWER A ── */
    {
      key: 'lower-a',
      dayNumber: 2,
      label: 'Lower A — Elastic Power + Max Velocity + Reactive Strength',
      accent: '#22c55e',
      focus: 'Elastic Power + Max Velocity + Reactive Strength',
      blocks: [
        {
          key: 'prep',
          exercises: [
            { name: 'Foam Roll Quads & IT Band', sets: '2 min', cue: 'Roll from hip to just above knee, 30 sec per area' },
            { name: 'Lacrosse Ball — Glutes', sets: '90s/side', cue: 'Sit on ball, find trigger point, breathe through it' },
            { name: 'Deep Squat Pry', sets: '2×30s', cue: 'Open hips' },
            { name: 'Ankle DF Stretch', sets: '2×30s', cue: 'Knee past toe' },
            { name: 'Block-Leg Rotation → Fast Lock', sets: '2×5', cue: 'Quick' },
            { name: 'High Dribbles', sets: '2×20yd', cue: 'Max stiffness' },
          ],
        },
        {
          key: 'plyo',
          defaultRest: '60-90s',
          exercises: [
            { name: 'Depth Drop → Reactive Jump (CNS Primer)', sets: '3×2', cue: 'Minimal ground contact — peak elastic activation' },
            { name: 'Heiden → Rebound → Rebound', sets: '3×2/side', cue: 'Chain rebounds' },
            { name: 'Broad Jump → Bound → Bound', sets: '3×2', cue: 'Triple chain' },
            { name: 'Depth Drop (high box) → Reactive Jump', sets: '3×2', cue: 'Real elasticity' },
          ],
        },
        {
          key: 'loaded-power',
          defaultRest: '90s',
          exercises: [
            { name: 'Trap Bar Jump (light load, max velocity)', sets: '3×3', cue: 'Speed focus' },
          ],
        },
        {
          key: 'main-lift',
          defaultRest: '2-3 min',
          exercises: [
            { name: 'Trap Bar Deadlift (medium load, FAST concentric)', sets: '4×3', cue: 'Speed up phase' },
            { name: 'Box Jump (quick-light landing)', sets: '3×3', cue: 'Reactive after heavy' },
          ],
        },
        {
          key: 'secondary',
          defaultRest: '90s-2 min',
          exercises: [
            { name: 'RDL (moderate, clean technique)', sets: '3×5', cue: 'Clean hinge' },
            { name: 'Lateral Lunge (fast out of hole)', sets: '3×5/side', cue: 'Explosive' },
          ],
        },
        {
          key: 'accessories',
          defaultRest: '60s',
          exercises: [
            { name: 'Hamstring Curl', sets: '2×12', cue: 'Squeeze' },
            { name: 'Suitcase Carry (heavy)', sets: '2×20yd', cue: 'Walk tall' },
            { name: 'Tib Raises', sets: '2×12', cue: 'Full range' },
          ],
        },
        {
          key: 'core',
          defaultRest: '45-60s',
          exercises: [
            { name: 'Pallof Press (explosive)', sets: '2×6/side', cue: 'Fast punch' },
            { name: 'Stir-the-Pot', sets: '2×10', cue: 'Circles' },
          ],
        },
        {
          key: 'finisher',
          defaultRest: '60s',
          exercises: [
            { name: 'Flying 20s', sets: '3×15yd build → 20yd fly', cue: 'REAL fast' },
          ],
        },
      ],
    },

    /* ── DAY 3 — AR DAY ── */
    {
      key: 'ar',
      dayNumber: 3,
      label: 'AR Day — Elastic Recovery + Movement Quality + Transfer',
      accent: '#3b82f6',
      focus: 'Elastic Recovery + Movement Quality + Transfer',
      blocks: [
        {
          key: 'prep',
          exercises: [
            { name: 'Foam Roll Full Body (light)', sets: '3 min', cue: 'Quads, IT band, lats, T-spine, calves — easy pressure' },
            { name: '90/90 Transitions', sets: '2×10', cue: 'Smooth' },
            { name: 'T-Spine Rotation', sets: '2×8', cue: 'Open' },
            { name: 'Hip ER Mobility', sets: '2×8', cue: 'External rotate' },
            { name: 'Pigeon Stretch', sets: '2×20s/side', cue: 'Hold' },
          ],
        },
        {
          key: 'plyo',
          defaultRest: '60-90s',
          exercises: [
            { name: 'Med Ball Slam → Jump', sets: '2×3', cue: 'Slam then vertical jump — CNS bridge' },
            { name: 'Split Squat Hold → Hop', sets: '2×3', cue: 'Hold then jump' },
            { name: 'Wall Sprint Hold → Step', sets: '2×3', cue: 'Hold then drive' },
            { name: 'Anti-Rotation Hold → Fast Rotate', sets: '2×3', cue: 'Hold then fire' },
          ],
        },
        {
          key: 'loaded-power',
          defaultRest: '90s',
          exercises: [
            { name: 'Pogos', sets: '2×12s', cue: 'Easy bounces' },
            { name: 'Line Hops (reactive)', sets: '2×10s', cue: 'Quick' },
          ],
        },
        {
          key: 'main-lift',
          defaultRest: '2-3 min',
          exercises: [
            { name: 'Straight-Leg Bounds', sets: '2×20yd', cue: 'FAST' },
            { name: 'A-Skip (fast)', sets: '2×20yd', cue: 'Max speed' },
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
      label: 'Upper B — Fast Pressing + Elastic Upper Plyos + Rotational Speed',
      accent: '#f97316',
      focus: 'Fast Pressing + Elastic Upper Plyos + Rotational Speed',
      blocks: [
        {
          key: 'prep',
          exercises: [
            { name: 'Foam Roll T-Spine', sets: '2 min', cue: 'Mid-back on roller, hands behind head, roll slowly' },
            { name: 'Lacrosse Ball — Posterior Shoulder', sets: '90s/side', cue: 'Pin against wall, work posterior delt and upper trap' },
            { name: 'KB Arm Bar', sets: '2×30s/side', cue: 'Open shoulder' },
            { name: 'Thread the Needle', sets: '2×8/side', cue: 'Rotate' },
            { name: 'Rib → Pelvis Sequencing (fast)', sets: '2×5', cue: 'Quick' },
            { name: 'Reactive Pogos', sets: '2×10s', cue: 'Bounce' },
          ],
        },
        {
          key: 'plyo',
          defaultRest: '60-90s',
          exercises: [
            { name: 'Fast MB Shot Put (standing)', sets: '3×4/side', cue: 'Max velocity rotation — peak CNS drive' },
            { name: 'MB Chest Pass (max velocity)', sets: '3×5', cue: 'Fastest possible' },
            { name: 'OH Throw (fastest possible)', sets: '3×5', cue: 'Max drive' },
            { name: 'Explosive Pull-Ups (1 rep at a time)', sets: '3×3', cue: 'One fast rep' },
          ],
        },
        {
          key: 'loaded-power',
          defaultRest: '90s',
          exercises: [
            { name: 'DB Push Press (light load, fast)', sets: '3×3', cue: 'Speed reps' },
          ],
        },
        {
          key: 'main-lift',
          defaultRest: '2-3 min',
          exercises: [
            { name: 'Landmine Press (moderate load, fast)', sets: '4×3', cue: 'Speed up' },
            { name: 'Reactive Plyo Push-Up', sets: '3×4', cue: 'Pop — after heavy' },
          ],
        },
        {
          key: 'secondary',
          defaultRest: '90s-2 min',
          exercises: [
            { name: 'Weighted TRX Row (fast up, slow down)', sets: '3×6', cue: 'Speed pull' },
            { name: 'Speed Incline DB Press', sets: '3×5', cue: 'Fast concentric' },
          ],
        },
        {
          key: 'accessories',
          defaultRest: '60s',
          exercises: [
            { name: 'Scap Push-Up Variations', sets: '2×12', cue: 'Protract' },
            { name: 'Face Pulls', sets: '2×12', cue: 'Squeeze' },
            { name: 'No-Money Band', sets: '2×12', cue: 'Elbows tight' },
          ],
        },
        {
          key: 'core',
          defaultRest: '45-60s',
          exercises: [
            { name: 'Hanging Leg Raise', sets: '2×8', cue: 'No swing' },
            { name: 'MB Scoop Toss (light, fast)', sets: '2×6', cue: 'Max hip speed' },
          ],
        },
        {
          key: 'finisher',
          defaultRest: '60s',
          exercises: [
            { name: 'Bike Steady', sets: '1×5min', cue: 'Easy flush' },
          ],
        },
      ],
    },

    /* ── DAY 5 — LOWER B ── */
    {
      key: 'lower-b',
      dayNumber: 5,
      label: 'Lower B — High Elasticity + Rotational Power + Transfer',
      accent: '#eab308',
      focus: 'High Elasticity + Rotational Power + Transfer',
      blocks: [
        {
          key: 'prep',
          exercises: [
            { name: 'Foam Roll Quads & IT Band', sets: '2 min', cue: 'Roll from hip to just above knee, 30 sec per area' },
            { name: 'Lacrosse Ball — Glutes', sets: '90s/side', cue: 'Sit on ball, find trigger point, breathe through it' },
            { name: 'Cossacks', sets: '2×6/side', cue: 'Full depth' },
            { name: 'Hip Flexor Stretch', sets: '2×30s/side', cue: 'Open up' },
            { name: 'Pelvis → Rotate (quick)', sets: '2×5', cue: 'Fast' },
            { name: 'Block-Leg ISO', sets: '2×8-10s', cue: 'Hold' },
            { name: 'High Dribbles', sets: '2×20yd', cue: 'Max stiffness' },
          ],
        },
        {
          key: 'plyo',
          defaultRest: '60-90s',
          exercises: [
            { name: 'Depth Drop → Reactive Jump (CNS Primer)', sets: '3×2', cue: 'Minimal ground contact — peak elastic activation' },
            { name: 'Depth Drop → Rebound → Rebound', sets: '3×2', cue: 'Chain rebounds' },
            { name: 'Skier Hops (fast-reactive)', sets: '3×6/side', cue: 'Quick' },
            { name: 'SL Box Jump (moderate height)', sets: '3×3', cue: 'Drive up' },
          ],
        },
        {
          key: 'loaded-power',
          defaultRest: '90s',
          exercises: [
            { name: 'Landmine Skater Press (fast)', sets: '3×3/side', cue: 'Max velocity' },
          ],
        },
        {
          key: 'main-lift',
          defaultRest: '2-3 min',
          exercises: [
            { name: 'SSB or Back Squat (moderate load, fast)', sets: '4×3', cue: 'Speed up' },
            { name: 'Reactive Box Jump (low height)', sets: '3×3', cue: 'Quick after heavy' },
          ],
        },
        {
          key: 'secondary',
          defaultRest: '90s-2 min',
          exercises: [
            { name: 'Step-Up → Fast Knee Drive (speed)', sets: '3×5/side', cue: 'Drive fast' },
            { name: 'SL RDL (moderate)', sets: '3×5/side', cue: 'Clean hinge' },
          ],
        },
        {
          key: 'accessories',
          defaultRest: '60s',
          exercises: [
            { name: 'Hip Airplane', sets: '2×4/side', cue: 'Full rotation' },
            { name: 'Weighted Glute Bridge ISO', sets: '2×20s', cue: 'Squeeze' },
            { name: 'Tibialis Work', sets: '2×12', cue: 'Full range' },
          ],
        },
        {
          key: 'core',
          defaultRest: '45-60s',
          exercises: [
            { name: 'Farmer Carry (very heavy)', sets: '2×30yd', cue: 'Max load' },
            { name: 'Weighted Side Plank', sets: '2×20s', cue: 'Plate on hip' },
          ],
        },
        {
          key: 'finisher',
          defaultRest: '60s',
          exercises: [
            { name: 'Shuffle → Crossover → Sprint (game-speed)', sets: '3×sprint', cue: '95% effort' },
          ],
        },
      ],
    },
  ],
};

export default month5;
