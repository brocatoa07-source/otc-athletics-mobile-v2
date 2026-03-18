-- ============================================================================
-- Standardize diagnostic_type values to canonical naming scheme
--
-- Old -> New mapping:
--   archetype         -> mental-archetype
--   identity          -> mental-identity
--   habits            -> mental-habits
--   mover-type        -> hitting-mover
--   hitting-identity-v2 -> hitting-identity
--   mechanical        -> hitting-mechanical
--   lifting-mover     -> strength-mover
--
-- Migration order: update rows FIRST, then recreate the CHECK constraint.
-- ============================================================================

-- Step 1: Update existing rows to canonical names
UPDATE diagnostic_submissions SET diagnostic_type = 'mental-archetype'   WHERE diagnostic_type = 'archetype';
UPDATE diagnostic_submissions SET diagnostic_type = 'mental-identity'    WHERE diagnostic_type = 'identity';
UPDATE diagnostic_submissions SET diagnostic_type = 'mental-habits'      WHERE diagnostic_type = 'habits';
UPDATE diagnostic_submissions SET diagnostic_type = 'hitting-mover'      WHERE diagnostic_type = 'mover-type';
UPDATE diagnostic_submissions SET diagnostic_type = 'hitting-identity'   WHERE diagnostic_type = 'hitting-identity-v2';
UPDATE diagnostic_submissions SET diagnostic_type = 'hitting-mechanical' WHERE diagnostic_type = 'mechanical';
UPDATE diagnostic_submissions SET diagnostic_type = 'strength-mover'     WHERE diagnostic_type = 'lifting-mover';

-- Step 2: Drop old CHECK constraint
ALTER TABLE diagnostic_submissions
  DROP CONSTRAINT IF EXISTS diagnostic_submissions_diagnostic_type_check;

-- Step 3: Add new CHECK constraint with canonical names only
ALTER TABLE diagnostic_submissions
  ADD CONSTRAINT diagnostic_submissions_diagnostic_type_check
  CHECK (diagnostic_type IN (
    'mental-archetype',
    'mental-identity',
    'mental-habits',
    'hitting-mover',
    'hitting-identity',
    'hitting-mechanical',
    'strength-mover'
  ));
