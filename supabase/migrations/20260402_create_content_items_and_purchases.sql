-- Programs & Courses content system
-- Programs: unlock via tier membership
-- Courses: unlock via one-time purchase

CREATE TABLE IF NOT EXISTS public.content_items (
  id            TEXT        PRIMARY KEY,
  title         TEXT        NOT NULL,
  description   TEXT        NOT NULL DEFAULT '',
  type          TEXT        NOT NULL CHECK (type IN ('program', 'course')),
  category      TEXT        NOT NULL CHECK (category IN ('hitting', 'mental', 'strength', 'general')),
  required_tier TEXT        CHECK (required_tier IN ('WALK', 'SINGLE', 'DOUBLE', 'TRIPLE', 'HOME_RUN', 'GRAND_SLAM')),
  price         NUMERIC     CHECK (price IS NULL OR price >= 0),
  icon          TEXT        NOT NULL DEFAULT 'flash-outline',
  color         TEXT        NOT NULL DEFAULT '#6b7280',
  is_active     BOOLEAN     NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Programs: required_tier must be set, price must be null
-- Courses: required_tier should be null, price should be set
-- (Not enforced as hard constraint to allow flexibility)

CREATE TABLE IF NOT EXISTS public.user_purchases (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id    TEXT        NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  purchase_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  amount_paid   NUMERIC,
  payment_id    TEXT,       -- Stripe payment intent ID
  UNIQUE(user_id, content_id)
);

-- RLS: Athletes can read content_items
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active content items"
  ON public.content_items FOR SELECT
  USING (is_active = true);

-- RLS: Users can read their own purchases
ALTER TABLE public.user_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own purchases"
  ON public.user_purchases FOR SELECT
  USING (auth.uid() = user_id);

-- Parents can read linked athlete purchases
CREATE POLICY "Parents can read linked athlete purchases"
  ON public.user_purchases FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.athlete_parent_links
      WHERE parent_id = auth.uid()
      AND athlete_id = user_purchases.user_id
    )
  );

-- Seed programs
INSERT INTO public.content_items (id, title, description, type, category, required_tier, price, icon, color) VALUES
  ('prog-bat-speed', 'Bat Speed Program', 'Increase bat speed through overload/underload and CNS training', 'program', 'hitting', 'SINGLE', NULL, 'flash-outline', '#f97316'),
  ('prog-exit-velo', 'Exit Velo Program', 'Build exit velocity through strength, barrel control, and intent', 'program', 'hitting', 'SINGLE', NULL, 'rocket-outline', '#ef4444'),
  ('prog-contact', 'Contact Program', 'Improve contact rate, barrel accuracy, and pitch recognition', 'program', 'hitting', 'SINGLE', NULL, 'baseball-outline', '#22c55e'),
  ('prog-strength', 'Strength Program', 'Personalized strength programming with adaptive progression', 'program', 'strength', 'TRIPLE', NULL, 'barbell-outline', '#1DB954'),
  ('prog-speed', 'Speed Program', 'Sprint mechanics, acceleration, and max velocity training', 'program', 'strength', 'TRIPLE', NULL, 'speedometer-outline', '#ef4444'),
  ('prog-mobility', 'Mobility Program', 'Movement prep, mobility flows, and position ownership', 'program', 'strength', 'TRIPLE', NULL, 'body-outline', '#0891b2'),
  ('prog-arm-care', 'Arm Care Program', 'Arm health, shoulder stability, and throwing prep', 'program', 'strength', 'TRIPLE', NULL, 'fitness-outline', '#8b5cf6'),
  ('prog-in-season', 'In-Season Program', 'Maintain strength and speed during the competitive season', 'program', 'strength', 'TRIPLE', NULL, 'calendar-outline', '#f59e0b'),
  ('prog-offseason', 'Offseason Program', 'Build your foundation in the offseason', 'program', 'strength', 'TRIPLE', NULL, 'snow-outline', '#3b82f6'),
  ('prog-catcher', 'Catcher Program', 'Catcher-specific strength, mobility, and durability', 'program', 'strength', 'TRIPLE', NULL, 'shield-outline', '#6b7280'),
  ('prog-position', 'Position Player Program', 'Position-specific training for infielders and outfielders', 'program', 'strength', 'TRIPLE', NULL, 'location-outline', '#84cc16')
ON CONFLICT (id) DO NOTHING;

-- Seed courses
INSERT INTO public.content_items (id, title, description, type, category, required_tier, price, icon, color) VALUES
  ('course-90mph', '12-Week 90 MPH Throwing', 'Complete throwing velocity development program', 'course', 'strength', NULL, 149, 'rocket', '#ef4444'),
  ('course-100ev', '12-Week 100 MPH Exit Velo', 'Build exit velocity through strength, speed, and barrel control', 'course', 'hitting', NULL, 149, 'flash', '#f97316'),
  ('course-recruiting', 'College Recruiting Course', 'Navigate the recruiting process from start to commit', 'course', 'general', NULL, 99, 'school', '#3b82f6'),
  ('course-return-injury', 'Return From Injury Course', 'Smart return-to-play protocols and reconditioning', 'course', 'strength', NULL, 79, 'medkit', '#22c55e'),
  ('course-pitch-rec', 'Advanced Pitch Recognition', 'Train your eyes and decision-making for game speed', 'course', 'hitting', NULL, 79, 'eye', '#8b5cf6'),
  ('course-mental-mastery', 'Mental Mastery Course', 'Deep mental performance system for serious competitors', 'course', 'mental', NULL, 99, 'bulb', '#a855f7'),
  ('course-coach-ed', 'Coach Education Course', 'Learn the OTC development system for your team', 'course', 'general', NULL, 199, 'clipboard', '#f59e0b'),
  ('course-team-package', 'Team Program Package', 'Full team training system for organized programs', 'course', 'general', NULL, 499, 'people', '#1DB954')
ON CONFLICT (id) DO NOTHING;

-- Update athletes CHECK constraint to include GRAND_SLAM
ALTER TABLE public.athletes DROP CONSTRAINT IF EXISTS athletes_tier_check;
ALTER TABLE public.athletes ADD CONSTRAINT athletes_tier_check
  CHECK (tier IN ('WALK', 'SINGLE', 'DOUBLE', 'TRIPLE', 'HOME_RUN', 'GRAND_SLAM'));
