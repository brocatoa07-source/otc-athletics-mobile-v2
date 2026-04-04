/**
 * Diagnostic Event Logger — Structured logging for the diagnostic pipeline.
 *
 * Every diagnostic event is logged with consistent structure for debugging.
 * In production, these can be forwarded to analytics/monitoring.
 */

export type DiagnosticEventType =
  | 'diagnostic_submit_started'
  | 'diagnostic_submit_succeeded'
  | 'diagnostic_submit_failed'
  | 'profile_generation_started'
  | 'profile_generation_succeeded'
  | 'profile_generation_failed'
  | 'profile_read_succeeded'
  | 'profile_read_failed'
  | 'profile_backfill_started'
  | 'profile_backfill_succeeded'
  | 'profile_backfill_failed';

export type DiagnosticFailureCase =
  | 'submit_failed'
  | 'generation_failed'
  | 'profile_read_failed'
  | 'backfill_failed'
  | 'prerequisite_missing';

interface DiagnosticEvent {
  event: DiagnosticEventType;
  vault: string;
  diagnostic?: string;
  userId?: string;
  error?: string;
  durationMs?: number;
  metadata?: Record<string, unknown>;
}

const eventLog: DiagnosticEvent[] = [];

/**
 * Log a diagnostic pipeline event.
 * Always console.logs in dev. Stores in memory for debug panel access.
 */
export function logDiagnosticEvent(event: DiagnosticEvent): void {
  const timestamp = new Date().toISOString();
  const tag = `[diag:${event.event}]`;
  const details = [
    event.vault,
    event.diagnostic,
    event.error ? `ERROR: ${event.error}` : null,
    event.durationMs != null ? `${event.durationMs}ms` : null,
  ].filter(Boolean).join(' | ');

  if (__DEV__) {
    const isError = event.event.endsWith('_failed');
    if (isError) {
      console.error(tag, details);
    } else {
      console.log(tag, details);
    }
  }

  // Keep last 50 events in memory for debug panel
  eventLog.push({ ...event });
  if (eventLog.length > 50) eventLog.shift();
}

/**
 * Get recent diagnostic events (for debug panel).
 */
export function getRecentDiagnosticEvents(): DiagnosticEvent[] {
  return [...eventLog];
}

/**
 * Create a timing helper for measuring operation duration.
 */
export function startTimer(): () => number {
  const start = Date.now();
  return () => Date.now() - start;
}
