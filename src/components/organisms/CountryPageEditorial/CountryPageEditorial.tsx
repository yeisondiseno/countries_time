import { getTranslations } from "next-intl/server";
import { FiArrowRight } from "react-icons/fi";

import { Link } from "@/i18n/navigation";
import { flagEmoji } from "@/lib/display/flags";
import type { Locale } from "@/lib/i18n/config";
import { formatCountryRegion } from "@/lib/time/display";

import shared from "@/styles/shared.module.css";

import styles from "../CountryPageView/CountryPageView.module.css";

type RelatedCountry = Readonly<{
  code: string;
  name: string;
  href: string;
}>;

type Props = Readonly<{
  locale: Locale;
  code: string;
  capital: string;
  zone: string;
  editorialOverview?: string | null;
  editorialDstNotes?: string | null;
  editorialPracticalTip?: string | null;
  relatedCountries?: readonly RelatedCountry[];
  compareLinks?: readonly RelatedCountry[];
}>;

export async function CountryPageEditorial({
  locale,
  code,
  capital,
  zone,
  editorialOverview,
  editorialDstNotes,
  editorialPracticalTip,
  relatedCountries = [],
  compareLinks = [],
}: Props) {
  const t = await getTranslations({ locale, namespace: "Country" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const pretty = formatCountryRegion(code, locale);

  return (
    <section className={`${shared.container} ${styles.body}`}>
      <div className={styles.main}>
        <div className={styles.prose}>
          <h2>{t("aboutHeading")}</h2>
          {editorialOverview ? (
            <p>{editorialOverview}</p>
          ) : (
            <p>{t("capitalIntro", { country: pretty, capital })}</p>
          )}
          <p>{t("zoneExplain", { country: pretty, zone })}</p>
          {editorialDstNotes ? (
            <>
              <h3>{t("dstNotesHeading")}</h3>
              <p>{editorialDstNotes}</p>
            </>
          ) : null}
          {editorialPracticalTip ? (
            <>
              <h3>{t("practicalTipHeading")}</h3>
              <p>{editorialPracticalTip}</p>
            </>
          ) : null}
        </div>

        {compareLinks.length > 0 ? (
          <div className={styles.prose}>
            <h2>{t("compareWithTitle")}</h2>
            <ul className={styles.relatedList}>
              {compareLinks.map((item) => (
                <li key={item.code}>
                  <Link href={item.href}>
                    {flagEmoji(item.code)} {item.name}
                    <FiArrowRight aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {relatedCountries.length > 0 ? (
          <div className={styles.prose}>
            <h2>{t("relatedCountriesTitle")}</h2>
            <ul className={styles.relatedList}>
              {relatedCountries.map((item) => (
                <li key={item.code}>
                  <Link href={item.href}>
                    {flagEmoji(item.code)} {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className={styles.prose}>
          <h2 id="faq">{t("faqHeading")}</h2>
          <div className={styles.faq}>
            <details>
              <summary>{tCommon("faqTimeTitle")}</summary>
              <div className={styles.faqBody}>{tCommon("faqDstBody")}</div>
            </details>
            <details>
              <summary>{t("faqQ2")}</summary>
              <div className={styles.faqBody}>{t("faqA2")}</div>
            </details>
            <details>
              <summary>{t("faqQ3")}</summary>
              <div className={styles.faqBody}>{t("faqA3")}</div>
            </details>
          </div>
        </div>

        <p>
          <Link href="/countries" className={styles.back}>
            {t("backToDirectory", { title: tCommon("countriesTitle") })}
          </Link>
        </p>
      </div>

      <aside className={styles.aside}>
        <div className={styles.promo}>
          <h3>{t("promoTitle")}</h3>
          <p>{t("promoBody")}</p>
          <Link href="/compare" className={styles.promoBtn}>
            {t("promoCta")}
          </Link>
        </div>
      </aside>
    </section>
  );
}
