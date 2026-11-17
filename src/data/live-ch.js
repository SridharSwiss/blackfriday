/* Live deals in Switzerland. First researched 10.11.2026; audited and updated 14.11.2026 (re-checked on retailer pages and dated Swiss deal reports:
   Preispirat, Toppreise, BlackFridayDeals.ch, Black-Friday.ch, delamar and German tech sites for Amazon.de). Ended, expired and unconfirmable rows removed.
   Fields: shop key (src/config/shops.js), cat, name, spec, price (null for % actions), was, cur, percent, code, from/until (YYYY-MM-DD),
   type, url (deal page), q (search term), checked (date), note, src (source URLs).
   A row without `until` is shown for 3 days after `checked`, then disappears automatically. */
export const LIVE_CH = [
{"shop":"digitec","cat":"TV","name":"LG OLED65C67LA 65\" C6 OLED 4K 2026","spec":"65 inch OLED · 4K · 165 Hz","price":1299,"was":1706.8,"cur":"CHF","percent":24,"checked":"2026-11-17","until":"2026-11-30","type":"Black Week","note":"Digitec 1299 vs 1706.80; MediaMarkt lists the same price.","url":"https://www.digitec.ch/en/s1/product/lg-oled65c67la-65-c6-oled-4k-2026-ch-tv-69071882","src":["https://www.digitec.ch/en/s1/product/lg-oled65c67la-65-c6-oled-4k-2026-ch-tv-69071882","https://www.mediamarkt.ch/de/campaign/black-friday-lg-deals"]},
{"shop":"digitec","cat":"Robot vacuums","name":"Dreame L50 Ultra AE (white)","spec":"28000 Pa · rotating wiping pads · self-emptying","price":369,"was":428.99,"cur":"CHF","percent":14,"checked":"2026-11-17","type":"Black Week","note":"Digitec 369 vs 428.99 (white variant); MediaMarkt lists the same price.","url":"https://www.digitec.ch/en/s1/product/dreame-l50-ultra-ae-28000-pa-wiping-pads-rotating-robot-vacuum-cleaners-68597155","src":["https://www.digitec.ch/en/s1/product/dreame-l50-ultra-ae-28000-pa-wiping-pads-rotating-robot-vacuum-cleaners-68597155","https://www.mediamarkt.ch/de/campaign/black-friday-haushalt-heim-und-hobby-deals"]},
{"shop":"digitec","cat":"Cameras","name":"Sony Alpha 7 IV Kit II ILCE-7M4K 28-70mm","spec":"33 MP full frame · FE 28-70 mm kit","price":1599,"was":1867,"cur":"CHF","percent":14,"checked":"2026-11-17","type":"Black Week","note":"Digitec 1599 vs 1867; MediaMarkt lists the same price.","url":"https://www.digitec.ch/en/s1/product/sony-alpha-7-iv-kit-ii-28-70-mm-33-mpx-full-frame-cameras-69584626","src":["https://www.digitec.ch/en/s1/product/sony-alpha-7-iv-kit-ii-28-70-mm-33-mpx-full-frame-cameras-69584626","https://www.mediamarkt.ch/de/campaign/black-friday-foto-und-e-mobility-deals"]},
{"shop":"fust","cat":"Appliances","name":"Samsung RB34C672CS9 fridge-freezer","spec":"344 L · NoFrost+","price":699.95,"was":1199.95,"cur":"CHF","checked":"2026-11-14","src":["https://www.fust.ch/kuechengeraete/kuehlschraenke-gefrierschraenke/kuehlschrank-mit-gefrierfach-freistehend/samsung-rb34c672cs9-ws-/p/10766989","https://www.black-friday.ch/"],"url":"https://www.fust.ch/kuechengeraete/kuehlschraenke-gefrierschraenke/kuehlschrank-mit-gefrierfach-freistehend/samsung-rb34c672cs9-ws-/p/10766989","type":"Black Week early","until":"2026-11-18"},
{"shop":"fust","cat":"Kitchen","name":"Philips 3000 Series NA351/09 airfryer","spec":"9 L dual basket","price":99.95,"was":199.95,"cur":"CHF","checked":"2026-11-17","src":["https://www.fust.ch/kuechengeraete/kochen-backen-mikrowellen/airfryer-friteuse/philips-3000-series-na351-09-/p/10795548","https://blackfriday.toppreise.ch/singles-day/"],"url":"https://www.fust.ch/kuechengeraete/kochen-backen-mikrowellen/airfryer-friteuse/philips-3000-series-na351-09-/p/10795548","type":"Black Week early","until":"2026-11-24"},
{"shop":"fust","cat":"TV","name":"Samsung The Frame 55\" (QE55LS03FAUXXN)","spec":"4K QLED · matte display","price":799.9,"was":1299.9,"cur":"CHF","checked":"2026-11-17","src":["https://www.fust.ch/de/tv-audio-gaming/fernseher-beamer-tv-zubehoer/fernseher/samsung-the-frame-qe55ls03fauxxn-55-4k-qled-tv-/p/10808942","https://www.blackfridaydeals.ch/"],"url":"https://www.fust.ch/de/tv-audio-gaming/fernseher-beamer-tv-zubehoer/fernseher/samsung-the-frame-qe55ls03fauxxn-55-4k-qled-tv-/p/10808942","type":"Black Week early","until":"2026-11-18"},
{"shop":"fnac","url":"https://www.de.fnac.ch/Asus-ExpertBook-B1-B1403CVA-S64759X-Laptop-14-Zoll-Intel-Core-7-150U-Intel-Grafik-64-GB-RAM-1-TB-SSD-Grau/a23585371","cat":"Computers","name":"ASUS ExpertBook B1 B1403CVA","spec":"14\" · Core 7 150U · 64 GB · 1 TB","price":949,"was":1199.9,"cur":"CHF","checked":"2026-11-14","src":["https://www.black-friday.ch/out/24502-asus-expertbook-b1-b1403cva-s64759x/"],"until":"2026-11-17","type":"Black Friday early"},
{"shop":"post","cat":"Audio","name":"Apple AirPods Pro 2 (USB-C)","spec":"ANC · MagSafe case","price":149,"was":199,"cur":"CHF","checked":"2026-11-14","src":["https://blackfriday.toppreise.ch/","https://www.black-friday.ch/","https://www.blackfridaydeals.ch/"],"until":"2026-11-17","url":"https://shop.post.ch/de/elektronik/audio/kopfhorer/apple-airpods-pro-2nd-gen-/p/766852","note":"Post shop deal.","type":"Aktion"},
{"shop":"ikea","cat":"Home","name":"IKEA Family: 20 % off all candles","spec":"Happy November offers","price":null,"was":null,"cur":"CHF","checked":"2026-11-14","src":["https://www.ikea.com/ch/de/"],"url":"https://www.ikea.com/ch/de/","note":"IKEA Family members; new offers every week.","type":"Members","percent":20,"until":"2026-11-30"},
{"shop":"ikea","cat":"Home","name":"IKEA Family: 20 % off ONSEVIG rugs","spec":"Rugs","price":null,"was":null,"cur":"CHF","checked":"2026-11-14","src":["https://www.ikea.com/ch/de/"],"url":"https://www.ikea.com/ch/de/","note":"IKEA Family members.","type":"Members","percent":20,"until":"2026-11-30"},
{"shop":"karcher","cat":"Tools","name":"Kärcher: 25 % off all cleaning agents","spec":"Home & Garden","price":null,"was":null,"cur":"CHF","checked":"2026-11-14","src":["https://www.karcher.com/ch/de/"],"until":"2026-11-18","url":"https://www.karcher.com/ch/de/","type":"Aktion","percent":25},
{"shop":"fust","url":"https://www.fust.ch/haushalt/buegeln-naehen/buegelsystem/laurastar-smart-d-/p/10667387","cat":"Home","name":"Laurastar Smart D ironing system","spec":"Ironing system","price":999.9,"was":1599.9,"cur":"CHF","checked":"2026-11-14","src":["https://www.black-friday.ch/shops/fust"],"until":"2026-11-20","type":"Black Friday early","q":"Laurastar Smart D"},
{"shop":"fust","url":"https://www.fust.ch/haushalt/zahnpflege/schallzahnbuerste/philips-sonicare-series-6500-hx7411-10-/p/10824125","cat":"Beauty","name":"Philips Sonicare 6500","spec":"Sonic toothbrush","price":89.95,"was":129.95,"cur":"CHF","checked":"2026-11-14","src":["https://www.black-friday.ch/shops/fust"],"until":"2026-11-21","type":"Black Friday early","q":"Philips Sonicare 6500"},
{"shop":"fust","cat":"Coffee","name":"JURA E8 Platin (SDS)","spec":"Fully automatic coffee machine","price":999.95,"was":1499.95,"cur":"CHF","checked":"2026-11-17","src":["https://www.fust.ch/kuechengeraete/jura-kaffeewelt/jura-kaffeevollautomaten-haushalt/jura-e8-platin-sds-/p/10820617","https://blackfriday.ch/deals/"],"until":"2026-11-22","url":"https://www.fust.ch/kuechengeraete/jura-kaffeewelt/jura-kaffeevollautomaten-haushalt/jura-e8-platin-sds-/p/10820617","type":"Black Week deal","note":"Fust Black Week (Vorab) window ends 22.11 per blackfriday.ch; Black Friday promo to 30.11."},
{"shop":"fust","cat":"Monitors","name":"HP OMEN 34c G2 gaming monitor","spec":"34\" curved WQHD · 180 Hz","price":259.95,"was":429.9,"cur":"CHF","checked":"2026-11-17","src":["https://www.fust.ch/tv-audio-gaming/gaming/pc-gaming/gaming-monitor/hp-gaming-monitor-omen-34c-g2-34-wqhd-3440-x-1440-180-hz-/p/10818335","https://blackfriday.ch/deals/"],"until":"2026-11-22","url":"https://www.fust.ch/tv-audio-gaming/gaming/pc-gaming/gaming-monitor/hp-gaming-monitor-omen-34c-g2-34-wqhd-3440-x-1440-180-hz-/p/10818335","type":"Black Week deal","note":"Fust Black Week (Vorab) window ends 22.11 per blackfriday.ch; Black Friday promo to 30.11."},
{"shop":"hp","cat":"Home","name":"HP LaserJet Tank 1504w","spec":"Mono ink tank printer","price":149.49,"was":299,"cur":"CHF","checked":"2026-11-14","src":["https://www.preispirat.ch/hp-laserjet-tank-1504w-drucker-hp-black-friday/","https://www.blackfridaydeals.ch/"],"url":"https://www.hp.com/ch-de/shop/products/printers/hp-laserjet-tank-1504w-drucker-2r7f3a-baz","type":"Black Friday early","note":"HP Store Switzerland. Black Friday 27.11 per blackfridaydeals.ch.","until":"2026-11-30"},
{"shop":"wingo","cat":"Mobile Plans & Internet","name":"Wingo Red","spec":"Alles unlimitiert in CH","price":23.95,"was":79,"cur":"CHF","percent":70,"checked":"2026-11-16","until":"2026-11-17","url":"https://www.wingo.ch/","type":"Aktion","src":["https://www.blackfridaydeals.ch/","https://www.black-friday.ch/"],"note":"−70 % Black Friday mobile plan."},
{"shop":"yallo","cat":"Mobile Plans & Internet","name":"yallo BLACK","spec":"Alles unlimitiert in CH","price":24.9,"was":93,"cur":"CHF","percent":73,"checked":"2026-11-16","until":"2026-11-17","url":"https://www.yallo.ch/","type":"Aktion","src":["https://www.blackfridaydeals.ch/","https://www.black-friday.ch/"],"note":"−73 % Black Friday mobile plan."},
{"shop":"salt","cat":"Mobile Plans & Internet","name":"Salt Europe Surf Call","spec":"Black Friday mobile plan","price":19.95,"was":74.95,"cur":"CHF","percent":73,"checked":"2026-11-16","until":"2026-11-18","url":"https://www.salt.ch/","type":"Aktion","src":["https://www.blackfridaydeals.ch/","https://www.black-friday.ch/"],"note":"−73 % Black Friday mobile plan."},
{"shop":"coop","cat":"Mobile Plans & Internet","name":"Coop Mobile Swiss S","spec":"Mobile plan","price":9.95,"was":29.9,"cur":"CHF","percent":67,"checked":"2026-11-16","until":"2026-11-20","url":"https://www.coop-mobile.ch/","type":"Aktion","src":["https://www.blackfridaydeals.ch/","https://www.black-friday.ch/"],"note":"−67 % Black Friday mobile plan."}
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
