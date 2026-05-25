import { getLocale } from "next-intl/server";

import { NotFoundContent } from "@/components";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

export default async function LocaleNotFound() {
  const locale = await getLocale();
  const resolved = isLocale(locale) ? locale : defaultLocale;

  return <NotFoundContent locale={resolved} />;
}
