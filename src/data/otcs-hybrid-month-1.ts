import type { OtcsMonthTemplate } from './otcs-types';

const month: OtcsMonthTemplate = {
  monthNumber: 1,
  archetype: 'hybrid',
  phase: 'foundation',
  title: 'Foundation',
  subtitle: 'Balanced Movement Quality + General Strength + Sprint Fundamentals',
  color: '#22c55e',
  icon: 'build-outline',
  volumeLevel: 'moderate',
  intensityLevel: 'low',
  keyFocus: ['Movement Quality', 'General Strength', 'Sprint Fundamentals', 'Mobility', 'Motor Control'],
  days: [
    {
      key: 'lower-accel',
      dayNumber: 1,
      label: 'Lower + Accel',
      accent: '#22c55e',
      focus: 'Lower Body Foundation + Movement Quality',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'Box Jump', sets: '2×3', cue: 'Swing and explode — land soft on the box with quiet feet' },
            { name: 'Lateral Line Hops', sets: '2×12s', cue: 'Quick hops over the line — stay light and reactive' },
            { name: 'Pogo Hops', sets: '2×15s', cue: 'Stiff ankles — bounce off the ground with minimal knee bend' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'Trap Bar Jump', sets: '3×3', cue: 'Explode through the floor — full extension at the top', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'Goblet Squat (2s Pause)', sets: '3×6', cue: 'Sink deep and hold 2s — drive up with control', scalesWithWeek: true },
            { name: 'Split Squat Hold', sets: '3×20s/side', cue: 'Deep split stance — hold the bottom and own the position' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'RDL', sets: '3×6', cue: 'Hinge at the hips — feel the hamstrings load on the way down', scalesWithWeek: true },
            { name: 'Lateral Lunge', sets: '3×5/side', cue: 'Step wide and sit deep — push back to center' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Hamstring Curl', sets: '2×12', cue: 'Control the movement — squeeze at the top' },
            { name: 'Suitcase Carry', sets: '2×25yd', cue: 'Stand tall — resist the lean, brace the core hard' },
            { name: 'Tib Raises', sets: '2×12', cue: 'Pull the toe up hard — feel the front of the shin work' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Pallof Press Hold', sets: '2×15s/side', cue: 'Arms out — resist rotation through the core' },
            { name: 'Dead Bug', sets: '2×8/side', cue: 'Low back glued to floor — extend slow and controlled' },
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
      focus: 'Upper Body Foundation + Shoulder Health',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'OH Med Ball Slam', sets: '2×5', cue: 'Full extension overhead — slam with intent into the ground' },
            { name: 'Plyo Push-Up', sets: '2×5', cue: 'Explode off the ground — land soft and absorb' },
            { name: 'MB Chest Pass', sets: '3×5', cue: 'Punch through the ball — snap the arms forward with intent' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'Landmine Rotational Press', sets: '3×4/side', cue: 'Drive from the hip — controlled rotation and press', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'DB Bench Press (2s Pause)', sets: '3×6', cue: 'Lower to chest and hold 2s — dead stop before pressing up', scalesWithWeek: true },
            { name: 'Scap Y Hold', sets: '3×20s', cue: 'Thumbs up, arms extended — squeeze the lower traps and hold' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'Chest-Supported Row', sets: '3×8', cue: 'Pull to the hip — squeeze the shoulder blade back hard' },
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
            { name: 'Landmine Rotation', sets: '2×6/side', cue: 'Pivot the feet — controlled rotation from the hips' },
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
      focus: 'Full Body General Strength',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'Broad Jump', sets: '2×3', cue: 'Swing and jump — explode forward and stick the landing' },
            { name: 'Heiden Stick', sets: '2×3/side', cue: 'Bound laterally — absorb on one leg and freeze' },
            { name: 'Skier Hops', sets: '2×8', cue: 'Side to side — stay light and rhythmic' },
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
            { name: 'Trap Bar DL (controlled)', sets: '3×5', cue: 'Drive the floor away — controlled on the way down', scalesWithWeek: true },
            { name: 'Anti-Rotation ISO', sets: '3×15s/side', cue: 'Arms extended — resist the pull, lock the hips square' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'Step-Ups w/ Knee Drive', sets: '3×6/side', cue: 'Drive through the front foot — knee punch at the top' },
            { name: 'SL RDL', sets: '3×6/side', cue: 'Slow hinge on one leg — reach long and stay balanced' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Glute Bridge Hold', sets: '2×20s', cue: 'Squeeze the glutes hard — hips fully extended and hold' },
            { name: 'Adductor Side Plank', sets: '2×15s/side', cue: 'Top leg on the bench — drive through the bottom adductor' },
            { name: 'Copenhagen Hold', sets: '2×10s/side', cue: 'Top leg supports — keep the hips stacked and lifted' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Farmer Carry', sets: '2×25yd', cue: 'Tall posture — grip hard and walk with purpose' },
            { name: 'Weighted Plank', sets: '2×20s', cue: 'Plate on the back — squeeze everything and breathe' },
          ],
        },
        {
          key: 'shoulder-durability',
          exercises: [
            { name: 'Side-Lying ER', sets: '2×10/side', cue: 'Elbow pinned to the side — slow rotation out' },
            { name: 'Band W Raises', sets: '2×12', cue: 'Elbows at 90 degrees — squeeze the shoulder blades together' },
          ],
        },
      ],
    },
    {
      key: 'sprint-1',
      dayNumber: 4,
      label: 'Sprint Day 1',
      accent: '#f59e0b',
      focus: 'Acceleration Fundamentals',
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
            { name: 'Falling Start', sets: '3×2', cue: 'Lean until you fall — explode into the first step' },
            { name: 'Half-Kneeling Start', sets: '3×2', cue: 'Low position — drive hard out of the stance' },
          ],
        },
        {
          key: 'sprint-work',
          exercises: [
            { name: '10yd Acceleration', sets: '4×10yd', cue: 'Low start — push the ground back and build speed' },
            { name: '20yd Build-Up', sets: '3×20yd', cue: 'Gradual acceleration — reach top speed by the end' },
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
      focus: 'Lateral Movement + COD Basics',
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
            { name: 'Lateral Start to Sprint', sets: '3×3/side', cue: 'Shuffle then turn and go — explosive transition' },
            { name: '5-10-5 Walkthrough', sets: '3×1', cue: 'Learn the pattern — low hips on each turn' },
          ],
        },
        {
          key: 'sprint-work',
          exercises: [
            { name: '5-10-5 Shuttle', sets: '4×1', cue: 'Explode out of each turn — low hips at every cone' },
            { name: 'Lateral Bound to Sprint', sets: '3×3/side', cue: 'Bound laterally then accelerate forward — smooth transition' },
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
