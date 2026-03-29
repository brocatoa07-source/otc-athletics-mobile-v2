-- Parent invite codes table.
-- Athletes generate codes, parents redeem them to create athlete_parent_links rows.

CREATE TABLE IF NOT EXISTS parent_invite_codes (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id  UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code        TEXT        NOT NULL,
  is_active   BOOLEAN     NOT NULL DEFAULT true,
  redeemed_by UUID        REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (code)
);

-- Index for fast code lookup
CREATE INDEX IF NOT EXISTS idx_parent_invite_codes_code ON parent_invite_codes (code) WHERE is_active = true;

-- RLS
ALTER TABLE parent_invite_codes ENABLE ROW LEVEL SECURITY;

-- Athletes can manage their own codes
CREATE POLICY "Athletes can read own codes"
  ON parent_invite_codes FOR SELECT
  USING (athlete_id = auth.uid());

CREATE POLICY "Athletes can insert own codes"
  ON parent_invite_codes FOR INSERT
  WITH CHECK (athlete_id = auth.uid());

CREATE POLICY "Athletes can update own codes"
  ON parent_invite_codes FOR UPDATE
  USING (athlete_id = auth.uid());

-- Parents can read codes to redeem them (need to look up by code value)
CREATE POLICY "Parents can read active codes for redemption"
  ON parent_invite_codes FOR SELECT
  USING (is_active = true);

-- Parents can update codes to mark as redeemed
CREATE POLICY "Parents can redeem codes"
  ON parent_invite_codes FOR UPDATE
  USING (is_active = true AND redeemed_by IS NULL);

-- Parents can insert athlete_parent_links when redeeming
CREATE POLICY "Parents can create links"
  ON athlete_parent_links FOR INSERT
  WITH CHECK (parent_id = auth.uid());
