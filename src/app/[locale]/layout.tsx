import type { ReactNode } from "react";

import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { AppShell } from "@/components/organisms/AppShell/AppShell";
import { getSiteOrigin } from "@/lib/seo/site-origin";

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Countries Time",
            url: getSiteOrigin().href,
            inLanguage: locale,
          }),
        }}
      />

      <NextIntlClientProvider locale={locale} messages={messages}>
        <AppShell>{children}</AppShell>
      </NextIntlClientProvider>
    </>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
