import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import { GUIDE_SLUGS } from "@/lib/data/guides";
import { listIndexableCountryCodes } from "@/lib/data/country-tiers";
import { getSiteOrigin } from "@/lib/seo/site-origin";

const baseRoutes = [
  { path: "", changefreq: "weekly" as const, priority: 1 },
  { path: "/countries", changefreq: "weekly" as const, priority: 0.9 },
  { path: "/compare", changefreq: "weekly" as const, priority: 0.9 },
  { path: "/guides", changefreq: "weekly" as const, priority: 0.85 },
  { path: "/about", changefreq: "monthly" as const, priority: 0.5 },
  { path: "/contact", changefreq: "monthly" as const, priority: 0.5 },
  { path: "/privacy", changefreq: "monthly" as const, priority: 0.3 },
  { path: "/terms", changefreq: "monthly" as const, priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteOrigin();
  const urls: MetadataRoute.Sitemap = [];
  const indexableCountries = listIndexableCountryCodes();

  for (const locale of routing.locales) {
    for (const route of baseRoutes) {
      urls.push({
        url: new URL(`/${locale}${route.path}`, base).href,
        changeFrequency: route.changefreq,
        priority: route.priority,
      });
    }

    for (const slug of GUIDE_SLUGS) {
      urls.push({
        url: new URL(`/${locale}/guides/${slug}`, base).href,
        changeFrequency: "monthly",
        priority: 0.75,
      });
    }

    for (const code of indexableCountries) {
      urls.push({
        url: new URL(`/${locale}/countries/${code.toLowerCase()}`, base).href,
        changeFrequency: "daily",
        priority: 0.8,
      });
    }
  }

  return urls;
}
