import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { getDevelopmentStatus, aggregateStandardStatus } from '@/services/statusService';
import { getKeyMetricsSnapshot } from '@/services/metricsService';
import { getLatestSnapshot } from '@/data/performance-trend';
import type { DevelopmentStatus, StandardStatus, KeyMetric, MetricReading } from '@/types/progress';

export interface MetricsStatusResult {
  developmentStatus: DevelopmentStatus;
  standardStatus: StandardStatus | null;
  keyMetrics: Partial<Record<KeyMetric, MetricReading>>;
  /** Days since the most recently logged key metric, or null if none */
  daysSinceLastKeyMetric: number | null;
}

export function useMetricsStatus() {
  const userId = useAuthStore((s) => s.user?.id);

  const { data, isLoading } = useQuery<MetricsStatusResult>({
    queryKey: ['metrics-status', userId],
    enabled: !!userId,
    staleTime: 5 * 60_000, // 5 min
    queryFn: async () => {
      const [devStatus, keyMetrics] = await Promise.all([
        getDevelopmentStatus(userId!),
        getKeyMetricsSnapshot(userId!),
      ]);

      // If Supabase returned nothing, fall back to local AsyncStorage snapshots
      if (Object.keys(keyMetrics).length === 0) {
        const local = await getLatestSnapshot();
        if (local) {
          const localMap: Record<string, KeyMetric> = {
            exitVelo: 'exit_velocity_mph',
            tenYard: 'sprint_10yd_seconds',
            throwingVelo: 'throw_velocity_mph',
            rotationalPower: 'rot_power_watts',
            strengthIndex: 'strength_index',
          };
          for (const [localKey, metricKey] of Object.entries(localMap)) {
            const val = (local as any)[localKey];
            if (val !== null && val !== undefined) {
              keyMetrics[metricKey] = {
                value: val,
                recordedAt: local.createdAt,
                delta: null,
              };
            }
          }
        }
      }

      const standardStatus =
        devStatus === 'verified' ? aggregateStandardStatus(keyMetrics) : null;

      // Most recent key metric recorded_at
      const latestDates = Object.values(keyMetrics)
        .map((r) => r?.recordedAt)
        .filter(Boolean) as string[];
      let daysSinceLastKeyMetric: number | null = null;
      if (latestDates.length > 0) {
        const mostRecent = latestDates.reduce((a, b) => (a > b ? a : b));
        const msAgo = Date.now() - new Date(mostRecent).getTime();
        daysSinceLastKeyMetric = Math.floor(msAgo / (1000 * 60 * 60 * 24));
      }

      return { developmentStatus: devStatus, standardStatus, keyMetrics, daysSinceLastKeyMetric };
    },
  });

  return {
    developmentStatus: data?.developmentStatus ?? 'unverified',
    standardStatus: data?.standardStatus ?? null,
    keyMetrics: data?.keyMetrics ?? {},
    daysSinceLastKeyMetric: data?.daysSinceLastKeyMetric ?? null,
    isLoading,
  };
}
