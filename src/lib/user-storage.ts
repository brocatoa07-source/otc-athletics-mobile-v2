/**
 * User-scoped storage isolation.
 *
 * All user-specific AsyncStorage keys start with "otc:". When the authenticated
 * user changes (logout → login, or direct account switch) we must clear every
 * "otc:*" key so the new user starts with a clean local slate.
 *
 * Keys that are intentionally global (dev overrides, Supabase session, etc.)
 * use a different prefix (@otc_dev_*, sb-*) and are NOT cleared.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_USER_KEY = '@otc_last_user_id';

/**
 * Clear all user-specific local state.
 * Call on logout and whenever the authenticated user ID changes.
 */
export async function clearUserLocalState(): Promise<void> {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const userKeys = allKeys.filter((k) =>
      k.startsWith('otc:') ||
      k.startsWith('coach-notes-') ||
      k.startsWith('coach-focus-') ||
      k === 'movement-archetype',
    );
    if (userKeys.length > 0) {
      await AsyncStorage.multiRemove(userKeys);
    }
    if (__DEV__) console.log(`[user-storage] cleared ${userKeys.length} user-specific keys`);
  } catch (e) {
    if (__DEV__) console.error('[user-storage] clear failed:', e);
  }
}

/**
 * Detect whether the authenticated user changed since last launch.
 * If the user ID differs from the stored last-user, clear all stale local
 * state and record the new user ID.
 *
 * Returns true if state was cleared (account switch detected).
 */
export async function handleUserSwitch(currentUserId: string): Promise<boolean> {
  try {
    const lastUserId = await AsyncStorage.getItem(LAST_USER_KEY);

    if (lastUserId === currentUserId) {
      return false; // same user, nothing to do
    }

    // Different user (or first login on this device) — clear stale state
    if (lastUserId !== null) {
      if (__DEV__) console.log(`[user-storage] account switch detected: ${lastUserId} → ${currentUserId}`);
      await clearUserLocalState();
    }

    await AsyncStorage.setItem(LAST_USER_KEY, currentUserId);
    return lastUserId !== null;
  } catch (e) {
    if (__DEV__) console.error('[user-storage] handleUserSwitch failed:', e);
    return false;
  }
}
