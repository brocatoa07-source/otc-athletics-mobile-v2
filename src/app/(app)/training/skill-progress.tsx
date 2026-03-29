/**
 * Skill Progress Screen — Full view of all 13 skills.
 *
 * Sections: Hitting Skills, Mental Skills, Physical Skills.
 * Each shows progress bar, current score, log count, last updated.
 * Tapping a skill opens its challenge log modal.
 */

import { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { useSkillProgress } from '@/hooks/useSkillProgress';
import {
  HITTING_SKILLS,
  MENTAL_SKILLS,
  PHYSICAL_SKILLS,
  computePowerScore,
  computeStrengthIndex,
  type SkillMeta,
  type SkillKey,
  type SkillLogType,
  type SkillScore,
} from '@/data/skill-progress-engine';

/* ── Log modal config per skill ─────────────────────────────────── */

interface LogConfig {
  logType: SkillLogType;
  promptLabel: string;
  inputLabel: string;
  placeholder: string;
  helperText: string;
  /** For hitting %, athlete enters numerator & denominator */
  twoInputs?: { label1: string; label2: string; placeholder1: string; placeholder2: string };
  /** For mental 1–5 scale */
  ratingScale?: boolean;
  /** Power: exit velo + med ball + optional vertical jump */
  powerInputs?: boolean;
  /** Strength: lift weight + bodyweight */
  strengthInputs?: boolean;
}

const SKILL_LOG_CONFIG: Record<SkillKey, LogConfig> = {
  // Hitting
  timing: {
    logType: 'hard_barrel_round',
    promptLabel: 'Log Hard Barrel Round',
    inputLabel: 'Hard Barrel %',
    placeholder: '',
    helperText: 'How many hard barrels out of total swings?',
    twoInputs: { label1: 'Hard Barrels', label2: 'Total Swings', placeholder1: '7', placeholder2: '10' },
  },
  barrel_control: {
    logType: 'barrel_contact_round',
    promptLabel: 'Log Barrel Contact Round',
    inputLabel: 'Barrel Contact %',
    placeholder: '',
    helperText: 'How many barrels out of total swings?',
    twoInputs: { label1: 'Barrels', label2: 'Total Swings', placeholder1: '7', placeholder2: '10' },
  },
  direction: {
    logType: 'direction_round',
    promptLabel: 'Log Direction Round',
    inputLabel: 'Directional Hard Contact %',
    placeholder: '',
    helperText: 'Balls driven hard through middle or opposite gap?',
    twoInputs: { label1: 'Hard + Directional', label2: 'Total Swings', placeholder1: '5', placeholder2: '10' },
  },
  pitch_selection: {
    logType: 'decision_round',
    promptLabel: 'Log Decision Round',
    inputLabel: 'Swing Decision %',
    placeholder: '',
    helperText: 'Correct swings + correct takes out of total pitches?',
    twoInputs: { label1: 'Correct Decisions', label2: 'Total Pitches', placeholder1: '8', placeholder2: '10' },
  },
  competitive_hitting: {
    logType: 'competitive_round',
    promptLabel: 'Log Competitive Round',
    inputLabel: 'Competitive Success %',
    placeholder: '',
    helperText: 'Wins out of total rounds?',
    twoInputs: { label1: 'Wins', label2: 'Total Rounds', placeholder1: '3', placeholder2: '5' },
  },
  // Mental
  confidence: {
    logType: 'confidence_challenge',
    promptLabel: 'Rate Your Confidence',
    inputLabel: 'Conviction + failure response',
    placeholder: '',
    helperText: 'How strong was your conviction and response to failure?',
    ratingScale: true,
  },
  focus: {
    logType: 'focus_challenge',
    promptLabel: 'Log Focus Challenge',
    inputLabel: 'Reset Success %',
    placeholder: '',
    helperText: 'Successful pitch-to-pitch resets out of total?',
    twoInputs: { label1: 'Successful Resets', label2: 'Total Pitches', placeholder1: '8', placeholder2: '10' },
  },
  emotional_control: {
    logType: 'emotional_control_challenge',
    promptLabel: 'Rate Emotional Control',
    inputLabel: 'Recovery score after mistakes',
    placeholder: '',
    helperText: 'How well did you recover emotionally after mistakes?',
    ratingScale: true,
  },
  resilience: {
    logType: 'resilience_challenge',
    promptLabel: 'Rate Your Resilience',
    inputLabel: 'Bounce-back performance',
    placeholder: '',
    helperText: 'How strong was your bounce-back after a tough round?',
    ratingScale: true,
  },
  accountability: {
    logType: 'accountability_check',
    promptLabel: 'Log Accountability',
    inputLabel: 'Standards Consistency %',
    placeholder: '85',
    helperText: 'What percentage of your daily standards did you hit?',
  },
  // Physical
  speed: {
    logType: 'sprint_time',
    promptLabel: 'Log Sprint Time',
    inputLabel: 'Time (seconds)',
    placeholder: '7.2',
    helperText: '60-yard dash time. Faster time = higher score.',
  },
  power: {
    logType: 'exit_velocity',
    promptLabel: 'Log Power Output',
    inputLabel: '',
    placeholder: '',
    helperText: 'Enter exit velocity and med ball rotational velocity. Vertical jump is optional.',
    powerInputs: true,
  },
  strength: {
    logType: 'strength_index',
    promptLabel: 'Log Strength Test',
    inputLabel: '',
    placeholder: '',
    helperText: 'Enter your top lift weight and bodyweight to calculate your Strength Index.',
    strengthInputs: true,
  },
};

/* ── Main Screen ────────────────────────────────────────────────── */

export default function SkillProgressScreen() {
  const { scores, focus, logChallenge } = useSkillProgress();
  const [modalSkill, setModalSkill] = useState<SkillKey | null>(null);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Skill Progress</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Focus callout */}
        <View style={styles.focusCallout}>
          <Ionicons name="analytics-outline" size={16} color="#3b82f6" />
          <Text style={styles.focusText}>
            Focus skills are determined by your diagnostics and lowest scores. Log performance challenges to improve.
          </Text>
        </View>

        {/* Hitting Skills */}
        <SkillSection
          title="HITTING SKILLS"
          accent="#E10600"
          skills={HITTING_SKILLS}
          scores={scores}
          focusKeys={focus.hitting}
          onSkillPress={setModalSkill}
        />

        {/* Mental Skills */}
        <SkillSection
          title="MENTAL SKILLS"
          accent="#A78BFA"
          skills={MENTAL_SKILLS}
          scores={scores}
          focusKeys={focus.mental}
          onSkillPress={setModalSkill}
        />

        {/* Physical Skills */}
        <SkillSection
          title="PHYSICAL SKILLS"
          accent="#1DB954"
          skills={PHYSICAL_SKILLS}
          scores={scores}
          focusKeys={focus.physical}
          onSkillPress={setModalSkill}
        />
      </ScrollView>

      {/* Log Modal */}
      {modalSkill && (
        <LogChallengeModal
          skillKey={modalSkill}
          onDismiss={() => setModalSkill(null)}
          onSubmit={async (logType, value, metadata) => {
            await logChallenge(logType, value, metadata);
            setModalSkill(null);
          }}
        />
      )}
    </SafeAreaView>
  );
}

/* ── Section Component ──────────────────────────────────────────── */

function SkillSection({
  title,
  accent,
  skills,
  scores,
  focusKeys,
  onSkillPress,
}: {
  title: string;
  accent: string;
  skills: SkillMeta[];
  scores: Record<SkillKey, SkillScore>;
  focusKeys: SkillKey[];
  onSkillPress: (key: SkillKey) => void;
}) {
  const focusSet = new Set(focusKeys);

  return (
    <View style={styles.sectionWrap}>
      <Text style={[styles.sectionTitle, { color: accent }]}>{title}</Text>
      {skills.map((skill) => {
        const scoreData = scores[skill.key];
        const val = scoreData?.score ?? 0;
        const hasData = (scoreData?.logCount ?? 0) > 0;
        const isFocus = focusSet.has(skill.key);
        const lastUpdated = scoreData?.updatedAt
          ? formatRelativeDate(scoreData.updatedAt)
          : null;

        const CardWrapper = isFocus ? TouchableOpacity : View;
        const wrapperProps = isFocus
          ? { onPress: () => onSkillPress(skill.key), activeOpacity: 0.8 }
          : {};

        return (
          <CardWrapper
            key={skill.key}
            style={[
              styles.skillCard,
              isFocus && { borderColor: skill.color + '40' },
              !isFocus && { opacity: 0.55 },
            ]}
            {...wrapperProps}
          >
            <View style={styles.skillHeader}>
              <View style={[styles.skillIconWrap, { backgroundColor: skill.color + '18' }]}>
                <Ionicons name={skill.icon as any} size={16} color={skill.color} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.skillNameRow}>
                  <Text style={styles.skillName}>{skill.label}</Text>
                  {isFocus && (
                    <View style={[styles.focusBadge, { backgroundColor: skill.color + '20' }]}>
                      <Text style={[styles.focusBadgeText, { color: skill.color }]}>FOCUS</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.skillDesc}>{skill.description}</Text>
              </View>
              <View style={styles.scoreCol}>
                <Text style={[styles.scoreVal, { color: hasData ? skill.color : colors.textMuted }]}>
                  {hasData ? val : '—'}
                </Text>
                {hasData && <Text style={styles.scoreUnit}>{skill.unit === '%' ? '%' : skill.unit}</Text>}
              </View>
            </View>

            {/* Progress bar */}
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${val}%`, backgroundColor: skill.color }]} />
            </View>

            {/* Footer */}
            <View style={styles.skillFooter}>
              <Text style={styles.logCount}>
                {scoreData?.logCount ?? 0} log{(scoreData?.logCount ?? 0) !== 1 ? 's' : ''}
              </Text>
              {lastUpdated && <Text style={styles.lastUpdated}>Last: {lastUpdated}</Text>}
              <View style={{ flex: 1 }} />
              {isFocus ? (
                <View style={[styles.logBtn, { borderColor: skill.color + '40' }]}>
                  <Ionicons name="add-outline" size={12} color={skill.color} />
                  <Text style={[styles.logBtnText, { color: skill.color }]}>Log</Text>
                </View>
              ) : (
                <Text style={styles.readOnlyLabel}>Read-only</Text>
              )}
            </View>
          </CardWrapper>
        );
      })}
    </View>
  );
}

/* ── Log Challenge Modal ────────────────────────────────────────── */

function LogChallengeModal({
  skillKey,
  onDismiss,
  onSubmit,
}: {
  skillKey: SkillKey;
  onDismiss: () => void;
  onSubmit: (logType: SkillLogType, value: number, metadata: Record<string, unknown>) => Promise<void>;
}) {
  const config = SKILL_LOG_CONFIG[skillKey];
  const meta = HITTING_SKILLS.find((s) => s.key === skillKey)
    ?? MENTAL_SKILLS.find((s) => s.key === skillKey)
    ?? PHYSICAL_SKILLS.find((s) => s.key === skillKey);
  const skillColor = meta?.color ?? '#3b82f6';

  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [input3, setInput3] = useState('');
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    let value: number;
    const metadata: Record<string, unknown> = {};

    if (config.ratingScale) {
      if (rating === 0) {
        Alert.alert('Select a rating', 'Tap 1–5 to rate.');
        return;
      }
      value = rating;
      metadata.rating = rating;
    } else if (config.powerInputs) {
      const ev = parseFloat(input1);
      const mb = parseFloat(input2);
      const vj = input3 ? parseFloat(input3) : null;
      if (isNaN(ev) || isNaN(mb)) {
        Alert.alert('Invalid input', 'Enter exit velocity and med ball velocity.');
        return;
      }
      value = computePowerScore({ exitVelo: ev, medBallVelocity: mb, verticalJump: vj });
      metadata.exitVelo = ev;
      metadata.medBallVelocity = mb;
      if (vj != null) metadata.verticalJump = vj;
    } else if (config.strengthInputs) {
      const lift = parseFloat(input1);
      const bw = parseFloat(input2);
      if (isNaN(lift) || isNaN(bw) || bw <= 0) {
        Alert.alert('Invalid input', 'Enter lift weight and bodyweight.');
        return;
      }
      value = computeStrengthIndex({ liftWeight: lift, bodyweight: bw });
      metadata.liftWeight = lift;
      metadata.bodyweight = bw;
      metadata.ratio = lift / bw;
    } else if (config.twoInputs) {
      const n1 = parseFloat(input1);
      const n2 = parseFloat(input2);
      if (isNaN(n1) || isNaN(n2) || n2 === 0) {
        Alert.alert('Invalid input', 'Enter valid numbers.');
        return;
      }
      value = (n1 / n2) * 100;
      metadata.numerator = n1;
      metadata.denominator = n2;
    } else {
      const n = parseFloat(input1);
      if (isNaN(n)) {
        Alert.alert('Invalid input', 'Enter a valid number.');
        return;
      }
      value = n;
    }

    setSubmitting(true);
    try {
      await onSubmit(config.logType, value, metadata);
    } catch (err) {
      Alert.alert('Error', 'Could not save log.');
    }
    setSubmitting(false);
  }

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onDismiss}>
      <KeyboardAvoidingView
        style={modalStyles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={modalStyles.sheet}>
          <View style={modalStyles.handle} />

          <Text style={[modalStyles.title, { color: skillColor }]}>{config.promptLabel}</Text>
          <Text style={modalStyles.helper}>{config.helperText}</Text>

          {/* Rating Scale */}
          {config.ratingScale && (
            <View style={modalStyles.ratingRow}>
              {[1, 2, 3, 4, 5].map((n) => (
                <TouchableOpacity
                  key={n}
                  style={[
                    modalStyles.ratingBtn,
                    rating === n && { backgroundColor: skillColor + '20', borderColor: skillColor },
                  ]}
                  onPress={() => setRating(n)}
                >
                  <Text style={[modalStyles.ratingText, rating === n && { color: skillColor }]}>{n}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Two Inputs (numerator / denominator) */}
          {config.twoInputs && (
            <View style={modalStyles.twoInputRow}>
              <View style={modalStyles.inputCol}>
                <Text style={modalStyles.inputLabel}>{config.twoInputs.label1}</Text>
                <TextInput
                  style={modalStyles.input}
                  value={input1}
                  onChangeText={setInput1}
                  placeholder={config.twoInputs.placeholder1}
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  returnKeyType="next"
                />
              </View>
              <Text style={modalStyles.divider}>/</Text>
              <View style={modalStyles.inputCol}>
                <Text style={modalStyles.inputLabel}>{config.twoInputs.label2}</Text>
                <TextInput
                  style={modalStyles.input}
                  value={input2}
                  onChangeText={setInput2}
                  placeholder={config.twoInputs.placeholder2}
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  returnKeyType="done"
                />
              </View>
            </View>
          )}

          {/* Power Inputs (exit velo + med ball + optional vertical jump) */}
          {config.powerInputs && (
            <View style={{ gap: 10 }}>
              <View style={{ gap: 4 }}>
                <Text style={modalStyles.inputLabel}>Exit Velocity (mph)</Text>
                <TextInput
                  style={modalStyles.input}
                  value={input1}
                  onChangeText={setInput1}
                  placeholder="85"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  returnKeyType="next"
                />
              </View>
              <View style={{ gap: 4 }}>
                <Text style={modalStyles.inputLabel}>Med Ball Rotational Velocity (mph)</Text>
                <TextInput
                  style={modalStyles.input}
                  value={input2}
                  onChangeText={setInput2}
                  placeholder="65"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  returnKeyType="next"
                />
              </View>
              <View style={{ gap: 4 }}>
                <Text style={modalStyles.inputLabel}>Vertical Jump (in) — optional</Text>
                <TextInput
                  style={modalStyles.input}
                  value={input3}
                  onChangeText={setInput3}
                  placeholder="28"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  returnKeyType="done"
                />
              </View>
            </View>
          )}

          {/* Strength Inputs (lift weight + bodyweight) */}
          {config.strengthInputs && (
            <View style={modalStyles.twoInputRow}>
              <View style={modalStyles.inputCol}>
                <Text style={modalStyles.inputLabel}>Lift Weight (lbs)</Text>
                <TextInput
                  style={modalStyles.input}
                  value={input1}
                  onChangeText={setInput1}
                  placeholder="315"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  returnKeyType="next"
                />
              </View>
              <Text style={modalStyles.divider}>/</Text>
              <View style={modalStyles.inputCol}>
                <Text style={modalStyles.inputLabel}>Bodyweight (lbs)</Text>
                <TextInput
                  style={modalStyles.input}
                  value={input2}
                  onChangeText={setInput2}
                  placeholder="180"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  returnKeyType="done"
                />
              </View>
            </View>
          )}

          {/* Single Input */}
          {!config.ratingScale && !config.twoInputs && !config.powerInputs && !config.strengthInputs && (
            <View style={{ gap: 4 }}>
              <Text style={modalStyles.inputLabel}>{config.inputLabel}</Text>
              <TextInput
                style={modalStyles.input}
                value={input1}
                onChangeText={setInput1}
                placeholder={config.placeholder}
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                returnKeyType="done"
              />
            </View>
          )}

          {/* Actions */}
          <View style={modalStyles.actions}>
            <TouchableOpacity style={modalStyles.cancelBtn} onPress={onDismiss}>
              <Text style={modalStyles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[modalStyles.submitBtn, { backgroundColor: skillColor }]}
              onPress={handleSubmit}
              disabled={submitting}
              activeOpacity={0.85}
            >
              <Text style={modalStyles.submitText}>
                {submitting ? 'Saving...' : 'Log Challenge'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/* ── Helpers ─────────────────────────────────────────────────────── */

function formatRelativeDate(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(isoDate).toLocaleDateString();
}

/* ── Styles ──────────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: colors.textPrimary },
  content: { padding: 16, gap: 16, paddingBottom: 60 },

  focusCallout: {
    flexDirection: 'row',
    gap: 10,
    padding: 12,
    backgroundColor: '#3b82f608',
    borderWidth: 1,
    borderColor: '#3b82f620',
    borderRadius: radius.md,
    alignItems: 'flex-start',
  },
  focusText: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },

  sectionWrap: { gap: 8 },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginTop: 4,
  },

  skillCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 12,
    gap: 8,
  },
  skillHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  skillIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skillNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  skillName: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  focusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  focusBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  skillDesc: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  scoreCol: {
    alignItems: 'flex-end',
  },
  scoreVal: {
    fontSize: 20,
    fontWeight: '900',
  },
  scoreUnit: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '600',
  },
  progressTrack: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
  },
  skillFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logCount: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
  },
  lastUpdated: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
  },
  logBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  logBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  readOnlyLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
    fontStyle: 'italic',
  },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
  },
  helper: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  ratingBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingText: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.textSecondary,
  },
  twoInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  inputCol: {
    flex: 1,
    gap: 4,
  },
  divider: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.textMuted,
    paddingBottom: 10,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  submitBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  submitText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#fff',
  },
});
