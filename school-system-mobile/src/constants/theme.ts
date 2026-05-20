export interface ColorPalette {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  background: string;
  surface: string;
  surfaceHover: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

/** Light theme — the original palette. Used as default. */
export const LIGHT_COLORS: ColorPalette = {
  primary: "#7c3aed",
  primaryLight: "#a78bfa",
  primaryDark: "#5b21b6",
  background: "#ffffff",
  surface: "#f8fafc",
  surfaceHover: "#f1f5f9",
  text: "#0f172a",
  textSecondary: "#64748b",
  textMuted: "#94a3b8",
  border: "#e2e8f0",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#3b82f6",
};

/** Dark theme — adjusted for low-light readability. */
export const DARK_COLORS: ColorPalette = {
  primary: "#a78bfa",
  primaryLight: "#c4b5fd",
  primaryDark: "#7c3aed",
  background: "#0b1220",
  surface: "#0f172a",
  surfaceHover: "#1e293b",
  text: "#f1f5f9",
  textSecondary: "#cbd5e1",
  textMuted: "#94a3b8",
  border: "#334155",
  success: "#34d399",
  warning: "#fbbf24",
  error: "#f87171",
  info: "#60a5fa",
};

/**
 * Default `colors` export — kept for backward-compat with components that
 * import it statically. Theme-aware components should prefer `useTheme().colors`.
 */
export const colors: ColorPalette = LIGHT_COLORS;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 28,
  heading: 24,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

/** Brand gradients (tuples — ready for expo-linear-gradient `colors`). */
export const gradients = {
  /** Purple → indigo brand gradient. */
  primary: ["#8b5cf6", "#6366f1"] as const,
};

/** Reusable elevation presets for a soft, modern depth. */
export const shadows = {
  /** Floating element — hero logo, search bar, primary cards. */
  card: {
    shadowColor: "#1e1b4b",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  /** Subtle depth for list items. */
  soft: {
    shadowColor: "#1e1b4b",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
} as const;
