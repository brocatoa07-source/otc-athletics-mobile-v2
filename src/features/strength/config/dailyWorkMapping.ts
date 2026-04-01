/**
 * Daily Work Mapping — Deterministic daily_work_focus → recipe buckets.
 *
 * Each DailyWorkFocus maps to a set of exercise/drill categories
 * that populate the athlete's Daily Work screen.
 */

import type { DailyWorkFocus } from '../types/strengthProfile';

export interface DailyWorkRecipe {
  focus: DailyWorkFocus;
  label: string;
  description: string;
  buckets: string[];
}

export const DAILY_WORK_RECIPES: Record<DailyWorkFocus, DailyWorkRecipe> = {
  mobility_access: {
    focus: 'mobility_access',
    label: 'Movement Access',
    description: 'Restore usable positions. Access before output.',
    buckets: [
      'hip_ir_er_access',
      'ankle_df_access',
      'tspine_rotation_access',
      'adductor_mobility',
      'shoulder_access_reset',
    ],
  },

  position_control: {
    focus: 'position_control',
    label: 'Position Control',
    description: 'Own positions under load. Control before chaos.',
    buckets: [
      'rib_pelvis_control',
      'single_leg_ownership',
      'block_leg_iso',
      'anti_rotation_hold',
      'scap_trunk_control',
    ],
  },

  strength_base: {
    focus: 'strength_base',
    label: 'Strength Support',
    description: 'Build base force. Simple progressions, honest load.',
    buckets: [
      'isometric_strength_support',
      'unilateral_strength_support',
      'posterior_chain_support',
      'trunk_strength_support',
    ],
  },

  elastic_reactivity: {
    focus: 'elastic_reactivity',
    label: 'Elastic Reactivity',
    description: 'Improve stiffness, rebound, and conversion of force into quickness.',
    buckets: [
      'pogos',
      'line_hops',
      'dribbles',
      'stiffness_isos',
      'snap_down_reactivity',
    ],
  },

  speed_rotation: {
    focus: 'speed_rotation',
    label: 'Speed & Rotation',
    description: 'Transfer force to sprint and rotational outputs.',
    buckets: [
      'acceleration_mechanics',
      'maxv_mechanics',
      'separation_drills',
      'medball_speed',
      'anti_rotation_to_rotation',
    ],
  },
};
