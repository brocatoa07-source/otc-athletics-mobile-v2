import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth.store';
import { useTier } from '@/hooks/useTier';
import { Colors } from '@/constants/colors';
import { TierBadge } from '@/components/common/TierBadge';
import { UpgradeDropdown } from '@/components/common/UpgradeDropdown';

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const athlete = useAuthStore((s) => s.athlete);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const { isCoach, tier } = useTier();

  const displayName = (user?.user_metadata?.full_name as string | undefined) ?? 'Athlete';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  const tierValue = isCoach ? 'COACH' : tier;

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
          clearAuth();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace(isCoach ? '/(app)/coach' : '/(app)/dashboard');
          }
        }}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Avatar + Name */}
        <View style={styles.profile}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <TierBadge tier={tierValue} />
        </View>

        {/* Stats */}
        {athlete && (
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{athlete.sport?.toUpperCase()}</Text>
              <Text style={styles.statLabel}>Sport</Text>
            </View>
            {athlete.position && (
              <View style={styles.stat}>
                <Text style={styles.statValue}>{athlete.position.toUpperCase()}</Text>
                <Text style={styles.statLabel}>Position</Text>
              </View>
            )}
            {athlete.age && (
              <View style={styles.stat}>
                <Text style={styles.statValue}>{athlete.age}</Text>
                <Text style={styles.statLabel}>Age</Text>
              </View>
            )}
          </View>
        )}

        {/* Upgrade dropdown */}
        {!isCoach && <UpgradeDropdown />}

        {/* Menu Items */}
        <View style={styles.menu}>
          {!isCoach && (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push('/(app)/profile/connect-coach' as any)}
            >
              <Ionicons name="key" size={20} color="#8b5cf6" />
              <Text style={styles.menuLabel}>Coach Connection</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          )}

          {isCoach && (
            <TouchableOpacity
              style={[styles.menuItem, { borderBottomWidth: 0 }]}
              onPress={() => router.push('/(app)/coach' as any)}
            >
              <Ionicons name="shield-checkmark" size={20} color="#8b5cf6" />
              <Text style={styles.menuLabel}>Coach Hub</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Sign out */}
        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Ionicons name="log-out" size={18} color={Colors.error} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>OTC Lab v2.0.0</Text>
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
  content: { padding: 20, gap: 24, paddingBottom: 40 },
  profile: { alignItems: 'center', gap: 8, paddingVertical: 10 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '900', fontSize: 26 },
  name: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  email: { fontSize: 14, color: Colors.textMuted },
  stats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  stat: { alignItems: 'center', gap: 4 },
  statValue: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  statLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8 },
  menu: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuLabel: { flex: 1, fontSize: 15, color: Colors.textPrimary, fontWeight: '500' },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.error,
    borderRadius: 10,
  },
  signOutText: { fontSize: 15, fontWeight: '700', color: Colors.error },
  version: { textAlign: 'center', fontSize: 12, color: Colors.textMuted },
});
