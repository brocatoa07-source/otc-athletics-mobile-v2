/* ────────────────────────────────────────────────
 * COURSE DATA — SKILL #4: EMOTIONAL CONTROL
 * "Don't React. Respond."
 * Weeks 7–8 · Shadow → Mastery
 * ──────────────────────────────────────────────── */

export const WEEK_7 = {
  title: 'The Shadow of Emotion',
  quote: 'You can\'t stop emotions from showing up — you can stop feeding them.',
  outline: [
    { segment: 'Opening & Overview', focus: 'Triggers & tension patterns', objective: 'Understand reactive loops' },
    { segment: 'Coach Video: "The Hijack"', focus: 'Fight/flight + fine motor loss', objective: 'See why emotion hurts performance' },
    { segment: 'Exercise 1: Body–Emotion Map', focus: 'Body awareness', objective: 'Map where emotions live in the body' },
    { segment: 'Exercise 2: Hot Button Replay', focus: 'Trigger identification', objective: 'Break the story–body loop' },
    { segment: 'Exercise 3: 1-Minute Reset Training', focus: 'Reset speed', objective: 'Prove recovery is a skill' },
    { segment: 'Emotion Log', focus: 'Tracking', objective: '3–5 self-catches this week' },
    { segment: 'Daily Micro Rep', focus: '"Name + Breath" rep', objective: 'Build daily regulation habit' },
    { segment: 'Self-Assessment', focus: 'Rate your control', objective: 'Measure progress (Pass/Repeat)' },
  ],
  coachScience: {
    videoTitle: 'The Hijack',
    points: [
      'Stress flips the body into fight/flight mode.',
      'Fine motor control, vision, and timing all get worse when arousal is high.',
      'Breath + naming the emotion turns the "thinking brain" back on.',
      'Emotional control = recovery speed, not being emotionless.',
    ],
    playerAnalogy: 'When you get emotional, your body goes into survival mode — your swing gets fast, your eyes get narrow, and your timing disappears. Name it, breathe, and the calm brain takes the wheel.',
    baseballAnalogy: 'A pitcher who loses the zone after a homer isn\'t bad — he\'s hijacked. The great ones have a 1-pitch reset. That\'s emotional control.',
  },
};

export const WEEK_8 = {
  title: 'Emotional Mastery',
  quote: 'Your body feels "nerves" and "excitement" the same. The label changes the outcome.',
  outline: [
    { segment: 'Coach Video: "Interpretation Controls Chemistry"', focus: 'Reframe threat → readiness', objective: 'Change the label, change the outcome' },
    { segment: 'Exercise 1: Name It to Tame It', focus: 'Label + Breath + Reframe', objective: 'Calming through naming and acting' },
    { segment: 'Exercise 2: Fear Reframe', focus: 'Worst-case mapping', objective: 'Shrink fear with a plan' },
    { segment: 'Exercise 3: Physiological Regulation', focus: 'Breath + body reset', objective: 'Breath controls body, body controls execution' },
    { segment: 'Applied Simulation: 90-Second Rule', focus: 'Real trigger protocol', objective: 'Prove emotion peaks and falls' },
    { segment: 'Daily Challenge: Calm Under Pressure', focus: '7-day checklist', objective: 'Build non-negotiable habits' },
    { segment: 'End-of-Skill Certification', focus: 'Reflect & certify', objective: 'Lock in emotional control' },
  ],
  coachScience: {
    videoTitle: 'Interpretation Controls Chemistry',
    points: [
      'Gas pedal (sympathetic) vs brake pedal (parasympathetic) — you control which one wins.',
      'Labeling an emotion reduces its intensity fast.',
      'Reframing turns threat into readiness — same chemistry, different outcome.',
    ],
    playerAnalogy: 'Your heart racing before an at-bat is just energy. Call it "danger" and you tighten up. Call it "readiness" and you attack the zone.',
    baseballAnalogy: 'The closer who thrives under pressure and the one who chokes feel the same adrenaline. The difference is the label.',
  },
};

/* Body area options */
export const BODY_AREAS_ANGER = ['Jaw', 'Chest', 'Hands', 'Shoulders', 'Stomach', 'Eyes'];
export const BODY_AREAS_ANXIETY = ['Chest', 'Stomach', 'Throat', 'Hands', 'Breath'];
export const BODY_AREAS_SHAME = ['Face / Heat', 'Eyes', 'Chest', 'Stomach'];

/* Release cues by body area */
export const RELEASE_CUES: Record<string, string[]> = {
  Jaw: ['Unclench', 'Tongue to roof', 'Slow exhale'],
  Hands: ['Shake out', 'Loosen grip', 'Glove squeeze + release'],
  Shoulders: ['Roll down', 'Exhale drop', 'Posture tall'],
  Chest: ['Deep breath', 'Open posture', 'Slow exhale'],
  Stomach: ['Belly breath', 'Exhale long', 'Relax core'],
};

/* Trigger options */
export const TRIGGER_OPTIONS = [
  'Bad call',
  'Strikeout in big spot',
  'Error',
  'Coach yelling',
  'Teammate mistake',
  'Parents / scouts watching',
  'Slump / 0-for',
  'Getting benched',
];

/* Emotion options */
export const EMOTION_OPTIONS = ['Anger', 'Frustration', 'Embarrassment', 'Fear', 'Panic'];

/* Reset scenarios */
export const RESET_SCENARIOS = [
  'Strikeout looking on a bad call',
  'Missed ground ball',
  'Coach gets on you',
  'Bases loaded — you feel your chest tighten',
];

/* Reset speed options */
export const RESET_SPEED_OPTIONS = ['< 10 seconds', '1 pitch', '2–3 pitches'];

/* Breath pattern options for Week 8 */
export const BREATH_PATTERNS = [
  '4–6 breathing (inhale 4, exhale 6)',
  '4–7–8 breathing',
  'Double inhale → long exhale',
];

/* Week 8 scenarios for Name It to Tame It */
export const TAME_SCENARIOS = [
  'You just struck out with runners in scoring position.',
  'Your coach pulls you from the game mid-inning.',
  'You made a throwing error and the runner scores.',
  'The umpire missed a call and you know it.',
  'You\'re 0-for-3 going into your last at-bat.',
  'A scout is watching and you feel the pressure rising.',
];
