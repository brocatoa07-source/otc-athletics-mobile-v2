import { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import {
  type AtBatLog,
  type AtBatResult,
  type TimingValue,
  type FocusValue,
  type PitchDecisionValue,
  type VisionValue,
  type ApproachValue,
  type CountLeverageValue,
  type ContactQualityValue,
  type AtBatContextValue,
  type TeamOutcomeValue,
  type AtBatQualityValue,
  generateId,
  saveAtBat,
  loadGameAtBats,
} from '@/data/at-bat-accountability';

const ACCENT = '#E10600';

/* ─── Option configs for each field ────────────── */

const RESULT_OPTIONS: { value: AtBatResult; label: string }[] = [
  { value: 'single', label: 'Single' },
  { value: 'double', label: 'Double' },
  { value: 'triple', label: 'Triple' },
  { value: 'home_run', label: 'HR' },
  { value: 'walk', label: 'Walk' },
  { value: 'hbp', label: 'HBP' },
  { value: 'strikeout', label: 'K' },
  { value: 'groundout', label: 'GO' },
  { value: 'flyout', label: 'FO' },
  { value: 'lineout', label: 'LO' },
  { value: 'popout', label: 'PO' },
  { value: 'reached_on_error', label: 'ROE' },
  { value: 'fielders_choice', label: 'FC' },
  { value: 'sacrifice', label: 'SAC' },
  { value: 'other_out', label: 'Other' },
];

const TIMING_OPTIONS: { value: TimingValue; label: string }[] = [
  { value: 'on_time', label: 'On Time' },
  { value: 'early', label: 'Early' },
  { value: 'late', label: 'Late' },
];

const FOCUS_OPTIONS: { value: FocusValue; label: string }[] = [
  { value: 'locked_in', label: 'Locked In' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'frustrated', label: 'Frustrated' },
];

const PITCH_DECISION_OPTIONS: { value: PitchDecisionValue; label: string }[] = [
  { value: 'my_pitch', label: 'My Pitch' },
  { value: 'chase', label: 'Chase' },
  { value: 'take_my_pitch', label: 'Took My Pitch' },
];

const VISION_OPTIONS: { value: VisionValue; label: string }[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

const APPROACH_OPTIONS: { value: ApproachValue; label: string }[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

const COUNT_OPTIONS: { value: CountLeverageValue; label: string }[] = [
  { value: 'advantage', label: 'Advantage' },
  { value: 'even', label: 'Even' },
  { value: 'disadvantage', label: 'Behind' },
];

const CONTACT_OPTIONS: { value: ContactQualityValue; label: string }[] = [
  { value: 'barreled', label: 'Barreled' },
  { value: 'solid', label: 'Solid' },
  { value: 'weak', label: 'Weak' },
  { value: 'no_contact', label: 'No Contact' },
];

const CONTEXT_OPTIONS: { value: AtBatContextValue; label: string }[] = [
  { value: 'standard', label: 'Standard AB' },
  { value: 'two_strike_protect', label: '2-Strike Protect' },
  { value: 'productive_ab', label: 'Productive AB' },
  { value: 'rbi_execution', label: 'RBI Execution' },
  { value: 'battle_ab', label: 'Battle AB' },
  { value: 'missed_opportunity', label: 'Missed Opportunity' },
];

const TEAM_OUTCOME_OPTIONS: { value: TeamOutcomeValue; label: string }[] = [
  { value: 'helped_team', label: 'Helped' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'hurt_team', label: 'Hurt' },
];

const AB_QUALITY_OPTIONS: { value: AtBatQualityValue; label: string }[] = [
  { value: 'quality_ab', label: 'Quality AB' },
  { value: 'productive_ab', label: 'Productive AB' },
  { value: 'neutral_ab', label: 'Neutral AB' },
  { value: 'poor_ab', label: 'Poor AB' },
];

export default function EditAtBatScreen() {
  const params = useLocalSearchParams<{
    gameId: string;
    atBatId?: string;
    orderIndex?: string;
  }>();
  const gameId = params.gameId;
  const isEdit = !!params.atBatId;

  const [result, setResult] = useState<AtBatResult>('groundout');
  const [timing, setTiming] = useState<TimingValue>('on_time');
  const [focus, setFocus] = useState<FocusValue>('neutral');
  const [pitchDecision, setPitchDecision] = useState<PitchDecisionValue>('my_pitch');
  const [vision, setVision] = useState<VisionValue>('yes');
  const [approach, setApproach] = useState<ApproachValue>('yes');
  const [countLeverage, setCountLeverage] = useState<CountLeverageValue>('even');
  const [contactQuality, setContactQuality] = useState<ContactQualityValue>('solid');
  const [context, setContext] = useState<AtBatContextValue>('standard');
  const [teamOutcome, setTeamOutcome] = useState<TeamOutcomeValue>('neutral');
  const [abQuality, setAbQuality] = useState<AtBatQualityValue>('neutral_ab');
  const [note, setNote] = useState('');
  const [orderIndex, setOrderIndex] = useState(Number(params.orderIndex ?? 0));
  const [atBatId] = useState(params.atBatId ?? generateId());
  const [saving, setSaving] = useState(false);

  // Load existing at-bat if editing
  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      const abs = await loadGameAtBats(gameId);
      const existing = abs.find((ab) => ab.id === params.atBatId);
      if (existing) {
        setResult(existing.result);
        setTiming(existing.timing);
        setFocus(existing.focus);
        setPitchDecision(existing.pitchDecision);
        setVision(existing.vision);
        setApproach(existing.approach);
        setCountLeverage(existing.countLeverage);
        setContactQuality(existing.contactQuality);
        setContext(existing.context);
        setTeamOutcome(existing.teamOutcome);
        setAbQuality(existing.abQuality);
        setNote(existing.note ?? '');
        setOrderIndex(existing.orderIndex);
      }
    })();
  }, []);

  async function handleSave(addAnother: boolean) {
    if (saving) return;
    setSaving(true);
    try {
      const ab: AtBatLog = {
        id: atBatId,
        gameId,
        createdAt: new Date().toISOString(),
        orderIndex,
        result,
        timing,
        focus,
        pitchDecision,
        vision,
        approach,
        countLeverage,
        contactQuality,
        context,
        teamOutcome,
        abQuality,
        note: note.trim() || undefined,
      };
      await saveAtBat(ab);

      if (addAnother) {
        // Navigate to a fresh at-bat form
        router.replace(
          `/(app)/training/mechanical/edit-at-bat?gameId=${gameId}&orderIndex=${orderIndex + 1}` as any,
        );
      } else {
        // Go to game summary
        router.replace(`/(app)/training/mechanical/game-summary?gameId=${gameId}` as any);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            Alert.alert('Discard this at-bat?', 'Your changes will not be saved.', [
              { text: 'Keep Editing', style: 'cancel' },
              { text: 'Discard', style: 'destructive', onPress: () => router.back() },
            ]);
          }}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>AT-BAT ACCOUNTABILITY</Text>
          <Text style={styles.headerTitle}>
            {isEdit ? 'Edit At-Bat' : `At-Bat #${orderIndex + 1}`}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Result */}
        <ChipSection label="RESULT" options={RESULT_OPTIONS} selected={result} onSelect={setResult as any} wrap />

        {/* Timing */}
        <ChipSection label="WAS I ON TIME?" options={TIMING_OPTIONS} selected={timing} onSelect={setTiming as any} />

        {/* Focus */}
        <ChipSection label="MY FOCUS WAS" options={FOCUS_OPTIONS} selected={focus} onSelect={setFocus as any} />

        {/* Pitch Decision */}
        <ChipSection label="DID I SWING AT THE RIGHT PITCH?" options={PITCH_DECISION_OPTIONS} selected={pitchDecision} onSelect={setPitchDecision as any} />

        {/* Vision */}
        <ChipSection label="DID I SEE THE BALL WELL?" options={VISION_OPTIONS} selected={vision} onSelect={setVision as any} />

        {/* Approach */}
        <ChipSection label="DID I STICK TO MY PLAN?" options={APPROACH_OPTIONS} selected={approach} onSelect={setApproach as any} />

        {/* Count */}
        <ChipSection label="COUNT LEVERAGE" options={COUNT_OPTIONS} selected={countLeverage} onSelect={setCountLeverage as any} />

        {/* Contact */}
        <ChipSection label="CONTACT QUALITY" options={CONTACT_OPTIONS} selected={contactQuality} onSelect={setContactQuality as any} />

        {/* Context */}
        <ChipSection label="AT-BAT CONTEXT" options={CONTEXT_OPTIONS} selected={context} onSelect={setContext as any} wrap />

        {/* Team Outcome */}
        <ChipSection label="DID I HELP THE TEAM?" options={TEAM_OUTCOME_OPTIONS} selected={teamOutcome} onSelect={setTeamOutcome as any} />

        {/* AB Quality */}
        <ChipSection label="AB QUALITY" options={AB_QUALITY_OPTIONS} selected={abQuality} onSelect={setAbQuality as any} />

        {/* Note */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>NOTE (OPTIONAL)</Text>
          <TextInput
            style={styles.textInput}
            value={note}
            onChangeText={setNote}
            placeholder="Quick note..."
            placeholderTextColor={colors.textMuted}
            maxLength={100}
          />
        </View>
      </ScrollView>

      {/* Bottom buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => handleSave(true)}
          activeOpacity={0.8}
          disabled={saving}
        >
          <Ionicons name="add" size={18} color={ACCENT} />
          <Text style={styles.secondaryBtnText}>Save & Add Another</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.primaryBtn, saving && { opacity: 0.6 }]}
          onPress={() => handleSave(false)}
          activeOpacity={0.8}
          disabled={saving}
        >
          <Text style={styles.primaryBtnText}>Done — View Summary</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ─── ChipSection component ───────────────────── */

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

  content: { padding: 16, paddingBottom: 160, gap: 20 },

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
    padding: 16, paddingBottom: 32, gap: 10,
    backgroundColor: colors.bg, borderTopWidth: 1, borderTopColor: colors.border,
  },
  secondaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    borderWidth: 1, borderColor: ACCENT + '40', borderRadius: radius.md,
    paddingVertical: 12, backgroundColor: ACCENT + '08',
  },
  secondaryBtnText: { fontSize: 14, fontWeight: '800', color: ACCENT },
  primaryBtn: {
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: ACCENT, borderRadius: radius.md, paddingVertical: 14,
  },
  primaryBtnText: { fontSize: 16, fontWeight: '900', color: '#fff' },
});
