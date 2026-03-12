import { supabase } from '@/lib/supabase';
import { KEY_METRICS } from '@/types/progress';
import type { DevelopmentStatus } from '@/types/progress';

const DAYS_28 = 28;

// Re-export pure functions from the data layer (no Supabase dependency)
export { computeStandardStatus, aggregateStandardStatus } from '@/data/standard-status';

/**
 * Returns 'verified' if the athlete has logged at least one key metric
 * in the last 28 days; otherwise 'unverified'.
 */
export async function getDevelopmentStatus(athleteId: string): Promise<DevelopmentStatus> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - DAYS_28);

  const { count, error } = await supabase
    .from('athlete_progress')
    .select('id', { count: 'exact', head: true })
    .eq('athlete_id', athleteId)
    .in('metric_type', KEY_METRICS)
    .gte('recorded_at', cutoff.toISOString());

  if (error || count === null) return 'unverified';
  return count > 0 ? 'verified' : 'unverified';
}
