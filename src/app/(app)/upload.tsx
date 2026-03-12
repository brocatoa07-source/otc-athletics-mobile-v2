import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '@/theme';

export default function UploadScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Video</Text>
      <Text style={styles.subtitle}>Phase 2 implementation</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  title: { ...typography.h1, color: colors.textPrimary },
  subtitle: { ...typography.body, color: colors.textMuted, marginTop: 8 },
});
