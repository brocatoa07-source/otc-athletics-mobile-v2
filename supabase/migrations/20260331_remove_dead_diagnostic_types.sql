-- Migration: Remove dead diagnostic types from CHECK constraint
--
-- 'timing-contact' and 'approach-performance' were added in a previous migration
-- but NO quiz screens, scoring logic, or hydration functions exist for them.
-- They are dead code in the schema. Removing them prevents accidental inserts
-- and keeps the constraint aligned with the app's canonical types.
--
-- Canonical types (matching diagnosticConstants.ts):
--   mental:  archetype, identity, habits
--   hitting: mover-type, mechanical
--   sc:      lifting-mover

ALTER TABLE diagnostic_submissions
  DROP CONSTRAINT IF EXISTS diagnostic_submissions_diagnostic_type_check;

ALTER TABLE diagnostic_submissions
  ADD CONSTRAINT diagnostic_submissions_diagnostic_type_check
  CHECK (diagnostic_type IN (
    'archetype', 'identity', 'habits',
    'mover-type', 'mechanical',
    'lifting-mover'
  ));
