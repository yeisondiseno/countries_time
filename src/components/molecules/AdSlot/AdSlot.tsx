"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

import { useCookieConsent } from "@/components/providers/CookieConsentProvider";
import { getAdSenseClientId, getAdSenseSlotId } from "@/lib/ads/adsense-config";
import { isAdsEnabled } from "@/lib/ads/config";

import styles from "./AdSlot.module.css";

type Props = Readonly<{
  variant?: "leaderboard" | "inContent" | "sidebar";
}>;

export function AdSlot({ variant = "leaderboard" }: Props) {
  const t = useTranslations("Ads");
  const { allowsAnalytics } = useCookieConsent();
  const pushedRef = useRef(false);
  const clientId = getAdSenseClientId();
  const slotId = getAdSenseSlotId(variant);

  const adsActive = isAdsEnabled() && allowsAnalytics && clientId && slotId;

  useEffect(() => {
    if (!adsActive || pushedRef.current) {
      return;
    }

    try {
      window.adsbygoogle = window.adsbygoogle ?? [];
      window.adsbygoogle.push({});
      pushedRef.current = true;
    } catch {
      // AdSense not ready yet
    }
  }, [adsActive]);

  if (!adsActive) {
    return null;
  }

  return (
    <aside
      className={`${styles.slot} ${variant === "leaderboard" ? styles.leader : styles.inContent}`}
      role="complementary"
      aria-label={t("ariaLabel")}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
