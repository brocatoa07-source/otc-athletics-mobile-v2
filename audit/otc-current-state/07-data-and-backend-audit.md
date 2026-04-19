# OTC Athletics — Data & Backend Audit

## Supabase Configuration

**Client:** `src/lib/supabase.ts`
- AsyncStorage for session persistence
- Auto-refresh tokens enabled
- `detectSessionInUrl: false` (required for React Native)
- **Env vars:** `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`

---

## Database Tables (31+ confirmed)

### Core User (5 tables)
| Table | Key Fields | RLS |
|-------|-----------|-----|
| `users` | id (= auth.users.id), email, full_name, role | Yes |
| `athletes` | user_id, tier, sport, position, age, mover_type, mental_archetype | Yes |
| `coaches` | user_id, bio, connect_code, max_home_run_slots | Yes |
| `coach_connections` | athlete_id, coach_id, status | Yes |
| `athlete_parent_links` | parent_id, athlete_id | Yes |

### Programs & Workouts (5 tables)
| Table | Key Fields |
|-------|-----------|
| `programs` | owner_user_id, title, program_type, duration_weeks |
| `program_assignments` | program_id, athlete_id, current_week, current_day, active |
| `workouts` | program_id, week_number, day_label, day_type |
| `workout_items` | workout_id, exercise_name_raw, category, superset_group |
| `workout_sets` | workout_item_id, set_number, reps, load, tempo, rest_sec |

### Training Logs (4 tables)
| Table | Key Fields |
|-------|-----------|
| `training_sessions` | assignment_id, athlete_id, week_index, day_index, status, rpe |
| `exercise_logs` | training_session_id, exercise_name |
| `set_logs` | exercise_log_id, weight, completed_reps, rpe |
| `drill_logs` | training_session_id, drill_name, is_completed |

### Diagnostics & Profiles (2 tables)
| Table | Key Fields |
|-------|-----------|
| `diagnostic_submissions` | user_id, vault_type, diagnostic_type, result_payload |
| `mental_profiles` | user_id, primary_archetype, iss, hss, archetype_scores, habit_subscores |

### Subscriptions (1 table, new)
| Table | Key Fields |
|-------|-----------|
| `user_subscriptions` | user_id, stripe_customer_id, stripe_subscription_id, tier, status, current_period_end |

### Content & Commerce (2 tables)
| Table | Key Fields |
|-------|-----------|
| `content_items` | title, type (program/course), category, required_tier, price |
| `user_purchases` | user_id, content_id, purchase_date, amount_paid |

### Community (3 tables)
| Table | Key Fields |
|-------|-----------|
| `announcements` | author_id, title, body, audience, is_pinned |
| `community_posts` | author_id, body, media_url, likes |
| `messages` | conversation_id, sender_id, body, media_type, read_by |

### Messaging (2 tables)
| Table | Key Fields |
|-------|-----------|
| `conversations` | conversation_type, created_by |
| `conversation_members` | conversation_id, user_id, role |

### Progress & Metrics (2 tables)
| Table | Key Fields |
|-------|-----------|
| `athlete_progress` | athlete_id, metric_type, value, recorded_at |
| `athlete_logs` | user_id, log_type, log_date, payload |

### Other (5+ tables)
| Table | Notes |
|-------|-------|
| `drills` | Schema exists, NOT read by app |
| `vault_content` | Schema exists, NOT read by app |
| `courses` | Schema exists, NOT read by app |
| `notification_events` | recipient_id, type, status |
| `push_tokens` | user_id, expo_push_token, platform |

---

## AsyncStorage Keys (50+)

### Critical State (lost on reinstall/device switch)

| Key | Purpose | Risk |
|-----|---------|------|
| `otc:exercise-logs` | All weight logs (500 max) | **HIGH** — training history lost |
| `otc:mental-checkins` | Check-in history (60 max) | **HIGH** — trend data lost |
| `otc:mental-lane-levels` | Lane progression levels | HIGH — progress lost |
| `otc:course-progress-{id}` | Course completion per week | HIGH — course progress lost |
| `otc:readiness` | Today's readiness | Medium — regenerates daily |
| `otc:readiness-history` | 7-day readiness | Medium — rebuilds over week |
| `otc:progression-state` | Exercise progression | HIGH — progression decisions lost |
| `otc:strength-session-log` | Session feedback | Medium |
| `otc:workout-completions` | Workout completion flags | HIGH — program position lost |
| `otc:mental-daily-completions` | Daily completion tracking | Medium |
| `otc:mental-focus-state` | Current focus state | Low — regenerates |
| `otc:training-streak` | Streak counter | Medium |
| `otc:double-trial` | Trial state | Medium — can't restart |

### Diagnostic State
| Key | Purpose |
|-----|---------|
| `otc:mover-type` | Hitting mover result |
| `otc:lifting-mover-type` | Strength mover result |
| `otc:mechanical-diagnostic` | Mechanical primary issue |
| `otc:mental-profile` | Mental profile hydration |
| `otc:sc-profile` | Strength profile |
| `otc:assessment` | General assessment |

### Dev / Session
| Key | Purpose |
|-----|---------|
| `@otc_dev_tier_override` | Dev tier override |
| `@otc_dev_role_override` | Dev role override |
| `@otc_last_user_id` | User switch detection |

---

## React Query Usage

**Provider:** `src/lib/query-client.ts`

| Query Key | Table/Source | File |
|-----------|-------------|------|
| `['mental-profile', userId]` | `mental_profiles` | `useMentalProfile.ts` |
| `['diagnostic-submissions-mental', userId]` | `diagnostic_submissions` | `useMentalProfile.ts` |
| `['strength-profile']` | `strength_profiles` | `useStrengthProfile.ts` |
| `['announcements']` | `announcements` | `useAnnouncements.ts` |
| `['conversations', userId]` | `conversations` + `conversation_members` | `useConversations.ts` |
| `['assigned-program', athleteId]` | `program_assignments` + `workouts` | `TodayFocusCard.tsx` |
| `['parent-athlete-profiles', ids]` | `users` + `athletes` | `ParentDashboard.tsx` |

---

## Local vs Server Source of Truth

| Data | Local (AsyncStorage) | Server (Supabase) | Conflict Risk |
|------|---------------------|-------------------|---------------|
| Exercise weight logs | Primary | Not synced | **HIGH** — data loss |
| Mental check-ins | Primary | Not synced | **HIGH** — trend loss |
| Course progress | Primary | Not synced | **HIGH** — progress loss |
| Readiness | Primary | Not synced | Medium |
| Strength progression | Primary | Not synced | **HIGH** — decision loss |
| Workout completions | Primary | Not synced | **HIGH** |
| Diagnostics (mental) | — | Primary | Low |
| Mental profile | — | Primary | Low |
| Subscription state | — | Primary (realtime) | Low |
| Auth session | AsyncStorage (Supabase adapter) | Primary | Low |

---

## Migrations (13)

| Date | File | Purpose |
|------|------|---------|
| 2026-03-17 | `mark_messages_read.sql` | Message read tracking |
| 2026-03-24 | `add_hitting_diagnostic_types.sql` | Added hitting diagnostic types |
| 2026-03-25 | `parent_athlete_links.sql` | Parent-athlete relationships |
| 2026-03-26 | `parent_invite_codes.sql` | Parent invite system |
| 2026-03-26 | `parent_read_athlete.sql` | Parent RLS for athlete data |
| 2026-03-26 | `parent_read_all_athlete_data.sql` | Extended parent read access |
| 2026-03-31 | `remove_dead_diagnostic_types.sql` | Removed unused diagnostic types |
| 2026-03-31 | `create_strength_profiles.sql` | Strength profiles table |
| 2026-04-01 | `backfill_strength_profiles.sql` | Backfill existing profiles |
| 2026-04-02 | `create_content_items_and_purchases.sql` | Content/course commerce |
| 2026-04-02 | `fix_strength_profiles_constraints.sql` | Fix UNIQUE constraint |
| 2026-04-02 | `update_launch_content.sql` | Seed launch content |
| 2026-04-06 | `create_user_subscriptions.sql` | Stripe subscription state |

---

## Edge Functions (2)

| Function | Purpose | Status |
|----------|---------|--------|
| `create-checkout-session` | Stripe Checkout Session creation | Written, not deployed |
| `stripe-webhook` | Webhook handler for payment events | Written, not deployed |

---

## Notable Error-Prone Areas

1. **`useStrengthProfile.ts`** — Queries `strength_profiles` table which may not exist on all Supabase instances. Has graceful error handling added.
2. **`generateDiagnosticResult.ts`** — Complex flow reading 3 diagnostic submissions, re-scoring, building profile payload, upserting. Multiple failure points.
3. **User switch detection** — `_layout.tsx` detects `@otc_last_user_id` change and clears ~15 AsyncStorage keys. If a key is added but not included in the clear list, stale data leaks between accounts.
4. **Realtime subscription** — `useSubscription.ts` subscribes to `postgres_changes` on `user_subscriptions`. Requires `ALTER PUBLICATION supabase_realtime ADD TABLE user_subscriptions` which may not be done.
