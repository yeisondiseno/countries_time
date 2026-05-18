import { Link } from "@/i18n/navigation";
import type { Locale } from "@/lib/i18n/config";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { listCountryCodesSorted } from "@/lib/data/countries";
import { buildPageMetadata } from "@/lib/seo/metadata";

import { formatCountryRegion } from "@/lib/time/display";

import { routing } from "@/i18n/routing";


type Props = { params: Promise<{ locale: string }> };



export async function generateMetadata(props: Props) {



  const { locale } = await props.params;


  if (!hasLocale(routing.locales, locale)) {


    return { title: "Countries Time" };


  }



  const t = await getTranslations({ locale, namespace: "Common" });



  return buildPageMetadata({


    locale: locale as Locale,


    title: `${t("countriesTitle")} · ${t("siteName")}`,


    description: `${t("countriesTitle")} · ${t("homeIntro")}`,


    pathWithoutLocale: "/countries",



  });


}

export default async function CountriesDirectory(props: Props) {



  const { locale } = await props.params;


  if (!hasLocale(routing.locales, locale)) {


    notFound();


  }



  setRequestLocale(locale);


  const t = await getTranslations("Common");


  const codes = listCountryCodesSorted();



  return (


    <article>


      <h1>{t("countriesTitle")}</h1>


      <ul>


        {codes.map((code) => (


          <li key={code}>
            <Link href={`/countries/${code.toLowerCase()}`}>{formatCountryRegion(code, locale)}</Link>
          </li>


        ))}


      </ul>


      <p>


        <Link href="/compare">{t("linkComparator")}</Link>


      </p>


    </article>


  );


}

