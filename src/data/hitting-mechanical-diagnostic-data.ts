/* ────────────────────────────────────────────────
 * OTC MECHANICAL DIAGNOSTIC DATA
 *
 * 10 questions · 4 options each
 * Each option maps to one of 6 mechanical issue slugs.
 * Scoring: tally all 10 → output { primary, secondary } top 2 issues.
 * ──────────────────────────────────────────────── */

export type MechanicalIssue =
  | 'timing'
  | 'early_rotation'
  | 'disconnection'
  | 'swing_plane'
  | 'weight_shift'
  | 'barrel_path';

export interface MechanicalIssueData {
  slug: MechanicalIssue;
  label: string;
  description: string;
  cue: string;
  drills: string[];
  /** Drill library areas most relevant to fixing this issue */
  areas: string[];
  color: string;
}

export interface MechanicalDiagnosticResult {
  primary: MechanicalIssue;
  secondary: MechanicalIssue;
}

export interface MechanicalOption {
  letter: 'a' | 'b' | 'c' | 'd';
  text: string;
  issue: MechanicalIssue;
}

export interface MechanicalQuestion {
  q: string;
  options: [MechanicalOption, MechanicalOption, MechanicalOption, MechanicalOption];
}

export const MECHANICAL_ISSUES: Record<MechanicalIssue, MechanicalIssueData> = {
  timing: {
    slug: 'timing',
    label: 'Timing',
    description: 'Your load and stride timing are off. You struggle to sync up with pitch speed and miss your spot consistently.',
    cue: 'Get your foot down early, let the ball travel.',
    drills: ['Heel Load Drill', 'Pause Launch Drill', 'Swing at Release', 'Step Back Drill', 'Quick Pitch Toss'],
    areas: ['Forward Move', 'Launch Position'],
    color: '#e11d48',
  },
  early_rotation: {
    slug: 'early_rotation',
    label: 'Early Rotation',
    description: 'Your hips are spinning before your weight shift is complete. The barrel is dragging through and you lose power and direction.',
    cue: 'Keep the barrel back — let the hips load first.',
    drills: ['Connection Ball Drill', 'Opposite Field Tee Drill', 'Hip Lock Drill', 'Directional Med Ball Throws', 'Inside-Out Front Toss'],
    areas: ['Connection', 'Forward Move'],
    color: '#f97316',
  },
  disconnection: {
    slug: 'disconnection',
    label: 'Disconnection',
    description: 'Your arms are separating from your body rotation. The swing is all arms and you lose the chain of force from the ground up.',
    cue: 'Stay connected — body first, barrel follows.',
    drills: ['Connection Band Drill', 'Fence Dry Swings', 'One-Arm Tee Drill', 'Hip-to-Hand Sequence', 'Tuck-and-Turn'],
    areas: ['Connection', 'Barrel Turn'],
    color: '#8b5cf6',
  },
  swing_plane: {
    slug: 'swing_plane',
    label: 'Swing Plane',
    description: 'Your barrel is not matching the pitch plane. You are either uppercutting severely or coming in too steep, leading to pop-ups and ground balls.',
    cue: 'Match the pitch plane — stay on it longer.',
    drills: ['High Tee Series', 'Top Hand Tee (Bergman)', 'Deep Ball Tee', 'Flat Bat Drill', 'Line Drive Toss'],
    areas: ['Posture & Direction', 'Barrel Turn'],
    color: '#0891b2',
  },
  weight_shift: {
    slug: 'weight_shift',
    label: 'Weight Shift',
    description: 'You are drifting forward with your weight or not getting it back into your hips. Your balance is off and you lose your launching position.',
    cue: 'Drive back hip forward before the barrel moves.',
    drills: ['Stride Pause Drill', 'Hover Stride Drill', 'Back Hip Drive', 'One-Legged Swing', 'Balance Point Holds'],
    areas: ['Forward Move', 'Launch Position'],
    color: '#16a34a',
  },
  barrel_path: {
    slug: 'barrel_path',
    label: 'Barrel Control',
    description: 'Your barrel is cutting across the ball or taking a long path to the zone. You miss pitches you should crush and go foul a lot.',
    cue: 'Keep the barrel above the ball until contact.',
    drills: ['Short to Long Toss', 'Inside Pitch Tee', 'Bat Path Drill', 'Command Drill', 'Slow Motion BP'],
    areas: ['Barrel Turn', 'Extension'],
    color: '#ca8a04',
  },
};

export const MECHANICAL_QUESTIONS: MechanicalQuestion[] = [
  {
    q: 'When you miss a fastball you usually:',
    options: [
      { letter: 'a', text: 'Swing late', issue: 'timing' },
      { letter: 'b', text: 'Roll it over', issue: 'early_rotation' },
      { letter: 'c', text: 'Swing under it', issue: 'swing_plane' },
      { letter: 'd', text: 'Miss completely', issue: 'disconnection' },
    ],
  },
  {
    q: 'What does your worst contact usually look like?',
    options: [
      { letter: 'a', text: 'Weak ground balls', issue: 'early_rotation' },
      { letter: 'b', text: 'Pop ups', issue: 'swing_plane' },
      { letter: 'c', text: 'Weak opposite field contact', issue: 'disconnection' },
      { letter: 'd', text: 'Late foul balls', issue: 'timing' },
    ],
  },
  {
    q: 'When facing offspeed pitches you usually:',
    options: [
      { letter: 'a', text: 'Swing early', issue: 'timing' },
      { letter: 'b', text: 'Lunge forward', issue: 'weight_shift' },
      { letter: 'c', text: 'Freeze and take it', issue: 'timing' },
      { letter: 'd', text: 'Miss under it', issue: 'swing_plane' },
    ],
  },
  {
    q: 'Your stride tends to be:',
    options: [
      { letter: 'a', text: 'Controlled', issue: 'barrel_path' },
      { letter: 'b', text: 'Too big', issue: 'weight_shift' },
      { letter: 'c', text: 'Inconsistent', issue: 'timing' },
      { letter: 'd', text: 'Almost none', issue: 'disconnection' },
    ],
  },
  {
    q: 'When your swing feels wrong you feel:',
    options: [
      { letter: 'a', text: 'Weight drifting forward', issue: 'weight_shift' },
      { letter: 'b', text: 'Hips spinning open', issue: 'early_rotation' },
      { letter: 'c', text: 'Swing feels all arms', issue: 'disconnection' },
      { letter: 'd', text: 'Barrel cutting across the ball', issue: 'barrel_path' },
    ],
  },
  {
    q: 'Most of your ground balls go:',
    options: [
      { letter: 'a', text: 'Pull side', issue: 'early_rotation' },
      { letter: 'b', text: 'Up the middle', issue: 'barrel_path' },
      { letter: 'c', text: 'Opposite field', issue: 'timing' },
      { letter: 'd', text: 'Straight down', issue: 'swing_plane' },
    ],
  },
  {
    q: 'Against high velocity you usually:',
    options: [
      { letter: 'a', text: 'Are late', issue: 'timing' },
      { letter: 'b', text: 'Rush your swing', issue: 'early_rotation' },
      { letter: 'c', text: 'Swing under it', issue: 'swing_plane' },
      { letter: 'd', text: 'Miss completely', issue: 'disconnection' },
    ],
  },
  {
    q: 'Your best hits usually go:',
    options: [
      { letter: 'a', text: 'Pull side', issue: 'early_rotation' },
      { letter: 'b', text: 'Middle of the field', issue: 'barrel_path' },
      { letter: 'c', text: 'Opposite field', issue: 'timing' },
      { letter: 'd', text: 'Random — no pattern', issue: 'disconnection' },
    ],
  },
  {
    q: 'When you hit fly balls they usually:',
    options: [
      { letter: 'a', text: 'Carry well', issue: 'barrel_path' },
      { letter: 'b', text: 'Die in the air', issue: 'swing_plane' },
      { letter: 'c', text: 'Go foul', issue: 'barrel_path' },
      { letter: 'd', text: 'Go opposite field', issue: 'timing' },
    ],
  },
  {
    q: 'Your swing often feels:',
    options: [
      { letter: 'a', text: 'Smooth', issue: 'barrel_path' },
      { letter: 'b', text: 'Violent', issue: 'early_rotation' },
      { letter: 'c', text: 'Armsy', issue: 'disconnection' },
      { letter: 'd', text: 'Rushed', issue: 'timing' },
    ],
  },
];

export function scoreMechanicalDiagnostic(
  answers: ('a' | 'b' | 'c' | 'd')[]
): MechanicalDiagnosticResult {
  const tally: Record<MechanicalIssue, number> = {
    timing: 0, early_rotation: 0, disconnection: 0,
    swing_plane: 0, weight_shift: 0, barrel_path: 0,
  };
  answers.forEach((letter, idx) => {
    const question = MECHANICAL_QUESTIONS[idx];
    const option = question.options.find((o) => o.letter === letter);
    if (option) tally[option.issue]++;
  });
  const sorted = (Object.entries(tally) as [MechanicalIssue, number][])
    .sort((a, b) => b[1] - a[1]);
  return { primary: sorted[0][0], secondary: sorted[1][0] };
}
