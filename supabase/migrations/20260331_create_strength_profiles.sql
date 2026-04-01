-- ============================================================================
-- OTC Strength Profile System v1 — Production Migration
--
-- Creates the strength_profiles table for the prescription engine.
-- This table stores GENERATED interpreted profiles (not raw quiz answers).
-- Raw quiz answers live in diagnostic_submissions.
-- ============================================================================

-- Drop old version if it exists (idempotent)
DROP TABLE IF EXISTS strength_profiles;

CREATE TABLE strength_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  version TEXT NOT NULL DEFAULT 'v1',

  -- Classification
  primary_archetype TEXT NOT NULL CHECK (primary_archetype IN ('static', 'spring', 'hybrid')),
  archetype_confidence NUMERIC CHECK (archetype_confidence >= 0 AND archetype_confidence <= 1),

  secondary_need TEXT NOT NULL CHECK (secondary_need IN ('mobility', 'stability_control', 'strength', 'elasticity', 'speed_rotation')),

  force_bias TEXT CHECK (force_bias IN ('force_dominant', 'elastic_dominant', 'balanced')),
  control_bias TEXT CHECK (control_bias IN ('stable', 'leaky', 'mixed')),

  -- Individual need scores
  mobility_score INTEGER DEFAULT 0,
  stability_control_score INTEGER DEFAULT 0,
  strength_score INTEGER DEFAULT 0,
  elasticity_score INTEGER DEFAULT 0,
  speed_rotation_score INTEGER DEFAULT 0,

  -- Archetype scores
  static_score INTEGER DEFAULT 0,
  spring_score INTEGER DEFAULT 0,
  hybrid_score INTEGER DEFAULT 0,

  -- Priorities
  top_training_priorities JSONB NOT NULL DEFAULT '[]',
  avoid_overemphasis JSONB NOT NULL DEFAULT '[]',

  -- Routing
  daily_work_focus TEXT NOT NULL CHECK (daily_work_focus IN ('mobility_access', 'position_control', 'strength_base', 'elastic_reactivity', 'speed_rotation')),
  my_path_start_point TEXT NOT NULL CHECK (my_path_start_point IN ('own_positions', 'build_strength_base', 'build_elasticity', 'improve_acceleration', 'improve_rotation')),

  -- Programming bias arrays
  prep_bias JSONB NOT NULL DEFAULT '[]',
  plyo_bias JSONB NOT NULL DEFAULT '[]',
  sprint_bias JSONB NOT NULL DEFAULT '[]',
  strength_bias JSONB NOT NULL DEFAULT '[]',
  accessory_bias JSONB NOT NULL DEFAULT '[]',
  conditioning_bias JSONB NOT NULL DEFAULT '[]',
  recovery_bias JSONB NOT NULL DEFAULT '[]',

  -- Notes and recommendations
  programming_notes JSONB DEFAULT '[]',
  recommended_block_swaps JSONB DEFAULT '[]',

  -- Raw scoring data
  raw_need_scores JSONB,
  raw_archetype_scores JSONB,

  -- Lineage
  generated_from_submission_id UUID,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(user_id)
);

-- ── RLS ──────────────────────────────────────────────────────────────────────

ALTER TABLE strength_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own strength profile"
  ON strength_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own strength profile"
  ON strength_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own strength profile"
  ON strength_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Parents can read linked athlete strength profiles"
  ON strength_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM athlete_parent_links
      WHERE athlete_parent_links.athlete_id = strength_profiles.user_id
        AND athlete_parent_links.parent_id = auth.uid()
    )
  );

-- ── Clean up dead diagnostic types ───────────────────────────────────────────

ALTER TABLE diagnostic_submissions
  DROP CONSTRAINT IF EXISTS diagnostic_submissions_diagnostic_type_check;

ALTER TABLE diagnostic_submissions
  ADD CONSTRAINT diagnostic_submissions_diagnostic_type_check
  CHECK (diagnostic_type IN (
    'archetype', 'identity', 'habits',
    'lifting-mover'
  ));
