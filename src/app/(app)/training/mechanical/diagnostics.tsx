import { router } from 'expo-router';
import { useGating } from '@/hooks/useGating';
import { VaultDiagnosticsEntry } from '@/components/training/VaultDiagnosticsEntry';

const ACCENT = '#E10600';

export default function HittingDiagnosticsScreen() {
  const { gate } = useGating();

  const moverDone = gate.hitting.moverDone;
  const mechDone  = gate.hitting.mechanicalDone;

  // Vault unlocks once mover type is done; mechanical is bonus content
  const ctaLabel = moverDone ? 'Enter Vault' : 'Start Assessment';

  const handleCta = () => {
    if (moverDone) {
      router.push('/(app)/training/mechanical' as any);
    } else {
      router.push('/(app)/training/mechanical/mover-type-quiz' as any);
    }
  };

  return (
    <VaultDiagnosticsEntry
      vaultLabel="HITTING VAULT"
      accent={ACCENT}
      introText="Complete your assessments to unlock your personalized hitting path. Each assessment takes 2–4 minutes."
      steps={[
        {
          key: 'mover-type',
          label: 'OTC Swing Identity Assessment',
          description: '8 questions · Your hitting power generation style',
          isComplete: moverDone,
          onPress: () => router.push('/(app)/training/mechanical/mover-type-quiz' as any),
        },
        {
          key: 'mechanical',
          label: 'OTC Swing Diagnostic',
          description: '10 questions · Your primary mechanical focus areas (bonus)',
          isComplete: mechDone,
          onPress: () => router.push('/(app)/training/mechanical/mechanical-diagnostic-quiz' as any),
        },
      ]}
      completedCount={[moverDone, mechDone].filter(Boolean).length}
      totalCount={2}
      allComplete={moverDone}
      profileExists={moverDone}
      ctaLabel={ctaLabel}
      onCtaPress={handleCta}
      onBack={() => router.back()}
      onBackToVault={() => router.push('/(app)/training/mechanical' as any)}
      noteText="You can retake any assessment at any time. Your path updates with the most recent results."
    />
  );
}
