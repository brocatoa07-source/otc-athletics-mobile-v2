// Mental Vault — pure diagnostic scoring utilities (no side effects, fully testable)

import type { ArchetypeKey, DiagnosticType } from '@/data/mental-diagnostics-data';

// ── Return types ──────────────────────────────────────────────────────────────

export interface ArchetypeResult {
  scores: Record<ArchetypeKey, number>;
  primary: ArchetypeKey;
  secondary: ArchetypeKey | null;
}

export interface IdentityResult {
  ISS: number;              // Identity Stability Score (1–5 scale)
  outcomeAttachment: number; // OA subscore (1–5)
  approvalLoad: number;     // AL subscore (1–5)
  profile: string;          // human-readable profile label
}

export interface HabitsResult {
  HSS: number; // Habit System Score (1–5 scale)
  subscores: {
    daily_foundation: number;
    pregame: number;
    ingame_reset: number;
    postgame: number;
    consistency: number;
  };
  profile: string;
}

export interface MentalProfilePayload {
  primary_archetype: ArchetypeKey;
  secondary_archetype: ArchetypeKey | null;
  archetype_scores: Record<ArchetypeKey, number>;
  identity_profile: string;
  iss: number;
  approval_load: number;
  outcome_attachment: number;
  habit_profile: string;
  hss: number;
  habit_subscores: Record<string, number>;
  primary_focus: string[];
  recommended_tools: string[];
  version: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function mean(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function reverse(value: number): number {
  return 6 - value;
}

// ── Archetype scoring ─────────────────────────────────────────────────────────

export function scoreArchetype(answers: number[]): ArchetypeResult {
  const scores: Record<ArchetypeKey, number> = {
    reactor:     answers[0] + answers[1] + answers[2],
    overthinker: answers[3] + answers[4] + answers[5],
    avoider:     answers[6] + answers[7] + answers[8],
    performer:   answers[9] + answers[10] + answers[11],
    doubter:     answers[12] + answers[13] + answers[14],
    driver:      answers[15] + answers[16] + answers[17],
  };

  // Tie-breaker Q19 (index 18)
  scores.doubter  += answers[18] * 2;
  scores.performer += answers[18] * 1;

  // Tie-breaker Q20 (index 19)
  scores.driver  += answers[19] * 2;
  scores.reactor += answers[19] * 1;

  const sorted = (Object.entries(scores) as [ArchetypeKey, number][]).sort(
    ([, a], [, b]) => b - a
  );
  const primary = sorted[0][0];
  const primaryScore = sorted[0][1];

  const secondaryCandidates = sorted.filter(
    ([key, score]) => key !== primary && primaryScore - score <= 2
  );
  const secondary = secondaryCandidates.length > 0 ? secondaryCandidates[0][0] : null;

  return { scores, primary, secondary };
}

// ── Identity scoring ──────────────────────────────────────────────────────────

export function scoreIdentity(answers: number[]): IdentityResult {
  const q1to5   = answers.slice(0, 5);
  const q6to10  = answers.slice(5, 10);
  const q15to20 = answers.slice(14, 20);

  const issItems = [
    ...q1to5,
    ...q6to10.map(reverse),
    ...q15to20,
  ];

  const ISS = mean(issItems);
  const outcomeAttachment = mean(q6to10);
  const approvalLoad = mean(answers.slice(10, 14));

  let profile: string;
  if (ISS >= 4.3)      profile = 'Elite Competitor Identity';
  else if (ISS >= 3.7) profile = 'Stable Competitor Identity';
  else if (ISS >= 3.0) profile = 'Developing Identity';
  else                 profile = 'Fragile Identity';

  return { ISS, outcomeAttachment, approvalLoad, profile };
}

// ── Habits scoring ────────────────────────────────────────────────────────────

export function scoreHabits(answers: number[]): HabitsResult {
  const HSS = mean(answers);

  const subscores = {
    daily_foundation: mean(answers.slice(0, 5)),
    pregame:          mean(answers.slice(5, 9)),
    ingame_reset:     mean(answers.slice(9, 14)),
    postgame:         mean(answers.slice(14, 18)),
    consistency:      mean(answers.slice(18, 20)),
  };

  let profile: string;
  if (HSS >= 4.3)      profile = 'Elite System';
  else if (HSS >= 3.7) profile = 'Structured System';
  else if (HSS >= 3.0) profile = 'Inconsistent System';
  else                 profile = 'Reactive System';

  return { HSS, subscores, profile };
}

// ── Mental profile generation ─────────────────────────────────────────────────

const ARCHETYPE_FOCUS: Record<ArchetypeKey, string[]> = {
  reactor:     ['Emotional reset + body language mastery', 'Between-play recovery routine'],
  overthinker: ['Self-talk simplification', 'Between-pitch reset routine'],
  avoider:     ['Attack mindset + commitment cues', 'Go-mode triggers'],
  performer:   ['Detach from approval + process anchors', 'Inner compass focus'],
  doubter:     ['Evidence building + confidence bank', 'Self-trust activation'],
  driver:      ['Recovery boundaries + sustainable intensity', 'Rest permission practice'],
};

const ARCHETYPE_TOOLS: Record<ArchetypeKey, string[]> = {
  reactor:     ['Body language reset card', 'Emotional reset protocol', '10-Step In-Game Reset'],
  overthinker: ['10-Step In-Game Reset', 'Breathing protocol', 'Dugout Card (simplified cues)'],
  avoider:     ['Attack mindset journal', 'Commitment pre-pitch ritual', 'Dugout Card'],
  performer:   ['Process focus card', 'Dugout Card', 'Awareness course'],
  doubter:     ['Confidence bank log', 'Evidence journal', 'Self-talk script'],
  driver:      ['Recovery plan', 'Balance journal', 'Rest protocol card'],
};

export function generateFocusAndTools(
  archetype: ArchetypeResult,
  identity: IdentityResult,
  habits: HabitsResult
): { focus: string[]; tools: string[] } {
  const focus = [...ARCHETYPE_FOCUS[archetype.primary]];
  const tools = [...ARCHETYPE_TOOLS[archetype.primary]];

  const fragileMind =
    identity.profile === 'Fragile Identity' || identity.outcomeAttachment > 3.5;
  if (fragileMind) {
    focus.push('Identity evidence log');
    tools.push('Identity anchor card');
  }

  if (identity.approvalLoad > 3.5) {
    focus.push('Inner validation system');
    tools.push('Approval-free process journal');
  }

  const weakHabits =
    habits.profile === 'Reactive System' || habits.profile === 'Inconsistent System';
  if (weakHabits) {
    focus.push('Daily habit tracker', 'Routine builder');
    tools.push('Daily mental reset journal', 'Pre-game checklist');
  }

  return {
    focus: [...new Set(focus)],
    tools: [...new Set(tools)],
  };
}

export function buildMentalProfilePayload(
  archetype: ArchetypeResult,
  identity: IdentityResult,
  habits: HabitsResult
): Omit<MentalProfilePayload, never> {
  const { focus, tools } = generateFocusAndTools(archetype, identity, habits);
  return {
    primary_archetype:   archetype.primary,
    secondary_archetype: archetype.secondary,
    archetype_scores:    archetype.scores,
    identity_profile:    identity.profile,
    iss:                 identity.ISS,
    approval_load:       identity.approvalLoad,
    outcome_attachment:  identity.outcomeAttachment,
    habit_profile:       habits.profile,
    hss:                 habits.HSS,
    habit_subscores:     habits.subscores,
    primary_focus:       focus,
    recommended_tools:   tools,
    version:             1,
  };
}

// ── Scoring dispatcher ────────────────────────────────────────────────────────

export function scoreByType(
  type: DiagnosticType,
  answers: number[]
): ArchetypeResult | IdentityResult | HabitsResult {
  if (type === 'archetype') return scoreArchetype(answers);
  if (type === 'identity')  return scoreIdentity(answers);
  return scoreHabits(answers);
}
