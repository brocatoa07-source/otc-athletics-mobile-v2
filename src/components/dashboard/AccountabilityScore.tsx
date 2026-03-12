import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { Card } from '@/components/common/Card';
import { useDailyStandards } from '@/hooks/useDailyStandards';

export function AccountabilityScore() {
  const { streak, last7Days, standards, todayChecked, loaded } = useDailyStandards();

  if (!loaded) return null;

  const todayComplete = standards.length > 0 &&
    standards.every((s) => todayChecked.has(s.id));

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <View>
          <Text style={styles.label}>ACCOUNTABILITY</Text>
          <View style={styles.streakRow}>
            <Text style={styles.streak}>{streak}</Text>
            <Text style={styles.streakUnit}>{streak === 1 ? 'day' : 'days'}</Text>
          </View>
          <Text style={styles.sub}>
            {todayComplete ? 'Standards met today' : 'Standards streak'}
          </Text>
        </View>
        <View style={styles.dots}>
          {last7Days.map((d, i) => (
            <View key={i} style={styles.dotCol}>
              <View style={[styles.dot, d.allMet && styles.dotActive]} />
              <Text style={styles.dotDay}>{d.day}</Text>
            </View>
          ))}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 11, fontWeight: '800', color: Colors.textMuted, letterSpacing: 1.5, marginBottom: 4 },
  streakRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  streak: { fontSize: 40, fontWeight: '900', color: Colors.primary },
  streakUnit: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600' },
  sub: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  dots: { flexDirection: 'row', gap: 6 },
  dotCol: { alignItems: 'center', gap: 4 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.bgElevated, borderWidth: 1, borderColor: Colors.border },
  dotActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  dotDay: { fontSize: 9, color: Colors.textMuted, fontWeight: '600' },
});
