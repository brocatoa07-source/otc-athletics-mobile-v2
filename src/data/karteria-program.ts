import type { KarteriaProgram, MoverType, KarteriaDayKey, KarteriaBlockKey, MoverSubstitution } from './karteria-types';
import month1 from './karteria-month-1';
import month2 from './karteria-month-2';
import month3 from './karteria-month-3';
import month4 from './karteria-month-4';
import month5 from './karteria-month-5';
import month6 from './karteria-month-6';
import { KARTERIA_SUBS } from './karteria-subs';

/* ────────────────────────────────────────────────────
 * KARTERIA 6-MONTH PERIODIZED PROGRAM — Barrel
 * ──────────────────────────────────────────────────── */

export const KARTERIA: KarteriaProgram = {
  name: 'Karteria',
  totalMonths: 6,
  daysPerWeek: 5,
  months: [month1, month2, month3, month4, month5, month6],
};

/* ── Mover-Type Substitution Lookup ── */

export function getSubsForExercise(
  monthNumber: number,
  dayKey: KarteriaDayKey,
  blockKey: KarteriaBlockKey,
  exerciseIndex: number,
  moverType?: MoverType | null,
): MoverSubstitution | undefined {
  if (!moverType) return undefined;
  return KARTERIA_SUBS.find(
    (s) =>
      s.monthNumber === monthNumber &&
      s.dayKey === dayKey &&
      s.blockKey === blockKey &&
      s.exerciseIndex === exerciseIndex &&
      s.moverType === moverType,
  );
}

/* ── Program Meta (for purchase gate) ── */

export const KARTERIA_META = {
  price: '$299',
  priceCents: 29900,
  bullets: [
    '6 progressive monthly phases — Foundation to Peak',
    '5 days/week with daily mobility, plyos, strength & conditioning',
    '8 structured blocks per session (prep → finisher)',
    'Mover-type substitution suggestions for your body',
    'Acceleration, speed & baseball-transfer work built in',
    'Lifetime access — train the full cycle year after year',
  ],
  disclaimer: 'One-time purchase. No subscription required.',
};

export { KARTERIA_SUBS };
