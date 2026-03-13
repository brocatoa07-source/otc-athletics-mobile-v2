/* ────────────────────────────────────────────────
 * MENTAL TOOL METADATA CATALOG
 *
 * Lightweight metadata for ranking tools in the
 * recommendation engine. Does NOT duplicate vault
 * tool card content (fixes, howTo, focus).
 *
 * Every tool referenced by MENTAL_QUICK_FIXES
 * should have an entry here.
 * ──────────────────────────────────────────────── */

import type { MentalProfile } from './mental-profile-data';

export type MentalToolRole = 'primary' | 'support' | 'reset' | 'reflection';

export interface MentalToolMeta {
  name: string;
  /** Quick fix categories this tool belongs to */
  issues: string[];
  /** Mental profiles this tool aligns with. Empty = no bias. */
  profileAffinity: MentalProfile[];
  /** What role(s) this tool can serve in a recommendation stack */
  roles: MentalToolRole[];
}

/* ─── Quick Fix Definitions ─────────────────────────────── */

export interface MentalQuickFix {
  key: string;
  label: string;
  tools: string[];
}

export const MENTAL_QUICK_FIXES: Record<string, MentalQuickFix> = {
  overthinking: {
    key: 'overthinking',
    label: 'Overthinking',
    tools: ['Spotlight Drill', 'Anchor Breathing', 'Cue Word Setup'],
  },
  'pregame-nerves': {
    key: 'pregame-nerves',
    label: 'Pre-Game Nerves',
    tools: ['Arrival Reset', 'Visualization Protocol', 'Body Activation'],
  },
  'confidence-drop': {
    key: 'confidence-drop',
    label: 'Confidence Drop',
    tools: ['Proof Stacking', 'Power Statement', 'Owned vs Rented Check'],
  },
  'emotional-frustration': {
    key: 'emotional-frustration',
    label: 'Emotional Frustration',
    tools: ['Body Release Scan', 'Anger-to-Energy Conversion', 'Between-Pitch Reset'],
  },
  'focus-loss': {
    key: 'focus-loss',
    label: 'Focus Loss',
    tools: ['Pitch-to-Pitch Reset', 'Spotlight Drill', 'Focus Countdown'],
  },
  'fear-of-failure': {
    key: 'fear-of-failure',
    label: 'Fear of Failure',
    tools: ['Failure Reframe', 'Pressure Flip', 'Bounce-Back Protocol'],
  },
  burnout: {
    key: 'burnout',
    label: 'Burnout',
    tools: ['Gratitude Moment', 'Compete Commitment', 'Win/Learn Journal'],
  },
  'imposter-syndrome': {
    key: 'imposter-syndrome',
    label: 'Imposter Syndrome',
    tools: ['Proof Stacking', 'Ownership Statement', 'Standard Check'],
  },
};

/* ─── Struggle → Quick Fix mapping ─────────────────────── */

import type { MentalStruggle } from './mental-struggles-data';

export const STRUGGLE_TO_QUICKFIX: Record<MentalStruggle, string> = {
  overthinking: 'overthinking',
  pregame_nerves: 'pregame-nerves',
  confidence_drop: 'confidence-drop',
  emotional_frustration: 'emotional-frustration',
  focus_loss: 'focus-loss',
  fear_of_failure: 'fear-of-failure',
  burnout: 'burnout',
  imposter_syndrome: 'imposter-syndrome',
};

const STRUGGLE_SECONDARY_QUICKFIX: Partial<Record<MentalStruggle, string>> = {
  overthinking: 'focus-loss',
  pregame_nerves: 'confidence-drop',
  confidence_drop: 'fear-of-failure',
  emotional_frustration: 'focus-loss',
  focus_loss: 'overthinking',
  fear_of_failure: 'confidence-drop',
  burnout: 'imposter-syndrome',
  imposter_syndrome: 'confidence-drop',
};

export { STRUGGLE_SECONDARY_QUICKFIX };

/* ─── Quick Fix → Focus Area (vault section label) ─────── */

export const QUICKFIX_TO_MENTAL_FOCUS: Record<string, string[]> = {
  overthinking: ['Focus', 'Awareness'],
  'pregame-nerves': ['Pre-Game Routine', 'Emotional Control'],
  'confidence-drop': ['Confidence', 'Resilience'],
  'emotional-frustration': ['Emotional Control', 'In-Game Reset'],
  'focus-loss': ['Focus', 'In-Game Reset'],
  'fear-of-failure': ['Confidence', 'Resilience'],
  burnout: ['Awareness', 'Post-Game Reflection'],
  'imposter-syndrome': ['Confidence', 'Accountability'],
};

/* ─── Catalog ─────────────────────────────────────── */

export const MENTAL_TOOL_CATALOG: MentalToolMeta[] = [
  // ── overthinking pool ─────────────────────────────
  {
    name: 'Spotlight Drill',
    issues: ['overthinking', 'focus-loss'],
    profileAffinity: ['analyzer'],
    roles: ['primary'],
  },
  {
    name: 'Anchor Breathing',
    issues: ['overthinking', 'pregame-nerves'],
    profileAffinity: ['analyzer', 'emotionally_reactive'],
    roles: ['primary', 'support'],
  },
  {
    name: 'Cue Word Setup',
    issues: ['overthinking'],
    profileAffinity: ['analyzer', 'steady_performer'],
    roles: ['primary'],
  },

  // ── pregame-nerves pool ───────────────────────────
  {
    name: 'Arrival Reset',
    issues: ['pregame-nerves'],
    profileAffinity: ['emotionally_reactive'],
    roles: ['primary'],
  },
  {
    name: 'Visualization Protocol',
    issues: ['pregame-nerves', 'fear-of-failure'],
    profileAffinity: ['analyzer', 'steady_performer'],
    roles: ['primary'],
  },
  {
    name: 'Body Activation',
    issues: ['pregame-nerves'],
    profileAffinity: ['competitor'],
    roles: ['primary', 'support'],
  },

  // ── confidence-drop pool ──────────────────────────
  {
    name: 'Proof Stacking',
    issues: ['confidence-drop', 'imposter-syndrome'],
    profileAffinity: ['emotionally_reactive', 'analyzer'],
    roles: ['primary'],
  },
  {
    name: 'Power Statement',
    issues: ['confidence-drop'],
    profileAffinity: ['competitor'],
    roles: ['primary'],
  },
  {
    name: 'Owned vs Rented Check',
    issues: ['confidence-drop'],
    profileAffinity: ['analyzer'],
    roles: ['primary', 'support'],
  },

  // ── emotional-frustration pool ────────────────────
  {
    name: 'Body Release Scan',
    issues: ['emotional-frustration'],
    profileAffinity: ['emotionally_reactive'],
    roles: ['primary'],
  },
  {
    name: 'Anger-to-Energy Conversion',
    issues: ['emotional-frustration'],
    profileAffinity: ['competitor'],
    roles: ['primary'],
  },
  {
    name: 'Between-Pitch Reset',
    issues: ['emotional-frustration', 'focus-loss'],
    profileAffinity: ['emotionally_reactive', 'competitor'],
    roles: ['primary', 'support'],
  },

  // ── focus-loss pool ───────────────────────────────
  {
    name: 'Pitch-to-Pitch Reset',
    issues: ['focus-loss'],
    profileAffinity: ['steady_performer'],
    roles: ['primary'],
  },
  {
    name: 'Focus Countdown',
    issues: ['focus-loss'],
    profileAffinity: ['competitor'],
    roles: ['primary', 'support'],
  },

  // ── fear-of-failure pool ──────────────────────────
  {
    name: 'Failure Reframe',
    issues: ['fear-of-failure'],
    profileAffinity: ['analyzer'],
    roles: ['primary'],
  },
  {
    name: 'Pressure Flip',
    issues: ['fear-of-failure', 'pregame-nerves'],
    profileAffinity: ['competitor', 'emotionally_reactive'],
    roles: ['primary'],
  },
  {
    name: 'Bounce-Back Protocol',
    issues: ['fear-of-failure', 'burnout'],
    profileAffinity: ['competitor', 'steady_performer'],
    roles: ['primary', 'support'],
  },

  // ── burnout pool ──────────────────────────────────
  {
    name: 'Gratitude Moment',
    issues: ['burnout'],
    profileAffinity: ['steady_performer'],
    roles: ['primary'],
  },
  {
    name: 'Compete Commitment',
    issues: ['burnout'],
    profileAffinity: ['competitor'],
    roles: ['primary'],
  },
  {
    name: 'Win/Learn Journal',
    issues: ['burnout'],
    profileAffinity: ['analyzer', 'steady_performer'],
    roles: ['primary', 'support'],
  },

  // ── imposter-syndrome pool ────────────────────────
  {
    name: 'Ownership Statement',
    issues: ['imposter-syndrome'],
    profileAffinity: ['competitor'],
    roles: ['primary'],
  },
  {
    name: 'Standard Check',
    issues: ['imposter-syndrome'],
    profileAffinity: ['steady_performer'],
    roles: ['primary', 'support'],
  },

  // ── reflection tools ─────────────────────────────
  {
    name: 'Thought Logging',
    issues: ['overthinking', 'emotional-frustration'],
    profileAffinity: ['analyzer'],
    roles: ['reflection'],
  },
  {
    name: 'Emotion Naming',
    issues: ['emotional-frustration', 'pregame-nerves'],
    profileAffinity: ['emotionally_reactive'],
    roles: ['reflection'],
  },
  {
    name: 'Next-Day Intent',
    issues: ['burnout', 'focus-loss'],
    profileAffinity: ['steady_performer'],
    roles: ['reflection'],
  },
];

/* ─── Lookup index (built once at import time) ───── */

const _byName = new Map<string, MentalToolMeta>();
for (const t of MENTAL_TOOL_CATALOG) {
  _byName.set(t.name, t);
}

/** Get tool metadata by name. Returns undefined if not cataloged. */
export function getMentalToolMeta(name: string): MentalToolMeta | undefined {
  return _byName.get(name);
}

/** Get all tools that can serve as reflection tools. */
export function getReflectionTools(): MentalToolMeta[] {
  return MENTAL_TOOL_CATALOG.filter((t) => t.roles.includes('reflection'));
}

/** Get all tools tagged for a specific issue. */
export function getMentalToolsForIssue(issueKey: string): MentalToolMeta[] {
  return MENTAL_TOOL_CATALOG.filter((t) => t.issues.includes(issueKey));
}
