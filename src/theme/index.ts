export const colors = {
  primary: '#3B46F1',
  primaryDark: '#2B35D2',
  primaryLight: '#EEF0FD',
  background: '#F8F9FD',
  card: '#FFFFFF',
  text: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  borderFocus: '#3B46F1',
  borderError: '#EF4444',
  error: '#EF4444',
  errorBackground: '#FEF2F2',
  success: '#10B981',
  successBackground: '#ECFDF5',
  warning: '#F59E0B',
  disabled: '#E2E8F0',
  disabledText: '#94A3B8',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 30,
  full: 9999,
};

export const typography = {
  title: {
    fontSize: 26,
    fontWeight: '700' as const,
    color: colors.text,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 6,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: colors.text,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: colors.textSecondary,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.white,
  },
};
