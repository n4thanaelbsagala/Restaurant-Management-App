export const Colors = {
  primary: '#E07B39',
  background: '#FFFFFF',
  surface: '#F8F8F8',
  surfaceElevated: '#FFFFFF',
  border: '#E5E5E5',
  text: '#1A1A1A',
  textSecondary: '#666666',
  textDisabled: '#AAAAAA',
  income: '#22C55E',
  expense: '#EF4444',
  warning: '#F59E0B',
  warningBg: '#FEF3C7',
  danger: '#EF4444',
  dangerBg: '#FEE2E2',
  success: '#22C55E',
  successBg: '#DCFCE7',
  shadow: '#000000',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0,0,0,0.5)',
} as const;

export const StatusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#FEF3C7', text: '#92400E' },
  in_progress: { bg: '#DBEAFE', text: '#1E40AF' },
  completed: { bg: '#DCFCE7', text: '#166534' },
  cancelled: { bg: '#F3F4F6', text: '#6B7280' },
};
