import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CourseProgressData {
  inputs: Record<string, string>;
  checks: Record<string, boolean>;
  ratings: Record<string, number>;
  completedSections: string[];
}

const EMPTY: CourseProgressData = {
  inputs: {},
  checks: {},
  ratings: {},
  completedSections: [],
};

function storageKey(courseId: string) {
  return `otc:course-progress-${courseId}`;
}

export function useCourseProgress(courseId: string, totalSections: number) {
  const [data, setData] = useState<CourseProgressData>(EMPTY);
  const [loaded, setLoaded] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Load on mount
  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(storageKey(courseId));
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as CourseProgressData;
          setData({
            inputs: parsed.inputs ?? {},
            checks: parsed.checks ?? {},
            ratings: parsed.ratings ?? {},
            completedSections: parsed.completedSections ?? [],
          });
        } catch {}
      }
      setLoaded(true);
    })();
  }, [courseId]);

  // Debounced save
  const persist = useCallback((next: CourseProgressData) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      AsyncStorage.setItem(storageKey(courseId), JSON.stringify(next));
    }, 500);
  }, [courseId]);

  const setInput = useCallback((key: string, val: string) => {
    setData((prev) => {
      const next = { ...prev, inputs: { ...prev.inputs, [key]: val } };
      persist(next);
      return next;
    });
  }, [persist]);

  const toggleCheck = useCallback((key: string) => {
    setData((prev) => {
      const next = { ...prev, checks: { ...prev.checks, [key]: !prev.checks[key] } };
      persist(next);
      return next;
    });
  }, [persist]);

  const setRating = useCallback((key: string, val: number) => {
    setData((prev) => {
      const next = { ...prev, ratings: { ...prev.ratings, [key]: val } };
      persist(next);
      return next;
    });
  }, [persist]);

  const markSectionComplete = useCallback((weekNum: number, sectionId: string) => {
    const sectionKey = `w${weekNum}-${sectionId}`;
    setData((prev) => {
      if (prev.completedSections.includes(sectionKey)) return prev;
      const next = { ...prev, completedSections: [...prev.completedSections, sectionKey] };
      persist(next);
      return next;
    });
  }, [persist]);

  const unmarkSectionComplete = useCallback((weekNum: number, sectionId: string) => {
    const sectionKey = `w${weekNum}-${sectionId}`;
    setData((prev) => {
      const next = { ...prev, completedSections: prev.completedSections.filter((k) => k !== sectionKey) };
      persist(next);
      return next;
    });
  }, [persist]);

  const isSectionComplete = useCallback((weekNum: number, sectionId: string) => {
    return data.completedSections.includes(`w${weekNum}-${sectionId}`);
  }, [data.completedSections]);

  return {
    inputs: data.inputs,
    checks: data.checks,
    ratings: data.ratings,
    completedSections: data.completedSections,
    loaded,
    setInput,
    toggleCheck,
    setRating,
    markSectionComplete,
    unmarkSectionComplete,
    isSectionComplete,
    progress: {
      completed: data.completedSections.length,
      total: totalSections,
    },
  };
}

/** Lightweight reader for progress badges on the mental vault index */
export async function readCourseProgress(courseId: string): Promise<number> {
  const stored = await AsyncStorage.getItem(storageKey(courseId));
  if (!stored) return 0;
  try {
    const parsed = JSON.parse(stored) as CourseProgressData;
    return (parsed.completedSections ?? []).length;
  } catch {
    return 0;
  }
}
