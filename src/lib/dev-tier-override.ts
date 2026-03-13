/**
 * DEV-only tier override — lets you preview the app as any tier
 * without changing the database.
 *
 * In production builds (__DEV__ === false) every function is a no-op / returns null,
 * and Metro dead-code-eliminates the AsyncStorage import.
 */
import { useState, useEffect } from 'react';
import type { AthleteTier } from '@/types/database';

export type TierOverride = AthleteTier | null;

// ── In-memory cache so every hook instance shares the same value ──
let _cache: TierOverride = null;
let _listeners: Array<(v: TierOverride) => void> = [];

function notify(value: TierOverride) {
  _cache = value;
  _listeners.forEach((fn) => fn(value));
}

// ── Persistence (AsyncStorage, loaded lazily) ──

const STORAGE_KEY = '@otc_dev_tier_override';

async function loadFromStorage(): Promise<TierOverride> {
  if (!__DEV__) return null;
  try {
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw === 'WALK' || raw === 'SINGLE' || raw === 'DOUBLE' || raw === 'TRIPLE' || raw === 'HOME_RUN') {
      return raw as AthleteTier;
    }
    return null;
  } catch {
    return null;
  }
}

async function saveToStorage(value: TierOverride) {
  if (!__DEV__) return;
  try {
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    if (value === null) {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } else {
      await AsyncStorage.setItem(STORAGE_KEY, value);
    }
  } catch {
    // swallow — dev convenience only
  }
}

// ── Public API ──

/** Read the current override (sync, from cache). */
export function getDevTierOverride(): TierOverride {
  if (!__DEV__) return null;
  return _cache;
}

/** Set or clear the override. Persists to AsyncStorage and notifies all hooks. */
export async function setDevTierOverride(value: TierOverride) {
  if (!__DEV__) return;
  await saveToStorage(value);
  notify(value);
}

/**
 * React hook — returns the current dev tier override.
 * Returns null when no override is active (use real tier).
 */
export function useDevTierOverride(): TierOverride {
  const [override, setOverride] = useState<TierOverride>(_cache);

  useEffect(() => {
    if (!__DEV__) return;

    // Hydrate from AsyncStorage on first mount
    loadFromStorage().then((stored) => {
      if (stored !== _cache) {
        _cache = stored;
        setOverride(stored);
      }
    });

    // Subscribe to changes from other callers of setDevTierOverride
    const listener = (v: TierOverride) => setOverride(v);
    _listeners.push(listener);
    return () => {
      _listeners = _listeners.filter((fn) => fn !== listener);
    };
  }, []);

  if (!__DEV__) return null;
  return override;
}
