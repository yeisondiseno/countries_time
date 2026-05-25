import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { routing } from "@/i18n/routing";
import type { Locale } from "@/lib/i18n/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

import shared from "@/styles/shared.module.css";

import styles from "../legal.module.css";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(props: Props) {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) {
    return { title: "Countries Time" };
  }
  const t = await getTranslations({ locale, namespace: "Legal" });
  return buildPageMetadata({
    locale: locale as Locale,
    title: `${t("termsTitle")} · Countries Time`,
    description: t("termsIntro"),
    pathWithoutLocale: "/terms",
  });
}

export default async function TermsPage(props: Props) {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const t = await getTranslations("Legal");

  return (
    <article className={`${shared.containerNarrow} ${styles.container}`}>
      <h1 className={styles.title}>{t("termsTitle")}</h1>
      <p className={styles.intro}>{t("termsIntro")}</p>
      <section className={styles.section}>
        <h2>{t("termsUseTitle")}</h2>
        <p>{t("termsUseBody")}</p>
      </section>
      <section className={styles.section}>
        <h2>{t("termsAccuracyTitle")}</h2>
        <p>{t("termsAccuracyBody")}</p>
      </section>
      <section className={styles.section}>
        <h2>{t("termsLiabilityTitle")}</h2>
        <p>{t("termsLiabilityBody")}</p>
      </section>
    </article>
  );
}
