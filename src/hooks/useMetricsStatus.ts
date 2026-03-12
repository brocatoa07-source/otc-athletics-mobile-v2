import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { getDevelopmentStatus, aggregateStandardStatus } from '@/services/statusService';
import { getKeyMetricsSnapshot } from '@/services/metricsService';
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
