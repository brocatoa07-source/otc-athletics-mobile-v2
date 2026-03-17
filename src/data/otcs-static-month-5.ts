import type { OtcsMonthTemplate } from './otcs-types';

const month: OtcsMonthTemplate = {
  archetype: 'static',
  monthNumber: 5,
  phase: 'max-velocity',
  title: 'Max Velocity',
  subtitle: 'Sprint Speed + Elastic Power + Speed Expression',
  color: '#f59e0b',
  icon: 'speedometer-outline',
  volumeLevel: 'moderate',
  intensityLevel: 'high',
  keyFocus: [
    'Max Velocity',
    'Elastic Power',
    'Speed Expression',
    'Reactive Strength',
    'Speed Maintenance',
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
            { name: 'Depth Jump (reactive)', sets: '3×3', cue: 'Minimize ground contact, max height' },
            { name: 'Hurdle Hop (fast)', sets: '3×5', cue: 'Quick off the ground, stiff ankles' },
            { name: 'SL Lateral Bound', sets: '2×4/side', cue: 'Stick each landing, then explode' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'Speed Trap Bar Pull', sets: '3×3', cue: 'Rip the bar off the floor', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'Speed Squat (60% 1RM)', sets: '3×5', cue: 'Max bar speed on every rep', scalesWithWeek: true },
            { name: 'Box Jump', sets: '3×3', cue: 'Explode up, soft landing' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'Speed RDL', sets: '3×5', cue: 'Fast concentric, controlled eccentric' },
            { name: 'Reverse Lunge', sets: '3×6/side', cue: 'Step back with control, drive up fast' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Glute Bridge (banded)', sets: '2×15', cue: 'Squeeze glutes hard at top' },
            { name: 'Nordic Curl', sets: '2×4', cue: 'Slow eccentric, fight gravity' },
            { name: 'Calf Raise (fast)', sets: '2×12', cue: 'Explosive push-off each rep' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Med Ball Rotational Slam', sets: '3×5/side', cue: 'Rotate from hips, slam hard' },
            { name: 'Anti-Rotation Walk', sets: '2×15yd/side', cue: 'Resist cable pull, stay square' },
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
      focus: 'Upper Speed-Strength + Ballistic Power',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'Reactive Plyo Push-Up', sets: '3×5', cue: 'Hands off fast, minimal ground time' },
            { name: 'MB Chest Pass (max)', sets: '3×6', cue: 'Max distance each throw' },
            { name: 'MB Overhead Throw', sets: '2×5', cue: 'Full extension, throw behind you' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'Speed DB Push Press', sets: '3×3', cue: 'Dip and drive with max speed', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'Speed Bench (60% 1RM)', sets: '3×5', cue: 'Controlled down, explode up', scalesWithWeek: true },
            { name: 'Plyo Push-Up', sets: '3×4', cue: 'Contrast — max height each rep' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'Speed Row', sets: '3×6', cue: 'Fast pull, squeeze at top' },
            { name: 'Incline Press (speed)', sets: '3×6', cue: 'Explosive concentric' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Cable ER (speed)', sets: '2×12/side', cue: 'Quick rotation, controlled return' },
            { name: 'Band Face Pull', sets: '2×15', cue: 'Pull apart at the end' },
            { name: 'Lat Pulldown (speed)', sets: '2×8', cue: 'Fast pull, slow release' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Cable Rotation (speed)', sets: '2×8/side', cue: 'Fast rotation from hips' },
            { name: 'V-Ups', sets: '2×12', cue: 'Touch toes at top, control down' },
          ],
        },
        {
          key: 'shoulder-durability',
          exercises: [
            { name: 'Cuban Rotation', sets: '2×8', cue: 'Light weight, strict form' },
            { name: 'KB Arm Bar', sets: '2×30s/side', cue: 'Stabilize shoulder, breathe deeply' },
          ],
        },
      ],
    },
    {
      key: 'full-power',
      dayNumber: 3,
      label: 'Full Body Power',
      accent: '#ef4444',
      focus: 'Full Body Speed + Ballistic Transfer',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'Depth Jump to Broad Jump', sets: '3×3', cue: 'Absorb depth, redirect horizontally' },
            { name: 'Lateral Bound to Sprint', sets: '2×3/side', cue: 'Bound laterally then sprint out' },
            { name: 'Tuck Jump', sets: '2×5', cue: 'Knees to chest, fast off ground' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'Hang Snatch', sets: '3×3', cue: 'Fast turnover, catch overhead', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'Speed Trap Bar DL (60%)', sets: '3×5', cue: 'Max bar speed every rep', scalesWithWeek: true },
            { name: 'Broad Jump', sets: '3×3', cue: 'Max distance, stick landing' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'Speed Front Squat', sets: '3×4', cue: 'Fast out of the hole' },
            { name: 'Speed Step-Up', sets: '3×4/side', cue: 'Drive up explosively' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Leg Curl (fast)', sets: '2×10', cue: 'Fast curl, controlled return' },
            { name: 'Hip Thrust (banded)', sets: '2×12', cue: 'Squeeze hard at lockout' },
            { name: 'Tib Raise', sets: '2×12', cue: 'Full dorsiflexion each rep' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Rotational MB Throw (max effort)', sets: '3×5/side', cue: 'Max intent, rotate from hips' },
            { name: 'Farmer Carry', sets: '2×30yd', cue: 'Tall posture, grip hard' },
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
      focus: 'Max Velocity + Flying Sprints',
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
            { name: 'Flying Start', sets: '3×2', cue: 'Build into max velocity zone' },
          ],
        },
        {
          key: 'sprint-work',
          exercises: [
            { name: 'Flying 20yd (max)', sets: '4×1', cue: 'Max speed through the zone' },
            { name: 'Flying 30yd', sets: '3×1', cue: 'Hold top-end speed' },
            { name: '60yd Build-Up Sprint', sets: '2×1', cue: 'Smooth acceleration to full speed' },
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
      focus: 'Speed Endurance + Repeated Sprint Ability',
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
            { name: 'Flying Start Lateral', sets: '3×2/side', cue: 'Crossover into sprint' },
            { name: 'Base Steal Start', sets: '3×3', cue: 'Explosive first step, low angle' },
          ],
        },
        {
          key: 'sprint-work',
          exercises: [
            { name: '60yd Sprint', sets: '3×1', cue: 'Full effort, maintain form late' },
            { name: '40yd Sprint', sets: '4×1', cue: 'Aggressive start, hold top speed' },
            { name: 'Base Steal Sprint', sets: '4×1', cue: 'React and go, game-like intensity' },
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
