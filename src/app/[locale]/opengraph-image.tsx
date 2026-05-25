import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";

import { routing } from "@/i18n/routing";
import { renderOgImage } from "@/lib/seo/og-image";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ locale: string }> };

export default async function LocaleOgImage(props: Props) {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) {
    return renderOgImage({ title: "Countries Time" });
  }

  const t = await getTranslations({ locale, namespace: "Home" });

  return renderOgImage({
    badge: t("eyebrow"),
    title: t("title"),
    subtitle: t("subtitle"),
  });
}
