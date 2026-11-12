/* US deals live on 12 Nov 2026. Every row was confirmed by two independent pages dated 6-12 Nov 2026 (Tom's Guide, Digital Trends, PopSci, NBC Select, Yahoo/Walmart roundup, Bob Vila, 9to5Toys and similar).
   Last year's (2025) prices are not used. Fields: [category, name, spec, dealUSD, regularUSD, retailerKey, searchQuery, validUntil|null, checked YYYY-MM-DD].
   main.js hides a row after validUntil, or 3 days after `checked` when no end date is known, so unconfirmed deals disappear on their own.
   Upcoming events (Best Buy 19 Nov, Amazon 19-30 Nov, Walmart BF 23 Nov) are in calendar.js and are added when they go live. */
export const US_RAW = [
["Audio","Apple AirPods 4","Open-fit · USB-C · early deal 2026",89,129.99,"walmart","AirPods 4",null,"2026-11-10"],
["Audio","Apple AirPods Max 2","USB-C · early deal 2026",449,549,"amazoncom","AirPods Max 2",null,"2026-11-10"],
["TV","LG 55\" C6 OLED evo (2026)","4K · 120 Hz · Best Buy early deal",999.99,1999.99,"bestbuy","LG C6 55 OLED",null,"2026-11-10"],
["Streaming","Amazon Fire TV Stick 4K (2026 model)","Wi-Fi 6 · Dolby Vision · early deal 2026",24.99,59.99,"amazoncom","Fire TV Stick 4K",null,"2026-11-10"],
["Computers","Apple MacBook Air 13\" M5","16 GB · 512 GB SSD · early deal 2026",1099,1299,"amazoncom","MacBook Air 13 M5 16GB 512GB",null,"2026-11-12"],
["Computers","Apple MacBook Air 13\" M5","16 GB · 1 TB SSD · early deal 2026",1349,1599,"amazoncom","MacBook Air 13 M5 16GB 1TB",null,"2026-11-10"],
["Computers","Apple MacBook Air 15\" M5","16 GB · 512 GB SSD · early deal 2026",1299.99,1499,"amazoncom","MacBook Air 15 M5 16GB 512GB",null,"2026-11-10"],
["Computers","Apple MacBook Air 15\" M5","16 GB · 1 TB SSD · early deal 2026",1549,1799,"amazoncom","MacBook Air 15 M5 16GB 1TB",null,"2026-11-10"],
["Smart Home","Ring Starter Set","Battery Doorbell 2K + Indoor Cam Plus 2K · early deal 2026",59.99,139.99,"homedepot","Ring Battery Doorbell 2K Indoor Cam Plus starter set",null,"2026-11-10"],
["Tools","Husky 310-Piece Mechanics Tool Set","Sockets, wrenches, case · early deal 2026",99,199,"homedepot","Husky 310 piece mechanics tool set",null,"2026-11-10"],
["Home","Maxkare Electric Throw Blanket 50x60","Gray & White · Walmart early deal to 15 Nov",29,59.99,"walmart","Maxkare electric heated throw blanket","2026-11-15","2026-11-12"],
["Kitchen","Crock-Pot 7-Qt Manual Slow Cooker","7-quart · Walmart early deal to 15 Nov",35,80,"walmart","Crock-Pot 7 quart manual slow cooker","2026-11-15","2026-11-12"],
["Smart Home","Blink Battery Doorbell 2K+","Battery video doorbell · Amazon early deal",30.99,69.99,"amazoncom","Blink Battery Doorbell 2K+",null,"2026-11-12"],
["Tools","DeWalt 20V MAX Oscillating Multi-Tool Kit (DCS356)","20V MAX kit · Home Depot early deal",99,199,"homedepot","DeWalt DCS356 oscillating multi-tool kit",null,"2026-11-12"],
["Toys","LEGO Star Wars Battle Droid with STAP 75428","75428 · Amazon early deal",83.99,139.99,"amazoncom","LEGO 75428 Battle Droid STAP",null,"2026-11-12"],
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
