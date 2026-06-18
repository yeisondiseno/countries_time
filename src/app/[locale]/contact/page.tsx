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
  const t = await getTranslations({ locale, namespace: "Contact" });
  return buildPageMetadata({
    locale: locale as Locale,
    title: `${t("metaTitle")} · Countries Time`,
    description: t("metaDescription"),
    pathWithoutLocale: "/contact",
  });
}

export default async function ContactPage(props: Props) {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const t = await getTranslations("Contact");
  const tLegal = await getTranslations("Legal");
  const tCommon = await getTranslations("Common");
  const localeCode = locale as Locale;
  const metaTitle = `${t("metaTitle")} · Countries Time`;
  const email = tLegal("contactEmail");

  const webPageJsonLd = buildWebPageJsonLd({
    locale: localeCode,
    pathWithoutLocale: "/contact",
    name: metaTitle,
    description: t("metaDescription"),
  });

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(localeCode, [
    { name: tCommon("siteName"), path: "/" },
    { name: t("metaTitle"), path: "/contact" },
  ]);

  return (
    <>
      <JsonLd data={[webPageJsonLd, breadcrumbJsonLd]} />
      <article className={`${shared.containerNarrow} ${styles.container}`}>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.intro}>{t("intro")}</p>
        <section className={styles.section}>
          <h2>{tLegal("contactEmailLabel")}</h2>
          <ul className={styles.contactList}>
            <li>
              <a href={`mailto:${email}`}>{email}</a>
            </li>
          </ul>
        </section>
        <section className={styles.section}>
          <h2>{t("responseTitle")}</h2>
          <p>{t("responseBody")}</p>
        </section>
        <section className={styles.section}>
          <h2>{t("privacyTitle")}</h2>
          <p>
            {t("privacyBody")} <Link href="/privacy">{t("privacyLink")}</Link>.
          </p>
        </section>
      </article>
    </>
  );
}
