/**
 * Locked Prescription Output Definitions
 *
 * For each important archetype + need combination, defines exactly:
 *   - what increases
 *   - what decreases
 *   - what gets capped
 *   - what gets added
 *   - what gets removed
 *   - Daily Work focus
 *   - My Path lane
 *   - what the athlete should stop overdoing
 *   - athlete-facing summary in plain English
 *
 * This is the product contract. If the generated profile does not produce
 * these outputs, the system has failed.
 */

import type { StrengthArchetype, StrengthNeed, DailyWorkFocus, MyPathStartPoint } from '../types/strengthProfile';

export interface PrescriptionOutput {
  archetype: StrengthArchetype;
  need: StrengthNeed;

  // What changes in the program
  increases: string[];
  decreases: string[];
  caps: string[];
  adds: string[];
  removes: string[];

  // Routing
  dailyWork: DailyWorkFocus;
  myPath: MyPathStartPoint;

  // Guardrails
  stopOverdoing: string[];

  // Athlete-facing language
  athleteLabel: string;
  athleteNeedLabel: string;
  programEmphasis: string;
  programReduces: string;
  dailyWorkLabel: string;
  myPathLabel: string;
}

export const LOCKED_PRESCRIPTION_OUTPUTS: PrescriptionOutput[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // STATIC + ELASTICITY
  // ═══════════════════════════════════════════════════════════════════════════
  {
    archetype: 'static',
    need: 'elasticity',
    increases: ['Reactive plyometrics', 'Pogo/rebound work', 'Max velocity sprints', 'Tendon prep', 'Speed-strength contrast'],
    decreases: ['Heavy eccentric volume', 'Grind strength volume', 'High-fatigue conditioning'],
    caps: ['Main strength: 3 exercises', 'Accessory: 3 exercises'],
    adds: ['Ankle stiffness hops', 'Pogo progressions', 'Flying sprints', 'Wicket dribbles', 'Speed squats'],
    removes: ['Heavy eccentric overload exercises', 'Extra grind sets'],
    dailyWork: 'elastic_reactivity',
    myPath: 'build_elasticity',
    stopOverdoing: ['Heavy slow eccentric work', 'Excess strength volume'],
    athleteLabel: 'Static Force Athlete',
    athleteNeedLabel: 'You need better elastic and reactive qualities',
    programEmphasis: 'Your program will emphasize reactive plyometrics, stiffness training, max velocity work, and converting your strength into quickness.',
    programReduces: 'It will reduce heavy grinding strength volume and high-fatigue conditioning to preserve your speed quality.',
    dailyWorkLabel: 'Elastic Reactivity — pogos, stiffness, rebound',
    myPathLabel: 'Build Elasticity — stiffness → rebound → max V → baseball movement',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // STATIC + MOBILITY
  // ═══════════════════════════════════════════════════════════════════════════
  {
    archetype: 'static',
    need: 'mobility',
    increases: ['Prep block volume', 'Daily mobility dosage', 'Position ownership work', 'Separation access drills'],
    decreases: ['Loading depth/complexity', 'Chaotic speed/power until access improves', 'Heavy barbell squats (regress to goblet)'],
    caps: ['All blocks: respect position access before load'],
    adds: ['90/90 hip flow', 'Ankle DF mobilization', 'T-spine rotation', 'Adductor mobility', 'Goblet squat holds'],
    removes: ['Back squat (until access owned)', 'Front squat (until access owned)', 'Overhead press (until shoulder access)'],
    dailyWork: 'mobility_access',
    myPath: 'own_positions',
    stopOverdoing: ['Loading positions you cannot access', 'Chasing strength before owning range'],
    athleteLabel: 'Static Force Athlete',
    athleteNeedLabel: 'Limited movement access is blocking your positions',
    programEmphasis: 'Your program will emphasize restoring movement access — hip, ankle, T-spine, and shoulder. You will own positions before adding load.',
    programReduces: 'It will reduce loading depth and complexity until your positions improve. Simpler exercises, better range.',
    dailyWorkLabel: 'Movement Access — hip, ankle, T-spine, shoulder',
    myPathLabel: 'Own Your Positions — access → control → strength → transfer',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SPRING + STRENGTH
  // ═══════════════════════════════════════════════════════════════════════════
  {
    archetype: 'spring',
    need: 'strength',
    increases: ['Max strength lifts', 'Eccentric loading', 'Isometric holds', 'Posterior chain priority', 'Bilateral force development'],
    decreases: ['Reactive plyo volume', 'Max velocity sprint exposure', 'High-contact plyometric sessions'],
    caps: ['Plyometrics: 3 exercises', 'Sprint: no flying sprints'],
    adds: ['Eccentric RDL', 'Split squat ISO holds', 'Pin squat overcoming ISO', 'Posterior chain accessory', 'Trunk stiffness work'],
    removes: ['Flying sprints', 'Wicket dribbles', 'Excess depth jumps'],
    dailyWork: 'strength_base',
    myPath: 'build_strength_base',
    stopOverdoing: ['Reactive plyometric volume', 'Top-end velocity work before building base strength'],
    athleteLabel: 'Spring Elastic Athlete',
    athleteNeedLabel: 'You need more base strength to support your speed',
    programEmphasis: 'Your program will emphasize building max strength, eccentric control, and isometric capacity. You need a stronger foundation under your elastic system.',
    programReduces: 'It will reduce reactive plyometric volume and top-end velocity exposure until your strength base catches up to your speed.',
    dailyWorkLabel: 'Strength Support — isometrics, posterior chain, trunk',
    myPathLabel: 'Build Strength Base — force → eccentric/iso → speed-strength → transfer',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SPRING + STABILITY_CONTROL
  // ═══════════════════════════════════════════════════════════════════════════
  {
    archetype: 'spring',
    need: 'stability_control',
    increases: ['Rib-pelvis control', 'Block-leg stability', 'Single-leg ownership', 'Anti-rotation', 'Landing/decel ownership'],
    decreases: ['Chaotic reactive plyos', 'High-velocity sprint volume', 'Uncontrolled landing reps'],
    caps: ['Plyometrics: 3 exercises (controlled only)', 'Sprint: short + controlled'],
    adds: ['Box drop to stick landing', 'Lateral bound to stick', 'Dead bug w/ band', 'Pallof holds', 'Sled marches'],
    removes: ['Depth jumps', 'Reactive hurdle hops', 'Flying sprints'],
    dailyWork: 'position_control',
    myPath: 'own_positions',
    stopOverdoing: ['Chaotic reactive work without positional control', 'Letting elastic system outpace tissue capacity'],
    athleteLabel: 'Spring Elastic Athlete',
    athleteNeedLabel: 'Force leaks are limiting your transfer to the field',
    programEmphasis: 'Your program will emphasize positional control — rib-pelvis, block-leg, single-leg, and trunk stability. Control must improve before chaos increases.',
    programReduces: 'It will reduce chaotic reactive work and uncontrolled high-velocity exposure until your body can own the positions under speed.',
    dailyWorkLabel: 'Position Control — pelvis, single-leg, anti-rotation',
    myPathLabel: 'Own Your Positions — access → control → strength → transfer',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // HYBRID + MOBILITY
  // ═══════════════════════════════════════════════════════════════════════════
  {
    archetype: 'hybrid',
    need: 'mobility',
    increases: ['Prep block volume', 'Daily mobility dosage', 'Position ownership before load'],
    decreases: ['Loading complexity', 'High-demand barbell movements', 'Specialization in any direction'],
    caps: ['All blocks: 4 exercises (avoid over-specialization)'],
    adds: ['90/90 hip flow', 'Ankle DF mobilization', 'T-spine rotation', 'Goblet squat holds', 'Shoulder access resets'],
    removes: ['Back squat (regress to goblet)', 'Front squat', 'Complex Olympic lifts'],
    dailyWork: 'mobility_access',
    myPath: 'own_positions',
    stopOverdoing: ['Loading without access', 'Unnecessary specialization'],
    athleteLabel: 'Hybrid Balanced Athlete',
    athleteNeedLabel: 'Limited movement access is your biggest gap right now',
    programEmphasis: 'Your program will emphasize restoring movement access across your whole body. You have balanced outputs — you just need better positions to use them.',
    programReduces: 'It will reduce exercise complexity and loading until your positions improve. Own the range, then add load.',
    dailyWorkLabel: 'Movement Access — hip, ankle, T-spine, shoulder',
    myPathLabel: 'Own Your Positions — access → control → strength → transfer',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // HYBRID + SPEED_ROTATION
  // ═══════════════════════════════════════════════════════════════════════════
  {
    archetype: 'hybrid',
    need: 'speed_rotation',
    increases: ['Sprint mechanics', 'Acceleration work', 'Rotational speed drills', 'Med ball velocity', 'Separation access'],
    decreases: ['High-fatigue conditioning', 'Unnecessary grind volume'],
    caps: ['Conditioning: low-fatigue only'],
    adds: ['Wall drive to sprint', 'Sled marches', 'Acceleration mechanics', 'Med ball rotational throws', 'Anti-rotation to rotation'],
    removes: ['Repeat sprints', 'Gasser conditioning', 'High-fatigue circuits'],
    dailyWork: 'speed_rotation',
    myPath: 'improve_acceleration',
    stopOverdoing: ['High-fatigue conditioning that flattens speed quality'],
    athleteLabel: 'Hybrid Balanced Athlete',
    athleteNeedLabel: 'You have capacity but poor transfer to sprint and rotation',
    programEmphasis: 'Your program will emphasize acceleration mechanics, rotational speed, and force transfer to baseball movement. You have the engine — now sharpen the output.',
    programReduces: 'It will reduce high-fatigue conditioning and grind volume to preserve speed quality and allow your speed system to express.',
    dailyWorkLabel: 'Speed & Rotation — acceleration, separation, med ball',
    myPathLabel: 'Improve Acceleration — first step → projection → rotation → position-specific',
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // STATIC + STRENGTH
  // ═══════════════════════════════════════════════════════════════════════════
  {
    archetype: 'static', need: 'strength',
    increases: ['Heavy compound lifts', 'Eccentric loading', 'Isometric holds', 'Posterior chain'],
    decreases: ['Speed-strength contrast (already strong enough for it)', 'Plyometric variety'],
    caps: ['Plyo: 3 exercises'],
    adds: ['Pin squat ISO', 'Heavy RDL', 'Eccentric split squat'],
    removes: ['Speed squats (build base first)'],
    dailyWork: 'strength_base', myPath: 'build_strength_base',
    stopOverdoing: ['Chasing speed before building sufficient base strength'],
    athleteLabel: 'Static Force Athlete',
    athleteNeedLabel: 'You need more base strength before chasing speed',
    programEmphasis: 'Your program will emphasize heavy compound lifts, eccentric control, and isometric capacity.',
    programReduces: 'It will reduce complexity and speed-strength work until your base force catches up.',
    dailyWorkLabel: 'Strength Support', myPathLabel: 'Build Strength Base',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // STATIC + STABILITY_CONTROL
  // ═══════════════════════════════════════════════════════════════════════════
  {
    archetype: 'static', need: 'stability_control',
    increases: ['Rib-pelvis control', 'Single-leg ownership', 'Anti-rotation', 'Landing drills'],
    decreases: ['Heavy bilateral grinding', 'Max effort sets'],
    caps: ['Main strength: 3 exercises'],
    adds: ['Dead bug w/ band', 'Pallof holds', 'Single leg RDL hold', 'Box drop stick'],
    removes: ['Max effort bilateral lifts until control improves'],
    dailyWork: 'position_control', myPath: 'own_positions',
    stopOverdoing: ['Heavy bilateral grinding without positional control'],
    athleteLabel: 'Static Force Athlete',
    athleteNeedLabel: 'Force leaks are limiting how your strength transfers',
    programEmphasis: 'Your program will emphasize positional control and stability under load.',
    programReduces: 'It will reduce heavy bilateral volume to focus on single-leg control and trunk stability.',
    dailyWorkLabel: 'Position Control', myPathLabel: 'Own Your Positions',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // STATIC + SPEED_ROTATION
  // ═══════════════════════════════════════════════════════════════════════════
  {
    archetype: 'static', need: 'speed_rotation',
    increases: ['Sprint mechanics', 'Med ball speed', 'Separation access', 'Max V rhythm'],
    decreases: ['Heavy grind volume', 'High-fatigue conditioning'],
    caps: ['Conditioning: low-fatigue only'],
    adds: ['Wall drive to sprint', 'Flying 20s', 'Med ball rotational throws', 'Wicket dribbles'],
    removes: ['Gasser conditioning', 'Repeat sprints'],
    dailyWork: 'speed_rotation', myPath: 'improve_acceleration',
    stopOverdoing: ['Heavy slow conditioning that kills speed quality'],
    athleteLabel: 'Static Force Athlete',
    athleteNeedLabel: 'You have strength but it doesn\'t transfer to sprint and rotation',
    programEmphasis: 'Your program will emphasize acceleration, max velocity, and rotational speed transfer.',
    programReduces: 'It will reduce heavy grind volume and high-fatigue conditioning to preserve speed quality.',
    dailyWorkLabel: 'Speed & Rotation', myPathLabel: 'Improve Acceleration',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SPRING + ELASTICITY
  // ═══════════════════════════════════════════════════════════════════════════
  {
    archetype: 'spring', need: 'elasticity',
    increases: ['Tendon prep', 'Stiffness isos', 'Pogo progressions', 'Rebound quality'],
    decreases: ['Max effort reactive volume', 'Depth jumps'],
    caps: ['Plyos: focus on quality not volume'],
    adds: ['Ankle stiffness hops', 'Stiffness isos', 'Line hops progressive'],
    removes: ['High-volume depth jumps'],
    dailyWork: 'elastic_reactivity', myPath: 'build_elasticity',
    stopOverdoing: ['Reactive volume without tendon prep'],
    athleteLabel: 'Spring Elastic Athlete',
    athleteNeedLabel: 'Your elastic system needs better stiffness and rebound quality',
    programEmphasis: 'Your program will emphasize tendon prep, stiffness training, and controlled reactive quality.',
    programReduces: 'It will reduce high-volume reactive work to let tendon capacity catch up to muscle speed.',
    dailyWorkLabel: 'Elastic Reactivity', myPathLabel: 'Build Elasticity',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SPRING + MOBILITY
  // ═══════════════════════════════════════════════════════════════════════════
  {
    archetype: 'spring', need: 'mobility',
    increases: ['Prep volume', 'Daily mobility', 'Position ownership', 'Controlled landing depth'],
    decreases: ['High-velocity reactive work until access improves', 'Loading without range'],
    caps: ['Plyos: controlled only until access owned'],
    adds: ['90/90 hip flow', 'Ankle DF work', 'T-spine rotation', 'Goblet squat holds'],
    removes: ['Deep barbell squats until access owned', 'High-velocity plyos without range'],
    dailyWork: 'mobility_access', myPath: 'own_positions',
    stopOverdoing: ['Speed work without sufficient joint access'],
    athleteLabel: 'Spring Elastic Athlete',
    athleteNeedLabel: 'Limited movement access is blocking your elastic system',
    programEmphasis: 'Your program will emphasize restoring joint access so your elastic system can work through full range.',
    programReduces: 'It will reduce high-velocity reactive work until your positions improve.',
    dailyWorkLabel: 'Movement Access', myPathLabel: 'Own Your Positions',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SPRING + SPEED_ROTATION
  // ═══════════════════════════════════════════════════════════════════════════
  {
    archetype: 'spring', need: 'speed_rotation',
    increases: ['Short acceleration', 'Rotational med ball', 'Separation access', 'Decel-then-redirect'],
    decreases: ['Excess max V volume', 'Reactive plyo volume'],
    caps: ['Plyos: short + controlled'],
    adds: ['Sled marches', 'Wall drive to sprint', 'Med ball speed throws', 'Anti-rotation to rotation'],
    removes: ['Flying sprints (focus on short accel)', 'Excess depth jumps'],
    dailyWork: 'speed_rotation', myPath: 'improve_acceleration',
    stopOverdoing: ['Top-end velocity work before building short acceleration'],
    athleteLabel: 'Spring Elastic Athlete',
    athleteNeedLabel: 'You need better acceleration and rotational transfer',
    programEmphasis: 'Your program will emphasize short acceleration mechanics, rotational speed, and force transfer.',
    programReduces: 'It will reduce max velocity and reactive volume to focus on acceleration and rotation quality.',
    dailyWorkLabel: 'Speed & Rotation', myPathLabel: 'Improve Acceleration',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // HYBRID + STRENGTH
  // ═══════════════════════════════════════════════════════════════════════════
  {
    archetype: 'hybrid', need: 'strength',
    increases: ['Main lift priority', 'Eccentric/isometric loading', 'Posterior chain'],
    decreases: ['Exercise variety (simplify)', 'Unnecessary complexity'],
    caps: ['All blocks: 4 exercises'],
    adds: ['Eccentric RDL', 'Isometric holds', 'Heavy bilateral compounds'],
    removes: ['Complex Olympic variations', 'Excess accessory variety'],
    dailyWork: 'strength_base', myPath: 'build_strength_base',
    stopOverdoing: ['Hiding weakness behind complexity and variety'],
    athleteLabel: 'Hybrid Balanced Athlete',
    athleteNeedLabel: 'You need more raw force production',
    programEmphasis: 'Your program will emphasize building base strength with simpler, honest progressions.',
    programReduces: 'It will reduce exercise variety and complexity to focus on force development.',
    dailyWorkLabel: 'Strength Support', myPathLabel: 'Build Strength Base',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // HYBRID + STABILITY_CONTROL
  // ═══════════════════════════════════════════════════════════════════════════
  {
    archetype: 'hybrid', need: 'stability_control',
    increases: ['Rib-pelvis control', 'Single-leg work', 'Trunk stiffness', 'Landing ownership'],
    decreases: ['Chaotic movement', 'High-velocity before control'],
    caps: ['All blocks: 4 exercises'],
    adds: ['Dead bug w/ band', 'Pallof holds', 'Single leg RDL hold', 'Anti-rotation press'],
    removes: ['Depth jumps', 'Uncontrolled reactive work'],
    dailyWork: 'position_control', myPath: 'own_positions',
    stopOverdoing: ['Adding chaos before owning positions'],
    athleteLabel: 'Hybrid Balanced Athlete',
    athleteNeedLabel: 'Force leaks are your biggest gap right now',
    programEmphasis: 'Your program will emphasize positional control, single-leg stability, and trunk stiffness.',
    programReduces: 'It will reduce chaotic movement and high-velocity exposure until control improves.',
    dailyWorkLabel: 'Position Control', myPathLabel: 'Own Your Positions',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // HYBRID + ELASTICITY
  // ═══════════════════════════════════════════════════════════════════════════
  {
    archetype: 'hybrid', need: 'elasticity',
    increases: ['Reactive plyos', 'Tendon prep', 'Stiffness training', 'Max V rhythm'],
    decreases: ['Excess grind volume', 'Heavy slow conditioning'],
    caps: ['All blocks: 4 exercises'],
    adds: ['Pogo progressions', 'Ankle stiffness hops', 'Dribbles', 'Stiffness isos'],
    removes: ['Heavy slow conditioning', 'Excess grind sets'],
    dailyWork: 'elastic_reactivity', myPath: 'build_elasticity',
    stopOverdoing: ['Grind volume that flattens elastic quality'],
    athleteLabel: 'Hybrid Balanced Athlete',
    athleteNeedLabel: 'You need better stiffness, rebound, and quickness',
    programEmphasis: 'Your program will emphasize reactive qualities, tendon stiffness, and converting force into quickness.',
    programReduces: 'It will reduce grind volume and heavy conditioning to preserve elastic quality.',
    dailyWorkLabel: 'Elastic Reactivity', myPathLabel: 'Build Elasticity',
  },
];

/**
 * Look up the locked prescription output for a given archetype + need combination.
 * Returns undefined if no locked output exists for that combination.
 */
export function getPrescriptionOutput(
  archetype: StrengthArchetype,
  need: StrengthNeed,
): PrescriptionOutput | undefined {
  return LOCKED_PRESCRIPTION_OUTPUTS.find(
    (o) => o.archetype === archetype && o.need === need,
  );
}
