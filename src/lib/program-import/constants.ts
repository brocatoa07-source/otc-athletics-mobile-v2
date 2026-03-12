// Fixed category orderings by day_type

export const STRENGTH_CATEGORIES = [
  'Prep',
  'Plyo',
  'Loaded Power',
  'Main Superset',
  'Secondary Lifts',
  'Accessories',
  'Core',
  'Finisher',
] as const;

export const ACTIVE_RECOVERY_CATEGORIES = [
  'Prep & Mobility',
  'Isometrics',
  'Full Body Circuit',
  'Elasticity',
  'Sprint Mechanics',
] as const;

export type StrengthCategory = (typeof STRENGTH_CATEGORIES)[number];
export type ActiveRecoveryCategory = (typeof ACTIVE_RECOVERY_CATEGORIES)[number];

// Normalized lookup: lowercase → canonical name
export const STRENGTH_CATEGORY_MAP = new Map<string, StrengthCategory>(
  STRENGTH_CATEGORIES.map((c) => [c.toLowerCase(), c]),
);

export const AR_CATEGORY_MAP = new Map<string, ActiveRecoveryCategory>(
  ACTIVE_RECOVERY_CATEGORIES.map((c) => [c.toLowerCase(), c]),
);

// Category → sort index
export const STRENGTH_CATEGORY_ORDER = new Map<string, number>(
  STRENGTH_CATEGORIES.map((c, i) => [c.toLowerCase(), i]),
);

export const AR_CATEGORY_ORDER = new Map<string, number>(
  ACTIVE_RECOVERY_CATEGORIES.map((c, i) => [c.toLowerCase(), i]),
);

export const MAX_DAYS_PER_WEEK = 5;

export const REQUIRED_COLUMNS = [
  'program_title',
  'week',
  'day_label',
  'day_type',
  'category',
  'order',
  'exercise',
  'sets',
  'reps',
] as const;
