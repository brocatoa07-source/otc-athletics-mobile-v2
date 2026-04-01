/**
 * Mechanical Diagnostic Quiz — DEPRECATED
 *
 * Hitting vault no longer has diagnostics. Redirects to the vault.
 * Kept as route stub so deep links don't break.
 */

import { useEffect } from 'react';
import { router } from 'expo-router';

export default function MechanicalDiagnosticRedirect() {
  useEffect(() => {
    router.replace('/(app)/training/mechanical' as any);
  }, []);

  return null;
}
