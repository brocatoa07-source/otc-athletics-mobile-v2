import { router } from 'expo-router';
import { useGating } from '@/hooks/useGating';
import { VaultDiagnosticsEntry } from '@/components/training/VaultDiagnosticsEntry';

const ACCENT = '#1DB954';

export default function SCDiagnosticsScreen() {
  const { gate } = useGating();
  const moverDone = gate.sc.moverDone;

  const ctaLabel = moverDone ? 'Enter Vault' : 'Start Assessment';

  const handleCta = () => {
    if (moverDone) {
      router.push('/(app)/training/sc' as any);
    } else {
      router.push('/(app)/training/sc/lifting-mover-quiz' as any);
    }
  };

  return (
    <VaultDiagnosticsEntry
      vaultLabel="STRENGTH & CONDITIONING"
      accent={ACCENT}
      introText="Complete the assessment to unlock your personalized lifting path. Takes about 4 minutes."
      steps={[
        {
          key: 'lifting-mover',
          label: 'OTC Athletic Profile Assessment',
          description: '20 questions · Your strength expression style',
          isComplete: moverDone,
          onPress: () => router.push('/(app)/training/sc/lifting-mover-quiz' as any),
        },
      ]}
      completedCount={moverDone ? 1 : 0}
      totalCount={1}
      allComplete={moverDone}
      profileExists={moverDone}
      ctaLabel={ctaLabel}
      onCtaPress={handleCta}
      onBack={() => router.back()}
      onBackToVault={() => router.push('/(app)/training/sc' as any)}
      noteText="You can retake this assessment at any time. Your path updates with the most recent result."
    />
  );
}
