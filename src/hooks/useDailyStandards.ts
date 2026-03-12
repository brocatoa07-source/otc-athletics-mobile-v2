import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface StandardItem {
  id: string;
  label: string;
  icon: string;
}

const STORAGE_KEYS = {
  STANDARDS: 'otc:daily-standards',
  COMPLETIONS: 'otc:daily-completions',
};

const DEFAULT_STANDARDS: StandardItem[] = [
  { id: 'sc', label: 'Complete S&C session', icon: 'barbell' },
  { id: 'drill', label: 'Run one drill', icon: 'baseball' },
  { id: 'journal', label: 'Journal entry', icon: 'pencil' },
  { id: 'mental', label: 'Mental reset tool', icon: 'bulb' },
  { id: 'film', label: 'Watch one vault video', icon: 'play-circle' },
];

// Completions stored as { "2026-02-23": ["sc","journal"], "2026-02-22": ["sc","drill","journal","mental","film"] }
type CompletionsMap = Record<string, string[]>;

function todayKey() {
  return new Date().toISOString().split('T')[0];
}

export function useDailyStandards() {
  const [standards, setStandards] = useState<StandardItem[]>(DEFAULT_STANDARDS);
  const [completions, setCompletions] = useState<CompletionsMap>({});
  const [loaded, setLoaded] = useState(false);

  // Load from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      const [storedStandards, storedCompletions] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.STANDARDS),
        AsyncStorage.getItem(STORAGE_KEYS.COMPLETIONS),
      ]);
      if (storedStandards) {
        try { setStandards(JSON.parse(storedStandards)); } catch {}
      }
      if (storedCompletions) {
        try { setCompletions(JSON.parse(storedCompletions)); } catch {}
      }
      setLoaded(true);
    })();
  }, []);

  // Today's checked items
  const today = todayKey();
  const todayChecked = new Set(completions[today] ?? []);

  const toggleItem = useCallback((id: string) => {
    setCompletions((prev) => {
      const dayItems = new Set(prev[today] ?? []);
      if (dayItems.has(id)) dayItems.delete(id);
      else dayItems.add(id);
      const next = { ...prev, [today]: Array.from(dayItems) };
      AsyncStorage.setItem(STORAGE_KEYS.COMPLETIONS, JSON.stringify(next));
      return next;
    });
  }, [today]);

  const updateStandards = useCallback((newStandards: StandardItem[]) => {
    setStandards(newStandards);
    AsyncStorage.setItem(STORAGE_KEYS.STANDARDS, JSON.stringify(newStandards));
  }, []);

  // Calculate streak: consecutive days (going back from today) where ALL standards were met
  const streak = (() => {
    if (!loaded || standards.length === 0) return 0;
    const standardIds = new Set(standards.map((s) => s.id));
    let count = 0;
    const d = new Date();

    for (let i = 0; i < 365; i++) {
      const key = d.toISOString().split('T')[0];
      const dayCompleted = new Set(completions[key] ?? []);
      const allMet = [...standardIds].every((id) => dayCompleted.has(id));

      if (allMet) {
        count++;
      } else {
        // If today is incomplete, don't break — just skip today (streak shows yesterday's count)
        if (i === 0) { /* today not yet complete, keep checking yesterday */ }
        else break;
      }
      d.setDate(d.getDate() - 1);
    }
    return count;
  })();

  // Last 7 days activity (did they meet ALL standards that day?)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().split('T')[0];
    const dayCompleted = new Set(completions[key] ?? []);
    const standardIds = standards.map((s) => s.id);
    const allMet = standardIds.length > 0 && standardIds.every((id) => dayCompleted.has(id));
    return {
      day: ['S', 'M', 'T', 'W', 'T', 'F', 'S'][d.getDay()],
      allMet,
      date: key,
    };
  });

  return {
    standards,
    updateStandards,
    todayChecked,
    toggleItem,
    streak,
    last7Days,
    loaded,
  };
}
