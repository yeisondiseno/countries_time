"use client";

import { useTranslations } from "next-intl";
import { isAdsEnabled } from "@/lib/ads/config";

import styles from "./AdSlot.module.css";

type Props = Readonly<{
  variant?: "leaderboard" | "inContent" | "sidebar";
}>;

export function AdSlot({ variant = "leaderboard" }: Props) {
  const t = useTranslations("Ads");

  if (!isAdsEnabled()) {
    return null;
  }

  const label = variant === "leaderboard" ? t("leader") : t("inContent");

  return (
    <aside
      className={`${styles.slot} ${variant === "leaderboard" ? styles.leader : styles.inContent}`}
      role="complementary"
      aria-label={t("ariaLabel")}
    >
      {label}
    </aside>
  );
}
