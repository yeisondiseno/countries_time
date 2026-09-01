/**
 * Post-deploy smoke checks for countries-time.info production.
 * Usage: bun run verify:production
 */

export {};

const BASE =
  process.env.VERIFY_PRODUCTION_URL?.trim() ?? "https://www.countries-time.info";

type Check = {
  name: string;
  run: () => Promise<boolean>;
};

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: { "User-Agent": "countries-time-verify/1.0" },
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return response.text();
}

async function fetchHeaders(url: string): Promise<Headers> {
  const response = await fetch(url, {
    method: "HEAD",
    headers: { "User-Agent": "countries-time-verify/1.0" },
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return response.headers;
}

const checks: Check[] = [
  {
    name: "Security headers (HSTS, X-Frame-Options)",
    run: async () => {
      const headers = await fetchHeaders(`${BASE}/en`);
      return (
        headers.has("strict-transport-security") &&
        headers.get("x-frame-options")?.toLowerCase() === "deny"
      );
    },
  },
  {
    name: "CSP Report-Only header present",
    run: async () => {
      const headers = await fetchHeaders(`${BASE}/en`);
      return headers.has("content-security-policy-report-only");
    },
  },
  {
    name: "theme-boot.js served from /public",
    run: async () => {
      const body = await fetchText(`${BASE}/theme-boot.js`);
      return body.includes("countries-time-theme");
    },
  },
  {
    name: "/en/guides returns 200",
    run: async () => {
      const body = await fetchText(`${BASE}/en/guides`);
      return body.includes("guides") || body.includes("Guides");
    },
  },
  {
    name: "Guide article live",
    run: async () => {
      const body = await fetchText(
        `${BASE}/en/guides/como-programar-reuniones-internacionales`,
      );
      return body.length > 2000;
    },
  },
  {
    name: "Tier 1 country (ES) in sitemap",
    run: async () => {
      const sitemap = await fetchText(`${BASE}/sitemap.xml`);
      return sitemap.includes(`${BASE}/en/countries/es`);
    },
  },
  {
    name: "Tier 3 country (AW) excluded from sitemap",
    run: async () => {
      const sitemap = await fetchText(`${BASE}/sitemap.xml`);
      return !sitemap.includes("/countries/aw");
    },
  },
  {
    name: "Tier 3 country (AW) has noindex",
    run: async () => {
      const body = await fetchText(`${BASE}/en/countries/aw`);
      return body.includes('content="noindex');
    },
  },
  {
    name: "Country editorial SSR (ES)",
    run: async () => {
      const body = await fetchText(`${BASE}/en/countries/es`);
      return (
        body.includes("CountryPageEditorial") === false &&
        (body.includes("<article") || body.includes("<section"))
      );
    },
  },
  {
    name: "Cookie consent banner markup",
    run: async () => {
      const body = await fetchText(`${BASE}/en`);
      return (
        body.includes("cookie") ||
        body.includes("Cookie") ||
        body.includes("consent")
      );
    },
  },
  {
    name: "Footer links to /guides",
    run: async () => {
      const body = await fetchText(`${BASE}/en`);
      return body.includes("/guides");
    },
  },
];

let passed = 0;
let failed = 0;

console.log(`Verifying production: ${BASE}\n`);

for (const check of checks) {
  try {
    const ok = await check.run();
    if (ok) {
      console.log(`✓ ${check.name}`);
      passed += 1;
    } else {
      console.log(`✗ ${check.name} — assertion failed`);
      failed += 1;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`✗ ${check.name} — ${message}`);
    failed += 1;
  }
}

console.log(`\n${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
}
