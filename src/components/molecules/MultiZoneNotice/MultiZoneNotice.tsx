"use client";

import { useTranslations } from "next-intl";

import { FiInfo } from "react-icons/fi";

import { formatTimeZoneLabel } from "@/lib/time/display";

import styles from "./MultiZoneNotice.module.css";

type Props = Readonly<{
  zones: string[];
  value: string;
  onChange: (zone: string) => void;
}>;

export function MultiZoneNotice({ zones, value, onChange }: Props) {
  const t = useTranslations("Country");

  if (zones.length < 2) {
    return null;
  }

  return (
    <div className={styles.notice} role="note">
      <FiInfo className={styles.icon} aria-hidden />
      <div>
        <strong>{t("multiZoneTitle")}</strong>{" "}
        <label>
          {t("chooseZone")}:{" "}
          <select
            className={styles.select}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-label={t("chooseZone")}
          >
            {zones.map((zone) => (
              <option key={zone} value={zone}>
                {formatTimeZoneLabel(zone)}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
