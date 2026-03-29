import { router } from 'expo-router';
import { useGating } from '@/hooks/useGating';
import { VaultDiagnosticsEntry } from '@/components/training/VaultDiagnosticsEntry';

const ACCENT = '#E10600';

export default function HittingDiagnosticsScreen() {
  const { gate } = useGating();

  const moverDone = gate.hitting.moverDone;
  const mechDone  = gate.hitting.mechanicalDone;
  const bothDone  = moverDone && mechDone;

  const ctaLabel = bothDone ? 'Enter Vault' : 'Start Assessment';
  const completedCount = [moverDone, mechDone].filter(Boolean).length;

  const handleCta = () => {
    if (bothDone) {
      router.push('/(app)/training/mechanical' as any);
    } else if (!moverDone) {
      router.push('/(app)/training/mechanical/mover-type-quiz' as any);
    } else {
      router.push('/(app)/training/mechanical/mechanical-diagnostic-quiz' as any);
    }
  };

  return (
    <VaultDiagnosticsEntry
      vaultLabel="HITTING VAULT"
      accent={ACCENT}
      introText="Complete both assessments to unlock your personalized hitting vault. Each takes 2–4 minutes."
      steps={[
        {
          key: 'mover-type',
          label: 'Swing Type & Power Style',
          description: '15 questions · How you move and generate power',
          isComplete: moverDone,
          onPress: () => router.push('/(app)/training/mechanical/mover-type-quiz' as any),
        },
        {
          key: 'mechanical',
          label: 'Swing Problem',
          description: '10 questions · Your primary mechanical issues',
          isComplete: mechDone,
          onPress: () => router.push('/(app)/training/mechanical/mechanical-diagnostic-quiz' as any),
        },
      ]}
      completedCount={completedCount}
      totalCount={2}
      allComplete={bothDone}
      profileExists={moverDone}
      ctaLabel={ctaLabel}
      onCtaPress={handleCta}
      onBack={() => router.back()}
      onBackToVault={() => router.push('/(app)/training/mechanical' as any)}
      noteText="Complete both to unlock the Hitting Vault and get personalized training."
    />
  );
}
