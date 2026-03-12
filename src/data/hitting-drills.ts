export interface Drill {
  name: string;
  desc: string;
  areas: string[];
  cue?: string;
}

export const AREAS = [
  { key: 'all', label: 'All Drills' },
  { key: 'Forward Move', label: 'Forward Move' },
  { key: 'Launch Position', label: 'Launch Position' },
  { key: 'Posture & Direction', label: 'Posture & Direction' },
  { key: 'Barrel Turn', label: 'Barrel Turn' },
  { key: 'Connection', label: 'Connection' },
  { key: 'Extension', label: 'Extension' },
];

export const DRILLS: Drill[] = [
  // ─── STEP 1: CONTROL THE FORWARD MOVE ───────────────────────────────────────
  { name: 'No-Stride Turn', desc: 'Turn from a no-stride stance to eliminate drift and focus purely on rotational control.', areas: ['Forward Move'], cue: 'Turn, don\'t travel' },
  { name: 'Rear Hip Coil Hold', desc: 'Coil into the rear hip and hold — feel the stretch and load before going forward.', areas: ['Forward Move'], cue: 'Feel the stretch' },
  { name: 'Wall Constraint Load', desc: 'Stand near a wall to limit forward drift during the load. Instant feedback on excess movement.', areas: ['Forward Move'], cue: 'Stay stacked' },
  { name: 'Heel Hover Stride', desc: 'Hover the front heel on the stride — stay light, controlled, and balanced before landing.', areas: ['Forward Move', 'Launch Position'], cue: 'Float — don\'t fall' },
  { name: 'Baby Steps to Coil', desc: 'Small rhythmic steps into the coil. Builds feel for the controlled weight shift.', areas: ['Forward Move'], cue: 'Stay centered' },
  { name: '45° Coil', desc: 'Start at 45° angle, coil hips to feel the rubber band stretch. Trains direction and lower half engagement.', areas: ['Forward Move', 'Launch Position'], cue: 'Feel the stretch' },
  { name: '45° Coil + Hover', desc: 'Add a front foot hover to the 45° coil. Builds balance and controlled stride.', areas: ['Forward Move', 'Launch Position'] },
  { name: 'Kershaw Drill', desc: 'Mimic a high leg lift to train a controlled forward move and balanced stride out to launch.', areas: ['Forward Move', 'Launch Position'], cue: 'Elevate, then go forward' },
  { name: 'Step Back', desc: 'Step backward before striding forward. Creates rhythm and teaches the controlled forward move.', areas: ['Forward Move'], cue: 'Step back, ride forward' },
  { name: 'Quick Feet', desc: 'Quick choppy feet in place before loading. Keeps you loose, athletic, and on time.', areas: ['Forward Move'], cue: 'Stay athletic, stay loose' },
  { name: 'Knee to Ground After Swing', desc: 'Back knee touches the ground after the swing. Ensures you\'re staying down, rotating fully, and not coming out of posture.', areas: ['Forward Move'], cue: 'Back knee to dirt' },
  { name: 'Slide Board Swings', desc: 'Swing on a slide board to feel ground force and the controlled lateral push through the swing.', areas: ['Forward Move', 'Posture & Direction'], cue: 'Use the ground' },
  { name: 'Scissor Swings / Split Stance', desc: 'Hit from a split stance or cross legs on the follow-through. Trains full rotation and hip clearance.', areas: ['Forward Move'] },
  { name: 'Canseco Bounce-Back Swing', desc: 'Explosive rotation with a bounce-back feel. Forces full hip clearance and teaches rotational power.', areas: ['Forward Move'] },
  { name: 'Recoil Swing', desc: 'Swing and recoil back to start position. Trains controlled rotation and posture maintenance.', areas: ['Forward Move', 'Posture & Direction'] },

  // ─── STEP 2: LAUNCH POSITION ─────────────────────────────────────────────────
  { name: 'Command Drill', desc: 'Start in launch position and react to the pitch. Removes timing variables — pure execution from a consistent fire point.', areas: ['Launch Position'] },
  { name: 'Go Drill', desc: 'Coach says "go" at release — swing from launch position. Trains the trigger and hand quickness from a stable spot.', areas: ['Launch Position'], cue: 'Fire from the same spot' },
  { name: 'Ready at Release (Flips)', desc: 'Front toss where you must be at launch position by the time the ball is released. Builds timing and early readiness.', areas: ['Launch Position'], cue: 'Hands arrive before the ball' },
  { name: 'No Stride Bat on Shoulder', desc: 'No stride, bat starts on shoulder — work all tee heights. Pure launch-to-contact feel with no extra movement.', areas: ['Launch Position', 'Posture & Direction'] },
  { name: 'Load Stride Swing', desc: 'Exaggerate the load and stride phases, pausing at launch before swinging. Builds feel for arriving early.', areas: ['Launch Position', 'Forward Move'] },
  { name: 'Stop-at-Launch Freeze Check', desc: 'Load and stride — freeze at launch position. Check: hands in position? Balance? Heel down? Awareness drill.', areas: ['Launch Position'] },
  { name: 'PVC Load & Launch', desc: 'Use a PVC pipe to feel the load and track hand path to a consistent launch position.', areas: ['Launch Position'] },
  { name: 'Preset Coil + Launch', desc: 'Preset into the coil, pause, then stride to launch and swing. Isolates the launch position feel.', areas: ['Launch Position', 'Forward Move'] },
  { name: 'Catch & Pause Hitting Drill', desc: 'Simulate catching the pitch at the release point and pausing before swinging. Trains timing and hand discipline.', areas: ['Launch Position'], cue: 'Be ready early' },
  { name: 'Top-of-Load at Release Drill', desc: 'Time the top of your load to coincide with pitch release. If you\'re at launch too late, you\'re already behind.', areas: ['Launch Position'], cue: 'Top of load at release' },
  { name: 'One-Legged Holds to Stride Out', desc: 'Balance on back leg, hold, then stride out to launch position. Builds stability and controlled arrival.', areas: ['Launch Position', 'Forward Move'], cue: 'Elevate to center' },
  { name: 'Leg Hook Drill', desc: 'Hook front leg to train controlled stride and balanced landing at launch.', areas: ['Launch Position', 'Forward Move'] },
  { name: 'One-Legged Swing', desc: 'Swing from one leg to build balance and feel a strong, grounded base at launch.', areas: ['Launch Position'] },
  { name: 'Manny Self-Toss', desc: 'Self-toss and swing. Immediate feedback on stride timing, extension, and direction.', areas: ['Launch Position', 'Extension'] },
  { name: 'Eyes Open/Closed Front Toss', desc: 'Close eyes until toss is released — forces quick recognition and demands you\'re already in launch.', areas: ['Launch Position'], cue: 'Trust your hands' },
  { name: 'Heel Load', desc: 'Load timing driven off the heel — get to launch position on time with a clean, controlled stride.', areas: ['Launch Position', 'Forward Move'], cue: 'Start early, ride it out' },
  { name: 'Swing at Release', desc: 'Time your swing to the pitcher\'s release point. Top of load at release — not after.', areas: ['Launch Position'], cue: 'See it, go' },
  { name: '7 Balls Across Plate', desc: 'Line 7 balls across the plate. Coach calls location — swing at the right one. Builds zone awareness and discipline from launch.', areas: ['Launch Position', 'Posture & Direction'] },

  // ─── STEP 3: POSTURE & DIRECTION ─────────────────────────────────────────────
  { name: 'Low & Away Tee', desc: 'Work low and away pitches off the tee. Forces extreme shoulder tilt — body adjusts, hands don\'t.', areas: ['Posture & Direction'], cue: 'Get down with the body' },
  { name: 'PVC Behind Back', desc: 'Hold PVC across the back to feel shoulder tilt and rotation plane through the swing.', areas: ['Posture & Direction'], cue: 'Match the plane' },
  { name: 'Trout Step', desc: 'Step toward opposite field during the swing. Trains direction and keeps the front shoulder closed longer.', areas: ['Posture & Direction', 'Extension'], cue: 'Step through oppo' },
  { name: 'Chin to Back Shoulder Finish', desc: 'On the finish, let your chin touch your back shoulder. Keeps the head down through contact and after.', areas: ['Posture & Direction'], cue: 'Chin to back shoulder' },
  { name: 'Ball in Front of Plate', desc: 'Set a ball in front of the plate and hit it up the middle. Trains direction and staying through the zone.', areas: ['Posture & Direction', 'Extension'], cue: 'Shoulder to center' },
  { name: 'Tall Tee Behind', desc: 'Set up a tall tee with ball placed behind you to build awareness of swing path and direction.', areas: ['Posture & Direction'] },
  { name: 'Step Through Opposite Field', desc: 'Finish by stepping toward the opposite field — ensures direction stays through the ball and not across the body.', areas: ['Posture & Direction', 'Extension'] },
  { name: 'Bat on Shoulder (Low & In / Low & Away)', desc: 'Bat rests on back shoulder, work all zones — especially low locations. Trains posture and tilt to match pitch height.', areas: ['Posture & Direction', 'Connection'] },
  { name: 'Knee to Ground Finish', desc: 'Drive the back knee to the ground on the finish. Keeps rotation through the swing and prevents coming out of posture.', areas: ['Posture & Direction', 'Forward Move'] },
  { name: 'Arize Drill — Head Down', desc: 'Keep head down after contact — look at where the ball was. Let chin hit back shoulder. Don\'t let it come up early.', areas: ['Posture & Direction', 'Extension'], cue: 'Chin to back shoulder' },
  { name: 'Low and Away Tee & Flips w/ Short Bat', desc: 'Work low and away with a short bat. Extreme posture — shoulders must match ball flight. No room for arms.', areas: ['Posture & Direction'], cue: 'Get down to it with your body' },
  { name: 'Stop at Contact', desc: 'Freeze at the point of contact. Check posture, hands, barrel angle, direction. Full awareness drill.', areas: ['Posture & Direction', 'Extension', 'Connection'] },
  { name: 'World\'s Greatest Drill', desc: 'Full mobility drill addressing posture, connection, and feel through multiple planes of the swing.', areas: ['Posture & Direction', 'Connection'] },
  { name: 'Flips from First Base', desc: 'Coach flips from the first base side. Different ball angle trains directional adjustments and oppo-field posture.', areas: ['Posture & Direction'], cue: 'Adjust and drive through' },
  { name: 'Flips from Third Base', desc: 'Coach flips from the third base side. Forces body direction control and staying through the ball pull-side.', areas: ['Posture & Direction'], cue: 'Stay through the ball' },
  { name: 'Slow Motion Swings', desc: 'Full swing in slow motion. Feel every position — load, launch, contact, extension. Body awareness and muscle memory.', areas: ['Posture & Direction', 'Connection'], cue: 'Feel every position' },
  { name: 'Front Arm Ball Toss to Screen', desc: 'Toss a ball to a screen with the front arm. Trains the front shoulder staying closed and direction staying through.', areas: ['Posture & Direction'] },

  // ─── STEP 4: EARLY BARREL TURN ───────────────────────────────────────────────
  { name: 'Deep Tee', desc: 'Set tee deep in the zone to force early barrel turn. Can\'t reach it with arms — barrel has to work on its own.', areas: ['Barrel Turn'], cue: 'Turn it behind you' },
  { name: 'Arize Flips from Behind', desc: 'Coach flips from behind the hitter. Forces early barrel turn — can\'t cheat forward. Catch it deep.', areas: ['Barrel Turn'], cue: 'Catch it deep' },
  { name: 'Snap Around Head', desc: 'Snap the barrel around your head in an exaggerated arc. Feel the barrel turning early and with authority.', areas: ['Barrel Turn'] },
  { name: 'Barrel to Catcher Feel', desc: 'Point the barrel toward the catcher at the start of the swing. Trains the early direction the barrel needs to travel.', areas: ['Barrel Turn'], cue: 'Barrel to the catcher first' },
  { name: 'Front Elbow Up / Back Elbow Down', desc: 'Exaggerate front elbow up and back elbow into the slot early. Creates the early barrel turn naturally.', areas: ['Barrel Turn'], cue: 'Elbow to slot' },
  { name: 'Catch It Deep → Fly Ball to Catcher', desc: 'Try to hit a fly ball back to the catcher from a deep contact point. Forces extreme early barrel.', areas: ['Barrel Turn'], cue: 'Turn it early, hit it back' },
  { name: 'Turn Barrel Vertical Snap', desc: 'Snap the bat to vertical above your head quickly. Trains fast hands and early barrel entry into the zone.', areas: ['Barrel Turn'] },
  { name: 'Soto Drill', desc: 'Replicate Juan Soto\'s hip load and early barrel movement. Aggressive coil into the turn.', areas: ['Barrel Turn'], cue: 'Load and turn early' },
  { name: 'David Wright Deep Flip Feel', desc: 'Flips thrown deep — hit with the barrel entering early like David Wright. Back-hip driven, early turn.', areas: ['Barrel Turn'], cue: 'Create time' },
  { name: 'Top Hand Tee (Bergman)', desc: 'Top hand only off the tee. The top hand is the key to turning the barrel early — feel it work.', areas: ['Barrel Turn', 'Extension'], cue: 'Thumb up, turn it over' },
  { name: 'Steering Wheel Turns', desc: 'Rotate hands like turning a steering wheel. Feels the barrel turnover motion and early entry.', areas: ['Barrel Turn', 'Connection'], cue: 'Turn the steering wheel' },
  { name: 'Pete Alonso Sideways Hitting', desc: 'Hit sideways for full body feedback on sequencing and early barrel entry through connection.', areas: ['Barrel Turn', 'Connection'] },

  // ─── STEP 5: TIGHT TURN / SPACING (CONNECTION) ───────────────────────────────
  { name: 'Connection Ball', desc: 'Place ball between forearms during swing. Drops if you cast — stay connected throughout the turn.', areas: ['Connection'] },
  { name: 'Connection Band', desc: 'Use a resistance band to feel and maintain connection through the swing. Arms can\'t dominate.', areas: ['Connection'] },
  { name: 'Freeman Inside Tee', desc: 'Inside pitch off tee — drive it to the opposite field. Tight turn, spacing, and extension working together.', areas: ['Connection', 'Extension'], cue: 'Hit it mid oppo' },
  { name: 'Bicep Flex Feel', desc: 'Feel a slight bicep flex in both arms during the swing to maintain spacing and prevent arm dominance.', areas: ['Connection'], cue: 'Flex, don\'t reach' },
  { name: 'Angled Flips', desc: 'Flips thrown at an angle to challenge spacing and connection. Can\'t cast — barrel gets beat.', areas: ['Connection'] },
  { name: 'Bottom Hand Along White Line', desc: 'Work bottom hand along a white line on the tee mat. Trains spacing and keeps the hand from going out early.', areas: ['Connection'], cue: 'Hands stay close' },
  { name: 'Bottom Hand Flips', desc: 'Bottom hand only on flips. Feel the bottom hand maintain spacing and drive direction without the top arm interfering.', areas: ['Connection', 'Extension'] },
  { name: 'Fence Constraint Drill', desc: 'Stand close to a fence and swing without hitting it. Forces tight, connected turns where arms can\'t take over.', areas: ['Connection'], cue: 'Tight turns' },
  { name: 'Split Grip', desc: 'Separate hands on the bat. Feel each hand\'s role in connection — top controls the barrel, bottom drives direction.', areas: ['Connection', 'Extension'] },
  { name: 'V-Grip', desc: 'Modified grip drill to feel proper spacing and hand positioning through the turn.', areas: ['Connection'] },
  { name: 'Fence Dry Swings', desc: 'Stand close to a fence and take dry swings. Forces connected turns without arm cast.', areas: ['Connection'], cue: 'Tight turns' },
  { name: 'Flips Against Cage Net', desc: 'Stand close to the net and hit flips. Forces short, connected swing path — no room to cast.', areas: ['Connection'] },
  { name: 'Up and In Tee', desc: 'Set tee up and in. Trains tight turns, hip clearance, and handling inside pitches with authority through connection.', areas: ['Connection', 'Extension'], cue: 'Turn on it, stay through' },

  // ─── STEP 6: EXTENSION ───────────────────────────────────────────────────────
  { name: 'Out-in-Front Tee', desc: 'Set tee out in front of the plate. Hit the ball up the middle. Extension and direction working together.', areas: ['Extension'], cue: 'Through the middle' },
  { name: 'Double Tee Drill', desc: 'Two tees stacked — hit through both. Trains a flat path and extension staying through the zone.', areas: ['Extension'] },
  { name: 'Stop at Contact Freeze', desc: 'Freeze at contact and check: are both hands still on the bat? Is the barrel through the zone? Extension awareness.', areas: ['Extension', 'Posture & Direction'] },
  { name: 'V-Drill', desc: 'Two tees in a V shape. Hit through the gap — trains extension and a flat barrel path through contact.', areas: ['Extension'] },
  { name: 'High Finish Over Ball', desc: 'Finish with the hands high over the ball. Trains extension staying through the zone and not rolling over early.', areas: ['Extension'], cue: 'Long through it' },
  { name: 'Top Hand Through Center', desc: 'Focus on driving the top hand through the middle of the field. Prevents casting and rolling over.', areas: ['Extension'], cue: 'Drive through center' },
  { name: 'Bottom Hand Middle-Up Work', desc: 'Bottom hand drives direction to the middle and up in the zone. Builds backspin and opposite-field authority.', areas: ['Extension'], cue: 'Drive through the middle' },
  { name: 'Opposite Field Line Drive Drill', desc: 'Set up to intentionally drive the ball to the opposite field on a line. Direction, extension, posture all working.', areas: ['Extension', 'Posture & Direction'], cue: 'Finish through center' },
  { name: 'Open Top Hand Swings', desc: 'Release the top hand after contact. Feel the bottom hand extend fully through. Prevents early roll-over.', areas: ['Extension'], cue: 'Let it fly' },
  { name: 'Top Hand Short Bat', desc: 'Top hand with a short bat. Isolate the top hand path and feel proper extension from the turn.', areas: ['Extension'] },
  { name: 'Bottom Hand Short Bat', desc: 'Bottom hand with a short bat. Feel the bottom hand drive direction and generate power through extension.', areas: ['Extension'] },
  { name: 'Top Hand Ball Toss', desc: 'Toss ball with top hand to a screen — hand should work through the middle. Extension path drill.', areas: ['Extension'] },
  { name: 'Barry Bonds Flip / Tee', desc: 'Replicate Bonds\' compact, powerful extension. Flatten the swing with out-front contact through the middle.', areas: ['Extension'] },
  { name: 'High Tee', desc: 'Set tee at high strike zone. Trains matching pitch height with shoulder tilt and staying through the pitch.', areas: ['Extension', 'Posture & Direction'] },
  { name: 'Freddie Freeman In-In Tee', desc: 'Inside pitch on tee — hit it to the middle or opposite field. Extension, direction, posture all connected.', areas: ['Extension', 'Connection'], cue: 'Hit it mid oppo' },
  { name: 'Bottom Hand Tee & Flips', desc: 'Bottom hand only drives power and direction — the bigger key to extension through the middle.', areas: ['Extension'], cue: 'Drive through the middle' },
];

/* ────────────────────────────────────────────────
 * YOUR PATH — 16 core drills on repeat
 * ──────────────────────────────────────────────── */
export const YOUR_PATH_DRILLS = [
  '45° Coil',
  'Heel Hover Stride',
  'Command Drill',
  'Stop-at-Launch Freeze Check',
  'Low & Away Tee',
  'Chin to Back Shoulder Finish',
  'Deep Tee',
  'Barrel to Catcher Feel',
  'Connection Ball',
  'Fence Constraint Drill',
  'Freeman Inside Tee',
  'Out-in-Front Tee',
  'Opposite Field Line Drive Drill',
  'Stop at Contact',
  'Open Top Hand Swings',
  'Slow Motion Swings',
];
