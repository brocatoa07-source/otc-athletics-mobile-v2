/**
 * Tagged Drill Library — Drills tagged by troubleshooting topic and drill type.
 *
 * Every drill has:
 *   - id, name, shortDescription, whatItFixes, focusCue
 *   - drillType: tee | flips | overhand | machine | compete
 *   - topicIds: which troubleshooting topics this drill helps
 *   - videoUrl: placeholder for future video
 */

export type DrillType = 'tee' | 'flips' | 'overhand' | 'machine' | 'compete';

export interface TaggedDrill {
  id: string;
  name: string;
  shortDescription: string;
  whatItFixes: string;
  focusCue: string;
  drillType: DrillType;
  topicIds: string[];
  videoUrl: string;
}

export const DRILL_TYPE_META: Record<DrillType, { label: string; color: string; icon: string }> = {
  tee: { label: 'Tee', color: '#3b82f6', icon: 'construct-outline' },
  flips: { label: 'Flips / Front Toss', color: '#22c55e', icon: 'swap-horizontal-outline' },
  overhand: { label: 'Overhand BP', color: '#f59e0b', icon: 'arrow-up-outline' },
  machine: { label: 'Machine', color: '#ef4444', icon: 'cog-outline' },
  compete: { label: 'Compete / Transfer', color: '#8b5cf6', icon: 'trophy-outline' },
};

/**
 * Day-to-drill-type mapping for the 7-day plan builder.
 * Day 1-2: Tee, Day 3-4: Flips, Day 5: Overhand, Day 6: Machine, Day 7: Compete
 */
export const DAY_DRILL_TYPE: Record<number, DrillType> = {
  1: 'tee', 2: 'tee', 3: 'flips', 4: 'flips', 5: 'overhand', 6: 'machine', 7: 'compete',
};

export const DAY_LABELS: Record<number, string> = {
  1: 'Learn the Move', 2: 'Reinforce', 3: 'Transfer to Flips', 4: 'Stabilize',
  5: 'Overhand Transfer', 6: 'Machine Challenge', 7: 'Compete & Review',
};

// ═══════════════════════════════════════════════════════════════════════════════
// MASTER TAGGED DRILL LIBRARY
// ═══════════════════════════════════════════════════════════════════════════════

export const TAGGED_DRILLS: TaggedDrill[] = [
  // ── TEE DRILLS ──
  { id: 'high-tee-normal', name: 'High Tee Normal Swing', shortDescription: 'Base swing at top of zone.', whatItFixes: 'Inconsistent barrel, no base pattern.', focusCue: 'Low line drives through the middle.', drillType: 'tee', topicIds: ['popping-up', 'weak-contact', 'no-power', 'losing-posture'], videoUrl: '' },
  { id: 'high-tee-stop', name: 'High Tee — Stop at Contact', shortDescription: 'Freeze at contact. Check everything.', whatItFixes: 'Flying open, losing positions.', focusCue: 'Check your work.', drillType: 'tee', topicIds: ['rolling-over', 'pulling-off', 'losing-posture', 'disconnected'], videoUrl: '' },
  { id: 'inside-tee', name: 'Inside Tee', shortDescription: 'Set tee up and in. Turn barrel early.', whatItFixes: 'Getting jammed, slow barrel.', focusCue: 'Turn it. Stay tight.', drillType: 'tee', topicIds: ['getting-jammed', 'no-bat-speed'], videoUrl: '' },
  { id: 'away-tee', name: 'Away Tee', shortDescription: 'Set tee low and away. Posture adjusts.', whatItFixes: 'Can\'t go oppo, reaching.', focusCue: 'Get down with the body.', drillType: 'tee', topicIds: ['no-oppo', 'pulling-off', 'losing-posture'], videoUrl: '' },
  { id: 'deep-tee', name: 'Deep Tee', shortDescription: 'Set tee behind front hip.', whatItFixes: 'Barrel drags, can\'t catch ball deep.', focusCue: 'Turn it behind you.', drillType: 'tee', topicIds: ['rolling-over', 'getting-jammed', 'no-bat-speed'], videoUrl: '' },
  { id: 'out-front-tee', name: 'Out Front Tee', shortDescription: 'Set tee out in front. Extend through.', whatItFixes: 'No extension, cutting across.', focusCue: 'Through the middle.', drillType: 'tee', topicIds: ['rolling-over', 'weak-contact', 'no-power', 'foul-balls'], videoUrl: '' },
  { id: 'no-roll-overs', name: 'No Roll Overs', shortDescription: 'Release top hand after contact.', whatItFixes: 'Rolling over, killing extension.', focusCue: 'Let it fly.', drillType: 'tee', topicIds: ['rolling-over', 'weak-contact'], videoUrl: '' },
  { id: 'pvc-pipe', name: 'PVC Pipe Swings', shortDescription: 'Hold PVC behind back. Feel plane.', whatItFixes: 'Off-plane swing, pop-ups.', focusCue: 'Match the plane.', drillType: 'tee', topicIds: ['popping-up', 'losing-posture'], videoUrl: '' },
  { id: 'low-away-tee', name: 'Low Away Tee (Preset)', shortDescription: 'Set tee low away. Body adjusts.', whatItFixes: 'Reaching with arms, poor posture.', focusCue: 'Get down with your body.', drillType: 'tee', topicIds: ['popping-up', 'losing-posture', 'no-oppo'], videoUrl: '' },
  { id: 'connection-ball', name: 'Connection Ball Drill', shortDescription: 'Ball between forearms. Stay connected.', whatItFixes: 'Arms separating, casting.', focusCue: 'Stay tight.', drillType: 'tee', topicIds: ['disconnected', 'rolling-over'], videoUrl: '' },
  { id: 'steering-wheel', name: 'Steering Wheel Turns', shortDescription: 'Rotate hands like steering wheel.', whatItFixes: 'Long bat path, slow barrel.', focusCue: 'Turn the wheel.', drillType: 'tee', topicIds: ['getting-jammed', 'no-bat-speed', 'disconnected'], videoUrl: '' },
  { id: 'snap-series', name: 'Snap Series', shortDescription: 'Snap barrel around head quickly.', whatItFixes: 'Slow barrel entry.', focusCue: 'Snap it.', drillType: 'tee', topicIds: ['no-bat-speed', 'getting-jammed'], videoUrl: '' },
  { id: 'bat-on-shoulder', name: 'Bat on Shoulder Drill', shortDescription: 'Bat rests on shoulder. Body leads.', whatItFixes: 'All arms, body not leading.', focusCue: 'Body first.', drillType: 'tee', topicIds: ['disconnected', 'weak-contact'], videoUrl: '' },
  { id: 'fence-constraint', name: 'Fence Constraint Drill', shortDescription: 'Swing near fence without hitting it.', whatItFixes: 'Casting, arms take over.', focusCue: 'Tight turns.', drillType: 'tee', topicIds: ['disconnected', 'no-bat-speed'], videoUrl: '' },
  { id: 'freddie-drill', name: 'Freddie\'s Drill', shortDescription: 'Inside pitch, drive oppo.', whatItFixes: 'Pulling off, losing posture.', focusCue: 'Hit it mid oppo.', drillType: 'tee', topicIds: ['pulling-off', 'no-oppo'], videoUrl: '' },
  { id: 'trout-step', name: 'Trout Step Drill', shortDescription: 'Step toward oppo during swing.', whatItFixes: 'Pulling off, no direction.', focusCue: 'Step through oppo.', drillType: 'tee', topicIds: ['pulling-off', 'no-oppo'], videoUrl: '' },
  { id: 'mo-vaughn', name: 'Mo Vaughn Drill', shortDescription: 'Wide stance, stay low.', whatItFixes: 'Standing up through contact.', focusCue: 'Stay in your legs.', drillType: 'tee', topicIds: ['losing-posture', 'popping-up'], videoUrl: '' },
  { id: 'rhythm-rocker', name: 'Rhythm Rocker Drill', shortDescription: 'Rock weight before pitch.', whatItFixes: 'No rhythm, stiff.', focusCue: 'Find your rhythm.', drillType: 'tee', topicIds: ['no-rhythm', 'always-late'], videoUrl: '' },
  { id: 'load-launch-swing', name: 'Load → Launch → Swing', shortDescription: 'Three distinct phases.', whatItFixes: 'Rushing, sequence breakdown.', focusCue: 'Load. Land. Go.', drillType: 'tee', topicIds: ['always-late', 'always-early', 'no-rhythm'], videoUrl: '' },
  { id: 'heel-load', name: 'Heel Load Drill', shortDescription: 'Time load off the heel.', whatItFixes: 'Drifting forward.', focusCue: 'Start early, ride it out.', drillType: 'tee', topicIds: ['always-late', 'always-early'], videoUrl: '' },
  { id: 'pause-stride', name: 'Pause Stride Drill', shortDescription: 'Stride and pause 1 second. Then swing.', whatItFixes: 'Rushing the stride.', focusCue: 'Be early to launch.', drillType: 'tee', topicIds: ['always-late', 'no-rhythm'], videoUrl: '' },
  { id: 'delay-load', name: 'Delay Load Drill', shortDescription: 'Delay your load slightly.', whatItFixes: 'Committing too early.', focusCue: 'See it longer.', drillType: 'tee', topicIds: ['always-early', 'cant-hit-offspeed'], videoUrl: '' },
  { id: 'two-ball-tee', name: '2-Ball High/Low Tee', shortDescription: 'Two tees. Coach calls height.', whatItFixes: 'Can\'t adjust to pitch height.', focusCue: 'Same swing, different posture.', drillType: 'tee', topicIds: ['cant-adjust-height', 'popping-up'], videoUrl: '' },
  { id: 'random-tee', name: 'Random Tee Locations', shortDescription: 'Coach moves tee between reps.', whatItFixes: 'Only good at one location.', focusCue: 'Adjust, don\'t guess.', drillType: 'tee', topicIds: ['cant-adjust-height', 'cant-hit-offspeed'], videoUrl: '' },
  { id: 'happy-gilmore', name: 'Happy Gilmore Drill', shortDescription: 'Walking start into swing.', whatItFixes: 'Dead legs, no momentum.', focusCue: 'Use the ground.', drillType: 'tee', topicIds: ['no-power', 'weak-contact', 'no-rhythm'], videoUrl: '' },
  { id: 'reverse-grip', name: 'Reverse Grip Drill', shortDescription: 'Grip bat in reverse. Forces tight path.', whatItFixes: 'Casting, long swing.', focusCue: 'Short to the ball.', drillType: 'tee', topicIds: ['no-bat-speed', 'disconnected'], videoUrl: '' },
  { id: 'bottom-hand-throws', name: 'Bottom Hand Throws', shortDescription: 'Toss ball to screen with bottom hand.', whatItFixes: 'No direction, everything pulls.', focusCue: 'Drive through center.', drillType: 'tee', topicIds: ['pulling-off', 'no-oppo'], videoUrl: '' },

  // ── FLIPS / FRONT TOSS DRILLS ──
  { id: 'go-drill', name: 'Go Drill', shortDescription: 'Coach says "Go" at release.', whatItFixes: 'Late trigger, slow hands.', focusCue: 'Be ready before the ball.', drillType: 'flips', topicIds: ['always-late', 'foul-balls'], videoUrl: '' },
  { id: 'command-drill', name: 'Command Drill', shortDescription: 'Start in launch. React to location.', whatItFixes: 'Late trigger, inconsistent timing.', focusCue: 'Fire from the same spot.', drillType: 'flips', topicIds: ['always-late', 'foul-balls', 'no-rhythm'], videoUrl: '' },
  { id: 'variable-front-toss', name: 'Variable Front Toss', shortDescription: 'Toss to random locations.', whatItFixes: 'Can\'t adjust to location.', focusCue: 'See it longer. Match the plane.', drillType: 'flips', topicIds: ['cant-hit-offspeed', 'cant-adjust-height', 'chasing'], videoUrl: '' },
  { id: 'yes-no-drill', name: 'Yes/No Drill', shortDescription: 'Swing at strikes. Take balls.', whatItFixes: 'Chasing, no zone discipline.', focusCue: 'Yes yes yes no.', drillType: 'flips', topicIds: ['chasing', 'cant-hit-offspeed', 'strikeout-prone', 'no-plan'], videoUrl: '' },
  { id: 'oppo-field-round', name: 'Opposite Field Only Round', shortDescription: 'Every ball goes oppo.', whatItFixes: 'Can\'t hit the other way.', focusCue: 'Through the gap.', drillType: 'flips', topicIds: ['no-oppo', 'pulling-off'], videoUrl: '' },
  { id: 'front-toss-stop', name: 'Front Toss — Stop at Contact', shortDescription: 'Swing and freeze on moving ball.', whatItFixes: 'Loose barrel on moving ball.', focusCue: 'Tight turns. Check every position.', drillType: 'flips', topicIds: ['rolling-over', 'disconnected', 'losing-posture'], videoUrl: '' },
  { id: 'zone-hunting', name: 'Zone Hunting Round', shortDescription: 'Pick one zone. Only swing there.', whatItFixes: 'No plan, swings at everything.', focusCue: 'Hunt your pitch.', drillType: 'flips', topicIds: ['no-plan', 'chasing', 'too-passive'], videoUrl: '' },
  { id: 'count-hitting', name: 'Count Hitting Round', shortDescription: 'Simulate counts. Adjust approach.', whatItFixes: 'No count awareness.', focusCue: 'Win the count.', drillType: 'flips', topicIds: ['no-plan', 'too-passive', 'strikeout-prone'], videoUrl: '' },
  { id: 'take-until-strike', name: 'Take Until Strike', shortDescription: 'Don\'t swing until you see a strike.', whatItFixes: 'Chasing, no discipline.', focusCue: 'Earn the right to swing.', drillType: 'flips', topicIds: ['chasing', 'no-plan'], videoUrl: '' },
  { id: 'damage-round', name: 'Damage Round', shortDescription: 'Max intent every swing.', whatItFixes: 'Too passive, no damage.', focusCue: 'Don\'t miss your pitch.', drillType: 'flips', topicIds: ['too-passive', 'weak-contact', 'no-power'], videoUrl: '' },

  // ── OVERHAND DRILLS ──
  { id: 'swing-at-release', name: 'Swing at Release', shortDescription: 'Trigger to pitcher\'s release.', whatItFixes: 'Late timing, reacting.', focusCue: 'See it, go.', drillType: 'overhand', topicIds: ['always-late', 'foul-balls', 'no-rhythm'], videoUrl: '' },
  { id: 'overhand-oppo', name: 'Overhand Oppo Round', shortDescription: 'Overhand BP, all oppo.', whatItFixes: 'Can\'t use oppo at game speed.', focusCue: 'Deep and through.', drillType: 'overhand', topicIds: ['no-oppo', 'pulling-off'], videoUrl: '' },
  { id: 'overhand-middle', name: 'Overhand Middle Round', shortDescription: 'Overhand BP, all middle.', whatItFixes: 'Can\'t center the ball.', focusCue: 'Through the middle.', drillType: 'overhand', topicIds: ['rolling-over', 'foul-balls', 'weak-contact'], videoUrl: '' },
  { id: 'overhand-timing', name: 'Overhand Timing Focus', shortDescription: 'Overhand with timing cues only.', whatItFixes: 'Timing breaks at game speed.', focusCue: 'Be on time.', drillType: 'overhand', topicIds: ['always-late', 'always-early', 'no-rhythm'], videoUrl: '' },
  { id: '3-pitch-ab', name: '3-Pitch At-Bat Simulation', shortDescription: '3-pitch at-bats with full plan.', whatItFixes: 'No at-bat plan.', focusCue: 'Have a plan. Execute.', drillType: 'overhand', topicIds: ['no-plan', 'bp-hitter', 'strikeout-prone'], videoUrl: '' },

  // ── MACHINE DRILLS ──
  { id: 'fb-only-machine', name: 'Fastball Only Machine', shortDescription: 'Consistent FB. Be on time.', whatItFixes: 'Can\'t time live velocity.', focusCue: 'Same swing. Real velocity.', drillType: 'machine', topicIds: ['always-late', 'foul-balls', 'bp-hitter'], videoUrl: '' },
  { id: 'velocity-ladder', name: 'Velocity Ladder', shortDescription: 'Increase speed every 5 swings.', whatItFixes: 'Only comfortable at one speed.', focusCue: 'Push the speed.', drillType: 'machine', topicIds: ['always-late', 'no-bat-speed', 'weak-contact'], videoUrl: '' },
  { id: 'fb-in-machine', name: 'Fastball In — Machine', shortDescription: 'Machine set inside.', whatItFixes: 'Getting jammed on inside FB.', focusCue: 'Turn it. Drive it.', drillType: 'machine', topicIds: ['getting-jammed', 'no-bat-speed'], videoUrl: '' },
  { id: 'fb-away-machine', name: 'Fastball Away — Machine', shortDescription: 'Machine set away.', whatItFixes: 'Can\'t drive outside pitch.', focusCue: 'Let it travel. Deep and through.', drillType: 'machine', topicIds: ['no-oppo', 'pulling-off', 'cant-hit-offspeed'], videoUrl: '' },
  { id: 'random-pitch-machine', name: 'Random Pitch Machine', shortDescription: 'Mix speeds and locations.', whatItFixes: 'Only comfortable with one type.', focusCue: 'See ball, hit ball.', drillType: 'machine', topicIds: ['cant-hit-offspeed', 'bp-hitter', 'chasing'], videoUrl: '' },
  { id: 'breaking-ball-round', name: 'Breaking Ball Round', shortDescription: 'Breaking balls only.', whatItFixes: 'Can\'t hit breaking stuff.', focusCue: 'See it longer. Let it break.', drillType: 'machine', topicIds: ['cant-hit-offspeed', 'cant-adjust-height'], videoUrl: '' },
  { id: '2-strike-machine', name: '2-Strike Machine', shortDescription: 'Every swing starts 0-2.', whatItFixes: 'Bad 2-strike approach.', focusCue: 'Compete. Battle.', drillType: 'machine', topicIds: ['strikeout-prone', 'chasing', 'bp-hitter'], videoUrl: '' },
  { id: 'sit-fb-round', name: 'Sit Fastball Round', shortDescription: 'Sit on FB only. Take offspeed.', whatItFixes: 'Can\'t time fastball.', focusCue: 'On time for fastball.', drillType: 'machine', topicIds: ['always-late', 'too-passive'], videoUrl: '' },

  // ── COMPETE / TRANSFER DRILLS ──
  { id: 'line-drive-challenge', name: 'Line Drive Challenge', shortDescription: 'First to 5 line drives wins.', whatItFixes: 'No accountability for contact quality.', focusCue: 'Line drives only.', drillType: 'compete', topicIds: ['rolling-over', 'popping-up', 'weak-contact', 'foul-balls'], videoUrl: '' },
  { id: '2-strike-battle', name: '2-Strike Battle Round', shortDescription: 'Every AB starts 0-2.', whatItFixes: 'Folds under 2-strike pressure.', focusCue: 'Battle. Compete.', drillType: 'compete', topicIds: ['strikeout-prone', 'chasing', 'bp-hitter', 'too-passive'], videoUrl: '' },
  { id: '21-outs-game', name: '21 Outs Game', shortDescription: 'Score points. Line drive = 2, ground ball = 1.', whatItFixes: 'No competitive focus.', focusCue: 'Every swing counts.', drillType: 'compete', topicIds: ['bp-hitter', 'weak-contact', 'no-power', 'no-plan'], videoUrl: '' },
  { id: 'oppo-challenge', name: 'Opposite Field Challenge', shortDescription: 'Only oppo line drives count.', whatItFixes: 'Can\'t direct under pressure.', focusCue: 'Oppo on demand.', drillType: 'compete', topicIds: ['no-oppo', 'pulling-off'], videoUrl: '' },
  { id: 'consecutive-hard-hit', name: 'Consecutive Hard-Hit Challenge', shortDescription: 'How many hard-hit in a row?', whatItFixes: 'Inconsistent contact.', focusCue: 'Stack quality.', drillType: 'compete', topicIds: ['weak-contact', 'foul-balls', 'no-power', 'disconnected'], videoUrl: '' },
  { id: 'hr-derby-pull', name: 'Pull-Side HR Derby', shortDescription: 'Full pull swings. Points for distance.', whatItFixes: 'No turn-on ability.', focusCue: 'Turn it loose.', drillType: 'compete', topicIds: ['no-power', 'no-bat-speed', 'weak-contact'], videoUrl: '' },
];

// ── Lookup helpers ──

export function getDrillsForTopicAndType(topicId: string, drillType: DrillType): TaggedDrill[] {
  return TAGGED_DRILLS.filter((d) => d.topicIds.includes(topicId) && d.drillType === drillType);
}

export function getDrillsForTopic(topicId: string): TaggedDrill[] {
  return TAGGED_DRILLS.filter((d) => d.topicIds.includes(topicId));
}

export function getDrillById(id: string): TaggedDrill | undefined {
  return TAGGED_DRILLS.find((d) => d.id === id);
}
