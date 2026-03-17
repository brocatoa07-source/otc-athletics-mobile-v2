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
      'Springy hitters tend to move with elastic energy, rhythm, rebound, and a lighter more reactive feel. They often do best when they stay athletic, loose, and organized rather than overly restricted or forced into a heavy grounded move.',
    strengths: [
      'Create rhythm',
      'Move athletically',
      'Generate quickness and rebound',
      'Create bat speed through timing and elastic movement',
    ],
    struggles: [
      'Getting too jumpy',
      'Rushing',
      'Drifting',
      'Losing stability when timing is off',
    ],
    workOns: [
      'Rhythm and tempo control',
      'Balance in the gather',
      'Controlled forward movement',
      'Staying athletic without leaking',
    ],
    cues: [
      'Stay loose and athletic',
      'Let the move rebound',
      'Create rhythm before launch',
      'Whip the barrel, don\'t push it',
    ],
    mlbExamples: ['Cody Bellinger', 'Mookie Betts'],
    color: '#a855f7',
  },
  grounded: {
    type: 'grounded',
    label: 'Grounded',
    description:
      'Grounded hitters tend to organize force through pressure into the ground, a lower center of gravity, and a stronger stable base. They often do best when they feel powerful, connected to the ground, and able to turn force through the hips and legs.',
    strengths: [
      'Create stability',
      'Use the ground well',
      'Stay strong through contact',
      'Generate force through pressure and rotation',
    ],
    struggles: [
      'Getting too stuck',
      'Becoming too heavy or slow',
      'Losing adjustability',
      'Over-controlling movement',
    ],
    workOns: [
      'Clean pressure shift',
      'Turning from the hips',
      'Staying connected without freezing',
      'Keeping power without becoming rigid',
    ],
    cues: [
      'Own the ground before the swing',
      'Push pressure through the floor',
      'Turn from the hips, not the shoulders',
      'Stay heavy through contact',
    ],
    mlbExamples: ['Freddie Freeman', 'Paul Goldschmidt'],
    color: '#3b82f6',
  },
};

export const BAT_PATH_PROFILES: Record<HittingBatPathType, BatPathProfileData> = {
  horizontal: {
    type: 'horizontal',
    label: 'Horizontal',
    description:
      'Horizontal hitters tend to work with a flatter, more sweeping path through the zone. They often see the ball longer, track lateral movement well, and create strong line-drive contact across the field.',
    strengths: [
      'Stay through the middle of the field',
      'Cover the zone',
      'Create consistent line drives',
      'Stay on the ball longer',
    ],
    struggles: [
      'Producing enough lift',
      'Hitting too many ground balls when timing is off',
      'Lacking damage if they do not get the right ball flight',
    ],
    workOns: [
      'Maintaining barrel direction',
      'Creating flush contact',
      'Finding the right ball flight without over-lifting',
      'Driving the ball with intent',
    ],
    cues: [
      'Stay through the middle of the field',
      'Let the barrel work across the zone',
      'Win the path through contact',
      'Stay behind the ball longer',
    ],
    mlbExamples: ['Freddie Freeman', 'Yandy Díaz'],
    color: '#22c55e',
  },
  vertical: {
    type: 'vertical',
    label: 'Vertical',
    description:
      'Vertical hitters tend to attack the ball on a more direct upward plane with a stronger lift-oriented intent. They often create power, carry, and backspin when timing and pitch selection are right.',
    strengths: [
      'Drive the ball in the air',
      'Create backspin',
      'Produce power and extra-base contact',
      'Attack aggressively',
    ],
    struggles: [
      'Missing under the ball',
      'Too much loft',
      'Swing-and-miss when timing is off',
      'Getting beat in certain windows if barrel entry is inconsistent',
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
    mlbExamples: ['Aaron Judge', 'Eugenio Suárez'],
    color: '#ef4444',
  },
};

/* ─── Combined profile labels ────────────────────── */

export const COMBINED_PROFILE_LABELS: Record<HittingIdentityProfile, string> = {
  springy_horizontal: 'Springy Horizontal Hitter',
  springy_vertical: 'Springy Vertical Hitter',
  grounded_horizontal: 'Grounded Horizontal Hitter',
  grounded_vertical: 'Grounded Vertical Hitter',
};

/* ─── Combined profile summary descriptions ─────── */

export const COMBINED_PROFILE_SUMMARIES: Record<HittingIdentityProfile, string> = {
  springy_horizontal:
    'You move best with elastic rhythm and tend to work with a sweeping, line-drive-oriented path through the zone.',
  springy_vertical:
    'You move best with elastic rhythm and tend to attack the ball on a more direct, lift-oriented path.',
  grounded_horizontal:
    'You move best with ground pressure and stability, and tend to work with a sweeping, line-drive-oriented path through the zone.',
  grounded_vertical:
    'You move best with ground pressure and stability, and tend to attack the ball on a more direct, lift-oriented path.',
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
