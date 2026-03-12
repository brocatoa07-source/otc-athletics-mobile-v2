import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ReadinessResult } from '@/data/readiness-engine';

const STORAGE_KEY = 'otc:readiness';

/**
 * Persists today's readiness check-in.
 * Only one result per day — re-checking overwrites.
 */
export function useReadiness() {
  const [readiness, setReadiness] = useState<ReadinessResult | null>(null);
  const [loaded, setLoaded] = useState(false);

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          const data: ReadinessResult = JSON.parse(raw);
          // Only use if completed today
          if (data.completedAt?.startsWith(today)) {
            setReadiness(data);
          }
        } catch {}
      }
      setLoaded(true);
    });
  }, [today]);

  const saveReadiness = useCallback(async (data: ReadinessResult) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setReadiness(data);
  }, []);

  const clearReadiness = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setReadiness(null);
  }, []);

  return { readiness, loaded, saveReadiness, clearReadiness };
}
