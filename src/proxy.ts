import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const localePattern = routing.locales.join("|");
const upperCountryCode = new RegExp(
  `^/(${localePattern})/countries/([A-Z]{2})$`,
);
const localePrefixedIcon = new RegExp(
  `^/(${localePattern})/(icon|apple-icon)$`,
);

const rootIconPaths = new Set(["/icon", "/apple-icon", "/favicon.ico"]);

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (rootIconPaths.has(pathname)) {
    return NextResponse.next();
  }

  const iconMatch = pathname.match(localePrefixedIcon);
  if (iconMatch) {
    const url = request.nextUrl.clone();
    url.pathname = `/${iconMatch[2]}`;
    return NextResponse.redirect(url, 308);
  }

  const upperMatch = pathname.match(upperCountryCode);

  if (upperMatch) {
    const url = request.nextUrl.clone();
    url.pathname = `/${upperMatch[1]}/countries/${upperMatch[2]!.toLowerCase()}`;
    return NextResponse.redirect(url, 301);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|robots.txt|sitemap.xml|ads.txt|manifest.webmanifest|icon|apple-icon|favicon.ico|.*\\..*).*)",
  ],
};
