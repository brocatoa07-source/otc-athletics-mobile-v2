import type { ScProfile } from '@/hooks/useAthleteScProfile';
import type { AssessmentData } from '@/hooks/useAssessment';
import type { ReadinessResult } from '@/data/readiness-engine';
import type { ActiveInjury } from '@/data/injury-swap';
import type { DeficiencyScores, Dimension } from '@/data/deficiency-engine';
import { DIMENSIONS, getTopDeficiencies, getScoreLabel } from '@/data/deficiency-engine';
import { ZONE_META } from '@/data/readiness-engine';
import { getCurrentMonth } from '@/data/dev-map';
import { BODY_PARTS } from '@/data/injury-swap';

/* ────────────────────────────────────────────────────
 * PERFORMANCE DASHBOARD ENGINE
 *
 * Aggregates data from across the system into a
 * single performance snapshot:
 *   - Overall readiness score
 *   - Athletic profile (5 dimensions)
 *   - Training phase & dev map progress
 *   - Injury status
 *   - Action items / recommendations
 * ──────────────────────────────────────────────────── */

export interface DashboardSnapshot {
  /** Overall performance rating 0-100 */
  overallRating: number;
  ratingLabel: string;

  /** Athletic dimension scores */
  dimensions: {
    key: Dimension;
    label: string;
    score: number;
    scoreLabel: string;
    color: string;
    icon: string;
  }[];

  /** Top strengths and weaknesses */
  topStrengths: Dimension[];
  topWeaknesses: Dimension[];

  /** Training phase info */
  currentMonth: number;
  monthsRemaining: number;
  profileSummary: string;

  /** Readiness */
  readinessScore: number | null;
  readinessZone: string | null;
  readinessColor: string | null;

  /** Injuries */
  activeInjuries: string[];

  /** Action items */
  actions: DashboardAction[];
}

export interface DashboardAction {
  label: string;
  desc: string;
  icon: string;
  color: string;
  route: string;
  priority: number; // lower = more important
}

export function buildDashboardSnapshot(
  profile: ScProfile,
  assessment: AssessmentData | null,
  readiness: ReadinessResult | null,
  injuries: ActiveInjury[],
): DashboardSnapshot {
  const scores = assessment?.scores;
  const month = getCurrentMonth(profile.completedAt);

  // Dimension details
  const dimensions = DIMENSIONS.map((dim) => ({
    key: dim.key,
    label: dim.label,
    score: scores?.[dim.key] ?? 50,
    scoreLabel: getScoreLabel(scores?.[dim.key] ?? 50),
    color: dim.color,
    icon: dim.icon,
  }));

  // Overall rating = average of all dimension scores
  const avgScore = Math.round(
    dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length,
  );

  const topWeaknesses = scores ? getTopDeficiencies(scores, 2) : [];
  const topStrengths = scores
    ? (Object.entries(scores) as [Dimension, number][])
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(([dim]) => dim)
    : [];

  // Readiness
  const today = new Date().toISOString().slice(0, 10);
  const readinessToday = readiness?.completedAt?.startsWith(today) ? readiness : null;
  const zoneMeta = readinessToday?.zone ? ZONE_META[readinessToday.zone] : null;

  // Injuries
  const activeInjuries = injuries.map(
    (i) => BODY_PARTS.find((b) => b.key === i.bodyPart)?.label ?? i.bodyPart,
  );

  // Profile summary
  const profileSummary = `${profile.position} · ${profile.experience} · ${profile.timeline} · ${profile.daysPerWeek}x/wk`;

  // Action items
  const actions: DashboardAction[] = [];

  if (!assessment) {
    actions.push({
      label: 'Take Assessment',
      desc: 'Complete the movement quiz for personalized scoring',
      icon: 'clipboard-outline',
      color: '#22c55e',
      route: '/(app)/training/sc/movement-quiz',
      priority: 1,
    });
  }

  if (!readinessToday) {
    actions.push({
      label: 'Daily Check-In',
      desc: 'Complete your readiness check before training',
      icon: 'pulse-outline',
      color: '#8b5cf6',
      route: '/(app)/training/sc/readiness',
      priority: 2,
    });
  }

  if (topWeaknesses.length > 0 && scores) {
    const weakest = DIMENSIONS.find((d) => d.key === topWeaknesses[0]);
    if (weakest && (scores[weakest.key] ?? 50) < 45) {
      actions.push({
        label: `Improve ${weakest.label}`,
        desc: weakest.lowDesc,
        icon: weakest.icon,
        color: weakest.color,
        route: '/(app)/training/sc/session',
        priority: 3,
      });
    }
  }

  if (injuries.length > 0) {
    actions.push({
      label: 'Review Injuries',
      desc: `${injuries.length} area${injuries.length > 1 ? 's' : ''} flagged — review and update`,
      icon: 'shield-checkmark-outline',
      color: '#ef4444',
      route: '/(app)/training/sc/injuries',
      priority: 4,
    });
  }

  actions.sort((a, b) => a.priority - b.priority);

  return {
    overallRating: avgScore,
    ratingLabel: getOverallLabel(avgScore),
    dimensions,
    topStrengths,
    topWeaknesses,
    currentMonth: month,
    monthsRemaining: Math.max(0, 6 - month),
    profileSummary,
    readinessScore: readinessToday?.score ?? null,
    readinessZone: zoneMeta?.label ?? null,
    readinessColor: zoneMeta?.color ?? null,
    activeInjuries,
    actions,
  };
}

function getOverallLabel(score: number): string {
  if (score <= 30) return 'Developing';
  if (score <= 45) return 'Building';
  if (score <= 60) return 'Competitive';
  if (score <= 75) return 'Advanced';
  if (score <= 90) return 'Elite';
  return 'World-Class';
}
