"use client";

import { useEffect, useMemo, useState } from "react";

import { useLocale, useTranslations } from "next-intl";

import { FiMoon, FiSun } from "react-icons/fi";

import { clockPartsFor, isDaytime, offsetLabel } from "@/lib/time/clock-parts";
import { formatTimeZoneLabel } from "@/lib/time/display";

import shared from "@/styles/shared.module.css";

import styles from "./TimeDisplay.module.css";

type Props = Readonly<{
  timeZone: string;
  showSeconds?: boolean;
}>;

export function TimeDisplay({ timeZone, showSeconds = true }: Props) {
  const locale = useLocale();
  const t = useTranslations("TimeDisplay");
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const parts = useMemo(
    () => clockPartsFor(now, timeZone, false),
    [now, timeZone],
  );

  const dateStr = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        timeZone,
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(now),
    [locale, now, timeZone],
  );

  const day = isDaytime(now, timeZone);
  const offset = offsetLabel(now, timeZone);

  return (
    <section className={styles.block} aria-label={t("ariaLabel")}>
      <div
        className={styles.time}
        aria-live="polite"
        aria-atomic="true"
        suppressHydrationWarning
      >
        <span>{parts.hour}</span>
        <span className={styles.sep}>:</span>
        <span>{parts.minute}</span>
        {showSeconds ? (
          <span className={styles.seconds}>:{parts.second}</span>
        ) : null}
      </div>
      <div className={styles.meta}>
        <span className={styles.date}>{dateStr}</span>
        <span className={styles.zone} title={t("ianaTitle")}>
          {formatTimeZoneLabel(timeZone)} · {offset}
        </span>
        <span
          className={styles.dayNight}
          aria-label={day ? t("day") : t("night")}
        >
          {day ? (
            <FiSun className={styles.dnIcon} aria-hidden />
          ) : (
            <FiMoon className={styles.dnIcon} aria-hidden />
          )}
          {day ? t("day") : t("night")}
        </span>
      </div>
      <h2 className={shared.visuallyHidden}>{t("heading")}</h2>
    </section>
  );
}
