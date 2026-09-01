"use client";

import { useEffect } from "react";

import { useCookieConsent } from "@/components/providers/CookieConsentProvider";
import { getAdSenseClientId } from "@/lib/ads/adsense-config";
import { isAdsEnabled } from "@/lib/ads/config";

export function ConsentAdSenseScript() {
  const { allowsAnalytics } = useCookieConsent();
  const clientId = getAdSenseClientId();

  useEffect(() => {
    if (!isAdsEnabled() || !allowsAnalytics || !clientId) {
      const existing = document.querySelector(
        'script[data-countries-time-adsense="true"]',
      );
      existing?.remove();
      return;
    }

    const existing = document.querySelector(
      'script[data-countries-time-adsense="true"]',
    );
    if (existing) {
      return;
    }

    const script = document.createElement("script");
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(clientId)}`;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-countries-time-adsense", "true");
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [allowsAnalytics, clientId]);

  return null;
}
