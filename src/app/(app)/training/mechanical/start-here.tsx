/**
 * Start Here — How this vault works. Read first.
 */

import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';

const ACCENT = '#E10600';

export default function StartHereScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>HITTING VAULT</Text>
          <Text style={styles.headerTitle}>Start Here</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Ionicons name="baseball" size={32} color={ACCENT} />
          <Text style={styles.heroTitle}>How This Vault Works</Text>
        </View>

        <View style={styles.textCard}>
          <Text style={styles.bodyText}>
            Hitting is not as complicated as people make it.
          </Text>
          <Text style={styles.bodyText}>
            Most hitting problems come from a few things: timing, contact point, barrel control, posture, approach, and strength.
          </Text>
          <Text style={styles.bodyText}>
            If you fix those, you become a good hitter.
          </Text>
        </View>

        <View style={[styles.textCard, { borderColor: ACCENT + '25' }]}>
          <Text style={[styles.emphasisText, { color: ACCENT }]}>
            The goal of this vault is simple:
          </Text>
          <Text style={styles.emphasisText}>
            Find your problem → Work on it for 7 days → Get better → Repeat.
          </Text>
        </View>

        <View style={styles.textCard}>
          <Text style={styles.bodyText}>
            Real practice is not doing what you're good at.
          </Text>
          <Text style={styles.bodyText}>
            Real practice is working on what you're bad at until it becomes a strength.
          </Text>
          <Text style={styles.bodyText}>
            If you get frustrated, you're probably working on the right thing.
          </Text>
        </View>

        <View style={styles.ruleCard}>
          <Ionicons name="lock-closed" size={16} color={ACCENT} />
          <View style={{ flex: 1 }}>
            <Text style={styles.ruleTitle}>The Rule</Text>
            <Text style={styles.ruleText}>
              Do not jump from drill to drill.{'\n'}
              Do not jump from problem to problem.{'\n\n'}
              Pick one problem.{'\n'}
              Work on it for 7 days.{'\n'}
              Then move on.
            </Text>
          </View>
        </View>

        <View style={styles.loopCard}>
          <Text style={[styles.sectionLabel, { color: ACCENT }]}>THE DEVELOPMENT LOOP</Text>
          {[
            { num: '1', text: 'Find your problem' },
            { num: '2', text: 'Lock in for 7 days' },
            { num: '3', text: 'Follow the practice plan' },
            { num: '4', text: 'Check in daily' },
            { num: '5', text: 'Review after 7 days' },
            { num: '6', text: 'Save what works to Playbook' },
            { num: '7', text: 'Pick next problem or repeat' },
          ].map((step) => (
            <View key={step.num} style={styles.loopRow}>
              <View style={styles.loopNum}>
                <Text style={styles.loopNumText}>{step.num}</Text>
              </View>
              <Text style={styles.loopText}>{step.text}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => router.push('/(app)/training/mechanical/where-to-start' as any)}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaBtnText}>Find My Starting Point</Text>
          <Ionicons name="arrow-forward" size={16} color="#fff" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
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
  content: { padding: 16, paddingBottom: 60, gap: 14 },

  heroCard: { alignItems: 'center', gap: 10, paddingVertical: 20 },
  heroTitle: { fontSize: 22, fontWeight: '900', color: colors.textPrimary },

  textCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 16, gap: 10,
  },
  bodyText: { fontSize: 15, color: colors.textSecondary, lineHeight: 23 },
  emphasisText: { fontSize: 16, fontWeight: '800', color: colors.textPrimary, lineHeight: 24 },

  ruleCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: ACCENT + '08', borderWidth: 1, borderColor: ACCENT + '25',
    borderRadius: radius.lg, padding: 16,
  },
  ruleTitle: { fontSize: 14, fontWeight: '900', color: ACCENT, marginBottom: 4 },
  ruleText: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, lineHeight: 22 },

  sectionLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },
  loopCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 14, gap: 8,
  },
  loopRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  loopNum: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: ACCENT + '15',
    alignItems: 'center', justifyContent: 'center',
  },
  loopNumText: { fontSize: 11, fontWeight: '900', color: ACCENT },
  loopText: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },

  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 16, borderRadius: radius.lg, backgroundColor: ACCENT,
  },
  ctaBtnText: { fontSize: 16, fontWeight: '900', color: '#fff' },
});
