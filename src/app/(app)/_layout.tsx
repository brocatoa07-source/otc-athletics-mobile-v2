import { Redirect, Tabs, router } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/auth.store';
import { useTier } from '@/hooks/useTier';
import { colors } from '@/theme';

export default function AppLayout() {
  const session = useAuthStore((s) => s.session);
  const dbUser = useAuthStore((s) => s.dbUser);
  const athlete = useAuthStore((s) => s.athlete);
  const coach = useAuthStore((s) => s.coach);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  const isCoach = dbUser?.role === 'COACH';
  const isParent = dbUser?.role === 'PARENT';
  const isAthlete = dbUser?.role === 'ATHLETE';
  const { canMessage } = useTier();

  // Still loading stored session + profile
  if (!isHydrated) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.white} />
      </View>
    );
  }

  // Not authenticated
  if (!session) return <Redirect href="/(auth)/login" />;

  // Authenticated but role-specific data not loaded yet
  // Parents have no athlete/coach row — allow them through once dbUser is set
  if (!dbUser || (isAthlete && !athlete) || (isCoach && !coach)) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.white} />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.black,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 4,
          height: 68,
        },
        tabBarActiveTintColor: colors.white,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700', letterSpacing: 0.4 },
      }}
      screenListeners={({ route, navigation }) => ({
        tabPress: (e) => {
          if (navigation.isFocused()) {
            e.preventDefault();
            router.navigate(`/(app)/${route.name}` as any);
          }
        },
      })}
    >
      {/* ── Coach Home (coaches only) ── */}
      <Tabs.Screen
        name="coach"
        options={{
          title: 'Home',
          href: isCoach ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      {/* ── Athlete / Parent Home ── */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          href: (isAthlete || isParent) ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      {/* ── Lab (athletes only) ── */}
      <Tabs.Screen
        name="training"
        options={{
          title: 'Lab',
          href: isAthlete ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="flask" size={size} color={color} />
          ),
        }}
      />

      {/* ── Community (all roles — parents see announcements here) ── */}
      <Tabs.Screen
        name="community"
        options={{
          title: isParent ? 'Updates' : 'Community',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={isParent ? 'megaphone' : 'people'} size={size} color={color} />
          ),
        }}
      />

      {/* ── Messages (coaches + eligible athletes only, NOT parents) ── */}
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          href: (canMessage && !isParent) ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles" size={size} color={color} />
          ),
        }}
      />

      {/* ── Hidden routes ── */}
      <Tabs.Screen name="upload" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
      <Tabs.Screen name="progress" options={{ href: null }} />
      <Tabs.Screen name="upgrade" options={{ href: null }} />
      <Tabs.Screen name="announcements" options={{ href: null }} />
      <Tabs.Screen name="playbook" options={{ href: null }} />
    </Tabs>
  );
}
