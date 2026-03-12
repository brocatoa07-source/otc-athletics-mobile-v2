import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Link } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { colors, typography, spacing, radius } from '@/theme';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleRegister() {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = fullName.trim();

    if (!trimmedName || !trimmedEmail || !password) {
      Alert.alert('Missing fields', 'All fields are required.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak password', 'Password must be at least 6 characters.');
      return;
    }

    setErrorMsg(null);
    setLoading(true);

    if (__DEV__) {
      console.log('[register] Supabase URL:', process.env.EXPO_PUBLIC_SUPABASE_URL);
    }

    try {
      // 1. Create auth user — trigger creates public.users row
      const signUpResult = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: { full_name: trimmedName, role: 'ATHLETE' },
        },
      });

      if (__DEV__) {
        console.log('[register] signUp response:', JSON.stringify({
          user: signUpResult.data.user?.id ?? null,
          session: !!signUpResult.data.session,
          error: signUpResult.error?.message ?? null,
        }));
      }

      if (signUpResult.error) {
        const msg = `Signup failed: ${signUpResult.error.message}`;
        setErrorMsg(msg);
        console.error('[register]', msg);
        return;
      }

      const userId = signUpResult.data.user?.id;
      if (!userId) {
        setErrorMsg('Account created but no user ID returned. Check console for details.');
        console.error('[register] No user ID in response:', JSON.stringify(signUpResult.data));
        return;
      }

      // 2. Create the athletes row (trigger only creates users row)
      const { error: athleteError } = await supabase
        .from('athletes')
        .insert({ user_id: userId, sport: 'baseball' });

      if (athleteError) {
        console.error('[register] Failed to create athlete row:', athleteError.message);
        setErrorMsg('Account created but profile setup failed. Please contact support.');
      }

      // onAuthStateChange in _layout.tsx handles navigation on success.
    } catch (err) {
      console.error('[register] unexpected error:', err);
      setErrorMsg('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join as an athlete</Text>

        {__DEV__ && (
          <Text style={styles.devUrl}>
            {process.env.EXPO_PUBLIC_SUPABASE_URL?.replace('https://', '').replace('.supabase.co', '') ?? 'NO URL'}
          </Text>
        )}

        {errorMsg && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="words"
          value={fullName}
          onChangeText={setFullName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={colors.textMuted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.black} />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text style={styles.link}>Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  inner: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: spacing.lg },
  title: { ...typography.hero, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.xxxl },
  input: {
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    ...typography.body,
    marginBottom: spacing.md,
  },
  button: {
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm + 4,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { ...typography.h3, color: colors.black },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg },
  footerText: { ...typography.caption, color: colors.textMuted },
  link: { ...typography.caption, color: colors.white, fontWeight: '800' },
  errorBanner: {
    backgroundColor: colors.error + '22',
    borderColor: colors.error,
    borderWidth: 1,
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  errorText: { ...typography.caption, color: colors.error, textAlign: 'center' },
  devUrl: { ...typography.caption, color: colors.textMuted, textAlign: 'center', marginBottom: spacing.md, fontSize: 10 },
});
