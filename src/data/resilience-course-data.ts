/* ────────────────────────────────────────────────
 * COURSE DATA — WEEK 5: RESILIENCE
 * ──────────────────────────────────────────────── */

import type { CourseWeekContent } from './course-types';

export const RESILIENCE_WEEK: CourseWeekContent = {
  title: 'The Shadow of the Victim Mindset',
  quote: 'Failure isn\'t the opposite of success — it\'s the cost of entry.',
  objective: 'Build the ability to bounce back after failure without blaming, avoiding, or quitting mentally.',
  lesson: 'The victim mindset says "this happened TO me." Resilience says "this happened FOR me." This week you learn to extract the lesson from failure, release the emotion, and move forward — faster every time.',
  tool: 'Failure Flush Protocol — a 3-step sequence to process, extract, and release',
  meditation: 'Resilience Breathing — 5 minutes of recovery visualization after a tough moment',
  journalPrompt: 'What failure are you still carrying? What lesson is hidden inside it?',
  weeklyChallenge: 'Every time something goes wrong this week, use the Failure Flush within 60 seconds. Write down the lesson within 5 minutes.',
  reflection: 'Did you bounce back faster this week? What changed in your internal dialogue after mistakes?',
  outline: [
    { segment: 'Opening: Failure as Fuel', focus: 'Reframe failure', objective: 'See failure as development, not punishment' },
    { segment: 'Coach Video: The Resilience Response', focus: 'Recovery science', objective: 'Understand how elite performers process setbacks' },
    { segment: 'Shadow Pattern: Victim Mindset / Avoidance', focus: 'Identify the pattern', objective: 'See how blaming and avoiding keep you stuck' },
    { segment: 'Exercise: Failure Flush Protocol', focus: 'Process and release', objective: 'Install a structured recovery sequence' },
    { segment: 'Exercise: Lesson Extraction', focus: 'Growth mindset', objective: 'Turn every setback into a development moment' },
    { segment: 'Exercise: Resilience Reps', focus: 'Simulated adversity', objective: 'Practice bouncing back under controlled pressure' },
    { segment: 'Daily Resilience Log', focus: 'Tracking', objective: 'Track recovery speed and patterns' },
    { segment: 'Weekly Reflection & Certification', focus: 'Integration', objective: 'Lock in the resilience skill' },
  ],
  coachScience: {
    videoTitle: 'How Resilience Is Built',
    points: [
      'Resilience is not about being tough — it\'s about recovering quickly.',
      'The victim mindset activates learned helplessness, which shuts down problem-solving.',
      'Processing failure (not ignoring it) is what builds real mental toughness.',
      'Elite athletes fail more than average ones — they just recover faster.',
    ],
    playerAnalogy: 'A slump doesn\'t define you. What you do in the slump defines you. The comeback starts the moment you choose to learn.',
    baseballAnalogy: 'Baseball is a game of failure — the best hitters fail 7 out of 10 times. Resilience is the skill that separates .200 from .300.',
  },
  questions: [
    { question: 'When something goes wrong, is your first thought about yourself or the situation?', insight: 'Resilient athletes separate the event from their identity. "I struck out" is not the same as "I\'m a failure."' },
    { question: 'Do you blame the ump, the field, or the pitcher when things go wrong?', insight: 'External blame feels good in the moment but removes your power to change. Ownership is the first step back.' },
    { question: 'How long do you carry a bad game?', insight: 'If it\'s more than the drive home, your recovery system needs work. The goal is to release by the time you leave the field.' },
  ],
};
