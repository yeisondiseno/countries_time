import { serializeJsonLd } from "@/lib/seo/serialize-json-ld";

type Props = Readonly<{
  data: Record<string, unknown> | readonly Record<string, unknown>[];
}>;

export function JsonLd({ data }: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
