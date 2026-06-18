import type { Locale } from "@/lib/i18n/config";

type LocalizedCopy = Partial<Record<Locale, string>> & { en: string };

export type CountryEditorial = Readonly<{
  code: string;
  overview: LocalizedCopy;
  dstNotes?: LocalizedCopy;
  practicalTip: LocalizedCopy;
  relatedCodes: readonly string[];
}>;

const pickLocalized = (copy: LocalizedCopy, locale: Locale): string =>
  copy[locale] ?? copy.en;

/** Tier 1 — enriched editorial for AdSense / SEO review priority countries. */
const TIER1_EDITORIAL: Record<string, CountryEditorial> = {
  US: {
    code: "US",
    overview: {
      en: "The United States spans six time zones from Eastern to Hawaii-Aleutian. Business hours on the East Coast often anchor national media and finance, while the West Coast runs three hours behind. When you schedule across states, always confirm whether daylight saving time is active—Arizona (except Navajo Nation) and Hawaii do not observe it.",
      es: "Estados Unidos abarca seis husos horarios, del Este al hawaiano. La costa este suele marcar horarios de negocios y medios, mientras la costa oeste va tres horas detrás. Al coordinar entre estados, confirma si aplica el horario de verano: Arizona (salvo la Nación Navajo) y Hawái no lo observan.",
      fr: "Les États-Unis couvrent six fuseaux horaires, de l'Est à Hawaï. La côte est fixe souvent les horaires des affaires et des médias, tandis que la côte ouest a trois heures de décalage. Vérifiez si l'heure d'été s'applique : l'Arizona (hors Nation navajo) et Hawaï ne l'observent pas.",
      de: "Die USA umfassen sechs Zeitzonen von Ost bis Hawaii. Die Ostküste prägt oft Geschäftszeiten und Medien, die Westküste liegt drei Stunden zurück. Klären Sie bei Terminen, ob Sommerzeit gilt: Arizona (außer Navajo Nation) und Hawaii stellen nicht um.",
      pt: "Os Estados Unidos cobrem seis fusos horários, do leste ao havaiano. A costa leste costuma definir horários de negócios e mídia; a oeste fica três horas atrás. Confirme se o horário de verão se aplica: Arizona (exceto Nação Navajo) e Havaí não o observam.",
      it: "Gli Stati Uniti coprono sei fusi orari, dall'est a Hawaii. La costa orientale guida spesso orari lavorativi e media, mentre la occidentale è tre ore indietro. Verifica se vale l'ora legale: Arizona (tranne Navajo Nation) e Hawaii non la osservano.",
      ja: "アメリカ合衆国は東部からハワイまで6つの時間帯にまたがります。東海岸がビジネスや報道の基準になりやすく、西海岸は3時間遅れです。日程調整時は夏時間の有無を確認してください。アリゾナ（ナバホ族を除く）とハワイは夏時間を採用しません。",
      ko: "미국은 동부에서 하와이까지 여섯 개 시간대를 포함합니다. 동부 해안이 업무·미디어 기준이 되는 경우가 많고 서부는 3시간 늦습니다. 일정 조율 시 서머타임 적용 여부를 확인하세요. 애리조나(나바호족 제외)와 하와이는 서머타임을 쓰지 않습니다.",
    },
    dstNotes: {
      en: "Most US states spring forward on the second Sunday in March and fall back on the first Sunday in November. Exceptions include most of Arizona and all of Hawaii.",
      es: "La mayoría de estados adelantan el reloj el segundo domingo de marzo y lo retrasan el primero de noviembre. Excepciones: gran parte de Arizona y todo Hawái.",
    },
    practicalTip: {
      en: "For a call from New York to Los Angeles at 9:00 local Eastern time, it is 6:00 Pacific—check the comparator if the date crosses a DST transition.",
      es: "Si llamas desde Nueva York a Los Ángeles a las 9:00 hora del Este, en la costa oeste serán las 6:00; usa el comparador si la fecha cae en un cambio de horario.",
    },
    relatedCodes: ["CA", "MX", "GB"],
  },
  ES: {
    code: "ES",
    overview: {
      en: "Spain uses Central European Time on the peninsula and Balearic Islands (Europe/Madrid) and Western European Time in the Canary Islands (Atlantic/Canary), one hour behind mainland. Madrid is the usual reference for business and government schedules.",
      es: "España usa la hora de Europa central en península y Baleares (Europe/Madrid) y la hora de Europa occidental en Canarias (Atlantic/Canary), una hora menos que la península. Madrid es la referencia habitual para horarios laborales y administrativos.",
      fr: "L'Espagne utilise l'heure d'Europe centrale sur la péninsule et les Baléares (Europe/Madrid) et l'heure d'Europe de l'Ouest aux Canaries (Atlantic/Canary), une heure de moins. Madrid sert de référence pour les horaires professionnels.",
      de: "Spanien nutzt Mitteleuropäische Zeit auf der Halbinsel und den Balearen (Europe/Madrid) und Westeuropäische Zeit auf den Kanaren (Atlantic/Canary), eine Stunde weniger. Madrid ist Referenz für Geschäftszeiten.",
      pt: "A Espanha usa o horário da Europa Central na península e Baleares (Europe/Madrid) e o da Europa Ocidental nas Canárias (Atlantic/Canary), uma hora a menos. Madrid é referência para horários comerciais.",
      it: "La Spagna usa l'ora dell'Europa centrale su penisola e Baleari (Europe/Madrid) e l'ora dell'Europa occidentale alle Canarie (Atlantic/Canary), un'ora indietro. Madrid è riferimento per gli orari lavorativi.",
      ja: "スペイン本土とバレアレス諸島は中欧時間（Europe/Madrid）、カナリア諸島は西欧時間（Atlantic/Canary）で本土より1時間遅れです。マドリードがビジネスや行政の基準になりやすいです。",
      ko: "스페인 본토와 발레아레스는 중부유럽 시간(Europe/Madrid), 카나리아는 서유럽 시간(Atlantic/Canary)으로 본토보다 1시간 늦습니다. 마드리드가 업무·행정 기준으로 쓰입니다.",
    },
    dstNotes: {
      en: "Peninsula and Canary Islands follow EU daylight saving rules: clocks move forward on the last Sunday of March and back on the last Sunday of October.",
      es: "Península y Canarias siguen las reglas de verano de la UE: adelante el último domingo de marzo y atrás el último domingo de octubre.",
    },
    practicalTip: {
      en: "When calling mainland Spain from Latin America, note that Spain is usually 5-6 hours ahead of Mexico City and 4-5 hours ahead of Buenos Aires, depending on DST on both sides.",
      es: "Si llamas a la península desde Latinoamérica, España suele ir 5-6 h por delante de Ciudad de México y 4-5 h de Buenos Aires, según el horario de verano en cada lado.",
    },
    relatedCodes: ["PT", "FR", "MX", "AR"],
  },
  MX: {
    code: "MX",
    overview: {
      en: "Mexico uses four time zones. Most of the population lives in Central Time (America/Mexico_City), aligned with US Central when DST rules match. Quintana Roo stays on Eastern Standard Time year-round; Sonora does not observe DST.",
      es: "México tiene cuatro husos. La mayor parte de la población está en hora central (America/Mexico_City), alineada con la central de EE. UU. cuando coinciden las reglas de verano. Quintana Roo permanece en hora estándar del Este; Sonora no usa horario de verano.",
    },
    dstNotes: {
      en: "Since 2022 many Mexican states no longer change clocks; border cities may follow US DST for commerce. Always verify the zone shown on this page.",
      es: "Desde 2022 muchos estados ya no cambian el reloj; ciudades fronterizas pueden seguir el verano de EE. UU. Verifica siempre la zona mostrada aquí.",
    },
    practicalTip: {
      en: "A 10:00 meeting in Mexico City is typically 17:00 in Madrid (winter) or 18:00 (summer)—use the comparator for the exact date.",
      es: "Una reunión a las 10:00 en Ciudad de México suele ser 17:00 en Madrid (invierno) o 18:00 (verano); usa el comparador para la fecha exacta.",
    },
    relatedCodes: ["US", "ES", "CO"],
  },
  GB: {
    code: "GB",
    overview: {
      en: "The United Kingdom uses GMT in winter and BST (UTC+1) in summer via Europe/London. London is the default reference for UK business, media, and international finance sessions overlapping with Europe.",
      es: "Reino Unido usa GMT en invierno y BST (UTC+1) en verano con Europe/London. Londres es la referencia para negocios, medios y solapes financieros con Europa.",
    },
    dstNotes: {
      en: "BST starts on the last Sunday of March and ends on the last Sunday of October—the same calendar as most of the EU.",
      es: "El BST empieza el último domingo de marzo y termina el último domingo de octubre, igual que la mayoría de la UE.",
    },
    practicalTip: {
      en: "UK time is one hour behind Central European Time in winter and matches it during BST, which simplifies calls with Paris or Berlin for half the year.",
      es: "Reino Unido va una hora detrás de Europa central en invierno e iguala en verano (BST), lo que facilita llamadas con París o Berlín medio año.",
    },
    relatedCodes: ["IE", "FR", "DE", "US"],
  },
  DE: {
    code: "DE",
    overview: {
      en: "Germany follows Central European Time (Europe/Berlin). Berlin is the political and economic hub; office hours typically run 9:00-17:00 local time with a midday culture that favors morning meetings.",
      es: "Alemania sigue la hora de Europa central (Europe/Berlin). Berlín concentra política y economía; el horario de oficina suele ser 9:00-17:00 con cultura de reuniones por la mañana.",
    },
    dstNotes: {
      en: "CEST applies from the last Sunday in March through the last Sunday in October.",
      es: "CEST aplica del último domingo de marzo al último domingo de octubre.",
    },
    practicalTip: {
      en: "When scheduling with US East Coast, Germany is usually 6 hours ahead in winter and 5 in summer.",
      es: "Con la costa este de EE. UU., Alemania suele ir 6 h por delante en invierno y 5 en verano.",
    },
    relatedCodes: ["FR", "NL", "CH", "GB"],
  },
  JP: {
    code: "JP",
    overview: {
      en: "Japan uses a single nationwide time zone (Asia/Tokyo, UTC+9) with no daylight saving time. Tokyo sets the standard for business, rail, and broadcast schedules across the archipelago.",
      es: "Japón usa un único huso nacional (Asia/Tokyo, UTC+9) sin horario de verano. Tokio marca el estándar de negocios, trenes y medios en todo el archipiélago.",
    },
    practicalTip: {
      en: "Morning in Europe is evening in Japan—plan meetings early CET/CEST or late JST to find overlap with remote teams.",
      es: "La mañana en Europa es tarde en Japón: planifica reuniones temprano en CET/CEST o tarde en JST para solapar con equipos remotos.",
    },
    relatedCodes: ["KR", "CN", "AU", "US"],
  },
  FR: {
    code: "FR",
    overview: {
      en: "Metropolitan France uses Europe/Paris (CET/CEST). Paris aligns with EU daylight saving transitions and is the reference for government and business in mainland France.",
      es: "Francia metropolitana usa Europe/Paris (CET/CEST). París sigue los cambios de verano de la UE y es referencia administrativa y empresarial.",
    },
    practicalTip: {
      en: "France is one hour ahead of the UK in winter and matches London during summer BST overlap with Central Europe.",
      es: "Francia va una hora por delante de Reino Unido en invierno e iguala a Londres cuando el BST coincide con Europa central.",
    },
    relatedCodes: ["ES", "DE", "GB", "BE"],
  },
  AR: {
    code: "AR",
    overview: {
      en: "Argentina stays on UTC-3 year-round (America/Argentina/Buenos_Aires) without daylight saving time. Buenos Aires anchors finance, media, and regional coordination for the Southern Cone.",
      es: "Argentina permanece en UTC-3 todo el año (America/Argentina/Buenos_Aires) sin horario de verano. Buenos Aires concentra finanzas, medios y coordinación regional.",
    },
    practicalTip: {
      en: "When calling Spain from Argentina, remember Spain is 4-5 hours ahead depending on European daylight saving.",
      es: "Si llamas a España desde Argentina, recuerda que España suele ir 4-5 horas por delante según el verano europeo.",
    },
    relatedCodes: ["BR", "CL", "ES", "MX"],
  },
  CO: {
    code: "CO",
    overview: {
      en: "Colombia uses America/Bogota (UTC-5) with no DST. Bogotá is the reference for business across the country and pairs well with US Eastern Time (same offset in winter).",
      es: "Colombia usa America/Bogota (UTC-5) sin cambio estacional. Bogotá es referencia empresarial y coincide con la hora del Este de EE. UU. en invierno.",
    },
    practicalTip: {
      en: "Colombia shares its offset with US Eastern Standard Time in winter—useful for Miami or New York calls without mental math.",
      es: "Colombia comparte desfase con la hora estándar del Este de EE. UU. en invierno, útil para llamadas a Miami o Nueva York.",
    },
    relatedCodes: ["MX", "PE", "US", "ES"],
  },
  IT: {
    code: "IT",
    overview: {
      en: "Italy follows Europe/Rome (CET/CEST). Rome and Milan drive business hours; lunch breaks can shift afternoon availability.",
      es: "Italia sigue Europe/Rome (CET/CEST). Roma y Milán marcan horarios laborales; la pausa de mediodía puede mover la tarde disponible.",
    },
    practicalTip: {
      en: "Schedule cross-border EU calls before 13:00 local time if you need responses the same afternoon.",
      es: "Programa llamadas transfronterizas en la UE antes de las 13:00 locales si necesitas respuesta esa misma tarde.",
    },
    relatedCodes: ["FR", "DE", "ES", "CH"],
  },
  PT: {
    code: "PT",
    overview: {
      en: "Mainland Portugal and Madeira use Europe/Lisbon (WET/WEST); the Azores are one hour behind (Atlantic/Azores). Lisbon is the usual business reference.",
      es: "Portugal continental y Madeira usan Europe/Lisbon (WET/WEST); Azores van una hora detrás (Atlantic/Azores). Lisboa es la referencia habitual.",
    },
    practicalTip: {
      en: "Portugal is one hour behind Spain year-round on the peninsula—double-check when setting meetings between Lisbon and Madrid.",
      es: "Portugal va una hora detrás de España en península todo el año: verifica al fijar reuniones entre Lisboa y Madrid.",
    },
    relatedCodes: ["ES", "GB", "FR"],
  },
  BR: {
    code: "BR",
    overview: {
      en: "Brazil spans several zones; most people use Brasília Time (America/Sao_Paulo, UTC-3). Since 2019 DST is not observed nationally—verify the zone for northern states.",
      es: "Brasil abarca varios husos; la mayoría usa hora de Brasilia (America/Sao_Paulo, UTC-3). Desde 2019 no hay verano nacional: verifica la zona en estados del norte.",
    },
    practicalTip: {
      en: "São Paulo is typically 4 hours behind UTC in winter terms and aligns with Argentina year-round.",
      es: "São Paulo suele ir 4 horas detrás de UTC en términos fijos y coincide con Argentina todo el año.",
    },
    relatedCodes: ["AR", "CO", "PT", "US"],
  },
  IN: {
    code: "IN",
    overview: {
      en: "India uses a single offset UTC+5:30 (Asia/Kolkata) with no daylight saving. All of India shares one clock, which simplifies national scheduling but differs from whole-hour zones.",
      es: "India usa un único desfase UTC+5:30 (Asia/Kolkata) sin horario de verano. Todo el país comparte reloj, lo que simplifica agendas nacionales pero difiere de husos enteros.",
    },
    practicalTip: {
      en: "The half-hour offset means India never aligns on the hour with Europe or the US—always use the comparator for a given date.",
      es: "El desfase de media hora implica que India no coincide en punto con Europa o EE. UU.: usa el comparador para cada fecha.",
    },
    relatedCodes: ["AE", "GB", "US", "JP"],
  },
  AU: {
    code: "AU",
    overview: {
      en: "Australia has multiple zones; Sydney (Australia/Sydney) observes DST in New South Wales while Queensland does not. Melbourne aligns with Sydney for business.",
      es: "Australia tiene varios husos; Sídney (Australia/Sydney) usa verano en Nueva Gales del Sur y Queensland no. Melbourne coincide con Sídney en negocios.",
    },
    practicalTip: {
      en: "European morning meetings often fall late evening in Sydney—check both dates when daylight saving differs between regions.",
      es: "Reuniones matutinas en Europa suelen caer en tarde-noche en Sídney: revisa ambas fechas cuando el verano difiere entre regiones.",
    },
    relatedCodes: ["JP", "NZ", "GB", "US"],
  },
  CA: {
    code: "CA",
    overview: {
      en: "Canada spans six time zones from Pacific to Newfoundland (UTC-3:30). Toronto (America/Toronto) is the common reference for Eastern business; DST rules align with the US.",
      es: "Canadá abarca seis husos del Pacífico a Terranova (UTC-3:30). Toronto (America/Toronto) es referencia del Este; las reglas de verano coinciden con EE. UU.",
    },
    practicalTip: {
      en: "Toronto and New York share Eastern Time year-round, which simplifies cross-border North American scheduling.",
      es: "Toronto y Nueva York comparten hora del Este todo el año, lo que simplifica agendas transfronterizas en Norteamérica.",
    },
    relatedCodes: ["US", "GB", "FR"],
  },
  CN: {
    code: "CN",
    overview: {
      en: "China officially uses one time zone (Asia/Shanghai, UTC+8) for the whole country despite geographic span. Beijing time governs rail, media, and government nationwide.",
      es: "China usa oficialmente un solo huso (Asia/Shanghai, UTC+8) para todo el país pese a su extensión. La hora de Pekín rige trenes, medios y gobierno.",
    },
    practicalTip: {
      en: "Beijing is 7-8 hours ahead of Central Europe depending on DST—plan calls for early evening CET or morning CST.",
      es: "Pekín va 7-8 h por delante de Europa central según verano: planifica llamadas al atardecer CET o por la mañana CST.",
    },
    relatedCodes: ["JP", "KR", "IN", "AU"],
  },
  KR: {
    code: "KR",
    overview: {
      en: "South Korea uses Asia/Seoul (UTC+9) with no DST, aligned with Japan. Seoul drives tech and finance schedules for the peninsula.",
      es: "Corea del Sur usa Asia/Seoul (UTC+9) sin horario de verano, alineada con Japón. Seúl marca agendas tecnológicas y financieras.",
    },
    practicalTip: {
      en: "Korea matches Japan's clock year-round—useful when coordinating Northeast Asian suppliers together.",
      es: "Corea comparte reloj con Japón todo el año, útil al coordinar proveedores del noreste asiático.",
    },
    relatedCodes: ["JP", "CN", "US"],
  },
  NL: {
    code: "NL",
    overview: {
      en: "The Netherlands uses Europe/Amsterdam (CET/CEST). Amsterdam and Rotterdam share business hours with Germany and Belgium.",
      es: "Países Bajos usa Europe/Amsterdam (CET/CEST). Ámsterdam y Róterdam comparten horario laboral con Alemania y Bélgica.",
    },
    practicalTip: {
      en: "Amsterdam is one hour ahead of London in winter and equal during overlapping daylight saving periods.",
      es: "Ámsterdam va una hora por delante de Londres en invierno e iguala en periodos de verano solapados.",
    },
    relatedCodes: ["DE", "BE", "GB", "FR"],
  },
  CH: {
    code: "CH",
    overview: {
      en: "Switzerland uses Europe/Zurich (CET/CEST). Zurich and Geneva host banking hours that overlap with London and Frankfurt.",
      es: "Suiza usa Europe/Zurich (CET/CEST). Zúrich y Ginebra concentran horarios bancarios con solape a Londres y Fráncfort.",
    },
    practicalTip: {
      en: "Swiss business hours align with Germany; use Europe/Zurich when booking calls with Alpine finance teams.",
      es: "El horario suizo se alinea con Alemania; usa Europe/Zurich al reservar llamadas con equipos financieros alpinos.",
    },
    relatedCodes: ["DE", "FR", "IT", "GB"],
  },
  AE: {
    code: "AE",
    overview: {
      en: "The United Arab Emirates uses Asia/Dubai (UTC+4) with no daylight saving. Dubai is the business hub for the Gulf region.",
      es: "Emiratos Árabes Unidos usa Asia/Dubai (UTC+4) sin horario de verano. Dubái es hub empresarial del Golfo.",
    },
    practicalTip: {
      en: "Dubai is 4 hours ahead of UTC year-round—convenient mental anchor for Gulf calls with India (1.5 hours later).",
      es: "Dubái va 4 h por delante de UTC todo el año: ancla mental útil para llamadas al Golfo con India (1,5 h después).",
    },
    relatedCodes: ["IN", "GB", "DE", "US"],
  },
};

export const TIER1_COUNTRY_CODES = Object.keys(TIER1_EDITORIAL);

export function getCountryEditorial(
  code: string,
  locale: Locale,
): {
  overview: string;
  dstNotes: string | null;
  practicalTip: string;
  relatedCodes: readonly string[];
} | null {
  const entry = TIER1_EDITORIAL[code.toUpperCase()];
  if (!entry) {
    return null;
  }

  return {
    overview: pickLocalized(entry.overview, locale),
    dstNotes: entry.dstNotes ? pickLocalized(entry.dstNotes, locale) : null,
    practicalTip: pickLocalized(entry.practicalTip, locale),
    relatedCodes: entry.relatedCodes,
  };
}
