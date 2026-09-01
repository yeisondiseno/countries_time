"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FiArrowRight } from "react-icons/fi";

import { MultiZoneNotice, TimeDisplay } from "@/components/molecules";
import { Link } from "@/i18n/navigation";
import { flagEmoji } from "@/lib/display/flags";
import type { Locale } from "@/lib/i18n/config";
import { formatCountryRegion } from "@/lib/time/display";

import shared from "@/styles/shared.module.css";

import styles from "../CountryPageView/CountryPageView.module.css";

type Props = Readonly<{
  locale: Locale;
  code: string;
  defaultZone: string;
  zones: string[];
}>;

export function CountryPageHero({ locale, code, defaultZone, zones }: Props) {
  const t = useTranslations("Country");
  const [zone, setZone] = useState(defaultZone);
  const pretty = formatCountryRegion(code, locale);

  return (
    <section className={`${shared.container} ${styles.hero}`}>
      <div className={styles.eyebrow}>
        <span className={styles.dot} aria-hidden />
        {t("heroEyebrow")}
      </div>
      <h1 className={styles.h1}>
        <span className={styles.countryName}>
          {flagEmoji(code)} {pretty}
        </span>
      </h1>
      <TimeDisplay timeZone={zone} />
      <MultiZoneNotice zones={zones} value={zone} onChange={setZone} />
      <Link className={styles.cta} href="/compare">
        {t("ctaCompare")}
        <FiArrowRight className={styles.ctaArrow} aria-hidden />
      </Link>
    </section>
  );
}
