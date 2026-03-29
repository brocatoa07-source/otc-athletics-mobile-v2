/**
 * Mobility Vault — Assignment Rules + Seasonal/Weekly Implementation
 *
 * Rules engine for automatic flow recommendation.
 * Seasonal implementation tables for dosage guidance.
 * Weekly models for 3/4/5 day training.
 */

import type { AssignmentRule, SeasonTag } from './types';

// ═══════════════════════════════════════════════════════════════════════════════
// ASSIGNMENT RULES
// ═══════════════════════════════════════════════════════════════════════════════

export const ASSIGNMENT_RULES: AssignmentRule[] = [
  // ── Archetype + Day Type Rules ────────────────────────────────────────────

  {
    id: 'rule-static-lower-hip',
    name: 'Static Mover — Lower Day Hip Prep',
    description: 'Static movers need extra hip mobility before lower body training.',
    conditions: { archetype: ['static'], dayType: ['lower', 'power'] },
    recommendedFlowIds: ['mob-hip', 'prep-lower-sprint'],
    priority: 9, active: true,
  },
  {
    id: 'rule-static-upper-tspine',
    name: 'Static Mover — Upper Day T-Spine Prep',
    description: 'Static movers need T-spine access before upper body and rotation work.',
    conditions: { archetype: ['static'], dayType: ['upper', 'throwing', 'rotation'] },
    recommendedFlowIds: ['mob-tspine', 'prep-rotation'],
    priority: 9, active: true,
  },
  {
    id: 'rule-spring-lower-control',
    name: 'Spring Mover — Lower Day Stability Prep',
    description: 'Spring movers need stability and control work, not more mobility.',
    conditions: { archetype: ['spring'], dayType: ['lower', 'speed'] },
    recommendedFlowIds: ['prep-lower-sprint', 'prep-decel-cod'],
    priority: 9, active: true,
  },
  {
    id: 'rule-spring-power-elastic',
    name: 'Spring Mover — Power Day Elastic Prep',
    description: 'Spring movers benefit from elastic prep with added control elements.',
    conditions: { archetype: ['spring'], dayType: ['power'] },
    recommendedFlowIds: ['prep-elastic'],
    priority: 8, active: true,
  },
  {
    id: 'rule-hybrid-lower',
    name: 'Hybrid Mover — Lower Day Balanced Prep',
    description: 'Hybrid movers get balanced mobility + activation.',
    conditions: { archetype: ['hybrid'], dayType: ['lower'] },
    recommendedFlowIds: ['mob-hip', 'prep-lower-sprint'],
    priority: 7, active: true,
  },

  // ── Deficiency Rules ──────────────────────────────────────────────────────

  {
    id: 'rule-deficiency-hip-ir',
    name: 'Hip IR Deficiency',
    description: 'Athletes with limited hip internal rotation need daily hip mobility.',
    conditions: { deficiency: ['hip_ir'] },
    recommendedFlowIds: ['mob-hip', 'yoga-hips'],
    priority: 10, active: true,
  },
  {
    id: 'rule-deficiency-tspine',
    name: 'T-Spine Rotation Deficiency',
    description: 'Athletes with limited T-spine rotation need rotation prep.',
    conditions: { deficiency: ['t_spine_rotation'] },
    recommendedFlowIds: ['mob-tspine', 'prep-rotation'],
    priority: 10, active: true,
  },
  {
    id: 'rule-deficiency-ankle',
    name: 'Ankle Dorsiflexion Deficiency',
    description: 'Athletes with limited ankle DF need ankle mobility before lower sessions.',
    conditions: { deficiency: ['ankle_df'] },
    recommendedFlowIds: ['mob-ankle'],
    priority: 8, active: true,
  },
  {
    id: 'rule-deficiency-decel',
    name: 'Decel Control Deficiency',
    description: 'Athletes with poor deceleration need control-based prep.',
    conditions: { deficiency: ['decel_control'] },
    recommendedFlowIds: ['prep-decel-cod'],
    priority: 9, active: true,
  },
  {
    id: 'rule-deficiency-separation',
    name: 'Separation Deficiency',
    description: 'Athletes with poor pelvis-ribcage separation need rotation prep.',
    conditions: { deficiency: ['separation'] },
    recommendedFlowIds: ['prep-rotation', 'yoga-rotation'],
    priority: 9, active: true,
  },

  // ── Day Type / Context Rules ──────────────────────────────────────────────

  {
    id: 'rule-post-game',
    name: 'Post-Game Recovery',
    description: 'After every game, assign recovery flow.',
    conditions: { dayType: ['post_game'] },
    recommendedFlowIds: ['yoga-post-game', 'yoga-full-recovery'],
    priority: 10, active: true,
  },
  {
    id: 'rule-post-lift',
    name: 'Post-Lift Regen',
    description: 'After every lift, assign short regen flow.',
    conditions: { dayType: ['post_lift'] },
    recommendedFlowIds: ['yoga-post-lift'],
    priority: 7, active: true,
  },
  {
    id: 'rule-ar-day',
    name: 'Active Recovery Day',
    description: 'AR days get yoga/recovery flows.',
    conditions: { dayType: ['ar_day'] },
    recommendedFlowIds: ['yoga-full-recovery', 'yoga-hips', 'yoga-breathing-reset'],
    priority: 9, active: true,
  },
  {
    id: 'rule-red-readiness',
    name: 'Red Readiness Day',
    description: 'Red readiness means low output. Breathing and gentle recovery only.',
    conditions: { readiness: ['red'] },
    recommendedFlowIds: ['yoga-breathing-reset', 'yoga-full-recovery'],
    priority: 10, active: true,
  },
  {
    id: 'rule-throwing-day',
    name: 'Throwing Day Prep',
    description: 'Throwing days need shoulder + rotation prep.',
    conditions: { dayType: ['throwing'] },
    recommendedFlowIds: ['prep-throwing', 'mob-shoulder'],
    priority: 9, active: true,
  },
  {
    id: 'rule-speed-day',
    name: 'Speed Day Prep',
    description: 'Speed days need sprint prep + elastic work.',
    conditions: { dayType: ['speed'] },
    recommendedFlowIds: ['prep-lower-sprint', 'prep-elastic'],
    priority: 9, active: true,
  },

  // ── Position Rules ────────────────────────────────────────────────────────

  {
    id: 'rule-catcher-hips',
    name: 'Catcher Hip Maintenance',
    description: 'Catchers need extra hip mobility due to position demands.',
    conditions: { position: ['catcher'] },
    recommendedFlowIds: ['mob-hip', 'yoga-hips'],
    priority: 8, active: true,
  },
];

/**
 * Match assignment rules against athlete context.
 * Returns matching rules sorted by priority (highest first).
 */
export function matchRules(context: {
  archetype?: string;
  deficiency?: string[];
  season?: string;
  dayType?: string;
  readiness?: string;
  position?: string;
}): AssignmentRule[] {
  return ASSIGNMENT_RULES
    .filter((rule) => {
      if (!rule.active) return false;
      const c = rule.conditions;

      if (c.archetype?.length && context.archetype && !c.archetype.includes(context.archetype as any)) return false;
      if (c.season?.length && context.season && !c.season.includes(context.season as any)) return false;
      if (c.dayType?.length && context.dayType && !c.dayType.includes(context.dayType as any)) return false;
      if (c.readiness?.length && context.readiness && !c.readiness.includes(context.readiness as any)) return false;
      if (c.position?.length && context.position && !c.position.includes(context.position as any)) return false;
      if (c.deficiency?.length && context.deficiency) {
        if (!c.deficiency.some((d) => context.deficiency!.includes(d as any))) return false;
      }

      return true;
    })
    .sort((a, b) => b.priority - a.priority);
}

// ═══════════════════════════════════════════════════════════════════════════════
// SEASONAL IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════════

export interface SeasonalPlan {
  season: SeasonTag;
  label: string;
  mobilityDosage: 'high' | 'moderate' | 'low';
  prepDosage: 'high' | 'moderate' | 'low';
  yogaDosage: 'high' | 'moderate' | 'low';
  mobilityFrequency: string;
  prepFrequency: string;
  yogaFrequency: string;
  flowDuration: string;
  priorities: string[];
  avoid: string[];
}

export const SEASONAL_PLANS: Record<SeasonTag, SeasonalPlan> = {
  offseason: {
    season: 'offseason', label: 'Off-Season',
    mobilityDosage: 'high', prepDosage: 'high', yogaDosage: 'moderate',
    mobilityFrequency: '5–6x/week', prepFrequency: '4–5x/week', yogaFrequency: '2–3x/week',
    flowDuration: '8–10 min mobility, 6–7 min prep, 8–10 min yoga',
    priorities: [
      'Build movement quality and joint access',
      'Develop elastic and tendon capacity',
      'Fix deficiencies identified in assessment',
      'Establish daily mobility habits',
    ],
    avoid: [
      'Skipping mobility because athlete feels fine',
      'Rushing prep flows — own every position',
    ],
  },
  preseason: {
    season: 'preseason', label: 'Pre-Season',
    mobilityDosage: 'moderate', prepDosage: 'high', yogaDosage: 'low',
    mobilityFrequency: '3–4x/week', prepFrequency: '5x/week', yogaFrequency: '1–2x/week',
    flowDuration: '5–7 min mobility, 5–7 min prep, 5–7 min yoga',
    priorities: [
      'Neural prep is king — prep flows before every session',
      'Maintain mobility gains from off-season',
      'Increase rotation and throwing prep frequency',
      'Short, sharp prep over long mobility',
    ],
    avoid: [
      'Long slow stretching before explosive training',
      'Adding mobility volume when prep is the priority',
    ],
  },
  inseason: {
    season: 'inseason', label: 'In-Season',
    mobilityDosage: 'low', prepDosage: 'moderate', yogaDosage: 'high',
    mobilityFrequency: '2–3x/week', prepFrequency: '3–4x/week', yogaFrequency: '3–5x/week',
    flowDuration: '5 min mobility, 5 min prep, 5–10 min yoga',
    priorities: [
      'Maintain access — don\'t build new range',
      'Recovery is the priority — yoga after every game',
      'Short prep flows before lifts and throwing',
      'Breathing flows for nervous system management',
    ],
    avoid: [
      'Creating soreness from excessive mobility',
      'Long flows on game days',
      'Skipping post-game recovery',
    ],
  },
  postseason: {
    season: 'postseason', label: 'Post-Season / Recovery Block',
    mobilityDosage: 'high', prepDosage: 'low', yogaDosage: 'high',
    mobilityFrequency: '4–5x/week', prepFrequency: '1–2x/week', yogaFrequency: '4–5x/week',
    flowDuration: '8–10 min mobility, 5 min prep, 10 min yoga',
    priorities: [
      'Restore body after season demands',
      'Clean up restrictions accumulated in-season',
      'High yoga and breathing dosage',
      'Rebuild movement quality before next training block',
    ],
    avoid: [
      'Jumping straight into heavy training',
      'Skipping the restoration phase',
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// WEEKLY IMPLEMENTATION MODELS
// ═══════════════════════════════════════════════════════════════════════════════

export interface WeeklyDayPlan {
  day: string;
  dayType: string;
  prepFlow: string;
  postFlow: string;
}

export interface WeeklyModel {
  daysPerWeek: number;
  label: string;
  days: WeeklyDayPlan[];
  notes: string;
}

export const WEEKLY_MODELS: WeeklyModel[] = [
  {
    daysPerWeek: 5, label: '5-Day Training Model',
    days: [
      { day: 'Monday',    dayType: 'Lower Body',      prepFlow: 'Sprint Prep Flow',       postFlow: 'Hip Mobility Flow' },
      { day: 'Tuesday',   dayType: 'Upper Body',      prepFlow: 'Upper Body Prep Flow',   postFlow: 'T-Spine Recovery' },
      { day: 'Wednesday', dayType: 'Power / Speed',    prepFlow: 'Elastic Prep Flow',      postFlow: 'Post-Lift Regen' },
      { day: 'Thursday',  dayType: 'Active Recovery',  prepFlow: 'None',                   postFlow: 'Full Recovery Flow' },
      { day: 'Friday',    dayType: 'Rotation / Throw', prepFlow: 'Rotation Prep Flow',     postFlow: 'Rotation Recovery' },
    ],
    notes: 'AR day uses yoga flow only. Weekend games get Post-Game Recovery Flow. Red readiness days substitute Breathing Reset.',
  },
  {
    daysPerWeek: 4, label: '4-Day Training Model',
    days: [
      { day: 'Monday',    dayType: 'Lower Body',      prepFlow: 'Sprint Prep Flow',       postFlow: 'Hip Mobility Flow' },
      { day: 'Tuesday',   dayType: 'Upper Body',      prepFlow: 'Rotation Prep Flow',     postFlow: 'T-Spine Recovery' },
      { day: 'Thursday',  dayType: 'Power / Speed',    prepFlow: 'Elastic Prep Flow',      postFlow: 'Post-Lift Regen' },
      { day: 'Friday',    dayType: 'Active Recovery',  prepFlow: 'None',                   postFlow: 'Full Recovery Flow' },
    ],
    notes: 'Wednesday is off or light skill work. Game days get Post-Game Recovery. Add mobility flow on off days if time allows.',
  },
  {
    daysPerWeek: 3, label: '3-Day Training Model',
    days: [
      { day: 'Monday',    dayType: 'Lower Body',      prepFlow: 'Sprint Prep Flow',       postFlow: 'Hip Mobility Flow' },
      { day: 'Wednesday', dayType: 'Upper / Power',    prepFlow: 'Rotation Prep Flow',     postFlow: 'Post-Lift Regen' },
      { day: 'Friday',    dayType: 'Full Body / Speed', prepFlow: 'Elastic Prep Flow',     postFlow: 'Full Recovery Flow' },
    ],
    notes: 'Off days are ideal for standalone yoga/recovery flows. In-season, add Post-Game Recovery after weekend games.',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// ARCHETYPE FLOW RECOMMENDATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export interface ArchetypeFlowGuide {
  archetype: string;
  label: string;
  mobilityPriority: string;
  prepPriority: string;
  yogaPriority: string;
  primaryFlows: string[];
  avoidOrReduce: string[];
  weeklyEmphasis: string;
}

export const ARCHETYPE_FLOW_GUIDES: Record<string, ArchetypeFlowGuide> = {
  static: {
    archetype: 'static', label: 'Static Mover',
    mobilityPriority: 'HIGH — needs the most mobility work. Hips, T-spine, and shoulders are usually restricted.',
    prepPriority: 'MODERATE — focus on rotation prep and elastic prep to build qualities they lack.',
    yogaPriority: 'MODERATE — recovery flows help maintain the mobility gains from dedicated mobility work.',
    primaryFlows: [
      'Hip Mobility Flow (daily)',
      'T-Spine Mobility Flow (4–5x/week)',
      'Rotation Prep Flow (before hitting/throwing)',
      'Full Recovery Flow (AR days)',
    ],
    avoidOrReduce: [
      'Excessive isometric-only prep without mobility lead-in',
      'Skipping hip/T-spine work because they feel strong',
    ],
    weeklyEmphasis: 'Mobility before every session. Prep flows targeting rotation and elasticity. Recovery to maintain gains.',
  },
  spring: {
    archetype: 'spring', label: 'Spring Mover',
    mobilityPriority: 'LOW — already has range. Over-mobilizing makes them looser without better control.',
    prepPriority: 'HIGH — needs control, stability, braking, and isometric work. This is their primary need.',
    yogaPriority: 'MODERATE — recovery flows are fine. Avoid long passive stretching sessions.',
    primaryFlows: [
      'Sprint Prep Flow with iso emphasis (before lower)',
      'Decel / COD Prep Flow (before speed)',
      'Elastic Prep Flow (before power)',
      'Breathing Reset (recovery days)',
    ],
    avoidOrReduce: [
      'Long passive mobility sessions that add range without control',
      'Excessive hip mobility when hips are already mobile',
      'Yoga flows that are too passive — add controlled breathing focus',
    ],
    weeklyEmphasis: 'Control-based prep flows daily. Isometrics and stability. Recovery breathing. Less passive mobility.',
  },
  hybrid: {
    archetype: 'hybrid', label: 'Hybrid Mover',
    mobilityPriority: 'MODERATE — balanced approach. Address specific deficiencies, not blanket mobility.',
    prepPriority: 'MODERATE — balanced activation and control. Emphasize whatever the assessment highlights.',
    yogaPriority: 'MODERATE — standard recovery dosage.',
    primaryFlows: [
      'Hip Mobility Flow (3–4x/week)',
      'Sprint Prep or Rotation Prep (matched to session)',
      'Full Recovery Flow (AR days)',
      'Post-Lift Regen (after every lift)',
    ],
    avoidOrReduce: [
      'Over-specializing in one direction without assessment data',
      'Treating hybrid as "do everything" — target deficiencies',
    ],
    weeklyEmphasis: 'Balanced mobility and prep. Let the assessment drive emphasis. Standard recovery.',
  },
};
