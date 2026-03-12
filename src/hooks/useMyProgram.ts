import { useState, useEffect, useMemo, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAthleteScProfile } from '@/hooks/useAthleteScProfile';
import { useAssessment } from '@/hooks/useAssessment';
import { useReadiness } from '@/hooks/useReadiness';
import { buildWeekPlan, getTodayPlan, type WeekPlan, type DayPlan } from '@/data/week-program-engine';
import { getReadinessZone, type ReadinessZone } from '@/data/readiness-engine';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth.store';

const COMPLETIONS_KEY = 'otc:workout-completions';

/**
 * Core hook for the athlete's weekly program.
 * Generates the week plan, tracks completions, and provides today's session.
 */
export function useMyProgram() {
  const { profile, loaded: profileLoaded } = useAthleteScProfile();
  const { assessment, loaded: assessmentLoaded } = useAssessment();
  const { readiness } = useReadiness();
  const athlete = useAuthStore((s) => s.athlete);
  const [completionMap, setCompletionMap] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);

  // Load completions from AsyncStorage — also re-runs on screen focus
  const loadCompletions = useCallback(() => {
    AsyncStorage.getItem(COMPLETIONS_KEY).then((raw) => {
      if (raw) {
        try { setCompletionMap(JSON.parse(raw)); } catch {}
      }
      setLoaded(true);
    });
  }, []);

  useEffect(() => { loadCompletions(); }, []);

  useFocusEffect(useCallback(() => { loadCompletions(); }, [loadCompletions]));

  const weekPlan: WeekPlan | null = useMemo(() => {
    if (!profile) return null;
    return buildWeekPlan(profile, assessment?.scores, completionMap);
  }, [profile, assessment?.scores, completionMap]);

  const todayPlan: DayPlan | null = useMemo(() => {
    if (!weekPlan) return null;
    return getTodayPlan(weekPlan);
  }, [weekPlan]);

  const zone: ReadinessZone = useMemo(() => {
    if (!readiness) return 'normal';
    return getReadinessZone(readiness.score);
  }, [readiness]);

  const markComplete = async () => {
    const now = new Date().toISOString();
    const today = now.slice(0, 10);
    const updated = { ...completionMap, [today]: now };
    setCompletionMap(updated);
    await AsyncStorage.setItem(COMPLETIONS_KEY, JSON.stringify(updated));

    // Persist to Supabase so coach and future sessions have a record
    if (athlete?.id) {
      await supabase.from('workout_sessions').insert({
        athlete_id: athlete.id,
        program_type: 'lifting',
        completed_at: now,
      });
    }
  };

  const isReady = profileLoaded && assessmentLoaded && loaded;
  const hasProfile = !!profile;
  const completedToday = !!completionMap[new Date().toISOString().slice(0, 10)];

  return {
    weekPlan,
    todayPlan,
    zone,
    completedToday,
    hasProfile,
    isReady,
    markComplete,
  };
}
