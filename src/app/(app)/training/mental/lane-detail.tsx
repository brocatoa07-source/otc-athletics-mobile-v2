import { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import { MENTAL_LANES } from '@/features/mental/mentalProgress';
import { computeMentalTrends } from '@/features/mental/mentalProgress';
import {
  evaluateLevelUpProgress, attemptLevelUp, loadLaneLevels,
  getLaneName, getLevelName,
  type LevelUpProgress,
} from '@/features/mental/mentalProgression';
import { computeMentalFocus } from '@/features/mental/mentalFocusEngine';

const ACCENT = '#a855f7';

const LANE_METRIC_KEY: Record<string, string> = {
  confidence: 'confidence',
  focus: 'focus',
  emotional_control: 'emotionalControl',
  routines: 'routineCompletion',
  self_talk: 'journalCompletion',
  pressure: 'confidence',
};

export default function LaneDetailScreen() {
  const { lane: laneKey } = useLocalSearchParams<{ lane: string }>();
  const lane = MENTAL_LANES.find(l => l.key === laneKey);

  const [currentLevel, setCurrentLevel] = useState(0);
  const [progress, setProgress] = useState<LevelUpProgress | null>(null);
  const [trendImproving, setTrendImproving] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [leveledUp, setLeveledUp] = useState(false);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!laneKey) return;
      let active = true;
      (async () => {
        setLoading(true);
        const [levels, trends, focus] = await Promise.all([
          loadLaneLevels(),
          computeMentalTrends(),
          computeMentalFocus(null),
        ]);
        if (!active) return;

        const lvl = levels[laneKey] ?? 0;
        setCurrentLevel(lvl);
        setIsActive(focus.currentLane === laneKey);

        const metricKey = LANE_METRIC_KEY[laneKey] ?? 'confidence';
        const trend = trends.find(t => t.key === metricKey);
        const improving = trend?.trend === 'improving';
        setTrendImproving(improving);

        const prog = await evaluateLevelUpProgress(laneKey, improving);
        if (active) { setProgress(prog); setLoading(false); }
      })();
      return () => { active = false; };
    }, [laneKey]),
  );

  async function handleLevelUp() {
    if (!laneKey) return;
    const result = await attemptLevelUp(laneKey, trendImproving);
    if (result.leveled) {
      setCurrentLevel(result.newLevel);
      setLeveledUp(true);
      // Re-evaluate progress for new level
      const prog = await evaluateLevelUpProgress(laneKey, trendImproving);
      setProgress(prog);
    }
  }

  if (!lane || !laneKey) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Lane not found.</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: ACCENT }}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentLevelData = lane.levels[Math.min(currentLevel, lane.levels.length - 1)];
  const nextLevelData = currentLevel < lane.levels.length - 1 ? lane.levels[currentLevel + 1] : null;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSup}>MENTAL LANE</Text>
          <Text style={styles.headerTitle}>{getLaneName(laneKey)}</Text>
        </View>
        {isActive && (
          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeText}>ACTIVE</Text>
          </View>
        )}
      </View>

      {loading ? (
        <View style={styles.center}><ActivityIndicator color={ACCENT} size="large" /></View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          {/* Level-Up Banner */}
          {leveledUp && (
            <View style={[styles.levelUpBanner, { borderColor: '#22c55e40' }]}>
              <Ionicons name="trophy" size={20} color="#22c55e" />
              <View style={{ flex: 1 }}>
                <Text style={styles.levelUpTitle}>Level Up!</Text>
                <Text style={styles.levelUpSub}>
                  You advanced to {getLevelName(currentLevel)} in {getLaneName(laneKey)}.
                </Text>
              </View>
            </View>
          )}

          {/* Current Level */}
          <View style={[styles.levelCard, { borderColor: ACCENT + '30' }]}>
            <Text style={[styles.levelLabel, { color: ACCENT }]}>CURRENT LEVEL</Text>
            <Text style={styles.levelTitle}>Level {currentLevel} — {currentLevelData.title}</Text>
            <Text style={styles.levelDesc}>{currentLevelData.description}</Text>
          </View>

          {/* Progress Toward Next Level */}
          {progress && currentLevel < 2 && (
            <View style={styles.progressCard}>
              <Text style={styles.progressTitle}>How to Level Up</Text>

              {/* Progress bar */}
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${progress.progressPct}%`, backgroundColor: ACCENT }]} />
              </View>
              <Text style={styles.progressPct}>{progress.progressPct}% complete</Text>

              {/* Requirements checklist */}
              {progress.requirements.map((req, i) => (
                <View key={i} style={styles.reqRow}>
                  <Ionicons
                    name={req.met ? 'checkmark-circle' : 'ellipse-outline'}
                    size={16}
                    color={req.met ? '#22c55e' : colors.textMuted}
                  />
                  <Text style={[styles.reqText, req.met && styles.reqTextMet]}>{req.label}</Text>
                </View>
              ))}

              {/* Level-up button */}
              {progress.allMet && (
                <TouchableOpacity
                  style={[styles.levelUpBtn, { backgroundColor: '#22c55e' }]}
                  onPress={handleLevelUp}
                  activeOpacity={0.85}
                >
                  <Ionicons name="arrow-up-circle" size={18} color="#fff" />
                  <Text style={styles.levelUpBtnText}>Level Up</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Max Level */}
          {currentLevel >= 2 && (
            <View style={[styles.levelCard, { borderColor: '#22c55e30' }]}>
              <Ionicons name="trophy" size={20} color="#22c55e" />
              <Text style={styles.levelTitle}>Maximum Level Reached</Text>
              <Text style={styles.levelDesc}>Maintain and compete. This skill is now a weapon.</Text>
            </View>
          )}

          {/* Next Level Preview */}
          {nextLevelData && (
            <View style={styles.nextCard}>
              <Text style={styles.nextLabel}>NEXT LEVEL</Text>
              <Text style={styles.nextTitle}>{nextLevelData.title}</Text>
              <Text style={styles.nextDesc}>{nextLevelData.description}</Text>
            </View>
          )}

          {/* All Levels */}
          <Text style={styles.sectionLabel}>ALL LEVELS</Text>
          {lane.levels.map((lvl, i) => (
            <View key={i} style={[styles.allLevelRow, i === currentLevel && { borderColor: ACCENT + '40' }]}>
              <View style={[styles.levelDot, {
                backgroundColor: i <= currentLevel ? ACCENT : colors.border,
              }]} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.allLevelTitle, i === currentLevel && { color: ACCENT }]}>
                  Level {i} — {lvl.title}
                </Text>
                <Text style={styles.allLevelDesc}>{lvl.description}</Text>
              </View>
              {i < currentLevel && <Ionicons name="checkmark-circle" size={14} color="#22c55e" />}
              {i === currentLevel && <Text style={[styles.currentTag, { color: ACCENT }]}>CURRENT</Text>}
            </View>
          ))}

        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  errorText: { fontSize: 14, color: colors.textMuted },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: { padding: 2 },
  headerSup: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5, color: ACCENT },
  headerTitle: { fontSize: 20, fontWeight: '900', color: colors.textPrimary },
  activeBadge: { paddingHorizontal: 8, paddingVertical: 3, backgroundColor: ACCENT + '15', borderRadius: 4 },
  activeBadgeText: { fontSize: 8, fontWeight: '900', letterSpacing: 1, color: ACCENT },
  content: { padding: 16, paddingBottom: 60, gap: 12 },

  levelUpBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14,
    backgroundColor: '#22c55e10', borderWidth: 1, borderRadius: radius.md,
  },
  levelUpTitle: { fontSize: 16, fontWeight: '900', color: '#22c55e' },
  levelUpSub: { fontSize: 12, color: colors.textSecondary },

  levelCard: {
    padding: 14, backgroundColor: colors.surface,
    borderWidth: 1, borderRadius: radius.md, gap: 4,
  },
  levelLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  levelTitle: { fontSize: 15, fontWeight: '800', color: colors.textPrimary },
  levelDesc: { fontSize: 12, color: colors.textMuted, lineHeight: 17 },

  progressCard: {
    padding: 14, backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, gap: 8,
  },
  progressTitle: { fontSize: 12, fontWeight: '900', color: colors.textPrimary },
  progressBarBg: { height: 6, borderRadius: 3, backgroundColor: colors.border, overflow: 'hidden' },
  progressBarFill: { height: 6, borderRadius: 3 },
  progressPct: { fontSize: 10, color: colors.textMuted, textAlign: 'right' },

  reqRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 3 },
  reqText: { flex: 1, fontSize: 12, color: colors.textMuted },
  reqTextMet: { color: '#22c55e', textDecorationLine: 'line-through' },

  levelUpBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 12, borderRadius: radius.md, marginTop: 4,
  },
  levelUpBtnText: { fontSize: 14, fontWeight: '800', color: '#fff' },

  nextCard: {
    padding: 14, backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
    gap: 4, opacity: 0.6,
  },
  nextLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1.2, color: colors.textMuted },
  nextTitle: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  nextDesc: { fontSize: 12, color: colors.textMuted, lineHeight: 17 },

  sectionLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5, color: colors.textMuted, marginTop: 8 },

  allLevelRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
  },
  levelDot: { width: 10, height: 10, borderRadius: 5 },
  allLevelTitle: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  allLevelDesc: { fontSize: 10, color: colors.textMuted },
  currentTag: { fontSize: 8, fontWeight: '900', letterSpacing: 1 },
});
