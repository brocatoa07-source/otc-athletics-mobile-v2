import type { KarteriaMonth } from './karteria-types';

/* ────────────────────────────────────────────────────
 * MONTH 1 — FOUNDATION PHASE
 * Mobility, Control, Eccentric Strength, Yielding Isos,
 * Acceleration Mechanics, Extensive Plyos
 * ──────────────────────────────────────────────────── */

const month1: KarteriaMonth = {
  monthNumber: 1,
  title: 'Foundation Phase',
  subtitle: 'Mobility, Control, Eccentric Strength, Yielding Isometrics, Acceleration Mechanics, Extensive Plyos',
  color: '#22c55e',
  icon: 'build-outline',
  volumeLevel: 'moderate',
  intensityLevel: 'low',
  keyFocus: [
    'Mobility',
    'Motor Control',
    'Yielding Isometrics',
    'Tendon Stiffness',
    'Acceleration Mechanics',
  ],
  days: [
    /* ── DAY 1 — UPPER A ── */
    {
      key: 'upper-a',
      dayNumber: 1,
      label: 'Upper A — Foundation + Mobility + Rotational Control',
      accent: '#ef4444',
      focus: 'Foundation + Mobility + Rotational Control',
      blocks: [
        {
          key: 'prep',
          exercises: [
            { name: 'Foam Roll T-Spine', sets: '2 min', cue: 'Mid-back on roller, hands behind head, roll slowly' },
            { name: 'Lacrosse Ball — Posterior Shoulder', sets: '90s/side', cue: 'Pin against wall, work posterior delt and upper trap' },
            { name: '90/90 ER Lift-Offs', sets: '2×8/side', cue: 'Open hip fully' },
            { name: 'Quadruped T-Spine Rotations', sets: '2×8/side', cue: 'Reach and rotate' },
            { name: 'Rib-Only Rotation', sets: '2×6/side', cue: 'Isolate rib cage' },
            { name: 'Pogo Series', sets: '2×15s', cue: 'Quick ground contact' },
          ],
        },
        {
          key: 'plyo',
          defaultRest: '60-90s',
          exercises: [
            { name: 'Overhead Med Ball Slam', sets: '2×5', cue: 'Triple extend, slam with intent — wake up the CNS' },
            { name: 'Supine Plyo Chest Toss', sets: '3×6', cue: 'Explosive from chest' },
            { name: 'Plyo Push-Up', sets: '3×5', cue: 'Fast hands off floor' },
            { name: 'SA Medball Push-Up', sets: '2×5/arm', cue: 'Control the landing' },
          ],
        },
        {
          key: 'loaded-power',
          defaultRest: '90s',
          exercises: [
            { name: 'Landmine Rotational Press', sets: '3×4/side', cue: 'Light load — learn pattern' },
          ],
        },
        {
          key: 'main-lift',
          defaultRest: '2-3 min',
          exercises: [
            { name: 'Neutral Grip DB Bench Press', sets: '3×6', cue: '2-3 RIR, control the press' },
            { name: 'Scap Y ISO Hold', sets: '3×20-30s', cue: 'Squeeze at apex' },
          ],
        },
        {
          key: 'secondary',
          defaultRest: '90s-2 min',
          exercises: [
            { name: 'Chest-Supported DB Row', sets: '3×8', cue: 'Pull to hip' },
            { name: 'Half-Kneeling Landmine Press', sets: '3×6/side', cue: 'Brace core' },
          ],
        },
        {
          key: 'accessories',
          defaultRest: '60s',
          exercises: [
            { name: 'Incline YTL Raise', sets: '2×8 each position', cue: 'Slow and controlled' },
            { name: 'Band Pull-Aparts', sets: '2×15', cue: 'Squeeze blades' },
            { name: 'Side-Lying DB ER', sets: '2×10', cue: 'Elbow pinned' },
          ],
        },
        {
          key: 'core',
          defaultRest: '45-60s',
          exercises: [
            { name: 'Russian Twist + Mini Slam', sets: '2×12', cue: 'Rotate with intent' },
            { name: 'Landmine Rotation', sets: '2×6/side', cue: 'Slow and controlled' },
          ],
        },
        {
          key: 'finisher',
          defaultRest: '60s',
          exercises: [
            { name: '5-Min Cycle Tempo', sets: '1×5min', cue: 'Easy-moderate pace' },
          ],
        },
      ],
    },

    /* ── DAY 2 — LOWER A ── */
    {
      key: 'lower-a',
      dayNumber: 2,
      label: 'Lower A — Foundation + Acceleration + Positional Control',
      accent: '#22c55e',
      focus: 'Foundation + Acceleration + Positional Control',
      blocks: [
        {
          key: 'prep',
          exercises: [
            { name: 'Foam Roll Quads & IT Band', sets: '2 min', cue: 'Roll from hip to just above knee, 30 sec per area' },
            { name: 'Lacrosse Ball — Glutes', sets: '90s/side', cue: 'Sit on ball, find trigger point, breathe through it' },
            { name: 'Frog Stretch', sets: '2×30s', cue: 'Sink into hips' },
            { name: 'Deep Squat Reach', sets: '2×8', cue: 'Alternate reaches' },
            { name: 'Pelvis-Only Rotation', sets: '2×6', cue: 'Isolate pelvis' },
            { name: 'Pogo → Stick', sets: '2×10', cue: 'Stick the landing' },
          ],
        },
        {
          key: 'plyo',
          defaultRest: '60-90s',
          exercises: [
            { name: 'Box Jump (CNS Primer)', sets: '2×3', cue: 'Max effort, land soft, step down — wake up the legs' },
            { name: 'Lateral Line Hops', sets: '2×12s', cue: 'Quick feet' },
            { name: 'SL Drop to Jump', sets: '2×4/leg', cue: 'Controlled landing' },
            { name: 'Heiden w/ Stick', sets: '2×3/side', cue: 'Decel emphasis' },
          ],
        },
        {
          key: 'loaded-power',
          defaultRest: '90s',
          exercises: [
            { name: 'Trap Bar Jump', sets: '3×3', cue: 'Light load — controlled landings' },
          ],
        },
        {
          key: 'main-lift',
          defaultRest: '2-3 min',
          exercises: [
            { name: 'Goblet Squat tempo 3-1-1', sets: '3×6', cue: 'Slow down, pause, drive up' },
            { name: 'Split Squat ISO Hold', sets: '3×20-30s/side', cue: 'Bottom position' },
          ],
        },
        {
          key: 'secondary',
          defaultRest: '90s-2 min',
          exercises: [
            { name: 'RDL', sets: '3×6', cue: 'Controlled eccentric' },
            { name: 'Lateral Lunge', sets: '3×5/side', cue: 'Push out of the hole' },
          ],
        },
        {
          key: 'accessories',
          defaultRest: '60s',
          exercises: [
            { name: 'Hamstring Curl', sets: '2×12', cue: 'Squeeze at top' },
            { name: 'Suitcase Hold', sets: '2×20s/side', cue: 'Stay tall' },
            { name: 'Tib Raises', sets: '2×12', cue: 'Full range' },
          ],
        },
        {
          key: 'core',
          defaultRest: '45-60s',
          exercises: [
            { name: 'Pallof Press Hold', sets: '2×15s', cue: 'Resist rotation' },
            { name: 'Dead Bug', sets: '2×8/side', cue: 'Low back flat' },
          ],
        },
        {
          key: 'finisher',
          defaultRest: '60s',
          exercises: [
            { name: '10yd Acceleration', sets: '4×10yd', cue: '70-80% effort, walk back recovery' },
          ],
        },
      ],
    },

    /* ── DAY 3 — AR DAY ── */
    {
      key: 'ar',
      dayNumber: 3,
      label: 'AR Day — Active Recovery + Mobility + Isometric Base',
      accent: '#3b82f6',
      focus: 'Active Recovery + Mobility + Isometric Base',
      blocks: [
        {
          key: 'prep',
          exercises: [
            { name: 'Foam Roll Full Body (light)', sets: '3 min', cue: 'Quads, IT band, lats, T-spine, calves — easy pressure' },
            { name: 'Pigeon Stretch', sets: '2×30s/side', cue: 'Sink into stretch' },
            { name: 'T-Spine Openers', sets: '2×8', cue: 'Rotate through' },
            { name: 'Scap Wall Slides', sets: '2×10', cue: 'Elbows to wall' },
            { name: 'Hip 90/90 Transitions', sets: '2×10', cue: 'Smooth flow' },
          ],
        },
        {
          key: 'plyo',
          defaultRest: '60-90s',
          exercises: [
            { name: 'Light Med Ball Slam', sets: '2×4', cue: 'Easy effort — just wake up the nervous system' },
            { name: 'Wall Sit', sets: '2×30s', cue: 'Thighs parallel' },
            { name: 'Side Plank', sets: '2×20s/side', cue: 'Stack hips' },
            { name: 'Hinge ISO', sets: '2×20s', cue: 'Hold at 45°' },
          ],
        },
        {
          key: 'loaded-power',
          defaultRest: '90s',
          exercises: [
            { name: 'Light Pogos', sets: '2×15s', cue: 'Easy bounces' },
            { name: 'Line Hops', sets: '2×10s', cue: 'Quick and light' },
          ],
        },
        {
          key: 'main-lift',
          defaultRest: '2-3 min',
          exercises: [
            { name: 'Wall Acceleration March', sets: '2×20s', cue: 'Drive knee up' },
            { name: 'March → Skip → A-Run', sets: '1×progression', cue: 'Build tempo each rep' },
          ],
        },
        {
          key: 'secondary',
          defaultRest: '90s-2 min',
          exercises: [
            { name: '90/90 Breathing', sets: '2×60s', cue: 'Exhale fully, pause' },
          ],
        },
      ],
    },

    /* ── DAY 4 — UPPER B ── */
    {
      key: 'upper-b',
      dayNumber: 4,
      label: 'Upper B — Strength Base + Scap + Speed Core',
      accent: '#f97316',
      focus: 'Strength Base + Scap + Speed Core',
      blocks: [
        {
          key: 'prep',
          exercises: [
            { name: 'Foam Roll T-Spine', sets: '2 min', cue: 'Mid-back on roller, hands behind head, roll slowly' },
            { name: 'Lacrosse Ball — Posterior Shoulder', sets: '90s/side', cue: 'Pin against wall, work posterior delt and upper trap' },
            { name: 'KB Arm Bar', sets: '2×30s/side', cue: 'Open shoulder' },
            { name: 'Thread the Needle', sets: '2×8/side', cue: 'Rotate through' },
            { name: 'Rib Rotation → Side Bend', sets: '2×5', cue: 'Sequence the motion' },
            { name: 'Pogos', sets: '2×15s', cue: 'Quick contact' },
          ],
        },
        {
          key: 'plyo',
          defaultRest: '60-90s',
          exercises: [
            { name: 'Overhead Med Ball Slam', sets: '2×5', cue: 'Triple extend, slam with intent — wake up the CNS' },
            { name: 'Depth Drop Push-Up', sets: '3×4', cue: 'Absorb and drive' },
            { name: 'Plyo Pull-Up', sets: '3×3', cue: 'Dead hang to fast rep' },
            { name: 'MB Chest Pass to Wall', sets: '3×6', cue: 'Punch through' },
          ],
        },
        {
          key: 'loaded-power',
          defaultRest: '90s',
          exercises: [
            { name: 'DB Push Press', sets: '3×4', cue: 'Drive from legs' },
          ],
        },
        {
          key: 'main-lift',
          defaultRest: '2-3 min',
          exercises: [
            { name: 'Landmine Press', sets: '3×6/side', cue: 'Core stays locked' },
            { name: 'Bottoms-Up KB OH Hold', sets: '3×15-20s/side', cue: 'Grip and stabilize' },
          ],
        },
        {
          key: 'secondary',
          defaultRest: '90s-2 min',
          exercises: [
            { name: 'TRX Row', sets: '3×10', cue: 'Full extension to chest' },
            { name: 'Alternating Incline DB Press', sets: '3×8', cue: 'Control each rep' },
          ],
        },
        {
          key: 'accessories',
          defaultRest: '60s',
          exercises: [
            { name: 'Face Pulls', sets: '2×12', cue: 'External rotate at top' },
            { name: 'Banded No-Money', sets: '2×12', cue: 'Elbows pinned' },
            { name: 'Prone Lower Trap Raise', sets: '2×8', cue: 'Thumbs up' },
          ],
        },
        {
          key: 'core',
          defaultRest: '45-60s',
          exercises: [
            { name: 'Hanging Knees-to-Chest', sets: '2×8', cue: 'Controlled' },
            { name: 'V-Ups', sets: '2×10', cue: 'Touch toes' },
          ],
        },
        {
          key: 'finisher',
          defaultRest: '60s',
          exercises: [
            { name: 'Row 4 Min', sets: '1×4min', cue: 'Moderate pace' },
          ],
        },
      ],
    },

    /* ── DAY 5 — LOWER B ── */
    {
      key: 'lower-b',
      dayNumber: 5,
      label: 'Lower B — Strength + Landing Mechanics + Stiffness',
      accent: '#eab308',
      focus: 'Strength + Landing Mechanics + Stiffness',
      blocks: [
        {
          key: 'prep',
          exercises: [
            { name: 'Foam Roll Quads & IT Band', sets: '2 min', cue: 'Roll from hip to just above knee, 30 sec per area' },
            { name: 'Lacrosse Ball — Glutes', sets: '90s/side', cue: 'Sit on ball, find trigger point, breathe through it' },
            { name: 'Cossack Mobility', sets: '2×6/side', cue: 'Shift weight fully' },
            { name: 'Ankle DF Rocks', sets: '2×10', cue: 'Knee over toe' },
            { name: 'Pelvis Rotation + Hinge', sets: '2×5', cue: 'Sequence the pattern' },
            { name: 'Dribbles', sets: '2×20yd', cue: 'Mid-height' },
          ],
        },
        {
          key: 'plyo',
          defaultRest: '60-90s',
          exercises: [
            { name: 'Box Jump (CNS Primer)', sets: '2×3', cue: 'Max effort, land soft, step down — wake up the legs' },
            { name: 'Broad Jump', sets: '3×3', cue: 'Controlled landings' },
            { name: 'Skier Hops', sets: '2×8/side', cue: 'Quick laterals' },
            { name: 'Depth Drop', sets: '2×3', cue: 'Low box — stick' },
          ],
        },
        {
          key: 'loaded-power',
          defaultRest: '90s',
          exercises: [
            { name: 'Landmine Skater Press', sets: '3×4/side', cue: 'Drive lateral' },
          ],
        },
        {
          key: 'main-lift',
          defaultRest: '2-3 min',
          exercises: [
            { name: 'Trap Bar Deadlift', sets: '3×5', cue: 'Controlled tempo' },
            { name: 'Anti-Rotation ISO', sets: '3×15-20s/side', cue: 'Split stance hold' },
          ],
        },
        {
          key: 'secondary',
          defaultRest: '90s-2 min',
          exercises: [
            { name: 'Step-Ups w/ Knee Drive', sets: '3×6/side', cue: 'Drive knee high' },
            { name: 'Single-Leg RDL', sets: '3×6/side', cue: 'Hinge with control' },
          ],
        },
        {
          key: 'accessories',
          defaultRest: '60s',
          exercises: [
            { name: 'Glute Bridge Hold', sets: '2×20s', cue: 'Squeeze at top' },
            { name: 'Adductor Side Plank', sets: '2×15s/side', cue: 'Stack and hold' },
            { name: 'Tibialis KB Raises', sets: '2×12', cue: 'Full range' },
          ],
        },
        {
          key: 'core',
          defaultRest: '45-60s',
          exercises: [
            { name: 'Farmer Carry', sets: '2×25yd', cue: 'Heavy and tall' },
            { name: 'Weighted Plank', sets: '2×20s', cue: 'Plate on back' },
          ],
        },
        {
          key: 'finisher',
          defaultRest: '60s',
          exercises: [
            { name: 'Bike Tempo', sets: '1×5min', cue: 'Steady effort' },
          ],
        },
      ],
    },
  ],
};

export default month1;
