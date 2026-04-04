-- Update content_items to match launch programs and courses
-- This replaces old seed data with the final launch lineup

-- Remove old programs and courses that are no longer in the launch set
DELETE FROM public.content_items WHERE id IN (
  'prog-exit-velo', 'prog-contact', 'prog-in-season', 'prog-offseason',
  'prog-catcher', 'prog-position', 'prog-confidence', 'prog-focus',
  'prog-emotional-control', 'prog-pressure', 'prog-routines', 'prog-identity',
  'course-90mph', 'course-100ev', 'course-recruiting', 'course-return-injury',
  'course-pitch-rec', 'course-coach-ed', 'course-team-package'
);

-- Upsert launch programs (5)
INSERT INTO public.content_items (id, title, description, type, category, required_tier, price, icon, color) VALUES
  ('prog-strength', 'Strength Program', 'A baseball performance lifting program built to improve force production, durability, power, and total athletic development.', 'program', 'strength', 'TRIPLE', NULL, 'barbell-outline', '#1DB954'),
  ('prog-speed', 'Speed Program', 'A speed development program focused on acceleration, first-step quickness, max velocity, and baseball movement.', 'program', 'strength', 'TRIPLE', NULL, 'speedometer-outline', '#ef4444'),
  ('prog-arm-care', 'Arm Care Program', 'A structured arm care program for shoulder health, cuff strength, scap control, recovery, and throwing preparation.', 'program', 'strength', 'TRIPLE', NULL, 'fitness-outline', '#8b5cf6'),
  ('prog-bat-speed', 'Bat Speed Program', 'A bat speed and rotational power program designed to improve barrel speed, connection, and game power.', 'program', 'hitting', 'SINGLE', NULL, 'flash-outline', '#f97316'),
  ('prog-mobility', 'Mobility Program', 'A mobility system for hips, shoulders, t-spine, ankles, and recovery to help athletes move better and stay available.', 'program', 'strength', 'TRIPLE', NULL, 'body-outline', '#0891b2')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  required_tier = EXCLUDED.required_tier;

-- Upsert launch courses (4)
INSERT INTO public.content_items (id, title, description, type, category, required_tier, price, icon, color) VALUES
  ('course-mental-mastery', 'Mental Mastery', 'A structured mental performance course built around the 11 core skills athletes need to compete with confidence, emotional control, focus, and accountability.', 'course', 'mental', NULL, 99, 'bulb', '#a855f7'),
  ('course-hitting-approach', 'Hitting Approach', 'A hitting IQ course that teaches game planning, timing, pitch recognition, counts, zones, and the approach serious hitters need in competition.', 'course', 'hitting', NULL, 99, 'baseball', '#f97316'),
  ('course-throwing-arm-care', 'Throwing & Arm Care', 'An education course covering throwing development, arm care, recovery, mechanics, and how to protect and improve throwing performance.', 'course', 'strength', NULL, 99, 'fitness', '#22c55e'),
  ('course-strength-speed', 'Strength & Speed', 'A performance education course teaching baseball athletes how to train for speed, strength, explosiveness, mobility, and recovery.', 'course', 'strength', NULL, 99, 'barbell', '#1DB954')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  price = EXCLUDED.price;
