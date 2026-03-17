import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CONFIG_KEY = 'otc:required-today-config';

export type RequiredTodayItemKey =
  | 'readiness'
  | 'training'
  | 'skillWork'
  | 'mental'
  | 'journal'
  | 'habits'
  | 'addons';

export type RequiredTodayEnabled = Record<RequiredTodayItemKey, boolean>;

/** Fixed display + priority order — order never changes, only visibility. */
export const REQUIRED_TODAY_ORDER: RequiredTodayItemKey[] = [
  'readiness',
  'training',
  'skillWork',
  'mental',
  'journal',
  'habits',
  'addons',
];

export const REQUIRED_TODAY_META: Record<
  RequiredTodayItemKey,
  { label: string; icon: string; route: string; description: string }
> = {
  readiness: {
    label: 'Readiness Check',
    icon: 'pulse-outline',
    route: '/(app)/training/own-the-cost-checkin',
    description: 'Daily 4-question check-in before training',
  },
  training: {
    label: "Today's Session",
    icon: 'barbell-outline',
    route: '/(app)/training/sc/workout',
    description: 'Your personalized lifting or training session',
  },
  skillWork: {
    label: 'Skill Work',
    icon: 'baseball-outline',
    route: '/(app)/training/mechanical',
    description: 'Hitting drills, tee work, or cage session',
  },
  mental: {
    label: 'Mental Session',
    icon: 'sparkles-outline',
    route: '/(app)/training/mental',
    description: 'Course, visualization, or mental tool',
  },
  journal: {
    label: 'Journal Entry',
    icon: 'journal-outline',
    route: '/(app)/training/mental/journals',
    description: 'Reflect on training and mindset',
  },
  habits: {
    label: 'Habit Tracker',
    icon: 'checkmark-done-outline',
    route: '/(app)/training',
    description: 'Daily non-negotiables — coming soon',
  },
  addons: {
    label: 'Add-On Session',
    icon: 'add-circle-outline',
    route: '/(app)/training',
    description: 'Add-on content — coming soon',
  },
};

const DEFAULT_ENABLED: RequiredTodayEnabled = {
  readiness: true,
  training: true,
  skillWork: true,
  mental: true,
  journal: true,
  habits: false,
  addons: false,
};

export function useRequiredTodayConfig() {
  const [enabled, setEnabled] = useState<RequiredTodayEnabled>(DEFAULT_ENABLED);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    const raw = await AsyncStorage.getItem(CONFIG_KEY);
    if (raw) {
      try {
        setEnabled({ ...DEFAULT_ENABLED, ...JSON.parse(raw) });
      } catch {}
    }
    setLoaded(true);
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggle = async (key: RequiredTodayItemKey) => {
    const next = { ...enabled, [key]: !enabled[key] };
    // Require at least 1 item to remain enabled
    if (Object.values(next).some(Boolean)) {
      setEnabled(next);
      await AsyncStorage.setItem(CONFIG_KEY, JSON.stringify(next));
    }
  };

  /** Ordered list of enabled item keys */
  const enabledInOrder = REQUIRED_TODAY_ORDER.filter((k) => enabled[k]);

  return { enabled, enabledInOrder, loaded, toggle };
}
