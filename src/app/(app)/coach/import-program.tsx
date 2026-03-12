import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import * as Haptics from 'expo-haptics';
import { colors, accentGlow } from '@/theme';
import {
  parseCsvFile,
  validateAndGroup,
  matchExercises,
  generateAndShareTemplate,
} from '@/lib/program-import';
import { useImportStore } from '@/store/import.store';

export default function ImportProgramScreen() {
  const setParseResult = useImportStore((s) => s.setParseResult);
  const [loading, setLoading] = useState(false);

  async function handlePickFile() {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        'text/csv',
        'text/comma-separated-values',
        'application/csv',
        '*/*',
      ],
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets?.[0]) return;

    setLoading(true);
    try {
      const fileUri = result.assets[0].uri;
      const { rows, errors: parseErrors } = await parseCsvFile(fileUri);
      const parseResult = validateAndGroup(rows, parseErrors);
      await matchExercises(parseResult);

      setParseResult(parseResult);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      router.push('/(app)/coach/import-preview' as any);
    } catch (err) {
      Alert.alert('Import Error', String(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleDownloadTemplate() {
    try {
      await generateAndShareTemplate();
    } catch (err) {
      Alert.alert('Error', 'Could not generate template.');
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.icon} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerLabel}>COACH</Text>
          <Text style={styles.headerTitle}>Import Program</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Pick CSV */}
        <TouchableOpacity
          style={[styles.actionCard, accentGlow(colors.white, 'subtle')]}
          onPress={handlePickFile}
          activeOpacity={0.85}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="large" color={colors.icon} />
          ) : (
            <Ionicons
              name="document-text-outline"
              size={40}
              color={colors.icon}
            />
          )}
          <Text style={styles.actionTitle}>
            {loading ? 'Parsing...' : 'Pick CSV File'}
          </Text>
          <Text style={styles.actionSub}>
            Select a Karteria-format CSV from your device
          </Text>
        </TouchableOpacity>

        {/* Download Template */}
        <TouchableOpacity
          style={styles.secondaryCard}
          onPress={handleDownloadTemplate}
          activeOpacity={0.85}
        >
          <Ionicons
            name="download-outline"
            size={24}
            color={colors.icon}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.secondaryTitle}>Download CSV Template</Text>
            <Text style={styles.secondarySub}>
              Get a sample file with all 5 days and categories
            </Text>
          </View>
          <Ionicons
            name="share-outline"
            size={18}
            color={colors.textMuted}
          />
        </TouchableOpacity>

        {/* Instructions */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>CSV FORMAT</Text>
          <Text style={styles.infoText}>
            Required columns: program_title, week, day_label, day_type,
            category, order, exercise, sets, reps
          </Text>
          <Text style={styles.infoText}>
            Optional: load, tempo, rest_sec, notes, superset_group
          </Text>

          <Text style={[styles.infoTitle, { marginTop: 16 }]}>
            STRENGTH CATEGORIES
          </Text>
          <Text style={styles.infoText}>
            Prep → Plyo → Loaded Power → Main Superset → Secondary Lifts →
            Accessories → Core → Finisher
          </Text>

          <Text style={[styles.infoTitle, { marginTop: 16 }]}>
            ACTIVE RECOVERY CATEGORIES
          </Text>
          <Text style={styles.infoText}>
            Prep & Mobility → Isometrics → Full Body Circuit → Elasticity →
            Sprint Mechanics
          </Text>

          <Text style={[styles.infoTitle, { marginTop: 16 }]}>RULES</Text>
          <Text style={styles.infoText}>
            Max 5 unique day labels per week. day_type must be "strength" or
            "active_recovery". Categories must match the day type.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

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
  backBtn: { padding: 2 },
  headerLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    color: colors.textSecondary,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  content: { padding: 16, gap: 16 },

  actionCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    gap: 12,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  actionSub: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  secondaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 16,
  },
  secondaryTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  secondarySub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },

  infoCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 16,
  },
  infoTitle: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    color: colors.textMuted,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 4,
  },
});
