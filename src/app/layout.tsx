import type { ReactNode } from "react";

import { JetBrains_Mono, Manrope } from "next/font/google";
import { headers } from "next/headers";

import { ThemeProvider } from "@/components";

import "@/styles/globals.css";

import { routing } from "@/i18n/routing";

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
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("countries-time-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t;}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${manrope.variable} ${jetbrains.variable}`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
