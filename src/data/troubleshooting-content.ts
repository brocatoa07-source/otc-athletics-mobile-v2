/**
 * Troubleshooting Content — Phase 2
 *
 * Rich education content, topic explanations, and 7-day practice plans.
 * Separate from the engine (troubleshooting-engine.ts) to keep data/logic clean.
 *
 * This file provides:
 *   - Category education content (what, why, signs)
 *   - Topic deep content (what's happening, why, good/bad examples)
 *   - 7-day practice plan templates
 *   - Drill environment mapping (tee/flips/overhand/machine)
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface CategoryEducation {
  categoryId: string;
  whatItIncludes: string;
  whyYouStruggle: string[];
  signsThisIsYou: string[];
}

export type DrillEnvironment = 'tee' | 'flips' | 'overhand' | 'machine' | 'live';

export interface PracticeDayPlan {
  day: number;
  label: string;
  environment: DrillEnvironment;
  focus: string;
  drills: string[];
  duration: string;
  note?: string;
}

export interface DrillProgressionGroup {
  stage: 'foundation' | 'skill-building' | 'transfer';
  label: string;
  drills: string[];
}

export interface TopicContent {
  topicId: string;
  whatsHappening: string;
  whyItHappens: string[];
  /** What the hitter needs to learn (optional — shown when present) */
  whatToLearn?: string[];
  whatBadLooksLike: string;
  whatGoodLooksLike: string;
  /** Placeholder video refs — empty string means no video yet */
  badVideoUrl: string;
  goodVideoUrl: string;
  practicePlan: PracticeDayPlan[];
  /** Structured drill progression (Foundation → Skill → Transfer). Shown when present. */
  drillProgression?: DrillProgressionGroup[];
  /** Coaching cues — shown when present. Empty array = show empty section. */
  cues?: string[];
  /** Outcome challenges — shown when present. Empty array = show empty section. */
  outcomeChallenges?: string[];
  /** Feels — shown when present. Empty array = show empty section. */
  feels?: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT 7-DAY PLAN BUILDER
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Builds a standard 7-day practice plan from a drill list.
 * Day 1-2: Tee, Day 3-4: Flips, Day 5: Overhand, Day 6: Machine, Day 7: Compete.
 */
export function buildDefaultPlan(drills: string[]): PracticeDayPlan[] {
  const tee = drills.slice(0, 3);
  const flips = drills.length > 2 ? drills.slice(1, 4) : drills;
  const transfer = drills.length > 1 ? drills.slice(0, 2) : drills;

  return [
    { day: 1, label: 'Learn the Move', environment: 'tee', focus: 'Feel the correct position. Slow reps. Quality over quantity.', drills: tee, duration: '20 min' },
    { day: 2, label: 'Reinforce the Move', environment: 'tee', focus: 'Same drills. Build consistency. Stop at contact often.', drills: tee, duration: '20 min' },
    { day: 3, label: 'Move to Flips', environment: 'flips', focus: 'Transfer the tee feel to a moving ball. Keep it simple.', drills: flips, duration: '20 min' },
    { day: 4, label: 'Stabilize Under Movement', environment: 'flips', focus: 'Front toss with intent. Feel the change happening.', drills: flips, duration: '20 min' },
    { day: 5, label: 'Overhand Transfer', environment: 'overhand', focus: 'Take the skill to overhand BP. Keep the same cues.', drills: transfer, duration: '20 min' },
    { day: 6, label: 'Machine Challenge', environment: 'machine', focus: 'Test against real velocity. Stay committed to the change.', drills: transfer, duration: '20 min' },
    { day: 7, label: 'Compete & Review', environment: 'live', focus: 'Mixed reps. Compete. Review what stuck and what needs more work.', drills: drills.slice(0, 2), duration: '20 min', note: 'Save your best cue to Playbook.' },
  ];
}

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORY EDUCATION CONTENT
// ═══════════════════════════════════════════════════════════════════════════════

export const CATEGORY_EDUCATION: Record<string, CategoryEducation> = {
  timing: {
    categoryId: 'timing',
    whatItIncludes: 'Timing is about when your swing starts, how your rhythm gets you to launch position, how fast you can launch from that position, and how well you can hold and adjust. Timing is not just "be on time." It includes rhythm, launch quickness, adjustability, and true timing against real ball flight. The core philosophy: always be ready for the best fastball a pitcher can throw. If you are on time for the best fastball, you can adjust to anything slower.',
    whyYouStruggle: [
      'Your rhythm starts too late or is too big',
      'You are not getting to launch position early enough',
      'You cannot launch fast enough FROM launch position',
      'You rush and speed everything up instead of being smooth',
      'You commit too early and can\'t adjust',
      'You don\'t train against enough chaos (overhand, machine, live)',
      'You are not timing the fastest version of the fastball',
      'Your move size is too big for the velocity you face',
    ],
    signsThisIsYou: [
      'Always late on fastballs',
      'Always early on offspeed',
      'Feel rushed every at-bat',
      'No rhythm — stiff and tense',
      'Struggle with velocity',
      'Good off tee but bad in games',
      'Get jammed because of timing',
      'Commit too early',
    ],
  },
  contact: {
    categoryId: 'contact',
    whatItIncludes: 'This section covers everything related to hitting the baseball — barrel control, contact quality, power, bat speed, and connection. Great hitters control where they hit it, how they hit it, and how hard they hit it. Problems in this section range from barrel control issues (rolling over, popping up, fouling off) to output issues (weak contact, low exit velo, no power, slow bat speed, disconnected swing). Not all contact and power problems are swing problems — many are strength and force production problems. This section diagnoses the cause and routes to the right solution.',
    whyYouStruggle: [
      'Poor barrel control — barrel works around the ball instead of through it',
      'Contact point is inconsistent — too deep or too far out front',
      'Poor connection — force doesn\'t chain from ground to barrel',
      'Low bat speed — barrel can\'t get there fast enough',
      'Lack of physical strength — not enough force production for this level',
      'Low intent — not swinging to do damage',
      'No ball flight awareness — don\'t know what contact should produce',
    ],
    signsThisIsYou: [
      'Rolling over to weak ground balls',
      'Pop-ups and fly balls with no carry',
      'Getting jammed on inside pitches',
      'Fouling balls off instead of putting them in play',
      'Weak contact — ball dies off the bat',
      'Low exit velocity even on centered hits',
      'Swing feels slow or disconnected',
      'No backspin, no authority, no carry',
    ],
  },
  posture: {
    categoryId: 'posture',
    whatItIncludes: 'Posture and direction go together. If posture is lost, direction is usually lost. If direction is lost, the barrel cuts across the ball instead of working through it. This section covers pulling off, standing up through contact, losing side bend, spinning off the ball, and struggling to go opposite field. These are all expressions of the same underlying issue: the barrel is working around the ball instead of through it. We want north-south through the baseball, not east-west around it.',
    whyYouStruggle: [
      'Your front side flies open before contact',
      'You lose side bend over the plate',
      'You stand up through contact instead of staying in the swing',
      'You spin off the ball instead of staying through it',
      'You cut your swing off instead of finishing through',
      'Your barrel works around the ball instead of through it',
      'Posture and direction break down together',
    ],
    signsThisIsYou: [
      'Can\'t go opposite field',
      'Everything pulls — ground balls and line drives',
      'Slice balls foul to the pull side',
      'Stand up through contact',
      'Spin off the ball instead of finishing through',
      'Lose backspin to middle and oppo',
      'Feel like you come out of the swing early',
      'Misses always go one direction',
    ],
  },
  adjustability: {
    categoryId: 'adjustability',
    whatItIncludes: 'Adjustability is the ability to be ready for the best fastball and still adjust to anything slower, different, or in a different location. It is not freezing the body. It is controlling the move long enough for the hands and barrel to launch on time. This section covers offspeed, chasing, and pitch height adjustability. Timing, recognition, and decision-making are trained here — not just mechanics. Tee and flips train the movement. Overhand and machine train the decision. Competition trains the transfer.',
    whyYouStruggle: [
      'Timing problem — late on fastball so everything looks like a strike',
      'Hands leak forward — barrel depth is lost before contact',
      'No hold in the move — commit too early and can\'t adjust',
      'Poor pitch recognition — can\'t read spin or speed change',
      'No approach — reacting instead of hunting',
      'Not training against variable speed and chaos',
      'Only practicing mechanics, not decisions',
    ],
    signsThisIsYou: [
      'Out in front on changeups and offspeed',
      'Swinging over breaking balls',
      'Chasing spin down and out of the zone',
      'Zone expands with velocity',
      'Late on fastball, early on offspeed',
      'Only hits belt-high pitches well',
      'Caught between speeds — in no-man\'s land',
      'Takes good pitches, swings at bad ones',
    ],
  },
  approach: {
    categoryId: 'approach',
    whatItIncludes: 'Hitting in games is a decision-making skill, not just a swing skill. Most hitters train mechanics too much and decision making too little. This section covers approach, count leverage, zone control, situational hitting, pressure training, and transferring practice to games. BP success does not equal game success. If practice is easier than the game, the game speeds up. If practice is harder than the game, the game slows down. The goal is to build game hitters, not cage hitters.',
    whyYouStruggle: [
      'No plan — walk up and react instead of hunting',
      'No count awareness — same approach every pitch',
      'Too passive — watch good pitches, afraid to commit',
      'Practice doesn\'t simulate games — predictable, no pressure, no consequences',
      'No 2-strike adjustment — same swing regardless of count',
      'Pressing in games instead of competing',
      'Train mechanics, not decisions — cage hitter, not game hitter',
    ],
    signsThisIsYou: [
      'Good in BP, bad in games',
      'No idea what pitch you\'re looking for',
      'Watch hittable pitches go by',
      'Strikeout too much — especially with 2 strikes',
      'Chase bad pitches, take good ones',
      'Tense up in big moments',
      'Same approach regardless of count or situation',
      'Can\'t execute situational hitting',
    ],
  },
  power: {
    categoryId: 'power',
    whatItIncludes: 'This section connects the Hitting Vault to physical development programs. If your power, bat speed, or exit velocity problem is physical — not just a swing skill issue — this is where you find the programs to fix it. Strength and rotational power raise your power ceiling. Bat speed training helps you use that strength faster. Troubleshooting topics for weak contact, bat speed, connection, and power are in the Contact, Barrel & Power section. This section routes you to the right program.',
    whyYouStruggle: [
      'Drills alone can\'t fix a physical limitation',
      'Need more rotational force production',
      'Need faster barrel speed (neural training)',
      'Need more overall strength for this level',
      'Not training power outside the cage',
    ],
    signsThisIsYou: [
      'Exit velo is low despite good connection and timing',
      'Can\'t drive the ball despite making good contact',
      'Physically weaker than competition',
      'Barrel speed plateaued despite drill work',
      'Need a structured strength or bat speed program',
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// TOPIC CONTENT — deep content for each topic
// ═══════════════════════════════════════════════════════════════════════════════

export const TOPIC_CONTENT: Record<string, TopicContent> = {
  // ── TIMING ──
  'always-late': {
    topicId: 'always-late',
    whatsHappening: 'Your swing starts after the ball has already arrived. You see the pitch but can\'t get the barrel there on time. Late foul balls, getting jammed, and constantly feeling behind are the result.',
    whyItHappens: [
      'Your load/stride sequence starts too late',
      'You\'re reacting to the ball instead of anticipating',
      'Your rhythm is dead — no pre-pitch movement',
      'You\'re waiting to see the pitch perfectly before you commit',
    ],
    whatBadLooksLike: 'Late trigger, barrel drags, foul balls straight back, jammed contact, body rushed.',
    whatGoodLooksLike: 'Early load, smooth ride into launch, barrel arrives on time, balanced contact, no panic.',
    badVideoUrl: '', goodVideoUrl: '',
    practicePlan: buildDefaultPlan(['Go Drill', 'Heel Load Drill', 'Swing at Release', 'Rhythm Rocker Drill']),
  },
  'always-early': {
    topicId: 'always-early',
    whatsHappening: 'You\'re out in front of everything. Your body goes before your eyes confirm what the pitch is doing. You pull off offspeed and lunge at breaking balls.',
    whyItHappens: [
      'You commit your body before your eyes confirm the pitch',
      'Your timing window is too rigid — you can\'t hold and adjust',
      'You\'re anxious to swing and don\'t let the pitch travel',
      'No training against mixed speeds',
    ],
    whatBadLooksLike: 'Lunging forward, way out front on offspeed, pulling off, weight shift too early.',
    whatGoodLooksLike: 'Holds launch position. Adjusts late. Ready for fast, adjusts to slow.',
    badVideoUrl: '', goodVideoUrl: '',
    practicePlan: buildDefaultPlan(['Rapid Fire Side Flips', 'Variable Front Toss', '7 Ball Drill', 'Color Ball Drill']),
  },
  'no-rhythm': {
    topicId: 'no-rhythm',
    whatsHappening: 'You feel stiff, tense, and robotic in the box. No flow. No rhythm. Your body is locked up before the pitch even arrives.',
    whyItHappens: [
      'You\'re overthinking mechanics',
      'No pre-pitch movement or weight shift',
      'Tension in your hands, jaw, or shoulders',
      'You don\'t have a personal timing mechanism',
    ],
    whatBadLooksLike: 'Static stance, dead legs, tension in hands, stiff swing, no flow.',
    whatGoodLooksLike: 'Loose hands, gentle rhythm, relaxed body, smooth flow into launch.',
    badVideoUrl: '', goodVideoUrl: '',
    practicePlan: buildDefaultPlan(['Rhythm Rockers', 'Heel Load', 'Step Back Drill', 'Happy Gilmore']),
  },
  'feel-rushed': {
    topicId: 'feel-rushed',
    whatsHappening: 'Everything feels fast. You can\'t slow it down. Your move to launch is panicked and you never feel like you have enough time.',
    whyItHappens: [
      'You start your move too late — not too slow',
      'You are rushing TO launch instead of being fast FROM launch',
      'Your move is too big for the velocity you face',
      'You don\'t get to launch early enough to be ready',
    ],
    whatBadLooksLike: 'Panicked swing, rushed load, no control, everything feels too fast.',
    whatGoodLooksLike: 'Smooth early move. Gets to launch early. Fast FROM launch, not TO launch.',
    badVideoUrl: '', goodVideoUrl: '',
    practicePlan: buildDefaultPlan(['Rhythm Rockers', 'Heel Load', 'Belli\'s / Hover', 'Command Drill', 'Go Drill', 'Swing At Release']),
  },
  'struggle-with-velocity': {
    topicId: 'struggle-with-velocity',
    whatsHappening: 'You can\'t catch up to hard throwers. The ball is on you before your swing is ready. You feel behind on every fastball over 90.',
    whyItHappens: [
      'Your move to launch takes too long',
      'You are not ready for the BEST fastball — you are ready for average',
      'Your timing window is set to a slower speed',
      'You don\'t train enough against real velocity',
    ],
    whatBadLooksLike: 'Late on every fastball. Jammed. Foul balls straight back. Swing feels slow.',
    whatGoodLooksLike: 'Ready for the fastest pitch. Gets to launch early. Smaller move, faster launch.',
    badVideoUrl: '', goodVideoUrl: '',
    practicePlan: buildDefaultPlan(['Belli\'s / Hover', 'Command Drill', 'Rapid Fire Side Flips', 'Go Drill', 'Swing At Release', 'Overhand Timing Focus', '7 Ball Drill', 'Mixed Machine']),
  },
  'commit-too-early': {
    topicId: 'commit-too-early',
    whatsHappening: 'Your body goes before your eyes confirm the pitch. You decide to swing before you actually see what the pitch is doing. You can\'t adjust once you start.',
    whyItHappens: [
      'You are deciding too early in the pitch\'s flight',
      'You don\'t hold your launch position long enough',
      'You are guessing instead of seeing',
      'No training on discipline or recognition drills',
    ],
    whatBadLooksLike: 'Commits before seeing the pitch. Can\'t adjust. Swings at everything. Guesses.',
    whatGoodLooksLike: 'Holds and decides. Sees the lane. Ready but not committed. Adjusts late.',
    badVideoUrl: '', goodVideoUrl: '',
    practicePlan: buildDefaultPlan(['7 Ball Drill', 'Color Ball Drill', 'Mixed Machine', 'Variable Front Toss']),
  },

  // ── CONTACT ──
  'rolling-over': {
    topicId: 'rolling-over',
    whatsHappening: 'The barrel works around the ball instead of through it. The result is weak ground balls to the pull side — the ball hits the ground before it has a chance to carry. This is a ball flight problem caused by poor barrel direction through the contact zone.',
    whyItHappens: [
      'Poor swing direction — cutting across the ball',
      'Contact point too deep — ball gets behind you',
      'Early barrel dump — top hand rolls over too early',
      'Losing posture through the swing',
      'No extension through the zone',
    ],
    whatToLearn: [
      'Better direction through contact',
      'Better barrel path through the ball',
      'Better contact point (not too deep)',
      'Maintain posture through the swing',
      'Keep the barrel in the zone longer',
    ],
    whatBadLooksLike: 'Weak pull-side ground balls, hooked balls, barrel rolls over at contact, no extension.',
    whatGoodLooksLike: 'Barrel stays through the zone longer. Direction through the ball. Line drives, not rollovers.',
    badVideoUrl: '', goodVideoUrl: '',
    drillProgression: [
      { stage: 'foundation', label: 'Foundation', drills: ['High Tee — Stop at Contact', 'Deep Tee', 'Out Front Tee'] },
      { stage: 'skill-building', label: 'Skill Building', drills: ['Swing Over Tee', 'Split Grip Swings'] },
      { stage: 'transfer', label: 'Transfer', drills: ['Front Toss — Stop at Contact', 'Side Flips — Different Contact Points', 'Arise Deep Tee Flips'] },
    ],
    cues: [],
    outcomeChallenges: [],
    practicePlan: [
      { day: 1, label: 'Foundation — Learn the Move', environment: 'tee', focus: 'Feel the correct barrel path. Slow reps. Stop at contact.', drills: ['High Tee — Stop at Contact', 'Deep Tee', 'Out Front Tee'], duration: '20 min' },
      { day: 2, label: 'Foundation — Reinforce', environment: 'tee', focus: 'Same drills. Build consistency. Check barrel path every rep.', drills: ['High Tee — Stop at Contact', 'Swing Over Tee', 'Split Grip Swings'], duration: '20 min' },
      { day: 3, label: 'Skill Building — Control Barrel', environment: 'flips', focus: 'Transfer the barrel path to a moving ball.', drills: ['Front Toss — Stop at Contact', 'Side Flips — Different Contact Points'], duration: '20 min' },
      { day: 4, label: 'Skill Building — Stabilize', environment: 'flips', focus: 'Control direction against different pitch locations.', drills: ['Arise Deep Tee Flips', 'Side Flips — Different Contact Points'], duration: '20 min' },
      { day: 5, label: 'Transfer — Overhand', environment: 'overhand', focus: 'Keep barrel through the zone at game speed.', drills: ['Overhand Middle Round'], duration: '20 min' },
      { day: 6, label: 'Transfer — Machine', environment: 'machine', focus: 'Test barrel control against real velocity.', drills: ['Machine Timing Rounds'], duration: '20 min' },
      { day: 7, label: 'Compete & Review', environment: 'live', focus: 'Line drives only. Review what stuck.', drills: ['Line Drive Challenge'], duration: '20 min', note: 'Save your best cue to Playbook.' },
    ],
  },
  'popping-up': {
    topicId: 'popping-up',
    whatsHappening: 'The barrel gets under the ball too early. The result is pop-ups, high fly balls with no distance, and weak contact. This is a ball flight problem — the barrel works under the ball instead of through it.',
    whyItHappens: [
      'Flying open — front side opens before the barrel gets through',
      'Too much tilt too early — barrel drops under the ball',
      'Late timing and rushing — barrel has to work uphill',
      'Weak top hand — can\'t keep the barrel above the ball',
      'Trying to lift the ball instead of hitting through it',
    ],
    whatToLearn: [
      'Barrel above the ball',
      'Match swing plane to pitch plane',
      'Proper tilt and posture',
      'Strong top hand through contact',
      'Line drive contact before fly balls',
    ],
    whatBadLooksLike: 'Pop-ups, high fly balls with no carry, barrel under the ball, weak contact.',
    whatGoodLooksLike: 'Barrel above the ball. Line drives with backspin. Proper tilt and posture. Hard ground balls and line drives before fly balls.',
    badVideoUrl: '', goodVideoUrl: '',
    drillProgression: [
      { stage: 'foundation', label: 'Foundation', drills: ['High Tee — No Fly Balls', 'PVC Pipe Tilt & Posture Drill', 'Two Ball / High-Low Tee'] },
      { stage: 'skill-building', label: 'Skill Building', drills: ['Barry Bonds Tee Progression', 'Top Hand Swings (Short Bat)', 'Bottom Hand Swings (Short Bat)'] },
      { stage: 'transfer', label: 'Transfer', drills: ['Barry Bonds Flips'] },
    ],
    cues: [],
    outcomeChallenges: [],
    practicePlan: [
      { day: 1, label: 'Foundation — Learn the Move', environment: 'tee', focus: 'Barrel above the ball. Line drives only. No fly balls.', drills: ['High Tee — No Fly Balls', 'PVC Pipe Tilt & Posture Drill'], duration: '20 min' },
      { day: 2, label: 'Foundation — Reinforce', environment: 'tee', focus: 'Multi-height awareness. Adjust posture, not arms.', drills: ['Two Ball / High-Low Tee', 'High Tee — No Fly Balls'], duration: '20 min' },
      { day: 3, label: 'Skill Building — Control Barrel', environment: 'tee', focus: 'Train barrel path and hand strength at different heights.', drills: ['Barry Bonds Tee Progression', 'Top Hand Swings (Short Bat)', 'Bottom Hand Swings (Short Bat)'], duration: '20 min' },
      { day: 4, label: 'Skill Building — Transfer to Flips', environment: 'flips', focus: 'Same barrel path against a moving ball.', drills: ['Barry Bonds Flips'], duration: '20 min' },
      { day: 5, label: 'Transfer — Overhand', environment: 'overhand', focus: 'Line drives at game speed. No fly balls.', drills: ['Overhand Middle Round'], duration: '20 min' },
      { day: 6, label: 'Transfer — Machine', environment: 'machine', focus: 'Barrel control against real velocity.', drills: ['Machine Timing Rounds'], duration: '20 min' },
      { day: 7, label: 'Compete & Review', environment: 'live', focus: 'Line drives only count. Review what stuck.', drills: ['Line Drive Challenge'], duration: '20 min', note: 'Save your best cue to Playbook.' },
    ],
  },
  'getting-jammed': {
    topicId: 'getting-jammed',
    whatsHappening: 'The hitter cannot get the barrel to the inside pitch on time and in the correct path. The ball is on the hands before the barrel gets there — contact happens off the handle or end of the bat. This is a connection and direction problem.',
    whyItHappens: [
      'Late timing — barrel can\'t arrive on time',
      'Casting the barrel — hands get away from the body',
      'Losing connection between body and barrel',
      'Flying open — direction is gone before contact',
      'Too upright — no posture or tilt on inside pitches',
      'Trying to cover the whole plate instead of hunting a pitch',
    ],
    whatToLearn: [
      'Tight turn',
      'Connection',
      'Proper posture on inside pitches',
      'Direction through inside pitch',
      'Catch the ball out front on inside pitches',
    ],
    whatBadLooksLike: 'Weak pull-side contact, broken bats, foul balls, handle contact, soft contact on inside pitches.',
    whatGoodLooksLike: 'Tight turn. Connected. Barrel gets to inside pitch out front. Direction through the ball. Drive inside pitches with authority.',
    badVideoUrl: '', goodVideoUrl: '',
    drillProgression: [
      { stage: 'foundation', label: 'Foundation', drills: ['Connection Ball Drill', 'Inside Tee Swings', 'High Tee — Stop at Contact'] },
      { stage: 'skill-building', label: 'Skill Building', drills: ['Freddie Freeman Drill (Inside Pitch → Middle/Oppo)', 'Closed Stance Swings', 'Move-Ons / Trout Steps'] },
      { stage: 'transfer', label: 'Transfer', drills: ['Angled Flips (From 1B Side & 3B Side)', 'Front Hip Tee', 'Front Hip Flips'] },
    ],
    cues: [],
    outcomeChallenges: [],
    practicePlan: [
      { day: 1, label: 'Foundation — Learn the Move', environment: 'tee', focus: 'Stay connected. Tight turn. Feel the correct path.', drills: ['Connection Ball Drill', 'Inside Tee Swings', 'High Tee — Stop at Contact'], duration: '20 min' },
      { day: 2, label: 'Foundation — Reinforce', environment: 'tee', focus: 'Direction through inside pitch. Posture and connection.', drills: ['Freddie Freeman Drill', 'Closed Stance Swings', 'Move-Ons / Trout Steps'], duration: '20 min' },
      { day: 3, label: 'Skill Building — Transfer to Flips', environment: 'flips', focus: 'Handle inside flips with connection. Stay through it.', drills: ['Angled Flips (1B & 3B Side)', 'Front Hip Flips'], duration: '20 min' },
      { day: 4, label: 'Skill Building — Stabilize', environment: 'tee', focus: 'Catch the ball out front. Reinforce front hip contact.', drills: ['Front Hip Tee', 'Inside Tee Swings'], duration: '20 min' },
      { day: 5, label: 'Transfer — Overhand', environment: 'overhand', focus: 'Handle inside pitches at game speed.', drills: ['Overhand Middle Round'], duration: '20 min' },
      { day: 6, label: 'Transfer — Machine', environment: 'machine', focus: 'Inside pitch machine rounds. Stay connected.', drills: ['Fastball In — Machine'], duration: '20 min' },
      { day: 7, label: 'Compete & Review', environment: 'live', focus: 'Compete. Handle inside pitches with authority.', drills: ['Line Drive Challenge'], duration: '20 min', note: 'Save your best cue to Playbook.' },
    ],
  },
  'foul-balls': {
    topicId: 'foul-balls',
    whatsHappening: 'The hitter is close to contact but not making clean contact. Foul balls are often almost good swings — the hitter just needs better timing, launch quickness, and barrel control to turn fouls into balls in play.',
    whyItHappens: [
      'Slightly late — barrel arrives just after the ideal contact point',
      'Slightly under the ball — contact is off by inches',
      'Contact point is slightly off — not quite squared up',
      'Poor barrel control through the zone',
      'Slow launch quickness — can\'t get there fast enough',
    ],
    whatToLearn: [
      'Better timing',
      'Better launch quickness',
      'Better contact point',
      'Better barrel control',
      'Put more balls in play',
    ],
    whatBadLooksLike: 'Foul balls straight back, foul balls pull side, near-misses, close but not squared up.',
    whatGoodLooksLike: 'Clean barrel-to-ball. Squared up. Line drives and hard ground balls in play. Backspin.',
    badVideoUrl: '', goodVideoUrl: '',
    drillProgression: [
      { stage: 'foundation', label: 'Foundation', drills: ['Out Front Tee', 'Line Drive / Ground Ball Rounds'] },
      { stage: 'skill-building', label: 'Skill Building', drills: ['Command Drill (Tee)', 'Go Drill (Flips)'] },
      { stage: 'transfer', label: 'Transfer', drills: ['Pull Side Rounds (Flips or Machine)', 'Machine Timing Rounds'] },
    ],
    cues: [],
    outcomeChallenges: [],
    practicePlan: [
      { day: 1, label: 'Foundation — Learn the Move', environment: 'tee', focus: 'Out front contact. Control where the ball goes.', drills: ['Out Front Tee', 'Line Drive / Ground Ball Rounds'], duration: '20 min' },
      { day: 2, label: 'Foundation — Reinforce', environment: 'tee', focus: 'Launch quickness. Fire from launch with no extra movement.', drills: ['Command Drill', 'Out Front Tee'], duration: '20 min' },
      { day: 3, label: 'Skill Building — Transfer to Flips', environment: 'flips', focus: 'Square it up on a moving ball. Pull side line drives.', drills: ['Go Drill', 'Pull Side Rounds'], duration: '20 min' },
      { day: 4, label: 'Skill Building — Stabilize', environment: 'flips', focus: 'In play every rep. No fouls allowed.', drills: ['Pull Side Rounds', 'Go Drill'], duration: '20 min' },
      { day: 5, label: 'Transfer — Overhand', environment: 'overhand', focus: 'Barrel control at overhand speed.', drills: ['Overhand Middle Round'], duration: '20 min' },
      { day: 6, label: 'Transfer — Machine', environment: 'machine', focus: 'Square up against real velocity. In play.', drills: ['Machine Timing Rounds'], duration: '20 min' },
      { day: 7, label: 'Compete & Review', environment: 'live', focus: 'Compete. Every swing in play. Review what worked.', drills: ['Line Drive Challenge'], duration: '20 min', note: 'Save your best cue to Playbook.' },
    ],
  },

  // ── POSTURE & DIRECTION ──
  'pulling-off': {
    topicId: 'pulling-off',
    whatsHappening: 'Your front side opens before the barrel gets through the ball. This causes you to pull off, stand up through contact, lose side bend, spin off, and cut across the ball. The barrel works around the ball instead of through it. These are all connected — when posture breaks down, direction breaks down with it. You end up east-west around the ball instead of north-south through it.',
    whyItHappens: [
      'Front shoulder or hip opens too early',
      'Loss of side bend over the plate',
      'Standing up through contact instead of staying in the swing',
      'Spinning off instead of finishing through',
      'No directional intent — barrel cuts across',
      'Poor connection between body rotation and barrel path',
    ],
    whatToLearn: [
      'Posture and direction are one connected skill',
      'Stay north-south through the ball, not east-west around it',
      'Hold posture under rotation',
      'Direction through the middle and oppo, not just pull',
      'Finish through the ball — don\'t spin off',
    ],
    whatBadLooksLike: 'Front side flies open. Head pulls. Stands up through contact. Spins off. Everything pulls. Weak oppo. Sliced fouls to pull side. No backspin to middle/oppo.',
    whatGoodLooksLike: 'Stays closed through contact. Posture holds under rotation. Direction through the ball. Line drives to all fields. Backspin to middle and oppo. Balanced finish.',
    badVideoUrl: '', goodVideoUrl: '',
    drillProgression: [
      { stage: 'foundation', label: 'Tee Work / Movement Training', drills: ['High Tee — Stop at Contact', 'Deep Tee', 'In-In Tee', 'PVC Pipe Swings', 'Move & Hold / Preset Posture Turns', 'Split Stance Swings', 'Finish Holds / Stick Finish'] },
      { stage: 'skill-building', label: 'Flips / Movement Performance', drills: ['In-In Flips', 'Angled Flips (1B Side & 3B Side)', 'Bottom Hand Throws', 'Top Hand Punch', 'Short Bat Work', '3/4 Swings to Middle', '3/4 Swings to Opposite Field', 'Arraez Drill', 'Arraez Flips From Behind'] },
      { stage: 'transfer', label: 'Machine / Transfer', drills: ['Angled Machine', 'Oppo Round', 'Middle Round', 'Line Drive Round'] },
    ],
    cues: [],
    feels: [],
    outcomeChallenges: [],
    practicePlan: [
      { day: 1, label: 'Tee — Learn the Move', environment: 'tee', focus: 'Feel posture under rotation. Stop at contact. Check direction.', drills: ['High Tee — Stop at Contact', 'In-In Tee', 'PVC Pipe Swings'], duration: '20 min' },
      { day: 2, label: 'Tee — Reinforce', environment: 'tee', focus: 'Same drills. Add finish holds. Build consistency.', drills: ['Split Stance Swings', 'Finish Holds', 'Move & Hold'], duration: '20 min' },
      { day: 3, label: 'Flips — Perform the Move', environment: 'flips', focus: 'Direction and posture against a moving ball.', drills: ['In-In Flips', 'Bottom Hand Throws', '3/4 Swings to Middle'], duration: '20 min' },
      { day: 4, label: 'Flips — Direction Focus', environment: 'flips', focus: 'Middle and oppo. Stay through it.', drills: ['Arraez Drill', '3/4 Swings to Opposite Field', 'Angled Flips'], duration: '20 min' },
      { day: 5, label: 'Overhand — Transfer', environment: 'overhand', focus: 'Posture and direction at game speed.', drills: ['Overhand Oppo Round', 'Overhand Middle Round'], duration: '20 min' },
      { day: 6, label: 'Machine — Game Speed', environment: 'machine', focus: 'Hold posture against real velocity. Direction under pressure.', drills: ['Middle Round — Machine', 'Oppo Round — Machine'], duration: '20 min' },
      { day: 7, label: 'Compete & Review', environment: 'live', focus: 'Compete. Line drives to all fields. Review what stuck.', drills: ['Opposite Field Challenge', 'Line Drive Round — Machine'], duration: '20 min', note: 'Save your best cue to Playbook.' },
    ],
  },

  // ── ADJUSTABILITY & PITCH RECOGNITION ──
  'cant-hit-offspeed': {
    topicId: 'cant-hit-offspeed',
    whatsHappening: 'Breaking balls and changeups eat you up. You\'re either way out in front, swinging over spin, caught between speeds, or freezing and watching offspeed for strikes. This is usually one or more of: a timing problem, a forward move / holding problem, a hand leak problem, a barrel depth problem, or a pitch recognition / decision problem. The body can go forward — but the hands cannot give up early. Adjustability is not freezing the body. Adjustability is controlling the move long enough for the hands and barrel to launch on time.',
    whyItHappens: [
      'Timing problem — not ready early enough, so there\'s no time left to adjust when the speed changes',
      'Hands leak forward during the forward move — barrel depth is lost before the hitter even recognizes the pitch',
      'Can\'t hold the move — the body commits before the eyes confirm the pitch, and once committed there\'s no way to slow down',
      'Poor pitch recognition — can\'t read spin, speed change, or tunnel early enough to make an adjustment',
      'No variable speed training — only sees one speed in practice, so any speed change in games feels impossible',
    ],
    whatToLearn: [
      'Be ready for the best fastball — then adjust to anything slower',
      'The body can go forward — the hands cannot give up early',
      'Hold the move long enough to let the eyes confirm what the pitch is doing',
      'Barrel depth is adjustable — train forward, middle, and deep contact points so the barrel can meet the ball wherever it arrives',
      'Off-speed problems require variable speed training, not just mechanical tee work',
    ],
    whatBadLooksLike: 'Rollovers on changeups. Swings over breaking balls. Way out in front on offspeed. Late on fastball but early on everything else. Caught between speeds — in no-man\'s land. Weak contact on anything that isn\'t a fastball down the middle.',
    whatGoodLooksLike: 'Ready for the best fastball every pitch. Holds the move. Keeps hands back while the body moves forward. Adjusts barrel depth late. Drives offspeed with authority to all fields. Recognizes spin early and makes clean decisions.',
    badVideoUrl: '', goodVideoUrl: '',
    drillProgression: [
      { stage: 'foundation', label: 'Movement Training (Tee & Flips)', drills: ['Hover Holds / Bellies — Purpose: Train the hold. Feel the body go forward while hands stay back. Fixes hand leak and early commit.', 'Preset Hand Load Swings — Purpose: Start with hands already loaded. Fire from preset. Fixes extra hand drift that kills barrel depth.', 'Go Drill — Purpose: Hold launch position until cue. Builds the ability to be ready and wait. Fixes early commit.', 'Command Drill — Purpose: React from launch to random cue. Trains launch quickness so the hitter can afford to wait longer.', '45s with Hover — Purpose: Angled tee with hover. Combines separation feel with barrel depth at an angle.', 'Deep Tee — Purpose: Set tee behind front hip. Trains the barrel to work deep. Fixes the habit of only making contact out front.', 'Random Tee Locations — Purpose: Coach moves tee between reps. Trains barrel adjustability to different contact points.'] },
      { stage: 'skill-building', label: 'Skill / Decision Training (Overhand / Flips)', drills: ['Variable Front Toss — Purpose: Front toss at different speeds. Hitter must be ready for the fastest and adjust to the slowest. This is the most important drill for offspeed — it trains variable speed recognition.', 'Slow Breaking Ball Feeds — Purpose: Coach feeds slow loopy spin from front toss. Hitter must hold and still drive the ball. Trains the ability to hold the move against a pitch that is designed to make you commit early.', 'Weighted Foam Ball Recognition — Purpose: Mixed foam balls at different speeds. Swing at strikes, take balls. Trains the decision before the swing, not just the swing.'] },
      { stage: 'transfer', label: 'Transfer Training (Machine / Compete)', drills: ['Three Plate Machine Drill — Purpose: Forward / middle / deep contact points against machine velocity. Trains barrel depth adjustability at game speed.', 'Fastball + Breaking Ball Mix — Purpose: Alternating fastball and breaking ball on machine. Be ready for fast, adjust to spin. This is where the hold gets tested at real velocity.', 'Slow Loopy Curveball Machine — Purpose: Slow loopy curve only. The hitter must hold the move and still drive the ball. If you can hold on this, you can hold on anything.', 'Backspin Challenge — Purpose: Random speed front toss. Goal: backspin on every rep regardless of speed. Tests barrel control under variable speed.', 'Oppo Line Drive on Offspeed — Purpose: Offspeed only, drive it oppo. If you can drive offspeed oppo, you are holding the move and using the whole field.', 'Take / Swing Recognition Rounds — Purpose: Mixed pitches. Call take or swing before committing. Trains the decision under game-like pressure.', 'Random Speed Machine Rounds — Purpose: Machine at random speeds. Compete. Be ready for the best fastball and adjust to everything else.'] },
    ],
    cues: [],
    feels: [],
    outcomeChallenges: [],
    practicePlan: [
      { day: 1, label: 'Movement — Hold the Move', environment: 'tee', focus: 'Hover holds. Preset hand load. Feel separation. The body goes forward — the hands do not give up early.', drills: ['Hover Holds / Bellies', 'Preset Hand Load Swings', '45s with Hover'], duration: '20 min' },
      { day: 2, label: 'Movement — Barrel Depth', environment: 'tee', focus: 'Deep tee. Random locations. Command drill. Train the barrel to work at different depths — not just out front.', drills: ['Deep Tee', 'Random Tee Locations', 'Command Drill'], duration: '20 min' },
      { day: 3, label: 'Skill — Variable Speed', environment: 'flips', focus: 'Variable front toss. Go Drill. Slow breaking ball feeds. The hold must work against a moving ball at different speeds.', drills: ['Variable Front Toss', 'Go Drill', 'Slow Breaking Ball Feeds'], duration: '20 min' },
      { day: 4, label: 'Skill — Recognition', environment: 'flips', focus: 'Foam ball recognition. Variable front toss. Train the decision — see it, confirm it, then launch.', drills: ['Weighted Foam Ball Recognition', 'Variable Front Toss'], duration: '20 min' },
      { day: 5, label: 'Transfer — Overhand', environment: 'overhand', focus: 'Mixed BP with offspeed mixed in. Hold and adjust at game speed. This is where the training meets the game.', drills: ['Mixed BP with Approach'], duration: '20 min' },
      { day: 6, label: 'Transfer — Machine', environment: 'machine', focus: 'Three plate drill. FB + breaking ball mix. Compete at velocity. Barrel depth at game speed.', drills: ['Three Plate Machine Drill', 'Fastball + Breaking Ball Mix'], duration: '20 min' },
      { day: 7, label: 'Compete & Review', environment: 'live', focus: 'Random speed. Backspin challenge. Compete with adjustability. Review: did the hold transfer?', drills: ['Random Speed Machine Rounds', 'Backspin Challenge'], duration: '20 min', note: 'Be ready early. Hold the move. Keep the hands back. Adjust the barrel late.' },
    ],
  },
  'chasing': {
    topicId: 'chasing',
    whatsHappening: 'You swing at pitches outside the zone. The pitcher doesn\'t have to throw strikes because you give at-bats away by chasing. A lot of chasing is actually a timing problem disguised as a discipline problem. If the hitter is late on the fastball, everything looks like a strike because they are in survival mode — they have to swing at everything because they can\'t afford to be late. When the hitter is on time for the fastball, the zone shrinks naturally and decisions get better without trying.',
    whyItHappens: [
      'Timing is late — creates a panic swing where everything looks hittable because the hitter is in survival mode',
      'No approach — swinging at everything, reacting to the pitcher instead of hunting a specific pitch',
      'Doesn\'t trust hands — not quick enough from launch, so they feel like they have to start early on everything',
      'Strike zone is too big — expands under pressure, especially with velocity or with 2 strikes',
      'Poor pitch recognition — can\'t read ball from strike fast enough to make a good decision',
      'No count approach — same plan every pitch, no adjustment based on the count or situation',
    ],
    whatToLearn: [
      'Fix timing first — if you\'re on time for the fastball, you stop chasing because you can afford to wait',
      'Have a plan before you step in the box — hunt one pitch, one zone',
      'Shrink the zone early in the count, expand it with 2 strikes',
      'Be ready for the fastball — only swing at your pitch, not the pitcher\'s pitch',
      'Decision training matters more than mechanics here — you can\'t fix chasing on a tee',
    ],
    whatBadLooksLike: 'Expands zone with velocity. Chases spin down and out of the zone. Chases fastball up. Swings at pitcher\'s pitch early in count. Weak contact from bad pitch selection. Always hitting from behind in the count. Takes good pitches, swings at bad ones.',
    whatGoodLooksLike: 'Tight zone. Hunts one pitch. Takes bad pitches without flinching. Attacks strikes with intent. Makes the pitcher throw strikes. Adjusts approach by count — shrinks early, competes late.',
    badVideoUrl: '', goodVideoUrl: '',
    drillProgression: [
      { stage: 'foundation', label: 'Timing & Confidence (Tee & Flips)', drills: ['Go Drill — Purpose: Build launch quickness so the hitter trusts they can wait. If you\'re fast from launch, you can afford to be patient.', 'Command Drill — Purpose: React from preset launch. Builds confidence in hand speed. When hitters trust their hands, they stop panic swinging.', 'Gap to Gap Fastball Rounds — Purpose: Fastball-only round, drive gap to gap. Builds timing confidence on the fastball. When on time for the fastball, chasing drops.'] },
      { stage: 'skill-building', label: 'Zone Control & Recognition (Flips / Overhand)', drills: ['Zone Hitting Rounds — Purpose: Coach calls zone (in / middle / away). Only swing at pitches in that zone. Trains the hitter to hunt a specific area instead of reacting to everything.', 'Shrink the Zone Drill — Purpose: Start with full zone. Each round the zone gets smaller. Trains selectivity under increasing pressure.', 'Two Strike Approach Rounds — Purpose: Every AB starts 0-2. Compete with a tight zone and a shorter swing. Trains the hitter to battle instead of expand.', 'Count Approach Rounds — Purpose: Coach calls the count. Hitter adjusts approach per count. Trains count awareness — what to hunt, when to expand.', 'Strike / Ball Foam Recognition — Purpose: Foam balls at different speeds. Call strike or ball before reacting. Trains the eyes to read before the body commits.', 'Mixed BP with Approach — Purpose: Overhand BP with a specific approach each round. Sit fastball one round, hunt middle one round. Transfers zone discipline to game speed.'] },
      { stage: 'transfer', label: 'Game Transfer (Machine / Compete)', drills: ['Take / Swing Recognition Rounds — Purpose: Mixed pitches. Call take or swing before committing. Trains decision-making under game-like chaos.', 'Random Speed Machine Rounds — Purpose: Machine at random speeds. Compete with discipline. This is where approach meets real velocity.'] },
    ],
    cues: [],
    feels: [],
    outcomeChallenges: [],
    practicePlan: [
      { day: 1, label: 'Timing — Fix It First', environment: 'tee', focus: 'Command drill. Go drill. Be on time for the fastball first. If timing is right, chasing drops on its own.', drills: ['Command Drill', 'Go Drill'], duration: '20 min' },
      { day: 2, label: 'Zone Control — Shrink It', environment: 'flips', focus: 'Zone hitting rounds. Shrink the zone drill. Hunt one pitch, one area. Do not swing at the pitcher\'s pitch.', drills: ['Zone Hitting Rounds', 'Shrink the Zone Drill'], duration: '20 min' },
      { day: 3, label: 'Recognition — Train the Eyes', environment: 'flips', focus: 'Foam ball recognition. Gap to gap fastball rounds. See the pitch before you decide — don\'t guess.', drills: ['Strike / Ball Foam Recognition', 'Gap to Gap Fastball Rounds'], duration: '20 min' },
      { day: 4, label: 'Count Approach — Adjust the Plan', environment: 'flips', focus: 'Count approach rounds. Two-strike rounds. Learn to adjust your plan by count and situation.', drills: ['Count Approach Rounds', 'Two Strike Approach Rounds'], duration: '20 min' },
      { day: 5, label: 'Transfer — Approach at Game Speed', environment: 'overhand', focus: 'Mixed BP with specific approach each round. Sit fastball. Hunt zone. Take spin. This is where approach meets overhand speed.', drills: ['Mixed BP with Approach'], duration: '20 min' },
      { day: 6, label: 'Transfer — Compete with Discipline', environment: 'machine', focus: 'Random speed machine. Take / swing recognition. Compete with your plan, not your emotions.', drills: ['Take / Swing Recognition Rounds', 'Random Speed Machine Rounds'], duration: '20 min' },
      { day: 7, label: 'Compete & Review', environment: 'live', focus: 'Live compete with approach. Review your decisions, not just your results. Did you swing at your pitch?', drills: ['Random Speed Machine Rounds'], duration: '20 min', note: 'Have a plan. Shrink the zone. Be ready for the fastball. Only swing at your pitch.' },
    ],
  },
  'cant-adjust-height': {
    topicId: 'cant-adjust-height',
    whatsHappening: 'You only hit well at one height — usually belt high. High pitches get popped up or swung under. Low pitches get rolled over or topped. This is almost always a posture and shoulder plane problem, not a hand problem. High pitch = flatter turn. Low pitch = more tilt. Same swing, different shoulder angle. The hands don\'t change — the shoulders do. If you try to adjust with your hands, the barrel path breaks down. If you adjust with your shoulders, the barrel stays on plane.',
    whyItHappens: [
      'Posture doesn\'t adjust — same body position for every pitch height, so the barrel can only work at one level',
      'Shoulder plane is locked — no tilt adjustment between pitches, so the barrel is always on the same plane',
      'Tries to adjust with hands instead of body — reaching up or down with the arms instead of tilting the shoulders to match the pitch',
      'Only practices at one tee height — no exposure to the edges of the zone, so the swing only works in the middle',
      'Head and posture move up and down — instead of staying stable while the shoulders adjust, the whole body shifts',
    ],
    whatToLearn: [
      'Same swing, different shoulder angle — this is the key to height adjustability',
      'High pitch = flatter turn — less tilt, barrel works on a flatter plane to match the high pitch',
      'Low pitch = more tilt — more shoulder tilt, barrel works down to match the low pitch',
      'Adjust with your shoulders, not your hands — the hands stay the same, the body adjusts',
      'Train the edges of the swing — don\'t live middle-middle in practice',
      'Posture training first, then plane training, then mixed height training, then machine, then games',
    ],
    whatBadLooksLike: 'Pops up high pitches. Rolls over low pitches. Only hits belt high with authority. Swings under high fastballs. On top of low breaking balls. Head and posture moving up and down between pitches.',
    whatGoodLooksLike: 'Same swing, different shoulder angle. Adjusts posture to match pitch height cleanly. Drives high and low pitches with authority. Stable head position — shoulders adjust, head stays still.',
    badVideoUrl: '', goodVideoUrl: '',
    drillProgression: [
      { stage: 'foundation', label: 'Movement Training — Posture & Plane (Tee)', drills: ['PVC Pipe Swings — Purpose: Hold PVC behind back. Feel the plane change between high and low. Teaches the hitter what tilt feels like without a bat in their hands.', 'High Tee — Purpose: Set tee at top of zone. Train the flatter turn. Barrel must match the high pitch plane.', 'Low Tee — Purpose: Set tee at bottom of zone. Train more tilt. Body adjusts down — arms do not reach.', 'High / Low Alternating Tee — Purpose: Alternate high and low every rep. Forces the hitter to adjust plane between pitches — the most game-like tee drill for height adjustability.', 'Command Drill + High / Low Tee — Purpose: Start in launch. Coach calls high or low. Fire immediately. Trains reactive plane adjustment — not planned, but reacted to.', '2-Ball High/Low Tee — Purpose: Two tees at different heights. Coach calls which one. Trains visual recognition and plane adjustment together.'] },
      { stage: 'skill-building', label: 'Skill Training — Mixed Height (Flips / Overhand)', drills: ['High Round Only — Purpose: Flips or overhand at top of zone only. Full round of high pitches. Isolates the flat plane so the hitter feels it in volume.', 'Low Round Only — Purpose: Flips or overhand at bottom of zone only. Full round of low pitches. Isolates the tilt plane.', 'Mixed Height Front Toss — Purpose: Coach varies height every pitch. Hitter must adjust plane every rep. This is the most important flips drill for height adjustability — it forces adjustment under uncertainty.'] },
      { stage: 'transfer', label: 'Transfer Training — Height at Velocity (Machine)', drills: ['High Machine Day — Purpose: Machine set to top of zone. Full round of high pitches at velocity. Tests the flat plane at game speed.', 'Low Machine Day — Purpose: Machine set to bottom of zone. Full round of low pitches at velocity. Tests the tilt at game speed. Do not skip this — most hitters avoid low pitch training on the machine.'] },
    ],
    cues: [],
    feels: [],
    outcomeChallenges: [],
    practicePlan: [
      { day: 1, label: 'Movement — Posture Training', environment: 'tee', focus: 'PVC pipe swings to feel the plane. High tee and low tee to train each plane separately. Body adjusts — hands stay the same.', drills: ['PVC Pipe Swings', 'High Tee', 'Low Tee'], duration: '20 min' },
      { day: 2, label: 'Movement — Plane Adjustment', environment: 'tee', focus: 'High / low alternating tee to train switching planes. Command drill with height calls to train reactive adjustment. 2-ball drill for visual recognition.', drills: ['High / Low Alternating Tee', 'Command Drill + High / Low Tee', '2-Ball High/Low Tee'], duration: '20 min' },
      { day: 3, label: 'Skill — Isolated Height', environment: 'flips', focus: 'High-only round, then low-only round. Feel each plane in volume against a moving ball before mixing.', drills: ['High Round Only', 'Low Round Only'], duration: '20 min' },
      { day: 4, label: 'Skill — Mixed Height', environment: 'flips', focus: 'Mixed height front toss. Adjust every pitch. This is where height adjustability gets tested — random heights, real decisions.', drills: ['Mixed Height Front Toss'], duration: '20 min' },
      { day: 5, label: 'Transfer — Overhand', environment: 'overhand', focus: 'Overhand BP with height emphasis. Let the pitcher work high and low. Stay stable — adjust shoulders, not hands.', drills: ['Mixed BP with Approach'], duration: '20 min' },
      { day: 6, label: 'Transfer — Machine at Velocity', environment: 'machine', focus: 'High machine day OR low machine day. Test the plane at game speed velocity. Don\'t avoid the edges.', drills: ['High Machine Day', 'Low Machine Day'], duration: '20 min' },
      { day: 7, label: 'Compete & Review', environment: 'live', focus: 'Mixed heights. Compete. Adjust every pitch. Review: are you adjusting with your shoulders or reaching with your hands?', drills: ['Mixed Height Front Toss'], duration: '20 min', note: 'Same swing. Different shoulder angle. Adjust with your body, not your hands.' },
    ],
  },

  // ── APPROACH & GAME PERFORMANCE ──
  'no-plan': {
    topicId: 'no-plan',
    whatsHappening: 'You walk to the plate and react to whatever comes. No pitch to hunt, no zone to work, no count awareness. Your at-bats are random because your approach is random. Good hitters hunt — they don\'t guess. An approach means knowing what pitch you\'re looking for, what zone you\'re working, what you\'re trying to do with the ball, and how the count changes your plan.',
    whyItHappens: [
      'No pre-AB routine — step in the box with no plan',
      'Don\'t know what to look for — no pitch or zone to hunt',
      'Don\'t understand count leverage — same approach on 2-0 and 0-2',
      'Never practiced having a plan — only trained mechanics, not decisions',
      'No situational awareness — same swing regardless of runners, outs, or score',
    ],
    whatToLearn: [
      'An approach includes: what pitch, what zone, what you do with the ball, how the count changes the plan',
      'Hunt, don\'t guess — pick a pitch and a zone before the pitch is thrown',
      'Count changes everything — damage early (1-0, 2-0, 3-1), compete late (0-2, 1-2)',
      'Situation changes intent — move runner, sac fly, damage, compete',
      'Decisions > Mechanics in games',
    ],
    whatBadLooksLike: 'Random swings. No pitch selection. Reactive at the plate. Same approach on 2-0 and 0-2. Swings at the pitcher\'s pitch, not theirs. No situational execution.',
    whatGoodLooksLike: 'Clear plan every AB. Hunts one pitch in one zone. Adjusts by count. Executes situations. Attacks in hitter\'s counts, competes with 2 strikes.',
    badVideoUrl: '', goodVideoUrl: '',
    drillProgression: [
      { stage: 'foundation', label: 'Approach Training (Flips)', drills: ['Zone Hunting Round — Purpose: Pick one zone. Only swing there. Teaches selective aggression.', 'Count Hitting Round — Purpose: Coach calls count. Adjust approach per count. Teaches count leverage.', 'Situation Rounds — Purpose: Coach calls situation. Execute the plan. Teaches situational awareness.', 'Limited Swings Round — Purpose: Only 5 swings in 10 pitches. Choose wisely. Teaches selectivity.', 'Damage Count Rounds — Purpose: Only swing in hitter\'s counts. Max intent. Teaches damage mentality.'] },
      { stage: 'skill-building', label: 'Decision Training (Overhand)', drills: ['3-Pitch At-Bat Simulation — Purpose: 3-pitch ABs with full plan. Teaches approach under game-like structure.', 'Situational BP — Purpose: Overhand BP with situations called. Teaches decision transfer to game speed.', 'Mixed BP with Approach — Purpose: Each round has a different approach. Sit fastball, hunt middle, take spin. Transfers approach to live arms.'] },
      { stage: 'transfer', label: 'Competition & Game Transfer', drills: ['Count Battle Game — Purpose: Two hitters compete. Points for executing correct approach per count. Decisions win.', 'Situational Challenge Game — Purpose: Points for executing situations. Sac fly, move runner, 2-strike hit. Game performance scoring.', 'At-Bat Simulation Game — Purpose: Full count simulation with approach required. This is your at-bat — execute your plan.'] },
    ],
    cues: [],
    feels: [],
    outcomeChallenges: [],
    practicePlan: [
      { day: 1, label: 'Zone Hunting', environment: 'flips', focus: 'Pick a zone. Only swing there. Learn to hunt instead of react.', drills: ['Zone Hunting Round'], duration: '20 min' },
      { day: 2, label: 'Count Leverage', environment: 'flips', focus: 'Count hitting rounds. Learn what counts mean for your approach.', drills: ['Count Hitting Round', 'Damage Count Rounds'], duration: '20 min' },
      { day: 3, label: 'Situations', environment: 'flips', focus: 'Situation rounds. Runner on 2nd, sac fly, hit behind runner. Execute.', drills: ['Situation Rounds', 'Limited Swings Round'], duration: '20 min' },
      { day: 4, label: 'Overhand — Decision Transfer', environment: 'overhand', focus: '3-pitch ABs with a plan. Situational BP. Approach meets game speed.', drills: ['3-Pitch At-Bat Simulation', 'Situational BP'], duration: '20 min' },
      { day: 5, label: 'Mixed BP — Approach Rounds', environment: 'overhand', focus: 'Each round has a different approach. Sit FB, hunt middle, take spin.', drills: ['Mixed BP with Approach'], duration: '20 min' },
      { day: 6, label: 'Machine — Random', environment: 'machine', focus: 'Random pitch machine with approach. Compete with your plan.', drills: ['Random Pitch Machine'], duration: '20 min' },
      { day: 7, label: 'Compete & Review', environment: 'live', focus: 'Count battle game. Situational challenge. Compete with your approach.', drills: ['Count Battle Game', 'Situational Challenge Game'], duration: '20 min', note: 'Hunt, don\'t guess. Damage early, battle late.' },
    ],
  },
  'too-passive': {
    topicId: 'too-passive',
    whatsHappening: 'You let good pitches go by. You watch hittable fastballs. You don\'t do damage in hitter\'s counts. You are hesitant, not disciplined — passive hitters are afraid to commit, not strategically patient. Passive hitters get themselves out. Aggressive hitters make the pitcher get them out.',
    whyItHappens: [
      'Afraid to miss — hesitant to commit to a swing',
      'Waiting for the "perfect" pitch that never comes',
      'No damage intent in hitter\'s counts — treats 2-0 like 0-2',
      'Lack of confidence in timing — doesn\'t trust they can get to it',
      'Confuses passivity with discipline — thinks taking is always good',
      'No training for controlled aggression — only trains taking or swinging, not hunting',
    ],
    whatToLearn: [
      'Passive hitters get themselves out — aggressive hitters make the pitcher get them out',
      'Be selectively aggressive — swing at YOUR pitch, not every pitch',
      'Damage early, battle late — hitter\'s counts are for damage',
      'Don\'t miss your pitch — when it\'s there, attack it',
      'Controlled aggression is a skill that must be trained',
    ],
    whatBadLooksLike: 'Watches hittable pitches go by. Takes first pitch every AB. Passive body language. No damage in hitter\'s counts. Always hitting from behind. Lets the pitcher dictate the AB.',
    whatGoodLooksLike: 'Attacks when it\'s their pitch. Aggressive in hitter\'s counts. Doesn\'t miss mistakes. Puts pressure on the pitcher. Hunts and attacks.',
    badVideoUrl: '', goodVideoUrl: '',
    drillProgression: [
      { stage: 'foundation', label: 'Aggression Training (Flips)', drills: ['First Pitch Swing Rounds — Purpose: Must swing at pitch one. Trains readiness and willingness to attack early.', 'Damage Round — Purpose: Max intent every swing. Trains the hitter to swing to do damage, not just make contact.', 'Damage Count Rounds — Purpose: Only swing in hitter\'s counts (1-0, 2-0, 3-1). If it\'s your count, attack it.', 'Early Count Damage Training — Purpose: Must do damage in first 2 pitches. If your pitch is there, don\'t let it go.'] },
      { stage: 'skill-building', label: 'Selective Aggression (Flips / Overhand)', drills: ['Sit Fastball Round — Purpose: Sit on fastball only. If it\'s a fastball, attack. Teaches the hitter to hunt one pitch instead of waiting for everything.', 'Limited Swings Round — Purpose: Only 5 swings in 10 pitches. Can\'t swing at everything — must choose. Teaches aggressive selection.', 'Zone Hunting Round — Purpose: Pick one zone. Only swing there. Aggressive in that zone, disciplined everywhere else.'] },
      { stage: 'transfer', label: 'Competition & Game Transfer', drills: ['2-Strike Battle Round — Purpose: Every AB starts 0-2. Even passive hitters must compete here. No passive option with 2 strikes.', 'Count Hitting Round — Purpose: Coach calls count. Hitter adjusts aggression by count. Damage early, compete late.'] },
    ],
    cues: [],
    feels: [],
    outcomeChallenges: [],
    practicePlan: [
      { day: 1, label: 'Attack — First Pitch', environment: 'flips', focus: 'First pitch swing rounds. Be ready. Attack pitch one.', drills: ['First Pitch Swing Rounds'], duration: '20 min' },
      { day: 2, label: 'Damage — Hitter\'s Counts', environment: 'flips', focus: 'Damage count rounds. Early count damage. Don\'t miss your pitch.', drills: ['Damage Count Rounds', 'Early Count Damage Training'], duration: '20 min' },
      { day: 3, label: 'Hunt — Sit Fastball', environment: 'flips', focus: 'Sit on fastball. Hunt it. Attack it. Let everything else go.', drills: ['Sit Fastball Round', 'Damage Round'], duration: '20 min' },
      { day: 4, label: 'Selective Aggression', environment: 'flips', focus: 'Limited swings round. Zone hunting. Pick your pitch and make it count.', drills: ['Limited Swings Round', 'Zone Hunting Round'], duration: '20 min' },
      { day: 5, label: 'Transfer — Overhand', environment: 'overhand', focus: 'Mixed BP. Be aggressive on your pitch. Take the rest.', drills: ['Mixed BP with Approach'], duration: '20 min' },
      { day: 6, label: 'Compete — 2 Strikes', environment: 'machine', focus: '2-strike battle. No passive option. Compete.', drills: ['2-Strike Battle Round', 'Sit Fastball Round'], duration: '20 min' },
      { day: 7, label: 'Compete & Review', environment: 'live', focus: 'Compete with aggression. Review: did you swing at your pitch? Did you do damage when you had the chance?', drills: ['2-Strike Battle Round'], duration: '20 min', note: 'Passive hitters get themselves out. Don\'t miss your pitch.' },
    ],
  },
  'bp-hitter': {
    topicId: 'bp-hitter',
    whatsHappening: 'You hit great in the cage and disappear in games. BP is predictable — same speed, same location, same pitch type, no consequences. Games are unpredictable — different speeds, pitch types, locations, pressure, counts, and situations. You are a mechanical hitter, not a game hitter. Practice must be harder than the game for the game to slow down.',
    whyItHappens: [
      'Practice is predictable — games are random',
      'Practice has no consequences — games have pressure on every pitch',
      'Practice only trains one speed — games throw everything',
      'No competition in training — no stakes, no stress, no growth',
      'Different mental state in games — tenses up, presses, tries too hard',
      'No routine to bridge cage work to game performance',
      'Block practice builds mechanics — but random practice builds game hitters',
    ],
    whatToLearn: [
      'If practice is easier than the game, the game speeds up',
      'If practice is harder than the game, the game slows down',
      'Random practice builds game hitters — block practice builds cage hitters',
      'Pressure is practice — train with consequences',
      'Move from Tee → Flips → Overhand → Mixed BP → Machine → High Velo → Live → Compete → Game',
    ],
    whatBadLooksLike: 'Great BP numbers, bad game performance. Tenses up in ABs. Different swing in games. Can\'t handle mixed pitches or pressure. Practice confidence doesn\'t transfer.',
    whatGoodLooksLike: 'Same swing in practice and games. Competes every AB. Handles pressure. Thrives in chaos. Practice is harder than the game.',
    badVideoUrl: '', goodVideoUrl: '',
    drillProgression: [
      { stage: 'foundation', label: 'Make Practice Harder (Overhand / Machine)', drills: ['Short Distance BP — Purpose: BP from shorter distance. Increases reaction time demand. Makes games feel slower.', 'High Velocity Machine — Purpose: Machine above game speed. If you can handle this, the game is easy.', 'Mixed Pitch BP — Purpose: All pitch types mixed in. No telling what\'s coming. Game-like.', 'Random Pitch Machine — Purpose: Random speeds and locations. No prediction. This is how games work.'] },
      { stage: 'skill-building', label: 'Add Pressure & Situations (Overhand / Compete)', drills: ['Situational BP — Purpose: Situations called before each AB. Execute the plan at game speed.', 'Pressure Rounds — Purpose: Consequence-based rounds. Fail = run or sit out. Train performing under real stakes.', 'At-Bat Simulation Game — Purpose: Full count simulation with approach required. This IS a game at-bat.'] },
      { stage: 'transfer', label: 'Competition & Game Transfer', drills: ['Barrel Game (5 for 5) — Purpose: 5 swings, must barrel all 5. Pressure on every swing.', 'Barrel Game Hard Mode (3 for 3) — Purpose: 3 swings, must barrel all 3. Maximum stakes.', '21 Outs Game — Purpose: Points for line drives, ground balls. Every swing counts. Competition.', 'Must Put Ball in Play — Purpose: Every pitch must be fair. No excuses. Train competing.', '2-Strike Battle Round — Purpose: Every AB starts 0-2. Compete from behind.'] },
    ],
    cues: [],
    feels: [],
    outcomeChallenges: [],
    practicePlan: [
      { day: 1, label: 'Increase Speed', environment: 'machine', focus: 'High velocity machine. Make the game feel slow by training faster.', drills: ['High Velocity Machine'], duration: '20 min' },
      { day: 2, label: 'Add Variety', environment: 'overhand', focus: 'Mixed pitch BP. Short distance BP. See everything. No prediction.', drills: ['Mixed Pitch BP', 'Short Distance BP'], duration: '20 min' },
      { day: 3, label: 'Add Situations', environment: 'overhand', focus: 'Situational BP. Runner on 2nd, sac fly, hit behind runner. Execute.', drills: ['Situational BP', 'At-Bat Simulation Game'], duration: '20 min' },
      { day: 4, label: 'Add Pressure', environment: 'machine', focus: 'Barrel game. Pressure rounds. Consequences on every swing.', drills: ['Barrel Game (5 for 5)', 'Pressure Rounds'], duration: '20 min' },
      { day: 5, label: 'Random Machine', environment: 'machine', focus: 'Random pitch machine. No prediction. Compete.', drills: ['Random Pitch Machine'], duration: '20 min' },
      { day: 6, label: 'Compete', environment: 'live', focus: '21 Outs Game. 2-Strike Battle. Must put in play. Competition.', drills: ['21 Outs Game', '2-Strike Battle Round', 'Must Put Ball in Play'], duration: '20 min' },
      { day: 7, label: 'Compete & Review', environment: 'live', focus: 'Live compete. Review: is your game swing the same as your practice swing?', drills: ['Barrel Game Hard Mode (3 for 3)'], duration: '20 min', note: 'Practice must be harder than the game.' },
    ],
  },
  'strikeout-prone': {
    topicId: 'strikeout-prone',
    whatsHappening: 'Too many strikeouts. You either chase out of the zone, freeze on borderline pitches, or can\'t put the ball in play on tough pitches. This is a two-part problem: early count damage and two-strike survival. If you do damage early, you avoid 2-strike counts. If you can\'t avoid them, you must become a nightmare with 2 strikes — choke up, shorten, battle, foul pitches off, and put the ball in play.',
    whyItHappens: [
      'Don\'t do damage early — give away hitter\'s counts, always hitting from behind',
      'No 2-strike approach adjustment — same long swing with 0-2 as 2-0',
      'Can\'t put the ball in play on non-perfect pitches — no barrel control on tough pitches',
      'Chase pitches out of the zone with 2 strikes — zone expands under pressure',
      'Freeze on borderline pitches — can\'t decide, watch strike three',
      'Decision-making breaks down late in counts — panic, not compete',
    ],
    whatToLearn: [
      'Damage early, battle late — do damage in hitter\'s counts to avoid 2-strike counts',
      'With two strikes, become a nightmare — choke up, shorten, battle, stay alive',
      'Train barrel control for non-perfect pitches — foul balls, in play, compete',
      'Two types of 2-strike hitters: zone shrinkers (wait for your pitch) and zone expanders (put everything in play)',
      'Strikeouts are reduced by better decisions AND better barrel control — you need both',
    ],
    whatBadLooksLike: 'High K rate. Chasing with 2 strikes. Freezing on borderline pitches. Same long swing on 0-2. Can\'t foul tough pitches off. Gives away early count ABs.',
    whatGoodLooksLike: 'Does damage early in counts. Adjusts with 2 strikes — chokes up, shortens, battles. Puts tough pitches in play. Fouls off pitcher\'s pitches. Competes every AB. Nightmare to strike out.',
    badVideoUrl: '', goodVideoUrl: '',
    drillProgression: [
      { stage: 'foundation', label: 'Early Count Damage (Flips)', drills: ['Early Count Damage Training — Purpose: Must do damage in first 2 pitches. If you do damage early, you avoid 2-strike counts entirely.', 'Damage Count Rounds — Purpose: Only swing in hitter\'s counts. Train the aggression to capitalize when the count is yours.', 'First Pitch Swing Rounds — Purpose: Swing at pitch one. Be ready. Attack early.'] },
      { stage: 'skill-building', label: 'Two-Strike Training (Flips / Machine)', drills: ['Two Strike Approach Rounds — Purpose: Every AB starts 0-2. Shorten, choke up, compete. Train the 2-strike mindset.', 'Choke Up Rounds — Purpose: Choke up with 2 strikes. Shorter swing. More barrel control. Put the ball in play.', 'Bad Pitch Hitting Rounds — Purpose: Intentionally hit tough pitches. Off the plate, up, down. Train adjustability for 2-strike battles.', 'Oppo with Two Strikes — Purpose: Everything goes oppo with 2 strikes. Shorten, stay through, in play.', 'Foul Ball Rounds — Purpose: Intentionally foul off tough pitches. Stay alive. Wait for yours.', '2-Strike Machine — Purpose: Machine at game speed, every pitch starts 0-2. Compete at velocity with a short swing.'] },
      { stage: 'transfer', label: 'Competition & Game Transfer', drills: ['Must Put Ball in Play — Purpose: Every pitch must be fair. No swings and misses. No called strikes. Train barrel control under pressure.', '2-Strike Battle Round — Purpose: 0-2 start. Battle. Compete. The hitter who competes the hardest wins.', 'At-Bat Simulation Game — Purpose: Full count simulation. Execute approach. Manage the AB.'] },
    ],
    cues: [],
    feels: [],
    outcomeChallenges: [],
    practicePlan: [
      { day: 1, label: 'Early Count Damage', environment: 'flips', focus: 'Do damage in the first 2 pitches. Attack early so you avoid 2-strike counts.', drills: ['Early Count Damage Training', 'First Pitch Swing Rounds'], duration: '20 min' },
      { day: 2, label: 'Two-Strike Mindset', environment: 'flips', focus: 'Every AB starts 0-2. Choke up. Shorten. Compete. Battle.', drills: ['Two Strike Approach Rounds', 'Choke Up Rounds'], duration: '20 min' },
      { day: 3, label: 'Barrel Control — Tough Pitches', environment: 'flips', focus: 'Bad pitch hitting. Foul ball rounds. Train the ability to compete on non-perfect pitches.', drills: ['Bad Pitch Hitting Rounds', 'Foul Ball Rounds'], duration: '20 min' },
      { day: 4, label: 'Oppo with 2 Strikes', environment: 'flips', focus: 'Oppo only with 2 strikes. Stay through the ball. Put it in play.', drills: ['Oppo with Two Strikes', 'Damage Count Rounds'], duration: '20 min' },
      { day: 5, label: 'Machine — 2-Strike Speed', environment: 'machine', focus: '2-strike machine rounds. Compete at velocity. Short swing. In play.', drills: ['2-Strike Machine', 'Must Put Ball in Play'], duration: '20 min' },
      { day: 6, label: 'Compete — Battle Rounds', environment: 'live', focus: '2-strike battle round. At-bat simulation. Every swing is a compete swing.', drills: ['2-Strike Battle Round', 'At-Bat Simulation Game'], duration: '20 min' },
      { day: 7, label: 'Compete & Review', environment: 'live', focus: 'Compete. Review: did you do damage early? Did you battle late? Did you put the ball in play?', drills: ['2-Strike Battle Round'], duration: '20 min', note: 'Damage early, battle late. With two strikes, become a nightmare.' },
    ],
  },

  // ── POWER / BAT SPEED / CONNECTION ──
  'weak-contact': {
    topicId: 'weak-contact',
    whatsHappening: 'You make contact but it\'s always soft. No hard-hit balls. Ball dies off the bat. Low exit velocity even on centered hits. This is an output problem — the cause could be poor contact point (skill), poor connection / energy transfer (movement), low intent (mental), or lack of strength (physical). Not all weak contact is a swing problem — some of it is a force production problem.',
    whyItHappens: [
      'Low intent — not swinging to do damage, just making contact',
      'Poor extension through the zone — cutting the swing off before the barrel gets through',
      'All arms — body rotation not connected to barrel path',
      'Poor contact point — ball is getting too deep or too far out front',
      'Weak lower half — no force production from the ground up',
      'Lack of strength — not enough physical force to drive the ball at this level',
    ],
    whatToLearn: [
      'Intent drives output — swing to do damage, not just make contact',
      'Connection transfers energy from body to barrel — fix the chain, not just the swing',
      'Contact point matters — the same swing at a different contact point produces different exit velo',
      'If strength is the issue, drills alone won\'t fix it — you need a strength program',
    ],
    whatBadLooksLike: 'Soft contact. Low exit velo. Ball dies off the bat. Singles or outs. No authority. No carry. Weak fly balls.',
    whatGoodLooksLike: 'Hard contact. Exit velo up. Drives balls through gaps. Barrel authority. Backspin. Ball jumps off the bat.',
    badVideoUrl: '', goodVideoUrl: '',
    drillProgression: [
      { stage: 'foundation', label: 'Connection & Intent (Tee)', drills: ['High Tee Normal Swing — Purpose: Base swing at top of zone. Train barrel path with intent.', 'Out Front Tee — Purpose: Extend through contact. Train the barrel to stay in the zone longer.', 'Walk-Through Connection — Purpose: Feel the energy chain from ground to barrel. Fixes armsy swings.', 'Stop at Contact into Bag — Purpose: Feel force transfer at contact. Body leads barrel into the bag.'] },
      { stage: 'skill-building', label: 'Intent & Output (Flips)', drills: ['Damage Round — Purpose: Max intent every swing. Train the CNS to fire with purpose.', 'High Intent Flips — Purpose: Front toss with max intent. Attack every ball. Train damage.', 'Max Intent Rounds — Purpose: Every swing is max effort. Intent over position.'] },
      { stage: 'transfer', label: 'Force Production & Competition', drills: ['Overload Swings (Heavy Bat) — Purpose: Build rotational force and barrel strength. If the issue is physical, this is where it starts.', 'Consecutive Hard-Hit Challenge — Purpose: Stack quality. How many hard-hit in a row?', 'Velocity Ladder — Purpose: Increase speed every set. Test exit velo at game speed.'] },
    ],
    cues: [],
    feels: [],
    outcomeChallenges: [],
    practicePlan: [
      { day: 1, label: 'Connection — Feel the Chain', environment: 'tee', focus: 'Walk-through connection. Stop at contact into bag. Feel energy transfer.', drills: ['Walk-Through Connection', 'Stop at Contact into Bag'], duration: '20 min' },
      { day: 2, label: 'Contact Point — Extension', environment: 'tee', focus: 'High tee. Out front tee. Train barrel through the zone with intent.', drills: ['High Tee Normal Swing', 'Out Front Tee'], duration: '20 min' },
      { day: 3, label: 'Intent — Damage', environment: 'flips', focus: 'Damage round. High intent flips. Every swing is to do damage.', drills: ['Damage Round', 'High Intent Flips'], duration: '20 min' },
      { day: 4, label: 'Max Effort', environment: 'tee', focus: 'Max intent rounds. Overload swings. Train the CNS and build force.', drills: ['Max Intent Rounds', 'Overload Swings'], duration: '20 min' },
      { day: 5, label: 'Transfer — Overhand', environment: 'overhand', focus: 'Overhand with intent. Attack every pitch. Exit velo focus.', drills: ['Overhand Middle Round'], duration: '20 min' },
      { day: 6, label: 'Machine — Velocity', environment: 'machine', focus: 'Velocity ladder. Test exit velo at game speed.', drills: ['Velocity Ladder'], duration: '20 min' },
      { day: 7, label: 'Compete & Review', environment: 'live', focus: 'Consecutive hard-hit challenge. Review: is the issue skill, intent, or strength?', drills: ['Consecutive Hard-Hit Challenge'], duration: '20 min', note: 'If exit velo is still low after improving connection and intent, the issue may be physical — consider Bat Speed Program or Lifting Vault.' },
    ],
  },
  'no-bat-speed': {
    topicId: 'no-bat-speed',
    whatsHappening: 'Your barrel can\'t get to the zone fast enough. The swing feels slow, labored, and late. You struggle to catch up to velocity. Bat speed is a neural speed problem — the CNS controls how fast the barrel moves. It\'s trained through intent, overload/underload work, and fast-twitch firing. This is not a swing path fix — this is a speed fix.',
    whyItHappens: [
      'Long swing path — barrel takes too long to get to the zone',
      'Poor barrel turn — hands don\'t turn the barrel efficiently',
      'Low intent — not training at max effort, CNS adapts to slow speed',
      'No overload/underload training — the CNS has never been challenged to move faster',
      'Lack of fast-twitch development — not enough speed training outside the cage',
      'Hands too far from body — casting, long path, slow barrel entry',
    ],
    whatToLearn: [
      'Bat speed is trainable — it\'s a neural adaptation, not a fixed trait',
      'Overload builds force at speed, underload builds max speed — both are needed',
      'Intent drives speed — if you don\'t swing hard, you won\'t get faster',
      'Short path + fast turn = bat speed — the barrel must get to the zone quickly',
      'If the issue is strength-based (not enough force to move the bat fast), a Bat Speed Program or Lifting Vault may be needed',
    ],
    whatBadLooksLike: 'Slow barrel. Long path. Can\'t catch up to velocity. Gets jammed by speed. Swing feels labored. Late on everything.',
    whatGoodLooksLike: 'Quick barrel entry. Short path. Catches up to velo. Snappy barrel turn. Swing feels effortless and fast.',
    badVideoUrl: '', goodVideoUrl: '',
    drillProgression: [
      { stage: 'foundation', label: 'Barrel Turn & Path (Tee)', drills: ['Steering Wheel Turns — Purpose: Train the barrel turn. Hands rotate like a steering wheel. Fixes slow entry.', 'Snap Series — Purpose: Snap the barrel around the head quickly. Trains fast-twitch barrel speed.', 'Reverse Grip Drill — Purpose: Grip bat in reverse. Forces tight path and fast barrel.', 'Command Drill — Purpose: React from launch. Fire immediately. Trains launch quickness.'] },
      { stage: 'skill-building', label: 'Speed Development (Overload / Underload)', drills: ['Overload Swings (Heavy Bat) — Purpose: Swing heavier bat. Builds rotational force and teaches the CNS to produce more force at speed.', 'Underload Swings (Light Bat) — Purpose: Swing lighter bat. Trains max barrel speed and fast-twitch firing. This is how you teach the CNS to move faster.', 'Step-Behind Swings — Purpose: Build momentum into the swing. Trains the power chain.', 'Run-Up Swings — Purpose: Walk or jog into swing. Maximum momentum into max intent contact.', 'Max Intent Rounds — Purpose: Every swing is max effort. The CNS adapts to what you train — if you swing slow, you stay slow.'] },
      { stage: 'transfer', label: 'Speed at Game Velocity', drills: ['Velocity Ladder — Purpose: Increase machine speed every set. Test bat speed against real velocity.', 'Inside Tee / FB In Machine — Purpose: Inside pitch requires fastest barrel turn. Tests barrel speed under game demands.'] },
    ],
    cues: [],
    feels: [],
    outcomeChallenges: [],
    practicePlan: [
      { day: 1, label: 'Barrel Turn — Tighten the Path', environment: 'tee', focus: 'Steering wheel turns. Snap series. Reverse grip. Get the barrel to the zone faster.', drills: ['Steering Wheel Turns', 'Snap Series', 'Reverse Grip Drill'], duration: '20 min' },
      { day: 2, label: 'Overload — Build Force', environment: 'tee', focus: 'Heavy bat swings. Step-behind swings. Build rotational force.', drills: ['Overload Swings', 'Step-Behind Swings'], duration: '20 min' },
      { day: 3, label: 'Underload — Build Speed', environment: 'tee', focus: 'Light bat swings. Max intent rounds. Train the CNS to fire fast.', drills: ['Underload Swings', 'Max Intent Rounds'], duration: '20 min' },
      { day: 4, label: 'Combo — Overload + Underload', environment: 'tee', focus: 'Alternate heavy and light bat. Train both force and speed.', drills: ['Overload Swings', 'Underload Swings', 'Run-Up Swings'], duration: '20 min' },
      { day: 5, label: 'Transfer — Flips', environment: 'flips', focus: 'High intent flips with game bat. Command drill. Fire fast from launch.', drills: ['High Intent Flips', 'Command Drill'], duration: '20 min' },
      { day: 6, label: 'Transfer — Machine', environment: 'machine', focus: 'Velocity ladder. Inside pitch machine. Test speed at game velocity.', drills: ['Velocity Ladder', 'Fastball In — Machine'], duration: '20 min' },
      { day: 7, label: 'Compete & Review', environment: 'live', focus: 'Max intent compete. Review: is the barrel getting there faster? If not, consider Bat Speed Program.', drills: ['Max Intent Rounds'], duration: '20 min', note: 'Bat speed is trainable. Strength and rotational power raise the ceiling — consider Bat Speed Program or Lifting Vault.' },
    ],
  },
  'disconnected': {
    topicId: 'disconnected',
    whatsHappening: 'Your body and barrel aren\'t working together. The swing feels armsy — arms do all the work while the body disconnects. Force that should chain from the ground through the hips and torso into the barrel is leaking out. This is an energy transfer problem. The body produces force, but it doesn\'t get to the barrel efficiently.',
    whyItHappens: [
      'Arms separate from body rotation — the hands get away from the torso during the turn',
      'No connection between torso and hands — the body turns but the barrel doesn\'t follow',
      'Casting — hands push away from the body, creating a long path and weak turn',
      'Body stops but arms keep going — no continuity in the kinetic chain',
      'Never trained connection specifically — only trained the full swing, never the chain',
    ],
    whatToLearn: [
      'Connection is how energy transfers from body to barrel — it\'s the chain, not the swing',
      'Body leads, barrel follows — if the body and barrel move at the same time, connection is lost',
      'Tight turns, not long paths — the hands must stay close to the body through the turn',
      'Connection drills train the chain, not positions — feel the force transfer',
    ],
    whatBadLooksLike: 'Armsy swing. Casting. Long path. Body and barrel out of sync. Hands get away from the body. Swing feels weak despite effort.',
    whatGoodLooksLike: 'Body leads barrel. Tight turns. Connected feel. Efficient rotation. Force chains from ground to barrel. Swing feels effortless.',
    badVideoUrl: '', goodVideoUrl: '',
    drillProgression: [
      { stage: 'foundation', label: 'Connection Training (Tee)', drills: ['Connection Ball Drill — Purpose: Ball between forearms. Forces arms to stay connected to body rotation. If the ball drops, you disconnected.', 'Bat on Shoulder Drill — Purpose: Bat rests on shoulder. Body must lead barrel. Can\'t use arms to start the swing.', 'Fence Constraint Drill — Purpose: Swing near fence. If you cast, you hit the fence. Forces tight path.', 'PVC Connection Turns — Purpose: PVC behind back. Turn and feel body-barrel connection. No arms.', 'Short Bat Connection — Purpose: Short bat forces tight turns. Can\'t cheat with bat length.'] },
      { stage: 'skill-building', label: 'Connection Under Motion (Flips)', drills: ['Walk-Through Connection — Purpose: Walk into swing. Feel the chain from ground to barrel. Fixes dead legs.', 'Stop at Contact into Bag — Purpose: Swing into bag. Feel force transfer at contact. Body leads barrel.', 'Front Toss — Stop at Contact — Purpose: Freeze on moving ball. Check connection at contact. Are you connected or casting?'] },
      { stage: 'transfer', label: 'Connection at Game Speed', drills: ['High Intent Flips — Purpose: Max intent with connection maintained. Can you stay connected at full effort?', 'Consecutive Hard-Hit Challenge — Purpose: Stack hard-hit balls. Connection produces consistent hard contact.'] },
    ],
    cues: [],
    feels: [],
    outcomeChallenges: [],
    practicePlan: [
      { day: 1, label: 'Connection — Feel the Chain', environment: 'tee', focus: 'Connection ball drill. Bat on shoulder. Feel the body lead the barrel.', drills: ['Connection Ball Drill', 'Bat on Shoulder Drill'], duration: '20 min' },
      { day: 2, label: 'Tight Turns — No Casting', environment: 'tee', focus: 'Fence constraint. Short bat connection. PVC turns. Stay tight.', drills: ['Fence Constraint Drill', 'Short Bat Connection', 'PVC Connection Turns'], duration: '20 min' },
      { day: 3, label: 'Connection Under Motion', environment: 'tee', focus: 'Walk-through connection. Stop at contact into bag. Feel the chain in motion.', drills: ['Walk-Through Connection', 'Stop at Contact into Bag'], duration: '20 min' },
      { day: 4, label: 'Flips — Connected Contact', environment: 'flips', focus: 'Front toss stop at contact. Check: are you connected or casting?', drills: ['Front Toss — Stop at Contact'], duration: '20 min' },
      { day: 5, label: 'Intent — Stay Connected at Full Effort', environment: 'flips', focus: 'High intent flips. Can you stay connected at max effort?', drills: ['High Intent Flips'], duration: '20 min' },
      { day: 6, label: 'Transfer — Overhand', environment: 'overhand', focus: 'Overhand BP with connection focus. Body leads barrel at game speed.', drills: ['Overhand Middle Round'], duration: '20 min' },
      { day: 7, label: 'Compete & Review', environment: 'live', focus: 'Consecutive hard-hit challenge. Connected = hard. Disconnected = weak.', drills: ['Consecutive Hard-Hit Challenge'], duration: '20 min', note: 'Connection transfers energy. If force is still low, the issue may be physical — consider Rotational Power Program.' },
    ],
  },
  'no-power': {
    topicId: 'no-power',
    whatsHappening: 'No extra-base hits. Everything is a single or an out. You can\'t drive the ball for distance or authority. Power is the product of bat speed × connection × strength. The cause could be one or multiple: poor connection (energy leaks), low bat speed (barrel is slow), or lack of physical strength (not enough force production). This section diagnoses which one and routes to the right solution.',
    whyItHappens: [
      'Poor connection — force doesn\'t chain from ground to barrel efficiently',
      'Low bat speed — barrel can\'t move fast enough to generate exit velocity',
      'Lack of physical strength — not enough force production for this level',
      'Lack of rotational power — can\'t produce force through hip and torso rotation',
      'Low intent — not swinging to do damage, just making contact',
      'Poor use of the ground — dead legs, no lower half contribution',
    ],
    whatToLearn: [
      'Power = Bat Speed × Connection × Strength — fix the weakest link',
      'Connection drills fix energy transfer (skill)',
      'Overload/underload and intent training fix bat speed (neural)',
      'Strength and rotational power programs fix force production (physical)',
      'If skill training alone doesn\'t raise exit velo, the issue is physical — need a program',
      'Strength and rotational power raise the ceiling — bat speed training helps you use that strength faster',
    ],
    whatBadLooksLike: 'No gap power. No extra bases. Weak fly balls. No damage. Ball doesn\'t carry. Outfielders play shallow.',
    whatGoodLooksLike: 'Uses the ground. Drives through the ball. Intent on every swing. Gap-to-gap power. Ball carries. Outfielders play deep.',
    badVideoUrl: '', goodVideoUrl: '',
    drillProgression: [
      { stage: 'foundation', label: 'Connection & Ground Force (Tee)', drills: ['Happy Gilmore Drill — Purpose: Walk into swing. Build momentum and ground force. Fixes dead legs and no lower half.', 'Walk-Through Connection — Purpose: Feel the energy chain. Ground → hips → torso → barrel.', 'Out Front Tee — Purpose: Extend through contact. Train the barrel to stay through the zone.'] },
      { stage: 'skill-building', label: 'Bat Speed & Intent', drills: ['Overload Swings (Heavy Bat) — Purpose: Build rotational force. If the issue is strength, this is where it shows.', 'Step-Behind Swings — Purpose: Build momentum into power chain. Fixes static energy.', 'Run-Up Swings — Purpose: Maximum momentum into max intent contact.', 'Max Intent Rounds — Purpose: Every swing is max effort. Train the CNS to fire at 100%.'] },
      { stage: 'transfer', label: 'Output Testing & Competition', drills: ['High Intent Flips — Purpose: Max intent against a moving ball. Does the power transfer from tee to live?', 'Damage Round — Purpose: Every swing is to do damage. Attack the ball.', 'Consecutive Hard-Hit Challenge — Purpose: Stack hard-hit balls. Test output under competition.', 'HR Derby Pull — Purpose: Full pull swings for distance. Test power ceiling.'] },
    ],
    cues: [],
    feels: [],
    outcomeChallenges: [],
    practicePlan: [
      { day: 1, label: 'Ground Force — Use the Lower Half', environment: 'tee', focus: 'Happy Gilmore. Walk-through connection. Build momentum from the ground up.', drills: ['Happy Gilmore Drill', 'Walk-Through Connection'], duration: '20 min' },
      { day: 2, label: 'Overload — Build Force', environment: 'tee', focus: 'Heavy bat swings. Step-behind swings. Build rotational force.', drills: ['Overload Swings', 'Step-Behind Swings'], duration: '20 min' },
      { day: 3, label: 'Max Intent — Train the CNS', environment: 'tee', focus: 'Max intent rounds. Run-up swings. Every swing is max effort.', drills: ['Max Intent Rounds', 'Run-Up Swings'], duration: '20 min' },
      { day: 4, label: 'Transfer — Flips with Damage', environment: 'flips', focus: 'High intent flips. Damage round. Does the power transfer to a moving ball?', drills: ['High Intent Flips', 'Damage Round'], duration: '20 min' },
      { day: 5, label: 'Extension — Through the Ball', environment: 'tee', focus: 'Out front tee. Extend through contact. Drive the ball, don\'t cut it.', drills: ['Out Front Tee', 'Max Intent Rounds'], duration: '20 min' },
      { day: 6, label: 'Competition — Test Output', environment: 'live', focus: 'Consecutive hard-hit challenge. HR derby pull. Test the power ceiling.', drills: ['Consecutive Hard-Hit Challenge', 'HR Derby Pull'], duration: '20 min' },
      { day: 7, label: 'Review & Program Decision', environment: 'live', focus: 'Review: is the issue connection, bat speed, or physical strength? Route to the right solution.', drills: ['Damage Round'], duration: '20 min', note: 'Power = Bat Speed × Connection × Strength. If drills alone aren\'t enough, consider: Bat Speed Program, Rotational Power Program, or Lifting Vault.' },
    ],
  },
};

// ── Lookup helpers ────────────────────────────────────────────────────────────

export function getCategoryEducation(categoryId: string): CategoryEducation | undefined {
  return CATEGORY_EDUCATION[categoryId];
}

export function getTopicContent(topicId: string): TopicContent | undefined {
  return TOPIC_CONTENT[topicId];
}

// ── Day environment labels ──────────────────────────────────────────────────

export const ENVIRONMENT_LABELS: Record<DrillEnvironment, { label: string; icon: string; color: string }> = {
  tee: { label: 'Tee Work', icon: 'construct-outline', color: '#3b82f6' },
  flips: { label: 'Front Toss / Flips', icon: 'swap-horizontal-outline', color: '#22c55e' },
  overhand: { label: 'Overhand BP', icon: 'arrow-up-outline', color: '#f59e0b' },
  machine: { label: 'Machine', icon: 'cog-outline', color: '#ef4444' },
  live: { label: 'Live / Compete', icon: 'trophy-outline', color: '#8b5cf6' },
};

// ═══════════════════════════════════════════════════════════════════════════════
// TIMING PHILOSOPHY & DRILL GROUPS
// ═══════════════════════════════════════════════════════════════════════════════

export interface TimingDrillGroup {
  name: string;
  description: string;
  color: string;
  drillIds: string[];
}

export const TIMING_PHILOSOPHY = {
  core: 'Always be ready for the best fastball a pitcher can throw. If you are on time for the best fastball, you can adjust to anything slower.',
  pillars: [
    { label: 'Rhythm', description: 'How you get moving. Your pre-pitch flow into launch position.', color: '#e11d48' },
    { label: 'Launch Quickness', description: 'How fast you can fire FROM launch position. Not how fast you get TO it.', color: '#f59e0b' },
    { label: 'Adjustability / Decision', description: 'Can you hold, see, and decide before committing? Can you adjust to speed changes?', color: '#3b82f6' },
    { label: 'True Timing', description: 'Putting it all together against real ball flight — overhand, machine, compete.', color: '#22c55e' },
  ],
  mechanicalVsOutcome: 'Days 1–4 are mechanical (tee and flips). You are learning and feeling the move. Days 5–7 are outcome (overhand, machine, compete). You are testing it against real ball flight. Don\'t skip the mechanical work.',
};

export const TIMING_DRILL_GROUPS: TimingDrillGroup[] = [
  {
    name: 'Rhythm',
    description: 'Get moving. Flow into launch.',
    color: '#e11d48',
    drillIds: ['rhythm-rockers', 'heel-load-v2', 'step-back-v2', 'happy-gilmore'],
  },
  {
    name: 'Launch Quickness',
    description: 'Be fast FROM launch. No extra movement.',
    color: '#f59e0b',
    drillIds: ['command-drill-v2', 'bellis-hover', 'go-drill', 'rapid-fire-flips'],
  },
  {
    name: 'Adjustability / Decision',
    description: 'Hold, see, decide. Adjust to speed.',
    color: '#3b82f6',
    drillIds: ['variable-front-toss', '7-ball-drill-flips', 'color-ball-flips', '7-ball-drill-oh', '7-ball-drill-machine', 'color-ball-machine', 'mixed-machine'],
  },
  {
    name: 'True Timing',
    description: 'Test it against real ball flight.',
    color: '#22c55e',
    drillIds: ['swing-at-release-flips', 'swing-at-release-oh', 'swing-at-release-machine', 'overhand-timing', 'on-time-challenge', 'line-drive-timing', 'fb-ready-round', 'timing-transfer'],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// CONTACT PHILOSOPHY & DRILL GROUPS
// ═══════════════════════════════════════════════════════════════════════════════

export interface ContactDrillGroup {
  name: string;
  description: string;
  color: string;
  drillIds: string[];
}

export const CONTACT_PHILOSOPHY = {
  core: 'Hitting is the ability to be on time, control the barrel, control the contact point, control direction, and hit the ball hard. Most hitters don\'t struggle because they don\'t know mechanics — they struggle because they can\'t control the barrel and the contact point. This section teaches hitters how to control the baseball.',
  progression: [
    { label: 'Tee', description: 'Learn the movement. Slow reps. Feel every position.', color: '#3b82f6' },
    { label: 'Flips', description: 'Practice the movement against a moving ball.', color: '#22c55e' },
    { label: 'Machine', description: 'Transfer to game speed. Test barrel control at real velocity.', color: '#ef4444' },
    { label: 'Competition', description: 'Perform under pressure. Line drives, hard ground balls, balls in play.', color: '#8b5cf6' },
  ],
  whatThisSectionTrains: 'Barrel control, contact point control, direction, adjustability, launch quickness, and ball flight control. The connection is: swing movement → contact point → barrel path → ball flight.',
};

export const CONTACT_DRILL_GROUPS: ContactDrillGroup[] = [
  {
    name: 'Foundation',
    description: 'Learn the movement. Tee work. Slow reps. Feel the barrel path.',
    color: '#3b82f6',
    drillIds: ['high-tee-stop', 'deep-tee', 'out-front-tee', 'high-tee-no-fly', 'pvc-pipe', 'two-ball-tee', 'connection-ball', 'inside-tee', 'line-drive-gb-rounds'],
  },
  {
    name: 'Skill Building',
    description: 'Control the barrel. Train hand strength, barrel path, and direction.',
    color: '#22c55e',
    drillIds: ['swing-over-tee', 'split-grip-swings', 'barry-bonds-tee', 'top-hand-swings', 'bottom-hand-swings-short', 'freddie-drill', 'closed-stance-swings', 'trout-step', 'front-hip-tee', 'command-drill-v2'],
  },
  {
    name: 'Transfer',
    description: 'Movement under motion. Flips, machine, and live transfer.',
    color: '#f59e0b',
    drillIds: ['front-toss-stop', 'side-flips-contact', 'arise-deep-tee-flips', 'barry-bonds-flips', 'angled-flips', 'front-hip-flips', 'pull-side-rounds', 'go-drill', 'machine-timing-rounds'],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// POSTURE & DIRECTION PHILOSOPHY, BALL FLIGHT FEEDBACK, DRILL GROUPS
// ═══════════════════════════════════════════════════════════════════════════════

export const POSTURE_PHILOSOPHY = {
  core: 'Posture and direction go together. If posture is lost, direction is usually lost. If direction is lost, the barrel cuts across the ball. We want north-south through the baseball, not east-west around it.',
  keyTakeaway: 'If you can\'t go opposite field, you don\'t have an opposite-field problem. You have a posture and direction problem.',
  whatThisMeans: 'Standing up through contact, pulling off, spinning off, losing side bend, and struggling to go oppo are all expressions of the same underlying issue: the barrel is working around the ball instead of through it.',
  progression: [
    { label: 'Tee', description: 'Learn the movement. Feel posture under rotation. Stop at contact. Check your work.', color: '#3b82f6' },
    { label: 'Flips', description: 'Perform the movement. Direction and posture against a moving ball.', color: '#22c55e' },
    { label: 'Machine', description: 'Transfer the movement. Hold posture against real velocity.', color: '#ef4444' },
    { label: 'Compete', description: 'Line drives to all fields. Ball flight is your feedback.', color: '#8b5cf6' },
  ],
};

export interface BallFlightSignal {
  result: string;
  meaning: string;
  quality: 'bad' | 'improving' | 'good' | 'elite';
}

export const BALL_FLIGHT_FEEDBACK: BallFlightSignal[] = [
  { result: 'Pulled hard foul', meaning: 'Likely pulled off — hit outside the ball — barrel worked around it', quality: 'bad' },
  { result: 'Pulled ground ball', meaning: 'Stood up, cut across, posture or direction broke down', quality: 'bad' },
  { result: 'Slice oppo foul', meaning: 'Around the ball but late — close, not there yet', quality: 'improving' },
  { result: 'Weak oppo', meaning: 'Late or not enough barrel depth — direction is there but timing is off', quality: 'improving' },
  { result: 'Line drive up the middle', meaning: 'Better direction, better posture, stayed through it', quality: 'good' },
  { result: 'Backspin middle', meaning: 'Solid direction and through-ball path', quality: 'good' },
  { result: 'Backspin oppo', meaning: 'Elite posture + direction — stayed through the ball', quality: 'elite' },
];

export interface PostureDrillGroup {
  name: string;
  description: string;
  color: string;
  drillIds: string[];
}

export const POSTURE_DRILL_GROUPS: PostureDrillGroup[] = [
  {
    name: 'Tee Work / Movement Training',
    description: 'Learn the movement. Feel posture. Check direction.',
    color: '#3b82f6',
    drillIds: ['high-tee-stop', 'deep-tee', 'in-in-tee', 'pvc-pipe', 'move-and-hold', 'split-stance-swings', 'finish-holds'],
  },
  {
    name: 'Flips / Movement Performance',
    description: 'Perform the movement. Direction against a moving ball.',
    color: '#22c55e',
    drillIds: ['in-in-flips', 'angled-flips', 'bottom-hand-throws', 'top-hand-punch', 'short-bat-posture', 'three-quarter-middle', 'three-quarter-oppo', 'arraez-drill', 'arraez-flips-behind'],
  },
  {
    name: 'Machine / Transfer',
    description: 'Transfer it. Hold posture at game velocity.',
    color: '#f59e0b',
    drillIds: ['angled-machine', 'oppo-round-machine', 'middle-round-machine', 'line-drive-round-machine'],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// ADJUSTABILITY PHILOSOPHY & DRILL GROUPS
// ═══════════════════════════════════════════════════════════════════════════════

export const ADJUSTABILITY_PHILOSOPHY = {
  core: 'Adjustability is not freezing the body. Adjustability is controlling the move long enough for the hands and barrel to launch on time. The body can go forward — the hands cannot give up early. Be ready for the best fastball. Adjust to everything else.',
  keyTruth: 'A lot of chasing is a timing problem. If the hitter is late on the fastball, everything looks like a strike because they are in survival mode.',
  trainingLogic: [
    { label: 'Tee & Flips', description: 'Train the movement. Hold the move. Barrel depth. Separation.', color: '#3b82f6' },
    { label: 'Overhand / Machine', description: 'Train the decision. Variable speed. Pitch recognition. Approach.', color: '#f59e0b' },
    { label: 'Compete', description: 'Transfer to games. Random speed. Pressure rounds. Decision under stress.', color: '#8b5cf6' },
  ],
  simpleVersion: {
    offspeed: 'Be ready early. Hold the move. Keep the hands back. Adjust the barrel late.',
    chasing: 'Have a plan. Shrink the zone. Be ready for the fastball. Only swing at your pitch.',
    height: 'Same swing. Different shoulder angle. Adjust with your body, not your hands.',
  },
};

export interface AdjustabilityDrillGroup {
  name: string;
  description: string;
  color: string;
  drillIds: string[];
}

export const ADJUSTABILITY_DRILL_GROUPS: AdjustabilityDrillGroup[] = [
  {
    name: 'Movement Training (Tee & Flips)',
    description: 'Train the hold, barrel depth, and plane adjustment.',
    color: '#3b82f6',
    drillIds: ['hover-holds', 'preset-hand-load', '45s-with-hover', 'bellis-hover', 'deep-tee', 'random-tee', 'command-drill-v2', 'go-drill', 'pvc-pipe', 'two-ball-tee', 'low-tee', 'high-low-alternating', 'command-drill-high-low', 'high-tee-normal'],
  },
  {
    name: 'Decision Training (Overhand / Flips)',
    description: 'Train pitch recognition, zone control, and approach.',
    color: '#f59e0b',
    drillIds: ['variable-front-toss', 'slow-breaking-feeds', 'weighted-foam-recognition', 'zone-hitting-rounds', 'shrink-zone-drill', 'two-strike-approach', 'count-approach-rounds', 'strike-ball-foam', 'mixed-bp-approach', 'gap-to-gap-fb', 'high-round-flips', 'low-round-flips', 'mixed-height-toss'],
  },
  {
    name: 'Transfer & Compete (Machine / Live)',
    description: 'Transfer to game speed. Compete with adjustability.',
    color: '#8b5cf6',
    drillIds: ['three-plate-machine', 'fb-breaking-mix', 'slow-loopy-curve', 'high-machine-day', 'low-machine-day', 'backspin-challenge', 'oppo-ld-offspeed', 'pull-air-hanging', 'take-swing-recognition', 'random-speed-compete'],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// APPROACH & GAME PERFORMANCE PHILOSOPHY & DATA
// ═══════════════════════════════════════════════════════════════════════════════

export const APPROACH_PHILOSOPHY = {
  core: 'Hitting in games is a decision-making skill, not just a swing skill. Most hitters train mechanics too much and decision making too little. The goal is to build game hitters, not cage hitters.',
  principles: [
    'Damage early, battle late.',
    'Hunt, don\'t guess.',
    'Don\'t miss your pitch.',
    'With two strikes, become a nightmare.',
    'Passive hitters get themselves out. Aggressive hitters make the pitcher get them out.',
    'Practice must be harder than the game.',
    'Random practice builds game hitters.',
    'Decisions > Mechanics in games.',
    'Be selectively aggressive.',
  ],
  bpVsGames: 'BP is predictable and mechanical. Games are unpredictable and decision-based. Many hitters are mechanical hitters, not game hitters. If practice is easier than the game, the game speeds up. If practice is harder than the game, the game slows down.',
  trainingTransfer: 'Block practice builds mechanics. Random practice builds hitters. The path is: Tee → Flips → Overhand → Mixed BP → Machine → High Velo → Live → Compete → Game.',
};

export interface CountApproach {
  count: string;
  approach: string;
  intent: 'damage' | 'compete' | 'protect';
}

export const COUNT_LEVERAGE: CountApproach[] = [
  { count: '0-0', approach: 'Hunt your pitch', intent: 'damage' },
  { count: '1-0', approach: 'Damage', intent: 'damage' },
  { count: '2-0', approach: 'Damage', intent: 'damage' },
  { count: '3-1', approach: 'Damage', intent: 'damage' },
  { count: '0-1', approach: 'Shrink zone slightly', intent: 'compete' },
  { count: '1-1', approach: 'Tough pitch to hit', intent: 'compete' },
  { count: '2-2', approach: 'Compete', intent: 'compete' },
  { count: '3-2', approach: 'Compete', intent: 'compete' },
  { count: '0-2', approach: 'Protect / Battle', intent: 'protect' },
  { count: '1-2', approach: 'Protect / Battle', intent: 'protect' },
];

export interface PitcherType {
  type: string;
  description: string;
  approach: string;
  color: string;
}

export const PITCHER_TYPES: PitcherType[] = [
  { type: 'North-South (FF/CH/CB)', description: 'Works up and down. Fastball up, changeup and curve down.', approach: 'Look up — sit on the fastball', color: '#ef4444' },
  { type: 'East-West (Sinker/Slider/Cutter)', description: 'Works side to side. Runs and cuts the ball.', approach: 'Look in or away — pick a side', color: '#3b82f6' },
  { type: 'High Velocity', description: 'Overpowers hitters with velocity.', approach: 'Look middle — be ready for the best fastball', color: '#f59e0b' },
  { type: 'Offspeed Pitcher', description: 'Gets hitters out with spin and speed changes.', approach: 'Sit back — look backside', color: '#22c55e' },
  { type: 'Wild Pitcher', description: 'No command. Inconsistent zone.', approach: 'Shrink zone — take until your pitch', color: '#8b5cf6' },
  { type: 'Strike Thrower', description: 'Pounds the zone. Throws strikes consistently.', approach: 'Be aggressive early — attack', color: '#e11d48' },
];

export interface WeeklyApproachDay {
  day: number;
  label: string;
  focus: string;
  color: string;
}

export const WEEKLY_APPROACH_STRUCTURE: WeeklyApproachDay[] = [
  { day: 1, label: 'Count & Zone Rounds', focus: 'Approach training. Hunt zones. Count leverage.', color: '#3b82f6' },
  { day: 2, label: 'Machine (Velo + Offspeed)', focus: 'Speed and adjustability at game velocity.', color: '#ef4444' },
  { day: 3, label: 'Situations', focus: 'Situational BP. Runner scenarios. Execute.', color: '#22c55e' },
  { day: 4, label: 'Mixed BP + Barrel Game', focus: 'Random pitch BP. Barrel game with stakes.', color: '#f59e0b' },
  { day: 5, label: 'Live AB / Compete', focus: 'Live ABs. Competition rounds. Pressure.', color: '#8b5cf6' },
  { day: 6, label: 'Small Ball / Vision', focus: 'Recognition training. Barrel control. Adjustability.', color: '#0891b2' },
  { day: 7, label: 'Game', focus: 'Execute everything. Compete. Hunt your pitch.', color: '#e11d48' },
];

export interface PreGameRound {
  round: number;
  label: string;
  focus: string;
}

export const PREGAME_ROUTINE: PreGameRound[] = [
  { round: 1, label: 'Timing', focus: 'Get on time. Feel your move. Be ready.' },
  { round: 2, label: 'Opposite Field', focus: 'Oppo line drives. Direction. Stay through it.' },
  { round: 3, label: 'Pull Side', focus: 'Turn on it. Pull side air. Damage.' },
  { round: 4, label: 'Situational', focus: 'Move runner. Sac fly. Quality AB.' },
  { round: 5, label: 'Game Speed', focus: 'Full speed. Full approach. Be on time.' },
  { round: 6, label: 'Confidence', focus: 'See it. Hit it. Walk out ready.' },
];

export interface ApproachDrillGroup {
  name: string;
  description: string;
  color: string;
  drillIds: string[];
}

export const APPROACH_DRILL_GROUPS: ApproachDrillGroup[] = [
  {
    name: 'Approach & Zone Control',
    description: 'Teach plan, count leverage, zone hunting, situational awareness.',
    color: '#3b82f6',
    drillIds: ['zone-hunting', 'count-hitting', 'situation-rounds', 'limited-swings', 'damage-count-rounds', 'count-approach-rounds'],
  },
  {
    name: 'Aggression & Damage Training',
    description: 'Train controlled aggression, early count damage, and intent.',
    color: '#ef4444',
    drillIds: ['first-pitch-swing', 'damage-round', 'early-count-damage', 'sit-fb-round', 'gap-to-gap-fb'],
  },
  {
    name: 'Two-Strike & Barrel Control',
    description: 'Compete with 2 strikes. Shorten. Battle. Put the ball in play.',
    color: '#f59e0b',
    drillIds: ['two-strike-approach', 'choke-up-rounds', 'bad-pitch-hitting', 'oppo-two-strike', 'foul-ball-rounds', '2-strike-machine', 'must-put-in-play'],
  },
  {
    name: 'Game Transfer & Competition',
    description: 'Pressure rounds, barrel games, AB simulations, random practice.',
    color: '#8b5cf6',
    drillIds: ['barrel-game', 'barrel-game-hard', 'pressure-rounds', 'ab-simulation', 'count-battle-game', 'situational-challenge', '2-strike-battle', '21-outs-game', 'high-velo-machine', 'short-distance-bp', 'mixed-pitch-bp', 'random-pitch-machine'],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// POWER / BAT SPEED / CONNECTION — PHILOSOPHY, DIAGNOSTIC, PROGRAMS
// ═══════════════════════════════════════════════════════════════════════════════

export const POWER_PHILOSOPHY = {
  core: 'Weak contact, low exit velocity, no power, slow bat speed, and disconnected swings are output problems — not swing position problems. The cause could be skill (contact point, barrel control), movement (connection, energy transfer), speed (bat speed, neural), or physical (strength, rotational power). Not all power problems are swing problems. Many are strength and force production problems.',
  equation: 'Power = Bat Speed × Connection × Strength',
  keyTruth: 'Strength and rotational power raise your power ceiling. Bat speed training helps you use that strength faster. Connection training makes the energy chain efficient. If drills alone don\'t raise exit velo, the issue is physical — you need a program.',
  trainingBuckets: [
    { label: 'Connection', description: 'Energy transfer from body to barrel. Drills fix this.', type: 'skill' as const, color: '#3b82f6' },
    { label: 'Bat Speed', description: 'Neural speed. Overload/underload and intent training.', type: 'speed' as const, color: '#f59e0b' },
    { label: 'Strength & Rotational Power', description: 'Force production. Requires strength programs.', type: 'physical' as const, color: '#ef4444' },
  ],
};

export interface PowerDiagnosticCategory {
  category: string;
  description: string;
  route: string;
  color: string;
}

export const POWER_DIAGNOSTIC_ROUTES: PowerDiagnosticCategory[] = [
  { category: 'Barrel Control Issue', description: 'Foul balls, swing and miss, mishits', route: 'Contact Point & Barrel Control drills', color: '#3b82f6' },
  { category: 'Contact Point Issue', description: 'Jammed, ball gets too deep, ground balls', route: 'Contact Point drills', color: '#3b82f6' },
  { category: 'Connection Issue', description: 'Armsy, disconnected, out of sync', route: 'Connection drills (this section)', color: '#22c55e' },
  { category: 'Bat Speed Issue', description: 'Slow barrel, can\'t catch up, long path', route: 'Bat Speed Program', color: '#f59e0b' },
  { category: 'Strength Issue', description: 'Low exit velo despite good connection and timing', route: 'Rotational Power Program / Lifting Vault', color: '#ef4444' },
];

export interface ProblemCauseMap {
  problem: string;
  cause: string;
}

export const POWER_PROBLEM_MAP: ProblemCauseMap[] = [
  { problem: 'Weak contact', cause: 'Strength / Connection' },
  { problem: 'Low exit velo', cause: 'Strength / Bat Speed' },
  { problem: 'No power', cause: 'Strength / Bat Speed' },
  { problem: 'Swing feels slow', cause: 'Bat Speed / Neural Speed' },
  { problem: 'Feels disconnected', cause: 'Connection / Energy Transfer' },
  { problem: 'Foul balls', cause: 'Barrel Control' },
  { problem: 'Swing and miss', cause: 'Barrel Control' },
  { problem: 'Jammed', cause: 'Contact Point' },
  { problem: 'Roll over', cause: 'Barrel Path' },
  { problem: 'Under the ball', cause: 'Barrel Path' },
];

export interface ProgramRecommendation {
  name: string;
  description: string;
  route: string;
  color: string;
  icon: string;
}

export const POWER_PROGRAM_RECOMMENDATIONS: ProgramRecommendation[] = [
  { name: 'Bat Speed Program', description: 'Overload/underload training. Neural speed development. Move the barrel faster.', route: 'bat-speed-program', color: '#f59e0b', icon: 'flash-outline' },
  { name: 'Rotational Power Program', description: 'Med ball work, rotational strength, force production through rotation.', route: 'rotational-power', color: '#ef4444', icon: 'fitness-outline' },
  { name: 'Lifting Vault', description: 'Full strength program. Build the physical foundation for power.', route: 'lifting-vault', color: '#8b5cf6', icon: 'barbell-outline' },
  { name: 'Upgrade to Triple Tier', description: 'Custom plan combining bat speed, rotational power, and strength training.', route: 'upgrade', color: '#e11d48', icon: 'rocket-outline' },
];

export interface PowerDrillGroup {
  name: string;
  description: string;
  color: string;
  drillIds: string[];
}

export const POWER_DRILL_GROUPS: PowerDrillGroup[] = [
  {
    name: 'Connection (Energy Transfer)',
    description: 'Transfer energy from body to barrel efficiently. Drills fix this.',
    color: '#3b82f6',
    drillIds: ['connection-ball', 'bat-on-shoulder', 'fence-constraint', 'pvc-connection-turns', 'walk-through-connection', 'stop-at-contact-bag', 'short-bat-connection', 'front-toss-stop'],
  },
  {
    name: 'Bat Speed (Neural / Intent)',
    description: 'Move the barrel faster. CNS speed and intent training.',
    color: '#f59e0b',
    drillIds: ['steering-wheel', 'snap-series', 'reverse-grip', 'overload-swings', 'underload-swings', 'step-behind-swings', 'run-up-swings', 'max-intent-rounds', 'command-drill-v2'],
  },
  {
    name: 'Power Output & Competition',
    description: 'Test output. Compete. Drive the ball.',
    color: '#22c55e',
    drillIds: ['damage-round', 'high-intent-flips', 'happy-gilmore', 'velocity-ladder', 'consecutive-hard-hit', 'hr-derby-pull'],
  },
];

export const ENVIRONMENT_TEACHING = {
  tee: 'Learn the move. Slow reps. Feel every position.',
  flips: 'Perform the move against a moving ball. Same cues.',
  overhand: 'Transfer the move to game-speed pitching.',
  machine: 'Time the move. Test it against real velocity.',
  live: 'Review and compete. Did the change stick?',
};
