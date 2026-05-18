import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { CountryDirectory } from "@/components/organisms/CountryDirectory/CountryDirectory";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/lib/i18n/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(props: Props) {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) {
    return { title: "Countries Time" };
  }
  const t = await getTranslations({ locale, namespace: "Common" });
  return buildPageMetadata({
    locale: locale as Locale,
    title: `${t("countriesTitle")} · ${t("siteName")}`,
    description: t("homeIntro"),
    pathWithoutLocale: "/countries",
  });
}

export default async function CountriesDirectory(props: Props) {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  return <CountryDirectory />;
}
