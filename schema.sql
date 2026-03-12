-- ============================================================================
-- OTC Lab v2 — Canonical Database Schema
-- ============================================================================
-- This file is the SINGLE SOURCE OF TRUTH for the entire application database.
-- All TypeScript types in src/types/database.ts must mirror this schema exactly.
--
-- Naming rules:
--   user_id   → always references users.id (= auth.users.id)
--   athlete_id → always references athletes.id (NOT auth.uid)
--   coach_id  → always references coaches.id
--
-- RLS is enabled on every table.
-- All policies use idempotent DO $$ IF NOT EXISTS pattern.
--
-- Execution order:
--   1. Extensions
--   2. Functions (helpers)
--   3. Tables (dependency-ordered)
--   4. Indexes
--   5. Triggers
--   6. Enable RLS
--   7. RLS Policies
--   8. Auto-sync trigger (auth.users → public.users)
-- ============================================================================


-- ============================================================================
-- 1. EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ============================================================================
-- 2. FUNCTIONS (helpers)
-- ============================================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'ATHLETE')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    updated_at = now();
  RETURN NEW;
END;
$$;


-- ============================================================================
-- 3. TABLES (dependency-ordered)
-- ============================================================================

-- ── users ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT        NOT NULL,
  full_name   TEXT        NOT NULL,
  username    TEXT        UNIQUE,
  avatar_url  TEXT,
  role        TEXT        NOT NULL DEFAULT 'ATHLETE'
                          CHECK (role IN ('ATHLETE', 'COACH')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── athletes ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS athletes (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  tier            TEXT        NOT NULL DEFAULT 'WALK'
                              CHECK (tier IN ('WALK','SINGLE','DOUBLE','TRIPLE','HOME_RUN')),
  sport           TEXT        NOT NULL DEFAULT 'baseball',
  position        TEXT,
  age             INT,
  mover_type      TEXT,
  mental_archetype TEXT,
  sc_experience   TEXT,
  sc_equipment    TEXT,
  sc_timeline     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── coaches ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS coaches (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID        NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  bio                   TEXT,
  specialization        TEXT,
  connect_code          TEXT        UNIQUE,
  max_home_run_slots    INT         NOT NULL DEFAULT 10,
  current_home_run_count INT        NOT NULL DEFAULT 0,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── coach_connections ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS coach_connections (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id  UUID        NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  coach_id    UUID        NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
  status      TEXT        NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending','active','denied','removed')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (athlete_id, coach_id)
);

-- ── programs ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS programs (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id   UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title           TEXT        NOT NULL,
  description     TEXT,
  program_type    TEXT        NOT NULL CHECK (program_type IN ('lifting','hitting','general')),
  duration_weeks  INT,
  total_days      INT,
  focus_notes     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── program_assignments ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS program_assignments (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id      UUID        NOT NULL REFERENCES programs(id),
  athlete_id      UUID        NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  program_type    TEXT        CHECK (program_type IN ('lifting','hitting','general')),
  current_week    INT         NOT NULL DEFAULT 1,
  current_day     INT         NOT NULL DEFAULT 1,
  active          BOOLEAN     NOT NULL DEFAULT true,
  assigned_by     UUID        REFERENCES users(id),
  start_date      DATE,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── workouts ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS workouts (
  id            UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id    UUID  NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  week_number   INT   NOT NULL,
  day_label     TEXT  NOT NULL,
  day_type      TEXT  NOT NULL CHECK (day_type IN ('strength','active_recovery')),
  order_index   INT   NOT NULL DEFAULT 0,
  UNIQUE (program_id, week_number, day_label)
);

-- ── workout_items ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS workout_items (
  id                UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id        UUID  NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  category          TEXT  NOT NULL,
  order_index       INT   NOT NULL DEFAULT 0,
  superset_group    TEXT,
  exercise_name_raw TEXT  NOT NULL,
  notes             TEXT
);

-- ── workout_sets ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS workout_sets (
  id              UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_item_id UUID  NOT NULL REFERENCES workout_items(id) ON DELETE CASCADE,
  set_number      INT   NOT NULL,
  reps            TEXT,
  load            TEXT,
  tempo           TEXT,
  rest_sec        INT,
  UNIQUE (workout_item_id, set_number)
);

-- ── training_sessions ───────────────────────────────────────────────────────
-- Merges legacy workout_sessions + training_sessions into one table.

CREATE TABLE IF NOT EXISTS training_sessions (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id   UUID        NOT NULL REFERENCES program_assignments(id) ON DELETE CASCADE,
  athlete_id      UUID        NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  week_index      INT         NOT NULL,
  day_index       INT         NOT NULL,
  status          TEXT        NOT NULL DEFAULT 'in_progress'
                              CHECK (status IN ('in_progress','completed')),
  finished_at     TIMESTAMPTZ,
  proof_url       TEXT,
  notes           TEXT,
  rpe             INT         CHECK (rpe BETWEEN 1 AND 10),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── exercise_logs ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS exercise_logs (
  id                    UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  training_session_id   UUID  NOT NULL REFERENCES training_sessions(id) ON DELETE CASCADE,
  program_exercise_id   UUID,
  exercise_name         TEXT  NOT NULL,
  order_index           INT   NOT NULL DEFAULT 0,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (training_session_id, program_exercise_id)
);

-- ── set_logs ────────────────────────────────────────────────────────────────
-- THE ONLY PLACE WEIGHTS ARE STORED.

CREATE TABLE IF NOT EXISTS set_logs (
  id              UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_log_id UUID    NOT NULL REFERENCES exercise_logs(id) ON DELETE CASCADE,
  set_index       INT     NOT NULL CHECK (set_index > 0),
  target_reps     TEXT,
  completed_reps  INT     CHECK (completed_reps >= 0),
  weight          NUMERIC CHECK (weight >= 0),
  rpe             INT     CHECK (rpe BETWEEN 1 AND 10),
  is_completed    BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (exercise_log_id, set_index)
);

-- ── drill_logs ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS drill_logs (
  id                  UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  training_session_id UUID    NOT NULL REFERENCES training_sessions(id) ON DELETE CASCADE,
  drill_id            TEXT    NOT NULL,
  drill_name          TEXT    NOT NULL,
  order_index         INT     NOT NULL DEFAULT 0,
  is_completed        BOOLEAN NOT NULL DEFAULT false,
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── diagnostic_submissions ──────────────────────────────────────────────────
-- Single source of truth for vault gating.
-- A vault is unlocked when ALL its required diagnostics have a submission row.

CREATE TABLE IF NOT EXISTS diagnostic_submissions (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vault_type      TEXT        NOT NULL CHECK (vault_type IN ('mental','hitting','sc')),
  diagnostic_type TEXT        NOT NULL CHECK (diagnostic_type IN (
                              'archetype','identity','habits',
                              'mover-type','mechanical','lifting-mover')),
  result_payload  JSONB       NOT NULL DEFAULT '{}'::jsonb,
  submitted_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, vault_type, diagnostic_type)
);

-- ── mental_profiles ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS mental_profiles (
  id                  UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID    NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  primary_archetype   TEXT    NOT NULL,
  secondary_archetype TEXT,
  archetype_scores    JSONB   NOT NULL DEFAULT '{}'::jsonb,
  identity_profile    TEXT,
  iss                 NUMERIC,
  approval_load       NUMERIC,
  outcome_attachment  NUMERIC,
  habit_profile       TEXT,
  hss                 NUMERIC,
  habit_subscores     JSONB   NOT NULL DEFAULT '{}'::jsonb,
  primary_focus       JSONB   NOT NULL DEFAULT '[]'::jsonb,
  recommended_tools   JSONB   NOT NULL DEFAULT '[]'::jsonb,
  version             INT     NOT NULL DEFAULT 1,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── athlete_progress ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS athlete_progress (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id      UUID        NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  metric_type     TEXT        NOT NULL CHECK (metric_type IN (
                              'exit_velocity_mph','sprint_60yd_seconds',
                              'throw_velocity_mph','sprint_10yd_seconds',
                              'bat_speed_mph','vertical_jump_inches',
                              'broad_jump_inches','rot_power_watts','strength_index')),
  value           NUMERIC     NOT NULL,
  recorded_at     DATE        NOT NULL DEFAULT current_date,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── athlete_logs ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS athlete_logs (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  log_type    TEXT        NOT NULL,
  log_date    DATE        NOT NULL DEFAULT current_date,
  payload     JSONB       NOT NULL DEFAULT '{}'::jsonb,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, log_type, log_date)
);

-- ── drills ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS drills (
  id          UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT  NOT NULL,
  category    TEXT,
  description TEXT,
  video_url   TEXT,
  tags        JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── vault_content ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS vault_content (
  id              UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id        UUID    NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
  title           TEXT    NOT NULL,
  description     TEXT,
  content_type    TEXT    NOT NULL CHECK (content_type IN ('DRILL','CONCEPT','BREAKDOWN','VIDEO_VAULT')),
  vault_type      TEXT    NOT NULL CHECK (vault_type IN ('hitting','sc','mental')),
  video_url       TEXT,
  thumbnail_url   TEXT,
  tier_access     TEXT    NOT NULL DEFAULT 'WALK'
                          CHECK (tier_access IN ('WALK','SINGLE','DOUBLE','TRIPLE','HOME_RUN')),
  tags            JSONB   NOT NULL DEFAULT '[]'::jsonb,
  phase           TEXT,
  skill           TEXT,
  is_public       BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── courses ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS courses (
  id          UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  key         TEXT  NOT NULL UNIQUE,
  title       TEXT  NOT NULL,
  description TEXT,
  tier_access TEXT  NOT NULL DEFAULT 'DOUBLE'
                    CHECK (tier_access IN ('WALK','SINGLE','DOUBLE','TRIPLE','HOME_RUN')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── conversations ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS conversations (
  id                  UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_type   TEXT    NOT NULL DEFAULT 'dm'
                              CHECK (conversation_type IN ('dm','group')),
  created_by          UUID    NOT NULL REFERENCES users(id),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── conversation_members ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS conversation_members (
  id                UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id   UUID    NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id           UUID    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role              TEXT    CHECK (role IN ('athlete','coach')),
  joined_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (conversation_id, user_id)
);

-- ── messages ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS messages (
  id              UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID    NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       UUID    NOT NULL REFERENCES users(id),
  body            TEXT,
  media_url       TEXT,
  media_type      TEXT    CHECK (media_type IN ('video','image','audio','file')),
  read_by         UUID[]  NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── announcements ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS announcements (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id   UUID    NOT NULL REFERENCES users(id),
  title       TEXT    NOT NULL,
  body        TEXT    NOT NULL,
  audience    TEXT    NOT NULL DEFAULT 'all'
                      CHECK (audience IN ('all','athletes','coaches')),
  is_pinned   BOOLEAN NOT NULL DEFAULT false,
  attachments JSONB   NOT NULL DEFAULT '[]'::jsonb,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── community_posts ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS community_posts (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id   UUID    NOT NULL REFERENCES users(id),
  body        TEXT    NOT NULL,
  media_url   TEXT,
  likes       UUID[]  NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── notification_events ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS notification_events (
  id              UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id    UUID    NOT NULL REFERENCES users(id),
  type            TEXT    NOT NULL,
  title           TEXT    NOT NULL,
  body            TEXT    NOT NULL,
  data            JSONB   NOT NULL DEFAULT '{}'::jsonb,
  status          TEXT    NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending','sent','failed')),
  error           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_at         TIMESTAMPTZ
);

-- ── push_tokens ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS push_tokens (
  id              UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expo_push_token TEXT    NOT NULL,
  platform        TEXT    NOT NULL CHECK (platform IN ('ios','android','web')),
  device_id       TEXT,
  is_enabled      BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, expo_push_token)
);


-- ============================================================================
-- 4. INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_assignments_athlete_active
  ON program_assignments(athlete_id) WHERE active = true;

CREATE UNIQUE INDEX IF NOT EXISTS uq_session_assignment_week_day
  ON training_sessions(assignment_id, week_index, day_index);

CREATE INDEX IF NOT EXISTS idx_diagnostic_submissions_user
  ON diagnostic_submissions(user_id);

CREATE INDEX IF NOT EXISTS idx_athlete_progress_type_date
  ON athlete_progress(athlete_id, metric_type, recorded_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_created
  ON messages(conversation_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notification_events_pending
  ON notification_events(status) WHERE status = 'pending';


-- ============================================================================
-- 5. TRIGGERS
-- ============================================================================

CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_athletes_updated_at BEFORE UPDATE ON athletes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_coaches_updated_at BEFORE UPDATE ON coaches
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_coach_connections_updated_at BEFORE UPDATE ON coach_connections
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_programs_updated_at BEFORE UPDATE ON programs
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_diagnostic_submissions_updated_at BEFORE UPDATE ON diagnostic_submissions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_mental_profiles_updated_at BEFORE UPDATE ON mental_profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_athlete_logs_updated_at BEFORE UPDATE ON athlete_logs
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_vault_content_updated_at BEFORE UPDATE ON vault_content
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_community_posts_updated_at BEFORE UPDATE ON community_posts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_push_tokens_updated_at BEFORE UPDATE ON push_tokens
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ============================================================================
-- 6. ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE athletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE set_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE drill_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnostic_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mental_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE athlete_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE athlete_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE drills ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;


-- ============================================================================
-- 7. RLS POLICIES
-- ============================================================================
-- All tables referenced in sub-selects (coaches, coach_connections, athletes,
-- conversation_members, etc.) are guaranteed to exist at this point.

-- ── users policies ──────────────────────────────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users'
    AND policyname = 'Users can manage own row') THEN
    CREATE POLICY "Users can manage own row" ON users
      FOR ALL USING (id = auth.uid()) WITH CHECK (id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users'
    AND policyname = 'Coaches can read any user') THEN
   -- CREATE POLICY "Coaches can read any user" ON users
   -- FOR SELECT USING (
   --     EXISTS (SELECT 1 FROM coaches WHERE user_id = auth.uid())
   --   );
  END IF;
END $$;

-- ── athletes policies ───────────────────────────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'athletes'
    AND policyname = 'Athletes can manage own row') THEN
    CREATE POLICY "Athletes can manage own row" ON athletes
      FOR ALL
      USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'athletes'
    AND policyname = 'Coaches can read connected athletes') THEN
    CREATE POLICY "Coaches can read connected athletes" ON athletes
      FOR SELECT USING (
        id IN (
          SELECT cc.athlete_id FROM coach_connections cc
          JOIN coaches c ON c.id = cc.coach_id
          WHERE c.user_id = auth.uid() AND cc.status = 'active'
        )
      );
  END IF;
END $$;

-- ── coaches policies ────────────────────────────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'coaches'
    AND policyname = 'Coaches can manage own row') THEN
    CREATE POLICY "Coaches can manage own row" ON coaches
      FOR ALL
      USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'coaches'
    AND policyname = 'Anyone can read coaches') THEN
    CREATE POLICY "Anyone can read coaches" ON coaches
      FOR SELECT USING (auth.uid() IS NOT NULL);
  END IF;
END $$;

-- ── coach_connections policies ───────────────────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'coach_connections'
    AND policyname = 'Athletes can manage own connections') THEN
    CREATE POLICY "Athletes can manage own connections" ON coach_connections
      FOR ALL USING (
        athlete_id IN (SELECT id FROM athletes WHERE user_id = auth.uid())
      ) WITH CHECK (
        athlete_id IN (SELECT id FROM athletes WHERE user_id = auth.uid())
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'coach_connections'
    AND policyname = 'Coaches can manage own connections') THEN
    CREATE POLICY "Coaches can manage own connections" ON coach_connections
      FOR ALL USING (
        coach_id IN (SELECT id FROM coaches WHERE user_id = auth.uid())
      ) WITH CHECK (
        coach_id IN (SELECT id FROM coaches WHERE user_id = auth.uid())
      );
  END IF;
END $$;

-- ── programs policies ───────────────────────────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'programs'
    AND policyname = 'Authenticated users can read programs') THEN
    CREATE POLICY "Authenticated users can read programs" ON programs
      FOR SELECT USING (auth.uid() IS NOT NULL);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'programs'
    AND policyname = 'Owners can manage programs') THEN
    CREATE POLICY "Owners can manage programs" ON programs
      FOR ALL USING (owner_user_id = auth.uid())
      WITH CHECK (owner_user_id = auth.uid());
  END IF;
END $$;

-- ── program_assignments policies ────────────────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'program_assignments'
    AND policyname = 'Athletes can read own assignments') THEN
    CREATE POLICY "Athletes can read own assignments" ON program_assignments
      FOR SELECT USING (
        athlete_id IN (SELECT id FROM athletes WHERE user_id = auth.uid())
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'program_assignments'
    AND policyname = 'Coaches can manage connected athlete assignments') THEN
    CREATE POLICY "Coaches can manage connected athlete assignments" ON program_assignments
      FOR ALL USING (
        athlete_id IN (
          SELECT cc.athlete_id FROM coach_connections cc
          JOIN coaches c ON c.id = cc.coach_id
          WHERE c.user_id = auth.uid() AND cc.status = 'active'
        )
      ) WITH CHECK (
        athlete_id IN (
          SELECT cc.athlete_id FROM coach_connections cc
          JOIN coaches c ON c.id = cc.coach_id
          WHERE c.user_id = auth.uid() AND cc.status = 'active'
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'program_assignments'
    AND policyname = 'Athletes can update own assignments') THEN
    CREATE POLICY "Athletes can update own assignments" ON program_assignments
      FOR UPDATE USING (
        athlete_id IN (SELECT id FROM athletes WHERE user_id = auth.uid())
      ) WITH CHECK (
        athlete_id IN (SELECT id FROM athletes WHERE user_id = auth.uid())
      );
  END IF;
END $$;

-- ── workouts policies ───────────────────────────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'workouts'
    AND policyname = 'Authenticated users can read workouts') THEN
    CREATE POLICY "Authenticated users can read workouts" ON workouts
      FOR SELECT USING (auth.uid() IS NOT NULL);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'workouts'
    AND policyname = 'Program owners can manage workouts') THEN
    CREATE POLICY "Program owners can manage workouts" ON workouts
      FOR ALL USING (
        program_id IN (SELECT id FROM programs WHERE owner_user_id = auth.uid())
      ) WITH CHECK (
        program_id IN (SELECT id FROM programs WHERE owner_user_id = auth.uid())
      );
  END IF;
END $$;

-- ── workout_items policies ──────────────────────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'workout_items'
    AND policyname = 'Authenticated users can read workout items') THEN
    CREATE POLICY "Authenticated users can read workout items" ON workout_items
      FOR SELECT USING (auth.uid() IS NOT NULL);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'workout_items'
    AND policyname = 'Program owners can manage workout items') THEN
    CREATE POLICY "Program owners can manage workout items" ON workout_items
      FOR ALL USING (
        workout_id IN (
          SELECT w.id FROM workouts w
          JOIN programs p ON p.id = w.program_id
          WHERE p.owner_user_id = auth.uid()
        )
      ) WITH CHECK (
        workout_id IN (
          SELECT w.id FROM workouts w
          JOIN programs p ON p.id = w.program_id
          WHERE p.owner_user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- ── workout_sets policies ───────────────────────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'workout_sets'
    AND policyname = 'Authenticated users can read workout sets') THEN
    CREATE POLICY "Authenticated users can read workout sets" ON workout_sets
      FOR SELECT USING (auth.uid() IS NOT NULL);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'workout_sets'
    AND policyname = 'Program owners can manage workout sets') THEN
    CREATE POLICY "Program owners can manage workout sets" ON workout_sets
      FOR ALL USING (
        workout_item_id IN (
          SELECT wi.id FROM workout_items wi
          JOIN workouts w ON w.id = wi.workout_id
          JOIN programs p ON p.id = w.program_id
          WHERE p.owner_user_id = auth.uid()
        )
      ) WITH CHECK (
        workout_item_id IN (
          SELECT wi.id FROM workout_items wi
          JOIN workouts w ON w.id = wi.workout_id
          JOIN programs p ON p.id = w.program_id
          WHERE p.owner_user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- ── training_sessions policies ──────────────────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'training_sessions'
    AND policyname = 'Athletes can manage own sessions') THEN
    CREATE POLICY "Athletes can manage own sessions" ON training_sessions
      FOR ALL USING (
        athlete_id IN (SELECT id FROM athletes WHERE user_id = auth.uid())
      ) WITH CHECK (
        athlete_id IN (SELECT id FROM athletes WHERE user_id = auth.uid())
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'training_sessions'
    AND policyname = 'Coaches can read connected athlete sessions') THEN
    CREATE POLICY "Coaches can read connected athlete sessions" ON training_sessions
      FOR SELECT USING (
        athlete_id IN (
          SELECT cc.athlete_id FROM coach_connections cc
          JOIN coaches c ON c.id = cc.coach_id
          WHERE c.user_id = auth.uid() AND cc.status = 'active'
        )
      );
  END IF;
END $$;

-- ── exercise_logs policies ──────────────────────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'exercise_logs'
    AND policyname = 'Athletes can manage own exercise logs') THEN
    CREATE POLICY "Athletes can manage own exercise logs" ON exercise_logs
      FOR ALL USING (
        training_session_id IN (
          SELECT id FROM training_sessions
          WHERE athlete_id IN (SELECT id FROM athletes WHERE user_id = auth.uid())
        )
      ) WITH CHECK (
        training_session_id IN (
          SELECT id FROM training_sessions
          WHERE athlete_id IN (SELECT id FROM athletes WHERE user_id = auth.uid())
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'exercise_logs'
    AND policyname = 'Coaches can read connected athlete exercise logs') THEN
    CREATE POLICY "Coaches can read connected athlete exercise logs" ON exercise_logs
      FOR SELECT USING (
        training_session_id IN (
          SELECT ts.id FROM training_sessions ts
          WHERE ts.athlete_id IN (
            SELECT cc.athlete_id FROM coach_connections cc
            JOIN coaches c ON c.id = cc.coach_id
            WHERE c.user_id = auth.uid() AND cc.status = 'active'
          )
        )
      );
  END IF;
END $$;

-- ── set_logs policies ───────────────────────────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'set_logs'
    AND policyname = 'Athletes can manage own set logs') THEN
    CREATE POLICY "Athletes can manage own set logs" ON set_logs
      FOR ALL USING (
        exercise_log_id IN (
          SELECT el.id FROM exercise_logs el
          JOIN training_sessions ts ON ts.id = el.training_session_id
          WHERE ts.athlete_id IN (SELECT id FROM athletes WHERE user_id = auth.uid())
        )
      ) WITH CHECK (
        exercise_log_id IN (
          SELECT el.id FROM exercise_logs el
          JOIN training_sessions ts ON ts.id = el.training_session_id
          WHERE ts.athlete_id IN (SELECT id FROM athletes WHERE user_id = auth.uid())
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'set_logs'
    AND policyname = 'Coaches can read connected athlete set logs') THEN
    CREATE POLICY "Coaches can read connected athlete set logs" ON set_logs
      FOR SELECT USING (
        exercise_log_id IN (
          SELECT el.id FROM exercise_logs el
          JOIN training_sessions ts ON ts.id = el.training_session_id
          WHERE ts.athlete_id IN (
            SELECT cc.athlete_id FROM coach_connections cc
            JOIN coaches c ON c.id = cc.coach_id
            WHERE c.user_id = auth.uid() AND cc.status = 'active'
          )
        )
      );
  END IF;
END $$;

-- ── drill_logs policies ─────────────────────────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'drill_logs'
    AND policyname = 'Athletes can manage own drill logs') THEN
    CREATE POLICY "Athletes can manage own drill logs" ON drill_logs
      FOR ALL USING (
        training_session_id IN (
          SELECT id FROM training_sessions
          WHERE athlete_id IN (SELECT id FROM athletes WHERE user_id = auth.uid())
        )
      ) WITH CHECK (
        training_session_id IN (
          SELECT id FROM training_sessions
          WHERE athlete_id IN (SELECT id FROM athletes WHERE user_id = auth.uid())
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'drill_logs'
    AND policyname = 'Coaches can read connected athlete drill logs') THEN
    CREATE POLICY "Coaches can read connected athlete drill logs" ON drill_logs
      FOR SELECT USING (
        training_session_id IN (
          SELECT ts.id FROM training_sessions ts
          WHERE ts.athlete_id IN (
            SELECT cc.athlete_id FROM coach_connections cc
            JOIN coaches c ON c.id = cc.coach_id
            WHERE c.user_id = auth.uid() AND cc.status = 'active'
          )
        )
      );
  END IF;
END $$;

-- ── diagnostic_submissions policies ─────────────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'diagnostic_submissions'
    AND policyname = 'Users can manage own diagnostic submissions') THEN
    CREATE POLICY "Users can manage own diagnostic submissions" ON diagnostic_submissions
      FOR ALL USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'diagnostic_submissions'
    AND policyname = 'Coaches can read connected athlete diagnostics') THEN
    CREATE POLICY "Coaches can read connected athlete diagnostics" ON diagnostic_submissions
      FOR SELECT USING (
        user_id IN (
          SELECT a.user_id FROM athletes a
          JOIN coach_connections cc ON cc.athlete_id = a.id
          JOIN coaches c ON c.id = cc.coach_id
          WHERE c.user_id = auth.uid() AND cc.status = 'active'
        )
      );
  END IF;
END $$;

-- ── mental_profiles policies ────────────────────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'mental_profiles'
    AND policyname = 'Users can manage own mental profile') THEN
    CREATE POLICY "Users can manage own mental profile" ON mental_profiles
      FOR ALL USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'mental_profiles'
    AND policyname = 'Coaches can read connected athlete mental profiles') THEN
    CREATE POLICY "Coaches can read connected athlete mental profiles" ON mental_profiles
      FOR SELECT USING (
        user_id IN (
          SELECT a.user_id FROM athletes a
          JOIN coach_connections cc ON cc.athlete_id = a.id
          JOIN coaches c ON c.id = cc.coach_id
          WHERE c.user_id = auth.uid() AND cc.status = 'active'
        )
      );
  END IF;
END $$;

-- ── athlete_progress policies ───────────────────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'athlete_progress'
    AND policyname = 'Athletes can manage own progress') THEN
    CREATE POLICY "Athletes can manage own progress" ON athlete_progress
      FOR ALL USING (
        athlete_id IN (SELECT id FROM athletes WHERE user_id = auth.uid())
      ) WITH CHECK (
        athlete_id IN (SELECT id FROM athletes WHERE user_id = auth.uid())
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'athlete_progress'
    AND policyname = 'Coaches can read connected athlete progress') THEN
    CREATE POLICY "Coaches can read connected athlete progress" ON athlete_progress
      FOR SELECT USING (
        athlete_id IN (
          SELECT cc.athlete_id FROM coach_connections cc
          JOIN coaches c ON c.id = cc.coach_id
          WHERE c.user_id = auth.uid() AND cc.status = 'active'
        )
      );
  END IF;
END $$;

-- ── athlete_logs policies ───────────────────────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'athlete_logs'
    AND policyname = 'Users can manage own logs') THEN
    CREATE POLICY "Users can manage own logs" ON athlete_logs
      FOR ALL USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'athlete_logs'
    AND policyname = 'Coaches can read connected athlete logs') THEN
    CREATE POLICY "Coaches can read connected athlete logs" ON athlete_logs
      FOR SELECT USING (
        user_id IN (
          SELECT a.user_id FROM athletes a
          JOIN coach_connections cc ON cc.athlete_id = a.id
          JOIN coaches c ON c.id = cc.coach_id
          WHERE c.user_id = auth.uid() AND cc.status = 'active'
        )
      );
  END IF;
END $$;

-- ── drills policies ─────────────────────────────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'drills'
    AND policyname = 'Authenticated users can read drills') THEN
    CREATE POLICY "Authenticated users can read drills" ON drills
      FOR SELECT USING (auth.uid() IS NOT NULL);
  END IF;
END $$;

-- ── vault_content policies ──────────────────────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'vault_content'
    AND policyname = 'Authenticated users can read vault content') THEN
    CREATE POLICY "Authenticated users can read vault content" ON vault_content
      FOR SELECT USING (auth.uid() IS NOT NULL);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'vault_content'
    AND policyname = 'Coaches can manage own vault content') THEN
    CREATE POLICY "Coaches can manage own vault content" ON vault_content
      FOR ALL USING (
        coach_id IN (SELECT id FROM coaches WHERE user_id = auth.uid())
      ) WITH CHECK (
        coach_id IN (SELECT id FROM coaches WHERE user_id = auth.uid())
      );
  END IF;
END $$;

-- ── courses policies ────────────────────────────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'courses'
    AND policyname = 'Authenticated users can read courses') THEN
    CREATE POLICY "Authenticated users can read courses" ON courses
      FOR SELECT USING (auth.uid() IS NOT NULL);
  END IF;
END $$;

-- ── conversations policies ──────────────────────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'conversations'
    AND policyname = 'Members can read conversations') THEN
    CREATE POLICY "Members can read conversations" ON conversations
      FOR SELECT USING (
        id IN (SELECT conversation_id FROM conversation_members WHERE user_id = auth.uid())
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'conversations'
    AND policyname = 'Authenticated users can create conversations') THEN
    CREATE POLICY "Authenticated users can create conversations" ON conversations
      FOR INSERT WITH CHECK (created_by = auth.uid());
  END IF;
END $$;

-- ── conversation_members policies ───────────────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'conversation_members'
    AND policyname = 'Members can read conversation members') THEN
    CREATE POLICY "Members can read conversation members" ON conversation_members
      FOR SELECT USING (
        conversation_id IN (
          SELECT conversation_id FROM conversation_members WHERE user_id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'conversation_members'
    AND policyname = 'Conversation creators can add members') THEN
    CREATE POLICY "Conversation creators can add members" ON conversation_members
      FOR INSERT WITH CHECK (
        conversation_id IN (
          SELECT id FROM conversations WHERE created_by = auth.uid()
        )
        OR user_id = auth.uid()
      );
  END IF;
END $$;

-- ── messages policies ───────────────────────────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'messages'
    AND policyname = 'Members can read messages') THEN
    CREATE POLICY "Members can read messages" ON messages
      FOR SELECT USING (
        conversation_id IN (
          SELECT conversation_id FROM conversation_members WHERE user_id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'messages'
    AND policyname = 'Members can send messages') THEN
    CREATE POLICY "Members can send messages" ON messages
      FOR INSERT WITH CHECK (
        sender_id = auth.uid()
        AND conversation_id IN (
          SELECT conversation_id FROM conversation_members WHERE user_id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'messages'
    AND policyname = 'Members can update messages') THEN
    CREATE POLICY "Members can update messages" ON messages
      FOR UPDATE USING (
        conversation_id IN (
          SELECT conversation_id FROM conversation_members WHERE user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- ── announcements policies ──────────────────────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'announcements'
    AND policyname = 'Authenticated users can read announcements') THEN
    CREATE POLICY "Authenticated users can read announcements" ON announcements
      FOR SELECT USING (auth.uid() IS NOT NULL);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'announcements'
    AND policyname = 'Coaches can create announcements') THEN
    CREATE POLICY "Coaches can create announcements" ON announcements
      FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM coaches WHERE user_id = auth.uid())
      );
  END IF;
END $$;

-- ── community_posts policies ────────────────────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'community_posts'
    AND policyname = 'Authenticated users can read community posts') THEN
    CREATE POLICY "Authenticated users can read community posts" ON community_posts
      FOR SELECT USING (auth.uid() IS NOT NULL);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'community_posts'
    AND policyname = 'Users can create community posts') THEN
    CREATE POLICY "Users can create community posts" ON community_posts
      FOR INSERT WITH CHECK (author_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'community_posts'
    AND policyname = 'Authors can update own posts') THEN
    CREATE POLICY "Authors can update own posts" ON community_posts
      FOR UPDATE USING (author_id = auth.uid())
      WITH CHECK (author_id = auth.uid());
  END IF;
END $$;

-- ── notification_events policies ────────────────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notification_events'
    AND policyname = 'Users can read own notifications') THEN
    CREATE POLICY "Users can read own notifications" ON notification_events
      FOR SELECT USING (recipient_id = auth.uid());
  END IF;
END $$;

-- ── push_tokens policies ────────────────────────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'push_tokens'
    AND policyname = 'Users can manage own push tokens') THEN
    CREATE POLICY "Users can manage own push tokens" ON push_tokens
      FOR ALL USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;


-- ============================================================================
-- 8. AUTO-SYNC TRIGGER: auth.users → public.users
-- ============================================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
