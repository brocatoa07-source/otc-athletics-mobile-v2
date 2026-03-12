import type { ScProfile } from '@/hooks/useAthleteScProfile';
import type { DeficiencyScores } from '@/data/deficiency-engine';
import type { ReadinessZone } from '@/data/readiness-engine';
import {
  buildSession,
  SESSION_BLOCKS,
  type BlockKey,
  type SessionExercise,
} from '@/data/session-blocks';
import { getAdjustedBlockCount, REST_SKIP_BLOCKS } from '@/data/readiness-engine';

/* ────────────────────────────────────────────────────
 * WEEKLY PROGRAM ENGINE
 *
 * Generates up to 5 training days + 1 active recovery
 * per week using session-blocks. Deterministic seeded
 * per day so same day = same workout.
 *
 * Active recovery day = soft-tissue + movement-prep + cool-down only.
 * ──────────────────────────────────────────────────── */

export interface DayPlan {
  dayIndex: number;           // 0=Mon, 1=Tue, ... 6=Sun
  dayLabel: string;
  type: 'training' | 'active_recovery' | 'rest';
  blocks: Record<BlockKey, SessionExercise[]> | null;
  estimatedMinutes: number;
  completed: boolean;
  completedAt: string | null;
}

export interface WeekPlan {
  weekStart: string;  // ISO date of Monday
  days: DayPlan[];
  phase: string;
  weekNumber: number; // 1-based within phase
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/** Build a training schedule for the week based on daysPerWeek */
function getTrainingSchedule(daysPerWeek: number): ('training' | 'active_recovery' | 'rest')[] {
  // Always include active recovery. Spread training days with rest.
  switch (daysPerWeek) {
    case 3:
      return ['training', 'rest', 'training', 'rest', 'training', 'active_recovery', 'rest'];
    case 4:
      return ['training', 'training', 'rest', 'training', 'training', 'active_recovery', 'rest'];
    case 5:
      return ['training', 'training', 'training', 'rest', 'training', 'training', 'active_recovery'];
    case 6:
      return ['training', 'training', 'training', 'training', 'training', 'training', 'active_recovery'];
    default:
      return ['training', 'training', 'rest', 'training', 'training', 'active_recovery', 'rest'];
  }
}

function buildActiveRecovery(profile: ScProfile, daySeed: number): Record<BlockKey, SessionExercise[]> {
  const full = buildSession(profile, daySeed);
  const recovery: Record<BlockKey, SessionExercise[]> = {} as any;
  for (const block of SESSION_BLOCKS) {
    if (['soft-tissue', 'movement-prep', 'cool-down'].includes(block.key)) {
      recovery[block.key] = full[block.key];
    } else {
      recovery[block.key] = [];
    }
  }
  return recovery;
}

/** Get the week start (Monday) as ISO date string */
function getWeekStartDate(offset: number = 0): string {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff + offset * 7);
  return monday.toISOString().slice(0, 10);
}

/** Generate the deterministic day seed from a date string */
function dateSeed(dateStr: string): number {
  const d = new Date(dateStr);
  return Math.floor(d.getTime() / 86400000);
}

export function buildWeekPlan(
  profile: ScProfile,
  deficiencies?: DeficiencyScores,
  completionMap?: Record<string, string>, // dateStr → completedAt
  weekOffset: number = 0,
): WeekPlan {
  const weekStart = getWeekStartDate(weekOffset);
  const schedule = getTrainingSchedule(profile.daysPerWeek);

  const days: DayPlan[] = schedule.map((type, i) => {
    const dateStr = new Date(
      new Date(weekStart).getTime() + i * 86400000
    ).toISOString().slice(0, 10);

    let blocks: Record<BlockKey, SessionExercise[]> | null = null;
    let estimatedMinutes = 0;

    if (type === 'training') {
      blocks = buildSession(profile, dateSeed(dateStr), deficiencies);
      estimatedMinutes = profile.timeline === 'in-season' ? 50 : 70;
    } else if (type === 'active_recovery') {
      blocks = buildActiveRecovery(profile, dateSeed(dateStr));
      estimatedMinutes = 25;
    }

    const completed = !!completionMap?.[dateStr];
    const completedAt = completionMap?.[dateStr] ?? null;

    return {
      dayIndex: i,
      dayLabel: DAY_LABELS[i],
      type,
      blocks,
      estimatedMinutes,
      completed,
      completedAt,
    };
  });

  // Determine phase from timeline
  const phaseMap: Record<string, string> = {
    offseason: 'Off-Season Development',
    preseason: 'Pre-Season Prep',
    'in-season': 'In-Season Maintenance',
  };

  return {
    weekStart,
    days,
    phase: phaseMap[profile.timeline] || 'Training',
    weekNumber: weekOffset + 1,
  };
}

export function getTodayPlan(weekPlan: WeekPlan): DayPlan | null {
  const today = new Date().getDay();
  // Convert JS day (0=Sun) to our index (0=Mon)
  const idx = today === 0 ? 6 : today - 1;
  return weekPlan.days[idx] ?? null;
}
