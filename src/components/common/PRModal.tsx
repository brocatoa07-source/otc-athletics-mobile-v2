import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { METRIC_DISPLAY, type PersonalRecord } from '@/data/engagement-engine';

interface Props {
  pr: PersonalRecord | null;
  visible: boolean;
  onDismiss: () => void;
}

export function PRModal({ pr, visible, onDismiss }: Props) {
  if (!pr) return null;

  const meta = METRIC_DISPLAY[pr.metricType];
  const label = meta?.label ?? pr.metricType;
  const unit = meta?.unit ?? '';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.trophyWrap}>
            <Ionicons name="trophy" size={48} color="#f59e0b" />
          </View>

          <Text style={styles.title}>NEW PERSONAL RECORD</Text>
          <Text style={styles.metric}>{label}</Text>

          <View style={styles.valueRow}>
            <Text style={styles.oldVal}>{pr.previousBest > 0 ? pr.previousBest : '—'}{unit ? ` ${unit}` : ''}</Text>
            <Ionicons name="arrow-forward" size={20} color="#f59e0b" />
            <Text style={styles.newVal}>{pr.newBest}{unit ? ` ${unit}` : ''}</Text>
          </View>

          <TouchableOpacity style={styles.btn} onPress={onDismiss} activeOpacity={0.85}>
            <Text style={styles.btnText}>LET'S GO</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: '#f59e0b40',
    borderRadius: radius.xl,
    padding: 28,
    alignItems: 'center',
    gap: 12,
    width: '100%',
    maxWidth: 320,
  },
  trophyWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f59e0b15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#f59e0b',
  },
  metric: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 8,
  },
  oldVal: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textMuted,
  },
  newVal: {
    fontSize: 24,
    fontWeight: '900',
    color: '#22c55e',
  },
  btn: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: radius.md,
    marginTop: 8,
  },
  btnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 1,
  },
});
