import type { NextConfig } from "next";
import million from "million/compiler";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

/**
 * Million + App Router bajo `src/app`: usar `auto.rsc` según docs de Million.
 * Si el build falla con detección de `app/` en `src/`, revisar workaround en:
 * https://github.com/aidenybai/million/issues/958
 */
const millionConfig = {
  auto: { rsc: true },
};

export default withNextIntl(million.next(nextConfig, millionConfig));
