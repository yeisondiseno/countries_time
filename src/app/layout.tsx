import type { Metadata } from "next";
import type { ReactNode } from "react";

import { JetBrains_Mono, Manrope } from "next/font/google";
import { headers } from "next/headers";

import { ConsentAdSenseScript } from "@/components/molecules/ConsentAdSenseScript";
import { ConsentAnalytics } from "@/components/molecules/ConsentAnalytics";
import { CookieConsentProvider, ThemeProvider, TimeFormatProvider } from "@/components";

import "@/styles/globals.css";

import { routing } from "@/i18n/routing";
import { getSiteOrigin } from "@/lib/seo/site-origin";

export const metadata: Metadata = {
  metadataBase: getSiteOrigin(),
};

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const headerList = await headers();
  const lang = headerList.get("x-next-intl-locale") ?? routing.defaultLocale;

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <script src="/theme-boot.js" />
      </head>
      <body className={`${manrope.variable} ${jetbrains.variable}`}>
        <CookieConsentProvider>
          <ThemeProvider>
            <TimeFormatProvider>{children}</TimeFormatProvider>
          </ThemeProvider>
          <ConsentAnalytics />
          <ConsentAdSenseScript />
        </CookieConsentProvider>
      </body>
    </html>
  );
}
