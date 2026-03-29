/**
 * Speed Development Program — Product Metadata, Phases, Testing
 */

import type { SpeedProductMeta, SpeedPhase, SpeedLevel } from './types';

// ── Product Metadata — 3 Levels ─────────────────────────────────────────────

export const SPEED_PRODUCTS: Record<SpeedLevel, SpeedProductMeta> = {
  beginner: {
    id: 'speed-12wk-beginner',
    level: 'beginner',
    name: 'Speed Program — Beginner',
    price: '$25',
    priceCents: 2500,
    tagline: 'Build the foundation of speed. Learn how to sprint.',
    description:
      'A 12-week speed development system that teaches proper sprint mechanics, acceleration technique, and baseball-specific movement speed. Built for athletes who are new to structured sprint training and want to get faster the right way.',
    sellingPoints: [
      'Learn proper acceleration and sprint mechanics from the ground up',
      'Improve your 10-yard, 30-yard, and 60-yard sprint times',
      'Build a foundation of speed with sprint plyometrics',
      'Baseball-specific speed: stolen bases, first-step quickness, outfield range',
      'Test and track your speed every 6 weeks',
    ],
    ctaText: 'Unlock Beginner Speed',
    durationWeeks: 12,
    sessionsPerWeek: 3,
    targets: [
      { metric: '10-yard', low: 0.03, high: 0.08, unit: 'sec' },
      { metric: '30-yard', low: 0.05, high: 0.12, unit: 'sec' },
      { metric: '60-yard', low: 0.08, high: 0.18, unit: 'sec' },
    ],
  },
  intermediate: {
    id: 'speed-12wk-intermediate',
    level: 'intermediate',
    name: 'Speed Program — Intermediate',
    price: '$30',
    priceCents: 3000,
    tagline: 'Develop real speed. Push past your current ceiling.',
    description:
      'A 12-week intermediate sprint development program that increases acceleration power, develops max velocity, and builds change-of-direction speed for baseball. Designed for athletes with some sprint training experience who want to take their speed to the next level.',
    sellingPoints: [
      'Develop true acceleration power with resisted and positional sprints',
      'Build max velocity with flying sprints and wicket runs',
      'Improve change of direction and deceleration for the field',
      'Baseball transfer: curved sprints, steal speed, outfield range',
      'Progressive sprint plyometrics for elastic stiffness',
    ],
    ctaText: 'Unlock Intermediate Speed',
    durationWeeks: 12,
    sessionsPerWeek: 3,
    targets: [
      { metric: '10-yard', low: 0.04, high: 0.10, unit: 'sec' },
      { metric: '30-yard', low: 0.08, high: 0.16, unit: 'sec' },
      { metric: '60-yard', low: 0.10, high: 0.22, unit: 'sec' },
    ],
  },
  advanced: {
    id: 'speed-12wk-advanced',
    level: 'advanced',
    name: 'Speed Program — Advanced',
    price: '$35',
    priceCents: 3500,
    tagline: 'Elite speed development. Squeeze out every tenth.',
    description:
      'A 12-week advanced sprint program built for athletes who already have a speed training base and want to maximize every tenth of a second. Includes high-intensity acceleration, max-velocity peaking, depth jumps, and full baseball speed integration.',
    sellingPoints: [
      'Peak acceleration with resisted sprints and advanced start positions',
      'Maximize top-end speed with flying sprints and in-and-outs',
      'Advanced plyometrics: depth jumps, reactive bounds, single-leg power',
      'Full baseball speed integration: steals, curved sprints, game situations',
      'Periodized peaking protocol for testing weeks',
    ],
    ctaText: 'Unlock Advanced Speed',
    durationWeeks: 12,
    sessionsPerWeek: 3,
    targets: [
      { metric: '10-yard', low: 0.02, high: 0.06, unit: 'sec' },
      { metric: '30-yard', low: 0.05, high: 0.12, unit: 'sec' },
      { metric: '60-yard', low: 0.06, high: 0.15, unit: 'sec' },
    ],
  },
};

// ── Phase Definitions (shared across levels) ────────────────────────────────

export const SPEED_PHASES: SpeedPhase[] = [
  {
    number: 1,
    name: 'Mechanics + Acceleration Fundamentals',
    emphasis: 'Learn the positions. Build the foundation.',
    weeks: [1, 3],
    description:
      'Weeks 1–3 focus on sprint mechanics, acceleration posture, and low-level plyometrics. Every session reinforces proper body positions before adding speed.',
  },
  {
    number: 2,
    name: 'Acceleration Development + Intro Max Velocity',
    emphasis: 'Build acceleration power. Start chasing top speed.',
    weeks: [4, 6],
    description:
      'Weeks 4–6 increase sprint intensity, introduce max-velocity work with flying sprints, and progress plyometrics toward more elastic and reactive movements.',
  },
  {
    number: 3,
    name: 'Max Velocity + Elastic Stiffness',
    emphasis: 'Express speed. Run faster than you think you can.',
    weeks: [7, 9],
    description:
      'Weeks 7–9 peak max-velocity exposures with flying sprints, wicket runs, and in-and-outs. Plyometrics emphasize stiffness and reactive power.',
  },
  {
    number: 4,
    name: 'Speed Endurance + Baseball Transfer',
    emphasis: 'Transfer speed to the field. Peak for testing.',
    weeks: [10, 12],
    description:
      'Weeks 10–12 integrate all speed qualities into baseball-specific scenarios: curved sprints, steal starts, and game-situation speed. Volume tapers for peak performance.',
  },
];

export function getSpeedPhaseForWeek(week: number): SpeedPhase {
  return SPEED_PHASES.find((p) => week >= p.weeks[0] && week <= p.weeks[1]) ?? SPEED_PHASES[0];
}

export function isSpeedTestWeek(week: number): boolean {
  return week === 1 || week === 6 || week === 12;
}

// ── Testing Protocol ────────────────────────────────────────────────────────

export const SPEED_TEST_WEEKS = [1, 6, 12];

export const TESTING_INSTRUCTIONS = [
  'Full warm-up before testing. Minimum 10 minutes.',
  'Test in this order: broad jump → 10 yard → 30 yard → 60 yard.',
  'Take 2–3 attempts per test. Record the best time.',
  'Full recovery between attempts (2–3 minutes).',
  'Use hand timing or laser timing. Be consistent across all test dates.',
  'Test on a flat surface. Spikes or turfs are fine — just be consistent.',
  'Do NOT test when fatigued, sore, or after a hard training day.',
];
