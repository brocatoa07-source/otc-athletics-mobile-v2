/**
 * Mobility Vault — Canonical Tag Definitions
 *
 * All tag groups with display metadata.
 * Used for filtering, assignment, and UI rendering.
 */

import type {
  VaultCategory, ArchetypeTag, SeasonTag, DayTypeTag,
  PositionTag, IntentTag, DeficiencyTag, BodyRegionTag,
} from './types';

interface TagMeta {
  slug: string;
  label: string;
  color: string;
}

// ── Category Tags ───────────────────────────────────────────────────────────

export const CATEGORY_TAGS: Record<VaultCategory, TagMeta> = {
  mobility:      { slug: 'mobility',      label: 'Mobility',       color: '#3b82f6' },
  movement_prep: { slug: 'movement_prep', label: 'Movement Prep',  color: '#22c55e' },
  yoga_flow:     { slug: 'yoga_flow',     label: 'Yoga Flow',      color: '#8b5cf6' },
};

// ── Archetype Tags ──────────────────────────────────────────────────────────

export const ARCHETYPE_TAGS: Record<ArchetypeTag, TagMeta> = {
  static: { slug: 'static', label: 'Static Mover', color: '#3b82f6' },
  spring: { slug: 'spring', label: 'Spring Mover', color: '#ef4444' },
  hybrid: { slug: 'hybrid', label: 'Hybrid Mover', color: '#22c55e' },
};

// ── Season Tags ─────────────────────────────────────────────────────────────

export const SEASON_TAGS: Record<SeasonTag, TagMeta> = {
  offseason:   { slug: 'offseason',   label: 'Offseason',   color: '#3b82f6' },
  preseason:   { slug: 'preseason',   label: 'Preseason',   color: '#f59e0b' },
  inseason:    { slug: 'inseason',    label: 'In-Season',   color: '#22c55e' },
  postseason:  { slug: 'postseason',  label: 'Postseason',  color: '#8b5cf6' },
};

// ── Day Type Tags ───────────────────────────────────────────────────────────

export const DAY_TYPE_TAGS: Record<DayTypeTag, TagMeta> = {
  upper:         { slug: 'upper',         label: 'Upper Body',     color: '#3b82f6' },
  lower:         { slug: 'lower',         label: 'Lower Body',     color: '#22c55e' },
  power:         { slug: 'power',         label: 'Power Day',      color: '#ef4444' },
  speed:         { slug: 'speed',         label: 'Speed Day',      color: '#f59e0b' },
  recovery:      { slug: 'recovery',      label: 'Recovery',       color: '#64748b' },
  ar_day:        { slug: 'ar_day',        label: 'Active Recovery', color: '#06b6d4' },
  red_readiness: { slug: 'red_readiness', label: 'Red Readiness',  color: '#ef4444' },
  post_game:     { slug: 'post_game',     label: 'Post-Game',      color: '#8b5cf6' },
  post_lift:     { slug: 'post_lift',     label: 'Post-Lift',      color: '#a855f7' },
  throwing:      { slug: 'throwing',      label: 'Throwing Day',   color: '#e11d48' },
  rotation:      { slug: 'rotation',      label: 'Rotation Focus', color: '#f97316' },
};

// ── Position Tags ───────────────────────────────────────────────────────────

export const POSITION_TAGS: Record<PositionTag, TagMeta> = {
  outfielder: { slug: 'outfielder', label: 'Outfielder', color: '#3b82f6' },
  infielder:  { slug: 'infielder',  label: 'Infielder',  color: '#22c55e' },
  catcher:    { slug: 'catcher',    label: 'Catcher',     color: '#f59e0b' },
};

// ── Intent Tags ─────────────────────────────────────────────────────────────

export const INTENT_TAGS: Record<IntentTag, TagMeta> = {
  joint_access:   { slug: 'joint_access',   label: 'Joint Access',    color: '#3b82f6' },
  activation:     { slug: 'activation',     label: 'Activation',      color: '#22c55e' },
  control:        { slug: 'control',        label: 'Control',         color: '#0891b2' },
  tendon_prep:    { slug: 'tendon_prep',    label: 'Tendon Prep',     color: '#f59e0b' },
  cns_prep:       { slug: 'cns_prep',       label: 'CNS Prep',        color: '#ef4444' },
  elasticity:     { slug: 'elasticity',     label: 'Elasticity',      color: '#a855f7' },
  recovery:       { slug: 'recovery',       label: 'Recovery',        color: '#64748b' },
  restoration:    { slug: 'restoration',    label: 'Restoration',     color: '#06b6d4' },
  breathing:      { slug: 'breathing',      label: 'Breathing',       color: '#8b5cf6' },
  rotation_prep:  { slug: 'rotation_prep',  label: 'Rotation Prep',   color: '#f97316' },
  sprint_prep:    { slug: 'sprint_prep',    label: 'Sprint Prep',     color: '#e11d48' },
  throwing_prep:  { slug: 'throwing_prep',  label: 'Throwing Prep',   color: '#ec4899' },
};

// ── Deficiency Tags ─────────────────────────────────────────────────────────

export const DEFICIENCY_TAGS: Record<DeficiencyTag, TagMeta> = {
  hip_ir:              { slug: 'hip_ir',              label: 'Hip IR',              color: '#3b82f6' },
  hip_er:              { slug: 'hip_er',              label: 'Hip ER',              color: '#0891b2' },
  t_spine_rotation:    { slug: 't_spine_rotation',    label: 'T-Spine Rotation',    color: '#f59e0b' },
  ankle_df:            { slug: 'ankle_df',            label: 'Ankle Dorsiflexion',  color: '#22c55e' },
  scap_control:        { slug: 'scap_control',        label: 'Scapular Control',    color: '#8b5cf6' },
  rib_pelvis_control:  { slug: 'rib_pelvis_control',  label: 'Rib-Pelvis Control',  color: '#a855f7' },
  separation:          { slug: 'separation',          label: 'Separation',          color: '#ef4444' },
  block_leg:           { slug: 'block_leg',           label: 'Block Leg',           color: '#e11d48' },
  decel_control:       { slug: 'decel_control',       label: 'Decel Control',       color: '#f97316' },
  bracing:             { slug: 'bracing',             label: 'Bracing',             color: '#64748b' },
  single_leg_stability:{ slug: 'single_leg_stability',label: 'Single-Leg Stability',color: '#06b6d4' },
  adductor_strength:   { slug: 'adductor_strength',   label: 'Adductor Strength',   color: '#ec4899' },
  elastic_stiffness:   { slug: 'elastic_stiffness',   label: 'Elastic Stiffness',   color: '#ef4444' },
  postural_control:    { slug: 'postural_control',    label: 'Postural Control',    color: '#22c55e' },
};

// ── Body Region Tags ────────────────────────────────────────────────────────

export const BODY_REGION_TAGS: Record<BodyRegionTag, TagMeta> = {
  hip:              { slug: 'hip',              label: 'Hip',              color: '#3b82f6' },
  ankle:            { slug: 'ankle',            label: 'Ankle',            color: '#22c55e' },
  t_spine:          { slug: 't_spine',          label: 'T-Spine',          color: '#f59e0b' },
  shoulder:         { slug: 'shoulder',         label: 'Shoulder',         color: '#8b5cf6' },
  hamstring:        { slug: 'hamstring',        label: 'Hamstring',        color: '#ef4444' },
  adductor:         { slug: 'adductor',         label: 'Adductor',         color: '#ec4899' },
  ribcage:          { slug: 'ribcage',          label: 'Ribcage',          color: '#a855f7' },
  pelvis:           { slug: 'pelvis',           label: 'Pelvis',           color: '#0891b2' },
  foot_ankle:       { slug: 'foot_ankle',       label: 'Foot / Ankle',     color: '#64748b' },
  posterior_chain:  { slug: 'posterior_chain',   label: 'Posterior Chain',   color: '#f97316' },
  trunk:            { slug: 'trunk',            label: 'Trunk',            color: '#06b6d4' },
};
