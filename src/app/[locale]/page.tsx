import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { FiArrowRight } from "react-icons/fi";

import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { findCountry } from "@/lib/data/countries";
import type { Locale } from "@/lib/i18n/config";
import { JsonLd } from "@/lib/seo/JsonLd";
import { buildFaqPageJsonLd, buildWebPageJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { countryPath } from "@/lib/seo/paths";
import { formatCountryRegion } from "@/lib/time/display";

import shared from "@/styles/shared.module.css";

import styles from "./page.module.css";

const FEATURED_COUNTRY_CODES = ["US", "ES", "MX", "GB", "DE", "JP"] as const;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(props: Props) {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) {
    return { title: "Countries Time" };
  }
  const t = await getTranslations({ locale, namespace: "Home" });
  const ogImageAlt = t("ogImageAlt");
  const base = buildPageMetadata({
    locale: locale as Locale,
    title: t("metaTitle"),
    description: t("metaDescription"),
    pathWithoutLocale: "/",
  });

  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      images: [{ alt: ogImageAlt }],
    },
    twitter: {
      ...base.twitter,
      images: [{ alt: ogImageAlt }],
    },
  };
}

export default async function LocaleHome(props: Props) {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const t = await getTranslations("Home");
  const localeCode = locale as Locale;

  const featuredCountries = FEATURED_COUNTRY_CODES.flatMap((code) => {
    const hit = findCountry(code);
    if (!hit) {
      return [];
    }
    return [
      {
        code: hit.code,
        name: formatCountryRegion(hit.code, localeCode),
      },
    ];
  });

  const faqItems = [
    { question: t("seoFaqQ1"), answer: t("seoFaqA1") },
    { question: t("seoFaqQ2"), answer: t("seoFaqA2") },
    { question: t("seoFaqQ3"), answer: t("seoFaqA3") },
  ];

  const webPageJsonLd = buildWebPageJsonLd({
    locale: localeCode,
    pathWithoutLocale: "/",
    name: t("metaTitle"),
    description: t("metaDescription"),
  });

  const faqJsonLd = buildFaqPageJsonLd(faqItems);

  return (
    <>
      <JsonLd data={[webPageJsonLd, faqJsonLd]} />

      <div className={styles.page}>
        <section className={`${shared.container} ${styles.hero}`}>
          <div className={styles.eyebrow}>
            <span className={styles.dot} aria-hidden />
            {t("eyebrow")}
          </div>
          <h1 className={styles.title}>{t("title")}</h1>
          <p className={styles.sub}>{t("subtitle")}</p>
          <div className={styles.actions}>
            <Link className={styles.ctaPrimary} href="/countries">
              {t("ctaCountries")}
              <FiArrowRight aria-hidden />
            </Link>
            <Link className={styles.ctaGhost} href="/compare">
              {t("ctaCompare")}
            </Link>
          </div>
        </section>

        <section
          className={`${shared.container} ${styles.seoBlock}`}
          aria-labelledby="home-about"
        >
          <h2 id="home-about" className={styles.seoTitle}>
            {t("seoAboutTitle")}
          </h2>
          <p className={styles.seoBody}>{t("seoAboutBody")}</p>
        </section>

        <section
          className={`${shared.container} ${styles.seoBlock}`}
          aria-labelledby="home-popular"
        >
          <h2 id="home-popular" className={styles.seoTitle}>
            {t("seoPopularTitle")}
          </h2>
          <ul className={styles.popularList}>
            {featuredCountries.map((country) => (
              <li key={country.code}>
                <Link href={countryPath(country.code)}>{country.name}</Link>
              </li>
            ))}
          </ul>
        </section>

        <section
          className={`${shared.container} ${styles.seoBlock}`}
          aria-labelledby="home-faq"
        >
          <h2 id="home-faq" className={styles.seoTitle}>
            {t("seoFaqTitle")}
          </h2>
          <dl className={styles.faqList}>
            {faqItems.map((item) => (
              <div key={item.question} className={styles.faqItem}>
                <dt className={styles.faqQuestion}>{item.question}</dt>
                <dd className={styles.faqAnswer}>{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </>
  );
}
