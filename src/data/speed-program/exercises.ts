/**
 * Speed Development Program — Exercise Library
 *
 * Every drill, sprint variation, warm-up, and plyo used in the program.
 */

import type { SpeedExercise } from './types';

export const SPEED_EXERCISES: Record<string, SpeedExercise> = {

  // ═══════════════════════════════════════════════════════════════════════════
  // WARM-UP DRILLS
  // ═══════════════════════════════════════════════════════════════════════════

  'wu-jog': { id: 'wu-jog', name: 'Easy Jog', category: 'warm_up', description: 'Light jog to raise core temperature.', coachingCue: 'Easy effort. Relax the shoulders. Steady rhythm.', targetArea: 'General prep' },
  'wu-high-knee-march': { id: 'wu-high-knee-march', name: 'High Knee March', category: 'warm_up', description: 'Controlled march with exaggerated knee drive.', coachingCue: 'Tall posture. Knee to 90°. Toe dorsiflexed.', targetArea: 'Hip flexor activation' },
  'wu-a-march': { id: 'wu-a-march', name: 'A-March', category: 'warm_up', description: 'Walk with high knee drive and foot strike under center of mass.', coachingCue: 'Knee up, toe up, strike down under the hip.', targetArea: 'Sprint posture patterning' },
  'wu-a-skip': { id: 'wu-a-skip', name: 'A-Skip', category: 'warm_up', description: 'Rhythmic skip with high knee drive.', coachingCue: 'Knee drive, toe up, strike the ground. Rhythm over speed.', targetArea: 'Sprint mechanics' },
  'wu-b-skip': { id: 'wu-b-skip', name: 'B-Skip', category: 'warm_up', description: 'Skip with knee extension and pawing action.', coachingCue: 'Drive knee up, extend the leg forward, paw it back under you.', targetArea: 'Front-side mechanics' },
  'wu-butt-kicks': { id: 'wu-butt-kicks', name: 'Butt Kicks', category: 'warm_up', description: 'Rapid heel-to-glute action to prep hamstrings.', coachingCue: 'Quick heel recovery. Stay tall. Don\'t lean forward.', targetArea: 'Hamstring prep' },
  'wu-carioca': { id: 'wu-carioca', name: 'Carioca', category: 'warm_up', description: 'Lateral crossover movement pattern.', coachingCue: 'Rotate the hips. Stay light on the feet. Don\'t cross your feet.', targetArea: 'Hip mobility and lateral movement' },
  'wu-lateral-shuffle': { id: 'wu-lateral-shuffle', name: 'Lateral Shuffle', category: 'warm_up', description: 'Athletic lateral movement in half squat.', coachingCue: 'Stay low. Push off the trailing foot. Don\'t click your heels.', targetArea: 'Lateral movement prep' },
  'wu-walking-lunge-twist': { id: 'wu-walking-lunge-twist', name: 'Walking Lunge + Rotation', category: 'warm_up', description: 'Forward lunge with upper body rotation.', coachingCue: 'Deep lunge, rotate over the front knee. Control the movement.', targetArea: 'Hip and T-spine mobility' },
  'wu-leg-cradle': { id: 'wu-leg-cradle', name: 'Leg Cradle', category: 'warm_up', description: 'Pull knee to chest while walking to open hips.', coachingCue: 'Pull the knee and ankle to the chest. Stand tall.', targetArea: 'Hip opener' },
  'wu-straight-leg-march': { id: 'wu-straight-leg-march', name: 'Straight Leg March', category: 'warm_up', description: 'March with straight legs to prep hamstrings.', coachingCue: 'Kick to your hand. Keep the leg straight. Don\'t round the back.', targetArea: 'Hamstring prep' },
  'wu-build-up-sprint': { id: 'wu-build-up-sprint', name: 'Build-Up Sprint', category: 'warm_up', description: 'Gradual acceleration from jog to 80% over 40-60 yards.', coachingCue: 'Start easy. Accelerate smoothly. Hit 80% by the end.', targetArea: 'CNS activation' },

  // ═══════════════════════════════════════════════════════════════════════════
  // SPRINT MECHANICS DRILLS
  // ═══════════════════════════════════════════════════════════════════════════

  'mech-wall-drive': { id: 'mech-wall-drive', name: 'Wall Drive', category: 'sprint_mechanic', description: 'Hands on wall at 45°. Drive one knee up to 90°, switch.', coachingCue: 'Full body lean. Toe dorsiflexed. Switch fast. Stay on the ball of the foot.', targetArea: 'Acceleration posture and drive' },
  'mech-wall-drive-hold': { id: 'mech-wall-drive-hold', name: 'Wall Drive Iso Hold', category: 'sprint_mechanic', description: 'Hold the wall drive position with max tension.', coachingCue: 'Drive knee to 90°. Lock the position. Full body lean. Hold with intent.', targetArea: 'Acceleration posture' },
  'mech-falling-start': { id: 'mech-falling-start', name: 'Falling Start', category: 'sprint_mechanic', description: 'Lean forward from tall position until gravity forces the sprint.', coachingCue: 'Stay stiff. Fall forward as one unit. Don\'t step first — fall.', targetArea: 'Acceleration start mechanics' },
  'mech-2pt-start': { id: 'mech-2pt-start', name: '2-Point Start', category: 'sprint_mechanic', description: 'Sprint from standing staggered stance.', coachingCue: 'Weight forward. Push the ground away. Low first 3 steps.', targetArea: 'Standing acceleration' },
  'mech-3pt-start': { id: 'mech-3pt-start', name: '3-Point Start', category: 'sprint_mechanic', description: 'Sprint from a three-point stance.', coachingCue: 'Load the back leg. Push hard. Stay low for 5+ yards.', targetArea: 'Explosive start' },
  'mech-lateral-start': { id: 'mech-lateral-start', name: 'Lateral Start → Sprint', category: 'sprint_mechanic', description: 'Open from a lateral stance, cross over, and sprint.', coachingCue: 'Violent hip turn. Cross over hard. Accelerate through.', targetArea: 'Baseball-specific first step' },
  'mech-crossover-start': { id: 'mech-crossover-start', name: 'Crossover Start → Sprint', category: 'sprint_mechanic', description: 'Cross one leg over and explode into a sprint.', coachingCue: 'Aggressive crossover. Push off the back foot. Stay low.', targetArea: 'Outfield/baserunning start' },
  'mech-arm-action-drill': { id: 'mech-arm-action-drill', name: 'Seated Arm Action', category: 'sprint_mechanic', description: 'Sit on ground, drive arms in sprint pattern.', coachingCue: 'Cheek to cheek. Drive the elbow back. Relaxed hands.', targetArea: 'Sprint arm mechanics' },
  'mech-ankling': { id: 'mech-ankling', name: 'Ankling', category: 'sprint_mechanic', description: 'Short, stiff ankle contacts moving forward.', coachingCue: 'Stiff ankle. Quick ground contact. Roll forward.', targetArea: 'Ground contact efficiency' },

  // ═══════════════════════════════════════════════════════════════════════════
  // ACCELERATION SPRINTS
  // ═══════════════════════════════════════════════════════════════════════════

  'acc-10yd': { id: 'acc-10yd', name: '10-Yard Sprint', category: 'acceleration', description: 'Max-effort sprint from standing start.', coachingCue: 'Explosive first step. Stay low. Drive through 10.', targetArea: 'First-step quickness' },
  'acc-15yd': { id: 'acc-15yd', name: '15-Yard Sprint', category: 'acceleration', description: 'Short acceleration sprint.', coachingCue: 'Push the ground. Gradually rise. Aggressive arms.', targetArea: 'Acceleration development' },
  'acc-20yd': { id: 'acc-20yd', name: '20-Yard Sprint', category: 'acceleration', description: 'Acceleration to near-top speed.', coachingCue: 'Low first 5 yards. Rise gradually. Hit top speed by 20.', targetArea: 'Acceleration to transition' },
  'acc-falling-10': { id: 'acc-falling-10', name: 'Falling Start → 10 yd', category: 'acceleration', description: 'Fall from tall into 10-yard max sprint.', coachingCue: 'Fall as one unit. Push hard at ground contact.', targetArea: 'Reactive acceleration' },
  'acc-falling-15': { id: 'acc-falling-15', name: 'Falling Start → 15 yd', category: 'acceleration', description: 'Fall from tall into 15-yard sprint.', coachingCue: 'Fall and go. Low angle for first 5 yards.', targetArea: 'Reactive acceleration' },
  'acc-3pt-10': { id: 'acc-3pt-10', name: '3-Point → 10 yd Sprint', category: 'acceleration', description: 'Explosive 3-point start into 10 yards.', coachingCue: 'Load the back leg. Push hard. Low for 5+ yards.', targetArea: 'Explosive start' },
  'acc-3pt-15': { id: 'acc-3pt-15', name: '3-Point → 15 yd Sprint', category: 'acceleration', description: 'Explosive 3-point start into 15 yards.', coachingCue: 'Violent push. Gradual rise. Arm drive.', targetArea: 'Explosive start' },
  'acc-resisted-10': { id: 'acc-resisted-10', name: 'Resisted Sprint — 10 yd', category: 'acceleration', description: 'Sprint against sled or band resistance.', coachingCue: 'Drive hard. Stay low. Push through the resistance.', targetArea: 'Force production', equipment: ['sled or resistance band'] },
  'acc-resisted-15': { id: 'acc-resisted-15', name: 'Resisted Sprint — 15 yd', category: 'acceleration', description: 'Sprint against sled or band resistance.', coachingCue: 'Push the ground. Stay at 45°. Aggressive drive.', targetArea: 'Horizontal force', equipment: ['sled or resistance band'] },

  // ═══════════════════════════════════════════════════════════════════════════
  // MAX VELOCITY SPRINTS
  // ═══════════════════════════════════════════════════════════════════════════

  'mv-fly-10': { id: 'mv-fly-10', name: 'Flying 10 yd Sprint', category: 'max_velocity', description: '20-yard build → 10-yard max-velocity zone.', coachingCue: 'Build to 90% through the zone. Hit top speed in the fly zone.', targetArea: 'Max velocity' },
  'mv-fly-20': { id: 'mv-fly-20', name: 'Flying 20 yd Sprint', category: 'max_velocity', description: '20-yard build → 20-yard max-velocity zone.', coachingCue: 'Smooth build. Tall posture in the fly zone. Fast hands.', targetArea: 'Max velocity maintenance' },
  'mv-fly-30': { id: 'mv-fly-30', name: 'Flying 30 yd Sprint', category: 'max_velocity', description: '20-yard build → 30-yard fly zone.', coachingCue: 'Build smoothly. Maintain mechanics. Tall and fast through the zone.', targetArea: 'Speed endurance at max velocity' },
  'mv-wicket-run': { id: 'mv-wicket-run', name: 'Wicket Run', category: 'max_velocity', description: 'Sprint through mini hurdles spaced at stride length.', coachingCue: 'Step over each wicket. Tall posture. Quick ground contact.', targetArea: 'Stride length and frequency', equipment: ['mini hurdles or cones'] },
  'mv-dribble-run': { id: 'mv-dribble-run', name: 'Dribble Run', category: 'max_velocity', description: 'Short, fast steps transitioning to full stride.', coachingCue: 'Start with tiny fast steps. Open stride gradually. Stay tall.', targetArea: 'Transition from short to full stride' },
  'mv-ins-outs': { id: 'mv-ins-outs', name: 'In-and-Outs', category: 'max_velocity', description: 'Accelerate 20 yd, hold top speed 20 yd, coast 20 yd. Repeat.', coachingCue: 'Smooth transitions. Don\'t brake — just relax into the coast.', targetArea: 'Speed reserve and relaxation at speed' },

  // ═══════════════════════════════════════════════════════════════════════════
  // CHANGE OF DIRECTION
  // ═══════════════════════════════════════════════════════════════════════════

  'cod-shuffle-sprint': { id: 'cod-shuffle-sprint', name: 'Shuffle → Sprint', category: 'cod', description: '5-yard shuffle, plant, and sprint 10 yards.', coachingCue: 'Low shuffle. Hard plant. Explode out of the break.', targetArea: 'Lateral to linear transition' },
  'cod-crossover-sprint': { id: 'cod-crossover-sprint', name: 'Crossover → Sprint', category: 'cod', description: 'Crossover step into max-effort sprint.', coachingCue: 'Aggressive hip turn. Violent crossover. Accelerate.', targetArea: 'Baseball-specific change of direction' },
  'cod-5-10-5': { id: 'cod-5-10-5', name: '5-10-5 Pro Agility', category: 'cod', description: 'Sprint 5 yards, change direction 10 yards, change direction 5 yards.', coachingCue: 'Low to the line. Aggressive plant. Push off hard.', targetArea: 'Change of direction speed' },
  'cod-lateral-accel': { id: 'cod-lateral-accel', name: 'Lateral Acceleration', category: 'cod', description: 'Start in lateral stance, accelerate laterally for 10 yards.', coachingCue: 'Push off the inside foot. Stay low. Don\'t cross feet.', targetArea: 'Lateral quickness' },
  'cod-decel-5yd': { id: 'cod-decel-5yd', name: 'Sprint → Deceleration (5 yd stop)', category: 'cod', description: 'Sprint 15 yards, stop in 5 yards.', coachingCue: 'Chop the feet. Lower the hips. Absorb the speed.', targetArea: 'Deceleration mechanics' },
  'cod-decel-reaccel': { id: 'cod-decel-reaccel', name: 'Decel → Re-Accel', category: 'cod', description: 'Sprint 15, decel 5, re-accelerate 10.', coachingCue: 'Stop clean. Reload. Explode again.', targetArea: 'Decel to re-accel' },
  'cod-reaction-sprint': { id: 'cod-reaction-sprint', name: 'Reaction Sprint', category: 'cod', description: 'React to visual/audio cue, sprint 10 yards in the called direction.', coachingCue: 'Stay athletic. React and go. Don\'t guess.', targetArea: 'Reactive speed' },

  // ═══════════════════════════════════════════════════════════════════════════
  // BASEBALL TRANSFER SPEED
  // ═══════════════════════════════════════════════════════════════════════════

  'bb-curved-sprint': { id: 'bb-curved-sprint', name: 'Curved Sprint (Base Path)', category: 'baseball_transfer', description: 'Sprint around a base path curve at max speed.', coachingCue: 'Lean into the curve. Inside arm short. Outside arm drives.', targetArea: 'Base running speed' },
  'bb-drop-step-sprint': { id: 'bb-drop-step-sprint', name: 'Drop Step → Sprint', category: 'baseball_transfer', description: 'Open with a drop step and sprint 15-20 yards.', coachingCue: 'Open the hip. Push off the front foot. Sprint.', targetArea: 'Outfield first step' },
  'bb-crossover-go': { id: 'bb-crossover-go', name: 'Crossover → Go', category: 'baseball_transfer', description: 'Crossover step and sprint to a target.', coachingCue: 'Aggressive hip turn. Cross hard. Accelerate.', targetArea: 'Baseball-specific start' },
  'bb-shuffle-break-sprint': { id: 'bb-shuffle-break-sprint', name: 'Shuffle → Break → Sprint', category: 'baseball_transfer', description: 'Shuffle 5, plant hard, sprint 15.', coachingCue: 'Low shuffle. Plant inside foot. Push into the sprint.', targetArea: 'Infield lateral to sprint' },
  'bb-lead-steal-sprint': { id: 'bb-lead-steal-sprint', name: 'Lead + Steal Sprint', category: 'baseball_transfer', description: 'Take a lead, react to a cue, sprint 20 yards.', coachingCue: 'Athletic base. Explosive crossover. Sprint to second.', targetArea: 'Stolen base speed' },
  'bb-home-to-first': { id: 'bb-home-to-first', name: 'Home-to-First Sprint', category: 'baseball_transfer', description: 'Sprint from home plate position to first base (90 ft).', coachingCue: 'Explosive start. Run through the bag. Don\'t slow down.', targetArea: 'Game speed' },

  // ═══════════════════════════════════════════════════════════════════════════
  // SPRINT PLYOMETRICS
  // ═══════════════════════════════════════════════════════════════════════════

  'plyo-pogos': { id: 'plyo-pogos', name: 'Pogos', category: 'plyo', description: 'Quick ankle bounces with stiff ankles.', coachingCue: 'Stiff ankles. Quick ground contact. Bounce up, not forward.', targetArea: 'Ankle stiffness' },
  'plyo-broad-jump': { id: 'plyo-broad-jump', name: 'Standing Broad Jump', category: 'plyo', description: 'Max-effort horizontal jump from standing.', coachingCue: 'Swing the arms. Explode through the hips. Stick the landing.', targetArea: 'Horizontal power' },
  'plyo-lateral-bound': { id: 'plyo-lateral-bound', name: 'Lateral Bound', category: 'plyo', description: 'Single-leg lateral jump, stick the landing.', coachingCue: 'Push off the outside foot. Fly and stick. Hold 2 seconds.', targetArea: 'Lateral power' },
  'plyo-bound': { id: 'plyo-bound', name: 'Bounding', category: 'plyo', description: 'Alternate-leg power bounds for distance.', coachingCue: 'Drive the knee. Push off hard. Max distance each bound.', targetArea: 'Stride power' },
  'plyo-snap-down': { id: 'plyo-snap-down', name: 'Snap Downs', category: 'plyo', description: 'Jump slightly, snap into athletic position.', coachingCue: 'Tall to low. Snap fast. Stick it.', targetArea: 'Landing mechanics and decel prep' },
  'plyo-depth-drop': { id: 'plyo-depth-drop', name: 'Depth Drop', category: 'plyo', description: 'Step off a box, absorb the landing.', coachingCue: 'Step off — don\'t jump. Absorb with stiff legs. Stick.', targetArea: 'Landing absorption' },
  'plyo-depth-jump': { id: 'plyo-depth-jump', name: 'Depth Jump', category: 'plyo', description: 'Step off a box, immediately jump upon landing.', coachingCue: 'Step off, land, explode. Minimize ground contact time.', targetArea: 'Reactive power' },
  'plyo-hurdle-hop': { id: 'plyo-hurdle-hop', name: 'Hurdle Hops', category: 'plyo', description: 'Continuous hops over mini hurdles.', coachingCue: 'Stiff ankles. Quick off the ground. Drive the knees.', targetArea: 'Elastic stiffness', equipment: ['mini hurdles'] },
  'plyo-single-leg-hop': { id: 'plyo-single-leg-hop', name: 'Single-Leg Hops', category: 'plyo', description: 'Continuous single-leg forward hops.', coachingCue: 'Drive the knee. Push off the ball of the foot. Stay balanced.', targetArea: 'Single-leg power' },
  'plyo-reactive-jump': { id: 'plyo-reactive-jump', name: 'Reactive Vertical Jump', category: 'plyo', description: 'Drop into a quarter squat and immediately jump.', coachingCue: 'Fast down, fast up. Minimize the time in the bottom.', targetArea: 'Reactive power' },
  'plyo-line-hops': { id: 'plyo-line-hops', name: 'Line Hops', category: 'plyo', description: 'Quick lateral hops over a line.', coachingCue: 'Stiff ankles. Quick contact. Stay on the balls of your feet.', targetArea: 'Ankle stiffness and elasticity' },

  // ═══════════════════════════════════════════════════════════════════════════
  // TEMPO
  // ═══════════════════════════════════════════════════════════════════════════

  'tempo-60yd': { id: 'tempo-60yd', name: 'Tempo Run — 60 yd', category: 'tempo', description: '60-yard run at 60-70% effort.', coachingCue: 'Smooth and controlled. This is recovery work, not sprinting.', targetArea: 'Aerobic base / recovery' },
  'tempo-80yd': { id: 'tempo-80yd', name: 'Tempo Run — 80 yd', category: 'tempo', description: '80-yard run at 60-70% effort.', coachingCue: 'Relaxed. Controlled pace. Build aerobic capacity.', targetArea: 'Work capacity' },
  'tempo-100yd': { id: 'tempo-100yd', name: 'Tempo Run — 100 yd', category: 'tempo', description: '100-yard run at 60-70% effort.', coachingCue: 'Easy rhythm. Breathe through the nose if possible.', targetArea: 'Aerobic recovery' },
};

export function getExercise(id: string): SpeedExercise | undefined {
  return SPEED_EXERCISES[id];
}
