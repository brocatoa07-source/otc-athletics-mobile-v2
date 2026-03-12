/**
 * Colors compatibility layer — maps old `Colors.*` references
 * to the canonical v2 theme values. Prefer `@/theme` for new code.
 */
import { colors } from '@/theme';

export const Colors = {
  primary: '#E10600',

  // Backgrounds
  bg: colors.bg,
  bgCard: colors.surface,
  bgElevated: colors.surfaceElevated,

  // Text
  textPrimary: colors.textPrimary,
  textSecondary: colors.textSecondary,
  textMuted: colors.textMuted,

  // Inputs
  bgInput: colors.surfaceElevated,

  // Borders
  border: colors.border,

  // Status
  success: colors.success,
  warning: colors.warning,
  error: colors.error,
  info: colors.info,
} as const;
