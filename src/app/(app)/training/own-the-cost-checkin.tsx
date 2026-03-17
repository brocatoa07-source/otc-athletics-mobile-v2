import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import {
  type IdentityValue,
  type WorkValue,
  type EnergyValue,
  type OTCFocusValue,
  type ExcuseValue,
  type ResponsibilityValue,
  type ChallengeValue,
  type FailureResponseValue,
  type OwnTheCostCheckInLog,
  generateId,
  getLocalDateString,
  saveCheckIn,
} from '@/data/own-the-cost-checkin';

const ACCENT = '#f59e0b';

/* ─── Option configs ─────────────────────────────── */

const IDENTITY_OPTIONS: { value: IdentityValue; label: string }[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'somewhat', label: 'Somewhat' },
  { value: 'no', label: 'No' },
];

const WORK_OPTIONS: { value: WorkValue; label: string }[] = [
  { value: 'fully', label: 'Fully' },
  { value: 'partially', label: 'Partially' },
  { value: 'no', label: 'No' },
];

const ENERGY_OPTIONS: { value: EnergyValue; label: string }[] = [
  { value: 'high', label: 'High' },
  { value: 'okay', label: 'Okay' },
  { value: 'low', label: 'Low' },
];

const FOCUS_OPTIONS: { value: OTCFocusValue; label: string }[] = [
  { value: 'locked_in', label: 'Locked In' },
  { value: 'in_and_out', label: 'In and Out' },
  { value: 'distracted', label: 'Distracted' },
];

const EXCUSE_OPTIONS: { value: ExcuseValue; label: string }[] = [
  { value: 'none', label: 'No' },
  { value: 'a_little', label: 'A Little' },
  { value: 'yes', label: 'Yes' },
];

const RESPONSIBILITY_OPTIONS: { value: ResponsibilityValue; label: string }[] = [
  { value: 'owned_everything', label: 'Owned Everything' },
  { value: 'avoided_once_or_twice', label: 'Once or Twice' },
  { value: 'avoided_more_than_should', label: 'More Than I Should' },
];

const CHALLENGE_OPTIONS: { value: ChallengeValue; label: string }[] = [
  { value: 'challenged_myself', label: 'Challenged Myself' },
  { value: 'mix', label: 'A Mix' },
  { value: 'stayed_comfortable', label: 'Stayed Comfortable' },
];

const FAILURE_OPTIONS: { value: FailureResponseValue; label: string }[] = [
  { value: 'leaned_into_it', label: 'Leaned Into It' },
  { value: 'avoided_it', label: 'Avoided It' },
  { value: 'none_today', label: 'None Today' },
];

export default function OwnTheCostCheckInScreen() {
  const [identityAthlete, setIdentityAthlete] = useState<IdentityValue>('yes');
  const [identityPerson, setIdentityPerson] = useState<IdentityValue>('yes');
  const [workCompletion, setWorkCompletion] = useState<WorkValue>('fully');
  const [energy, setEnergy] = useState<EnergyValue>('okay');
  const [focus, setFocus] = useState<OTCFocusValue>('locked_in');
  const [excuses, setExcuses] = useState<ExcuseValue>('none');
  const [responsibility, setResponsibility] = useState<ResponsibilityValue>('owned_everything');
  const [challenge, setChallenge] = useState<ChallengeValue>('challenged_myself');
  const [failureResponse, setFailureResponse] = useState<FailureResponseValue>('none_today');
  const [winReflection, setWinReflection] = useState('');
  const [cleanupReflection, setCleanupReflection] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    if (saving) return;
    setSaving(true);
    try {
      const log: OwnTheCostCheckInLog = {
        id: generateId(),
        date: getLocalDateString(),
        identityAthlete,
        identityPerson,
        workCompletion,
        energy,
        focus,
        excuses,
        responsibilityAvoidance: responsibility,
        challengeLevel: challenge,
        failureResponse,
        winReflection: winReflection.trim() || undefined,
        cleanupReflection: cleanupReflection.trim() || undefined,
      };
      await saveCheckIn(log);
      router.replace('/(app)/training/own-the-cost-summary' as any);
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>OWN THE COST</Text>
          <Text style={styles.headerTitle}>Daily Check-In</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Section 1 — Identity */}
        <Text style={styles.sectionLabel}>IDENTITY STANDARD</Text>

        <ChipSection
          label="DID I SHOW UP LIKE THE ATHLETE I SAY I AM?"
          options={IDENTITY_OPTIONS}
          selected={identityAthlete}
          onSelect={setIdentityAthlete as any}
        />
        <ChipSection
          label="DID I SHOW UP LIKE THE PERSON I SAY I AM?"
          options={IDENTITY_OPTIONS}
          selected={identityPerson}
          onSelect={setIdentityPerson as any}
        />

        {/* Section 2 — Discipline */}
        <Text style={styles.sectionLabel}>DISCIPLINE</Text>

        <ChipSection
          label="DID I COMPLETE WHAT I NEEDED TO TODAY?"
          options={WORK_OPTIONS}
          selected={workCompletion}
          onSelect={setWorkCompletion as any}
        />

        {/* Section 3 — Energy */}
        <Text style={styles.sectionLabel}>ENERGY</Text>

        <ChipSection
          label="HOW WAS MY PHYSICAL AND MENTAL ENERGY?"
          options={ENERGY_OPTIONS}
          selected={energy}
          onSelect={setEnergy as any}
        />

        {/* Section 4 — Focus */}
        <Text style={styles.sectionLabel}>FOCUS</Text>

        <ChipSection
          label="HOW FOCUSED WAS I TODAY?"
          options={FOCUS_OPTIONS}
          selected={focus}
          onSelect={setFocus as any}
        />

        {/* Section 5 — Ownership */}
        <Text style={styles.sectionLabel}>OWNERSHIP</Text>

        <ChipSection
          label="DID I MAKE EXCUSES TODAY?"
          options={EXCUSE_OPTIONS}
          selected={excuses}
          onSelect={setExcuses as any}
        />
        <ChipSection
          label="WHERE DID I AVOID RESPONSIBILITY?"
          options={RESPONSIBILITY_OPTIONS}
          selected={responsibility}
          onSelect={setResponsibility as any}
          wrap
        />

        {/* Section 6 — Challenge */}
        <Text style={styles.sectionLabel}>CHALLENGE</Text>

        <ChipSection
          label="DID I CHALLENGE MYSELF OR STAY COMFORTABLE?"
          options={CHALLENGE_OPTIONS}
          selected={challenge}
          onSelect={setChallenge as any}
          wrap
        />
        <ChipSection
          label="HOW DID I RESPOND TO FAILURE OR DIFFICULTY?"
          options={FAILURE_OPTIONS}
          selected={failureResponse}
          onSelect={setFailureResponse as any}
          wrap
        />

        {/* Section 7 — Reflection */}
        <Text style={styles.sectionLabel}>REFLECTION (OPTIONAL)</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>ONE WIN TODAY</Text>
          <TextInput
            style={styles.textInput}
            value={winReflection}
            onChangeText={setWinReflection}
            placeholder="What went well..."
            placeholderTextColor={colors.textMuted}
            maxLength={120}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>ONE THING TO CLEAN UP TOMORROW</Text>
          <TextInput
            style={styles.textInput}
            value={cleanupReflection}
            onChangeText={setCleanupReflection}
            placeholder="What to improve..."
            placeholderTextColor={colors.textMuted}
            maxLength={120}
          />
        </View>
      </ScrollView>

      {/* Submit */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.submitBtn, saving && { opacity: 0.6 }]}
          onPress={handleSubmit}
          activeOpacity={0.8}
          disabled={saving}
        >
          <Text style={styles.submitBtnText}>Own It</Text>
          <Ionicons name="shield-checkmark" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ─── ChipSection ────────────────────────────────── */

function ChipSection<T extends string>({
  label,
  options,
  selected,
  onSelect,
  wrap,
}: {
  label: string;
  options: { value: T; label: string }[];
  selected: T;
  onSelect: (v: T) => void;
  wrap?: boolean;
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.chipRow, wrap && styles.chipRowWrap]}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.chip, selected === opt.value && styles.chipActive]}
            onPress={() => onSelect(opt.value)}
            activeOpacity={0.8}
          >
            <Text style={[styles.chipText, selected === opt.value && styles.chipTextActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: { padding: 2 },
  headerSup: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5, color: ACCENT },
  headerTitle: { fontSize: 20, fontWeight: '900', color: colors.textPrimary },

  content: { padding: 16, paddingBottom: 160, gap: 12 },

  sectionLabel: {
    fontSize: 10, fontWeight: '900', letterSpacing: 1.5, color: ACCENT,
    marginTop: 8,
  },

  fieldGroup: { gap: 8 },
  fieldLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.2, color: colors.textMuted },

  chipRow: { flexDirection: 'row', gap: 8 },
  chipRowWrap: { flexWrap: 'wrap' },
  chip: {
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: { borderColor: ACCENT, backgroundColor: ACCENT + '15' },
  chipText: { fontSize: 13, fontWeight: '800', color: colors.textSecondary },
  chipTextActive: { color: ACCENT },

  textInput: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 14,
    fontSize: 14, fontWeight: '700', color: colors.textPrimary,
  },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 16, paddingBottom: 32,
    backgroundColor: colors.bg, borderTopWidth: 1, borderTopColor: colors.border,
  },
  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: ACCENT, borderRadius: radius.md, paddingVertical: 16,
  },
  submitBtnText: { fontSize: 16, fontWeight: '900', color: '#fff' },
});
