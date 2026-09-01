import type { GuideArticle } from "./types";

/** All guide and comparison articles for the /guides hub. */
export const GUIDE_ARTICLES: readonly GuideArticle[] = [
  {
    slug: "como-programar-reuniones-internacionales",
    category: "guide",
    updatedAt: "2026-08-31",
    title: {
      en: "How to schedule international meetings without time zone mistakes",
      es: "Cómo programar reuniones internacionales sin errores de huso horario",
    },
    description: {
      en: "A practical workflow for picking meeting times across countries, accounting for daylight saving and calendar rollovers.",
      es: "Flujo práctico para elegir horarios de reunión entre países, con horario de verano y cambios de fecha.",
    },
    sections: {
      en: [
        {
          heading: "Start from one absolute instant",
          paragraphs: [
            "The most common scheduling mistake is adding fixed hour differences in your head. Offsets change when daylight saving starts or ends, and some countries abolished seasonal clock changes entirely. The reliable approach is to pick one reference date and time in the organizer's zone, convert that instant to every participant zone, and only then send the calendar invite.",
            "Countries Time holds a single UTC instant internally and projects it using IANA zone rules. That means a meeting set for Tuesday 10:00 in Madrid automatically shows the correct local Tuesday or Wednesday in Tokyo when the date rolls over.",
          ],
        },
        {
          heading: "Workflow in four steps",
          paragraphs: [
            "Use this sequence every time you invite people in two or more countries:",
          ],
          listItems: [
            "List participants and their primary city—not just the country name when multiple zones exist (US, Canada, Brazil, Australia).",
            "Open the comparator, add each country, and set the reference zone to whoever owns the invite.",
            "Slide the reference date across the week to find overlap windows that respect local evenings and weekends.",
            "Paste the confirmed local times into the invite description so attendees can sanity-check without opening a tool.",
          ],
        },
        {
          heading: "Buffer for DST transition weeks",
          paragraphs: [
            "The week when Europe or North America changes clocks generates the highest volume of missed meetings. If your meeting falls within three days of a known transition, mention both UTC offset and city in the invite. Ask recipients in Arizona, Saskatchewan, or Japan—zones that skip DST—to ignore seasonal shifts on their side.",
            "For recurring meetings, revisit the series twice a year: late March and late October for most of the Northern Hemisphere. A slot that worked in winter may land at lunch or after bedtime in summer.",
          ],
        },
      ],
      es: [
        {
          heading: "Parte de un instante absoluto",
          paragraphs: [
            "El error más habitual es sumar diferencias fijas de horas mentalmente. Los desfases cambian con el horario de verano y algunos países eliminaron el cambio estacional. Lo fiable es elegir una fecha y hora de referencia en la zona del organizador, convertir ese instante a cada participante y solo entonces enviar la invitación.",
            "Countries Time mantiene un instante UTC único y lo proyecta con reglas IANA. Una reunión del martes a las 10:00 en Madrid muestra automáticamente el martes o miércoles local correcto en Tokio cuando la fecha cambia.",
          ],
        },
        {
          heading: "Flujo en cuatro pasos",
          paragraphs: ["Sigue esta secuencia cuando invites a personas en dos o más países:"],
          listItems: [
            "Lista participantes y su ciudad principal—no solo el país si hay varios husos (EE. UU., Canadá, Brasil, Australia).",
            "Abre el comparador, añade cada país y fija la zona de referencia en quien envía la invitación.",
            "Desplaza la fecha de referencia por la semana para encontrar ventanas que respeten noches y fines de semana locales.",
            "Incluye en la invitación las horas locales confirmadas para que puedan verificar sin abrir herramientas.",
          ],
        },
        {
          heading: "Margen en semanas de cambio de hora",
          paragraphs: [
            "La semana en que Europa o Norteamérica cambian el reloj concentra la mayoría de reuniones fallidas. Si tu cita cae a tres días de una transición conocida, indica desfase UTC y ciudad en la invitación.",
            "Para reuniones recurrentes, revisa la serie dos veces al año: finales de marzo y octubre en el hemisferio norte. Un hueco que funcionaba en invierno puede caer a la hora de comer o de dormir en verano.",
          ],
        },
      ],
    },
    faq: {
      en: [
        {
          question: "Should I use UTC in invites?",
          answer:
            "UTC is excellent for technical teams that think in offsets, but business attendees usually prefer local wall time plus city name. Include both when possible.",
        },
        {
          question: "What if someone joins from a different city?",
          answer:
            "Ask them to confirm their IANA zone. A colleague listed under 'US' might be in Denver or New York—three hours apart.",
        },
      ],
      es: [
        {
          question: "¿Debo usar UTC en las invitaciones?",
          answer:
            "UTC es excelente para equipos técnicos, pero en negocios suele preferirse hora local más ciudad. Incluye ambos cuando puedas.",
        },
        {
          question: "¿Y si alguien se conecta desde otra ciudad?",
          answer:
            "Pídele que confirme su zona IANA. Un compañero en 'EE. UU.' puede estar en Denver o Nueva York—tres horas de diferencia.",
        },
      ],
    },
    relatedCountryCodes: ["US", "ES", "GB", "JP"],
  },
  {
    slug: "que-es-horario-verano",
    category: "guide",
    updatedAt: "2026-08-31",
    title: {
      en: "What is daylight saving time and how it affects video calls",
      es: "Qué es el horario de verano y cómo afecta a las videollamadas",
    },
    description: {
      en: "Understand DST transitions, who still observes them, and how to avoid surprise one-hour shifts on calls.",
      es: "Entiende los cambios de horario de verano, quién los aplica y cómo evitar sorpresas de una hora en videollamadas.",
    },
    sections: {
      en: [
        {
          heading: "Why clocks shift",
          paragraphs: [
            "Daylight saving time (DST) moves civil clocks forward in spring and back in autumn so evenings have more daylight. The practice is political, not astronomical: regions choose whether to participate and on which Sundays to switch. That is why a video call that worked at 15:00 last month might need to be 16:00 today without anyone traveling.",
          ],
        },
        {
          heading: "Impact on remote work",
          paragraphs: [
            "When only one side of a call changes clocks, the gap between zones grows or shrinks by one hour. Example: New York and London are five hours apart in winter but four hours apart during overlapping summer weeks. Tools that store 'every Tuesday at 3 pm local' without zone metadata will fire at the wrong instant once a year.",
            "Always schedule with an explicit IANA zone (Europe/Madrid, America/New_York) and verify on the actual meeting date using a DST-aware converter.",
          ],
        },
        {
          heading: "Regions that skip DST",
          paragraphs: [
            "Japan, South Korea, China, India, most of Arizona, Hawaii, and many Latin American countries stay on a fixed offset year-round. Saskatchewan in Canada and Queensland in Australia also skip seasonal shifts. Never assume your partner changes clocks just because your country does.",
          ],
        },
      ],
      es: [
        {
          heading: "Por qué se adelanta el reloj",
          paragraphs: [
            "El horario de verano adelanta los relojes en primavera y los retrasa en otoño para alargar la luz vespertina. Es una decisión política: cada región elige si participa y en qué domingos cambia. Por eso una videollamada que funcionaba a las 15:00 el mes pasado puede necesitar las 16:00 hoy sin que nadie viaje.",
          ],
        },
        {
          heading: "Impacto en trabajo remoto",
          paragraphs: [
            "Cuando solo un lado cambia el reloj, la diferencia entre zonas crece o se reduce una hora. Nueva York y Londres están cinco horas separadas en invierno y cuatro en semanas de verano solapadas.",
            "Programa siempre con una zona IANA explícita y verifica en la fecha real de la reunión con un conversor que aplique reglas de verano.",
          ],
        },
        {
          heading: "Regiones sin horario de verano",
          paragraphs: [
            "Japón, Corea del Sur, China, India, gran parte de Arizona, Hawái y muchos países latinoamericanos mantienen un desfase fijo todo el año. Nunca asumas que tu interlocutor cambia el reloj porque tu país lo hace.",
          ],
        },
      ],
    },
    faq: {
      en: [
        {
          question: "Do EU and US switch on the same day?",
          answer:
            "Usually not. The US moves on March/November Sundays; the EU uses the last Sundays of March and October. For a few weeks each year the offset between them differs from the usual table.",
        },
      ],
      es: [
        {
          question: "¿UE y EE. UU. cambian el mismo día?",
          answer:
            "Casi nunca. EE. UU. cambia en domingos de marzo/noviembre; la UE en los últimos domingos de marzo y octubre. Durante unas semanas al año el desfase difiere de la tabla habitual.",
        },
      ],
    },
    relatedCountryCodes: ["US", "ES", "GB", "DE"],
  },
  {
    slug: "como-usar-comparador-horario",
    category: "guide",
    updatedAt: "2026-08-31",
    title: {
      en: "How to use the Countries Time zone comparator",
      es: "Cómo usar el comparador horario de Countries Time",
    },
    description: {
      en: "Step-by-step tutorial for comparing two to four countries with a shared reference instant.",
      es: "Tutorial paso a paso para comparar de dos a cuatro países con un instante de referencia común.",
    },
    sections: {
      en: [
        {
          heading: "What the comparator solves",
          paragraphs: [
            "Country pages show the current local time in one place. The comparator answers a different question: if it is a specific date and time in country A, what is the same instant everywhere else? That symmetry matters when you negotiate meeting slots rather than checking 'what time is it now'.",
          ],
        },
        {
          heading: "Step-by-step",
          paragraphs: ["Follow these steps on the comparator page:"],
          listItems: [
            "Add at least two countries with the search control.",
            "Tap a row to set the reference country—the anchor for date and time inputs.",
            "Enter a wall date and time or enable live mode to use the current instant.",
            "Read equivalent local times; watch for date rollovers shown on each row.",
            "Adjust countries or reference time until you find an acceptable window.",
          ],
        },
      ],
      es: [
        {
          heading: "Qué resuelve el comparador",
          paragraphs: [
            "Las páginas de país muestran la hora actual en un lugar. El comparador responde otra pregunta: si es una fecha y hora concretas en el país A, ¿cuál es el mismo instante en los demás? Esa simetría importa al negociar horarios de reunión.",
          ],
        },
        {
          heading: "Paso a paso",
          paragraphs: ["Sigue estos pasos en la página del comparador:"],
          listItems: [
            "Añade al menos dos países con el buscador.",
            "Toca una fila para fijar el país de referencia.",
            "Introduce fecha y hora o activa el modo en vivo.",
            "Lee las horas locales equivalentes; observa los cambios de fecha en cada fila.",
            "Ajusta países u hora de referencia hasta encontrar una ventana aceptable.",
          ],
        },
      ],
    },
    faq: {
      en: [
        {
          question: "Can I compare more than four countries?",
          answer: "The UI limits to four rows for readability. Run a second comparison or browse individual country pages for extra zones.",
        },
      ],
      es: [
        {
          question: "¿Puedo comparar más de cuatro países?",
          answer: "La interfaz limita a cuatro filas por legibilidad. Haz una segunda comparación o visita páginas de país individuales.",
        },
      ],
    },
    relatedCountryCodes: ["ES", "US", "MX"],
  },
  {
    slug: "husos-horarios-estados-unidos",
    category: "guide",
    updatedAt: "2026-08-31",
    title: {
      en: "US time zones explained: Eastern to Hawaii",
      es: "Husos horarios de Estados Unidos: del Este a Hawái",
    },
    description: {
      en: "Map the six US time zones, DST exceptions, and scheduling tips for coast-to-coast calls.",
      es: "Mapa de los seis husos de EE. UU., excepciones de verano y consejos para llamadas de costa a costa.",
    },
    sections: {
      en: [
        {
          heading: "Six official zones",
          paragraphs: [
            "The contiguous US uses Eastern, Central, Mountain, and Pacific time. Alaska and Hawaii-Aleutian add two more. Business media often quote Eastern Time even when events happen elsewhere—confirm the city, not only 'US time'.",
          ],
          listItems: [
            "Eastern (New York, Miami) — America/New_York",
            "Central (Chicago, Dallas) — America/Chicago",
            "Mountain (Denver, Phoenix*) — America/Denver / America/Phoenix",
            "Pacific (Los Angeles, Seattle) — America/Los_Angeles",
            "Alaska — America/Anchorage",
            "Hawaii-Aleutian — Pacific/Honolulu",
          ],
        },
        {
          heading: "DST exceptions",
          paragraphs: [
            "Most states spring forward in March and fall back in November. Arizona (except Navajo Nation) and Hawaii do not observe DST. Border cities in Mexico may follow US rules for commerce even when the rest of Mexico does not—always verify both sides.",
          ],
        },
      ],
      es: [
        {
          heading: "Seis zonas oficiales",
          paragraphs: [
            "Los EE. UU. continentales usan hora del Este, Centro, Montaña y Pacífico. Alaska y Hawái-Aleutiano suman dos más. Los medios suelen citar hora del Este aunque el evento sea en otra costa—confirma la ciudad.",
          ],
          listItems: [
            "Este (Nueva York, Miami) — America/New_York",
            "Centro (Chicago, Dallas) — America/Chicago",
            "Montaña (Denver, Phoenix*) — America/Denver / America/Phoenix",
            "Pacífico (Los Ángeles, Seattle) — America/Los_Angeles",
            "Alaska — America/Anchorage",
            "Hawái-Aleutiano — Pacific/Honolulu",
          ],
        },
        {
          heading: "Excepciones de verano",
          paragraphs: [
            "La mayoría de estados adelantan en marzo y retrasan en noviembre. Arizona (salvo Nación Navajo) y Hawái no usan horario de verano.",
          ],
        },
      ],
    },
    faq: {
      en: [
        {
          question: "Is Phoenix on Pacific Time?",
          answer: "Phoenix stays on Mountain Standard Time year-round—same offset as Denver in winter but without summer shift.",
        },
      ],
      es: [
        {
          question: "¿Phoenix está en hora del Pacífico?",
          answer: "Phoenix permanece en hora estándar de Montaña todo el año—mismo desfase que Denver en invierno pero sin cambio de verano.",
        },
      ],
    },
    relatedCountryCodes: ["US", "CA", "MX"],
  },
  {
    slug: "llamar-desde-europa-a-latinoamerica",
    category: "guide",
    updatedAt: "2026-08-31",
    title: {
      en: "Calling Latin America from Europe: practical time windows",
      es: "Llamar desde Europa a Latinoamérica: ventanas horarias prácticas",
    },
    description: {
      en: "Find workable call slots between CET/CEST and Latin American zones without ringing people at night.",
      es: "Encuentra huecos de llamada entre CET/CEST y zonas latinoamericanas sin molestar de noche.",
    },
    sections: {
      en: [
        {
          heading: "Typical offsets",
          paragraphs: [
            "Spain and most of continental Europe run UTC+1 in winter and UTC+2 in summer. Mexico City is usually six or seven hours behind Madrid depending on DST on both continents. Buenos Aires stays at UTC-3 year-round, putting it four to five hours behind Madrid. Bogotá matches US Eastern Standard Time in winter (UTC-5).",
          ],
        },
        {
          heading: "Suggested windows",
          paragraphs: [
            "European morning (09:00–12:00 CET) often maps to early morning in Mexico and mid-morning in Argentina—acceptable for urgent calls if announced ahead. European afternoon (15:00–18:00 CET) hits morning in Mexico City and late morning in São Paulo—usually the best compromise for business.",
            "Avoid European evening slots unless you know the recipient works US hours from Latin America.",
          ],
        },
      ],
      es: [
        {
          heading: "Desfases habituales",
          paragraphs: [
            "España y la mayoría de Europa continental usan UTC+1 en invierno y UTC+2 en verano. Ciudad de México suele ir seis o siete horas detrás de Madrid según el verano en ambos continentes. Buenos Aires permanece en UTC-3 todo el año.",
          ],
        },
        {
          heading: "Ventanas sugeridas",
          paragraphs: [
            "La mañana europea (09:00–12:00 CET) suele coincidir con madrugada en México y media mañana en Argentina. La tarde europea (15:00–18:00 CET) cae en mañana en Ciudad de México y media mañana en São Paulo—suele ser el mejor compromiso.",
          ],
        },
      ],
    },
    faq: {
      en: [
        {
          question: "Does all of Mexico share one clock?",
          answer: "No. Mexico has four zones. Most people use America/Mexico_City, but Quintana Roo and Sonora differ.",
        },
      ],
      es: [
        {
          question: "¿Todo México comparte reloj?",
          answer: "No. México tiene cuatro husos. La mayoría usa America/Mexico_City, pero Quintana Roo y Sonora difieren.",
        },
      ],
    },
    relatedCountryCodes: ["ES", "MX", "AR", "CO"],
  },
  {
    slug: "utc-vs-hora-local",
    category: "guide",
    updatedAt: "2026-08-31",
    title: {
      en: "UTC vs local time: what schedulers need to know",
      es: "UTC frente a hora local: lo que necesitas para coordinar agendas",
    },
    description: {
      en: "Learn when to think in UTC, when to use local wall time, and how IANA zones bridge both.",
      es: "Cuándo pensar en UTC, cuándo en hora local y cómo las zonas IANA conectan ambos.",
    },
    sections: {
      en: [
        {
          heading: "UTC as the shared reference",
          paragraphs: [
            "Coordinated Universal Time (UTC) is the global baseline without daylight saving. Aviation, cloud infrastructure, and science rely on it because it never shifts. Humans, however, live by local wall clocks that do shift. Scheduling tools must convert between the two using zone rules, not by adding a static offset.",
          ],
        },
        {
          heading: "When to display local time",
          paragraphs: [
            "Client calls, school pickups, and restaurant reservations require local time in a named city. UTC alone forces mental math. Countries Time shows local time per IANA zone so '10:00 in Berlin' is unambiguous when rules change.",
          ],
        },
      ],
      es: [
        {
          heading: "UTC como referencia común",
          paragraphs: [
            "El Tiempo Universal Coordinado (UTC) es la línea base global sin horario de verano. La aviación y la infraestructura cloud lo usan porque no cambia. Las personas viven por relojes locales que sí cambian.",
          ],
        },
        {
          heading: "Cuándo mostrar hora local",
          paragraphs: [
            "Llamadas con clientes y reservas requieren hora local en una ciudad nombrada. Countries Time muestra la hora local por zona IANA para que '10:00 en Berlín' sea inequívoca cuando cambian las reglas.",
          ],
        },
      ],
    },
    faq: {
      en: [
        {
          question: "Is GMT the same as UTC?",
          answer: "For scheduling purposes today, yes. GMT is a legacy name; UTC is the modern standard.",
        },
      ],
      es: [
        {
          question: "¿GMT es igual que UTC?",
          answer: "Para agendas actuales, sí. GMT es un nombre heredado; UTC es el estándar moderno.",
        },
      ],
    },
    relatedCountryCodes: ["GB", "US", "DE"],
  },
  {
    slug: "errores-comunes-husos-horarios",
    category: "guide",
    updatedAt: "2026-08-31",
    title: {
      en: "Common time zone mistakes (and how to avoid them)",
      es: "Errores comunes con husos horarios (y cómo evitarlos)",
    },
    description: {
      en: "Seven frequent pitfalls—from 'EST' ambiguity to half-hour offsets—and fixes for each.",
      es: "Siete fallos frecuentes—desde la ambigüedad de 'EST' hasta desfases de media hora—y cómo corregirlos.",
    },
    sections: {
      en: [
        {
          heading: "Mistakes we see often",
          paragraphs: ["Avoid these patterns when coordinating internationally:"],
          listItems: [
            "Using abbreviations like CST or IST without a city—they map to multiple offsets.",
            "Assuming every country observes DST because yours does.",
            "Forgetting date rollovers on late-night calls across the Pacific.",
            "Scheduling India with whole-hour math (UTC+5:30 breaks on-the-hour alignment).",
            "Trusting a printed offset table from five years ago after policy changes.",
            "Listing only 'US' or 'Russia' without a zone when multiple apply.",
            "Setting recurring meetings once and never revisiting DST weeks.",
          ],
        },
      ],
      es: [
        {
          heading: "Errores que vemos a menudo",
          paragraphs: ["Evita estos patrones al coordinar internacionalmente:"],
          listItems: [
            "Usar siglas como CST o IST sin ciudad—mapean a varios desfases.",
            "Asumir que todos observan horario de verano porque tu país sí.",
            "Olvidar cambios de fecha en llamadas nocturnas cruzando el Pacífico.",
            "Programar India con matemática de horas enteras (UTC+5:30 rompe la alineación).",
            "Confiar en tablas impresas tras cambios de política.",
            "Poner solo 'EE. UU.' o 'Rusia' sin zona cuando hay varias.",
            "Fijar reuniones recurrentes una vez y no revisar semanas de cambio de hora.",
          ],
        },
      ],
    },
    faq: {
      en: [
        {
          question: "What is the safest label in calendar invites?",
          answer: "City + IANA zone, e.g. '10:00 Europe/Madrid'.",
        },
      ],
      es: [
        {
          question: "¿Cuál es la etiqueta más segura en invitaciones?",
          answer: "Ciudad + zona IANA, p. ej. '10:00 Europe/Madrid'.",
        },
      ],
    },
    relatedCountryCodes: ["IN", "US", "AU"],
  },
  {
    slug: "diferencia-horaria-espana-mexico",
    category: "comparison",
    updatedAt: "2026-08-31",
    title: {
      en: "Time difference between Spain and Mexico (with examples)",
      es: "Diferencia horaria entre España y México (con ejemplos)",
    },
    description: {
      en: "How many hours ahead is Spain vs Mexico City? Worked examples for calls and meetings.",
      es: "¿Cuántas horas va España respecto a Ciudad de México? Ejemplos para llamadas y reuniones.",
    },
    compareCodes: ["ES", "MX"],
    sections: {
      en: [
        {
          heading: "Quick answer",
          paragraphs: [
            "Mainland Spain is typically six hours ahead of Mexico City in winter and seven hours ahead during weeks when Europe is on summer time but Mexico is not. Always verify on the meeting date—border cities and Quintana Roo differ.",
          ],
        },
        {
          heading: "Examples",
          paragraphs: [
            "When it is 09:00 in Madrid (winter), it is 03:00 in Mexico City. When it is 15:00 in Madrid (summer), it is 08:00 in Mexico City. Use the comparator for the exact date you schedule.",
          ],
        },
      ],
      es: [
        {
          heading: "Respuesta rápida",
          paragraphs: [
            "La España peninsular suele ir seis horas por delante de Ciudad de México en invierno y siete en semanas de verano europeo sin cambio en México. Verifica siempre en la fecha de la reunión.",
          ],
        },
        {
          heading: "Ejemplos",
          paragraphs: [
            "Cuando son las 09:00 en Madrid (invierno), en Ciudad de México son las 03:00. Cuando son las 15:00 en Madrid (verano), en Ciudad de México son las 08:00.",
          ],
        },
      ],
    },
    faq: {
      en: [
        {
          question: "Does Cancún match Mexico City?",
          answer: "Quintana Roo (Cancún) uses Eastern Standard Time year-round—one hour ahead of Mexico City in winter.",
        },
      ],
      es: [
        {
          question: "¿Cancún coincide con Ciudad de México?",
          answer: "Quintana Roo (Cancún) usa hora estándar del Este todo el año—una hora por delante de Ciudad de México en invierno.",
        },
      ],
    },
    relatedCountryCodes: ["ES", "MX"],
  },
  {
    slug: "diferencia-horaria-espana-argentina",
    category: "comparison",
    updatedAt: "2026-08-31",
    title: {
      en: "Time difference between Spain and Argentina",
      es: "Diferencia horaria entre España y Argentina",
    },
    description: {
      en: "Spain vs Buenos Aires offsets year-round with scheduling examples.",
      es: "Desfase España–Buenos Aires durante el año con ejemplos de agenda.",
    },
    compareCodes: ["ES", "AR"],
    sections: {
      en: [
        {
          heading: "Offset summary",
          paragraphs: [
            "Argentina stays on UTC-3 without DST. Spain is UTC+1 in winter and UTC+2 in summer. Expect a four-hour gap in summer and five hours in winter between Madrid and Buenos Aires.",
          ],
        },
        {
          heading: "Meeting example",
          paragraphs: [
            "A 10:00 Madrid meeting is 05:00 in Buenos Aires in winter—too early for most offices. Try 15:00 Madrid (10:00 in Buenos Aires) instead.",
          ],
        },
      ],
      es: [
        {
          heading: "Resumen de desfase",
          paragraphs: [
            "Argentina permanece en UTC-3 sin horario de verano. España usa UTC+1 en invierno y UTC+2 en verano. Espera cuatro horas de diferencia en verano y cinco en invierno entre Madrid y Buenos Aires.",
          ],
        },
        {
          heading: "Ejemplo de reunión",
          paragraphs: [
            "Una reunión a las 10:00 en Madrid son las 05:00 en Buenos Aires en invierno—demasiado temprano. Prueba 15:00 Madrid (10:00 en Buenos Aires).",
          ],
        },
      ],
    },
    faq: {
      en: [
        {
          question: "Did Argentina abolish DST?",
          answer: "Yes. Argentina has not observed seasonal clock changes for years.",
        },
      ],
      es: [
        {
          question: "¿Argentina eliminó el horario de verano?",
          answer: "Sí. Argentina no aplica cambios estacionales desde hace años.",
        },
      ],
    },
    relatedCountryCodes: ["ES", "AR"],
  },
  {
    slug: "diferencia-horaria-espana-colombia",
    category: "comparison",
    updatedAt: "2026-08-31",
    title: {
      en: "Time difference between Spain and Colombia",
      es: "Diferencia horaria entre España y Colombia",
    },
    description: {
      en: "Madrid vs Bogotá: fixed UTC-5 in Colombia and seasonal shifts in Spain.",
      es: "Madrid vs Bogotá: UTC-5 fijo en Colombia y cambios estacionales en España.",
    },
    compareCodes: ["ES", "CO"],
    sections: {
      en: [
        {
          heading: "Quick answer",
          paragraphs: [
            "Colombia uses America/Bogota (UTC-5) all year. Spain is six hours ahead in winter and seven in summer. A 09:00 Bogotá call is 15:00 Madrid in winter.",
          ],
        },
      ],
      es: [
        {
          heading: "Respuesta rápida",
          paragraphs: [
            "Colombia usa America/Bogota (UTC-5) todo el año. España va seis horas por delante en invierno y siete en verano. Una llamada a las 09:00 en Bogotá son las 15:00 en Madrid en invierno.",
          ],
        },
      ],
    },
    faq: {
      en: [
        {
          question: "Does Colombia match US Eastern?",
          answer: "In winter yes (EST). During US summer, Colombia aligns with US Central if the US is on EDT.",
        },
      ],
      es: [
        {
          question: "¿Colombia coincide con el Este de EE. UU.?",
          answer: "En invierno sí (EST). En verano de EE. UU., Colombia se alinea con hora central si EE. UU. está en EDT.",
        },
      ],
    },
    relatedCountryCodes: ["ES", "CO"],
  },
  {
    slug: "diferencia-horaria-estados-unidos-reino-unido",
    category: "comparison",
    updatedAt: "2026-08-31",
    title: {
      en: "Time difference between the United States and the United Kingdom",
      es: "Diferencia horaria entre Estados Unidos y Reino Unido",
    },
    description: {
      en: "US Eastern vs London: how DST on both sides changes the gap.",
      es: "Este de EE. UU. vs Londres: cómo el verano en ambos lados cambia la diferencia.",
    },
    compareCodes: ["US", "GB"],
    sections: {
      en: [
        {
          heading: "Quick answer",
          paragraphs: [
            "New York and London are five hours apart in winter (EST vs GMT) and four hours apart when both observe summer time. For a few weeks each spring and autumn the gap is different because US and EU switch on different Sundays.",
          ],
        },
      ],
      es: [
        {
          heading: "Respuesta rápida",
          paragraphs: [
            "Nueva York y Londres están cinco horas separadas en invierno y cuatro cuando ambos usan horario de verano. Durante unas semanas en primavera y otoño la diferencia varía porque UE y EE. UU. cambian en domingos distintos.",
          ],
        },
      ],
    },
    faq: {
      en: [
        {
          question: "Is London always one hour behind Paris?",
          answer: "In winter yes (GMT vs CET). In summer BST matches Central European Time.",
        },
      ],
      es: [
        {
          question: "¿Londres va siempre una hora detrás de París?",
          answer: "En invierno sí (GMT vs CET). En verano BST coincide con Europa central.",
        },
      ],
    },
    relatedCountryCodes: ["US", "GB"],
  },
  {
    slug: "diferencia-horaria-estados-unidos-japon",
    category: "comparison",
    updatedAt: "2026-08-31",
    title: {
      en: "Time difference between the United States and Japan",
      es: "Diferencia horaria entre Estados Unidos y Japón",
    },
    description: {
      en: "Tokyo vs US Eastern and Pacific with fixed JST year-round.",
      es: "Tokio vs Este y Pacífico de EE. UU. con JST fijo todo el año.",
    },
    compareCodes: ["US", "JP"],
    sections: {
      en: [
        {
          heading: "Quick answer",
          paragraphs: [
            "Japan (JST, UTC+9) does not observe DST. US Eastern is 14 hours behind Tokyo in winter and 13 in summer. Pacific is 17 hours behind in winter. Morning in Tokyo is evening the previous day in California.",
          ],
        },
      ],
      es: [
        {
          heading: "Respuesta rápida",
          paragraphs: [
            "Japón (JST, UTC+9) no usa horario de verano. El Este de EE. UU. va 14 horas detrás de Tokio en invierno y 13 en verano. La mañana en Tokio es tarde del día anterior en California.",
          ],
        },
      ],
    },
    faq: {
      en: [
        {
          question: "Best overlap for US West Coast and Tokyo?",
          answer: "US evening (17:00–19:00 Pacific) is morning next day in Tokyo—confirm the calendar date on both sides.",
        },
      ],
      es: [
        {
          question: "¿Mejor solape Costa Oeste EE. UU.–Tokio?",
          answer: "Tarde en EE. UU. (17:00–19:00 Pacífico) es mañana del día siguiente en Tokio—confirma la fecha en ambos lados.",
        },
      ],
    },
    relatedCountryCodes: ["US", "JP"],
  },
  {
    slug: "diferencia-horaria-reino-unido-india",
    category: "comparison",
    updatedAt: "2026-08-31",
    title: {
      en: "Time difference between the UK and India",
      es: "Diferencia horaria entre Reino Unido e India",
    },
    description: {
      en: "London vs India UTC+5:30 half-hour offset explained.",
      es: "Londres vs India UTC+5:30: el desfase de media hora explicado.",
    },
    compareCodes: ["GB", "IN"],
    sections: {
      en: [
        {
          heading: "Quick answer",
          paragraphs: [
            "India uses a single UTC+5:30 offset with no DST. London is five and a half hours behind India in winter (GMT) and four and a half in summer (BST). Meetings rarely align on the hour—use the comparator.",
          ],
        },
      ],
      es: [
        {
          heading: "Respuesta rápida",
          paragraphs: [
            "India usa UTC+5:30 sin horario de verano. Londres va cinco horas y media detrás de India en invierno y cuatro y media en verano. Las reuniones rara vez coinciden en punto—usa el comparador.",
          ],
        },
      ],
    },
    faq: {
      en: [
        {
          question: "Why half-hour offsets?",
          answer: "Historical adoption choices; India unified on +5:30 for national simplicity.",
        },
      ],
      es: [
        {
          question: "¿Por qué desfases de media hora?",
          answer: "Decisiones históricas; India unificó +5:30 por simplicidad nacional.",
        },
      ],
    },
    relatedCountryCodes: ["GB", "IN"],
  },
  {
    slug: "diferencia-horaria-alemania-estados-unidos",
    category: "comparison",
    updatedAt: "2026-08-31",
    title: {
      en: "Time difference between Germany and the United States",
      es: "Diferencia horaria entre Alemania y Estados Unidos",
    },
    description: {
      en: "Berlin vs US Eastern and Central for transatlantic meetings.",
      es: "Berlín vs Este y Centro de EE. UU. para reuniones transatlánticas.",
    },
    compareCodes: ["DE", "US"],
    sections: {
      en: [
        {
          heading: "Quick answer",
          paragraphs: [
            "Germany (CET/CEST) is six hours ahead of US Eastern in winter and five in summer. Afternoon in Berlin is morning in New York—popular for finance and engineering stand-ups.",
          ],
        },
      ],
      es: [
        {
          heading: "Respuesta rápida",
          paragraphs: [
            "Alemania (CET/CEST) va seis horas por delante del Este de EE. UU. en invierno y cinco en verano. La tarde en Berlín es mañana en Nueva York.",
          ],
        },
      ],
    },
    faq: {
      en: [
        {
          question: "Does Germany match Spain?",
          answer: "Yes on the peninsula—both use Central European Time.",
        },
      ],
      es: [
        {
          question: "¿Alemania coincide con España?",
          answer: "Sí en península—ambos usan hora de Europa central.",
        },
      ],
    },
    relatedCountryCodes: ["DE", "US"],
  },
  {
    slug: "diferencia-horaria-australia-reino-unido",
    category: "comparison",
    updatedAt: "2026-08-31",
    title: {
      en: "Time difference between Australia and the United Kingdom",
      es: "Diferencia horaria entre Australia y Reino Unido",
    },
    description: {
      en: "Sydney vs London across DST seasons in both hemispheres.",
      es: "Sídney vs Londres según el verano en ambos hemisferios.",
    },
    compareCodes: ["AU", "GB"],
    sections: {
      en: [
        {
          heading: "Quick answer",
          paragraphs: [
            "Sydney is ten to eleven hours ahead of London depending on whether each side is on summer time. European morning often equals Sydney evening the same calendar day.",
          ],
        },
      ],
      es: [
        {
          heading: "Respuesta rápida",
          paragraphs: [
            "Sídney va diez u once horas por delante de Londres según el verano en cada hemisferio. La mañana europea suele ser tarde en Sídney el mismo día calendario.",
          ],
        },
      ],
    },
    faq: {
      en: [
        {
          question: "Does all of Australia share DST?",
          answer: "No. Queensland does not observe DST; Sydney and Melbourne do.",
        },
      ],
      es: [
        {
          question: "¿Toda Australia comparte el verano?",
          answer: "No. Queensland no usa horario de verano; Sídney y Melbourne sí.",
        },
      ],
    },
    relatedCountryCodes: ["AU", "GB"],
  },
  {
    slug: "diferencia-horaria-mexico-brasil",
    category: "comparison",
    updatedAt: "2026-08-31",
    title: {
      en: "Time difference between Mexico and Brazil",
      es: "Diferencia horaria entre México y Brasil",
    },
    description: {
      en: "Mexico City vs São Paulo for Latin American coordination.",
      es: "Ciudad de México vs São Paulo para coordinación latinoamericana.",
    },
    compareCodes: ["MX", "BR"],
    sections: {
      en: [
        {
          heading: "Quick answer",
          paragraphs: [
            "Mexico City (Central) is typically two hours behind São Paulo (UTC-3). Both regions have complex DST history—verify on the meeting date.",
          ],
        },
      ],
      es: [
        {
          heading: "Respuesta rápida",
          paragraphs: [
            "Ciudad de México (Centro) suele ir dos horas detrás de São Paulo (UTC-3). Ambas regiones tienen historial complejo de verano—verifica en la fecha de la reunión.",
          ],
        },
      ],
    },
    faq: {
      en: [
        {
          question: "Does Brazil still use DST?",
          answer: "National DST ended in 2019; states may differ for border commerce.",
        },
      ],
      es: [
        {
          question: "¿Brasil sigue usando horario de verano?",
          answer: "El verano nacional terminó en 2019; estados fronterizos pueden variar.",
        },
      ],
    },
    relatedCountryCodes: ["MX", "BR"],
  },
  {
    slug: "diferencia-horaria-corea-japon",
    category: "comparison",
    updatedAt: "2026-08-31",
    title: {
      en: "Time difference between South Korea and Japan",
      es: "Diferencia horaria entre Corea del Sur y Japón",
    },
    description: {
      en: "Seoul and Tokyo share JST/KST year-round alignment.",
      es: "Seúl y Tokio comparten alineación KST/JST todo el año.",
    },
    compareCodes: ["KR", "JP"],
    sections: {
      en: [
        {
          heading: "Quick answer",
          paragraphs: [
            "South Korea and Japan both use UTC+9 without daylight saving. Business hours align one-to-one—scheduling between Seoul and Tokyo is among the simplest international pairs.",
          ],
        },
      ],
      es: [
        {
          heading: "Respuesta rápida",
          paragraphs: [
            "Corea del Sur y Japón usan UTC+9 sin horario de verano. Los horarios laborales coinciden uno a uno—agendar entre Seúl y Tokio es de los pares internacionales más simples.",
          ],
        },
      ],
    },
    faq: {
      en: [
        {
          question: "Any seasonal shift?",
          answer: "Neither country shifts clocks; offset is fixed year-round.",
        },
      ],
      es: [
        {
          question: "¿Algún cambio estacional?",
          answer: "Ningún país cambia el reloj; el desfase es fijo todo el año.",
        },
      ],
    },
    relatedCountryCodes: ["KR", "JP"],
  },
];

export const GUIDE_SLUGS = GUIDE_ARTICLES.map((article) => article.slug);

export function getGuideBySlug(slug: string): GuideArticle | null {
  return GUIDE_ARTICLES.find((article) => article.slug === slug) ?? null;
}

export function listComparisonGuides(): readonly GuideArticle[] {
  return GUIDE_ARTICLES.filter((article) => article.category === "comparison");
}
