import type { ReactNode } from "react";

import { headers } from "next/headers";

import "@/styles/globals.css";

import { routing } from "@/i18n/routing";

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {

  const headerList = await headers();

  const lang = headerList.get("x-next-intl-locale") ?? routing.defaultLocale;

  return (
    <html lang={lang}>

      <body>{children}</body>


    </html>


  );


}
