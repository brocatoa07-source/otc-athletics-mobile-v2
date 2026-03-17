import type { OtcsMonthTemplate } from './otcs-types';

const month: OtcsMonthTemplate = {
  monthNumber: 2,
  archetype: 'hybrid',
  phase: 'strength-dev',
  title: 'Strength Development',
  subtitle: 'Balanced Strength Building + Acceleration + Push/Pull Development',
  color: '#3b82f6',
  icon: 'barbell-outline',
  volumeLevel: 'high',
  intensityLevel: 'moderate',
  keyFocus: ['Balanced Strength', 'Acceleration', 'Push/Pull Ratio', 'Hip Strength', 'Sprint Power'],
  days: [
    {
      key: 'lower-accel',
      dayNumber: 1,
      label: 'Lower + Accel',
      accent: '#22c55e',
      focus: 'Lower Strength + Acceleration Power',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'Box Jump', sets: '2×4', cue: 'Swing and explode — land soft on the box with quiet feet' },
            { name: 'SL Drop to Jump', sets: '2×4/leg', cue: 'Drop off one leg — absorb and explode up' },
            { name: 'Lateral Bound', sets: '2×4/side', cue: 'Push off hard — cover ground and stick the landing' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'Trap Bar Jump', sets: '3×4', cue: 'Explode through the floor — full extension at the top', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'Back Squat (2s Pause)', sets: '3×6', cue: 'Sink deep and hold 2s — drive hard out of the hole', scalesWithWeek: true },
            { name: 'Walking Lunge', sets: '3×8/side', cue: 'Long stride — control every step and drive through the front foot' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'RDL', sets: '3×6', cue: 'Hinge at the hips — load the hamstrings on the way down', scalesWithWeek: true },
            { name: 'Lateral Step-Up', sets: '3×6/side', cue: 'Drive through the top foot — stand tall at the top' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Nordic Curl Eccentric', sets: '2×5', cue: 'Control the descent — fight gravity as long as possible' },
            { name: 'Banded Lateral Walk', sets: '2×12/side', cue: 'Stay low — push the knees out against the band' },
            { name: 'Calf Raises', sets: '3×12', cue: 'Full range — pause at the top and stretch at the bottom' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Pallof Press + Rotate', sets: '2×8/side', cue: 'Press out then rotate — resist and control the cable' },
            { name: 'Bird Dog Hold', sets: '2×20s/side', cue: 'Opposite arm and leg — lock the hips and hold steady' },
          ],
        },
        {
          key: 'shoulder-durability',
          exercises: [
            { name: 'Band Pull-Aparts', sets: '2×15', cue: 'Squeeze the shoulder blades — hold the end range' },
            { name: 'Side-Lying ER', sets: '2×10/side', cue: 'Elbow pinned — slow rotation out, control the weight' },
          ],
        },
      ],
    },
    {
      key: 'upper-shoulder',
      dayNumber: 2,
      label: 'Upper + Shoulder',
      accent: '#3b82f6',
      focus: 'Upper Strength + Balanced Push/Pull',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'Supine Plyo Chest Toss', sets: '3×6', cue: 'Catch and immediately throw — reactive chest power' },
            { name: 'Plyo Push-Up', sets: '3×5', cue: 'Explode off the ground — land soft and absorb' },
            { name: 'MB Overhead Throw', sets: '2×5', cue: 'Full hip extension — launch the ball overhead with force' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'DB Push Press', sets: '3×4', cue: 'Dip and drive — full extension at the top', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'DB Bench Press', sets: '3×6', cue: 'Control the descent — press up with power', scalesWithWeek: true },
            { name: 'Chest-Supported Row', sets: '3×8', cue: 'Pull to the hip — squeeze the shoulder blade back hard' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'Incline DB Press', sets: '3×8', cue: 'Slight incline — press up and together at the top' },
            { name: 'Seated Cable Row', sets: '3×8', cue: 'Sit tall — pull the handles to the ribcage and squeeze' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Prone Y Raise', sets: '2×10', cue: 'Thumbs up — lift from the lower traps, light weight' },
            { name: 'Cable Face Pull', sets: '2×12', cue: 'Pull to the forehead — externally rotate at the end' },
            { name: 'Banded ER', sets: '2×12/side', cue: 'Elbow pinned — rotate out against the band' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Half-Kneeling Cable Chop', sets: '2×8/side', cue: 'Rotate from the hips — chop across the body with control' },
            { name: 'Hanging Knee Raise', sets: '2×10', cue: 'Curl the knees up — control the swing' },
          ],
        },
        {
          key: 'shoulder-durability',
          exercises: [
            { name: 'KB Bottoms-Up Hold', sets: '2×20s/side', cue: 'Grip hard — keep the KB balanced and shoulder packed' },
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
      focus: 'Full Body Development + Power Introduction',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'Broad Jump', sets: '3×3', cue: 'Swing and explode — max distance and stick the landing' },
            { name: 'Depth Drop', sets: '2×3', cue: 'Step off and absorb — freeze on landing, quiet feet' },
            { name: 'Heiden Stick', sets: '2×3/side', cue: 'Bound laterally — absorb on one leg and freeze' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'Hang Clean (from blocks)', sets: '3×3', cue: 'Pull from the hang — catch with elbows high and hips low', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'Front Squat', sets: '3×5', cue: 'Elbows high — sit between the hips and drive up tall', scalesWithWeek: true },
            { name: 'Anti-Rotation Press', sets: '3×10/side', cue: 'Arms extended — resist the pull, lock the hips square' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'Barbell RDL', sets: '3×6', cue: 'Hinge at the hips — load the hamstrings on the way down' },
            { name: 'Step-Up w/ Knee Drive', sets: '3×6/side', cue: 'Drive through the front foot — knee punch at the top' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Leg Curl', sets: '2×12', cue: 'Control the movement — squeeze at the top' },
            { name: 'Glute Bridge March', sets: '2×10/side', cue: 'Hips up — march without dropping the pelvis' },
            { name: 'Copenhagen', sets: '2×10/side', cue: 'Top leg supports — keep the hips stacked and lifted' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Weighted Carry', sets: '2×30yd', cue: 'Tall posture — grip hard and walk with purpose' },
            { name: 'Cable Rotation', sets: '2×8/side', cue: 'Rotate from the hips — arms stay extended throughout' },
          ],
        },
        {
          key: 'shoulder-durability',
          exercises: [
            { name: 'Cuban Rotation', sets: '2×8', cue: 'Upright row to ER — smooth transition, light weight' },
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
      focus: 'Acceleration + Sled Introduction',
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
            { name: 'Sled March', sets: '3×10yd', cue: 'Drive into the sled — full extension each step' },
            { name: 'Falling Start', sets: '3×2', cue: 'Lean until you fall — explode into the first step' },
          ],
        },
        {
          key: 'sprint-work',
          exercises: [
            { name: '10yd Sprint', sets: '4×10yd', cue: 'Low start — push the ground back and build speed' },
            { name: 'Sled Sprint (light)', sets: '3×15yd', cue: 'Drive against the resistance — maintain acceleration posture' },
            { name: '20yd Build-Up', sets: '3×20yd', cue: 'Gradual acceleration — reach top speed by the end' },
          ],
        },
        {
          key: 'sprint-cooldown',
          exercises: [
            { name: 'Hip Flexor Stretch', sets: '2×30s/side', cue: 'Squeeze the glute — push the hip forward' },
            { name: 'Quad Stretch', sets: '2×30s/side', cue: 'Pull the heel to the glute — keep the knees together' },
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
      focus: 'Agility + Lateral Development',
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
            { name: 'Pro Agility Walkthrough', sets: '3×1', cue: 'Learn the pattern — low hips on each turn' },
            { name: 'Lateral Bound to Sprint', sets: '3×3/side', cue: 'Bound laterally then accelerate forward — smooth transition' },
          ],
        },
        {
          key: 'sprint-work',
          exercises: [
            { name: 'Pro Agility (5-10-5)', sets: '4×1', cue: 'Explode out of each turn — low hips at every cone' },
            { name: 'T-Drill', sets: '3×1', cue: 'Sprint, shuffle, backpedal — stay low through every transition' },
            { name: 'Reactive Lateral Start', sets: '3×2/side', cue: 'React to the cue — explode laterally and accelerate' },
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
