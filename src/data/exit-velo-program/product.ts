/**
 * 12-Week Exit Velocity Program — Product Metadata & Phases
 */

import type { ProductMeta, Phase, TestSession } from './types';

// ── Product Metadata ────────────────────────────────────────────────────────

export const EV_PROGRAM_META: ProductMeta = {
  id: 'exit-velo-12wk',
  name: '12-Week Exit Velocity Program',
  price: '$97',
  priceCents: 9700,
  tagline: 'Swing faster. Hit the ball harder. Increase your exit velocity.',
  description:
    'A 12-week bat speed and rotational power system built to help hitters increase exit velocity, improve rotational explosiveness, and swing the bat faster. This program combines overload/underload tee work, med ball rotational power, lower body force development, sprint work, and lead leg block training into one complete bat speed system.',
  sellingPoints: [
    'Increase bat speed through structured overload/underload tee training',
    'Build rotational power with progressive med ball protocols',
    'Develop lower half force production for more power at contact',
    'Improve hip-to-shoulder separation and rotational sequencing',
    'Test and track your exit velocity every 4 weeks',
  ],
  ctaText: 'Unlock Program',
  durationWeeks: 12,
  daysPerWeek: 3,
};

// ── Phase Definitions ───────────────────────────────────────────────────────

export const PHASES: Phase[] = [
  {
    number: 1,
    name: 'Strength / Overload',
    emphasis: 'Build the engine. Heavy overload bat work + max-strength lower body.',
    weeks: [1, 3],
    description:
      'The first three weeks focus on overload bat swings to develop bat speed capacity, heavy lower body strength to build the foundation of force production, and controlled rotational power with heavier med balls.',
    medBallWeight: '6–8 lb',
  },
  {
    number: 2,
    name: 'Power / Mixed',
    emphasis: 'Convert strength to power. Balanced bat loading + explosive movements.',
    weeks: [4, 6],
    description:
      'Weeks 4–6 shift toward mixed overload/underload tee work, lighter med balls thrown at higher velocities, and more explosive lower body movements. The body begins to convert raw strength into usable power.',
    medBallWeight: '4–6 lb',
  },
  {
    number: 3,
    name: 'Speed / Underload',
    emphasis: 'Express speed. Underload-dominant swings + max-velocity training.',
    weeks: [7, 9],
    description:
      'Weeks 7–9 flip the tee work to underload-dominant, training the nervous system to fire faster. Med ball work gets lighter and faster. Sprint and plyometric intensity peaks.',
    medBallWeight: '3–4 lb',
  },
  {
    number: 4,
    name: 'Transfer / Game Bat',
    emphasis: 'Transfer everything to competition. Game bat–dominant + full integration.',
    weeks: [10, 12],
    description:
      'The final phase prioritizes game bat swings so speed gains transfer to competition. Training maintains power and speed while the athlete integrates everything into game-ready bat speed.',
    medBallWeight: '3–5 lb',
  },
];

// ── Testing Protocol ────────────────────────────────────────────────────────

export const TEST_SESSIONS: TestSession[] = [
  {
    weekNumber: 1,
    rounds: [
      { batType: 'game', swings: 5 },
      { batType: 'overload', swings: 5 },
      { batType: 'underload', swings: 5 },
    ],
    metrics: ['Average EV', 'Max EV', 'Hard-hit %'],
  },
  {
    weekNumber: 4,
    rounds: [
      { batType: 'game', swings: 5 },
      { batType: 'overload', swings: 5 },
      { batType: 'underload', swings: 5 },
    ],
    metrics: ['Average EV', 'Max EV', 'Hard-hit %'],
  },
  {
    weekNumber: 8,
    rounds: [
      { batType: 'game', swings: 5 },
      { batType: 'overload', swings: 5 },
      { batType: 'underload', swings: 5 },
    ],
    metrics: ['Average EV', 'Max EV', 'Hard-hit %'],
  },
  {
    weekNumber: 12,
    rounds: [
      { batType: 'game', swings: 5 },
      { batType: 'overload', swings: 5 },
      { batType: 'underload', swings: 5 },
    ],
    metrics: ['Average EV', 'Max EV', 'Hard-hit %'],
  },
];

// ── Helpers ─────────────────────────────────────────────────────────────────

export function getPhaseForWeek(week: number): Phase {
  return PHASES.find((p) => week >= p.weeks[0] && week <= p.weeks[1]) ?? PHASES[0];
}

export function isTestWeek(week: number): boolean {
  return TEST_SESSIONS.some((t) => t.weekNumber === week);
}
