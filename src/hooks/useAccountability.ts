import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  buildDefaultChecklist,
  computeAccountabilityScore,
  getGrade,
  getWeekStart,
  type AccountabilityResult,
  type WeeklyChecklist,
} from '@/data/accountability-engine';
import { loadTodayCheckIn } from '@/data/own-the-cost-checkin';
import { useAthleteScProfile } from '@/hooks/useAthleteScProfile';
import { useRequiredTodayConfig } from '@/hooks/useRequiredTodayConfig';

const CHECKLIST_KEY   = 'otc:accountability';
const SKILL_WORK_KEY  = 'otc:skill-work-date';
const HABITS_KEY      = 'otc:habits-date';
const ADDONS_KEY      = 'otc:addons-date';
const MENTAL_KEY      = 'otc:mental-session-date';
const JOURNAL_KEY     = 'otc:journal-date';
const READINESS_KEY   = 'otc:readiness-date';

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Tracks weekly accountability score.
 * Score is computed only from the items the athlete has enabled
 * in their Required Today config.
 */
export function useAccountability() {
  const { profile } = useAthleteScProfile();
  const { enabled } = useRequiredTodayConfig();
  const [checklist, setChecklist] = useState<WeeklyChecklist | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [skillWorkDate, setSkillWorkDate] = useState<string | null>(null);
  const [habitsDate, setHabitsDate] = useState<string | null>(null);
  const [addonsDate, setAddonsDate] = useState<string | null>(null);
  const [mentalDate, setMentalDate] = useState<string | null>(null);
  const [journalDate, setJournalDate] = useState<string | null>(null);
  const [readinessDate, setReadinessDate] = useState<string | null>(null);

  const weekStart = getWeekStart();
  const daysPerWeek = profile?.daysPerWeek ?? 4;

  const loadChecklist = useCallback(async () => {
    const [raw, skillRaw, habitsRaw, addonsRaw, mentalRaw, journalRaw, readinessRaw, otcLog] = await Promise.all([
      AsyncStorage.getItem(CHECKLIST_KEY),
      AsyncStorage.getItem(SKILL_WORK_KEY),
      AsyncStorage.getItem(HABITS_KEY),
      AsyncStorage.getItem(ADDONS_KEY),
      AsyncStorage.getItem(MENTAL_KEY),
      AsyncStorage.getItem(JOURNAL_KEY),
      AsyncStorage.getItem(READINESS_KEY),
      loadTodayCheckIn(),
    ]);

    let cl: WeeklyChecklist;
    if (raw) {
      try {
        const stored = JSON.parse(raw);
        cl = stored._weekStart === weekStart ? stored : buildDefaultChecklist(daysPerWeek);
      } catch {
        cl = buildDefaultChecklist(daysPerWeek);
      }
    } else {
      cl = buildDefaultChecklist(daysPerWeek);
    }

    // Auto-sync: if OTC check-in was completed today but readiness not yet counted,
    // increment the weekly readiness count so Standard Engine stays in sync.
    const today = todayStr();
    if (otcLog && readinessRaw !== today) {
      cl = { ...cl, readinessCheckins: cl.readinessCheckins + 1 };
      await AsyncStorage.setItem(READINESS_KEY, today);
      await AsyncStorage.setItem(CHECKLIST_KEY, JSON.stringify({ ...cl, _weekStart: weekStart }));
      setReadinessDate(today);
    } else {
      setReadinessDate(readinessRaw);
    }

    setChecklist(cl);
    setSkillWorkDate(skillRaw);
    setHabitsDate(habitsRaw);
    setAddonsDate(addonsRaw);
    setMentalDate(mentalRaw);
    setJournalDate(journalRaw);
    setLoaded(true);
  }, [weekStart, daysPerWeek]);

  useEffect(() => { loadChecklist(); }, [loadChecklist]);

  useFocusEffect(useCallback(() => { loadChecklist(); }, [loadChecklist]));

  const save = async (updated: WeeklyChecklist) => {
    setChecklist(updated);
    await AsyncStorage.setItem(
      CHECKLIST_KEY,
      JSON.stringify({ ...updated, _weekStart: weekStart })
    );
  };

  const incrementWorkout = () => {
    if (!checklist) return;
    save({ ...checklist, workoutsCompleted: checklist.workoutsCompleted + 1 });
  };
  const incrementReadiness = () => {
    if (!checklist) return;
    save({ ...checklist, readinessCheckins: checklist.readinessCheckins + 1 });
  };
  const incrementMetrics = () => {
    if (!checklist) return;
    save({ ...checklist, metricsLogged: checklist.metricsLogged + 1 });
  };
  const incrementCourse = () => {
    if (!checklist) return;
    save({ ...checklist, courseSessionsDone: checklist.courseSessionsDone + 1 });
  };

  const markSkillWorkDoneToday = async () => {
    const today = todayStr();
    setSkillWorkDate(today);
    await AsyncStorage.setItem(SKILL_WORK_KEY, today);
    if (checklist) {
      save({ ...checklist, skillWorkDaysCount: (checklist.skillWorkDaysCount ?? 0) + 1 });
    }
  };

  const markHabitsDoneToday = async () => {
    const today = todayStr();
    if (habitsDate === today) return;
    setHabitsDate(today);
    await AsyncStorage.setItem(HABITS_KEY, today);
    if (checklist) {
      save({ ...checklist, habitsDaysCount: (checklist.habitsDaysCount ?? 0) + 1 });
    }
  };

  const markAddonsDoneToday = async () => {
    const today = todayStr();
    if (addonsDate === today) return;
    setAddonsDate(today);
    await AsyncStorage.setItem(ADDONS_KEY, today);
    if (checklist) {
      save({ ...checklist, addonDaysCount: (checklist.addonDaysCount ?? 0) + 1 });
    }
  };

  const markMentalDoneToday = async () => {
    const today = todayStr();
    if (mentalDate === today) return;
    setMentalDate(today);
    await AsyncStorage.setItem(MENTAL_KEY, today);
    if (checklist) {
      save({ ...checklist, courseSessionsDone: checklist.courseSessionsDone + 1 });
    }
  };

  const markJournalDoneToday = async () => {
    const today = todayStr();
    if (journalDate === today) return;
    setJournalDate(today);
    await AsyncStorage.setItem(JOURNAL_KEY, today);
    if (checklist) {
      save({ ...checklist, journalEntries: checklist.journalEntries + 1 });
    }
  };

  const today = todayStr();
  const otcCheckedInToday  = readinessDate === today;
  const skillWorkDoneToday = skillWorkDate === today;
  const habitsDoneToday    = habitsDate === today;
  const addonsDoneToday    = addonsDate === today;
  const mentalDoneToday    = mentalDate === today;
  const journalDoneToday   = journalDate === today;

  const score = checklist ? computeAccountabilityScore(checklist, enabled) : 0;

  const result: AccountabilityResult | null = checklist
    ? { score, grade: getGrade(score), checklist, weekStart }
    : null;

  return {
    result,
    loaded,
    incrementWorkout,
    incrementReadiness,
    incrementMetrics,
    incrementCourse,
    otcCheckedInToday,
    skillWorkDoneToday,
    habitsDoneToday,
    addonsDoneToday,
    mentalDoneToday,
    journalDoneToday,
    markSkillWorkDoneToday,
    markHabitsDoneToday,
    markAddonsDoneToday,
    markMentalDoneToday,
    markJournalDoneToday,
  };
}
