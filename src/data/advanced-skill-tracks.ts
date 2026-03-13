/* ────────────────────────────────────────────────
 * Advanced Skill Tracks — Skills 7–11
 * These don't have 2-week courses; instead they
 * have definition, shadow, coreCues, tools,
 * journalPrompts, and a daily routine.
 * ──────────────────────────────────────────────── */

export interface AdvancedSkillTrack {
  key: string;
  num: number;
  name: string;
  color: string;
  definition: string;
  shadow: string;
  shadowDescription: string;
  looksLike: string[];
  coreCues: string[];
  tools: string[];
  journalPrompts: string[];
  routine: string[];
}

export const ADVANCED_SKILL_TRACKS: Record<string, AdvancedSkillTrack> = {
  communication: {
    key: 'communication',
    num: 7,
    name: 'Communication',
    color: '#06b6d4',
    definition: 'Clear, intentional expression and connection with coaches, teammates, and yourself.',
    shadow: 'Assumptions / Poor Listening',
    shadowDescription: 'You assume you know what others mean. You hear feedback as criticism. You shut down instead of speaking up.',
    looksLike: [
      'Misreading a coach\'s tone and shutting down',
      'Not asking for help when confused',
      'Assuming teammates are judging you',
      'Giving vague or passive responses',
    ],
    coreCues: [
      'Listen first, respond second',
      'Ask before assuming intent',
      '"What I heard was…" — confirm understanding',
      'Speak with conviction, not volume',
    ],
    tools: [
      'Active listening drill: repeat back what you heard before responding',
      'Feedback reframe: "They\'re investing, not attacking"',
      'Pre-game check-in: 1 sentence to a teammate before warmups',
      'Post-game debrief: 1 thing you communicated well today',
    ],
    journalPrompts: [
      'When did I shut down today instead of speaking up? What held me back?',
      'What feedback did I receive today? How did I interpret it vs. what was actually meant?',
      'Who did I connect with today? What made that conversation work?',
    ],
    routine: [
      'Before practice: say 1 encouraging thing to a teammate',
      'During practice: ask 1 clarifying question to a coach',
      'After practice: give 1 piece of genuine feedback to someone',
    ],
  },
  presence: {
    key: 'presence',
    num: 8,
    name: 'Presence',
    color: '#a855f7',
    definition: 'Competing fully in the current moment — not the last pitch, not the next at-bat.',
    shadow: 'Anxiety / Rumination',
    shadowDescription: 'Your mind lives in the past (replaying mistakes) or the future (worrying about outcomes). You\'re physically here but mentally somewhere else.',
    looksLike: [
      'Replaying an error 3 innings later',
      'Thinking about your batting average during an at-bat',
      'Worrying about scouts or coaches watching',
      'Feeling rushed, like time is slipping away',
    ],
    coreCues: [
      '"Be where your cleats are"',
      'One pitch at a time — the only pitch that matters is this one',
      'Eyes → breath → body = present',
      '"What can I do right now?"',
    ],
    tools: [
      '5-4-3-2-1 grounding: name 5 things you see, 4 you touch, 3 you hear',
      'Feet check: feel the pressure of your cleats on the ground',
      'Breath anchor: 1 slow breath resets you to now',
      'Present-moment mantra: "This pitch. This moment. Right here."',
    ],
    journalPrompts: [
      'When did I drift today? What pulled me out of the moment?',
      'What does it feel like when I\'m fully present vs. when I\'m not?',
      'What\'s my fastest way back to the present moment?',
    ],
    routine: [
      'Pre-game: 60-second breath focus with eyes closed',
      'Between innings: reset with feet-on-ground awareness',
      'Post-game: note 1 moment you were fully locked in today',
    ],
  },
  composure: {
    key: 'composure',
    num: 9,
    name: 'Composure',
    color: '#64748b',
    definition: 'Maintaining calm, controlled body language and posture — especially when things go wrong.',
    shadow: 'Frustration / Ego',
    shadowDescription: 'Your emotions leak through your body. Teammates and opponents can read your frustration, fear, or defeat before you even realize it.',
    looksLike: [
      'Head drop after a strikeout',
      'Visible frustration after an error (slamming glove, kicking dirt)',
      'Slow walk back to the dugout with slumped shoulders',
      'Eye rolls or negative body language toward teammates',
    ],
    coreCues: [
      'Body language is a choice, not a reaction',
      '"Walk like you just hit a double" — even after a strikeout',
      'Opponents read your body before they read your swing',
      'Composure is contagious — your team feeds off your energy',
    ],
    tools: [
      'Composure reset: shoulders back, chin up, eyes forward — 3 seconds',
      'Walk speed check: never rush after a mistake, walk with purpose',
      'Neutral face drill: practice keeping the same expression after good and bad plays',
      'Compete posture: stand tall, hands relaxed, eyes engaged',
    ],
    journalPrompts: [
      'What does my body do when I\'m frustrated? Where does it show first?',
      'Did anyone see my frustration today? What did that cost me?',
      'When was I most composed today? What did I do differently?',
    ],
    routine: [
      'Pre-game: set your "compete posture" during warmups',
      'In-game: after every negative play, composure reset before next pitch',
      'Post-game: rate your body language 1-5 today',
    ],
  },
  leadership: {
    key: 'leadership',
    num: 10,
    name: 'Leadership',
    color: '#ec4899',
    definition: 'Modeling consistency, discipline, and energy — leading by standard, not by title.',
    shadow: 'Self-Centeredness / Inconsistency',
    shadowDescription: 'Your energy depends on your performance. When you\'re going well, you\'re a great teammate. When you\'re struggling, you disappear.',
    looksLike: [
      'Being the loudest when winning, quietest when losing',
      'Only hustling when coaches are watching',
      'Body language that brings the team down',
      'Not picking up a teammate after their mistake',
    ],
    coreCues: [
      'Leaders don\'t need a title — they need a standard',
      'Your energy is either lifting or draining the team',
      'Consistency > intensity — show up the same every day',
      '"Who needs me right now?" — look outward, not inward',
    ],
    tools: [
      'Energy check: ask "Am I giving or taking energy right now?"',
      'First one / last one: be first to the field, last to leave',
      'Teammate lift: pick up 1 teammate per game who needs it',
      'Standard card: write 3 non-negotiables you hold yourself to daily',
    ],
    journalPrompts: [
      'Was I the same teammate today whether I went 3-for-3 or 0-for-3?',
      'Who needed me today? Did I show up for them?',
      'What\'s 1 thing I can do tomorrow to raise the standard for my team?',
    ],
    routine: [
      'Pre-game: be the first to bring energy in the dugout',
      'In-game: pick up 1 teammate who\'s struggling',
      'Post-game: ask "Did I raise or lower the standard today?"',
    ],
  },
  flow_state: {
    key: 'flow_state',
    num: 11,
    name: 'Flow State',
    color: '#14b8a6',
    definition: 'Competing in total immersion — freedom, rhythm, and effortless execution.',
    shadow: 'Over-Control / Tension',
    shadowDescription: 'You try too hard. You grip the bat tighter. You overthink mechanics. The harder you try, the worse it gets.',
    looksLike: [
      'Trying to guide the ball instead of trusting the swing',
      'Mechanical thoughts mid-pitch ("keep your elbow up")',
      'Feeling like you\'re fighting yourself instead of competing',
      'Losing rhythm and timing as the game goes on',
    ],
    coreCues: [
      'Flow = challenge + skill + freedom',
      '"Let it happen" — trust your training',
      'Loose body, quiet mind, clear eyes',
      'Flow isn\'t trying harder — it\'s releasing control',
    ],
    tools: [
      'Pre-game freedom rep: take 5 swings with zero mechanical thought',
      'Music anchor: find a song that puts you in your flow state',
      'Breath + smile: slow exhale + genuine smile loosens the body',
      'See the ball, hit the ball: simplify your only job to its core',
    ],
    journalPrompts: [
      'When was the last time I felt "in the zone"? What was different about that day?',
      'What am I trying to control that I should let go of?',
      'What does my best version look and feel like when I\'m playing free?',
    ],
    routine: [
      'Pre-game: 5 freedom swings — no thought, just feel',
      'In-game: if tension builds, exhale and smile before the next pitch',
      'Post-game: note 1 moment you played free today',
    ],
  },
};

export const ADVANCED_SKILL_LIST = Object.values(ADVANCED_SKILL_TRACKS);
