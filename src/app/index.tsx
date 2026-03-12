import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '@/store/auth.store';
import { colors } from '@/theme';

export default function RootIndex() {
  const session = useAuthStore((s) => s.session);
  const dbUser = useAuthStore((s) => s.dbUser);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  if (!isHydrated) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.white} />
      </View>
    );
  }

  if (session && dbUser) {
    return <Redirect href={dbUser.role === 'COACH' ? '/(app)/coach' : '/(app)/dashboard'} />;
  }

  if (session) {
    // Session exists but profile not loaded yet — show spinner
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.white} />
      </View>
    );
  }

  return <Redirect href="/(auth)/login" />;
}
