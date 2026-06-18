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
import styles from "./CountryPageView.module.css";

type RelatedCountry = Readonly<{
  code: string;
  name: string;
  href: string;
}>;

type Props = Readonly<{
  locale: Locale;
  code: string;
  capital: string;
  defaultZone: string;
  zones: string[];
  editorialOverview?: string | null;
  editorialDstNotes?: string | null;
  editorialPracticalTip?: string | null;
  relatedCountries?: readonly RelatedCountry[];
}>;

export function CountryPageView({
  locale,
  code,
  capital,
  defaultZone,
  zones,
  editorialOverview,
  editorialDstNotes,
  editorialPracticalTip,
  relatedCountries = [],
}: Props) {
  const t = useTranslations("Country");
  const tCommon = useTranslations("Common");
  const [zone, setZone] = useState(defaultZone);
  const pretty = formatCountryRegion(code, locale);

  return (
    <article>
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

      <section className={`${shared.container} ${styles.body}`}>
        <div className={styles.main}>
          <div className={styles.prose}>
            <h2>{t("aboutHeading")}</h2>
            {editorialOverview ? (
              <p>{editorialOverview}</p>
            ) : (
              <p>{t("capitalIntro", { country: pretty, capital })}</p>
            )}
            <p>{t("zoneExplain", { country: pretty, zone })}</p>
            {editorialDstNotes ? (
              <>
                <h3>{t("dstNotesHeading")}</h3>
                <p>{editorialDstNotes}</p>
              </>
            ) : null}
            {editorialPracticalTip ? (
              <>
                <h3>{t("practicalTipHeading")}</h3>
                <p>{editorialPracticalTip}</p>
              </>
            ) : null}
          </div>
          {relatedCountries.length > 0 ? (
            <div className={styles.prose}>
              <h2>{t("relatedCountriesTitle")}</h2>
              <ul className={styles.relatedList}>
                {relatedCountries.map((item) => (
                  <li key={item.code}>
                    <Link href={item.href}>
                      {flagEmoji(item.code)} {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className={styles.prose}>
            <h2 id="faq">{t("faqHeading")}</h2>
            <div className={styles.faq}>
              <details>
                <summary>{tCommon("faqTimeTitle")}</summary>
                <div className={styles.faqBody}>{tCommon("faqDstBody")}</div>
              </details>
              <details>
                <summary>{t("faqQ2")}</summary>
                <div className={styles.faqBody}>{t("faqA2")}</div>
              </details>
              <details>
                <summary>{t("faqQ3")}</summary>
                <div className={styles.faqBody}>{t("faqA3")}</div>
              </details>
            </div>
          </div>
          <p>
            <Link href="/countries" className={styles.back}>
              {t("backToDirectory", { title: tCommon("countriesTitle") })}
            </Link>
          </p>
        </div>
        <aside className={styles.aside}>
          <div className={styles.promo}>
            <h3>{t("promoTitle")}</h3>
            <p>{t("promoBody")}</p>
            <Link href="/compare" className={styles.promoBtn}>
              {t("promoCta")}
            </Link>
          </div>
        </aside>
      </section>
    </article>
  );
}
