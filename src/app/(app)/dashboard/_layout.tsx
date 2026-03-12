import { Stack, Redirect } from 'expo-router';
import { useAuthStore } from '@/store/auth.store';

export default function DashboardLayout() {
  const dbUser = useAuthStore((s) => s.dbUser);

  // Coach accidentally landed here → send them to their dashboard
  if (dbUser?.role === 'COACH') {
    return <Redirect href="/(app)/coach" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
