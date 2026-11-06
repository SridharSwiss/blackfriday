/* US deals live on 6 Nov 2026. Every row was confirmed by two independent pages dated 25 Oct - 6 Nov 2026.
   Last year's (2025) prices were removed. Optional 8th field = last valid day (YYYY-MM-DD); main.js hides a row after that day.
   Upcoming events (Walmart 12 Nov, Best Buy 19 Nov, Walmart BF 23 Nov, Costco/Ninja/Dyson later) are in calendar.js and are added when they go live.
   Format: [category, name, spec, dealPriceUSD, regularUSD, retailer, searchQuery, validUntil] */
export const US_RAW = [
["Audio","Bose QuietComfort Headphones","Over-ear ANC · Amazon early Black Friday deal",169,359,"amazoncom","Bose QuietComfort Headphones",null],
["Audio","Apple AirPods Max 2","USB-C · Amazon deal seen 29 Oct 2026",449,549,"amazoncom","AirPods Max USB-C",null],
["Smart Home","SimpliSafe 10-Piece Security System with Outdoor Camera Series 2","Costco online only, limit 2 · to 15 Nov",99.99,199.99,"costco","simplisafe 10 piece security system outdoor camera","2026-11-15"],
["Home","Dyson Purifier Hot+Cool HP11","Air purifier + heater/fan · Costco to 15 Nov",399.99,599.99,"costco","dyson purifier hot cool hp11","2026-11-15"],
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
