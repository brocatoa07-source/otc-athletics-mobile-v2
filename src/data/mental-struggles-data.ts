/* ────────────────────────────────────────────────
 * OTC MENTAL STRUGGLES DIAGNOSTIC DATA
 *
 * 10 questions · 4 options each
 * Each option maps to one of 8 mental struggle slugs.
 * Scoring: tally all 10 → output { primary, secondary } top 2.
 * ──────────────────────────────────────────────── */

export type MentalStruggle =
  | 'overthinking'
  | 'pregame_nerves'
  | 'confidence_drop'
  | 'emotional_frustration'
  | 'focus_loss'
  | 'fear_of_failure'
  | 'burnout'
  | 'imposter_syndrome';

export interface MentalStruggleData {
  slug: MentalStruggle;
  label: string;
  description: string;
  cue: string;
  tools: string[];
  areas: string[];
  color: string;
}

export interface MentalDiagnosticResult {
  primary: MentalStruggle;
  secondary: MentalStruggle;
}

export interface MentalStruggleOption {
  letter: 'a' | 'b' | 'c' | 'd';
  text: string;
  struggle: MentalStruggle;
}

export interface MentalStruggleQuestion {
  q: string;
  options: [MentalStruggleOption, MentalStruggleOption, MentalStruggleOption, MentalStruggleOption];
}

export const MENTAL_STRUGGLES: Record<MentalStruggle, MentalStruggleData> = {
  overthinking: {
    slug: 'overthinking',
    label: 'Overthinking',
    description:
      'Your mind races at the plate. Instead of competing, you\'re analyzing every pitch, every mechanic, every outcome. You know what to do — but you can\'t stop thinking long enough to do it.',
    cue: 'See ball, hit ball. Trust your body.',
    tools: ['4-7-8 Breathing', 'Cue Word Reset', 'Grounding 5-4-3-2-1'],
    areas: ['Focus', 'Awareness'],
    color: '#3b82f6',
  },
  pregame_nerves: {
    slug: 'pregame_nerves',
    label: 'Pre-Game Nerves',
    description:
      'Before the game even starts, your body is already tense. Butterflies, tight chest, racing thoughts — by the time you step to the plate, you\'ve already burned half your energy.',
    cue: 'Nerves mean you care. Channel them.',
    tools: ['Box Breathing', 'Arrival Reset', 'Visualization Protocol'],
    areas: ['Pre-Game Routine', 'Emotional Control'],
    color: '#8b5cf6',
  },
  confidence_drop: {
    slug: 'confidence_drop',
    label: 'Confidence Drop',
    description:
      'When things go wrong, your confidence disappears. One bad at-bat becomes a slump in your mind. You start doubting your ability and playing not to fail instead of playing to win.',
    cue: 'Confidence is built, not given. Stack proof.',
    tools: ['Proof Stacking', 'Power Statement', 'Owned Confidence Check'],
    areas: ['Confidence', 'Resilience'],
    color: '#f59e0b',
  },
  emotional_frustration: {
    slug: 'emotional_frustration',
    label: 'Emotional Frustration',
    description:
      'Frustration takes over after mistakes. You slam equipment, sulk in the dugout, or shut down entirely. The emotion controls you instead of you controlling it.',
    cue: 'Feel it, release it, compete again.',
    tools: ['Body Release Scan', 'Anger-to-Energy Conversion', 'Between-Pitch Reset'],
    areas: ['Emotional Control', 'In-Game Reset'],
    color: '#ef4444',
  },
  focus_loss: {
    slug: 'focus_loss',
    label: 'Focus Loss',
    description:
      'Your attention drifts — to the scoreboard, to the last play, to the scouts in the stands. You can\'t lock in pitch-to-pitch and your at-bats feel scattered.',
    cue: 'One pitch. This pitch. Lock in.',
    tools: ['Spotlight Drill', 'Pitch-to-Pitch Reset', 'Anchor Breathing'],
    areas: ['Focus', 'In-Game Reset'],
    color: '#06b6d4',
  },
  fear_of_failure: {
    slug: 'fear_of_failure',
    label: 'Fear of Failure',
    description:
      'You\'re afraid to fail — afraid of strikeouts, errors, looking bad. This fear makes you hesitate, play small, and avoid the moments that could make you great.',
    cue: 'Attack. Failure is training data.',
    tools: ['Failure Reframe', 'Commitment Cue', 'Pressure Flip'],
    areas: ['Confidence', 'Resilience'],
    color: '#e11d48',
  },
  burnout: {
    slug: 'burnout',
    label: 'Burnout',
    description:
      'The game feels like a job. You\'re going through the motions — showing up but not competing. Your passion is fading and you can\'t find the energy you used to have.',
    cue: 'Remember why you play. Compete with purpose.',
    tools: ['Gratitude Moment', 'Purpose Reset', 'Play Like a Kid Drill'],
    areas: ['Awareness', 'Post-Game Reflection'],
    color: '#64748b',
  },
  imposter_syndrome: {
    slug: 'imposter_syndrome',
    label: 'Imposter Syndrome',
    description:
      'You feel like you don\'t belong — like everyone else is better and it\'s only a matter of time before people figure it out. You downplay your success and amplify your failures.',
    cue: 'You earned your spot. Own it.',
    tools: ['Proof Stacking', 'Identity Statement', 'Ownership Check'],
    areas: ['Confidence', 'Accountability'],
    color: '#a855f7',
  },
};

export const MENTAL_STRUGGLE_QUESTIONS: MentalStruggleQuestion[] = [
  {
    q: 'During at-bats, your mind is usually:',
    options: [
      { letter: 'a', text: 'Racing with thoughts and adjustments', struggle: 'overthinking' },
      { letter: 'b', text: 'Distracted by things around me', struggle: 'focus_loss' },
      { letter: 'c', text: 'Worried about the outcome', struggle: 'fear_of_failure' },
      { letter: 'd', text: 'Frustrated from earlier in the game', struggle: 'emotional_frustration' },
    ],
  },
  {
    q: 'Before games, you feel:',
    options: [
      { letter: 'a', text: 'Nervous and tense', struggle: 'pregame_nerves' },
      { letter: 'b', text: 'Like I don\'t really want to be here', struggle: 'burnout' },
      { letter: 'c', text: 'Like I don\'t belong at this level', struggle: 'imposter_syndrome' },
      { letter: 'd', text: 'Worried about performing badly', struggle: 'fear_of_failure' },
    ],
  },
  {
    q: 'After a strikeout, you typically:',
    options: [
      { letter: 'a', text: 'Replay what went wrong over and over', struggle: 'overthinking' },
      { letter: 'b', text: 'Get angry and carry it into the field', struggle: 'emotional_frustration' },
      { letter: 'c', text: 'Lose confidence for the next at-bat', struggle: 'confidence_drop' },
      { letter: 'd', text: 'Feel embarrassed — like everyone noticed', struggle: 'imposter_syndrome' },
    ],
  },
  {
    q: 'When scouts or coaches are watching, you:',
    options: [
      { letter: 'a', text: 'Think about what they\'re writing down', struggle: 'overthinking' },
      { letter: 'b', text: 'Get tight and nervous', struggle: 'pregame_nerves' },
      { letter: 'c', text: 'Try too hard and press', struggle: 'fear_of_failure' },
      { letter: 'd', text: 'Lose focus on what I\'m doing', struggle: 'focus_loss' },
    ],
  },
  {
    q: 'During a slump, you feel:',
    options: [
      { letter: 'a', text: 'Like my confidence disappears', struggle: 'confidence_drop' },
      { letter: 'b', text: 'Frustrated and angry with myself', struggle: 'emotional_frustration' },
      { letter: 'c', text: 'Like I\'m not cut out for this', struggle: 'imposter_syndrome' },
      { letter: 'd', text: 'Tired and uninterested', struggle: 'burnout' },
    ],
  },
  {
    q: 'Between pitches, your mind usually:',
    options: [
      { letter: 'a', text: 'Wanders to other things', struggle: 'focus_loss' },
      { letter: 'b', text: 'Overthinks the pitch sequence', struggle: 'overthinking' },
      { letter: 'c', text: 'Stays stuck on the last pitch', struggle: 'emotional_frustration' },
      { letter: 'd', text: 'Worries about the count', struggle: 'fear_of_failure' },
    ],
  },
  {
    q: 'Your biggest mental challenge is:',
    options: [
      { letter: 'a', text: 'Getting out of my own head', struggle: 'overthinking' },
      { letter: 'b', text: 'Handling pressure situations', struggle: 'pregame_nerves' },
      { letter: 'c', text: 'Believing in myself consistently', struggle: 'confidence_drop' },
      { letter: 'd', text: 'Staying locked in for a full game', struggle: 'focus_loss' },
    ],
  },
  {
    q: 'When you fail in a big moment, you:',
    options: [
      { letter: 'a', text: 'Feel like a fraud', struggle: 'imposter_syndrome' },
      { letter: 'b', text: 'Lose all confidence', struggle: 'confidence_drop' },
      { letter: 'c', text: 'Blow up emotionally', struggle: 'emotional_frustration' },
      { letter: 'd', text: 'Shut down and go quiet', struggle: 'burnout' },
    ],
  },
  {
    q: 'In the on-deck circle, you\'re usually:',
    options: [
      { letter: 'a', text: 'Running through a mental checklist', struggle: 'overthinking' },
      { letter: 'b', text: 'Feeling my heart race', struggle: 'pregame_nerves' },
      { letter: 'c', text: 'Scared of striking out', struggle: 'fear_of_failure' },
      { letter: 'd', text: 'Not fully present', struggle: 'focus_loss' },
    ],
  },
  {
    q: 'Your relationship with the game right now feels:',
    options: [
      { letter: 'a', text: 'Like a mental battle I\'m losing', struggle: 'overthinking' },
      { letter: 'b', text: 'Like a rollercoaster of emotions', struggle: 'emotional_frustration' },
      { letter: 'c', text: 'Like I\'m just going through the motions', struggle: 'burnout' },
      { letter: 'd', text: 'Like I have to prove I belong', struggle: 'imposter_syndrome' },
    ],
  },
];

export function scoreMentalStruggles(
  answers: ('a' | 'b' | 'c' | 'd')[],
): MentalDiagnosticResult {
  const tally: Record<MentalStruggle, number> = {
    overthinking: 0, pregame_nerves: 0, confidence_drop: 0,
    emotional_frustration: 0, focus_loss: 0, fear_of_failure: 0,
    burnout: 0, imposter_syndrome: 0,
  };
  answers.forEach((letter, idx) => {
    const question = MENTAL_STRUGGLE_QUESTIONS[idx];
    const option = question.options.find((o) => o.letter === letter);
    if (option) tally[option.struggle]++;
  });
  const sorted = (Object.entries(tally) as [MentalStruggle, number][])
    .sort((a, b) => b[1] - a[1]);
  return { primary: sorted[0][0], secondary: sorted[1][0] };
}
