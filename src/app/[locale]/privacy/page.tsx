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
    title: `${t("privacyTitle")} · Countries Time`,
    description: t("privacyIntro"),
    pathWithoutLocale: "/privacy",
  });
}

export default async function PrivacyPage(props: Props) {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const t = await getTranslations("Legal");

  return (
    <article className={`${shared.containerNarrow} ${styles.container}`}>
      <h1 className={styles.title}>{t("privacyTitle")}</h1>
      <p className={styles.intro}>{t("privacyIntro")}</p>
      <section className={styles.section}>
        <h2>{t("privacyDataTitle")}</h2>
        <p>{t("privacyDataBody")}</p>
      </section>
      <section className={styles.section}>
        <h2>{t("privacyCookiesTitle")}</h2>
        <p>{t("privacyCookiesBody")}</p>
      </section>
      <section className={styles.section}>
        <h2>{t("privacyThirdPartyTitle")}</h2>
        <p>{t("privacyThirdPartyBody")}</p>
      </section>
      <section className={styles.section}>
        <h2>{t("privacyRightsTitle")}</h2>
        <p>{t("privacyRightsBody")}</p>
      </section>
    </article>
  );
}
