/* Deal calendar 2026 (checked 28.10.2026; Digitec dates 05.11.2026; MediaMarkt Singles Day 07.11.2026; Walmart, Best Buy and Amazon dates 10.11.2026). "expected" = retailer has not announced yet.
   Sources: Hip2Save (Walmart, Target), Slickdeals (Best Buy), Digitec/Galaxus Black Friday weeks page, MediaMarkt CH campaign page. */
export const EVENTS = [
  { date:"2026-11-05", region:"US", title:"Target early Black Friday", text:"Target's Early Black Friday Deals event, 5–7 November; Holiday Price Match runs to 24 December." },
  { date:"2026-11-06", region:"US", title:"Best Buy early Black Friday", text:"Best Buy's early Black Friday deals started 6 November, with a new wave every Friday (week 2 live from 9 November: up to 50% off selected OLED TVs)." },
  { date:"2026-11-11", region:"CH", title:"Singles Day", text:"Smaller discounts in Switzerland. MediaMarkt CH runs a Singles Day sale from 11 to 14 November." },
  { date:"2026-11-12", region:"US", title:"Walmart early Black Friday", text:"Walmart's early event runs 12–15 November, online from 12:01 a.m. ET; Walmart+ members get early access." },
  { date:"2026-11-19", region:"CH+US", title:"Amazon Black Friday Week", text:"Amazon US: Black Friday Week and Cyber Monday 19–30 November from 12:01 a.m. PT (announced by Amazon on 10 November). Amazon.de has not confirmed its dates yet. Best Buy's main Black Friday sale runs 19–28 November." },
  { date:"2026-11-16", region:"CH", title:"Digitec & Galaxus Black Friday weeks", text:"Confirmed by Digitec (page of 28.10.2026): 1,000+ offers go live on Monday 16 November and none are added later. They run until 30 November or while stock lasts." },
  { date:"2026-11-23", region:"CH+US", title:"Walmart Black Friday deals", text:"Walmart's Black Friday deals start online today (Best Buy's doorbusters run 19–28 Nov). Swiss shops other than Digitec/Galaxus are expected to follow." },
  { date:"2026-11-26", region:"US", title:"Thanksgiving", text:"Target's Black Friday deals go live online today; many US stores open doorbusters online." },
  { date:"2026-11-27", region:"CH+US", title:"Black Friday", text:"Peak day, confirmed by MediaMarkt CH. Swiss deals go live at midnight; limited stock sells out early.", peak:true },
  { date:"2026-11-28", region:"US", title:"Small Business Saturday", text:"Independent US shops run their own offers." },
  { date:"2026-11-30", region:"CH+US", title:"Cyber Monday", text:"Online deals; Swiss shops mostly extend Black Friday prices. Walmart's Cyber Monday deals run to 2 December." },
  { date:"2026-12-01", region:"US", title:"Giving Tuesday", text:"Charity day; deal season winds down." }
];

export const FAQ = [
  ["When is Black Friday 2026?", "Friday, 27 November 2026. Black Week in Switzerland runs from Monday 23 November, and Cyber Monday is 30 November."],
  ["Is everything really cheaper on Black Friday?", "No. Some shops raise prices shortly before. Compare with the record low shown on each product and the price a few weeks ago."],
  ["What does \"Buy now\" mean?", "Today's price is within 3% of the best price we know for that product, so waiting is unlikely to save much."],
  ["Can I order US deals to Switzerland?", "Rarely. Most US shops don't ship abroad and Amazon.com ships few items here. If they do, Swiss import VAT (8.1%) and fees apply, US devices may have different plugs, and warranties are often US-only."],
  ["How do you make money?", "Shop links are affiliate links. If you buy, the shop may pay us a commission; your price stays the same and rankings don't depend on it."],
  ["How does My list work?", "Tap the heart on any product. Your list is stored only in this browser. When you come back, products that got cheaper since your last visit are marked."],
  ["Which Swiss shops take part in Black Friday 2026?", "Digitec and Galaxus (Black Friday weeks from 16 November), MediaMarkt, Interdiscount, Fust, Brack, Manor, fnac and Amazon.de, which delivers many products to Switzerland. Most start Black Week on Monday 23 November."],
  ["When do Digitec and Galaxus start Black Friday 2026?", "On Monday 16 November 2026. More than 1,000 offers go live that day and run until 30 November or while stock lasts; no new offers are added later."],
  ["Can I order Amazon Black Friday deals from Switzerland?", "Yes, from Amazon.de for many products. German VAT is removed and Swiss VAT (8.1%) is added at checkout. Amazon US runs Black Friday Week from 19 to 30 November 2026, but most US items don't ship to Switzerland."],
  ["Is Black Friday worth it in Switzerland?", "Often, but not always. Electronics, headphones, robot vacuums and older iPhone models usually drop the most. Compare with the record low before buying; our Buy now / Wait call does this for the top 100, and the Live deals tab only lists offers checked this week."]
];

/* Localized FAQ for DE / FR / IT pages (page text and FAQPage structured data). Swiss German: "ss", never "ß". */
export const FAQ_I18N = {
  de: [
    ["Wann ist Black Friday 2026 in der Schweiz?", "Am Freitag, 27. November 2026. Die Black Week läuft vom 23. bis 29. November, Cyber Monday ist am 30. November und Singles Day am 11. November."],
    ["Wann starten Digitec und Galaxus mit Black Friday 2026?", "Am Montag, 16. November 2026. Über 1000 Angebote gehen an diesem Tag online und gelten bis 30. November oder solange Vorrat; später kommen keine neuen dazu."],
    ["Welche Schweizer Shops machen beim Black Friday 2026 mit?", "Digitec, Galaxus, MediaMarkt, Interdiscount, Fust, Brack, Manor, fnac und Amazon.de (liefert viele Produkte in die Schweiz). Die meisten starten am Montag, 23. November."],
    ["Kann ich Amazon-Black-Friday-Deals aus der Schweiz bestellen?", "Ja, bei Amazon.de für viele Produkte. Die deutsche MWST fällt weg, an der Kasse kommt die Schweizer MWST von 8,1 % dazu. Amazon USA liefert die meisten Artikel nicht in die Schweiz."],
    ["Lohnt sich Black Friday in der Schweiz?", "Oft, aber nicht immer. Elektronik, Kopfhörer, Saugroboter und ältere iPhones fallen meist am stärksten. Vergleiche mit dem Tiefstpreis; unsere Kaufen-oder-Warten-Empfehlung macht das für die Top 100, und unter «Live-Deals» stehen nur diese Woche geprüfte Angebote."],
    ["Was bedeutet «Jetzt kaufen» bei Aktion.ch?", "Der heutige Preis liegt höchstens 3 % über dem besten bekannten Preis. Warten bringt also kaum noch etwas."],
    ["Wie erkenne ich falsche Black-Friday-Rabatte?", "Viele Rabatte beziehen sich auf einen Listenpreis, den kaum jemand zahlt. Schau auf den Preisverlauf der letzten Wochen, zum Beispiel bei Toppreise, und auf den bisherigen Tiefstpreis."],
    ["Wie verdient Aktion.ch Geld?", "Shop-Links sind Affiliate-Links. Kaufst du darüber, kann der Shop uns eine Provision zahlen; dein Preis bleibt gleich und die Rangliste hängt nicht davon ab."]
  ],
  fr: [
    ["Quand a lieu le Black Friday 2026 en Suisse ?", "Le vendredi 27 novembre 2026. La Black Week va du 23 au 29 novembre, le Cyber Monday est le 30 novembre et le Singles Day le 11 novembre."],
    ["Quand Digitec et Galaxus commencent-ils le Black Friday 2026 ?", "Le lundi 16 novembre 2026. Plus de 1000 offres sont en ligne dès ce jour, jusqu'au 30 novembre ou jusqu'à épuisement des stocks."],
    ["Quelles boutiques suisses participent au Black Friday 2026 ?", "Digitec, Galaxus, MediaMarkt, Interdiscount, Fust, Brack, Manor, fnac et Amazon.de, qui livre de nombreux produits en Suisse. La plupart commencent le lundi 23 novembre."],
    ["Peut-on commander les offres Amazon depuis la Suisse ?", "Oui, sur Amazon.de pour de nombreux produits. La TVA allemande est retirée et la TVA suisse de 8,1 % est ajoutée au paiement."],
    ["Le Black Friday vaut-il la peine en Suisse ?", "Souvent, mais pas toujours. Comparez avec le prix le plus bas : notre conseil acheter ou attendre le fait pour le top 100, et l'onglet Live deals ne liste que des offres vérifiées cette semaine."],
    ["Comment Aktion.ch gagne-t-il de l'argent ?", "Les liens vers les boutiques sont des liens affiliés. Si vous achetez, la boutique peut nous verser une commission ; votre prix ne change pas."]
  ],
  it: [
    ["Quando è il Black Friday 2026 in Svizzera?", "Venerdì 27 novembre 2026. La Black Week va dal 23 al 29 novembre, il Cyber Monday è il 30 novembre e il Singles Day l'11 novembre."],
    ["Quando iniziano Digitec e Galaxus il Black Friday 2026?", "Lunedì 16 novembre 2026. Oltre 1000 offerte sono online da quel giorno fino al 30 novembre o fino a esaurimento scorte."],
    ["Quali negozi svizzeri partecipano al Black Friday 2026?", "Digitec, Galaxus, MediaMarkt, Interdiscount, Fust, Brack, Manor, fnac e Amazon.de, che consegna molti prodotti in Svizzera. La maggior parte inizia lunedì 23 novembre."],
    ["Posso ordinare le offerte Amazon dalla Svizzera?", "Sì, su Amazon.de per molti prodotti. L'IVA tedesca viene tolta e alla cassa si aggiunge l'IVA svizzera dell'8,1 %."],
    ["Conviene il Black Friday in Svizzera?", "Spesso, ma non sempre. Confronta con il prezzo minimo: il nostro consiglio comprare o aspettare lo fa per la top 100, e la scheda Live deals elenca solo offerte verificate questa settimana."],
    ["Come guadagna Aktion.ch?", "I link ai negozi sono link di affiliazione. Se acquisti, il negozio può pagarci una commissione; il tuo prezzo resta uguale."]
  ]
};
