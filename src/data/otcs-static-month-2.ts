import type { OtcsMonthTemplate } from './otcs-types';

const month: OtcsMonthTemplate = {
  monthNumber: 2,
  phase: 'strength-dev',
  title: 'Strength Development',
  subtitle: 'Force Output + Squat/Hinge Strength + Acceleration Power',
  color: '#3b82f6',
  icon: 'barbell-outline',
  volumeLevel: 'high',
  intensityLevel: 'moderate',
  keyFocus: ['Squat Strength', 'Hinge Development', 'Eccentric Loading', 'Acceleration Power', 'Upper Body Push/Pull'],
  archetype: 'static',
  days: [
    {
      key: 'lower-accel',
      dayNumber: 1,
      label: 'Lower + Accel',
      accent: '#22c55e',
      focus: 'Lower Strength + Eccentric Loading',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'Box Jump', sets: '2×4', cue: 'Explode up — land soft on the box with full foot' },
            { name: 'SL Drop to Jump', sets: '2×4/leg', cue: 'Step off, absorb, then explode — reactive power' },
            { name: 'Lateral Bound', sets: '2×4/side', cue: 'Push off hard — stick each landing for 2 seconds' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'Trap Bar Jump', sets: '3×4', cue: 'Explode up — reset between reps, max intent', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'Goblet Squat (Eccentric Focus 3s)', sets: '3×6', cue: '3 seconds down — fight for depth and control', scalesWithWeek: true },
            { name: 'Walking Lunge', sets: '3×8/side', cue: 'Long stride — control each step, knee tracks over toe' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'Eccentric RDL (3s down)', sets: '3×6', cue: '3 seconds on the way down — load the hamstrings fully', scalesWithWeek: true },
            { name: 'Lateral Step-Up', sets: '3×6/side', cue: 'Drive through the top leg — stand tall at the top' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Nordic Curl Eccentric', sets: '2×5', cue: 'Lower as slow as possible — fight gravity the whole way' },
            { name: 'Banded Lateral Walk', sets: '2×12/side', cue: 'Stay low — push the knees out against the band' },
            { name: 'Calf Raises', sets: '3×12', cue: 'Full range — pause at the top and the bottom' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Pallof Press + Rotate', sets: '2×8/side', cue: 'Press out then rotate — resist the pull back' },
            { name: 'Bird Dog Hold', sets: '2×20s/side', cue: 'Opposite arm and leg — lock the core and hold' },
          ],
        },
        {
          key: 'shoulder-durability',
          exercises: [
            { name: 'Band Pull-Aparts', sets: '2×15', cue: 'Squeeze the shoulder blades — hold the end range' },
            { name: 'Side-Lying DB ER', sets: '2×10/side', cue: 'Elbow pinned to the side — slow rotation out' },
          ],
        },
      ],
    },
    {
      key: 'upper-shoulder',
      dayNumber: 2,
      label: 'Upper + Shoulder',
      accent: '#3b82f6',
      focus: 'Upper Strength + Scap Control',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'Supine Plyo Chest Toss', sets: '3×6', cue: 'Catch and explode — minimal time with the ball' },
            { name: 'Depth Drop Push-Up', sets: '3×4', cue: 'Drop off the plates — absorb and explode up' },
            { name: 'MB Overhead Throw', sets: '2×5', cue: 'Full hip extension — launch the ball with the whole body' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'DB Push Press', sets: '3×4/side', cue: 'Dip and drive — use the legs to launch the weight', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'DB Bench Press (Eccentric 3s)', sets: '3×6', cue: '3 seconds down — press with full range and control', scalesWithWeek: true },
            { name: 'Chest-Supported Row', sets: '3×8', cue: 'Pull to the hip — squeeze the shoulder blade back' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'Incline DB Press', sets: '3×8', cue: 'Control the angle — full depth at the bottom' },
            { name: 'Seated Cable Row', sets: '3×8', cue: 'Sit tall — pull the handle to the belly button' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Prone Y Raise', sets: '2×10', cue: 'Thumbs up — lift from the lower traps, light weight' },
            { name: 'Cable Face Pull', sets: '2×12', cue: 'Pull to the forehead — externally rotate at the end' },
            { name: 'Banded ER at 90°', sets: '2×12/side', cue: 'Elbow at shoulder height — rotate out against the band' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Half-Kneeling Cable Chop', sets: '2×8/side', cue: 'Drive the chop diagonally — rotate through the torso' },
            { name: 'Hanging Knee Raise', sets: '2×10', cue: 'Curl the pelvis — lift with the abs, not the hip flexors' },
          ],
        },
        {
          key: 'shoulder-durability',
          exercises: [
            { name: 'Bottoms-Up KB Hold', sets: '2×20s/side', cue: 'Grip hard — keep the wrist straight and shoulder packed' },
            { name: 'Prone Lower Trap Raise', sets: '2×10', cue: 'Thumbs up — lift from the lower trap, not the upper' },
          ],
        },
      ],
    },
    {
      key: 'full-power',
      dayNumber: 3,
      label: 'Full Body Power',
      accent: '#ef4444',
      focus: 'Full Body Strength + Power Development',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'Broad Jump', sets: '3×4', cue: 'Swing the arms — explode forward and stick the landing' },
            { name: 'Depth Drop', sets: '2×4', cue: 'Step off the box — absorb and freeze on landing' },
            { name: 'Heiden to Stick', sets: '2×4/side', cue: 'Bound laterally — absorb on one leg and freeze' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'Hang Power Clean (from blocks)', sets: '3×3', cue: 'Pull from the blocks — catch it fast and stand it up', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'Front Squat', sets: '3×5', cue: 'Elbows high — sit between the hips and drive up', scalesWithWeek: true },
            { name: 'Anti-Rotation Press', sets: '3×10/side', cue: 'Press out — resist the rotation, lock the hips' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'Barbell RDL', sets: '3×6', cue: 'Hinge deep — feel the hamstrings load on the way down' },
            { name: 'Step-Up w/ Knee Drive', sets: '3×6/side', cue: 'Drive the knee high — stand tall at the top' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Leg Curl', sets: '2×12', cue: 'Control the eccentric — squeeze at the top' },
            { name: 'Glute Bridge March', sets: '2×10/side', cue: 'Hold the bridge — alternate lifting each leg' },
            { name: 'Copenhagen Adductor', sets: '2×10/side', cue: 'Top leg on the bench — lift and lower with control' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Weighted Carry', sets: '2×30yd', cue: 'Tall posture — grip hard and walk with purpose' },
            { name: 'Cable Rotation', sets: '2×8/side', cue: 'Rotate from the hips — arms stay extended' },
          ],
        },
        {
          key: 'shoulder-durability',
          exercises: [
            { name: 'Cuban Rotation', sets: '2×8', cue: 'Upright row to external rotation to press — smooth and controlled' },
            { name: 'KB Arm Bar', sets: '2×30s/side', cue: 'Shoulder packed — open through the chest and hold' },
          ],
        },
      ],
    },
    {
      key: 'sprint-1',
      dayNumber: 4,
      label: 'Sprint Day 1',
      accent: '#f59e0b',
      focus: 'Acceleration + Resisted Sprints',
      type: 'sprint',
      blocks: [
        {
          key: 'sprint-warmup',
          exercises: [
            { name: 'A-Skip', sets: '2×20yd', cue: 'Drive the knee — quick ground contact' },
            { name: 'High Knees', sets: '2×20yd', cue: 'Fast turnover — stay on the balls of the feet' },
            { name: 'Straight-Leg Bound', sets: '2×20yd', cue: 'Stiff legs — pull the ground under you' },
            { name: 'Butt Kicks', sets: '2×20yd', cue: 'Heels to glutes — quick and rhythmic' },
          ],
        },
        {
          key: 'sprint-drills',
          exercises: [
            { name: 'Wall Drive March', sets: '3×8/side', cue: 'Knee to chest — hold the lean and drive' },
            { name: 'Sled March', sets: '3×10yd', cue: 'Heavy sled — drive each step with full extension' },
            { name: 'Falling Start to Sprint', sets: '3×2', cue: 'Lean and go — explode into the first 3 steps' },
          ],
        },
        {
          key: 'sprint-work',
          exercises: [
            { name: '10yd Sprint', sets: '4×10yd', cue: 'Explosive start — low drive phase for 10 yards' },
            { name: 'Sled Sprint', sets: '3×15yd', cue: 'Light sled — maintain sprint mechanics under load' },
            { name: '20yd Build-Up', sets: '3×20yd', cue: 'Gradual acceleration — reach top speed by the end' },
          ],
        },
        {
          key: 'sprint-cooldown',
          exercises: [
            { name: 'Hip Flexor Stretch', sets: '2×30s/side', cue: 'Squeeze the glute — push the hip forward' },
            { name: 'Quad Stretch', sets: '2×30s/side', cue: 'Pull the heel to the glute — stand tall' },
            { name: 'Foam Roll', sets: '3min', cue: 'Hit quads, hamstrings, and calves — slow passes' },
          ],
        },
      ],
    },
    {
      key: 'sprint-2',
      dayNumber: 5,
      label: 'Sprint Day 2',
      accent: '#8b5cf6',
      focus: 'Lateral Agility + COD',
      type: 'sprint',
      blocks: [
        {
          key: 'sprint-warmup',
          exercises: [
            { name: 'Carioca', sets: '2×20yd', cue: 'Rotate the hips — stay light on the feet' },
            { name: 'Lateral Shuffle', sets: '2×20yd', cue: 'Low hips — push off the outside foot' },
            { name: 'Crossover Run', sets: '2×20yd', cue: 'Cross over and open — rotate through the hips' },
          ],
        },
        {
          key: 'sprint-drills',
          exercises: [
            { name: 'Pro Agility Setup', sets: '3×walkthrough', cue: 'Learn the pattern — low hips on each turn' },
            { name: 'Lateral Bound to Sprint', sets: '3×3/side', cue: 'Bound laterally then accelerate forward' },
          ],
        },
        {
          key: 'sprint-work',
          exercises: [
            { name: 'Pro Agility (5-10-5)', sets: '4×1', cue: 'Explode out of each turn — stay low and drive' },
            { name: 'T-Drill', sets: '3×1', cue: 'Sprint, shuffle, backpedal — quick feet at each cone' },
            { name: 'Reactive Lateral Start', sets: '3×2/side', cue: 'React to the cue — push off hard and accelerate' },
          ],
        },
        {
          key: 'sprint-cooldown',
          exercises: [
            { name: 'Pigeon Stretch', sets: '2×30s/side', cue: 'Sink into the hip — relax and breathe' },
            { name: '90/90 Hip Flow', sets: '2×6', cue: 'Transition smoothly — open each hip fully' },
            { name: 'Deep Breathing', sets: '2×60s', cue: 'Inhale 4 counts, exhale 6 — full recovery' },
          ],
        },
      ],
    },
  ],
};

export default month;
