/* US deals live on 12 Nov 2026. Every row was confirmed by two independent pages dated 11–12 Nov 2026 (9to5toys, Macworld, macprices,
   NBC Select, Tom's Guide, dealnews, Yahoo Shopping, Digital Trends, PopSci, Bob Vila and similar). Earlier years' prices are not used.
   Fields: [category, name, spec, dealUSD, regularUSD, retailerKey, searchQuery, validUntil|null, checked YYYY-MM-DD].
   main.js hides a row after validUntil, or 3 days after `checked` when no end date is known, so unconfirmed deals disappear on their own.
   Upcoming events (Best Buy 19 Nov, Amazon 19-30 Nov, Walmart BF 23 Nov) are in calendar.js and are added when they go live. */
export const US_RAW = [
["TV","LG 65\" C6 OLED evo (2026)","4K · 2026 flagship · Walmart early deal",1399.99,2699.99,"walmart","LG 65 C6 OLED","2026-11-15","2026-11-12"],
["Home","Dyson V12 Detect Slim","Cordless · laser dust detection · Walmart early deal",430,730,"walmart","Dyson V12 Detect Slim","2026-11-15","2026-11-12"],
["Audio","Apple AirPods Pro 3","ANC · USB-C · Walmart early deal",199,249,"walmart","AirPods Pro 3","2026-11-15","2026-11-12"],
["Audio","Apple AirPods 4","Open-fit · USB-C · Walmart early deal",89,129.99,"walmart","AirPods 4","2026-11-15","2026-11-12"],
["Audio","Sony WH-1000XM6","Over-ear ANC · all colours · early deal 2026",378,459.99,"amazoncom","Sony WH-1000XM6",null,"2026-11-12"],
["Audio","Apple AirPods Max 2","USB-C · early deal 2026",449.99,549,"amazoncom","AirPods Max 2",null,"2026-11-12"],
["Smart Home","Apple AirTag (2nd gen) 4-pack","Item trackers · early deal 2026",69.99,99.99,"target","AirTag 4 pack",null,"2026-11-12"],
["Computers","Apple MacBook Air 13\" M5","16 GB · 512 GB SSD · early deal 2026",1099,1299,"amazoncom","MacBook Air 13 M5 16GB 512GB",null,"2026-11-12"],
["Computers","Apple MacBook Air 13\" M5","16 GB · 1 TB SSD · early deal 2026",1349,1599,"amazoncom","MacBook Air 13 M5 16GB 1TB",null,"2026-11-12"],
["Computers","Apple MacBook Air 15\" M5","16 GB · 512 GB SSD · early deal 2026",1299,1499,"amazoncom","MacBook Air 15 M5 16GB 512GB",null,"2026-11-12"],
["Computers","Apple MacBook Air 15\" M5","16 GB · 1 TB SSD · early deal 2026",1549,1799,"amazoncom","MacBook Air 15 M5 16GB 1TB",null,"2026-11-12"],
["Smart Home","Ring Starter Set","Battery Doorbell 2K + Indoor Cam Plus 2K · early deal 2026",59.99,139.99,"homedepot","Ring Battery Doorbell 2K Indoor Cam Plus starter set",null,"2026-11-12"],
["Tools","Husky 310-Piece Mechanics Tool Set","Sockets, wrenches, case · early deal 2026",99,199,"homedepot","Husky 310 piece mechanics tool set",null,"2026-11-12"],
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
