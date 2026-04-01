/**
 * Exercise Metadata Types — Structured tags for metadata-based override resolution.
 *
 * Every exercise can be tagged with these metadata fields.
 * Override rules target metadata instead of brittle name-string matching.
 *
 * This enables:
 *   - Suppress all exercises with contractionType: 'eccentric' (not just name substring "Eccentric")
 *   - Inject exercises with emphasis: 'elastic_reactive' into plyo blocks
 *   - Swap exercises where complexityLevel > threshold for mobility-limited athletes
 *   - Validate session coherence using fatigueCost budgets
 */

// ── Movement Category ───────────────────────────────────────────────────────

export type MovementCategory =
  | 'squat'
  | 'hinge'
  | 'lunge'
  | 'push'
  | 'pull'
  | 'carry'
  | 'rotation'
  | 'anti_rotation'
  | 'jump'
  | 'bound'
  | 'sprint'
  | 'agility'
  | 'mobility'
  | 'stability'
  | 'isometric'
  | 'plyometric'
  | 'ballistic'
  | 'accessory';

// ── Phase Role ──────────────────────────────────────────────────────────────

export type PhaseRole =
  | 'primer'          // CNS activation / warm-up
  | 'power_dev'       // explosive / loaded power
  | 'max_strength'    // heavy primary lifts
  | 'hypertrophy'     // volume / muscle building
  | 'speed_dev'       // sprint / acceleration
  | 'elastic_dev'     // reactive / stiffness
  | 'control_dev'     // stability / position ownership
  | 'mobility_dev'    // ROM / access work
  | 'conditioning'    // work capacity
  | 'recovery';       // tissue care / flush

// ── Emphasis ────────────────────────────────────────────────────────────────

export type ExerciseEmphasis =
  | 'force_production'
  | 'elastic_reactive'
  | 'deceleration'
  | 'position_ownership'
  | 'mobility_access'
  | 'speed_transfer'
  | 'rotational_power'
  | 'posterior_chain'
  | 'trunk_control'
  | 'scap_integrity'
  | 'unilateral_control'
  | 'landing_ownership';

// ── Contraction Type ────────────────────────────────────────────────────────

export type ContractionType =
  | 'concentric'
  | 'eccentric'
  | 'isometric_yielding'
  | 'isometric_overcoming'
  | 'reactive'
  | 'ballistic'
  | 'mixed';

// ── Velocity Type ───────────────────────────────────────────────────────────

export type VelocityType =
  | 'max_velocity'
  | 'high_velocity'
  | 'moderate_velocity'
  | 'slow_controlled'
  | 'static_hold';

// ── Complexity / Fatigue / Requirements ─────────────────────────────────────

export type ComplexityLevel = 1 | 2 | 3 | 4 | 5;
export type FatigueCost = 1 | 2 | 3 | 4 | 5;

/** Mobility/access requirements — which joints need full ROM */
export type MobilityRequirement =
  | 'hip_ir'
  | 'hip_er'
  | 'ankle_df'
  | 'tspine_rotation'
  | 'shoulder_flexion'
  | 'hip_flexion'
  | 'adductor_length'
  | 'none';

/** Control/stability requirements */
export type ControlRequirement =
  | 'pelvis_control'
  | 'block_leg_stability'
  | 'single_leg_control'
  | 'trunk_stiffness'
  | 'scap_control'
  | 'landing_control'
  | 'none';

// ── Full Metadata Tag Set ───────────────────────────────────────────────────

export interface ExerciseMetadata {
  movementCategory: MovementCategory;
  phaseRole: PhaseRole;
  emphasis: ExerciseEmphasis[];
  contractionType: ContractionType;
  velocityType: VelocityType;
  complexityLevel: ComplexityLevel;
  fatigueCost: FatigueCost;
  mobilityRequirements: MobilityRequirement[];
  controlRequirements: ControlRequirement[];
}

// ── Default metadata for exercises without explicit tags ─────────────────────

export const DEFAULT_METADATA: ExerciseMetadata = {
  movementCategory: 'accessory',
  phaseRole: 'hypertrophy',
  emphasis: [],
  contractionType: 'mixed',
  velocityType: 'moderate_velocity',
  complexityLevel: 2,
  fatigueCost: 2,
  mobilityRequirements: ['none'],
  controlRequirements: ['none'],
};

// ── Metadata-based filter predicates ────────────────────────────────────────

export interface MetadataFilter {
  movementCategory?: MovementCategory[];
  phaseRole?: PhaseRole[];
  emphasis?: ExerciseEmphasis[];
  contractionType?: ContractionType[];
  velocityType?: VelocityType[];
  maxComplexity?: ComplexityLevel;
  maxFatigueCost?: FatigueCost;
  mobilityRequirements?: MobilityRequirement[];
  controlRequirements?: ControlRequirement[];
}

/**
 * Check if exercise metadata matches a filter.
 * All specified filter fields must match (AND logic).
 * Array fields use intersection (at least one match).
 */
export function matchesFilter(meta: ExerciseMetadata, filter: MetadataFilter): boolean {
  if (filter.movementCategory && !filter.movementCategory.includes(meta.movementCategory)) return false;
  if (filter.phaseRole && !filter.phaseRole.includes(meta.phaseRole)) return false;
  if (filter.contractionType && !filter.contractionType.includes(meta.contractionType)) return false;
  if (filter.velocityType && !filter.velocityType.includes(meta.velocityType)) return false;
  if (filter.maxComplexity && meta.complexityLevel > filter.maxComplexity) return false;
  if (filter.maxFatigueCost && meta.fatigueCost > filter.maxFatigueCost) return false;
  if (filter.emphasis && !filter.emphasis.some((e) => meta.emphasis.includes(e))) return false;
  if (filter.mobilityRequirements && !filter.mobilityRequirements.some((r) => meta.mobilityRequirements.includes(r))) return false;
  if (filter.controlRequirements && !filter.controlRequirements.some((r) => meta.controlRequirements.includes(r))) return false;
  return true;
}
