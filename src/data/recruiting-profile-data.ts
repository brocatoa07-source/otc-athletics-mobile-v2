import { Ionicons } from '@expo/vector-icons';

/* ════════════════════════════════════════════════════════
   TYPES
   ════════════════════════════════════════════════════════ */

export interface RecruitingProfile {
  gradYear: string;
  positions: string[];
  height: string;
  weight: string;
  gpa: string;
  testScore: string;
  exitVelo: string;
  batSpeed: string;
  sixtyYard: string;
  throwVelo: string;
  popTime: string;
  videoLink: string;
  targetLevel: string;
  completedAt: string;
}

export type ProfileStepType = 'select' | 'multi-select' | 'text-inputs';

export interface ProfileStepOption {
  value: string;
  label: string;
  desc: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export interface ProfileField {
  key: string;
  label: string;
  placeholder: string;
  optional?: boolean;
  keyboardType?: 'default' | 'numeric' | 'url';
}

export interface ProfileStep {
  key: string;
  title: string;
  subtitle: string;
  type: ProfileStepType;
  options?: ProfileStepOption[];
  fields?: ProfileField[];
}

export interface CollegeFitResult {
  levels: {
    level: string;
    fit: 'strong' | 'good' | 'possible';
    reason: string;
  }[];
  completedAt: string;
}

export interface DivisionScholarshipInfo {
  key: string;
  level: string;
  totalScholarships: number;
  averageRosterSize: number;
  typicalScholarshipRange: [number, number]; // percentage
  hsPlayerPercentage: number;
  averageTuition: number;
  notes: string;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
}

/* ════════════════════════════════════════════════════════
   PROFILE BUILDER STEPS (8 steps)
   ════════════════════════════════════════════════════════ */

export const PROFILE_STEPS: ProfileStep[] = [
  {
    key: 'gradYear',
    title: 'What is your graduation year?',
    subtitle: 'This helps coaches know when you are available.',
    type: 'select',
    options: [
      { value: '2025', label: '2025', desc: 'Senior — recruiting now', icon: 'trophy-outline' },
      { value: '2026', label: '2026', desc: 'Junior — prime recruiting year', icon: 'rocket-outline' },
      { value: '2027', label: '2027', desc: 'Sophomore — building exposure', icon: 'trending-up-outline' },
      { value: '2028', label: '2028', desc: 'Freshman — foundation year', icon: 'flag-outline' },
    ],
  },
  {
    key: 'positions',
    title: 'What position(s) do you play?',
    subtitle: 'Select all that apply. Versatility is valuable.',
    type: 'multi-select',
    options: [
      { value: 'OF', label: 'Outfielder', desc: 'LF, CF, RF', icon: 'sunny-outline' },
      { value: 'IF', label: 'Infielder', desc: 'SS, 2B, 3B, 1B', icon: 'flash-outline' },
      { value: 'C', label: 'Catcher', desc: 'Behind the plate', icon: 'shield-outline' },
      { value: 'P', label: 'Pitcher', desc: 'On the mound', icon: 'flame-outline' },
    ],
  },
  {
    key: 'heightWeight',
    title: 'Height & Weight',
    subtitle: 'Coaches want to see your physical profile.',
    type: 'text-inputs',
    fields: [
      { key: 'height', label: 'Height', placeholder: "e.g. 5'11\"" },
      { key: 'weight', label: 'Weight (lbs)', placeholder: 'e.g. 185', keyboardType: 'numeric' },
    ],
  },
  {
    key: 'academics',
    title: 'Academics',
    subtitle: 'GPA and test scores open doors — and scholarship money.',
    type: 'text-inputs',
    fields: [
      { key: 'gpa', label: 'GPA', placeholder: 'e.g. 3.5', keyboardType: 'numeric' },
      { key: 'testScore', label: 'SAT / ACT Score', placeholder: 'e.g. 1280 SAT or 28 ACT', optional: true },
    ],
  },
  {
    key: 'measurables',
    title: 'Measurables',
    subtitle: 'Enter what you have. Leave blank if unknown.',
    type: 'text-inputs',
    fields: [
      { key: 'exitVelo', label: 'Exit Velocity (mph)', placeholder: 'e.g. 92', optional: true, keyboardType: 'numeric' },
      { key: 'batSpeed', label: 'Bat Speed (mph)', placeholder: 'e.g. 75', optional: true, keyboardType: 'numeric' },
      { key: 'sixtyYard', label: '60-Yard Dash (sec)', placeholder: 'e.g. 6.8', optional: true, keyboardType: 'numeric' },
      { key: 'throwVelo', label: 'Throwing Velocity (mph)', placeholder: 'e.g. 87', optional: true, keyboardType: 'numeric' },
      { key: 'popTime', label: 'Pop Time (sec)', placeholder: 'e.g. 1.95', optional: true, keyboardType: 'numeric' },
    ],
  },
  {
    key: 'video',
    title: 'Recruiting Video',
    subtitle: 'Your video is your resume. Paste a YouTube link.',
    type: 'text-inputs',
    fields: [
      { key: 'videoLink', label: 'YouTube Video Link', placeholder: 'https://youtube.com/...', optional: true, keyboardType: 'url' },
    ],
  },
  {
    key: 'targetLevel',
    title: 'What level are you targeting?',
    subtitle: 'Be honest with yourself. Every level is a great opportunity.',
    type: 'select',
    options: [
      { value: 'D1', label: 'NCAA D1', desc: 'Highest level. Extremely competitive.', icon: 'diamond-outline' },
      { value: 'D2', label: 'NCAA D2', desc: 'Strong competition, more scholarship flexibility.', icon: 'football-outline' },
      { value: 'D3', label: 'NCAA D3', desc: 'No athletic scholarships, elite academics.', icon: 'leaf-outline' },
      { value: 'NAIA', label: 'NAIA', desc: 'Flexible rules, strong scholarships.', icon: 'school-outline' },
    ],
  },
  {
    key: 'targetLevel2',
    title: 'What level are you targeting?',
    subtitle: 'More options — every path is legitimate.',
    type: 'select',
    options: [
      { value: 'JUCO', label: 'JUCO', desc: 'Development pathway. Prove yourself and transfer.', icon: 'git-branch-outline' },
      { value: 'Not Sure', label: 'Not Sure Yet', desc: "Still figuring it out — that's okay.", icon: 'help-circle-outline' },
    ],
  },
];

/* ════════════════════════════════════════════════════════
   COLLEGE FIT QUIZ (7 questions)
   ════════════════════════════════════════════════════════ */

export interface QuizStep {
  key: string;
  title: string;
  subtitle: string;
  category?: string;
  options: ProfileStepOption[];
}

export const COLLEGE_FIT_STEPS: QuizStep[] = [
  {
    key: 'exitVelo',
    title: 'What is your exit velocity?',
    subtitle: 'Peak exit velo off a tee or in live BP.',
    category: 'STATS',
    options: [
      { value: 'under75', label: 'Under 75 mph', desc: 'Still developing bat speed', icon: 'leaf-outline' },
      { value: '75-84', label: '75–84 mph', desc: 'Solid foundation, room to grow', icon: 'trending-up-outline' },
      { value: '85-89', label: '85–89 mph', desc: 'College-level bat speed', icon: 'flash-outline' },
      { value: '90plus', label: '90+ mph', desc: 'Elite level — opens D1 doors', icon: 'rocket-outline' },
    ],
  },
  {
    key: 'throwVelo',
    title: 'What is your throwing velocity?',
    subtitle: 'Position throw or bullpen fastball.',
    options: [
      { value: 'under75', label: 'Under 75 mph', desc: 'Developing arm strength', icon: 'leaf-outline' },
      { value: '75-82', label: '75–82 mph', desc: 'Solid arm for most levels', icon: 'trending-up-outline' },
      { value: '83-87', label: '83–87 mph', desc: 'Strong arm, college ready', icon: 'flash-outline' },
      { value: '88plus', label: '88+ mph', desc: 'Elite arm strength', icon: 'rocket-outline' },
    ],
  },
  {
    key: 'sixtyTime',
    title: 'What is your 60-yard dash time?',
    subtitle: 'Timed on flat ground, full sprint.',
    options: [
      { value: '7.5plus', label: '7.5+ seconds', desc: 'Below average speed', icon: 'walk-outline' },
      { value: '7.0-7.4', label: '7.0–7.4 seconds', desc: 'Average to solid', icon: 'trending-up-outline' },
      { value: '6.7-6.9', label: '6.7–6.9 seconds', desc: 'Above average — catches attention', icon: 'flash-outline' },
      { value: 'under6.7', label: 'Under 6.7 seconds', desc: 'Elite speed', icon: 'rocket-outline' },
    ],
  },
  {
    key: 'gpa',
    title: 'What is your GPA?',
    subtitle: 'Grades matter. They open doors and scholarship money.',
    category: 'ACADEMICS',
    options: [
      { value: 'under2.5', label: 'Under 2.5', desc: 'Below eligibility for some levels', icon: 'alert-circle-outline' },
      { value: '2.5-2.9', label: '2.5–2.9', desc: 'Meets minimum requirements', icon: 'checkmark-outline' },
      { value: '3.0-3.4', label: '3.0–3.4', desc: 'Solid academics — opens doors', icon: 'trending-up-outline' },
      { value: '3.5plus', label: '3.5+', desc: 'Strong student — academic scholarships likely', icon: 'star-outline' },
    ],
  },
  {
    key: 'financial',
    title: 'How important is scholarship money?',
    subtitle: 'Be honest — this affects which levels make sense.',
    category: 'PREFERENCES',
    options: [
      { value: 'full', label: 'Need Full Scholarship', desc: "Can't play without significant financial aid", icon: 'cash-outline' },
      { value: 'partial', label: 'Partial is OK', desc: 'Some scholarship plus family contribution', icon: 'wallet-outline' },
      { value: 'none', label: "Money Isn't a Factor", desc: 'Will pay full cost if needed', icon: 'diamond-outline' },
    ],
  },
  {
    key: 'academics_priority',
    title: 'How important are academics to you?',
    subtitle: 'Beyond eligibility — how much does the school matter?',
    options: [
      { value: 'eligible', label: 'Just Need to Be Eligible', desc: 'Baseball is the priority', icon: 'baseball-outline' },
      { value: 'matters', label: 'Matters Some', desc: 'Want a decent school but baseball first', icon: 'school-outline' },
      { value: 'very', label: 'Very Important', desc: 'Want strong academics AND baseball', icon: 'book-outline' },
      { value: 'top', label: 'Top Priority', desc: 'Academics come first, baseball is a bonus', icon: 'ribbon-outline' },
    ],
  },
  {
    key: 'playing_time',
    title: 'How important is playing time?',
    subtitle: 'Some players want to start day one. Others are willing to develop.',
    options: [
      { value: 'start', label: 'Need to Start Day 1', desc: "Won't go somewhere I sit the bench", icon: 'flag-outline' },
      { value: 'develop', label: 'Willing to Develop', desc: 'OK competing for a spot over time', icon: 'time-outline' },
      { value: 'compete', label: 'Fine Competing', desc: "I'll earn it regardless of timeline", icon: 'flame-outline' },
    ],
  },
];

/* ── Scoring weights per answer per division ── */
interface ScoreWeights {
  D1: number;
  D2: number;
  D3: number;
  NAIA: number;
  JUCO: number;
}

const SCORE_MAP: Record<string, Record<string, ScoreWeights>> = {
  exitVelo: {
    'under75': { D1: 0, D2: 0, D3: 1, NAIA: 1, JUCO: 2 },
    '75-84':   { D1: 0, D2: 1, D3: 2, NAIA: 2, JUCO: 3 },
    '85-89':   { D1: 2, D2: 3, D3: 2, NAIA: 3, JUCO: 3 },
    '90plus':  { D1: 3, D2: 3, D3: 2, NAIA: 3, JUCO: 3 },
  },
  throwVelo: {
    'under75': { D1: 0, D2: 0, D3: 1, NAIA: 1, JUCO: 2 },
    '75-82':   { D1: 0, D2: 1, D3: 2, NAIA: 2, JUCO: 3 },
    '83-87':   { D1: 2, D2: 3, D3: 2, NAIA: 3, JUCO: 3 },
    '88plus':  { D1: 3, D2: 3, D3: 2, NAIA: 3, JUCO: 3 },
  },
  sixtyTime: {
    '7.5plus':  { D1: 0, D2: 0, D3: 1, NAIA: 1, JUCO: 2 },
    '7.0-7.4':  { D1: 1, D2: 2, D3: 2, NAIA: 2, JUCO: 3 },
    '6.7-6.9':  { D1: 2, D2: 3, D3: 2, NAIA: 3, JUCO: 3 },
    'under6.7': { D1: 3, D2: 3, D3: 2, NAIA: 3, JUCO: 3 },
  },
  gpa: {
    'under2.5': { D1: 0, D2: 0, D3: 0, NAIA: 0, JUCO: 2 },
    '2.5-2.9':  { D1: 1, D2: 1, D3: 1, NAIA: 2, JUCO: 3 },
    '3.0-3.4':  { D1: 2, D2: 2, D3: 3, NAIA: 2, JUCO: 3 },
    '3.5plus':  { D1: 3, D2: 3, D3: 3, NAIA: 3, JUCO: 3 },
  },
  financial: {
    'full':    { D1: 0, D2: 1, D3: 0, NAIA: 2, JUCO: 3 },
    'partial': { D1: 2, D2: 2, D3: 1, NAIA: 3, JUCO: 3 },
    'none':    { D1: 3, D2: 3, D3: 3, NAIA: 3, JUCO: 2 },
  },
  academics_priority: {
    'eligible': { D1: 2, D2: 2, D3: 0, NAIA: 2, JUCO: 3 },
    'matters':  { D1: 2, D2: 2, D3: 1, NAIA: 2, JUCO: 2 },
    'very':     { D1: 2, D2: 2, D3: 3, NAIA: 2, JUCO: 1 },
    'top':      { D1: 1, D2: 1, D3: 3, NAIA: 1, JUCO: 0 },
  },
  playing_time: {
    'start':   { D1: 0, D2: 1, D3: 2, NAIA: 2, JUCO: 3 },
    'develop': { D1: 2, D2: 2, D3: 2, NAIA: 2, JUCO: 2 },
    'compete': { D1: 3, D2: 3, D3: 2, NAIA: 2, JUCO: 2 },
  },
};

const LEVEL_REASONS: Record<string, Record<'strong' | 'good' | 'possible', string>> = {
  D1: {
    strong: 'Your stats and profile align well with NCAA Division I. You have the tools and academics to compete at the highest level.',
    good: 'You have a solid foundation for D1. Continue developing your measurables and maintaining strong academics.',
    possible: 'D1 is a reach, but not impossible. Focus on improving your tools and consider attending elite showcases.',
  },
  D2: {
    strong: 'NCAA D2 is an excellent fit. Strong competition, good scholarship opportunities, and a great college experience.',
    good: 'D2 programs would be interested in your profile. Great balance of competition and opportunity.',
    possible: 'D2 is within reach. Keep developing and make sure to attend college camps at D2 schools you like.',
  },
  D3: {
    strong: 'D3 is a strong fit — especially with your academic profile. Competitive baseball with top-tier education.',
    good: 'D3 offers a great path. No athletic scholarships, but academic aid can make it affordable.',
    possible: 'D3 could work well if academics are important to you. Look into schools that match your interests.',
  },
  NAIA: {
    strong: 'NAIA is an excellent fit. Flexible recruiting, strong scholarship packages, and competitive baseball.',
    good: 'NAIA programs would value your profile. More scholarship flexibility than NCAA, and coaches can contact you anytime.',
    possible: 'NAIA is worth exploring. Many programs are well-funded with great facilities and competitive schedules.',
  },
  JUCO: {
    strong: 'JUCO is a proven development pathway. Full scholarships are common, and you can transfer to a 4-year school after.',
    good: 'JUCO gives you a chance to develop and prove yourself. Many D1 players and MLB players started at JUCO.',
    possible: 'Consider JUCO as a launchpad. Two years to develop physically and academically before transferring up.',
  },
};

export function computeCollegeFit(answers: Record<string, string>): CollegeFitResult {
  const scores: Record<string, number> = { D1: 0, D2: 0, D3: 0, NAIA: 0, JUCO: 0 };
  const maxPerQuestion = 3;
  let questionCount = 0;

  for (const [questionKey, answerValue] of Object.entries(answers)) {
    const questionWeights = SCORE_MAP[questionKey];
    if (!questionWeights) continue;
    const weights = questionWeights[answerValue];
    if (!weights) continue;

    questionCount++;
    scores.D1 += weights.D1;
    scores.D2 += weights.D2;
    scores.D3 += weights.D3;
    scores.NAIA += weights.NAIA;
    scores.JUCO += weights.JUCO;
  }

  const maxScore = questionCount * maxPerQuestion;
  if (maxScore === 0) {
    return { levels: [], completedAt: new Date().toISOString() };
  }

  const levels: CollegeFitResult['levels'] = [];
  const divisionOrder = ['D1', 'D2', 'D3', 'NAIA', 'JUCO'];

  for (const level of divisionOrder) {
    const pct = scores[level] / maxScore;
    let fit: 'strong' | 'good' | 'possible' | null = null;

    if (pct >= 0.7) fit = 'strong';
    else if (pct >= 0.5) fit = 'good';
    else if (pct >= 0.3) fit = 'possible';

    if (fit) {
      levels.push({
        level,
        fit,
        reason: LEVEL_REASONS[level][fit],
      });
    }
  }

  // Sort by fit strength
  const fitOrder = { strong: 0, good: 1, possible: 2 };
  levels.sort((a, b) => fitOrder[a.fit] - fitOrder[b.fit]);

  return { levels, completedAt: new Date().toISOString() };
}

/* ════════════════════════════════════════════════════════
   SCHOLARSHIP DATA
   ════════════════════════════════════════════════════════ */

export const SCHOLARSHIP_DATA: DivisionScholarshipInfo[] = [
  {
    key: 'ncaa-d1',
    level: 'NCAA D1',
    totalScholarships: 11.7,
    averageRosterSize: 35,
    typicalScholarshipRange: [25, 40],
    hsPlayerPercentage: 2.1,
    averageTuition: 45000,
    notes: 'Equivalency sport — 11.7 scholarships split among ~35 players. Full rides are extremely rare (2-3 per team max). Academic money is your best friend.',
    color: '#e11d48',
    icon: 'diamond-outline',
  },
  {
    key: 'ncaa-d2',
    level: 'NCAA D2',
    totalScholarships: 9.0,
    averageRosterSize: 33,
    typicalScholarshipRange: [20, 50],
    hsPlayerPercentage: 3.4,
    averageTuition: 32000,
    notes: 'More flexibility than D1. Tuition is often lower, making partial scholarships go further. Academic aid can be stacked.',
    color: '#8b5cf6',
    icon: 'football-outline',
  },
  {
    key: 'ncaa-d3',
    level: 'NCAA D3',
    totalScholarships: 0,
    averageRosterSize: 35,
    typicalScholarshipRange: [0, 0],
    hsPlayerPercentage: 5.8,
    averageTuition: 50000,
    notes: 'No athletic scholarships. Financial aid and merit-based academic scholarships only. Some schools offer generous need-based packages.',
    color: '#22c55e',
    icon: 'leaf-outline',
  },
  {
    key: 'naia',
    level: 'NAIA',
    totalScholarships: 12.0,
    averageRosterSize: 32,
    typicalScholarshipRange: [30, 80],
    hsPlayerPercentage: 3.2,
    averageTuition: 28000,
    notes: 'Most generous scholarship rules. 12 full equivalencies that can be split or stacked with academic money. Many programs offer near-full rides.',
    color: '#f59e0b',
    icon: 'school-outline',
  },
  {
    key: 'juco',
    level: 'JUCO',
    totalScholarships: 24.0,
    averageRosterSize: 35,
    typicalScholarshipRange: [50, 100],
    hsPlayerPercentage: 4.5,
    averageTuition: 8000,
    notes: '24 scholarships per team — very generous. Tuition is low, making full rides common. Two years of eligibility before transferring.',
    color: '#06b6d4',
    icon: 'git-branch-outline',
  },
];

/* ════════════════════════════════════════════════════════
   SHARE TEXT FORMATTER
   ════════════════════════════════════════════════════════ */

export function formatProfileShareText(profile: RecruitingProfile): string {
  const lines: string[] = [];

  const posStr = profile.positions.join(' / ');
  lines.push(`Class of ${profile.gradYear} | ${posStr}`);

  if (profile.height || profile.weight) {
    const hw = [profile.height, profile.weight ? `${profile.weight} lbs` : ''].filter(Boolean).join(' / ');
    lines.push(hw);
  }

  lines.push(`Target: ${profile.targetLevel}`);
  lines.push('');

  if (profile.gpa || profile.testScore) {
    const acad = [
      profile.gpa ? `GPA: ${profile.gpa}` : '',
      profile.testScore ? `Test Score: ${profile.testScore}` : '',
    ].filter(Boolean).join(' | ');
    lines.push(acad);
    lines.push('');
  }

  const measurables = [
    profile.exitVelo ? `Exit Velo: ${profile.exitVelo} mph` : '',
    profile.batSpeed ? `Bat Speed: ${profile.batSpeed} mph` : '',
    profile.sixtyYard ? `60-Yard: ${profile.sixtyYard}s` : '',
    profile.throwVelo ? `Throw Velo: ${profile.throwVelo} mph` : '',
    profile.popTime ? `Pop Time: ${profile.popTime}s` : '',
  ].filter(Boolean);

  if (measurables.length > 0) {
    lines.push('MEASURABLES');
    lines.push(...measurables);
    lines.push('');
  }

  if (profile.videoLink) {
    lines.push(`Video: ${profile.videoLink}`);
    lines.push('');
  }

  lines.push('Built with OTC Athletics');

  return lines.join('\n');
}
