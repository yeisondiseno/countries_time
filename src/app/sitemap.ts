import type { MetadataRoute } from "next";

import { listCountryCodesSorted } from "@/lib/data/countries";

import { routing } from "@/i18n/routing";

import { getSiteOrigin } from "@/lib/seo/site-origin";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteOrigin();

  const urls: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    urls.push({
      url: new URL(`/${locale}`, base).href,
      lastModified: new Date(),
    });

    urls.push({
      url: new URL(`/${locale}/countries`, base).href,

      lastModified: new Date(),
    });

    urls.push({
      url: new URL(`/${locale}/compare`, base).href,

      lastModified: new Date(),
    });

    for (const code of listCountryCodesSorted()) {
      urls.push({
        url: new URL(`/${locale}/countries/${code.toLowerCase()}`, base).href,

        lastModified: new Date(),
      });
    }
  }

  return urls;
}
