"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import {
  type AppearanceMode,
  type ResolvedTheme,
  THEME_STORAGE_KEY,
  THEME_ATTRIBUTE,
  resolveTheme,
} from "@/lib/theme";

interface AppearanceContextType {
  appearance: AppearanceMode;
  resolvedTheme: ResolvedTheme;
  setAppearance: (mode: AppearanceMode) => void;
  isMounted: boolean;
}

const AppearanceContext = createContext<AppearanceContextType | undefined>(undefined);

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultAppearance?: AppearanceMode;
}

export function ThemeProvider({
  children,
  defaultAppearance = "system",
}: ThemeProviderProps) {
  const [appearance, setAppearanceState] = useState<AppearanceMode>(defaultAppearance);
  const [systemIsDark, setSystemIsDark] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // References to prevent transitions during initial mount and handle clean transition timeouts
  const hasHydratedRef = useRef<boolean>(false);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousThemeRef = useRef<ResolvedTheme | null>(null);

  // Helper to trigger smooth transition class safely
  const triggerTransition = useCallback(() => {
    if (typeof window === "undefined") return;

    // Respect user prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const root = document.documentElement;

    // Clear any existing transition removal timer
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    // Add transition class
    root.classList.add("theme-transitioning");

    // Remove transition class after duration completes (280ms duration + buffer = 300ms)
    transitionTimeoutRef.current = setTimeout(() => {
      root.classList.remove("theme-transitioning");
      transitionTimeoutRef.current = null;
    }, 300);
  }, []);

  // Read initial preference on mount without animating
  useEffect(() => {
    const darkMedia = window.matchMedia("(prefers-color-scheme: dark)");
    const initialSystemIsDark = darkMedia.matches;
    setSystemIsDark(initialSystemIsDark);

    let initialAppearance: AppearanceMode = defaultAppearance;
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) as AppearanceMode | null;
      if (stored === "system" || stored === "light" || stored === "dark") {
        initialAppearance = stored;
        setAppearanceState(stored);
      }
    } catch {
      // localStorage may be inaccessible in private browsing
    }

    const initialResolved = resolveTheme(initialAppearance, initialSystemIsDark);
    previousThemeRef.current = initialResolved;
    setIsMounted(true);

    // Mark hydration complete on the next tick so initial paint has no transition
    const hydrationTimer = setTimeout(() => {
      hasHydratedRef.current = true;
    }, 50);

    return () => {
      clearTimeout(hydrationTimer);
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
      document.documentElement.classList.remove("theme-transitioning");
    };
  }, [defaultAppearance]);

  // Compute resolved theme
  const resolvedTheme: ResolvedTheme = resolveTheme(appearance, systemIsDark);

  // Apply data-theme to root DOM element and trigger transition only after hydration
  useEffect(() => {
    if (!isMounted) return;

    const root = document.documentElement;

    // If theme has actually changed and initial hydration is complete, trigger smooth transition
    if (hasHydratedRef.current && previousThemeRef.current !== resolvedTheme) {
      triggerTransition();
    }

    root.setAttribute(THEME_ATTRIBUTE, resolvedTheme);
    previousThemeRef.current = resolvedTheme;
  }, [resolvedTheme, isMounted, triggerTransition]);

  // Listen to OS color scheme changes when in 'system' mode
  useEffect(() => {
    if (!isMounted) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemIsDark(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [isMounted]);

  // Setter function that updates state and localStorage
  const setAppearance = useCallback((mode: AppearanceMode) => {
    setAppearanceState(mode);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      // Handle storage write failure gracefully
    }
  }, []);

  return (
    <AppearanceContext.Provider
      value={{
        appearance,
        resolvedTheme,
        setAppearance,
        isMounted,
      }}
    >
      {children}
    </AppearanceContext.Provider>
  );
}

/**
 * Hook to access and modify Slots Studio appearance preference.
 */
export function useAppearance(): AppearanceContextType {
  const context = useContext(AppearanceContext);
  if (!context) {
    throw new Error("useAppearance must be used within a ThemeProvider");
  }
  return context;
}
