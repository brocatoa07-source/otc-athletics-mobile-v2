/**
 * Mobility + Movement Prep + Yoga Flow Vault — Core Types
 *
 * This file defines the complete data model for the vault.
 * All flows, drills, tags, and assignment metadata derive from these types.
 */

// ── Enums / Literal Unions ──────────────────────────────────────────────────

export type VaultCategory = 'mobility' | 'movement_prep' | 'yoga_flow';

export type ArchetypeTag = 'static' | 'spring' | 'hybrid';

export type SeasonTag = 'offseason' | 'preseason' | 'inseason' | 'postseason';

export type DayTypeTag =
  | 'upper' | 'lower' | 'power' | 'speed'
  | 'recovery' | 'ar_day' | 'red_readiness'
  | 'post_game' | 'post_lift' | 'throwing' | 'rotation';

export type PositionTag = 'outfielder' | 'infielder' | 'catcher';

export type IntentTag =
  | 'joint_access' | 'activation' | 'control'
  | 'tendon_prep' | 'cns_prep' | 'elasticity'
  | 'recovery' | 'restoration' | 'breathing'
  | 'rotation_prep' | 'sprint_prep' | 'throwing_prep';

export type DeficiencyTag =
  | 'hip_ir' | 'hip_er' | 't_spine_rotation'
  | 'ankle_df' | 'scap_control' | 'rib_pelvis_control'
  | 'separation' | 'block_leg' | 'decel_control'
  | 'bracing' | 'single_leg_stability' | 'adductor_strength'
  | 'elastic_stiffness' | 'postural_control';

export type BodyRegionTag =
  | 'hip' | 'ankle' | 't_spine' | 'shoulder'
  | 'hamstring' | 'adductor' | 'ribcage' | 'pelvis'
  | 'foot_ankle' | 'posterior_chain' | 'trunk';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type Intensity = 'low' | 'moderate' | 'high';

export type ReadinessLevel = 'green' | 'yellow' | 'red';

export type DrillType =
  | 'stretch' | 'mobilization' | 'activation'
  | 'flow' | 'isometric' | 'dynamic'
  | 'breathing' | 'balance' | 'plyometric_prep';

export type HoldType = 'static_hold' | 'dynamic' | 'oscillating' | 'pulsing' | 'flow_through';

export type TimingUnit = 'reps' | 'seconds' | 'breaths';

export type MediaType = 'demo' | 'follow_along' | 'thumbnail' | 'preview';

export type MediaSource = 'local' | 'remote' | 'cloud';

// ── Category ────────────────────────────────────────────────────────────────

export interface VaultCategoryMeta {
  id: string;
  slug: VaultCategory;
  title: string;
  description: string;
  icon: string;
  color: string;
  sortOrder: number;
  active: boolean;
}

// ── Media Reference ─────────────────────────────────────────────────────────

export interface MediaRef {
  type: MediaType;
  source: MediaSource;
  /** Local asset path, remote URL, or cloud storage key */
  uri: string;
  /** Video duration in seconds (null for images) */
  durationSeconds: number | null;
  /** Preview/thumbnail image URI */
  thumbnailUri?: string;
  /** Optional caption or transcript */
  caption?: string;
}

// ── Drill (Shared Library Entry) ────────────────────────────────────────────

export interface Drill {
  id: string;
  slug: string;
  title: string;

  // ── Classification ──
  drillType: DrillType;
  bodyRegionTags: BodyRegionTag[];
  deficiencyTags: DeficiencyTag[];
  intentTags: IntentTag[];

  // ── Defaults (can be overridden per flow) ──
  defaultReps?: number;
  defaultTimeSec?: number;
  defaultBreaths?: number;
  defaultSides?: 1 | 2;
  timingUnit: TimingUnit;
  isBilateral: boolean;

  // ── Execution ──
  holdType: HoldType;
  tempo?: string;

  // ── Instructions ──
  coachingCue: string;
  athleteInstruction: string;
  coachNote?: string;

  // ── Equipment / Space ──
  equipmentNeeded: string[];
  spaceNeeded: 'minimal' | 'moderate' | 'full';

  // ── Progression / Regression ──
  progressionRef?: string; // drill ID
  regressionRef?: string;  // drill ID

  // ── Media ──
  media: MediaRef[];

  // ── Metadata ──
  difficulty: Difficulty;
  active: boolean;
}

// ── Flow-Drill Entry (drill reference inside a flow) ────────────────────────

export interface FlowDrillEntry {
  drillId: string;
  sequenceOrder: number;

  // ── Overrides (if different from drill defaults) ──
  reps?: number;
  timeSec?: number;
  breaths?: number;
  sides?: 1 | 2;
  coachingCueOverride?: string;

  // ── Flow-specific ──
  optional: boolean;
  transitionNote?: string;
}

// ── Flow ────────────────────────────────────────────────────────────────────

export interface Flow {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;

  // ── Classification ──
  category: VaultCategory;
  subcategory?: string;
  purpose: string;
  description: string;

  // ── Athlete vs Coach text ──
  athleteDescription: string;
  coachNotes?: string;

  // ── Timing ──
  durationMinutes: number;
  intensity: Intensity;
  difficulty: Difficulty;

  // ── Tags (for filtering + assignment) ──
  seasonTags: SeasonTag[];
  archetypeTags: ArchetypeTag[];
  positionTags: PositionTag[];
  dayTypeTags: DayTypeTag[];
  deficiencyTags: DeficiencyTag[];
  intentTags: IntentTag[];
  bodyRegionTags: BodyRegionTag[];
  readinessTags: ReadinessLevel[];

  // ── Context ──
  whenToUse: string;
  beforeOrAfterTraining: 'before' | 'after' | 'either' | 'standalone';
  ageGroup: 'youth' | 'high_school' | 'college' | 'all';
  equipmentNeeded: string[];
  spaceNeeded: 'minimal' | 'moderate' | 'full';

  // ── Content ──
  drills: FlowDrillEntry[];
  breathingPrescription?: string;

  // ── Progression / Related ──
  progressionFlowRef?: string;
  regressionFlowRef?: string;
  relatedFlowRefs: string[];
  contraindications?: string;

  // ── Assignment Metadata ──
  assignment: FlowAssignment;

  // ── Media ──
  media: MediaRef[];

  // ── UI / Display ──
  featured: boolean;
  quickAssign: boolean;
  sortOrder: number;
  active: boolean;

  // ── Badge labels for UI cards ──
  badges: string[];
}

// ── Assignment / Prescription Metadata ──────────────────────────────────────

export interface FlowAssignment {
  /** 1–10 priority score for auto-recommendation */
  priorityScore: number;
  primaryUseCase: string;
  secondaryUseCase?: string;
  bestFor: string[];
  avoidIf?: string[];
  recommendedFrequency: string;
  minimumEffectiveDose: string;
  coachAssignmentNotes?: string;
}

// ── Assignment Rule (future rules engine) ───────────────────────────────────

export interface AssignmentRule {
  id: string;
  name: string;
  description: string;

  // ── Conditions (all must match) ──
  conditions: {
    archetype?: ArchetypeTag[];
    deficiency?: DeficiencyTag[];
    season?: SeasonTag[];
    dayType?: DayTypeTag[];
    readiness?: ReadinessLevel[];
    position?: PositionTag[];
  };

  // ── Result ──
  recommendedFlowIds: string[];
  priority: number;
  active: boolean;
}
