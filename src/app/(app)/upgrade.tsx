import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useTier, type CanonicalTier } from '@/hooks/useTier';

// ── Feature lists per tier ─────────────────────────────────────────────────

const WALK_BULLETS = [
  'Swing Identity diagnostic',
  'Mechanical diagnostic',
  'My Path development plan',
  'Limited Daily Work (hitting drills only)',
  'Hitting Vault preview (starter drills)',
  'Weekly community challenges',
];

const SINGLE_BULLETS = [
  'Everything in Walk',
  'Full Hitting Vault (all sections & drills)',
  'Full hitting Daily Work',
  'Full Troubleshooting with personalized fixes',
  'Full hitting challenge access',
];

const DOUBLE_BULLETS = [
  'Everything in Single',
  'Full Mental Vault access',
  'Mental training in Daily Work',
  'Pre-game routines, resets & journaling',
  'Direct coach messaging',
];

const TRIPLE_BULLETS = [
  'Everything in Double',
  'Full Strength Vault access',
  'Strength training in Daily Work',
  'Personalized strength programming',
];

const HOME_RUN_BULLETS = [
  'Everything in Triple',
  'Priority coach access',
  'Inquire about 1-on-1 coaching',
  'Early access to new features',
];

// ── Tier card definitions ──────────────────────────────────────────────────

interface TierDef {
  id: CanonicalTier;
  name: string;
  transformation: string;
  tagline: string;
  price: string;
  pricePer?: string;
  bullets: string[];
  accentColor: string;
  ctaLabel?: string;
  applicationOnly?: boolean;
}

const TIERS: TierDef[] = [
  {
    id: 'WALK',
    name: 'WALK',
    transformation: 'Understand your swing',
    tagline: 'Diagnostics, your development path, and a taste of the system.',
    price: 'Free',
    bullets: WALK_BULLETS,
    accentColor: Colors.textMuted,
  },
  {
    id: 'SINGLE',
    name: 'SINGLE',
    transformation: 'Fix your swing mechanics',
    tagline: 'Full hitting system — every drill, every fix, every day.',
    price: '$19.99',
    pricePer: '/ mo',
    bullets: SINGLE_BULLETS,
    accentColor: Colors.success,
    ctaLabel: 'Upgrade to Single',
  },
  {
    id: 'DOUBLE',
    name: 'DOUBLE',
    transformation: 'Master the mental game',
    tagline: 'Add the mental edge to your hitting foundation.',
    price: '$39.99',
    pricePer: '/ mo',
    bullets: DOUBLE_BULLETS,
    accentColor: Colors.primary,
    ctaLabel: 'Upgrade to Double',
  },
  {
    id: 'TRIPLE',
    name: 'TRIPLE',
    transformation: 'Build the complete athlete',
    tagline: 'Hitting, mental, and strength — the full development stack.',
    price: '$119.99',
    pricePer: '/ mo',
    bullets: TRIPLE_BULLETS,
    accentColor: Colors.warning,
    ctaLabel: 'Upgrade to Triple',
  },
  {
    id: 'HOME_RUN',
    name: 'HOME RUN',
    transformation: 'Get coached personally',
    tagline: 'Everything in the system, plus a coach in your corner.',
    price: 'Custom',
    bullets: HOME_RUN_BULLETS,
    accentColor: '#E8B84B',
    applicationOnly: true,
    ctaLabel: 'Apply Now',
  },
];

const TIER_ORDER: CanonicalTier[] = ['WALK', 'SINGLE', 'DOUBLE', 'TRIPLE', 'HOME_RUN'];

function tierLabel(tier: CanonicalTier): string {
  switch (tier) {
    case 'WALK':     return "YOU'RE ON WALK — FREE";
    case 'SINGLE':   return "YOU'RE ON SINGLE — $19.99/MO";
    case 'DOUBLE':   return "YOU'RE ON DOUBLE — $39.99/MO";
    case 'TRIPLE':   return "YOU'RE ON TRIPLE — $119.99/MO";
    case 'HOME_RUN': return "YOU'RE ON HOME RUN";
  }
}

export default function UpgradeScreen() {
  const { tier, isCoach } = useTier();

  const currentIndex = TIER_ORDER.indexOf(tier);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Membership</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.headline}>Pick Your Base.</Text>
        <Text style={styles.subline}>Level up when you're ready.</Text>

        {/* Current tier badge */}
        {!isCoach && (
          <View style={styles.currentBadge}>
            <Text style={styles.currentBadgeText}>{tierLabel(tier)}</Text>
          </View>
        )}
        {isCoach && (
          <View style={styles.currentBadge}>
            <Text style={styles.currentBadgeText}>YOU'RE A COACH — FULL ACCESS</Text>
          </View>
        )}

        {TIERS.map((def, idx) => {
          const isCurrent = !isCoach && tier === def.id;
          const isAboveCurrent = !isCoach && idx > currentIndex;
          const isBelowCurrent = !isCoach && idx < currentIndex;

          return (
            <View
              key={def.id}
              style={[
                styles.planCard,
                isCurrent && { borderColor: def.accentColor },
              ]}
            >
              {/* Header row */}
              <View style={styles.planHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.planName, { color: def.accentColor }]}>{def.name}</Text>
                  <Text style={styles.planTransformation}>{def.transformation}</Text>
                  <Text style={styles.planTagline}>{def.tagline}</Text>
                </View>
                <View style={styles.priceBox}>
                  <Text style={[styles.price, { color: def.accentColor }]}>{def.price}</Text>
                  {def.pricePer && <Text style={styles.pricePer}>{def.pricePer}</Text>}
                  {def.applicationOnly && (
                    <Text style={[styles.appOnly, { color: def.accentColor }]}>
                      {'APPLICATION\nONLY'}
                    </Text>
                  )}
                </View>
              </View>

              {/* Feature bullets */}
              <View style={styles.bullets}>
                {def.bullets.map((b, i) => (
                  <View key={i} style={styles.bullet}>
                    <Ionicons name="checkmark" size={13} color={def.accentColor} />
                    <Text style={styles.bulletText}>{b}</Text>
                  </View>
                ))}
              </View>

              {/* CTA / status */}
              {isCurrent && (
                <View style={styles.currentPlan}>
                  <Ionicons name="checkmark-circle" size={18} color={def.accentColor} />
                  <Text style={[styles.currentPlanText, { color: def.accentColor }]}>
                    Your current plan
                  </Text>
                </View>
              )}

              {isBelowCurrent && (
                <View style={styles.currentPlan}>
                  <Ionicons name="checkmark-circle" size={18} color={Colors.textMuted} />
                  <Text style={[styles.currentPlanText, { color: Colors.textMuted }]}>
                    Included in your plan
                  </Text>
                </View>
              )}

              {isAboveCurrent && !def.applicationOnly && (
                <View style={[styles.ctaBtn, { backgroundColor: def.accentColor }]}>
                  <Text style={styles.ctaBtnText}>Coming Soon</Text>
                </View>
              )}

              {isAboveCurrent && def.applicationOnly && (
                <>
                  <TouchableOpacity
                    style={[styles.ctaBtn, { backgroundColor: def.accentColor }]}
                    onPress={() => Linking.openURL('https://otcathletics.com/apply')}
                  >
                    <Text style={styles.ctaBtnText}>{def.ctaLabel}</Text>
                  </TouchableOpacity>
                  <View style={styles.applyNote}>
                    <Ionicons name="information-circle" size={16} color={Colors.textMuted} />
                    <Text style={styles.applyNoteText}>
                      Limited seats. Coach reviews every application personally.
                    </Text>
                  </View>
                </>
              )}

              {isCoach && def.id === 'HOME_RUN' && (
                <View style={styles.currentPlan}>
                  <Ionicons name="checkmark-circle" size={18} color={def.accentColor} />
                  <Text style={[styles.currentPlanText, { color: def.accentColor }]}>
                    Full access as coach
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12,
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  content: { padding: 20, gap: 16, paddingBottom: 48 },
  headline: { fontSize: 30, fontWeight: '900', color: Colors.textPrimary },
  subline: { fontSize: 17, color: Colors.textMuted, marginTop: -4 },
  currentBadge: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  currentBadgeText: { fontSize: 11, fontWeight: '800', color: Colors.textMuted, letterSpacing: 1 },
  planCard: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 18,
    gap: 14,
  },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  planName: { fontSize: 20, fontWeight: '900', letterSpacing: 1.5 },
  planTransformation: { fontSize: 15, fontWeight: '800', color: Colors.textPrimary, marginTop: 4 },
  planTagline: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  priceBox: { alignItems: 'flex-end', gap: 2 },
  price: { fontSize: 26, fontWeight: '900' },
  pricePer: { fontSize: 13, color: Colors.textMuted },
  appOnly: {
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'right',
    letterSpacing: 0.5,
    lineHeight: 15,
    marginTop: 2,
  },
  bullets: { gap: 8 },
  bullet: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  bulletText: { fontSize: 13, color: Colors.textSecondary, flex: 1, lineHeight: 18 },
  ctaBtn: {
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  ctaBtnText: { fontWeight: '800', fontSize: 15, color: '#000' },
  currentPlan: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
    paddingVertical: 6,
  },
  currentPlanText: { fontSize: 14, fontWeight: '700' },
  applyNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: Colors.bgElevated,
    borderRadius: 8,
    padding: 12,
  },
  applyNoteText: { fontSize: 13, color: Colors.textMuted, flex: 1, lineHeight: 18 },
});
