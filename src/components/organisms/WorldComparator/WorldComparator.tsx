"use client";

import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { DateTime } from "luxon";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/lib/i18n/config";
import { countriesZones } from "@/lib/data/countries";
import { formatCountryRegion } from "@/lib/time/display";
import styles from "./WorldComparator.module.css";

const CMP_CODES = ["DE", "ES", "JP", "US"] as const;

type CmpForm = {

  anchorCountry: string;


  anchorZone: string;


  date: string;



  time: string;


};

function utcMillisFromWall(values: CmpForm):

  | { ok: true; utcMillis: number }

  | { ok: false } {

  const wall = DateTime.fromISO(`${values.date}T${values.time}`, {


    zone: values.anchorZone,


  });


  if (!wall.isValid) {


    return { ok: false };


  }


  return { ok: true, utcMillis: wall.toUTC().toMillis() };


}

function fmtFromUtc(localeStr: string, utcMillis: number, zoneId: string) {


  return DateTime.fromMillis(utcMillis, { zone: zoneId })

    .setLocale(localeStr)



    .toLocaleString(DateTime.DATETIME_FULL);


}

function buildDefaults(firstCode: (typeof CMP_CODES)[number]): CmpForm {


  const zone = countriesZones.countries[firstCode]!.defaultZone;


  const now = DateTime.now().setZone(zone).startOf("minute");


  return {


    anchorCountry: firstCode,


    anchorZone: zone,

    date: now.toFormat("yyyy-LL-dd"),


    time: now.toFormat("HH:mm"),


  };


}

export function WorldComparator() {

  const locale = useLocale() as Locale;


  const tc = useTranslations("Common");


  const t = useTranslations("Compare");


  const { register, setValue, control } = useForm<CmpForm>({

    mode: "onChange",

    defaultValues: buildDefaults(CMP_CODES[0]),

  });


  const watched = useWatch({ control }) as CmpForm;


  const anchorCountry = watched.anchorCountry;


  const anchorEntry =
    anchorCountry && countriesZones.countries[anchorCountry]
      ? countriesZones.countries[anchorCountry]


      : undefined;



  useEffect(() => {


    if (!anchorCountry || !anchorEntry) {


      return;


    }



    const nextZone = anchorEntry.defaultZone;



    const snap = DateTime.now().setZone(nextZone).startOf("minute");


    setValue("anchorZone", nextZone);


    setValue("date", snap.toFormat("yyyy-LL-dd"));


    setValue("time", snap.toFormat("HH:mm"));

  }, [anchorCountry, anchorEntry, setValue]);



  useEffect(() => {


    if (!anchorEntry) {


      return;


    }



    if (!anchorEntry.zones.includes(watched.anchorZone)) {


      setValue("anchorZone", anchorEntry.defaultZone);


    }

  }, [anchorEntry, watched.anchorZone, setValue]);



  const utcResult = useMemo(() => utcMillisFromWall(watched), [watched]);


  const zoneChoices = anchorEntry?.zones ?? [];



  const zoneSelectLabel =
    zoneChoices.length > 1 ? tc("zoneNoticeMulti") : t("tableZone");



  return (


    <div className={styles.wrap}>

      <form className={styles.grid}>



        <p id="cmp-help" className={styles.help}>


          {t("disclaimer")}


        </p>



        <fieldset className={styles.fieldset} aria-describedby="cmp-help">


          <legend>{t("title")}</legend>



          <div className={styles.row}>



            <label htmlFor="anchor-country">{t("anchorLabel")}</label>


            <select id="anchor-country" {...register("anchorCountry", { required: true })}>


              {CMP_CODES.map((code) => (


                <option key={code} value={code}>

                  {formatCountryRegion(code, locale)} ({code})


                </option>


              ))}


            </select>


          </div>



          <div className={styles.row}>


            <label htmlFor="anchor-zone">{zoneSelectLabel}</label>


            <select
              id="anchor-zone"


              disabled={zoneChoices.length <= 1}


              {...register("anchorZone", { required: true })}


            >
              {zoneChoices.map((zone) => (



                <option key={zone} value={zone}>



                  {zone.replace(/_/g, " ")}


                </option>


              ))}


            </select>


          </div>



          <div className={styles.split}>

            <div className={styles.row}>


              <label htmlFor="anchor-date">{t("dateLabel")}</label>



              <input id="anchor-date" type="date" {...register("date", { required: true })} />



            </div>



            <div className={styles.row}>



              <label htmlFor="anchor-time">{t("timeLabel")}</label>



              <input





                id="anchor-time"


                type="time"



                step={60}




                {...register("time", { required: true })}



              />



            </div>


          </div>


        </fieldset>



        {!utcResult.ok ? (

          <div className={styles.alert} role="alert">


            {t("validationError")}


          </div>


        ) : null}



        {utcResult.ok && anchorCountry ? (
          <section className={styles.results} aria-label={t("title")}>



            <h2 className={styles.visuallyHidden}>{t("title")}</h2>



            <table className={styles.table}>



              <thead>



                <tr>


                  <th scope="col">{t("tableCountry")}</th>



                  <th scope="col">{t("tableZone")}</th>



                  <th scope="col">{t("tableEquivalent")}</th>



                </tr>



              </thead>



              <tbody>



                {CMP_CODES.map((code) => {


                  const row = countriesZones.countries[code];

                  if (!row) return null;



                  const zoneForRow =
                    code === anchorCountry ? watched.anchorZone : row.defaultZone;



                  const isAnchor = code === anchorCountry;


                  return (
                    <tr key={code} className={isAnchor ? styles.anchorRow : undefined}>

                      <th scope="row">{formatCountryRegion(code, locale)}</th>



                      <td>



                        <code>{zoneForRow}</code>


                      </td>


                      <td>{fmtFromUtc(locale, utcResult.utcMillis, zoneForRow)}</td>


                    </tr>


                  );


                })}



              </tbody>


            </table>


          </section>


        ) : null}


      </form>


    </div>


  );


}

