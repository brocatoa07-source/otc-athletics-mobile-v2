/* ────────────────────────────────────────────────
 * COURSE DATA — WEEK 3: FOCUS
 * ──────────────────────────────────────────────── */

import type { CourseWeekContent } from './course-types';

export const FOCUS_WEEK: CourseWeekContent = {
  title: 'The Shadow of Distraction',
  quote: 'You can\'t hit what you\'re not locked into. Focus is a skill, not a gift.',
  objective: 'Learn to stay locked in pitch-to-pitch and block out outcome thinking.',
  lesson: 'Distraction and outcome obsession are the two biggest focus killers in baseball. When you\'re thinking about your batting average mid-at-bat, you\'ve already lost the pitch. This week you learn to shrink your world to one pitch at a time.',
  tool: 'Focal Lock Drill — practice narrowing attention to a single external cue',
  meditation: 'Single-Point Focus — 5 minutes of cue-word anchoring',
  journalPrompt: 'What pulls your attention away from the present pitch most often? Stats? Crowd? Last at-bat?',
  weeklyChallenge: 'Use a cue word (e.g., "see it") before every pitch this week — in games, BP, and practice. Track how many pitches you stayed locked in vs. drifted.',
  reflection: 'How many pitches this week did you truly compete on vs. drift through? What did you learn about your focus patterns?',
  outline: [
    { segment: 'Opening: What Focus Actually Means', focus: 'Define pitch-to-pitch focus', objective: 'Separate focus from intensity' },
    { segment: 'Coach Video: Attentional Spotlight', focus: 'Focus science', objective: 'Understand narrow vs broad attention' },
    { segment: 'Shadow Pattern: Distraction / Outcome Obsession', focus: 'Identify the pattern', objective: 'See how stats and results steal focus' },
    { segment: 'Exercise: Focal Lock Drill', focus: 'Narrow attention', objective: 'Practice locking onto a single cue' },
    { segment: 'Exercise: Cue Word System', focus: 'Verbal anchoring', objective: 'Install a focus trigger word' },
    { segment: 'Exercise: Between-Pitch Reset', focus: 'Reset routine', objective: 'Build a pitch-to-pitch refocus sequence' },
    { segment: 'Daily Focus Log', focus: 'Tracking', objective: 'Track focus quality per session' },
    { segment: 'Weekly Reflection & Certification', focus: 'Integration', objective: 'Lock in the focus skill' },
  ],
  coachScience: {
    videoTitle: 'The Science of Attention',
    points: [
      'Your brain can only attend to one thing at a time — multitasking is a myth.',
      'Outcome thinking activates the evaluative brain, which slows reaction time.',
      'Cue words act as attentional anchors — they pull you back to the present.',
      'Elite athletes compete in a narrow focus state; average athletes compete in a broad, distracted state.',
    ],
    playerAnalogy: 'Every pitch is a new at-bat. The last pitch doesn\'t exist anymore. The next pitch doesn\'t exist yet. Win this one.',
    baseballAnalogy: 'The best hitters don\'t think about their average at the plate. They see the ball. That\'s it.',
  },
  questions: [
    { question: 'Do you know your stats mid-game?', insight: 'If yes, you\'re outcome-focused. Elite focus means you couldn\'t tell someone your stats until after the game.' },
    { question: 'What do you think about between pitches?', insight: 'Between pitches is where focus is won or lost. Most players drift — great ones reset.' },
    { question: 'Can you describe the last pitch you saw in detail?', insight: 'If you can\'t, you weren\'t truly locked in. Focus means you remember the pitch, not the result.' },
  ],
};
