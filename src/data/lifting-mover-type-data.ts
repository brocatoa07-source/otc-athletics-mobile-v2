/* ────────────────────────────────────────────────
 * LIFTING MOVER TYPE DATA
 *
 * 20 questions · 4 options each
 * Determines how the athlete naturally expresses strength:
 *   Static  — maximal strength, grinding, powerlifter profile
 *   Spring  — explosive power, reactive, fast-twitch dominant
 *   Hybrid  — balanced; adapts across the force-velocity curve
 * ──────────────────────────────────────────────── */

export type LiftingMoverType = 'static' | 'spring' | 'hybrid';

export interface LiftingMoverTypeData {
  slug: LiftingMoverType;
  name: string;
  tagline: string;
  description: string;
  primaryCue: string;
  trainingFocus: string[];
  color: string;
}

export interface LiftingMoverOption {
  letter: 'a' | 'b' | 'c' | 'd';
  text: string;
  moverType: LiftingMoverType;
}

export interface LiftingMoverQuestion {
  q: string;
  options: [LiftingMoverOption, LiftingMoverOption, LiftingMoverOption, LiftingMoverOption];
}

export const LIFTING_MOVER_TYPES: Record<LiftingMoverType, LiftingMoverTypeData> = {
  static: {
    slug: 'static',
    name: 'Static Mover',
    tagline: 'Strength through grinding',
    description:
      'You are built to move heavy weight deliberately. Your power comes from maximal force production — you overpower resistance through controlled, high-tension reps. Slow eccentrics, grinding through sticking points, and heavy compound work are your weapons.',
    primaryCue: 'Control the load. Grind through the sticking point.',
    trainingFocus: [
      'Max Strength Cycles',
      'Controlled Eccentric Work',
      'Progressive Overload',
      'Heavy Compound Priority',
      'Tempo Training',
    ],
    color: '#3b82f6',
  },
  spring: {
    slug: 'spring',
    name: 'Spring Mover',
    tagline: 'Strength through explosion',
    description:
      'You are fast-twitch dominant and thrive on explosive power. You use the stretch-shortening cycle to generate force quickly — bouncing out of the hole, driving through the lift in milliseconds. Olympic-style movements, jumps, and velocity-based training fit your profile best.',
    primaryCue: 'Load the spring. Release with full intent.',
    trainingFocus: [
      'Power Development',
      'Olympic Lift Variations',
      'Plyometric Integration',
      'Rate of Force Development',
      'Velocity-Based Training',
    ],
    color: '#ef4444',
  },
  hybrid: {
    slug: 'hybrid',
    name: 'Hybrid Mover',
    tagline: 'Strength across the full curve',
    description:
      'You are the most versatile athletic profile. You develop strength through both grinding and explosive work, adapting to what the session demands. Your training should balance maximal strength blocks with power phases to maximize performance across all physical qualities.',
    primaryCue: 'Build strength across the entire force-velocity curve.',
    trainingFocus: [
      'Strength-Power Block Training',
      'Conjugate Method Cycles',
      'Force-Velocity Balance',
      'Athletic Performance Priority',
      'Versatile Program Design',
    ],
    color: '#22c55e',
  },
};

export const LIFTING_MOVER_QUESTIONS: LiftingMoverQuestion[] = [
  {
    q: 'During a heavy back squat, how do you naturally ascend?',
    options: [
      { letter: 'a', text: 'Brace hard and grind through the sticking point — slow and controlled', moverType: 'static' },
      { letter: 'b', text: 'Bounce out of the bottom and use that speed to power through', moverType: 'spring' },
      { letter: 'c', text: 'Brief pause at the bottom, then drive hard but controlled', moverType: 'hybrid' },
      { letter: 'd', text: 'I adjust my technique based on how heavy the weight is', moverType: 'hybrid' },
    ],
  },
  {
    q: 'When you sprint, your stride pattern feels more like:',
    options: [
      { letter: 'a', text: 'Powerful, long strides — I\'m driving into the ground hard each step', moverType: 'static' },
      { letter: 'b', text: 'Quick, rapid turnover — I\'m bouncing off the ground, not pushing into it', moverType: 'spring' },
      { letter: 'c', text: 'A mix of power and rhythm that shifts depending on the distance', moverType: 'hybrid' },
      { letter: 'd', text: 'I\'ve never paid close attention to how I sprint', moverType: 'hybrid' },
    ],
  },
  {
    q: 'When you do a broad jump or vertical jump, you naturally:',
    options: [
      { letter: 'a', text: 'Take a slow, deliberate approach — load fully before you press', moverType: 'static' },
      { letter: 'b', text: 'Load fast and pop immediately — the quicker the dip the better', moverType: 'spring' },
      { letter: 'c', text: 'Moderate load — gather, dip, then explode', moverType: 'hybrid' },
      { letter: 'd', text: 'Depends on the type of jump — no consistent pattern', moverType: 'hybrid' },
    ],
  },
  {
    q: 'Which movement feels the most natural to your body?',
    options: [
      { letter: 'a', text: 'Heavy Romanian deadlift — slow pull, controlled lowering', moverType: 'static' },
      { letter: 'b', text: 'Hang power clean or jump squat — fast and aggressive', moverType: 'spring' },
      { letter: 'c', text: 'Back squat — I can grind it or use speed depending on the day', moverType: 'hybrid' },
      { letter: 'd', text: 'I honestly like all of them equally', moverType: 'hybrid' },
    ],
  },
  {
    q: 'After a sprint or a maximal jump effort, how quickly do you recover?',
    options: [
      { letter: 'a', text: 'Several minutes — my legs need full recovery before the next rep', moverType: 'static' },
      { letter: 'b', text: 'Fast — I\'m ready to go again within 30–60 seconds', moverType: 'spring' },
      { letter: 'c', text: 'Moderate — about 90 seconds to 2 minutes and I\'m good', moverType: 'hybrid' },
      { letter: 'd', text: 'It depends entirely on how hard the effort was', moverType: 'hybrid' },
    ],
  },
  {
    q: 'During a trap bar deadlift or speed squat, you perform best with:',
    options: [
      { letter: 'a', text: 'Heavy loads — I want to move serious weight even if it\'s slower', moverType: 'static' },
      { letter: 'b', text: 'Light to moderate loads — I need speed to feel powerful', moverType: 'spring' },
      { letter: 'c', text: 'Around 70–80% — powerful but not a grind', moverType: 'hybrid' },
      { letter: 'd', text: 'I haven\'t tracked velocity or load closely enough to know', moverType: 'hybrid' },
    ],
  },
  {
    q: 'During box jumps, you naturally:',
    options: [
      { letter: 'a', text: 'Step off and fully reset between each rep', moverType: 'static' },
      { letter: 'b', text: 'Immediately rebound — bounce to bounce with as little ground contact as possible', moverType: 'spring' },
      { letter: 'c', text: 'Step off but reset quickly — minimal rest between reps', moverType: 'hybrid' },
      { letter: 'd', text: 'I do whatever feels right on that day', moverType: 'hybrid' },
    ],
  },
  {
    q: 'During a heavy pull (deadlift or clean pull), your grip style is:',
    options: [
      { letter: 'a', text: 'Locked and crushing — I squeeze as hard as I can before I pull', moverType: 'static' },
      { letter: 'b', text: 'Firm but not death-gripping — I need feel and timing for the movement', moverType: 'spring' },
      { letter: 'c', text: 'Firm and consistent — adjusts slightly with load', moverType: 'hybrid' },
      { letter: 'd', text: 'I haven\'t paid attention to a consistent grip pattern', moverType: 'hybrid' },
    ],
  },
  {
    q: 'When sprinting a 60-yard dash, where do you feel most powerful?',
    options: [
      { letter: 'a', text: 'The last 30 yards — I run through people and maintain top speed', moverType: 'static' },
      { letter: 'b', text: 'The first 10 yards — my first step and acceleration are my strengths', moverType: 'spring' },
      { letter: 'c', text: 'The middle — once I\'m at top speed, I sustain it well', moverType: 'hybrid' },
      { letter: 'd', text: 'I feel consistent the whole way — no clear phase advantage', moverType: 'hybrid' },
    ],
  },
  {
    q: 'Before a heavy lift, your warm-up instinct is to:',
    options: [
      { letter: 'a', text: 'Do plenty of slow stretching, tempo reps, and static position holds', moverType: 'static' },
      { letter: 'b', text: 'Do quick dynamic drills and jumps to wake the nervous system up', moverType: 'spring' },
      { letter: 'c', text: 'Combine movement prep with light activation work', moverType: 'hybrid' },
      { letter: 'd', text: 'I don\'t have a consistent warm-up routine', moverType: 'hybrid' },
    ],
  },
  {
    q: 'When throwing a medicine ball, your power comes from:',
    options: [
      { letter: 'a', text: 'A deliberate hip load and a slow, forceful rotation', moverType: 'static' },
      { letter: 'b', text: 'A quick hip snap — it all happens in a fraction of a second', moverType: 'spring' },
      { letter: 'c', text: 'A rhythmic gather → load → release that builds momentum', moverType: 'hybrid' },
      { letter: 'd', text: 'I don\'t throw med balls or can\'t compare', moverType: 'hybrid' },
    ],
  },
  {
    q: 'How would you describe your muscle soreness pattern after hard training?',
    options: [
      { letter: 'a', text: 'Significant — I\'m sore for 2–4 days, especially after heavy eccentric work', moverType: 'static' },
      { letter: 'b', text: 'Minimal — I usually feel fine the next day even after tough sessions', moverType: 'spring' },
      { letter: 'c', text: 'Moderate — maybe 1–2 days depending on the volume and intensity', moverType: 'hybrid' },
      { letter: 'd', text: 'It varies a lot — I can\'t predict it session to session', moverType: 'hybrid' },
    ],
  },
  {
    q: 'What type of conditioning do you respond to and recover from best?',
    options: [
      { letter: 'a', text: 'Strength circuits with full rest — not a lot of cardio-style work', moverType: 'static' },
      { letter: 'b', text: 'Short sprint intervals, agility ladders, and plyometric work', moverType: 'spring' },
      { letter: 'c', text: 'Combination circuits — some strength, some speed, some endurance', moverType: 'hybrid' },
      { letter: 'd', text: 'I haven\'t found a clear preference in conditioning', moverType: 'hybrid' },
    ],
  },
  {
    q: 'During athletic movements, your foot contact with the ground feels:',
    options: [
      { letter: 'a', text: 'Flat and grounded — I push through the full foot and drive hard', moverType: 'static' },
      { letter: 'b', text: 'On my toes — I stay high and bounce, minimal contact time', moverType: 'spring' },
      { letter: 'c', text: 'Heel-to-toe — a full, deliberate push-off each step', moverType: 'hybrid' },
      { letter: 'd', text: 'I haven\'t paid close attention to my ground contact pattern', moverType: 'hybrid' },
    ],
  },
  {
    q: 'During a sled push or heavy carry, you naturally:',
    options: [
      { letter: 'a', text: 'Go as heavy as possible and grind through — maximal effort per step', moverType: 'static' },
      { letter: 'b', text: 'Use moderate weight to move fast — keeping up the pace matters', moverType: 'spring' },
      { letter: 'c', text: 'Match load to the goal — can push heavy or move fast', moverType: 'hybrid' },
      { letter: 'd', text: 'I avoid or rarely do loaded carries', moverType: 'hybrid' },
    ],
  },
  {
    q: 'How would you describe the feel of your tendons and joints?',
    options: [
      { letter: 'a', text: 'Stiff and solid — I feel stable and locked in under heavy loads', moverType: 'static' },
      { letter: 'b', text: 'Springy and reactive — I feel energy returning from the ground', moverType: 'spring' },
      { letter: 'c', text: 'Somewhere between — can express both stiffness and spring', moverType: 'hybrid' },
      { letter: 'd', text: 'I\'m not in tune enough with my body to answer this', moverType: 'hybrid' },
    ],
  },
  {
    q: 'During a weighted jump (trap bar jump or goblet squat jump), you instinctively:',
    options: [
      { letter: 'a', text: 'Load slow, hold the bottom position, then press hard through the ground', moverType: 'static' },
      { letter: 'b', text: 'Dip fast and pop immediately — it feels like elastic energy releasing', moverType: 'spring' },
      { letter: 'c', text: 'Take a short, controlled dip and then drive hard through the jump', moverType: 'hybrid' },
      { letter: 'd', text: 'It depends on how warm I am and how the day is going', moverType: 'hybrid' },
    ],
  },
  {
    q: 'In sport situations, defenders or opponents find it hardest to deal with your:',
    options: [
      { letter: 'a', text: 'Physical strength and presence — I\'m hard to move or stop', moverType: 'static' },
      { letter: 'b', text: 'First step, quickness, and change of direction speed', moverType: 'spring' },
      { letter: 'c', text: 'The combination — I can be strong and quick in the same sequence', moverType: 'hybrid' },
      { letter: 'd', text: 'I just adapt to whatever they give me', moverType: 'hybrid' },
    ],
  },
  {
    q: 'Which type of training block produces the best results for you?',
    options: [
      { letter: 'a', text: 'Heavy strength phases — 3-5 rep ranges, long rest, max load focus', moverType: 'static' },
      { letter: 'b', text: 'Power phases — Olympic lifts, jumps, sprint work, low-rep high-velocity', moverType: 'spring' },
      { letter: 'c', text: 'Alternating blocks — strength one phase, power the next', moverType: 'hybrid' },
      { letter: 'd', text: 'I haven\'t noticed a specific block type working better than others', moverType: 'hybrid' },
    ],
  },
  {
    q: 'The lift where you feel most physically powerful is:',
    options: [
      { letter: 'a', text: 'Conventional deadlift — pure grinding strength, no tricks needed', moverType: 'static' },
      { letter: 'b', text: 'Hang power clean or hang snatch — speed, timing, and pop', moverType: 'spring' },
      { letter: 'c', text: 'Back squat — the perfect combination of strength and movement', moverType: 'hybrid' },
      { letter: 'd', text: 'Whichever lift I\'ve been training the most consistently', moverType: 'hybrid' },
    ],
  },
];

export function scoreLiftingMoverQuiz(answers: ('a' | 'b' | 'c' | 'd')[]): LiftingMoverType {
  const tally: Record<LiftingMoverType, number> = {
    static: 0, spring: 0, hybrid: 0,
  };
  answers.forEach((letter, idx) => {
    const question = LIFTING_MOVER_QUESTIONS[idx];
    const option = question.options.find((o) => o.letter === letter);
    if (option) tally[option.moverType]++;
  });
  return (Object.entries(tally) as [LiftingMoverType, number][])
    .sort((a, b) => b[1] - a[1])[0][0];
}
