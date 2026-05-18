import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Countries Time",
    short_name: "Countries Time",
    description: "World clock & comparator microsite (MVP scaffold).",
    id: "/",
    start_url: "/",

    display: "standalone",

    background_color: "#0f1419",

    theme_color: "#5eead4",
  };
}
