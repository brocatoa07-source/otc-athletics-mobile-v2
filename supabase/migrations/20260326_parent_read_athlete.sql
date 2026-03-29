-- Allow parents to read their linked athlete's row from the athletes table.
-- Without this, the parent dashboard shows WALK as a fallback because RLS blocks the read.

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
