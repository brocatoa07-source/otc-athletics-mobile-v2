import type { OtcsMonthTemplate } from './otcs-types';

const month: OtcsMonthTemplate = {
  monthNumber: 6,
  archetype: 'hybrid',
  phase: 'performance-peak',
  title: 'Performance Peak',
  subtitle: 'Baseball Transfer + Balanced Maintenance + Competition Readiness',
  color: '#e11d48',
  icon: 'trophy-outline',
  volumeLevel: 'low',
  intensityLevel: 'moderate',
  keyFocus: [
    'Baseball Transfer',
    'Balanced Maintenance',
    'Competition Prep',
    'Speed Maintenance',
    'Durability',
  ],
  days: [
    {
      key: 'lower-accel',
      dayNumber: 1,
      label: 'Lower + Accel',
      accent: '#22c55e',
      focus: 'Lower Maintenance + Baseball Transfer',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'Box Jump (Moderate)', sets: '2×3', cue: 'Controlled explosion — land soft on top of the box' },
            { name: 'Lateral Bound', sets: '2×3/side', cue: 'Push off the outside foot — stick the landing' },
            { name: 'SL Hop', sets: '2×4/side', cue: 'Quick single-leg hops — stay stiff through the ankle' },
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
            { name: 'Speed Squat', sets: '3×4', cue: 'Fast descent and explode up — move the bar with intent', scalesWithWeek: true },
            { name: 'SL Box Jump', sets: '2×3/side', cue: 'Single-leg explosion onto the box — drive through the ground' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'Speed RDL', sets: '3×4', cue: 'Quick hinge and snap the hips through — maintain speed' },
            { name: 'Step-Up', sets: '3×5/side', cue: 'Drive through the lead leg — stand tall at the top' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Banded Glute Bridge', sets: '2×12', cue: 'Push the knees out against the band — squeeze hard at the top' },
            { name: 'Calf Raise', sets: '2×12', cue: 'Full range — pause at the top and stretch at the bottom' },
            { name: 'Tib Raise', sets: '2×12', cue: 'Pull the toe up hard — feel the front of the shin work' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Rotational MB Throw', sets: '3×5/side', cue: 'Drive from the back hip — release with max intent' },
            { name: 'Pallof Press Walk', sets: '2×15yd/side', cue: 'Arms extended, walk forward — resist rotation through every step' },
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
      focus: 'Upper Maintenance + Arm Care',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'MB Chest Pass', sets: '3×5', cue: 'Punch through the ball — snap the arms forward with intent' },
            { name: 'MB Overhead Slam', sets: '2×5', cue: 'Full extension overhead — slam the ball into the ground' },
            { name: 'Plyo Push-Up', sets: '2×4', cue: 'Explode off the ground — snap the hands up and land soft' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'DB Push Press', sets: '3×3', cue: 'Quick dip and explosive drive — lock out overhead with speed', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'Speed Bench', sets: '3×4', cue: 'Fast off the chest — move the bar with max velocity', scalesWithWeek: true },
            { name: 'Weighted Pull-Up', sets: '3×4', cue: 'Pull the chest to the bar — control the descent' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'DB Row', sets: '3×6', cue: 'Pull to the hip — squeeze the shoulder blade back hard' },
            { name: 'Incline Press', sets: '3×6', cue: 'Drive the dumbbells up and together — full range of motion' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Cable ER', sets: '2×12/side', cue: 'Elbow pinned — slow external rotation against the cable' },
            { name: 'Face Pull', sets: '2×12', cue: 'Pull to the forehead — externally rotate at the end' },
            { name: 'Prone Y Raise', sets: '2×8', cue: 'Thumbs up — lift from the lower traps, not the upper' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Cable Rotation', sets: '2×8/side', cue: 'Drive from the hips — rotate with control through the core' },
            { name: 'Plank', sets: '2×30s', cue: 'Squeeze everything — glutes, abs, shoulders all locked in' },
          ],
        },
        {
          key: 'shoulder-durability',
          exercises: [
            { name: 'Cuban Rotation', sets: '2×8', cue: 'Upright row to external rotation to press — smooth and controlled' },
            { name: 'KB Arm Bar', sets: '2×30s/side', cue: 'Shoulder packed — open through the chest and hold' },
            { name: 'Band W Raise', sets: '2×12', cue: 'Elbows at 90° — squeeze the shoulder blades together' },
          ],
        },
      ],
    },
    {
      key: 'full-power',
      dayNumber: 3,
      label: 'Full Body Power',
      accent: '#ef4444',
      focus: 'Full Body Transfer + Game Readiness',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'Broad Jump', sets: '2×3', cue: 'Swing and jump for max distance — full hip extension' },
            { name: 'Lateral Bound', sets: '2×3/side', cue: 'Push off the outside foot — stick the landing' },
            { name: 'Tuck Jump', sets: '2×4', cue: 'Knees to chest at the peak — land soft and reload' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'Hang Clean', sets: '3×2', cue: 'Violent hip extension — pull yourself under and catch clean', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'Trap Bar DL (Speed)', sets: '3×4', cue: 'Rip it off the floor — max bar speed on every rep', scalesWithWeek: true },
            { name: 'Box Jump', sets: '2×3', cue: 'Swing and explode — land soft on top of the box' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'Reverse Lunge', sets: '3×5/side', cue: 'Step back and drive up — control the descent' },
            { name: 'SL RDL', sets: '3×5/side', cue: 'Slow hinge on one leg — reach long and stay balanced' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Hip Thrust', sets: '2×10', cue: 'Squeeze the glutes hard at the top — full lockout' },
            { name: 'Leg Curl', sets: '2×10', cue: 'Squeeze at the top — slow eccentric on the way down' },
            { name: 'Copenhagen Hold', sets: '2×10s/side', cue: 'Top leg supports — keep the hips stacked and lifted' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Overhead Carry', sets: '2×25yd', cue: 'Lock the arms overhead — walk tall and brace hard' },
            { name: 'Med Ball Rotational Slam', sets: '3×4/side', cue: 'Rotate from the hips and slam with intent' },
          ],
        },
        {
          key: 'shoulder-durability',
          exercises: [
            { name: 'Prone Lower Trap Raise', sets: '2×8', cue: 'Thumbs up — lift from the lower trap, not the upper' },
            { name: 'Band Pull-Aparts', sets: '2×15', cue: 'Squeeze the shoulder blades — hold the end range' },
          ],
        },
      ],
    },
    {
      key: 'sprint-1',
      dayNumber: 4,
      label: 'Sprint Day 1',
      accent: '#f59e0b',
      focus: 'Game Speed + Base Running',
      type: 'sprint',
      blocks: [
        {
          key: 'sprint-warmup',
          exercises: [
            { name: 'A-Skip', sets: '2×20yd', cue: 'Drive the knee — quick ground contact' },
            { name: 'Build-Up Stride', sets: '2×40yd', cue: 'Gradually accelerate — reach near-top speed by the end' },
            { name: 'High Knees', sets: '2×20yd', cue: 'Fast turnover — stay on the balls of the feet' },
          ],
        },
        {
          key: 'sprint-drills',
          exercises: [
            { name: 'Base Steal Start', sets: '3×3', cue: 'Crossover and go — explosive first move' },
            { name: 'Secondary Lead React', sets: '3×2', cue: 'Read and react — explode on the cue' },
            { name: 'First to Third Walkthrough', sets: '2×1', cue: 'Round the bag — efficient path and acceleration' },
          ],
        },
        {
          key: 'sprint-work',
          exercises: [
            { name: 'Base Steal Sprint', sets: '4×1', cue: 'Game-speed steal — react and go with max intent' },
            { name: '60yd Sprint', sets: '3×1', cue: 'Full effort — accelerate hard and maintain through the finish' },
            { name: 'OF Route Sprint', sets: '3×1', cue: 'Drop step and sprint — game-like outfield route' },
          ],
        },
        {
          key: 'sprint-cooldown',
          exercises: [
            { name: 'Hip Flexor Stretch', sets: '2×30s/side', cue: 'Squeeze the glute — push the hip forward' },
            { name: 'Hamstring Stretch', sets: '2×30s/side', cue: 'Straight leg — hinge at the hip and feel the pull' },
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
      focus: 'Speed Maintenance + Baseball Transfer',
      type: 'sprint',
      blocks: [
        {
          key: 'sprint-warmup',
          exercises: [
            { name: 'Carioca', sets: '2×20yd', cue: 'Rotate the hips — stay light on the feet' },
            { name: 'Lateral Shuffle', sets: '2×20yd', cue: 'Low hips — push off the outside foot' },
            { name: 'A-Run', sets: '2×20yd', cue: 'Continuous A-skip rhythm — fast and fluid' },
          ],
        },
        {
          key: 'sprint-drills',
          exercises: [
            { name: 'Crossover to Sprint (OF)', sets: '3×2', cue: 'Open the hips and go — quick crossover into a full sprint' },
            { name: 'Lateral Start to Sprint (IF)', sets: '3×2', cue: 'Lateral first step into a sprint — game-like infield movement' },
          ],
        },
        {
          key: 'sprint-work',
          exercises: [
            { name: 'Fly 20yd (Maintenance)', sets: '3×1', cue: 'Build up and hit the zone — maintain top speed' },
            { name: '40yd Sprint', sets: '3×1', cue: 'Explosive start — reach top speed as fast as possible' },
            { name: 'Curved Sprint', sets: '3×1', cue: 'Sprint on the curve — lean in and maintain speed through the turn' },
          ],
        },
        {
          key: 'sprint-cooldown',
          exercises: [
            { name: 'Pigeon Stretch', sets: '2×30s/side', cue: 'Sink into the hip — relax and breathe' },
            { name: '90/90 Breathing', sets: '2×60s', cue: 'Inhale through the nose, exhale slow — full recovery' },
            { name: 'Deep Breathing', sets: '2×60s', cue: 'Inhale 4 counts, exhale 6 — full parasympathetic recovery' },
          ],
        },
      ],
    },
  ],
};

export default month;
