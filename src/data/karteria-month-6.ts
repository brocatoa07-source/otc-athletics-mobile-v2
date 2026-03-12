import type { KarteriaMonth } from './karteria-types';

/* ────────────────────────────────────────────────────
 * MONTH 6 — TRANSFER / PEAK / BASEBALL INTEGRATION
 * High-High Velocity, Lower Volume, Intent-Focused Power,
 * Baseball Movement Carryover, Rotational Sequencing,
 * Transfer Isos
 * ──────────────────────────────────────────────────── */

const month6: KarteriaMonth = {
  monthNumber: 6,
  title: 'Transfer / Peak / Baseball Integration',
  subtitle: 'High-High Velocity, Lower Volume, Intent-Focused Power, Baseball Movement Carryover, Rotational Sequencing, Transfer Isos',
  color: '#e11d48',
  icon: 'trophy-outline',
  volumeLevel: 'low',
  intensityLevel: 'high',
  keyFocus: [
    'Transfer Speed',
    'Peak Elasticity',
    'Baseball Patterns',
    'Low Volume Max Intent',
    'Rotational Violence',
  ],
  days: [
    /* ── DAY 1 — UPPER A ── */
    {
      key: 'upper-a',
      dayNumber: 1,
      label: 'Upper A — Rotational Violence + Skill Transfer',
      accent: '#ef4444',
      focus: 'Rotational Violence + Skill Transfer',
      blocks: [
        {
          key: 'prep',
          exercises: [
            { name: 'Foam Roll T-Spine', sets: '2 min', cue: 'Mid-back on roller, hands behind head, roll slowly' },
            { name: 'Lacrosse Ball — Posterior Shoulder', sets: '90s/side', cue: 'Pin against wall, work posterior delt and upper trap' },
            { name: 'T-Spine Rotation', sets: '2×8/side', cue: 'Open up' },
            { name: 'Shoulder Dislocates', sets: '2×10', cue: 'Full range' },
            { name: 'FAST Rib → Pelvis Dissociation', sets: '2×5', cue: 'Quick' },
            { name: 'Reactive Pogos', sets: '2×10s', cue: 'Bounce' },
          ],
        },
        {
          key: 'plyo',
          defaultRest: '60-90s',
          exercises: [
            { name: 'Rotational MB Throw (max intent)', sets: '3×3/side', cue: 'Full speed rotation — game-speed CNS activation' },
            { name: 'Reactive Plyo Push-Up → Pop', sets: '3×3', cue: 'Explode' },
            { name: 'Fast Shot Put (standing)', sets: '3×4/side', cue: '90-95% velocity' },
            { name: 'Step-Behind Rotational Throw (max intent)', sets: '2×3/side', cue: 'Zero sloppy reps' },
          ],
        },
        {
          key: 'loaded-power',
          defaultRest: '90s',
          exercises: [
            { name: 'Landmine Rotational Punch (max intent)', sets: '2×3/side', cue: 'Low volume — max intent' },
          ],
        },
        {
          key: 'main-lift',
          defaultRest: '2-3 min',
          exercises: [
            { name: 'Speed Bench Press (light-moderate)', sets: '4×3', cue: 'Velocity > weight' },
            { name: 'Plyo Chest Toss (very light)', sets: '3×5', cue: 'Max speed after bench' },
          ],
        },
        {
          key: 'secondary',
          defaultRest: '90s-2 min',
          exercises: [
            { name: 'Landmine Press (power)', sets: '3×4/side', cue: 'Speed' },
            { name: 'Fast DB Row (controlled but quick)', sets: '3×6', cue: 'Quick pull' },
          ],
        },
        {
          key: 'accessories',
          defaultRest: '60s',
          exercises: [
            { name: 'Face Pulls', sets: '2×10', cue: 'Light and clean' },
            { name: 'Scap Push-Ups', sets: '2×10', cue: 'Protract' },
            { name: 'No-Money Band', sets: '2×12', cue: 'Elbows tight' },
          ],
        },
        {
          key: 'core',
          defaultRest: '45-60s',
          exercises: [
            { name: 'Landmine 180s', sets: '2×4', cue: 'Fast' },
            { name: 'Rotational MB Side Bend → Throw', sets: '2×3', cue: 'Transfer pattern' },
          ],
        },
        {
          key: 'finisher',
          defaultRest: '60s',
          exercises: [
            { name: 'Shuffle → Crossover → Sprint', sets: '3×20yd', cue: '90% — game-like' },
          ],
        },
      ],
    },

    /* ── DAY 2 — LOWER A ── */
    {
      key: 'lower-a',
      dayNumber: 2,
      label: 'Lower A — Elastic Peak + Accel/Max V + Lead-Leg Block Transfer',
      accent: '#22c55e',
      focus: 'Elastic Peak + Accel/Max V + Lead-Leg Block Transfer',
      blocks: [
        {
          key: 'prep',
          exercises: [
            { name: 'Foam Roll Quads & IT Band', sets: '2 min', cue: 'Roll from hip to just above knee, 30 sec per area' },
            { name: 'Lacrosse Ball — Glutes', sets: '90s/side', cue: 'Sit on ball, find trigger point, breathe through it' },
            { name: 'Hip Flexor Stretch', sets: '2×30s/side', cue: 'Open up' },
            { name: 'Ankle DF Stretch', sets: '2×30s', cue: 'Knee past toe' },
            { name: 'Block-Leg Rotation → Fast Lock', sets: '2×5', cue: 'Quick' },
            { name: 'Dribbles (mid/high)', sets: '2×20yd', cue: 'Max stiffness' },
          ],
        },
        {
          key: 'plyo',
          defaultRest: '60-90s',
          exercises: [
            { name: 'Broad Jump → Bound (CNS Primer)', sets: '2×2', cue: 'Chain the jumps — max intent, game-speed activation' },
            { name: 'Heiden → Rebound → Rebound', sets: '2×2/side', cue: 'Very low volume high intensity' },
            { name: 'Depth Drop → Reactive Jump', sets: '2×2', cue: 'Absorb → explode' },
            { name: 'Triple Bound Series (elastic)', sets: '2×2', cue: 'Chain bounds' },
          ],
        },
        {
          key: 'loaded-power',
          defaultRest: '90s',
          exercises: [
            { name: 'Trap Bar Jump (light, max velocity)', sets: '2×3', cue: 'Speed focus' },
          ],
        },
        {
          key: 'main-lift',
          defaultRest: '2-3 min',
          exercises: [
            { name: 'Speed Trap Bar DL', sets: '3×3', cue: 'Fast concentric' },
            { name: 'Box Jump (light and fast)', sets: '3×2', cue: 'Reactive after heavy' },
          ],
        },
        {
          key: 'secondary',
          defaultRest: '90s-2 min',
          exercises: [
            { name: 'RDL (moderate, clean)', sets: '2×5', cue: 'Clean hinge' },
            { name: 'Step-Up w/ Knee Drive (fast)', sets: '2×5/side', cue: 'Drive hard' },
          ],
        },
        {
          key: 'accessories',
          defaultRest: '60s',
          exercises: [
            { name: 'Suitcase Carry', sets: '2×20yd', cue: 'Walk tall' },
            { name: 'Tib Raises', sets: '2×10', cue: 'Full range' },
          ],
        },
        {
          key: 'core',
          defaultRest: '45-60s',
          exercises: [
            { name: 'Anti-Rotation Press (fast)', sets: '2×6', cue: 'Quick punch' },
            { name: 'Stir-the-Pot', sets: '2×8', cue: 'Tight circles' },
          ],
        },
        {
          key: 'finisher',
          defaultRest: '60s',
          exercises: [
            { name: 'Flying 10s', sets: '2×15yd build → 10yd fly', cue: 'True top speed' },
          ],
        },
      ],
    },

    /* ── DAY 3 — AR DAY ── */
    {
      key: 'ar',
      dayNumber: 3,
      label: 'AR Day — Transfer Isos + Elastic Recovery + Tempo',
      accent: '#3b82f6',
      focus: 'Transfer Isos + Elastic Recovery + Tempo',
      blocks: [
        {
          key: 'prep',
          exercises: [
            { name: 'Foam Roll Full Body (light)', sets: '3 min', cue: 'Quads, IT band, lats, T-spine, calves — easy pressure' },
            { name: '90/90 Series', sets: '2×8', cue: 'Smooth flow' },
            { name: 'T-Spine Opens', sets: '2×8', cue: 'Rotate' },
            { name: 'Hip ER', sets: '2×8', cue: 'External rotate' },
            { name: 'Pigeon Stretch', sets: '2×20s/side', cue: 'Sink in' },
          ],
        },
        {
          key: 'plyo',
          defaultRest: '60-90s',
          exercises: [
            { name: 'Med Ball Slam (quick)', sets: '2×3', cue: 'Quick slams — light CNS prep' },
            { name: 'Split Squat Hold → Lateral Bound', sets: '2×2', cue: 'Hold then bound' },
            { name: 'Wall Sprint Hold → Accel Step', sets: '2×2', cue: 'Hold then drive' },
            { name: 'Anti-Rotation Hold → Fast Rotate', sets: '2×2', cue: 'Hold then fire' },
          ],
        },
        {
          key: 'loaded-power',
          defaultRest: '90s',
          exercises: [
            { name: 'Pogos', sets: '2×10s', cue: 'Light bounces' },
            { name: 'Line Hops', sets: '2×10s', cue: 'Quick' },
          ],
        },
        {
          key: 'main-lift',
          defaultRest: '2-3 min',
          exercises: [
            { name: 'Straight-Leg Bounds', sets: '2×20yd', cue: 'Fast' },
            { name: 'A-Skip (speed)', sets: '2×20yd', cue: 'Max speed' },
          ],
        },
        {
          key: 'secondary',
          defaultRest: '90s-2 min',
          exercises: [
            { name: 'Physiological Sigh', sets: '2×cycles', cue: 'Reset' },
            { name: 'Box Breathing', sets: '1×cycle', cue: 'Calm the system' },
          ],
        },
      ],
    },

    /* ── DAY 4 — UPPER B ── */
    {
      key: 'upper-b',
      dayNumber: 4,
      label: 'Upper B — Peak Power + Rotational Quickness',
      accent: '#f97316',
      focus: 'Peak Power + Rotational Quickness',
      blocks: [
        {
          key: 'prep',
          exercises: [
            { name: 'Foam Roll T-Spine', sets: '2 min', cue: 'Mid-back on roller, hands behind head, roll slowly' },
            { name: 'Lacrosse Ball — Posterior Shoulder', sets: '90s/side', cue: 'Pin against wall, work posterior delt and upper trap' },
            { name: 'KB Arm Bar', sets: '2×30s/side', cue: 'Open shoulder' },
            { name: 'Thread the Needle', sets: '2×8/side', cue: 'Rotate' },
            { name: 'FAST Rib → Pelvis Sequencing', sets: '2×5', cue: 'Quick' },
            { name: 'Reactive Pogos', sets: '2×10s', cue: 'Bounce' },
          ],
        },
        {
          key: 'plyo',
          defaultRest: '60-90s',
          exercises: [
            { name: 'Rotational MB Throw (max intent)', sets: '3×3/side', cue: 'Full speed rotation — game-speed CNS activation' },
            { name: 'MB Chest Pass (max velocity)', sets: '3×4', cue: 'Fastest possible' },
            { name: 'OH Throw (max velocity)', sets: '3×4', cue: 'Max drive' },
            { name: 'Plyo Pull-Up', sets: '2×3', cue: 'Fast single rep' },
          ],
        },
        {
          key: 'loaded-power',
          defaultRest: '90s',
          exercises: [
            { name: 'DB Push Press (light, FAST)', sets: '2×3', cue: 'Speed reps' },
          ],
        },
        {
          key: 'main-lift',
          defaultRest: '2-3 min',
          exercises: [
            { name: 'Landmine Press (speed)', sets: '3×3', cue: 'Fast' },
            { name: 'Reactive Plyo Push-Up', sets: '2×3', cue: 'Pop — after heavy' },
          ],
        },
        {
          key: 'secondary',
          defaultRest: '90s-2 min',
          exercises: [
            { name: 'TRX Row (fast)', sets: '2×8', cue: 'Quick pull' },
            { name: 'Incline Speed DB Press', sets: '2×5', cue: 'Fast up' },
          ],
        },
        {
          key: 'accessories',
          defaultRest: '60s',
          exercises: [
            { name: 'Scap Push-Ups', sets: '2×10', cue: 'Protract' },
            { name: 'Face Pulls', sets: '2×10', cue: 'Light' },
            { name: 'No-Money', sets: '2×12', cue: 'Elbows tight' },
          ],
        },
        {
          key: 'core',
          defaultRest: '45-60s',
          exercises: [
            { name: 'MB Scoop Toss', sets: '2×5', cue: 'Fast hips' },
            { name: 'Hanging Knee Raise', sets: '2×6', cue: 'Controlled' },
          ],
        },
        {
          key: 'finisher',
          defaultRest: '60s',
          exercises: [
            { name: 'Shuffle → Crossover → Open Hips → Sprint', sets: '3×drill', cue: '70% — smooth movement > speed' },
          ],
        },
      ],
    },

    /* ── DAY 5 — LOWER B ── */
    {
      key: 'lower-b',
      dayNumber: 5,
      label: 'Lower B — Peak Elasticity + Baseball Power Transfer',
      accent: '#eab308',
      focus: 'Peak Elasticity + Baseball Power Transfer',
      blocks: [
        {
          key: 'prep',
          exercises: [
            { name: 'Foam Roll Quads & IT Band', sets: '2 min', cue: 'Roll from hip to just above knee, 30 sec per area' },
            { name: 'Lacrosse Ball — Glutes', sets: '90s/side', cue: 'Sit on ball, find trigger point, breathe through it' },
            { name: 'Cossacks', sets: '2×6/side', cue: 'Full depth' },
            { name: 'Hip Flexor Stretch', sets: '2×30s/side', cue: 'Open up' },
            { name: 'Pelvis → Rotate (fast)', sets: '2×5', cue: 'Quick' },
            { name: 'Block-Leg ISO', sets: '2×8', cue: 'Hold' },
            { name: 'High Dribbles', sets: '2×20yd', cue: 'Max stiffness' },
          ],
        },
        {
          key: 'plyo',
          defaultRest: '60-90s',
          exercises: [
            { name: 'Broad Jump → Bound (CNS Primer)', sets: '2×2', cue: 'Chain the jumps — max intent, game-speed activation' },
            { name: 'Depth Drop → Reactive → Reactive', sets: '2×2', cue: 'Chain rebounds' },
            { name: 'Skier Hops (violent but controlled)', sets: '2×6/side', cue: 'Fast' },
            { name: 'SL Box Jump (low-medium)', sets: '2×3', cue: 'Drive up' },
          ],
        },
        {
          key: 'loaded-power',
          defaultRest: '90s',
          exercises: [
            { name: 'Landmine Skater Press (max velocity)', sets: '2×3/side', cue: 'Top speed' },
          ],
        },
        {
          key: 'main-lift',
          defaultRest: '2-3 min',
          exercises: [
            { name: 'Speed SSB Squat (light-moderate)', sets: '3×3', cue: 'Fast' },
            { name: 'Low-Box Reactive Jump', sets: '2×3', cue: 'Quick after heavy' },
          ],
        },
        {
          key: 'secondary',
          defaultRest: '90s-2 min',
          exercises: [
            { name: 'Step-Up → Fast Knee Drive', sets: '2×5', cue: 'Speed' },
            { name: 'SL RDL (clean, crisp)', sets: '2×5', cue: 'Quality' },
          ],
        },
        {
          key: 'accessories',
          defaultRest: '60s',
          exercises: [
            { name: 'Hip Airplane', sets: '2×3/side', cue: 'Full rotation' },
            { name: 'Glute Bridge ISO', sets: '2×15s', cue: 'Squeeze' },
            { name: 'Tib Raises', sets: '2×10', cue: 'Full range' },
          ],
        },
        {
          key: 'core',
          defaultRest: '45-60s',
          exercises: [
            { name: 'Farmer Carry (heavy)', sets: '2×20yd', cue: 'Strong walk' },
            { name: 'Side Plank (weighted)', sets: '2×20s', cue: 'Plate on hip' },
          ],
        },
        {
          key: 'finisher',
          defaultRest: '60s',
          exercises: [
            { name: 'Baseball Transfer', sets: '2×route', cue: 'OF route or base-steal start → sprint' },
          ],
        },
      ],
    },
  ],
};

export default month6;
