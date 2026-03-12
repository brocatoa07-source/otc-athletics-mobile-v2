import { Redirect, Tabs } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/auth.store';
import { colors } from '@/theme';

export default function AppLayout() {
  const session = useAuthStore((s) => s.session);
  const dbUser = useAuthStore((s) => s.dbUser);
  const athlete = useAuthStore((s) => s.athlete);
  const coach = useAuthStore((s) => s.coach);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  // Derive isCoach from dbUser.role (set atomically from DB) rather than
  // !!coach (set later by fetchRoleRow) to prevent wrong-dashboard flash.
  const isCoach = dbUser?.role === 'COACH';

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
  // (dbUser is set before fetchRoleRow completes — wait for athlete/coach too)
  if (!dbUser || (!athlete && !coach)) {
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
    >
      {/*
       * Coach tab declared FIRST. Expo Router v6 uses the first
       * visible tab (href !== null) as the initial route.
       * For coaches, coach is visible and dashboard is hidden.
       * For athletes, coach is hidden so dashboard (next) becomes initial.
       */}
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

      {/* ── Athlete Home (hidden for coaches) ── */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          href: isCoach ? null : undefined,
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
          href: isCoach ? null : undefined,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="flask" size={size} color={color} />
          ),
        }}
      />

      {/* ── Community (both roles) ── */}
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />

      {/* ── Messages ── */}
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
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
    </Tabs>
  );
}
