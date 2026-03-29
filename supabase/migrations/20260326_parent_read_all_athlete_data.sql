-- Parent RLS policies for all athlete data tables.
-- Allows parents to read their linked athlete's data across:
-- athletes, users, diagnostic_submissions, athlete_progress, training_sessions

-- Drop any existing narrow parent policies to avoid conflicts
DROP POLICY IF EXISTS "Parents can read linked athletes" ON athletes;
DROP POLICY IF EXISTS "Parents can read linked users" ON users;
DROP POLICY IF EXISTS "Parents can read linked athlete diagnostics" ON diagnostic_submissions;

-- Parents can read linked athlete rows
CREATE POLICY "Parents can read linked athletes"
  ON athletes FOR SELECT
  USING (
    user_id IN (
      SELECT athlete_id FROM athlete_parent_links
      WHERE parent_id = auth.uid()
    )
  );

-- Parents can read linked athlete user rows (for name)
CREATE POLICY "Parents can read linked users"
  ON users FOR SELECT
  USING (
    id IN (
      SELECT athlete_id FROM athlete_parent_links
      WHERE parent_id = auth.uid()
    )
  );

-- Parents can read linked athlete diagnostic submissions
CREATE POLICY "Parents can read linked athlete diagnostics"
  ON diagnostic_submissions FOR SELECT
  USING (
    user_id IN (
      SELECT athlete_id FROM athlete_parent_links
      WHERE parent_id = auth.uid()
    )
  );

-- Parents can read linked athlete progress metrics
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'athlete_progress') THEN
    EXECUTE 'CREATE POLICY "Parents can read linked athlete progress" ON athlete_progress FOR SELECT USING (athlete_id IN (SELECT a.id FROM athletes a JOIN athlete_parent_links l ON a.user_id = l.athlete_id WHERE l.parent_id = auth.uid()))';
  END IF;
END $$;

-- Parents can read linked athlete training sessions
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'training_sessions') THEN
    EXECUTE 'CREATE POLICY "Parents can read linked athlete sessions" ON training_sessions FOR SELECT USING (athlete_id IN (SELECT a.id FROM athletes a JOIN athlete_parent_links l ON a.user_id = l.athlete_id WHERE l.parent_id = auth.uid()))';
  END IF;
END $$;
