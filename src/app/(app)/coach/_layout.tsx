import { Stack, Redirect } from 'expo-router';
import { useAuthStore } from '@/store/auth.store';

export default function CoachLayout() {
  const dbUser = useAuthStore((s) => s.dbUser);

  // Athlete accidentally landed here → send them to their dashboard
  if (dbUser && dbUser.role !== 'COACH') {
    return <Redirect href="/(app)/dashboard" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
