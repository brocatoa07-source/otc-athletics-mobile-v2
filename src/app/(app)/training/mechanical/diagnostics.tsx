/**
 * Hitting Diagnostics — DEPRECATED
 *
 * Hitting vault no longer has diagnostics. This screen redirects to the vault.
 * Kept as a route stub so deep links and back navigation don't break.
 */

import { useEffect } from 'react';
import { router } from 'expo-router';

export default function HittingDiagnosticsRedirect() {
  useEffect(() => {
    router.replace('/(app)/training/mechanical' as any);
  }, []);

  return null;
}
