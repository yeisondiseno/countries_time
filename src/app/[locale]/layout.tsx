import type { ReactNode } from "react";

import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { AppShell } from "@/components";
import { routing } from "@/i18n/routing";
import { JsonLd } from "@/lib/seo/JsonLd";
import { buildWebSiteJsonLd } from "@/lib/seo/json-ld";

type Props = Readonly<{
  children: ReactNode;

  params: Promise<{ locale: string }>;
}>;

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <>
      <JsonLd data={buildWebSiteJsonLd(locale)} />

      <NextIntlClientProvider locale={locale} messages={messages}>
        <AppShell>{children}</AppShell>
      </NextIntlClientProvider>
    </>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
