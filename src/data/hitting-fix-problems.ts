/**
 * Fix My Problem — Quick problem-to-solution mappings.
 *
 * Athlete picks a problem → gets sections, drills, cues, and a practice focus.
 */

export interface HittingProblem {
  key: string;
  label: string;
  description: string;
  likelyCause: string;
  sectionKeys: string[];
  drills: string[];
  cues: string[];
  practiceNote: string;
  icon: string;
  color: string;
}

export const HITTING_PROBLEMS: HittingProblem[] = [
  {
    key: 'im-late',
    label: 'I\'m Late',
    description: 'You can\'t catch up to fastballs. Always behind.',
    likelyCause: 'Not getting to launch position on time. Load starts too late or stride takes too long.',
    sectionKeys: ['timing', 'foundations'],
    drills: ['Go Drill', 'Heel Load Drill', 'Swing at Release', 'Rhythm Rocker Drill'],
    cues: ['Start earlier', 'Be early to launch', 'See it, go'],
    practiceNote: 'Start every session with timing drills. Add fastball machine work 2x/week.',
    icon: 'timer-outline',
    color: '#e11d48',
  },
  {
    key: 'i-pop-up',
    label: 'I Pop Up',
    description: 'Too many pop-ups. Getting under the ball.',
    likelyCause: 'Barrel dropping below the ball. Swing plane too steep. Not matching the pitch plane.',
    sectionKeys: ['posture', 'barrel-turn'],
    drills: ['PVC Pipe Swings', 'High Tee Normal Swing', 'Low Away Tee', 'Match the Plane'],
    cues: ['Match the plane', 'Stay through the ball', 'Posture, not arms'],
    practiceNote: 'High tee work daily. Focus on low line drives through the middle.',
    icon: 'arrow-up-outline',
    color: '#3b82f6',
  },
  {
    key: 'i-roll-over',
    label: 'I Roll Over',
    description: 'Weak ground balls to the pull side. Rolling the hands.',
    likelyCause: 'Top hand rolling over at contact. No extension through the zone. Arms disconnecting.',
    sectionKeys: ['extension', 'connection'],
    drills: ['No Roll Overs', 'Out Front Tee Drill', 'Finish Through the Middle', 'Connection Ball Drill'],
    cues: ['Let it fly', 'Through the middle', 'Stay through the ball'],
    practiceNote: 'Open top hand finish on every tee rep. Extension drills 3x/week.',
    icon: 'arrow-down-outline',
    color: '#8b5cf6',
  },
  {
    key: 'i-get-jammed',
    label: 'I Get Jammed',
    description: 'Inside pitches get you. Ball hits the handle.',
    likelyCause: 'Barrel not getting into the zone fast enough. Hands too far from the body or barrel dragging.',
    sectionKeys: ['barrel-turn', 'timing'],
    drills: ['Inside Tee', 'Steering Wheel Turns', 'Snap Series', 'Deep Tee Series'],
    cues: ['Turn the barrel', 'Get to it faster', 'Tight turns'],
    practiceNote: 'Inside tee work 3x/week. Barrel turn drills daily.',
    icon: 'close-circle-outline',
    color: '#ca8a04',
  },
  {
    key: 'cant-hit-offspeed',
    label: 'I Can\'t Hit Offspeed',
    description: 'Breaking balls and changeups eat you up.',
    likelyCause: 'Committing too early. Can\'t recognize the pitch or adjust the swing in time.',
    sectionKeys: ['adjustability', 'approach'],
    drills: ['Variable Front Toss', 'Yes/No Drill', 'Delay Load Drill', 'Breaking Ball Round'],
    cues: ['See it longer', 'Adjust, don\'t guess', 'Let it travel'],
    practiceNote: 'Adjustability drills 3x/week. Add mixed-speed machine work.',
    icon: 'help-circle-outline',
    color: '#f59e0b',
  },
  {
    key: 'i-strikeout',
    label: 'I Strike Out Too Much',
    description: 'Too many Ks. Can\'t put the ball in play.',
    likelyCause: 'Chasing out of the zone, poor 2-strike approach, or barrel accuracy issues.',
    sectionKeys: ['approach', 'adjustability', 'connection'],
    drills: ['2-Strike Approach Round', 'Yes/No Drill', 'Connection Ball Drill', '2-Strike Battle Round'],
    cues: ['Compete with 2 strikes', 'Put it in play', 'Battle'],
    practiceNote: 'Start every round with 2 strikes. Practice pitch selection daily.',
    icon: 'alert-circle-outline',
    color: '#ef4444',
  },
  {
    key: 'weak-contact',
    label: 'I Hit the Ball Weak',
    description: 'Making contact but it\'s always soft. No hard-hit balls.',
    likelyCause: 'Not swinging with intent. Poor extension. Not using the body — all arms.',
    sectionKeys: ['foundations', 'extension', 'competition'],
    drills: ['High Tee Normal Swing', 'Damage Round', 'Out Front Tee Drill', 'Pull-Side HR Derby'],
    cues: ['Swing with intent', 'Through the ball', 'Let the body do the work'],
    practiceNote: 'Every tee rep at max intent. Damage rounds 2x/week.',
    icon: 'remove-circle-outline',
    color: '#16a34a',
  },
  {
    key: 'bp-hitter',
    label: 'Good in BP, Bad in Games',
    description: 'Hit great in practice but can\'t take it to games.',
    likelyCause: 'No competition in practice. No plan at the plate. Pressure changes your swing.',
    sectionKeys: ['competition', 'approach', 'machine-training'],
    drills: ['21 Outs Game', '2-Strike Battle Round', 'Random Pitch Machine', '3-Pitch At-Bat Simulation'],
    cues: ['Train the way you compete', 'Have a plan', 'Compete every swing'],
    practiceNote: 'End every practice with a competition drill. Add machine with game counts.',
    icon: 'swap-horizontal-outline',
    color: '#a855f7',
  },
  {
    key: 'cant-hit-velo',
    label: 'I Can\'t Hit Velo',
    description: 'Hard throwers overpower you. Can\'t catch up.',
    likelyCause: 'Not getting to launch on time. Stride is too slow. Hands aren\'t quick enough.',
    sectionKeys: ['timing', 'machine-training', 'barrel-turn'],
    drills: ['Velocity Ladder', 'Go Drill', 'Fastball Only Machine', 'Snap Series'],
    cues: ['Be early to launch', 'Start earlier', 'Quick hands'],
    practiceNote: 'Machine work at high velocity 3x/week. Timing drills daily.',
    icon: 'speedometer-outline',
    color: '#0891b2',
  },
  {
    key: 'no-power',
    label: 'I Don\'t Have Power',
    description: 'No extra-base hits. Everything is a single or an out.',
    likelyCause: 'Not using the lower half. No extension through contact. Swing lacks intent and barrel direction.',
    sectionKeys: ['foundations', 'extension', 'forward-move'],
    drills: ['High Tee Normal Swing', 'Out Front Tee Drill', 'Happy Gilmore Drill', 'Damage Round'],
    cues: ['Use the ground', 'Through the ball', 'Swing with intent'],
    practiceNote: 'Max intent on every tee swing. Forward move drills and extension work daily.',
    icon: 'flash-outline',
    color: '#dc2626',
  },
];
