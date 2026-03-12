/**
 * Hitting Vault — Sections + Drill Cards
 *
 * 9 sections, 5 drills each (45 total).
 * Walk tier: first 2 drills per section are free preview.
 * Single+: full access.
 * Troubleshooting: placeholder until diagnostic engine is built.
 */

import { Ionicons } from '@expo/vector-icons';

/* ─── Drill Card ──────────────────────────────────────────── */

export interface DrillCard {
  name: string;
  fixes: string;
  howTo: string;
  focus: string;
  /** Future: video URL */
  videoUrl?: string;
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
  // ── 1. Foundations ──────────────────────────────────────────
  {
    key: 'foundations',
    label: 'Foundations',
    description: 'The non-negotiables. Every swing starts and ends here.',
    icon: 'construct-outline',
    color: '#E10600',
    freeCount: 2,
    drills: [
      {
        name: 'Hold Finish',
        fixes: 'Losing balance, flying open, no control through contact.',
        howTo: 'Swing and hold your finish for 3 full seconds. Check: balanced? Barrel through? Weight on front side?',
        focus: 'Freeze it. If you can\'t hold it, you didn\'t earn it.',
      },
      {
        name: 'Slow Motion Swing',
        fixes: 'Rushing, disconnection, skipping positions.',
        howTo: 'Full swing at 25% speed. Feel load, launch, contact, extension. Every position matters.',
        focus: 'Slow is smooth. Smooth is fast.',
      },
      {
        name: 'Arráez Drill',
        fixes: 'Head pulling, eyes leaving the ball, pulling off early.',
        howTo: 'Keep your eyes locked on the contact point through the entire swing. Head stays down — let your chin find your back shoulder.',
        focus: 'Head down. Eyes on the ball. Trust your hands.',
      },
      {
        name: 'Top Hand Bregman Drill',
        fixes: 'Casting, long swing path, no barrel control.',
        howTo: 'Top hand only off the tee. Stay tight, turn the barrel over. Thumb up through contact.',
        focus: 'The top hand turns it over. Keep it short.',
      },
      {
        name: 'Bottom Hand Drill',
        fixes: 'No direction, weak opposite field contact.',
        howTo: 'Bottom hand only off the tee or flips. Drive through the middle. Feel the bottom hand control direction.',
        focus: 'Bottom hand = direction. Drive it through center.',
      },
    ],
  },

  // ── 2. Timing ──────────────────────────────────────────────
  {
    key: 'timing',
    label: 'Timing',
    description: 'Get to launch on time. Be ready before the ball — not after.',
    icon: 'timer-outline',
    color: '#e11d48',
    freeCount: 2,
    drills: [
      {
        name: 'Command Drill',
        fixes: 'Late trigger, slow hands, inconsistent timing.',
        howTo: 'Start in launch position. Coach calls pitch location — react and swing. No extra movement. Pure execution.',
        focus: 'Fire from the same spot every time.',
      },
      {
        name: 'Go Drill',
        fixes: 'Late to launch, not ready at release.',
        howTo: 'Coach says "Go" at pitch release — swing immediately from launch position. Trains quick trigger.',
        focus: 'Be ready before the ball.',
      },
      {
        name: 'Load → Launch → Swing',
        fixes: 'Timing sequence breakdown, rushing through phases.',
        howTo: 'Exaggerate each phase: load (coil), stride to launch (pause), then swing. Three distinct beats.',
        focus: 'Load. Land. Go.',
      },
      {
        name: 'Heel Load Drill',
        fixes: 'Drifting forward, falling off balance.',
        howTo: 'Time your load off the heel. Get to launch position on time with a clean, controlled stride.',
        focus: 'Start early, ride it out.',
      },
      {
        name: 'Swing at Release',
        fixes: 'Late timing, reacting instead of anticipating.',
        howTo: 'Time your swing trigger to the pitcher\'s release point. Top of load at release — not after.',
        focus: 'See it, go.',
      },
    ],
  },

  // ── 3. Forward Move ────────────────────────────────────────
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
      },
      {
        name: 'Belli\'s Drill',
        fixes: 'No rhythm, stiff stride, dead legs.',
        howTo: 'Bellinger-style leg kick with a controlled forward move. Build rhythm into the stride, land balanced.',
        focus: 'Rhythm into power.',
      },
      {
        name: 'Happy Gilmore Drill',
        fixes: 'Dead legs, no momentum, static swing.',
        howTo: 'Walking start into your swing. Build momentum through the stride. Feel the ground push you forward.',
        focus: 'Use the ground.',
      },
      {
        name: 'Step Back Drill',
        fixes: 'Rushing forward, no feel for the load.',
        howTo: 'Step backward before striding forward. Creates rhythm and teaches the controlled forward move.',
        focus: 'Step back, ride forward.',
      },
      {
        name: 'Ball Roll Drill',
        fixes: 'Early weight shift, falling to the front side.',
        howTo: 'Roll a ball forward with the back foot before swinging. Feel the push — don\'t fall forward.',
        focus: 'Push, don\'t fall.',
      },
    ],
  },

  // ── 4. Posture ─────────────────────────────────────────────
  {
    key: 'posture',
    label: 'Posture',
    description: 'Stay in your body. The swing works when posture holds.',
    icon: 'body-outline',
    color: '#0891b2',
    freeCount: 2,
    drills: [
      {
        name: 'Freddie\'s Drill',
        fixes: 'Pulling off the ball, losing posture through contact.',
        howTo: 'Inside pitch off the tee. Drive it to the opposite field. Stay through it — don\'t pull off.',
        focus: 'Hit it mid oppo.',
      },
      {
        name: 'Low Away Tee (Preset Posture)',
        fixes: 'Reaching with arms instead of adjusting with body.',
        howTo: 'Set tee low and away. Get down to the ball with your body — shoulder tilt, not arm reach.',
        focus: 'Get down to it with your body.',
      },
      {
        name: 'Mo Vaughn Drill',
        fixes: 'Standing up through contact, losing power.',
        howTo: 'Wide stance, stay low through the entire swing. Drive through the ball without coming up.',
        focus: 'Stay in your legs.',
      },
      {
        name: 'Recoil Swings',
        fixes: 'Flying open, no control through rotation.',
        howTo: 'Swing and recoil back to your start position. Maintain posture in both directions.',
        focus: 'Control the turn.',
      },
      {
        name: 'PVC Pipe Swings',
        fixes: 'Off-plane swing, shoulders not matching the pitch.',
        howTo: 'Hold PVC pipe behind your back. Feel shoulder tilt and rotation plane through the turn.',
        focus: 'Match the plane.',
      },
    ],
  },

  // ── 5. Direction ───────────────────────────────────────────
  {
    key: 'direction',
    label: 'Direction',
    description: 'Control where the ball goes. Direction separates hitters.',
    icon: 'compass-outline',
    color: '#22c55e',
    freeCount: 2,
    drills: [
      {
        name: 'Trout Step Drill',
        fixes: 'Pulling off, no directional control.',
        howTo: 'Step toward the opposite field during your swing. Keeps the front shoulder closed and direction through the ball.',
        focus: 'Step through oppo.',
      },
      {
        name: 'Split Grip Stop at Contact',
        fixes: 'Rolling over, casting, poor barrel angle.',
        howTo: 'Split your hands on the grip. Swing and freeze at contact. Check barrel angle and hand path.',
        focus: 'Check your work.',
      },
      {
        name: 'Bottom Hand Throws',
        fixes: 'No direction, everything pulls.',
        howTo: 'Toss a ball to a screen with the bottom hand. Drive through the middle of the field.',
        focus: 'Drive through center.',
      },
      {
        name: 'Finish Over Tee',
        fixes: 'Cutting across the ball, no extension through the zone.',
        howTo: 'Finish your hands high over the tee. Stay long through the zone — don\'t cut across.',
        focus: 'Long through it.',
      },
      {
        name: 'Freddie\'s (Opposite Field Focus)',
        fixes: 'Pulling everything, no opposite field authority.',
        howTo: 'Inside pitch off the tee. Intentionally drive the ball to the opposite field on a line.',
        focus: 'Inside = oppo.',
      },
    ],
  },

  // ── 6. Barrel Turn ─────────────────────────────────────────
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
      },
      {
        name: 'Snap Series',
        fixes: 'Slow barrel entry, no hand speed.',
        howTo: 'Snap the barrel around your head quickly in exaggerated arcs. Build hand speed and feel early barrel turn.',
        focus: 'Snap it.',
      },
      {
        name: 'Reverse Grip Drill',
        fixes: 'Casting, long swing, arms taking over.',
        howTo: 'Grip the bat in reverse and swing. Forces a tight barrel path — can\'t cheat with long arms.',
        focus: 'Short to the ball.',
      },
      {
        name: 'Top Hand Open / V-Grip Drill',
        fixes: 'Hand dominance, barrel not working independently.',
        howTo: 'Open the top hand or use a V-grip. Feel the barrel work on its own without hand dominance.',
        focus: 'Let the barrel work.',
      },
      {
        name: 'Deep Tee Series',
        fixes: 'Arm-dominant swing, no early barrel turn.',
        howTo: 'Set the tee deep in the zone. Can\'t reach it with arms — the barrel has to work on its own.',
        focus: 'Turn it behind you.',
      },
    ],
  },

  // ── 7. Connection ──────────────────────────────────────────
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
      },
      {
        name: 'Reverse Grip Drill',
        fixes: 'Casting, long swing, arms separating.',
        howTo: 'Reverse grip forces tight, connected turns. Arms can\'t take over — rotation drives everything.',
        focus: 'Stay connected.',
      },
      {
        name: 'Stop at Contact',
        fixes: 'Flying open, losing positions through the swing.',
        howTo: 'Freeze at the point of contact. Check posture, hand position, barrel angle, direction. Full awareness.',
        focus: 'Check every position.',
      },
      {
        name: 'Connection Ball Drill',
        fixes: 'Arms separating from body rotation.',
        howTo: 'Place a ball between your forearms during the swing. If it drops, you casted. Stay connected throughout.',
        focus: 'Stay tight.',
      },
      {
        name: 'Side of Cage Swings',
        fixes: 'Long swing path, no tight turns.',
        howTo: 'Stand close to the cage net and swing without hitting it. Forces short, connected swing path.',
        focus: 'Tight turns only.',
      },
    ],
  },

  // ── 8. Extension ───────────────────────────────────────────
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
      },
      {
        name: 'Head Down Through Contact',
        fixes: 'Pulling head, eyes leaving the ball early.',
        howTo: 'Keep your head down through and after contact. Let your chin find your back shoulder on the finish.',
        focus: 'Chin to shoulder.',
      },
      {
        name: 'No Roll Overs',
        fixes: 'Rolling the hands over, killing extension.',
        howTo: 'Open the top hand after contact. Feel the bottom hand extend fully through the zone. No roll-over allowed.',
        focus: 'Let it fly.',
      },
      {
        name: 'Bat Throws',
        fixes: 'Direction, pulling off the ball.',
        howTo: 'Using an old or broken bat, perform your swing and release the bat toward the middle of the field or toward the opposite-side middle infielder.',
        focus: 'Extend your arms toward your target. Send the bat through the middle of the field.',
      },
      {
        name: 'Finish Through the Middle',
        fixes: 'Cutting across the ball, inconsistent contact direction.',
        howTo: 'Every swing finishes through the middle of the field. Hands, barrel, direction — all through center.',
        focus: 'Everything goes middle.',
      },
    ],
  },

  // ── 9. Troubleshooting ─────────────────────────────────────
  {
    key: 'troubleshooting',
    label: 'Troubleshooting',
    description: 'Recommended fixes based on your Swing Diagnostic results.',
    icon: 'build-outline',
    color: '#f97316',
    freeCount: 0,
    isPlaceholder: true,
    drills: [],
  },
];
