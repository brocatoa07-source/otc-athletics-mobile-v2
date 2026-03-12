import { Ionicons } from '@expo/vector-icons';
import type { LiftingSection } from '@/types/database';

/* ════════════════════════════════════════════════════════
   LIFTING PROGRAM SECTIONS
   Maps to the 8-block training structure from session-blocks.ts
   ════════════════════════════════════════════════════════ */

export interface SectionMeta {
  key: LiftingSection;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

export const LIFTING_SECTIONS: SectionMeta[] = [
  { key: 'mobility',     label: 'Mobility',          icon: 'body-outline',    color: '#22c55e' },
  { key: 'strength',     label: 'Strength',          icon: 'barbell-outline', color: '#3b82f6' },
  { key: 'explosive',    label: 'Explosive / Power', icon: 'flash-outline',   color: '#f59e0b' },
  { key: 'conditioning', label: 'Conditioning',      icon: 'heart-outline',   color: '#ef4444' },
  { key: 'cooldown',     label: 'Cool Down',         icon: 'leaf-outline',    color: '#8b5cf6' },
];

/* ── Exercise pools per section (from session-blocks.ts) ── */
export const SECTION_EXERCISES: Record<LiftingSection, string[]> = {
  mobility: [
    'Foam Roll Full Body',
    'Lacrosse Ball — Glutes',
    'Lacrosse Ball — Shoulders',
    'Foam Roll T-Spine Extension',
    'Prone Press-Up (McKenzie)',
    'Hip 90/90 Stretch',
    '90/90 Hip Transitions',
    'Half Kneeling Hip Flexor Stretch',
    'Thoracic Rotation on Floor',
    'Cat-Cow',
    'Wall Ankle Dorsiflexion',
    'Inchworm Walk-Out',
    'Shoulder CARs',
    'Adductor Rock-Back',
    'Dead Bug',
    "World's Greatest Stretch",
    'Leg Swings (front-back + lateral)',
    'Glute Bridge (activation)',
  ],
  strength: [
    'Trap Bar Deadlift',
    'Barbell Back Squat',
    'Front Squat',
    'Goblet Squat',
    'Barbell Bench Press',
    'Incline Dumbbell Press',
    'Pull-Ups / Chin-Ups',
    'Overhead Press',
    'Bulgarian Split Squat',
    'Romanian Deadlift (RDL)',
    'Dumbbell Row',
    'Hip Thrust',
    'Walking Lunge',
    'Single-Leg RDL',
    'Lat Pulldown',
    'Barbell Row',
    'Dumbbell Bench Press',
    'Close-Grip Bench Press',
    'Leg Press',
    'Step-Ups',
  ],
  explosive: [
    'Rotational Med Ball Throw',
    'Overhead Med Ball Slam',
    'Scoop Toss (forward)',
    'Box Jump',
    'Broad Jump',
    'Lateral Bound',
    'Tuck Jump',
    'Depth Jump',
    'Single-Leg Hop',
    'Medicine Ball Chest Pass',
    'Hurdle Hops',
    'Power Clean',
    'Hang Clean',
    'Push Press',
  ],
  conditioning: [
    'Sled Push',
    'Sled Pull',
    'Bike Intervals',
    'Battle Ropes',
    'Shuttle Run',
    'Jump Rope Intervals',
    'Rowing Intervals',
    'Prowler Sprint',
    'Tempo Runs',
    'Hill Sprints',
    'Face Pulls',
    'Band Pull-Aparts',
    'Cable Woodchop',
    'Pallof Press',
    "Farmer's Carry",
    'Suitcase Carry',
    'Lateral Raises',
  ],
  cooldown: [
    'Static Stretch — Hamstrings',
    'Static Stretch — Hip Flexors',
    'Static Stretch — Quads',
    'Static Stretch — Shoulders',
    "Child's Pose",
    'Pigeon Stretch',
    'Seated Figure-4 Stretch',
    'Diaphragmatic Breathing',
    'Box Breathing (4-4-4-4)',
    'Supine Spinal Twist',
  ],
};
