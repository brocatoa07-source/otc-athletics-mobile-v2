/**
 * Topic Detail — View problem details + Lock In / Switch / Abandon / Check In
 *
 * Product rules:
 *   - Can lock in if no active block
 *   - Can SWITCH on Day 1 only (same-day grace)
 *   - Can ABANDON any time (confirmation required, tracked)
 *   - Can CHECK IN daily
 *   - Can repeat topic immediately after block ends
 */

import { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import {
  getTopicById, getCategoryById, getTopicStat,
  loadActiveBlock, canLockIn, lockInTopic, checkInToday, abandonBlock,
  getCurrentDayOfBlock, getDaysRemaining, isTodayCheckedIn,
  type ActiveBlock, type TopicStats,
} from '@/data/troubleshooting-engine';
import { getTopicContent, ENVIRONMENT_LABELS, BALL_FLIGHT_FEEDBACK, POSTURE_PHILOSOPHY } from '@/data/troubleshooting-content';
import { getDrillsForTopic, getDrillById, DRILL_TYPE_META } from '@/data/tagged-drills';
import { getTodaysDrillId } from '@/data/troubleshooting-engine';

const ACCENT = '#E10600';

export default function TopicDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const topic = id ? getTopicById(id) : undefined;
  const category = topic ? getCategoryById(topic.categoryId) : undefined;

  const [activeBlock, setActiveBlock] = useState<ActiveBlock | null>(null);
  const [stats, setStats] = useState<TopicStats | null>(null);
  const [locking, setLocking] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadActiveBlock().then(setActiveBlock);
      if (id) getTopicStat(id).then(setStats);
    }, [id]),
  );

  if (!topic || !category) return null;

  const content = getTopicContent(topic.id);
  const isThisTopicActive = activeBlock?.isActive && activeBlock.topicId === topic.id;
  const isOtherTopicActive = activeBlock?.isActive && activeBlock.topicId !== topic.id;
  const currentDay = isThisTopicActive ? getCurrentDayOfBlock(activeBlock!.startDate) : 0;
  const daysLeft = isThisTopicActive ? getDaysRemaining(activeBlock!.endDate) : 0;
  const checkedIn = isThisTopicActive ? isTodayCheckedIn(activeBlock) : false;

  // Day 1 switch: another topic is active but it's Day 1 — can switch
  const canSwitchDay1 = isOtherTopicActive && getCurrentDayOfBlock(activeBlock!.startDate) === 1;

  async function handleLockIn() {
    const check = await canLockIn();
    if (!check.allowed && !check.canSwitch) {
      Alert.alert('Already Locked In', check.reason ?? 'You have an active 7-day block.');
      return;
    }
    if (check.canSwitch) {
      Alert.alert(
        'Switch Topic?',
        `You locked into "${check.currentTopic}" today. Switch to "${topic!.title}" instead? The current block will be abandoned.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Switch', onPress: doLockIn },
        ],
      );
      return;
    }
    await doLockIn();
  }

  async function doLockIn() {
    setLocking(true);
    const block = await lockInTopic(topic!.id);
    setActiveBlock(block);
    const s = await getTopicStat(topic!.id);
    setStats(s);
    setLocking(false);
  }

  async function handleCheckIn() {
    const updated = await checkInToday();
    if (updated) setActiveBlock(updated);
  }

  function handleAbandon() {
    Alert.alert(
      'Abandon Block?',
      `Are you sure you want to abandon your "${topic!.title}" block? This will be tracked in your history. You can start a new topic immediately.`,
      [
        { text: 'Keep Going', style: 'cancel' },
        {
          text: 'Abandon',
          style: 'destructive',
          onPress: async () => {
            await abandonBlock();
            const b = await loadActiveBlock();
            setActiveBlock(b);
          },
        },
      ],
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerSup, { color: category.color }]}>{category.title.toUpperCase()}</Text>
          <Text style={styles.headerTitle} numberOfLines={1}>{topic.title}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Problem description */}
        <View style={[styles.card, { borderColor: category.color + '25' }]}>
          <Text style={styles.problemTitle}>{topic.title}</Text>
          <Text style={styles.problemDesc}>{topic.shortDescription}</Text>
          {stats && stats.timesSelected > 1 && (
            <View style={styles.repeatBadge}>
              <Ionicons name="refresh" size={10} color="#f59e0b" />
              <Text style={styles.repeatText}>
                Selected {stats.timesSelected}x
                {stats.timesCompleted > 0 ? ` · Completed ${stats.timesCompleted}x` : ''}
              </Text>
            </View>
          )}
        </View>

        {/* ═══════ TOPIC EDUCATION CONTENT ═══════ */}
        {content && (
          <>
            {/* What's Actually Happening */}
            <View style={styles.card}>
              <Text style={styles.sectionLabel}>WHAT'S ACTUALLY HAPPENING</Text>
              <Text style={styles.bodyText}>{content.whatsHappening}</Text>
            </View>

            {/* Why This May Be Happening */}
            <View style={styles.card}>
              <Text style={[styles.sectionLabel, { color: '#f59e0b' }]}>WHY THIS MAY BE HAPPENING</Text>
              {content.whyItHappens.map((reason, i) => (
                <View key={i} style={styles.reasonRow}>
                  <View style={styles.reasonDot} />
                  <Text style={styles.reasonText}>{reason}</Text>
                </View>
              ))}
            </View>

            {/* What The Hitter Needs To Learn (contact topics) */}
            {content.whatToLearn && content.whatToLearn.length > 0 && (
              <View style={styles.card}>
                <Text style={[styles.sectionLabel, { color: category.color }]}>WHAT YOU NEED TO LEARN</Text>
                {content.whatToLearn.map((item, i) => (
                  <View key={i} style={styles.reasonRow}>
                    <View style={[styles.reasonDot, { backgroundColor: category.color }]} />
                    <Text style={styles.reasonText}>{item}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* 7-Day Practice Plan */}
            <View style={styles.card}>
              <Text style={[styles.sectionLabel, { color: category.color }]}>7-DAY PRACTICE PLAN</Text>
              <Text style={styles.planIntro}>20 minutes per day. Tee → Flips → Overhand → Machine → Compete.</Text>
              {content.practicePlan.map((day) => {
                const env = ENVIRONMENT_LABELS[day.environment];
                const isToday = isThisTopicActive && currentDay === day.day;
                return (
                  <View key={day.day} style={[styles.dayCard, isToday && { borderColor: category.color + '40' }]}>
                    <View style={styles.dayHeader}>
                      <View style={[styles.dayBadge, { backgroundColor: env.color + '15' }]}>
                        <Text style={[styles.dayBadgeText, { color: env.color }]}>D{day.day}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.dayLabel}>{day.label}</Text>
                        <View style={styles.dayEnvRow}>
                          <Ionicons name={env.icon as any} size={10} color={env.color} />
                          <Text style={[styles.dayEnvText, { color: env.color }]}>{env.label}</Text>
                          <Text style={styles.dayDuration}>{day.duration}</Text>
                        </View>
                      </View>
                      {isToday && (
                        <View style={[styles.todayBadge, { backgroundColor: category.color + '15' }]}>
                          <Text style={[styles.todayBadgeText, { color: category.color }]}>Today</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.dayFocus}>{day.focus}</Text>
                    <View style={styles.dayDrills}>
                      {day.drills.map((drill, di) => (
                        <View key={di} style={styles.dayDrillRow}>
                          <View style={[styles.dayDrillDot, { backgroundColor: env.color }]} />
                          <Text style={styles.dayDrillText}>{drill}</Text>
                        </View>
                      ))}
                    </View>
                    {day.note && (
                      <Text style={styles.dayNote}>{day.note}</Text>
                    )}
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* ═══════ DRILL PROGRESSION (Foundation → Skill → Transfer) ═══════ */}
        {content?.drillProgression && content.drillProgression.length > 0 && (
          <View style={styles.card}>
            <Text style={[styles.sectionLabel, { color: category.color }]}>DRILL PROGRESSION</Text>
            {content.drillProgression.map((group) => {
              const stageColors: Record<string, string> = {
                'foundation': '#3b82f6',
                'skill-building': '#22c55e',
                'transfer': '#f59e0b',
              };
              const stageColor = stageColors[group.stage] ?? category.color;
              return (
                <View key={group.stage} style={styles.progressionGroup}>
                  <View style={[styles.progressionBadge, { backgroundColor: stageColor + '15' }]}>
                    <Text style={[styles.progressionBadgeText, { color: stageColor }]}>{group.label}</Text>
                  </View>
                  {group.drills.map((drill, di) => (
                    <View key={di} style={styles.progressionDrillRow}>
                      <View style={[styles.progressionDot, { backgroundColor: stageColor }]} />
                      <Text style={styles.progressionDrillText}>{drill}</Text>
                    </View>
                  ))}
                </View>
              );
            })}
          </View>
        )}

        {/* ═══════ CUES (empty section for future content) ═══════ */}
        {content?.cues !== undefined && (
          <View style={styles.card}>
            <Text style={[styles.sectionLabel, { color: category.color }]}>CUES</Text>
            {content.cues.length > 0 ? (
              content.cues.map((cue, i) => (
                <View key={i} style={styles.cueRow}>
                  <Ionicons name="mic-outline" size={12} color={category.color} />
                  <Text style={[styles.cueText, { color: category.color }]}>{cue}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyPlaceholder}>Coming soon</Text>
            )}
          </View>
        )}

        {/* ═══════ OUTCOME CHALLENGES (empty section for future content) ═══════ */}
        {content?.outcomeChallenges !== undefined && (
          <View style={styles.card}>
            <Text style={[styles.sectionLabel, { color: category.color }]}>OUTCOME CHALLENGES</Text>
            {content.outcomeChallenges.length > 0 ? (
              content.outcomeChallenges.map((challenge, i) => (
                <View key={i} style={styles.reasonRow}>
                  <Ionicons name="trophy-outline" size={12} color={category.color} />
                  <Text style={styles.reasonText}>{challenge}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyPlaceholder}>Coming soon</Text>
            )}
          </View>
        )}

        {/* ═══════ FEELS (empty section for future content) ═══════ */}
        {content?.feels !== undefined && (
          <View style={styles.card}>
            <Text style={[styles.sectionLabel, { color: category.color }]}>FEELS</Text>
            {content.feels.length > 0 ? (
              content.feels.map((feel, i) => (
                <View key={i} style={styles.reasonRow}>
                  <Ionicons name="hand-left-outline" size={12} color={category.color} />
                  <Text style={styles.reasonText}>{feel}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyPlaceholder}>Coming soon</Text>
            )}
          </View>
        )}

        {/* ═══════ BALL FLIGHT FEEDBACK (posture topics) ═══════ */}
        {topic.categoryId === 'posture' && (
          <View style={styles.card}>
            <Text style={[styles.sectionLabel, { color: category.color }]}>WHAT THE BALL TELLS YOU</Text>
            <Text style={styles.bodyText}>Ball flight is feedback. Good hitters learn from result patterns instead of guessing every swing.</Text>
            {BALL_FLIGHT_FEEDBACK.map((signal) => {
              const qualityColors: Record<string, string> = { bad: '#ef4444', improving: '#f59e0b', good: '#22c55e', elite: '#8b5cf6' };
              const qColor = qualityColors[signal.quality] ?? colors.textMuted;
              return (
                <View key={signal.result} style={styles.ballFlightRow}>
                  <View style={[styles.ballFlightDot, { backgroundColor: qColor }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.ballFlightResult, { color: qColor }]}>{signal.result}</Text>
                    <Text style={styles.ballFlightMeaning}>{signal.meaning}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* ═══════ KEY TAKEAWAY (posture topics) ═══════ */}
        {topic.categoryId === 'posture' && (
          <View style={[styles.takeawayCard, { borderColor: category.color + '30' }]}>
            <Ionicons name="bulb" size={18} color={category.color} />
            <Text style={[styles.takeawayText, { color: category.color }]}>
              {POSTURE_PHILOSOPHY.keyTakeaway}
            </Text>
          </View>
        )}

        {/* Playbook prompt for repeat users */}
        {stats && stats.timesSelected >= 3 && (
          <View style={styles.playbookPrompt}>
            <Ionicons name="bookmark" size={14} color="#f59e0b" />
            <Text style={styles.playbookPromptText}>
              You've worked on this {stats.timesSelected} times. Save your best drill and cue to your Playbook.
            </Text>
            <TouchableOpacity onPress={() => router.push('/(app)/playbook/new-entry?type=cue' as any)}>
              <Text style={styles.playbookPromptCta}>Save to Playbook</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ═══════ TAGGED DRILL LIBRARY FOR THIS TOPIC ═══════ */}
        {(() => {
          const taggedDrills = getDrillsForTopic(topic.id);
          if (taggedDrills.length === 0) return null;
          return (
            <View style={styles.card}>
              <Text style={[styles.sectionLabel, { color: category.color }]}>DRILLS THAT FIX THIS</Text>
              {taggedDrills.slice(0, 8).map((drill) => {
                const typeMeta = DRILL_TYPE_META[drill.drillType];
                return (
                  <View key={drill.id} style={styles.taggedDrillRow}>
                    <View style={[styles.taggedDrillDot, { backgroundColor: typeMeta.color }]} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.taggedDrillName}>{drill.name}</Text>
                      <Text style={styles.taggedDrillDesc}>{drill.whatItFixes}</Text>
                    </View>
                    <View style={[styles.taggedDrillBadge, { backgroundColor: typeMeta.color + '15' }]}>
                      <Text style={[styles.taggedDrillBadgeText, { color: typeMeta.color }]}>{typeMeta.label}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          );
        })()}

        {/* ═══════ BUILD MY 7-DAY PLAN CTA ═══════ */}
        {!isThisTopicActive && !isOtherTopicActive && (
          <TouchableOpacity
            style={[styles.buildPlanBtn, { backgroundColor: category.color }]}
            onPress={() => router.push(`/(app)/training/mechanical/troubleshoot/plan-builder?topicId=${topic.id}` as any)}
            activeOpacity={0.85}
          >
            <Ionicons name="calendar" size={18} color="#fff" />
            <Text style={styles.buildPlanBtnText}>Build My 7-Day Plan</Text>
          </TouchableOpacity>
        )}

        {/* ═══════ TODAY'S ASSIGNED DRILL (if custom plan exists) ═══════ */}
        {isThisTopicActive && activeBlock?.dailyDrills && (() => {
          const todayDrillId = getTodaysDrillId(activeBlock);
          const todayDrill = todayDrillId ? getDrillById(todayDrillId) : null;
          if (!todayDrill) return null;
          const typeMeta = DRILL_TYPE_META[todayDrill.drillType];
          return (
            <View style={[styles.card, { borderColor: typeMeta.color + '30' }]}>
              <Text style={[styles.sectionLabel, { color: typeMeta.color }]}>TODAY'S DRILL — DAY {Math.min(currentDay, 7)}</Text>
              <Text style={styles.todayDrillName}>{todayDrill.name}</Text>
              <Text style={styles.todayDrillDesc}>{todayDrill.shortDescription}</Text>
              <View style={styles.todayDrillCue}>
                <Ionicons name="mic-outline" size={12} color={typeMeta.color} />
                <Text style={[styles.todayDrillCueText, { color: typeMeta.color }]}>{todayDrill.focusCue}</Text>
              </View>
            </View>
          );
        })()}

        {/* ═══════ ACTIVE BLOCK VIEW ═══════ */}
        {isThisTopicActive && (
          <View style={[styles.card, { borderColor: ACCENT + '40' }]}>
            <View style={styles.activeHeader}>
              <Ionicons name="lock-closed" size={16} color={ACCENT} />
              <Text style={[styles.sectionLabel, { color: ACCENT }]}>LOCKED IN — DAY {Math.min(currentDay, 7)} OF 7</Text>
            </View>

            {/* Progress bar */}
            <View style={styles.progressDots}>
              {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                <View key={d} style={[
                  styles.progressDot,
                  d <= activeBlock!.completedDaysCount ? styles.dotDone
                    : d === currentDay ? styles.dotCurrent : styles.dotEmpty,
                ]} />
              ))}
            </View>

            <Text style={styles.activeMeta}>
              {daysLeft > 0 ? `${daysLeft} day${daysLeft !== 1 ? 's' : ''} remaining` : 'Block ends today'} · {activeBlock!.completedDaysCount}/7 checked in
            </Text>

            {/* Check-in button */}
            {!checkedIn && currentDay <= 7 && (
              <TouchableOpacity style={styles.checkInBtn} onPress={handleCheckIn} activeOpacity={0.85}>
                <Ionicons name="checkmark-circle" size={18} color="#fff" />
                <Text style={styles.checkInBtnText}>Check In Today</Text>
              </TouchableOpacity>
            )}
            {checkedIn && (
              <View style={styles.checkedInBadge}>
                <Ionicons name="checkmark-circle" size={14} color="#22c55e" />
                <Text style={styles.checkedInText}>Checked in today</Text>
              </View>
            )}

            {/* Abandon option */}
            <TouchableOpacity style={styles.abandonBtn} onPress={handleAbandon} activeOpacity={0.7}>
              <Ionicons name="close-circle-outline" size={14} color={colors.textMuted} />
              <Text style={styles.abandonText}>Abandon Block</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Cues */}
        {topic.cues.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>COACHING CUES</Text>
            {topic.cues.map((cue, i) => (
              <View key={i} style={styles.cueRow}>
                <Ionicons name="mic-outline" size={12} color={category.color} />
                <Text style={[styles.cueText, { color: category.color }]}>{cue}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Drills */}
        {topic.drillNames.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>DRILL STACK</Text>
            {topic.drillNames.map((drill, i) => (
              <View key={i} style={styles.drillRow}>
                <View style={[styles.drillDot, { backgroundColor: category.color }]} />
                <Text style={styles.drillText}>{drill}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Related Sections */}
        {topic.relatedSectionKeys.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>VAULT SECTIONS</Text>
            {topic.relatedSectionKeys.map((key) => (
              <TouchableOpacity key={key} style={styles.sectionRow}
                onPress={() => router.push(`/(app)/training/mechanical/${key}` as any)} activeOpacity={0.8}>
                <Text style={styles.sectionText}>{key.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</Text>
                <Ionicons name="chevron-forward" size={12} color={colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ═══════ LOCK IN / SWITCH CTA ═══════ */}
        {!isThisTopicActive && (
          <TouchableOpacity
            style={[
              styles.lockInBtn,
              (isOtherTopicActive && !canSwitchDay1) && { opacity: 0.4 },
              locking && { opacity: 0.5 },
            ]}
            onPress={handleLockIn}
            disabled={(!!isOtherTopicActive && !canSwitchDay1) || locking}
            activeOpacity={0.85}
          >
            <Ionicons name={canSwitchDay1 ? 'swap-horizontal' : 'lock-closed'} size={18} color="#fff" />
            <Text style={styles.lockInBtnText}>
              {locking ? 'Locking In...'
                : canSwitchDay1 ? 'Switch to This Problem (Day 1)'
                : isOtherTopicActive ? 'Another Topic Active'
                : 'Lock In This Problem — 7 Days'}
            </Text>
          </TouchableOpacity>
        )}

        {isOtherTopicActive && !canSwitchDay1 && (
          <Text style={styles.lockedNote}>
            You are locked into another topic. Your block ends on {activeBlock!.endDate}. You can abandon it from that topic's page.
          </Text>
        )}
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
  headerSup: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },
  headerTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary },
  content: { padding: 16, paddingBottom: 60, gap: 14 },

  card: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: 14, gap: 8,
  },
  problemTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary },
  problemDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },
  repeatBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, backgroundColor: '#f59e0b12',
  },
  repeatText: { fontSize: 10, fontWeight: '700', color: '#f59e0b' },
  sectionLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1.2, color: colors.textMuted },

  // Active block
  activeHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  progressDots: { flexDirection: 'row', gap: 6 },
  progressDot: { flex: 1, height: 8, borderRadius: 4 },
  dotDone: { backgroundColor: ACCENT },
  dotCurrent: { backgroundColor: ACCENT + '50' },
  dotEmpty: { backgroundColor: colors.border },
  activeMeta: { fontSize: 11, color: colors.textMuted },
  checkInBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 12, borderRadius: radius.md, backgroundColor: '#22c55e', marginTop: 4,
  },
  checkInBtnText: { fontSize: 14, fontWeight: '800', color: '#fff' },
  checkedInBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'center' },
  checkedInText: { fontSize: 12, fontWeight: '700', color: '#22c55e' },
  abandonBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
    paddingVertical: 8, marginTop: 4,
  },
  abandonText: { fontSize: 11, fontWeight: '600', color: colors.textMuted },

  // Cues & drills
  cueRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cueText: { fontSize: 13, fontWeight: '700', fontStyle: 'italic' },
  drillRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  drillDot: { width: 7, height: 7, borderRadius: 4 },
  drillText: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 6 },
  sectionText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, textTransform: 'capitalize' },

  // Lock In
  lockInBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 16, borderRadius: radius.lg, backgroundColor: ACCENT,
  },
  lockInBtnText: { fontSize: 15, fontWeight: '900', color: '#fff' },
  lockedNote: { fontSize: 12, color: colors.textMuted, textAlign: 'center', fontStyle: 'italic' },

  // Phase 2 content styles
  bodyText: { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
  reasonRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  reasonDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#f59e0b', marginTop: 6, flexShrink: 0 },
  reasonText: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 19 },
  videoPlaceholder: {
    alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 24, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, borderStyle: 'dashed',
  },
  videoPlaceholderText: { fontSize: 11, color: colors.textMuted },
  exampleText: { fontSize: 12, color: colors.textMuted, fontStyle: 'italic', lineHeight: 17 },
  planIntro: { fontSize: 11, color: colors.textMuted, lineHeight: 16 },
  dayCard: {
    backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 12, gap: 6,
  },
  dayHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dayBadge: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  dayBadgeText: { fontSize: 12, fontWeight: '900' },
  dayLabel: { fontSize: 13, fontWeight: '800', color: colors.textPrimary },
  dayEnvRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 1 },
  dayEnvText: { fontSize: 10, fontWeight: '700' },
  dayDuration: { fontSize: 10, color: colors.textMuted, marginLeft: 6 },
  todayBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  todayBadgeText: { fontSize: 9, fontWeight: '800' },
  dayFocus: { fontSize: 12, color: colors.textSecondary, lineHeight: 17 },
  dayDrills: { gap: 3 },
  dayDrillRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dayDrillDot: { width: 5, height: 5, borderRadius: 3, flexShrink: 0 },
  dayDrillText: { fontSize: 12, fontWeight: '700', color: colors.textPrimary },
  dayNote: { fontSize: 11, color: '#f59e0b', fontStyle: 'italic' },
  playbookPrompt: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap',
    padding: 12, backgroundColor: '#f59e0b08', borderWidth: 1, borderColor: '#f59e0b25',
    borderRadius: radius.md,
  },
  playbookPromptText: { flex: 1, fontSize: 12, color: colors.textSecondary, lineHeight: 17 },
  playbookPromptCta: { fontSize: 12, fontWeight: '800', color: '#f59e0b' },

  // Tagged drill library
  taggedDrillRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 6, borderTopWidth: 1, borderTopColor: colors.border,
  },
  taggedDrillDot: { width: 6, height: 6, borderRadius: 3, flexShrink: 0 },
  taggedDrillName: { fontSize: 13, fontWeight: '800', color: colors.textPrimary },
  taggedDrillDesc: { fontSize: 10, color: colors.textMuted, marginTop: 1 },
  taggedDrillBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  taggedDrillBadgeText: { fontSize: 8, fontWeight: '800' },

  // Build plan CTA
  buildPlanBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 16, borderRadius: radius.lg,
  },
  buildPlanBtnText: { fontSize: 16, fontWeight: '900', color: '#fff' },

  // Today's drill
  todayDrillName: { fontSize: 16, fontWeight: '900', color: colors.textPrimary },
  todayDrillDesc: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  todayDrillCue: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  todayDrillCueText: { fontSize: 12, fontWeight: '700', fontStyle: 'italic' },

  // Drill progression (Foundation / Skill Building / Transfer)
  progressionGroup: { gap: 6, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.border },
  progressionBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6 },
  progressionBadgeText: { fontSize: 11, fontWeight: '900' },
  progressionDrillRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingLeft: 4 },
  progressionDot: { width: 6, height: 6, borderRadius: 3, flexShrink: 0 },
  progressionDrillText: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },

  // Empty placeholder for future content
  emptyPlaceholder: { fontSize: 12, color: colors.textMuted, fontStyle: 'italic' },

  // Ball flight feedback
  ballFlightRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, paddingVertical: 4 },
  ballFlightDot: { width: 8, height: 8, borderRadius: 4, marginTop: 4, flexShrink: 0 },
  ballFlightResult: { fontSize: 12, fontWeight: '800' },
  ballFlightMeaning: { fontSize: 11, color: colors.textMuted, lineHeight: 16 },

  // Key takeaway
  takeawayCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    padding: 14, backgroundColor: colors.surface, borderWidth: 1,
    borderRadius: radius.lg,
  },
  takeawayText: { flex: 1, fontSize: 14, fontWeight: '900', lineHeight: 20 },
});
