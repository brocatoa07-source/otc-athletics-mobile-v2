/**
 * Mobility Vault — Complete Shared Drill Library
 *
 * Every drill referenced by any flow lives here.
 * Drills are keyed by ID for O(1) lookup.
 */

import type { Drill } from './types';

export const DRILL_LIBRARY: Record<string, Drill> = {

  // ═══════════════════════════════════════════════════════════════════════════
  // HIP MOBILITY
  // ═══════════════════════════════════════════════════════════════════════════

  '90-90-transitions': {
    id: '90-90-transitions', slug: '90-90-transitions', title: '90/90 Transitions',
    drillType: 'mobilization', bodyRegionTags: ['hip', 'pelvis'], deficiencyTags: ['hip_ir', 'hip_er'],
    intentTags: ['joint_access'], defaultReps: 8, defaultSides: 2, timingUnit: 'reps', isBilateral: false,
    holdType: 'dynamic', coachingCue: 'Stay tall through the switch. Control the transition — no flopping.',
    athleteInstruction: 'Sit with both knees at 90°. Rotate to switch sides. Stay tall and control the movement.',
    coachNote: 'Watch for trunk collapse. If posture breaks, regress to static 90/90 holds.',
    equipmentNeeded: [], spaceNeeded: 'minimal', difficulty: 'beginner', active: true, media: [],
  },
  'pigeon-stretch': {
    id: 'pigeon-stretch', slug: 'pigeon-stretch', title: 'Pigeon Stretch',
    drillType: 'stretch', bodyRegionTags: ['hip', 'pelvis'], deficiencyTags: ['hip_er', 'hip_ir'],
    intentTags: ['joint_access', 'recovery'], defaultTimeSec: 30, defaultSides: 2, timingUnit: 'seconds', isBilateral: false,
    holdType: 'static_hold', coachingCue: 'Square the hips. Breathe into the stretch. Don\'t force depth.',
    athleteInstruction: 'Front shin across the body, back leg extended. Square your hips and lean forward. Hold and breathe.',
    equipmentNeeded: [], spaceNeeded: 'minimal', difficulty: 'beginner', active: true, media: [],
  },
  'frog-stretch': {
    id: 'frog-stretch', slug: 'frog-stretch', title: 'Frog Stretch',
    drillType: 'stretch', bodyRegionTags: ['hip', 'adductor'], deficiencyTags: ['hip_ir', 'adductor_strength'],
    intentTags: ['joint_access'], defaultTimeSec: 30, defaultSides: 1, timingUnit: 'seconds', isBilateral: true,
    holdType: 'oscillating', coachingCue: 'Rock gently forward and back. Keep the low back neutral.',
    athleteInstruction: 'On hands and knees, spread knees wide. Rock forward and back gently. Breathe into the inner thighs.',
    equipmentNeeded: [], spaceNeeded: 'minimal', difficulty: 'beginner', active: true, media: [],
  },
  'couch-stretch': {
    id: 'couch-stretch', slug: 'couch-stretch', title: 'Couch Stretch',
    drillType: 'stretch', bodyRegionTags: ['hip', 'pelvis'], deficiencyTags: ['hip_ir', 'bracing'],
    intentTags: ['joint_access'], defaultTimeSec: 30, defaultSides: 2, timingUnit: 'seconds', isBilateral: false,
    holdType: 'static_hold', coachingCue: 'Tuck the pelvis. Squeeze the glute. Don\'t arch the low back.',
    athleteInstruction: 'Rear foot elevated on a wall or bench. Tall torso, squeeze back glute, tuck hips under.',
    equipmentNeeded: ['wall or bench'], spaceNeeded: 'minimal', difficulty: 'intermediate', active: true, media: [],
  },
  'hip-flexor-stretch': {
    id: 'hip-flexor-stretch', slug: 'hip-flexor-stretch', title: 'Half-Kneeling Hip Flexor',
    drillType: 'stretch', bodyRegionTags: ['hip', 'pelvis'], deficiencyTags: ['hip_ir', 'bracing'],
    intentTags: ['joint_access', 'recovery'], defaultTimeSec: 30, defaultSides: 2, timingUnit: 'seconds', isBilateral: false,
    holdType: 'static_hold', coachingCue: 'Tuck pelvis. Squeeze glute. Don\'t arch low back.',
    athleteInstruction: 'Kneel on one knee. Squeeze back-side glute, tuck hips under. Hold and breathe.',
    equipmentNeeded: [], spaceNeeded: 'minimal', difficulty: 'beginner', active: true, media: [],
  },
  'adductor-rockbacks': {
    id: 'adductor-rockbacks', slug: 'adductor-rockbacks', title: 'Adductor Rockbacks',
    drillType: 'mobilization', bodyRegionTags: ['hip', 'adductor'], deficiencyTags: ['hip_ir', 'adductor_strength'],
    intentTags: ['joint_access'], defaultReps: 8, defaultSides: 2, timingUnit: 'reps', isBilateral: false,
    holdType: 'dynamic', coachingCue: 'Sit back toward the heel. Keep the extended leg straight.',
    athleteInstruction: 'Half-kneeling, one leg extended to the side. Rock back toward your heel keeping the extended leg straight.',
    equipmentNeeded: [], spaceNeeded: 'minimal', difficulty: 'beginner', active: true, media: [],
  },
  'deep-squat-pry': {
    id: 'deep-squat-pry', slug: 'deep-squat-pry', title: 'Deep Squat Pry',
    drillType: 'mobilization', bodyRegionTags: ['hip', 'ankle', 'adductor'], deficiencyTags: ['hip_ir', 'ankle_df'],
    intentTags: ['joint_access'], defaultTimeSec: 30, defaultSides: 1, timingUnit: 'seconds', isBilateral: true,
    holdType: 'oscillating', coachingCue: 'Use elbows to push knees out. Keep chest tall.',
    athleteInstruction: 'Drop into a deep squat. Elbows inside knees, push knees outward. Breathe and settle.',
    equipmentNeeded: [], spaceNeeded: 'minimal', difficulty: 'beginner', active: true, media: [],
  },
  'hip-cars': {
    id: 'hip-cars', slug: 'hip-cars', title: 'Hip CARs',
    drillType: 'mobilization', bodyRegionTags: ['hip'], deficiencyTags: ['hip_ir', 'hip_er'],
    intentTags: ['joint_access', 'control'], defaultReps: 5, defaultSides: 2, timingUnit: 'reps', isBilateral: false,
    holdType: 'dynamic', coachingCue: 'Biggest circle possible. Control the entire range. No compensation.',
    athleteInstruction: 'On hands and knees, draw the biggest circle with your knee. Go slow. Control every inch.',
    equipmentNeeded: [], spaceNeeded: 'minimal', difficulty: 'intermediate', active: true, media: [],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ANKLE MOBILITY
  // ═══════════════════════════════════════════════════════════════════════════

  'knee-to-wall-ankle': {
    id: 'knee-to-wall-ankle', slug: 'knee-to-wall-ankle', title: 'Knee-to-Wall Ankle',
    drillType: 'mobilization', bodyRegionTags: ['ankle', 'foot_ankle'], deficiencyTags: ['ankle_df'],
    intentTags: ['joint_access'], defaultReps: 10, defaultSides: 2, timingUnit: 'reps', isBilateral: false,
    holdType: 'dynamic', coachingCue: 'Keep heel down. Drive knee over pinky toe.',
    athleteInstruction: 'Face a wall, foot a few inches back. Drive your knee toward the wall over your pinky toe. Keep heel down.',
    equipmentNeeded: ['wall'], spaceNeeded: 'minimal', difficulty: 'beginner', active: true, media: [],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // T-SPINE / SHOULDER MOBILITY
  // ═══════════════════════════════════════════════════════════════════════════

  'thread-the-needle': {
    id: 'thread-the-needle', slug: 'thread-the-needle', title: 'Thread the Needle',
    drillType: 'mobilization', bodyRegionTags: ['t_spine', 'shoulder'], deficiencyTags: ['t_spine_rotation'],
    intentTags: ['joint_access'], defaultReps: 8, defaultSides: 2, timingUnit: 'reps', isBilateral: false,
    holdType: 'dynamic', coachingCue: 'Rotate through the upper back, not the low back. Reach and open.',
    athleteInstruction: 'On hands and knees. Reach one arm under your body, then rotate open and reach toward the ceiling.',
    equipmentNeeded: [], spaceNeeded: 'minimal', difficulty: 'beginner', active: true, media: [],
  },
  'quadruped-t-spine-rotation': {
    id: 'quadruped-t-spine-rotation', slug: 'quadruped-t-spine-rotation', title: 'Quadruped T-Spine Rotation',
    drillType: 'mobilization', bodyRegionTags: ['t_spine', 'ribcage'], deficiencyTags: ['t_spine_rotation', 'separation'],
    intentTags: ['joint_access', 'rotation_prep'], defaultReps: 8, defaultSides: 2, timingUnit: 'reps', isBilateral: false,
    holdType: 'dynamic', coachingCue: 'Hand behind head. Rotate upper back only. Lock the hips.',
    athleteInstruction: 'On hands and knees, hand behind head. Rotate your elbow toward the floor, then toward the ceiling. Keep hips locked.',
    equipmentNeeded: [], spaceNeeded: 'minimal', difficulty: 'beginner', active: true, media: [],
  },
  'kb-arm-bar': {
    id: 'kb-arm-bar', slug: 'kb-arm-bar', title: 'KB Arm Bar',
    drillType: 'mobilization', bodyRegionTags: ['shoulder', 't_spine', 'ribcage'], deficiencyTags: ['t_spine_rotation', 'scap_control'],
    intentTags: ['joint_access', 'control'], defaultTimeSec: 30, defaultSides: 2, timingUnit: 'seconds', isBilateral: false,
    holdType: 'static_hold', coachingCue: 'Press the KB to the ceiling. Roll away from it. Breathe into the stretch.',
    athleteInstruction: 'Lie on your back with a KB pressed up. Roll to your side keeping the KB locked out overhead. Hold and breathe.',
    equipmentNeeded: ['kettlebell'], spaceNeeded: 'minimal', difficulty: 'intermediate', active: true, media: [],
  },
  'wall-overhead-reach': {
    id: 'wall-overhead-reach', slug: 'wall-overhead-reach', title: 'Wall Overhead Reach',
    drillType: 'mobilization', bodyRegionTags: ['shoulder', 't_spine'], deficiencyTags: ['scap_control', 't_spine_rotation'],
    intentTags: ['joint_access'], defaultReps: 8, defaultSides: 1, timingUnit: 'reps', isBilateral: true,
    holdType: 'dynamic', coachingCue: 'Ribs down. Reach tall. Don\'t arch the low back.',
    athleteInstruction: 'Face a wall, arms overhead on the wall. Slide hands up as high as possible keeping ribs down.',
    equipmentNeeded: ['wall'], spaceNeeded: 'minimal', difficulty: 'beginner', active: true, media: [],
  },
  'scap-wall-slides': {
    id: 'scap-wall-slides', slug: 'scap-wall-slides', title: 'Scap Wall Slides',
    drillType: 'activation', bodyRegionTags: ['shoulder', 't_spine'], deficiencyTags: ['scap_control'],
    intentTags: ['activation', 'control'], defaultReps: 10, defaultSides: 1, timingUnit: 'reps', isBilateral: true,
    holdType: 'dynamic', coachingCue: 'Keep entire back and arms against wall. Slide up and down with control.',
    athleteInstruction: 'Back against wall, arms at 90°. Slide arms up overhead keeping everything touching the wall.',
    equipmentNeeded: ['wall'], spaceNeeded: 'minimal', difficulty: 'beginner', active: true, media: [],
  },
  'overhead-dowel-dislocates': {
    id: 'overhead-dowel-dislocates', slug: 'overhead-dowel-dislocates', title: 'Overhead Dowel Dislocates',
    drillType: 'mobilization', bodyRegionTags: ['shoulder'], deficiencyTags: ['scap_control'],
    intentTags: ['joint_access'], defaultReps: 10, defaultSides: 1, timingUnit: 'reps', isBilateral: true,
    holdType: 'dynamic', coachingCue: 'Wide grip. Slow and controlled over the head and behind.',
    athleteInstruction: 'Hold a dowel with a wide grip. Slowly bring it overhead and behind your back. Return. Keep arms straight.',
    equipmentNeeded: ['dowel or PVC pipe'], spaceNeeded: 'minimal', difficulty: 'beginner', active: true, media: [],
  },
  'jefferson-curl': {
    id: 'jefferson-curl', slug: 'jefferson-curl', title: 'Jefferson Curl',
    drillType: 'mobilization', bodyRegionTags: ['hamstring', 'posterior_chain', 't_spine'],
    deficiencyTags: ['postural_control'], intentTags: ['joint_access'],
    defaultReps: 5, defaultSides: 1, timingUnit: 'reps', isBilateral: true,
    holdType: 'dynamic', tempo: 'slow',
    coachingCue: 'Roll down one vertebra at a time. Control the entire descent.',
    athleteInstruction: 'Stand tall. Tuck chin. Roll down through your spine one vertebra at a time. Reach toward toes. Roll back up.',
    coachNote: 'Start with bodyweight only. Never load this heavy. Focus on spinal segmental control.',
    equipmentNeeded: [], spaceNeeded: 'minimal', difficulty: 'intermediate', active: true, media: [],
  },
  'spiderman-hamstring': {
    id: 'spiderman-hamstring', slug: 'spiderman-hamstring', title: 'Spiderman → Hamstring',
    drillType: 'mobilization', bodyRegionTags: ['hip', 'hamstring', 't_spine', 'ankle'],
    deficiencyTags: ['hip_ir', 't_spine_rotation', 'ankle_df'], intentTags: ['joint_access', 'activation'],
    defaultReps: 5, defaultSides: 2, timingUnit: 'reps', isBilateral: false,
    holdType: 'flow_through', coachingCue: 'Lunge deep, elbow to instep, rotate and reach. Then straighten the front leg for hamstring.',
    athleteInstruction: 'Step into deep lunge. Drop elbow to instep. Rotate open. Then straighten your front leg to stretch the hamstring.',
    equipmentNeeded: [], spaceNeeded: 'moderate', difficulty: 'beginner', active: true, media: [],
  },
  'side-lying-chest-stretch': {
    id: 'side-lying-chest-stretch', slug: 'side-lying-chest-stretch', title: 'Side-Lying Chest Stretch',
    drillType: 'stretch', bodyRegionTags: ['shoulder', 't_spine', 'ribcage'], deficiencyTags: ['t_spine_rotation'],
    intentTags: ['joint_access', 'recovery'], defaultTimeSec: 30, defaultSides: 2, timingUnit: 'seconds', isBilateral: false,
    holdType: 'static_hold', coachingCue: 'Let the arm fall open. Breathe into the chest.',
    athleteInstruction: 'Lie on your side, top arm reaches behind you opening the chest. Let gravity do the work. Breathe.',
    equipmentNeeded: [], spaceNeeded: 'minimal', difficulty: 'beginner', active: true, media: [],
  },
  'bear-roll': {
    id: 'bear-roll', slug: 'bear-roll', title: 'Bear Roll',
    drillType: 'mobilization', bodyRegionTags: ['t_spine', 'shoulder', 'trunk'], deficiencyTags: ['t_spine_rotation', 'postural_control'],
    intentTags: ['joint_access', 'control'], defaultReps: 5, defaultSides: 2, timingUnit: 'reps', isBilateral: false,
    holdType: 'flow_through', coachingCue: 'Roll through the upper back. Keep the movement fluid.',
    athleteInstruction: 'From bear position, roll your body to one side opening toward the ceiling, then back. Alternate.',
    equipmentNeeded: [], spaceNeeded: 'minimal', difficulty: 'intermediate', active: true, media: [],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MOVEMENT PREP — ACTIVATION / CONTROL
  // ═══════════════════════════════════════════════════════════════════════════

  'pelvis-only-rotation': {
    id: 'pelvis-only-rotation', slug: 'pelvis-only-rotation', title: 'Pelvis-Only Rotation',
    drillType: 'activation', bodyRegionTags: ['pelvis', 'hip', 'trunk'], deficiencyTags: ['separation', 'rib_pelvis_control'],
    intentTags: ['control', 'rotation_prep'], defaultReps: 8, defaultSides: 2, timingUnit: 'reps', isBilateral: false,
    holdType: 'dynamic', coachingCue: 'Chest stays still. Only the pelvis moves. Feel the separation.',
    athleteInstruction: 'Stand tall. Keep your chest facing forward. Rotate only your hips left and right. Upper body doesn\'t move.',
    equipmentNeeded: [], spaceNeeded: 'minimal', difficulty: 'beginner', active: true, media: [],
  },
  'rib-only-rotation': {
    id: 'rib-only-rotation', slug: 'rib-only-rotation', title: 'Rib-Only Rotation',
    drillType: 'activation', bodyRegionTags: ['ribcage', 't_spine', 'trunk'], deficiencyTags: ['separation', 'rib_pelvis_control', 't_spine_rotation'],
    intentTags: ['control', 'rotation_prep'], defaultReps: 8, defaultSides: 2, timingUnit: 'reps', isBilateral: false,
    holdType: 'dynamic', coachingCue: 'Hips stay still. Only the ribcage rotates. Feel the separation.',
    athleteInstruction: 'Stand tall. Keep your hips facing forward. Rotate only your upper body left and right. Hips don\'t move.',
    equipmentNeeded: [], spaceNeeded: 'minimal', difficulty: 'beginner', active: true, media: [],
  },
  'separation-drill': {
    id: 'separation-drill', slug: 'separation-drill', title: 'Separation Drill',
    drillType: 'activation', bodyRegionTags: ['pelvis', 'ribcage', 'trunk'], deficiencyTags: ['separation', 'rib_pelvis_control'],
    intentTags: ['control', 'rotation_prep'], defaultReps: 6, defaultSides: 2, timingUnit: 'reps', isBilateral: false,
    holdType: 'dynamic', coachingCue: 'Pelvis goes one way, ribcage goes the other. Feel the wind-up.',
    athleteInstruction: 'Rotate your hips one direction while your upper body goes the other. Create the separation. Control it.',
    equipmentNeeded: [], spaceNeeded: 'minimal', difficulty: 'intermediate', active: true, media: [],
  },
  'side-bend-rotate': {
    id: 'side-bend-rotate', slug: 'side-bend-rotate', title: 'Side Bend → Rotate',
    drillType: 'mobilization', bodyRegionTags: ['ribcage', 't_spine', 'trunk'], deficiencyTags: ['t_spine_rotation', 'rib_pelvis_control'],
    intentTags: ['joint_access', 'rotation_prep'], defaultReps: 6, defaultSides: 2, timingUnit: 'reps', isBilateral: false,
    holdType: 'flow_through', coachingCue: 'Side bend first, then rotate through. Own each position.',
    athleteInstruction: 'Side bend to one side, then rotate your chest toward the ceiling. Return. Repeat.',
    equipmentNeeded: [], spaceNeeded: 'minimal', difficulty: 'intermediate', active: true, media: [],
  },
  'dead-bug': {
    id: 'dead-bug', slug: 'dead-bug', title: 'Dead Bug',
    drillType: 'activation', bodyRegionTags: ['trunk', 'ribcage', 'pelvis'], deficiencyTags: ['bracing', 'rib_pelvis_control'],
    intentTags: ['control', 'activation', 'breathing'], defaultReps: 8, defaultSides: 2, timingUnit: 'reps', isBilateral: false,
    holdType: 'dynamic', coachingCue: 'Exhale as you extend. Keep the low back pinned. No arching.',
    athleteInstruction: 'Lie on back, arms up, knees at 90°. Slowly extend one arm and opposite leg out. Return. Alternate.',
    coachNote: 'Foundation bracing drill. If they can\'t do this without arching, nothing else holds up.',
    equipmentNeeded: [], spaceNeeded: 'minimal', difficulty: 'beginner', active: true, media: [],
  },
  'bird-dog': {
    id: 'bird-dog', slug: 'bird-dog', title: 'Bird Dog',
    drillType: 'activation', bodyRegionTags: ['trunk', 'hip', 'shoulder'], deficiencyTags: ['bracing', 'postural_control', 'single_leg_stability'],
    intentTags: ['control', 'activation'], defaultReps: 8, defaultSides: 2, timingUnit: 'reps', isBilateral: false,
    holdType: 'dynamic', coachingCue: 'Opposite arm and leg extend. Don\'t let the hips rotate. Stay square.',
    athleteInstruction: 'On hands and knees. Extend opposite arm and leg. Hold 2 seconds. Return. Don\'t let hips shift.',
    equipmentNeeded: [], spaceNeeded: 'minimal', difficulty: 'beginner', active: true, media: [],
  },
  'hip-airplanes': {
    id: 'hip-airplanes', slug: 'hip-airplanes', title: 'Hip Airplanes',
    drillType: 'activation', bodyRegionTags: ['hip', 'pelvis'], deficiencyTags: ['single_leg_stability', 'hip_ir', 'hip_er'],
    intentTags: ['control', 'activation'], defaultReps: 5, defaultSides: 2, timingUnit: 'reps', isBilateral: false,
    holdType: 'dynamic', coachingCue: 'Single leg. Rotate the pelvis open and closed. Control the hip through full range.',
    athleteInstruction: 'Stand on one leg, slight hip hinge. Rotate your hips open, then closed. Keep balance. Move slowly.',
    equipmentNeeded: [], spaceNeeded: 'minimal', difficulty: 'intermediate', active: true, media: [],
  },
  'split-squat-iso': {
    id: 'split-squat-iso', slug: 'split-squat-iso', title: 'Split Squat Iso Hold',
    drillType: 'isometric', bodyRegionTags: ['hip', 'pelvis', 'posterior_chain'], deficiencyTags: ['single_leg_stability', 'decel_control'],
    intentTags: ['control', 'tendon_prep'], defaultTimeSec: 20, defaultSides: 2, timingUnit: 'seconds', isBilateral: false,
    holdType: 'static_hold', coachingCue: 'Sink low. Own the bottom. Don\'t shift or wobble.',
    athleteInstruction: 'Split stance, drop straight down. Hold at the bottom. Stay stable. Breathe.',
    equipmentNeeded: [], spaceNeeded: 'minimal', difficulty: 'beginner', active: true, media: [],
  },
  'wall-sprint-iso': {
    id: 'wall-sprint-iso', slug: 'wall-sprint-iso', title: 'Wall Sprint Iso Hold',
    drillType: 'isometric', bodyRegionTags: ['hip', 'ankle', 'trunk'], deficiencyTags: ['elastic_stiffness', 'bracing'],
    intentTags: ['cns_prep', 'sprint_prep', 'tendon_prep'], defaultTimeSec: 10, defaultSides: 2, timingUnit: 'seconds', isBilateral: false,
    holdType: 'static_hold', coachingCue: 'Full body lean. Drive knee to 90°. Toe dorsiflexed. Hold with intent.',
    athleteInstruction: 'Hands on wall at 45° angle. Drive one knee up to 90°. Hold the position with full body tension.',
    equipmentNeeded: ['wall'], spaceNeeded: 'minimal', difficulty: 'beginner', active: true, media: [],
  },

  // ── Elastic / CNS Prep ────────────────────────────────────────────────────

  'pogos': {
    id: 'pogos', slug: 'pogos', title: 'Pogos',
    drillType: 'plyometric_prep', bodyRegionTags: ['ankle', 'foot_ankle'], deficiencyTags: ['elastic_stiffness', 'ankle_df'],
    intentTags: ['elasticity', 'tendon_prep', 'cns_prep'], defaultReps: 15, defaultSides: 1, timingUnit: 'reps', isBilateral: true,
    holdType: 'dynamic', coachingCue: 'Stiff ankles. Quick ground contact. Bounce, don\'t absorb.',
    athleteInstruction: 'Small, quick bounces on the balls of your feet. Stay stiff through the ankles. Minimal ground time.',
    equipmentNeeded: [], spaceNeeded: 'minimal', difficulty: 'beginner', active: true, media: [],
  },
  'line-hops': {
    id: 'line-hops', slug: 'line-hops', title: 'Line Hops',
    drillType: 'plyometric_prep', bodyRegionTags: ['ankle', 'foot_ankle', 'hip'], deficiencyTags: ['elastic_stiffness'],
    intentTags: ['elasticity', 'tendon_prep', 'cns_prep'], defaultReps: 10, defaultSides: 1, timingUnit: 'reps', isBilateral: true,
    holdType: 'dynamic', coachingCue: 'Lateral hops over a line. Quick feet, stiff ankles.',
    athleteInstruction: 'Hop side to side over a line. Stay quick. Land light. Keep ankles stiff.',
    equipmentNeeded: [], spaceNeeded: 'minimal', difficulty: 'beginner', active: true, media: [],
  },
  'dribbles': {
    id: 'dribbles', slug: 'dribbles', title: 'Dribbles',
    drillType: 'plyometric_prep', bodyRegionTags: ['ankle', 'foot_ankle'], deficiencyTags: ['elastic_stiffness'],
    intentTags: ['elasticity', 'cns_prep'], defaultTimeSec: 10, defaultSides: 1, timingUnit: 'seconds', isBilateral: true,
    holdType: 'dynamic', coachingCue: 'Fast feet. Minimal ground contact. Stay on the balls of your feet.',
    athleteInstruction: 'Run in place with fast, tiny steps. Barely leave the ground. Stay on your toes.',
    equipmentNeeded: [], spaceNeeded: 'minimal', difficulty: 'beginner', active: true, media: [],
  },
  'snap-downs': {
    id: 'snap-downs', slug: 'snap-downs', title: 'Snap Downs',
    drillType: 'plyometric_prep', bodyRegionTags: ['hip', 'ankle', 'trunk'], deficiencyTags: ['decel_control', 'elastic_stiffness'],
    intentTags: ['cns_prep', 'elasticity', 'activation'], defaultReps: 5, defaultSides: 1, timingUnit: 'reps', isBilateral: true,
    holdType: 'dynamic', coachingCue: 'Snap from tall to athletic position. Stick the landing. Absorb cleanly.',
    athleteInstruction: 'Stand tall. Jump slightly, then snap your body down into an athletic stance. Stick it. Hold 1 second.',
    equipmentNeeded: [], spaceNeeded: 'minimal', difficulty: 'intermediate', active: true, media: [],
  },
  'a-skip': {
    id: 'a-skip', slug: 'a-skip', title: 'A-Skip',
    drillType: 'dynamic', bodyRegionTags: ['hip', 'ankle', 'posterior_chain'], deficiencyTags: ['elastic_stiffness'],
    intentTags: ['cns_prep', 'elasticity', 'sprint_prep'], defaultReps: 2, defaultSides: 1, timingUnit: 'reps', isBilateral: true,
    holdType: 'dynamic', tempo: 'rhythmic',
    coachingCue: 'Knee drive, toe up, strike the ground. Rhythm over speed.',
    athleteInstruction: 'Skip forward with high knees. Toe up, drive the knee, strike the ground underneath you. Stay tall.',
    equipmentNeeded: [], spaceNeeded: 'full', difficulty: 'beginner', active: true, media: [],
  },
  'block-leg-iso': {
    id: 'block-leg-iso', slug: 'block-leg-iso', title: 'Block-Leg Iso Hold',
    drillType: 'isometric', bodyRegionTags: ['hip', 'ankle', 'pelvis'], deficiencyTags: ['block_leg', 'decel_control', 'single_leg_stability'],
    intentTags: ['control', 'tendon_prep', 'throwing_prep'], defaultTimeSec: 15, defaultSides: 2, timingUnit: 'seconds', isBilateral: false,
    holdType: 'static_hold', coachingCue: 'Front leg locked out. Drive into the ground. Don\'t let the knee cave or drift.',
    athleteInstruction: 'Stride out like a pitcher. Lock the front leg straight and drive into the ground. Hold. Stay stable.',
    equipmentNeeded: [], spaceNeeded: 'moderate', difficulty: 'intermediate', active: true, media: [],
  },
  'hinge-holds': {
    id: 'hinge-holds', slug: 'hinge-holds', title: 'Hinge Holds',
    drillType: 'isometric', bodyRegionTags: ['hip', 'hamstring', 'posterior_chain'], deficiencyTags: ['bracing', 'postural_control'],
    intentTags: ['control', 'tendon_prep'], defaultTimeSec: 15, defaultSides: 1, timingUnit: 'seconds', isBilateral: true,
    holdType: 'static_hold', coachingCue: 'Push hips back. Flat back. Hamstrings loaded. Hold with tension.',
    athleteInstruction: 'Push your hips back like an RDL. Stop halfway. Hold with a flat back. Feel your hamstrings working.',
    equipmentNeeded: [], spaceNeeded: 'minimal', difficulty: 'beginner', active: true, media: [],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // YOGA / RECOVERY
  // ═══════════════════════════════════════════════════════════════════════════

  'cat-cow': {
    id: 'cat-cow', slug: 'cat-cow', title: 'Cat-Cow',
    drillType: 'mobilization', bodyRegionTags: ['t_spine', 'ribcage', 'pelvis'], deficiencyTags: ['t_spine_rotation', 'rib_pelvis_control', 'postural_control'],
    intentTags: ['joint_access', 'breathing', 'recovery'], defaultReps: 8, defaultSides: 1, timingUnit: 'reps', isBilateral: true,
    holdType: 'flow_through', coachingCue: 'Inhale to arch, exhale to round. Move through every vertebra.',
    athleteInstruction: 'On hands and knees. Inhale and arch your back. Exhale and round your back. Move slowly.',
    equipmentNeeded: [], spaceNeeded: 'minimal', difficulty: 'beginner', active: true, media: [],
  },
  'childs-pose': {
    id: 'childs-pose', slug: 'childs-pose', title: 'Child\'s Pose',
    drillType: 'stretch', bodyRegionTags: ['hip', 'shoulder', 'trunk'], deficiencyTags: ['hip_ir', 'postural_control'],
    intentTags: ['recovery', 'restoration', 'breathing'], defaultBreaths: 5, defaultSides: 1, timingUnit: 'breaths', isBilateral: true,
    holdType: 'static_hold', coachingCue: 'Breathe into the back of the ribcage. Melt into the floor.',
    athleteInstruction: 'Kneel, sit back on heels, reach arms forward. Breathe deeply into your back.',
    equipmentNeeded: [], spaceNeeded: 'minimal', difficulty: 'beginner', active: true, media: [],
  },
  'downward-dog': {
    id: 'downward-dog', slug: 'downward-dog', title: 'Downward Dog',
    drillType: 'stretch', bodyRegionTags: ['hamstring', 'shoulder', 'ankle', 'posterior_chain'],
    deficiencyTags: ['ankle_df', 'scap_control', 'postural_control'], intentTags: ['joint_access', 'recovery'],
    defaultBreaths: 5, defaultSides: 1, timingUnit: 'breaths', isBilateral: true,
    holdType: 'static_hold', coachingCue: 'Push floor away. Heels toward ground. Long spine.',
    athleteInstruction: 'Hands and feet on ground, hips high. Push chest toward thighs. Press heels down. Hold and breathe.',
    equipmentNeeded: [], spaceNeeded: 'minimal', difficulty: 'beginner', active: true, media: [],
  },
  'forward-fold': {
    id: 'forward-fold', slug: 'forward-fold', title: 'Forward Fold',
    drillType: 'stretch', bodyRegionTags: ['hamstring', 'posterior_chain'], deficiencyTags: ['postural_control'],
    intentTags: ['recovery', 'restoration', 'breathing'], defaultBreaths: 5, defaultSides: 1, timingUnit: 'breaths', isBilateral: true,
    holdType: 'static_hold', coachingCue: 'Let everything hang. Breathe into the hamstrings. No forcing.',
    athleteInstruction: 'Stand, fold forward. Let your head and arms hang. Breathe into the back of your legs. Relax.',
    equipmentNeeded: [], spaceNeeded: 'minimal', difficulty: 'beginner', active: true, media: [],
  },
  'glute-bridge': {
    id: 'glute-bridge', slug: 'glute-bridge', title: 'Glute Bridge',
    drillType: 'activation', bodyRegionTags: ['hip', 'pelvis', 'posterior_chain'], deficiencyTags: ['bracing', 'postural_control'],
    intentTags: ['activation', 'recovery'], defaultReps: 10, defaultSides: 1, timingUnit: 'reps', isBilateral: true,
    holdType: 'dynamic', coachingCue: 'Drive through the heels. Squeeze the glutes at the top. Don\'t hyperextend.',
    athleteInstruction: 'Lie on back, feet flat. Push hips up squeezing your glutes. Hold 2 seconds at top. Lower.',
    equipmentNeeded: [], spaceNeeded: 'minimal', difficulty: 'beginner', active: true, media: [],
  },
  'rdl-reach': {
    id: 'rdl-reach', slug: 'rdl-reach', title: 'RDL Reach',
    drillType: 'mobilization', bodyRegionTags: ['hamstring', 'hip', 'posterior_chain'], deficiencyTags: ['single_leg_stability', 'postural_control'],
    intentTags: ['activation', 'control'], defaultReps: 6, defaultSides: 2, timingUnit: 'reps', isBilateral: false,
    holdType: 'dynamic', coachingCue: 'Single leg hinge. Reach toward the floor. Keep hips square.',
    athleteInstruction: 'Stand on one leg. Hinge forward reaching toward the ground. Keep your back flat and hips square.',
    equipmentNeeded: [], spaceNeeded: 'minimal', difficulty: 'intermediate', active: true, media: [],
  },
  'open-books': {
    id: 'open-books', slug: 'open-books', title: 'Open Books',
    drillType: 'mobilization', bodyRegionTags: ['t_spine', 'ribcage', 'shoulder'], deficiencyTags: ['t_spine_rotation'],
    intentTags: ['joint_access', 'rotation_prep'], defaultReps: 8, defaultSides: 2, timingUnit: 'reps', isBilateral: false,
    holdType: 'dynamic', coachingCue: 'Side-lying. Rotate the top arm open like a book. Follow with your eyes.',
    athleteInstruction: 'Lie on your side, knees stacked. Open your top arm toward the ceiling and behind you. Return.',
    equipmentNeeded: [], spaceNeeded: 'minimal', difficulty: 'beginner', active: true, media: [],
  },
  'step-behind-rotation': {
    id: 'step-behind-rotation', slug: 'step-behind-rotation', title: 'Step-Behind Rotation',
    drillType: 'mobilization', bodyRegionTags: ['hip', 'pelvis', 'ribcage', 'trunk'], deficiencyTags: ['separation', 'rib_pelvis_control'],
    intentTags: ['rotation_prep', 'control'], defaultReps: 6, defaultSides: 2, timingUnit: 'reps', isBilateral: false,
    holdType: 'dynamic', coachingCue: 'Step behind, rotate through the upper body. Controlled and slow.',
    athleteInstruction: 'Step one foot behind the other. Rotate your upper body toward the front leg side. Slow and controlled.',
    equipmentNeeded: [], spaceNeeded: 'moderate', difficulty: 'beginner', active: true, media: [],
  },
  'med-ball-dry-rotations': {
    id: 'med-ball-dry-rotations', slug: 'med-ball-dry-rotations', title: 'Med Ball Dry Rotations',
    drillType: 'activation', bodyRegionTags: ['pelvis', 'ribcage', 'trunk'], deficiencyTags: ['separation', 'rib_pelvis_control'],
    intentTags: ['rotation_prep', 'cns_prep'], defaultReps: 6, defaultSides: 2, timingUnit: 'reps', isBilateral: false,
    holdType: 'dynamic', coachingCue: 'Hold the ball. Go through the full rotation pattern without releasing. Feel the load.',
    athleteInstruction: 'Hold a med ball at your chest. Go through a full throwing rotation slowly without releasing. Load and unload.',
    equipmentNeeded: ['medicine ball'], spaceNeeded: 'moderate', difficulty: 'intermediate', active: true, media: [],
  },
  'float-fire': {
    id: 'float-fire', slug: 'float-fire', title: 'Float → Fire Drill',
    drillType: 'activation', bodyRegionTags: ['hip', 'pelvis', 'trunk'], deficiencyTags: ['separation', 'elastic_stiffness'],
    intentTags: ['rotation_prep', 'cns_prep', 'elasticity'], defaultReps: 5, defaultSides: 2, timingUnit: 'reps', isBilateral: false,
    holdType: 'dynamic', coachingCue: 'Float into the load position. Pause. Then fire through the rotation with intent.',
    athleteInstruction: 'Step into your load position slowly (float). Pause 1 second. Then rotate explosively (fire). Reset.',
    equipmentNeeded: [], spaceNeeded: 'moderate', difficulty: 'intermediate', active: true, media: [],
  },
  '90-90-breathing': {
    id: '90-90-breathing', slug: '90-90-breathing', title: '90/90 Breathing',
    drillType: 'breathing', bodyRegionTags: ['ribcage', 'pelvis', 'trunk'], deficiencyTags: ['bracing', 'rib_pelvis_control'],
    intentTags: ['breathing', 'recovery', 'restoration'], defaultBreaths: 8, defaultSides: 1, timingUnit: 'breaths', isBilateral: true,
    holdType: 'static_hold', coachingCue: 'Feet on wall, knees and hips at 90°. Breathe into the back of ribcage. Long exhales.',
    athleteInstruction: 'Lie on back, feet on wall with knees at 90°. 4 seconds in through nose, 8 seconds out through mouth.',
    coachNote: 'Use this to downregulate the nervous system. Best post-session or before sleep.',
    equipmentNeeded: ['wall'], spaceNeeded: 'minimal', difficulty: 'beginner', active: true, media: [],
  },
  'deep-squat-hold': {
    id: 'deep-squat-hold', slug: 'deep-squat-hold', title: 'Deep Squat Hold',
    drillType: 'mobilization', bodyRegionTags: ['hip', 'ankle', 'pelvis'], deficiencyTags: ['hip_ir', 'ankle_df'],
    intentTags: ['joint_access', 'recovery'], defaultTimeSec: 30, defaultSides: 1, timingUnit: 'seconds', isBilateral: true,
    holdType: 'static_hold', coachingCue: 'Sink deep. Push knees out. Breathe.',
    athleteInstruction: 'Drop into a deep squat. Hold at the bottom. Push knees out, keep chest tall, and breathe.',
    equipmentNeeded: [], spaceNeeded: 'minimal', difficulty: 'beginner', active: true, media: [],
  },
  'box-breathing': {
    id: 'box-breathing', slug: 'box-breathing', title: 'Box Breathing',
    drillType: 'breathing', bodyRegionTags: ['ribcage', 'trunk'], deficiencyTags: ['bracing'],
    intentTags: ['breathing', 'recovery', 'restoration'], defaultBreaths: 6, defaultSides: 1, timingUnit: 'breaths', isBilateral: true,
    holdType: 'static_hold', coachingCue: '4 in, 4 hold, 4 out, 4 hold. Repeat.',
    athleteInstruction: 'Inhale 4 seconds. Hold 4 seconds. Exhale 4 seconds. Hold 4 seconds. Repeat.',
    equipmentNeeded: [], spaceNeeded: 'minimal', difficulty: 'beginner', active: true, media: [],
  },
  'lateral-band-walk': {
    id: 'lateral-band-walk', slug: 'lateral-band-walk', title: 'Lateral Band Walk',
    drillType: 'activation', bodyRegionTags: ['hip', 'pelvis'], deficiencyTags: ['single_leg_stability', 'decel_control'],
    intentTags: ['activation', 'control'], defaultReps: 10, defaultSides: 2, timingUnit: 'reps', isBilateral: false,
    holdType: 'dynamic', coachingCue: 'Stay low. Push through the heel. Don\'t let knees cave.',
    athleteInstruction: 'Band above knees. Stay in quarter squat. Step sideways, pushing through the outside foot.',
    equipmentNeeded: ['mini band'], spaceNeeded: 'moderate', difficulty: 'beginner', active: true, media: [],
  },
  'overhead-reach-breathing': {
    id: 'overhead-reach-breathing', slug: 'overhead-reach-breathing', title: 'Overhead Reach Breathing',
    drillType: 'breathing', bodyRegionTags: ['shoulder', 'ribcage', 't_spine'], deficiencyTags: ['scap_control', 'rib_pelvis_control'],
    intentTags: ['breathing', 'joint_access', 'recovery'], defaultBreaths: 5, defaultSides: 1, timingUnit: 'breaths', isBilateral: true,
    holdType: 'static_hold', coachingCue: 'Reach overhead. Inhale and lengthen. Exhale and settle deeper.',
    athleteInstruction: 'Reach both arms overhead. Inhale and stretch taller. Exhale and relax into the reach. Repeat.',
    equipmentNeeded: [], spaceNeeded: 'minimal', difficulty: 'beginner', active: true, media: [],
  },
  'forward-fold-breathing': {
    id: 'forward-fold-breathing', slug: 'forward-fold-breathing', title: 'Forward Fold Breathing',
    drillType: 'breathing', bodyRegionTags: ['hamstring', 'posterior_chain', 'trunk'],
    deficiencyTags: ['postural_control'], intentTags: ['breathing', 'recovery', 'restoration'],
    defaultBreaths: 5, defaultSides: 1, timingUnit: 'breaths', isBilateral: true,
    holdType: 'static_hold', coachingCue: 'Fold forward. Let everything hang. Breathe into the back.',
    athleteInstruction: 'Stand, fold forward. Let head and arms hang heavy. 4 seconds in, 8 seconds out. Let gravity do the work.',
    equipmentNeeded: [], spaceNeeded: 'minimal', difficulty: 'beginner', active: true, media: [],
  },
};

/** Get a drill by ID */
export function getDrill(id: string): Drill | undefined {
  return DRILL_LIBRARY[id];
}

/** Get all drills matching a body region */
export function getDrillsByBodyRegion(region: string): Drill[] {
  return Object.values(DRILL_LIBRARY).filter((d) => d.active && d.bodyRegionTags.includes(region as any));
}
