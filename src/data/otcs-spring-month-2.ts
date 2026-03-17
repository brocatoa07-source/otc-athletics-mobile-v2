import type { OtcsMonthTemplate } from './otcs-types';

const month: OtcsMonthTemplate = {
  monthNumber: 2,
  archetype: 'spring',
  phase: 'strength-dev',
  title: 'Strength Development',
  subtitle: 'Raw Strength Building + Structural Integrity + Force Absorption',
  color: '#3b82f6',
  icon: 'barbell-outline',
  volumeLevel: 'high',
  intensityLevel: 'moderate',
  keyFocus: ['Raw Strength', 'Eccentric Overload', 'Force Absorption', 'Structural Integrity', 'Controlled Power'],
  days: [
    {
      key: 'lower-accel',
      dayNumber: 1,
      label: 'Lower + Accel',
      accent: '#22c55e',
      focus: 'Lower Strength + Eccentric Overload',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'Drop Landing (Heavier)', sets: '3×3', cue: 'Step off a higher box — absorb deeply and freeze on landing' },
            { name: 'SL Hop to Stick', sets: '2×4/side', cue: 'Hop forward — stick the single-leg landing and hold 2s' },
            { name: 'Box Jump (Controlled)', sets: '2×3', cue: 'Explode up — land soft on top of the box and stand tall' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'Trap Bar Jump (Heavier)', sets: '3×3', cue: 'Heavier load — explode up and absorb the landing', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'Back Squat (3s Pause)', sets: '3×6', cue: 'Descend and hold 3s in the hole — drive out of the pause', scalesWithWeek: true },
            { name: 'Bulgarian Split Squat', sets: '3×6/side', cue: 'Rear foot elevated — sink deep and drive through the front heel' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'Eccentric RDL (4s)', sets: '3×6', cue: 'Slow 4-count descent — load the hamstrings on every rep', scalesWithWeek: true },
            { name: 'Walking Lunge', sets: '3×8/side', cue: 'Long stride — control each step and push through the front foot' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Nordic Curl', sets: '2×5', cue: 'Lower yourself as slow as possible — fight gravity the whole way' },
            { name: 'Banded Lateral Walk', sets: '2×12/side', cue: 'Stay low — push against the band with each step' },
            { name: 'Calf Raise (3s Eccentric)', sets: '3×10', cue: 'Rise up fast — lower for a 3-count on every rep' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Pallof Press + Rotate', sets: '2×8/side', cue: 'Press out then rotate — resist the band pulling you back' },
            { name: 'Bird Dog Hold', sets: '2×20s/side', cue: 'Opposite arm and leg extended — hold steady, no wobble' },
          ],
        },
        {
          key: 'shoulder-durability',
          exercises: [
            { name: 'Band Pull-Aparts', sets: '2×15', cue: 'Squeeze the shoulder blades — hold the end range' },
            { name: 'Prone ER', sets: '2×10/side', cue: 'Face down on bench — rotate the arm up with control' },
          ],
        },
      ],
    },
    {
      key: 'upper-shoulder',
      dayNumber: 2,
      label: 'Upper + Shoulder',
      accent: '#3b82f6',
      focus: 'Upper Strength + Time Under Tension',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'MB Chest Pass', sets: '3×5', cue: 'Punch through the ball — snap the arms forward with intent' },
            { name: 'Depth Drop Push-Up', sets: '2×4', cue: 'Hands off the risers — catch yourself and explode back up' },
            { name: 'MB Overhead Throw', sets: '2×5', cue: 'Full extension — launch the ball behind you with the hips' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'DB Push Press', sets: '3×4', cue: 'Dip and drive — use the legs to launch the weight overhead', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'DB Bench (3s Eccentric)', sets: '3×6', cue: 'Slow 3-count lowering — pause at the chest then press', scalesWithWeek: true },
            { name: 'Chest-Supported Row (Heavy)', sets: '3×8', cue: 'Pull heavy to the hip — squeeze the shoulder blade hard' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'Incline DB Press', sets: '3×8', cue: 'Control the descent — press through full range at an incline' },
            { name: 'Seated Cable Row', sets: '3×8', cue: 'Sit tall — pull to the belly and squeeze the back' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Prone Y Raise', sets: '2×10', cue: 'Thumbs up — lift from the lower trap, light weight' },
            { name: 'Cable Face Pull', sets: '2×12', cue: 'Pull to the forehead — externally rotate at the end' },
            { name: 'Banded ER', sets: '2×12/side', cue: 'Elbow at 90° — rotate out against the band' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Half-Kneeling Cable Chop', sets: '2×8/side', cue: 'Drive from the hip — chop diagonally with control' },
            { name: 'Hanging Knee Raise', sets: '2×10', cue: 'Curl the knees to the chest — no swinging' },
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
      focus: 'Full Body Strength + Control',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'Depth Drop (Stick)', sets: '3×3', cue: 'Step off and absorb — freeze on landing, no extra movement' },
            { name: 'Broad Jump (Controlled)', sets: '2×3', cue: 'Swing and jump — stick the landing with control' },
            { name: 'Heiden Stick', sets: '2×3/side', cue: 'Bound laterally — absorb on one leg and freeze' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'Hang Clean (From Blocks, Controlled Catch)', sets: '3×3', cue: 'Pull from the blocks — focus on a soft, controlled catch', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'Front Squat (3s Pause)', sets: '3×5', cue: 'Hold 3s in the hole — elbows high, drive out of the pause', scalesWithWeek: true },
            { name: 'Anti-Rotation Press', sets: '3×10/side', cue: 'Arms extended — resist the pull, lock the hips square' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'Barbell RDL', sets: '3×6', cue: 'Hinge deep — feel the hamstrings load on the way down' },
            { name: 'Step-Up (Heavy)', sets: '3×6/side', cue: 'Heavy DBs — drive through the front foot and stand tall' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Leg Curl (Eccentric)', sets: '2×8', cue: 'Curl up fast — lower for a slow 4-count' },
            { name: 'Glute Bridge March', sets: '2×10/side', cue: 'Bridge up — march one knee at a time without dropping hips' },
            { name: 'Copenhagen', sets: '2×10/side', cue: 'Top leg supports — keep the hips stacked and lifted' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Suitcase Carry (Heavy)', sets: '2×30yd', cue: 'Stand tall — resist the lean, heavy load one side' },
            { name: 'Cable Rotation (Controlled)', sets: '2×8/side', cue: 'Rotate from the hips — control the cable on the way back' },
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
      focus: 'Controlled Acceleration + Sled Work',
      type: 'sprint',
      blocks: [
        {
          key: 'sprint-warmup',
          exercises: [
            { name: 'A-Skip', sets: '2×20yd', cue: 'Drive the knee — quick ground contact' },
            { name: 'High Knees', sets: '2×20yd', cue: 'Fast turnover — stay on the balls of the feet' },
            { name: 'Straight-Leg Bound', sets: '2×20yd', cue: 'Stiff legs — pull the ground under you with each stride' },
            { name: 'Butt Kicks', sets: '2×20yd', cue: 'Heels to glutes — quick and rhythmic' },
          ],
        },
        {
          key: 'sprint-drills',
          exercises: [
            { name: 'Sled March', sets: '3×10yd', cue: 'Heavy sled — drive each step with full extension' },
            { name: 'Wall Drive Hold', sets: '3×10s', cue: 'Lean into the wall — hold the drive position, knee at 90°' },
            { name: 'Falling Start to Sprint', sets: '3×2', cue: 'Lean and fall — explode into 3 hard steps' },
          ],
        },
        {
          key: 'sprint-work',
          exercises: [
            { name: '10yd Sprint', sets: '4×10yd', cue: 'Low start — push the ground back and accelerate hard' },
            { name: 'Sled Sprint', sets: '3×15yd', cue: 'Moderate load — drive through the ground with each stride' },
            { name: '20yd Build-Up', sets: '3×20yd', cue: 'Gradual acceleration — reach top speed by the end' },
          ],
        },
        {
          key: 'sprint-cooldown',
          exercises: [
            { name: 'Hip Flexor Stretch', sets: '2×30s/side', cue: 'Squeeze the glute — push the hip forward' },
            { name: 'Quad Stretch', sets: '2×30s/side', cue: 'Pull the heel to glute — keep the knees together' },
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
      focus: 'Lateral Strength + Deceleration',
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
            { name: 'Deceleration Drill', sets: '3×20yd', cue: 'Sprint then brake — chop the feet and stop on a dime' },
          ],
        },
        {
          key: 'sprint-work',
          exercises: [
            { name: 'Pro Agility (5-10-5)', sets: '4×1', cue: 'Explode out of each turn — stay low and drive' },
            { name: 'Lateral Bound Stick', sets: '3×3/side', cue: 'Bound laterally — absorb on one leg and freeze' },
            { name: 'Decel Sprint', sets: '3×20yd', cue: 'Sprint then brake — controlled deceleration' },
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
