"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { DateTime } from "luxon";
import { useLocale, useTranslations } from "next-intl";

import { FiInfo, FiSearch, FiX } from "react-icons/fi";

import { countriesZones } from "@/lib/data/countries";
import { flagEmoji } from "@/lib/display/flags";
import type { Locale } from "@/lib/i18n/config";
import { formatCountryRegion, formatTimeZoneLabel } from "@/lib/time/display";

import shared from "@/styles/shared.module.css";

import styles from "./WorldComparator.module.css";

const ALL_CODES = ["DE", "ES", "JP", "US"] as const;
type CmpForm = {
  anchorCountry: string;
  anchorZone: string;
  date: string;
  time: string;
};

function utcMillisFromWall(values: CmpForm): { ok: true; utcMillis: number } | { ok: false } {
  const wall = DateTime.fromISO(`${values.date}T${values.time}`, {
    zone: values.anchorZone,
  });
  if (!wall.isValid) {
    return { ok: false };
  }
  return { ok: true, utcMillis: wall.toUTC().toMillis() };
}

function buildDefaults(code: string): CmpForm {
  const zone = countriesZones.countries[code]?.defaultZone ?? "UTC";
  const now = DateTime.now().setZone(zone).startOf("minute");
  return {
    anchorCountry: code,
    anchorZone: zone,
    date: now.toFormat("yyyy-LL-dd"),
    time: now.toFormat("HH:mm"),
  };
}

function fmtDelta(minutes: number): string {
  const sign = minutes >= 0 ? "+" : "−";
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  if (h === 0) {
    return `${sign}${m}m`;
  }
  return `${sign}${h}h${m > 0 ? ` ${m}m` : ""}`;
}

export function WorldComparator() {
  const locale = useLocale() as Locale;
  const t = useTranslations("Compare");
  const [slots, setSlots] = useState<(string | null)[]>(["DE", "ES", "JP", "US"]);
  const [anchorIdx, setAnchorIdx] = useState(0);
  const [manualForm, setManualForm] = useState<CmpForm>(() => buildDefaults("DE"));
  const [followNow, setFollowNow] = useState(true);
  const [liveMinute, setLiveMinute] = useState(() => Date.now());
  const [pickerOpen, setPickerOpen] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filled = slots.filter((c): c is string => Boolean(c));
  const isActive = filled.length >= 2;
  const anchorCode = slots[anchorIdx] ?? filled[0] ?? "DE";
  const anchorEntry = countriesZones.countries[anchorCode];

  useEffect(() => {
    if (!followNow) {
      return;
    }
    const id = window.setInterval(() => setLiveMinute(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, [followNow]);

  const form = useMemo(() => {
    if (!followNow || !anchorEntry) {
      return manualForm;
    }
    const snap = DateTime.fromMillis(liveMinute)
      .setZone(anchorEntry.defaultZone)
      .startOf("minute");
    return {
      anchorCountry: anchorCode,
      anchorZone: anchorEntry.defaultZone,
      date: snap.toFormat("yyyy-LL-dd"),
      time: snap.toFormat("HH:mm"),
    };
  }, [followNow, anchorEntry, anchorCode, manualForm, liveMinute]);

  const utcResult = useMemo(() => utcMillisFromWall(form), [form]);

  const setField = useCallback(<K extends keyof CmpForm>(key: K, value: CmpForm[K]) => {
    setManualForm((prev) => ({ ...prev, [key]: value }));
    setFollowNow(false);
  }, []);

  const summaryText = useMemo(() => {
    if (!utcResult.ok || filled.length < 2) {
      return null;
    }
    const other = filled.find((c) => c !== anchorCode);
    if (!other || !anchorEntry) {
      return null;
    }
    const otherEntry = countriesZones.countries[other];
    if (!otherEntry) {
      return null;
    }
    const instant = DateTime.fromMillis(utcResult.utcMillis);
    const fmtA = instant.setZone(form.anchorZone).setLocale(locale).toFormat("HH:mm");
    const fmtB = instant.setZone(otherEntry.defaultZone).setLocale(locale).toFormat("HH:mm");
    return t("summary", {
      timeA: fmtA,
      countryA: formatCountryRegion(anchorCode, locale),
      timeB: fmtB,
      countryB: formatCountryRegion(other, locale),
    });
  }, [utcResult, filled, anchorCode, anchorEntry, form.anchorZone, locale, t]);

  const setSlot = (idx: number, code: string) => {
    setSlots((prev) => prev.map((c, i) => (i === idx ? code : c)));
    setPickerOpen(null);
  };

  const removeSlot = (idx: number) => {
    setSlots((prev) => prev.map((c, i) => (i === idx ? null : c)));
    if (idx === anchorIdx) {
      const remaining = slots
        .map((c, i) => ({ c, i }))
        .filter((x) => x.c && x.i !== idx);
      if (remaining[0]) {
        setAnchorIdx(remaining[0].i);
      }
    }
  };

  const setAsAnchor = (idx: number) => {
    setAnchorIdx(idx);
    setFollowNow(true);
    const code = slots[idx];
    if (code && countriesZones.countries[code]) {
      setManualForm(buildDefaults(code));
      setLiveMinute(Date.now());
    }
  };

  const filteredPicker = ALL_CODES.filter(
    (code) => !slots.includes(code) && formatCountryRegion(code, locale).toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <section className={shared.container}>
      <div className={styles.head}>
        <div className={styles.eyebrow}>
          <span className={styles.dot} aria-hidden />
          {t("eyebrow").toUpperCase()}
        </div>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.sub}>{t("subtitle")}</p>
      </div>

      {summaryText ? (
        <p className={styles.summary} role="status">
          {summaryText}
        </p>
      ) : null}

      <div className={styles.anchor} role="group" aria-label={t("anchorControls")}>
        <div className={styles.anchorField}>
          <label htmlFor="anchor-country">{t("anchorLabel")}</label>
          <select
            id="anchor-country"
            value={anchorCode}
            onChange={(e) => {
              const idx = slots.indexOf(e.target.value);
              if (idx >= 0) {
                setAsAnchor(idx);
              }
            }}
          >
            {ALL_CODES.map((code) => (
              <option key={code} value={code}>
                {flagEmoji(code)} {formatCountryRegion(code, locale)}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.anchorField}>
          <label htmlFor="anchor-date">{t("dateLabel")}</label>
          <input
            id="anchor-date"
            type="date"
            value={form.date}
            onChange={(e) => setField("date", e.target.value)}
          />
        </div>
        <div className={styles.anchorField}>
          <label htmlFor="anchor-time">{t("timeLabel")}</label>
          <input
            id="anchor-time"
            type="time"
            step={60}
            value={form.time}
            onChange={(e) => setField("time", e.target.value)}
          />
        </div>
        <div className={styles.anchorField}>
          <label htmlFor="follow-now" className={styles.srOnly}>
            {t("liveToggle")}
          </label>
          <button
            id="follow-now"
            type="button"
            className={`${styles.liveBtn} ${followNow ? styles.liveBtnOn : ""}`}
            onClick={() => setFollowNow((v) => !v)}
            aria-pressed={followNow}
          >
            {followNow ? t("liveOn") : t("liveOff")}
          </button>
        </div>
        <p className={styles.anchorHelp}>
          <FiInfo width={16} height={16} aria-hidden />
          {t("anchorHelp")}
        </p>
      </div>

      {!isActive ? (
        <div className={styles.validation} role="alert">
          <FiInfo width={18} height={18} aria-hidden />
          {t("validationMin")}
        </div>
      ) : null}

      {!utcResult.ok ? (
        <div className={styles.validation} role="alert">
          {t("validationError")}
        </div>
      ) : null}

      <div className={styles.grid}>
        {slots.map((code, idx) => {
          if (!code) {
            return (
              <button
                key={idx}
                type="button"
                className={`${styles.card} ${styles.cardEmpty}`}
                onClick={() => {
                  setPickerOpen(idx);
                  setSearch("");
                }}
              >
                <span className={styles.plus} aria-hidden>
                  +
                </span>
                <strong>{t("addCountry")}</strong>
                <span className={styles.addHint}>{t("addCountryHint")}</span>
              </button>
            );
          }

          const entry = countriesZones.countries[code];
          if (!entry || !utcResult.ok) {
            return null;
          }

          const zoneForRow =
            code === anchorCode ? form.anchorZone : entry.defaultZone;
          const isAnchor = idx === anchorIdx;
          const instant = DateTime.fromMillis(utcResult.utcMillis, {
            zone: zoneForRow,
          }).setLocale(locale);
          const refInstant = DateTime.fromMillis(utcResult.utcMillis, {
            zone: form.anchorZone,
          });
          const deltaMin = Math.round(
            instant.diff(refInstant, "minutes").minutes,
          );

          return (
            <article
              key={idx}
              className={`${styles.card} ${isAnchor ? styles.cardAnchor : ""}`}
              aria-label={`${formatCountryRegion(code, locale)}${isAnchor ? ` (${t("badgeRef")})` : ""}`}
            >
              <header className={styles.cardHead}>
                <div>
                  <h2 className={styles.cardCountry}>
                    <span aria-hidden>{flagEmoji(code)}</span>{" "}
                    {formatCountryRegion(code, locale)}
                  </h2>
                  <p className={styles.cardZone}>{formatTimeZoneLabel(zoneForRow)}</p>
                </div>
                {isAnchor ? <span className={styles.badge}>{t("badgeRef")}</span> : null}
              </header>
              <p className={styles.cardTime}>{instant.toFormat("HH:mm")}</p>
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
                    onClick={() => setAsAnchor(idx)}
                  >
                    {t("setRef")}
                  </button>
                ) : (
                  <span />
                )}
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={() => removeSlot(idx)}
                  aria-label={`${t("remove")} ${formatCountryRegion(code, locale)}`}
                >
                  <FiX size={14} aria-hidden />
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {pickerOpen !== null ? (
        <div
          className={styles.modalBackdrop}
          role="dialog"
          aria-modal
          aria-label={t("addCountry")}
          onClick={() => setPickerOpen(null)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setPickerOpen(null);
            }
          }}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
            role="document"
          >
            <div className={styles.modalHead}>
              <h3>{t("addCountry")}</h3>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => setPickerOpen(null)}
                aria-label={t("closePicker")}
              >
                <FiX size={14} aria-hidden />
              </button>
            </div>
            <div className={styles.modalSearch}>
              <FiSearch className={styles.searchIcon} aria-hidden />
              <input
                type="search"
                placeholder={t("searchCountry")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
            <div className={styles.modalList}>
              {filteredPicker.length === 0 ? (
                <p className={styles.emptyPicker}>{t("noResults")}</p>
              ) : (
                filteredPicker.map((code) => (
                  <button
                    key={code}
                    type="button"
                    className={styles.pickerRow}
                    onClick={() => setSlot(pickerOpen, code)}
                  >
                    <span>{flagEmoji(code)}</span>
                    <span>{formatCountryRegion(code, locale)}</span>
                    <span className={styles.pickerCode}>{code}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
