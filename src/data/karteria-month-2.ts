import type { KarteriaMonth } from './karteria-types';

/* ────────────────────────────────────────────────────
 * MONTH 2 — ECCENTRIC CONTROL PHASE
 * Eccentrics, True Strength, Unilateral Stability,
 * Positional Isometrics, Controlled Med Ball, Acceleration
 * ──────────────────────────────────────────────────── */

const month2: KarteriaMonth = {
  monthNumber: 2,
  title: 'Eccentric Control Phase',
  subtitle: 'Eccentrics, True Strength, Unilateral Stability, Positional Isometrics, Controlled Med Ball, Acceleration',
  color: '#8b5cf6',
  icon: 'trending-up-outline',
  volumeLevel: 'moderate',
  intensityLevel: 'moderate',
  keyFocus: [
    'Eccentric Strength',
    'Tendon Health',
    'Positional Isometrics',
    'Landing Mechanics',
    'Deceleration',
  ],
  days: [
    /* ── DAY 1 — UPPER A ── */
    {
      key: 'upper-a',
      dayNumber: 1,
      label: 'Upper A — Eccentric Strength + Scap Stability + Rotational Control',
      accent: '#ef4444',
      focus: 'Eccentric Strength + Scap Stability + Rotational Control',
      blocks: [
        {
          key: 'prep',
          exercises: [
            { name: 'Foam Roll T-Spine', sets: '2 min', cue: 'Mid-back on roller, hands behind head, roll slowly' },
            { name: 'Lacrosse Ball — Posterior Shoulder', sets: '90s/side', cue: 'Pin against wall, work posterior delt and upper trap' },
            { name: 'T-Spine Windmills', sets: '2×8/side', cue: 'Full rotation' },
            { name: 'Shoulder Dislocates', sets: '2×10', cue: 'Band or dowel' },
            { name: 'Rib → Pelvis Separation', sets: '2×5/side', cue: 'Pelvis stable' },
            { name: 'Pogos', sets: '2×15s', cue: 'Forward/backward' },
          ],
        },
        {
          key: 'plyo',
          defaultRest: '60-90s',
          exercises: [
            { name: 'Rotational Med Ball Throw', sets: '2×5/side', cue: 'Load hip, separate, explode — nervous system activation' },
            { name: 'Depth Drop Push-Up', sets: '3×4', cue: 'Absorb the drop' },
            { name: 'Reactive MB Chest Toss', sets: '3×6', cue: 'Quick hands' },
            { name: 'Med Ball Shot Put', sets: '2×5/side', cue: 'Half kneeling' },
          ],
        },
        {
          key: 'loaded-power',
          defaultRest: '90s',
          exercises: [
            { name: 'Landmine Rotational Punch', sets: '3×4/side', cue: 'Controlled — learning transfer' },
          ],
        },
        {
          key: 'main-lift',
          defaultRest: '2-3 min',
          exercises: [
            { name: 'Eccentric Neutral Grip DB Bench 4s lowering', sets: '3×6', cue: '4-second down' },
            { name: 'Positional Scap Y ISO', sets: '3×20-30s', cue: 'Hold apex' },
          ],
        },
        {
          key: 'secondary',
          defaultRest: '90s-2 min',
          exercises: [
            { name: 'DB Chest-Supported Row', sets: '3×8', cue: 'Pull to hip' },
            { name: 'Landmine Press slow tempo', sets: '3×6/side', cue: '2-second concentric' },
          ],
        },
        {
          key: 'accessories',
          defaultRest: '60s',
          exercises: [
            { name: 'Face Pulls slow', sets: '2×12', cue: 'Squeeze at top' },
            { name: 'Serratus Wall Slides', sets: '2×10', cue: 'Reach fully' },
            { name: 'Sidelying DB ER', sets: '2×10', cue: 'Elbow pinned' },
          ],
        },
        {
          key: 'core',
          defaultRest: '45-60s',
          exercises: [
            { name: 'Cable Lift/Chop slow eccentric', sets: '2×6/side', cue: 'Control the return' },
            { name: 'Russian Twist + Plyo Slam', sets: '2×10', cue: 'Violent intent' },
          ],
        },
        {
          key: 'finisher',
          defaultRest: '60s',
          exercises: [
            { name: 'Row 4 Min', sets: '1×4min', cue: 'Steady pace' },
          ],
        },
      ],
    },

    /* ── DAY 2 — LOWER A ── */
    {
      key: 'lower-a',
      dayNumber: 2,
      label: 'Lower A — Eccentric Strength + Acceleration + Block-Leg Control',
      accent: '#22c55e',
      focus: 'Eccentric Strength + Acceleration + Block-Leg Control',
      blocks: [
        {
          key: 'prep',
          exercises: [
            { name: 'Foam Roll Quads & IT Band', sets: '2 min', cue: 'Roll from hip to just above knee, 30 sec per area' },
            { name: 'Lacrosse Ball — Glutes', sets: '90s/side', cue: 'Sit on ball, find trigger point, breathe through it' },
            { name: 'Frog Stretch', sets: '2×30s', cue: 'Sink deep' },
            { name: 'Ankle DF Stretch', sets: '2×30s', cue: 'Knee past toe' },
            { name: 'Lead-Leg Block ISO', sets: '2×10-15s', cue: 'Lock the position' },
            { name: 'Dribbles', sets: '2×20yd', cue: 'Low height' },
          ],
        },
        {
          key: 'plyo',
          defaultRest: '60-90s',
          exercises: [
            { name: 'Broad Jump (CNS Primer)', sets: '2×3', cue: 'Triple extension, arm drive — controlled landings' },
            { name: 'Lateral Line Hops', sets: '2×12s', cue: 'Quick feet' },
            { name: 'SL Drop to Jump controlled', sets: '3×3/leg', cue: 'Nail the landing' },
            { name: 'Heiden → Stick decel', sets: '2×3/side', cue: 'Slow the stop' },
          ],
        },
        {
          key: 'loaded-power',
          defaultRest: '90s',
          exercises: [
            { name: 'Trap Bar Jump', sets: '3×3', cue: 'Still submax — controlled landings' },
          ],
        },
        {
          key: 'main-lift',
          defaultRest: '2-3 min',
          exercises: [
            { name: 'Eccentric Goblet Squat 4s down', sets: '3×6', cue: '4-second lowering' },
            { name: 'Split Squat ISO bottom quarter', sets: '3×15-25s', cue: 'Hold deep' },
          ],
        },
        {
          key: 'secondary',
          defaultRest: '90s-2 min',
          exercises: [
            { name: 'RDL 3s eccentric', sets: '3×6', cue: '3-second down' },
            { name: 'Lateral Lunge slow', sets: '3×5/side', cue: 'Control the range' },
          ],
        },
        {
          key: 'accessories',
          defaultRest: '60s',
          exercises: [
            { name: 'Hamstring Curl', sets: '2×12', cue: 'Squeeze at top' },
            { name: 'Suitcase Hold', sets: '2×20s/side', cue: 'Stay vertical' },
            { name: 'Tib Raises', sets: '2×12', cue: 'Full range' },
          ],
        },
        {
          key: 'core',
          defaultRest: '45-60s',
          exercises: [
            { name: 'Pallof Eccentric Hold', sets: '2×12s', cue: 'Slow extension' },
            { name: 'Dead Bug controlled', sets: '2×8/side', cue: 'Tempo each rep' },
          ],
        },
        {
          key: 'finisher',
          defaultRest: '60s',
          exercises: [
            { name: '10yd Acceleration', sets: '4×10yd', cue: '75-85% effort, walk back' },
          ],
        },
      ],
    },

    /* ── DAY 3 — AR DAY ── */
    {
      key: 'ar',
      dayNumber: 3,
      label: 'AR Day — Mobility + Yielding Isos + Light Elastic Work',
      accent: '#3b82f6',
      focus: 'Mobility + Yielding Isos + Light Elastic Work',
      blocks: [
        {
          key: 'prep',
          exercises: [
            { name: 'Foam Roll Full Body (light)', sets: '3 min', cue: 'Quads, IT band, lats, T-spine, calves — easy pressure' },
            { name: '90/90 Transitions', sets: '2×10', cue: 'Smooth flow' },
            { name: 'Wall Slides', sets: '2×10', cue: 'Full range' },
            { name: 'T-Spine Rotation', sets: '2×8', cue: 'Open up' },
            { name: 'Pigeon Stretch', sets: '2×20s/side', cue: 'Hold steady' },
          ],
        },
        {
          key: 'plyo',
          defaultRest: '60-90s',
          exercises: [
            { name: 'Light Med Ball Slam', sets: '2×4', cue: 'Easy effort — CNS activation without fatigue' },
            { name: 'Wall Sit', sets: '2×30-40s', cue: 'Thighs parallel' },
            { name: 'Side Plank', sets: '2×20-25s/side', cue: 'Stacked' },
            { name: 'Hinge ISO', sets: '2×20-25s', cue: '45° hold' },
          ],
        },
        {
          key: 'loaded-power',
          defaultRest: '90s',
          exercises: [
            { name: 'Light Pogos', sets: '2×10s', cue: 'Easy' },
            { name: 'Lateral Line Hops', sets: '2×10s', cue: 'Easy' },
          ],
        },
        {
          key: 'main-lift',
          defaultRest: '2-3 min',
          exercises: [
            { name: 'Wall March → Switch → Triple Switch', sets: '2×progression', cue: 'Clean contacts' },
            { name: 'March → Skip → A-Run', sets: '1×20-30yd each', cue: 'Build speed' },
          ],
        },
        {
          key: 'secondary',
          defaultRest: '90s-2 min',
          exercises: [
            { name: '90/90 Breathing', sets: '2×60s', cue: 'Full exhale' },
          ],
        },
      ],
    },

    /* ── DAY 4 — UPPER B ── */
    {
      key: 'upper-b',
      dayNumber: 4,
      label: 'Upper B — Strength + Tempo + Scapular Control',
      accent: '#f97316',
      focus: 'Strength + Tempo + Scapular Control',
      blocks: [
        {
          key: 'prep',
          exercises: [
            { name: 'Foam Roll T-Spine', sets: '2 min', cue: 'Mid-back on roller, hands behind head, roll slowly' },
            { name: 'Lacrosse Ball — Posterior Shoulder', sets: '90s/side', cue: 'Pin against wall, work posterior delt and upper trap' },
            { name: 'KB Arm Bar', sets: '2×30s/side', cue: 'Open shoulder' },
            { name: 'Thread the Needle', sets: '2×8/side', cue: 'Rotate' },
            { name: 'Rib Rotation Patterns', sets: '2×6', cue: 'Sequenced' },
            { name: 'Pogos', sets: '2×12s', cue: 'Quick' },
          ],
        },
        {
          key: 'plyo',
          defaultRest: '60-90s',
          exercises: [
            { name: 'Rotational Med Ball Throw', sets: '2×5/side', cue: 'Load hip, separate, explode — nervous system activation' },
            { name: 'Plyo Push-Up', sets: '3×4', cue: 'Hands off floor' },
            { name: 'MB Chest Pass', sets: '3×6', cue: 'Punch through' },
            { name: 'SA MB Push-Up', sets: '2×5/side', cue: 'Control landing' },
          ],
        },
        {
          key: 'loaded-power',
          defaultRest: '90s',
          exercises: [
            { name: 'DB Push Press', sets: '3×4', cue: 'Light — drive from legs' },
          ],
        },
        {
          key: 'main-lift',
          defaultRest: '2-3 min',
          exercises: [
            { name: 'Landmine Press 3s eccentric', sets: '3×6/side', cue: 'Slow down phase' },
            { name: 'Bottoms-Up KB OH Hold', sets: '3×15-20s/side', cue: 'Grip tight' },
          ],
        },
        {
          key: 'secondary',
          defaultRest: '90s-2 min',
          exercises: [
            { name: 'TRX Row slow', sets: '3×10', cue: 'Controlled' },
            { name: 'Alternating Incline DB Press', sets: '3×8', cue: 'Each rep clean' },
          ],
        },
        {
          key: 'accessories',
          defaultRest: '60s',
          exercises: [
            { name: 'Face Pull Variations', sets: '2×12', cue: 'External rotate' },
            { name: 'No-Money + ER Combo', sets: '2×12', cue: 'Elbows pinned' },
            { name: 'Prone Lower Trap Raise', sets: '2×8', cue: 'Thumbs up' },
          ],
        },
        {
          key: 'core',
          defaultRest: '45-60s',
          exercises: [
            { name: 'Hanging Knee Raise', sets: '2×8', cue: 'No swing' },
            { name: 'Stability Ball Pike', sets: '2×8', cue: 'Roll in tight' },
          ],
        },
        {
          key: 'finisher',
          defaultRest: '60s',
          exercises: [
            { name: 'Bike Tempo', sets: '1×5min', cue: 'Moderate effort' },
          ],
        },
      ],
    },

    /* ── DAY 5 — LOWER B ── */
    {
      key: 'lower-b',
      dayNumber: 5,
      label: 'Lower B — Strength + Landing + Hip Control',
      accent: '#eab308',
      focus: 'Strength + Landing + Hip Control',
      blocks: [
        {
          key: 'prep',
          exercises: [
            { name: 'Foam Roll Quads & IT Band', sets: '2 min', cue: 'Roll from hip to just above knee, 30 sec per area' },
            { name: 'Lacrosse Ball — Glutes', sets: '90s/side', cue: 'Sit on ball, find trigger point, breathe through it' },
            { name: 'Cossack Mobility', sets: '2×6/side', cue: 'Full depth' },
            { name: 'Hip Flexor Stretch', sets: '2×30s/side', cue: 'Tall posture' },
            { name: 'Pelvis Hinge → Rotate', sets: '2×5', cue: 'Sequence it' },
            { name: 'Dribbles', sets: '2×20yd', cue: 'Mid-height' },
          ],
        },
        {
          key: 'plyo',
          defaultRest: '60-90s',
          exercises: [
            { name: 'Broad Jump (CNS Primer)', sets: '2×3', cue: 'Triple extension, arm drive — controlled landings' },
            { name: 'Broad Jump controlled', sets: '3×3', cue: 'Stick the landing' },
            { name: 'Skier Hops', sets: '2×8/side', cue: 'Quick but clean' },
            { name: 'Depth Drop low box', sets: '2×3', cue: 'Stick it' },
          ],
        },
        {
          key: 'loaded-power',
          defaultRest: '90s',
          exercises: [
            { name: 'Landmine Skater Press', sets: '3×4/side', cue: 'Lateral drive' },
          ],
        },
        {
          key: 'main-lift',
          defaultRest: '2-3 min',
          exercises: [
            { name: 'Trap Bar Deadlift 3s eccentric', sets: '3×5', cue: 'Slow down phase' },
            { name: 'Anti-Rotation ISO split stance', sets: '3×15-20s/side', cue: 'Resist rotation' },
          ],
        },
        {
          key: 'secondary',
          defaultRest: '90s-2 min',
          exercises: [
            { name: 'Step-Up w/ Knee Drive controlled', sets: '3×6/side', cue: 'Drive high' },
            { name: 'Single-Leg RDL slow', sets: '3×6/side', cue: 'Hinge with tempo' },
          ],
        },
        {
          key: 'accessories',
          defaultRest: '60s',
          exercises: [
            { name: 'Glute Bridge ISO top', sets: '2×20-25s', cue: 'Squeeze glutes' },
            { name: 'Adductor Side Plank', sets: '2×15-20s/side', cue: 'Stack and hold' },
            { name: 'Tibialis KB Raise', sets: '2×12', cue: 'Full range' },
          ],
        },
        {
          key: 'core',
          defaultRest: '45-60s',
          exercises: [
            { name: 'Farmer Carry', sets: '2×30yd', cue: 'Heavy and tall' },
            { name: 'Weighted Plank', sets: '2×20s', cue: 'Plate on back' },
          ],
        },
        {
          key: 'finisher',
          defaultRest: '60s',
          exercises: [
            { name: 'Row or Jog/Walk', sets: '1×5min', cue: 'Easy-moderate' },
          ],
        },
      ],
    },
  ],
};

export default month2;
