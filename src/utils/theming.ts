import { Appearance } from 'react-native';

export interface ThemeColors {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  secondary: string;
  background: string;
  surface: string;
  error: string;
  warning: string;
  success: string;
  info: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
    inverse: string;
  };
  border: string;
  placeholder: string;
  shadow: string;
}

export interface Theme {
  dark: boolean;
  colors: ThemeColors;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    h1: {
      fontSize: number;
      fontWeight: string;
      lineHeight: number;
    };
    h2: {
      fontSize: number;
      fontWeight: string;
      lineHeight: number;
    };
    h3: {
      fontSize: number;
      fontWeight: string;
      lineHeight: number;
    };
    body: {
      fontSize: number;
      fontWeight: string;
      lineHeight: number;
    };
    caption: {
      fontSize: number;
      fontWeight: string;
      lineHeight: number;
    };
  };
  shadows: {
    sm: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    md: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    lg: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
  };
}

const lightColors: ThemeColors = {
  primary: '#3B82F6',
  primaryDark: '#1E40AF',
  primaryLight: '#93C5FD',
  secondary: '#10B981',
  background: '#FFFFFF',
  surface: '#F9FAFB',
  error: '#EF4444',
  warning: '#F59E0B',
  success: '#10B981',
  info: '#3B82F6',
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    disabled: '#9CA3AF',
    inverse: '#FFFFFF',
  },
  border: '#E5E7EB',
  placeholder: '#9CA3AF',
  shadow: '#000000',
};

const darkColors: ThemeColors = {
  primary: '#60A5FA',
  primaryDark: '#3B82F6',
  primaryLight: '#93C5FD',
  secondary: '#34D399',
  background: '#111827',
  surface: '#1F2937',
  error: '#F87171',
  warning: '#FBBF24',
  success: '#34D399',
  info: '#60A5FA',
  text: {
    primary: '#F9FAFB',
    secondary: '#D1D5DB',
    disabled: '#6B7280',
    inverse: '#111827',
  },
  border: '#374151',
  placeholder: '#6B7280',
  shadow: '#000000',
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
};

const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
};

const createShadows = (shadowColor: string) => ({
  sm: {
    shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
});

export const lightTheme: Theme = {
  dark: false,
  colors: lightColors,
  spacing,
  borderRadius,
  typography,
  shadows: createShadows(lightColors.shadow),
};

export const darkTheme: Theme = {
  dark: true,
  colors: darkColors,
  spacing,
  borderRadius,
  typography,
  shadows: createShadows(darkColors.shadow),
};

// Health-specific color scheme for data visualization
export const healthColors = {
  excellent: '#10B981', // Green
  good: '#84CC16', // Light green
  fair: '#F59E0B', // Yellow
  poor: '#EF4444', // Red
  critical: '#DC2626', // Dark red
};

// Status colors for appointments, challenges, etc.
export const statusColors = {
  confirmed: '#10B981',
  pending: '#F59E0B',
  cancelled: '#EF4444',
  completed: '#6B7280',
  scheduled: '#3B82F6',
  overdue: '#DC2626',
};

// Risk level colors
export const riskColors = {
  low: '#10B981',
  moderate: '#F59E0B',
  high: '#EF4444',
  critical: '#DC2626',
};

// Department/category colors for analytics
export const categoryColors = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Orange
  '#6366F1', // Indigo
];

export const getSystemTheme = (): 'light' | 'dark' => {
  return Appearance.getColorScheme() || 'light';
};

export const getThemeColors = (isDark: boolean): ThemeColors => {
  return isDark ? darkColors : lightColors;
};

export const createCustomTheme = (
  customColors?: Partial<ThemeColors>,
  isDark: boolean = false
): Theme => {
  const baseColors = isDark ? darkColors : lightColors;
  const colors = { ...baseColors, ...customColors };
  
  return {
    dark: isDark,
    colors,
    spacing,
    borderRadius,
    typography,
    shadows: createShadows(colors.shadow),
  };
};

// Accessibility helpers
export const getContrastingTextColor = (backgroundColor: string): string => {
  // Simple contrast calculation - in production, use a proper contrast library
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  return brightness > 128 ? '#000000' : '#FFFFFF';
};

export const adjustOpacity = (color: string, opacity: number): string => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Theme-aware styles helper
export const createThemedStyles = <T extends Record<string, any>>(
  styleFactory: (theme: Theme) => T
) => {
  return (theme: Theme): T => styleFactory(theme);
};

// Common themed component styles
export const getButtonStyles = (theme: Theme, variant: 'primary' | 'secondary' | 'outline' = 'primary') => {
  const baseStyles = {
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };

  switch (variant) {
    case 'primary':
      return {
        ...baseStyles,
        backgroundColor: theme.colors.primary,
      };
    case 'secondary':
      return {
        ...baseStyles,
        backgroundColor: theme.colors.secondary,
      };
    case 'outline':
      return {
        ...baseStyles,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.primary,
      };
    default:
      return baseStyles;
  }
};

export const getCardStyles = (theme: Theme) => ({
  backgroundColor: theme.colors.background,
  borderRadius: theme.borderRadius.lg,
  padding: theme.spacing.md,
  ...theme.shadows.sm,
  borderWidth: 1,
  borderColor: theme.colors.border,
});

export const getInputStyles = (theme: Theme) => ({
  backgroundColor: theme.colors.background,
  borderWidth: 1,
  borderColor: theme.colors.border,
  borderRadius: theme.borderRadius.md,
  paddingHorizontal: theme.spacing.md,
  paddingVertical: theme.spacing.sm,
  fontSize: theme.typography.body.fontSize,
  color: theme.colors.text.primary,
});