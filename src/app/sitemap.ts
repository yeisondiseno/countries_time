import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import { listCountryCodesSorted } from "@/lib/data/countries";
import { getSiteOrigin } from "@/lib/seo/site-origin";

const baseRoutes = [
  { path: "", changefreq: "weekly" as const, priority: 1 },
  { path: "/countries", changefreq: "weekly" as const, priority: 0.9 },
  { path: "/compare", changefreq: "weekly" as const, priority: 0.9 },
  { path: "/privacy", changefreq: "monthly" as const, priority: 0.3 },
  { path: "/terms", changefreq: "monthly" as const, priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteOrigin();
  const urls: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const route of baseRoutes) {
      urls.push({
        url: new URL(`/${locale}${route.path}`, base).href,
        changeFrequency: route.changefreq,
        priority: route.priority,
      });
    }

    for (const code of listCountryCodesSorted()) {
      urls.push({
        url: new URL(`/${locale}/countries/${code.toLowerCase()}`, base).href,
        changeFrequency: "daily",
        priority: 0.8,
      });
    }
  }

  return urls;
}
