import { hasLocale } from "next-intl";


import { Link } from "@/i18n/navigation";

import { getTranslations, setRequestLocale } from "next-intl/server";

import { notFound } from "next/navigation";

import type { Locale } from "@/lib/i18n/config";


import { LiveClock } from "@/components/atoms/LiveClock/LiveClock";


import { findCountry, listCountryCodesSorted } from "@/lib/data/countries";


import { buildPageMetadata } from "@/lib/seo/metadata";

import { formatCountryRegion } from "@/lib/time/display";


import { routing } from "@/i18n/routing";


type Props = {


  params: Promise<{ locale: string; countryCode: string }>;


};

export function generateStaticParams() {


  return listCountryCodesSorted().map((code) => ({



    countryCode: code.toLowerCase(),



  }));


}

export async function generateMetadata(props: Props) {



  const { locale, countryCode } = await props.params;



  if (!hasLocale(routing.locales, locale)) {


    return { title: "Countries Time" };


  }



  const hit = findCountry(countryCode);


  if (!hit) {


    return { title: "Countries Time" };


  }



  const tCommon = await getTranslations({ locale, namespace: "Common" });


  const tc = await getTranslations({ locale, namespace: "Country" });



  const pretty = formatCountryRegion(hit.code, locale as Locale);


  return buildPageMetadata({


    locale: locale as Locale,


    title: `${pretty} (${hit.code}) · ${tCommon("siteName")}`,


    description: tc("capitalIntro", {


      country: pretty,



      capital: hit.capital,



    }),



    pathWithoutLocale: `/countries/${hit.code}`,


  });


}

export default async function CountryDetail(props: Props) {



  const { locale, countryCode } = await props.params;



  if (!hasLocale(routing.locales, locale)) {


    notFound();


  }



  setRequestLocale(locale);


  const hit = findCountry(countryCode);


  if (!hit) {


    notFound();


  }



  const tCommon = await getTranslations("Common");


  const tc = await getTranslations("Country");


  const pretty = formatCountryRegion(hit.code, locale as Locale);

  return (
    <article>


      <h1>


        {pretty} ({hit.code})


      </h1>



      <p>{tc("capitalIntro", { country: pretty, capital: hit.capital })}</p>


      <LiveClock


        key={`${locale}:${hit.code}:${hit.defaultZone}`}




        timeZone={hit.defaultZone}


      />



      {hit.zones.length > 1 ? (


        <section aria-labelledby="multi-zone">



          <h2 id="multi-zone">{tCommon("zoneNoticeMulti")}</h2>



          <ul>



            {hit.zones.map((z) => (


              <li key={z}>
                <code>{z}</code>
              </li>


            ))}



          </ul>


        </section>


      ) : null}



      <section aria-labelledby="faq">



        <h2 id="faq">{tc("faqHeading")}</h2>



        <dl>


          <dt>{tCommon("faqTimeTitle")}</dt>


          <dd>{tCommon("faqDstBody")}</dd>


          <dt>{tCommon("compareSectionTitle")}</dt>


          <dd>


            <Link href="/compare">{tCommon("linkComparator")}</Link>


          </dd>


        </dl>


      </section>



      <p>


        <Link href="/countries">



          {tc("backToDirectory", { title: tCommon("countriesTitle") })}


        </Link>


      </p>


    </article>


  );


}

