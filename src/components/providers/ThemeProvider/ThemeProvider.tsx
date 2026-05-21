"use client";

import type { ReactNode } from "react";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
} from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "countries-time-theme";

function readTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }
  const stored = window?.localStorage?.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return window?.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

let themeState: Theme = "light";
const listeners = new Set<() => void>();

if (typeof window !== "undefined") {
  themeState = readTheme();
  document.documentElement.dataset.theme = themeState;
}

function getSnapshot(): Theme {
  return themeState;
}

function getServerSnapshot(): Theme {
  return "light";
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

function publishTheme(next: Theme) {
  themeState = next;
  if (typeof document !== "undefined") {
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem(STORAGE_KEY, next);
  }
  listeners.forEach((listener) => listener());
}

type Props = Readonly<{ children: ReactNode }>;

export function ThemeProvider({ children }: Props) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((next: Theme) => {
    publishTheme(next);
  }, []);

  const toggleTheme = useCallback(() => {
    publishTheme(themeState === "dark" ? "light" : "dark");
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
