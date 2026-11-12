/* US deals live on 12 Nov 2026 (audit 12.11.: every row re-confirmed by two pages dated 11–12 Nov 2026 – 9to5toys, Macworld, macprices,
   NBC Select, Tom's Guide, dealnews, Yahoo Shopping, the-gadgeteer, Washington Times, Consequence). Rows that could not be re-confirmed were removed.
   Optional 8th field = last valid day (YYYY-MM-DD); main.js hides a row after that day. Walmart's early event runs 12–15 Nov.
   Format: [category, name, spec, dealPriceUSD, regularUSD, retailer, searchQuery, validUntil] */
export const US_RAW = [
["TV","LG 65\" C6 OLED evo (2026)","4K · 2026 flagship · Walmart early deal",1399.99,2699.99,"walmart","LG 65 C6 OLED","2026-11-15"],
["Home","Dyson V12 Detect Slim","Cordless · laser dust detection · Walmart early deal",430,730,"walmart","Dyson V12 Detect Slim","2026-11-15"],
["Audio","Apple AirPods Pro 3","ANC · USB-C · Walmart early deal",199,249,"walmart","AirPods Pro 3","2026-11-15"],
["Audio","Apple AirPods 4","Open-fit · USB-C · Walmart early deal",89,129.99,"walmart","AirPods 4","2026-11-15"],
["Audio","Sony WH-1000XM6","Over-ear ANC · all colours · early deal 2026",378,459.99,"amazoncom","Sony WH-1000XM6",null],
["Audio","Apple AirPods Max 2","USB-C · early deal 2026",449.99,549,"amazoncom","AirPods Max 2",null],
["Smart Home","Apple AirTag (2nd gen) 4-pack","Item trackers · early deal 2026",69.99,99.99,"target","AirTag 4 pack",null],
["Computers","Apple MacBook Air 13\" M5","16 GB · 512 GB SSD · early deal 2026",1099,1299,"amazoncom","MacBook Air 13 M5 16GB 512GB",null],
["Computers","Apple MacBook Air 13\" M5","16 GB · 1 TB SSD · early deal 2026",1349,1599,"amazoncom","MacBook Air 13 M5 16GB 1TB",null],
["Computers","Apple MacBook Air 15\" M5","16 GB · 512 GB SSD · early deal 2026",1299,1499,"amazoncom","MacBook Air 15 M5 16GB 512GB",null],
["Computers","Apple MacBook Air 15\" M5","16 GB · 1 TB SSD · early deal 2026",1549,1799,"amazoncom","MacBook Air 15 M5 16GB 1TB",null],
["Smart Home","Ring Starter Set","Battery Doorbell 2K + Indoor Cam Plus 2K · early deal 2026",59.99,139.99,"homedepot","Ring Battery Doorbell 2K Indoor Cam Plus starter set",null],
["Tools","Husky 310-Piece Mechanics Tool Set","Sockets, wrenches, case · early deal 2026",99,199,"homedepot","Husky 310 piece mechanics tool set",null],
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
