import type { Position, TrainingExperience, TrainingTimeline, ScProfile } from '@/hooks/useAthleteScProfile';

/* ────────────────────────────────────────────────────
 * DEFICIENCY SCORING ENGINE
 *
 * Scores athletes across 5 dimensions (0–100):
 *   Mobility, Strength, Power, Speed, Durability
 *
 * Sources of scoring data:
 *   1. Movement archetype quiz answers (primary)
 *   2. Athlete profile (position, experience, age)
 *   3. Positional modifiers (known demands)
 *
 * Low scores = deficiency = higher priority in programming.
 * ──────────────────────────────────────────────────── */

export type Dimension = 'mobility' | 'strength' | 'power' | 'speed' | 'durability';

export interface DeficiencyScores {
  mobility: number;    // 0-100, lower = more deficient
  strength: number;
  power: number;
  speed: number;
  durability: number;
}

export interface DimensionMeta {
  key: Dimension;
  label: string;
  icon: string;
  color: string;
  lowDesc: string;
  highDesc: string;
}

export const DIMENSIONS: DimensionMeta[] = [
  { key: 'mobility',    label: 'Mobility',    icon: 'body-outline',        color: '#22c55e', lowDesc: 'Stiff — needs range of motion work',           highDesc: 'Mobile and fluid' },
  { key: 'strength',    label: 'Strength',    icon: 'barbell-outline',     color: '#3b82f6', lowDesc: 'Weak foundation — needs heavier loading',      highDesc: 'Strong base established' },
  { key: 'power',       label: 'Power',       icon: 'flash-outline',       color: '#f59e0b', lowDesc: 'Low explosiveness — needs plyos and speed',    highDesc: 'Explosive and fast-twitch' },
  { key: 'speed',       label: 'Speed',       icon: 'speedometer-outline', color: '#8b5cf6', lowDesc: 'Slow first step — needs sprint mechanics',     highDesc: 'Quick and fast' },
  { key: 'durability',  label: 'Durability',  icon: 'shield-outline',      color: '#06b6d4', lowDesc: 'Injury-prone — needs prehab and stability',    highDesc: 'Resilient and durable' },
];

/* ────────────────────────────────────────────────────
 * QUIZ-BASED SCORING
 *
 * Each quiz question maps to dimensions. Answers shift
 * scores up or down based on what they reveal.
 * ──────────────────────────────────────────────────── */

export type QuizAnswer = 'A' | 'B' | 'C';

/** Per-question scoring impact. Each answer adjusts dimension scores. */
interface QuestionScoring {
  questionIndex: number;
  /** A answers tend to indicate static-dominant traits */
  A: Partial<DeficiencyScores>;
  /** B answers tend to indicate spring-dominant traits */
  B: Partial<DeficiencyScores>;
  /** C answers tend to indicate hybrid/balanced traits */
  C: Partial<DeficiencyScores>;
}

/**
 * Maps the 12 existing quiz questions to dimension adjustments.
 * Positive = boost that dimension, Negative = reveals deficiency.
 */
const QUIZ_SCORING: QuestionScoring[] = [
  // Q1: When you sprint, you feel...
  { questionIndex: 0,
    A: { strength: 8, speed: -6, mobility: -4 },   // Powerful but heavy
    B: { speed: 8, power: 6, strength: -6 },        // Fast and bouncy
    C: { speed: 4, strength: 4 },                    // Strong and smooth
  },
  // Q2: When you jump...
  { questionIndex: 1,
    A: { strength: 6, power: -4, speed: -4 },       // High but effortful
    B: { power: 8, speed: 6, strength: -4 },         // Springy
    C: { power: 4, strength: 4 },                    // Solid
  },
  // Q3: When you rotate...
  { questionIndex: 2,
    A: { strength: 6, mobility: -8, power: -2 },    // Strong but stiff
    B: { mobility: 8, power: 6, strength: -6 },     // Loose and whippy
    C: { mobility: 4, strength: 4 },                 // Controlled
  },
  // Q4: Your hips feel...
  { questionIndex: 3,
    A: { mobility: -10, durability: -4 },            // Tight
    B: { mobility: 8, durability: 4 },               // Loose
    C: { mobility: 4 },                              // Normal
  },
  // Q5: In the weight room...
  { questionIndex: 4,
    A: { strength: 10, mobility: -4 },               // Naturally strong
    B: { strength: -8, mobility: 4, speed: 4 },      // Struggles with weight
    C: { strength: 4 },                              // Average
  },
  // Q6: Holding positions (planks/lunges)...
  { questionIndex: 5,
    A: { durability: 8, strength: 6 },               // Very stable
    B: { durability: -8, strength: -6 },             // Shakes quickly
    C: { durability: 4, strength: 4 },               // Okay
  },
  // Q7: When you land from a jump...
  { questionIndex: 6,
    A: { durability: -6, power: 4 },                 // Hard landing
    B: { power: 8, durability: -2 },                 // Bounces back
    C: { durability: 6, power: 4 },                  // Controlled
  },
  // Q8: Your speed feels...
  { questionIndex: 7,
    A: { strength: 6, speed: -6, power: 4 },        // Strong early, slow top end
    B: { speed: 10, power: 6 },                      // Fast at top speed
    C: { speed: 4, strength: 4 },                    // Decent everywhere
  },
  // Q9: Changing direction...
  { questionIndex: 8,
    A: { strength: 6, speed: -4, durability: 4 },   // Plants strong, slow re-accel
    B: { speed: 8, durability: -6 },                 // Quick but loses control
    C: { speed: 4, durability: 4 },                  // Balanced
  },
  // Q10: Coaches say...
  { questionIndex: 9,
    A: { strength: 8, power: 4, speed: -4 },        // Strong and physical
    B: { speed: 8, power: 6, strength: -4 },         // Quick and twitchy
    C: { speed: 4, strength: 4, power: 4 },          // Well-rounded
  },
  // Q11: Your movement is...
  { questionIndex: 10,
    A: { strength: 8, power: 4, mobility: -6 },     // Powerful
    B: { mobility: 6, power: 6, speed: 6 },          // Elastic
    C: { strength: 4, mobility: 4, speed: 4 },       // Balanced
  },
  // Q12: If you had to improve one thing...
  { questionIndex: 11,
    A: { mobility: -8, speed: -4, power: -4 },      // Wants flexibility
    B: { strength: -8, durability: -4 },             // Wants strength
    C: { mobility: -2, strength: -2, speed: -2 },   // Needs direction
  },
];

/** Calculate deficiency scores from quiz answers */
export function scoreFromQuiz(answers: QuizAnswer[]): DeficiencyScores {
  // Start at baseline 50
  const scores: DeficiencyScores = {
    mobility: 50,
    strength: 50,
    power: 50,
    speed: 50,
    durability: 50,
  };

  answers.forEach((answer, i) => {
    const scoring = QUIZ_SCORING[i];
    if (!scoring) return;
    const adjustments = scoring[answer];
    for (const [dim, delta] of Object.entries(adjustments)) {
      scores[dim as Dimension] = Math.max(0, Math.min(100, scores[dim as Dimension] + (delta ?? 0)));
    }
  });

  return scores;
}

/* ────────────────────────────────────────────────────
 * POSITIONAL MODIFIERS
 *
 * Each position has known athletic demands. These
 * modify scores to weight deficiencies that matter
 * most for that position.
 * ──────────────────────────────────────────────────── */

interface PositionalModifier {
  position: Position;
  label: string;
  /** Dimension weights — higher means more important for this position */
  weights: Record<Dimension, number>;
  /** Priorities in plain language */
  priorities: string[];
}

export const POSITIONAL_MODIFIERS: PositionalModifier[] = [
  {
    position: 'OF',
    label: 'Outfielder',
    weights: { speed: 1.3, power: 1.2, strength: 1.0, mobility: 0.9, durability: 1.0 },
    priorities: ['Linear speed', 'Arm strength', 'Rotational power', 'Top-end velocity'],
  },
  {
    position: 'IF',
    label: 'Infielder',
    weights: { speed: 1.2, power: 1.1, mobility: 1.2, strength: 1.0, durability: 1.1 },
    priorities: ['Lateral quickness', 'Reactive speed', 'Rotational control', 'Hip mobility'],
  },
  {
    position: 'C',
    label: 'Catcher',
    weights: { durability: 1.4, mobility: 1.3, strength: 1.2, power: 1.0, speed: 0.8 },
    priorities: ['Hip mobility', 'Knee durability', 'Lower body endurance', 'Blocking resilience'],
  },
];

/** Apply positional modifier: amplify deficiencies that matter more for this position */
export function applyPositionalModifier(scores: DeficiencyScores, position: Position): DeficiencyScores {
  const mod = POSITIONAL_MODIFIERS.find((m) => m.position === position);
  if (!mod) return scores;

  const result = { ...scores };
  for (const dim of Object.keys(result) as Dimension[]) {
    const weight = mod.weights[dim];
    // For deficiencies (score < 50), the weight amplifies how bad it is
    // For strengths (score > 50), the weight reduces over-confidence on low-priority dims
    const deviation = result[dim] - 50;
    result[dim] = Math.max(0, Math.min(100, 50 + deviation * weight));
  }
  return result;
}

/* ────────────────────────────────────────────────────
 * EXPERIENCE & AGE ADJUSTMENTS
 * ──────────────────────────────────────────────────── */

export function applyProfileAdjustments(scores: DeficiencyScores, profile: ScProfile): DeficiencyScores {
  const result = { ...scores };

  // Beginners tend to have lower durability and strength baselines
  if (profile.experience === 'beginner') {
    result.strength = Math.max(0, result.strength - 8);
    result.durability = Math.max(0, result.durability - 6);
  }
  // Advanced lifters have higher strength floor
  if (profile.experience === 'advanced') {
    result.strength = Math.min(100, result.strength + 8);
    result.durability = Math.min(100, result.durability + 4);
  }

  // Young athletes (< 16) — prioritize durability and mobility
  if (profile.age < 16) {
    result.durability = Math.max(0, result.durability - 6);
    result.mobility = Math.min(100, result.mobility + 4);
  }

  // In-season: durability matters more (fatigue)
  if (profile.timeline === 'in-season') {
    result.durability = Math.max(0, result.durability - 6);
  }

  return result;
}

/* ────────────────────────────────────────────────────
 * FULL SCORING PIPELINE
 * ──────────────────────────────────────────────────── */

export function computeFullScores(
  quizAnswers: QuizAnswer[],
  profile: ScProfile,
): DeficiencyScores {
  let scores = scoreFromQuiz(quizAnswers);
  scores = applyPositionalModifier(scores, profile.position);
  scores = applyProfileAdjustments(scores, profile);
  return scores;
}

/** Get the top N deficiencies (lowest scores) */
export function getTopDeficiencies(scores: DeficiencyScores, count: number = 2): Dimension[] {
  return (Object.entries(scores) as [Dimension, number][])
    .sort((a, b) => a[1] - b[1])
    .slice(0, count)
    .map(([dim]) => dim);
}

/** Get a text summary for a dimension score */
export function getScoreLabel(score: number): string {
  if (score <= 25) return 'Major Gap';
  if (score <= 40) return 'Needs Work';
  if (score <= 55) return 'Average';
  if (score <= 70) return 'Solid';
  if (score <= 85) return 'Strong';
  return 'Elite';
}
