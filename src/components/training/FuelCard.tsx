import { View, Text, StyleSheet } from 'react-native';
import { colors, radius } from '@/theme';
import type { FuelCard as FuelCardData } from '@/data/fuel-the-engine';

interface Props {
  card: FuelCardData;
  accent: string;
}

export function FuelCard({ card, accent }: Props) {
  return (
    <View style={styles.card}>
      {/* Title bar */}
      <View style={styles.titleRow}>
        <View style={[styles.dot, { backgroundColor: accent }]} />
        <Text style={styles.title}>{card.title}</Text>
      </View>

      {/* Description */}
      {card.description ? <Text style={styles.description}>{card.description}</Text> : null}

      {/* Intro */}
      {card.intro ? <Text style={styles.intro}>{card.intro}</Text> : null}

      {/* Visual items (plate breakdown, swaps) */}
      {card.visual ? (
        <View style={styles.visualBlock}>
          {card.visual.map((line) => (
            <View key={line} style={[styles.visualRow, { backgroundColor: accent + '0C' }]}>
              <Text style={[styles.visualText, { color: accent }]}>{line}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* Bullets */}
      {card.bullets ? (
        <View style={styles.bulletList}>
          {card.bullets.map((b) => (
            <View key={b.text} style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={[styles.bulletText, b.bold && styles.bulletBold]}>
                {b.text}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* Examples */}
      {card.examples ? (
        <View style={styles.examplesBlock}>
          <View style={styles.examplesWrap}>
            {card.examples.map((ex) => (
              <View key={ex} style={[styles.examplePill, { backgroundColor: accent + '12' }]}>
                <Text style={[styles.exampleText, { color: accent }]}>{ex}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {/* Note */}
      {card.note ? (
        <View style={styles.noteBox}>
          <Text style={styles.noteText}>{card.note}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 16,
    gap: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    flex: 1,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
    fontWeight: '600',
  },
  intro: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
  },
  visualBlock: {
    gap: 6,
  },
  visualRow: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  visualText: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  bulletList: {
    gap: 5,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 8,
  },
  bulletDot: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 19,
  },
  bulletText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
    flex: 1,
  },
  bulletBold: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  examplesBlock: {
    gap: 4,
  },
  examplesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  examplePill: {
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  exampleText: {
    fontSize: 12,
    fontWeight: '700',
  },
  noteBox: {
    backgroundColor: colors.bg,
    borderRadius: 8,
    padding: 10,
  },
  noteText: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 17,
    fontStyle: 'italic',
  },
});
