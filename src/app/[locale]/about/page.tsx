import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/lib/i18n/config";
import { JsonLd } from "@/lib/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";

import shared from "@/styles/shared.module.css";

import styles from "../legal.module.css";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(props: Props) {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) {
    return { title: "Countries Time" };
  }
  const t = await getTranslations({ locale, namespace: "About" });
  return buildPageMetadata({
    locale: locale as Locale,
    title: `${t("metaTitle")} · Countries Time`,
    description: t("metaDescription"),
    pathWithoutLocale: "/about",
  });
}

export default async function AboutPage(props: Props) {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const t = await getTranslations("About");
  const tCommon = await getTranslations("Common");
  const localeCode = locale as Locale;
  const metaTitle = `${t("metaTitle")} · Countries Time`;

  const webPageJsonLd = buildWebPageJsonLd({
    locale: localeCode,
    pathWithoutLocale: "/about",
    name: metaTitle,
    description: t("metaDescription"),
  });

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(localeCode, [
    { name: tCommon("siteName"), path: "/" },
    { name: t("metaTitle"), path: "/about" },
  ]);

  const sections = [
    { title: t("missionTitle"), body: t("missionBody") },
    { title: t("audienceTitle"), body: t("audienceBody") },
    { title: t("dataTitle"), body: t("dataBody") },
    { title: t("methodTitle"), body: t("methodBody") },
    { title: t("limitsTitle"), body: t("limitsBody") },
  ] as const;

  return (
    <>
      <JsonLd data={[webPageJsonLd, breadcrumbJsonLd]} />
      <article className={`${shared.containerNarrow} ${styles.container}`}>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.intro}>{t("intro")}</p>
        {sections.map((section) => (
          <section key={section.title} className={styles.section}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </section>
        ))}
        <section className={styles.section}>
          <h2>{t("exploreTitle")}</h2>
          <p>{t("exploreBody")}</p>
          <p>
            <Link href="/countries">{t("exploreCountries")}</Link>
            {" · "}
            <Link href="/compare">{t("exploreCompare")}</Link>
            {" · "}
            <Link href="/contact">{t("exploreContact")}</Link>
          </p>
        </section>
      </article>
    </>
  );
}
