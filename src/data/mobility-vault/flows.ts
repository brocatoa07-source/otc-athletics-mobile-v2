/**
 * Mobility Vault — Complete Flow Library
 *
 * 3 Categories × Multiple Flows + Archetype-Specific Flows
 * Each flow references drills from the shared drill library by ID.
 */

import type { Flow } from './types';

// ── Helper to build a flow with defaults ────────────────────────────────────

type FlowInput = Omit<Flow, 'media' | 'relatedFlowRefs' | 'badges' | 'active' | 'featured' | 'quickAssign'>
  & Partial<Pick<Flow, 'media' | 'relatedFlowRefs' | 'badges' | 'active' | 'featured' | 'quickAssign' | 'breathingPrescription' | 'progressionFlowRef' | 'regressionFlowRef' | 'contraindications' | 'coachNotes'>>;

function flow(f: FlowInput): Flow {
  return {
    media: [],
    relatedFlowRefs: [],
    badges: [],
    featured: false,
    quickAssign: false,
    active: true,
    ...f,
  } as Flow;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. MOBILITY FLOWS
// ═══════════════════════════════════════════════════════════════════════════════

const MOBILITY_FLOWS: Flow[] = [
  flow({
    id: 'mob-hip', slug: 'hip-mobility', title: 'Hip Mobility Flow', shortTitle: 'Hip Mobility',
    category: 'mobility', subcategory: 'hip',
    purpose: 'Restore hip IR, ER, and flexor length. Access positions needed for squatting, sprinting, and rotating.',
    description: 'A 7-minute hip-focused flow targeting internal rotation, external rotation, adductors, and hip flexor length.',
    athleteDescription: 'Open your hips before training. Targets the areas that get tight from sitting and sprinting.',
    coachNotes: 'Default hip flow for any athlete. Prioritize for static movers and catchers. Can be used daily.',
    durationMinutes: 7, intensity: 'low', difficulty: 'beginner',
    seasonTags: ['offseason', 'preseason', 'inseason', 'postseason'],
    archetypeTags: ['static', 'spring', 'hybrid'], positionTags: ['outfielder', 'infielder', 'catcher'],
    dayTypeTags: ['lower', 'power', 'speed', 'post_lift', 'recovery'],
    deficiencyTags: ['hip_ir', 'hip_er', 'adductor_strength'], intentTags: ['joint_access'],
    bodyRegionTags: ['hip', 'pelvis', 'adductor'], readinessTags: ['green', 'yellow'],
    whenToUse: 'Before lower body training, speed work, or hitting. After lifts as cooldown.',
    beforeOrAfterTraining: 'either', ageGroup: 'all', equipmentNeeded: [], spaceNeeded: 'minimal',
    drills: [
      { drillId: '90-90-transitions', sequenceOrder: 1, reps: 8, optional: false },
      { drillId: 'hip-flexor-stretch', sequenceOrder: 2, timeSec: 30, optional: false },
      { drillId: 'adductor-rockbacks', sequenceOrder: 3, reps: 8, optional: false },
      { drillId: 'pigeon-stretch', sequenceOrder: 4, timeSec: 30, optional: false },
      { drillId: 'deep-squat-pry', sequenceOrder: 5, timeSec: 30, optional: false },
      { drillId: 'hip-cars', sequenceOrder: 6, reps: 5, optional: true },
    ],
    breathingPrescription: 'Inhale through nose on setup. Exhale through mouth as you move deeper.',
    assignment: {
      priorityScore: 9, primaryUseCase: 'Pre-training hip prep',
      bestFor: ['static movers', 'limited hip IR', 'catchers', 'post-squat'],
      avoidIf: ['active hip impingement'],
      recommendedFrequency: '4–6x/week', minimumEffectiveDose: '3x/week for 4 weeks',
    },
    sortOrder: 1, featured: true, quickAssign: true, badges: ['All Movers', '7 min', 'Hip'],
  }),

  flow({
    id: 'mob-ankle', slug: 'ankle-mobility', title: 'Ankle Mobility Flow', shortTitle: 'Ankle Mobility',
    category: 'mobility', subcategory: 'ankle',
    purpose: 'Improve ankle dorsiflexion for squatting, sprinting, and landing mechanics.',
    description: 'A 5-minute ankle flow using knee-to-wall progressions and calf tissue work.',
    athleteDescription: 'Unlock your ankles for better squats, sprints, and landings.',
    durationMinutes: 5, intensity: 'low', difficulty: 'beginner',
    seasonTags: ['offseason', 'preseason', 'inseason'], archetypeTags: ['static', 'spring', 'hybrid'],
    positionTags: ['outfielder', 'infielder', 'catcher'],
    dayTypeTags: ['lower', 'power', 'speed'], deficiencyTags: ['ankle_df'],
    intentTags: ['joint_access'], bodyRegionTags: ['ankle', 'foot_ankle'], readinessTags: ['green', 'yellow'],
    whenToUse: 'Before lower body training or speed work.',
    beforeOrAfterTraining: 'before', ageGroup: 'all', equipmentNeeded: ['wall'], spaceNeeded: 'minimal',
    drills: [
      { drillId: 'knee-to-wall-ankle', sequenceOrder: 1, reps: 10, optional: false },
      { drillId: 'deep-squat-pry', sequenceOrder: 2, timeSec: 30, optional: false },
      { drillId: 'pogos', sequenceOrder: 3, reps: 15, optional: true, coachingCueOverride: 'Light activation after mobility. Wake up the tendons.' },
    ],
    assignment: {
      priorityScore: 7, primaryUseCase: 'Pre-squat ankle prep',
      bestFor: ['limited dorsiflexion', 'sprint days', 'squat days'],
      recommendedFrequency: '3–5x/week', minimumEffectiveDose: '3x/week',
    },
    sortOrder: 2, badges: ['5 min', 'Ankle'],
  }),

  flow({
    id: 'mob-tspine', slug: 't-spine-mobility', title: 'T-Spine Mobility Flow', shortTitle: 'T-Spine',
    category: 'mobility', subcategory: 't_spine',
    purpose: 'Restore thoracic rotation and extension for throwing, hitting, and overhead positions.',
    description: 'A 6-minute T-spine flow targeting rotation, extension, and rib mobility.',
    athleteDescription: 'Open your upper back for better rotation and overhead positions.',
    durationMinutes: 6, intensity: 'low', difficulty: 'beginner',
    seasonTags: ['offseason', 'preseason', 'inseason', 'postseason'], archetypeTags: ['static', 'spring', 'hybrid'],
    positionTags: ['outfielder', 'infielder', 'catcher'],
    dayTypeTags: ['upper', 'throwing', 'rotation', 'post_lift'],
    deficiencyTags: ['t_spine_rotation', 'rib_pelvis_control'], intentTags: ['joint_access', 'rotation_prep'],
    bodyRegionTags: ['t_spine', 'ribcage', 'shoulder'], readinessTags: ['green', 'yellow'],
    whenToUse: 'Before upper body training, throwing, or hitting.',
    beforeOrAfterTraining: 'before', ageGroup: 'all', equipmentNeeded: [], spaceNeeded: 'minimal',
    drills: [
      { drillId: 'cat-cow', sequenceOrder: 1, reps: 8, optional: false },
      { drillId: 'thread-the-needle', sequenceOrder: 2, reps: 8, optional: false },
      { drillId: 'quadruped-t-spine-rotation', sequenceOrder: 3, reps: 8, optional: false },
      { drillId: 'open-books', sequenceOrder: 4, reps: 8, optional: false },
    ],
    assignment: {
      priorityScore: 8, primaryUseCase: 'Pre-throw / pre-hitting rotation prep',
      bestFor: ['static movers', 'limited T-spine rotation', 'throwers'],
      recommendedFrequency: '4–6x/week', minimumEffectiveDose: '3x/week',
    },
    sortOrder: 3, featured: true, badges: ['6 min', 'T-Spine'],
  }),

  flow({
    id: 'mob-shoulder', slug: 'shoulder-mobility', title: 'Shoulder Mobility Flow', shortTitle: 'Shoulder',
    category: 'mobility', subcategory: 'shoulder',
    purpose: 'Restore shoulder range, scapular control, and overhead access.',
    description: 'A 6-minute shoulder flow for overhead access and scapular mechanics.',
    athleteDescription: 'Open your shoulders and build scapular control for throwing and overhead work.',
    durationMinutes: 6, intensity: 'low', difficulty: 'beginner',
    seasonTags: ['offseason', 'preseason', 'inseason'], archetypeTags: ['static', 'spring', 'hybrid'],
    positionTags: ['outfielder', 'infielder', 'catcher'],
    dayTypeTags: ['upper', 'throwing'], deficiencyTags: ['scap_control'],
    intentTags: ['joint_access', 'throwing_prep'], bodyRegionTags: ['shoulder', 't_spine'],
    readinessTags: ['green', 'yellow'],
    whenToUse: 'Before upper body training or throwing.',
    beforeOrAfterTraining: 'before', ageGroup: 'all', equipmentNeeded: ['dowel or PVC pipe', 'wall'], spaceNeeded: 'minimal',
    drills: [
      { drillId: 'overhead-dowel-dislocates', sequenceOrder: 1, reps: 10, optional: false },
      { drillId: 'wall-overhead-reach', sequenceOrder: 2, reps: 8, optional: false },
      { drillId: 'scap-wall-slides', sequenceOrder: 3, reps: 10, optional: false },
      { drillId: 'side-lying-chest-stretch', sequenceOrder: 4, timeSec: 30, optional: false },
    ],
    assignment: {
      priorityScore: 7, primaryUseCase: 'Pre-throw shoulder prep',
      bestFor: ['throwers', 'upper body days', 'limited overhead range'],
      recommendedFrequency: '3–5x/week', minimumEffectiveDose: '3x/week',
    },
    sortOrder: 4, badges: ['6 min', 'Shoulder'],
  }),

  flow({
    id: 'mob-full-lower', slug: 'full-lower-mobility', title: 'Full Lower Body Mobility', shortTitle: 'Full Lower',
    category: 'mobility',
    purpose: 'Complete lower body mobility covering hips, ankles, and posterior chain.',
    description: 'A 10-minute comprehensive lower body flow combining hip, ankle, and hamstring mobility.',
    athleteDescription: 'Full lower body opening — hips, ankles, and hamstrings in one flow.',
    durationMinutes: 10, intensity: 'low', difficulty: 'beginner',
    seasonTags: ['offseason', 'postseason'], archetypeTags: ['static', 'hybrid'],
    positionTags: ['outfielder', 'infielder', 'catcher'],
    dayTypeTags: ['lower', 'recovery', 'ar_day'], deficiencyTags: ['hip_ir', 'ankle_df'],
    intentTags: ['joint_access', 'recovery'], bodyRegionTags: ['hip', 'ankle', 'hamstring', 'pelvis'],
    readinessTags: ['green', 'yellow'],
    whenToUse: 'Off-season development or recovery days.',
    beforeOrAfterTraining: 'either', ageGroup: 'all', equipmentNeeded: ['wall'], spaceNeeded: 'minimal',
    drills: [
      { drillId: '90-90-transitions', sequenceOrder: 1, reps: 8, optional: false },
      { drillId: 'hip-flexor-stretch', sequenceOrder: 2, timeSec: 30, optional: false },
      { drillId: 'adductor-rockbacks', sequenceOrder: 3, reps: 8, optional: false },
      { drillId: 'knee-to-wall-ankle', sequenceOrder: 4, reps: 10, optional: false },
      { drillId: 'spiderman-hamstring', sequenceOrder: 5, reps: 5, optional: false },
      { drillId: 'deep-squat-pry', sequenceOrder: 6, timeSec: 30, optional: false },
    ],
    assignment: {
      priorityScore: 8, primaryUseCase: 'Off-season mobility development',
      bestFor: ['static movers', 'off-season', 'recovery days'],
      recommendedFrequency: '3–4x/week', minimumEffectiveDose: '2x/week',
    },
    sortOrder: 5, badges: ['10 min', 'Full Lower'],
  }),

  flow({
    id: 'mob-full-upper', slug: 'full-upper-mobility', title: 'Full Upper Body Mobility', shortTitle: 'Full Upper',
    category: 'mobility',
    purpose: 'Complete upper body mobility covering T-spine, shoulders, and ribcage.',
    description: 'An 8-minute upper body flow combining T-spine rotation, shoulder range, and rib mobility.',
    athleteDescription: 'Full upper body opening — T-spine, shoulders, and ribcage in one flow.',
    durationMinutes: 8, intensity: 'low', difficulty: 'beginner',
    seasonTags: ['offseason', 'postseason'], archetypeTags: ['static', 'hybrid'],
    positionTags: ['outfielder', 'infielder', 'catcher'],
    dayTypeTags: ['upper', 'throwing', 'recovery'], deficiencyTags: ['t_spine_rotation', 'scap_control'],
    intentTags: ['joint_access', 'rotation_prep'], bodyRegionTags: ['t_spine', 'shoulder', 'ribcage'],
    readinessTags: ['green', 'yellow'],
    whenToUse: 'Before upper body days or as a standalone upper mobility session.',
    beforeOrAfterTraining: 'either', ageGroup: 'all', equipmentNeeded: ['dowel or PVC pipe'], spaceNeeded: 'minimal',
    drills: [
      { drillId: 'cat-cow', sequenceOrder: 1, reps: 8, optional: false },
      { drillId: 'thread-the-needle', sequenceOrder: 2, reps: 8, optional: false },
      { drillId: 'quadruped-t-spine-rotation', sequenceOrder: 3, reps: 8, optional: false },
      { drillId: 'overhead-dowel-dislocates', sequenceOrder: 4, reps: 10, optional: false },
      { drillId: 'scap-wall-slides', sequenceOrder: 5, reps: 10, optional: false },
    ],
    assignment: {
      priorityScore: 7, primaryUseCase: 'Off-season upper mobility development',
      bestFor: ['static movers', 'limited T-spine', 'upper body days'],
      recommendedFrequency: '3–4x/week', minimumEffectiveDose: '2x/week',
    },
    sortOrder: 6, badges: ['8 min', 'Full Upper'],
  }),
];

// ═══════════════════════════════════════════════════════════════════════════════
// 2. MOVEMENT PREP FLOWS
// ═══════════════════════════════════════════════════════════════════════════════

const MOVEMENT_PREP_FLOWS: Flow[] = [
  flow({
    id: 'prep-lower-sprint', slug: 'lower-sprint-prep', title: 'Lower Body / Sprint Prep', shortTitle: 'Sprint Prep',
    category: 'movement_prep', subcategory: 'sprint',
    purpose: 'Activate glutes, prep tendons, and prime the CNS for sprinting or lower body training.',
    description: 'A 6-minute prep flow: mobility → activation → elastic/CNS prep.',
    athleteDescription: 'Get your lower body ready to sprint, lift, or jump.',
    durationMinutes: 6, intensity: 'moderate', difficulty: 'beginner',
    seasonTags: ['offseason', 'preseason', 'inseason'], archetypeTags: ['static', 'spring', 'hybrid'],
    positionTags: ['outfielder', 'infielder', 'catcher'],
    dayTypeTags: ['lower', 'speed', 'power'], deficiencyTags: ['elastic_stiffness', 'bracing', 'single_leg_stability'],
    intentTags: ['activation', 'cns_prep', 'tendon_prep', 'sprint_prep'],
    bodyRegionTags: ['hip', 'ankle', 'trunk', 'posterior_chain'], readinessTags: ['green', 'yellow'],
    whenToUse: 'Before lower body lifts, sprint sessions, or speed work.',
    beforeOrAfterTraining: 'before', ageGroup: 'all', equipmentNeeded: ['wall', 'mini band'], spaceNeeded: 'moderate',
    drills: [
      { drillId: 'spiderman-hamstring', sequenceOrder: 1, reps: 5, optional: false, transitionNote: 'Quick mobility lead-in.' },
      { drillId: 'dead-bug', sequenceOrder: 2, reps: 8, optional: false },
      { drillId: 'lateral-band-walk', sequenceOrder: 3, reps: 10, optional: false },
      { drillId: 'wall-sprint-iso', sequenceOrder: 4, timeSec: 10, optional: false },
      { drillId: 'pogos', sequenceOrder: 5, reps: 15, optional: false },
      { drillId: 'a-skip', sequenceOrder: 6, reps: 2, optional: false },
    ],
    assignment: {
      priorityScore: 9, primaryUseCase: 'Pre-sprint or pre-lower-lift activation',
      bestFor: ['all archetypes', 'sprint days', 'lower body days'],
      recommendedFrequency: '3–5x/week', minimumEffectiveDose: 'Every sprint/lower session',
    },
    sortOrder: 1, featured: true, quickAssign: true, badges: ['All Movers', '6 min', 'Sprint Prep'],
  }),

  flow({
    id: 'prep-rotation', slug: 'rotation-prep', title: 'Rotation Prep Flow', shortTitle: 'Rotation Prep',
    category: 'movement_prep', subcategory: 'rotation',
    purpose: 'Prepare the rotational system for hitting, throwing, or rotational power work.',
    description: 'A 6-minute prep flow targeting pelvis-ribcage separation, T-spine access, and rotational patterning.',
    athleteDescription: 'Get your rotation ready before you swing or throw.',
    durationMinutes: 6, intensity: 'moderate', difficulty: 'beginner',
    seasonTags: ['offseason', 'preseason', 'inseason'], archetypeTags: ['static', 'spring', 'hybrid'],
    positionTags: ['outfielder', 'infielder', 'catcher'],
    dayTypeTags: ['rotation', 'throwing', 'upper', 'power'], deficiencyTags: ['separation', 't_spine_rotation', 'rib_pelvis_control'],
    intentTags: ['rotation_prep', 'control', 'cns_prep'],
    bodyRegionTags: ['pelvis', 'ribcage', 't_spine', 'trunk'], readinessTags: ['green', 'yellow'],
    whenToUse: 'Before hitting, throwing, or rotational power training.',
    beforeOrAfterTraining: 'before', ageGroup: 'all', equipmentNeeded: [], spaceNeeded: 'moderate',
    drills: [
      { drillId: 'quadruped-t-spine-rotation', sequenceOrder: 1, reps: 8, optional: false },
      { drillId: 'pelvis-only-rotation', sequenceOrder: 2, reps: 8, optional: false },
      { drillId: 'rib-only-rotation', sequenceOrder: 3, reps: 8, optional: false },
      { drillId: 'separation-drill', sequenceOrder: 4, reps: 6, optional: false },
      { drillId: 'side-bend-rotate', sequenceOrder: 5, reps: 6, optional: false },
    ],
    assignment: {
      priorityScore: 9, primaryUseCase: 'Pre-hitting / pre-throwing rotation prep',
      bestFor: ['all archetypes', 'rotation days', 'poor separation'],
      recommendedFrequency: '3–5x/week', minimumEffectiveDose: 'Every rotation session',
    },
    sortOrder: 2, featured: true, quickAssign: true, badges: ['All Movers', '6 min', 'Rotation'],
  }),

  flow({
    id: 'prep-elastic', slug: 'elastic-prep', title: 'Elastic / Jump Prep Flow', shortTitle: 'Elastic Prep',
    category: 'movement_prep', subcategory: 'elastic',
    purpose: 'Prime tendons, elastic system, and CNS for plyometrics, jumping, or power work.',
    description: 'A 5-minute elastic prep targeting ankle stiffness, reactive ability, and CNS activation.',
    athleteDescription: 'Wake up your elastic system before you jump, sprint, or do power work.',
    durationMinutes: 5, intensity: 'moderate', difficulty: 'beginner',
    seasonTags: ['offseason', 'preseason', 'inseason'], archetypeTags: ['static', 'spring', 'hybrid'],
    positionTags: ['outfielder', 'infielder', 'catcher'],
    dayTypeTags: ['power', 'speed'], deficiencyTags: ['elastic_stiffness', 'decel_control'],
    intentTags: ['elasticity', 'tendon_prep', 'cns_prep'],
    bodyRegionTags: ['ankle', 'hip', 'trunk'], readinessTags: ['green'],
    whenToUse: 'Before plyometrics, jumping, or power training.',
    beforeOrAfterTraining: 'before', ageGroup: 'all', equipmentNeeded: [], spaceNeeded: 'moderate',
    drills: [
      { drillId: 'pogos', sequenceOrder: 1, reps: 15, optional: false },
      { drillId: 'line-hops', sequenceOrder: 2, reps: 10, optional: false },
      { drillId: 'dribbles', sequenceOrder: 3, timeSec: 10, optional: false },
      { drillId: 'snap-downs', sequenceOrder: 4, reps: 5, optional: false },
    ],
    assignment: {
      priorityScore: 8, primaryUseCase: 'Pre-plyo / pre-power elastic prep',
      bestFor: ['power days', 'spring movers needing stiffness work', 'jump prep'],
      recommendedFrequency: '2–4x/week', minimumEffectiveDose: 'Every power session',
    },
    sortOrder: 3, badges: ['5 min', 'Elastic'],
  }),

  flow({
    id: 'prep-throwing', slug: 'throwing-prep', title: 'Throwing Prep Flow', shortTitle: 'Throw Prep',
    category: 'movement_prep', subcategory: 'throwing',
    purpose: 'Prepare shoulders, T-spine, and rotational chain for throwing.',
    description: 'A 7-minute flow combining shoulder mobility, scapular activation, and rotational patterning for throwing.',
    athleteDescription: 'Get your arm and rotation ready before you throw.',
    durationMinutes: 7, intensity: 'moderate', difficulty: 'beginner',
    seasonTags: ['offseason', 'preseason', 'inseason'], archetypeTags: ['static', 'spring', 'hybrid'],
    positionTags: ['outfielder', 'infielder', 'catcher'],
    dayTypeTags: ['throwing', 'upper'], deficiencyTags: ['scap_control', 't_spine_rotation', 'separation'],
    intentTags: ['throwing_prep', 'rotation_prep', 'activation'],
    bodyRegionTags: ['shoulder', 't_spine', 'ribcage', 'pelvis'], readinessTags: ['green', 'yellow'],
    whenToUse: 'Before any throwing session.',
    beforeOrAfterTraining: 'before', ageGroup: 'all', equipmentNeeded: ['dowel or PVC pipe'], spaceNeeded: 'moderate',
    drills: [
      { drillId: 'overhead-dowel-dislocates', sequenceOrder: 1, reps: 10, optional: false },
      { drillId: 'scap-wall-slides', sequenceOrder: 2, reps: 10, optional: false },
      { drillId: 'quadruped-t-spine-rotation', sequenceOrder: 3, reps: 8, optional: false },
      { drillId: 'pelvis-only-rotation', sequenceOrder: 4, reps: 8, optional: false },
      { drillId: 'separation-drill', sequenceOrder: 5, reps: 6, optional: false },
    ],
    assignment: {
      priorityScore: 9, primaryUseCase: 'Pre-throwing arm and rotation prep',
      bestFor: ['all positions', 'throwing days', 'limited scap control'],
      recommendedFrequency: 'Every throwing session', minimumEffectiveDose: 'Every throwing session',
    },
    sortOrder: 4, featured: true, badges: ['7 min', 'Throw Prep'],
  }),

  flow({
    id: 'prep-upper', slug: 'upper-body-prep', title: 'Upper Body Prep Flow', shortTitle: 'Upper Prep',
    category: 'movement_prep', subcategory: 'upper',
    purpose: 'Activate scapular stabilizers, prep T-spine, and ready the upper body for pressing and pulling.',
    description: 'A 5-minute upper body prep: T-spine mobility → scapular activation → bracing.',
    athleteDescription: 'Get your upper body ready to lift.',
    durationMinutes: 5, intensity: 'moderate', difficulty: 'beginner',
    seasonTags: ['offseason', 'preseason', 'inseason'], archetypeTags: ['static', 'spring', 'hybrid'],
    positionTags: ['outfielder', 'infielder', 'catcher'],
    dayTypeTags: ['upper'], deficiencyTags: ['scap_control', 'bracing'],
    intentTags: ['activation', 'control'],
    bodyRegionTags: ['shoulder', 't_spine', 'trunk'], readinessTags: ['green', 'yellow'],
    whenToUse: 'Before upper body lifting.',
    beforeOrAfterTraining: 'before', ageGroup: 'all', equipmentNeeded: ['wall'], spaceNeeded: 'minimal',
    drills: [
      { drillId: 'cat-cow', sequenceOrder: 1, reps: 8, optional: false },
      { drillId: 'thread-the-needle', sequenceOrder: 2, reps: 8, optional: false },
      { drillId: 'scap-wall-slides', sequenceOrder: 3, reps: 10, optional: false },
      { drillId: 'dead-bug', sequenceOrder: 4, reps: 8, optional: false },
    ],
    assignment: {
      priorityScore: 8, primaryUseCase: 'Pre-upper-lift activation',
      bestFor: ['all archetypes', 'upper body days'],
      recommendedFrequency: 'Every upper session', minimumEffectiveDose: 'Every upper session',
    },
    sortOrder: 5, badges: ['5 min', 'Upper Prep'],
  }),

  flow({
    id: 'prep-decel-cod', slug: 'decel-cod-prep', title: 'Decel / COD Prep Flow', shortTitle: 'Decel Prep',
    category: 'movement_prep', subcategory: 'decel',
    purpose: 'Prepare the body for deceleration, braking, and change of direction demands.',
    description: 'A 6-minute prep flow targeting single-leg stability, braking mechanics, and lateral readiness.',
    athleteDescription: 'Get ready to stop, cut, and change direction safely.',
    durationMinutes: 6, intensity: 'moderate', difficulty: 'beginner',
    seasonTags: ['offseason', 'preseason', 'inseason'], archetypeTags: ['spring', 'hybrid'],
    positionTags: ['outfielder', 'infielder'],
    dayTypeTags: ['speed', 'power'], deficiencyTags: ['decel_control', 'single_leg_stability'],
    intentTags: ['control', 'tendon_prep', 'cns_prep'],
    bodyRegionTags: ['hip', 'ankle', 'pelvis'], readinessTags: ['green'],
    whenToUse: 'Before agility work, COD training, or speed sessions with lateral demands.',
    beforeOrAfterTraining: 'before', ageGroup: 'all', equipmentNeeded: ['mini band'], spaceNeeded: 'moderate',
    drills: [
      { drillId: 'lateral-band-walk', sequenceOrder: 1, reps: 10, optional: false },
      { drillId: 'split-squat-iso', sequenceOrder: 2, timeSec: 20, optional: false },
      { drillId: 'hip-airplanes', sequenceOrder: 3, reps: 5, optional: false },
      { drillId: 'snap-downs', sequenceOrder: 4, reps: 5, optional: false },
      { drillId: 'line-hops', sequenceOrder: 5, reps: 10, optional: false },
    ],
    assignment: {
      priorityScore: 7, primaryUseCase: 'Pre-agility / decel prep',
      bestFor: ['spring movers', 'poor decel control', 'speed days'],
      recommendedFrequency: '2–3x/week', minimumEffectiveDose: 'Every COD session',
    },
    sortOrder: 6, badges: ['6 min', 'Decel'],
  }),
];

// ═══════════════════════════════════════════════════════════════════════════════
// 3. YOGA / RECOVERY FLOWS
// ═══════════════════════════════════════════════════════════════════════════════

const YOGA_FLOWS: Flow[] = [
  flow({
    id: 'yoga-hips', slug: 'yoga-hip-flow', title: 'Hip Recovery Flow', shortTitle: 'Hip Recovery',
    category: 'yoga_flow', subcategory: 'hip',
    purpose: 'Release hip tension, restore IR/ER, and downregulate after training or competition.',
    description: 'A 10-minute breath-driven hip flow for recovery. Targets 90/90, pigeon, frog, hip flexors, adductors, and CARs.',
    athleteDescription: 'Release your hips. Breathe. Recover.',
    durationMinutes: 10, intensity: 'low', difficulty: 'beginner',
    seasonTags: ['offseason', 'preseason', 'inseason', 'postseason'], archetypeTags: ['static', 'spring', 'hybrid'],
    positionTags: ['outfielder', 'infielder', 'catcher'],
    dayTypeTags: ['recovery', 'ar_day', 'post_game', 'post_lift', 'red_readiness'],
    deficiencyTags: ['hip_ir', 'hip_er', 'adductor_strength'], intentTags: ['recovery', 'restoration', 'breathing'],
    bodyRegionTags: ['hip', 'pelvis', 'adductor'], readinessTags: ['green', 'yellow', 'red'],
    whenToUse: 'AR days, post-game, post-lift cooldown, red readiness days.',
    beforeOrAfterTraining: 'after', ageGroup: 'all', equipmentNeeded: [], spaceNeeded: 'minimal',
    breathingPrescription: '4 seconds in through nose, 8 seconds out through mouth. Long exhales to activate recovery.',
    drills: [
      { drillId: '90-90-transitions', sequenceOrder: 1, reps: 6, optional: false, coachingCueOverride: 'Slow and controlled. Recovery pace.' },
      { drillId: 'pigeon-stretch', sequenceOrder: 2, timeSec: 45, optional: false },
      { drillId: 'frog-stretch', sequenceOrder: 3, timeSec: 30, optional: false },
      { drillId: 'hip-flexor-stretch', sequenceOrder: 4, timeSec: 30, optional: false },
      { drillId: 'adductor-rockbacks', sequenceOrder: 5, reps: 8, optional: false },
      { drillId: 'deep-squat-pry', sequenceOrder: 6, timeSec: 30, optional: false },
      { drillId: 'hip-cars', sequenceOrder: 7, reps: 5, optional: true },
    ],
    assignment: {
      priorityScore: 8, primaryUseCase: 'Post-training hip recovery',
      bestFor: ['all archetypes', 'AR days', 'post-game', 'catchers'],
      recommendedFrequency: '3–4x/week', minimumEffectiveDose: '2x/week',
    },
    sortOrder: 1, featured: true, badges: ['10 min', 'Recovery', 'Hip'],
  }),

  flow({
    id: 'yoga-tspine-shoulder', slug: 'yoga-tspine-shoulder', title: 'T-Spine / Shoulder Recovery', shortTitle: 'Upper Recovery',
    category: 'yoga_flow', subcategory: 'upper',
    purpose: 'Release upper back and shoulder tension. Restore rotation and overhead range.',
    description: 'An 8-minute upper body recovery flow targeting T-spine, ribcage, and shoulder restoration.',
    athleteDescription: 'Release your upper body. Open your back and shoulders.',
    durationMinutes: 8, intensity: 'low', difficulty: 'beginner',
    seasonTags: ['offseason', 'preseason', 'inseason', 'postseason'], archetypeTags: ['static', 'spring', 'hybrid'],
    positionTags: ['outfielder', 'infielder', 'catcher'],
    dayTypeTags: ['recovery', 'ar_day', 'post_lift', 'post_game'],
    deficiencyTags: ['t_spine_rotation', 'scap_control'], intentTags: ['recovery', 'restoration', 'breathing'],
    bodyRegionTags: ['t_spine', 'shoulder', 'ribcage'], readinessTags: ['green', 'yellow', 'red'],
    whenToUse: 'After upper body training, throwing, or on recovery days.',
    beforeOrAfterTraining: 'after', ageGroup: 'all', equipmentNeeded: ['kettlebell'], spaceNeeded: 'minimal',
    drills: [
      { drillId: 'thread-the-needle', sequenceOrder: 1, reps: 8, optional: false },
      { drillId: 'quadruped-t-spine-rotation', sequenceOrder: 2, reps: 8, optional: false },
      { drillId: 'kb-arm-bar', sequenceOrder: 3, timeSec: 30, optional: false },
      { drillId: 'scap-wall-slides', sequenceOrder: 4, reps: 10, optional: false },
      { drillId: 'bear-roll', sequenceOrder: 5, reps: 5, optional: false },
      { drillId: 'side-lying-chest-stretch', sequenceOrder: 6, timeSec: 30, optional: false },
      { drillId: 'overhead-reach-breathing', sequenceOrder: 7, breaths: 5, optional: false },
    ],
    assignment: {
      priorityScore: 7, primaryUseCase: 'Post-upper / post-throw recovery',
      bestFor: ['throwers', 'upper body days', 'limited T-spine'],
      recommendedFrequency: '2–3x/week', minimumEffectiveDose: '2x/week',
    },
    sortOrder: 2, badges: ['8 min', 'Recovery', 'Upper'],
  }),

  flow({
    id: 'yoga-posterior', slug: 'yoga-posterior-chain', title: 'Hamstring / Posterior Chain Flow', shortTitle: 'Posterior Recovery',
    category: 'yoga_flow', subcategory: 'posterior',
    purpose: 'Release hamstrings, glutes, and posterior chain. Restore length after sprinting or deadlifting.',
    description: 'An 8-minute posterior chain recovery flow.',
    athleteDescription: 'Release your hamstrings and posterior chain after heavy training.',
    durationMinutes: 8, intensity: 'low', difficulty: 'beginner',
    seasonTags: ['offseason', 'preseason', 'inseason'], archetypeTags: ['static', 'spring', 'hybrid'],
    positionTags: ['outfielder', 'infielder', 'catcher'],
    dayTypeTags: ['post_lift', 'recovery', 'ar_day'], deficiencyTags: ['postural_control'],
    intentTags: ['recovery', 'restoration'], bodyRegionTags: ['hamstring', 'posterior_chain', 'hip'],
    readinessTags: ['green', 'yellow', 'red'],
    whenToUse: 'After deadlifts, sprints, or on recovery days.',
    beforeOrAfterTraining: 'after', ageGroup: 'all', equipmentNeeded: [], spaceNeeded: 'minimal',
    drills: [
      { drillId: 'jefferson-curl', sequenceOrder: 1, reps: 5, optional: false },
      { drillId: 'spiderman-hamstring', sequenceOrder: 2, reps: 5, optional: false },
      { drillId: 'rdl-reach', sequenceOrder: 3, reps: 6, optional: false },
      { drillId: 'glute-bridge', sequenceOrder: 4, reps: 10, optional: false },
      { drillId: 'dead-bug', sequenceOrder: 5, reps: 8, optional: false },
      { drillId: 'forward-fold-breathing', sequenceOrder: 6, breaths: 5, optional: false },
    ],
    assignment: {
      priorityScore: 7, primaryUseCase: 'Post-deadlift / post-sprint posterior chain recovery',
      bestFor: ['all archetypes', 'post-lower', 'post-sprint'],
      recommendedFrequency: '2–3x/week', minimumEffectiveDose: '1–2x/week',
    },
    sortOrder: 3, badges: ['8 min', 'Recovery', 'Posterior'],
  }),

  flow({
    id: 'yoga-rotation', slug: 'yoga-rotation-flow', title: 'Rotation Recovery Flow', shortTitle: 'Rotation Recovery',
    category: 'yoga_flow', subcategory: 'rotation',
    purpose: 'Restore rotational range and release tension after hitting, throwing, or rotational power work.',
    description: 'A 10-minute baseball-specific rotational recovery flow.',
    athleteDescription: 'Release rotational tension after swinging and throwing.',
    durationMinutes: 10, intensity: 'low', difficulty: 'beginner',
    seasonTags: ['inseason', 'preseason', 'offseason'], archetypeTags: ['static', 'spring', 'hybrid'],
    positionTags: ['outfielder', 'infielder', 'catcher'],
    dayTypeTags: ['post_game', 'recovery', 'ar_day', 'rotation'],
    deficiencyTags: ['separation', 't_spine_rotation', 'rib_pelvis_control'],
    intentTags: ['recovery', 'restoration', 'rotation_prep'],
    bodyRegionTags: ['pelvis', 'ribcage', 't_spine', 'hip'], readinessTags: ['green', 'yellow', 'red'],
    whenToUse: 'After games, after hitting sessions, or on recovery days.',
    beforeOrAfterTraining: 'after', ageGroup: 'all', equipmentNeeded: ['medicine ball'], spaceNeeded: 'moderate',
    drills: [
      { drillId: '90-90-transitions', sequenceOrder: 1, reps: 6, optional: false },
      { drillId: 'open-books', sequenceOrder: 2, reps: 8, optional: false },
      { drillId: 'rib-only-rotation', sequenceOrder: 3, reps: 8, optional: false },
      { drillId: 'side-bend-rotate', sequenceOrder: 4, reps: 6, optional: false },
      { drillId: 'step-behind-rotation', sequenceOrder: 5, reps: 6, optional: false },
      { drillId: 'med-ball-dry-rotations', sequenceOrder: 6, reps: 6, optional: true },
      { drillId: 'float-fire', sequenceOrder: 7, reps: 5, optional: true },
    ],
    assignment: {
      priorityScore: 8, primaryUseCase: 'Post-game / post-hitting rotational recovery',
      bestFor: ['all archetypes', 'post-game', 'high rotation volume'],
      recommendedFrequency: '2–4x/week', minimumEffectiveDose: 'After every game',
    },
    sortOrder: 4, featured: true, badges: ['10 min', 'Recovery', 'Rotation'],
  }),

  flow({
    id: 'yoga-full-recovery', slug: 'full-recovery-flow', title: 'Full Recovery Flow', shortTitle: 'Full Recovery',
    category: 'yoga_flow', subcategory: 'full',
    purpose: 'Complete nervous system downregulation and full-body restoration.',
    description: 'A 10-minute breath-driven recovery flow for total restoration.',
    athleteDescription: 'Full body reset. Breathe, stretch, and recover.',
    durationMinutes: 10, intensity: 'low', difficulty: 'beginner',
    seasonTags: ['offseason', 'preseason', 'inseason', 'postseason'], archetypeTags: ['static', 'spring', 'hybrid'],
    positionTags: ['outfielder', 'infielder', 'catcher'],
    dayTypeTags: ['recovery', 'ar_day', 'red_readiness', 'post_game'],
    deficiencyTags: ['postural_control', 'hip_ir', 't_spine_rotation', 'bracing'],
    intentTags: ['recovery', 'restoration', 'breathing'],
    bodyRegionTags: ['hip', 't_spine', 'hamstring', 'trunk'], readinessTags: ['green', 'yellow', 'red'],
    whenToUse: 'AR days, red readiness, post-game, or before sleep.',
    beforeOrAfterTraining: 'standalone', ageGroup: 'all', equipmentNeeded: [], spaceNeeded: 'minimal',
    breathingPrescription: '4 seconds in through nose, 8 seconds out through mouth. Emphasis on long exhales.',
    drills: [
      { drillId: '90-90-breathing', sequenceOrder: 1, breaths: 8, optional: false },
      { drillId: 'cat-cow', sequenceOrder: 2, reps: 8, optional: false },
      { drillId: 'thread-the-needle', sequenceOrder: 3, reps: 8, optional: false },
      { drillId: 'pigeon-stretch', sequenceOrder: 4, timeSec: 45, optional: false },
      { drillId: 'deep-squat-hold', sequenceOrder: 5, timeSec: 30, optional: false },
      { drillId: 'forward-fold', sequenceOrder: 6, breaths: 5, optional: false },
      { drillId: 'box-breathing', sequenceOrder: 7, breaths: 6, optional: false },
    ],
    assignment: {
      priorityScore: 9, primaryUseCase: 'Full nervous system recovery',
      bestFor: ['all archetypes', 'red readiness', 'post-game', 'AR days'],
      recommendedFrequency: '2–4x/week', minimumEffectiveDose: 'After every game + AR days',
      coachAssignmentNotes: 'Non-negotiable for in-season athletes. This is where recovery starts.',
    },
    sortOrder: 5, featured: true, quickAssign: true, badges: ['10 min', 'Recovery', 'Full Body'],
  }),

  flow({
    id: 'yoga-post-game', slug: 'post-game-recovery', title: 'Post-Game Recovery Flow', shortTitle: 'Post-Game',
    category: 'yoga_flow', subcategory: 'post_game',
    purpose: 'Bring the body out of fight-or-flight after competition. Begin the recovery process.',
    description: 'A 7-minute post-game flow: breathing → hip release → spinal decompression → downregulation.',
    athleteDescription: 'Come down from the game. Start recovery tonight.',
    durationMinutes: 7, intensity: 'low', difficulty: 'beginner',
    seasonTags: ['inseason', 'postseason'], archetypeTags: ['static', 'spring', 'hybrid'],
    positionTags: ['outfielder', 'infielder', 'catcher'],
    dayTypeTags: ['post_game'], deficiencyTags: ['postural_control', 'hip_ir'],
    intentTags: ['recovery', 'restoration', 'breathing'],
    bodyRegionTags: ['hip', 't_spine', 'trunk'], readinessTags: ['green', 'yellow', 'red'],
    whenToUse: 'Within 1 hour after games. Can also be done before sleep.',
    beforeOrAfterTraining: 'after', ageGroup: 'all', equipmentNeeded: [], spaceNeeded: 'minimal',
    breathingPrescription: '4 seconds in, 8 seconds out. Parasympathetic activation.',
    drills: [
      { drillId: 'childs-pose', sequenceOrder: 1, breaths: 8, optional: false },
      { drillId: 'cat-cow', sequenceOrder: 2, reps: 8, optional: false },
      { drillId: '90-90-transitions', sequenceOrder: 3, reps: 6, optional: false },
      { drillId: 'pigeon-stretch', sequenceOrder: 4, timeSec: 30, optional: false },
      { drillId: 'forward-fold', sequenceOrder: 5, breaths: 5, optional: false },
      { drillId: 'box-breathing', sequenceOrder: 6, breaths: 6, optional: false },
    ],
    assignment: {
      priorityScore: 10, primaryUseCase: 'Post-game recovery',
      bestFor: ['all athletes after competition'],
      recommendedFrequency: 'After every game', minimumEffectiveDose: 'After every game',
    },
    sortOrder: 6, quickAssign: true, badges: ['7 min', 'Post-Game'],
  }),

  flow({
    id: 'yoga-post-lift', slug: 'post-lift-regen', title: 'Post-Lift Regen Flow', shortTitle: 'Post-Lift',
    category: 'yoga_flow', subcategory: 'post_lift',
    purpose: 'Restore range and downregulate after lifting sessions.',
    description: 'A 5-minute post-lift flow targeting the areas most affected by training.',
    athleteDescription: 'Cool down after your lift. Restore what you just trained.',
    durationMinutes: 5, intensity: 'low', difficulty: 'beginner',
    seasonTags: ['offseason', 'preseason', 'inseason'], archetypeTags: ['static', 'spring', 'hybrid'],
    positionTags: ['outfielder', 'infielder', 'catcher'],
    dayTypeTags: ['post_lift'], deficiencyTags: ['hip_ir', 'postural_control'],
    intentTags: ['recovery', 'restoration'],
    bodyRegionTags: ['hip', 'hamstring', 't_spine'], readinessTags: ['green', 'yellow'],
    whenToUse: 'Immediately after any lifting session.',
    beforeOrAfterTraining: 'after', ageGroup: 'all', equipmentNeeded: [], spaceNeeded: 'minimal',
    drills: [
      { drillId: 'childs-pose', sequenceOrder: 1, breaths: 5, optional: false },
      { drillId: 'downward-dog', sequenceOrder: 2, breaths: 5, optional: false },
      { drillId: 'pigeon-stretch', sequenceOrder: 3, timeSec: 30, optional: false },
      { drillId: 'forward-fold-breathing', sequenceOrder: 4, breaths: 5, optional: false },
    ],
    assignment: {
      priorityScore: 7, primaryUseCase: 'Post-lift cooldown',
      bestFor: ['all archetypes', 'after lifting'],
      recommendedFrequency: 'After every lift', minimumEffectiveDose: 'After every lift',
    },
    sortOrder: 7, badges: ['5 min', 'Post-Lift'],
  }),

  flow({
    id: 'yoga-breathing-reset', slug: 'breathing-reset', title: 'Breathing / Downregulation Flow', shortTitle: 'Breathing Reset',
    category: 'yoga_flow', subcategory: 'breathing',
    purpose: 'Activate parasympathetic nervous system. Pure downregulation and recovery.',
    description: 'A 5-minute breathing-only flow for nervous system reset.',
    athleteDescription: 'Breathe. Reset. Recover. Nothing else.',
    durationMinutes: 5, intensity: 'low', difficulty: 'beginner',
    seasonTags: ['offseason', 'preseason', 'inseason', 'postseason'], archetypeTags: ['static', 'spring', 'hybrid'],
    positionTags: ['outfielder', 'infielder', 'catcher'],
    dayTypeTags: ['recovery', 'ar_day', 'red_readiness', 'post_game'],
    deficiencyTags: ['bracing', 'rib_pelvis_control'], intentTags: ['breathing', 'restoration', 'recovery'],
    bodyRegionTags: ['ribcage', 'trunk'], readinessTags: ['green', 'yellow', 'red'],
    whenToUse: 'Anytime. Before sleep. Red readiness days. Between sessions.',
    beforeOrAfterTraining: 'standalone', ageGroup: 'all', equipmentNeeded: ['wall'], spaceNeeded: 'minimal',
    drills: [
      { drillId: '90-90-breathing', sequenceOrder: 1, breaths: 8, optional: false },
      { drillId: 'childs-pose', sequenceOrder: 2, breaths: 8, optional: false },
      { drillId: 'box-breathing', sequenceOrder: 3, breaths: 8, optional: false },
    ],
    assignment: {
      priorityScore: 8, primaryUseCase: 'Nervous system downregulation',
      bestFor: ['red readiness', 'before sleep', 'between sessions', 'anxious athletes'],
      recommendedFrequency: 'Daily if needed', minimumEffectiveDose: '2x/week',
    },
    sortOrder: 8, quickAssign: true, badges: ['5 min', 'Breathing'],
  }),
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMBINED EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export const FLOWS: Flow[] = [
  ...MOBILITY_FLOWS,
  ...MOVEMENT_PREP_FLOWS,
  ...YOGA_FLOWS,
];

/** Get a flow by ID */
export function getFlow(id: string): Flow | undefined {
  return FLOWS.find((f) => f.id === id);
}

/** Get all flows for a category */
export function getFlowsByCategory(category: string): Flow[] {
  return FLOWS.filter((f) => f.category === category && f.active);
}

/** Get flows matching multiple tag filters */
export function filterFlows(filters: {
  category?: string;
  archetype?: string;
  season?: string;
  dayType?: string;
  deficiency?: string;
  intent?: string;
  readiness?: string;
}): Flow[] {
  return FLOWS.filter((f) => {
    if (!f.active) return false;
    if (filters.category && f.category !== filters.category) return false;
    if (filters.archetype && !f.archetypeTags.includes(filters.archetype as any)) return false;
    if (filters.season && !f.seasonTags.includes(filters.season as any)) return false;
    if (filters.dayType && !f.dayTypeTags.includes(filters.dayType as any)) return false;
    if (filters.deficiency && !f.deficiencyTags.includes(filters.deficiency as any)) return false;
    if (filters.intent && !f.intentTags.includes(filters.intent as any)) return false;
    if (filters.readiness && !f.readinessTags.includes(filters.readiness as any)) return false;
    return true;
  });
}

/** Get featured flows */
export function getFeaturedFlows(): Flow[] {
  return FLOWS.filter((f) => f.active && f.featured);
}

/** Get quick-assign flows */
export function getQuickAssignFlows(): Flow[] {
  return FLOWS.filter((f) => f.active && f.quickAssign);
}
