import type { OtcsMonthTemplate } from './otcs-types';

const month: OtcsMonthTemplate = {
  monthNumber: 4,
  archetype: 'hybrid',
  phase: 'max-force',
  title: 'Max Force',
  subtitle: 'Peak Force Production + Balanced Power + Rotational Torque',
  color: '#ef4444',
  icon: 'flame-outline',
  volumeLevel: 'high',
  intensityLevel: 'high',
  keyFocus: [
    'Max Strength',
    'Balanced Power',
    'Rotational Torque',
    'Contrast Training',
    'Sprint Power',
  ],
  days: [
    {
      key: 'lower-accel',
      dayNumber: 1,
      label: 'Lower + Accel',
      accent: '#22c55e',
      focus: 'Lower Max Strength + Contrast Training',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'Depth Jump', sets: '3×3', cue: 'Step off and explode up — minimize ground contact time' },
            { name: 'Hurdle Hops (Reactive)', sets: '3×5', cue: 'Bounce off the ground between each hurdle — stay stiff through the ankle' },
            { name: 'Lateral Bound', sets: '2×4/side', cue: 'Push hard off the outside foot — stick the landing on the opposite leg' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'Hang Clean (Heavy)', sets: '3×3', cue: 'Violent hip extension — pull yourself under the bar and catch clean', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'Back Squat (Heavy)', sets: '3×4', cue: 'Brace hard and drive through the floor — own every rep', scalesWithWeek: true },
            { name: 'Box Jump', sets: '3×3', cue: 'Contrast — explode onto the box immediately after squats' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'Heavy RDL', sets: '3×5', cue: 'Load the hamstrings on the way down — drive the hips through at the top', scalesWithWeek: true },
            { name: 'Walking Lunge (Heavy)', sets: '3×6/side', cue: 'Big steps — control the descent and drive up powerfully' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Leg Press', sets: '3×8', cue: 'Full range of motion — drive through the heels' },
            { name: 'Nordic Curl', sets: '2×6', cue: 'Control the eccentric as long as possible — fight gravity' },
            { name: 'Hip Thrust', sets: '3×8', cue: 'Squeeze the glutes hard at the top — full lockout' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Med Ball Rotational Shot Put', sets: '3×5/side', cue: 'Drive from the back hip — release with max intent' },
            { name: 'Anti-Rotation Hold', sets: '2×15s/side', cue: 'Lock the hips square — resist the cable pull through the core' },
          ],
        },
        {
          key: 'shoulder-durability',
          exercises: [
            { name: 'Band Pull-Aparts', sets: '2×15', cue: 'Squeeze the shoulder blades — hold the end range' },
            { name: 'Prone ER', sets: '2×10/side', cue: 'Elbow on the bench — slow rotation back, control the weight' },
          ],
        },
      ],
    },
    {
      key: 'upper-shoulder',
      dayNumber: 2,
      label: 'Upper + Shoulder',
      accent: '#3b82f6',
      focus: 'Upper Max Strength + Balanced Push/Pull',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'Plyo Push-Up (Reactive)', sets: '3×5', cue: 'Explode off the ground — snap the hands up and land soft' },
            { name: 'MB Overhead Slam', sets: '2×6', cue: 'Full extension overhead — slam the ball into the ground with max intent' },
            { name: 'MB Chest Pass (Heavy Ball)', sets: '3×5', cue: 'Punch through the ball — generate force from the chest and shoulders' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'Push Jerk', sets: '3×3', cue: 'Quick dip and explosive drive — lock out overhead with speed', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'Barbell Bench (Heavy)', sets: '3×4', cue: 'Tight arch and leg drive — press with max force off the chest', scalesWithWeek: true },
            { name: 'Plyo Push-Up', sets: '3×4', cue: 'Contrast — explosive push-ups immediately after bench' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'Weighted Chin-Up', sets: '3×5', cue: 'Pull the chest to the bar — control the descent' },
            { name: 'Incline DB Press (Heavy)', sets: '3×6', cue: 'Drive the dumbbells up and together — full range of motion' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Cable ER', sets: '2×12/side', cue: 'Elbow pinned — slow external rotation against the cable' },
            { name: 'Lat Pulldown (Heavy)', sets: '2×8', cue: 'Pull to the upper chest — squeeze the lats hard at the bottom' },
            { name: 'Cable Face Pull', sets: '2×12', cue: 'Pull to the forehead — externally rotate at the end' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Cable Woodchop (Heavy)', sets: '2×6/side', cue: 'Drive from the hips — rotate with power through the core' },
            { name: 'Hanging Leg Raise', sets: '2×10', cue: 'Control the swing — lift the legs with the abs, not momentum' },
          ],
        },
        {
          key: 'shoulder-durability',
          exercises: [
            { name: 'Cuban Rotation', sets: '2×8', cue: 'Upright row to external rotation to press — smooth and controlled' },
            { name: 'KB Bottoms-Up Hold', sets: '2×20s/side', cue: 'Grip hard — keep the KB balanced and shoulder packed' },
          ],
        },
      ],
    },
    {
      key: 'full-power',
      dayNumber: 3,
      label: 'Full Body Power',
      accent: '#ef4444',
      focus: 'Total Body Force + Power Expression',
      type: 'lift',
      blocks: [
        {
          key: 'plyometrics',
          exercises: [
            { name: 'Box Jump (Max)', sets: '3×3', cue: 'Swing and explode — land soft on top of the box' },
            { name: 'Lateral Depth Jump', sets: '2×3/side', cue: 'Step off laterally and explode up — reactive and fast' },
            { name: 'Tuck Jump', sets: '2×5', cue: 'Knees to chest at the peak — land soft and reload fast' },
          ],
        },
        {
          key: 'loaded-power',
          exercises: [
            { name: 'Power Clean', sets: '3×3', cue: 'Rip from the floor — catch with fast elbows and absorb', scalesWithWeek: true },
          ],
        },
        {
          key: 'main-strength',
          exercises: [
            { name: 'Trap Bar DL (Heavy)', sets: '3×4', cue: 'Drive the floor away — lock out with full hip extension', scalesWithWeek: true },
            { name: 'Broad Jump', sets: '3×3', cue: 'Contrast — max distance jump immediately after deadlift' },
          ],
        },
        {
          key: 'antagonist',
          exercises: [
            { name: 'Front Squat (Heavy)', sets: '3×5', cue: 'Elbows high and brace — drive up through the whole foot' },
            { name: 'Glute-Ham Raise', sets: '3×6', cue: 'Control the eccentric — use the hamstrings to pull back up' },
          ],
        },
        {
          key: 'accessory-circuit',
          exercises: [
            { name: 'Leg Curl', sets: '2×12', cue: 'Squeeze at the top — slow eccentric on the way down' },
            { name: 'Calf Raise', sets: '2×15', cue: 'Full range — pause at the top and stretch at the bottom' },
            { name: 'Adductor Machine', sets: '2×12', cue: 'Squeeze through the full range — control the release' },
          ],
        },
        {
          key: 'rotational-core',
          exercises: [
            { name: 'Overhead Carry (Heavy)', sets: '2×30yd', cue: 'Lock the arms overhead — walk tall and brace hard' },
            { name: 'Landmine Rotation (Heavy)', sets: '2×6/side', cue: 'Pivot the feet — rotate with power from the hips' },
          ],
        },
        {
          key: 'shoulder-durability',
          exercises: [
            { name: 'Prone Y Raise', sets: '2×10', cue: 'Thumbs up — lift from the lower traps, not the upper' },
            { name: 'Band W Raises', sets: '2×12', cue: 'Elbows at 90° — squeeze the shoulder blades together' },
          ],
        },
      ],
    },
    {
      key: 'sprint-1',
      dayNumber: 4,
      label: 'Sprint Day 1',
      accent: '#f59e0b',
      focus: 'Resisted Speed + Max Acceleration',
      type: 'sprint',
      blocks: [
        {
          key: 'sprint-warmup',
          exercises: [
            { name: 'A-Skip', sets: '2×20yd', cue: 'Drive the knee — quick ground contact' },
            { name: 'Straight-Leg Bound', sets: '2×20yd', cue: 'Stiff legs — push through the ground with each bound' },
            { name: 'Build-Up Stride', sets: '2×40yd', cue: 'Gradually accelerate — reach near-top speed by the end' },
          ],
        },
        {
          key: 'sprint-drills',
          exercises: [
            { name: 'Heavy Sled March', sets: '3×10yd', cue: 'Drive the knees — lean into the sled and push hard' },
            { name: 'Sled Sprint', sets: '3×15yd', cue: 'Maintain the lean — sprint through the resistance' },
            { name: '3-Point Start', sets: '3×2', cue: 'Explode from the stance — low and powerful first steps' },
          ],
        },
        {
          key: 'sprint-work',
          exercises: [
            { name: 'Resisted Sprint (Sled)', sets: '4×20yd', cue: 'Stay low and drive — fight the resistance every step' },
            { name: '10yd Fly Sprint', sets: '3×1', cue: 'Build up then hit the 10yd zone at max speed' },
            { name: '30yd Build-Up', sets: '3×1', cue: 'Smooth acceleration — reach full speed by the end' },
          ],
        },
        {
          key: 'sprint-cooldown',
          exercises: [
            { name: 'Hip Flexor Stretch', sets: '2×30s/side', cue: 'Squeeze the glute — push the hip forward' },
            { name: 'Hamstring Stretch', sets: '2×30s/side', cue: 'Straight leg — hinge at the hip and feel the pull' },
            { name: 'Foam Roll', sets: '3min', cue: 'Hit quads, hamstrings, and calves — slow passes' },
          ],
        },
      ],
    },
    {
      key: 'sprint-2',
      dayNumber: 5,
      label: 'Sprint Day 2',
      accent: '#8b5cf6',
      focus: 'Max Velocity + Agility',
      type: 'sprint',
      blocks: [
        {
          key: 'sprint-warmup',
          exercises: [
            { name: 'A-Run', sets: '2×20yd', cue: 'Continuous A-skip rhythm — fast and fluid' },
            { name: 'Carioca', sets: '2×20yd', cue: 'Rotate the hips — stay light on the feet' },
            { name: 'Build-Up Stride', sets: '2×50yd', cue: 'Smooth acceleration — reach near-top speed by the end' },
          ],
        },
        {
          key: 'sprint-drills',
          exercises: [
            { name: 'Wicket Run', sets: '3×30yd', cue: 'Hit each wicket — focus on stride length and turnover' },
            { name: 'In-Out Sprint', sets: '3×40yd', cue: 'Accelerate in the zone, float out — feel the speed difference' },
          ],
        },
        {
          key: 'sprint-work',
          exercises: [
            { name: 'Flying 20yd', sets: '4×1', cue: 'Build up then hit the zone at absolute max speed' },
            { name: 'Flying 30yd', sets: '3×1', cue: 'Longer fly zone — maintain top speed through the full 30' },
            { name: 'Pro Agility', sets: '3×1', cue: 'Low hips on each turn — explode out of every cut' },
          ],
        },
        {
          key: 'sprint-cooldown',
          exercises: [
            { name: 'Pigeon Stretch', sets: '2×30s/side', cue: 'Sink into the hip — relax and breathe' },
            { name: '90/90 Breathing', sets: '2×60s', cue: 'Inhale through the nose, exhale slow — full recovery' },
            { name: 'Foam Roll', sets: '3min', cue: 'Hit quads, hamstrings, and calves — slow passes' },
          ],
        },
      ],
    },
  ],
};

export default month;
