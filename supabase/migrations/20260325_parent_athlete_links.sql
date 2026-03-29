-- Parent-Athlete linking table.
-- Real table: public.athlete_parent_links (already exists in production)
-- Real columns: parent_id, athlete_id (confirmed from RLS policy)
-- This migration is kept for reference and local dev setup.

-- Update users role CHECK to allow PARENT
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('ATHLETE', 'COACH', 'PARENT'));

-- Create linking table (matches production schema)
CREATE TABLE IF NOT EXISTS athlete_parent_links (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id   UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  athlete_id  UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (parent_id, athlete_id)
);

-- RLS: parents and athletes can read their own links
ALTER TABLE athlete_parent_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own links"
  ON athlete_parent_links FOR SELECT
  USING (parent_id = auth.uid() OR athlete_id = auth.uid());
