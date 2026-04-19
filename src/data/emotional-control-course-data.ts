/* ────────────────────────────────────────────────
 * COURSE DATA — WEEK 4: EMOTIONAL CONTROL
 * ──────────────────────────────────────────────── */

import type { CourseWeekContent } from './course-types';

export const EMOTIONAL_CONTROL_WEEK: CourseWeekContent = {
  title: 'The Shadow of Overreaction',
  quote: 'Emotions are data, not directions. Feel them, but don\'t follow them off the cliff.',
  objective: 'Learn to regulate your reactions and compete with composure instead of being hijacked by frustration.',
  lesson: 'Overreaction and suppression are two sides of the same coin — both mean your emotions are running the show. This week you learn to feel without being controlled. The goal isn\'t to be emotionless — it\'s to be emotionally intelligent.',
  tool: 'Physiological Sigh — the fastest reset tool in neuroscience (double inhale + long exhale)',
  meditation: 'Emotional Reset — 5 minutes of naming emotions without reacting to them',
  journalPrompt: 'What emotion hijacked you most recently in competition? What triggered it? What did it cost you?',
  weeklyChallenge: 'After every mistake this week, use the physiological sigh before your next action. Track how many times you reset vs. reacted.',
  reflection: 'Did you react less this week? What happened to your performance when you stayed composed?',
  outline: [
    { segment: 'Opening: Emotions as Fuel vs Poison', focus: 'Reframe emotions', objective: 'See emotions as signals, not enemies' },
    { segment: 'Coach Video: The Emotional Hijack', focus: 'Amygdala hijack', objective: 'Understand why you blow up before you think' },
    { segment: 'Shadow Pattern: Overreaction / Suppression', focus: 'Identify the pattern', objective: 'See both extremes of emotional dysfunction' },
    { segment: 'Exercise: Physiological Sigh', focus: 'Nervous system reset', objective: 'Install the fastest calming tool available' },
    { segment: 'Exercise: Name It to Tame It', focus: 'Emotional labeling', objective: 'Reduce intensity by naming the emotion' },
    { segment: 'Exercise: 10-Second Reset Protocol', focus: 'Applied regulation', objective: 'Build a reset sequence for game situations' },
    { segment: 'Daily Emotion Tracking', focus: 'Awareness', objective: 'Track emotional patterns across the week' },
    { segment: 'Weekly Reflection & Certification', focus: 'Integration', objective: 'Lock in the emotional control skill' },
  ],
  coachScience: {
    videoTitle: 'Why You Blow Up (And How to Stop)',
    points: [
      'The amygdala hijack fires 6x faster than conscious thought — that\'s why you react before you think.',
      'Physiological sigh (double inhale + long exhale) activates the vagus nerve and calms the system in seconds.',
      'Suppressing emotions doesn\'t work — it increases cortisol and makes the next explosion worse.',
      'Naming an emotion ("I\'m frustrated") engages the PFC and immediately reduces amygdala activity.',
    ],
    playerAnalogy: 'You\'re not trying to be a robot. You\'re trying to be a thermostat — you feel the heat, but you regulate the temperature.',
    baseballAnalogy: 'The pitcher who slams the rosin bag just told the hitter he\'s rattled. Emotional control is a competitive advantage.',
  },
  questions: [
    { question: 'Do you slam your helmet, bat, or gear after bad at-bats?', insight: 'That\'s not passion — that\'s an amygdala hijack. Passion shows up as focus, not destruction.' },
    { question: 'Do you shut down or go silent after mistakes?', insight: 'Suppression looks calm on the outside but is just as destructive. Your body is still in fight-or-flight.' },
    { question: 'How long does it take you to recover from a bad play?', insight: 'The goal is to shorten that window. Elite competitors recover in seconds, not innings.' },
  ],
};
