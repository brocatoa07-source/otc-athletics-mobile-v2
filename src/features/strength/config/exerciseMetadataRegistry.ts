/**
 * Exercise Metadata Registry — Tags exercises with structured metadata.
 *
 * This registry allows override rules to target exercises by metadata
 * instead of brittle name-string matching.
 *
 * Partial coverage is expected. Exercises not in the registry get DEFAULT_METADATA.
 * The registry grows as new exercises are added to templates.
 *
 * Lookup is by exercise name (case-insensitive substring match for flexibility).
 */

import type { ExerciseMetadata } from '../types/exerciseMetadata';

interface RegistryEntry {
  /** Name pattern (case-insensitive, substring match against exercise name) */
  namePattern: string;
  metadata: ExerciseMetadata;
}

export const EXERCISE_METADATA_REGISTRY: RegistryEntry[] = [
  // ── Squat variants ────────────────────────────────────────────────────────
  { namePattern: 'Back Squat', metadata: { movementCategory: 'squat', phaseRole: 'max_strength', emphasis: ['force_production'], contractionType: 'mixed', velocityType: 'slow_controlled', complexityLevel: 3, fatigueCost: 5, mobilityRequirements: ['hip_flexion', 'ankle_df'], controlRequirements: ['trunk_stiffness'] } },
  { namePattern: 'Front Squat', metadata: { movementCategory: 'squat', phaseRole: 'max_strength', emphasis: ['force_production', 'trunk_control'], contractionType: 'mixed', velocityType: 'slow_controlled', complexityLevel: 4, fatigueCost: 5, mobilityRequirements: ['ankle_df', 'tspine_rotation', 'shoulder_flexion'], controlRequirements: ['trunk_stiffness'] } },
  { namePattern: 'Goblet Squat', metadata: { movementCategory: 'squat', phaseRole: 'control_dev', emphasis: ['position_ownership', 'mobility_access'], contractionType: 'mixed', velocityType: 'slow_controlled', complexityLevel: 1, fatigueCost: 2, mobilityRequirements: ['hip_flexion', 'ankle_df'], controlRequirements: ['none'] } },
  { namePattern: 'Speed Squat', metadata: { movementCategory: 'squat', phaseRole: 'power_dev', emphasis: ['force_production', 'elastic_reactive'], contractionType: 'concentric', velocityType: 'high_velocity', complexityLevel: 3, fatigueCost: 3, mobilityRequirements: ['hip_flexion', 'ankle_df'], controlRequirements: ['trunk_stiffness'] } },
  { namePattern: 'Split Squat', metadata: { movementCategory: 'lunge', phaseRole: 'max_strength', emphasis: ['unilateral_control', 'force_production'], contractionType: 'mixed', velocityType: 'slow_controlled', complexityLevel: 2, fatigueCost: 3, mobilityRequirements: ['hip_flexion'], controlRequirements: ['single_leg_control', 'pelvis_control'] } },

  // ── Hinge variants ────────────────────────────────────────────────────────
  { namePattern: 'RDL', metadata: { movementCategory: 'hinge', phaseRole: 'max_strength', emphasis: ['posterior_chain'], contractionType: 'eccentric', velocityType: 'slow_controlled', complexityLevel: 2, fatigueCost: 4, mobilityRequirements: ['hip_flexion'], controlRequirements: ['trunk_stiffness'] } },
  { namePattern: 'Eccentric RDL', metadata: { movementCategory: 'hinge', phaseRole: 'max_strength', emphasis: ['posterior_chain', 'deceleration'], contractionType: 'eccentric', velocityType: 'slow_controlled', complexityLevel: 3, fatigueCost: 4, mobilityRequirements: ['hip_flexion'], controlRequirements: ['trunk_stiffness'] } },
  { namePattern: 'Trap Bar', metadata: { movementCategory: 'hinge', phaseRole: 'max_strength', emphasis: ['force_production'], contractionType: 'concentric', velocityType: 'moderate_velocity', complexityLevel: 2, fatigueCost: 5, mobilityRequirements: ['hip_flexion'], controlRequirements: ['trunk_stiffness'] } },
  { namePattern: 'Deadlift', metadata: { movementCategory: 'hinge', phaseRole: 'max_strength', emphasis: ['force_production', 'posterior_chain'], contractionType: 'mixed', velocityType: 'slow_controlled', complexityLevel: 3, fatigueCost: 5, mobilityRequirements: ['hip_flexion'], controlRequirements: ['trunk_stiffness'] } },

  // ── Plyometrics ───────────────────────────────────────────────────────────
  { namePattern: 'Box Jump', metadata: { movementCategory: 'jump', phaseRole: 'power_dev', emphasis: ['force_production'], contractionType: 'concentric', velocityType: 'high_velocity', complexityLevel: 2, fatigueCost: 2, mobilityRequirements: ['hip_flexion', 'ankle_df'], controlRequirements: ['landing_control'] } },
  { namePattern: 'Depth Jump', metadata: { movementCategory: 'jump', phaseRole: 'elastic_dev', emphasis: ['elastic_reactive', 'landing_ownership'], contractionType: 'reactive', velocityType: 'max_velocity', complexityLevel: 4, fatigueCost: 4, mobilityRequirements: ['ankle_df'], controlRequirements: ['landing_control'] } },
  { namePattern: 'Pogo', metadata: { movementCategory: 'plyometric', phaseRole: 'elastic_dev', emphasis: ['elastic_reactive'], contractionType: 'reactive', velocityType: 'high_velocity', complexityLevel: 1, fatigueCost: 2, mobilityRequirements: ['ankle_df'], controlRequirements: ['none'] } },
  { namePattern: 'Line Hop', metadata: { movementCategory: 'plyometric', phaseRole: 'elastic_dev', emphasis: ['elastic_reactive'], contractionType: 'reactive', velocityType: 'high_velocity', complexityLevel: 1, fatigueCost: 1, mobilityRequirements: ['none'], controlRequirements: ['none'] } },
  { namePattern: 'Hurdle Hop', metadata: { movementCategory: 'plyometric', phaseRole: 'elastic_dev', emphasis: ['elastic_reactive'], contractionType: 'reactive', velocityType: 'max_velocity', complexityLevel: 3, fatigueCost: 3, mobilityRequirements: ['ankle_df'], controlRequirements: ['landing_control'] } },
  { namePattern: 'Lateral Bound', metadata: { movementCategory: 'bound', phaseRole: 'elastic_dev', emphasis: ['deceleration', 'unilateral_control'], contractionType: 'reactive', velocityType: 'high_velocity', complexityLevel: 3, fatigueCost: 3, mobilityRequirements: ['none'], controlRequirements: ['single_leg_control', 'landing_control'] } },
  { namePattern: 'Box Drop', metadata: { movementCategory: 'jump', phaseRole: 'control_dev', emphasis: ['landing_ownership', 'deceleration'], contractionType: 'eccentric', velocityType: 'moderate_velocity', complexityLevel: 2, fatigueCost: 2, mobilityRequirements: ['ankle_df'], controlRequirements: ['landing_control'] } },
  { namePattern: 'Ankle Stiffness', metadata: { movementCategory: 'plyometric', phaseRole: 'elastic_dev', emphasis: ['elastic_reactive'], contractionType: 'reactive', velocityType: 'high_velocity', complexityLevel: 1, fatigueCost: 1, mobilityRequirements: ['ankle_df'], controlRequirements: ['none'] } },

  // ── Sprint ────────────────────────────────────────────────────────────────
  { namePattern: 'Flying', metadata: { movementCategory: 'sprint', phaseRole: 'speed_dev', emphasis: ['speed_transfer'], contractionType: 'reactive', velocityType: 'max_velocity', complexityLevel: 3, fatigueCost: 4, mobilityRequirements: ['hip_ir', 'hip_er'], controlRequirements: ['pelvis_control'] } },
  { namePattern: 'Wicket', metadata: { movementCategory: 'sprint', phaseRole: 'speed_dev', emphasis: ['speed_transfer', 'elastic_reactive'], contractionType: 'reactive', velocityType: 'max_velocity', complexityLevel: 3, fatigueCost: 3, mobilityRequirements: ['hip_flexion'], controlRequirements: ['pelvis_control'] } },
  { namePattern: 'Sled', metadata: { movementCategory: 'sprint', phaseRole: 'speed_dev', emphasis: ['force_production', 'speed_transfer'], contractionType: 'concentric', velocityType: 'moderate_velocity', complexityLevel: 1, fatigueCost: 3, mobilityRequirements: ['none'], controlRequirements: ['trunk_stiffness'] } },
  { namePattern: 'Wall Drive', metadata: { movementCategory: 'sprint', phaseRole: 'speed_dev', emphasis: ['speed_transfer'], contractionType: 'concentric', velocityType: 'high_velocity', complexityLevel: 2, fatigueCost: 2, mobilityRequirements: ['none'], controlRequirements: ['pelvis_control'] } },

  // ── Olympic lifts ─────────────────────────────────────────────────────────
  { namePattern: 'Clean', metadata: { movementCategory: 'ballistic', phaseRole: 'power_dev', emphasis: ['force_production', 'elastic_reactive'], contractionType: 'ballistic', velocityType: 'max_velocity', complexityLevel: 5, fatigueCost: 4, mobilityRequirements: ['ankle_df', 'hip_flexion', 'shoulder_flexion'], controlRequirements: ['trunk_stiffness'] } },
  { namePattern: 'Snatch', metadata: { movementCategory: 'ballistic', phaseRole: 'power_dev', emphasis: ['force_production', 'elastic_reactive'], contractionType: 'ballistic', velocityType: 'max_velocity', complexityLevel: 5, fatigueCost: 4, mobilityRequirements: ['ankle_df', 'shoulder_flexion', 'tspine_rotation'], controlRequirements: ['trunk_stiffness', 'scap_control'] } },
  { namePattern: 'Jerk', metadata: { movementCategory: 'ballistic', phaseRole: 'power_dev', emphasis: ['force_production'], contractionType: 'ballistic', velocityType: 'max_velocity', complexityLevel: 5, fatigueCost: 4, mobilityRequirements: ['shoulder_flexion', 'ankle_df'], controlRequirements: ['trunk_stiffness'] } },

  // ── Isometrics ────────────────────────────────────────────────────────────
  { namePattern: 'ISO Hold', metadata: { movementCategory: 'isometric', phaseRole: 'control_dev', emphasis: ['position_ownership'], contractionType: 'isometric_yielding', velocityType: 'static_hold', complexityLevel: 1, fatigueCost: 2, mobilityRequirements: ['none'], controlRequirements: ['none'] } },
  { namePattern: 'ISO Push', metadata: { movementCategory: 'isometric', phaseRole: 'max_strength', emphasis: ['force_production'], contractionType: 'isometric_overcoming', velocityType: 'static_hold', complexityLevel: 2, fatigueCost: 3, mobilityRequirements: ['none'], controlRequirements: ['trunk_stiffness'] } },
  { namePattern: 'Pallof', metadata: { movementCategory: 'anti_rotation', phaseRole: 'control_dev', emphasis: ['trunk_control', 'position_ownership'], contractionType: 'isometric_yielding', velocityType: 'static_hold', complexityLevel: 1, fatigueCost: 1, mobilityRequirements: ['none'], controlRequirements: ['trunk_stiffness'] } },
  { namePattern: 'Dead Bug', metadata: { movementCategory: 'stability', phaseRole: 'control_dev', emphasis: ['trunk_control', 'position_ownership'], contractionType: 'mixed', velocityType: 'slow_controlled', complexityLevel: 1, fatigueCost: 1, mobilityRequirements: ['none'], controlRequirements: ['pelvis_control'] } },

  // ── Mobility / Prep ───────────────────────────────────────────────────────
  { namePattern: '90/90', metadata: { movementCategory: 'mobility', phaseRole: 'mobility_dev', emphasis: ['mobility_access'], contractionType: 'mixed', velocityType: 'slow_controlled', complexityLevel: 1, fatigueCost: 1, mobilityRequirements: ['hip_ir', 'hip_er'], controlRequirements: ['none'] } },
  { namePattern: 'Open Book', metadata: { movementCategory: 'mobility', phaseRole: 'mobility_dev', emphasis: ['mobility_access'], contractionType: 'mixed', velocityType: 'slow_controlled', complexityLevel: 1, fatigueCost: 1, mobilityRequirements: ['tspine_rotation'], controlRequirements: ['none'] } },
  { namePattern: 'Ankle', metadata: { movementCategory: 'mobility', phaseRole: 'mobility_dev', emphasis: ['mobility_access'], contractionType: 'mixed', velocityType: 'slow_controlled', complexityLevel: 1, fatigueCost: 1, mobilityRequirements: ['ankle_df'], controlRequirements: ['none'] } },
  { namePattern: 'Hip Thrust', metadata: { movementCategory: 'hinge', phaseRole: 'hypertrophy', emphasis: ['posterior_chain'], contractionType: 'concentric', velocityType: 'moderate_velocity', complexityLevel: 1, fatigueCost: 2, mobilityRequirements: ['none'], controlRequirements: ['pelvis_control'] } },
  { namePattern: 'Copenhagen', metadata: { movementCategory: 'stability', phaseRole: 'control_dev', emphasis: ['unilateral_control'], contractionType: 'isometric_yielding', velocityType: 'static_hold', complexityLevel: 2, fatigueCost: 2, mobilityRequirements: ['adductor_length'], controlRequirements: ['pelvis_control'] } },
  { namePattern: 'Anti-Rotation', metadata: { movementCategory: 'anti_rotation', phaseRole: 'control_dev', emphasis: ['trunk_control'], contractionType: 'isometric_yielding', velocityType: 'static_hold', complexityLevel: 1, fatigueCost: 1, mobilityRequirements: ['none'], controlRequirements: ['trunk_stiffness'] } },

  // ── Pressing ───────────────────────────────────────────────────────────────
  { namePattern: 'Bench Press', metadata: { movementCategory: 'push', phaseRole: 'max_strength', emphasis: ['force_production'], contractionType: 'mixed', velocityType: 'slow_controlled', complexityLevel: 2, fatigueCost: 4, mobilityRequirements: ['shoulder_flexion'], controlRequirements: ['scap_control'] } },
  { namePattern: 'Incline Press', metadata: { movementCategory: 'push', phaseRole: 'max_strength', emphasis: ['force_production'], contractionType: 'mixed', velocityType: 'slow_controlled', complexityLevel: 2, fatigueCost: 3, mobilityRequirements: ['shoulder_flexion'], controlRequirements: ['scap_control'] } },
  { namePattern: 'Push-Up', metadata: { movementCategory: 'push', phaseRole: 'primer', emphasis: ['trunk_control'], contractionType: 'mixed', velocityType: 'moderate_velocity', complexityLevel: 1, fatigueCost: 1, mobilityRequirements: ['none'], controlRequirements: ['trunk_stiffness'] } },
  { namePattern: 'Plyo Push', metadata: { movementCategory: 'push', phaseRole: 'power_dev', emphasis: ['elastic_reactive'], contractionType: 'reactive', velocityType: 'high_velocity', complexityLevel: 3, fatigueCost: 2, mobilityRequirements: ['none'], controlRequirements: ['trunk_stiffness'] } },
  { namePattern: 'Overhead Press', metadata: { movementCategory: 'push', phaseRole: 'max_strength', emphasis: ['force_production', 'scap_integrity'], contractionType: 'concentric', velocityType: 'slow_controlled', complexityLevel: 3, fatigueCost: 3, mobilityRequirements: ['shoulder_flexion', 'tspine_rotation'], controlRequirements: ['trunk_stiffness', 'scap_control'] } },
  { namePattern: 'Landmine Press', metadata: { movementCategory: 'push', phaseRole: 'max_strength', emphasis: ['force_production'], contractionType: 'concentric', velocityType: 'moderate_velocity', complexityLevel: 2, fatigueCost: 2, mobilityRequirements: ['none'], controlRequirements: ['trunk_stiffness'] } },

  // ── Pulling ───────────────────────────────────────────────────────────────
  { namePattern: 'Row', metadata: { movementCategory: 'pull', phaseRole: 'hypertrophy', emphasis: ['posterior_chain', 'scap_integrity'], contractionType: 'mixed', velocityType: 'moderate_velocity', complexityLevel: 2, fatigueCost: 2, mobilityRequirements: ['none'], controlRequirements: ['scap_control'] } },
  { namePattern: 'Pull-Up', metadata: { movementCategory: 'pull', phaseRole: 'max_strength', emphasis: ['force_production', 'scap_integrity'], contractionType: 'mixed', velocityType: 'slow_controlled', complexityLevel: 2, fatigueCost: 3, mobilityRequirements: ['shoulder_flexion'], controlRequirements: ['scap_control'] } },
  { namePattern: 'Chin-Up', metadata: { movementCategory: 'pull', phaseRole: 'max_strength', emphasis: ['force_production'], contractionType: 'mixed', velocityType: 'slow_controlled', complexityLevel: 2, fatigueCost: 3, mobilityRequirements: ['shoulder_flexion'], controlRequirements: ['scap_control'] } },
  { namePattern: 'Pulldown', metadata: { movementCategory: 'pull', phaseRole: 'hypertrophy', emphasis: ['scap_integrity'], contractionType: 'mixed', velocityType: 'moderate_velocity', complexityLevel: 1, fatigueCost: 2, mobilityRequirements: ['shoulder_flexion'], controlRequirements: ['scap_control'] } },
  { namePattern: 'Face Pull', metadata: { movementCategory: 'pull', phaseRole: 'recovery', emphasis: ['scap_integrity'], contractionType: 'concentric', velocityType: 'slow_controlled', complexityLevel: 1, fatigueCost: 1, mobilityRequirements: ['none'], controlRequirements: ['scap_control'] } },

  // ── Carries ───────────────────────────────────────────────────────────────
  { namePattern: 'Carry', metadata: { movementCategory: 'carry', phaseRole: 'control_dev', emphasis: ['trunk_control', 'force_production'], contractionType: 'isometric_yielding', velocityType: 'slow_controlled', complexityLevel: 1, fatigueCost: 3, mobilityRequirements: ['none'], controlRequirements: ['trunk_stiffness'] } },

  // ── Medicine Ball ─────────────────────────────────────────────────────────
  { namePattern: 'MB', metadata: { movementCategory: 'rotation', phaseRole: 'power_dev', emphasis: ['rotational_power', 'speed_transfer'], contractionType: 'ballistic', velocityType: 'max_velocity', complexityLevel: 2, fatigueCost: 2, mobilityRequirements: ['tspine_rotation'], controlRequirements: ['trunk_stiffness'] } },
  { namePattern: 'Med Ball', metadata: { movementCategory: 'rotation', phaseRole: 'power_dev', emphasis: ['rotational_power', 'speed_transfer'], contractionType: 'ballistic', velocityType: 'max_velocity', complexityLevel: 2, fatigueCost: 2, mobilityRequirements: ['tspine_rotation'], controlRequirements: ['trunk_stiffness'] } },
  { namePattern: 'Slam', metadata: { movementCategory: 'ballistic', phaseRole: 'power_dev', emphasis: ['force_production'], contractionType: 'concentric', velocityType: 'max_velocity', complexityLevel: 1, fatigueCost: 2, mobilityRequirements: ['shoulder_flexion'], controlRequirements: ['trunk_stiffness'] } },

  // ── Rotational / Core ─────────────────────────────────────────────────────
  { namePattern: 'Woodchop', metadata: { movementCategory: 'rotation', phaseRole: 'control_dev', emphasis: ['rotational_power', 'trunk_control'], contractionType: 'concentric', velocityType: 'moderate_velocity', complexityLevel: 2, fatigueCost: 2, mobilityRequirements: ['tspine_rotation'], controlRequirements: ['trunk_stiffness'] } },
  { namePattern: 'Landmine Rotation', metadata: { movementCategory: 'rotation', phaseRole: 'power_dev', emphasis: ['rotational_power'], contractionType: 'concentric', velocityType: 'high_velocity', complexityLevel: 2, fatigueCost: 2, mobilityRequirements: ['tspine_rotation'], controlRequirements: ['trunk_stiffness'] } },
  { namePattern: 'Russian Twist', metadata: { movementCategory: 'rotation', phaseRole: 'hypertrophy', emphasis: ['trunk_control'], contractionType: 'concentric', velocityType: 'moderate_velocity', complexityLevel: 1, fatigueCost: 1, mobilityRequirements: ['none'], controlRequirements: ['trunk_stiffness'] } },
  { namePattern: 'Plank', metadata: { movementCategory: 'stability', phaseRole: 'control_dev', emphasis: ['trunk_control', 'position_ownership'], contractionType: 'isometric_yielding', velocityType: 'static_hold', complexityLevel: 1, fatigueCost: 1, mobilityRequirements: ['none'], controlRequirements: ['trunk_stiffness'] } },
  { namePattern: 'V-Up', metadata: { movementCategory: 'stability', phaseRole: 'hypertrophy', emphasis: ['trunk_control'], contractionType: 'concentric', velocityType: 'moderate_velocity', complexityLevel: 1, fatigueCost: 1, mobilityRequirements: ['none'], controlRequirements: ['none'] } },
  { namePattern: 'Leg Raise', metadata: { movementCategory: 'stability', phaseRole: 'hypertrophy', emphasis: ['trunk_control'], contractionType: 'concentric', velocityType: 'slow_controlled', complexityLevel: 2, fatigueCost: 1, mobilityRequirements: ['hip_flexion'], controlRequirements: ['pelvis_control'] } },

  // ── Single-Leg / Accessories ──────────────────────────────────────────────
  { namePattern: 'Step-Up', metadata: { movementCategory: 'lunge', phaseRole: 'hypertrophy', emphasis: ['unilateral_control'], contractionType: 'concentric', velocityType: 'moderate_velocity', complexityLevel: 2, fatigueCost: 2, mobilityRequirements: ['hip_flexion'], controlRequirements: ['single_leg_control'] } },
  { namePattern: 'Bulgarian', metadata: { movementCategory: 'lunge', phaseRole: 'max_strength', emphasis: ['unilateral_control', 'force_production'], contractionType: 'mixed', velocityType: 'slow_controlled', complexityLevel: 3, fatigueCost: 3, mobilityRequirements: ['hip_flexion'], controlRequirements: ['single_leg_control', 'pelvis_control'] } },
  { namePattern: 'Nordic', metadata: { movementCategory: 'hinge', phaseRole: 'max_strength', emphasis: ['posterior_chain', 'deceleration'], contractionType: 'eccentric', velocityType: 'slow_controlled', complexityLevel: 3, fatigueCost: 3, mobilityRequirements: ['none'], controlRequirements: ['trunk_stiffness'] } },
  { namePattern: 'Glute-Ham', metadata: { movementCategory: 'hinge', phaseRole: 'hypertrophy', emphasis: ['posterior_chain'], contractionType: 'mixed', velocityType: 'slow_controlled', complexityLevel: 2, fatigueCost: 2, mobilityRequirements: ['none'], controlRequirements: ['none'] } },
  { namePattern: 'Leg Press', metadata: { movementCategory: 'squat', phaseRole: 'hypertrophy', emphasis: ['force_production'], contractionType: 'mixed', velocityType: 'slow_controlled', complexityLevel: 1, fatigueCost: 3, mobilityRequirements: ['hip_flexion'], controlRequirements: ['none'] } },
  { namePattern: 'Leg Curl', metadata: { movementCategory: 'hinge', phaseRole: 'hypertrophy', emphasis: ['posterior_chain'], contractionType: 'mixed', velocityType: 'slow_controlled', complexityLevel: 1, fatigueCost: 1, mobilityRequirements: ['none'], controlRequirements: ['none'] } },
  { namePattern: 'Calf', metadata: { movementCategory: 'accessory', phaseRole: 'hypertrophy', emphasis: ['elastic_reactive'], contractionType: 'mixed', velocityType: 'slow_controlled', complexityLevel: 1, fatigueCost: 1, mobilityRequirements: ['ankle_df'], controlRequirements: ['none'] } },

  // ── Shoulder Durability ───────────────────────────────────────────────────
  { namePattern: 'External Rotation', metadata: { movementCategory: 'accessory', phaseRole: 'recovery', emphasis: ['scap_integrity'], contractionType: 'concentric', velocityType: 'slow_controlled', complexityLevel: 1, fatigueCost: 1, mobilityRequirements: ['none'], controlRequirements: ['scap_control'] } },
  { namePattern: 'Y-Raise', metadata: { movementCategory: 'accessory', phaseRole: 'recovery', emphasis: ['scap_integrity'], contractionType: 'concentric', velocityType: 'slow_controlled', complexityLevel: 1, fatigueCost: 1, mobilityRequirements: ['shoulder_flexion'], controlRequirements: ['scap_control'] } },
  { namePattern: 'W-Raise', metadata: { movementCategory: 'accessory', phaseRole: 'recovery', emphasis: ['scap_integrity'], contractionType: 'concentric', velocityType: 'slow_controlled', complexityLevel: 1, fatigueCost: 1, mobilityRequirements: ['none'], controlRequirements: ['scap_control'] } },
  { namePattern: 'Pull-Apart', metadata: { movementCategory: 'accessory', phaseRole: 'recovery', emphasis: ['scap_integrity'], contractionType: 'concentric', velocityType: 'slow_controlled', complexityLevel: 1, fatigueCost: 1, mobilityRequirements: ['none'], controlRequirements: ['scap_control'] } },
  { namePattern: 'Bottoms Up', metadata: { movementCategory: 'accessory', phaseRole: 'control_dev', emphasis: ['scap_integrity', 'position_ownership'], contractionType: 'isometric_yielding', velocityType: 'slow_controlled', complexityLevel: 2, fatigueCost: 1, mobilityRequirements: ['shoulder_flexion'], controlRequirements: ['scap_control'] } },

  // ── Sprint / Agility (broad patterns) ─────────────────────────────────────
  { namePattern: 'Sprint', metadata: { movementCategory: 'sprint', phaseRole: 'speed_dev', emphasis: ['speed_transfer'], contractionType: 'reactive', velocityType: 'max_velocity', complexityLevel: 2, fatigueCost: 3, mobilityRequirements: ['hip_ir', 'hip_er'], controlRequirements: ['pelvis_control'] } },
  { namePattern: 'Shuttle', metadata: { movementCategory: 'agility', phaseRole: 'speed_dev', emphasis: ['deceleration', 'speed_transfer'], contractionType: 'reactive', velocityType: 'high_velocity', complexityLevel: 3, fatigueCost: 3, mobilityRequirements: ['none'], controlRequirements: ['single_leg_control'] } },
  { namePattern: 'A-Skip', metadata: { movementCategory: 'sprint', phaseRole: 'primer', emphasis: ['speed_transfer'], contractionType: 'reactive', velocityType: 'moderate_velocity', complexityLevel: 1, fatigueCost: 1, mobilityRequirements: ['hip_flexion'], controlRequirements: ['pelvis_control'] } },
  { namePattern: 'B-Skip', metadata: { movementCategory: 'sprint', phaseRole: 'primer', emphasis: ['speed_transfer'], contractionType: 'reactive', velocityType: 'moderate_velocity', complexityLevel: 2, fatigueCost: 1, mobilityRequirements: ['hip_flexion'], controlRequirements: ['pelvis_control'] } },
  { namePattern: 'Carioca', metadata: { movementCategory: 'agility', phaseRole: 'primer', emphasis: ['speed_transfer'], contractionType: 'reactive', velocityType: 'moderate_velocity', complexityLevel: 1, fatigueCost: 1, mobilityRequirements: ['hip_ir', 'hip_er'], controlRequirements: ['none'] } },
  { namePattern: 'Broad Jump', metadata: { movementCategory: 'jump', phaseRole: 'power_dev', emphasis: ['force_production', 'elastic_reactive'], contractionType: 'concentric', velocityType: 'high_velocity', complexityLevel: 2, fatigueCost: 2, mobilityRequirements: ['hip_flexion', 'ankle_df'], controlRequirements: ['landing_control'] } },
  { namePattern: 'Tuck Jump', metadata: { movementCategory: 'jump', phaseRole: 'elastic_dev', emphasis: ['elastic_reactive'], contractionType: 'reactive', velocityType: 'high_velocity', complexityLevel: 2, fatigueCost: 2, mobilityRequirements: ['hip_flexion'], controlRequirements: ['landing_control'] } },
  { namePattern: 'Bound', metadata: { movementCategory: 'bound', phaseRole: 'elastic_dev', emphasis: ['elastic_reactive', 'speed_transfer'], contractionType: 'reactive', velocityType: 'high_velocity', complexityLevel: 3, fatigueCost: 3, mobilityRequirements: ['none'], controlRequirements: ['single_leg_control', 'landing_control'] } },
  { namePattern: 'Heiden', metadata: { movementCategory: 'bound', phaseRole: 'elastic_dev', emphasis: ['deceleration', 'unilateral_control'], contractionType: 'reactive', velocityType: 'high_velocity', complexityLevel: 3, fatigueCost: 3, mobilityRequirements: ['none'], controlRequirements: ['single_leg_control', 'landing_control'] } },
  { namePattern: 'Skier', metadata: { movementCategory: 'plyometric', phaseRole: 'elastic_dev', emphasis: ['elastic_reactive'], contractionType: 'reactive', velocityType: 'high_velocity', complexityLevel: 2, fatigueCost: 2, mobilityRequirements: ['none'], controlRequirements: ['none'] } },

  // ── Mobility / Recovery (broad patterns) ──────────────────────────────────
  { namePattern: 'Foam Roll', metadata: { movementCategory: 'mobility', phaseRole: 'recovery', emphasis: ['mobility_access'], contractionType: 'mixed', velocityType: 'slow_controlled', complexityLevel: 1, fatigueCost: 1, mobilityRequirements: ['none'], controlRequirements: ['none'] } },
  { namePattern: 'Stretch', metadata: { movementCategory: 'mobility', phaseRole: 'mobility_dev', emphasis: ['mobility_access'], contractionType: 'mixed', velocityType: 'slow_controlled', complexityLevel: 1, fatigueCost: 1, mobilityRequirements: ['none'], controlRequirements: ['none'] } },
  { namePattern: 'Breathing', metadata: { movementCategory: 'mobility', phaseRole: 'recovery', emphasis: ['position_ownership'], contractionType: 'mixed', velocityType: 'slow_controlled', complexityLevel: 1, fatigueCost: 1, mobilityRequirements: ['none'], controlRequirements: ['none'] } },
  { namePattern: 'Pigeon', metadata: { movementCategory: 'mobility', phaseRole: 'mobility_dev', emphasis: ['mobility_access'], contractionType: 'mixed', velocityType: 'slow_controlled', complexityLevel: 1, fatigueCost: 1, mobilityRequirements: ['hip_er'], controlRequirements: ['none'] } },

  // ── Loaded Power (broad patterns) ─────────────────────────────────────────
  { namePattern: 'Hang', metadata: { movementCategory: 'ballistic', phaseRole: 'power_dev', emphasis: ['force_production', 'elastic_reactive'], contractionType: 'ballistic', velocityType: 'max_velocity', complexityLevel: 4, fatigueCost: 3, mobilityRequirements: ['hip_flexion'], controlRequirements: ['trunk_stiffness'] } },
  { namePattern: 'Power', metadata: { movementCategory: 'ballistic', phaseRole: 'power_dev', emphasis: ['force_production'], contractionType: 'ballistic', velocityType: 'high_velocity', complexityLevel: 3, fatigueCost: 3, mobilityRequirements: ['hip_flexion'], controlRequirements: ['trunk_stiffness'] } },
  { namePattern: 'Jump Squat', metadata: { movementCategory: 'jump', phaseRole: 'power_dev', emphasis: ['force_production', 'elastic_reactive'], contractionType: 'concentric', velocityType: 'high_velocity', complexityLevel: 2, fatigueCost: 3, mobilityRequirements: ['ankle_df', 'hip_flexion'], controlRequirements: ['trunk_stiffness'] } },
];

// ── Lookup ───────────────────────────────────────────────────────────────────

import { DEFAULT_METADATA, type ExerciseMetadata as Meta } from '../types/exerciseMetadata';

/**
 * Look up metadata for an exercise by name.
 * Uses case-insensitive substring matching against the registry.
 * Returns DEFAULT_METADATA if no match found.
 */
export function getExerciseMetadata(exerciseName: string): Meta {
  const lower = exerciseName.toLowerCase();
  const entry = EXERCISE_METADATA_REGISTRY.find((e) =>
    lower.includes(e.namePattern.toLowerCase()),
  );
  return entry?.metadata ?? DEFAULT_METADATA;
}
