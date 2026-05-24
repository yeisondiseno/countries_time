"use client";

import { useTranslations } from "next-intl";

import { useTimeFormat } from "@/components";

import styles from "./TimeFormatToggle.module.css";

export function TimeFormatToggle() {
  const { hourFormat, toggleHourFormat } = useTimeFormat();
  const t = useTranslations("TimeFormat");
  const is12h = hourFormat === "12h";

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggleHourFormat}
      aria-label={is12h ? t("switch24h") : t("switch12h")}
      aria-pressed={is12h}
      title={is12h ? t("switch24h") : t("switch12h")}
    >
      <span className={styles.track} aria-hidden>
        <span className={styles.thumb} />
        <span className={`${styles.label} ${styles.labelLeft}`}>
          {t("label12h")}
        </span>
        <span className={`${styles.label} ${styles.labelRight}`}>
          {t("label24h")}
        </span>
      </span>
    </button>
  );
}
