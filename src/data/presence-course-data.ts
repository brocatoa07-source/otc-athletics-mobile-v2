/* ────────────────────────────────────────────────
 * COURSE DATA — WEEK 8: PRESENCE
 * ──────────────────────────────────────────────── */

import type { CourseWeekContent } from './course-types';

export const PRESENCE_WEEK: CourseWeekContent = {
  title: 'The Shadow of Anxiety',
  quote: 'The past is film. The future is fiction. The only pitch that exists is the one in front of you.',
  objective: 'Learn to compete in the present moment instead of living in past mistakes or future fears.',
  lesson: 'Anxiety is the body\'s response to a future that hasn\'t happened yet. Rumination is the mind replaying a past that can\'t be changed. Both steal you from the only moment that matters — now. This week you learn to anchor yourself in the present pitch.',
  tool: 'Present-Moment Anchor — a physical cue (toe dig, glove squeeze) paired with a breath to snap back to now',
  meditation: 'Now Meditation — 5 minutes of sensory grounding (what you see, hear, feel)',
  journalPrompt: 'Where does your mind go when pressure rises — the past or the future? What does that cost you?',
  weeklyChallenge: 'Every time you catch yourself replaying a past mistake or worrying about the next play, use your Present-Moment Anchor. Count how many times you caught yourself and pulled back.',
  reflection: 'How often were you truly present this week vs. time-traveling? What did being present feel like in your body?',
  outline: [
    { segment: 'Opening: Past, Present, Future', focus: 'Define presence', objective: 'Show where athletes actually compete' },
    { segment: 'Coach Video: The Default Mode Network', focus: 'Brain science', objective: 'Understand why the mind wanders' },
    { segment: 'Shadow Pattern: Anxiety / Rumination', focus: 'Identify the pattern', objective: 'See how time-traveling destroys performance' },
    { segment: 'Exercise: Present-Moment Anchor', focus: 'Physical grounding', objective: 'Install a sensory cue to snap back to now' },
    { segment: 'Exercise: Sensory Grounding (5-4-3-2-1)', focus: 'Sensory awareness', objective: 'Use the senses to anchor in the present' },
    { segment: 'Exercise: Between-Play Presence Reset', focus: 'Game application', objective: 'Practice returning to now between plays' },
    { segment: 'Daily Presence Score', focus: 'Tracking', objective: 'Rate presence quality each session' },
    { segment: 'Weekly Reflection & Certification', focus: 'Integration', objective: 'Lock in the presence skill' },
  ],
  coachScience: {
    videoTitle: 'Where Great Performances Happen',
    points: [
      'The default mode network is the brain\'s "wandering" system — it activates when you\'re not focused on a task.',
      'Anxiety is your body preparing for a threat that hasn\'t arrived. In sport, it steals reaction time.',
      'Rumination keeps the amygdala activated — your body is still in the past moment.',
      'Physical grounding (feeling your feet, squeezing your glove) forces the brain into sensory mode, which is the present.',
    ],
    playerAnalogy: 'You can\'t hit tomorrow\'s pitch. You can\'t redo yesterday\'s strikeout. But you can crush this pitch if you\'re actually here for it.',
    baseballAnalogy: 'The closer who thinks about the last walk loads the next pitch with baggage. Clean the slate, compete clean.',
  },
  questions: [
    { question: 'Do you replay bad at-bats while still in the game?', insight: 'That means your body is in the present but your mind is in the past. You\'re competing at half capacity.' },
    { question: 'Do you feel nervous before big moments or excited?', insight: 'Anxiety and excitement feel almost identical physically. The difference is whether you\'re focused on threat or opportunity.' },
    { question: 'When was the last time you felt completely "in the zone"?', insight: 'Flow states only happen in the present. If you want more of them, presence is the prerequisite.' },
  ],
};
