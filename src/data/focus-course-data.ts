/* ────────────────────────────────────────────────
 * COURSE DATA — SKILL #3: FOCUS
 * Weeks 5–6 · Shadow → Mastery
 * ──────────────────────────────────────────────── */

export const WEEK_5 = {
  title: 'The Shadow of Focus',
  quote: 'You don\'t "lose focus." You stop reclaiming it.',
  objective: 'Identify distraction patterns, outcome obsession, and overthinking — then learn the mechanics of returning your attention quickly.',
  outline: [
    { segment: 'Coach Video: Your Attention Is a Spotlight', focus: 'How stress steals focus', objective: 'Understand the spotlight model' },
    { segment: 'Exercise 1: Focus Stealers Audit', focus: 'Identify your distractions', objective: 'Name the thieves' },
    { segment: 'Exercise 2: Noise Challenge', focus: 'Focus under distraction', objective: 'Reset beats silence' },
    { segment: 'Exercise 3: Focus Window Drill', focus: 'Guided attention training', objective: 'Train the return' },
    { segment: 'Focus Tracker', focus: 'Track in-game focus breaks', objective: 'Build self-awareness' },
    { segment: 'Daily Micro Rep', focus: '60-90s daily reset', objective: 'Build the habit' },
    { segment: 'Self-Assessment', focus: 'Rate your focus skills', objective: 'Pass or repeat' },
  ],
  coachScience: {
    videoTitle: 'Your Attention Is a Spotlight',
    points: [
      'Stress pulls attention to threat — mistakes, stats, judgment.',
      'Breath + body cue brings the "decision brain" back online.',
      'Focus isn\'t silence — it\'s return speed.',
      'The faster you notice the drift, the faster you return.',
    ],
    playerAnalogy: 'Your attention is like a flashlight. Pressure doesn\'t break it — it just points it at the wrong thing.',
    baseballAnalogy: 'Every pitch is a chance to aim the flashlight. Miss one? Aim it again.',
  },
};

export const WEEK_6 = {
  title: 'The Skill of Focus (Mastery)',
  quote: 'Focus isn\'t silence. Focus is return speed.',
  objective: 'Build a personal reset routine, train controlled attention, and develop focus that holds under game pressure.',
  outline: [
    { segment: 'Coach Video: Focus = Reset Cycles', focus: 'Train the return loop', objective: 'Understand reset cycles' },
    { segment: 'Exercise 1: Build Your Reset Routine', focus: 'Personal 3-step routine', objective: 'Install the reset' },
    { segment: 'Exercise 2: Controlled Countdown', focus: 'Rhythm under stress', objective: 'Counting builds calm' },
    { segment: 'Exercise 3: Eyes & Breath Control', focus: 'Visual + breath sync', objective: 'Where eyes go, mind follows' },
    { segment: 'Applied Simulation: Focus Under Pressure', focus: 'Pressure test', objective: 'Recover fast, not perfect' },
    { segment: 'Daily Micro Rep', focus: '1-minute presence reset', objective: 'Portable focus rebuild' },
    { segment: 'End-of-Module Certification', focus: 'Reflect & certify', objective: 'Lock in the skill' },
  ],
  coachScience: {
    videoTitle: 'Focus = Reset Cycles',
    points: [
      'Focus-drift-return cycles train the brain like reps train muscles.',
      'Long exhale lowers tension and restores precision.',
      'Eyes + breath + posture work together as one system.',
      'You get faster at returning until it becomes automatic.',
    ],
    playerAnalogy: 'Every pitch resets the count. Every breath resets the mind.',
    baseballAnalogy: 'The best hitters don\'t have better focus — they have faster resets.',
  },
};

/* Focus stealers */
export const FOCUS_STEALERS = [
  'Bad call / ump',
  'Scoreboard / stats',
  'Next at-bat pressure',
  'Teammates watching',
  'Coaches/scouts',
  'Mechanical thoughts mid-rep',
  'Anger/frustration loop',
  'Social media / phone',
];

/* Attention drift targets */
export const ATTENTION_TARGETS = ['Past (mistakes)', 'Future (results)', 'Noise (crowd/parents)', 'Mechanics', 'Anger'];

/* Pressure freeze options */
export const FREEZE_OPTIONS = ['Eyes', 'Breath', 'Body', 'Thoughts'];

/* Focus anchors */
export const ANCHOR_OPTIONS = ['Breath sound', 'Heartbeat', 'Feet pressure', 'Visual target (eyes open)'];

/* Drift pull options */
export const DRIFT_OPTIONS = ['Past', 'Future', 'Noise', 'Mechanics', 'Emotion'];

/* Reset routine options */
export const PHYSICAL_CUE_OPTIONS = ['Step out / back', 'Glove tap / bat tap', 'Shoulder roll', 'Toe dig', 'Wipe dirt'];
export const BREATH_OPTIONS = ['In 3 / Out 4 (x2)', 'In 4 / Out 6 (x1-2)', 'Double inhale \u2192 long exhale'];
export const CUE_WORD_OPTIONS = ['"Back."', '"See it."', '"Lock in."', '"Next pitch."'];

/* Noise challenge tasks */
export const NOISE_TASKS = [
  'Count backward from 100 by 3s (60 sec)',
  'Balance on one foot (30 sec each side)',
  'Write your name non-dominant hand (60 sec)',
];

/* Countdown tasks */
export const COUNTDOWN_TASKS = ['3 dry swings', '5 clean catches', '10 perfect foot taps', '1 balance hold'];

/* Simulation options */
export const SIM_OPTIONS = [
  '60 sec writing task under timer',
  '20 sec recite MLB teams',
  '30 sec balance + countdown',
];
