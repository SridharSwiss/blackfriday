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
    intro: "Black Friday is on Friday 27 November 2026, with Black Week from Monday 23 November and Cyber Monday on 30 November. We track the 100 most-wanted products at Swiss shops, compare today's price with Black Week 2025 and the record low, and tell you whether to buy now or wait. Plus 2,000+ products by category, winter tyres and US deals." },

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
    title: "Black Friday Switzerland 2026: Deals, Dates, Prices | Aktion.ch",
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
    title: "Black Friday Haushalt Schweiz: Dyson & Saugroboter | Aktion.ch",
    description: "Dyson, Saugroboter, Kaffeemaschinen und Küchengeräte am Black Friday 2026 – Angebote bei Schweizer Shops.",
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
    title: "Lohnt sich Black Friday in der Schweiz? Fake-Rabatte erkennen",
    description: "So erkennst du falsche Rabatte am Black Friday: Preisverlauf prüfen, Tiefstpreise vergleichen, Rückgaberecht und Garantie in der Schweiz.",
    h1: "Lohnt sich Black Friday in der Schweiz? Fake-Rabatte erkennen",
    intro: "Viele «Rabatte» beziehen sich auf einen Listenpreis, den kaum jemand zahlt. Vergleiche deshalb immer mit dem Preis der letzten Wochen und dem bisherigen Tiefstpreis – genau das zeigt unsere Kaufen-oder-Warten-Empfehlung." }
];
