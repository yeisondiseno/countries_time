import { DateTime } from "luxon";

import { findCountry } from "@/lib/data/countries";
import { TIER2_CODES } from "@/lib/data/country-tiers";
import type { Locale } from "@/lib/i18n/config";
import { formatCountryRegion } from "@/lib/time/display";

type LocalizedStrings = Readonly<Record<Locale, string>>;

const TIER2_SET = new Set<string>(TIER2_CODES);

const DST_LABELS: LocalizedStrings = {
  en: "Daylight saving",
  es: "Horario de verano",
  fr: "Heure d'été",
  de: "Sommerzeit",
  pt: "Horário de verão",
  it: "Ora legale",
  ja: "夏時間",
  ko: "서머타임",
};

const NO_DST_LABELS: LocalizedStrings = {
  en: "This zone does not observe daylight saving time year-round.",
  es: "Esta zona no observa horario de verano durante todo el año.",
  fr: "Ce fuseau n'observe pas l'heure d'été toute l'année.",
  de: "Diese Zone beobachtet das ganze Jahr über keine Sommerzeit.",
  pt: "Este fuso não observa horário de verão durante todo o ano.",
  it: "Questo fuso non osserva l'ora legale tutto l'anno.",
  ja: "この時間帯は通年で夏時間を採用しません。",
  ko: "이 시간대는 연중 서머타임을 적용하지 않습니다.",
};

const MULTI_ZONE_LABELS: LocalizedStrings = {
  en: "uses multiple IANA zones",
  es: "usa varias zonas IANA",
  fr: "utilise plusieurs fuseaux IANA",
  de: "nutzt mehrere IANA-Zonen",
  pt: "usa várias zonas IANA",
  it: "usa più zone IANA",
  ja: "複数のIANAゾーンを使用",
  ko: "여러 IANA 시간대를 사용",
};

function formatOffset(zone: string, at: DateTime): string {
  const dt = at.setZone(zone);
  const offset = dt.offset;
  const hours = Math.trunc(offset / 60);
  const minutes = Math.abs(offset % 60);
  const sign = hours >= 0 ? "+" : "-";
  const absHours = Math.abs(hours);
  if (minutes === 0) {
    return `UTC${sign}${absHours}`;
  }
  return `UTC${sign}${absHours}:${String(minutes).padStart(2, "0")}`;
}

function neighborCodes(code: string): string[] {
  const neighbors: Record<string, readonly string[]> = {
    RU: ["UA", "FI", "CN", "KZ"],
    ID: ["MY", "SG", "AU", "PH"],
    PK: ["IN", "AF", "IR", "CN"],
    NG: ["GH", "CM", "NE", "BJ"],
    EG: ["LY", "SD", "IL", "SA"],
    VN: ["TH", "CN", "LA", "KH"],
    TR: ["GR", "BG", "GE", "SY"],
    IR: ["IQ", "AF", "PK", "TR"],
    TH: ["MY", "LA", "KH", "MM"],
    ZA: ["NA", "BW", "MZ", "SZ"],
    PL: ["DE", "CZ", "SK", "UA"],
    UA: ["PL", "RO", "MD", "BY"],
    SE: ["NO", "FI", "DK", "DE"],
    NO: ["SE", "FI", "DK", "RU"],
    FI: ["SE", "NO", "EE", "RU"],
    DK: ["DE", "SE", "NO", "NL"],
    AT: ["DE", "CH", "IT", "CZ"],
    BE: ["FR", "NL", "DE", "GB"],
    CZ: ["DE", "AT", "PL", "SK"],
    RO: ["HU", "BG", "UA", "MD"],
    HU: ["AT", "SK", "RO", "HR"],
    GR: ["TR", "BG", "AL", "IT"],
    IL: ["JO", "EG", "LB", "SY"],
    SA: ["AE", "QA", "KW", "YE"],
    MY: ["SG", "TH", "ID", "BN"],
    PH: ["TW", "VN", "MY", "JP"],
    SG: ["MY", "ID", "TH", "AU"],
    TW: ["JP", "PH", "CN", "HK"],
    NZ: ["AU", "FJ", "NC", "TO"],
    CL: ["AR", "PE", "BO", "PY"],
    PE: ["CO", "EC", "BO", "BR"],
    VE: ["CO", "BR", "GY", "TT"],
    EC: ["CO", "PE", "PA", "CR"],
    UY: ["AR", "BR", "PY", "CL"],
    PY: ["AR", "BR", "BO", "UY"],
    BO: ["PE", "CL", "AR", "BR"],
    CR: ["PA", "NI", "EC", "MX"],
    PA: ["CO", "CR", "VE", "MX"],
    GT: ["MX", "HN", "SV", "BZ"],
    IE: ["GB", "FR", "NL", "DE"],
    SK: ["CZ", "AT", "HU", "PL"],
    BG: ["RO", "GR", "TR", "RS"],
    HR: ["SI", "HU", "AT", "IT"],
    RS: ["HU", "RO", "BG", "BA"],
    LT: ["LV", "EE", "PL", "BY"],
    LV: ["LT", "EE", "FI", "SE"],
    EE: ["FI", "LV", "LT", "RU"],
    HK: ["CN", "TW", "MO", "SG"],
    BD: ["IN", "MM", "NP", "BT"],
    MA: ["ES", "DZ", "PT", "FR"],
  };
  return [...(neighbors[code] ?? ["US", "GB", "DE", "FR"])].slice(0, 3);
}

function buildOverview(code: string, locale: Locale): string {
  const hit = findCountry(code);
  if (!hit) {
    return "";
  }

  const pretty = formatCountryRegion(code, locale);
  const now = DateTime.utc();
  const winter = now.set({ month: 1, day: 15 });
  const summer = now.set({ month: 7, day: 15 });
  const winterOffset = formatOffset(hit.defaultZone, winter);
  const summerOffset = formatOffset(hit.defaultZone, summer);
  const zoneCount = hit.zones.length;

  const templates: Record<Locale, (parts: TemplateParts) => string> = {
    en: (p) =>
      `${p.pretty} keeps official time on the IANA zone ${p.zone}, with ${p.capital} as the usual reference for business and government schedules. In mid-January the offset is typically ${p.winterOffset}; in mid-July it is ${p.summerOffset}. ${p.zoneNote} When you schedule calls or travel connections involving ${p.pretty}, always confirm the active zone on the date you care about.`,
    es: (p) =>
      `${p.pretty} mantiene la hora oficial en la zona IANA ${p.zone}, con ${p.capital} como referencia habitual para horarios laborales y administrativos. A mediados de enero el desfase suele ser ${p.winterOffset}; a mediados de julio, ${p.summerOffset}. ${p.zoneNote} Al programar llamadas o conexiones de viaje con ${p.pretty}, confirma siempre la zona activa en la fecha que te interese.`,
    fr: (p) =>
      `${p.pretty} utilise le fuseau IANA ${p.zone}, ${p.capital} servant de référence pour les horaires professionnels. En janvier le décalage est en général ${p.winterOffset} ; en juillet ${p.summerOffset}. ${p.zoneNote}`,
    de: (p) =>
      `${p.pretty} nutzt die IANA-Zone ${p.zone}; ${p.capital} ist die übliche Referenz für Geschäftszeiten. Im Januar gilt meist ${p.winterOffset}, im Juli ${p.summerOffset}. ${p.zoneNote}`,
    pt: (p) =>
      `${p.pretty} usa a zona IANA ${p.zone}, com ${p.capital} como referência para horários comerciais. Em janeiro o desfase costuma ser ${p.winterOffset}; em julho, ${p.summerOffset}. ${p.zoneNote}`,
    it: (p) =>
      `${p.pretty} segue il fuso IANA ${p.zone}; ${p.capital} è il riferimento per gli orari lavorativi. A gennaio l'offset è di solito ${p.winterOffset}, a luglio ${p.summerOffset}. ${p.zoneNote}`,
    ja: (p) =>
      `${p.pretty}はIANAゾーン${p.zone}で公式時刻を管理し、${p.capital}がビジネスの基準になりやすいです。1月中旬は通常${p.winterOffset}、7月中旬は${p.summerOffset}です。${p.zoneNote}`,
    ko: (p) =>
      `${p.pretty}는 IANA 존 ${p.zone}으로 공식 시간을 유지하며 ${p.capital}이 업무 기준으로 쓰입니다. 1월 중순에는 보통 ${p.winterOffset}, 7월 중순에는 ${p.summerOffset}입니다. ${p.zoneNote}`,
  };

  const zoneNote =
    zoneCount > 1
      ? locale === "es"
        ? `El país ${MULTI_ZONE_LABELS.es} (${zoneCount}); la página muestra ${hit.defaultZone} por defecto.`
        : locale === "en"
          ? `The country ${MULTI_ZONE_LABELS.en} (${zoneCount}); this page defaults to ${hit.defaultZone}.`
          : `${MULTI_ZONE_LABELS[locale]} (${zoneCount}).`
      : locale === "es"
        ? `Toda la nación comparte un único huso en esta zona.`
        : locale === "en"
          ? `The nation shares a single offset in this zone.`
          : "";

  return templates[locale]({
    pretty,
    capital: hit.capital,
    zone: hit.defaultZone,
    winterOffset,
    summerOffset,
    zoneNote,
  });
}

type TemplateParts = Readonly<{
  pretty: string;
  capital: string;
  zone: string;
  winterOffset: string;
  summerOffset: string;
  zoneNote: string;
}>;

function buildDstNotes(code: string, locale: Locale): string | null {
  const hit = findCountry(code);
  if (!hit) {
    return null;
  }

  const winter = formatOffset(hit.defaultZone, DateTime.utc().set({ month: 1, day: 15 }));
  const summer = formatOffset(hit.defaultZone, DateTime.utc().set({ month: 7, day: 15 }));

  if (winter === summer) {
    return NO_DST_LABELS[locale];
  }

  const labels: Record<Locale, string> = {
    en: `${DST_LABELS.en} shifts the offset between ${winter} in winter and ${summer} in summer for ${hit.defaultZone}. Transitions follow the official IANA rule set for that zone—verify on the exact meeting date.`,
    es: `El ${DST_LABELS.es.toLowerCase()} cambia el desfase entre ${winter} en invierno y ${summer} en verano para ${hit.defaultZone}. Las transiciones siguen las reglas IANA oficiales: verifica en la fecha exacta de la reunión.`,
    fr: `L'${DST_LABELS.fr.toLowerCase()} fait varier le décalage entre ${winter} en hiver et ${summer} en été pour ${hit.defaultZone}.`,
    de: `${DST_LABELS.de} wechselt den Offset zwischen ${winter} im Winter und ${summer} im Sommer für ${hit.defaultZone}.`,
    pt: `O ${DST_LABELS.pt.toLowerCase()} altera o desfase entre ${winter} no inverno e ${summer} no verão para ${hit.defaultZone}.`,
    it: `L'${DST_LABELS.it.toLowerCase()} sposta l'offset tra ${winter} in inverno e ${summer} in estate per ${hit.defaultZone}.`,
    ja: `${hit.defaultZone}では${DST_LABELS.ja}により冬${winter}・夏${summer}でオフセットが変わります。`,
    ko: `${hit.defaultZone}에서 ${DST_LABELS.ko}로 겨울 ${winter}, 여름 ${summer}로 바뀝니다.`,
  };

  return labels[locale];
}

function buildPracticalTip(code: string, locale: Locale): string {
  const hit = findCountry(code);
  if (!hit) {
    return "";
  }

  const pretty = formatCountryRegion(code, locale);
  const neighbors = neighborCodes(code);
  const neighborNames = neighbors
    .map((c) => formatCountryRegion(c, locale))
    .join(", ");

  const templates: Record<Locale, string> = {
    en: `When coordinating with nearby markets (${neighborNames}), open the comparator and set ${pretty} as reference to see exact offsets on your chosen date—do not rely on fixed hour differences year-round.`,
    es: `Al coordinar con mercados cercanos (${neighborNames}), abre el comparador y fija ${pretty} como referencia para ver desfases exactos en tu fecha—no uses diferencias fijas todo el año.`,
    fr: `Pour coordonner avec ${neighborNames}, utilisez le comparateur avec ${pretty} comme référence à la date choisie.`,
    de: `Für Termine mit ${neighborNames} den Komparator mit ${pretty} als Referenz am gewünschten Datum nutzen.`,
    pt: `Ao coordenar com ${neighborNames}, use o comparador com ${pretty} como referência na data escolhida.`,
    it: `Per allinearsi con ${neighborNames}, usa il comparatore con ${pretty} come riferimento alla data scelta.`,
    ja: `${neighborNames}との調整には、選んだ日付で${pretty}を基準にコンパレーターを使ってください。`,
    ko: `${neighborNames}와 일정을 맞출 때는 선택한 날짜에 ${pretty}를 기준으로 비교 도구를 사용하세요.`,
  };

  return templates[locale];
}

export function getGeneratedCountryEditorial(
  code: string,
  locale: Locale,
): {
  overview: string;
  dstNotes: string | null;
  practicalTip: string;
  relatedCodes: readonly string[];
} | null {
  const upper = code.toUpperCase();
  if (!TIER2_SET.has(upper)) {
    return null;
  }

  return {
    overview: buildOverview(upper, locale),
    dstNotes: buildDstNotes(upper, locale),
    practicalTip: buildPracticalTip(upper, locale),
    relatedCodes: neighborCodes(upper),
  };
}
