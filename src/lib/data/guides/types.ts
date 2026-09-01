import type { Locale } from "@/lib/i18n/config";

export type GuideFaqItem = Readonly<{ question: string; answer: string }>;

export type GuideSection = Readonly<{
  heading: string;
  paragraphs: readonly string[];
  listItems?: readonly string[];
}>;

export type GuideArticle = Readonly<{
  slug: string;
  category: "guide" | "comparison";
  updatedAt: string;
  title: Partial<Record<Locale, string>> & { en: string };
  description: Partial<Record<Locale, string>> & { en: string };
  sections: Partial<Record<Locale, readonly GuideSection[]>> & {
    en: readonly GuideSection[];
  };
  faq: Partial<Record<Locale, readonly GuideFaqItem[]>> & {
    en: readonly GuideFaqItem[];
  };
  relatedCountryCodes?: readonly string[];
  compareCodes?: readonly [string, string];
}>;

export function pickGuideLocalized<T>(
  copy: Partial<Record<Locale, T>> & { en: T },
  locale: Locale,
): T {
  return copy[locale] ?? copy.en;
}
