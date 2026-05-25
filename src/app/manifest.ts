import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Countries Time",
    short_name: "Countries Time",
    description: "World clock and time zone comparator.",
    id: `/${routing.defaultLocale}`,
    start_url: `/${routing.defaultLocale}`,
    display: "standalone",
    background_color: "#0f1419",
    theme_color: "#5eead4",
  };
}
