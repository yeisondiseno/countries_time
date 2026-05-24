import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { WorldComparator } from "@/components";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/lib/i18n/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(props: Props) {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) {
    return { title: "Countries Time" };
  }
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const tc = await getTranslations({ locale, namespace: "Compare" });
  return buildPageMetadata({
    locale: locale as Locale,
    title: `${tc("title")} · ${tCommon("siteName")}`,
    description: tc("subtitle"),
    pathWithoutLocale: "/compare",
  });
}

export default async function ComparatorPage(props: Props) {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  return <WorldComparator />;
}
