import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '@/store/auth.store';

export default function AuthLayout() {
  const session = useAuthStore((s) => s.session);
  const dbUser = useAuthStore((s) => s.dbUser);

  // If the user just signed up / logged in and the store has both
  // a session and a profile, redirect into the app.
  if (session && dbUser) {
    const dest = dbUser.role === 'COACH' ? '/(app)/coach' : '/(app)/dashboard';
    return <Redirect href={dest as any} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
