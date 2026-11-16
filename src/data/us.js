/* US deals refreshed 16 Nov 2026 (earlier rows pruned). Every row was confirmed by two independent pages dated 11–12 Nov 2026 (9to5toys, Macworld, macprices,
   NBC Select, Tom's Guide, dealnews, Yahoo Shopping, Digital Trends, PopSci, Bob Vila and similar). Earlier years' prices are not used.
   Fields: [category, name, spec, dealUSD, regularUSD, retailerKey, searchQuery, validUntil|null, checked YYYY-MM-DD, {src, note, url}?].
   Deep US review 12.11.2026: Amazon.com, Walmart, Target, Best Buy, Home Depot; one row per product (the row with an exact product page wins).
   main.js hides a row after validUntil, or 3 days after `checked` when no end date is known, so unconfirmed deals disappear on their own.
   Upcoming events (Best Buy 19 Nov, Amazon 19-30 Nov, Walmart BF 23 Nov) are in calendar.js and are added when they go live. */
export const US_RAW = [
["Audio","Apple AirPods Max 2","H2 · USB-C · Amazon early deal",449,549,"amazoncom","AirPods Max 2",null,"2026-11-16",{"src":["https://www.tomsguide.com/live/news/black-friday-2026-live-deals-and-more","https://9to5toys.com/2026/11/15/best-early-black-friday-apple-deals-apple-tv-4k-airpods-airtag/"],"note":"$100 off; confirmed by two pages dated 15 Nov.","url":"https://www.amazon.com/dp/B0GSS4SGZR"}],
["Wearables","Apple Watch Ultra 4","Black/Natural · Trail or Alpine band · Amazon early deal",699,799,"amazoncom","Apple Watch Ultra 4",null,"2026-11-16",{"src":["https://www.tomsguide.com/live/news/black-friday-2026-live-deals-and-more","https://9to5toys.com/2026/11/15/best-early-black-friday-apple-deals-apple-tv-4k-airpods-airtag/"],"note":"Only the $699 band variants; Milanese Loop versions cost more.","url":"https://www.amazon.com/dp/B0HJB42BMK"}],
["Laptops","Apple MacBook Air 13\" M5","16 GB · 512 GB · Amazon early deal",1099,1299,"amazoncom","MacBook Air 13 M5 16GB 512GB",null,"2026-11-16",{"src":["https://www.tomsguide.com/live/news/black-friday-2026-live-deals-and-more","https://9to5toys.com/2026/11/15/best-early-black-friday-apple-deals-apple-tv-4k-airpods-airtag/"],"url":"https://www.amazon.com/dp/B0GR1J6T45"}]
];

export const US_SHOPINFO = [
 ["amazoncom","Amazon.com","Apple, Amazon devices, headphones, kitchen","Black Friday Week from about a week before Thanksgiving, then Cyber Monday","Most items don't ship to Switzerland","https://www.amazon.com/"],
 ["bestbuy","Best Buy","TVs, laptops, appliances, gaming","Early doorbusters in November; price-match guarantee","US addresses only; no shipping abroad","https://www.bestbuy.com/"],
 ["walmart","Walmart","Consoles, AirPods, TVs, toys","Several deal waves from early November; Walmart+ members get early access","US addresses only","https://www.walmart.com/"],
 ["target","Target","Toys, home, Apple, TVs","Week-long Black Friday sale; Target Circle deals","US addresses only","https://www.target.com/"],
 ["costco","Costco","Home, electronics, appliances, grocery bundles","Warehouse and online coupon book; Black Friday ad published in November","Members only; US addresses only","https://www.costco.com/"],
 ["homedepot","Home Depot","Tools, appliances, outdoor, smart home","Early Black Friday deals from early November","US addresses only","https://www.homedepot.com/"],
 ["lowes","Lowe's","Appliances, tools, outdoor","Black Friday sale from early November","US addresses only","https://www.lowes.com/"],
 ["ulta","Ulta Beauty","Beauty, skincare, fragrance, hair tools","Black Friday week sale on selected brands","US addresses only","https://www.ulta.com/"]
];
