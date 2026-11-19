/* Live deals in Switzerland. First researched 10.11.2026; audited and updated 19.11.2026 (older rows pruned; only rows re-confirmed on retailer pages on 19.11. remain); previously 14.11.2026 (re-checked on retailer pages and dated Swiss deal reports:
   Preispirat, Toppreise, BlackFridayDeals.ch, Black-Friday.ch, delamar and German tech sites for Amazon.de). Ended, expired and unconfirmable rows removed.
   Fields: shop key (src/config/shops.js), cat, name, spec, price (null for % actions), was, cur, percent, code, from/until (YYYY-MM-DD),
   type, url (deal page), q (search term), checked (date), note, src (source URLs).
   A row without `until` is shown for 3 days after `checked`, then disappears automatically. */
export const LIVE_CH = [
{"shop":"digitec","cat":"TV","name":"LG OLED65C67LA 65\" C6 OLED 4K 2026","spec":"65 inch OLED · 4K · 165 Hz","price":1299,"was":1706.8,"cur":"CHF","percent":24,"checked":"2026-11-19","until":"2026-11-30","type":"Black Week","note":"Digitec 1299 vs 1706.80; Galaxus and MediaMarkt CH list the same price. Black Friday weeks run to 30.11 at the latest, while stocks last.","url":"https://www.digitec.ch/en/s1/product/lg-oled65c67la-65-c6-oled-4k-2026-ch-tv-69071882","src":["https://www.digitec.ch/en/s1/product/lg-oled65c67la-65-c6-oled-4k-2026-ch-tv-69071882","https://www.galaxus.ch/en/s1/product/lg-oled65c67la-65-c6-oled-4k-2026-ch-tv-69071882","https://www.mediamarkt.ch/de/campaign/black-friday-tv-und-audio-deals"]},
{"shop":"digitec","cat":"Robot vacuums","name":"Dreame L50 Ultra AE (white)","spec":"28000 Pa · rotating wiping pads · self-emptying","price":369,"was":428.99,"cur":"CHF","percent":14,"checked":"2026-11-19","type":"Black Week","note":"Digitec 369 vs 428.99 (white variant); MediaMarkt lists the same price.","url":"https://www.digitec.ch/en/s1/product/dreame-l50-ultra-ae-28000-pa-wiping-pads-rotating-robot-vacuum-cleaners-68597155","src":["https://www.digitec.ch/en/s1/product/dreame-l50-ultra-ae-28000-pa-wiping-pads-rotating-robot-vacuum-cleaners-68597155","https://www.mediamarkt.ch/de/campaign/black-friday-haushalt-heim-und-hobby-deals"]},
{"shop":"digitec","cat":"Cameras","name":"Sony Alpha 7 IV Kit II ILCE-7M4K 28-70mm","spec":"33 MP full frame · FE 28-70 mm kit","price":1599,"was":1867,"cur":"CHF","percent":14,"checked":"2026-11-19","type":"Black Week","note":"Digitec 1599 vs 1867; MediaMarkt lists the same price.","url":"https://www.digitec.ch/en/s1/product/sony-alpha-7-iv-kit-ii-28-70-mm-33-mpx-full-frame-cameras-69584626","src":["https://www.digitec.ch/en/s1/product/sony-alpha-7-iv-kit-ii-28-70-mm-33-mpx-full-frame-cameras-69584626","https://www.mediamarkt.ch/de/campaign/black-friday-foto-und-e-mobility-deals"]},
{"shop":"fust","cat":"Kitchen","name":"Philips 3000 Series NA351/09 airfryer","spec":"9 L dual basket","price":99.95,"was":199.95,"cur":"CHF","checked":"2026-11-19","src":["https://www.fust.ch/kuechengeraete/kochen-backen-mikrowellen/airfryer-friteuse/philips-3000-series-na351-09-/p/10795548","https://blackfriday.toppreise.ch/singles-day/"],"url":"https://www.fust.ch/kuechengeraete/kochen-backen-mikrowellen/airfryer-friteuse/philips-3000-series-na351-09-/p/10795548","type":"Black Week early","until":"2026-11-24"},
{"shop":"fust","cat":"Coffee","name":"JURA E8 Platin (SDS)","spec":"Fully automatic coffee machine","price":999.95,"was":1499.95,"cur":"CHF","checked":"2026-11-19","src":["https://www.fust.ch/kuechengeraete/jura-kaffeewelt/jura-kaffeevollautomaten-haushalt/jura-e8-platin-sds-/p/10820617","https://blackfriday.ch/deals/"],"until":"2026-11-22","url":"https://www.fust.ch/kuechengeraete/jura-kaffeewelt/jura-kaffeevollautomaten-haushalt/jura-e8-platin-sds-/p/10820617","type":"Black Week deal","note":"Fust Black Week (Vorab) window ends 22.11 per blackfriday.ch; Black Friday promo to 30.11."},
{"shop":"fust","url":"https://www.fust.ch/haushalt/buegeln-naehen/buegelsystem/laurastar-smart-d-/p/10667387","cat":"Home","name":"Laurastar Smart D ironing system","spec":"Ironing system","price":999.9,"was":1599.9,"cur":"CHF","checked":"2026-11-19","src":["https://www.black-friday.ch/shops/fust"],"until":"2026-11-20","type":"Black Friday early","q":"Laurastar Smart D"},
];

export const SHOWCASES = [
 {
  "name": "Preispirat",
  "url": "https://www.preispirat.ch/",
  "covers": "Largest Swiss community deal blog: daily deals from all Swiss shops, Black Friday and Singles Day hubs, voucher codes."
 },
 {
  "name": "Toppreise Black Friday",
  "url": "https://blackfriday.toppreise.ch/",
  "covers": "Black Friday hub of the Swiss price-comparison site: top deals, Singles Day, mobile plans."
 },
 {
  "name": "BlackFridayDeals.ch",
  "url": "https://www.blackfridaydeals.ch/",
  "covers": "Black Friday aggregator with top deals per shop: Apple, laptops, TVs, appliances, mobile plans."
 },
 {
  "name": "Black-Friday.ch",
  "url": "https://www.black-friday.ch/",
  "covers": "Editors' picks and top offers across electronics, beauty, fashion, furniture and subscriptions."
 },
 {
  "name": "SinglesDayDeals.ch",
  "url": "https://www.singlesdaydeals.ch/",
  "covers": "Singles Day (11.11.) and Singles Week offers from Swiss shops."
 },
 {
  "name": "DayDeal",
  "url": "https://www.daydeal.ch/",
  "covers": "Digitec Galaxus group: one deal of the day plus deals of the week per category."
 },
 {
  "name": "Blick Deal",
  "url": "https://box.blick.ch/",
  "covers": "Blick's daily and weekly deals, fulfilled by Brack."
 },
 {
  "name": "QoQa",
  "url": "https://www.qoqa.ch/de",
  "covers": "Swiss daily-deal shop with limited one-day offers."
 },
 {
  "name": "MediaMarkt Singles Day",
  "url": "https://www.mediamarkt.ch/de/campaign/singles-day",
  "covers": "MediaMarkt Switzerland Singles Day and Black November campaigns."
 }
];
