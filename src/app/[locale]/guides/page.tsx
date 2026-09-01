import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { GUIDE_ARTICLES, pickGuideLocalized } from "@/lib/data/guides";
import type { Locale } from "@/lib/i18n/config";
import { JsonLd } from "@/lib/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";

import shared from "@/styles/shared.module.css";

import styles from "./guides.module.css";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(props: Props) {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) {
    return { title: "Countries Time" };
  }
  const t = await getTranslations({ locale, namespace: "Guides" });
  return buildPageMetadata({
    locale: locale as Locale,
    title: t("indexMetaTitle"),
    description: t("indexMetaDescription"),
    pathWithoutLocale: "/guides",
  });
}

export default async function GuidesIndexPage(props: Props) {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const localeCode = locale as Locale;
  const t = await getTranslations("Guides");
  const tCommon = await getTranslations("Common");

  const webPageJsonLd = buildWebPageJsonLd({
    locale: localeCode,
    pathWithoutLocale: "/guides",
    name: t("indexMetaTitle"),
    description: t("indexMetaDescription"),
  });

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(localeCode, [
    { name: tCommon("siteName"), path: "/" },
    { name: t("indexTitle"), path: "/guides" },
  ]);

  return (
    <>
      <JsonLd data={[webPageJsonLd, breadcrumbJsonLd]} />
      <article className={`${shared.containerNarrow} ${styles.container}`}>
        <h1 className={styles.title}>{t("indexTitle")}</h1>
        <p className={styles.intro}>{t("indexIntro")}</p>
        <div className={styles.cardGrid}>
          {GUIDE_ARTICLES.map((article) => {
            const title = pickGuideLocalized(article.title, localeCode);
            const description = pickGuideLocalized(article.description, localeCode);
            return (
              <Link
                key={article.slug}
                href={`/guides/${article.slug}`}
                className={styles.card}
              >
                <span className={styles.badge}>
                  {article.category === "comparison"
                    ? t("badgeComparison")
                    : t("badgeGuide")}
                </span>
                <h2>{title}</h2>
                <p>{description}</p>
              </Link>
            );
          })}
        </div>
      </article>
    </>
  );
}
