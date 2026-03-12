/**
 * DEV-only role override — lets you toggle between Athlete / Coach views
 * without signing out or touching the database.
 *
 * In production builds (__DEV__ === false) every function is a no-op / returns null,
 * and Metro dead-code-eliminates the AsyncStorage import.
 */
import { useState, useEffect } from 'react';

type RoleOverride = 'ATHLETE' | 'COACH' | null;

// ── In-memory cache so every hook instance shares the same value ──
let _cache: RoleOverride = null;
let _listeners: Array<(v: RoleOverride) => void> = [];

function notify(value: RoleOverride) {
  _cache = value;
  _listeners.forEach((fn) => fn(value));
}

// ── Persistence (AsyncStorage, loaded lazily) ──

const STORAGE_KEY = '@otc_dev_role_override';

async function loadFromStorage(): Promise<RoleOverride> {
  if (!__DEV__) return null;
  try {
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw === 'ATHLETE' || raw === 'COACH') return raw;
    return null;
  } catch {
    return null;
  }
}

async function saveToStorage(value: RoleOverride) {
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
export function getDevRoleOverride(): RoleOverride {
  if (!__DEV__) return null;
  return _cache;
}

/** Set or clear the override. Persists to AsyncStorage and notifies all hooks. */
export async function setDevRoleOverride(value: RoleOverride) {
  if (!__DEV__) return;
  await saveToStorage(value);
  notify(value);
}

/**
 * React hook — returns the effective role: devOverride ?? profileRole.
 *
 * Usage:
 *   const effectiveIsCoach = useEffectiveRole(!!coachProfile);
 *
 * When a dev override is active, this returns the overridden value.
 * When null (default), it passes through the real profile value.
 */
export function useDevRoleOverride(): RoleOverride {
  const [override, setOverride] = useState<RoleOverride>(_cache);

  useEffect(() => {
    if (!__DEV__) return;

    // Hydrate from AsyncStorage on first mount
    loadFromStorage().then((stored) => {
      if (stored !== _cache) {
        _cache = stored;
        setOverride(stored);
      }
    });

    // Subscribe to changes from other callers of setDevRoleOverride
    const listener = (v: RoleOverride) => setOverride(v);
    _listeners.push(listener);
    return () => {
      _listeners = _listeners.filter((fn) => fn !== listener);
    };
  }, []);

  if (!__DEV__) return null;
  return override;
}
