import type { OtcsMonthTemplate } from './otcs-types';

const month: OtcsMonthTemplate = {
  monthNumber: 1,
  archetype: 'spring',
  phase: 'foundation',
  title: 'Foundation',
  subtitle: 'Deceleration Control + Structural Strength + Landing Mechanics',
  color: '#22c55e',
  icon: 'build-outline',
  volumeLevel: 'moderate',
  intensityLevel: 'low',
  keyFocus: ['Deceleration', 'Landing Mechanics', 'Eccentric Strength', 'Structural Control', 'Tissue Prep'],
  days: [
    {
      key: 'lower-accel',
      dayNumber: 1,
      label: 'Lower + Accel',
      accent: '#22c55e',
      focus: 'Lower Deceleration + Eccentric Strength',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'Drop Landing (Stick)', sets: '3×3', cue: 'Step off the box — absorb and freeze on landing, quiet feet' },
            { name: 'SL Hop to Stick', sets: '2×4/side', cue: 'Small hop forward — stick the single-leg landing and hold 2s' },
            { name: 'Lateral Bound Stick', sets: '2×3/side', cue: 'Bound laterally — absorb on one leg and freeze' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'Trap Bar Jump (Controlled Landing)', sets: '3×3', cue: 'Explode up — focus on absorbing the landing softly', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'Goblet Squat (Pause at Bottom 3s)', sets: '3×6', cue: 'Sink deep and hold — own the bottom position before driving up', scalesWithWeek: true },
            { name: 'Split Squat ISO Hold', sets: '3×25s/side', cue: 'Deep split stance — hold the bottom and fight for stability' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'Eccentric RDL (4s Down)', sets: '3×6', cue: 'Slow 4-count descent — feel the hamstrings load every inch', scalesWithWeek: true },
            { name: 'Lateral Lunge (Slow)', sets: '3×5/side', cue: 'Controlled step out — sit deep into the hip and push back' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Eccentric Hamstring Curl', sets: '2×8', cue: 'Control the lowering phase — resist gravity on the way down' },
            { name: 'Suitcase Carry', sets: '2×25yd', cue: 'Stand tall — resist the lean, brace the core hard' },
            { name: 'Tib Raises', sets: '2×12', cue: 'Pull the toe up hard — feel the front of the shin work' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Pallof Press Hold', sets: '2×20s/side', cue: 'Lock the hips — arms out, resist rotation through the core' },
            { name: 'Dead Bug (Slow)', sets: '2×8/side', cue: 'Low back glued to floor — extend slow and controlled' },
          ],
        },
        {
          key: 'shoulder-durability',
          exercises: [
            { name: 'Band Pull-Aparts', sets: '2×15', cue: 'Squeeze the shoulder blades — hold the end range' },
            { name: 'Side-Lying ER (Slow)', sets: '2×10/side', cue: 'Elbow pinned — slow rotation out, control the weight' },
          ],
        },
      ],
    },
    {
      key: 'upper-shoulder',
      dayNumber: 2,
      label: 'Upper + Shoulder',
      accent: '#3b82f6',
      focus: 'Upper Structural Strength + Scap Control',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'MB Chest Pass (Controlled)', sets: '3×5', cue: 'Punch through the ball — snap the arms forward with intent' },
            { name: 'Plyo Push-Up (Land and Hold)', sets: '2×4', cue: 'Explode off the ground — land soft and hold 2s' },
            { name: 'OH MB Slam', sets: '2×5', cue: 'Full extension overhead — slam with intent into the ground' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'Landmine Rotational Press (Tempo)', sets: '3×4/side', cue: 'Drive from the hip — controlled rotation and press', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'DB Bench Press (3s Pause at Chest)', sets: '3×6', cue: 'Lower to chest and hold 3s — dead stop before pressing up', scalesWithWeek: true },
            { name: 'Scap Y ISO Hold', sets: '3×25s', cue: 'Thumbs up, arms extended — squeeze the lower traps and hold' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'Chest-Supported Row (Slow)', sets: '3×8', cue: 'Slow pull to the hip — squeeze the shoulder blade back hard' },
            { name: 'Half-Kneeling Landmine Press', sets: '3×6/side', cue: 'Brace the core — press up and out in an arc' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Incline YTL Raise', sets: '2×8 each', cue: 'Light weight — feel each position through the upper back' },
            { name: 'Face Pulls', sets: '2×12', cue: 'Pull to the forehead — externally rotate at the end' },
            { name: 'Banded No-Money', sets: '2×12', cue: 'Elbows pinned — rotate out against the band' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Landmine Rotation (Controlled)', sets: '2×6/side', cue: 'Pivot the feet — controlled rotation from the hips' },
            { name: 'Anti-Rotation Press', sets: '2×8/side', cue: 'Arms extended — resist the pull, lock the hips square' },
          ],
        },
        {
          key: 'shoulder-durability',
          exercises: [
            { name: 'Prone Lower Trap Raise', sets: '2×8', cue: 'Thumbs up — lift from the lower trap, not the upper' },
            { name: 'KB Arm Bar', sets: '2×30s/side', cue: 'Shoulder packed — open through the chest and hold' },
          ],
        },
      ],
    },
    {
      key: 'full-power',
      dayNumber: 3,
      label: 'Full Body Power',
      accent: '#ef4444',
      focus: 'Full Body Control + Braking Strength',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'Depth Drop (Stick Landing)', sets: '3×3', cue: 'Step off and absorb — freeze on landing, no extra movement' },
            { name: 'Broad Jump (Stick)', sets: '2×3', cue: 'Swing and jump — stick the landing and hold 2s' },
            { name: 'Skier Hops (Controlled)', sets: '2×8', cue: 'Side to side — controlled and rhythmic, minimize wobble' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'DB Push Press (Controlled Descent)', sets: '3×4', cue: 'Dip and drive up — slow the weight back down on the catch', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'Trap Bar DL (3s Eccentric)', sets: '3×5', cue: 'Drive the floor away — 3-count lowering on every rep', scalesWithWeek: true },
            { name: 'Anti-Rotation ISO', sets: '3×20s/side', cue: 'Arms extended — resist the pull, lock the hips square' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'Step-Ups w/ Pause', sets: '3×6/side', cue: 'Pause at the top — stand tall before stepping down controlled' },
            { name: 'SL RDL (Slow)', sets: '3×6/side', cue: 'Slow hinge on one leg — reach long and stay balanced' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Glute Bridge Hold', sets: '2×25s', cue: 'Squeeze the glutes hard — hips fully extended and hold' },
            { name: 'Adductor Side Plank', sets: '2×15s/side', cue: 'Top leg on the bench — drive through the bottom adductor' },
            { name: 'Copenhagen Hold', sets: '2×12s/side', cue: 'Top leg supports — keep the hips stacked and lifted' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Farmer Carry (Heavy)', sets: '2×30yd', cue: 'Tall posture — grip hard and walk with purpose' },
            { name: 'Weighted Plank', sets: '2×25s', cue: 'Plate on the back — squeeze everything and breathe' },
          ],
        },
        {
          key: 'shoulder-durability',
          exercises: [
            { name: 'Side-Lying ER', sets: '2×10/side', cue: 'Elbow pinned to the side — slow rotation out' },
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
      focus: 'Acceleration Mechanics + Braking',
      type: 'sprint',
      blocks: [
        {
          key: 'sprint-warmup',
          exercises: [
            { name: 'A-Skip', sets: '2×20yd', cue: 'Drive the knee — quick ground contact' },
            { name: 'B-Skip', sets: '2×20yd', cue: 'Extend the leg — snap it down under the hip' },
            { name: 'High Knees', sets: '2×20yd', cue: 'Fast turnover — stay on the balls of the feet' },
            { name: 'Butt Kicks', sets: '2×20yd', cue: 'Heels to glutes — quick and rhythmic' },
          ],
        },
        {
          key: 'sprint-drills',
          exercises: [
            { name: 'Wall Drive March', sets: '3×8/side', cue: 'Knee to chest — hold the lean and drive' },
            { name: 'Deceleration Run (Sprint and Stop)', sets: '3×20yd', cue: 'Sprint hard then brake — chop the feet and stop on a dime' },
            { name: 'Falling Start', sets: '3×2', cue: 'Lean until you fall — explode into the first step' },
          ],
        },
        {
          key: 'sprint-work',
          exercises: [
            { name: '10yd Acceleration', sets: '4×10yd', cue: 'Low start — push the ground back and build speed' },
            { name: '20yd Build-Up', sets: '3×20yd', cue: 'Gradual acceleration — reach top speed by the end' },
            { name: 'Decel Sprint', sets: '3×30yd', cue: 'Sprint 20yd then decelerate over 10yd — controlled braking' },
          ],
        },
        {
          key: 'sprint-cooldown',
          exercises: [
            { name: 'Hip Flexor Stretch', sets: '2×30s/side', cue: 'Squeeze the glute — push the hip forward' },
            { name: '90/90 Hip Flow', sets: '2×6/side', cue: 'Transition smoothly — open each hip fully' },
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
      focus: 'Lateral Control + Deceleration',
      type: 'sprint',
      blocks: [
        {
          key: 'sprint-warmup',
          exercises: [
            { name: 'Carioca', sets: '2×20yd', cue: 'Rotate the hips — stay light on the feet' },
            { name: 'Lateral Shuffle', sets: '2×20yd', cue: 'Low hips — push off the outside foot' },
            { name: 'Crossover Step', sets: '2×20yd', cue: 'Cross over and open — rotate through the hips' },
          ],
        },
        {
          key: 'sprint-drills',
          exercises: [
            { name: 'Lateral Decel Drill', sets: '3×3/side', cue: 'Shuffle hard then brake — absorb and stick the stop' },
            { name: '5-10-5 Walkthrough', sets: '3×1', cue: 'Learn the pattern — low hips on each turn' },
          ],
        },
        {
          key: 'sprint-work',
          exercises: [
            { name: '5-10-5 Shuttle (Controlled)', sets: '4×1', cue: 'Explode out of each turn — focus on braking at each cone' },
            { name: 'Lateral Bound to Stick', sets: '3×3/side', cue: 'Bound laterally — absorb on one leg and freeze' },
            { name: 'Decel Sprint', sets: '3×20yd', cue: 'Sprint then brake — chop the feet and stop controlled' },
          ],
        },
        {
          key: 'sprint-cooldown',
          exercises: [
            { name: 'Pigeon Stretch', sets: '2×30s/side', cue: 'Sink into the hip — relax and breathe' },
            { name: 'Hip Flexor Stretch', sets: '2×30s/side', cue: 'Squeeze the glute — push the hip forward' },
            { name: 'Deep Breathing', sets: '2×60s', cue: 'Inhale 4 counts, exhale 6 — full recovery' },
          ],
        },
      ],
    },
  ],
};

export default month;
