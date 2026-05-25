/** Canonical origin for metadata, sitemap, robots and JSON-LD. Set NEXT_PUBLIC_SITE_URL in Vercel Production. */
export function getSiteOrigin(): URL {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

  return new URL(raw.endsWith("/") ? raw.slice(0, -1) : raw);
}
