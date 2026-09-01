"use client";

import type { ReactNode } from "react";

import { createContext, useCallback, useContext, useSyncExternalStore } from "react";

import {
  type CookieConsentValue,
  getCookieConsentServerSnapshot,
  getCookieConsentSnapshot,
  subscribeCookieConsent,
  writeCookieConsent,
} from "@/lib/consent/cookie-consent";

type CookieConsentContextValue = Readonly<{
  consent: CookieConsentValue | null;
  setConsent: (value: CookieConsentValue) => void;
  hasAnswered: boolean;
  allowsAnalytics: boolean;
}>;

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

type Props = Readonly<{ children: ReactNode }>;

export function CookieConsentProvider({ children }: Props) {
  const consent = useSyncExternalStore(
    subscribeCookieConsent,
    getCookieConsentSnapshot,
    getCookieConsentServerSnapshot,
  );

  const setConsent = useCallback((value: CookieConsentValue) => {
    writeCookieConsent(value);
  }, []);

  const value: CookieConsentContextValue = {
    consent,
    setConsent,
    hasAnswered: consent !== null,
    allowsAnalytics: consent === "all",
  };

  return (
    <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>
  );
}

export function useCookieConsent(): CookieConsentContextValue {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error("useCookieConsent must be used within CookieConsentProvider");
  }
  return ctx;
}
