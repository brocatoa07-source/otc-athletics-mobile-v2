/* ────────────────────────────────────────────────
 * MENTAL TROUBLESHOOTING ISSUE CONTENT
 *
 * Separate from diagnostic scoring — this is the display layer.
 * Each issue maps back to a MentalStruggle (diagnostic output)
 * and a MENTAL_QUICK_FIXES key (tool pool).
 *
 * Diagnostic scoring is NOT touched by this file.
 * ──────────────────────────────────────────────── */

import type { MentalStruggle } from './mental-struggles-data';

export type MentalTroubleshootingSlug =
  | 'overthinking'
  | 'pregame-nerves'
  | 'confidence-drop'
  | 'emotional-frustration'
  | 'focus-loss'
  | 'fear-of-failure'
  | 'burnout'
  | 'imposter-syndrome';

export interface MentalTroubleshootingIssueData {
  slug: MentalTroubleshootingSlug;
  label: string;
  /** Which diagnostic struggle triggers this troubleshooting issue */
  diagnosticStruggle: MentalStruggle;
  /** Key into MENTAL_QUICK_FIXES for tool pool */
  toolPoolKey: string;
  description: string;
  cue: string;
  symptoms: string[];
  why: string;
  whatItLeadsTo: string;
  areas: string[];
  color: string;
}

export const MENTAL_TROUBLESHOOTING_ISSUES: Record<MentalTroubleshootingSlug, MentalTroubleshootingIssueData> = {
  overthinking: {
    slug: 'overthinking',
    label: 'Overthinking',
    diagnosticStruggle: 'overthinking',
    toolPoolKey: 'overthinking',
    description:
      'Your mind is running a mile a minute at the plate. You\'re analyzing instead of competing. By the time you decide to swing, the pitch is already past you.',
    cue: 'See ball, hit ball. Trust your body.',
    symptoms: [
      'Racing thoughts during at-bats',
      'Analyzing mechanics mid-swing',
      'Freezing on hittable pitches',
    ],
    why: 'Your analytical brain is overriding your athletic instincts. You\'ve trained your body to swing — but your mind won\'t let it. The more you think, the slower you react.',
    whatItLeadsTo:
      'Late reactions, passive at-bats, missed hittable pitches, and a feeling of being "stuck in your head."',
    areas: ['Focus', 'Awareness'],
    color: '#3b82f6',
  },

  'pregame-nerves': {
    slug: 'pregame-nerves',
    label: 'Pre-Game Nerves',
    diagnosticStruggle: 'pregame_nerves',
    toolPoolKey: 'pregame-nerves',
    description:
      'Before the game starts, your body is already in fight-or-flight. Tight muscles, shallow breathing, racing heart — you\'re burning energy before the first pitch.',
    cue: 'Nerves mean you care. Channel them.',
    symptoms: [
      'Tight chest or stomach before games',
      'Can\'t eat or sleep before big games',
      'First at-bat always feels rushed and anxious',
    ],
    why: 'Your nervous system interprets the game as a threat instead of an opportunity. Without a pre-game routine that channels that energy, your body stays in survival mode instead of compete mode.',
    whatItLeadsTo:
      'Wasted energy, tight early at-bats, slow starts, and a feeling of never being "ready" when the game begins.',
    areas: ['Pre-Game Routine', 'Emotional Control'],
    color: '#8b5cf6',
  },

  'confidence-drop': {
    slug: 'confidence-drop',
    label: 'Confidence Drop',
    diagnosticStruggle: 'confidence_drop',
    toolPoolKey: 'confidence-drop',
    description:
      'One bad at-bat erases a week of good ones. Your confidence is rented from your last result instead of owned by your preparation.',
    cue: 'Confidence is built, not given. Stack proof.',
    symptoms: [
      'Confidence disappears after one mistake',
      'Playing scared instead of aggressive',
      'Doubting your ability in key moments',
    ],
    why: 'You\'re basing confidence on outcomes instead of effort and preparation. Rented confidence (from results) is fragile. Owned confidence (from work) survives bad days.',
    whatItLeadsTo:
      'Inconsistent performance, hesitation in big moments, and a cycle where you need results to feel good but can\'t get results because you don\'t feel good.',
    areas: ['Confidence', 'Resilience'],
    color: '#f59e0b',
  },

  'emotional-frustration': {
    slug: 'emotional-frustration',
    label: 'Emotional Frustration',
    diagnosticStruggle: 'emotional_frustration',
    toolPoolKey: 'emotional-frustration',
    description:
      'Frustration takes over after mistakes. You slam equipment, shut down, or carry anger from one play to the next. The emotion is running the show.',
    cue: 'Feel it, release it, compete again.',
    symptoms: [
      'Visible frustration after mistakes (body language, equipment)',
      'Carrying anger from one at-bat to the next',
      'Shutting down emotionally during bad games',
    ],
    why: 'Your emotional response to failure is faster than your ability to regulate it. Without a trained reset routine, frustration hijacks your nervous system and your performance follows.',
    whatItLeadsTo:
      'Compounding mistakes, loss of focus, damaged team energy, and games that spiral from one bad play into a full meltdown.',
    areas: ['Emotional Control', 'In-Game Reset'],
    color: '#ef4444',
  },

  'focus-loss': {
    slug: 'focus-loss',
    label: 'Focus Loss',
    diagnosticStruggle: 'focus_loss',
    toolPoolKey: 'focus-loss',
    description:
      'Your attention drifts mid-game — to the scoreboard, to the crowd, to the last play. You can\'t stay locked in for a full game and your at-bats feel scattered.',
    cue: 'One pitch. This pitch. Lock in.',
    symptoms: [
      'Mind wandering between pitches',
      'Losing track of the count or situation',
      'Best focus only lasting 1-2 innings',
    ],
    why: 'Focus is a muscle, and yours isn\'t trained for game-length duration. Without pitch-to-pitch reset routines, your attention defaults to whatever is loudest — and that\'s rarely the right thing.',
    whatItLeadsTo:
      'Missed signs, mental errors, inconsistent at-bats, and a feeling that your best focus comes and goes randomly.',
    areas: ['Focus', 'In-Game Reset'],
    color: '#06b6d4',
  },

  'fear-of-failure': {
    slug: 'fear-of-failure',
    label: 'Fear of Failure',
    diagnosticStruggle: 'fear_of_failure',
    toolPoolKey: 'fear-of-failure',
    description:
      'You\'re afraid of striking out, making errors, or looking bad. That fear makes you hesitate, play safe, and avoid the moments that could define your career.',
    cue: 'Attack. Failure is training data.',
    symptoms: [
      'Hesitating on pitches you should attack',
      'Avoiding pressure situations or big moments',
      'Playing not to fail instead of playing to win',
    ],
    why: 'Failure feels permanent in your mind — like one mistake defines you. Without reframing failure as data, your brain treats every at-bat as a threat to your identity instead of an opportunity to compete.',
    whatItLeadsTo:
      'Passive at-bats, avoiding competition, underperforming in big moments, and shrinking when you should be growing.',
    areas: ['Confidence', 'Resilience'],
    color: '#e11d48',
  },

  burnout: {
    slug: 'burnout',
    label: 'Burnout',
    diagnosticStruggle: 'burnout',
    toolPoolKey: 'burnout',
    description:
      'The game doesn\'t excite you anymore. You\'re showing up but not competing. Practice feels like a chore and you can\'t find the passion you used to have.',
    cue: 'Remember why you play. Compete with purpose.',
    symptoms: [
      'Going through the motions in practice',
      'Dreading games instead of looking forward to them',
      'Feeling physically and emotionally exhausted by the game',
    ],
    why: 'You\'ve been grinding without recovery, purpose, or perspective. When the game becomes all about results and pressure, the joy that made you love it disappears.',
    whatItLeadsTo:
      'Declining performance, loss of passion, eventual quitting, and missed opportunities during what should be your development years.',
    areas: ['Awareness', 'Post-Game Reflection'],
    color: '#64748b',
  },

  'imposter-syndrome': {
    slug: 'imposter-syndrome',
    label: 'Imposter Syndrome',
    diagnosticStruggle: 'imposter_syndrome',
    toolPoolKey: 'imposter-syndrome',
    description:
      'You feel like you don\'t belong — like everyone else is better and it\'s only a matter of time before people figure out you\'re a fraud.',
    cue: 'You earned your spot. Own it.',
    symptoms: [
      'Feeling like you don\'t deserve your spot on the team',
      'Downplaying your own success and amplifying failures',
      'Comparing yourself negatively to every teammate',
    ],
    why: 'You\'ve attached your identity to being perfect instead of being competitive. When you can\'t meet an impossible standard, you interpret normal struggles as proof you don\'t belong.',
    whatItLeadsTo:
      'Self-sabotage, withdrawal from competition, inability to enjoy success, and a constant undercurrent of anxiety that erodes performance.',
    areas: ['Confidence', 'Accountability'],
    color: '#a855f7',
  },
};

/**
 * Given a diagnostic result (primary/secondary MentalStruggle),
 * return all troubleshooting issues that apply.
 */
export function getMentalTroubleshootingIssuesForDiagnostic(
  primary: MentalStruggle,
  secondary: MentalStruggle,
): { primary: MentalTroubleshootingIssueData[]; secondary: MentalTroubleshootingIssueData[] } {
  const all = Object.values(MENTAL_TROUBLESHOOTING_ISSUES);
  return {
    primary: all.filter((i) => i.diagnosticStruggle === primary),
    secondary: all.filter(
      (i) => i.diagnosticStruggle === secondary && i.diagnosticStruggle !== primary,
    ),
  };
}
