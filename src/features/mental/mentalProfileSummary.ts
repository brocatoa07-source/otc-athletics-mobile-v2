/**
 * Mental Profile Summary — synthesizes archetype + identity + habits
 * into a unified, coach-interpreted athlete profile.
 *
 * Input:  MentalProfile from Supabase (all 3 diagnostics completed)
 * Output: ProfileSummary with strengths, watch-outs, priorities,
 *         recommendations for tools, journals, meditations, and course week.
 */

import { ARCHETYPE_INFO, type ArchetypeKey } from '@/data/mental-diagnostics-data';
import type { MentalProfile } from '@/types/database';

// ── Output types ─────────────────────────────────────────────────────────────

export interface ProfileSummary {
  /** One-line headline: "The Reactor with a Developing Identity" */
  headline: string;
  /** 2-3 sentence coach interpretation */
  coachRead: string;
  /** Top 3 strengths (drawn from archetype + identity + habits) */
  strengths: string[];
  /** Top 3 watch-outs */
  watchOuts: string[];
  /** 2-3 development priorities with explanations */
  priorities: DevelopmentPriority[];
  /** Recommended next actions */
  nextActions: NextAction[];
  /** Recommended toolbox categories (by title) */
  toolboxCategories: string[];
  /** Recommended journal type */
  recommendedJournal: { name: string; key: string; reason: string };
  /** Recommended guided meditation */
  recommendedMeditation: { name: string; key: string; reason: string };
  /** Recommended Mental Mastery course starting week */
  courseRecommendation: { weekId: string; weekNum: number; skillName: string; reason: string };
  /** Raw scores for display */
  scores: {
    archetype: { primary: string; secondary: string | null; primaryKey: ArchetypeKey };
    identity: { profile: string; iss: number; outcomeAttachment: number; approvalLoad: number };
    habits: { profile: string; hss: number; weakestArea: string; strongestArea: string };
  };
}

export interface DevelopmentPriority {
  label: string;
  why: string;
  source: 'archetype' | 'identity' | 'habits';
}

export interface NextAction {
  action: string;
  icon: string;
  route?: string;
}

// ── Habit subscore labels ────────────────────────────────────────────────────

const HABIT_AREA_LABELS: Record<string, string> = {
  daily_foundation: 'Daily Foundation',
  pregame: 'Pre-Game Routine',
  ingame_reset: 'In-Game Reset',
  postgame: 'Post-Game Process',
  consistency: 'Season Consistency',
};

// ── Archetype → Course week mapping ──────────────────────────────────────────

const ARCHETYPE_COURSE_MAP: Record<ArchetypeKey, { weekId: string; weekNum: number; skillName: string }> = {
  reactor:     { weekId: 'emotional-control', weekNum: 4, skillName: 'Emotional Control' },
  overthinker: { weekId: 'focus',             weekNum: 3, skillName: 'Focus' },
  avoider:     { weekId: 'resilience',        weekNum: 5, skillName: 'Resilience' },
  performer:   { weekId: 'confidence',        weekNum: 2, skillName: 'Confidence' },
  doubter:     { weekId: 'confidence',        weekNum: 2, skillName: 'Confidence' },
  driver:      { weekId: 'composure',         weekNum: 9, skillName: 'Composure' },
};

// ── Archetype → Toolbox categories ───────────────────────────────────────────

const ARCHETYPE_TOOLBOX: Record<ArchetypeKey, string[]> = {
  reactor:     ['Emotional Control', 'Stress & Anxiety', 'At-Bat Reset'],
  overthinker: ['Focus', 'Stress & Anxiety', 'Routines'],
  avoider:     ['Confidence', 'Pressure', 'Visualization Protocol'],
  performer:   ['Confidence', 'Self-Talk', 'Focus'],
  doubter:     ['Confidence', 'Self-Talk', 'Pressure'],
  driver:      ['Stress & Anxiety', 'Routines', 'Emotional Control'],
};

// ── Archetype → Journal ─────────────────────────────────────────────────────

const ARCHETYPE_JOURNAL: Record<ArchetypeKey, { name: string; key: string; reason: string }> = {
  reactor:     { name: 'Mistake Recovery Journal', key: 'mistake_recovery', reason: 'Helps you process mistakes without carrying them into the next play.' },
  overthinker: { name: 'Daily Reflection', key: 'daily', reason: 'Creates a structured outlet for mental chatter so it doesn\'t show up during competition.' },
  avoider:     { name: 'Pressure Journal', key: 'pressure', reason: 'Helps you process pressure moments instead of avoiding them.' },
  performer:   { name: 'Confidence Journal', key: 'confidence', reason: 'Builds internal evidence of your ability so you stop needing external validation.' },
  doubter:     { name: 'Confidence Journal', key: 'confidence', reason: 'Stacks proof that you belong — counters the doubt cycle.' },
  driver:      { name: 'Weekly Reflection', key: 'weekly', reason: 'Forces you to zoom out from the daily grind and see patterns.' },
};

// ── Archetype → Meditation ──────────────────────────────────────────────────

const ARCHETYPE_MEDITATION: Record<ArchetypeKey, { name: string; key: string; reason: string }> = {
  reactor:     { name: 'Calm the Nerves', key: 'anxiety-release', reason: 'Trains your nervous system to downregulate before emotional spikes escalate.' },
  overthinker: { name: 'Pre-Game Focus', key: 'pregame-focus', reason: 'Quiets the mental chatter and anchors you in the present before competition.' },
  avoider:     { name: 'Confidence Builder', key: 'confidence-builder', reason: 'Builds the internal state you need to attack instead of avoid.' },
  performer:   { name: 'Pre-Game Focus', key: 'pregame-focus', reason: 'Centers your attention on your process instead of the audience.' },
  doubter:     { name: 'Confidence Builder', key: 'confidence-builder', reason: 'Rewires the belief system that doubt erodes.' },
  driver:      { name: 'Pre Sleep Wind Down', key: 'sleep', reason: 'Teaches your system that rest is productive, not lazy.' },
};

// ── Identity-based additions ────────────────────────────────────────────────

function getIdentityPriority(profile: string, oa: number, al: number): DevelopmentPriority | null {
  if (profile === 'Fragile Identity') {
    return {
      label: 'Rebuild Competitor Identity',
      why: 'Your identity is heavily tied to results. Building a stable self-concept is your foundation.',
      source: 'identity',
    };
  }
  if (profile === 'Developing Identity') {
    if (oa >= 3.5) {
      return {
        label: 'Reduce Outcome Attachment',
        why: 'Your self-image shifts too much with performance. Anchor confidence in preparation, not results.',
        source: 'identity',
      };
    }
    if (al >= 3.5) {
      return {
        label: 'Build Internal Validation',
        why: 'You rely on external approval to feel confident. Shift to an internal evidence-based system.',
        source: 'identity',
      };
    }
  }
  return null;
}

// ── Habits-based additions ──────────────────────────────────────────────────

function getHabitPriority(hss: number, subscores: Record<string, number>): DevelopmentPriority | null {
  if (hss < 3.0) {
    return {
      label: 'Build a Routine System',
      why: 'Your mental routines are reactive, not structured. A consistent system is the first step to consistency.',
      source: 'habits',
    };
  }
  // Find weakest subscore
  const weakest = Object.entries(subscores).sort(([, a], [, b]) => a - b)[0];
  if (weakest && weakest[1] < 3.0) {
    const areaLabel = HABIT_AREA_LABELS[weakest[0]] ?? weakest[0];
    return {
      label: `Strengthen ${areaLabel}`,
      why: `Your ${areaLabel.toLowerCase()} is your weakest routine area. Small improvements here will compound.`,
      source: 'habits',
    };
  }
  return null;
}

// ── Main synthesis function ─────────────────────────────────────────────────

export function synthesizeProfile(profile: MentalProfile): ProfileSummary {
  const archKey = profile.primary_archetype as ArchetypeKey;
  const archInfo = ARCHETYPE_INFO[archKey];
  const secondaryKey = profile.secondary_archetype as ArchetypeKey | null;

  const identityProfile = profile.identity_profile ?? 'Unknown';
  const iss = profile.iss ?? 3.0;
  const oa = profile.outcome_attachment ?? 3.0;
  const al = profile.approval_load ?? 3.0;

  const habitProfile = profile.habit_profile ?? 'Unknown';
  const hss = profile.hss ?? 3.0;
  const subscores = profile.habit_subscores ?? {};

  // Find weakest and strongest habit areas
  const sortedHabits = Object.entries(subscores).sort(([, a], [, b]) => a - b);
  const weakestHabit = sortedHabits[0]?.[0] ?? 'consistency';
  const strongestHabit = sortedHabits[sortedHabits.length - 1]?.[0] ?? 'daily_foundation';

  // ── Headline ──
  const identityShort = identityProfile.replace(' Identity', '').replace(' Competitor', '');
  const headline = `${archInfo.name} · ${identityShort} Identity · ${habitProfile}`;

  // ── Coach Read ──
  const coachRead = buildCoachRead(archKey, archInfo, identityProfile, iss, habitProfile, hss);

  // ── Strengths (top 3 across all systems) ──
  const strengths: string[] = [
    archInfo.strengths[0],
    getIdentityStrength(identityProfile, iss),
    getHabitStrength(habitProfile, strongestHabit, subscores),
  ];

  // ── Watch-outs (top 3 across all systems) ──
  const watchOuts: string[] = [
    archInfo.watchOuts[0],
    getIdentityWatchOut(identityProfile, oa, al),
    getHabitWatchOut(habitProfile, weakestHabit, subscores),
  ];

  // ── Development Priorities (2-3) ──
  const priorities: DevelopmentPriority[] = [
    {
      label: archInfo.developmentFocus[0],
      why: `As ${archInfo.name.toLowerCase()}, this is your primary growth edge.`,
      source: 'archetype',
    },
  ];

  const identityPriority = getIdentityPriority(identityProfile, oa, al);
  if (identityPriority) priorities.push(identityPriority);

  const habitPriority = getHabitPriority(hss, subscores);
  if (habitPriority) priorities.push(habitPriority);

  // Ensure at least 2 priorities
  if (priorities.length < 2) {
    priorities.push({
      label: archInfo.developmentFocus[1],
      why: `This reinforces your primary development area.`,
      source: 'archetype',
    });
  }

  // ── Next Actions ──
  const nextActions: NextAction[] = [
    { action: 'Start Today\'s Mental Work', icon: 'flash-outline', route: '/(app)/training/mental/daily-work' },
    { action: 'Log a Mental Check-In', icon: 'add-circle-outline', route: '/(app)/training/mental/mental-checkin' },
    { action: 'Open the Mental Toolbox', icon: 'build-outline', route: '/(app)/training/mental/toolbox' },
  ];

  // ── Course recommendation ──
  const courseMap = ARCHETYPE_COURSE_MAP[archKey];
  const courseRecommendation = {
    weekId: courseMap.weekId,
    weekNum: courseMap.weekNum,
    skillName: courseMap.skillName,
    reason: `Based on your ${archInfo.name.toLowerCase()} pattern, ${courseMap.skillName.toLowerCase()} is your most impactful skill to develop first.`,
  };

  return {
    headline,
    coachRead,
    strengths,
    watchOuts,
    priorities,
    nextActions,
    toolboxCategories: ARCHETYPE_TOOLBOX[archKey],
    recommendedJournal: ARCHETYPE_JOURNAL[archKey],
    recommendedMeditation: ARCHETYPE_MEDITATION[archKey],
    courseRecommendation,
    scores: {
      archetype: {
        primary: archInfo.name,
        secondary: secondaryKey ? ARCHETYPE_INFO[secondaryKey].name : null,
        primaryKey: archKey,
      },
      identity: { profile: identityProfile, iss, outcomeAttachment: oa, approvalLoad: al },
      habits: {
        profile: habitProfile,
        hss,
        weakestArea: HABIT_AREA_LABELS[weakestHabit] ?? weakestHabit,
        strongestArea: HABIT_AREA_LABELS[strongestHabit] ?? strongestHabit,
      },
    },
  };
}

// ── Helper functions ────────────────────────────────────────────────────────

function buildCoachRead(
  archKey: ArchetypeKey,
  archInfo: typeof ARCHETYPE_INFO[ArchetypeKey],
  identityProfile: string,
  iss: number,
  habitProfile: string,
  hss: number,
): string {
  const archSentence = `You're ${archInfo.name.toLowerCase()} — ${archInfo.tagline.toLowerCase()}.`;

  let identitySentence: string;
  if (iss >= 4.3) {
    identitySentence = 'Your identity as a competitor is rock-solid — results don\'t shake who you are.';
  } else if (iss >= 3.7) {
    identitySentence = 'Your competitor identity is stable, but it can wobble during extended slumps or high-pressure stretches.';
  } else if (iss >= 3.0) {
    identitySentence = 'Your identity is still developing — your self-image shifts too much with results and external feedback.';
  } else {
    identitySentence = 'Your identity is fragile — your sense of self rises and falls with every at-bat. This is your biggest area to build.';
  }

  let habitSentence: string;
  if (hss >= 4.3) {
    habitSentence = 'Your routine system is elite — you have the habits to support sustained performance.';
  } else if (hss >= 3.7) {
    habitSentence = 'Your routines are solid but inconsistent — they break down when things get hard.';
  } else if (hss >= 3.0) {
    habitSentence = 'Your mental routines are inconsistent — you have some structure but it\'s not locked in yet.';
  } else {
    habitSentence = 'Your routine system is reactive — you don\'t have a consistent mental process, which leaves you vulnerable.';
  }

  return `${archSentence} ${identitySentence} ${habitSentence}`;
}

function getIdentityStrength(profile: string, iss: number): string {
  if (iss >= 4.3) return 'Rock-solid competitor identity that doesn\'t waver with results';
  if (iss >= 3.7) return 'Stable self-concept that holds up in most competitive situations';
  if (iss >= 3.0) return 'Growing self-awareness about how results affect your confidence';
  return 'High sensitivity to your own performance patterns — raw material for growth';
}

function getIdentityWatchOut(profile: string, oa: number, al: number): string {
  if (oa > al && oa >= 3.5) return 'Self-image shifts with performance results — good games inflate, bad games deflate';
  if (al >= 3.5) return 'Relying on coaches\' approval and external praise to feel confident';
  if (oa >= 3.0 || al >= 3.0) return 'Moderate dependency on results and feedback to feel good about your game';
  return 'May under-value external feedback — stay coachable while staying grounded';
}

function getHabitStrength(profile: string, strongest: string, subscores: Record<string, number>): string {
  const label = HABIT_AREA_LABELS[strongest] ?? strongest;
  const score = subscores[strongest] ?? 3.0;
  if (score >= 4.0) return `Strong ${label.toLowerCase()} — this routine area is a real asset`;
  return `${label} is your most consistent routine area`;
}

function getHabitWatchOut(profile: string, weakest: string, subscores: Record<string, number>): string {
  const label = HABIT_AREA_LABELS[weakest] ?? weakest;
  const score = subscores[weakest] ?? 3.0;
  if (score < 2.5) return `${label} is a significant gap — this routine area needs immediate attention`;
  if (score < 3.0) return `${label} is inconsistent — building structure here will improve your whole system`;
  return `${label} has room to grow compared to your other routine areas`;
}
