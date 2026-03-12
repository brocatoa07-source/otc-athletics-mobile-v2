import { Ionicons } from '@expo/vector-icons';

/* ────────────────────────────────────────────────────
 * KARTERIA PERIODIZED TRAINING SYSTEM — Types
 * 6 months × 5 days × 8 blocks per day
 * ──────────────────────────────────────────────────── */

export type MoverType = 'static' | 'spring' | 'hybrid';

export type KarteriaBlockKey =
  | 'prep'
  | 'plyo'
  | 'loaded-power'
  | 'main-lift'
  | 'secondary'
  | 'accessories'
  | 'core'
  | 'finisher';

export type KarteriaDayKey = 'upper-a' | 'lower-a' | 'ar' | 'upper-b' | 'lower-b';

export interface KarteriaExercise {
  name: string;
  sets: string;
  cue: string;
  videoUrl?: string;
  rest?: string;
}

export interface KarteriaBlock {
  key: KarteriaBlockKey;
  exercises: KarteriaExercise[];
  defaultRest?: string;
}

export interface KarteriaDay {
  key: KarteriaDayKey;
  dayNumber: number;
  label: string;
  accent: string;
  focus: string;
  blocks: KarteriaBlock[];
}

export interface KarteriaMonth {
  monthNumber: number;
  title: string;
  subtitle: string;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
  volumeLevel: 'low' | 'moderate' | 'high';
  intensityLevel: 'low' | 'moderate' | 'high';
  keyFocus: string[];
  days: KarteriaDay[];
}

export interface MoverSubstitution {
  monthNumber: number;
  dayKey: KarteriaDayKey;
  blockKey: KarteriaBlockKey;
  exerciseIndex: number;
  moverType: MoverType;
  altName: string;
  altSets?: string;
  note: string;
}

export interface KarteriaProgram {
  name: string;
  totalMonths: number;
  daysPerWeek: number;
  months: KarteriaMonth[];
}

/* ── Block Metadata ── */

export interface KarteriaBlockMeta {
  key: KarteriaBlockKey;
  label: string;
  tagline: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

export const KARTERIA_BLOCKS: KarteriaBlockMeta[] = [
  { key: 'prep',         label: 'Prep Block',         tagline: 'Soft Tissue + Mobility + Elastic Prep', icon: 'body-outline',    color: '#22c55e' },
  { key: 'plyo',         label: 'Plyo Block',         tagline: 'CNS Primer + Plyometrics',              icon: 'flash-outline',   color: '#f59e0b' },
  { key: 'loaded-power', label: 'Loaded Power',       tagline: 'Explosive loaded movements',        icon: 'rocket-outline',  color: '#ef4444' },
  { key: 'main-lift',    label: 'Main Lift Superset', tagline: 'Primary strength work',             icon: 'barbell-outline', color: '#3b82f6' },
  { key: 'secondary',    label: 'Secondary Lifts',    tagline: 'Supporting compounds',              icon: 'barbell-outline', color: '#8b5cf6' },
  { key: 'accessories',  label: 'Accessories',        tagline: 'Isolation + weak points',           icon: 'shield-outline',  color: '#06b6d4' },
  { key: 'core',         label: 'Core',               tagline: 'Anti-rotation + stability',         icon: 'fitness-outline', color: '#f97316' },
  { key: 'finisher',     label: 'Finisher',           tagline: 'Conditioning + baseball transfer',  icon: 'flame-outline',   color: '#e11d48' },
];

export const KARTERIA_DAY_CONFIG: { key: KarteriaDayKey; label: string; accent: string }[] = [
  { key: 'upper-a', label: 'Upper A', accent: '#ef4444' },
  { key: 'lower-a', label: 'Lower A', accent: '#22c55e' },
  { key: 'ar',      label: 'AR Day',  accent: '#3b82f6' },
  { key: 'upper-b', label: 'Upper B', accent: '#f97316' },
  { key: 'lower-b', label: 'Lower B', accent: '#eab308' },
];
