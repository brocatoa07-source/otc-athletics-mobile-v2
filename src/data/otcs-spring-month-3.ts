import type { OtcsMonthTemplate } from './otcs-types';

const month: OtcsMonthTemplate = {
  monthNumber: 3,
  archetype: 'spring',
  phase: 'power-build',
  title: 'Power Build',
  subtitle: 'Controlled Power + Strength-to-Power Conversion + Decel Under Load',
  color: '#8b5cf6',
  icon: 'flash-outline',
  volumeLevel: 'high',
  intensityLevel: 'high',
  keyFocus: ['Controlled Power', 'Strength-to-Power', 'Deceleration Under Load', 'Olympic Lift Control', 'Sprint Mechanics'],
  days: [
    {
      key: 'lower-accel',
      dayNumber: 1,
      label: 'Lower + Accel',
      accent: '#22c55e',
      focus: 'Lower Power + Eccentric Control Under Load',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'Depth Jump (Controlled Landing)', sets: '3×3', cue: 'Step off, land, and immediately jump — absorb the landing softly' },
            { name: 'Hurdle Hop (Stick Each)', sets: '3×4', cue: 'Hop over each hurdle — stick the landing before the next' },
            { name: 'Lateral Bound', sets: '2×4/side', cue: 'Bound laterally with max intent — absorb on one leg' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'Hang Clean (Focus on Catch)', sets: '3×3', cue: 'Pull and catch — soft elbows, absorb the bar in the front rack', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'Back Squat (Heavy)', sets: '3×5', cue: 'Heavy load — brace hard, drive out of the hole with intent', scalesWithWeek: true },
            { name: 'Pause Split Squat', sets: '3×5/side', cue: 'Pause 2s at the bottom — drive up through the front heel' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'Heavy RDL', sets: '3×5', cue: 'Heavy hinge — load the hamstrings and drive the hips through', scalesWithWeek: true },
            { name: 'Bulgarian Split Squat', sets: '3×6/side', cue: 'Rear foot elevated — sink deep and drive through the front leg' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Leg Press', sets: '2×10', cue: 'Full range — controlled descent, drive through the heels' },
            { name: 'Nordic Curl', sets: '2×6', cue: 'Lower yourself as slow as possible — fight gravity the whole way' },
            { name: 'Banded Monster Walk', sets: '2×15', cue: 'Stay low — push against the band with each step' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Med Ball Rotational Throw (Controlled)', sets: '3×5/side', cue: 'Rotate from the hips — controlled release with intent' },
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
            { name: 'Plyo Push-Up', sets: '3×5', cue: 'Explode off the ground — land soft and reload' },
            { name: 'MB Slam (Max)', sets: '2×6', cue: 'Full extension — slam the ball into the ground with everything' },
            { name: 'MB Chest Pass', sets: '3×6', cue: 'Punch through the ball — snap the arms forward with max intent' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'Push Press (Heavy)', sets: '3×3', cue: 'Dip and drive — use the legs to launch heavy weight overhead', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'Barbell Bench Press (Heavy)', sets: '3×5', cue: 'Heavy load — controlled descent, drive the bar up with power', scalesWithWeek: true },
            { name: 'Weighted Pull-Up', sets: '3×5', cue: 'Add load — pull the chest to the bar and lower with control' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'DB Incline Press', sets: '3×8', cue: 'Control the descent — press through full range at an incline' },
            { name: 'Bent-Over Row (Heavy)', sets: '3×8', cue: 'Heavy pull — squeeze the shoulder blade and control the return' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Cable ER', sets: '2×12/side', cue: 'Elbow at 90° — rotate out against the cable with control' },
            { name: 'Prone Y Raise', sets: '2×10', cue: 'Thumbs up — lift from the lower trap, light weight' },
            { name: 'Lat Pulldown', sets: '2×10', cue: 'Pull to the chest — squeeze the lats at the bottom' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Cable Woodchop', sets: '2×8/side', cue: 'Drive from the hip — chop diagonally with power and control' },
            { name: 'V-Ups', sets: '2×12', cue: 'Touch the toes at the top — control the descent back down' },
          ],
        },
        {
          key: 'shoulder-durability',
          exercises: [
            { name: 'Cuban Rotation', sets: '2×8', cue: 'Upright row to ER — smooth transition, light weight' },
            { name: 'KB Bottoms-Up Press', sets: '2×6/side', cue: 'Grip hard — press the KB overhead while keeping it balanced' },
          ],
        },
      ],
    },
    {
      key: 'full-power',
      dayNumber: 3,
      label: 'Full Body Power',
      accent: '#ef4444',
      focus: 'Full Body Power + Decel Training',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'Depth Jump to Stick', sets: '3×3', cue: 'Step off, jump, and stick — freeze the landing completely' },
            { name: 'Lateral Depth Jump (Stick)', sets: '2×3/side', cue: 'Step off and bound laterally — stick on one leg' },
            { name: 'Broad Jump', sets: '2×4', cue: 'Swing the arms — explode forward and stick the landing' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'DB Snatch (Controlled Catch)', sets: '3×3/side', cue: 'Pull from the hip — catch overhead with a soft, stable lockout', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'Trap Bar DL (Heavy)', sets: '3×5', cue: 'Heavy load — push the floor away, chest up, lockout hard', scalesWithWeek: true },
            { name: 'Front Squat (Pause)', sets: '3×4', cue: 'Pause 2s in the hole — elbows high, drive out with power' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'Glute-Ham Raise', sets: '3×6', cue: 'Hinge at the knee — use the hamstrings to pull yourself up' },
            { name: 'Reverse Lunge', sets: '3×6/side', cue: 'Step back and sink — drive through the front foot to return' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Leg Curl', sets: '2×12', cue: 'Control the eccentric — squeeze at the top' },
            { name: 'Hip Thrust', sets: '3×8', cue: 'Drive the hips up — squeeze the glutes hard at lockout' },
            { name: 'Calf Raise', sets: '2×15', cue: 'Full range — rise up high and lower under control' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Suitcase Carry (Heavy)', sets: '2×30yd', cue: 'Stand tall — resist the lean, heavy load one side' },
            { name: 'Pallof Press Walk', sets: '2×15yd/side', cue: 'Arms extended — walk forward while resisting rotation' },
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
      focus: 'Acceleration + Deceleration Sprints',
      type: 'sprint',
      blocks: [
        {
          key: 'sprint-warmup',
          exercises: [
            { name: 'A-Skip', sets: '2×20yd', cue: 'Drive the knee — quick ground contact' },
            { name: 'Straight-Leg Bound', sets: '2×20yd', cue: 'Stiff legs — pull the ground under you with each stride' },
            { name: 'High Knees', sets: '2×20yd', cue: 'Fast turnover — stay on the balls of the feet' },
          ],
        },
        {
          key: 'sprint-drills',
          exercises: [
            { name: '3-Point Start', sets: '3×3', cue: 'Hand down, low stance — explode out for 3 hard steps' },
            { name: 'Decel Sprint (Sprint 20yd, Brake 5yd)', sets: '3×2', cue: 'Sprint hard then chop the feet to stop in 5 yards' },
            { name: 'Sled March', sets: '3×10yd', cue: 'Heavy sled — drive each step with full extension' },
          ],
        },
        {
          key: 'sprint-work',
          exercises: [
            { name: '10yd Fly Sprint', sets: '4×1', cue: 'Build up then hit top speed through the 10yd zone' },
            { name: 'Decel Sprint', sets: '4×25yd', cue: 'Sprint then decelerate — controlled braking over the last 5yd' },
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
      focus: 'Top Speed + Braking Ability',
      type: 'sprint',
      blocks: [
        {
          key: 'sprint-warmup',
          exercises: [
            { name: 'Carioca', sets: '2×20yd', cue: 'Rotate the hips — stay light on the feet' },
            { name: 'A-Run', sets: '2×20yd', cue: 'Aggressive knee drive — cycle the leg through fast' },
            { name: 'Build-Up Stride', sets: '2×40yd', cue: 'Smooth acceleration — reach 80% speed by the end' },
          ],
        },
        {
          key: 'sprint-drills',
          exercises: [
            { name: 'Wicket Run', sets: '3×30yd', cue: 'Step over each wicket — maintain rhythm and knee height' },
            { name: 'Sprint-Brake-Sprint', sets: '3×1', cue: 'Sprint 10yd, brake hard, sprint again — quick transitions' },
          ],
        },
        {
          key: 'sprint-work',
          exercises: [
            { name: 'Flying 20yd', sets: '4×1', cue: 'Build up then hold top speed through the 20yd zone' },
            { name: '40yd Build-Up Sprint', sets: '3×1', cue: 'Gradual build — reach full speed over 40 yards' },
            { name: 'Sprint-Brake-Sprint 40yd', sets: '3×1', cue: 'Sprint 20yd, brake 5yd, sprint 15yd — controlled transitions' },
          ],
        },
        {
          key: 'sprint-cooldown',
          exercises: [
            { name: 'Hip Flexor Stretch', sets: '2×30s/side', cue: 'Squeeze the glute — push the hip forward' },
            { name: 'Hamstring Stretch', sets: '2×30s/side', cue: 'Straight leg — hinge at the hip and reach forward' },
            { name: 'Deep Breathing', sets: '2×60s', cue: 'Inhale 4 counts, exhale 6 — full recovery' },
          ],
        },
      ],
    },
  ],
};

export default month;
