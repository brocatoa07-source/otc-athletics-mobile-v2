import type { OtcsMonthTemplate } from './otcs-types';

const month: OtcsMonthTemplate = {
  archetype: 'static',
  monthNumber: 6,
  phase: 'performance-peak',
  title: 'Performance Peak',
  subtitle: 'Baseball Transfer + Speed Maintenance + Explosive Power + Durability',
  color: '#e11d48',
  icon: 'trophy-outline',
  volumeLevel: 'low',
  intensityLevel: 'moderate',
  keyFocus: [
    'Baseball Transfer',
    'Speed Maintenance',
    'Explosive Power',
    'Durability',
    'Competition Prep',
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
            { name: 'Box Jump (moderate)', sets: '2×3', cue: 'Controlled power, soft landing' },
            { name: 'Lateral Bound', sets: '2×3/side', cue: 'Stick each landing' },
            { name: 'SL Hop', sets: '2×4/side', cue: 'Quick off the ground, stay balanced' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'Speed Trap Bar Pull', sets: '3×3', cue: 'Fast and crisp each rep', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'Speed Squat', sets: '3×4', cue: 'Max bar speed, stay tight', scalesWithWeek: true },
            { name: 'SL Box Jump', sets: '2×3/side', cue: 'Drive knee, full extension' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'Speed RDL', sets: '3×4', cue: 'Fast concentric, controlled eccentric' },
            { name: 'Step-Up', sets: '3×5/side', cue: 'Drive through lead leg' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Banded Glute Bridge', sets: '2×12', cue: 'Push knees out against band' },
            { name: 'Calf Raise', sets: '2×12', cue: 'Full ROM, pause at top' },
            { name: 'Tib Raise', sets: '2×12', cue: 'Full dorsiflexion each rep' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Rotational MB Throw', sets: '3×5/side', cue: 'Game-like intent, rotate from hips' },
            { name: 'Pallof Press Walk', sets: '2×15yd/side', cue: 'Arms extended, resist rotation' },
          ],
        },
        {
          key: 'shoulder-durability',
          exercises: [
            { name: 'Band Pull-Aparts', sets: '2×15', cue: 'Squeeze shoulder blades together' },
            { name: 'Prone ER', sets: '2×10/side', cue: 'Slow and controlled' },
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
            { name: 'MB Chest Pass', sets: '3×5', cue: 'Punch through the ball' },
            { name: 'MB Overhead Slam', sets: '2×5', cue: 'Full extension, slam hard' },
            { name: 'Plyo Push-Up', sets: '2×4', cue: 'Fast hands, max height' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'DB Push Press', sets: '3×3', cue: 'Dip and drive with intent', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'Speed Bench', sets: '3×4', cue: 'Fast off the chest', scalesWithWeek: true },
            { name: 'Weighted Pull-Up', sets: '3×4', cue: 'Full hang, pull to chest' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'DB Row', sets: '3×6', cue: 'Pull to hip, squeeze lat' },
            { name: 'Incline Press', sets: '3×6', cue: 'Deep stretch at bottom' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Cable ER', sets: '2×12/side', cue: 'Elbow at side, slow rotation' },
            { name: 'Face Pull', sets: '2×12', cue: 'Pull apart at the end' },
            { name: 'Prone Y Raise', sets: '2×8', cue: 'Thumbs up, squeeze lower traps' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Cable Rotation', sets: '2×8/side', cue: 'Rotate from hips, arms follow' },
            { name: 'Plank', sets: '2×30s', cue: 'Squeeze glutes, brace core' },
          ],
        },
        {
          key: 'shoulder-durability',
          exercises: [
            { name: 'Cuban Rotation', sets: '2×8', cue: 'Light weight, strict form' },
            { name: 'KB Arm Bar', sets: '2×30s/side', cue: 'Stabilize shoulder, breathe deeply' },
            { name: 'Band W Raise', sets: '2×12', cue: 'Retract and externally rotate' },
          ],
        },
      ],
    },
    {
      key: 'full-power',
      dayNumber: 3,
      label: 'Full Body Power',
      accent: '#ef4444',
      focus: 'Full Body Transfer + Competition Readiness',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'Broad Jump', sets: '2×3', cue: 'Max distance, stick landing' },
            { name: 'Lateral Bound', sets: '2×3/side', cue: 'Push off hard, stick landing' },
            { name: 'Tuck Jump', sets: '2×4', cue: 'Knees to chest, fast off ground' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'Hang Clean', sets: '3×2', cue: 'Fast elbows, crisp catch', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'Trap Bar DL (speed)', sets: '3×4', cue: 'Max bar speed, stay tight', scalesWithWeek: true },
            { name: 'Box Jump', sets: '2×3', cue: 'Explode up, soft landing' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'Reverse Lunge', sets: '3×5/side', cue: 'Control down, drive up' },
            { name: 'SL RDL', sets: '3×5/side', cue: 'Hinge deep, stay balanced' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Hip Thrust', sets: '2×10', cue: 'Squeeze glutes at lockout' },
            { name: 'Leg Curl', sets: '2×10', cue: 'Squeeze hamstrings at top' },
            { name: 'Copenhagen Hold', sets: '2×10s/side', cue: 'Stay stacked, squeeze adductors' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Overhead Carry', sets: '2×25yd', cue: 'Ribs down, arms locked out' },
            { name: 'Med Ball Rotational Slam', sets: '3×4/side', cue: 'Rotate and slam with intent' },
          ],
        },
        {
          key: 'shoulder-durability',
          exercises: [
            { name: 'Prone Lower Trap Raise', sets: '2×8', cue: 'Slow lift, squeeze at top' },
            { name: 'Band Pull-Aparts', sets: '2×15', cue: 'Squeeze shoulder blades together' },
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
            { name: 'A-Skip', sets: '2×20yd', cue: 'Tall posture, drive knee up' },
            { name: 'Build-Up Stride', sets: '2×40yd', cue: 'Gradually accelerate to 80%' },
            { name: 'High Knees', sets: '2×20yd', cue: 'Fast turnover, stay tall' },
          ],
        },
        {
          key: 'sprint-drills',
          exercises: [
            { name: 'Base Steal Start', sets: '3×3', cue: 'Explosive first step, low angle' },
            { name: 'Secondary Lead React', sets: '3×2', cue: 'Read and react, quick crossover' },
            { name: 'First to Third Walkthrough', sets: '2×1', cue: 'Round the bag, maintain speed' },
          ],
        },
        {
          key: 'sprint-work',
          exercises: [
            { name: 'Base Steal Sprint', sets: '4×1', cue: 'Game-like intensity, full effort' },
            { name: '60yd Sprint', sets: '3×1', cue: 'Smooth acceleration, hold form' },
            { name: 'OF Route Sprint', sets: '3×1', cue: 'Read, react, run full speed' },
          ],
        },
        {
          key: 'sprint-cooldown',
          exercises: [
            { name: 'Hip Flexor Stretch', sets: '2×30s/side', cue: 'Squeeze glute, push hips forward' },
            { name: 'Hamstring Stretch', sets: '2×30s/side', cue: 'Straight leg, hinge at hips' },
            { name: 'Foam Roll', sets: '3min', cue: 'Quads, hamstrings, calves' },
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
            { name: 'Carioca', sets: '2×20yd', cue: 'Open hips, stay light on feet' },
            { name: 'Lateral Shuffle', sets: '2×20yd', cue: 'Low hips, push off outside foot' },
            { name: 'A-Run', sets: '2×20yd', cue: 'Continuous cycling, tall posture' },
          ],
        },
        {
          key: 'sprint-drills',
          exercises: [
            { name: 'Crossover to Sprint (OF)', sets: '3×2', cue: 'Quick crossover, accelerate hard' },
            { name: 'Lateral Start to Sprint (IF)', sets: '3×2', cue: 'Lateral push-off into sprint' },
          ],
        },
        {
          key: 'sprint-work',
          exercises: [
            { name: 'Fly 20yd (maintenance)', sets: '3×1', cue: 'Smooth top-end speed' },
            { name: '40yd Sprint', sets: '3×1', cue: 'Aggressive start, hold speed' },
            { name: 'Curved Sprint', sets: '3×1', cue: 'Lean into curve, maintain speed' },
          ],
        },
        {
          key: 'sprint-cooldown',
          exercises: [
            { name: 'Pigeon Stretch', sets: '2×30s/side', cue: 'Relax into the stretch' },
            { name: '90/90 Breathing', sets: '2×60s', cue: 'Inhale through nose, exhale fully' },
            { name: 'Deep Breathing', sets: '2×60s', cue: 'Slow inhale 4s, exhale 8s' },
          ],
        },
      ],
    },
  ],
};

export default month;
