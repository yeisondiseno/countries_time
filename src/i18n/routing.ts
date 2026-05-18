import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "es", "fr", "pt", "de", "ja", "it", "ko"],
  defaultLocale: "en",
  localePrefix: "always",
});
