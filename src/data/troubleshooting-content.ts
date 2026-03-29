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

export interface TopicContent {
  topicId: string;
  whatsHappening: string;
  whyItHappens: string[];
  whatBadLooksLike: string;
  whatGoodLooksLike: string;
  /** Placeholder video refs — empty string means no video yet */
  badVideoUrl: string;
  goodVideoUrl: string;
  practicePlan: PracticeDayPlan[];
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
    whatItIncludes: 'Timing covers everything related to when your swing starts and how it syncs with the pitch. Being late, being early, feeling rushed, getting jammed, struggling with velocity, and having timing break down between tee work and games — all fall here.',
    whyYouStruggle: [
      'Your rhythm starts too late or too big',
      'You\'re not getting to your load early enough',
      'You rush through your move instead of letting it happen',
      'You only train timing on the tee, not against moving balls or machines',
      'You change your timing approach too often instead of committing to one',
      'You struggle to match the pitcher\'s tempo',
    ],
    signsThisIsYou: [
      'Foul balls straight back',
      'Getting jammed consistently',
      'Feeling rushed in every at-bat',
      'Swinging extra hard just to catch up',
      'Looking great on the tee but struggling in games',
      'Struggling against faster pitching',
    ],
  },
  contact: {
    categoryId: 'contact',
    whatItIncludes: 'Contact point and barrel control covers the quality of your contact — where the barrel meets the ball, how flush it is, and what happens at the moment of impact. Rolling over, popping up, weak ground balls, no backspin, and inconsistent barrel are all contact issues.',
    whyYouStruggle: [
      'The ball gets too deep before you turn the barrel',
      'Your contact point is inconsistent',
      'Poor barrel control through the hitting zone',
      'You get under or around the ball too often',
      'Not getting the barrel out front enough',
      'Posture changes before contact',
    ],
    signsThisIsYou: [
      'Lots of rollovers to the pull side',
      'Pop-ups or fly balls with no carry',
      'Weak contact even when you feel on time',
      'Mishits off the end or handle',
      'No backspin on line drives',
      'Poor barrel feel through the zone',
    ],
  },
  posture: {
    categoryId: 'posture',
    whatItIncludes: 'Posture and direction is about your body position through the swing and where the ball goes. Pulling off, opening too early, losing posture, spinning off the ball, and struggling to use all fields are posture and direction problems.',
    whyYouStruggle: [
      'Your front side flies open before contact',
      'You open too soon and lose direction',
      'Your posture breaks down mid-swing',
      'You cut your swing off instead of staying through',
      'You spin instead of moving through the ball',
    ],
    signsThisIsYou: [
      'Can\'t go opposite field',
      'Everything pulls',
      'Feel like you spin off the ball',
      'Lose posture through the swing',
      'Struggle staying through contact',
      'Misses feel directional — always one way',
    ],
  },
  adjustability: {
    categoryId: 'adjustability',
    whatItIncludes: 'Adjustability covers how well you can adjust to different pitches, speeds, and locations during the swing. Struggling with spin, being early on offspeed, freezing on breaking balls, and not being able to adjust once committed are adjustability problems.',
    whyYouStruggle: [
      'Poor pitch recognition — you can\'t read spin early enough',
      'Your timing window is too rigid to adjust',
      'No adjustability built into your move',
      'Not enough practice against varied pitch types',
      'Not enough machine or live transfer work',
    ],
    signsThisIsYou: [
      'Swinging over breaking balls',
      'Being way early on offspeed',
      'Freezing on spin — can\'t pull the trigger',
      'Giving away at-bats against breaking stuff',
      'Feeling unable to adjust once your swing starts',
    ],
  },
  approach: {
    categoryId: 'approach',
    whatItIncludes: 'Approach is your plan before and during the at-bat — what you\'re looking for, how you use counts, when to be aggressive, when to compete, and how to transfer practice quality to game performance.',
    whyYouStruggle: [
      'No clear plan before the at-bat',
      'Swinging at the pitcher\'s pitches instead of yours',
      'Not understanding what counts mean for your approach',
      'Pressing in games instead of competing',
      'No pre-game or between-AB routine',
      'Poor self-awareness about what went wrong',
    ],
    signsThisIsYou: [
      'Chase too many pitches out of the zone',
      'Freeze on pitches you should swing at',
      'Never know what pitch you\'re looking for',
      'Good in practice but not in games',
      'Struggle in hitter\'s counts',
      'Poor decisions with 2 strikes',
    ],
  },
  power: {
    categoryId: 'power',
    whatItIncludes: 'Barrel speed, strength, and connection covers how much force you produce and how efficiently it gets to the barrel. Low exit velo, slow swing, feeling disconnected, armsy swings, and weak contact even on decent swings are all power and connection issues.',
    whyYouStruggle: [
      'Not enough strength to drive the ball',
      'Poor connection — arms separate from body rotation',
      'Poor sequencing — force doesn\'t chain properly',
      'Weak rotational force production',
      'Low intent — not swinging with purpose',
      'Lack of power training outside the cage',
    ],
    signsThisIsYou: [
      'Low exit velocity',
      'Swing feels slow or labored',
      'Swing feels long — can\'t get to inside pitches',
      'Weak contact even on well-timed swings',
      'Feeling disconnected between body and barrel',
      'Feeling armsy — all arms, no body',
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
    whatsHappening: 'You commit too early and can\'t adjust. You\'re out in front of offspeed, pulling off, or lunging forward because you start the swing before you\'ve seen enough of the pitch.',
    whyItHappens: [
      'You commit your body before your eyes confirm the pitch',
      'Your load is too aggressive or starts too early',
      'You don\'t have a way to delay your trigger',
      'You\'re anxious to swing and don\'t let the pitch travel',
    ],
    whatBadLooksLike: 'Lunging forward, way out front on offspeed, pulling off, weight shift too early.',
    whatGoodLooksLike: 'Patient load, controlled stride, lets ball travel, adjusts to speed without panic.',
    badVideoUrl: '', goodVideoUrl: '',
    practicePlan: buildDefaultPlan(['Delay Load Drill', 'Variable Front Toss', 'Yes/No Drill']),
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
    whatGoodLooksLike: 'Light on feet, gentle weight shift, relaxed hands, smooth transition into swing.',
    badVideoUrl: '', goodVideoUrl: '',
    practicePlan: buildDefaultPlan(['Rhythm Rocker Drill', 'Step Back Drill', 'Belli\'s Drill']),
  },

  // ── CONTACT ──
  'rolling-over': {
    topicId: 'rolling-over',
    whatsHappening: 'You\'re rolling the barrel over at contact. The top hand takes over too early, and the result is weak ground balls to the pull side instead of line drives through the middle.',
    whyItHappens: [
      'Top hand dominates and rolls the barrel over',
      'No extension through the zone',
      'Cutting across the ball instead of staying through it',
      'Contact point is too deep — ball gets behind you',
    ],
    whatBadLooksLike: 'Barrel rolls over at contact, weak pull-side ground balls, no extension.',
    whatGoodLooksLike: 'Barrel stays through the zone, bottom hand drives direction, line drives to all fields.',
    badVideoUrl: '', goodVideoUrl: '',
    practicePlan: buildDefaultPlan(['No Roll Overs', 'Out Front Tee Drill', 'Finish Through the Middle', 'Connection Ball Drill']),
  },
  'popping-up': {
    topicId: 'popping-up',
    whatsHappening: 'You\'re getting under the ball consistently. The barrel drops below the pitch plane, and you\'re hitting the bottom half of the ball — creating pop-ups and fly balls with no carry.',
    whyItHappens: [
      'Swing plane is too steep — barrel drops',
      'Posture changes mid-swing',
      'Not matching the pitch plane with shoulder tilt',
      'Dropping the back shoulder too much',
    ],
    whatBadLooksLike: 'Uppercut swing, pop-ups, fly balls that die, barrel under the ball.',
    whatGoodLooksLike: 'Barrel matches pitch plane, line drives with backspin, stays through the zone.',
    badVideoUrl: '', goodVideoUrl: '',
    practicePlan: buildDefaultPlan(['PVC Pipe Swings', 'High Tee Normal Swing', 'Low Away Tee']),
  },
  'getting-jammed': {
    topicId: 'getting-jammed',
    whatsHappening: 'Inside pitches beat you. The ball is on your hands before the barrel gets there. You make contact off the handle or end of the bat instead of the sweet spot.',
    whyItHappens: [
      'Barrel isn\'t getting into the zone fast enough',
      'Swing path is too long to the ball',
      'Timing is late — ball arrives before the barrel',
      'Hands are too far from the body during the turn',
    ],
    whatBadLooksLike: 'Handle contact, broken bat feel, jammed to pull side, no authority inside.',
    whatGoodLooksLike: 'Early barrel turn, tight hands, clean inside contact, drive to pull side with intent.',
    badVideoUrl: '', goodVideoUrl: '',
    practicePlan: buildDefaultPlan(['Inside Tee', 'Steering Wheel Turns', 'Snap Series']),
  },
  'foul-balls': {
    topicId: 'foul-balls',
    whatsHappening: 'You can\'t square the ball up. Late foul balls back or foul balls to the pull side. You\'re close but can\'t find flush contact.',
    whyItHappens: [
      'Slightly late — barrel arrives just after the ideal contact point',
      'Barrel path doesn\'t match the pitch plane',
      'Not staying through the zone long enough',
      'Inconsistent contact point',
    ],
    whatBadLooksLike: 'Foul balls straight back, foul pull side, near-misses, inconsistent barrel.',
    whatGoodLooksLike: 'Clean barrel-to-ball, squared up contact, line drives, consistent barrel accuracy.',
    badVideoUrl: '', goodVideoUrl: '',
    practicePlan: buildDefaultPlan(['Command Drill', 'Out Front Tee Drill', 'Finish Through the Middle']),
  },

  // ── POSTURE ──
  'pulling-off': {
    topicId: 'pulling-off',
    whatsHappening: 'Your front side flies open before contact. Your head, shoulder, or hip pulls away from the ball, and everything goes to the pull side or you miss pitches you should hit.',
    whyItHappens: [
      'Front shoulder opens too early',
      'No directional intent through the ball',
      'Trying to pull everything',
      'Poor connection between body and barrel direction',
    ],
    whatBadLooksLike: 'Front side flies open, head pulls, everything pulls, weak oppo, spin off.',
    whatGoodLooksLike: 'Stays closed through contact, direction through the middle, strong all fields.',
    badVideoUrl: '', goodVideoUrl: '',
    practicePlan: buildDefaultPlan(['Freddie\'s Drill', 'Trout Step Drill', 'Bottom Hand Throws']),
  },
  'no-oppo': {
    topicId: 'no-oppo',
    whatsHappening: 'You can\'t drive the ball to the opposite field. Everything pulls regardless of pitch location. You have no opposite-field authority.',
    whyItHappens: [
      'Opening too early — can\'t let the ball travel',
      'Not adjusting posture for away pitches',
      'Contact point is always out front',
      'No practice driving the ball the other way',
    ],
    whatBadLooksLike: 'Everything pulls, weak oppo contact, can\'t use away pitches, one-dimensional.',
    whatGoodLooksLike: 'Lets ball travel deep, adjusts posture, drives through oppo gap with authority.',
    badVideoUrl: '', goodVideoUrl: '',
    practicePlan: buildDefaultPlan(['Away Tee', 'Opposite Field Only Round', 'Freddie\'s Drill']),
  },
  'losing-posture': {
    topicId: 'losing-posture',
    whatsHappening: 'You stand up through the swing. Your posture breaks down before or during contact, and you lose the ability to match the pitch plane. Your body comes up instead of staying in the swing.',
    whyItHappens: [
      'Not staying in your legs through the swing',
      'Trying to lift the ball by standing up',
      'Weak core — can\'t maintain posture under rotation',
      'Poor habit of coming out early',
    ],
    whatBadLooksLike: 'Stands up at contact, head rises, misses low pitches, inconsistent plane.',
    whatGoodLooksLike: 'Stays in legs, posture holds through contact, matches pitch height with body.',
    badVideoUrl: '', goodVideoUrl: '',
    practicePlan: buildDefaultPlan(['Mo Vaughn Drill', 'Low Away Tee', 'PVC Pipe Swings']),
  },

  // ── ADJUSTABILITY ──
  'cant-hit-offspeed': {
    topicId: 'cant-hit-offspeed',
    whatsHappening: 'Breaking balls and changeups eat you up. You either swing through them, miss under them, or freeze and watch them for strikes.',
    whyItHappens: [
      'Poor pitch recognition — can\'t read spin early',
      'Commit too early and can\'t slow down',
      'Timing window is too rigid to adjust',
      'Not enough practice against varied speeds',
    ],
    whatBadLooksLike: 'Swings over breaking balls, freezes on offspeed strikes, can\'t adjust timing.',
    whatGoodLooksLike: 'Recognizes spin, stays back, adjusts timing, drives offspeed with authority.',
    badVideoUrl: '', goodVideoUrl: '',
    practicePlan: buildDefaultPlan(['Variable Front Toss', 'Yes/No Drill', 'Delay Load Drill', 'Breaking Ball Round']),
  },
  'chasing': {
    topicId: 'chasing',
    whatsHappening: 'You swing at pitches outside the zone. The pitcher doesn\'t have to throw strikes because you give at-bats away by chasing.',
    whyItHappens: [
      'No plan — swinging at everything',
      'Can\'t recognize ball from strike fast enough',
      'Anxious to swing — afraid of getting behind',
      'No zone discipline training',
    ],
    whatBadLooksLike: 'Chasing outside the zone, expanding on 2 strikes, giving away ABs.',
    whatGoodLooksLike: 'Tight zone, takes bad pitches, attacks strikes, makes pitcher work.',
    badVideoUrl: '', goodVideoUrl: '',
    practicePlan: buildDefaultPlan(['Yes/No Drill', 'Take Until Strike', 'Zone Hunting Round']),
  },
  'cant-adjust-height': {
    topicId: 'cant-adjust-height',
    whatsHappening: 'You\'re locked into one height. You hit well at one level but struggle up or down. Can\'t adjust posture to match the pitch.',
    whyItHappens: [
      'Only practice at one tee height',
      'Don\'t adjust posture — try to adjust arms instead',
      'No training on random heights',
      'Rigid swing that doesn\'t accommodate different zones',
    ],
    whatBadLooksLike: 'Good middle, bad high, bad low. Arms reach instead of body adjusting.',
    whatGoodLooksLike: 'Same swing, different posture. Adjusts body to match pitch height cleanly.',
    badVideoUrl: '', goodVideoUrl: '',
    practicePlan: buildDefaultPlan(['2-Ball High/Low Tee', 'Random Tee Locations', 'High/Low/In/Out Callout Drill']),
  },

  // ── APPROACH ──
  'no-plan': {
    topicId: 'no-plan',
    whatsHappening: 'You walk to the plate without a plan. You react to whatever comes instead of hunting your pitch and making decisions early.',
    whyItHappens: [
      'No pre-AB routine',
      'Don\'t know what to look for',
      'Don\'t understand how counts change your approach',
      'Never practiced having a plan',
    ],
    whatBadLooksLike: 'Random swings, no pitch selection, reactive, confused at the plate.',
    whatGoodLooksLike: 'Clear plan, hunts one pitch, adjusts by count, executes with intent.',
    badVideoUrl: '', goodVideoUrl: '',
    practicePlan: buildDefaultPlan(['Zone Hunting Round', 'Count Hitting Round', '3-Pitch At-Bat Simulation']),
  },
  'too-passive': {
    topicId: 'too-passive',
    whatsHappening: 'You let good pitches go by. Not enough aggression when it\'s your pitch. You watch instead of attacking.',
    whyItHappens: [
      'Afraid to miss',
      'Waiting for the "perfect" pitch',
      'No damage intent in hitter\'s counts',
      'Lack of confidence',
    ],
    whatBadLooksLike: 'Takes hittable pitches, watches strikes, passive body language, no damage.',
    whatGoodLooksLike: 'Attacks when it\'s their pitch, aggressive in hitter\'s counts, doesn\'t miss mistakes.',
    badVideoUrl: '', goodVideoUrl: '',
    practicePlan: buildDefaultPlan(['Damage Round', 'Sit Fastball Round', 'Count Hitting Round']),
  },
  'bp-hitter': {
    topicId: 'bp-hitter',
    whatsHappening: 'You hit great in practice but can\'t take it to games. Something changes when the pressure is on or the pitch is live.',
    whyItHappens: [
      'Practice doesn\'t simulate game pressure',
      'No competition in training',
      'Different mental state in games vs. practice',
      'No routine to bridge cage work to game performance',
    ],
    whatBadLooksLike: 'Great BP, bad game performance, tenses up in ABs, different swing in games.',
    whatGoodLooksLike: 'Same swing in practice and games, competes every AB, handles pressure.',
    badVideoUrl: '', goodVideoUrl: '',
    practicePlan: buildDefaultPlan(['2-Strike Battle Round', '21 Outs Game', 'Random Pitch Machine']),
  },
  'strikeout-prone': {
    topicId: 'strikeout-prone',
    whatsHappening: 'Too many strikeouts. You either chase, miss, or freeze. Need better decisions and barrel control to put the ball in play.',
    whyItHappens: [
      'Chasing pitches out of the zone',
      'No 2-strike approach adjustment',
      'Poor barrel accuracy under pressure',
      'Decision-making breaks down late in counts',
    ],
    whatBadLooksLike: 'High K rate, chasing with 2 strikes, freezing on borderline pitches.',
    whatGoodLooksLike: 'Competes with 2 strikes, puts ball in play, battles, shorter swing.',
    badVideoUrl: '', goodVideoUrl: '',
    practicePlan: buildDefaultPlan(['2-Strike Approach Round', 'Yes/No Drill', 'Connection Ball Drill']),
  },

  // ── POWER ──
  'weak-contact': {
    topicId: 'weak-contact',
    whatsHappening: 'You make contact but it\'s always soft. No hard-hit balls. No extra-base hits. The ball comes off the bat with no authority.',
    whyItHappens: [
      'Not swinging with intent',
      'Poor extension through the zone',
      'Not using the body — all arms',
      'Weak lower half — no force from the ground',
    ],
    whatBadLooksLike: 'Soft contact, no exit velo, singles or outs, ball dies off the bat.',
    whatGoodLooksLike: 'Hard contact, exit velo up, drives balls through gaps, barrel authority.',
    badVideoUrl: '', goodVideoUrl: '',
    practicePlan: buildDefaultPlan(['High Tee Normal Swing', 'Damage Round', 'Out Front Tee Drill']),
  },
  'no-bat-speed': {
    topicId: 'no-bat-speed',
    whatsHappening: 'Your swing feels slow. The barrel can\'t get to the zone fast enough. You struggle to catch up to velocity.',
    whyItHappens: [
      'Long swing path',
      'Poor barrel turn mechanics',
      'Hands too far from body',
      'Not enough fast-twitch training',
    ],
    whatBadLooksLike: 'Slow barrel, long path, can\'t catch up, jammed by velocity.',
    whatGoodLooksLike: 'Quick barrel entry, short path, catches up to velo, snappy turn.',
    badVideoUrl: '', goodVideoUrl: '',
    practicePlan: buildDefaultPlan(['Steering Wheel Turns', 'Snap Series', 'Reverse Grip Drill']),
  },
  'disconnected': {
    topicId: 'disconnected',
    whatsHappening: 'Your body and barrel aren\'t working together. It feels armsy — like your arms are doing all the work and your body isn\'t connected to the swing.',
    whyItHappens: [
      'Arms separate from body rotation',
      'No connection between torso and hands',
      'Casting — hands get away from the body',
      'Body stops but arms keep going',
    ],
    whatBadLooksLike: 'Armsy swing, casting, long path, body and barrel out of sync.',
    whatGoodLooksLike: 'Body leads barrel, tight turns, connected feel, efficient rotation.',
    badVideoUrl: '', goodVideoUrl: '',
    practicePlan: buildDefaultPlan(['Connection Ball Drill', 'Bat on Shoulder Drill Series', 'Fence Constraint Drill']),
  },
  'no-power': {
    topicId: 'no-power',
    whatsHappening: 'No extra-base hits. Everything is a single or an out. You can\'t drive the ball for distance or authority.',
    whyItHappens: [
      'Not using the lower half to generate force',
      'Poor extension — cutting the swing off early',
      'Low intent — not swinging to do damage',
      'Weak overall strength for the level',
    ],
    whatBadLooksLike: 'No gap power, no extra bases, weak fly balls, no damage.',
    whatGoodLooksLike: 'Uses the ground, drives through the ball, intent on every swing, gap-to-gap power.',
    badVideoUrl: '', goodVideoUrl: '',
    practicePlan: buildDefaultPlan(['High Tee Normal Swing', 'Happy Gilmore Drill', 'Out Front Tee Drill']),
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

export const ENVIRONMENT_TEACHING = {
  tee: 'Learn the move. Slow reps. Feel every position.',
  flips: 'Perform the move against a moving ball. Same cues.',
  overhand: 'Transfer the move to game-speed pitching.',
  machine: 'Time the move. Test it against real velocity.',
  live: 'Review and compete. Did the change stick?',
};
