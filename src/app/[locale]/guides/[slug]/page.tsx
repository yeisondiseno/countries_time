import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { findCountry } from "@/lib/data/countries";
import { getGuideBySlug, GUIDE_SLUGS, pickGuideLocalized } from "@/lib/data/guides";
import type { Locale } from "@/lib/i18n/config";
import { JsonLd } from "@/lib/seo/JsonLd";
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
} from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { countryPath } from "@/lib/seo/paths";
import { formatCountryRegion } from "@/lib/time/display";
import shared from "@/styles/shared.module.css";
import styles from "../guides.module.css";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return GUIDE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata(props: Props) {
  const { locale, slug } = await props.params;
  if (!hasLocale(routing.locales, locale)) {
    return { title: "Countries Time" };
  }
  const article = getGuideBySlug(slug);
  if (!article) {
    return { title: "Countries Time" };
  }
  const localeCode = locale as Locale;
  const title = pickGuideLocalized(article.title, localeCode);
  const description = pickGuideLocalized(article.description, localeCode);
  return buildPageMetadata({
    locale: localeCode,
    title: `${title} · Countries Time`,
    description,
    pathWithoutLocale: `/guides/${slug}`,
  });
}

export default async function GuideArticlePage(props: Props) {
  const { locale, slug } = await props.params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const article = getGuideBySlug(slug);
  if (!article) {
    notFound();
  }

  setRequestLocale(locale);
  const localeCode = locale as Locale;
  const t = await getTranslations("Guides");
  const tCommon = await getTranslations("Common");

  const title = pickGuideLocalized(article.title, localeCode);
  const description = pickGuideLocalized(article.description, localeCode);
  const sections = pickGuideLocalized(article.sections, localeCode);
  const faq = pickGuideLocalized(article.faq, localeCode);
  const path = `/guides/${slug}` as const;

  const articleJsonLd = buildArticleJsonLd({
    locale: localeCode,
    pathWithoutLocale: path,
    headline: title,
    description,
    dateModified: article.updatedAt,
  });

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(localeCode, [
    { name: tCommon("siteName"), path: "/" },
    { name: t("indexTitle"), path: "/guides" },
    { name: title, path },
  ]);

  const faqJsonLd = faq.length > 0 ? buildFaqPageJsonLd(faq) : null;

  const relatedCountries = (article.relatedCountryCodes ?? []).flatMap((code) => {
    const hit = findCountry(code);
    if (!hit) {
      return [];
    }
    return [
      {
        code: hit.code,
        name: formatCountryRegion(hit.code, localeCode),
        href: countryPath(hit.code),
      },
    ];
  });

  const compareHref =
    article.compareCodes && article.compareCodes.length === 2
      ? `/compare?a=${article.compareCodes[0].toLowerCase()}&b=${article.compareCodes[1].toLowerCase()}`
      : "/compare";

  return (
    <>
      <JsonLd
        data={[articleJsonLd, breadcrumbJsonLd, ...(faqJsonLd ? [faqJsonLd] : [])]}
      />
      <article className={`${shared.containerNarrow} ${styles.container}`}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.intro}>{description}</p>
        <p className={styles.updated}>
          {t("updatedLabel")}: {article.updatedAt}
        </p>

        {sections.map((section) => (
          <section key={section.heading} className={styles.section}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
            {section.listItems ? (
              <ul>
                {section.listItems.map((item) => (
                  <li key={item.slice(0, 40)}>{item}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}

        {faq.length > 0 ? (
          <section className={styles.faq} aria-labelledby="guide-faq">
            <h2 id="guide-faq">{t("faqTitle")}</h2>
            <dl>
              {faq.map((item) => (
                <div key={item.question} className={styles.faqItem}>
                  <dt>{item.question}</dt>
                  <dd>{item.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        <nav className={styles.links} aria-label={t("relatedLinksLabel")}>
          <Link href={compareHref}>{t("openComparator")}</Link>
          <Link href="/guides">{t("backToGuides")}</Link>
        </nav>

        {relatedCountries.length > 0 ? (
          <section className={styles.section}>
            <h2>{t("relatedCountriesTitle")}</h2>
            <div className={styles.links}>
              {relatedCountries.map((country) => (
                <Link key={country.code} href={country.href}>
                  {country.name}
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </article>
    </>
  );
}
