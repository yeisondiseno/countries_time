"use client";

import { Analytics } from "@vercel/analytics/react";

import { useCookieConsent } from "@/components/providers/CookieConsentProvider";

export function ConsentAnalytics() {
  const { allowsAnalytics } = useCookieConsent();

  if (!allowsAnalytics) {
    return null;
  }

  return <Analytics />;
}
