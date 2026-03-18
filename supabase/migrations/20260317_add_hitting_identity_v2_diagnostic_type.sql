-- Add 'hitting-identity-v2' to the diagnostic_type check constraint
-- on diagnostic_submissions table.
--
-- The mover-type-quiz.tsx submits diagnosticType = 'hitting-identity-v2'
-- but the existing CHECK constraint only allows the original values,
-- causing Postgres error 23514 (CHECK CONSTRAINT VIOLATION).

ALTER TABLE diagnostic_submissions
  DROP CONSTRAINT IF EXISTS diagnostic_submissions_diagnostic_type_check;

ALTER TABLE diagnostic_submissions
  ADD CONSTRAINT diagnostic_submissions_diagnostic_type_check
  CHECK (diagnostic_type IN (
    'archetype', 'identity', 'habits',
    'mover-type', 'hitting-identity-v2',
    'mechanical', 'lifting-mover'
  ));
