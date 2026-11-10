/* US deals live on 7 Nov 2026 (expired Best Buy Dyson row removed 10 Nov). Every row was confirmed by two independent pages (or the retailer's own page plus one) dated 1-7 Nov 2026.
   Rows that could no longer be confirmed on 7 Nov 2026 were removed. Optional 8th field = last valid day (YYYY-MM-DD); main.js hides a row after that day.
   Upcoming events (Walmart 12 Nov, Best Buy 19 Nov, Walmart BF 23 Nov, Costco waves to 30 Nov) are in calendar.js and are added when they go live.
   Format: [category, name, spec, dealPriceUSD, regularUSD, retailer, searchQuery, validUntil] */
export const US_RAW = [
["Streaming","Amazon Fire TV Stick 4K (2026 model)","Wi-Fi 6 · Dolby Vision · early deal 2026",24.99,59.99,"amazoncom","Fire TV Stick 4K",null],
["Computers","Apple MacBook Air 15\" M5","16 GB · 512 GB SSD · early deal 2026",1299.99,1499,"amazoncom","MacBook Air 15 M5 16GB 512GB",null],
["Computers","Apple MacBook Air 15\" M5","16 GB · 1 TB SSD · early deal 2026",1599,1799,"amazoncom","MacBook Air 15 M5 16GB 1TB",null],
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
