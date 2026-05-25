import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { FiArrowRight } from "react-icons/fi";

import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/lib/i18n/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

import shared from "@/styles/shared.module.css";

import styles from "./page.module.css";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(props: Props) {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) {
    return { title: "Countries Time" };
  }
  const t = await getTranslations({ locale, namespace: "Home" });
  return buildPageMetadata({
    locale: locale as Locale,
    title: t("metaTitle"),
    description: t("metaDescription"),
    pathWithoutLocale: "/",
  });
}

export default async function LocaleHome(props: Props) {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const t = await getTranslations("Home");

  return (
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
  );
}
