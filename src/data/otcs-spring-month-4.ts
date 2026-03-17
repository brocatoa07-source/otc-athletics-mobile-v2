import type { OtcsMonthTemplate } from './otcs-types';

const month: OtcsMonthTemplate = {
  monthNumber: 4,
  archetype: 'spring',
  phase: 'max-force',
  title: 'Max Force',
  subtitle: 'Peak Strength + Heavy Loading + Eccentric Overload',
  color: '#ef4444',
  icon: 'flame-outline',
  volumeLevel: 'high',
  intensityLevel: 'high',
  keyFocus: [
    'Max Strength',
    'Eccentric Overload',
    'Heavy Loading',
    'Force Absorption',
    'Structural Integrity',
  ],
  days: [
    {
      key: 'lower-accel',
      dayNumber: 1,
      label: 'Lower + Accel',
      accent: '#22c55e',
      focus: 'Lower Max Strength + Eccentric Overload',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'Depth Drop (absorb)', sets: '3×3', cue: 'Stick the landing, absorb through hips' },
            { name: 'Box Jump (controlled)', sets: '2×3', cue: 'Controlled takeoff, soft landing' },
            { name: 'SL Lateral Bound Stick', sets: '2×3/side', cue: 'Stick each landing for 2 seconds' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'Hang Clean (heavy, controlled catch)', sets: '3×3', cue: 'Absorb the catch, control the rack position', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'Back Squat (heavy, 2s pause)', sets: '3×4', cue: 'Pause at depth, drive through the floor', scalesWithWeek: true },
            { name: 'Box Jump', sets: '2×3', cue: 'Contrast — explode immediately after squats' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'Heavy RDL (eccentric focus)', sets: '3×5', cue: '3s eccentric, push hips back', scalesWithWeek: true },
            { name: 'Walking Lunge (heavy)', sets: '3×6/side', cue: 'Long stride, control the decel' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Leg Press (heavy)', sets: '3×8', cue: 'Full ROM, control the negative' },
            { name: 'Nordic Curl', sets: '2×6', cue: 'Fight the eccentric as long as possible' },
            { name: 'Hip Thrust (heavy)', sets: '3×8', cue: 'Squeeze glutes hard at top' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Med Ball Rotational Shot Put', sets: '3×5/side', cue: 'Drive from back hip, full rotation' },
            { name: 'Anti-Rotation Hold (heavy)', sets: '2×20s/side', cue: 'Lock ribs down, resist rotation' },
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
      focus: 'Upper Max Strength + Structural Control',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'MB Chest Pass (heavy ball)', sets: '3×5', cue: 'Punch through the ball with full extension' },
            { name: 'Depth Drop Push-Up', sets: '2×4', cue: 'Absorb and explode off the ground' },
            { name: 'MB Slam (heavy)', sets: '2×5', cue: 'Full extension, slam hard' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'Push Jerk (controlled catch)', sets: '3×3', cue: 'Dip and drive, absorb the catch overhead', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'Barbell Bench (heavy, 2s pause)', sets: '3×4', cue: 'Pause on chest, explode up', scalesWithWeek: true },
            { name: 'Plyo Push-Up', sets: '2×4', cue: 'Contrast — max height each rep' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'Weighted Chin-Up', sets: '3×5', cue: 'Full stretch at bottom, pull to chest' },
            { name: 'Incline DB Press (heavy)', sets: '3×6', cue: 'Deep stretch at bottom, control the weight' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Cable ER', sets: '2×12/side', cue: 'Elbow stays at shoulder height' },
            { name: 'Lat Pulldown (heavy)', sets: '2×8', cue: 'Pull to upper chest, squeeze lats' },
            { name: 'Cable Face Pull', sets: '2×12', cue: 'Pull to forehead, externally rotate' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Cable Woodchop (heavy)', sets: '2×6/side', cue: 'Power from hips, not arms' },
            { name: 'Hanging Leg Raise', sets: '2×10', cue: 'Control the swing, curl hips up' },
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
      focus: 'Total Body Max Force + Control',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'Depth Drop (absorb and hold)', sets: '3×3', cue: 'Stick landing, hold 2 seconds' },
            { name: 'Broad Jump (stick)', sets: '2×3', cue: 'Max distance, stick the landing' },
            { name: 'Lateral Depth Drop', sets: '2×3/side', cue: 'Absorb and stabilize laterally' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'Power Clean (heavy, controlled catch)', sets: '3×3', cue: 'Fast elbows, absorb in quarter squat', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'Trap Bar DL (heavy)', sets: '3×4', cue: 'Push the floor away, brace hard', scalesWithWeek: true },
            { name: 'Broad Jump', sets: '2×3', cue: 'Contrast — max distance each rep' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'Front Squat (heavy)', sets: '3×5', cue: 'Elbows high, upright torso' },
            { name: 'Glute-Ham Raise', sets: '3×6', cue: 'Control the eccentric fully' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Leg Curl (eccentric)', sets: '2×8', cue: 'Slow 4s negative, squeeze at top' },
            { name: 'Calf Raise (heavy)', sets: '2×12', cue: 'Full ROM, pause at top' },
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
      focus: 'Resisted Speed + Deceleration Training',
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
            { name: 'Decel Sprint', sets: '3×30yd', cue: 'Sprint and brake hard at the mark' },
            { name: '3-Point Start', sets: '3×2', cue: 'Explosive first step, stay low' },
          ],
        },
        {
          key: 'sprint-work',
          exercises: [
            { name: 'Sled Sprint (heavy)', sets: '4×20yd', cue: 'Drive phase mechanics, stay low' },
            { name: 'Decel Sprint', sets: '4×30yd', cue: 'Full sprint, controlled braking' },
            { name: '10yd Fly Sprint', sets: '3×1', cue: 'Max velocity through the zone' },
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
      focus: 'Controlled Max Velocity + Braking',
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
            { name: 'Sprint-Brake-Sprint', sets: '3×40yd', cue: 'Full sprint, brake hard, reaccelerate' },
          ],
        },
        {
          key: 'sprint-work',
          exercises: [
            { name: 'Flying 20yd', sets: '4×1', cue: 'Max speed through the zone' },
            { name: 'Sprint-Brake-Sprint', sets: '3×40yd', cue: 'Controlled decel, explosive restart' },
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
