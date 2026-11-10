/* SEO landing pages. Each entry becomes its own static HTML file at build time (vite.config.js)
   with its own <title>, description, canonical, hreflang, H1, intro and JSON-LD.
   The app opens the matching view: tab = top | categories | us | list | calendar | retailers | guide;
   cat = category name (categories / us tab); q = search term.
   Swiss German spelling: "ss", never "ß". Keyword research: Oct 2026. */

export const LOCALE = { de: "de_CH", fr: "fr_CH", it: "it_CH", en: "en_CH" };
export const HREFLANG = { de: "de-CH", fr: "fr-CH", it: "it-CH", en: "en" };

export const PAGES = [
  { path: "/", lang: "en", group: "home", tab: "top", priority: 1.0,
    title: "Black Friday Switzerland 2026: Best Deals in CHF | Aktion.ch",
    description: "Black Friday 2026 is 27 Nov. Top 100 Swiss deals in CHF with price history and a buy-or-wait call. Black Week, Cyber Monday and US deals.",
    h1: "Black Friday Switzerland 2026: the best deals in CHF",
    intro: "Black Friday is on Friday 27 November 2026, with Black Week from Monday 23 November and Cyber Monday on 30 November. We track the 100 most-wanted products at Swiss shops, compare today's price with Black Week 2025 and the record low, and tell you whether to buy now or wait. Plus 2,400+ products by category, winter tyres and US deals." },

  { path: "/de/black-friday-schweiz-2026/", lang: "de", group: "home", tab: "top", priority: 1.0,
    title: "Black Friday Schweiz 2026: Beste Deals in CHF | Aktion.ch",
    description: "Black Friday 2026 am 27.11.: Top-100-Deals mit CHF-Preisen, Preisverlauf und Kaufen-oder-Warten-Check. Black Week, Cyber Monday & USA-Deals.",
    h1: "Black Friday Schweiz 2026: alle Angebote, Daten und Preise",
    intro: "Black Friday ist am Freitag, 27. November 2026. Die Black Week startet am Montag, 23. November, Cyber Monday folgt am 30. November. Wir verfolgen die 100 gefragtesten Produkte in Schweizer Shops, vergleichen den heutigen Preis mit der Black Week 2025 und dem Tiefstpreis und sagen dir, ob du jetzt kaufen oder warten solltest." },

  { path: "/fr/black-friday-suisse-2026/", lang: "fr", group: "home", tab: "top", priority: 0.9,
    title: "Black Friday Suisse 2026 : offres en CHF | Aktion.ch",
    description: "Black Friday 2026 le 27.11 : top 100 des offres en CHF, historique des prix et conseil acheter ou attendre. Black Week et Cyber Monday.",
    h1: "Black Friday Suisse 2026 : offres, dates et prix",
    intro: "Le Black Friday a lieu le vendredi 27 novembre 2026. La Black Week commence le lundi 23 novembre et le Cyber Monday suit le 30 novembre. Nous suivons les 100 produits les plus recherchés dans les boutiques suisses, comparons le prix du jour avec la Black Week 2025 et le prix le plus bas, et vous disons s'il vaut mieux acheter maintenant ou attendre." },

  { path: "/it/black-friday-svizzera-2026/", lang: "it", group: "home", tab: "top", priority: 0.9,
    title: "Black Friday Svizzera 2026: offerte in CHF | Aktion.ch",
    description: "Black Friday 2026 il 27.11: le 100 migliori offerte in CHF, storico prezzi e consiglio comprare o aspettare. Black Week e Cyber Monday.",
    h1: "Black Friday Svizzera 2026: offerte, date e prezzi",
    intro: "Il Black Friday è venerdì 27 novembre 2026. La Black Week inizia lunedì 23 novembre e il Cyber Monday segue il 30 novembre. Seguiamo i 100 prodotti più richiesti nei negozi svizzeri, confrontiamo il prezzo di oggi con la Black Week 2025 e il prezzo minimo e ti diciamo se conviene comprare subito o aspettare." },

  { path: "/en/black-friday-switzerland-2026/", lang: "en", group: "home", tab: "top", priority: 0.9,
    title: "Black Friday Switzerland 2026: Deals & Dates | Aktion.ch",
    description: "All Black Friday 2026 deals in Switzerland: top 100 offers in CHF, Black Week and Cyber Monday dates, retailer guide and US deals for expats.",
    h1: "Black Friday Switzerland 2026: deals, dates and prices",
    intro: "Black Friday is on Friday 27 November 2026, Black Week starts on Monday 23 November and Cyber Monday is on 30 November. Our top 100 compares today's Swiss price with Black Week 2025 and the record low, so you know whether a deal is real." },

  { path: "/de/black-week-schweiz-2026/", lang: "de", tab: "calendar", priority: 0.8,
    title: "Black Week Schweiz 2026 (23.–29.11.): Händler & Deals",
    description: "Black Week 2026 in der Schweiz: wann Galaxus, Digitec, Brack, Interdiscount, MediaMarkt und Amazon starten – mit Kalender und Top-Deals.",
    h1: "Black Week Schweiz 2026 (23.–29. November): Händler und Deals",
    intro: "Die meisten Schweizer Händler ziehen ihre Black-Friday-Angebote auf die ganze Woche vom 23. bis 29. November 2026 vor. Im Kalender siehst du, wann welcher Shop startet; die Top-100-Liste zeigt, welche Preise schon heute gut sind." },

  { path: "/de/cyber-monday-schweiz-2026/", lang: "de", tab: "calendar", priority: 0.7,
    title: "Cyber Monday Schweiz 2026 (30.11.): Angebote | Aktion.ch",
    description: "Cyber Monday 2026 ist am 30. November. Welche Schweizer Shops verlängern ihre Black-Friday-Preise und welche Deals sich noch lohnen.",
    h1: "Cyber Monday Schweiz 2026 (30.11.): Angebote",
    intro: "Cyber Monday fällt 2026 auf den 30. November. Viele Schweizer Onlineshops verlängern ihre Black-Friday-Preise bis Montagabend; Elektronik und Technik sind oft nochmals reduziert." },

  { path: "/de/black-friday-2026-datum/", lang: "de", tab: "calendar", priority: 0.8,
    title: "Wann ist Black Friday 2026? Datum Schweiz | Aktion.ch",
    description: "Black Friday 2026 ist am Freitag, 27. November. Black Week ab 23.11., Cyber Monday am 30.11., Singles Day am 11.11. – alle Daten im Überblick.",
    h1: "Wann ist Black Friday 2026? Datum, Black Week, Cyber Monday",
    intro: "Black Friday 2026 ist am Freitag, 27. November – immer der Tag nach dem US-Feiertag Thanksgiving (26. November). Die Black Week läuft vom 23. bis 29. November, Cyber Monday ist am 30. November und Singles Day am 11. November." },

  { path: "/de/black-friday-fernseher-schweiz/", lang: "de", tab: "categories", cat: "TV", priority: 0.7,
    title: "Black Friday Fernseher Schweiz 2026: TV-Deals | Aktion.ch",
    description: "OLED- und QLED-Fernseher am Black Friday 2026: LG, Samsung, Sony und Hisense im Preisvergleich bei Schweizer Shops.",
    h1: "Black Friday Fernseher Schweiz 2026: TV-Deals im Vergleich",
    intro: "Fernseher gehören zu den grössten Black-Friday-Rabatten. Hier findest du OLED-, QLED- und Mini-LED-Modelle von LG, Samsung, Sony, Hisense und TCL mit Links zu Schweizer Shops." },

  { path: "/de/black-friday-iphone-schweiz/", lang: "de", tab: "top", q: "iPhone", priority: 0.7,
    title: "Black Friday iPhone Schweiz 2026: lohnt Warten? | Aktion.ch",
    description: "iPhone 17, iPhone Air und iPhone 16 am Black Friday 2026: heutiger CHF-Preis, Tiefstpreis und unsere Empfehlung kaufen oder warten.",
    h1: "Black Friday iPhone Schweiz 2026: kaufen oder warten?",
    intro: "Apple selbst reduziert kaum, die Händler schon: Bei Digitec, Galaxus, Interdiscount und Amazon.de fallen iPhones in der Black Week oft unter den bisherigen Tiefstpreis. Wir zeigen den heutigen Preis und das Kaufziel." },

  { path: "/de/black-friday-konsolen-schweiz/", lang: "de", tab: "categories", cat: "Gaming", priority: 0.7,
    title: "Black Friday PS5 & Switch 2 Schweiz 2026 | Aktion.ch",
    description: "PlayStation 5, PS5 Pro, Nintendo Switch 2, Xbox und Spiele am Black Friday 2026: Preise in CHF und Shops im Überblick.",
    h1: "Black Friday Konsolen Schweiz 2026: PS5, Switch 2 und Xbox",
    intro: "Konsolen-Bundles, Controller und Spiele sind am Black Friday besonders gefragt. Hier findest du PlayStation 5, Nintendo Switch 2 und Xbox mit Links zu Schweizer Shops." },

  { path: "/de/black-friday-haushalt-schweiz/", lang: "de", tab: "categories", cat: "Home", priority: 0.6,
    title: "Black Friday Haushalt 2026: Dyson & Saugroboter | Aktion.ch",
    description: "Dyson, Saugroboter, Kaffeevollautomaten und Küchengeräte am Black Friday 2026: Angebote und Preise in CHF bei Schweizer Shops im Überblick.",
    h1: "Black Friday Haushalt: Dyson, Saugroboter und Kaffee",
    intro: "Akkusauger, Saugroboter und Kaffeevollautomaten sind die Haushalts-Klassiker der Black Week. Hier findest du Dyson, Roborock, iRobot, Jura, De'Longhi und mehr." },

  { path: "/de/black-friday-winterreifen-schweiz/", lang: "de", tab: "categories", cat: "Winter tyres", priority: 0.6,
    title: "Black Friday Winterreifen Schweiz 2026 | Aktion.ch",
    description: "Winterreifen 2026 günstig kaufen: Michelin, Continental, Bridgestone und Pirelli bei reifen-online.ch, mit Montage in der Schweiz.",
    h1: "Black Friday Winterreifen Schweiz 2026",
    intro: "Von Oktober bis Ostern gilt in der Schweiz: Wer mit ungeeigneten Reifen unterwegs ist, haftet bei Unfällen mit. Bei reifen-online.ch findest du Winterreifen aller Grössen mit Lieferung an eine Montagegarage." },

  { path: "/de/black-friday-usa-schweiz/", lang: "de", tab: "us", priority: 0.6,
    title: "Black Friday USA aus der Schweiz: Deals, Zoll & MWST",
    description: "US-Black-Friday-Deals 2026 in USD: Apple, TVs, Konsolen. Was du beim Bestellen aus der Schweiz zu Zoll, MWST und Garantie wissen musst.",
    h1: "Black Friday USA: Deals und was du aus der Schweiz beachten musst",
    intro: "Amazon.com, Best Buy, Walmart und Target liefern meist nicht in die Schweiz. Bei Import fallen 8,1 % MWST plus Verzollungsgebühren an, US-Stecker und US-Garantie gelten. Die Preise zeigen die US-Black-Friday-Preise 2025 als Richtwert." },

  { path: "/de/lohnt-sich-black-friday/", lang: "de", tab: "guide", priority: 0.6,
    title: "Lohnt sich Black Friday? Fake-Rabatte erkennen | Aktion.ch",
    description: "So erkennst du falsche Rabatte am Black Friday: Preisverlauf prüfen, Tiefstpreise vergleichen, Rückgaberecht und Garantie in der Schweiz.",
    h1: "Lohnt sich Black Friday in der Schweiz? Fake-Rabatte erkennen",
    intro: "Viele «Rabatte» beziehen sich auf einen Listenpreis, den kaum jemand zahlt. Vergleiche deshalb immer mit dem Preis der letzten Wochen und dem bisherigen Tiefstpreis – genau das zeigt unsere Kaufen-oder-Warten-Empfehlung." },

  { path: "/de/black-friday-galaxus-digitec-2026/", lang: "de", tab: "calendar", priority: 0.8,
    title: "Galaxus & Digitec Black Friday 2026: ab 16.11. | Aktion.ch",
    description: "Digitec und Galaxus starten die Black Friday Weeks am 16. November 2026: über 1000 Angebote bis 30.11. Alle Daten und Top-Deals in CHF.",
    h1: "Galaxus und Digitec Black Friday 2026: Start am 16. November",
    intro: "Digitec und Galaxus starten ihre Black Friday Weeks am Montag, 16. November 2026. Über 1000 Angebote gehen gleichzeitig online und gelten bis 30. November oder solange Vorrat; später kommen keine neuen dazu. Im Kalender siehst du alle Daten, in den Top 100 die aktuellen Preise." },

  { path: "/de/amazon-black-friday-schweiz-2026/", lang: "de", tab: "top", priority: 0.8,
    title: "Amazon Black Friday Schweiz 2026: Deals & Daten | Aktion.ch",
    description: "Amazon Black Friday 2026 aus der Schweiz: Amazon.de liefert viele Deals in die CH, mit Schweizer MWST. Daten, Deal des Tages und Top-Preise.",
    h1: "Amazon Black Friday 2026 aus der Schweiz bestellen",
    intro: "Amazon hat keinen Schweizer Shop, aber Amazon.de liefert viele Produkte in die Schweiz: Die deutsche MWST fällt weg, die Schweizer MWST von 8,1 % kommt an der Kasse dazu. Amazon USA feiert die Black Friday Week vom 19. bis 30. November 2026. Bei jedem Produkt vergleichen wir Amazon.de mit Schweizer Shops." },

  { path: "/de/singles-day-schweiz-2026/", lang: "de", tab: "calendar", priority: 0.7,
    title: "Singles Day Schweiz 2026 (11.11.): Angebote | Aktion.ch",
    description: "Singles Day 2026 ist am 11. November. MediaMarkt Schweiz lädt vom 11. bis 14.11. zum Singles Day, danach folgen Galaxus, Digitec und die Black Week.",
    h1: "Singles Day Schweiz 2026: 11. November",
    intro: "Der Singles Day am 11. November ist der erste grosse Rabatttag vor dem Black Friday. MediaMarkt Schweiz macht vom 11. bis 14. November mit; die Rabatte sind meist kleiner als in der Black Week. Ab 16. November folgen Digitec und Galaxus, ab 23. November die meisten anderen Shops." },

  { path: "/de/black-friday-apple-schweiz/", lang: "de", tab: "top", q: "Apple", priority: 0.7,
    title: "Black Friday Apple Schweiz 2026: AirPods & Mac | Aktion.ch",
    description: "Apple am Black Friday 2026 in der Schweiz: AirPods, iPhone, iPad, MacBook und Apple Watch mit CHF-Preis, Tiefstpreis und Kaufen-oder-Warten.",
    h1: "Black Friday Apple Schweiz 2026: AirPods, iPhone, iPad und Mac",
    intro: "Apple senkt seine eigenen Preise kaum, Händler wie Digitec, Galaxus, Interdiscount, fnac und Amazon.de schon. Hier siehst du alle Apple-Produkte aus unseren Top 100 mit heutigem Preis, Black-Week-2025-Preis und Tiefstpreis." },

  { path: "/fr/black-friday-2026-date-suisse/", lang: "fr", tab: "calendar", priority: 0.7,
    title: "Black Friday 2026 : date en Suisse | Aktion.ch",
    description: "Le Black Friday 2026 a lieu le vendredi 27 novembre. Black Week dès le 23.11, Galaxus et Digitec dès le 16.11, Cyber Monday le 30.11.",
    h1: "Quand a lieu le Black Friday 2026 en Suisse ?",
    intro: "Le Black Friday 2026 a lieu le vendredi 27 novembre, le lendemain de Thanksgiving. Digitec et Galaxus commencent dès le 16 novembre, la plupart des boutiques suisses le 23 novembre (Black Week) et le Cyber Monday suit le 30 novembre." },

  { path: "/it/black-friday-2026-data-svizzera/", lang: "it", tab: "calendar", priority: 0.7,
    title: "Black Friday 2026: data in Svizzera | Aktion.ch",
    description: "Il Black Friday 2026 è venerdì 27 novembre. Black Week dal 23.11, Galaxus e Digitec dal 16.11, Cyber Monday il 30.11.",
    h1: "Quando è il Black Friday 2026 in Svizzera?",
    intro: "Il Black Friday 2026 è venerdì 27 novembre, il giorno dopo il Thanksgiving. Digitec e Galaxus iniziano già il 16 novembre, la maggior parte dei negozi svizzeri il 23 novembre (Black Week) e il Cyber Monday segue il 30 novembre." },

  { path: "/en/black-friday-2026-date-switzerland/", lang: "en", tab: "calendar", priority: 0.7,
    title: "When Is Black Friday 2026 in Switzerland? | Aktion.ch",
    description: "Black Friday 2026 is Friday 27 November. Galaxus and Digitec start 16 Nov, Black Week 23 Nov, Amazon 19 Nov, Cyber Monday 30 Nov.",
    h1: "When is Black Friday 2026 in Switzerland?",
    intro: "Black Friday 2026 is on Friday 27 November, the day after US Thanksgiving. Digitec and Galaxus start on 16 November, Amazon's Black Friday Week on 19 November, most Swiss shops on Monday 23 November (Black Week), and Cyber Monday is on 30 November." }
];

/* Keywords per page: search terms plus the way people ask AI assistants (ChatGPT, Perplexity, Gemini, Claude, Copilot).
   Used for <meta name="keywords">, JSON-LD "keywords" and llms.txt. Swiss German spelling. */
const K_HOME_DE = ["Black Friday Schweiz 2026", "Black Friday 2026 Schweiz Angebote", "Black Week Schweiz", "Black Friday Deals CHF", "beste Black Friday Angebote Schweiz", "Black Friday Preisvergleich Schweiz", "Galaxus Black Friday", "Digitec Black Friday", "MediaMarkt Black Friday Schweiz", "Interdiscount Black Friday", "Welche Black Friday Angebote lohnen sich in der Schweiz?", "Wo gibt es die besten Black Friday Deals in der Schweiz?"];
export const KEYWORDS = {
  "/": ["Black Friday Switzerland 2026", "Black Friday deals Switzerland", "Black Friday Schweiz", "Black Friday Suisse", "Black Week Switzerland", "Cyber Monday Switzerland", "best Black Friday deals in CHF", "Swiss Black Friday price comparison", "When is Black Friday 2026 in Switzerland?", "What are the best Black Friday deals in Switzerland?", "Is Black Friday worth it in Switzerland?"],
  "/de/black-friday-schweiz-2026/": K_HOME_DE,
  "/fr/black-friday-suisse-2026/": ["Black Friday Suisse 2026", "Black Friday 2026 Suisse offres", "Black Week Suisse", "bons plans Black Friday Suisse", "Black Friday Galaxus", "Black Friday Digitec", "Black Friday Romandie", "comparateur de prix Black Friday Suisse", "Quelles sont les meilleures offres du Black Friday en Suisse ?"],
  "/it/black-friday-svizzera-2026/": ["Black Friday Svizzera 2026", "offerte Black Friday Svizzera", "Black Week Svizzera", "Black Friday Ticino", "Black Friday Galaxus", "Black Friday Digitec", "Quali sono le migliori offerte del Black Friday in Svizzera?"],
  "/en/black-friday-switzerland-2026/": ["Black Friday Switzerland 2026", "Black Friday deals Switzerland expats", "Black Week Switzerland 2026", "Swiss Black Friday shops", "Black Friday Zurich deals", "Black Friday Geneva deals", "Which Swiss shops have Black Friday deals?"],
  "/de/black-week-schweiz-2026/": ["Black Week Schweiz 2026", "Black Week 2026 Datum", "Black Week Galaxus", "Black Week Digitec", "Black Week MediaMarkt", "Black Week Interdiscount", "Wann beginnt die Black Week 2026 in der Schweiz?"],
  "/de/cyber-monday-schweiz-2026/": ["Cyber Monday Schweiz 2026", "Cyber Monday 2026 Datum", "Cyber Monday Angebote Schweiz", "Cyber Week Schweiz", "Wann ist Cyber Monday 2026?"],
  "/de/black-friday-2026-datum/": ["Black Friday 2026 Datum", "wann ist Black Friday 2026", "Black Friday 27. November 2026", "Black Week 2026 Datum", "Singles Day 2026", "Cyber Monday 2026", "Wann ist Black Friday 2026 in der Schweiz?"],
  "/de/black-friday-fernseher-schweiz/": ["Black Friday Fernseher Schweiz", "Black Friday TV Angebote", "OLED TV Black Friday", "LG OLED Black Friday Schweiz", "Samsung TV Black Friday", "Welcher Fernseher lohnt sich am Black Friday?"],
  "/de/black-friday-iphone-schweiz/": ["Black Friday iPhone Schweiz", "iPhone 17 Black Friday", "iPhone 16 Black Friday Preis", "iPhone Air Black Friday", "Wird das iPhone am Black Friday günstiger?"],
  "/de/black-friday-konsolen-schweiz/": ["Black Friday PS5 Schweiz", "PS5 Pro Black Friday", "Nintendo Switch 2 Black Friday", "Xbox Black Friday Schweiz", "Gibt es die PS5 am Black Friday günstiger?"],
  "/de/black-friday-haushalt-schweiz/": ["Black Friday Dyson Schweiz", "Saugroboter Black Friday", "Kaffeevollautomat Black Friday", "Roborock Black Friday", "Dyson V15 Black Friday Preis"],
  "/de/black-friday-winterreifen-schweiz/": ["Winterreifen Black Friday Schweiz", "Winterreifen günstig Schweiz", "Winterreifenpflicht Schweiz", "Michelin Winterreifen Angebot", "Wann muss man in der Schweiz Winterreifen montieren?"],
  "/de/black-friday-usa-schweiz/": ["Black Friday USA Schweiz", "Amazon.com Schweiz bestellen", "Best Buy Black Friday", "Walmart Black Friday", "Zoll MWST USA Bestellung Schweiz", "Kann ich US Black Friday Deals in die Schweiz bestellen?"],
  "/de/lohnt-sich-black-friday/": ["lohnt sich Black Friday", "Fake Rabatte Black Friday", "Black Friday Preisverlauf", "Black Friday Tipps Schweiz", "Lohnt sich Black Friday in der Schweiz?"],
  "/de/black-friday-galaxus-digitec-2026/": ["Galaxus Black Friday 2026", "Digitec Black Friday 2026", "Black Friday Weeks Galaxus", "Digitec Galaxus 16. November", "Wann startet Galaxus mit Black Friday 2026?"],
  "/de/amazon-black-friday-schweiz-2026/": ["Amazon Black Friday Schweiz", "Amazon.de Schweiz Lieferung", "Amazon Black Friday 2026 Datum", "Amazon Black Friday Week", "Kann ich bei Amazon.de aus der Schweiz bestellen?"],
  "/de/singles-day-schweiz-2026/": ["Singles Day Schweiz 2026", "Singles Day 11.11. Angebote", "Singles Day MediaMarkt Schweiz", "Singles Day Galaxus", "Wann ist Singles Day 2026?"],
  "/de/black-friday-apple-schweiz/": ["Black Friday Apple Schweiz", "AirPods Black Friday Schweiz", "AirPods Pro 3 Black Friday", "MacBook Air Black Friday Schweiz", "iPad Black Friday Schweiz", "Wo kaufe ich Apple am Black Friday am günstigsten in der Schweiz?"],
  "/fr/black-friday-2026-date-suisse/": ["Black Friday 2026 date", "date Black Friday Suisse", "Black Week 2026 Suisse", "Cyber Monday 2026 Suisse", "Quand a lieu le Black Friday 2026 en Suisse ?"],
  "/it/black-friday-2026-data-svizzera/": ["Black Friday 2026 data", "data Black Friday Svizzera", "Black Week 2026 Svizzera", "Cyber Monday 2026 Svizzera", "Quando è il Black Friday 2026 in Svizzera?"],
  "/en/black-friday-2026-date-switzerland/": ["Black Friday 2026 date Switzerland", "when is Black Friday 2026", "Black Week 2026 Switzerland", "Cyber Monday 2026 Switzerland", "Galaxus Black Friday 2026 date", "When does Black Friday start in Switzerland?"]
};
