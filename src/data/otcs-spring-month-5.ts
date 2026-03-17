import type { OtcsMonthTemplate } from './otcs-types';

const month: OtcsMonthTemplate = {
  monthNumber: 5,
  archetype: 'spring',
  phase: 'max-velocity',
  title: 'Max Velocity',
  subtitle: 'Speed Expression + Controlled Power + Elastic Strength',
  color: '#f59e0b',
  icon: 'speedometer-outline',
  volumeLevel: 'moderate',
  intensityLevel: 'high',
  keyFocus: [
    'Speed Expression',
    'Controlled Velocity',
    'Elastic Strength',
    'Sprint Mechanics',
    'Force Application',
  ],
  days: [
    {
      key: 'lower-accel',
      dayNumber: 1,
      label: 'Lower + Accel',
      accent: '#22c55e',
      focus: 'Lower Speed-Strength + Controlled Power',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'Depth Jump (reactive)', sets: '3×3', cue: 'Minimize ground contact, explode up' },
            { name: 'Hurdle Hop', sets: '3×5', cue: 'Quick off the ground, stiff ankles' },
            { name: 'Lateral Bound', sets: '2×4/side', cue: 'Push off laterally, stick each landing' },
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
            { name: 'Speed Squat (60-65% 1RM)', sets: '3×5', cue: 'Max bar speed, controlled descent', scalesWithWeek: true },
            { name: 'Box Jump', sets: '3×3', cue: 'Explode off the floor, stick landing' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'Speed RDL', sets: '3×5', cue: 'Fast hip hinge, snap hips through' },
            { name: 'Reverse Lunge (speed)', sets: '3×6/side', cue: 'Quick step back, explosive drive up' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Glute Bridge (banded)', sets: '2×15', cue: 'Squeeze glutes, hold at top' },
            { name: 'Nordic Curl', sets: '2×4', cue: 'Control the eccentric fully' },
            { name: 'Calf Raise (fast)', sets: '2×12', cue: 'Quick push off, minimize ground time' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Med Ball Rotational Slam (speed)', sets: '3×5/side', cue: 'Max rotational velocity from hips' },
            { name: 'Anti-Rotation Walk', sets: '2×15yd/side', cue: 'Brace core, resist rotation while walking' },
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
      focus: 'Upper Speed-Strength + Ballistic Control',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'Reactive Plyo Push-Up', sets: '3×5', cue: 'Fast hands, minimize ground contact' },
            { name: 'MB Chest Pass (speed)', sets: '3×6', cue: 'Punch through the ball, max velocity' },
            { name: 'MB Slam', sets: '2×5', cue: 'Full extension, slam hard' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'Speed DB Push Press', sets: '3×3', cue: 'Fast dip and drive, max acceleration', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'Speed Bench (60-65%)', sets: '3×5', cue: 'Max bar speed off the chest', scalesWithWeek: true },
            { name: 'Plyo Push-Up', sets: '3×4', cue: 'Contrast — explosive height each rep' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'Speed Row', sets: '3×6', cue: 'Explosive pull, controlled return' },
            { name: 'Speed Incline Press', sets: '3×6', cue: 'Fast concentric, controlled eccentric' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Cable ER (speed)', sets: '2×12/side', cue: 'Quick rotation, elbow pinned' },
            { name: 'Band Face Pull', sets: '2×15', cue: 'Pull apart and externally rotate' },
            { name: 'Lat Pulldown', sets: '2×8', cue: 'Pull to upper chest, squeeze lats' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Cable Rotation (speed)', sets: '2×8/side', cue: 'Max rotational speed from hips' },
            { name: 'V-Ups', sets: '2×12', cue: 'Touch toes at top, control the negative' },
          ],
        },
        {
          key: 'shoulder-durability',
          exercises: [
            { name: 'Cuban Rotation', sets: '2×8', cue: 'Light weight, strict form' },
            { name: 'KB Arm Bar', sets: '2×30s/side', cue: 'Pack shoulder, breathe into stretch' },
          ],
        },
      ],
    },
    {
      key: 'full-power',
      dayNumber: 3,
      label: 'Full Body Power',
      accent: '#ef4444',
      focus: 'Full Body Speed + Controlled Ballistics',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'Depth Jump to Broad Jump', sets: '3×3', cue: 'Absorb depth, redirect horizontal' },
            { name: 'Lateral Bound Sprint', sets: '2×3/side', cue: 'Bound laterally then sprint forward' },
            { name: 'Tuck Jump', sets: '2×5', cue: 'Knees to chest, fast off ground' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'Hang Snatch (controlled)', sets: '3×3', cue: 'Fast pull, controlled catch overhead', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'Speed Trap Bar DL (60%)', sets: '3×5', cue: 'Max bar speed, snap hips through', scalesWithWeek: true },
            { name: 'Broad Jump', sets: '3×3', cue: 'Contrast — max distance each rep' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'Speed Front Squat', sets: '3×4', cue: 'Fast descent, explode out of the hole' },
            { name: 'Speed Step-Up', sets: '3×4/side', cue: 'Drive through the foot, explosive push' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Leg Curl (fast)', sets: '2×10', cue: 'Quick contraction, controlled return' },
            { name: 'Hip Thrust (banded)', sets: '2×12', cue: 'Drive hips up against the band' },
            { name: 'Tib Raise', sets: '2×12', cue: 'Dorsiflex fully, slow eccentric' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Rotational MB Throw (max effort)', sets: '3×5/side', cue: 'Full body rotation, max velocity' },
            { name: 'Farmer Carry', sets: '2×30yd', cue: 'Tall posture, brace core, quick steps' },
          ],
        },
        {
          key: 'shoulder-durability',
          exercises: [
            { name: 'Prone Y Raise', sets: '2×10', cue: 'Thumbs up, squeeze lower traps' },
            { name: 'Band W Raises', sets: '2×12', cue: 'Retract and externally rotate' },
          ],
        },
      ],
    },
    {
      key: 'sprint-1',
      dayNumber: 4,
      label: 'Sprint Day 1',
      accent: '#f59e0b',
      focus: 'Max Velocity + Controlled Speed',
      type: 'sprint',
      blocks: [
        {
          key: 'sprint-warmup',
          exercises: [
            { name: 'A-Run', sets: '2×20yd', cue: 'Continuous cycling, tall posture' },
            { name: 'Build-Up Stride', sets: '2×50yd', cue: 'Build to 85%, smooth mechanics' },
            { name: 'Straight-Leg Bound', sets: '2×20yd', cue: 'Stiff ankle, quick ground contact' },
          ],
        },
        {
          key: 'sprint-drills',
          exercises: [
            { name: 'Wicket Run', sets: '3×30yd', cue: 'High knees, quick ground contact' },
            { name: 'In-Out Sprint', sets: '3×40yd', cue: 'Accelerate and float alternately' },
            { name: 'Flying Start', sets: '3×2', cue: 'Rolling start into max velocity' },
          ],
        },
        {
          key: 'sprint-work',
          exercises: [
            { name: 'Flying 20yd (95%)', sets: '4×1', cue: 'Near-max speed through the zone' },
            { name: 'Flying 30yd', sets: '3×1', cue: 'Hold top-end speed longer' },
            { name: '60yd Build-Up', sets: '2×1', cue: 'Smooth acceleration to full speed' },
          ],
        },
        {
          key: 'sprint-cooldown',
          exercises: [
            { name: 'Hip Flexor Stretch', sets: '2×30s/side', cue: 'Squeeze glute, push hips forward' },
            { name: 'Hamstring Stretch', sets: '2×30s/side', cue: 'Straight leg, hinge at hips' },
            { name: '90/90 Breathing', sets: '2×60s', cue: 'Inhale through nose, exhale fully' },
          ],
        },
      ],
    },
    {
      key: 'sprint-2',
      dayNumber: 5,
      label: 'Sprint Day 2',
      accent: '#8b5cf6',
      focus: 'Speed Endurance + Decel at Speed',
      type: 'sprint',
      blocks: [
        {
          key: 'sprint-warmup',
          exercises: [
            { name: 'Carioca', sets: '2×20yd', cue: 'Open hips, stay light on feet' },
            { name: 'Lateral Shuffle', sets: '2×20yd', cue: 'Low hips, push off outside foot' },
            { name: 'A-Skip', sets: '2×20yd', cue: 'Tall posture, drive knee up' },
          ],
        },
        {
          key: 'sprint-drills',
          exercises: [
            { name: 'Flying Lateral Start', sets: '3×2/side', cue: 'Crossover step into full sprint' },
            { name: 'Base Steal Start', sets: '3×3', cue: 'Explosive first step, low angle' },
          ],
        },
        {
          key: 'sprint-work',
          exercises: [
            { name: '60yd Sprint (controlled)', sets: '3×1', cue: 'Build to 90%, hold form' },
            { name: 'Sprint-Brake-Sprint', sets: '4×40yd', cue: 'Full sprint, brake hard, reaccelerate' },
            { name: 'Base Steal Sprint', sets: '4×1', cue: 'Game-speed secondary lead to steal' },
          ],
        },
        {
          key: 'sprint-cooldown',
          exercises: [
            { name: 'Pigeon Stretch', sets: '2×30s/side', cue: 'Relax into the stretch' },
            { name: 'Quad Stretch', sets: '2×30s/side', cue: 'Squeeze glute, push hips forward' },
            { name: 'Foam Roll', sets: '3min', cue: 'Quads, hamstrings, hip flexors' },
          ],
        },
      ],
    },
  ],
};

export default month;
