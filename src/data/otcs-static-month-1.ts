import type { OtcsMonthTemplate } from './otcs-types';

const month: OtcsMonthTemplate = {
  monthNumber: 1,
  phase: 'foundation',
  title: 'Foundation',
  subtitle: 'Movement Quality + Mobility + Tissue Prep + Base Strength',
  color: '#22c55e',
  icon: 'build-outline',
  volumeLevel: 'moderate',
  intensityLevel: 'low',
  keyFocus: ['Mobility', 'Motor Control', 'Eccentric Strength', 'Acceleration Mechanics', 'Tissue Prep'],
  archetype: 'static',
  days: [
    {
      key: 'lower-accel',
      dayNumber: 1,
      label: 'Lower + Accel',
      accent: '#22c55e',
      focus: 'Lower Body + Acceleration Mechanics',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'Box Jump Stick', sets: '2×3', cue: 'Stick the landing — absorb quietly through full foot' },
            { name: 'Lateral Line Hops', sets: '2×12s', cue: 'Stay light and springy — minimize ground contact' },
            { name: 'Pogo Hops', sets: '2×15s', cue: 'Stiff ankles, quick off the ground — think elastic bounce' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'Trap Bar Jump', sets: '3×3', cue: 'Explode up — reset between reps, max intent', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'Goblet Squat (3s Tempo)', sets: '3×6', cue: 'Slow eccentric — own every inch of the descent', scalesWithWeek: true },
            { name: 'Split Squat ISO Hold', sets: '3×20s/side', cue: 'Deep position — push the knee over the toe and hold' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'RDL', sets: '3×6', cue: 'Hinge deep — feel the hamstrings load on the way down', scalesWithWeek: true },
            { name: 'Lateral Lunge', sets: '3×5/side', cue: 'Sit deep into the hip — push through full foot to return' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Hamstring Curl', sets: '2×12', cue: 'Control the eccentric — squeeze at the top' },
            { name: 'Suitcase Carry', sets: '2×20s/side', cue: 'Stand tall — resist the lean, brace the core' },
            { name: 'Tib Raises', sets: '2×12', cue: 'Pull the toe up hard — feel the front of the shin work' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Pallof Press Hold', sets: '2×15s/side', cue: 'Lock the hips — resist rotation through the core' },
            { name: 'Dead Bug', sets: '2×8/side', cue: 'Low back stays glued to the floor — slow and controlled' },
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
      focus: 'Upper Body + Shoulder Health',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'OH Med Ball Slam', sets: '2×5', cue: 'Full extension overhead — slam with intent' },
            { name: 'Plyo Push-Up', sets: '3×5', cue: 'Explode off the ground — land soft and reload' },
            { name: 'MB Chest Pass', sets: '3×6', cue: 'Punch through the ball — snap the arms forward' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'Landmine Rotational Press', sets: '3×4/side', cue: 'Drive from the hip — rotate and press in one motion', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'Neutral Grip DB Bench', sets: '3×6', cue: 'Control the descent — press with full range of motion', scalesWithWeek: true },
            { name: 'Scap Y ISO Hold', sets: '3×20s', cue: 'Thumbs up, arms extended — squeeze the lower traps' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'Chest-Supported DB Row', sets: '3×8', cue: 'Pull to the hip — squeeze the shoulder blade back' },
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
            { name: 'Russian Twist + Mini Slam', sets: '2×12', cue: 'Rotate through the torso — controlled and deliberate' },
            { name: 'Landmine Rotation', sets: '2×6/side', cue: 'Pivot the feet — drive the rotation from the hips' },
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
      focus: 'Full Body Power + Explosive Strength',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'Broad Jump', sets: '3×3', cue: 'Swing the arms — explode forward and stick the landing' },
            { name: 'Heiden w/ Stick', sets: '2×3/side', cue: 'Bound laterally — absorb on one leg and freeze' },
            { name: 'Skier Hops', sets: '2×8', cue: 'Side to side — stay low and quick off the ground' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'DB Push Press', sets: '3×4', cue: 'Dip and drive — use the legs to launch the weight', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'Trap Bar Deadlift', sets: '3×5', cue: 'Push the floor away — chest up, hips and shoulders rise together', scalesWithWeek: true },
            { name: 'Anti-Rotation ISO Hold', sets: '3×15s/side', cue: 'Arms extended — resist the pull, lock the hips square' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'Step-Ups w/ Knee Drive', sets: '3×6/side', cue: 'Drive the knee high — stand tall at the top' },
            { name: 'Single-Leg RDL', sets: '3×6/side', cue: 'Hinge on one leg — reach long and stay balanced' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Glute Bridge Hold', sets: '2×20s', cue: 'Squeeze the glutes hard — hips fully extended' },
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
            { name: 'Side-Lying DB ER', sets: '2×10/side', cue: 'Elbow pinned to the side — slow rotation out' },
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
      focus: 'Acceleration Development',
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
            { name: 'Half-Kneeling Start', sets: '3×2', cue: 'Drive the back knee forward — stay low for 3 steps' },
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
            { name: 'Walking Lunge Stretch', sets: '2×10/side', cue: 'Long step — sink the hip and reach overhead' },
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
      focus: 'Lateral Speed + Change of Direction',
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
            { name: 'Lateral Start to Sprint', sets: '3×3/side', cue: 'Push off hard laterally — transition into a sprint' },
            { name: '5-10-5 Walkthrough', sets: '3×1', cue: 'Learn the pattern — low hips on each turn' },
          ],
        },
        {
          key: 'sprint-work',
          exercises: [
            { name: '5-10-5 Shuttle', sets: '4×1', cue: 'Explode out of each turn — stay low and drive' },
            { name: 'Lateral Bound to Sprint', sets: '3×3/side', cue: 'Bound laterally then accelerate forward' },
          ],
        },
        {
          key: 'sprint-cooldown',
          exercises: [
            { name: 'Hip Flexor Stretch', sets: '2×30s/side', cue: 'Squeeze the glute — push the hip forward' },
            { name: 'Pigeon Stretch', sets: '2×30s/side', cue: 'Sink into the hip — relax and breathe' },
            { name: 'Deep Breathing', sets: '2×60s', cue: 'Inhale 4 counts, exhale 6 — full recovery' },
          ],
        },
      ],
    },
  ],
};

export default month;
