import type { OtcsMonthTemplate } from './otcs-types';

const month: OtcsMonthTemplate = {
  monthNumber: 3,
  archetype: 'hybrid',
  phase: 'power-build',
  title: 'Power Build',
  subtitle: 'Strength-to-Power Conversion + Olympic Lifts + Balanced Sprint Development',
  color: '#8b5cf6',
  icon: 'flash-outline',
  volumeLevel: 'high',
  intensityLevel: 'high',
  keyFocus: ['Power Conversion', 'Olympic Lifts', 'Rotational Power', 'Sprint Mechanics', 'Balanced Development'],
  days: [
    {
      key: 'lower-accel',
      dayNumber: 1,
      label: 'Lower + Accel',
      accent: '#22c55e',
      focus: 'Lower Power + Olympic Lift Introduction',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'Depth Jump', sets: '3×3', cue: 'Step off and immediately explode up — minimize ground contact' },
            { name: 'Broad Jump to Sprint', sets: '2×3', cue: 'Jump forward and immediately accelerate — no pause on landing' },
            { name: 'Hurdle Hops', sets: '3×5', cue: 'Quick hips over each hurdle — stay tall and reactive' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'Hang Clean', sets: '3×3', cue: 'Pull from the hang — catch with elbows high and hips low', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'Back Squat', sets: '3×5', cue: 'Brace hard — drive through the floor with intent', scalesWithWeek: true },
            { name: 'Split Squat Jump', sets: '3×4/side', cue: 'Explode and switch — land soft and immediately go again' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'RDL (heavy)', sets: '3×5', cue: 'Heavy hinge — load the hamstrings and maintain a flat back', scalesWithWeek: true },
            { name: 'Bulgarian Split Squat', sets: '3×6/side', cue: 'Rear foot elevated — sit deep and drive through the front foot' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Leg Press', sets: '2×10', cue: 'Full range of motion — controlled descent and strong drive' },
            { name: 'Nordic Curl', sets: '2×5', cue: 'Control the descent — fight gravity as long as possible' },
            { name: 'Banded Monster Walk', sets: '2×15', cue: 'Stay low — push the knees out against the band' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Med Ball Rotational Throw', sets: '3×5/side', cue: 'Rotate from the hips — throw with full body power' },
            { name: 'Landmine Rotation', sets: '2×8/side', cue: 'Pivot the feet — controlled rotation from the hips' },
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
      focus: 'Upper Power + Pressing Strength',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'Plyo Push-Up (clap)', sets: '3×5', cue: 'Explode off the ground — clap and land soft' },
            { name: 'MB Slam', sets: '2×6', cue: 'Full extension — slam the ball into the ground with max force' },
            { name: 'MB Chest Pass', sets: '3×6', cue: 'Punch through the ball — snap the arms forward with intent' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'Push Press', sets: '3×3', cue: 'Dip and drive — lock out overhead with full extension', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'Barbell Bench Press', sets: '3×5', cue: 'Control the descent — drive the bar up with power', scalesWithWeek: true },
            { name: 'Weighted Pull-Up', sets: '3×5', cue: 'Full hang to chin over bar — add weight progressively' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'DB Incline Press', sets: '3×8', cue: 'Slight incline — press up and together at the top' },
            { name: 'Bent-Over Row', sets: '3×8', cue: 'Flat back — pull the bar to the ribcage and squeeze' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Cable ER', sets: '2×12/side', cue: 'Elbow pinned — rotate out against the cable with control' },
            { name: 'Prone Y Raise', sets: '2×10', cue: 'Thumbs up — lift from the lower traps, light weight' },
            { name: 'Lat Pulldown', sets: '2×10', cue: 'Pull to the chest — squeeze the lats at the bottom' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Cable Woodchop', sets: '2×8/side', cue: 'Rotate from the hips — chop across the body with power' },
            { name: 'V-Ups', sets: '2×12', cue: 'Hands to toes — fold at the hips with control' },
          ],
        },
        {
          key: 'shoulder-durability',
          exercises: [
            { name: 'Cuban Rotation', sets: '2×8', cue: 'Upright row to ER — smooth transition, light weight' },
            { name: 'KB Bottoms-Up Press', sets: '2×6/side', cue: 'Grip hard — press with a packed shoulder and steady KB' },
          ],
        },
      ],
    },
    {
      key: 'full-power',
      dayNumber: 3,
      label: 'Full Body Power',
      accent: '#ef4444',
      focus: 'Full Body Explosive Development',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'Box Jump (max)', sets: '3×3', cue: 'Swing and explode — max height, land soft on the box' },
            { name: 'Lateral Bound', sets: '3×4/side', cue: 'Push off hard — cover ground and stick the landing' },
            { name: 'Tuck Jump', sets: '2×5', cue: 'Explode up — tuck the knees to the chest at the top' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'DB Snatch', sets: '3×3/side', cue: 'Pull from the floor — punch overhead in one explosive motion', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'Trap Bar DL (speed)', sets: '3×5', cue: 'Fast off the floor — drive with max intent on every rep', scalesWithWeek: true },
            { name: 'Front Squat', sets: '3×4', cue: 'Elbows high — sit between the hips and drive up tall' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'Glute-Ham Raise', sets: '3×6', cue: 'Control the descent — drive the knees into the pad to come up' },
            { name: 'Reverse Lunge', sets: '3×6/side', cue: 'Step back and drop — drive through the front foot to return' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Leg Curl', sets: '2×12', cue: 'Control the movement — squeeze at the top' },
            { name: 'Hip Thrust', sets: '3×8', cue: 'Drive through the heels — squeeze the glutes at the top' },
            { name: 'Calf Raise', sets: '2×15', cue: 'Full range — pause at the top and stretch at the bottom' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Overhead Carry', sets: '2×30yd', cue: 'Arms locked out overhead — brace the core and walk tall' },
            { name: 'Pallof Press Walk', sets: '2×15yd/side', cue: 'Arms extended — walk forward while resisting rotation' },
          ],
        },
        {
          key: 'shoulder-durability',
          exercises: [
            { name: 'Prone Lower Trap Raise', sets: '2×10', cue: 'Thumbs up — lift from the lower trap, not the upper' },
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
      focus: 'Acceleration + Speed Development',
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
            { name: '3-Point Start', sets: '3×3', cue: 'Hand down — explode out low and drive hard' },
            { name: 'Sled March to Sprint', sets: '3×2', cue: 'March into the sled then release and sprint — feel the contrast' },
            { name: 'Wall Drive Hold', sets: '3×10s', cue: 'Hold the lean — lock the drive leg and maintain posture' },
          ],
        },
        {
          key: 'sprint-work',
          exercises: [
            { name: '10yd Fly Sprint', sets: '4×1', cue: 'Build up then hit max speed through the 10yd zone' },
            { name: 'Sled Sprint', sets: '3×20yd', cue: 'Drive against the resistance — maintain acceleration posture' },
            { name: '30yd Build-Up', sets: '3×30yd', cue: 'Smooth acceleration — hit top speed by the end' },
          ],
        },
        {
          key: 'sprint-cooldown',
          exercises: [
            { name: 'Walking Lunge Stretch', sets: '2×10/side', cue: 'Long stride — sink into each step and feel the stretch' },
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
      focus: 'Top Speed + COD Development',
      type: 'sprint',
      blocks: [
        {
          key: 'sprint-warmup',
          exercises: [
            { name: 'Carioca', sets: '2×20yd', cue: 'Rotate the hips — stay light on the feet' },
            { name: 'A-Run', sets: '2×20yd', cue: 'Continuous A-skip rhythm — drive the knee and cycle the leg' },
            { name: 'Build-Up Stride', sets: '2×40yd', cue: 'Gradual acceleration — smooth and controlled' },
          ],
        },
        {
          key: 'sprint-drills',
          exercises: [
            { name: 'Wicket Run', sets: '3×30yd', cue: 'Step over each wicket — maintain rhythm and posture' },
            { name: 'Flying 10yd Sprint', sets: '3×1', cue: 'Build up then hit max speed through the zone' },
          ],
        },
        {
          key: 'sprint-work',
          exercises: [
            { name: 'Flying 20yd', sets: '4×1', cue: 'Build up then maintain max speed for 20yd' },
            { name: '40yd Build-Up Sprint', sets: '3×1', cue: 'Smooth acceleration to top speed — full 40yd effort' },
            { name: 'T-Drill', sets: '3×1', cue: 'Sprint, shuffle, backpedal — stay low through every transition' },
          ],
        },
        {
          key: 'sprint-cooldown',
          exercises: [
            { name: 'Hip Flexor Stretch', sets: '2×30s/side', cue: 'Squeeze the glute — push the hip forward' },
            { name: 'Hamstring Stretch', sets: '2×30s/side', cue: 'Straight leg — hinge forward and feel the pull' },
            { name: 'Deep Breathing', sets: '2×60s', cue: 'Inhale 4 counts, exhale 6 — full recovery' },
          ],
        },
      ],
    },
  ],
};

export default month;
