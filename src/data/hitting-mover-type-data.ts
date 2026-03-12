/* ────────────────────────────────────────────────
 * OTC MOVER TYPE QUIZ DATA
 *
 * 8 questions · 4 options each
 * Each option letter maps directly to a mover type slug.
 * Scoring: tally slugs, highest count wins.
 * ──────────────────────────────────────────────── */

export type MoverType = 'torque' | 'ground_force' | 'flow' | 'separation';

export interface MoverTypeData {
  slug: MoverType;
  name: string;
  tagline: string;
  description: string;
  primaryCue: string;
  mlbComps: string[];
  color: string;
}

export interface MoverTypeOption {
  letter: 'a' | 'b' | 'c' | 'd';
  text: string;
  moverType: MoverType;
}

export interface MoverTypeQuestion {
  q: string;
  options: [MoverTypeOption, MoverTypeOption, MoverTypeOption, MoverTypeOption];
}

export const MOVER_TYPES: Record<MoverType, MoverTypeData> = {
  torque: {
    slug: 'torque',
    name: 'Torque Mover',
    tagline: 'Power through rotation speed',
    description:
      'Your power comes primarily from how fast you rotate. Quick hips, compact swing, and sharp rotational force are your weapons. You stay centered and let the turn do the work.',
    primaryCue: 'Rotate fast while staying centered.',
    mlbComps: ['Mookie Betts', 'José Ramírez', 'Alex Bregman'],
    color: '#ef4444',
  },
  ground_force: {
    slug: 'ground_force',
    name: 'Ground Force Mover',
    tagline: 'Power through the ground',
    description:
      'You generate force by pushing hard into the ground and transferring that energy up through your legs, hips, and into the barrel. Your swing feels most powerful when your lower half is fully engaged.',
    primaryCue: 'Drive the ground to drive the swing.',
    mlbComps: ['Aaron Judge', 'Giancarlo Stanton', 'Vladimir Guerrero Jr.'],
    color: '#3b82f6',
  },
  flow: {
    slug: 'flow',
    name: 'Flow Mover',
    tagline: 'Power through rhythm and connection',
    description:
      'Your best swings come when everything flows together smoothly. Rhythm, connection, and timing are your strengths. You hit your peak when your body is working as one unit from heel to hand.',
    primaryCue: 'Let rhythm guide the swing.',
    mlbComps: ['Freddie Freeman', 'Corey Seager', 'Christian Yelich'],
    color: '#22c55e',
  },
  separation: {
    slug: 'separation',
    name: 'Separation Mover',
    tagline: 'Power through stretch and whip',
    description:
      'You create power by maximizing the stretch between your hips and shoulders before rotating. The bigger the separation, the more whip you generate through the zone. Elite hip-shoulder separation is your signature move.',
    primaryCue: 'Create stretch before rotation.',
    mlbComps: ['Bryce Harper', 'Fernando Tatis Jr.', 'Juan Soto'],
    color: '#a855f7',
  },
};

export const MOVER_TYPE_QUESTIONS: MoverTypeQuestion[] = [
  {
    q: 'When you hit the ball your best, what does it feel like?',
    options: [
      { letter: 'a', text: 'Quick rotation', moverType: 'torque' },
      { letter: 'b', text: 'Driving through the ground', moverType: 'ground_force' },
      { letter: 'c', text: 'Smooth and connected', moverType: 'flow' },
      { letter: 'd', text: 'Stretch then snap', moverType: 'separation' },
    ],
  },
  {
    q: 'What part of your body feels most responsible for power?',
    options: [
      { letter: 'a', text: 'Hips and core rotation', moverType: 'torque' },
      { letter: 'b', text: 'Legs pushing into the ground', moverType: 'ground_force' },
      { letter: 'c', text: 'Whole body working together', moverType: 'flow' },
      { letter: 'd', text: 'The stretch between hips and shoulders', moverType: 'separation' },
    ],
  },
  {
    q: 'What does your stride usually look like?',
    options: [
      { letter: 'a', text: 'Small, controlled move', moverType: 'torque' },
      { letter: 'b', text: 'Bigger move into the ground', moverType: 'ground_force' },
      { letter: 'c', text: 'Smooth rhythm step', moverType: 'flow' },
      { letter: 'd', text: 'Coil then explode', moverType: 'separation' },
    ],
  },
  {
    q: 'When you watch video of your swing, you notice:',
    options: [
      { letter: 'a', text: 'Quick rotation', moverType: 'torque' },
      { letter: 'b', text: 'Strong lower half drive', moverType: 'ground_force' },
      { letter: 'c', text: 'Smooth tempo', moverType: 'flow' },
      { letter: 'd', text: 'Big hip-shoulder separation', moverType: 'separation' },
    ],
  },
  {
    q: 'When your swing feels off, what usually fixes it?',
    options: [
      { letter: 'a', text: 'Rotating harder', moverType: 'torque' },
      { letter: 'b', text: 'Driving into the ground', moverType: 'ground_force' },
      { letter: 'c', text: 'Slowing down and staying smooth', moverType: 'flow' },
      { letter: 'd', text: 'Creating more stretch', moverType: 'separation' },
    ],
  },
  {
    q: 'Your natural rhythm at the plate is:',
    options: [
      { letter: 'a', text: 'Quick and explosive', moverType: 'torque' },
      { letter: 'b', text: 'Strong and powerful', moverType: 'ground_force' },
      { letter: 'c', text: 'Smooth and controlled', moverType: 'flow' },
      { letter: 'd', text: 'Coiled and explosive', moverType: 'separation' },
    ],
  },
  {
    q: 'When you generate power it feels like:',
    options: [
      { letter: 'a', text: 'Torque', moverType: 'torque' },
      { letter: 'b', text: 'Ground force', moverType: 'ground_force' },
      { letter: 'c', text: 'Flow', moverType: 'flow' },
      { letter: 'd', text: 'Stretch and whip', moverType: 'separation' },
    ],
  },
  {
    q: 'Your swing style is closest to:',
    options: [
      { letter: 'a', text: 'Compact and quick', moverType: 'torque' },
      { letter: 'b', text: 'Strong and powerful', moverType: 'ground_force' },
      { letter: 'c', text: 'Smooth and rhythmic', moverType: 'flow' },
      { letter: 'd', text: 'Elastic and explosive', moverType: 'separation' },
    ],
  },
];

export function scoreMoverTypeQuiz(answers: ('a' | 'b' | 'c' | 'd')[]): MoverType {
  const tally: Record<MoverType, number> = {
    torque: 0, ground_force: 0, flow: 0, separation: 0,
  };
  answers.forEach((letter, idx) => {
    const question = MOVER_TYPE_QUESTIONS[idx];
    const option = question.options.find((o) => o.letter === letter);
    if (option) tally[option.moverType]++;
  });
  return (Object.entries(tally) as [MoverType, number][])
    .sort((a, b) => b[1] - a[1])[0][0];
}
