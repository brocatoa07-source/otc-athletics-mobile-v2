-- Fix strength_profiles constraints for upsert compatibility
--
-- Problem: UNIQUE(generated_from_submission_id) causes conflicts with the
-- upsert onConflict: 'user_id' target because PostgREST sees multiple
-- unique constraints and can't resolve ambiguity.
--
-- Fix: Drop the generated_from_submission_id unique constraint.
-- This column should NOT be unique — on retakes, a new submission_id
-- replaces the old one in the same user_id row.

-- Drop the unique constraint on generated_from_submission_id
ALTER TABLE public.strength_profiles
  DROP CONSTRAINT IF EXISTS strength_profiles_generated_from_submission_id_key;

-- Also drop any auto-generated unique index
DROP INDEX IF EXISTS strength_profiles_generated_from_submission_id_key;

-- Verify user_id unique constraint still exists (idempotent)
-- This is the constraint the upsert targets
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.strength_profiles'::regclass
    AND contype = 'u'
    AND array_length(conkey, 1) = 1
    AND conkey[1] = (
      SELECT attnum FROM pg_attribute
      WHERE attrelid = 'public.strength_profiles'::regclass
      AND attname = 'user_id'
    )
  ) THEN
    ALTER TABLE public.strength_profiles ADD CONSTRAINT strength_profiles_user_id_key UNIQUE (user_id);
  END IF;
END $$;
