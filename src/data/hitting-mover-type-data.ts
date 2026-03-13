/* ────────────────────────────────────────────────
 * OTC HITTER MOVER DIAGNOSTIC
 *
 * 15 questions · 6 options each (A–F)
 * Each option maps to one of 6 mover types.
 *
 * Scoring:
 *   +2 points to the selected mover type
 *   +1 point to its paired secondary type
 *
 * Secondary pairings:
 *   Torque Engine ↔ Ground Force Driver
 *   Linear Momentum ↔ Elastic
 *   Compact Rotational ↔ Quick-Twitch
 *
 * Result: Primary (highest) + Secondary (second highest)
 *
 * Tie-breaking:
 *   1. Question 15 answer
 *   2. Question 1 answer
 *   3. Fallback order: quick_twitch > torque_engine >
 *      ground_force > compact_rotational > elastic > linear_momentum
 * ──────────────────────────────────────────────── */

export type MoverType =
  | 'torque_engine'
  | 'ground_force'
  | 'linear_momentum'
  | 'elastic'
  | 'compact_rotational'
  | 'explosive_quick_twitch';

export interface MoverTypeData {
  slug: MoverType;
  name: string;
  tagline: string;
  description: string;
  primaryCues: string[];
  mlbComps: string[];
  color: string;
}

export type OptionLetter = 'a' | 'b' | 'c' | 'd' | 'e' | 'f';

export interface MoverTypeOption {
  letter: OptionLetter;
  text: string;
  moverType: MoverType;
}

export interface MoverTypeQuestion {
  q: string;
  options: [MoverTypeOption, MoverTypeOption, MoverTypeOption, MoverTypeOption, MoverTypeOption, MoverTypeOption];
}

/* ─── Mover Type Profiles ────────────────────────── */

export const MOVER_TYPES: Record<MoverType, MoverTypeData> = {
  torque_engine: {
    slug: 'torque_engine',
    name: 'Torque Engine',
    tagline: 'Power through rotational stretch and release',
    description:
      'You create power by winding up your body and releasing it explosively. Your swing is built on the stretch between your hips and shoulders — the more you coil, the harder you unload. You thrive when you feel the rubber band effect.',
    primaryCues: [
      'Stretch the rubber band',
      'Turn the back pocket',
      'Delay the barrel',
    ],
    mlbComps: ['Shohei Ohtani', 'Bryce Harper', 'Josh Donaldson'],
    color: '#ef4444',
  },
  ground_force: {
    slug: 'ground_force',
    name: 'Ground Force Driver',
    tagline: 'Power through the ground up',
    description:
      'You generate force by driving hard into the ground with your legs and transferring that energy up through your core and into the barrel. Your swing feels most powerful when your lower half is fully engaged and pushing.',
    primaryCues: [
      'Push the ground away',
      'Drive through the back leg',
      'Feel the ground connection',
    ],
    mlbComps: ['Aaron Judge', 'Giancarlo Stanton', 'Vladimir Guerrero Jr.'],
    color: '#3b82f6',
  },
  linear_momentum: {
    slug: 'linear_momentum',
    name: 'Linear Momentum Driver',
    tagline: 'Power through forward energy',
    description:
      'You create power by building momentum toward the pitcher. Your forward move and weight transfer are your weapons — controlled aggression toward the ball. You hit your best when you ride into the ball with purpose.',
    primaryCues: [
      'Ride into the ball',
      'Controlled aggression forward',
      'Let the stride carry you',
    ],
    mlbComps: ['Freddie Freeman', 'Corey Seager', 'Trea Turner'],
    color: '#22c55e',
  },
  elastic: {
    slug: 'elastic',
    name: 'Elastic / Loose Mover',
    tagline: 'Power through flexibility and whip',
    description:
      'You create power through flexibility, looseness, and natural whip. Your body is elastic — you don\'t need to muscle the ball. Your best swings feel effortless because your body stretches and snaps naturally.',
    primaryCues: [
      'Stay loose through the load',
      'Let the whip happen',
      'Elastic not rigid',
    ],
    mlbComps: ['Fernando Tatis Jr.', 'Juan Soto', 'Manny Machado'],
    color: '#a855f7',
  },
  compact_rotational: {
    slug: 'compact_rotational',
    name: 'Compact Rotational Mover',
    tagline: 'Power through efficient rotation',
    description:
      'You create power by staying compact and rotating efficiently. Short swing, quick hands, tight turn — you don\'t need a big load or stride. You\'re at your best when you stay centered and let the rotation do the work.',
    primaryCues: [
      'Short and quick',
      'Stay centered and turn',
      'Compact is powerful',
    ],
    mlbComps: ['Mookie Betts', 'José Ramírez', 'Alex Bregman'],
    color: '#0891b2',
  },
  explosive_quick_twitch: {
    slug: 'explosive_quick_twitch',
    name: 'Explosive Quick-Twitch Mover',
    tagline: 'Power through explosive athleticism',
    description:
      'You create power through pure explosiveness and fast-twitch muscle. Your swing is violent and athletic — you react and fire. You don\'t overthink mechanics; you compete and explode through the ball.',
    primaryCues: [
      'Explode through the ball',
      'Be an athlete, not a robot',
      'Trust your hands',
    ],
    mlbComps: ['Ronald Acuña Jr.', 'Bo Bichette', 'Julio Rodríguez'],
    color: '#f59e0b',
  },
};

/* ─── Secondary Pairing Map ──────────────────────── */

const SECONDARY_PAIR: Record<MoverType, MoverType> = {
  torque_engine: 'ground_force',
  ground_force: 'torque_engine',
  linear_momentum: 'elastic',
  elastic: 'linear_momentum',
  compact_rotational: 'explosive_quick_twitch',
  explosive_quick_twitch: 'compact_rotational',
};

/* ─── 15 Diagnostic Questions ────────────────────── */

export const MOVER_TYPE_QUESTIONS: MoverTypeQuestion[] = [
  {
    q: 'When you hit the ball your hardest, what does the swing feel like?',
    options: [
      { letter: 'a', text: 'I feel a big wind-up and explosive release', moverType: 'torque_engine' },
      { letter: 'b', text: 'I feel my legs driving hard into the ground', moverType: 'ground_force' },
      { letter: 'c', text: 'I feel my weight riding forward into the ball', moverType: 'linear_momentum' },
      { letter: 'd', text: 'It feels effortless — like a whip', moverType: 'elastic' },
      { letter: 'e', text: 'I feel a tight, compact rotation', moverType: 'compact_rotational' },
      { letter: 'f', text: 'I feel an explosive burst of speed', moverType: 'explosive_quick_twitch' },
    ],
  },
  {
    q: 'What part of your body feels most responsible for generating power?',
    options: [
      { letter: 'a', text: 'The stretch between my hips and shoulders', moverType: 'torque_engine' },
      { letter: 'b', text: 'My legs pushing into the ground', moverType: 'ground_force' },
      { letter: 'c', text: 'My forward momentum and weight transfer', moverType: 'linear_momentum' },
      { letter: 'd', text: 'My flexibility and natural looseness', moverType: 'elastic' },
      { letter: 'e', text: 'My quick hands and tight rotation', moverType: 'compact_rotational' },
      { letter: 'f', text: 'My raw athleticism and explosiveness', moverType: 'explosive_quick_twitch' },
    ],
  },
  {
    q: 'What does your stride or forward move usually look like?',
    options: [
      { letter: 'a', text: 'I coil and wind up before releasing', moverType: 'torque_engine' },
      { letter: 'b', text: 'I push hard off my back leg', moverType: 'ground_force' },
      { letter: 'c', text: 'I take a smooth, controlled stride forward', moverType: 'linear_momentum' },
      { letter: 'd', text: 'I float into position — nothing forced', moverType: 'elastic' },
      { letter: 'e', text: 'Minimal stride — I stay centered', moverType: 'compact_rotational' },
      { letter: 'f', text: 'Quick, athletic move — I just go', moverType: 'explosive_quick_twitch' },
    ],
  },
  {
    q: 'When you watch video of your best swings, what stands out?',
    options: [
      { letter: 'a', text: 'Big hip-shoulder separation before the barrel fires', moverType: 'torque_engine' },
      { letter: 'b', text: 'Strong lower half driving everything', moverType: 'ground_force' },
      { letter: 'c', text: 'Smooth weight transfer toward the pitcher', moverType: 'linear_momentum' },
      { letter: 'd', text: 'How loose and effortless it looks', moverType: 'elastic' },
      { letter: 'e', text: 'How short and quick my swing is', moverType: 'compact_rotational' },
      { letter: 'f', text: 'How violent and explosive the swing is', moverType: 'explosive_quick_twitch' },
    ],
  },
  {
    q: 'When your swing feels off, what usually fixes it?',
    options: [
      { letter: 'a', text: 'Getting back to my coil and stretch', moverType: 'torque_engine' },
      { letter: 'b', text: 'Driving harder into the ground', moverType: 'ground_force' },
      { letter: 'c', text: 'Getting my forward move and rhythm back', moverType: 'linear_momentum' },
      { letter: 'd', text: 'Loosening up and letting it happen', moverType: 'elastic' },
      { letter: 'e', text: 'Staying short and keeping my hands quick', moverType: 'compact_rotational' },
      { letter: 'f', text: 'Competing harder and being more aggressive', moverType: 'explosive_quick_twitch' },
    ],
  },
  {
    q: 'How would you describe your natural rhythm at the plate?',
    options: [
      { letter: 'a', text: 'Load and explode — coiled energy', moverType: 'torque_engine' },
      { letter: 'b', text: 'Strong and grounded — legs drive it', moverType: 'ground_force' },
      { letter: 'c', text: 'Smooth and flowing — forward momentum', moverType: 'linear_momentum' },
      { letter: 'd', text: 'Loose and relaxed — natural whip', moverType: 'elastic' },
      { letter: 'e', text: 'Quick and efficient — no wasted motion', moverType: 'compact_rotational' },
      { letter: 'f', text: 'Explosive and reactive — fast twitch', moverType: 'explosive_quick_twitch' },
    ],
  },
  {
    q: 'What type of drill feels most natural to you?',
    options: [
      { letter: 'a', text: 'Separation drills — feeling the stretch', moverType: 'torque_engine' },
      { letter: 'b', text: 'Ground force drills — push and drive', moverType: 'ground_force' },
      { letter: 'c', text: 'Walking or momentum drills — forward flow', moverType: 'linear_momentum' },
      { letter: 'd', text: 'Loose swings — staying relaxed and fluid', moverType: 'elastic' },
      { letter: 'e', text: 'Short swing drills — compact and quick', moverType: 'compact_rotational' },
      { letter: 'f', text: 'Reaction drills — see it and hit it', moverType: 'explosive_quick_twitch' },
    ],
  },
  {
    q: 'How would a coach describe your swing?',
    options: [
      { letter: 'a', text: 'Big torque — winds up and unloads', moverType: 'torque_engine' },
      { letter: 'b', text: 'Strong and powerful — legs do the work', moverType: 'ground_force' },
      { letter: 'c', text: 'Smooth weight shift — rides into the ball', moverType: 'linear_momentum' },
      { letter: 'd', text: 'Effortless — makes it look easy', moverType: 'elastic' },
      { letter: 'e', text: 'Short and quick — no wasted movement', moverType: 'compact_rotational' },
      { letter: 'f', text: 'Explosive — pure athlete', moverType: 'explosive_quick_twitch' },
    ],
  },
  {
    q: 'When you try to hit the ball harder, what do you instinctively do?',
    options: [
      { letter: 'a', text: 'Coil more and create more separation', moverType: 'torque_engine' },
      { letter: 'b', text: 'Push harder into the ground', moverType: 'ground_force' },
      { letter: 'c', text: 'Get more aggressive with my forward move', moverType: 'linear_momentum' },
      { letter: 'd', text: 'Let my body stretch and whip naturally', moverType: 'elastic' },
      { letter: 'e', text: 'Stay short and rotate faster', moverType: 'compact_rotational' },
      { letter: 'f', text: 'Fire faster — just explode', moverType: 'explosive_quick_twitch' },
    ],
  },
  {
    q: 'What happens when you over-swing?',
    options: [
      { letter: 'a', text: 'I over-rotate and lose my direction', moverType: 'torque_engine' },
      { letter: 'b', text: 'I get stuck in the ground and can\'t finish', moverType: 'ground_force' },
      { letter: 'c', text: 'I lunge forward and lose balance', moverType: 'linear_momentum' },
      { letter: 'd', text: 'I get too loose and lose control', moverType: 'elastic' },
      { letter: 'e', text: 'I get too quick and miss the barrel', moverType: 'compact_rotational' },
      { letter: 'f', text: 'I get too aggressive and pull everything', moverType: 'explosive_quick_twitch' },
    ],
  },
  {
    q: 'What is the biggest strength of your swing?',
    options: [
      { letter: 'a', text: 'Raw rotational power from separation', moverType: 'torque_engine' },
      { letter: 'b', text: 'Driving power from leg strength', moverType: 'ground_force' },
      { letter: 'c', text: 'Consistent hard contact from momentum', moverType: 'linear_momentum' },
      { letter: 'd', text: 'Effortless bat speed from flexibility', moverType: 'elastic' },
      { letter: 'e', text: 'Barrel accuracy from a short swing', moverType: 'compact_rotational' },
      { letter: 'f', text: 'Explosive bat speed from athleticism', moverType: 'explosive_quick_twitch' },
    ],
  },
  {
    q: 'What type of pitcher gives you the most trouble?',
    options: [
      { letter: 'a', text: 'Pitchers who disrupt my timing and coil', moverType: 'torque_engine' },
      { letter: 'b', text: 'Pitchers who take away my ability to drive', moverType: 'ground_force' },
      { letter: 'c', text: 'Pitchers who change speed and kill my momentum', moverType: 'linear_momentum' },
      { letter: 'd', text: 'Pitchers who force me to tighten up', moverType: 'elastic' },
      { letter: 'e', text: 'Pitchers who throw hard enough to beat my hands', moverType: 'compact_rotational' },
      { letter: 'f', text: 'Pitchers who slow me down with off-speed', moverType: 'explosive_quick_twitch' },
    ],
  },
  {
    q: 'How do you feel when you hit a ball perfectly?',
    options: [
      { letter: 'a', text: 'Like my whole body unwound at once', moverType: 'torque_engine' },
      { letter: 'b', text: 'Like the power came from the ground up', moverType: 'ground_force' },
      { letter: 'c', text: 'Like I rode through the ball smoothly', moverType: 'linear_momentum' },
      { letter: 'd', text: 'Like I barely tried — it just happened', moverType: 'elastic' },
      { letter: 'e', text: 'Like a quick, clean snap', moverType: 'compact_rotational' },
      { letter: 'f', text: 'Like I exploded through the ball', moverType: 'explosive_quick_twitch' },
    ],
  },
  {
    q: 'What physical trait gives you the biggest advantage as a hitter?',
    options: [
      { letter: 'a', text: 'Core strength and rotational power', moverType: 'torque_engine' },
      { letter: 'b', text: 'Leg strength and lower body drive', moverType: 'ground_force' },
      { letter: 'c', text: 'Coordination and body control', moverType: 'linear_momentum' },
      { letter: 'd', text: 'Flexibility and natural looseness', moverType: 'elastic' },
      { letter: 'e', text: 'Hand speed and quick hands', moverType: 'compact_rotational' },
      { letter: 'f', text: 'Overall athleticism and fast-twitch speed', moverType: 'explosive_quick_twitch' },
    ],
  },
  {
    q: 'If you had to pick one word to describe your swing, what would it be?',
    options: [
      { letter: 'a', text: 'Torque', moverType: 'torque_engine' },
      { letter: 'b', text: 'Drive', moverType: 'ground_force' },
      { letter: 'c', text: 'Flow', moverType: 'linear_momentum' },
      { letter: 'd', text: 'Whip', moverType: 'elastic' },
      { letter: 'e', text: 'Snap', moverType: 'compact_rotational' },
      { letter: 'f', text: 'Explode', moverType: 'explosive_quick_twitch' },
    ],
  },
];

/* ─── Tie-break fallback order ───────────────────── */

const TIEBREAK_ORDER: MoverType[] = [
  'explosive_quick_twitch',
  'torque_engine',
  'ground_force',
  'compact_rotational',
  'elastic',
  'linear_momentum',
];

/* ─── Scoring ────────────────────────────────────── */

export interface MoverDiagnosticResult {
  primary: MoverType;
  secondary: MoverType;
}

export function scoreMoverTypeQuiz(answers: OptionLetter[]): MoverDiagnosticResult {
  const tally: Record<MoverType, number> = {
    torque_engine: 0,
    ground_force: 0,
    linear_momentum: 0,
    elastic: 0,
    compact_rotational: 0,
    explosive_quick_twitch: 0,
  };

  answers.forEach((letter, idx) => {
    const question = MOVER_TYPE_QUESTIONS[idx];
    if (!question) return;
    const option = question.options.find((o) => o.letter === letter);
    if (!option) return;

    // +2 to primary type
    tally[option.moverType] += 2;

    // +1 to paired secondary type
    const paired = SECONDARY_PAIR[option.moverType];
    if (paired) tally[paired] += 1;
  });

  // Sort by score descending
  const sorted = (Object.entries(tally) as [MoverType, number][])
    .sort((a, b) => b[1] - a[1]);

  // Resolve ties
  function resolveTie(candidates: [MoverType, number][]): MoverType {
    if (candidates.length === 1) return candidates[0][0];

    // Tie-break 1: Question 15 answer (index 14)
    if (answers[14]) {
      const q15 = MOVER_TYPE_QUESTIONS[14];
      const q15opt = q15?.options.find((o) => o.letter === answers[14]);
      if (q15opt && candidates.some((c) => c[0] === q15opt.moverType)) {
        return q15opt.moverType;
      }
    }

    // Tie-break 2: Question 1 answer (index 0)
    if (answers[0]) {
      const q1 = MOVER_TYPE_QUESTIONS[0];
      const q1opt = q1?.options.find((o) => o.letter === answers[0]);
      if (q1opt && candidates.some((c) => c[0] === q1opt.moverType)) {
        return q1opt.moverType;
      }
    }

    // Tie-break 3: Fallback order
    for (const type of TIEBREAK_ORDER) {
      if (candidates.some((c) => c[0] === type)) return type;
    }

    return candidates[0][0];
  }

  // Primary: highest score
  const topScore = sorted[0][1];
  const topTied = sorted.filter((s) => s[1] === topScore);
  const primary = resolveTie(topTied);

  // Secondary: second highest, excluding primary
  const remaining = sorted.filter((s) => s[0] !== primary);
  const secondScore = remaining[0]?.[1] ?? 0;
  const secondTied = remaining.filter((s) => s[1] === secondScore);
  const secondary = resolveTie(secondTied);

  return { primary, secondary };
}
