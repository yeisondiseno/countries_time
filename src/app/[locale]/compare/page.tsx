import { hasLocale } from "next-intl";

import { getTranslations, setRequestLocale } from "next-intl/server";

import { notFound } from "next/navigation";

import type { Locale } from "@/lib/i18n/config";

import { WorldComparator } from "@/components/organisms/WorldComparator/WorldComparator";

import { routing } from "@/i18n/routing";


import { buildPageMetadata } from "@/lib/seo/metadata";


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


    description: tc("disclaimer"),

    pathWithoutLocale: "/compare",


  });


}

export default async function ComparatorPage(props: Props) {



  const { locale } = await props.params;


  if (!hasLocale(routing.locales, locale)) {


    notFound();


  }



  setRequestLocale(locale);


  const tc = await getTranslations("Compare");

  return (


    <section aria-labelledby="cmp-title">

      <h1 id="cmp-title">{tc("title")}</h1>


      <WorldComparator />


    </section>


  );


}

