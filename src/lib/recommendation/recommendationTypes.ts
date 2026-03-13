/* ────────────────────────────────────────────────
 * OTC RECOMMENDATION ENGINE — SHARED TYPES
 *
 * Universal metadata schema and scoring types used
 * across all vault recommendation layers.
 *
 * Every recommendable item (drill, tool, journal,
 * movement, exercise) conforms to RecommendableItem.
 *
 * Each vault provides its own scoring weights via
 * VaultScoringConfig.
 * ──────────────────────────────────────────────── */

/* ─── Vault identifier ───────────────────────────── */

export type Vault = 'hitting' | 'mental' | 'strength';

/* ─── Fatigue cost ───────────────────────────────── */

export type FatigueCost = 'low' | 'medium' | 'high';

/* ─── Item roles ─────────────────────────────────── */

export type ItemRole =
  | 'primary'
  | 'support'
  | 'reset'
  | 'primer'
  | 'finisher'
  | 'reflection';

/* ─── Frequency limits ───────────────────────────── */

export type FrequencyLimit =
  | 'daily'
  | '2/week'
  | '3/week'
  | 'as-needed';

/* ─── Difficulty ─────────────────────────────────── */

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

/* ─── Universal Recommendable Item ────────────────── */

/**
 * Every item in the OTC system conforms to this schema.
 * Vault-specific data files can extend this with extra fields.
 */
export interface RecommendableItem {
  /** Unique identifier within the vault */
  id: string;
  /** Display name */
  name: string;
  /** Which vault this item belongs to */
  vault: Vault;
  /** Difficulty level */
  difficulty: Difficulty;

  /** What the item is trying to build (positive outcomes) */
  goals: string[];
  /** What problems the item helps solve */
  constraints: string[];
  /** Which identity profiles this item aligns with */
  identityAffinity: string[];
  /** How this item functions in a recommendation stack */
  roles: ItemRole[];

  /** Energy cost */
  fatigueCost: FatigueCost;
  /** How often this item should be used */
  frequencyLimit: FrequencyLimit;

  /* ── Optional fields ──────────────────────────── */

  /** Vault section the item belongs to */
  section?: string;
  /** Equipment needed */
  equipment?: string[];
  /** Age group restriction */
  ageGroup?: 'youth' | 'all';
  /** Freeform notes */
  notes?: string;
  /** Navigation route */
  route?: string;
  /** URL-safe slug */
  slug?: string;
}

/* ─── Scoring ────────────────────────────────────── */

/**
 * Vault-specific scoring weights.
 * Each vault provides its own config to tune the
 * scoring model to its domain.
 */
export interface VaultScoringConfig {
  /** Weight for constraint/issue match */
  constraintMatchWeight: number;
  /** Weight for goal match */
  goalMatchWeight: number;
  /** Weight for identity/profile match */
  identityMatchWeight: number;
  /** Weight for role fit (primary > support > etc.) */
  roleFitWeight: number;
  /** Weight for difficulty fit */
  difficultyFitWeight: number;
  /** Penalty for recently used items */
  repetitionPenalty: number;
  /** Penalty for high-fatigue items when fatigue budget is low */
  fatiguePenalty: number;
  /** Base score every item starts with */
  baseScore: number;
}

/**
 * Input for the generic scoring function.
 * Vault-specific engines map their domain inputs into this.
 */
export interface ScoringInput {
  /** Active constraints/issues to solve (e.g. ['casting', 'late']) */
  activeConstraints: string[];
  /** Active goals to pursue (e.g. ['timing', 'direction']) */
  activeGoals: string[];
  /** Athlete's identity profile(s) (e.g. ['torque_engine'] or ['analyzer']) */
  identityKeys: string[];
  /** Preferred role for this slot (e.g. 'primary') */
  preferredRole: ItemRole;
  /** Athlete difficulty level match */
  difficultyFit: Difficulty;
  /** Items used recently (names or IDs) */
  recentItems: Set<string>;
  /** Day-based rotation index for deterministic variety */
  dayIndex: number;
  /** Whether fatigue budget is constrained */
  fatigueBudgetLow: boolean;
}

/**
 * Scored item — output of the ranking function.
 */
export interface ScoredItem<T extends RecommendableItem = RecommendableItem> {
  item: T;
  score: number;
  /** Which scoring factors contributed */
  factors: {
    constraintMatch: number;
    goalMatch: number;
    identityMatch: number;
    roleFit: number;
    difficultyFit: number;
    repetitionPenalty: number;
    fatiguePenalty: number;
    dayRotation: number;
  };
}

/* ─── Recommendation Output ──────────────────────── */

/**
 * Generic flat recommendation entry.
 * Each vault engine produces an array of these.
 */
export interface FlatRecommendation {
  id: string;
  name: string;
  vault: Vault;
  role: ItemRole;
  /** Original item reference */
  item: RecommendableItem;
}

/**
 * Structured recommendation stack.
 * Each vault can define how many items per slot.
 */
export interface RecommendationStack {
  vault: Vault;
  primary: RecommendableItem[];
  support: RecommendableItem[];
  optional: RecommendableItem[];
}
