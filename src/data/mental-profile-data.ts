/* ────────────────────────────────────────────────
 * OTC MENTAL PROFILE QUIZ DATA
 *
 * 8 questions · 4 options each
 * Each option letter maps directly to a mental profile slug.
 * Scoring: tally slugs, highest count wins.
 * ──────────────────────────────────────────────── */

export type MentalProfile = 'competitor' | 'analyzer' | 'emotionally_reactive' | 'steady_performer';

export interface MentalProfileData {
  slug: MentalProfile;
  name: string;
  tagline: string;
  description: string;
  primaryCue: string;
  strengths: string[];
  watchFor: string;
  color: string;
}

export interface MentalProfileOption {
  letter: 'a' | 'b' | 'c' | 'd';
  text: string;
  mentalProfile: MentalProfile;
}

export interface MentalProfileQuestion {
  q: string;
  options: [MentalProfileOption, MentalProfileOption, MentalProfileOption, MentalProfileOption];
}

export const MENTAL_PROFILES: Record<MentalProfile, MentalProfileData> = {
  competitor: {
    slug: 'competitor',
    name: 'The Competitor',
    tagline: 'Thrives under pressure',
    description:
      'You come alive when the game is on the line. Pressure fuels you — you want the big at-bat, the big moment. Your intensity is your weapon, but it can also work against you when emotions run too hot.',
    primaryCue: 'Channel the fire — don\'t let it burn you.',
    strengths: ['Clutch moments', 'High intensity', 'Fearless approach'],
    watchFor: 'Letting frustration spiral after mistakes.',
    color: '#ef4444',
  },
  analyzer: {
    slug: 'analyzer',
    name: 'The Analyzer',
    tagline: 'Thinks the game deeply',
    description:
      'You study the game, plan your at-bats, and prepare meticulously. Your mind is your greatest tool — but it can also trap you. When you think too much, your body can\'t do what it knows how to do.',
    primaryCue: 'Trust your preparation — let your body play.',
    strengths: ['Preparation', 'Game awareness', 'Pitch recognition'],
    watchFor: 'Overthinking at the plate instead of competing.',
    color: '#3b82f6',
  },
  emotionally_reactive: {
    slug: 'emotionally_reactive',
    name: 'The Reactor',
    tagline: 'Feels everything intensely',
    description:
      'You play with passion and emotion. You feel every moment — the highs are high and the lows are low. Your energy is contagious, but your emotions can take over if you don\'t manage them.',
    primaryCue: 'Feel it, then let it go. Next pitch.',
    strengths: ['Passion', 'Energy', 'Emotional connection to the game'],
    watchFor: 'Carrying one bad at-bat into the next one.',
    color: '#f97316',
  },
  steady_performer: {
    slug: 'steady_performer',
    name: 'The Steady Performer',
    tagline: 'Consistent and controlled',
    description:
      'You\'re the same player every day. Calm, consistent, reliable. You don\'t ride the emotional roller coaster — you trust the process and let the results follow. Your challenge is finding another gear when you need it.',
    primaryCue: 'Stay steady — but compete with edge.',
    strengths: ['Consistency', 'Composure', 'Routine discipline'],
    watchFor: 'Playing too passive when the moment demands intensity.',
    color: '#22c55e',
  },
};

export const MENTAL_PROFILE_QUESTIONS: MentalProfileQuestion[] = [
  {
    q: 'Before a big at-bat, you usually feel:',
    options: [
      { letter: 'a', text: 'Fired up — I want this moment', mentalProfile: 'competitor' },
      { letter: 'b', text: 'Thinking through my plan', mentalProfile: 'analyzer' },
      { letter: 'c', text: 'Nervous or emotional', mentalProfile: 'emotionally_reactive' },
      { letter: 'd', text: 'Calm and ready', mentalProfile: 'steady_performer' },
    ],
  },
  {
    q: 'After a bad at-bat, you typically:',
    options: [
      { letter: 'a', text: 'Get fired up to make up for it', mentalProfile: 'competitor' },
      { letter: 'b', text: 'Replay what went wrong in your head', mentalProfile: 'analyzer' },
      { letter: 'c', text: 'Get frustrated or emotional', mentalProfile: 'emotionally_reactive' },
      { letter: 'd', text: 'Move on and stay even', mentalProfile: 'steady_performer' },
    ],
  },
  {
    q: 'When the game is on the line, you:',
    options: [
      { letter: 'a', text: 'Want to be the one up', mentalProfile: 'competitor' },
      { letter: 'b', text: 'Think about the situation and plan', mentalProfile: 'analyzer' },
      { letter: 'c', text: 'Feel a rush of emotion', mentalProfile: 'emotionally_reactive' },
      { letter: 'd', text: 'Stay steady and trust your work', mentalProfile: 'steady_performer' },
    ],
  },
  {
    q: 'Your preparation style is:',
    options: [
      { letter: 'a', text: 'Compete in everything — even warmups', mentalProfile: 'competitor' },
      { letter: 'b', text: 'Study and plan every detail', mentalProfile: 'analyzer' },
      { letter: 'c', text: 'Go with how I feel that day', mentalProfile: 'emotionally_reactive' },
      { letter: 'd', text: 'Same routine every time', mentalProfile: 'steady_performer' },
    ],
  },
  {
    q: 'When a teammate makes an error behind you:',
    options: [
      { letter: 'a', text: 'I get competitive — I\'ll carry us', mentalProfile: 'competitor' },
      { letter: 'b', text: 'I think about what adjustments to make', mentalProfile: 'analyzer' },
      { letter: 'c', text: 'I get frustrated inside', mentalProfile: 'emotionally_reactive' },
      { letter: 'd', text: 'I stay focused on the next play', mentalProfile: 'steady_performer' },
    ],
  },
  {
    q: 'Your biggest mental strength is:',
    options: [
      { letter: 'a', text: 'Intensity and desire to win', mentalProfile: 'competitor' },
      { letter: 'b', text: 'Preparation and awareness', mentalProfile: 'analyzer' },
      { letter: 'c', text: 'Passion and emotional energy', mentalProfile: 'emotionally_reactive' },
      { letter: 'd', text: 'Consistency and composure', mentalProfile: 'steady_performer' },
    ],
  },
  {
    q: 'In practice, you perform best when:',
    options: [
      { letter: 'a', text: 'There\'s competition or stakes', mentalProfile: 'competitor' },
      { letter: 'b', text: 'I have a clear plan to work on', mentalProfile: 'analyzer' },
      { letter: 'c', text: 'I\'m feeling good and energized', mentalProfile: 'emotionally_reactive' },
      { letter: 'd', text: 'I follow my routine consistently', mentalProfile: 'steady_performer' },
    ],
  },
  {
    q: 'Your mental game style is closest to:',
    options: [
      { letter: 'a', text: 'Intense and competitive', mentalProfile: 'competitor' },
      { letter: 'b', text: 'Cerebral and calculated', mentalProfile: 'analyzer' },
      { letter: 'c', text: 'Emotional and passionate', mentalProfile: 'emotionally_reactive' },
      { letter: 'd', text: 'Calm and disciplined', mentalProfile: 'steady_performer' },
    ],
  },
];

export function scoreMentalProfileQuiz(answers: ('a' | 'b' | 'c' | 'd')[]): MentalProfile {
  const tally: Record<MentalProfile, number> = {
    competitor: 0, analyzer: 0, emotionally_reactive: 0, steady_performer: 0,
  };
  answers.forEach((letter, idx) => {
    const question = MENTAL_PROFILE_QUESTIONS[idx];
    const option = question.options.find((o) => o.letter === letter);
    if (option) tally[option.mentalProfile]++;
  });
  return (Object.entries(tally) as [MentalProfile, number][])
    .sort((a, b) => b[1] - a[1])[0][0];
}
