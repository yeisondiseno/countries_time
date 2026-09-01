import fs from "node:fs";
import path from "node:path";

const patches = {
  de: {
    country: {
      compareWithTitle: "Vergleichen mit",
      dstNotesHeading: "Sommerzeit und saisonale Änderungen",
      practicalTipHeading: "Praktischer Tipp",
      relatedCountriesTitle: "Verwandte Länder",
    },
    footer: { guidesLink: "Ratgeber", aboutLink: "Über uns" },
    homeFaq: {
      seoFaqQ4: "Woher stammen die Zeitdaten?",
      seoFaqA4:
        "Wir rechnen einen UTC-Zeitpunkt mit IANA-Zonen (zoneinfo) um, einschließlich Sommerzeitregeln aus der tz-Datenbank.",
      seoFaqQ5: "Ersetzt Countries Time die amtliche Zeit?",
      seoFaqA5:
        "Nein. Wir bieten eine unabhängige Referenz für den Alltag. Für rechtsverbindliche Zeitstempel nutzen Sie offizielle Quellen.",
      seoFaqQ6: "Kann ich mehr als vier Länder vergleichen?",
      seoFaqA6:
        "Der Vergleich unterstützt zwei bis vier Länder gleichzeitig. Starten Sie einen zweiten Vergleich oder nutzen Sie Einzelländerseiten.",
      seoGuidesTitle: "Zeitzonen-Ratgeber",
      seoGuidesIntro:
        "Artikel zu Sommerzeit, internationalen Meetings und Zeitunterschieden zwischen Ländern.",
      seoGuidesLink: "Alle Ratgeber ansehen",
      seoGuideFeatured1: "Internationale Meetings planen",
      seoGuideFeatured2: "Zeitunterschied Spanien–Mexiko",
      seoGuideFeatured3: "Was ist Sommerzeit?",
      seoFeaturedClocksTitle: "Live-Uhren — häufig aufgerufen",
    },
    about: {
      exploreGuides: "Zeitzonen-Ratgeber",
      maintainerTitle: "Wer betreibt diese Seite",
      maintainerBody:
        "Countries Time wird von einem unabhängigen Team betrieben. Korrekturen sind über die Kontaktseite willkommen.",
      dataUpdatedTitle: "Aktualität der Daten",
      dataUpdatedBody:
        "Zonen und Sommerzeitregeln folgen der IANA-tz-Datenbank und werden bei offiziellen Updates geprüft.",
    },
    guides: {
      indexMetaTitle: "Zeitzonen-Ratgeber · Countries Time",
      indexMetaDescription:
        "Praktische Ratgeber zu Sommerzeit, internationalen Meetings und Zeitunterschieden.",
      indexTitle: "Zeitzonen-Ratgeber",
      indexIntro: "Redaktionelle Artikel für fehlerfreie internationale Terminplanung.",
      badgeGuide: "Ratgeber",
      badgeComparison: "Vergleich",
      updatedLabel: "Zuletzt aktualisiert",
      faqTitle: "Häufig gestellte Fragen",
      relatedLinksLabel: "Verwandte Links",
      openComparator: "Vergleich öffnen",
      backToGuides: "Alle Ratgeber",
      relatedCountriesTitle: "Verwandte Länder",
    },
    cookie: {
      message:
        "Wir nutzen essenzielle Cookies. Nicht essenzielle Cookies laden wir in der EU/UK nur mit Ihrer Einwilligung.",
      accept: "Akzeptieren",
      reject: "Nur essenziell",
      ariaLabel: "Cookie-Einwilligung",
    },
  },
  pt: {
    country: { compareWithTitle: "Comparar com", dstNotesHeading: "Horário de verão e mudanças sazonais", practicalTipHeading: "Dica prática", relatedCountriesTitle: "Países relacionados" },
    footer: { guidesLink: "Guias", aboutLink: "Sobre" },
    homeFaq: { seoFaqQ4: "De onde vêm os dados horários?", seoFaqA4: "Convertemos um instante UTC com identificadores IANA (zoneinfo), incluindo transições da base tz.", seoFaqQ5: "O Countries Time substitui a hora oficial?", seoFaqA5: "Não. Oferecemos uma referência independente. Para registos legais, use fontes oficiais.", seoFaqQ6: "Posso comparar mais de quatro países?", seoFaqA6: "O comparador aceita dois a quatro países. Faça uma segunda comparação ou visite páginas de país.", seoGuidesTitle: "Guias de fusos horários", seoGuidesIntro: "Artigos sobre horário de verão e diferenças horárias.", seoGuidesLink: "Ver todos os guias", seoGuideFeatured1: "Reuniões internacionais", seoGuideFeatured2: "Diferença Espanha–México", seoGuideFeatured3: "Horário de verão", seoFeaturedClocksTitle: "Relógios ao vivo — mais vistos" },
    about: { exploreGuides: "Guias de fusos horários", maintainerTitle: "Quem mantém este site", maintainerBody: "Equipa independente. Correções via contacto.", dataUpdatedTitle: "Atualização dos dados", dataUpdatedBody: "Dados IANA tz revistos nas publicações oficiais." },
    guides: { indexMetaTitle: "Guias · Countries Time", indexMetaDescription: "Guias práticos de fusos horários.", indexTitle: "Guias de fusos horários", indexIntro: "Artigos para coordenar agendas internacionais.", badgeGuide: "Guia", badgeComparison: "Comparação", updatedLabel: "Última atualização", faqTitle: "Perguntas frequentes", relatedLinksLabel: "Links relacionados", openComparator: "Abrir comparador", backToGuides: "Todos os guias", relatedCountriesTitle: "Países relacionados" },
    cookie: { message: "Cookies essenciais. Não essenciais só com consentimento na UE/Reino Unido.", accept: "Aceitar", reject: "Apenas essenciais", ariaLabel: "Consentimento de cookies" },
  },
  it: {
    country: { compareWithTitle: "Confronta con", dstNotesHeading: "Ora legale e cambi stagionali", practicalTipHeading: "Suggerimento pratico", relatedCountriesTitle: "Paesi correlati" },
    footer: { guidesLink: "Guide", aboutLink: "Chi siamo" },
    homeFaq: { seoFaqQ4: "Da dove provengono i dati orari?", seoFaqA4: "Convertiamo un istante UTC con identificatori IANA (zoneinfo).", seoFaqQ5: "Countries Time sostituisce l'ora ufficiale?", seoFaqA5: "No. Riferimento indipendente per uso quotidiano.", seoFaqQ6: "Posso confrontare più di quattro paesi?", seoFaqA6: "Il comparatore supporta da due a quattro paesi.", seoGuidesTitle: "Guide sui fusi orari", seoGuidesIntro: "Articoli su ora legale e differenze orarie.", seoGuidesLink: "Tutte le guide", seoGuideFeatured1: "Riunioni internazionali", seoGuideFeatured2: "Differenza Spagna–Messico", seoGuideFeatured3: "Ora legale", seoFeaturedClocksTitle: "Orologi live — più visitati" },
    about: { exploreGuides: "Guide sui fusi orari", maintainerTitle: "Chi mantiene il sito", maintainerBody: "Team indipendente. Correzioni via contatto.", dataUpdatedTitle: "Aggiornamento dati", dataUpdatedBody: "Database IANA tz." },
    guides: { indexMetaTitle: "Guide · Countries Time", indexMetaDescription: "Guide pratiche sui fusi orari.", indexTitle: "Guide sui fusi orari", indexIntro: "Articoli per coordinare agenda internazionali.", badgeGuide: "Guida", badgeComparison: "Confronto", updatedLabel: "Ultimo aggiornamento", faqTitle: "Domande frequenti", relatedLinksLabel: "Link correlati", openComparator: "Apri comparatore", backToGuides: "Tutte le guide", relatedCountriesTitle: "Paesi correlati" },
    cookie: { message: "Cookie essenziali. Non essenziali solo con consenso in UE/UK.", accept: "Accetta", reject: "Solo essenziali", ariaLabel: "Consenso cookie" },
  },
  ja: {
    country: { compareWithTitle: "比較", dstNotesHeading: "夏時間と季節の変化", practicalTipHeading: "実用的なヒント", relatedCountriesTitle: "関連国" },
    footer: { guidesLink: "ガイド", aboutLink: "概要" },
    homeFaq: { seoFaqQ4: "時刻データの出所は？", seoFaqA4: "IANA タイムゾーンで UTC を変換します。", seoFaqQ5: "公式時刻の代替ですか？", seoFaqA5: "いいえ。日常用の独立参照です。", seoFaqQ6: "4か国以上比較できますか？", seoFaqA6: "比較ツールは2〜4か国までです。", seoGuidesTitle: "タイムゾーンガイド", seoGuidesIntro: "夏時間と国際会議の記事。", seoGuidesLink: "すべてのガイド", seoGuideFeatured1: "国際会議", seoGuideFeatured2: "スペインとメキシコ", seoGuideFeatured3: "夏時間", seoFeaturedClocksTitle: "ライブ時計" },
    about: { exploreGuides: "タイムゾーンガイド", maintainerTitle: "運営者", maintainerBody: "独立チームが運営。修正はお問い合わせへ。", dataUpdatedTitle: "データ更新", dataUpdatedBody: "IANA tz データベースに準拠。" },
    guides: { indexMetaTitle: "ガイド · Countries Time", indexMetaDescription: "タイムゾーンの実用ガイド。", indexTitle: "タイムゾーンガイド", indexIntro: "国際予定のための記事。", badgeGuide: "ガイド", badgeComparison: "比較", updatedLabel: "最終更新", faqTitle: "よくある質問", relatedLinksLabel: "関連リンク", openComparator: "比較を開く", backToGuides: "すべてのガイド", relatedCountriesTitle: "関連国" },
    cookie: { message: "必須 Cookie を使用。非必須は EU/英国で同意後に読み込み。", accept: "同意する", reject: "必須のみ", ariaLabel: "Cookie 同意" },
  },
  ko: {
    country: { compareWithTitle: "비교", dstNotesHeading: "서머타임 및 계절 변화", practicalTipHeading: "실용 팁", relatedCountriesTitle: "관련 국가" },
    footer: { guidesLink: "가이드", aboutLink: "소개" },
    homeFaq: { seoFaqQ4: "시간 데이터 출처는?", seoFaqA4: "IANA 시간대로 UTC를 변환합니다.", seoFaqQ5: "공식 시간 대체인가요?", seoFaqA5: "아니요. 일상용 독립 참고입니다.", seoFaqQ6: "4개 이상 비교 가능?", seoFaqA6: "비교 도구는 2~4개 국가까지입니다.", seoGuidesTitle: "시간대 가이드", seoGuidesIntro: "서머타임과 국제 회의 글.", seoGuidesLink: "모든 가이드", seoGuideFeatured1: "국제 회의", seoGuideFeatured2: "스페인–멕시코", seoGuideFeatured3: "서머타임", seoFeaturedClocksTitle: "라이브 시계" },
    about: { exploreGuides: "시간대 가이드", maintainerTitle: "운영 주체", maintainerBody: "독립 팀 운영. 수정은 문의로.", dataUpdatedTitle: "데이터 최신성", dataUpdatedBody: "IANA tz 데이터베이스 준수." },
    guides: { indexMetaTitle: "가이드 · Countries Time", indexMetaDescription: "시간대 실용 가이드.", indexTitle: "시간대 가이드", indexIntro: "국제 일정 조율 글.", badgeGuide: "가이드", badgeComparison: "비교", updatedLabel: "최종 업데이트", faqTitle: "자주 묻는 질문", relatedLinksLabel: "관련 링크", openComparator: "비교 열기", backToGuides: "모든 가이드", relatedCountriesTitle: "관련 국가" },
    cookie: { message: "필수 쿠키 사용. 비필수는 EU/영국에서 동의 후 로드.", accept: "동의", reject: "필수만", ariaLabel: "쿠키 동의" },
  },
};

for (const [locale, p] of Object.entries(patches)) {
  const file = path.join("messages", `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  Object.assign(data.Country, p.country);
  Object.assign(data.Footer, p.footer);
  Object.assign(data.Home, p.homeFaq);
  Object.assign(data.About, p.about);
  data.Guides = p.guides;
  data.CookieConsent = p.cookie;
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  console.log("patched", locale);
}
