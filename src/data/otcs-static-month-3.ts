import type { OtcsMonthTemplate } from './otcs-types';

const month: OtcsMonthTemplate = {
  monthNumber: 3,
  phase: 'power-build',
  title: 'Power Build',
  subtitle: 'Strength to Power Conversion + Explosive Sprints + Rotational Velocity',
  color: '#8b5cf6',
  icon: 'flash-outline',
  volumeLevel: 'high',
  intensityLevel: 'high',
  keyFocus: ['Power Development', 'Olympic Lifts', 'Rotational Velocity', 'Sprint Mechanics', 'Reactive Strength'],
  archetype: 'static',
  days: [
    {
      key: 'lower-accel',
      dayNumber: 1,
      label: 'Lower + Accel',
      accent: '#22c55e',
      focus: 'Lower Power + Olympic Lifts',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'Depth Jump', sets: '3×3', cue: 'Step off the box — explode up immediately on landing' },
            { name: 'Broad Jump to Sprint', sets: '2×3', cue: 'Jump forward then accelerate — no pause between' },
            { name: 'Hurdle Hops', sets: '3×5', cue: 'Clear each hurdle — quick off the ground, knees up' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'Hang Clean', sets: '3×3', cue: 'Violent hip extension — catch it fast in a quarter squat', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'Back Squat', sets: '3×5', cue: 'Brace hard — drive through the floor with intent', scalesWithWeek: true },
            { name: 'Split Squat Jump', sets: '3×4/side', cue: 'Explode and switch — land soft and reload' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'RDL', sets: '3×5', cue: 'Load the hamstrings — hinge deep and drive the hips', scalesWithWeek: true },
            { name: 'Bulgarian Split Squat', sets: '3×6/side', cue: 'Rear foot elevated — sit deep and drive up' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Leg Press', sets: '2×10', cue: 'Full range — controlled descent, powerful push' },
            { name: 'Nordic Curl', sets: '2×5', cue: 'Lower as slow as possible — fight gravity the whole way' },
            { name: 'Banded Monster Walk', sets: '2×15', cue: 'Stay low — push the knees out with every step' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Med Ball Rotational Throw', sets: '3×5/side', cue: 'Rotate from the hips — slam with max intent' },
            { name: 'Landmine Rotation', sets: '2×8/side', cue: 'Pivot the feet — drive the rotation from the hips' },
          ],
        },
        {
          key: 'shoulder-durability',
          exercises: [
            { name: 'Band Pull-Aparts', sets: '2×15', cue: 'Squeeze the shoulder blades — hold the end range' },
            { name: 'Side-Lying ER', sets: '2×10/side', cue: 'Elbow pinned to the side — slow rotation out' },
          ],
        },
      ],
    },
    {
      key: 'upper-shoulder',
      dayNumber: 2,
      label: 'Upper + Shoulder',
      accent: '#3b82f6',
      focus: 'Upper Power + Pressing Strength',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'Plyo Push-Up (clap)', sets: '3×5', cue: 'Explode off the ground — clap and land soft' },
            { name: 'MB Slam', sets: '2×6', cue: 'Full extension — slam the ball with everything you have' },
            { name: 'MB Chest Pass to Wall', sets: '3×6', cue: 'Punch through the ball — catch and reload fast' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'Push Press', sets: '3×3', cue: 'Dip and drive — launch the bar with leg power', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'Barbell Bench Press', sets: '3×5', cue: 'Arch and drive — control down, explode up', scalesWithWeek: true },
            { name: 'Weighted Pull-Up', sets: '3×5', cue: 'Full range — dead hang to chin over bar' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'DB Incline Press', sets: '3×8', cue: 'Control the angle — full depth at the bottom' },
            { name: 'Bent-Over Row', sets: '3×8', cue: 'Flat back — pull the bar to the belly button' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Cable ER at 90°', sets: '2×12/side', cue: 'Elbow at shoulder height — rotate out with control' },
            { name: 'Prone Y Raise', sets: '2×10', cue: 'Thumbs up — lift from the lower traps, light weight' },
            { name: 'Lat Pulldown', sets: '2×10', cue: 'Pull to the chest — squeeze the lats at the bottom' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Cable Woodchop', sets: '2×8/side', cue: 'Drive the chop diagonally — rotate through the torso' },
            { name: 'V-Ups', sets: '2×12', cue: 'Touch the toes — control the descent back down' },
          ],
        },
        {
          key: 'shoulder-durability',
          exercises: [
            { name: 'Cuban Rotation', sets: '2×8', cue: 'Upright row to external rotation to press — smooth and controlled' },
            { name: 'KB Bottoms-Up Press', sets: '2×6/side', cue: 'Grip hard — press with control, keep the bell inverted' },
          ],
        },
      ],
    },
    {
      key: 'full-power',
      dayNumber: 3,
      label: 'Full Body Power',
      accent: '#ef4444',
      focus: 'Full Body Explosive Power',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'Box Jump (max height)', sets: '3×3', cue: 'Max effort — swing the arms and explode to the tallest box' },
            { name: 'Lateral Bound', sets: '3×4/side', cue: 'Push off hard — stick each landing for 2 seconds' },
            { name: 'Tuck Jump', sets: '2×5', cue: 'Knees to chest — quick off the ground, max height' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'DB Snatch', sets: '3×3/side', cue: 'One explosive pull — catch it overhead with a locked arm', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'Trap Bar DL (speed)', sets: '3×5', cue: 'Fast off the floor — move the bar with max velocity', scalesWithWeek: true },
            { name: 'Front Squat', sets: '3×4', cue: 'Elbows high — sit between the hips and drive up' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'Glute-Ham Raise', sets: '3×6', cue: 'Control the eccentric — drive the hips into the pad to return' },
            { name: 'Reverse Lunge', sets: '3×6/side', cue: 'Step back — drive through the front foot to stand' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Leg Curl', sets: '2×12', cue: 'Control the eccentric — squeeze at the top' },
            { name: 'Hip Thrust', sets: '3×8', cue: 'Drive through the heels — squeeze the glutes at the top' },
            { name: 'Calf Raise', sets: '2×15', cue: 'Full range — pause at the top and the bottom' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Overhead Carry', sets: '2×30yd', cue: 'Lock the arms overhead — ribs down, core braced' },
            { name: 'Pallof Press Walk', sets: '2×15yd/side', cue: 'Press and walk — resist rotation with every step' },
          ],
        },
        {
          key: 'shoulder-durability',
          exercises: [
            { name: 'Prone Lower Trap Raise', sets: '2×10', cue: 'Thumbs up — lift from the lower trap, not the upper' },
            { name: 'Band W Raises', sets: '2×12', cue: 'Elbows at 90° — squeeze the shoulder blades together' },
          ],
        },
      ],
    },
    {
      key: 'sprint-1',
      dayNumber: 4,
      label: 'Sprint Day 1',
      accent: '#f59e0b',
      focus: 'Max Acceleration + Resisted Speed',
      type: 'sprint',
      blocks: [
        {
          key: 'sprint-warmup',
          exercises: [
            { name: 'A-Skip', sets: '2×20yd', cue: 'Drive the knee — quick ground contact' },
            { name: 'Straight-Leg Bound', sets: '2×20yd', cue: 'Stiff legs — pull the ground under you' },
            { name: 'High Knees', sets: '2×20yd', cue: 'Fast turnover — stay on the balls of the feet' },
          ],
        },
        {
          key: 'sprint-drills',
          exercises: [
            { name: '3-Point Start', sets: '3×3', cue: 'Hand down — explode out low and drive for 10 yards' },
            { name: 'Sled March to Sprint', sets: '3×2', cue: 'March 5 yards then release into a sprint' },
            { name: 'Wall Drive Hold', sets: '3×10s', cue: 'Lean into the wall — hold the drive position, knee high' },
          ],
        },
        {
          key: 'sprint-work',
          exercises: [
            { name: '10yd Fly Sprint', sets: '4×1', cue: 'Build up then hit max speed through 10 yards' },
            { name: 'Sled Sprint', sets: '4×20yd', cue: 'Light sled — maintain sprint mechanics under load' },
            { name: '30yd Build-Up', sets: '3×30yd', cue: 'Gradual acceleration — reach top speed by the end' },
          ],
        },
        {
          key: 'sprint-cooldown',
          exercises: [
            { name: 'Walking Lunge Stretch', sets: '2×10/side', cue: 'Long step — sink the hip and reach overhead' },
            { name: 'Foam Roll', sets: '3min', cue: 'Hit quads, hamstrings, and calves — slow passes' },
            { name: '90/90 Breathing', sets: '2×60s', cue: 'Feet on the wall — inhale through the nose, exhale fully' },
          ],
        },
      ],
    },
    {
      key: 'sprint-2',
      dayNumber: 5,
      label: 'Sprint Day 2',
      accent: '#8b5cf6',
      focus: 'Top Speed Development + Fly Sprints',
      type: 'sprint',
      blocks: [
        {
          key: 'sprint-warmup',
          exercises: [
            { name: 'Carioca', sets: '2×20yd', cue: 'Rotate the hips — stay light on the feet' },
            { name: 'A-Run', sets: '2×20yd', cue: 'Continuous A-skip rhythm — drive and cycle the leg' },
            { name: 'Build-Up Stride', sets: '2×40yd', cue: 'Start easy — build to 85% by the end' },
          ],
        },
        {
          key: 'sprint-drills',
          exercises: [
            { name: 'Wicket Run', sets: '3×30yd', cue: 'Clear each wicket — high knees, quick turnover' },
            { name: 'Flying 10yd Sprint', sets: '3×1', cue: 'Build up then hit max speed for 10 yards' },
          ],
        },
        {
          key: 'sprint-work',
          exercises: [
            { name: 'Flying 20yd', sets: '4×1', cue: 'Build up then maintain top speed for 20 yards' },
            { name: '40yd Build-Up Sprint', sets: '3×1', cue: 'Progressive acceleration — hit top speed by 30 yards' },
            { name: 'Curved Sprint', sets: '3×1', cue: 'Sprint the curve — lean into the turn and maintain speed' },
          ],
        },
        {
          key: 'sprint-cooldown',
          exercises: [
            { name: 'Hip Flexor Stretch', sets: '2×30s/side', cue: 'Squeeze the glute — push the hip forward' },
            { name: 'Hamstring Stretch', sets: '2×30s/side', cue: 'Straight leg — hinge at the hip and reach' },
            { name: 'Deep Breathing', sets: '2×60s', cue: 'Inhale 4 counts, exhale 6 — full recovery' },
          ],
        },
      ],
    },
  ],
};

export default month;
