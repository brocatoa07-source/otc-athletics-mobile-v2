import { Redirect, Tabs, router } from 'expo-router';
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

  const isCoach = dbUser?.role === 'COACH';
  const isParent = dbUser?.role === 'PARENT';
  const isAthlete = dbUser?.role === 'ATHLETE';

  if (!isHydrated) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.white} />
      </View>
    );
  }

  if (!session) return <Redirect href="/(auth)/login" />;

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
      {/* ═══════════════════════════════════════════
       * TAB 1 — HOME (Dashboard / Command Center)
       * ═══════════════════════════════════════════ */}

      {/* Coach Home */}
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

      {/* Athlete / Parent Home */}
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

      {/* ═══════════════════════════════════════════
       * TAB 2 — TRAIN (Vaults, Drills, Programs)
       * Replaces "Lab"
       * ═══════════════════════════════════════════ */}
      <Tabs.Screen
        name="training"
        options={{
          title: 'Train',
          href: isAthlete ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="barbell" size={size} color={color} />
          ),
        }}
      />

      {/* ═══════════════════════════════════════════
       * TAB 3 — PROGRESS (Development + Feedback)
       * ═══════════════════════════════════════════ */}
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          href: isAthlete ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="analytics" size={size} color={color} />
          ),
        }}
      />

      {/* ═══════════════════════════════════════════
       * TAB 4 — COMMUNITY (Social + Competition)
       * ═══════════════════════════════════════════ */}
      <Tabs.Screen
        name="community"
        options={{
          title: isParent ? 'Updates' : 'Community',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={isParent ? 'megaphone' : 'people'} size={size} color={color} />
          ),
        }}
      />

      {/* ═══════════════════════════════════════════
       * HIDDEN ROUTES (accessible via navigation, not tabs)
       * ═══════════════════════════════════════════ */}
      <Tabs.Screen name="messages" options={{ href: null }} />
      <Tabs.Screen name="upload" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
      <Tabs.Screen name="upgrade" options={{ href: null }} />
      <Tabs.Screen name="announcements" options={{ href: null }} />
      <Tabs.Screen name="playbook" options={{ href: null }} />
      <Tabs.Screen name="daily-work" options={{ href: null }} />
      <Tabs.Screen name="how-it-works" options={{ href: null }} />
      <Tabs.Screen name="my-path-levels" options={{ href: null }} />
    </Tabs>
  );
}
