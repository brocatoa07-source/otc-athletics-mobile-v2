/* ────────────────────────────────────────────────
 * COURSE DATA — SKILL #6: ACCOUNTABILITY
 * "Own the Standard."
 * Weeks 11–12 · Shadow → Mastery
 * ──────────────────────────────────────────────── */

export const WEEK_11 = {
  title: 'The Excuse Loop',
  quote: 'Blame removes control. Ownership restores it.',
  outline: [
    { segment: 'Opening & Overview', focus: 'Blame, externalizing, avoiding responsibility', objective: 'Understand the excuse loop' },
    { segment: 'Coach Video: "The Ownership Gap"', focus: 'Mistake → Ownership → Adjustment → Growth', objective: 'See the ownership loop in action' },
    { segment: 'Exercise 1: Excuse Detector', focus: '3-scenario accountability diagnostic', objective: 'Reveal blame patterns and score your accountability' },
    { segment: 'Exercise 2: Control Filter', focus: 'Categorize situations — control vs. no control', objective: 'Train yourself to live inside the circle of control' },
    { segment: 'Exercise 3: Ownership Reset Practice', focus: 'Recall + rewrite a real frustration moment', objective: 'Build adjustment power through ownership' },
    { segment: 'Ownership Simulation', focus: 'Physical drill with ownership phrases per mistake', objective: 'Make accountability a reflex, not a choice' },
    { segment: 'Week 11 Accountability Tracker', focus: '3 logged ownership moments', objective: 'Build proof of accountability this week' },
    { segment: 'Daily Ownership Rep', focus: '"Today I owned ______."', objective: 'Lock in the nightly habit' },
    { segment: 'Self-Assessment', focus: 'Rate accountability on 3 dimensions', objective: 'Pass / Repeat' },
  ],
  coachScience: {
    videoTitle: 'The Ownership Gap',
    points: [
      'When performance dips, the brain protects the ego through blame and excuses.',
      'Blame removes control — ownership restores it.',
      'Ownership Loop: Mistake → Ownership → Adjustment → Growth.',
      'Excuses feel protective in the moment but steal control from the athlete long-term.',
    ],
    playerAnalogy: 'Two players both make an error in the same inning. Player A blames the field. Player B thinks "my footwork was rushed." Who gets better by next week? Every time.',
    baseballAnalogy: 'You can\'t fix your swing if you think the ump took it from you. The moment you say "I controlled my load timing" — now you have power. Ownership puts your hand back on the bat.',
  },
};

export const WEEK_12 = {
  title: 'The Ownership Standard',
  quote: 'Elite athletes don\'t just own mistakes — they own standards.',
  outline: [
    { segment: 'Coach Video: "Standards Over Feelings"', focus: 'Average acts on feelings, elite acts on standards', objective: 'Shift from feeling-based to standard-based behavior' },
    { segment: 'Exercise 1: Build Your Player Standard', focus: 'Define personal effort, attitude, preparation standards', objective: 'Create your standard card' },
    { segment: 'Exercise 2: The Ownership Mirror', focus: 'Self-honesty audit — look outward vs. inward', objective: 'Develop ego control' },
    { segment: 'Exercise 3: Feedback Reframe', focus: 'Rewrite criticism as coaching data', objective: 'Receive feedback as fuel, not attack' },
    { segment: 'Standard Simulation', focus: 'Physical drill — complete standard despite discomfort cue', objective: 'Keep promises to yourself under pressure' },
    { segment: 'Week 12 Standard Tracker', focus: 'Daily effort, attitude, and preparation log', objective: 'Document standard-keeping every day' },
    { segment: 'Daily Ownership Rep', focus: '"I control effort, attitude, and preparation."', objective: 'Anchor the daily ownership standard' },
    { segment: 'Skill #6 Certification', focus: 'Reflect, complete, and certify', objective: 'Lock in accountability for good' },
  ],
  coachScience: {
    videoTitle: 'Standards Over Feelings',
    points: [
      'Average athletes act based on feelings — tired, unmotivated, frustrated.',
      'Accountable athletes act based on standards — regardless of how they feel.',
      'Accountability requires ego control: hearing feedback as data, not as an attack.',
      'Leadership emerges when athletes own the team\'s standard, not just their own performance.',
    ],
    playerAnalogy: 'You can feel tired and still take your extra swings. You can feel frustrated and still give effort. The standard doesn\'t care how you feel. That\'s the point.',
    baseballAnalogy: 'The best teams in baseball don\'t have the best talent — they have the most accountable culture. One player who owns his standard raises the floor for everyone around him.',
  },
};

/** Excuse Detector scenarios — each has 3 reactions, ownership = option at index 2 */
export const EXCUSE_SCENARIOS = [
  {
    situation: 'You strike out looking on a borderline pitch.',
    options: [
      { text: '"That ump is awful."', excuseType: 'external' as const },
      { text: '"I can\'t hit that pitch anyway."', excuseType: 'helpless' as const },
      { text: '"My timing was late — I was behind the pitch."', excuseType: 'ownership' as const },
    ],
  },
  {
    situation: 'You get benched after a rough week.',
    options: [
      { text: '"Coach doesn\'t trust me."', excuseType: 'external' as const },
      { text: '"It\'s not fair — I worked hard."', excuseType: 'helpless' as const },
      { text: '"What can I do to earn it back?"', excuseType: 'ownership' as const },
    ],
  },
  {
    situation: 'You make a throwing error on a routine play.',
    options: [
      { text: '"Bad hop — the field is terrible."', excuseType: 'external' as const },
      { text: '"I always mess up in big moments."', excuseType: 'helpless' as const },
      { text: '"My footwork was rushed — I need to slow down."', excuseType: 'ownership' as const },
    ],
  },
];

/** Control filter items for categorization exercise */
export const CONTROL_FILTER_ITEMS = [
  { label: 'Umpire calls', hasControl: false },
  { label: 'Effort', hasControl: true },
  { label: 'Preparation', hasControl: true },
  { label: 'Coach decisions', hasControl: false },
  { label: 'Body language', hasControl: true },
  { label: 'Opponents', hasControl: false },
  { label: 'Focus between pitches', hasControl: true },
  { label: 'Attitude after mistakes', hasControl: true },
];

/**
 * Week 11 simulation — accountability as a REFLEX.
 * After every miss or failed rep, say an ownership phrase before moving on.
 */
export const WEEK_11_SIM_TASKS = [
  { label: 'Tee work — 15 swings. Own every miss out loud before resetting.', icon: 'baseball-outline' as const },
  { label: 'Front toss — 10 reps. Say "I was [late/early]" after each bad contact.', icon: 'reload-outline' as const },
  { label: 'Fielding footwork — 3 min. Own every misread before the next rep.', icon: 'footsteps-outline' as const },
  { label: 'Conviction sprints — 3×20 yds at max effort, no excuses for slow reps.', icon: 'flash-outline' as const },
];

/**
 * Week 12 simulation — hold your STANDARD regardless of how you feel.
 * Complete every task at your effort/attitude/preparation standard.
 */
export const WEEK_12_SIM_TASKS = [
  { label: "Full pre-game warmup routine — even if you don't want to do it.", icon: 'body-outline' as const },
  { label: 'Tee work — 25 swings at full competition intent, no lazy reps.', icon: 'baseball-outline' as const },
  { label: 'Throwing program or bullpen — 20 throws at your preparation standard.', icon: 'reload-outline' as const },
  { label: 'Film review — watch 2 min of your at-bats and find 1 thing you control to fix.', icon: 'videocam-outline' as const },
];

/** Feedback reframe examples for week 12 */
export const FEEDBACK_REFRAMES = [
  { original: '"Coach is criticizing me."',    prompt: 'Rewrite as coaching data:' },
  { original: '"Coach is always on my case."', prompt: 'What does that really mean?' },
  { original: '"I\'m getting called out."',    prompt: 'Reframe it as investment:' },
  { original: '"They\'re picking on me."',     prompt: 'What do they actually see?' },
];

/** The 3 standard fields for week 12 */
export const STANDARD_FIELDS = ['Effort', 'Attitude', 'Preparation'] as const;

/** Daily ownership phrase options */
export const OWNERSHIP_PHRASES = [
  'my body language after a bad play',
  'my preparation before the game',
  'my attitude in the dugout',
  'my focus between pitches',
  'my effort on every rep',
  'my response to feedback',
];
