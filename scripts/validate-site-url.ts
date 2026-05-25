const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();

if (process.env.VERCEL_ENV !== "production") {
  console.log("validate:site-url skipped (not a Vercel production build)");
  process.exit(0);
}

if (!raw) {
  console.error(
    "NEXT_PUBLIC_SITE_URL is required for Vercel production builds.\n" +
      "Set it in Vercel → Settings → Environment Variables → Production\n" +
      "Example: https://www.countries-time.info",
  );
  process.exit(1);
}

let parsed: URL;

try {
  parsed = new URL(raw);
} catch {
  console.error(`NEXT_PUBLIC_SITE_URL is not a valid URL: ${raw}`);
  process.exit(1);
}

if (parsed.protocol !== "https:") {
  console.error("NEXT_PUBLIC_SITE_URL must use https:// in production.");
  process.exit(1);
}

if (parsed.hostname.includes("vercel.app")) {
  console.error(
    "NEXT_PUBLIC_SITE_URL must be your public domain, not a *.vercel.app URL.",
  );
  process.exit(1);
}

if (parsed.pathname !== "/" || parsed.search || parsed.hash) {
  console.error("NEXT_PUBLIC_SITE_URL must be the site origin only (no path).");
  process.exit(1);
}

console.log(`site URL OK: ${parsed.origin}`);
