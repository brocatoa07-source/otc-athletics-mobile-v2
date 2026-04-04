// ============================================================================
// OTC Lab v2 — Canonical TypeScript Database Types
// ============================================================================
// Every interface maps 1:1 to a table in schema.sql.
// Do NOT add fields that don't exist in the schema.
// ============================================================================

// ── Enums / Unions ──────────────────────────────────────────────────────────

export type UserRole = 'ATHLETE' | 'COACH' | 'PARENT';

export type AthleteTier = 'WALK' | 'SINGLE' | 'DOUBLE' | 'TRIPLE' | 'HOME_RUN' | 'GRAND_SLAM';

export type ProgramType = 'lifting' | 'hitting' | 'general';

export type VaultType = 'mental' | 'hitting' | 'sc';

export type DiagnosticType =
  | 'archetype' | 'identity' | 'habits'
  | 'mover-type' | 'mechanical' | 'lifting-mover';

export type MetricType =
  | 'exit_velocity_mph' | 'sprint_60yd_seconds' | 'throw_velocity_mph'
  | 'sprint_10yd_seconds' | 'bat_speed_mph' | 'vertical_jump_inches'
  | 'broad_jump_inches' | 'rot_power_watts' | 'strength_index';

export type SessionStatus = 'in_progress' | 'completed';

export type ConnectionStatus = 'pending' | 'active' | 'denied' | 'removed';

export type LiftingSection = 'mobility' | 'strength' | 'explosive' | 'conditioning' | 'cooldown';

// ── 1. Core Users ───────────────────────────────────────────────────────────

export interface DBUser {
  id: string;
  email: string;
  full_name: string;
  username: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Athlete {
  id: string;
  user_id: string;
  tier: AthleteTier;
  sport: string;
  position: string | null;
  age: number | null;
  mover_type: string | null;
  mental_archetype: string | null;
  sc_experience: string | null;
  sc_equipment: string | null;
  sc_timeline: string | null;
  created_at: string;
  updated_at: string;
}

export interface Coach {
  id: string;
  user_id: string;
  bio: string | null;
  specialization: string | null;
  connect_code: string | null;
  max_home_run_slots: number;
  current_home_run_count: number;
  created_at: string;
  updated_at: string;
}

export interface CoachConnection {
  id: string;
  athlete_id: string;
  coach_id: string;
  status: ConnectionStatus;
  created_at: string;
  updated_at: string;
}

// ── 2. Program System ───────────────────────────────────────────────────────

export interface Program {
  id: string;
  owner_user_id: string;
  title: string;
  description: string | null;
  program_type: ProgramType;
  duration_weeks: number | null;
  total_days: number | null;
  focus_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProgramAssignment {
  id: string;
  program_id: string;
  athlete_id: string;
  program_type: ProgramType | null;
  current_week: number;
  current_day: number;
  active: boolean;
  assigned_by: string | null;
  start_date: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface Workout {
  id: string;
  program_id: string;
  week_number: number;
  day_label: string;
  day_type: 'strength' | 'active_recovery';
  order_index: number;
}

export interface WorkoutItem {
  id: string;
  workout_id: string;
  category: string;
  order_index: number;
  superset_group: string | null;
  exercise_name_raw: string;
  notes: string | null;
}

export interface WorkoutSet {
  id: string;
  workout_item_id: string;
  set_number: number;
  reps: string | null;
  load: string | null;
  tempo: string | null;
  rest_sec: number | null;
}

// ── 3. Training Logging ─────────────────────────────────────────────────────

export interface TrainingSession {
  id: string;
  assignment_id: string;
  athlete_id: string;
  week_index: number;
  day_index: number;
  status: SessionStatus;
  finished_at: string | null;
  proof_url: string | null;
  notes: string | null;
  rpe: number | null;
  created_at: string;
}

export interface ExerciseLog {
  id: string;
  training_session_id: string;
  program_exercise_id: string | null;
  exercise_name: string;
  order_index: number;
  created_at: string;
}

export interface SetLog {
  id: string;
  exercise_log_id: string;
  set_index: number;
  target_reps: string | null;
  completed_reps: number | null;
  weight: number | null;
  rpe: number | null;
  is_completed: boolean;
  created_at: string;
}

export interface DrillLog {
  id: string;
  training_session_id: string;
  drill_id: string;
  drill_name: string;
  order_index: number;
  is_completed: boolean;
  notes: string | null;
  created_at: string;
}

/** Convenience type: ExerciseLog with nested set_logs */
export interface ExerciseLogWithSets extends ExerciseLog {
  set_logs: SetLog[];
}

// ── 4. Diagnostics ──────────────────────────────────────────────────────────

export interface DiagnosticSubmission {
  id: string;
  user_id: string;
  vault_type: VaultType;
  diagnostic_type: DiagnosticType;
  result_payload: Record<string, unknown>;
  submitted_at: string;
  updated_at: string;
}

export interface MentalProfile {
  id: string;
  user_id: string;
  primary_archetype: string;
  secondary_archetype: string | null;
  archetype_scores: Record<string, number>;
  identity_profile: string | null;
  iss: number | null;
  approval_load: number | null;
  outcome_attachment: number | null;
  habit_profile: string | null;
  hss: number | null;
  habit_subscores: Record<string, number>;
  primary_focus: string[];
  recommended_tools: string[];
  version: number;
  created_at: string;
  updated_at: string;
}

// ── 5. Progress ─────────────────────────────────────────────────────────────

export interface AthleteProgress {
  id: string;
  athlete_id: string;
  metric_type: MetricType;
  value: number;
  recorded_at: string;
  notes: string | null;
  created_at: string;
}

export interface AthleteLog<P extends Record<string, unknown> = Record<string, unknown>> {
  id: string;
  user_id: string;
  log_type: string;
  log_date: string;
  payload: P;
  created_at: string;
  updated_at: string;
}

// ── 6. Content ──────────────────────────────────────────────────────────────

export interface Drill {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
  video_url: string | null;
  tags: string[];
  created_at: string;
}

export interface VaultContent {
  id: string;
  coach_id: string;
  title: string;
  description: string | null;
  content_type: 'DRILL' | 'CONCEPT' | 'BREAKDOWN' | 'VIDEO_VAULT';
  vault_type: VaultType;
  video_url: string | null;
  thumbnail_url: string | null;
  tier_access: AthleteTier;
  tags: string[];
  phase: string | null;
  skill: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  key: string;
  title: string;
  description: string | null;
  tier_access: AthleteTier;
  created_at: string;
}

// ── 7. Messaging ────────────────────────────────────────────────────────────

export interface Conversation {
  id: string;
  conversation_type: 'dm' | 'group';
  created_by: string;
  created_at: string;
}

export interface ConversationMember {
  id: string;
  conversation_id: string;
  user_id: string;
  role: 'athlete' | 'coach' | null;
  joined_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string | null;
  media_url: string | null;
  media_type: 'video' | 'image' | 'audio' | 'file' | null;
  read_by: string[];
  created_at: string;
}

// ── 8. Community ────────────────────────────────────────────────────────────

export interface Announcement {
  id: string;
  author_id: string;
  author_name: string | null;
  author_role: string | null;
  title: string;
  body: string;
  audience: 'all' | 'athletes' | 'coaches';
  is_pinned: boolean;
  attachments: Array<{ type: string; url: string; name?: string }>;
  created_at: string;
}

export interface CommunityPost {
  id: string;
  author_id: string;
  body: string;
  media_url: string | null;
  likes: string[];
  created_at: string;
  updated_at: string;
}

// ── 9. Notifications ────────────────────────────────────────────────────────

export interface NotificationEvent {
  id: string;
  recipient_id: string;
  type: string;
  title: string;
  body: string;
  data: Record<string, unknown>;
  status: 'pending' | 'sent' | 'failed';
  error: string | null;
  created_at: string;
  sent_at: string | null;
}

export interface PushToken {
  id: string;
  user_id: string;
  expo_push_token: string;
  platform: 'ios' | 'android' | 'web';
  device_id: string | null;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}
