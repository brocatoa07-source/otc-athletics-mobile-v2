import type { OtcsMonthTemplate } from './otcs-types';

const month: OtcsMonthTemplate = {
  monthNumber: 6,
  archetype: 'spring',
  phase: 'performance-peak',
  title: 'Performance Peak',
  subtitle: 'Baseball Transfer + Controlled Speed + Power Maintenance + Durability',
  color: '#e11d48',
  icon: 'trophy-outline',
  volumeLevel: 'low',
  intensityLevel: 'moderate',
  keyFocus: [
    'Baseball Transfer',
    'Controlled Speed',
    'Power Maintenance',
    'Durability',
    'Competition Readiness',
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
            { name: 'Box Jump (moderate)', sets: '2×3', cue: 'Controlled takeoff, soft landing' },
            { name: 'Lateral Bound', sets: '2×3/side', cue: 'Push off laterally, stick each landing' },
            { name: 'SL Hop', sets: '2×3/side', cue: 'Quick off the ground, stick the landing' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'Speed Trap Bar Pull', sets: '3×3', cue: 'Maximal bar speed, fast hips', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'Speed Squat', sets: '3×4', cue: 'Max bar speed, controlled descent', scalesWithWeek: true },
            { name: 'SL Box Jump', sets: '2×3/side', cue: 'Single leg power, stick the landing' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'Speed RDL', sets: '3×4', cue: 'Fast hip hinge, snap hips through' },
            { name: 'Step-Up', sets: '3×5/side', cue: 'Drive through the foot, full extension' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Banded Glute Bridge', sets: '2×12', cue: 'Squeeze glutes, hold at top' },
            { name: 'Calf Raise', sets: '2×12', cue: 'Full ROM, pause at top' },
            { name: 'Tib Raise', sets: '2×12', cue: 'Dorsiflex fully, slow eccentric' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Rotational MB Throw', sets: '3×5/side', cue: 'Full body rotation, game-speed transfer' },
            { name: 'Pallof Press Walk', sets: '2×15yd/side', cue: 'Brace core, resist rotation while walking' },
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
            { name: 'MB Chest Pass', sets: '3×5', cue: 'Punch through the ball with full extension' },
            { name: 'MB Slam', sets: '2×5', cue: 'Full extension, slam hard' },
            { name: 'Plyo Push-Up', sets: '2×4', cue: 'Explosive hands off the ground' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'DB Push Press', sets: '3×3', cue: 'Fast dip and drive, full lockout', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'Speed Bench', sets: '3×4', cue: 'Max bar speed off the chest', scalesWithWeek: true },
            { name: 'Weighted Pull-Up', sets: '3×4', cue: 'Full stretch at bottom, pull to chest' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'DB Row', sets: '3×6', cue: 'Pull to hip, squeeze back' },
            { name: 'Incline Press', sets: '3×6', cue: 'Controlled descent, drive up' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Cable ER', sets: '2×12/side', cue: 'Elbow stays at shoulder height' },
            { name: 'Face Pull', sets: '2×12', cue: 'Pull to forehead, externally rotate' },
            { name: 'Prone Y Raise', sets: '2×8', cue: 'Thumbs up, squeeze lower traps' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Cable Rotation', sets: '2×8/side', cue: 'Drive rotation from hips' },
            { name: 'Plank', sets: '2×30s', cue: 'Squeeze glutes, brace core, breathe' },
          ],
        },
        {
          key: 'shoulder-durability',
          exercises: [
            { name: 'Cuban Rotation', sets: '2×8', cue: 'Light weight, strict form' },
            { name: 'KB Arm Bar', sets: '2×30s/side', cue: 'Pack shoulder, breathe into stretch' },
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
            { name: 'Broad Jump', sets: '2×3', cue: 'Full hip extension on takeoff' },
            { name: 'Lateral Bound', sets: '2×3/side', cue: 'Push off laterally, stick each landing' },
            { name: 'Tuck Jump', sets: '2×4', cue: 'Knees to chest, fast off ground' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'Hang Clean', sets: '3×2', cue: 'Fast elbows, controlled catch', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'Trap Bar DL (speed)', sets: '3×4', cue: 'Max bar speed, snap hips through', scalesWithWeek: true },
            { name: 'Box Jump', sets: '2×3', cue: 'Contrast — explode after deadlifts' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'Reverse Lunge', sets: '3×5/side', cue: 'Controlled step back, drive up' },
            { name: 'SL RDL', sets: '3×5/side', cue: 'Hinge at hip, long lever' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Hip Thrust', sets: '2×10', cue: 'Squeeze glutes hard at top' },
            { name: 'Leg Curl', sets: '2×10', cue: 'Squeeze hamstrings at top' },
            { name: 'Copenhagen Hold', sets: '2×10s/side', cue: 'Squeeze adductors, keep hips level' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Overhead Carry', sets: '2×25yd', cue: 'Ribs down, arms locked out' },
            { name: 'Med Ball Slam', sets: '3×4/side', cue: 'Full rotation, slam hard' },
          ],
        },
        {
          key: 'shoulder-durability',
          exercises: [
            { name: 'Prone Lower Trap Raise', sets: '2×8', cue: 'Thumbs up, squeeze lower traps' },
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
            { name: 'High Knees', sets: '2×20yd', cue: 'Quick turnover, stay on toes' },
          ],
        },
        {
          key: 'sprint-drills',
          exercises: [
            { name: 'Base Steal Start', sets: '3×3', cue: 'Explosive first step, low angle' },
            { name: 'Secondary Lead React', sets: '3×2', cue: 'React to cue, explosive crossover' },
            { name: 'First to Third Walkthrough', sets: '2×1', cue: 'Round the base, maintain speed' },
          ],
        },
        {
          key: 'sprint-work',
          exercises: [
            { name: 'Base Steal Sprint', sets: '4×1', cue: 'Game-speed secondary lead to steal' },
            { name: '60yd Sprint', sets: '3×1', cue: 'Full effort, maintain form' },
            { name: 'Decel Sprint', sets: '3×30yd', cue: 'Full sprint, controlled braking' },
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
      focus: 'Speed Maintenance + Controlled Transfer',
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
            { name: 'Crossover to Sprint (OF)', sets: '3×2', cue: 'Crossover step into full sprint' },
            { name: 'Lateral Start to Sprint (IF)', sets: '3×2', cue: 'Lateral shuffle into sprint' },
          ],
        },
        {
          key: 'sprint-work',
          exercises: [
            { name: 'Fly 20yd (controlled)', sets: '3×1', cue: 'Controlled max speed through zone' },
            { name: '40yd Sprint', sets: '3×1', cue: 'Full effort, smooth acceleration' },
            { name: 'Sprint-Brake-Sprint', sets: '3×30yd', cue: 'Full sprint, brake hard, reaccelerate' },
          ],
        },
        {
          key: 'sprint-cooldown',
          exercises: [
            { name: 'Pigeon Stretch', sets: '2×30s/side', cue: 'Relax into the stretch' },
            { name: '90/90 Breathing', sets: '2×60s', cue: 'Inhale through nose, exhale fully' },
            { name: 'Deep Breathing', sets: '2×60s', cue: 'Slow inhale, long exhale, full recovery' },
          ],
        },
      ],
    },
  ],
};

export default month;
