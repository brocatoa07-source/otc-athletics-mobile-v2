/**
 * Hitting Vault — Sections + Drill Cards
 *
 * 12 sections: 11 active + 1 troubleshooting (diagnostic-driven).
 * Walk tier: first 2 drills per section are free preview.
 * Single+: full access.
 *
 * Architecture: Same swing, different posture. Same swing, different contact point.
 * Progression: Tee → Flips → Machine → Live → Competition
 */

import { Ionicons } from '@expo/vector-icons';

/* ─── Progression Stage ──────────────────────────────────── */

export type ProgressionStage = 'tee' | 'flips' | 'machine' | 'live' | 'competition';

/* ─── Drill Card ──────────────────────────────────────────── */

export interface DrillCard {
  name: string;
  /** What this drill helps fix (primary field used by all existing drills) */
  fixes: string;
  /** Step-by-step instructions */
  howTo: string;
  /** Short focus cue */
  focus: string;
  /** Training environment progression */
  progression?: ProgressionStage;
  /** Equipment needed */
  equipment?: string[];
  /** Video URL for drill demo (empty string or undefined = placeholder shown) */
  videoUrl?: string;
  /** When to use this drill */
  whenToUse?: string;
  /** Common mistake athletes make with this drill */
  commonMistake?: string;
  /** Sets & reps / how long to do it */
  setsReps?: string;
}

/* ─── Section ─────────────────────────────────────────────── */

export interface VaultSection {
  key: string;
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  drills: DrillCard[];
  /** Number of drills free for Walk tier (counted from top of list) */
  freeCount: number;
  /** Placeholder section — no drills yet */
  isPlaceholder?: boolean;
}

/* ─── Sections ────────────────────────────────────────────── */

export const HITTING_VAULT_SECTIONS: VaultSection[] = [

  // ══════════════════════════════════════════════════════════════════
  // 1. HIGH TEE FOUNDATION — The core swing progression family
  // ══════════════════════════════════════════════════════════════════
  {
    key: 'foundations',
    label: 'High Tee Foundation',
    description: 'The OTC core swing progression. Same swing, different posture. Same swing, different contact point. Start here.',
    icon: 'diamond-outline',
    color: '#E10600',
    freeCount: 3,
    drills: [
      // ── Tee Progression ──
      {
        name: 'High Tee Normal Swing',
        fixes: 'No base movement pattern, inconsistent barrel.',
        howTo: 'Set the tee at the top of the zone. Full swing. Low line drives. Backspin through the middle. This is your base swing.',
        focus: 'Low line drives. Backspin through the middle.',
        progression: 'tee',
      },
      {
        name: 'High Tee — Bat on Shoulder, No Stride',
        fixes: 'Extra movement, over-complicated swing, timing noise.',
        howTo: 'Bat rests on back shoulder. No stride. Turn and hit. The body leads the barrel — nothing extra.',
        focus: 'Turn the barrel. Body first.',
        progression: 'tee',
      },
      {
        name: 'High Tee — Stop at Contact',
        fixes: 'Flying open, losing positions, no awareness.',
        howTo: 'Swing and freeze at contact. Check: barrel angle, posture, hands, direction. Full awareness.',
        focus: 'Check your work. Every position matters.',
        progression: 'tee',
      },
      {
        name: 'High Tee — Short Bat',
        fixes: 'Arm-dominant swing, casting, long path.',
        howTo: 'Use a short bat or choke up. Forces tight turns, body-driven rotation. Can\'t cheat with long arms.',
        focus: 'Short to the ball. Let the body do the work.',
        progression: 'tee',
        equipment: ['short bat or choked-up bat'],
      },
      // ── Location Progression ──
      {
        name: 'Middle Tee — Preset Posture',
        fixes: 'Can\'t adjust to different heights without changing swing.',
        howTo: 'Set tee at middle height. Preset your posture before swinging. Same swing — different posture.',
        focus: 'Same swing, different posture. Match the plane.',
        progression: 'tee',
      },
      {
        name: 'Middle Tee — Flow Into Posture',
        fixes: 'Posture only works when preset, breaks down in flow.',
        howTo: 'Set tee at middle height. Full stride and swing — flow into the right posture naturally. Don\'t preset. Trust the movement.',
        focus: 'Let posture happen. Same swing, let the body adjust.',
        progression: 'tee',
      },
      {
        name: 'Inside Tee',
        fixes: 'Getting jammed, no inside authority.',
        howTo: 'Set tee up and in. Turn the barrel early. Hands stay tight. Pull-side line drive.',
        focus: 'Turn it. Stay tight. Drive it.',
        progression: 'tee',
      },
      {
        name: 'Away Tee',
        fixes: 'Reaching, pulling off, weak oppo contact.',
        howTo: 'Set tee low and away. Get down to it with your body — posture, not arms. Drive through the right-center / left-center gap.',
        focus: 'Get down with the body. Deep and through.',
        progression: 'tee',
      },
      {
        name: 'Deep Tee',
        fixes: 'Can\'t catch the ball deep, barrel drags.',
        howTo: 'Set tee behind your front hip. Catch it deep. The barrel must turn early — can\'t reach with arms.',
        focus: 'Turn it behind you. Let it travel.',
        progression: 'tee',
      },
      {
        name: 'Out Front Tee',
        fixes: 'No extension, pulling off, cutting across.',
        howTo: 'Set tee out in front. Hit it up the middle. Extension and direction working together.',
        focus: 'Out front and through. Through the middle.',
        progression: 'tee',
      },
      // ── Transfer Progression ──
      {
        name: 'Stride + Tee',
        fixes: 'Can\'t add timing to the base swing.',
        howTo: 'Add your full stride to tee work. Load, stride, land, swing. Keep the same positions — add rhythm.',
        focus: 'Same swing. Add timing.',
        progression: 'tee',
      },
      {
        name: '2-Ball High/Low Tee',
        fixes: 'Can\'t adjust to different pitch heights.',
        howTo: 'Set two tees — high and low. Coach calls "high" or "low" and you adjust posture and hit. Same swing, different pitch.',
        focus: 'Adjust, don\'t guess. Same swing, different posture.',
        progression: 'tee',
        equipment: ['2 tees'],
      },
      // ── Flips Transfer ──
      {
        name: 'Front Toss — Stop at Contact',
        fixes: 'Loose barrel turn, disconnection on a moving ball.',
        howTo: 'Front toss from coach. Swing and freeze at contact. Check: tight turn, clean connection, controlled barrel. Ensure tee positions carry to a moving ball.',
        focus: 'Tight turns on a moving ball. Check every position.',
        progression: 'flips',
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // 2. TIMING
  // ══════════════════════════════════════════════════════════════════
  {
    key: 'timing',
    label: 'Timing',
    description: 'Be quick to launch. No wasted movement. When you decide to swing, the move happens clean and fast.',
    icon: 'timer-outline',
    color: '#e11d48',
    freeCount: 2,
    drills: [
      {
        name: 'Command Drill',
        fixes: 'Late trigger, slow hands, inconsistent timing.',
        howTo: 'Start in launch position. Coach calls pitch location — react and swing. No extra movement. Pure execution.',
        focus: 'Fire from the same spot every time.',
        progression: 'flips',
      },
      {
        name: 'Go Drill',
        fixes: 'Late to launch, not ready at release.',
        howTo: 'Coach says "Go" at pitch release — swing immediately from launch position. Trains quick trigger.',
        focus: 'Be ready before the ball.',
        progression: 'flips',
      },
      {
        name: 'Load → Launch → Swing',
        fixes: 'Timing sequence breakdown, rushing through phases.',
        howTo: 'Exaggerate each phase: load (coil), stride to launch (pause), then swing. Three distinct beats.',
        focus: 'Load. Land. Go.',
        progression: 'tee',
      },
      {
        name: 'Heel Load Drill',
        fixes: 'Drifting forward, falling off balance.',
        howTo: 'Time your load off the heel. Get to launch position on time with a clean, controlled stride.',
        focus: 'Start early, ride it out.',
        progression: 'tee',
      },
      {
        name: 'Swing at Release',
        fixes: 'Late timing, reacting instead of anticipating.',
        howTo: 'Time your swing trigger to the pitcher\'s release point. Top of load at release — not after.',
        focus: 'See it, go.',
        progression: 'live',
      },
      {
        name: 'Rhythm Rocker Drill',
        fixes: 'No rhythm, stiff in the box, tense.',
        howTo: 'Rock your weight gently back and forth before the pitch. Build a rhythmic load. Let rhythm carry you to launch.',
        focus: 'Slow early, fast late. Find your rhythm.',
        progression: 'tee',
      },
      {
        name: 'Pause Stride Drill',
        fixes: 'Rushing the stride, launching too early or too late.',
        howTo: 'Stride and pause at launch for a full second. Then swing. Builds awareness of where launch position is.',
        focus: 'Start earlier. Be early to launch.',
        progression: 'tee',
      },
      {
        name: 'Early Load Drill',
        fixes: 'Starting too late, not ready when the pitch arrives.',
        howTo: 'Begin your load earlier than normal. Get to your launch position before you think you need to. If you feel early, you\'re on time.',
        focus: 'Be early. No wasted move. When you decide, go.',
        progression: 'tee',
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // 3. FORWARD MOVE
  // ══════════════════════════════════════════════════════════════════
  {
    key: 'forward-move',
    label: 'Forward Move',
    description: 'Control the stride. The forward move sets up everything.',
    icon: 'arrow-forward-outline',
    color: '#3b82f6',
    freeCount: 2,
    drills: [
      {
        name: 'Hook\'em Drill',
        fixes: 'Lunging, drifting, losing balance on the stride.',
        howTo: 'Hook the front foot during the stride. Controlled landing — stay back, let the ball travel to you.',
        focus: 'Stay back, let it come to you.',
        progression: 'tee',
      },
      {
        name: 'Belli\'s Drill',
        fixes: 'No rhythm, stiff stride, dead legs.',
        howTo: 'Bellinger-style leg kick with a controlled forward move. Build rhythm into the stride, land balanced.',
        focus: 'Rhythm into power.',
        progression: 'tee',
      },
      {
        name: 'Happy Gilmore Drill',
        fixes: 'Dead legs, no momentum, static swing.',
        howTo: 'Walking start into your swing. Build momentum through the stride. Feel the ground push you forward.',
        focus: 'Use the ground.',
        progression: 'tee',
      },
      {
        name: 'Step Back Drill',
        fixes: 'Rushing forward, no feel for the load.',
        howTo: 'Step backward before striding forward. Creates rhythm and teaches the controlled forward move.',
        focus: 'Step back, ride forward.',
        progression: 'tee',
      },
      {
        name: 'Ball Roll Drill',
        fixes: 'Early weight shift, falling to the front side.',
        howTo: 'Roll a ball forward with the back foot before swinging. Feel the push — don\'t fall forward.',
        focus: 'Push, don\'t fall.',
        progression: 'tee',
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // 4. POSTURE & DIRECTION (merged)
  // ══════════════════════════════════════════════════════════════════
  {
    key: 'posture',
    label: 'Posture & Direction',
    description: 'Stay in your body. Control where the ball goes. Posture and direction are inseparable.',
    icon: 'body-outline',
    color: '#0891b2',
    freeCount: 2,
    drills: [
      {
        name: 'Freddie\'s Drill',
        fixes: 'Pulling off the ball, losing posture through contact.',
        howTo: 'Inside pitch off the tee. Drive it to the opposite field. Stay through it — don\'t pull off.',
        focus: 'Hit it mid oppo.',
        progression: 'tee',
      },
      {
        name: 'Low Away Tee (Preset Posture)',
        fixes: 'Reaching with arms instead of adjusting with body.',
        howTo: 'Set tee low and away. Get down to the ball with your body — shoulder tilt, not arm reach.',
        focus: 'Get down to it with your body.',
        progression: 'tee',
      },
      {
        name: 'Trout Step Drill',
        fixes: 'Pulling off, no directional control.',
        howTo: 'Step toward the opposite field during your swing. Keeps the front shoulder closed and direction through the ball.',
        focus: 'Step through oppo.',
        progression: 'tee',
      },
      {
        name: 'Mo Vaughn Drill',
        fixes: 'Standing up through contact, losing power.',
        howTo: 'Wide stance, stay low through the entire swing. Drive through the ball without coming up.',
        focus: 'Stay in your legs.',
        progression: 'tee',
      },
      {
        name: 'PVC Pipe Swings',
        fixes: 'Off-plane swing, shoulders not matching the pitch.',
        howTo: 'Hold PVC pipe behind your back. Feel shoulder tilt and rotation plane through the turn.',
        focus: 'Match the plane.',
        progression: 'tee',
        equipment: ['PVC pipe'],
      },
      {
        name: 'Bottom Hand Throws',
        fixes: 'No direction, everything pulls.',
        howTo: 'Toss a ball to a screen with the bottom hand. Drive through the middle of the field.',
        focus: 'Drive through center.',
        progression: 'tee',
      },
      {
        name: 'Finish Over Tee',
        fixes: 'Cutting across the ball, no extension through the zone.',
        howTo: 'Finish your hands high over the tee. Stay long through the zone — don\'t cut across.',
        focus: 'Long through it.',
        progression: 'tee',
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // 5. BARREL TURN
  // ══════════════════════════════════════════════════════════════════
  {
    key: 'barrel-turn',
    label: 'Barrel Turn',
    description: 'Get the barrel into the zone early. Short path, quick hands.',
    icon: 'baseball-outline',
    color: '#ca8a04',
    freeCount: 2,
    drills: [
      {
        name: 'Steering Wheel Turns',
        fixes: 'Long bat path, barrel drags through the zone.',
        howTo: 'Rotate hands like turning a steering wheel. Feel the barrel turnover motion and early zone entry.',
        focus: 'Turn the wheel.',
        progression: 'tee',
      },
      {
        name: 'Snap Series',
        fixes: 'Slow barrel entry, no hand speed.',
        howTo: 'Snap the barrel around your head quickly in exaggerated arcs. Build hand speed and feel early barrel turn.',
        focus: 'Snap it.',
        progression: 'tee',
      },
      {
        name: 'Reverse Grip Drill',
        fixes: 'Casting, long swing, arms taking over.',
        howTo: 'Grip the bat in reverse and swing. Forces a tight barrel path — can\'t cheat with long arms.',
        focus: 'Short to the ball.',
        progression: 'tee',
      },
      {
        name: 'Top Hand Open / V-Grip Drill',
        fixes: 'Hand dominance, barrel not working independently.',
        howTo: 'Open the top hand or use a V-grip. Feel the barrel work on its own without hand dominance.',
        focus: 'Let the barrel work.',
        progression: 'tee',
      },
      {
        name: 'Deep Tee Series',
        fixes: 'Arm-dominant swing, no early barrel turn.',
        howTo: 'Set the tee deep in the zone. Can\'t reach it with arms — the barrel has to work on its own.',
        focus: 'Turn it behind you.',
        progression: 'tee',
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // 6. CONNECTION
  // ══════════════════════════════════════════════════════════════════
  {
    key: 'connection',
    label: 'Connection',
    description: 'Stay connected. Body leads, barrel follows.',
    icon: 'link-outline',
    color: '#8b5cf6',
    freeCount: 2,
    drills: [
      {
        name: 'Bat on Shoulder Drill Series',
        fixes: 'All arms, body not leading the swing.',
        howTo: 'Bat rests on back shoulder. Work all zones — body must lead the barrel. No arm swing possible.',
        focus: 'Body first.',
        progression: 'tee',
      },
      {
        name: 'Connection Ball Drill',
        fixes: 'Arms separating from body rotation.',
        howTo: 'Place a ball between your forearms during the swing. If it drops, you casted. Stay connected throughout.',
        focus: 'Stay tight.',
        progression: 'tee',
      },
      {
        name: 'Stop at Contact',
        fixes: 'Flying open, losing positions through the swing.',
        howTo: 'Freeze at the point of contact. Check posture, hand position, barrel angle, direction. Full awareness.',
        focus: 'Check every position.',
        progression: 'tee',
      },
      {
        name: 'Side of Cage Swings',
        fixes: 'Long swing path, no tight turns.',
        howTo: 'Stand close to the cage net and swing without hitting it. Forces short, connected swing path.',
        focus: 'Tight turns only.',
        progression: 'tee',
      },
      {
        name: 'Fence Constraint Drill',
        fixes: 'Casting, arms take over the swing.',
        howTo: 'Stand close to a fence and swing without hitting it. Forces tight, connected turns where arms can\'t dominate.',
        focus: 'Tight turns. Body leads.',
        progression: 'tee',
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // 7. EXTENSION
  // ══════════════════════════════════════════════════════════════════
  {
    key: 'extension',
    label: 'Extension',
    description: 'Stay through the ball. Extension creates damage.',
    icon: 'resize-outline',
    color: '#16a34a',
    freeCount: 2,
    drills: [
      {
        name: 'Out Front Tee Drill',
        fixes: 'Pulling off, no extension through the zone.',
        howTo: 'Set the tee out in front of the plate. Hit the ball up the middle. Extension and direction working together.',
        focus: 'Through the middle.',
        progression: 'tee',
      },
      {
        name: 'Head Down Through Contact',
        fixes: 'Pulling head, eyes leaving the ball early.',
        howTo: 'Keep your head down through and after contact. Let your chin find your back shoulder on the finish.',
        focus: 'Chin to shoulder.',
        progression: 'tee',
      },
      {
        name: 'No Roll Overs',
        fixes: 'Rolling the hands over, killing extension.',
        howTo: 'Open the top hand after contact. Feel the bottom hand extend fully through the zone. No roll-over allowed.',
        focus: 'Let it fly.',
        progression: 'tee',
      },
      {
        name: 'Bat Throws',
        fixes: 'Direction, pulling off the ball.',
        howTo: 'Using an old bat, perform your swing and release the bat toward the middle of the field.',
        focus: 'Extend toward your target. Send it through the middle.',
        progression: 'tee',
        equipment: ['old or broken bat'],
      },
      {
        name: 'Finish Through the Middle',
        fixes: 'Cutting across the ball, inconsistent contact direction.',
        howTo: 'Every swing finishes through the middle of the field. Hands, barrel, direction — all through center.',
        focus: 'Everything goes middle.',
        progression: 'tee',
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // 8. ADJUSTABILITY (NEW)
  // ══════════════════════════════════════════════════════════════════
  {
    key: 'adjustability',
    label: 'Adjustability',
    description: 'Adjust to every pitch without changing your swing. Same swing, different adjustment.',
    icon: 'options-outline',
    color: '#f59e0b',
    freeCount: 2,
    drills: [
      {
        name: '2-Ball High/Low Tee',
        fixes: 'Can\'t adjust to different pitch heights.',
        howTo: 'Two tees — high and low. Coach calls "high" or "low." Adjust posture and hit. Same core swing.',
        focus: 'Adjust, don\'t guess. Same swing, different pitch.',
        progression: 'tee',
        equipment: ['2 tees'],
      },
      {
        name: 'Random Tee Locations',
        fixes: 'Mechanical only at one location, breaks down everywhere else.',
        howTo: 'Coach moves tee to random locations between reps. Hit each one — adjust posture and contact point.',
        focus: 'Same swing, different posture.',
        progression: 'tee',
      },
      {
        name: 'Variable Front Toss',
        fixes: 'Can\'t adjust to pitch location with a moving ball.',
        howTo: 'Front toss to random locations — in, out, up, down. React and adjust. Barrel stays the same.',
        focus: 'See it longer. Match the plane.',
        progression: 'flips',
      },
      {
        name: 'Delay Load Drill',
        fixes: 'Commits too early, can\'t adjust to offspeed.',
        howTo: 'Delay your load slightly. Wait longer before triggering. Practice staying patient without losing readiness.',
        focus: 'See it longer. Let it travel.',
        progression: 'tee',
      },
      {
        name: 'Opposite Field Only Round',
        fixes: 'Can\'t hit the other way, pulls everything.',
        howTo: 'Full round of tee or toss — every ball goes to the opposite field. Drive through the gap.',
        focus: 'Through the gap. Oppo authority.',
        progression: 'flips',
      },
      {
        name: 'High/Low/In/Out Callout Drill',
        fixes: 'Slow adjustment, can\'t process location fast enough.',
        howTo: 'Coach calls location ("high," "low," "in," "out") right before toss. Adjust posture, not swing.',
        focus: 'Adjust, don\'t guess. React and compete.',
        progression: 'flips',
      },
      {
        name: 'Short Bat Reaction Drill',
        fixes: 'Over-reliance on arm length, barrel can\'t adjust.',
        howTo: 'Use a short bat against front toss. Forces tight adjustment with the body, not the arms.',
        focus: 'Body adjusts. Arms follow.',
        progression: 'flips',
        equipment: ['short bat'],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // 9. APPROACH (NEW — real training, not philosophy)
  // ══════════════════════════════════════════════════════════════════
  {
    key: 'approach',
    label: 'Approach',
    description: 'Hunt your pitch. Win the count. Make the damage decision.',
    icon: 'bulb-outline',
    color: '#a855f7',
    freeCount: 2,
    drills: [
      {
        name: 'Zone Hunting Round',
        fixes: 'Swings at everything, no plan in the box.',
        howTo: 'Pick one zone before the round (inner half, up, etc.). Only swing at pitches in that zone. Take everything else.',
        focus: 'Hunt your pitch. Let the rest go.',
        progression: 'flips',
      },
      {
        name: 'Count Hitting Round',
        fixes: 'No count awareness, same swing in every count.',
        howTo: 'Simulate counts: 0-0, 1-0, 0-2, 2-1, 3-1. Adjust approach by count. Damage counts = aggressive. Behind counts = compete.',
        focus: 'Win the count. Make them pay.',
        progression: 'flips',
      },
      {
        name: 'Take Until Strike',
        fixes: 'Chasing, swinging at pitcher\'s pitch.',
        howTo: 'Don\'t swing until you see a strike. If it\'s a ball, take it. Train the eye first. Compete second.',
        focus: 'Earn the right to swing.',
        progression: 'flips',
      },
      {
        name: '3-Pitch At-Bat Simulation',
        fixes: 'No at-bat plan, just reacting randomly.',
        howTo: 'Simulate 3-pitch at-bats. First pitch = look to do damage. Second pitch = adjust. Third pitch = compete. Full plan.',
        focus: 'Have a plan. Execute the plan.',
        progression: 'flips',
      },
      {
        name: 'Damage Round',
        fixes: 'Too passive, not doing damage when ahead.',
        howTo: 'Full round — every swing is max intent damage. No contact swings. Hunt a fastball and crush it.',
        focus: 'Don\'t miss your pitch.',
        progression: 'flips',
      },
      {
        name: '2-Strike Approach Round',
        fixes: 'Strikes out too much, no 2-strike plan.',
        howTo: 'Start every rep with 2 strikes. Widen the zone slightly. Compete. Put the ball in play with authority.',
        focus: 'Compete. Battle. Put it in play.',
        progression: 'flips',
      },
      {
        name: 'Sit Fastball Round',
        fixes: 'Can\'t time fastball, always late.',
        howTo: 'Full round — sit on fastball only. Be on time for the heater. Take everything off-speed.',
        focus: 'On time for fastball. Everything else is a take.',
        progression: 'machine',
      },
      {
        name: 'Breaking Ball Round',
        fixes: 'Can\'t hit breaking balls, always early or under.',
        howTo: 'Machine or toss with breaking balls only. Wait longer. Let it travel deeper. Drive it the other way.',
        focus: 'See it longer. Let it break. Then drive it.',
        progression: 'machine',
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // 10. MACHINE TRAINING (NEW)
  // ══════════════════════════════════════════════════════════════════
  {
    key: 'machine-training',
    label: 'Machine Training',
    description: 'Bridge the gap from tee to game. Train with purpose — not just take hacks.',
    icon: 'cog-outline',
    color: '#0d9488',
    freeCount: 2,
    drills: [
      {
        name: 'Fastball Only Machine',
        fixes: 'Can\'t time live velocity.',
        howTo: 'Set machine to a consistent fastball. Work on being on time. Carry your tee positions into velocity.',
        focus: 'Be on time. Same swing. Real velocity.',
        progression: 'machine',
      },
      {
        name: 'Velocity Ladder',
        fixes: 'Only comfortable at one speed.',
        howTo: 'Start slow. Increase velocity every 5 swings. Push your timing ceiling. Find where you break down.',
        focus: 'Push the speed. Find your ceiling. Fix it.',
        progression: 'machine',
      },
      {
        name: 'Fastball In — Machine',
        fixes: 'Getting jammed on inside fastballs.',
        howTo: 'Set machine inside. Turn the barrel early. Stay tight. Pull-side damage.',
        focus: 'Turn it. Drive it.',
        progression: 'machine',
      },
      {
        name: 'Fastball Away — Machine',
        fixes: 'Can\'t drive the outside pitch.',
        howTo: 'Set machine away. Get down with the body. Let it travel deeper. Drive through the gap.',
        focus: 'Let it travel. Deep and through.',
        progression: 'machine',
      },
      {
        name: 'High Fastball Machine',
        fixes: 'Swings under the high fastball.',
        howTo: 'Set machine for high strikes. Match the pitch plane. Don\'t drop the barrel to get to it.',
        focus: 'Match the plane. Stay through it.',
        progression: 'machine',
      },
      {
        name: 'Random Pitch Machine',
        fixes: 'Only comfortable with one pitch type.',
        howTo: 'Mix speeds and locations randomly. React and adjust. No pre-planning — just compete.',
        focus: 'See ball, hit ball. Compete.',
        progression: 'machine',
      },
      {
        name: '2-Strike Machine',
        fixes: 'Bad approach with 2 strikes.',
        howTo: 'Every swing starts with an 0-2 or 1-2 count mindset. Widen the zone. Put the ball in play.',
        focus: 'Compete with 2 strikes. Battle.',
        progression: 'machine',
      },
      {
        name: 'Opposite Field Machine',
        fixes: 'Can\'t use the opposite field against live speed.',
        howTo: 'Hit every pitch to the opposite field. Let the ball travel. Adjust posture. Drive through the gap.',
        focus: 'Oppo authority. Let it travel. Drive it.',
        progression: 'machine',
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // 11. COMPETITION (NEW)
  // ══════════════════════════════════════════════════════════════════
  {
    key: 'competition',
    label: 'Competition',
    description: 'Transfer skill work into pressure. Points, consequences, game situations.',
    icon: 'trophy-outline',
    color: '#dc2626',
    freeCount: 2,
    drills: [
      {
        name: 'Line Drive Challenge',
        fixes: 'No accountability for contact quality.',
        howTo: 'First to 5 line drives wins. Only line drives count — pop-ups and ground balls are outs. Compete.',
        focus: 'Line drives only. Earn each one.',
        progression: 'competition',
      },
      {
        name: 'Consecutive Hard-Hit Challenge',
        fixes: 'Inconsistent contact quality.',
        howTo: 'How many consecutive hard-hit balls can you string together? One weak one and you restart. Beat your record.',
        focus: 'Stack quality. Don\'t break the chain.',
        progression: 'competition',
      },
      {
        name: 'Opposite Field Challenge',
        fixes: 'Can\'t direct the ball under pressure.',
        howTo: 'Hit 10 balls. Only opposite-field line drives count. See how many you can get. Compete against your record.',
        focus: 'Oppo on demand. Prove it.',
        progression: 'competition',
      },
      {
        name: '2-Strike Battle Round',
        fixes: 'Folds under pressure with 2 strikes.',
        howTo: 'Every at-bat starts 0-2. You get 3 pitches. Put one in play hard. Make every swing count.',
        focus: 'Battle. Compete. Don\'t give in.',
        progression: 'competition',
      },
      {
        name: 'Hit & Run Round',
        fixes: 'Can\'t direct contact in game situations.',
        howTo: 'Simulate hit and run — must put ball on the ground to the right side. Consequences for fly balls.',
        focus: 'Situational hitting. Execute.',
        progression: 'competition',
      },
      {
        name: 'Runner on 3rd, Less Than 2 Outs',
        fixes: 'Can\'t produce runs in scoring position.',
        howTo: 'Fly ball or line drive = run scores. Ground ball = out. Put the ball in the air with authority.',
        focus: 'Drive the run in. Elevate.',
        progression: 'competition',
      },
      {
        name: '21 Outs Game',
        fixes: 'No sustained competitive focus.',
        howTo: 'Score points: line drive = 2, hard ground ball = 1, fly ball = 0, pop up = -1. First to 21 wins.',
        focus: 'Compete. Every swing counts.',
        progression: 'competition',
      },
      {
        name: 'Pull-Side HR Derby',
        fixes: 'No ability to turn on the ball under pressure.',
        howTo: 'Full pull-side swings. Points for distance and exit quality. Compete against teammates or yourself.',
        focus: 'Turn it loose. Compete.',
        progression: 'competition',
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // 12. TROUBLESHOOTING (diagnostic-driven)
  // ══════════════════════════════════════════════════════════════════
  {
    key: 'troubleshooting',
    label: 'Troubleshooting',
    description: 'Recommended fixes based on your diagnostics and common problems.',
    icon: 'build-outline',
    color: '#f97316',
    freeCount: 0,
    isPlaceholder: true,
    drills: [],
  },
];
