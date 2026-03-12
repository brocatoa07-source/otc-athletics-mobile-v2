import { supabase } from '@/lib/supabase';
import type { KeyMetric, MetricReading } from '@/types/progress';
import { KEY_METRICS } from '@/types/progress';
import { METRIC_CONFIG } from '@/types/progress';

/**
 * Fetches the latest and previous readings for each key metric,
 * computing a signed delta (positive = improvement).
 */
export async function getKeyMetricsSnapshot(
  athleteId: string
): Promise<Partial<Record<KeyMetric, MetricReading>>> {
  // Fetch the 2 most recent rows per key metric
  const { data, error } = await supabase
    .from('athlete_progress')
    .select('metric_type, value, recorded_at')
    .eq('athlete_id', athleteId)
    .in('metric_type', KEY_METRICS)
    .order('recorded_at', { ascending: false });

  if (error || !data) return {};

  const result: Partial<Record<KeyMetric, MetricReading>> = {};

  for (const metric of KEY_METRICS) {
    const rows = data.filter((r) => r.metric_type === metric);
    if (rows.length === 0) continue;

    const latest = rows[0];
    const previous = rows[1] ?? null;

    let delta: number | null = null;
    if (previous !== null) {
      const rawDelta = latest.value - previous.value;
      // For lower-is-better metrics, a negative change is actually an improvement
      const higherIsBetter = METRIC_CONFIG[metric].higherIsBetter;
      delta = higherIsBetter ? rawDelta : -rawDelta;
    }

    result[metric] = {
      value: latest.value,
      recordedAt: latest.recorded_at,
      delta,
    };
  }

  return result;
}

/**
 * Fetches the full history for a single metric (for sparklines).
 */
export async function getMetricHistory(
  athleteId: string,
  metric: KeyMetric,
  limit = 10
): Promise<Array<{ value: number; recordedAt: string }>> {
  const { data, error } = await supabase
    .from('athlete_progress')
    .select('value, recorded_at')
    .eq('athlete_id', athleteId)
    .eq('metric_type', metric)
    .order('recorded_at', { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data.map((r) => ({ value: r.value, recordedAt: r.recorded_at }));
}
