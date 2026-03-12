import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

/* ────────────────────────────────────────────────────
 * MASTERY MOVEMENT LIBRARY FOR ATHLETES
 * 8 categories · sub-categories · YouTube demo links
 * ──────────────────────────────────────────────────── */

export interface Movement {
  name: string;
  sets: string;
  cue: string;
  videoUrl?: string;
}

export interface SubCategory {
  label: string;
  moves: Movement[];
}

export interface MovementCategory {
  key: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  desc: string;
  subCategories: SubCategory[];
}

export const MOVEMENT_LIBRARY: MovementCategory[] = [
  /* ─── 1. STRETCH & MOBILITY ─── */
  {
    key: 'Stretch & Mobility',
    icon: 'body-outline',
    color: '#22c55e',
    desc: 'Restore range of motion. Prep the body. Prevent compensation.',
    subCategories: [
      {
        label: 'Hips',
        moves: [
          { name: 'Hip 90/90 Stretch', sets: '3 × 45 sec/side', cue: 'Tall spine. Let the external hip open. Breathe into it.' },
          { name: '90/90 Hip Transitions', sets: '2 × 8/side', cue: 'Flow between internal and external rotation. Stay tall.' },
          { name: 'Half Kneeling Hip Flexor Stretch', sets: '3 × 30 sec/side', cue: 'Squeeze glute on back leg. Slight lean forward — do not arch the low back.' },
          { name: 'Pigeon Stretch', sets: '2 × 45 sec/side', cue: 'Front shin as parallel as comfortable. Walk hands forward to deepen.' },
          { name: 'Frog Stretch', sets: '2 × 45 sec', cue: 'Knees wide. Sit back slowly. Feel both adductors open.' },
          { name: 'Adductor Rock-Back', sets: '2 × 10/side', cue: 'One leg extended. Rock hips back. Keep chest proud.' },
          { name: '90/90 Hover', sets: '3 × 20 sec/side', cue: 'From 90/90 position, hover both knees off ground. Hold. Anti-rotation through hips.' },
          { name: 'Quadruped Hip Abduction Rocks', sets: '2 × 10/side', cue: 'All fours. Rock hips toward the working side. Feel the adductor open.' },
          { name: 'Elevated Pigeon', sets: '2 × 45 sec/side', cue: 'Front leg on bench. Sit tall. Deeper stretch than floor pigeon.' },
          { name: 'Airplane', sets: '2 × 6/side', cue: 'SL hinge. Open hips and rotate. Glute stabilizes. Balance is the challenge.' },
          { name: 'Deep Squat Reach', sets: '2 × 8/side', cue: 'Deep squat. Reach one arm overhead. Rotate and open. Stay in the hole.' },
          { name: 'Hip Abd/Add Reach', sets: '2 × 8/side', cue: 'Wide stance. Shift weight side to side. Reach opposite hand to foot.' },
          { name: 'Supine Pelvic Bridge', sets: '2 × 10', cue: 'Lying on back. Posterior pelvic tilt. Bridge up. Feel glutes and deep hip stabilizers.' },
        ],
      },
      {
        label: 'Quads',
        moves: [
          { name: 'Couch Stretch', sets: '2 × 45 sec/side', cue: 'Back foot against wall or bench. Squeeze glute hard. Stay upright.' },
          { name: 'Standing Quad Pull', sets: '2 × 30 sec/side', cue: 'Knees together. Slight posterior pelvic tilt.' },
          { name: 'Prone Quad Stretch', sets: '2 × 30 sec/side', cue: 'Lying face down. Pull heel to glute. Keep hips flat on ground.' },
          { name: 'Bretzel Stretch', sets: '2 × 30 sec/side', cue: 'Side-lying. Top knee bent and pinned down. Rotate away and reach. Opens hip flexor + T-spine together.' },
        ],
      },
      {
        label: 'Hamstrings',
        moves: [
          { name: 'Seated Hamstring Stretch', sets: '3 × 30 sec/side', cue: 'Hinge at the hip — not the spine. Reach for toes, lead with chest.' },
          { name: 'Single-Leg RDL Stretch (no weight)', sets: '2 × 8/side', cue: 'Slow tempo. Feel the hamstring load. Balance is the point.' },
          { name: 'Supine Hamstring Stretch (band)', sets: '2 × 45 sec/side', cue: 'Lying on back, band on foot. Straight leg. Pull gently.' },
          { name: 'Inchworm Walk-Out', sets: '2 × 6', cue: 'Walk hands out to plank. Walk feet to hands. Legs as straight as possible.' },
          { name: 'Jefferson Curl', sets: '3 × 6', cue: 'Stand on box. Slowly round spine down one vertebra at a time. Light load. Full posterior chain stretch.' },
          { name: 'Seated Forward Fold', sets: '2 × 30 sec', cue: 'Legs straight. Hinge at hips. Reach past toes. Breathe and relax into it.' },
        ],
      },
      {
        label: 'Ankles',
        moves: [
          { name: 'Ankle Circles', sets: '2 × 15/direction/side', cue: 'Full range. Slow and controlled.' },
          { name: 'Wall Ankle Dorsiflexion', sets: '3 × 10/side', cue: 'Knee tracks over pinky toe. Keep heel down.' },
          { name: 'Banded Ankle Mobilization', sets: '2 × 10/side', cue: 'Band pulls joint back. Drive knee forward over toe.' },
          { name: 'Toe Walks', sets: '2 × 20 yards', cue: 'Walk on toes. Stay tall. Builds calf endurance and ankle stability.' },
          { name: 'Heel Walks', sets: '2 × 20 yards', cue: 'Walk on heels. Toes up. Strengthens anterior tibialis. Shin splint prevention.' },
          { name: 'Achilles Wall Stretch', sets: '2 × 30 sec/side', cue: 'Straight back leg. Lean into wall. Heel stays down. Feel the gastroc stretch.' },
          { name: 'Soleus Wall Stretch', sets: '2 × 30 sec/side', cue: 'Same as Achilles but bend the back knee slightly. Targets soleus deeper.' },
          { name: 'Anterior Tibialis KB Raises', sets: '2 × 15', cue: 'Seated, KB on toes. Dorsiflex against load. Builds shin strength and ankle control.' },
        ],
      },
      {
        label: 'Shoulders & T-Spine',
        moves: [
          { name: 'Thoracic Rotation on Floor', sets: '2 × 10/side', cue: 'Side-lying. Open arm wide. Follow with eyes. Breathe into it.' },
          { name: 'Cat-Cow', sets: '2 × 10', cue: 'Slow. Round fully, then arch fully. Drive movement from the spine.' },
          { name: 'Thread the Needle', sets: '2 × 8/side', cue: 'From all fours. Reach under and through. Get the rotation.' },
          { name: 'Wall Slide', sets: '2 × 10', cue: 'Back against wall. Slide arms up. Maintain contact with wall the entire time.' },
          { name: 'Foam Roll T-Spine Extension', sets: '2 × 10', cue: 'Roller at mid-back. Hands behind head. Extend over roller. Exhale.' },
          { name: 'Shoulder CARs', sets: '1 × 5/direction/side', cue: 'Controlled Articular Rotations. Biggest circle possible. Slow tempo.' },
          { name: 'Overhead Dowel Dislocates', sets: '2 × 10', cue: 'Wide grip on dowel/PVC. Pass it over head and behind. Widen grip if needed. Shoulder opener.' },
          { name: 'KB Arm Bar', sets: '2 × 30 sec/side', cue: 'Lying on back. Press KB up. Roll to side. Open shoulder and T-spine. Stabilize.' },
          { name: 'Scap CARs', sets: '2 × 5/direction', cue: 'Elevate → retract → depress → protract. Full circle. Slow and deliberate.' },
          { name: 'Bear Roll', sets: '2 × 4/side', cue: 'From all fours. Roll over shoulder. Opens chest and T-spine. Control the roll.' },
          { name: 'Side-Lying Chest Stretch', sets: '2 × 30 sec/side', cue: 'Side-lying. Top arm opens wide behind you. Let gravity open the chest and anterior shoulder.' },
          { name: 'Quadruped T-Spine Rotation', sets: '2 × 8/side', cue: 'All fours. Hand behind head. Rotate up and open. Eyes follow elbow.' },
          { name: 'Wall Overhead Reach', sets: '2 × 10', cue: 'Face wall. Reach arms overhead flat against wall. Slide up and down. Lat and T-spine mobility.' },
        ],
      },
      {
        label: 'Core & Spinal',
        moves: [
          { name: 'Prone Press-Up (McKenzie)', sets: '2 × 8', cue: 'Face down. Press chest up. Hips stay on ground. Extend the low back.' },
          { name: 'Child\'s Pose', sets: '2 × 30 sec', cue: 'Knees wide, arms extended. Breathe deep into the hips.' },
          { name: 'Scorpion Stretch', sets: '2 × 6/side', cue: 'Face down. Reach one foot across to opposite side. Open the hip and chest.' },
          { name: 'Dead Hang', sets: '3 × 20-30 sec', cue: 'Hang from pull-up bar. Relax shoulders. Decompress the spine.' },
          { name: 'Bird Dog Plank', sets: '3 × 8/side', cue: 'Plank position. Extend opposite arm and leg. Hold 3 sec. Core braced, no rotation.' },
        ],
      },
      {
        label: 'Warm-Up Progressions',
        moves: [
          { name: 'Full-Body Dynamic Warm-Up (10 min)', sets: '1 round', cue: 'Jog 200m → leg swings (F/B + lateral) → inchworms → world\'s greatest stretch → high knees → butt kicks → skips. In order.' },
          { name: 'Throwing Warm-Up Progression', sets: '1 round', cue: 'Arm circles → band pull-aparts → shoulder CARs → wrist flexion/extension → J-band circuit → light catch at 30 ft. Never throw cold.' },
          { name: 'Lower-Body Activation Warm-Up', sets: '1 round', cue: 'Glute bridges × 10 → clamshells × 10/side → banded lateral walks × 10/dir → bodyweight squats × 10 → single-leg RDL × 5/side.' },
          { name: 'Upper-Body Activation Warm-Up', sets: '1 round', cue: 'Band pull-aparts × 15 → push-ups × 10 → scap push-ups × 10 → face pulls × 12 → T-spine rotations × 8/side.' },
          { name: 'Pre-Game Speed Warm-Up', sets: '1 round', cue: 'Jog → A-skip × 20 yds → B-skip × 20 yds → lateral shuffle × 20 yds/dir → 3 build-up sprints (60%, 80%, 90%). Ready to compete.' },
          { name: 'Cool-Down Flow (post-game)', sets: '8-10 min', cue: 'Light walk 3 min → foam roll 3 min → child\'s pose 30s → pigeon 30s/side → seated hamstring 30s/side → dead hang 30s. Wind down.' },
        ],
      },
    ],
  },

  /* ─── 2. ROTATIONAL CONTROL (DISSOCIATION) ─── */
  {
    key: 'Rotational Control',
    icon: 'sync-outline',
    color: '#f97316',
    desc: 'Pelvis-ribcage separation. The engine behind throwing velo, bat speed, and rotational power.',
    subCategories: [
      {
        label: 'Pelvis Control',
        moves: [
          { name: 'Pelvis-Only Rotation', sets: '2 × 8/side', cue: 'Feet planted, rib cage locked. Rotate pelvis only. Build awareness of lower half independence.' },
          { name: 'Pelvis-on-Wall', sets: '2 × 8/side', cue: 'Back to wall. Rotate pelvis while keeping shoulders on wall. Feel the separation.' },
          { name: 'Hinge → Pelvis Rotate', sets: '2 × 8/side', cue: 'Hip hinge position. Rotate pelvis left and right without moving upper body. Train dissociation under load.' },
          { name: 'Lateral Hip Shift + Rotate', sets: '2 × 6/side', cue: 'Shift hips laterally, then rotate pelvis. Mimics pitching weight shift. Control the sequence.' },
        ],
      },
      {
        label: 'Ribcage Control',
        moves: [
          { name: 'Rib-Only Rotation', sets: '2 × 8/side', cue: 'Pelvis locked. Rotate ribcage only. Hands on hips to feel the separation.' },
          { name: 'Rib Lock Breathing', sets: '2 × 5 breaths', cue: 'Hold ribcage stable. Breathe diaphragmatically. Teaches rib cage control under respiratory demand.' },
          { name: 'Side Bend → Hold → Rotate', sets: '2 × 6/side', cue: 'Lateral flexion. Hold. Then rotate from that position. Multi-plane control.' },
        ],
      },
      {
        label: 'Separation & Dissociation',
        moves: [
          { name: 'Opposing Pelvis/Rib Rotation', sets: '2 × 8/side', cue: 'Pelvis rotates one way, ribcage the other. The key movement in throwing and hitting.' },
          { name: 'Hands-Free Dissociations', sets: '2 × 8/side', cue: 'Arms at sides. Separate pelvis and rib without hand guidance. Internalize the pattern.' },
          { name: 'Half-Kneeling Rotation Control', sets: '2 × 8/side', cue: 'Tall half-kneeling. Rotate through thorax only. Pelvis stays square. Anti-rotation lower half.' },
          { name: 'Dead Bug Rotation Control', sets: '2 × 6/side', cue: 'Dead bug position. Add rotation through the rib cage while maintaining core brace. High-level dissociation.' },
        ],
      },
    ],
  },

  /* ─── 3. PLYOMETRICS & EXPLOSIVE WORK ─── */
  {
    key: 'Plyometrics & Explosive',
    icon: 'flash-outline',
    color: Colors.primary,
    desc: 'Build rate of force development. Transfer power to the field.',
    subCategories: [
      {
        label: 'Med Ball',
        moves: [
          { name: 'Rotational Med Ball Throw (wall)', sets: '4 × 6/side', cue: 'Load hip, separate, explode into throw. Reset each rep.' },
          { name: 'Overhead Med Ball Slam', sets: '4 × 6', cue: 'Triple extend. Slam with intent. Pick it up and go again.' },
          { name: 'Scoop Toss (forward)', sets: '3 × 6', cue: 'Load hips. Snap through. Measure distance.' },
          { name: 'Chest Pass (partner or wall)', sets: '3 × 8', cue: 'Rapid push. Elbows tight. Punch through.' },
          { name: 'Rotational Shotput Throw', sets: '3 × 6/side', cue: 'Side-facing wall. Push through the hip. One-arm launch.' },
          { name: 'Step-Behind Rotational Throw', sets: '3 × 5/side', cue: 'Crossover step to load. Separate and fire. Max intent.' },
          { name: 'Kneeling Side Toss', sets: '3 × 8/side', cue: 'Tall kneeling. Isolate the core rotation. No hip cheating.' },
          { name: 'Kneeling Scoop Toss', sets: '3 × 6', cue: 'Tall kneeling. Scoop and launch forward. Isolates hip extension power.' },
          { name: 'Seated Scoop Toss', sets: '3 × 6', cue: 'Seated on ground. Scoop toss forward. Eliminates lower body — pure trunk power.' },
          { name: '1-Step Scoop Toss', sets: '3 × 5/side', cue: 'One step into scoop toss. Build momentum transfer. Measure distance.' },
          { name: 'Lateral Scoop Toss', sets: '3 × 5/side', cue: 'Side-facing. Scoop and launch laterally. Rotational hip power.' },
          { name: 'Reverse Scoop Toss', sets: '3 × 5', cue: 'Face away from target. Scoop toss overhead behind you. Full extension.' },
          { name: 'Kneeling Shot Put', sets: '3 × 6/side', cue: 'Tall kneeling. One-arm push throw. Isolate upper body rotational power.' },
          { name: 'Lateral Step Shot Put', sets: '3 × 5/side', cue: 'Lateral step into one-arm push throw. Build momentum through lateral shift.' },
          { name: 'Reverse Shot Put', sets: '3 × 5/side', cue: 'Back to wall. Rotate and push. Full hip and trunk separation.' },
          { name: 'Rainbow Slam', sets: '3 × 6/side', cue: 'Arc ball from one hip, overhead, slam to opposite side. Full range rotational power.' },
          { name: 'Side-to-Side Slam', sets: '3 × 8', cue: 'Slam ball left, catch, slam right. Rapid rotational conditioning.' },
          { name: 'Rotational Slam', sets: '3 × 6/side', cue: 'Load to one side, slam with rotation. Max intent. Reset each rep.' },
          { name: 'Step-Back Slam', sets: '3 × 6', cue: 'Step back and overhead slam. Adds deceleration component to the slam.' },
          { name: 'MB Granny Toss', sets: '3 × 5', cue: 'Between legs. Load hips deep. Toss forward for max distance. Lower half power test.' },
        ],
      },
      {
        label: 'Upper Body Plyo',
        moves: [
          { name: 'Plyo Push-Up', sets: '3 × 5', cue: 'Explosive push. Hands leave ground. Land soft, absorb.' },
          { name: 'Med Ball Slam to Push-Up', sets: '3 × 5', cue: 'Slam, drop to push-up position, reset. Power + endurance.' },
          { name: 'Overhead Throw (backward)', sets: '3 × 5', cue: 'Face away. Scoop ball overhead and behind. Full extension.' },
          { name: 'Depth Drop Push-Up', sets: '3 × 5', cue: 'Hands on low boxes. Drop to floor, catch, explode back up. Reactive upper body power.' },
          { name: 'Plyo Pull-Up', sets: '3 × 3-5', cue: 'Explosive pull. Hands release bar at top. Catch and repeat. Advanced pulling power.' },
          { name: 'SA Med Ball Push-Up', sets: '3 × 5/side', cue: 'One hand on med ball. Push-up with explosive intent. Core anti-rotation under load.' },
          { name: 'Dive Bomber Push-Up', sets: '3 × 6', cue: 'Swoop down and through. Reverse back. Full body pushing power + mobility.' },
        ],
      },
      {
        label: 'Lower Body Plyo',
        moves: [
          { name: 'Box Jump', sets: '4 × 4', cue: 'Max effort. Land soft with knees out. Step down — do not jump down.' },
          { name: 'Depth Drop to Vertical Jump', sets: '3 × 4', cue: 'Step off box. Absorb. Explode up immediately. Minimize ground time.' },
          { name: 'Broad Jump', sets: '3 × 3', cue: 'Triple extension + arm drive. Measure and track distance each session.' },
          { name: 'Single-Leg Box Jump', sets: '3 × 3/side', cue: 'Drive one knee. Land on both feet. Control the landing.' },
          { name: 'Lateral Bound', sets: '3 × 5/side', cue: 'Push off one leg, land on opposite. Stick the landing 2 sec.' },
          { name: 'Hurdle Hop (continuous)', sets: '3 × 5', cue: 'Rapid ground contact. Spring through each hop. Knees up.' },
          { name: 'Tuck Jump', sets: '3 × 5', cue: 'Vertical jump, pull knees to chest. Land softly and repeat.' },
          { name: 'Medial/Lateral Line Hops', sets: '3 × 10', cue: 'Quick hops side to side over a line. Ankle stiffness and coordination.' },
          { name: 'Ankle Hops', sets: '3 × 15', cue: 'Minimal knee bend. Hop using only ankles. Builds calf and Achilles reactivity.' },
          { name: 'Skier Hops', sets: '3 × 10', cue: 'Side to side, feet together. Absorb and redirect. Lateral reactive power.' },
          { name: 'SL Drop to Jump', sets: '3 × 3/side', cue: 'Single-leg step off low box. Land on same leg, immediately jump. Reactive SL power.' },
          { name: 'Heiden w/ Stick', sets: '3 × 5/side', cue: 'Lateral bound. Stick the landing 2-3 sec. Train deceleration and SL stability.' },
          { name: 'Reactive Heiden', sets: '3 × 5/side', cue: 'Lateral bound. No pause — immediately reverse direction. Elastic lateral power.' },
          { name: 'Triple Broad Jump', sets: '3 × 3', cue: 'Three consecutive broad jumps. Absorb and explode each rep. Total horizontal power.' },
          { name: 'SL Triple Broad Jump', sets: '3 × 2/side', cue: 'Three consecutive single-leg bounds forward. Advanced horizontal power output.' },
          { name: 'Kneeling Box Jump', sets: '3 × 3', cue: 'Start kneeling. Explode to feet on box. Pure hip extension power. No momentum.' },
          { name: 'Depth Drop (weighted)', sets: '3 × 3', cue: 'Hold light DBs. Step off box, absorb landing. Overloads eccentric landing mechanics.' },
        ],
      },
      {
        label: 'Sprint & Agility Plyo',
        moves: [
          { name: 'Acceleration Sprint (10 yards)', sets: '6 × 1', cue: 'Lean into it. Drive. First 3 steps are everything.' },
          { name: 'Lateral Shuffle to Sprint', sets: '4 × 1/side', cue: 'Shuffle 5 yards. Plant and sprint 10 yards. Game-speed transition.' },
          { name: 'Skater Jumps', sets: '3 × 8/side', cue: 'Lateral explosion. Land on one foot. Absorb and reverse.' },
        ],
      },
      {
        label: 'Reactive Strength',
        moves: [
          { name: 'Depth Jump to Broad Jump', sets: '3 × 4', cue: 'Step off 18" box. Absorb, then immediately broad jump. Minimize ground time. Elastic power.' },
          { name: 'Altitude Landing', sets: '3 × 5', cue: 'Step off box (start low). Land in athletic position. Absorb with control. Zero follow-up jump — pure decel training.' },
          { name: 'Drop Jump (reactive)', sets: '3 × 5', cue: 'Step off box, hit the ground, immediately jump max height. Ground contact < 0.2 sec. Spring, don\'t squat.' },
          { name: 'Reactive Lateral Bound', sets: '3 × 6/side', cue: 'Bound laterally. As soon as you land, reverse direction. Quick, elastic ground contact.' },
          { name: 'Pogos (ankle)', sets: '3 × 15', cue: 'Stiff ankles. Bounce off the ground like a pogo stick. Minimal knee bend. Train the Achilles.' },
          { name: 'Single-Leg Pogos', sets: '3 × 10/side', cue: 'Same as pogos but one foot. Ankle stiffness + reactive strength. Key for sprint mechanics.' },
          { name: 'Trap Bar Jump', sets: '3 × 3', cue: 'Loaded trap bar (30-40% squat). Dip, jump max height, land soft, reset. Builds force-velocity.' },
          { name: 'Band-Assisted Depth Jump', sets: '3 × 4', cue: 'Bands overhead for slight assist. Allows faster ground contact time on depth jumps. Overloads the reflex.' },
        ],
      },
    ],
  },

  /* ─── 3. LIFTING & STRENGTH ─── */
  {
    key: 'Lifting & Strength',
    icon: 'barbell-outline',
    color: '#3b82f6',
    desc: 'Build the engine. Strength is the foundation of every athletic quality.',
    subCategories: [
      {
        label: 'Lower Body',
        moves: [
          { name: 'Trap Bar Deadlift', sets: '4 × 5', cue: 'Drive the floor away. Chest tall, hips back. Reset each rep.' },
          { name: 'Barbell Back Squat', sets: '4 × 5', cue: 'Hip crease below knee. Brace hard. Drive out of the hole.' },
          { name: 'Front Squat', sets: '3 × 6', cue: 'Elbows high. Core braced. Upright torso the entire time.' },
          { name: 'Bulgarian Split Squat', sets: '3 × 8/side', cue: 'Rear foot elevated. Vertical shin. Control the descent.' },
          { name: 'Goblet Squat', sets: '3 × 10', cue: 'Hip crease below knee. Elbows inside knees at bottom.' },
          { name: 'Romanian Deadlift (RDL)', sets: '3 × 8', cue: 'Hinge at hip. Bar slides down thighs. Feel the hamstrings load.' },
          { name: 'Single-Leg RDL (dumbbell)', sets: '3 × 8/side', cue: 'Hips square. Hamstring loads on descent. Light weight until form is locked.' },
          { name: 'Walking Lunge', sets: '3 × 10/side', cue: 'Long stride. Upright torso. Drive through front heel.' },
          { name: 'Hip Thrust', sets: '3 × 10', cue: 'Shoulders on bench. Drive hips to full extension. Squeeze glutes 2 sec at top.' },
          { name: 'Leg Press', sets: '3 × 10', cue: 'Controlled descent. Full range of motion. No bouncing at bottom.' },
          { name: 'Suitcase Deadlift', sets: '3 × 6/side', cue: 'One DB at side. Hinge with anti-lateral flexion. Core fights the offset load.' },
          { name: 'SL Hip Thrust', sets: '3 × 8/side', cue: 'One foot planted. Drive hips up. Squeeze glute at top. No rotation.' },
          { name: 'Safety Bar Squat', sets: '4 × 5', cue: 'Handles forward. Allows more upright torso. Great for shoulder issues.' },
          { name: 'Box Squat', sets: '4 × 5', cue: 'Sit back to box. Pause. Drive up. Teaches posterior chain loading.' },
          { name: 'Step-Ups', sets: '3 × 8/side', cue: 'Knee-height box. Drive through top foot. No push off back leg.' },
          { name: 'Knee-Drive Step-Ups', sets: '3 × 8/side', cue: 'Step up, drive opposite knee high. Mimics sprint acceleration. Hold at top.' },
          { name: 'Cossack Squat', sets: '3 × 6/side', cue: 'Wide stance. Shift to one side. Sit deep. Opposite leg straight. Adductor + hip mobility under load.' },
          { name: 'Seated Hamstring Curl', sets: '3 × 10', cue: 'Machine curl. Controlled eccentric. Full contraction. Knee flexion strength.' },
        ],
      },
      {
        label: 'Upper Body',
        moves: [
          { name: 'Barbell Bench Press', sets: '4 × 5', cue: 'Arch back slightly. Plant feet. Controlled descent, explosive press.' },
          { name: 'Incline Dumbbell Press', sets: '3 × 8', cue: '30-45 degree incline. Full stretch at bottom. Squeeze at top.' },
          { name: 'Pull-Ups / Chin-Ups', sets: '4 × max', cue: 'Full hang at bottom. Chin over bar. Control the negative.' },
          { name: 'Barbell Row', sets: '4 × 6', cue: 'Hinge forward 45°. Pull to belly button. Squeeze shoulder blades.' },
          { name: 'Dumbbell Row', sets: '3 × 8/side', cue: 'One hand on bench. Row to hip. No rotation.' },
          { name: 'Overhead Press', sets: '3 × 6', cue: 'Brace core. Press overhead. Head through at the top.' },
          { name: 'Landmine Press', sets: '3 × 8/side', cue: 'Single arm. Core stable. Press at an angle. Athletic position.' },
          { name: 'Lat Pulldown', sets: '3 × 10', cue: 'Wide grip. Pull to chest. Squeeze lats at bottom. Control the return.' },
          { name: 'Face Pull', sets: '3 × 15', cue: 'High cable. Pull to face. External rotation at end range. Rear delts fire.' },
          { name: 'Push-Up Variations', sets: '3 × 12-15', cue: 'Hands shoulder width or wider. Full range. Core tight.' },
          { name: 'Neutral Grip DB Bench', sets: '3 × 8', cue: 'Palms facing each other. Shoulder-friendly pressing. Full ROM.' },
          { name: 'Dynamic Effort DB Bench', sets: '6 × 3', cue: 'Light weight (50-60%). Max speed on press. Compensatory acceleration.' },
          { name: 'Alternating Incline DB Press', sets: '3 × 8/side', cue: 'Press one arm at a time. Anti-rotation core demand. Incline bench.' },
          { name: 'Landmine Rotational Press', sets: '3 × 8/side', cue: 'Press with rotation through hips. Athletic pressing pattern for throwers.' },
          { name: 'Push Press', sets: '3 × 5', cue: 'Slight dip. Explosive drive. Press overhead. Transfers to throwing power.' },
          { name: 'DB Chest-Supported Row', sets: '3 × 10', cue: 'Chest on incline bench. Row both DBs. No momentum. Pure back.' },
          { name: 'Blast Strap Inverted Row', sets: '3 × 10', cue: 'Suspension straps. Row body up. Squeeze shoulder blades. Adjustable difficulty.' },
          { name: 'SA TRX Row', sets: '3 × 8/side', cue: 'Single-arm TRX row. Anti-rotation demand. Scap stability + pulling.' },
          { name: 'Pendlay Row', sets: '4 × 5', cue: 'Dead stop on floor each rep. Explosive pull to belly. Reset. Pure power.' },
          { name: 'SA Cable Row', sets: '3 × 10/side', cue: 'Single-arm cable row. Anti-rotation. Pull to hip. Slow eccentric.' },
          { name: 'DB Fly', sets: '3 × 10', cue: 'Flat or incline. Slight bend in elbows. Feel the stretch. Squeeze at top.' },
          { name: 'Hammer Curl', sets: '3 × 10', cue: 'Neutral grip. Curl to shoulder. Builds brachialis and forearm. Grip strength transfer.' },
          { name: 'Barbell Curl', sets: '3 × 8', cue: 'EZ bar or straight bar. Controlled negative. No swinging.' },
          { name: 'Shock Curl', sets: '3 × 6', cue: 'Fast eccentric, catch and hold at 90°, then curl up. Builds reactive bicep strength.' },
          { name: 'Skull Crusher', sets: '3 × 10', cue: 'EZ bar. Lower to forehead. Elbows stay in. Press up. Tricep mass builder.' },
          { name: 'Tate Press', sets: '3 × 10', cue: 'DBs on chest, press up and in. Unique tricep angle. Elbow health.' },
          { name: 'Dips', sets: '3 × 8-12', cue: 'Parallel bars. Slight forward lean. Full depth. Control the negative.' },
        ],
      },
      {
        label: 'Scap / Serratus / Cuff',
        moves: [
          { name: 'Incline YTL Raise', sets: '2 × 8 each', cue: 'Chest on incline bench. Y, T, L positions. Light weight. Scap stability.' },
          { name: '1-Arm Prone YTL', sets: '2 × 8/side', cue: 'Face down. Single-arm Y, T, L raises. Targets lower trap and cuff independently.' },
          { name: 'Banded Scarecrows', sets: '2 × 12', cue: 'Elbows at 90°. Externally rotate against band. Slow and controlled. Cuff health.' },
          { name: '½ Kneeling Banded Vibrations', sets: '2 × 20 sec/side', cue: 'Half kneeling. Hold band at arm\'s length. Create rapid vibrations. Stabilizer activation.' },
          { name: 'Wall Windshield Wipers', sets: '2 × 10/side', cue: 'Forearm on wall. Rotate hand side to side like wiper. Internal/external rotation control.' },
          { name: 'Rhythmic Stabilizations', sets: '2 × 15 sec/side', cue: 'Arm extended. Partner applies random perturbations. Shoulder stabilizers react and hold.' },
          { name: 'Bottoms-Up KB OH Carry', sets: '2 × 30 yards/side', cue: 'KB inverted overhead. Walk slow. Grip + shoulder stability under load.' },
          { name: 'No-Money Band', sets: '2 × 15', cue: 'Band at waist. Elbows pinned. Externally rotate. "No money" position. Daily cuff work.' },
          { name: 'Band Wall Walks', sets: '2 × 6/side', cue: 'Band around wrists. Walk hands up wall. Serratus and lower trap activate under tension.' },
          { name: 'Sidelying DB ER', sets: '2 × 12/side', cue: 'Side-lying. Elbow pinned to side. Light DB. Externally rotate. Infraspinatus isolation.' },
          { name: 'Prone DB Row + ER + Press Out', sets: '2 × 6/side', cue: 'Face down. Row, externally rotate, press out. 3-in-1 shoulder complex. Light weight.' },
          { name: 'Bilateral Retraction + ER', sets: '2 × 10', cue: 'Both arms. Retract scaps, then externally rotate. Band or cables. Full cuff circuit.' },
        ],
      },
      {
        label: 'Core & Rotational',
        moves: [
          { name: 'Pallof Press', sets: '3 × 10/side', cue: 'Anti-rotation. Press out, hold 2 sec, return. Cable does not win.' },
          { name: 'Cable Woodchop (high to low)', sets: '3 × 10/side', cue: 'Rotate through the hips. Arms stay long. Controlled decel.' },
          { name: 'Cable Woodchop (low to high)', sets: '3 × 10/side', cue: 'Drive from the hip. Finish tall. Feel the obliques.' },
          { name: 'Hanging Leg Raise', sets: '3 × 10', cue: 'Controlled. Legs straight. No swinging. Slow descent.' },
          { name: 'Ab Wheel Rollout', sets: '3 × 8', cue: 'Brace. Roll out as far as controllable. Do not let hips sag.' },
          { name: 'Landmine Rotation', sets: '3 × 8/side', cue: 'Athletic stance. Rotate from hips. Bar moves in an arc.' },
          { name: 'Dead Bug', sets: '3 × 8/side', cue: 'Back flat on floor. Opposite arm/leg extend. Core stays braced.' },
          { name: 'Plank (front)', sets: '3 × 30-45 sec', cue: 'Elbows under shoulders. Squeeze glutes. No sagging.' },
          { name: 'Side Plank', sets: '3 × 30 sec/side', cue: 'Elbow under shoulder. Hips high. Top arm can reach up.' },
          { name: 'Pallof Press w/ Rotation', sets: '3 × 8/side', cue: 'Press out, then rotate toward cable. Return. Anti-rotation under rotational load.' },
          { name: 'Landmine 180s', sets: '3 × 8', cue: 'Swing barbell end from hip to hip in an arc. Rotational power and deceleration.' },
          { name: 'Hanging Wipers', sets: '3 × 6/side', cue: 'Hang from bar. Legs straight. Rotate legs side to side. Advanced oblique work.' },
          { name: 'Russian Twist + MB Slam', sets: '3 × 8/side', cue: 'Seated Russian twist, then slam the ball to one side. Rotation + power.' },
          { name: 'Suitcase Sit-Up', sets: '3 × 8/side', cue: 'Hold weight in one hand. Sit up. Anti-lateral flexion through the crunch.' },
          { name: 'Stability Ball Pike', sets: '3 × 8', cue: 'Feet on ball. Pike hips up. Core braced. Controlled descent.' },
          { name: 'Stir-the-Pot', sets: '3 × 8/direction', cue: 'Forearms on stability ball. Make small circles. Anti-extension + anti-rotation.' },
        ],
      },
      {
        label: 'Strongman / Functional',
        moves: [
          { name: 'Farmer\'s Carry', sets: '3 × 40 yards', cue: 'Heavy dumbbells or kettlebells. Tall posture. Walk with purpose.' },
          { name: 'Sled Push', sets: '4 × 20 yards', cue: 'Low and drive. Short powerful steps. Arms locked.' },
          { name: 'Sled Pull (backward)', sets: '3 × 20 yards', cue: 'Face the sled. Pull backward. Quads and hip flexors fire.' },
          { name: 'Sandbag Clean', sets: '3 × 6', cue: 'Hinge, scoop, explode to chest. Awkward objects build real strength.' },
          { name: 'Kettlebell Swing', sets: '3 × 12', cue: 'Hinge, not squat. Snap hips. Bell floats to chest height.' },
          { name: '1-Arm Farmer\'s Carry', sets: '3 × 40 yards/side', cue: 'Single DB or KB. Anti-lateral flexion. Core fights the offset. Walk tall.' },
          { name: 'Waiter Walk', sets: '3 × 30 yards/side', cue: 'KB or DB pressed overhead. Walk slow. Shoulder stability + core control under load.' },
          { name: 'Tire Flip', sets: '3 × 5', cue: 'Hinge under tire. Drive with legs. Flip. Full-body power and grit.' },
          { name: 'Sled Drag', sets: '3 × 30 yards', cue: 'Strap around waist. Walk forward against resistance. Hip extension endurance.' },
        ],
      },
    ],
  },

  /* ─── 5. BASEBALL-SPECIFIC ─── */
  {
    key: 'Baseball-Specific',
    icon: 'baseball-outline',
    color: '#f59e0b',
    desc: 'Arm care, scapular health, grip, and bat speed — the stuff that keeps you on the field and performing.',
    subCategories: [
      {
        label: 'Arm Care',
        moves: [
          { name: 'Band Pull-Apart', sets: '3 × 20', cue: 'Arms straight. Squeeze shoulder blades. Daily if possible.' },
          { name: 'Band External Rotation (90/90)', sets: '3 × 15/side', cue: 'Elbow at 90°. Rotate out against band. Controlled tempo.' },
          { name: 'Band Internal Rotation', sets: '3 × 15/side', cue: 'Elbow at 90°. Rotate in. Feel the subscap working.' },
          { name: 'Prone Y-T-W Raises', sets: '2 × 8 each', cue: 'Face down on incline bench. Light weight. Slow and controlled.' },
          { name: 'Sleeper Stretch', sets: '2 × 30 sec/side', cue: 'Side-lying. Gently press throwing arm into internal rotation.' },
          { name: 'Cross-Body Stretch', sets: '2 × 30 sec/side', cue: 'Pull arm across chest with opposite hand. Posterior shoulder stretch.' },
          { name: 'Wrist Flexion/Extension (band)', sets: '2 × 15 each direction', cue: 'Forearm on knee. Full range of motion. Daily maintenance.' },
          { name: 'Cuban Press', sets: '2 × 8', cue: 'Upright row to external rotation to press. Light weight. Full cuff circuit in one move.' },
          { name: 'Band Ws', sets: '2 × 12', cue: 'Pull band apart into W shape. External rotation + retraction. Rear delt and cuff.' },
          { name: 'Sidelying External Rotation', sets: '2 × 12/side', cue: 'Side-lying. Light DB. Elbow pinned. Rotate up. Infraspinatus isolation. Arm care staple.' },
        ],
      },
      {
        label: 'Scapular Health',
        moves: [
          { name: 'Scap Push-Up', sets: '3 × 12', cue: 'Push-up position. Only move the shoulder blades — protract and retract.' },
          { name: 'Wall Slide with Lift-Off', sets: '2 × 10', cue: 'Back against wall. Slide arms up. Lift hands off wall at top.' },
          { name: 'Banded Scap Retraction', sets: '3 × 15', cue: 'Band at chest height. Pull shoulder blades together. Hold 2 sec.' },
          { name: 'Serratus Wall Slide', sets: '2 × 10', cue: 'Forearms on wall. Slide up. Push into wall to engage serratus.' },
          { name: 'Prone Trap-3 Raise', sets: '2 × 10/side', cue: 'Face down. Thumb up, arm at 120°. Raise slowly. Feel lower trap.' },
        ],
      },
      {
        label: 'Grip Strength',
        moves: [
          { name: 'Fat Grip Holds', sets: '3 × 20 sec', cue: 'Thick bar or fat gripz on dumbbell. Hold heavy. Crushing grip.' },
          { name: 'Plate Pinch', sets: '3 × 15 sec/hand', cue: 'Pinch two plates together. Smooth side out. Thumb vs fingers.' },
          { name: 'Rice Bucket', sets: '2 × 60 sec', cue: 'Open, close, rotate in a bucket of rice. Forearm endurance + rehab.' },
          { name: 'Wrist Roller', sets: '3 × 2 (up and down)', cue: 'Arms extended. Roll weight up, then slowly down. Forearms will burn.' },
          { name: 'Towel Hang', sets: '2 × max time', cue: 'Drape towel over pull-up bar. Hang from towel. Grip endurance.' },
          { name: 'Plate Wrist Rolls', sets: '2 × 3 (up and down)', cue: 'Hold plate, roll wrist up and down. Forearm endurance. Bat grip transfer.' },
          { name: 'DB Gun Walks', sets: '2 × 30 yards/side', cue: 'Hold DB at side, wrist curled up (gun position). Walk. Forearm and grip endurance under load.' },
        ],
      },
      {
        label: 'Bat Speed',
        moves: [
          { name: 'Overload Swings (heavy bat)', sets: '3 × 8', cue: 'Heavy bat or donut. Full swings. Feel the load through the zone.' },
          { name: 'Underload Swings (light bat)', sets: '3 × 8', cue: 'Light bat or training bat. Max speed intent. Let it rip.' },
          { name: 'Contrast Swings (heavy → light)', sets: '3 × 4+4', cue: '4 heavy, immediately 4 light. Feel the speed difference.' },
          { name: 'Resistance Band Swings', sets: '3 × 8', cue: 'Band attached behind. Swing against resistance. Build acceleration.' },
          { name: 'Connection Ball Swings', sets: '3 × 10', cue: 'Ball between forearms. Maintain connection through the swing. Sequencing.' },
          { name: 'Rotational Med Ball Throw (bat speed)', sets: '4 × 6/side', cue: 'Mimic swing pattern. Load hip, separate, explode into wall. Max intent.' },
          { name: 'Med Ball Step-Behind Throw', sets: '3 × 5/side', cue: 'Crossover step to load. Separate and fire. Transfers directly to swing sequencing.' },
          { name: 'Kneeling Rotational Toss', sets: '3 × 8/side', cue: 'Tall kneeling. Isolate core rotation. No lower body cheating — pure rotational speed.' },
          { name: 'Med Ball Slam to Swing', sets: '3 × 5', cue: 'Overhead slam, immediately pick up bat and swing. Activates fast-twitch fibers.' },
          { name: 'Med Ball Scoop Toss (forward)', sets: '3 × 6', cue: 'Load hips low, snap through with full extension. Measures lower half power transfer.' },
        ],
      },
    ],
  },

  /* ─── 5. SPEED & AGILITY ─── */
  {
    key: 'Speed & Agility',
    icon: 'speedometer-outline',
    color: '#8b5cf6',
    desc: 'First-step quickness, acceleration, and change of direction — game speed, not gym speed.',
    subCategories: [
      {
        label: 'Linear Speed',
        moves: [
          { name: '10-Yard Sprint', sets: '6 × 1', cue: 'Acceleration only. Lean forward. Drive knees. First 3 steps are everything.' },
          { name: '30-Yard Sprint', sets: '6 × 1', cue: 'Full acceleration into top speed. Walk back = full recovery.' },
          { name: '60-Yard Sprint', sets: '3 × 1', cue: 'Baseball showcase distance. Get-off, transition, top end. Time it.' },
          { name: 'Flying 20s', sets: '4 × 1', cue: '20-yard build-up, then 20-yard max speed. Top-end velocity work.' },
          { name: 'Hill Sprint', sets: '6 × 1', cue: 'Moderate hill. Max intent. Drive hard. Walk down to recover.' },
          { name: 'Falling Starts', sets: '4 × 1', cue: 'Lean forward until you fall. Sprint on first step. Teaches forward lean and acceleration angle.' },
          { name: 'Push-Up Start', sets: '4 × 1', cue: 'Start face-down in push-up. Pop up and sprint. Reaction + acceleration from ground.' },
          { name: 'Side Start', sets: '4 × 1/side', cue: 'Start sideways. Open hips and sprint. Mimics base-running reads.' },
          { name: 'Split-Stance Start', sets: '4 × 1', cue: 'Staggered stance. Drive off back foot. First-step acceleration. Baseball lead-off position.' },
          { name: '2-Point / 3-Point Start', sets: '4 × 1', cue: 'Track-style start. Hand(s) down. Explode out low. First 10 yards.' },
          { name: 'Wall Acceleration Drill', sets: '3 × 8/side', cue: 'Hands on wall. Drive knees one at a time. 45° body angle. Piston action.' },
          { name: 'Sled Sprint Start', sets: '4 × 10 yards', cue: 'Light sled. Sprint from standstill. Overloads acceleration mechanics.' },
          { name: 'Wickets', sets: '4 × 1', cue: 'Mini hurdles spaced for stride length. Run through at top speed. Trains stride frequency and consistency.' },
          { name: 'Straight-Leg Bounds', sets: '3 × 30 yards', cue: 'Legs stay straight. Pull from hamstring/glute. Builds top-end sprint mechanics.' },
          { name: 'Flying 10s', sets: '4 × 1', cue: 'Build up 20 yards, then 10-yard max speed zone. Shorter than Flying 20s. Pure top-end.' },
        ],
      },
      {
        label: 'Lateral & Change of Direction',
        moves: [
          { name: 'Lateral Shuffle', sets: '4 × 10 yards/direction', cue: 'Stay low. Push off outside foot. Athletic base.' },
          { name: '5-10-5 Shuttle (Pro Agility)', sets: '4 × 1', cue: '5 yards left, 10 yards right, 5 back. Plant and drive.' },
          { name: 'T-Drill', sets: '3 × 1', cue: 'Sprint, shuffle, backpedal. 4 cones in T shape. Game-speed cuts.' },
          { name: 'Lateral Bound to Sprint', sets: '4 × 1/side', cue: 'Bound laterally 3 times, then sprint 10 yards. Transition speed.' },
          { name: 'Crossover Run', sets: '3 × 20 yards/direction', cue: 'Outfield footwork. Crossover step and run. Open hips to ball.' },
          { name: 'Stick Landing', sets: '3 × 4/side', cue: 'Jump or bound. Stick the landing for 3 sec. Zero movement. Train deceleration control.' },
          { name: 'Lateral Decel → Re-Accel', sets: '4 × 1/side', cue: 'Shuffle at speed. Stop on a dime. Immediately re-accelerate opposite direction.' },
          { name: 'Sprint → Stop', sets: '4 × 1', cue: 'Sprint 15 yards, stop in 2 steps. Absorb. No extra steps. Pure braking ability.' },
          { name: 'Medial Heiden → Brake', sets: '3 × 4/side', cue: 'Lateral Heiden bound. Land and freeze. Deceleration on one leg. Knee stability.' },
        ],
      },
      {
        label: 'Baseball-Specific Speed',
        moves: [
          { name: 'Steal Start Pattern', sets: '6 × 1', cue: 'Lead-off position. First 3 steps explosive. Crossover and go. Read the pitcher.' },
          { name: 'Curved Sprint', sets: '4 × 1', cue: 'Sprint in an arc (rounding a base). Lean in. Maintain speed through the turn.' },
          { name: 'Angle Breakout / S-Curve Sprint', sets: '4 × 1', cue: 'Start at angle, break into straight sprint. Mimics outfield route to ball.' },
        ],
      },
      {
        label: 'Footwork & Reaction',
        moves: [
          { name: 'Ladder Drills (various)', sets: '2 × 4 patterns', cue: 'Quick feet. Eyes up. In-in-out-out, ickey shuffle, lateral, etc.' },
          { name: 'Cone Reaction Drill', sets: '4 × 1', cue: 'Partner points direction. React and sprint. Read and go.' },
          { name: 'High Knees', sets: '3 × 20 yards', cue: 'Quick ground contact. Arms pump fast. Balls of feet.' },
          { name: 'Backpedal to Sprint', sets: '4 × 1', cue: 'Backpedal 5 yards. Turn and sprint 15. Outfielder transition.' },
        ],
      },
    ],
  },

  /* ─── 6. CONDITIONING ─── */
  {
    key: 'Conditioning',
    icon: 'heart-outline',
    color: '#ef4444',
    desc: 'Baseball-specific energy system work. No distance running. Stay explosive.',
    subCategories: [
      {
        label: 'Anaerobic Conditioning',
        moves: [
          { name: 'Sprint Intervals (90/90 split)', sets: '8 rounds', cue: '90-foot sprint (base distance), 90 seconds rest. Repeat.' },
          { name: 'Shuttle Run (300 yards)', sets: '2 × 1', cue: '6 × 50 yards back and forth. Full effort. 3-4 min rest between.' },
          { name: 'Baserunning Circuits', sets: '4 × 1', cue: 'Home to first sprint. First to third. Full diamond. Game situations.' },
          { name: 'Bike Sprints', sets: '8 × 20 sec on / 40 sec off', cue: 'Assault bike or stationary. Max RPM during work intervals.' },
          { name: 'Rower Sprints', sets: '6 × 250m', cue: 'Max effort pull. 90 sec rest between. Track split times.' },
          { name: 'SkiErg Power Intervals', sets: '6 × 20 sec on / 40 sec off', cue: 'Max effort pulls. Lat and core power. Track wattage.' },
        ],
      },
      {
        label: 'Aerobic Base',
        moves: [
          { name: 'Tempo Runs', sets: '8 × 100 yards', cue: '70% effort. Jog back as rest. Build aerobic base without killing legs.' },
          { name: 'Tempo Bike', sets: '20-30 min', cue: 'Steady state. 60-70% effort. Heart rate 130-150 BPM. Recovery between hard days.' },
          { name: 'Tempo Row', sets: '15-20 min', cue: 'Steady state rowing. Consistent pace. Monitor stroke rate and split. Aerobic development.' },
          { name: 'Jog/Walk Cycles', sets: '20 min', cue: '2 min jog / 1 min walk. Repeat. Low-impact aerobic work. Active recovery day option.' },
        ],
      },
      {
        label: 'Baseball-Specific Conditioning',
        moves: [
          { name: '90-ft Repeats', sets: '10 × 1', cue: 'Sprint 90 feet (baseline distance). 30-45 sec rest. Game-specific repeat sprint ability.' },
          { name: 'Steal Sprint → Walk Recovery', sets: '8 × 1', cue: 'Explosive steal-distance sprint. Walk 30 sec. Repeat. Mimics game stolen base attempts.' },
          { name: 'Position-Specific Defensive Conditioning', sets: '4 rounds', cue: 'Simulate your position\'s movements: ground balls, pop flies, relay throws. 90 sec rest between rounds.' },
        ],
      },
      {
        label: 'Work Capacity',
        moves: [
          { name: 'Med Ball Circuit (3 movements)', sets: '3 rounds × 8 each', cue: 'Slam, rotational throw, scoop toss. Minimal rest between moves.' },
          { name: 'Bodyweight Complex', sets: '3 rounds', cue: '10 push-ups, 10 squats, 10 lunges, 10 mountain climbers. 90 sec rest.' },
          { name: 'Sled Push + Pull Combo', sets: '4 rounds', cue: 'Push 20 yards, pull 20 yards. 90 sec rest. Total body conditioning.' },
          { name: 'Farmer\'s Carry + Sprint', sets: '4 rounds', cue: 'Carry 40 yards, drop weights, sprint 20 yards. Rest 2 min.' },
          { name: 'Jump Rope', sets: '3 × 2 min', cue: 'Light on feet. Mix in double-unders if possible. 60 sec rest.' },
        ],
      },
    ],
  },

  /* ─── 7. ACCESSORY & DURABILITY ─── */
  {
    key: 'Accessory & Durability',
    icon: 'shield-outline',
    color: '#06b6d4',
    desc: 'Prehab, weak-link training, and longevity work. Stay on the field.',
    subCategories: [
      {
        label: 'Prehab & Injury Prevention',
        moves: [
          { name: 'Copenhagen Plank', sets: '3 × 30 sec/side', cue: 'Adductor and core endurance. Top leg on bench. Hip stays high.' },
          { name: 'Nordic Hamstring Curl', sets: '3 × 4-6', cue: 'Eccentric control. Lower as slow as possible. Hands catch at bottom.' },
          { name: 'Terminal Knee Extension (TKE)', sets: '3 × 15/side', cue: 'Band behind knee. Squeeze quad fully straight. VMO fires.' },
          { name: 'Clamshell', sets: '3 × 15/side', cue: 'Side-lying. Knees bent. Open top knee. Feel the glute med.' },
          { name: 'Banded Lateral Walk', sets: '3 × 15/direction', cue: 'Band above knees. Stay low. Hip abductors fire = first-step quickness.' },
          { name: 'Single-Leg Glute Bridge', sets: '3 × 10/side', cue: 'One foot planted. Drive hips up. Squeeze glute at top.' },
        ],
      },
      {
        label: 'Accessory Lifts',
        moves: [
          { name: 'Dumbbell Lateral Raise', sets: '3 × 12', cue: 'Light weight. Control up and down. Slight lean forward.' },
          { name: 'Dumbbell Curl', sets: '3 × 10', cue: 'Full range. No swinging. Controlled negative.' },
          { name: 'Tricep Pushdown', sets: '3 × 12', cue: 'Elbows pinned. Squeeze at full extension. Controlled.' },
          { name: 'Calf Raise (single-leg)', sets: '3 × 15/side', cue: 'Full range. Pause at top. Slow descent.' },
          { name: 'Reverse Fly', sets: '3 × 12', cue: 'Bent over. Light weight. Squeeze rear delts. Shoulder health.' },
          { name: 'Shrugs', sets: '3 × 12', cue: 'Heavy. Elevate straight up. No rolling. 2 sec hold at top.' },
        ],
      },
    ],
  },

  /* ─── 8. RECOVERY ─── */
  {
    key: 'Recovery',
    icon: 'leaf-outline',
    color: '#a3e635',
    desc: 'You grow when you recover. This is not optional.',
    subCategories: [
      {
        label: 'Active Recovery',
        moves: [
          { name: 'Foam Roll Full Body', sets: '5-10 min', cue: 'Quads, IT band, lats, T-spine, calves. 30 sec per area. Breathe.' },
          { name: 'Lacrosse Ball Work (glutes, shoulders)', sets: '3-5 min', cue: 'Find the trigger point. Sit on it. Breathe through it.' },
          { name: 'Light Walk', sets: '15-20 min', cue: 'Easy pace. Active blood flow. Not a workout. Clear the mind.' },
          { name: 'Light Bike', sets: '10-15 min', cue: 'Easy spin. Keep RPE at 3/10. Flush the legs.' },
          { name: 'Yoga Flow / Stretch Circuit', sets: '10-15 min', cue: 'Sun salutation or custom flow. Hit every major joint. Breathe deeply.' },
        ],
      },
      {
        label: 'Passive Recovery',
        moves: [
          { name: 'Cold Plunge / Cold Shower', sets: '2-5 min', cue: '50-60°F. Control the breathing. Reduce inflammation. Build mental toughness.' },
          { name: 'Contrast Therapy (hot/cold)', sets: '3 rounds: 3 min hot / 1 min cold', cue: 'Alternate hot and cold. Flush system. End on cold.' },
          { name: 'Compression Boots', sets: '15-20 min', cue: 'Post-training or game day. Elevate legs. Let the boots do the work.' },
          { name: 'Sleep Protocol', sets: '8-9 hrs nightly', cue: 'No screens 30 min before. Cool room. Dark room. This is #1.' },
          { name: 'Nutrition Window', sets: 'Within 60 min post-training', cue: 'Protein + carbs. Refuel the engine. Do not skip this.' },
          { name: 'Hydration', sets: 'Half bodyweight (oz) daily', cue: 'Minimum. More on training/game days. Add electrolytes.' },
        ],
      },
    ],
  },

  /* ─── 10. ISOMETRIC LIBRARY ─── */
  {
    key: 'Isometrics',
    icon: 'lock-closed-outline',
    color: '#ec4899',
    desc: 'Build tendon stiffness, joint stability, and positional strength. Holds that transfer.',
    subCategories: [
      {
        label: 'Yielding Isometrics',
        moves: [
          { name: 'Split Squat ISO Hold', sets: '3 × 20 sec/side', cue: 'Bottom of split squat. Hold. Build positional strength. Don\'t shake out.' },
          { name: 'Wall Sit', sets: '3 × 30-45 sec', cue: 'Thighs parallel. Back flat on wall. Burn is the point. Quad endurance.' },
          { name: 'Lateral Lunge ISO Hold', sets: '3 × 20 sec/side', cue: 'Hold bottom of lateral lunge. Adductor loaded. Inner thigh stability.' },
          { name: 'SL Hinge ISO Hold', sets: '3 × 20 sec/side', cue: 'Single-leg RDL position. Hold at bottom. Hamstring and glute under tension.' },
          { name: 'RFESS ISO Hold', sets: '3 × 20 sec/side', cue: 'Bottom of rear-foot-elevated split squat. Hold. Quad and hip flexor endurance.' },
          { name: 'Scap Y/T/W Holds', sets: '2 × 15 sec each', cue: 'Prone position. Hold Y, T, then W. Light weight. Scap endurance under load.' },
          { name: 'Dead Hang ISO', sets: '3 × 30-45 sec', cue: 'Hang from bar. Grip endurance. Shoulder decompression. Longer = better.' },
          { name: 'Suitcase Hold', sets: '3 × 30 sec/side', cue: 'Heavy DB at side. Stand tall. Anti-lateral flexion. Core and grip.' },
        ],
      },
      {
        label: 'Overcoming Isometrics',
        moves: [
          { name: 'Deadlift vs Pins', sets: '3 × 6 sec', cue: 'Set pins at sticking point. Pull into pins with max effort. 100% intent for 6 sec.' },
          { name: 'Bench Press vs Pins', sets: '3 × 6 sec', cue: 'Set pins at sticking point. Press into pins with max effort. Build lockout strength.' },
          { name: 'Split Squat vs Immovable', sets: '3 × 6 sec/side', cue: 'Bottom of split squat. Push up into immovable pin/strap. Max effort.' },
          { name: 'Hip Thrust vs Pins', sets: '3 × 6 sec', cue: 'Set pins at top of hip thrust. Drive up with max effort. Glute max activation.' },
          { name: 'Anti-Rotation Max Effort Cable ISO', sets: '3 × 6 sec/side', cue: 'Cable at chest height. Hold against max resistance. Anti-rotation under peak demand.' },
        ],
      },
      {
        label: 'Rotational Isometrics',
        moves: [
          { name: 'Pallof ISO Hold', sets: '3 × 15 sec/side', cue: 'Cable or band. Arms extended. Hold. Don\'t let the cable win. Pure anti-rotation.' },
          { name: 'Split Stance Anti-Rotation Hold', sets: '3 × 15 sec/side', cue: 'Staggered stance. Cable pulls you to rotate. Resist. Athletic position.' },
          { name: 'Suitcase Anti-Lateral Flexion Hold', sets: '3 × 20 sec/side', cue: 'Heavy weight one side. Stand tall. Obliques fire to prevent side bend.' },
          { name: 'Anti-Rotation Cable Hold', sets: '3 × 15 sec/side', cue: 'Cable at various heights. Hold arms extended. Resist rotation. Build trunk stiffness.' },
        ],
      },
      {
        label: 'Tendon & Stiffness',
        moves: [
          { name: 'Pogo Holds', sets: '3 × 10 sec', cue: 'Mid-bounce position. Hold on balls of feet. Ankle stiffness under static demand.' },
          { name: 'Toe Boxer ISO', sets: '3 × 15 sec', cue: 'Up on toes. Hold. Calf and Achilles isometric endurance. Shin to toe tension.' },
          { name: 'Forefoot Stiffness Hold', sets: '3 × 15 sec', cue: 'Stand on forefoot only. Hold. Build the spring in your feet for sprinting.' },
          { name: 'Achilles ISO Hold', sets: '3 × 20 sec/side', cue: 'Single-leg calf raise, hold at top. Achilles tendon loading. Injury prevention.' },
          { name: 'SL Pogo Stiffness Hold', sets: '3 × 10 sec/side', cue: 'Single-leg pogo position. Hold. Ankle and calf stiffness. Advanced tendon work.' },
          { name: 'Quarter-Squat Stiffness ISO', sets: '3 × 15 sec', cue: 'Quarter squat depth. Hold. Builds knee extensor stiffness for sprinting and jumping.' },
        ],
      },
    ],
  },
];
