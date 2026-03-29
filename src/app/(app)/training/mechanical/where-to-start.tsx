/**
 * Where Should I Start? — Simple guide replacing diagnostics.
 *
 * One question → routes to the right troubleshooting category/topic.
 * No labels. No profiles. Just: "Start here."
 */

import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';

const ACCENT = '#E10600';

interface GuideOption {
  label: string;
  topicId: string;
  categoryId: string;
  color: string;
}

const GUIDE_OPTIONS: GuideOption[] = [
  { label: 'I\'m always late', topicId: 'always-late', categoryId: 'timing', color: '#e11d48' },
  { label: 'I\'m always early', topicId: 'always-early', categoryId: 'timing', color: '#e11d48' },
  { label: 'I roll over everything', topicId: 'rolling-over', categoryId: 'contact', color: '#3b82f6' },
  { label: 'I hit pop ups', topicId: 'popping-up', categoryId: 'contact', color: '#3b82f6' },
  { label: 'I get jammed', topicId: 'getting-jammed', categoryId: 'contact', color: '#3b82f6' },
  { label: 'I can\'t go opposite field', topicId: 'no-oppo', categoryId: 'posture', color: '#0891b2' },
  { label: 'I pull off the ball', topicId: 'pulling-off', categoryId: 'posture', color: '#0891b2' },
  { label: 'I can\'t hit offspeed', topicId: 'cant-hit-offspeed', categoryId: 'adjustability', color: '#f59e0b' },
  { label: 'I chase too much', topicId: 'chasing', categoryId: 'approach', color: '#a855f7' },
  { label: 'I don\'t hit the ball hard', topicId: 'weak-contact', categoryId: 'power', color: '#22c55e' },
  { label: 'I feel off balance', topicId: 'losing-posture', categoryId: 'posture', color: '#0891b2' },
  { label: 'I feel disconnected / armsy', topicId: 'disconnected', categoryId: 'power', color: '#22c55e' },
  { label: 'I\'m good in BP, bad in games', topicId: 'bp-hitter', categoryId: 'approach', color: '#a855f7' },
  { label: 'I strike out too much', topicId: 'strikeout-prone', categoryId: 'approach', color: '#a855f7' },
  { label: 'My swing feels slow', topicId: 'no-bat-speed', categoryId: 'power', color: '#22c55e' },
  { label: 'I\'m inconsistent', topicId: 'always-late', categoryId: 'timing', color: '#e11d48' },
];

export default function WhereToStartScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>HITTING VAULT</Text>
          <Text style={styles.headerTitle}>Where Should I Start?</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.promptCard}>
          <Ionicons name="compass" size={28} color={ACCENT} />
          <Text style={styles.promptTitle}>What happens most when you hit?</Text>
          <Text style={styles.promptSub}>Pick the one that sounds most like you. We'll point you to the right place.</Text>
        </View>

        {GUIDE_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.topicId + opt.label}
            style={styles.optionCard}
            onPress={() => router.push(`/(app)/training/mechanical/troubleshoot/topic?id=${opt.topicId}` as any)}
            activeOpacity={0.8}
          >
            <View style={[styles.optionDot, { backgroundColor: opt.color }]} />
            <Text style={styles.optionText}>{opt.label}</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
          </TouchableOpacity>
        ))}

        <View style={styles.noteCard}>
          <Ionicons name="information-circle-outline" size={14} color={colors.textMuted} />
          <Text style={styles.noteText}>
            This is just a starting point. You can browse all categories and topics inside Troubleshoot My Swing.
          </Text>
        </View>
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
  headerTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary },
  content: { padding: 16, paddingBottom: 60, gap: 8 },

  promptCard: {
    alignItems: 'center', gap: 8, padding: 20,
    backgroundColor: ACCENT + '08', borderWidth: 1, borderColor: ACCENT + '20',
    borderRadius: radius.lg, marginBottom: 4,
  },
  promptTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary, textAlign: 'center' },
  promptSub: { fontSize: 12, color: colors.textSecondary, textAlign: 'center', lineHeight: 17 },

  optionCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 14,
  },
  optionDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  optionText: { flex: 1, fontSize: 14, fontWeight: '700', color: colors.textPrimary },

  noteCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8, padding: 12,
    backgroundColor: colors.surface, borderRadius: radius.md, marginTop: 4,
  },
  noteText: { flex: 1, fontSize: 11, color: colors.textMuted, lineHeight: 16 },
});
