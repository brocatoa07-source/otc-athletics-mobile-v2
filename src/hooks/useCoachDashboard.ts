/**
 * useCoachDashboard — aggregates all data for the coach triage board.
 *
 * Returns:
 *   stats               — 4 action-center counts
 *   prioritizedAthletes — full athlete list sorted by priority score
 *   activityFeed        — recent activity (derived from training_sessions)
 *   toReviewList        — kept for backward compat (same as prioritizedAthletes sliced)
 */
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import {
  scoreAthlete,
  getPriorityLevel,
  PRIORITY_COLORS,
  sortByPriority,
  type PriorityLevel,
} from '@/utils/athleteSort';

// ── Types ──────────────────────────────────────────────────────────

export type { PriorityLevel };

export interface DashboardStats {
  toReview: number;
  videosPending: number;
  programsToUpdate: number;
  unreadMessages: number;
}

export interface PrioritizedAthlete {
  userId: string;
  name: string;
  initial: string;
  lastUpload: string | null;
  daysSinceTouchpoint: number;
  hasVideoPending: boolean;
  daysSinceLastSession: number;
  priorityScore: number;
  priorityLevel: PriorityLevel;
  priorityColor: string;
  tag: 'hitting' | 'lifting' | 'mental' | 'general';
}

export type ActivityEventType = 'video_upload' | 'session_log' | 'journal_log' | 'message';

export interface ActivityFeedItem {
  id: string;
  athleteId: string | null;
  athleteName: string;
  type: ActivityEventType;
  metadata: Record<string, unknown>;
  createdAt: string;
  relativeTime: string;
  icon: string;
  iconColor: string;
}

// Kept for backward compat
export interface ReviewAthlete {
  userId: string;
  name: string;
  initial: string;
  lastUpload: string | null;
  daysSinceTouchpoint: number;
  tag: 'hitting' | 'lifting' | 'mental' | 'general';
  urgency: 'high' | 'medium' | 'low';
  urgencyColor: string;
}

export interface WeekAthlete {
  userId: string;
  name: string;
  initial: string;
  workoutsThisWeek: number;
  journalsThisWeek: number;
  lastActiveLabel: string;
}

export interface ActivityItem {
  id: string;
  athleteName: string;
  action: string;
  icon: string;
  iconColor: string;
  relativeTime: string;
}

export interface CoachDashboardData {
  stats: DashboardStats;
  prioritizedAthletes: PrioritizedAthlete[];
  activityFeed: ActivityFeedItem[];
  // legacy fields kept so existing tab UI doesn't break
  toReviewList: ReviewAthlete[];
  thisWeekList: WeekAthlete[];
  recentActivity: ActivityItem[];
}

// ── Helpers ────────────────────────────────────────────────────────

function relativeTime(iso: string): string {
  const diffMs  = Date.now() - new Date(iso).getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1)  return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24)   return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD}d ago`;
}

// ── Empty state ────────────────────────────────────────────────────

function buildEmpty(): CoachDashboardData {
  return {
    stats: { toReview: 0, videosPending: 0, programsToUpdate: 0, unreadMessages: 0 },
    prioritizedAthletes: [],
    activityFeed: [],
    toReviewList: [],
    thisWeekList: [],
    recentActivity: [],
  };
}

// ── Hook ───────────────────────────────────────────────────────────

export function useCoachDashboard(coachUserId: string | undefined) {
  return useQuery<CoachDashboardData>({
    queryKey: ['coach-dashboard', coachUserId],
    enabled: !!coachUserId,
    staleTime: 30_000,
    queryFn: async (): Promise<CoachDashboardData> => {
      if (!coachUserId) return buildEmpty();

      // ── Connected athlete user_ids ──
      const { data: connectedAthletes } = await supabase
        .rpc('get_coach_athlete_ids', { coach_user_id: coachUserId });

      if (!connectedAthletes || connectedAthletes.length === 0) return buildEmpty();

      const athleteUserIds = connectedAthletes.map((r: any) => r.athlete_user_id as string);

      // ── User names ──
      const { data: users } = await supabase
        .from('users')
        .select('id, full_name')
        .in('id', athleteUserIds);
      const nameMap = new Map(users?.map((u) => [u.id, u.full_name]) ?? []);

      // ── Athlete row IDs (athletes.id, needed for training_sessions + program_assignments) ──
      const { data: athleteRows } = await supabase
        .from('athletes')
        .select('id, user_id')
        .in('user_id', athleteUserIds);
      const athleteRowIds = athleteRows?.map((a) => a.id) ?? [];
      const athleteIdToUserId = new Map(athleteRows?.map((a) => [a.id, a.user_id]) ?? []);

      // ── Latest training sessions per athlete ──
      const { data: sessions } = await supabase
        .from('training_sessions')
        .select('athlete_id, created_at')
        .in('athlete_id', athleteRowIds.length > 0 ? athleteRowIds : ['__none__'])
        .order('created_at', { ascending: false })
        .limit(300);

      const lastSessionMap = new Map<string, string>(); // user_id -> last session date
      for (const s of sessions ?? []) {
        const uid = athleteIdToUserId.get(s.athlete_id);
        if (uid && !lastSessionMap.has(uid)) {
          lastSessionMap.set(uid, s.created_at);
        }
      }

      // ── Program count ──
      const { count: programCount } = await supabase
        .from('programs')
        .select('*', { count: 'exact', head: true })
        .eq('owner_user_id', coachUserId);

      // ── Recent athlete logs (for activity feed) ──
      const { data: recentLogs } = await supabase
        .from('athlete_logs')
        .select('id, user_id, log_type, created_at')
        .in('user_id', athleteUserIds)
        .order('created_at', { ascending: false })
        .limit(20);

      const { data: recentSessions } = await supabase
        .from('training_sessions')
        .select('id, athlete_id, created_at')
        .in('athlete_id', athleteRowIds.length > 0 ? athleteRowIds : ['__none__'])
        .order('created_at', { ascending: false })
        .limit(20);

      // Build activity feed from training_sessions + athlete_logs
      const activityFeed: ActivityFeedItem[] = [];
      for (const s of recentSessions ?? []) {
        const uid = athleteIdToUserId.get(s.athlete_id);
        activityFeed.push({
          id: s.id,
          athleteId: uid ?? null,
          athleteName: uid ? (nameMap.get(uid) ?? 'Athlete') : 'Athlete',
          type: 'session_log',
          metadata: {},
          createdAt: s.created_at,
          relativeTime: relativeTime(s.created_at),
          icon: 'barbell',
          iconColor: '#22c55e',
        });
      }
      for (const l of recentLogs ?? []) {
        activityFeed.push({
          id: l.id,
          athleteId: l.user_id,
          athleteName: nameMap.get(l.user_id) ?? 'Athlete',
          type: 'journal_log',
          metadata: {},
          createdAt: l.created_at,
          relativeTime: relativeTime(l.created_at),
          icon: 'journal',
          iconColor: '#8b5cf6',
        });
      }
      activityFeed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      // ── Build prioritized athlete list ──
      const now = Date.now();
      const raw: PrioritizedAthlete[] = athleteUserIds.map((aId: string) => {
        const name    = nameMap.get(aId) ?? 'Athlete';
        const initial = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

        const lastSessionIso = lastSessionMap.get(aId);
        const daysSinceLastSession = lastSessionIso
          ? Math.floor((now - new Date(lastSessionIso).getTime()) / 86_400_000)
          : 30;

        // Without v2 messaging, use session recency as touchpoint proxy
        const daysSinceTouchpoint = daysSinceLastSession;

        const sortInput = { daysSinceTouchpoint, hasVideoPending: false, daysSinceLastSession };
        const priorityScore = scoreAthlete(sortInput);
        const priorityLevel = getPriorityLevel(priorityScore);

        return {
          userId: aId,
          name,
          initial,
          lastUpload: null,
          daysSinceTouchpoint,
          hasVideoPending: false,
          daysSinceLastSession,
          priorityScore,
          priorityLevel,
          priorityColor: PRIORITY_COLORS[priorityLevel],
          tag: 'general' as const,
        } satisfies PrioritizedAthlete;
      });

      const prioritizedAthletes = sortByPriority(raw);

      // Legacy toReviewList / thisWeekList shapes
      const toReviewList: ReviewAthlete[] = prioritizedAthletes.map((a) => ({
        userId: a.userId,
        name: a.name,
        initial: a.initial,
        lastUpload: a.lastUpload,
        daysSinceTouchpoint: a.daysSinceTouchpoint,
        tag: a.tag,
        urgency: a.priorityLevel === 'critical' || a.priorityLevel === 'high' ? 'high'
               : a.priorityLevel === 'medium' ? 'medium' : 'low',
        urgencyColor: a.priorityColor,
      }));

      const thisWeekList: WeekAthlete[] = prioritizedAthletes.map((a) => ({
        userId: a.userId,
        name: a.name,
        initial: a.initial,
        workoutsThisWeek: 0,
        journalsThisWeek: 0,
        lastActiveLabel: a.daysSinceTouchpoint === 0 ? 'today' : `${a.daysSinceTouchpoint}d ago`,
      }));

      return {
        stats: {
          toReview: prioritizedAthletes.filter((a) => a.priorityLevel === 'critical' || a.priorityLevel === 'high').length,
          videosPending: 0,
          programsToUpdate: programCount ?? 0,
          unreadMessages: 0,
        },
        prioritizedAthletes,
        activityFeed: activityFeed.slice(0, 40),
        toReviewList,
        thisWeekList,
        recentActivity: [],
      };
    },
  });
}
