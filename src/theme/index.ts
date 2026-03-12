import { Platform } from 'react-native';

// ─── BASE PALETTE ──────────────────────────────────
export const colors = {
  // Core
  black: '#000000',
  white: '#FFFFFF',

  // Backgrounds
  bg: '#000000',
  surface: '#111111',
  surfaceElevated: '#1A1A1A',
  overlay: 'rgba(0,0,0,0.6)',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#A8A8A8',
  textMuted: '#666666',

  // Borders
  border: 'rgba(255,255,255,0.06)',
  borderStrong: 'rgba(255,255,255,0.12)',

  // Icons
  icon: '#FFFFFF',
  iconMuted: '#D0D0D0',

  // Status
  success: '#22c55e',
  warning: '#eab308',
  error: '#ef4444',
  info: '#3b82f6',
} as const;

// ─── CATEGORY ACCENT COLORS ───────────────────────
export const accents = {
  hitting: '#E10600',
  lifting: '#1DB954',
  mental: '#A78BFA',
  playbook: '#3B82F6',
  coachesCorner: '#FBBF24',
  neutral: '#FFFFFF',
} as const;

export type AccentKey = keyof typeof accents;

// ─── SPACING SCALE ─────────────────────────────────
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

// ─── BORDER RADIUS ─────────────────────────────────
export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
} as const;

// ─── TYPOGRAPHY ────────────────────────────────────
export const typography = {
  hero: { fontSize: 28, fontWeight: '900' as const },
  h1: { fontSize: 22, fontWeight: '900' as const },
  h2: { fontSize: 18, fontWeight: '800' as const },
  h3: { fontSize: 15, fontWeight: '800' as const },
  body: { fontSize: 14, fontWeight: '600' as const },
  caption: { fontSize: 12, fontWeight: '600' as const },
  label: { fontSize: 10, fontWeight: '900' as const, letterSpacing: 1.5 },
  tiny: { fontSize: 11, fontWeight: '700' as const },
} as const;

// ─── ACCENT GLOW (shadow utility) ──────────────────
export function accentGlow(color: string, intensity: 'subtle' | 'medium' | 'strong' = 'subtle') {
  const config = {
    subtle: { opacity: 0.30, radius: 14, elevation: 6 },
    medium: { opacity: 0.45, radius: 22, elevation: 8 },
    strong: { opacity: 0.55, radius: 30, elevation: 10 },
  }[intensity];

  if (Platform.OS === 'ios') {
    return {
      shadowColor: color,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: config.opacity,
      shadowRadius: config.radius,
    };
  }

  // Android: elevation provides the shadow; color tinting is limited
  return {
    elevation: config.elevation,
    shadowColor: color,
  };
}

// ─── FULL THEME EXPORT ─────────────────────────────
const theme = { colors, accents, spacing, radius, typography, accentGlow };
export default theme;
