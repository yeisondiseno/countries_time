/** Normaliza rutas de país a minúsculas para canonical, sitemap y hreflang. */
export function countryPath(code: string): `/countries/${string}` {
  return `/countries/${code.toLowerCase()}`;
}
