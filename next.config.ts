import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  redirects: async () => [
    {
      source: "/favicon.ico",
      destination: "/icon",
      permanent: true,
    },
  ],
};

/**
 * Million quedó desactivado: con `next-intl` + RSC el build fallaba
 * (`compiledBlock` cliente/servidor). Reactivar sólo si hay pin/flags
 * compatibles documentados.
 */
export default withNextIntl(nextConfig);
