/* SEO landing pages. Each entry becomes its own static HTML file at build time (vite.config.js)
   with its own <title>, description, canonical, hreflang, H1, intro and JSON-LD.
   The app opens the matching view: tab = top | categories | us | list | calendar | retailers | guide;
   cat = category name (categories / us tab); q = search term.
   Swiss German spelling: "ss", never "ß". Keyword research: Oct 2026. */

export const LOCALE = { de: "de_CH", fr: "fr_CH", it: "it_CH", en: "en_CH" };
export const HREFLANG = { de: "de-CH", fr: "fr-CH", it: "it-CH", en: "en" };

export const PAGES = [
  { path: "/", lang: "en", group: "home", tab: "live", priority: 1.0,
    title: "Black Friday Switzerland 2026: Best Deals in CHF | Aktions.ch",
    description: "Black Friday 2026 is 27 Nov. Top 100 Swiss deals in CHF with price history and a buy-or-wait call. Black Week, Cyber Monday and US deals.",
    h1: "Black Friday Switzerland 2026: the best deals in CHF",
    intro: "Black Friday is on Friday 27 November 2026, with Black Week from Monday 23 November and Cyber Monday on 30 November. We track the 100 most-wanted products at Swiss shops, compare today's price with the 2026 record low, and tell you whether to buy now or wait. Plus 2,400+ products by category, winter tyres and US deals." },

  { path: "/de/black-friday-schweiz-2026/", lang: "de", group: "home", tab: "live", priority: 1.0,
    title: "Black Friday Schweiz 2026: Beste Deals in CHF | Aktions.ch",
    description: "Black Friday 2026 am 27.11.: Top-100-Deals mit CHF-Preisen, Preisverlauf und Kaufen-oder-Warten-Check. Black Week, Cyber Monday & USA-Deals.",
    h1: "Black Friday Schweiz 2026: alle Angebote, Daten und Preise",
    intro: "Black Friday ist am Freitag, 27. November 2026. Die Black Week startet am Montag, 23. November, Cyber Monday folgt am 30. November. Wir verfolgen die 100 gefragtesten Produkte in Schweizer Shops, vergleichen den heutigen Preis mit dem Tiefstpreis 2026 und sagen dir, ob du jetzt kaufen oder warten solltest." },

  { path: "/fr/black-friday-suisse-2026/", lang: "fr", group: "home", tab: "live", priority: 0.9,
    title: "Black Friday Suisse 2026 : offres en CHF | Aktions.ch",
    description: "Black Friday 2026 le 27.11 : top 100 des offres en CHF, historique des prix et conseil acheter ou attendre. Black Week et Cyber Monday.",
    h1: "Black Friday Suisse 2026 : offres, dates et prix",
    intro: "Le Black Friday a lieu le vendredi 27 novembre 2026. La Black Week commence le lundi 23 novembre et le Cyber Monday suit le 30 novembre. Nous suivons les 100 produits les plus recherchés dans les boutiques suisses, comparons le prix du jour avec le prix le plus bas de 2026, et vous disons s'il vaut mieux acheter maintenant ou attendre." },

  { path: "/it/black-friday-svizzera-2026/", lang: "it", group: "home", tab: "live", priority: 0.9,
    title: "Black Friday Svizzera 2026: offerte in CHF | Aktions.ch",
    description: "Black Friday 2026 il 27.11: le 100 migliori offerte in CHF, storico prezzi e consiglio comprare o aspettare. Black Week e Cyber Monday.",
    h1: "Black Friday Svizzera 2026: offerte, date e prezzi",
    intro: "Il Black Friday è venerdì 27 novembre 2026. La Black Week inizia lunedì 23 novembre e il Cyber Monday segue il 30 novembre. Seguiamo i 100 prodotti più richiesti nei negozi svizzeri, confrontiamo il prezzo di oggi con il prezzo minimo del 2026 e ti diciamo se conviene comprare subito o aspettare." },

  { path: "/en/black-friday-switzerland-2026/", lang: "en", group: "home", tab: "live", priority: 0.9,
    title: "Black Friday Switzerland 2026: Deals & Dates | Aktions.ch",
    description: "All Black Friday 2026 deals in Switzerland: top 100 offers in CHF, Black Week and Cyber Monday dates, retailer guide and US deals for expats.",
    h1: "Black Friday Switzerland 2026: deals, dates and prices",
    intro: "Black Friday is on Friday 27 November 2026, Black Week starts on Monday 23 November and Cyber Monday is on 30 November. Our top 100 compares today's Swiss price with the 2026 record low, so you know whether a deal is real." },

  { path: "/de/black-week-schweiz-2026/", lang: "de", tab: "calendar", priority: 0.8,
    title: "Black Week Schweiz 2026 (23.–29.11.): Händler & Deals",
    description: "Black Week 2026 in der Schweiz: wann Galaxus, Digitec, Brack, Interdiscount, MediaMarkt und Amazon starten – mit Kalender und Top-Deals.",
    h1: "Black Week Schweiz 2026 (23.–29. November): Händler und Deals",
    intro: "Die meisten Schweizer Händler ziehen ihre Black-Friday-Angebote auf die ganze Woche vom 23. bis 29. November 2026 vor. Im Kalender siehst du, wann welcher Shop startet; die Top-100-Liste zeigt, welche Preise schon heute gut sind." },

  { path: "/de/cyber-monday-schweiz-2026/", lang: "de", tab: "calendar", priority: 0.7,
    title: "Cyber Monday Schweiz 2026 (30.11.): Angebote | Aktions.ch",
    description: "Cyber Monday 2026 ist am 30. November. Welche Schweizer Shops verlängern ihre Black-Friday-Preise und welche Deals sich noch lohnen.",
    h1: "Cyber Monday Schweiz 2026 (30.11.): Angebote",
    intro: "Cyber Monday fällt 2026 auf den 30. November. Viele Schweizer Onlineshops verlängern ihre Black-Friday-Preise bis Montagabend; Elektronik und Technik sind oft nochmals reduziert." },

  { path: "/de/black-friday-2026-datum/", lang: "de", tab: "calendar", priority: 0.8,
    title: "Wann ist Black Friday 2026? Datum Schweiz | Aktions.ch",
    description: "Black Friday 2026 ist am Freitag, 27. November. Black Week ab 23.11., Cyber Monday am 30.11., Singles Day am 11.11. – alle Daten im Überblick.",
    h1: "Wann ist Black Friday 2026? Datum, Black Week, Cyber Monday",
    intro: "Black Friday 2026 ist am Freitag, 27. November – immer der Tag nach dem US-Feiertag Thanksgiving (26. November). Die Black Week läuft vom 23. bis 29. November, Cyber Monday ist am 30. November und Singles Day am 11. November." },

  { path: "/de/black-friday-fernseher-schweiz/", lang: "de", tab: "categories", cat: "TV", priority: 0.7,
    title: "Black Friday Fernseher Schweiz 2026: TV-Deals | Aktions.ch",
    description: "OLED- und QLED-Fernseher am Black Friday 2026: LG, Samsung, Sony und Hisense im Preisvergleich bei Schweizer Shops.",
    h1: "Black Friday Fernseher Schweiz 2026: TV-Deals im Vergleich",
    intro: "Fernseher gehören zu den grössten Black-Friday-Rabatten. Hier findest du OLED-, QLED- und Mini-LED-Modelle von LG, Samsung, Sony, Hisense und TCL mit Links zu Schweizer Shops." },

  { path: "/de/black-friday-iphone-schweiz/", lang: "de", tab: "top", q: "iPhone", priority: 0.7,
    title: "Black Friday iPhone Schweiz 2026: lohnt Warten? | Aktions.ch",
    description: "iPhone 17, iPhone Air und iPhone 16 am Black Friday 2026: heutiger CHF-Preis, Tiefstpreis und unsere Empfehlung kaufen oder warten.",
    h1: "Black Friday iPhone Schweiz 2026: kaufen oder warten?",
    intro: "Apple selbst reduziert kaum, die Händler schon: Bei Digitec, Galaxus, Interdiscount und Amazon.de fallen iPhones in der Black Week oft unter den bisherigen Tiefstpreis. Wir zeigen den heutigen Preis und das Kaufziel." },

  { path: "/de/black-friday-konsolen-schweiz/", lang: "de", tab: "categories", cat: "Gaming", priority: 0.7,
    title: "Black Friday PS5 & Switch 2 Schweiz 2026 | Aktions.ch",
    description: "PlayStation 5, PS5 Pro, Nintendo Switch 2, Xbox und Spiele am Black Friday 2026: Preise in CHF und Shops im Überblick.",
    h1: "Black Friday Konsolen Schweiz 2026: PS5, Switch 2 und Xbox",
    intro: "Konsolen-Bundles, Controller und Spiele sind am Black Friday besonders gefragt. Hier findest du PlayStation 5, Nintendo Switch 2 und Xbox mit Links zu Schweizer Shops." },

  { path: "/de/black-friday-haushalt-schweiz/", lang: "de", tab: "categories", cat: "Home", priority: 0.6,
    title: "Black Friday Haushalt 2026: Dyson & Saugroboter | Aktions.ch",
    description: "Dyson, Saugroboter, Kaffeevollautomaten und Küchengeräte am Black Friday 2026: Angebote und Preise in CHF bei Schweizer Shops im Überblick.",
    h1: "Black Friday Haushalt: Dyson, Saugroboter und Kaffee",
    intro: "Akkusauger, Saugroboter und Kaffeevollautomaten sind die Haushalts-Klassiker der Black Week. Hier findest du Dyson, Roborock, iRobot, Jura, De'Longhi und mehr." },

  { path: "/de/black-friday-winterreifen-schweiz/", lang: "de", tab: "categories", cat: "Winter tyres", priority: 0.6,
    title: "Black Friday Winterreifen Schweiz 2026 | Aktions.ch",
    description: "Winterreifen 2026 günstig kaufen: Michelin, Continental, Bridgestone und Pirelli bei reifen-online.ch, mit Montage in der Schweiz.",
    h1: "Black Friday Winterreifen Schweiz 2026",
    intro: "Von Oktober bis Ostern gilt in der Schweiz: Wer mit ungeeigneten Reifen unterwegs ist, haftet bei Unfällen mit. Bei reifen-online.ch findest du Winterreifen aller Grössen mit Lieferung an eine Montagegarage." },

  { path: "/de/black-friday-usa-schweiz/", lang: "de", tab: "us", priority: 0.6,
    title: "Black Friday USA aus der Schweiz: Deals, Zoll & MWST",
    description: "US-Black-Friday-Deals 2026 in USD: Apple, TVs, Konsolen. Was du beim Bestellen aus der Schweiz zu Zoll, MWST und Garantie wissen musst.",
    h1: "Black Friday USA: Deals und was du aus der Schweiz beachten musst",
    intro: "Amazon.com, Best Buy, Walmart und Target liefern meist nicht in die Schweiz. Bei Import fallen 8,1 % MWST plus Verzollungsgebühren an, US-Stecker und US-Garantie gelten. Gezeigt werden nur aktuelle, doppelt geprüfte US-Deals von 2026." },

  { path: "/de/lohnt-sich-black-friday/", lang: "de", tab: "guide", priority: 0.6,
    title: "Lohnt sich Black Friday? Fake-Rabatte erkennen | Aktions.ch",
    description: "So erkennst du falsche Rabatte am Black Friday: Preisverlauf prüfen, Tiefstpreise vergleichen, Rückgaberecht und Garantie in der Schweiz.",
    h1: "Lohnt sich Black Friday in der Schweiz? Fake-Rabatte erkennen",
    intro: "Viele «Rabatte» beziehen sich auf einen Listenpreis, den kaum jemand zahlt. Vergleiche deshalb immer mit dem Preis der letzten Wochen und dem bisherigen Tiefstpreis – genau das zeigt unsere Kaufen-oder-Warten-Empfehlung." },

  { path: "/de/black-friday-handy-abo-schweiz/", lang: "de", tab: "categories", cat: "Mobile Plans & Internet", priority: 0.7,
    title: "Black Friday Handy-Abo Schweiz 2026: Mobile & Internet | Aktions.ch",
    description: "Handy-Abos und Internet am Black Friday 2026: Swisscom, Sunrise, Salt, Wingo und Lyca Mobile im Preisvergleich – aktuelle CHF-Preise.",
    h1: "Black Friday Handy-Abo & Internet Schweiz 2026",
    intro: "Swisscom, Sunrise, Salt und Wingo bringen am Black Friday oft befristete Abo-Rabatte oder mehr Datenvolumen zum gleichen Preis. Dazu kommen günstige Zweitanbieter wie Lyca Mobile mit SIM-only-Abos ohne Vertragsbindung. Wir vergleichen die aktuellen Preise in CHF." },

  { path: "/de/black-friday-kaffeevollautomat-schweiz/", lang: "de", tab: "categories", cat: "Coffee", priority: 0.6,
    title: "Black Friday Kaffeevollautomat Schweiz 2026: Jura & DeLonghi | Aktions.ch",
    description: "Jura, De'Longhi, Philips und Sage Kaffeevollautomaten am Black Friday 2026: aktuelle CHF-Preise bei Schweizer Händlern im Überblick.",
    h1: "Black Friday Kaffeevollautomaten Schweiz 2026",
    intro: "Jura, De'Longhi, Philips und Sage Barista sind die gefragtesten Marken bei Kaffeevollautomaten. Black Friday und Black Week bringen bei Fust, Galaxus, Interdiscount und Brack regelmässig die tiefsten Preise des Jahres." },

  { path: "/de/black-friday-kueche-schweiz/", lang: "de", tab: "categories", cat: "Kitchen", priority: 0.6,
    title: "Black Friday Küche Schweiz 2026: Nespresso, KitchenAid & mehr | Aktions.ch",
    description: "Nespresso, KitchenAid, Thermomix, Heissluftfritteusen und Sodastream am Black Friday 2026: Preise in CHF bei Schweizer Shops.",
    h1: "Black Friday Küche Schweiz 2026",
    intro: "Nespresso-Kapselmaschinen, KitchenAid-Küchenmaschinen, Heissluftfritteusen, Sodastream und Raclette-Öfen gehören zu den beliebtesten Küchengeräten am Black Friday. Wir zeigen aktuelle Preise bei Galaxus, Fust, Manor und Brack." },

  { path: "/de/black-friday-smart-home-schweiz/", lang: "de", tab: "categories", cat: "Smart Home", priority: 0.6,
    title: "Black Friday Smart Home Schweiz 2026: Echo, Hue & Co. | Aktions.ch",
    description: "Amazon Echo, Philips Hue, Google Nest und smarte Steckdosen am Black Friday 2026: Preise in CHF bei Schweizer Shops.",
    h1: "Black Friday Smart Home Schweiz 2026",
    intro: "Amazon Echo, Google Nest, Philips Hue und smarte Steckdosen zählen zu den günstigsten Einstiegsprodukten am Black Friday. Hier findest du aktuelle Preise bei Amazon.de, Galaxus, Brack und Interdiscount." },

  { path: "/de/black-friday-kopfhoerer-schweiz/", lang: "de", tab: "categories", cat: "Audio", priority: 0.6,
    title: "Black Friday Kopfhörer Schweiz 2026: Bose, Sony & Sonos | Aktions.ch",
    description: "Bose QuietComfort, Sony WH-1000XM6, Sonos Arc und AirPods Pro am Black Friday 2026: Preise in CHF bei Schweizer Shops.",
    h1: "Black Friday Kopfhörer & Lautsprecher Schweiz 2026",
    intro: "AirPods Pro, Sony WH-1000XM6, Bose QuietComfort und Sonos-Lautsprecher sind die meistverkauften Audio-Produkte am Black Friday. Wir vergleichen aktuelle Preise bei Digitec, MediaMarkt, fnac und Amazon.de." },

  { path: "/de/black-friday-schuhe-sneaker-schweiz/", lang: "de", tab: "categories", cat: "Shoes & Sneakers", priority: 0.6,
    title: "Black Friday Schuhe & Sneaker Schweiz 2026: Nike, Adidas & On | Aktions.ch",
    description: "Nike, Adidas, On Running und weitere Sneaker-Marken am Black Friday 2026: Preise in CHF bei Zalando, Ochsner, Dosenbach und Galaxus.",
    h1: "Black Friday Schuhe & Sneaker Schweiz 2026",
    intro: "Nike, Adidas, On Running, Puma und weitere Marken reduzieren Sneaker und Laufschuhe am Black Friday oft stark. Wir vergleichen Preise bei Zalando, Ochsner Sport, Dosenbach und Galaxus." },

  { path: "/de/black-friday-bekleidung-schweiz/", lang: "de", tab: "categories", cat: "Apparel", priority: 0.6,
    title: "Black Friday Bekleidung Schweiz 2026: H&M, Zara & Mode | Aktions.ch",
    description: "Bekleidung am Black Friday 2026: H&M, Zara, Mango und weitere Modemarken im Preisvergleich bei Schweizer Shops.",
    h1: "Black Friday Bekleidung & Mode Schweiz 2026",
    intro: "H&M, Zara, Mango und weitere grosse Modeketten senken die Preise in der Black Week oft um 20 bis 50 Prozent. Wir zeigen aktuelle Preise bei Zalando, Manor und Galaxus." },

  { path: "/de/black-friday-beauty-parfum-schweiz/", lang: "de", tab: "categories", cat: "Fragrance & Beauty", priority: 0.6,
    title: "Black Friday Parfum & Beauty Schweiz 2026: Douglas, Sephora | Aktions.ch",
    description: "Parfum, Make-up und Pflegeprodukte am Black Friday 2026: Preise in CHF bei Douglas, Manor, Galaxus und Amazon.de.",
    h1: "Black Friday Parfum & Beauty Schweiz 2026",
    intro: "Parfum, Make-up und Hautpflege gehören zu den meistverkauften Black-Friday-Produkten. Wir vergleichen Preise bei Douglas, Manor, Galaxus und Amazon.de." },

  { path: "/de/black-friday-spielzeug-lego-schweiz/", lang: "de", tab: "categories", cat: "Toys & Games", priority: 0.6,
    title: "Black Friday Spielzeug & LEGO Schweiz 2026 | Aktions.ch",
    description: "LEGO, Playmobil und weiteres Spielzeug am Black Friday 2026: Preise in CHF bei Galaxus, Manor, Franz Carl Weber und Amazon.de.",
    h1: "Black Friday Spielzeug & LEGO Schweiz 2026",
    intro: "LEGO-Sets, Playmobil und weiteres Spielzeug sind am Black Friday stark gefragt. Wir vergleichen aktuelle Preise bei Galaxus, Manor, Franz Carl Weber und Amazon.de." },

  { path: "/de/black-friday-baby-kinder-schweiz/", lang: "de", tab: "categories", cat: "Baby & Kids", priority: 0.6,
    title: "Black Friday Baby & Kinder Schweiz 2026 | Aktions.ch",
    description: "Kinderwagen, Kindersitze und Babyartikel am Black Friday 2026: Preise in CHF bei Galaxus, Manor, Brack und Amazon.de.",
    h1: "Black Friday Baby & Kinderartikel Schweiz 2026",
    intro: "Kinderwagen, Autositze und weitere Babyartikel sind am Black Friday oft stark reduziert. Wir zeigen aktuelle Preise bei Galaxus, Manor, Brack und Amazon.de." },

  { path: "/de/black-friday-haustier-schweiz/", lang: "de", tab: "categories", cat: "Pets", priority: 0.5,
    title: "Black Friday Haustierbedarf Schweiz 2026: Qualipet & Co. | Aktions.ch",
    description: "Tierfutter und Zubehör am Black Friday 2026: Preise in CHF bei Galaxus, Brack und Amazon.de im Vergleich.",
    h1: "Black Friday Haustierbedarf Schweiz 2026",
    intro: "Tierfutter, Spielzeug und Zubehör für Hund und Katze sind am Black Friday oft deutlich günstiger. Wir vergleichen Preise bei Galaxus, Brack und Amazon.de." },

  { path: "/de/black-friday-e-bike-schweiz/", lang: "de", tab: "categories", cat: "Bikes & E-mobility", priority: 0.6,
    title: "Black Friday E-Bike & E-Scooter Schweiz 2026 | Aktions.ch",
    description: "E-Bikes, E-Scooter und Velos am Black Friday 2026: Preise in CHF bei Galaxus, Brack und Jumbo im Vergleich.",
    h1: "Black Friday E-Bike & E-Scooter Schweiz 2026",
    intro: "E-Scooter von Xiaomi und Segway, E-Bikes von Stromer und weitere Mobilitätsprodukte zählen zu den teuersten, aber auch am stärksten reduzierten Black-Friday-Kategorien. Wir vergleichen Preise bei Galaxus, Brack und Jumbo." },

  { path: "/de/black-friday-reisen-fluege-schweiz/", lang: "de", tab: "categories", cat: "Travel & Holidays", priority: 0.5,
    title: "Black Friday Reisen & Flüge Schweiz 2026: SWISS, easyJet | Aktions.ch",
    description: "Flüge und Reiseangebote am Black Friday 2026: SWISS, easyJet, Edelweiss und weitere Airlines ab der Schweiz im Vergleich.",
    h1: "Black Friday Reisen & Flüge Schweiz 2026",
    intro: "SWISS, easyJet, Edelweiss und weitere Airlines bieten am Black Friday oft befristete Rabattcodes oder reduzierte Routen ab der Schweiz an. Wir zeigen aktuelle Angebote." },

  { path: "/de/black-friday-smartphones-schweiz/", lang: "de", tab: "categories", cat: "Phones", priority: 0.6,
    title: "Black Friday Smartphones Schweiz 2026: Samsung Galaxy & Co. | Aktions.ch",
    description: "Samsung Galaxy, Google Pixel und weitere Android-Smartphones am Black Friday 2026: Preise in CHF bei Schweizer Shops.",
    h1: "Black Friday Smartphones Schweiz 2026",
    intro: "Neben dem iPhone sind Samsung Galaxy und Google Pixel die meistverkauften Smartphones am Black Friday. Wir vergleichen Preise bei Digitec, Galaxus, Interdiscount und Amazon.de." },

  { path: "/de/black-friday-gaming-pc-laptop-schweiz/", lang: "de", tab: "categories", cat: "Computers", priority: 0.6,
    title: "Black Friday Gaming PC & Laptop Schweiz 2026 | Aktions.ch",
    description: "Gaming-Laptops und Gaming-PCs am Black Friday 2026: Preise in CHF bei Digitec, Galaxus, Brack und Amazon.de.",
    h1: "Black Friday Gaming PC & Laptop Schweiz 2026",
    intro: "Gaming-Laptops, Grafikkarten und komplette Gaming-PCs gehören zu den teuersten, aber auch am stärksten reduzierten Produkten am Black Friday. Wir vergleichen Preise bei Digitec, Galaxus, Brack und Amazon.de." },

  { path: "/de/black-friday-galaxus-digitec-2026/", lang: "de", tab: "calendar", priority: 0.8,
    title: "Galaxus & Digitec Black Friday 2026: ab 16.11. | Aktions.ch",
    description: "Digitec und Galaxus starten die Black Friday Weeks am 16. November 2026: über 1000 Angebote bis 30.11. Alle Daten und Top-Deals in CHF.",
    h1: "Galaxus und Digitec Black Friday 2026: Start am 16. November",
    intro: "Digitec und Galaxus starten ihre Black Friday Weeks am Montag, 16. November 2026. Über 1000 Angebote gehen gleichzeitig online und gelten bis 30. November oder solange Vorrat; später kommen keine neuen dazu. Im Kalender siehst du alle Daten, in den Top 100 die aktuellen Preise." },

  { path: "/de/amazon-black-friday-schweiz-2026/", lang: "de", tab: "top", priority: 0.8,
    title: "Amazon Black Friday Schweiz 2026: Deals & Daten | Aktions.ch",
    description: "Amazon Black Friday 2026 aus der Schweiz: Amazon.de liefert viele Deals in die CH, mit Schweizer MWST. Daten, Deal des Tages und Top-Preise.",
    h1: "Amazon Black Friday 2026 aus der Schweiz bestellen",
    intro: "Amazon hat keinen Schweizer Shop, aber Amazon.de liefert viele Produkte in die Schweiz: Die deutsche MWST fällt weg, die Schweizer MWST von 8,1 % kommt an der Kasse dazu. Amazon USA feiert die Black Friday Week vom 19. bis 30. November 2026. Bei jedem Produkt vergleichen wir Amazon.de mit Schweizer Shops." },

  { path: "/de/singles-day-schweiz-2026/", lang: "de", tab: "live", priority: 0.7,
    title: "Singles Day Schweiz 2026 (11.11.): Angebote | Aktions.ch",
    description: "Singles Day 2026 ist am 11. November. MediaMarkt Schweiz lädt vom 11. bis 14.11. zum Singles Day, danach folgen Galaxus, Digitec und die Black Week.",
    h1: "Singles Day Schweiz 2026: 11. November",
    intro: "Der Singles Day am 11. November ist der erste grosse Rabatttag vor dem Black Friday. MediaMarkt Schweiz macht vom 11. bis 14. November mit; die Rabatte sind meist kleiner als in der Black Week. Ab 16. November folgen Digitec und Galaxus, ab 23. November die meisten anderen Shops." },

  { path: "/de/black-friday-apple-schweiz/", lang: "de", tab: "top", q: "Apple", priority: 0.7,
    title: "Black Friday Apple Schweiz 2026: AirPods & Mac | Aktions.ch",
    description: "Apple am Black Friday 2026 in der Schweiz: AirPods, iPhone, iPad, MacBook und Apple Watch mit CHF-Preis, Tiefstpreis und Kaufen-oder-Warten.",
    h1: "Black Friday Apple Schweiz 2026: AirPods, iPhone, iPad und Mac",
    intro: "Apple senkt seine eigenen Preise kaum, Händler wie Digitec, Galaxus, Interdiscount, fnac und Amazon.de schon. Hier siehst du alle Apple-Produkte aus unseren Top 100 mit heutigem Preis und Tiefstpreis." },

  { path: "/fr/black-friday-2026-date-suisse/", lang: "fr", tab: "calendar", priority: 0.7,
    title: "Black Friday 2026 : date en Suisse | Aktions.ch",
    description: "Le Black Friday 2026 a lieu le vendredi 27 novembre. Black Week dès le 23.11, Galaxus et Digitec dès le 16.11, Cyber Monday le 30.11.",
    h1: "Quand a lieu le Black Friday 2026 en Suisse ?",
    intro: "Le Black Friday 2026 a lieu le vendredi 27 novembre, le lendemain de Thanksgiving. Digitec et Galaxus commencent dès le 16 novembre, la plupart des boutiques suisses le 23 novembre (Black Week) et le Cyber Monday suit le 30 novembre." },

  { path: "/it/black-friday-2026-data-svizzera/", lang: "it", tab: "calendar", priority: 0.7,
    title: "Black Friday 2026: data in Svizzera | Aktions.ch",
    description: "Il Black Friday 2026 è venerdì 27 novembre. Black Week dal 23.11, Galaxus e Digitec dal 16.11, Cyber Monday il 30.11.",
    h1: "Quando è il Black Friday 2026 in Svizzera?",
    intro: "Il Black Friday 2026 è venerdì 27 novembre, il giorno dopo il Thanksgiving. Digitec e Galaxus iniziano già il 16 novembre, la maggior parte dei negozi svizzeri il 23 novembre (Black Week) e il Cyber Monday segue il 30 novembre." },

  { path: "/en/black-friday-2026-date-switzerland/", lang: "en", tab: "calendar", priority: 0.7,
    title: "When Is Black Friday 2026 in Switzerland? | Aktions.ch",
    description: "Black Friday 2026 is Friday 27 November. Galaxus and Digitec start 16 Nov, Black Week 23 Nov, Amazon 19 Nov, Cyber Monday 30 Nov.",
    h1: "When is Black Friday 2026 in Switzerland?",
    intro: "Black Friday 2026 is on Friday 27 November, the day after US Thanksgiving. Digitec and Galaxus start on 16 November, Amazon's Black Friday Week on 19 November, most Swiss shops on Monday 23 November (Black Week), and Cyber Monday is on 30 November." }
];

/* Keywords per page: search terms plus the way people ask AI assistants (ChatGPT, Perplexity, Gemini, Claude, Copilot).
   Used for <meta name="keywords">, JSON-LD "keywords" and llms.txt. Swiss German spelling. */
const K_HOME_DE = ["Black Friday Schweiz", "Black Friday Schweiz 2026", "Black Friday Angebote Schweiz", "Black Friday Deals Schweiz", "Black Week Schweiz", "Black Week Angebote Schweiz", "Cyber Monday Schweiz", "Cyber Week Schweiz", "Beste Black Friday Deals Schweiz", "Black Friday Rabatte Schweiz", "Black Friday Aktionen Schweiz", "Black Friday Schnäppchen Schweiz", "Black Friday Onlineshops Schweiz", "Black Friday Preisvergleich Schweiz", "Toppreise Black Friday", "Preispirat Black Friday", "DeinDeal Black Friday", "blackfriday.ch Angebote", "blackfridaydeals.ch", "Galaxus Black Friday", "Digitec Black Friday", "MediaMarkt Schweiz Black Friday", "Interdiscount Black Friday", "Fust Black Friday", "Brack.ch Black Friday", "nettoshop Black Friday", "Microspot Black Friday", "melectronics Black Friday", "Steg Electronics Black Friday", "Black Friday Rabattcode Schweiz", "Black Friday Gutschein Schweiz", "Black Friday Geheimtipps Schweiz", "Black Friday Liste Geschäfte Schweiz", "Black Friday Öffnungszeiten Zürich", "Black Friday Shoppingcenter Schweiz", "Glattzentrum Black Friday", "Shoppi Tivoli Black Friday", "Welche Black Friday Angebote lohnen sich in der Schweiz?", "Wo gibt es die besten Black Friday Deals in der Schweiz?"];
export const KEYWORDS = {
  "/": ["Black Friday Switzerland 2026", "Black Friday deals Switzerland", "Black Friday Schweiz", "Black Friday Suisse", "Black Week Switzerland", "Cyber Monday Switzerland", "best Black Friday deals in CHF", "Swiss Black Friday price comparison", "Swiss Black Friday shops", "When is Black Friday 2026 in Switzerland?", "What are the best Black Friday deals in Switzerland?", "Is Black Friday worth it in Switzerland?"],
  "/de/black-friday-schweiz-2026/": K_HOME_DE,
  "/fr/black-friday-suisse-2026/": ["Black Friday Suisse 2026", "Black Friday 2026 Suisse offres", "Black Week Suisse", "bons plans Black Friday Suisse", "Black Friday Galaxus", "Black Friday Digitec", "Black Friday Romandie", "comparateur de prix Black Friday Suisse", "Quelles sont les meilleures offres du Black Friday en Suisse ?"],
  "/it/black-friday-svizzera-2026/": ["Black Friday Svizzera 2026", "offerte Black Friday Svizzera", "Black Week Svizzera", "Black Friday Ticino", "Black Friday Galaxus", "Black Friday Digitec", "Quali sono le migliori offerte del Black Friday in Svizzera?"],
  "/en/black-friday-switzerland-2026/": ["Black Friday Switzerland 2026", "Black Friday deals Switzerland expats", "Black Week Switzerland 2026", "Swiss Black Friday shops", "Black Friday Zurich deals", "Black Friday Geneva deals", "Which Swiss shops have Black Friday deals?"],
  "/de/black-week-schweiz-2026/": ["Black Week Schweiz 2026", "Black Week 2026 Datum", "Black Week Galaxus", "Black Week Digitec", "Black Week MediaMarkt", "Black Week Interdiscount", "Wann beginnt die Black Week 2026 in der Schweiz?"],
  "/de/cyber-monday-schweiz-2026/": ["Cyber Monday Schweiz 2026", "Cyber Monday 2026 Datum", "Cyber Monday Angebote Schweiz", "Cyber Week Schweiz", "Wann ist Cyber Monday 2026?"],
  "/de/black-friday-2026-datum/": ["Black Friday 2026 Datum", "wann ist Black Friday 2026", "Black Friday 27. November 2026", "Black Week 2026 Datum", "Singles Day 2026", "Cyber Monday 2026", "Wann ist Black Friday 2026 in der Schweiz?"],
  "/de/black-friday-fernseher-schweiz/": ["Black Friday Fernseher Schweiz", "Black Friday TV Angebote", "OLED TV Black Friday Schweiz", "LG OLED Black Friday Schweiz", "Samsung QLED Black Friday Schweiz", "Samsung TV Black Friday", "Monitor 4K Black Friday Schweiz", "Beamer Black Friday Schweiz", "Welcher Fernseher lohnt sich am Black Friday?"],
  "/de/black-friday-iphone-schweiz/": ["Black Friday iPhone Schweiz", "iPhone 17 Black Friday Schweiz", "iPhone 16 Pro Black Friday Schweiz", "iPhone Aktion Black Friday Schweiz", "iPhone Air Black Friday", "Wird das iPhone am Black Friday günstiger?"],
  "/de/black-friday-konsolen-schweiz/": ["Black Friday PS5 Schweiz", "PlayStation 5 Pro Black Friday CH", "Nintendo Switch 2 Black Friday Schweiz", "Xbox Series X Black Friday Schweiz", "EA Sports FC 27 Black Friday Schweiz", "Gibt es die PS5 am Black Friday günstiger?"],
  "/de/black-friday-haushalt-schweiz/": ["Black Friday Dyson Schweiz", "Dyson Schweiz Black Friday", "Dyson Airwrap Black Friday Schweiz", "Saugroboter Black Friday Schweiz", "Roborock Black Friday Schweiz", "Dreame Saugroboter Black Friday CH", "Waschmaschine Black Friday Schweiz", "Tumbler Aktion Black Friday Schweiz", "Luftreiniger Black Friday Schweiz", "Luftbefeuchter Black Friday Schweiz", "Dyson V15 Black Friday Preis"],
  "/de/black-friday-winterreifen-schweiz/": ["Winterreifen Black Friday Schweiz", "Winterreifen günstig Schweiz", "Winterreifenpflicht Schweiz", "Michelin Winterreifen Angebot", "Reifendirekt Schweiz Black Friday", "Autozubehör Black Friday Schweiz", "Skihelm Black Friday Schweiz", "Skijacke Black Friday Schweiz", "Wann muss man in der Schweiz Winterreifen montieren?"],
  "/de/black-friday-usa-schweiz/": ["Black Friday USA Schweiz", "Amazon.com Schweiz bestellen", "Best Buy Black Friday", "Walmart Black Friday", "Zoll MWST USA Bestellung Schweiz", "Kann ich US Black Friday Deals in die Schweiz bestellen?"],
  "/de/lohnt-sich-black-friday/": ["lohnt sich Black Friday", "Lohnt sich Black Friday Schweiz", "Fake Rabatte Black Friday", "Black Friday Preisverlauf", "Black Friday Preisvergleich Schweiz", "Black Friday Tipps Schweiz", "Black Friday 50 Prozent Rabatt Schweiz", "Black Friday Vorverkauf Schweiz", "Black Friday VIP Zugang Schweiz", "Singles Day vs Black Friday Schweiz", "Cyber Monday Elektronik Schweiz", "Lohnt sich Black Friday in der Schweiz?"],
  "/de/black-friday-galaxus-digitec-2026/": ["Galaxus Black Friday 2026", "Galaxus Black Week", "Galaxus Rabatt Black Friday", "Digitec Black Friday 2026", "Digitec Black Week", "Digitec Black Friday Angebote", "Black Friday Weeks Galaxus", "Digitec Galaxus 16. November", "Wann startet Galaxus mit Black Friday 2026?"],
  "/de/amazon-black-friday-schweiz-2026/": ["Amazon Black Friday Schweiz", "Amazon.de Schweiz Lieferung", "Amazon Black Friday 2026 Datum", "Amazon Black Friday Week", "Kann ich bei Amazon.de aus der Schweiz bestellen?"],
  "/de/singles-day-schweiz-2026/": ["Singles Day Schweiz 2026", "Singles Day 11.11. Angebote", "Singles Day MediaMarkt Schweiz", "Singles Day Galaxus", "Wann ist Singles Day 2026?"],
  "/de/black-friday-apple-schweiz/": ["Black Friday Apple Schweiz", "Apple Black Friday Schweiz", "AirPods Pro Black Friday Schweiz", "Apple Watch Black Friday Schweiz", "MacBook Air Black Friday Schweiz", "MacBook Pro Black Friday CH", "iPad Black Friday Schweiz", "Garmin Uhr Black Friday Schweiz", "Wo kaufe ich Apple am Black Friday am günstigsten in der Schweiz?"],
  "/de/black-friday-handy-abo-schweiz/": ["Handy Abo Black Friday Schweiz", "Handy Abo unlimitiert Black Friday", "Internet Abo Black Friday Schweiz", "TV Abo Black Friday Schweiz", "Glasfaser Internet Black Friday Schweiz", "eSIM Schweiz Black Friday", "Sunrise Black Friday", "Sunrise Black Friday Abo", "Swisscom Black Friday", "Swisscom Black Friday Angebote", "Salt Black Friday", "Salt Mobile Black Friday", "Salt Fiber Black Friday", "yallo Black Friday", "yallo Black Friday Abo", "Wingo Black Friday", "Wingo Swiss Black Friday", "Lebara Schweiz Black Friday", "Lycamobile Schweiz Black Friday", "TalkTalk Schweiz Black Friday", "Coop Mobile Black Friday", "M-Budget Mobile Black Friday", "iWay Black Friday", "Init7 Black Friday", "Welches ist das beste Handy-Abo am Black Friday in der Schweiz?"],
  "/de/black-friday-kaffeevollautomat-schweiz/": ["Kaffeemaschine Black Friday Schweiz", "Jura Kaffeemaschine Black Friday", "DeLonghi Kaffeevollautomat Black Friday CH", "Sage Barista Black Friday Schweiz"],
  "/de/black-friday-kueche-schweiz/": ["Nespresso Black Friday Schweiz", "KitchenAid Black Friday Schweiz", "Thermomix Black Friday Schweiz", "Heissluftfritteuse Black Friday Schweiz", "Sodastream Black Friday Schweiz", "Raclette Ofen Black Friday Schweiz"],
  "/de/black-friday-smart-home-schweiz/": ["Philips Hue Black Friday Schweiz", "Smart Home Black Friday Schweiz", "Amazon Echo Black Friday Schweiz"],
  "/de/black-friday-kopfhoerer-schweiz/": ["Bose Schweiz Black Friday", "Bose QuietComfort Black Friday Schweiz", "Sony Schweiz Black Friday", "Sony WH-1000XM6 Black Friday Schweiz", "Sonos Black Friday Schweiz", "Sonos Arc Black Friday Schweiz", "AirPods Pro Black Friday Schweiz", "Logitech Schweiz Black Friday"],
  "/de/black-friday-schuhe-sneaker-schweiz/": ["Ochsner Sport Black Friday", "Ochsner Shoes Black Friday", "Dosenbach Black Friday", "SportXX Black Friday", "Nike Schweiz Black Friday", "Adidas Schweiz Black Friday", "On Running Black Friday Schweiz", "Zalando Schweiz Black Friday"],
  "/de/black-friday-bekleidung-schweiz/": ["H&M Schweiz Black Friday", "Zara Schweiz Black Friday", "Mango Schweiz Black Friday", "PKZ Black Friday", "Globus Black Friday", "Jelmoli Black Friday", "Tally Weijl Black Friday", "Zalando Lounge Black Friday CH"],
  "/de/black-friday-beauty-parfum-schweiz/": ["Douglas Schweiz Black Friday", "Marionnaud Schweiz Black Friday", "Sephora Schweiz Black Friday", "Import Parfumerie Black Friday", "Rituals Schweiz Black Friday", "Lush Schweiz Black Friday", "Kiko Milano Schweiz Black Friday", "Calzedonia Schweiz Black Friday", "Intimissimi Schweiz Black Friday"],
  "/de/black-friday-spielzeug-lego-schweiz/": ["Lego Black Friday Schweiz", "Playmobil Black Friday Schweiz", "Franz Carl Weber Black Friday", "Smyths Toys Schweiz Black Friday", "Toniebox Black Friday Schweiz"],
  "/de/black-friday-baby-kinder-schweiz/": ["Babyartikel Black Friday Schweiz", "Kinderwagen Black Friday Schweiz", "Kindersitz Black Friday Schweiz"],
  "/de/black-friday-haustier-schweiz/": ["Qualipet Black Friday", "Fressnapf Schweiz Black Friday", "Zooplus Schweiz Black Friday"],
  "/de/black-friday-e-bike-schweiz/": ["E-Bike Black Friday Schweiz", "E-Scooter Black Friday Schweiz", "Velo Black Friday Schweiz"],
  "/de/black-friday-reisen-fluege-schweiz/": ["SWISS Flugangebote Black Friday", "Edelweiss Air Black Friday", "easyJet Schweiz Black Friday", "Hotelcard Black Friday", "Wellness Hotel Schweiz Black Friday", "Therme Vals Black Friday", "Europa-Park Tickets Black Friday Schweiz", "Skipass Black Friday Schweiz", "SBB Tageskarte Black Friday", "Halbtax Black Friday Aktion", "Autobahnvignette 2027 Black Friday"],
  "/de/black-friday-smartphones-schweiz/": ["Samsung Galaxy S26 Black Friday Schweiz", "Samsung Schweiz Black Friday"],
  "/de/black-friday-gaming-pc-laptop-schweiz/": ["Gaming Laptop Black Friday Schweiz", "Gaming PC Black Friday Schweiz", "HP Store Schweiz Black Friday", "Lenovo Schweiz Black Friday", "Dell Schweiz Black Friday"],
  "/fr/black-friday-2026-date-suisse/": ["Black Friday 2026 date", "date Black Friday Suisse", "Black Week 2026 Suisse", "Cyber Monday 2026 Suisse", "Quand a lieu le Black Friday 2026 en Suisse ?"],
  "/it/black-friday-2026-data-svizzera/": ["Black Friday 2026 data", "data Black Friday Svizzera", "Black Week 2026 Svizzera", "Cyber Monday 2026 Svizzera", "Quando è il Black Friday 2026 in Svizzera?"],
  "/en/black-friday-2026-date-switzerland/": ["Black Friday 2026 date Switzerland", "when is Black Friday 2026", "Black Week 2026 Switzerland", "Cyber Monday 2026 Switzerland", "Galaxus Black Friday 2026 date", "When does Black Friday start in Switzerland?"]
};
