export const COOKIE_CONSENT_STORAGE_KEY = "countries-time:cookie-consent";

export type CookieConsentValue = "all" | "essential";

export function parseCookieConsent(raw: string | null): CookieConsentValue | null {
  if (raw === "all" || raw === "essential") {
    return raw;
  }
  return null;
}

export function readCookieConsent(): CookieConsentValue | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return parseCookieConsent(window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function writeCookieConsent(value: CookieConsentValue): void {
  try {
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, value);
  } catch {
    // ignore storage errors
  }
  notifyCookieConsentListeners();
}

export function allowsAnalyticsConsent(consent: CookieConsentValue | null): boolean {
  return consent === "all";
}

let consentState: CookieConsentValue | null = null;
const listeners = new Set<() => void>();

if (typeof window !== "undefined") {
  consentState = readCookieConsent();
}

export function subscribeCookieConsent(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getCookieConsentSnapshot(): CookieConsentValue | null {
  return consentState;
}

export function getCookieConsentServerSnapshot(): CookieConsentValue | null {
  return null;
}

function notifyCookieConsentListeners(): void {
  consentState = readCookieConsent();
  for (const listener of listeners) {
    listener();
  }
}
