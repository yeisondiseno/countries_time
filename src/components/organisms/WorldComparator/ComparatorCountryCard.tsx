"use client";

import { DateTime } from "luxon";
import type { useTranslations } from "next-intl";

import { FiX } from "react-icons/fi";

import { useTimeFormat } from "@/components";
import { countriesZones } from "@/lib/data/countries";
import { flagEmoji } from "@/lib/display/flags";
import type { Locale } from "@/lib/i18n/config";
import { formatCountryRegion, formatTimeZoneLabel } from "@/lib/time/display";
import { formatLuxonClock } from "@/lib/time/format-clock";

import type { CmpForm } from "./WorldComparator.types";
import { fmtDelta } from "./WorldComparator.utils";

import styles from "./WorldComparator.module.css";

type Props = Readonly<{
  t: ReturnType<typeof useTranslations<"Compare">>;
  locale: Locale;
  code: string;
  idx: number;
  anchorCode: string;
  anchorIdx: number;
  form: CmpForm;
  utcMillis: number;
  onSetAnchor: (idx: number) => void;
  onRemove: (idx: number) => void;
}>;

export function ComparatorCountryCard({
  t,
  locale,
  code,
  idx,
  anchorCode,
  anchorIdx,
  form,
  utcMillis,
  onSetAnchor,
  onRemove,
}: Props) {
  const { hour12 } = useTimeFormat();
  const entry = countriesZones.countries[code];
  if (!entry) {
    return null;
  }

  const zoneForRow = code === anchorCode ? form.anchorZone : entry.defaultZone;
  const isAnchor = idx === anchorIdx;
  const instant = DateTime.fromMillis(utcMillis, {
    zone: zoneForRow,
  }).setLocale(locale);
  const refInstant = DateTime.fromMillis(utcMillis, { zone: form.anchorZone });
  const deltaMin = Math.round(instant.diff(refInstant, "minutes").minutes);
  const countryLabel = formatCountryRegion(code, locale);
  const zoneLabel = formatTimeZoneLabel(zoneForRow);

  return (
    <article
      className={`${styles.card} ${isAnchor ? styles.cardAnchor : ""}`}
      aria-label={`${countryLabel}${isAnchor ? ` (${t("badgeRef")})` : ""}`}
    >
      <header className={styles.cardHead}>
        <div className={styles.cardMeta}>
          <h2 className={styles.cardCountry} title={countryLabel}>
            <span aria-hidden>{flagEmoji(code)}</span>{" "}
            {countryLabel}
          </h2>
          <p className={styles.cardZone} title={zoneLabel}>
            {zoneLabel}
          </p>
        </div>
        {isAnchor ? (
          <span className={styles.badge}>{t("badgeRef")}</span>
        ) : null}
      </header>
      <p className={styles.cardTime}>{formatLuxonClock(instant, hour12)}</p>
      <p className={styles.cardDate}>{instant.toFormat("ccc, d MMM")}</p>
      <div className={styles.cardDelta}>
        <span>{isAnchor ? "—" : t("deltaLabel")}</span>
        <span className={styles.deltaValue}>
          {isAnchor ? "" : fmtDelta(deltaMin)}
        </span>
      </div>
      <div className={styles.cardActions}>
        {!isAnchor ? (
          <button
            type="button"
            className={styles.setRef}
            onClick={() => onSetAnchor(idx)}
          >
            {t("setRef")}
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          className={styles.iconBtn}
          onClick={() => onRemove(idx)}
          aria-label={`${t("remove")} ${countryLabel}`}
        >
          <FiX size={14} aria-hidden />
        </button>
      </div>
    </article>
  );
}
