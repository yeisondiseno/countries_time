"use client";

import { useEffect, useMemo, useState } from "react";

import { useLocale, useTranslations } from "next-intl";

import { FiSearch } from "react-icons/fi";

import { Link } from "@/i18n/navigation";

import {
  countryRegion,
  regionSortIndex,
  type CountryRegion,
} from "@/lib/data/regions";
import { flagEmoji } from "@/lib/display/flags";
import { listCountryCodesSorted } from "@/lib/data/countries";
import { countriesZones } from "@/lib/data/countries";
import type { Locale } from "@/lib/i18n/config";
import { formatCountryRegion, formatTimeZoneLabel } from "@/lib/time/display";

import shared from "@/styles/shared.module.css";

import styles from "./CountryDirectory.module.css";

export function CountryDirectory() {
  const locale = useLocale() as Locale;
  const t = useTranslations("Countries");
  const tCommon = useTranslations("Common");
  const [search, setSearch] = useState("");
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const codes = listCountryCodesSorted();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return codes.filter((code) => {
      const name = formatCountryRegion(code, locale).toLowerCase();
      return !q || name.includes(q) || code.toLowerCase().includes(q);
    });
  }, [codes, locale, search]);

  const grouped = useMemo(() => {
    const map = new Map<CountryRegion, string[]>();
    for (const code of filtered) {
      const region = countryRegion(code);
      const list = map.get(region) ?? [];
      list.push(code);
      map.set(region, list);
    }
    return [...map.entries()].sort(
      (a, b) => regionSortIndex(a[0]) - regionSortIndex(b[0]),
    );
  }, [filtered]);

  return (
    <section className={shared.container}>
      <div className={styles.eyebrow}>
        <span className={styles.dot} aria-hidden />
        {tCommon("navCountries").toUpperCase()}
      </div>
      <h1 className={styles.title}>{tCommon("countriesTitle")}</h1>
      <p className={styles.sub}>{t("subtitle", { count: codes.length })}</p>

      <div className={styles.searchWrap}>
        <FiSearch className={styles.searchIcon} aria-hidden />
        <input
          type="search"
          className={styles.search}
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label={t("searchPlaceholder")}
        />
      </div>

      {filtered.length === 0 ? (
        <p className={styles.empty}>{t("noResults")}</p>
      ) : (
        grouped.map(([region, regionCodes]) => (
          <section key={region} className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {t(`regions.${region}` as "regions.Americas")}{" "}
              <span className={styles.count}>· {regionCodes.length}</span>
            </h2>
            <div className={styles.grid}>
              {regionCodes.map((code) => {
                const entry = countriesZones.countries[code];
                const zone = entry?.defaultZone ?? "UTC";
                return (
                  <Link
                    key={code}
                    href={`/countries/${code.toLowerCase()}`}
                    className={styles.row}
                  >
                    <span className={styles.flag} aria-hidden>
                      {flagEmoji(code)}
                    </span>
                    <span className={styles.main}>
                      <span className={styles.name}>
                        {formatCountryRegion(code, locale)}
                      </span>
                      <span className={styles.subRow}>
                        {formatTimeZoneLabel(zone)}
                      </span>
                    </span>
                    <span className={styles.time}>
                      {new Intl.DateTimeFormat(locale, {
                        timeZone: zone,
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      }).format(now)}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        ))
      )}
    </section>
  );
}
