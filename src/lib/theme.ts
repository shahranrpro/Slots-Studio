/**
 * Slots Studio — Theme Architecture & Tokens
 *
 * Supports exactly three appearance modes:
 * - system: follows user's operating-system color preference (Default)
 * - light: forced Slots Studio light appearance
 * - dark: forced Slots Studio dark appearance
 */

export type AppearanceMode = "system" | "light" | "dark";

export type ResolvedTheme = "light" | "dark";

export interface ThemeConfig {
  mode: AppearanceMode;
  resolved: ResolvedTheme;
}

export const THEME_STORAGE_KEY = "slots-studio-appearance";

export const THEME_ATTRIBUTE = "data-theme";

export interface ThemeOption {
  value: AppearanceMode;
  label: string;
  description: string;
}

export const THEME_MODES: Record<AppearanceMode, ThemeOption> = {
  system: {
    value: "system",
    label: "Default",
    description: "Follow the operating system color preference.",
  },
  light: {
    value: "light",
    label: "Light",
    description: "Force the Slots Studio light appearance.",
  },
  dark: {
    value: "dark",
    label: "Dark",
    description: "Force the Slots Studio dark appearance.",
  },
};

export const BRAND_COLORS = {
  black: "#000000",
  white: "#FFFFFF",
  electricLime: "#B7FF00",
} as const;

/**
 * Resolves an AppearanceMode ('system' | 'light' | 'dark') to an effective ResolvedTheme ('light' | 'dark').
 */
export function resolveTheme(preference: AppearanceMode, systemIsDark: boolean): ResolvedTheme {
  if (preference === "system") {
    return systemIsDark ? "dark" : "light";
  }
  return preference;
}

/**
 * Checks if the current client environment prefers dark color scheme.
 */
export function getSystemIsDark(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}
