import type { MetricType } from '@/types/progress';

export interface AgeGroup {
  key: string;
  label: string;
  minAge: number;
  maxAge: number;
}

export const AGE_GROUPS: AgeGroup[] = [
  { key: '10u', label: '10U', minAge: 0, maxAge: 10 },
  { key: '12u', label: '12U', minAge: 11, maxAge: 12 },
  { key: '14u', label: '14U', minAge: 13, maxAge: 14 },
  { key: '16u', label: '16U', minAge: 15, maxAge: 16 },
  { key: '18u', label: '18U', minAge: 17, maxAge: 18 },
  { key: 'college', label: 'College+', minAge: 19, maxAge: 99 },
];

export interface AgeBenchmark {
  average: number;
  good: number;
  elite: number;
}

/** Benchmark data by metric × age group. Sources: PBR, Driveline, NHFS averages. */
export const BENCHMARKS: Partial<Record<MetricType, Record<string, AgeBenchmark>>> = {
  exit_velocity_mph: {
    '10u':    { average: 45, good: 52, elite: 58 },
    '12u':    { average: 55, good: 62, elite: 68 },
    '14u':    { average: 65, good: 72, elite: 78 },
    '16u':    { average: 72, good: 80, elite: 87 },
    '18u':    { average: 80, good: 88, elite: 93 },
    'college': { average: 85, good: 92, elite: 98 },
  },
  sprint_60yd_seconds: {
    '10u':    { average: 10.0, good: 9.2, elite: 8.5 },
    '12u':    { average: 9.0, good: 8.3, elite: 7.8 },
    '14u':    { average: 8.2, good: 7.6, elite: 7.2 },
    '16u':    { average: 7.6, good: 7.1, elite: 6.8 },
    '18u':    { average: 7.2, good: 6.8, elite: 6.5 },
    'college': { average: 7.0, good: 6.7, elite: 6.4 },
  },
  throw_velocity_mph: {
    '10u':    { average: 45, good: 52, elite: 58 },
    '12u':    { average: 55, good: 62, elite: 68 },
    '14u':    { average: 65, good: 72, elite: 78 },
    '16u':    { average: 72, good: 80, elite: 85 },
    '18u':    { average: 78, good: 85, elite: 90 },
    'college': { average: 82, good: 88, elite: 94 },
  },
  sprint_10yd_seconds: {
    '10u':    { average: 2.5, good: 2.2, elite: 2.0 },
    '12u':    { average: 2.2, good: 2.0, elite: 1.85 },
    '14u':    { average: 2.0, good: 1.85, elite: 1.75 },
    '16u':    { average: 1.9, good: 1.75, elite: 1.65 },
    '18u':    { average: 1.8, good: 1.7, elite: 1.58 },
    'college': { average: 1.7, good: 1.6, elite: 1.50 },
  },
};

export function getAgeGroupForAge(age: number | undefined): AgeGroup | null {
  if (!age) return null;
  return AGE_GROUPS.find(g => age >= g.minAge && age <= g.maxAge) ?? null;
}

export function getBenchmark(metric: MetricType, ageGroupKey: string): AgeBenchmark | null {
  return BENCHMARKS[metric]?.[ageGroupKey] ?? null;
}
