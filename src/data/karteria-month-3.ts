import type { KarteriaMonth } from './karteria-types';

/* ────────────────────────────────────────────────────
 * MONTH 3 — MAX STRENGTH + INTRO TO POWER PHASE
 * Max Strength (3-5 reps), Heavy Hinges + Pushes,
 * Intensive Plyos, Faster Med Ball, Overcoming Isos,
 * Max V Introduction
 * ──────────────────────────────────────────────────── */

const month3: KarteriaMonth = {
  monthNumber: 3,
  title: 'Max Strength + Intro to Power',
  subtitle: 'Max Strength (3-5 reps), Heavy Hinges + Pushes, Intensive Plyos, Faster Med Ball, Overcoming Isos, Max V Introduction',
  color: '#ef4444',
  icon: 'barbell-outline',
  volumeLevel: 'moderate',
  intensityLevel: 'high',
  keyFocus: [
    'Max Strength',
    'Overcoming Isometrics',
    'Intensive Plyometrics',
    'Faster Med Ball',
    'Max V Introduction',
  ],
  days: [
    /* ── DAY 1 — UPPER A ── */
    {
      key: 'upper-a',
      dayNumber: 1,
      label: 'Upper A — Max Strength + Faster Rotation + Heavy Scap',
      accent: '#ef4444',
      focus: 'Max Strength + Faster Rotation + Heavy Scap',
      blocks: [
        {
          key: 'prep',
          exercises: [
            { name: 'Foam Roll T-Spine', sets: '2 min', cue: 'Mid-back on roller, hands behind head, roll slowly' },
            { name: 'Lacrosse Ball — Posterior Shoulder', sets: '90s/side', cue: 'Pin against wall, work posterior delt and upper trap' },
            { name: 'T-Spine Rotation', sets: '2×8/side', cue: 'Open up' },
            { name: 'Serratus Wall Slides', sets: '2×10', cue: 'Reach fully' },
            { name: 'Rib → Pelvis Dissociation', sets: '2×5', cue: 'Fast' },
            { name: 'Pogos medium', sets: '2×15s', cue: 'More reactive' },
          ],
        },
        {
          key: 'plyo',
          defaultRest: '60-90s',
          exercises: [
            { name: 'Rotational Med Ball Throw (standing)', sets: '3×4/side', cue: 'Max intent rotation — full CNS activation' },
            { name: 'Plyo Push-Up to Low Box', sets: '3×4', cue: 'Drive up to box' },
            { name: 'SA Reactive MB Chest Pass', sets: '3×5/side', cue: 'Quick hands' },
            { name: 'Rotational MB Shot Put standing', sets: '3×4/side', cue: 'Velocity up' },
          ],
        },
        {
          key: 'loaded-power',
          defaultRest: '90s',
          exercises: [
            { name: 'Landmine Rotational Punch', sets: '3×3/side', cue: 'Higher intent' },
          ],
        },
        {
          key: 'main-lift',
          defaultRest: '2-3 min',
          exercises: [
            { name: 'Barbell Bench Press', sets: '4×3', cue: '85-88% — real strength' },
            { name: 'Overcoming ISO Bench vs Pins', sets: '3×10-12s', cue: 'Max push against pins' },
          ],
        },
        {
          key: 'secondary',
          defaultRest: '90s-2 min',
          exercises: [
            { name: 'Chest-Supported Row heavy', sets: '3×6', cue: 'Pull hard' },
            { name: 'Half-Kneeling Landmine Press', sets: '3×5/side', cue: 'Brace tight' },
          ],
        },
        {
          key: 'accessories',
          defaultRest: '60s',
          exercises: [
            { name: 'Face Pulls', sets: '2×12', cue: 'Squeeze at top' },
            { name: 'Prone YTL Raise', sets: '2×6 each', cue: 'Slow' },
            { name: 'Bottoms-Up KB Carry', sets: '2×20yd', cue: 'Grip and walk' },
          ],
        },
        {
          key: 'core',
          defaultRest: '45-60s',
          exercises: [
            { name: 'Landmine 180s', sets: '2×6', cue: 'Full rotation' },
            { name: 'Russian Twist + Slam', sets: '2×10', cue: 'Violent intent' },
          ],
        },
        {
          key: 'finisher',
          defaultRest: '60s',
          exercises: [
            { name: 'Bike Intervals', sets: '5×:20 hard/:40 easy', cue: 'Push the system' },
          ],
        },
      ],
    },

    /* ── DAY 2 — LOWER A ── */
    {
      key: 'lower-a',
      dayNumber: 2,
      label: 'Lower A — Max Strength + Intensive Plyos + Early Max V',
      accent: '#22c55e',
      focus: 'Max Strength + Intensive Plyos + Early Max V',
      blocks: [
        {
          key: 'prep',
          exercises: [
            { name: 'Foam Roll Quads & IT Band', sets: '2 min', cue: 'Roll from hip to just above knee, 30 sec per area' },
            { name: 'Lacrosse Ball — Glutes', sets: '90s/side', cue: 'Sit on ball, find trigger point, breathe through it' },
            { name: 'Deep Squat Pry', sets: '2×30s', cue: 'Open hips' },
            { name: 'Hip Flexor Stretch', sets: '2×30s/side', cue: 'Tall posture' },
            { name: 'Block-Leg Rotation → Hold', sets: '2×5', cue: 'Fast lock' },
            { name: 'Dribbles mid-height', sets: '2×20yd', cue: 'Building stiffness' },
          ],
        },
        {
          key: 'plyo',
          defaultRest: '60-90s',
          exercises: [
            { name: 'Broad Jump (CNS Primer)', sets: '3×3', cue: 'Max intent, triple extension — full nervous system activation' },
            { name: 'Heiden → Rebound', sets: '3×3/side', cue: 'Aggressive lateral' },
            { name: 'Broad Jump aggressive', sets: '3×3', cue: 'Max intent' },
            { name: 'Depth Drop mid box → Stick', sets: '3×3', cue: 'Stick the landing' },
          ],
        },
        {
          key: 'loaded-power',
          defaultRest: '90s',
          exercises: [
            { name: 'Trap Bar Jump moderate load', sets: '3×3', cue: 'More load now' },
          ],
        },
        {
          key: 'main-lift',
          defaultRest: '2-3 min',
          exercises: [
            { name: 'Trap Bar Deadlift heavy', sets: '4×3', cue: '85% range' },
            { name: 'Split Squat Overcoming ISO', sets: '3×10-12s/side', cue: 'Drive into ground' },
          ],
        },
        {
          key: 'secondary',
          defaultRest: '90s-2 min',
          exercises: [
            { name: 'RDL heavy', sets: '3×5', cue: 'No tempo — just strong' },
            { name: 'Lateral Lunge', sets: '3×5/side', cue: 'Push out hard' },
          ],
        },
        {
          key: 'accessories',
          defaultRest: '60s',
          exercises: [
            { name: 'Hamstring Curl', sets: '2×12', cue: 'Squeeze' },
            { name: 'Suitcase Hold', sets: '2×20s/side', cue: 'Heavy' },
            { name: 'Tib Raises', sets: '2×12', cue: 'Full range' },
          ],
        },
        {
          key: 'core',
          defaultRest: '45-60s',
          exercises: [
            { name: 'Pallof Press + Step Out', sets: '2×6/side', cue: 'Step and resist' },
            { name: 'Stir-the-Pot', sets: '2×10', cue: 'Circles on ball' },
          ],
        },
        {
          key: 'finisher',
          defaultRest: '60s',
          exercises: [
            { name: 'Flying 10 Buildup', sets: '3×10yd accel → 10yd fly', cue: 'Build real speed' },
          ],
        },
      ],
    },

    /* ── DAY 3 — AR DAY ── */
    {
      key: 'ar',
      dayNumber: 3,
      label: 'AR Day — Mobility + Overcoming Isos + Low-Level Elasticity',
      accent: '#3b82f6',
      focus: 'Mobility + Overcoming Isos + Low-Level Elasticity',
      blocks: [
        {
          key: 'prep',
          exercises: [
            { name: 'Foam Roll Full Body (light)', sets: '3 min', cue: 'Quads, IT band, lats, T-spine, calves — easy pressure' },
            { name: '90/90 Transitions', sets: '2×10', cue: 'Smooth' },
            { name: 'Wall Slides', sets: '2×10', cue: 'Full range' },
            { name: 'T-Spine Rotations', sets: '2×8', cue: 'Open up' },
            { name: 'Pigeon Stretch', sets: '2×20s/side', cue: 'Sink in' },
          ],
        },
        {
          key: 'plyo',
          defaultRest: '60-90s',
          exercises: [
            { name: 'Med Ball Slam (moderate)', sets: '2×4', cue: 'Moderate intent — CNS activation' },
            { name: 'Wall Sprint ISO', sets: '2×12s', cue: 'Max drive' },
            { name: 'Squat ISO vs Wall', sets: '2×10s', cue: 'Push hard' },
            { name: 'Anti-Rotation Cable ISO', sets: '2×10s/side', cue: 'Resist max' },
          ],
        },
        {
          key: 'loaded-power',
          defaultRest: '90s',
          exercises: [
            { name: 'Pogos', sets: '2×15s', cue: 'Light' },
            { name: 'Lateral Line Hops', sets: '2×12s', cue: 'Quick' },
          ],
        },
        {
          key: 'main-lift',
          defaultRest: '2-3 min',
          exercises: [
            { name: 'Straight-Leg Bounds', sets: '2×20yd', cue: 'Light — technique only' },
            { name: 'March → Skip → A-Run', sets: '1×progression', cue: 'Build tempo' },
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
      label: 'Upper B — Max Strength + Dynamic Effort',
      accent: '#f97316',
      focus: 'Max Strength + Dynamic Effort',
      blocks: [
        {
          key: 'prep',
          exercises: [
            { name: 'Foam Roll T-Spine', sets: '2 min', cue: 'Mid-back on roller, hands behind head, roll slowly' },
            { name: 'Lacrosse Ball — Posterior Shoulder', sets: '90s/side', cue: 'Pin against wall, work posterior delt and upper trap' },
            { name: 'KB Arm Bar', sets: '2×30s/side', cue: 'Open shoulder' },
            { name: 'Thread the Needle', sets: '2×8/side', cue: 'Rotate' },
            { name: 'Rib → Pelvis Sequencing', sets: '2×6', cue: 'Fast pattern' },
            { name: 'Pogos', sets: '2×10s', cue: 'Quick' },
          ],
        },
        {
          key: 'plyo',
          defaultRest: '60-90s',
          exercises: [
            { name: 'Rotational Med Ball Throw (standing)', sets: '3×4/side', cue: 'Max intent rotation — full CNS activation' },
            { name: 'MB Chest Pass medium weight', sets: '3×6', cue: 'Drive through' },
            { name: 'Plyo Pull-Up', sets: '3×3', cue: 'Fast single reps' },
            { name: 'Overhead MB Throw', sets: '2×5', cue: 'Drive up and over' },
          ],
        },
        {
          key: 'loaded-power',
          defaultRest: '90s',
          exercises: [
            { name: 'DB Push Press moderate', sets: '3×3', cue: 'Heavier now' },
          ],
        },
        {
          key: 'main-lift',
          defaultRest: '2-3 min',
          exercises: [
            { name: 'Landmine Press heavy', sets: '4×4', cue: 'Real load' },
            { name: 'Iso-Hold Landmine Press top range', sets: '3×10s/side', cue: 'Lock and hold' },
          ],
        },
        {
          key: 'secondary',
          defaultRest: '90s-2 min',
          exercises: [
            { name: 'TRX Row weighted', sets: '3×8', cue: 'Add a vest/chain' },
            { name: 'Incline DB Bench moderate-heavy', sets: '3×6', cue: 'Clean reps' },
          ],
        },
        {
          key: 'accessories',
          defaultRest: '60s',
          exercises: [
            { name: 'Face Pull Variations', sets: '3×12', cue: 'External rotate' },
            { name: 'Scap Protraction Push-Ups', sets: '2×12', cue: 'Plus at top' },
            { name: 'No-Money Band', sets: '2×12', cue: 'Elbows pinned' },
          ],
        },
        {
          key: 'core',
          defaultRest: '45-60s',
          exercises: [
            { name: 'Hanging Leg Raise', sets: '2×8', cue: 'No swing' },
            { name: 'Med Ball Scoop Toss', sets: '2×6', cue: 'Light and fast' },
          ],
        },
        {
          key: 'finisher',
          defaultRest: '60s',
          exercises: [
            { name: 'Bike Flush', sets: '1×5min', cue: 'Moderate — recover' },
          ],
        },
      ],
    },

    /* ── DAY 5 — LOWER B ── */
    {
      key: 'lower-b',
      dayNumber: 5,
      label: 'Lower B — Max Strength + High-Effort Plyos + Lateral Power',
      accent: '#eab308',
      focus: 'Max Strength + High-Effort Plyos + Lateral Power',
      blocks: [
        {
          key: 'prep',
          exercises: [
            { name: 'Foam Roll Quads & IT Band', sets: '2 min', cue: 'Roll from hip to just above knee, 30 sec per area' },
            { name: 'Lacrosse Ball — Glutes', sets: '90s/side', cue: 'Sit on ball, find trigger point, breathe through it' },
            { name: 'Cossack Mobility', sets: '2×6/side', cue: 'Full range' },
            { name: 'Hip Flexor + Quad Stretch', sets: '2×30s/side', cue: 'Open up' },
            { name: 'Pelvis Hinge → Rotate', sets: '2×5', cue: 'Sequence' },
            { name: 'Dribbles medium', sets: '2×20yd', cue: 'Building stiffness' },
          ],
        },
        {
          key: 'plyo',
          defaultRest: '60-90s',
          exercises: [
            { name: 'Broad Jump (CNS Primer)', sets: '3×3', cue: 'Max intent, triple extension — full nervous system activation' },
            { name: 'Depth Drop to Bound', sets: '3×3', cue: 'Absorb → explode' },
            { name: 'Skier Hops reactive', sets: '3×5/side', cue: 'Quick laterals' },
            { name: 'SL Box Jump', sets: '3×3/leg', cue: 'Drive up' },
          ],
        },
        {
          key: 'loaded-power',
          defaultRest: '90s',
          exercises: [
            { name: 'Landmine Skater Press moderate-intensive', sets: '3×4/side', cue: 'More load' },
          ],
        },
        {
          key: 'main-lift',
          defaultRest: '2-3 min',
          exercises: [
            { name: 'Back Squat or SSB Squat', sets: '4×3', cue: '85% — real strength' },
            { name: 'Overcoming ISO Squat mid-range', sets: '3×10s', cue: 'Push against pins' },
          ],
        },
        {
          key: 'secondary',
          defaultRest: '90s-2 min',
          exercises: [
            { name: 'Step-Up w/ Knee Drive moderate load', sets: '3×6/side', cue: 'Drive hard' },
            { name: 'SL RDL heavy', sets: '3×5/side', cue: 'Strong hinge' },
          ],
        },
        {
          key: 'accessories',
          defaultRest: '60s',
          exercises: [
            { name: 'Hip Airplane controlled', sets: '2×5/side', cue: 'Full rotation' },
            { name: 'Glute Bridge ISO top', sets: '2×20s', cue: 'Squeeze' },
            { name: 'Tibialis Raises', sets: '2×12', cue: 'Full range' },
          ],
        },
        {
          key: 'core',
          defaultRest: '45-60s',
          exercises: [
            { name: 'Farmer Carry heavy', sets: '2×30yd', cue: 'Max load' },
            { name: 'Weighted Side Plank', sets: '2×20s', cue: 'Plate on hip' },
          ],
        },
        {
          key: 'finisher',
          defaultRest: '60s',
          exercises: [
            { name: 'Shuttle Repeats 5-10-5', sets: '3×shuttle', cue: '70% — technical, not conditioning' },
          ],
        },
      ],
    },
  ],
};

export default month3;
