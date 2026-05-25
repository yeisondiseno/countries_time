"use client";

import type { ReactNode } from "react";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
} from "react";

import type { HourFormat } from "@/lib/time/format-clock";
import { hour12FromFormat } from "@/lib/time/format-clock";

type TimeFormatContextValue = {
  hourFormat: HourFormat;
  hour12: boolean;
  setHourFormat: (format: HourFormat) => void;
  toggleHourFormat: () => void;
};

const TimeFormatContext = createContext<TimeFormatContextValue | null>(null);

const STORAGE_KEY = "countries-time-hour-format";

function readHourFormat(): HourFormat {
  if (typeof window === "undefined") {
    return "24h";
  }
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "12h" || stored === "24h") {
    return stored;
  }
  return "24h";
}

let hourFormatState: HourFormat = "24h";
const listeners = new Set<() => void>();

if (typeof window !== "undefined") {
  hourFormatState = readHourFormat();
  document.documentElement.dataset.hourFormat = hourFormatState;
}

function getSnapshot(): HourFormat {
  return hourFormatState;
}

function getServerSnapshot(): HourFormat {
  return "24h";
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

function publishHourFormat(next: HourFormat) {
  hourFormatState = next;
  if (typeof document !== "undefined") {
    document.documentElement.dataset.hourFormat = next;
    window.localStorage.setItem(STORAGE_KEY, next);
  }
  listeners.forEach((listener) => listener());
}

type Props = Readonly<{ children: ReactNode }>;

export function TimeFormatProvider({ children }: Props) {
  const hourFormat = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const setHourFormat = useCallback((next: HourFormat) => {
    publishHourFormat(next);
  }, []);

  const toggleHourFormat = useCallback(() => {
    publishHourFormat(hourFormatState === "24h" ? "12h" : "24h");
  }, []);

  return (
    <TimeFormatContext.Provider
      value={{
        hourFormat,
        hour12: hour12FromFormat(hourFormat),
        setHourFormat,
        toggleHourFormat,
      }}
    >
      {children}
    </TimeFormatContext.Provider>
  );
}

export function useTimeFormat(): TimeFormatContextValue {
  const ctx = useContext(TimeFormatContext);
  if (!ctx) {
    throw new Error("useTimeFormat must be used within TimeFormatProvider");
  }
  return ctx;
}
