/* ────────────────────────────────────────────────
 * OTC HITTING IDENTITY DIAGNOSTIC — v2
 *
 * 2-axis model:
 *   Axis 1 — Movement Pattern: springy | grounded
 *   Axis 2 — Bat Path / Action: horizontal | vertical
 *
 * 12 questions (6 per axis), 2 choices each.
 * Result: combined profile like 'springy_vertical'.
 *
 * Philosophy:
 *   Diagnose identity → organize movement → optimize contact
 *   NOT: Diagnose identity → prescribe conformity
 * ──────────────────────────────────────────────── */

/* ─── Core types ─────────────────────────────────── */

export type HittingMovementType = 'springy' | 'grounded';
export type HittingBatPathType = 'horizontal' | 'vertical';
export type HittingIdentityProfile =
  | 'springy_horizontal'
  | 'springy_vertical'
  | 'grounded_horizontal'
  | 'grounded_vertical';

/* ─── Diagnostic result contract ─────────────────── */

export interface HittingIdentityDiagnosticResult {
  diagnosticKey: 'hitting_identity_v2';
  version: 2;
  completedAt: string;
  movementType: HittingMovementType;
  batPathType: HittingBatPathType;
  combinedProfile: HittingIdentityProfile;
  movementScores: { springy: number; grounded: number };
  batPathScores: { horizontal: number; vertical: number };
  movementDescription: string;
  batPathDescription: string;
  movementStrengths: string[];
  movementStruggles: string[];
  movementWorkOns: string[];
  batPathStrengths: string[];
  batPathStruggles: string[];
  batPathWorkOns: string[];
  movementExamples: string[];
  batPathExamples: string[];
  movementCues: string[];
  batPathCues: string[];
  summaryLabel: string;
}

/* ─── Question types ─────────────────────────────── */

export type IdentityQuestionAxis = 'movement' | 'batPath';

export interface IdentityOption {
  letter: 'a' | 'b';
  text: string;
  value: HittingMovementType | HittingBatPathType;
}

export interface IdentityQuestion {
  axis: IdentityQuestionAxis;
  q: string;
  options: [IdentityOption, IdentityOption];
}

/* ─── 12 diagnostic questions ────────────────────── */

export const HITTING_IDENTITY_QUESTIONS: IdentityQuestion[] = [
  // ── Section 1: Movement Pattern (Q1–Q6) ────────
  {
    axis: 'movement',
    q: 'Which stance feels most natural?',
    options: [
      { letter: 'a', text: 'Upright and light on my feet', value: 'springy' },
      { letter: 'b', text: 'Slightly lower and more grounded', value: 'grounded' },
    ],
  },
  {
    axis: 'movement',
    q: 'Where does your balance usually sit?',
    options: [
      { letter: 'a', text: 'Middle to front of the foot', value: 'springy' },
      { letter: 'b', text: 'More toward the heel/back foot', value: 'grounded' },
    ],
  },
  {
    axis: 'movement',
    q: 'What swing feeling usually produces your best hits?',
    options: [
      { letter: 'a', text: 'Quick and elastic', value: 'springy' },
      { letter: 'b', text: 'Strong and powerful', value: 'grounded' },
    ],
  },
  {
    axis: 'movement',
    q: 'What usually helps you hit better?',
    options: [
      { letter: 'a', text: 'Staying loose and rhythmic', value: 'springy' },
      { letter: 'b', text: 'Driving force through the ground', value: 'grounded' },
    ],
  },
  {
    axis: 'movement',
    q: 'Which description fits you better?',
    options: [
      { letter: 'a', text: 'Athletic and reactive', value: 'springy' },
      { letter: 'b', text: 'Stable and powerful', value: 'grounded' },
    ],
  },
  {
    axis: 'movement',
    q: 'When your swing feels right it usually feels:',
    options: [
      { letter: 'a', text: 'Light, quick, and bouncing', value: 'springy' },
      { letter: 'b', text: 'Heavy, controlled, and strong', value: 'grounded' },
    ],
  },

  // ── Section 2: Bat Path / Action Preference (Q7–Q12) ──
  {
    axis: 'batPath',
    q: 'What type of swing path feels best?',
    options: [
      { letter: 'a', text: 'Sweeping across the zone', value: 'horizontal' },
      { letter: 'b', text: 'Direct through the ball', value: 'vertical' },
    ],
  },
  {
    axis: 'batPath',
    q: 'Against good pitching you usually succeed by:',
    options: [
      { letter: 'a', text: 'Seeing the ball longer', value: 'horizontal' },
      { letter: 'b', text: 'Attacking quickly', value: 'vertical' },
    ],
  },
  {
    axis: 'batPath',
    q: 'What produces your best contact?',
    options: [
      { letter: 'a', text: 'Staying through the middle', value: 'horizontal' },
      { letter: 'b', text: 'Driving the ball upward', value: 'vertical' },
    ],
  },
  {
    axis: 'batPath',
    q: 'Your timing usually works best when you:',
    options: [
      { letter: 'a', text: 'Let the pitch travel', value: 'horizontal' },
      { letter: 'b', text: 'Attack early', value: 'vertical' },
    ],
  },
  {
    axis: 'batPath',
    q: 'Which swing description feels right?',
    options: [
      { letter: 'a', text: 'Smooth and sweeping', value: 'horizontal' },
      { letter: 'b', text: 'Explosive and direct', value: 'vertical' },
    ],
  },
  {
    axis: 'batPath',
    q: 'Your best hits usually feel like:',
    options: [
      { letter: 'a', text: 'Line drives across the field', value: 'horizontal' },
      { letter: 'b', text: 'Balls driven in the air', value: 'vertical' },
    ],
  },
];

/* ─── Profile data ───────────────────────────────── */

export interface MovementProfileData {
  type: HittingMovementType;
  label: string;
  description: string;
  strengths: string[];
  struggles: string[];
  workOns: string[];
  cues: string[];
  mlbExamples: string[];
  color: string;
}

export interface BatPathProfileData {
  type: HittingBatPathType;
  label: string;
  description: string;
  strengths: string[];
  struggles: string[];
  workOns: string[];
  cues: string[];
  mlbExamples: string[];
  color: string;
}

export const MOVEMENT_PROFILES: Record<HittingMovementType, MovementProfileData> = {
  springy: {
    type: 'springy',
    label: 'Springy',
    description:
      'Springy hitters look light, quick, and elastic. They create speed through stretch-shortening, rhythm, and whip rather than brute force. They do best staying athletic, loose, and organized rather than overly restricted.',
    strengths: [
      'Elite bat speed potential',
      'Great adjustability and quick reactions',
      'Can create late whip',
      'Dangerous on inner-half pitches',
      'More athletic and dynamic movement',
    ],
    struggles: [
      'More timing-sensitive',
      'Can get too loose or rushed',
      'Can leak early',
      'May struggle with braking if not strong enough',
      'Can over-rotate or chase loft',
    ],
    workOns: [
      'Strength, deceleration, and control',
      'Rhythm and tempo management',
      'Controlled forward movement without leaking',
      'Staying athletic without getting too aggressive',
    ],
    cues: [
      'Stay loose and athletic',
      'Let the move rebound',
      'Whip the barrel, don\'t push it',
      'Create rhythm before launch',
    ],
    mlbExamples: ['Mookie Betts', 'Ronald Acuña Jr.', 'Fernando Tatis Jr.', 'Elly De La Cruz', 'José Ramírez'],
    color: '#a855f7',
  },
  grounded: {
    type: 'grounded',
    label: 'Grounded',
    description:
      'Grounded hitters create power through ground force, stability, leverage, and force application rather than elasticity. They do best feeling powerful, connected to the ground, and able to turn force through the hips and legs.',
    strengths: [
      'Strong base for power',
      'Consistent force production',
      'Better stability through contact',
      'Good leverage and body control',
      'Can produce huge exit velocity',
    ],
    struggles: [
      'Less naturally adjustable',
      'Can get stuck or slow',
      'Harder to create late whip',
      'May struggle if forced to move too much',
      'Can become rigid and lose athleticism',
    ],
    workOns: [
      'Elasticity, looseness, and bat speed',
      'Clean pressure shift into the turn',
      'Staying connected without freezing',
      'Keeping power without becoming rigid',
    ],
    cues: [
      'Own the ground before the swing',
      'Push pressure through the floor',
      'Turn from the hips, not the shoulders',
      'Stay heavy through contact',
    ],
    mlbExamples: ['Aaron Judge', 'Pete Alonso', 'Yordan Alvarez', 'Freddie Freeman', 'Paul Goldschmidt'],
    color: '#3b82f6',
  },
};

export const BAT_PATH_PROFILES: Record<HittingBatPathType, BatPathProfileData> = {
  horizontal: {
    type: 'horizontal',
    label: 'Flat Path',
    description:
      'Flat path hitters keep the barrel in the zone longer with a more level swing plane. They see the ball longer, track lateral movement well, and create strong line-drive contact across the field.',
    strengths: [
      'Better contact consistency',
      'Longer margin for timing error',
      'Better plate coverage',
      'Easier to use the whole field',
      'Usually better two-strike profile',
    ],
    struggles: [
      'Lower natural loft',
      'Lower HR ceiling unless elite bat speed or strength',
      'Can become too flat and produce weak contact',
      'May struggle to create carry if attack angle is too shallow',
    ],
    workOns: [
      'Maintaining barrel direction',
      'Creating flush contact with intent',
      'Finding the right ball flight without over-lifting',
      'Driving the ball with damage when possible',
    ],
    cues: [
      'Stay through the middle of the field',
      'Let the barrel work across the zone',
      'Win the path through contact',
      'Stay behind the ball longer',
    ],
    mlbExamples: ['Luis Arraez', 'Jeff McNeil', 'DJ LeMahieu', 'Ichiro Suzuki', 'Michael Brantley'],
    color: '#22c55e',
  },
  vertical: {
    type: 'vertical',
    label: 'Vertical Path',
    description:
      'Vertical path hitters enter the zone from below more aggressively, creating more loft and lift. They create power, carry, and backspin when timing and pitch selection are right.',
    strengths: [
      'Bigger power ceiling',
      'Easier to create loft and carry',
      'More damage on mistakes',
      'Better natural home run shape',
      'Strong pull-side slug potential',
    ],
    struggles: [
      'More swing-and-miss risk',
      'Smaller timing window',
      'Can get under balls too often',
      'Can struggle with top-of-zone velocity',
      'May become too pull-side dependent',
    ],
    workOns: [
      'Timing and decision making',
      'Contact consistency',
      'Matching pitch plane',
      'Controlling vertical attack rather than overdoing it',
    ],
    cues: [
      'Attack the ball early',
      'Drive through the bottom half',
      'Create lift through contact',
      'Finish high and aggressive',
    ],
    mlbExamples: ['Shohei Ohtani', 'Kyle Schwarber', 'Matt Olson', 'Giancarlo Stanton', 'Austin Riley'],
    color: '#ef4444',
  },
};

/* ─── Combined profile labels ────────────────────── */

export const COMBINED_PROFILE_LABELS: Record<HittingIdentityProfile, string> = {
  springy_horizontal: 'Springy Flat Path Hitter',
  springy_vertical: 'Springy Vertical Path Hitter',
  grounded_horizontal: 'Grounded Flat Path Hitter',
  grounded_vertical: 'Grounded Vertical Path Hitter',
};

/* ─── Combined profile summary descriptions ─────── */

export const COMBINED_PROFILE_SUMMARIES: Record<HittingIdentityProfile, string> = {
  springy_horizontal:
    'Elastic lower half with a flatter, more adjustable barrel path. Elite adjustability and high contact potential with athletic rhythm.',
  springy_vertical:
    'Elastic mover with loft-oriented barrel entry and explosive bat speed. Dangerous mix of whip and lift with huge power ceiling.',
  grounded_horizontal:
    'Stable, force-based mover with a flatter barrel path and long zone time. Very consistent contact with a professional at-bat profile.',
  grounded_vertical:
    'Force-based mover with a steeper, loft-oriented barrel path built for damage. Elite power ceiling with huge exit velocity potential.',
};

/** Rich coaching content for each combined profile */
export interface CombinedProfileContent {
  summary: string;
  whenRight: string[];
  strengths: string[];
  watchOuts: string[];
  developmentFocus: string[];
  mlbComps: string[];
}

export const COMBINED_PROFILE_COACHING: Record<HittingIdentityProfile, CombinedProfileContent> = {
  springy_horizontal: {
    summary:
      'You move best with quick rhythm, bounce, and looseness. Your barrel works with a flatter entry into the zone, creating a bat-to-ball oriented swing with athletic adjustability. You handle velocity well and can use the whole field.',
    whenRight: [
      'The move feels loose and athletic',
      'Timing looks effortless',
      'The barrel stays through the middle of the field',
      'Contact produces strong line drives',
    ],
    strengths: [
      'Elite adjustability',
      'High contact potential',
      'Handles velocity well',
      'Can use the whole field',
      'Strong hit tool profile',
    ],
    watchOuts: [
      'Lower natural power ceiling',
      'Damage relies on bat speed and timing',
      'Can become too contact-oriented',
      'May lack loft unless intentionally trained',
    ],
    developmentFocus: [
      'Adding damage and loft when needed',
      'Strength and deceleration work',
      'Barrel direction through center',
      'Controlling forward move',
    ],
    mlbComps: ['Trea Turner', 'Ichiro Suzuki', 'Luis Arraez'],
  },
  springy_vertical: {
    summary:
      'You move with an explosive lower half and fast hip speed. Your barrel works upward with loft-oriented intent, creating a dangerous mix of whip and lift. When timing is locked in, the combination of rhythm and loft creates serious damage.',
    whenRight: [
      'The move feels explosive and snappy',
      'The barrel enters early and drives through',
      'Contact creates carry and backspin',
      'You attack pitches with full intent',
    ],
    strengths: [
      'Huge bat speed upside',
      'High power ceiling',
      'Athletic and adjustable',
      'Can create damage to all fields',
      'Dangerous on mistakes',
    ],
    watchOuts: [
      'Timing-sensitive approach',
      'More swing-and-miss risk than flat path',
      'Can get too rotational',
      'Can chase lift and lose barrel accuracy',
      'May struggle with low offspeed if leaking early',
    ],
    developmentFocus: [
      'Timing and pitch selection discipline',
      'Contact consistency under the barrel',
      'Controlling the vertical attack angle',
      'Deceleration and braking strength',
    ],
    mlbComps: ['Mookie Betts', 'Ronald Acuña Jr.', 'José Ramírez'],
  },
  grounded_horizontal: {
    summary:
      'You move with a stable base, minimal bounce, and strong ground force. Your barrel works with a flatter, professional path through the zone — more control than chaos. You are built for consistent, directional hard contact.',
    whenRight: [
      'The swing feels controlled and powerful',
      'You stay strong and balanced through contact',
      'The barrel works through the middle of the field',
      'Hard contact is consistent and repeatable',
    ],
    strengths: [
      'Very consistent contact',
      'Strong plate coverage',
      'Good opposite-field ability',
      'Longer time in zone',
      'Lower swing-and-miss tendencies',
    ],
    watchOuts: [
      'Lower natural HR ceiling',
      'Can struggle to create loft',
      'Damage depends on strength and precision',
      'May struggle with elite inside velocity',
      'Can become too flat or contact-oriented if underpowered',
    ],
    developmentFocus: [
      'Adding loft and damage potential',
      'Elasticity and bat speed work',
      'Keeping power without becoming rigid',
      'Staying connected through rotation',
    ],
    mlbComps: ['Alex Bregman', 'DJ LeMahieu', 'Michael Brantley'],
  },
  grounded_vertical: {
    summary:
      'You move with strong ground pressure, minimal extra movement, and a steep barrel entry built for damage. You create powerful rotational launch from a stable base. When timed up, mistakes get punished hard.',
    whenRight: [
      'The swing feels heavy and explosive',
      'You drive through the ball with authority',
      'Contact creates carry and damage',
      'The attack is direct and committed',
    ],
    strengths: [
      'Elite power ceiling',
      'Huge exit velocity potential',
      'Natural loft',
      'Strong pull-side damage',
      'Mistakes get punished hard',
    ],
    watchOuts: [
      'Higher strikeout risk',
      'Smaller margin for timing error',
      'Less adjustability than flat path hitters',
      'Can get too uphill',
      'Harder to manage top-of-zone velocity',
    ],
    developmentFocus: [
      'Timing without forcing positions',
      'Contact consistency and adjustability',
      'Matching pitch plane',
      'Controlling attack without over-lifting',
    ],
    mlbComps: ['Aaron Judge', 'Pete Alonso', 'Matt Olson'],
  },
};

/* ─── Scoring ────────────────────────────────────── */

export function scoreHittingIdentity(
  answers: ('a' | 'b')[],
): HittingIdentityDiagnosticResult {
  let springy = 0;
  let grounded = 0;
  let horizontal = 0;
  let vertical = 0;

  // Track last chosen value per axis for tie-breaking
  let lastMovement: HittingMovementType = 'springy';
  let lastBatPath: HittingBatPathType = 'horizontal';

  answers.forEach((letter, idx) => {
    const question = HITTING_IDENTITY_QUESTIONS[idx];
    if (!question) return;
    const option = question.options.find((o) => o.letter === letter);
    if (!option) return;

    if (question.axis === 'movement') {
      const val = option.value as HittingMovementType;
      if (val === 'springy') springy++;
      else grounded++;
      lastMovement = val;
    } else {
      const val = option.value as HittingBatPathType;
      if (val === 'horizontal') horizontal++;
      else vertical++;
      lastBatPath = val;
    }
  });

  // Resolve ties: prefer last chosen, then default
  const movementType: HittingMovementType =
    springy > grounded ? 'springy'
    : grounded > springy ? 'grounded'
    : lastMovement;

  const batPathType: HittingBatPathType =
    horizontal > vertical ? 'horizontal'
    : vertical > horizontal ? 'vertical'
    : lastBatPath;

  const combinedProfile = `${movementType}_${batPathType}` as HittingIdentityProfile;

  const mv = MOVEMENT_PROFILES[movementType];
  const bp = BAT_PATH_PROFILES[batPathType];

  return {
    diagnosticKey: 'hitting_identity_v2',
    version: 2,
    completedAt: new Date().toISOString(),
    movementType,
    batPathType,
    combinedProfile,
    movementScores: { springy, grounded },
    batPathScores: { horizontal, vertical },
    movementDescription: mv.description,
    batPathDescription: bp.description,
    movementStrengths: mv.strengths,
    movementStruggles: mv.struggles,
    movementWorkOns: mv.workOns,
    batPathStrengths: bp.strengths,
    batPathStruggles: bp.struggles,
    batPathWorkOns: bp.workOns,
    movementExamples: mv.mlbExamples,
    batPathExamples: bp.mlbExamples,
    movementCues: mv.cues,
    batPathCues: bp.cues,
    summaryLabel: COMBINED_PROFILE_LABELS[combinedProfile],
  };
}

/* ─── Storage key ────────────────────────────────── */

export const HITTING_IDENTITY_STORAGE_KEY = 'otc:hitting-identity-v2';
