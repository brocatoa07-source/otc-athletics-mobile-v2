/* ────────────────────────────────────────────────
 * COURSE DATA — WEEK 1: AWARENESS
 * ──────────────────────────────────────────────── */

import type { CourseWeekContent } from './course-types';

export const AWARENESS_WEEK: CourseWeekContent = {
  title: 'The Shadow of Autopilot',
  quote: 'Most players don\'t fail because of talent — they fail because they aren\'t aware of what\'s happening inside.',
  objective: 'Learn to recognize your thoughts, emotions, and triggers in real time so you stop competing on autopilot.',
  lesson: 'Awareness is the foundation of every mental skill. Without it, you can\'t control what you can\'t see. This week you learn to notice — your body, your thoughts, your emotional state — before they control you.',
  tool: 'Body Awareness Scan + Thought Labeling Exercise',
  meditation: 'Mindful Check-In — 5-minute body-and-breath scan before training',
  journalPrompt: 'When did you last compete on autopilot? What were the signs you missed?',
  weeklyChallenge: 'Before every practice or game this week, do a 60-second body scan and name one emotion you are feeling. Write it down.',
  reflection: 'What did you notice about yourself this week that you were previously blind to?',
  outline: [
    { segment: 'Opening & Overview', focus: 'Define awareness', objective: 'Build buy-in for why awareness matters' },
    { segment: 'Coach Video: PFC vs Amygdala', focus: 'Brain science', objective: 'Understand reactive vs responsive brain' },
    { segment: 'Shadow Pattern: Autopilot', focus: 'Identify the pattern', objective: 'See how autopilot sabotages performance' },
    { segment: 'Exercise: Body Awareness Scan', focus: 'Body awareness', objective: 'Notice physical cues before they escalate' },
    { segment: 'Exercise: Thought Labeling', focus: 'Mental awareness', objective: 'Catch past/future thinking in real time' },
    { segment: 'Exercise: Autopilot Simulation', focus: 'Distraction vs Focus', objective: 'Feel the difference between aware and unaware' },
    { segment: 'Daily Micro Log', focus: 'Habit building', objective: 'Track awareness moments daily' },
    { segment: 'Weekly Reflection & Certification', focus: 'Integration', objective: 'Lock in the skill before moving on' },
  ],
  coachScience: {
    videoTitle: 'Why Awareness Matters',
    points: [
      'PFC (Prefrontal Cortex): Decision, focus, control.',
      'Amygdala: Fight/flight; emotional reactions.',
      'Labeling emotions ("I\'m frustrated") instantly reduces reactivity.',
      'Over time, awareness rewires the brain for quicker recovery and focus.',
    ],
    playerAnalogy: 'You\'ve got two brains — one reacts, one responds. When you name what\'s happening, the calm brain takes the wheel.',
    baseballAnalogy: 'You can\'t fix a swing mid-pitch; you fix what caused it. Awareness is your mental film room.',
  },
  questions: [
    { question: 'When do you realize you\'re frustrated — before or after it shows up?', insight: 'Before = awareness in real time. The goal is to shorten the gap between feeling and noticing.' },
    { question: 'What\'s your version of autopilot — physical, mental, or emotional?', insight: 'Autopilot isn\'t bad when you\'re locked in — it\'s bad when you stop adapting.' },
    { question: 'What happens to your body when you start losing focus?', insight: 'Your body is the first alarm. When you notice it, that\'s your reset moment.' },
  ],
};
