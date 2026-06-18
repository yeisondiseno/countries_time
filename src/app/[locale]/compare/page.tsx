import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { WorldComparator } from "@/components";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/lib/i18n/config";
import { JsonLd } from "@/lib/seo/JsonLd";
import {
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
  buildWebPageJsonLd,
} from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import shared from "@/styles/shared.module.css";
import styles from "./page.module.css";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(props: Props) {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) {
    return { title: "Countries Time" };
  }
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const tc = await getTranslations({ locale, namespace: "Compare" });
  return buildPageMetadata({
    locale: locale as Locale,
    title: `${tc("title")} · ${tCommon("siteName")}`,
    description: tc("subtitle"),
    pathWithoutLocale: "/compare",
  });
}

export default async function ComparatorPage(props: Props) {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const tc = await getTranslations({ locale, namespace: "Compare" });
  const metaTitle = `${tc("title")} · ${tCommon("siteName")}`;

  const editorialFaq = [
    { question: tc("editorialFaqQ1"), answer: tc("editorialFaqA1") },
    { question: tc("editorialFaqQ2"), answer: tc("editorialFaqA2") },
    { question: tc("editorialFaqQ3"), answer: tc("editorialFaqA3") },
  ];

  const webPageJsonLd = buildWebPageJsonLd({
    locale: locale as Locale,
    pathWithoutLocale: "/compare",
    name: metaTitle,
    description: tc("subtitle"),
  });

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(locale as Locale, [
    { name: tCommon("siteName"), path: "/" },
    { name: tc("title"), path: "/compare" },
  ]);

  const faqJsonLd = buildFaqPageJsonLd(editorialFaq);

  const tutorialSteps = [
    tc("tutorialStep1"),
    tc("tutorialStep2"),
    tc("tutorialStep3"),
    tc("tutorialStep4"),
  ];

  return (
    <>
      <JsonLd data={[webPageJsonLd, breadcrumbJsonLd, faqJsonLd]} />
      <WorldComparator />
      <div className={`${shared.container} ${styles.compareEditorial}`}>
        <section
          className={styles.editorialBlock}
          aria-labelledby="compare-about"
        >
          <h2 id="compare-about" className={styles.editorialTitle}>
            {tc("editorialTitle")}
          </h2>
          <p className={styles.editorialBody}>{tc("editorialIntro")}</p>
        </section>
        <section
          className={styles.editorialBlock}
          aria-labelledby="compare-tutorial"
        >
          <h2 id="compare-tutorial" className={styles.editorialTitle}>
            {tc("tutorialTitle")}
          </h2>
          <ol className={styles.stepsList}>
            {tutorialSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
        <section
          className={styles.editorialBlock}
          aria-labelledby="compare-example"
        >
          <h2 id="compare-example" className={styles.editorialTitle}>
            {tc("exampleTitle")}
          </h2>
          <p className={styles.editorialBody}>{tc("exampleBody")}</p>
        </section>
        <section
          className={styles.editorialBlock}
          aria-labelledby="compare-faq"
        >
          <h2 id="compare-faq" className={styles.editorialTitle}>
            {tc("editorialFaqTitle")}
          </h2>
          <dl className={styles.faqList}>
            {editorialFaq.map((item) => (
              <div key={item.question}>
                <dt className={styles.faqQuestion}>{item.question}</dt>
                <dd className={styles.faqAnswer}>{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </>
  );
}
