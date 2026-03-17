import type { OtcsMonthTemplate } from './otcs-types';

const month: OtcsMonthTemplate = {
  monthNumber: 5,
  archetype: 'hybrid',
  phase: 'max-velocity',
  title: 'Max Velocity',
  subtitle: 'Sprint Speed + Balanced Power Expression + Speed-Strength',
  color: '#f59e0b',
  icon: 'speedometer-outline',
  volumeLevel: 'moderate',
  intensityLevel: 'high',
  keyFocus: [
    'Max Velocity',
    'Speed-Strength',
    'Balanced Power',
    'Sprint Mechanics',
    'Elastic Power',
  ],
  days: [
    {
      key: 'lower-accel',
      dayNumber: 1,
      label: 'Lower + Accel',
      accent: '#22c55e',
      focus: 'Lower Speed-Strength + Reactive Power',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'Depth Jump (Reactive)', sets: '3×3', cue: 'Step off and explode up instantly — minimize ground contact' },
            { name: 'Hurdle Hop (Fast)', sets: '3×5', cue: 'Rapid fire over each hurdle — stiff ankles, fast off the ground' },
            { name: 'Lateral Bound', sets: '2×4/side', cue: 'Push hard off the outside foot — stick the landing on the opposite leg' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'Speed Trap Bar Pull', sets: '3×3', cue: 'Rip the bar off the floor — max speed on the concentric', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'Speed Squat (60% 1RM)', sets: '3×5', cue: 'Fast descent and explode up — move the bar with max velocity', scalesWithWeek: true },
            { name: 'Box Jump', sets: '3×3', cue: 'Swing and explode — land soft on top of the box' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'Speed RDL', sets: '3×5', cue: 'Quick hinge and snap the hips through — speed on the concentric' },
            { name: 'Reverse Lunge (Speed)', sets: '3×6/side', cue: 'Step back and drive up fast — explosive out of the hole' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Glute Bridge (Banded)', sets: '2×15', cue: 'Push the knees out against the band — squeeze hard at the top' },
            { name: 'Nordic Curl', sets: '2×4', cue: 'Control the eccentric as long as possible — fight gravity' },
            { name: 'Calf Raise (Fast)', sets: '2×12', cue: 'Explosive up — quick off the ground like a sprint' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Med Ball Rotational Slam', sets: '3×5/side', cue: 'Rotate from the hips and slam with max intent' },
            { name: 'Anti-Rotation Walk', sets: '2×15yd/side', cue: 'Hold the cable and walk — resist rotation through every step' },
          ],
        },
        {
          key: 'shoulder-durability',
          exercises: [
            { name: 'Band Pull-Aparts', sets: '2×15', cue: 'Squeeze the shoulder blades — hold the end range' },
            { name: 'Prone ER', sets: '2×10/side', cue: 'Elbow on the bench — slow rotation back, control the weight' },
          ],
        },
      ],
    },
    {
      key: 'upper-shoulder',
      dayNumber: 2,
      label: 'Upper + Shoulder',
      accent: '#3b82f6',
      focus: 'Upper Speed-Strength + Ballistic Power',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'Reactive Plyo Push-Up', sets: '3×5', cue: 'Bounce off the ground — minimal hand contact time' },
            { name: 'MB Chest Pass (Max)', sets: '3×6', cue: 'Punch through the ball with max intent — full body behind it' },
            { name: 'MB Overhead Throw', sets: '2×5', cue: 'Extend fully and release — throw for max distance' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'Speed DB Push Press', sets: '3×3', cue: 'Quick dip and explosive drive — lock out with speed', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'Speed Bench (60%)', sets: '3×5', cue: 'Fast off the chest — move the bar with max velocity', scalesWithWeek: true },
            { name: 'Plyo Push-Up', sets: '3×4', cue: 'Explode off the ground — snap the hands up and land soft' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'Speed Row', sets: '3×6', cue: 'Pull fast to the hip — explosive concentric, controlled return' },
            { name: 'Speed Incline Press', sets: '3×6', cue: 'Drive the dumbbells up fast — speed on every rep' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Cable ER (Speed)', sets: '2×12/side', cue: 'Quick external rotation — snap out and control back' },
            { name: 'Band Face Pull', sets: '2×15', cue: 'Pull to the forehead — externally rotate at the end' },
            { name: 'Lat Pulldown (Speed)', sets: '2×8', cue: 'Fast pull to the chest — control the return' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Cable Rotation (Speed)', sets: '2×8/side', cue: 'Fast rotation from the hips — snap through the core' },
            { name: 'V-Ups', sets: '2×12', cue: 'Touch the toes at the top — control the descent' },
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
      key: 'full-power',
      dayNumber: 3,
      label: 'Full Body Power',
      accent: '#ef4444',
      focus: 'Full Body Speed + Power Transfer',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'Depth Jump to Broad Jump', sets: '3×3', cue: 'Step off, land, and immediately broad jump — chain the power' },
            { name: 'Lateral Bound to Sprint', sets: '2×3/side', cue: 'Bound laterally then transition to a sprint — reactive and fast' },
            { name: 'Tuck Jump', sets: '2×5', cue: 'Knees to chest at the peak — land soft and reload fast' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'Hang Snatch', sets: '3×3', cue: 'Violent hip extension — pull yourself under and catch overhead', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'Speed Trap Bar DL (60%)', sets: '3×5', cue: 'Rip it off the floor — max bar speed on every rep', scalesWithWeek: true },
            { name: 'Broad Jump', sets: '3×3', cue: 'Swing and jump for max distance — full hip extension' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'Speed Front Squat', sets: '3×4', cue: 'Elbows high and explode up — fast out of the hole' },
            { name: 'Speed Step-Up', sets: '3×4/side', cue: 'Drive through the lead leg explosively — fast and powerful' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Leg Curl (Fast)', sets: '2×10', cue: 'Quick curl and slow eccentric — speed on the concentric' },
            { name: 'Hip Thrust (Banded)', sets: '2×12', cue: 'Push the knees out — fast lockout at the top' },
            { name: 'Tib Raise', sets: '2×12', cue: 'Pull the toe up hard — feel the front of the shin work' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Rotational MB Throw (Max Effort)', sets: '3×5/side', cue: 'Drive from the back hip — release with absolute max intent' },
            { name: 'Farmer Carry', sets: '2×30yd', cue: 'Tall posture — grip hard and walk with purpose' },
          ],
        },
        {
          key: 'shoulder-durability',
          exercises: [
            { name: 'Prone Y Raise', sets: '2×10', cue: 'Thumbs up — lift from the lower traps, not the upper' },
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
      focus: 'Max Velocity + Flying Sprints',
      type: 'sprint',
      blocks: [
        {
          key: 'sprint-warmup',
          exercises: [
            { name: 'A-Run', sets: '2×20yd', cue: 'Continuous A-skip rhythm — fast and fluid' },
            { name: 'Build-Up Stride', sets: '2×50yd', cue: 'Smooth acceleration — reach near-top speed by the end' },
            { name: 'Straight-Leg Bound', sets: '2×20yd', cue: 'Stiff legs — push through the ground with each bound' },
          ],
        },
        {
          key: 'sprint-drills',
          exercises: [
            { name: 'Wicket Run', sets: '3×30yd', cue: 'Hit each wicket — focus on stride length and turnover' },
            { name: 'In-Out Sprint', sets: '3×40yd', cue: 'Accelerate in the zone, float out — feel the speed difference' },
            { name: 'Flying Start', sets: '3×2', cue: 'Jog into the zone and explode — practice the transition to max speed' },
          ],
        },
        {
          key: 'sprint-work',
          exercises: [
            { name: 'Flying 20yd (Max)', sets: '4×1', cue: 'Build up then hit the zone at absolute max speed' },
            { name: 'Flying 30yd', sets: '3×1', cue: 'Longer fly zone — maintain top speed through the full 30' },
            { name: '60yd Build-Up', sets: '2×1', cue: 'Smooth acceleration — reach and hold top speed' },
          ],
        },
        {
          key: 'sprint-cooldown',
          exercises: [
            { name: 'Hip Flexor Stretch', sets: '2×30s/side', cue: 'Squeeze the glute — push the hip forward' },
            { name: 'Hamstring Stretch', sets: '2×30s/side', cue: 'Straight leg — hinge at the hip and feel the pull' },
            { name: '90/90 Breathing', sets: '2×60s', cue: 'Inhale through the nose, exhale slow — full recovery' },
          ],
        },
      ],
    },
    {
      key: 'sprint-2',
      dayNumber: 5,
      label: 'Sprint Day 2',
      accent: '#8b5cf6',
      focus: 'Speed Endurance + Baseball Speed',
      type: 'sprint',
      blocks: [
        {
          key: 'sprint-warmup',
          exercises: [
            { name: 'Carioca', sets: '2×20yd', cue: 'Rotate the hips — stay light on the feet' },
            { name: 'Lateral Shuffle', sets: '2×20yd', cue: 'Low hips — push off the outside foot' },
            { name: 'A-Skip', sets: '2×20yd', cue: 'Drive the knee — quick ground contact' },
          ],
        },
        {
          key: 'sprint-drills',
          exercises: [
            { name: 'Base Steal Start', sets: '3×3', cue: 'Crossover and go — explosive first move' },
            { name: 'Flying Lateral Start', sets: '3×2/side', cue: 'Lateral shuffle into a sprint — quick transition' },
          ],
        },
        {
          key: 'sprint-work',
          exercises: [
            { name: '60yd Sprint', sets: '3×1', cue: 'Full effort — accelerate hard and maintain through the finish' },
            { name: '40yd Sprint', sets: '4×1', cue: 'Explosive start — reach top speed as fast as possible' },
            { name: 'Base Steal Sprint', sets: '4×1', cue: 'Game-speed steal — react and go with max intent' },
          ],
        },
        {
          key: 'sprint-cooldown',
          exercises: [
            { name: 'Pigeon Stretch', sets: '2×30s/side', cue: 'Sink into the hip — relax and breathe' },
            { name: 'Quad Stretch', sets: '2×30s/side', cue: 'Pull the heel to the glute — keep the hips square' },
            { name: 'Foam Roll', sets: '3min', cue: 'Hit quads, hamstrings, and calves — slow passes' },
          ],
        },
      ],
    },
  ],
};

export default month;
