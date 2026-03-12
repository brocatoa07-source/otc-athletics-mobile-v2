import { Ionicons } from '@expo/vector-icons';

/* ────────────────────────────────────────────────────────────
   TYPES
   ──────────────────────────────────────────────────────────── */

export type RecruitingTabKey =
  | 'timeline'
  | 'what-coaches-look-for'
  | 'get-noticed'
  | 'levels-breakdown'
  | 'templates';

export interface RecruitingTab {
  key: RecruitingTabKey;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export interface TimelineItem {
  text: string;
  detail?: string;
}

export interface TimelineGrade {
  key: string;
  grade: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  summary: string;
  items: TimelineItem[];
}

export interface CoachLookForItem {
  key: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  description: string;
  details: string[];
}

export interface GetNoticedSection {
  key: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  intro: string;
  steps: string[];
}

export interface LevelDetail {
  label: string;
  value: string;
}

export interface LevelBreakdown {
  key: string;
  level: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  tagline: string;
  details: LevelDetail[];
  realTalk: string;
}

export interface EmailTemplate {
  key: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  situation: string;
  subject: string;
  body: string;
}

/* ────────────────────────────────────────────────────────────
   TABS
   ──────────────────────────────────────────────────────────── */

export const RECRUITING_TABS: RecruitingTab[] = [
  { key: 'timeline', label: 'Timeline', icon: 'calendar-outline' },
  { key: 'what-coaches-look-for', label: 'Coaches', icon: 'eye-outline' },
  { key: 'get-noticed', label: 'Get Noticed', icon: 'megaphone-outline' },
  { key: 'levels-breakdown', label: 'Levels', icon: 'school-outline' },
  { key: 'templates', label: 'Templates', icon: 'mail-outline' },
];

/* ────────────────────────────────────────────────────────────
   1. RECRUITING TIMELINE
   ──────────────────────────────────────────────────────────── */

export const RECRUITING_TIMELINE: TimelineGrade[] = [
  {
    key: 'freshman',
    grade: 'Freshman (9th Grade)',
    icon: 'flag-outline',
    color: '#3b82f6',
    summary: 'Foundation year. Focus on development, not exposure.',
    items: [
      { text: 'Focus on getting stronger, faster, and more athletic', detail: 'Freshman year is about physical development. Lift weights, run, build your body.' },
      { text: 'Play as many games as possible — varsity, JV, travel', detail: 'Reps matter more than exposure at this age.' },
      { text: 'Start building your academic transcript', detail: 'GPA matters. Many programs have minimum GPA thresholds (2.3 NCAA D1, 2.0 D2/NAIA).' },
      { text: 'Learn your position(s) and develop versatility' },
      { text: 'Begin developing a relationship with your high school coach' },
      { text: 'Attend local camps at colleges you are interested in' },
      { text: 'Create an email account dedicated to recruiting' },
      { text: 'Start filming game and practice clips (phone is fine)' },
    ],
  },
  {
    key: 'sophomore',
    grade: 'Sophomore (10th Grade)',
    icon: 'trending-up-outline',
    color: '#8b5cf6',
    summary: 'Ramp up. Exposure starts, but development still leads.',
    items: [
      { text: 'Take the PSAT / practice SAT or ACT', detail: 'NCAA Eligibility Center requires standardized test scores for D1 and D2.' },
      { text: 'Register with the NCAA Eligibility Center (ncaa.org)', detail: 'Free to create an account. Start early so there are no surprises.' },
      { text: 'Build a simple recruiting video (60-90 seconds)', detail: 'Game film showing hitting, fielding, throwing, and running. Quality over flash.' },
      { text: 'Create a list of 20-30 target schools' },
      { text: 'Attend 1-2 college camps or showcases', detail: 'Prioritize camps AT schools you want to attend. Coaches watch closely.' },
      { text: 'Send your first introductory emails to college coaches' },
      { text: 'Keep grades strong — aim for 3.0+ GPA' },
      { text: 'Track measurables: 60-yard dash, exit velo, throw velo, pop time (catchers)' },
      { text: 'Continue strength and conditioning program' },
    ],
  },
  {
    key: 'junior',
    grade: 'Junior (11th Grade)',
    icon: 'rocket-outline',
    color: '#e11d48',
    summary: 'This is THE year. Most commitments happen junior year.',
    items: [
      { text: 'Take the SAT or ACT (aim for qualifying scores)', detail: 'NCAA D1: No minimum score but must submit. D2: No test score required since 2023 but may change.' },
      { text: 'Update your recruiting video with new footage' },
      { text: 'NCAA D1 contact period begins June 15 after sophomore year', detail: 'D1 coaches can now call, text, and email you directly. Be ready.' },
      { text: 'Attend 2-4 elite showcases or prospect camps', detail: 'Perfect Game, PBR events, or college-specific camps. Be selective and prepared.' },
      { text: 'Email coaches regularly — monthly updates with stats and video' },
      { text: 'Schedule unofficial visits to top schools', detail: 'Free to visit any school. Go see the campus, facilities, and meet the coaching staff.' },
      { text: 'Narrow your list to 8-12 serious schools' },
      { text: 'Have your high school and travel coaches make calls on your behalf' },
      { text: 'Request information from college programs (online forms)' },
      { text: 'Understand scholarship offers vs. financial aid packages', detail: 'Baseball is an equivalency sport. Full rides are extremely rare in D1 (11.7 scholarships for ~35 players).' },
    ],
  },
  {
    key: 'senior',
    grade: 'Senior (12th Grade)',
    icon: 'trophy-outline',
    color: '#22c55e',
    summary: 'Closing time. Finalize your decision and sign.',
    items: [
      { text: 'Early signing period: Mid-November (D1/D2)', detail: 'National Letter of Intent (NLI) signing period. D3/NAIA have different timelines.' },
      { text: 'Late signing period: Mid-April' },
      { text: 'Complete NCAA/NAIA eligibility requirements', detail: 'Make sure all core courses and test scores are submitted.' },
      { text: 'Take official visits (D1 allows 5 paid official visits)' },
      { text: 'Compare financial aid and scholarship packages carefully' },
      { text: 'Consider JUCO if D1/D2/NAIA offers are not available', detail: 'JUCO is a proven pathway. Many MLB players started at junior colleges.' },
      { text: 'Maintain your grades — colleges can pull offers for academic decline' },
      { text: 'Sign your NLI or institutional letter of commitment' },
      { text: 'Send thank-you notes to coaches who recruited you' },
    ],
  },
];

/* ────────────────────────────────────────────────────────────
   2. WHAT COACHES LOOK FOR
   ──────────────────────────────────────────────────────────── */

export const WHAT_COACHES_LOOK_FOR: CoachLookForItem[] = [
  {
    key: 'academics',
    title: 'Academics & Eligibility',
    icon: 'school-outline',
    color: '#3b82f6',
    description: 'Coaches check your grades before they check your bat speed.',
    details: [
      'NCAA D1 requires 16 core courses with a minimum 2.3 GPA on the sliding scale.',
      'NCAA D2 requires 16 core courses with a minimum 2.2 GPA.',
      'NAIA requires a 2.0 GPA, 18 ACT, or top 50% class rank (meet 2 of 3).',
      'A player who cannot stay eligible is a roster spot wasted — coaches know this.',
      'Strong academics open scholarship dollars beyond athletics.',
    ],
  },
  {
    key: 'body-language',
    title: 'Body Language & Presence',
    icon: 'body-outline',
    color: '#e11d48',
    description: 'How you carry yourself tells a coach everything before you take a swing.',
    details: [
      'Walk with purpose between reps — no dragging feet.',
      'How do you react after a strikeout? An error? Coaches are watching.',
      'Eye contact with coaches during instruction.',
      'Sprint on and off the field — even in warmups.',
      'Posture in the dugout matters. Engaged or checked out?',
    ],
  },
  {
    key: 'coachability',
    title: 'Coachability',
    icon: 'chatbubbles-outline',
    color: '#8b5cf6',
    description: 'Can you take coaching and adjust in real time? This is the #1 trait coaches evaluate at camps.',
    details: [
      'When a coach gives you a correction at a camp, implement it immediately — even if you disagree.',
      'Ask questions — it shows engagement and maturity.',
      'Do not argue with umpires or show frustration toward teammates.',
      'Coaches talk to your high school and travel coaches about how you handle feedback.',
      'Being coachable is a sign of a player who will develop at the next level.',
    ],
  },
  {
    key: 'work-ethic',
    title: 'Work Ethic & Compete Level',
    icon: 'flame-outline',
    color: '#f59e0b',
    description: 'Talent gets you seen. Work ethic gets you recruited.',
    details: [
      'Effort on every rep — first ground ball of practice to the last.',
      'Are you the first one out and the last one in?',
      'Do you pick up bases, shag BP, and help without being asked?',
      'Compete level on 0-2 counts, with two outs, and when the game is not close.',
      'Coaches want players who will push the team culture forward.',
    ],
  },
  {
    key: 'tools',
    title: 'Physical Tools & Measurables',
    icon: 'speedometer-outline',
    color: '#22c55e',
    description: 'Numbers get attention. Coaches use them to project your ceiling.',
    details: [
      '60-yard dash: D1 targets generally under 7.0 (6.7-6.8 elite).',
      'Exit velocity: 85+ mph gets attention. 90+ opens D1 doors.',
      'Throwing velocity: Outfielders 85+, IF 82+, catchers pop time under 2.0.',
      'Pitching velocity: 85+ for D1 starters, 88+ for high-level programs.',
      'Size and projectability — coaches recruit potential, not just current stats.',
    ],
  },
  {
    key: 'character',
    title: 'Character & Teammate Factor',
    icon: 'people-outline',
    color: '#06b6d4',
    description: 'Your reputation follows you. Coaches call your coaches.',
    details: [
      'How you treat teammates, umpires, and opponents is being evaluated.',
      'Social media is checked. Remove anything that does not represent you well.',
      'Coaches will contact your high school coach, travel coach, and sometimes teachers.',
      'Are you a multiplier for team culture, or a subtractor?',
      'Character concerns can remove a player from a recruiting board overnight.',
    ],
  },
];

/* ────────────────────────────────────────────────────────────
   3. HOW TO GET NOTICED
   ──────────────────────────────────────────────────────────── */

export const GET_NOTICED_SECTIONS: GetNoticedSection[] = [
  {
    key: 'video',
    title: 'Building Your Recruiting Video',
    icon: 'videocam-outline',
    color: '#e11d48',
    intro: 'Your video is your resume. It should be 60-90 seconds, clean, and highlight your best tools.',
    steps: [
      'Start with a title card: Name, Grad Year, Position(s), High School, Height/Weight, Contact Info.',
      'BP footage first — side view and rear view. Show your best swings with intent. This is the first thing coaches want to see.',
      'Fielding at your position next — show range, arm strength, hands, footwork, and transfers.',
      'Running — include a timed 60-yard dash clip.',
      'Game footage LAST — only include high-quality, close-up game film. No far-away press box angles. Show quality swings and range at your position.',
      'Pitching (if applicable): 6-8 pitches from bullpen or game film. Show fastball command and one breaking ball.',
      'Include a metrics slide: Running (60-yard dash, 10-yard split), Throwing (pulldown velo, position velo, catcher pop time if applicable), Hitting (bat speed, hand speed, exit velo), and any other standout numbers.',
      'Film at eye level or slightly above — never from the stands at a bad angle.',
      'Upload to YouTube (unlisted) and include the link in every email to coaches.',
      'Update your video every 3-4 months with new footage.',
      'Do NOT add slow-motion effects, highlight music, or logos. Keep it clean and professional.',
    ],
  },
  {
    key: 'emails',
    title: 'Emailing College Coaches',
    icon: 'mail-outline',
    color: '#3b82f6',
    intro: 'Most college coaches are flooded with emails. Stand out by being concise, genuine, and consistent.',
    steps: [
      "Find the recruiting coordinator's email — usually on the school athletics website.",
      'Subject line should include: your name, grad year, and position (e.g., "John Smith | 2026 SS/RHP | Lincoln HS").',
      'Keep emails under 200 words. Coaches scan, they do not read novels.',
      'Include your stats, measurables, video link, schedule, and academic info.',
      'Personalize EVERY email. Mention something specific about the program.',
      'Follow up every 3-4 weeks with updated stats or game results.',
      'If a coach responds, reply within 24 hours. Speed shows interest.',
      'CC your high school coach or travel coach so they can vouch for you.',
      'Do not mass-email coaches with a generic message — they can tell.',
      'Be polite, professional, and direct. You are making a first impression.',
    ],
  },
  {
    key: 'camps',
    title: 'Camp & Showcase Strategy',
    icon: 'trophy-outline',
    color: '#22c55e',
    intro: 'Not all camps are created equal. Be strategic about where you spend time and money.',
    steps: [
      'Prioritize camps AT colleges you want to attend. These are the best exposure.',
      'Email the coach BEFORE the camp to introduce yourself and say you are attending.',
      'Email the coach AFTER the camp to thank them and reiterate your interest.',
      'National showcases (Perfect Game, PBR, etc.) are valuable but expensive. Be selective.',
      'Go to showcases where you can compete — not just where the biggest names are.',
      'At camps: sprint everywhere, be first in line, make eye contact, and be vocal.',
      'Your attitude and effort at a camp matter as much as your performance.',
      'Bring a parent or guardian who will be positive and stay out of the way.',
      'Ask coaches questions after the camp — shows genuine interest and maturity.',
      'Track which coaches watched you and follow up with personalized emails.',
    ],
  },
];

/* ────────────────────────────────────────────────────────────
   4. NCAA / NAIA / JUCO BREAKDOWN
   ──────────────────────────────────────────────────────────── */

export const LEVEL_BREAKDOWNS: LevelBreakdown[] = [
  {
    key: 'ncaa-d1',
    level: 'NCAA Division I',
    icon: 'diamond-outline',
    color: '#e11d48',
    tagline: 'The highest level of college baseball. Extremely competitive recruiting.',
    details: [
      { label: 'Scholarships', value: '11.7 per team (equivalency — split among ~35 players)' },
      { label: 'Roster Size', value: '~35 players' },
      { label: 'Academic Req.', value: '16 core courses, 2.3 GPA minimum (sliding scale with SAT/ACT)' },
      { label: 'Contact Rules', value: 'Coaches can contact after June 15 of sophomore year' },
      { label: 'Signing Periods', value: 'Early: Mid-November | Late: Mid-April' },
      { label: 'Typical Scholarship', value: '25-40% of tuition is common. Full rides are rare (~2-3 per team max).' },
    ],
    realTalk: 'Only about 2% of high school players play D1 baseball. The average D1 scholarship covers about 33% of tuition. If a D1 school is interested, it is real — but understand the financial reality. Academic money plus athletic money is how most families make it work.',
  },
  {
    key: 'ncaa-d2',
    level: 'NCAA Division II',
    icon: 'football-outline',
    color: '#8b5cf6',
    tagline: 'Strong competition with more scholarship flexibility than D1.',
    details: [
      { label: 'Scholarships', value: '9.0 per team (equivalency — split among ~30+ players)' },
      { label: 'Roster Size', value: '~30-38 players' },
      { label: 'Academic Req.', value: '16 core courses, 2.2 GPA minimum' },
      { label: 'Contact Rules', value: 'June 15 after sophomore year (same as D1)' },
      { label: 'Signing Periods', value: 'Same as D1' },
      { label: 'Typical Scholarship', value: '20-50% of tuition. Some programs offer near-full packages when stacked with academic aid.' },
    ],
    realTalk: 'D2 is an underrated option. Many D2 programs have excellent facilities, competitive schedules, and a better balance of athletics and academics. The scholarship money can go further at D2 because tuition is often lower. Do not overlook D2 — it is not "lesser" baseball.',
  },
  {
    key: 'ncaa-d3',
    level: 'NCAA Division III',
    icon: 'leaf-outline',
    color: '#22c55e',
    tagline: 'No athletic scholarships, but strong academics and competitive baseball.',
    details: [
      { label: 'Scholarships', value: 'None (athletic). Financial aid and merit-based aid only.' },
      { label: 'Roster Size', value: '~30-40 players' },
      { label: 'Academic Req.', value: 'Must be admitted to the institution (no NCAA sliding scale)' },
      { label: 'Contact Rules', value: 'No recruiting calendar restrictions' },
      { label: 'Signing Periods', value: 'No NLI. Institutional financial aid agreements.' },
      { label: 'Typical Aid', value: 'Academic scholarships and need-based aid can cover significant costs.' },
    ],
    realTalk: 'D3 has some of the best baseball in the country. Programs like Johns Hopkins, Emory, UW-Whitewater, and many others are elite. If you want a great education with competitive baseball, D3 is a legitimate path. Many D3 players sign pro contracts.',
  },
  {
    key: 'naia',
    level: 'NAIA',
    icon: 'school-outline',
    color: '#f59e0b',
    tagline: 'Flexible rules, strong scholarships, and a faster recruiting process.',
    details: [
      { label: 'Scholarships', value: '12.0 per team (can be split or stacked)' },
      { label: 'Roster Size', value: '~28-35 players' },
      { label: 'Academic Req.', value: 'Meet 2 of 3: 2.0 GPA, 18 ACT (860 SAT), top 50% class rank' },
      { label: 'Contact Rules', value: 'No recruiting calendar restrictions — coaches can contact anytime' },
      { label: 'Signing Periods', value: 'Rolling. Players can sign anytime after receiving an offer.' },
      { label: 'Typical Scholarship', value: '30-80% of tuition. More flexibility than NCAA to stack money.' },
    ],
    realTalk: 'NAIA is one of the best-kept secrets in college baseball recruiting. Coaches can contact you at any age, there is no dead period, and scholarship rules are more generous. Many NAIA programs are well-funded with great facilities. If you are a borderline D1/D2 talent, NAIA might offer a better financial and playing opportunity.',
  },
  {
    key: 'juco',
    level: 'JUCO (Junior College)',
    icon: 'git-branch-outline',
    color: '#06b6d4',
    tagline: 'The development pathway. Two years to prove yourself and transfer.',
    details: [
      { label: 'Scholarships', value: '24.0 per team (very generous compared to 4-year schools)' },
      { label: 'Roster Size', value: '~30-40 players' },
      { label: 'Academic Req.', value: 'High school diploma or GED (varies by state)' },
      { label: 'Eligibility', value: '2 years of competition. Must transfer to a 4-year to continue.' },
      { label: 'Signing Periods', value: 'Rolling — no NLI required.' },
      { label: 'Typical Scholarship', value: 'Full tuition and sometimes room/board. JUCO is often very affordable.' },
    ],
    realTalk: 'JUCO is not a fallback plan — it is a launchpad. Bryce Harper, Albert Pujols, Kirby Yates, and hundreds of MLB players went JUCO. If you need to develop physically, improve your academics, or get more exposure, JUCO gives you a second chance with serious competition. Many D1 programs actively recruit from JUCO rosters.',
  },
];

/* ────────────────────────────────────────────────────────────
   5. COMMUNICATION TEMPLATES
   ──────────────────────────────────────────────────────────── */

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    key: 'initial-contact',
    title: 'Initial Introduction',
    icon: 'hand-right-outline',
    situation: 'First time reaching out to a college coach you have not spoken with.',
    subject: '[Your Name] | [Grad Year] [Position] | [High School Name]',
    body: `Coach [Last Name],

My name is [Your Name], and I am a [Year, e.g., 2026] [Position] at [High School] in [City, State]. I am very interested in [College Name] and the baseball program you are building.

This [season/summer], I [brief highlight — e.g., "hit .380 with a .950 OPS" or "threw 87-89 mph with a 1.8 pop time"]. My current measurables are:
- 60-yard dash: [time]
- Exit velocity: [speed]
- Throwing velocity / Pop time: [speed/time]
- GPA: [GPA] | SAT/ACT: [score]

I have attached my schedule below and my recruiting video here: [YouTube Link]

I would love the opportunity to visit campus and learn more about your program. Thank you for your time, Coach.

Respectfully,
[Your Name]
[Phone Number]
[Email]
[High School Coach Name & Phone]`,
  },
  {
    key: 'follow-up',
    title: 'Follow-Up Email',
    icon: 'refresh-outline',
    situation: 'Following up 3-4 weeks after your initial email with no response.',
    subject: 'Following Up — [Your Name] | [Grad Year] [Position]',
    body: `Coach [Last Name],

I wanted to follow up on my previous email. I remain very interested in [College Name] and would welcome any opportunity to get on your radar.

Since my last email, [brief update — e.g., "our team is 15-3 and I am hitting .410 through 18 games" or "I attended the PBR showcase and ran a 6.8 sixty"]. I have updated my video with new game footage: [YouTube Link]

My schedule for upcoming events:
- [Event Name, Date, Location]
- [Event Name, Date, Location]

I would love to know if there are any upcoming camps or opportunities to visit. Thank you again for your time.

Respectfully,
[Your Name]
[Phone Number]
[Email]`,
  },
  {
    key: 'after-camp',
    title: 'After a Camp or Showcase',
    icon: 'trophy-outline',
    situation: 'Sending within 24-48 hours after attending a camp or showcase where the coach was present.',
    subject: 'Thank You — [Your Name] | [Camp/Showcase Name]',
    body: `Coach [Last Name],

Thank you for the opportunity to compete at [Camp/Showcase Name] this past [day/weekend]. I really enjoyed the experience and learned a lot from your coaching staff.

[One specific takeaway — e.g., "The hitting drill you walked us through on inside pitch approach was something I have already started working on" or "Competing in the live AB sessions was a great challenge."]

I remain very interested in [College Name] and would love to continue the conversation about being part of your program. Is there a good time to connect by phone?

Thank you again, Coach.

Respectfully,
[Your Name]
[Phone Number]
[Email]
[Updated Video Link]`,
  },
  {
    key: 'after-visit',
    title: 'After a Campus Visit',
    icon: 'location-outline',
    situation: 'Sending within 24 hours after an unofficial or official visit to a college.',
    subject: 'Thank You for the Visit — [Your Name]',
    body: `Coach [Last Name],

Thank you so much for taking the time to host me and my family at [College Name] on [date]. It was a great experience seeing the facilities, meeting the team, and learning more about the program.

[Something specific you liked — e.g., "The culture you have built with the team really stood out to me" or "The academic support system for student-athletes is exactly what I am looking for."]

[College Name] is [high on my list / my top choice], and I am excited about the possibility of being part of what you are building. Please let me know if there is anything else you need from me.

Thank you again, Coach.

Respectfully,
[Your Name]
[Phone Number]
[Email]`,
  },
  {
    key: 'commitment',
    title: 'Verbal Commitment',
    icon: 'checkmark-circle-outline',
    situation: 'When you are ready to verbally commit to a program (after discussing with your family).',
    subject: '[Your Name] — Commitment to [College Name] Baseball',
    body: `Coach [Last Name],

After careful consideration and discussion with my family, I am excited to verbally commit to [College Name] and the baseball program. This has been my [top choice / dream school], and I am honored to be a part of the team.

I want to thank you and your staff for believing in me and giving me this opportunity. I am committed to working hard, representing the program the right way, and contributing to the team from day one.

I look forward to everything ahead. Please let me know next steps regarding paperwork and enrollment.

Thank you, Coach.

Respectfully,
[Your Name]
[Phone Number]
[Email]`,
  },
];
