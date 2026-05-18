import { hasLocale } from "next-intl";

import { getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";

import { routing } from "@/i18n/routing";


import type { Locale } from "@/lib/i18n/config";


import { notFound } from "next/navigation";


import { buildPageMetadata } from "@/lib/seo/metadata";


type Props = { params: Promise<{ locale: string }> };


export async function generateMetadata(props: Props) {


  const { locale } = await props.params;


  if (!hasLocale(routing.locales, locale)) {


    return { title: "Countries Time" };


  }



  const t = await getTranslations({ locale, namespace: "Common" });



  return buildPageMetadata({


    locale: locale as Locale,


    title: t("siteName"),


    description: t("homeIntro"),



    pathWithoutLocale: "/",


  });


}



export default async function LocaleHome(props: Props) {



  const { locale } = await props.params;



  if (!hasLocale(routing.locales, locale)) {


    notFound();


  }



  setRequestLocale(locale);


  const t = await getTranslations("Common");

  return (
    <article>


      <h1>{t("siteName")}</h1>


      <p>{t("homeIntro")}</p>


      <nav aria-label={t("siteName")}>


        <ul>


          <li>


            <Link href="/countries">{t("navCountries")}</Link>



          </li>



          <li>


            <Link href="/compare">{t("navCompare")}</Link>


          </li>


        </ul>


      </nav>


    </article>


  );


}

