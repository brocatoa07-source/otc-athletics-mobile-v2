/* ────────────────────────────────────────────────
 * COURSE DATA — SKILL #5: RESILIENCE
 * "Bend, Don't Break."
 * Weeks 9–10 · Shadow → Mastery
 * ──────────────────────────────────────────────── */

export const WEEK_9 = {
  title: 'The Failure Filter',
  quote: 'Failure doesn\'t hurt you most — your meaning does.',
  outline: [
    { segment: 'Opening & Overview', focus: 'Victim mindset, frustration loop, identity crash', objective: 'Understand shadow patterns' },
    { segment: 'Coach Video: "The Resilience Loop"', focus: 'Mistake → Reaction → Reframe → Response', objective: 'Learn the loop' },
    { segment: 'Exercise 1: Shadow Pattern Diagnostic', focus: '9-question diagnostic', objective: 'Identify your top shadow' },
    { segment: 'Exercise 2: Failure Filter Reframe Builder', focus: 'Reframe 3 recent failures', objective: 'Control the meaning' },
    { segment: 'Exercise 3: The Bounce-Back Test', focus: 'Failure reps under pressure', objective: 'Train recovery speed' },
    { segment: '1% Bounce-Back Tracker', focus: 'Daily frustration log', objective: '7 logs in 7 days' },
    { segment: 'Daily Micro Rep', focus: '"Reframe Rep"', objective: 'Build daily habit' },
    { segment: 'Self-Assessment', focus: 'Rate your resilience', objective: 'Pass / Repeat' },
  ],
  coachScience: {
    videoTitle: 'The Resilience Loop',
    points: [
      'Failure triggers emotion fast — the goal is to shorten the lag.',
      'Resilience Loop: Mistake → Reaction → Reframe → Response.',
      'Resilience = awareness + recovery speed + reframing.',
      'Every shadow pattern is fixed mindset wearing a mask.',
    ],
    playerAnalogy: 'The best hitters in the world fail 7 out of 10 times. They don\'t fail less — they recover faster. Your job isn\'t to avoid failure. It\'s to shorten the spiral.',
    baseballAnalogy: 'A pitcher who gives up a bomb in the first inning has 8 more innings. What he does in the next 30 seconds determines the rest of the game.',
  },
};

export const WEEK_10 = {
  title: 'Adversity as Advantage',
  quote: 'Pressure isn\'t punishment — it\'s proof you\'re in the arena.',
  outline: [
    { segment: 'Coach Video: "Adversity = Training Stimulus"', focus: 'Growth mindset + chaos practice', objective: 'Turn fear into curiosity' },
    { segment: 'Exercise 1: Controlled Chaos Simulation', focus: 'Disruption + composure', objective: 'Train composure under chaos' },
    { segment: 'Exercise 2: Reframe Board', focus: 'Negative → Growth rewrites', objective: 'Emotional conditioning' },
    { segment: 'Exercise 3: Bounce-Back Blueprint', focus: 'Build your recovery system', objective: 'Personal response card' },
    { segment: 'Applied Sim: One Inning Recovery', focus: '3 scenarios, auto-recovery', objective: 'Automatic recovery speed' },
    { segment: 'Daily Rep', focus: 'Mantra + adjustment', objective: 'Daily non-negotiable' },
    { segment: 'End-of-Skill Certification', focus: 'Reflect & certify', objective: 'Lock in resilience' },
  ],
  coachScience: {
    videoTitle: 'Adversity = Training Stimulus',
    points: [
      'Struggle interpreted as learning increases motivation.',
      'Growth mindset turns fear into curiosity.',
      'Chaos practice builds real-game composure.',
    ],
    playerAnalogy: 'You don\'t get strong by lifting light weight. You get resilient by facing adversity and choosing to respond — not react.',
    baseballAnalogy: 'The teams that win championships aren\'t the ones who never struggle. They\'re the ones who recover fastest when they do.',
  },
};

/* Shadow diagnostic questions */
export const DIAGNOSTIC_QUESTIONS = [
  { question: 'After a bad call I usually:', options: ['Blame', 'Argue', 'Shut down', 'Reset'] },
  { question: 'After an error I tell myself:', options: ['"I always mess up"', '"I\'m better than this"', '"Next play"', '"I suck"'] },
  { question: 'After a bad game I feel:', options: ['Embarrassed', 'Angry', 'Hopeless', 'Motivated'] },
  { question: 'When I\'m in a slump I:', options: ['Try harder', 'Get quiet', 'Blame others', 'Simplify'] },
  { question: 'When a teammate makes an error I:', options: ['Get frustrated', 'Say nothing', 'Pick them up', 'Roll my eyes'] },
  { question: 'When I get pulled from the game I:', options: ['Shut down', 'Get angry', 'Stay engaged', 'Sulk'] },
  { question: 'After a strikeout I:', options: ['Slam the bat', 'Walk away silent', 'Reset and learn', 'Replay it all game'] },
  { question: 'When things aren\'t going my way I:', options: ['Blame the ump', 'Blame myself', 'Get quiet', 'Find a way'] },
  { question: 'My default mindset after failure is:', options: ['"Not fair"', '"I\'m not good enough"', '"Whatever"', '"What can I learn?"'] },
];

/* Bounce-back test options */
export const BOUNCE_BACK_TASKS = [
  { label: 'Paper toss into cup (10 attempts)', icon: 'create-outline' as const },
  { label: 'Wall ball catches (30 sec)', icon: 'hand-left-outline' as const },
  { label: 'Coin toss target (10 attempts)', icon: 'ellipse-outline' as const },
  { label: 'Timed footwork taps (30 sec)', icon: 'footsteps-outline' as const },
];

/* Reframe board statements */
export const REFRAME_STATEMENTS = [
  '"I suck."',
  '"Coach hates me."',
  '"I always mess up."',
  '"I can\'t hit."',
  '"I\'m not good enough."',
  '"This is unfair."',
  '"I\'ll never get better."',
  '"Everyone is watching me fail."',
];

/* One Inning Recovery scenarios */
export const RECOVERY_SCENARIOS = [
  { label: 'ERROR', scenario: 'You just booted a routine ground ball with two outs. Runner scores.' },
  { label: 'STRIKEOUT', scenario: 'You struck out looking on a pitch you should\'ve crushed. Bases were loaded.' },
  { label: 'BAD CALL', scenario: 'Ump calls strike three on a pitch 6 inches outside. Game on the line.' },
];

/* Chaos layer prompts */
export const CHAOS_PROMPTS = ['Switch hands', 'Speed up', 'Half time', 'Eyes closed for 1 rep', 'Use opposite side'];
