import type { OtcsMonthTemplate } from './otcs-types';

const month: OtcsMonthTemplate = {
  archetype: 'static',
  monthNumber: 4,
  phase: 'max-force',
  title: 'Max Force',
  subtitle: 'Peak Force Production + Resisted Speed + Rotational Torque',
  color: '#ef4444',
  icon: 'flame-outline',
  volumeLevel: 'high',
  intensityLevel: 'high',
  keyFocus: [
    'Max Strength',
    'Resisted Speed',
    'Rotational Torque',
    'Contrast Training',
    'Reactive Elasticity',
  ],
  days: [
    {
      key: 'lower-accel',
      dayNumber: 1,
      label: 'Lower + Accel',
      accent: '#22c55e',
      focus: 'Lower Max Strength + Contrast Sets',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'Depth Jump to Sprint', sets: '3×3', cue: 'Absorb and explode into sprint' },
            { name: 'Hurdle Hops (reactive)', sets: '3×5', cue: 'Minimize ground contact time' },
            { name: 'Broad Jump', sets: '2×4', cue: 'Full hip extension on takeoff' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'Hang Clean (heavy)', sets: '3×3', cue: 'Violent hip extension', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'Back Squat (heavy)', sets: '3×4', cue: 'Drive through the floor', scalesWithWeek: true },
            { name: 'Box Jump', sets: '3×3', cue: 'Contrast — explode immediately after squats' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'Heavy RDL', sets: '3×5', cue: 'Slow eccentric, push hips back', scalesWithWeek: true },
            { name: 'Walking Lunge', sets: '3×6/side', cue: 'Long stride, upright torso' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Leg Press', sets: '3×8', cue: 'Full ROM, control the negative' },
            { name: 'Nordic Curl', sets: '2×6', cue: 'Fight the eccentric as long as possible' },
            { name: 'Hip Thrust', sets: '3×8', cue: 'Squeeze glutes at top' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Med Ball Rotational Shot Put', sets: '3×5/side', cue: 'Drive from back hip' },
            { name: 'Cable Anti-Rotation Hold', sets: '2×15s/side', cue: 'Lock ribs down, resist rotation' },
          ],
        },
        {
          key: 'shoulder-durability',
          exercises: [
            { name: 'Band Pull-Aparts', sets: '2×15', cue: 'Squeeze shoulder blades together' },
            { name: 'Prone ER', sets: '2×10/side', cue: 'Slow and controlled' },
          ],
        },
      ],
    },
    {
      key: 'upper-shoulder',
      dayNumber: 2,
      label: 'Upper + Shoulder',
      accent: '#3b82f6',
      focus: 'Upper Max Strength + Speed-Strength',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'Plyo Push-Up (reactive)', sets: '3×5', cue: 'Fast hands off the ground' },
            { name: 'MB Overhead Slam', sets: '2×6', cue: 'Full extension, slam hard' },
            { name: 'MB Chest Pass', sets: '3×6', cue: 'Punch through the ball' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'Push Jerk', sets: '3×3', cue: 'Dip and drive aggressively', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'Barbell Bench Press (heavy)', sets: '3×4', cue: 'Control down, explode up', scalesWithWeek: true },
            { name: 'Plyometric Push-Up', sets: '3×4', cue: 'Contrast — max height each rep' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'Weighted Chin-Up', sets: '3×5', cue: 'Full stretch at bottom' },
            { name: 'Incline DB Press', sets: '3×6', cue: 'Deep stretch at bottom' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Cable ER at 90°', sets: '2×12/side', cue: 'Elbow stays at shoulder height' },
            { name: 'Lat Pulldown', sets: '2×10', cue: 'Pull to upper chest, squeeze lats' },
            { name: 'Cable Face Pull', sets: '2×12', cue: 'Pull to forehead, externally rotate' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Cable Woodchop (heavy)', sets: '2×6/side', cue: 'Power from hips, not arms' },
            { name: 'Hanging Leg Raise', sets: '2×10', cue: 'Control the swing' },
          ],
        },
        {
          key: 'shoulder-durability',
          exercises: [
            { name: 'Cuban Rotation', sets: '2×8', cue: 'Light weight, strict form' },
            { name: 'KB Bottoms-Up Hold', sets: '2×20s/side', cue: 'Grip hard, stabilize overhead' },
          ],
        },
      ],
    },
    {
      key: 'full-power',
      dayNumber: 3,
      label: 'Full Body Power',
      accent: '#ef4444',
      focus: 'Total Body Force + Contrast Training',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'Box Jump (max height)', sets: '3×3', cue: 'Full hip extension, stick landing' },
            { name: 'Lateral Depth Jump', sets: '2×3/side', cue: 'Absorb and redirect laterally' },
            { name: 'Tuck Jump', sets: '2×5', cue: 'Knees to chest, fast off ground' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'Power Clean', sets: '3×3', cue: 'Fast elbows, catch in quarter squat', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'Trap Bar DL (heavy)', sets: '3×4', cue: 'Push the floor away', scalesWithWeek: true },
            { name: 'Broad Jump', sets: '3×3', cue: 'Contrast — max distance each rep' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'Front Squat', sets: '3×5', cue: 'Elbows high, upright torso' },
            { name: 'Glute-Ham Raise', sets: '3×6', cue: 'Control the eccentric' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Leg Curl', sets: '2×12', cue: 'Squeeze hamstrings at top' },
            { name: 'Calf Raise', sets: '2×15', cue: 'Full ROM, pause at top' },
            { name: 'Adductor Machine', sets: '2×12', cue: 'Controlled squeeze' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Overhead Carry (heavy)', sets: '2×30yd', cue: 'Ribs down, arms locked out' },
            { name: 'Landmine Rotation (heavy)', sets: '2×6/side', cue: 'Drive rotation from hips' },
          ],
        },
        {
          key: 'shoulder-durability',
          exercises: [
            { name: 'Prone Y Raise', sets: '2×10', cue: 'Thumbs up, squeeze lower traps' },
            { name: 'Band W Raises', sets: '2×12', cue: 'Retract and externally rotate' },
          ],
        },
      ],
    },
    {
      key: 'sprint-1',
      dayNumber: 4,
      label: 'Sprint Day 1',
      accent: '#f59e0b',
      focus: 'Resisted Speed + Heavy Sled',
      type: 'sprint',
      blocks: [
        {
          key: 'sprint-warmup',
          exercises: [
            { name: 'A-Skip', sets: '2×20yd', cue: 'Tall posture, drive knee up' },
            { name: 'Straight-Leg Bound', sets: '2×20yd', cue: 'Stiff ankle, quick ground contact' },
            { name: 'Build-Up Stride', sets: '2×40yd', cue: 'Gradually accelerate to 80%' },
          ],
        },
        {
          key: 'sprint-drills',
          exercises: [
            { name: 'Heavy Sled March', sets: '3×10yd', cue: 'Drive knees, lean into sled' },
            { name: 'Sled Sprint (heavy)', sets: '3×15yd', cue: 'Powerful arm drive, full extension' },
            { name: '3-Point Start', sets: '3×2', cue: 'Explosive first step' },
          ],
        },
        {
          key: 'sprint-work',
          exercises: [
            { name: 'Resisted Sprint (sled)', sets: '4×20yd', cue: 'Drive phase mechanics, stay low' },
            { name: '10yd Fly Sprint', sets: '3×1', cue: 'Max velocity through the zone' },
            { name: '30yd Build-Up', sets: '3×1', cue: 'Smooth acceleration to top speed' },
          ],
        },
        {
          key: 'sprint-cooldown',
          exercises: [
            { name: 'Hip Flexor Stretch', sets: '2×30s/side', cue: 'Squeeze glute, push hips forward' },
            { name: 'Hamstring Stretch', sets: '2×30s/side', cue: 'Straight leg, hinge at hips' },
            { name: 'Foam Roll', sets: '3min', cue: 'Quads, hamstrings, calves' },
          ],
        },
      ],
    },
    {
      key: 'sprint-2',
      dayNumber: 5,
      label: 'Sprint Day 2',
      accent: '#8b5cf6',
      focus: 'Max Velocity + Fly Sprints',
      type: 'sprint',
      blocks: [
        {
          key: 'sprint-warmup',
          exercises: [
            { name: 'A-Run', sets: '2×20yd', cue: 'Continuous cycling, tall posture' },
            { name: 'Carioca', sets: '2×20yd', cue: 'Open hips, stay light on feet' },
            { name: 'Build-Up Stride', sets: '2×50yd', cue: 'Build to 85%, smooth mechanics' },
          ],
        },
        {
          key: 'sprint-drills',
          exercises: [
            { name: 'Wicket Run', sets: '3×30yd', cue: 'High knees, quick ground contact' },
            { name: 'In-Out Sprint', sets: '3×40yd', cue: 'Accelerate and float alternately' },
          ],
        },
        {
          key: 'sprint-work',
          exercises: [
            { name: 'Flying 20yd', sets: '4×1', cue: 'Max speed through the zone' },
            { name: 'Flying 30yd', sets: '3×1', cue: 'Hold top-end speed' },
            { name: '50yd Sprint', sets: '2×1', cue: 'Full effort, maintain form' },
          ],
        },
        {
          key: 'sprint-cooldown',
          exercises: [
            { name: 'Pigeon Stretch', sets: '2×30s/side', cue: 'Relax into the stretch' },
            { name: '90/90 Breathing', sets: '2×60s', cue: 'Inhale through nose, exhale fully' },
            { name: 'Foam Roll', sets: '3min', cue: 'Glutes, hip flexors, calves' },
          ],
        },
      ],
    },
  ],
};

export default month;
