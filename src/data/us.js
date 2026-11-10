/* US deals live on 10 Nov 2026. Every row was confirmed by two independent pages dated 6-10 Nov 2026
   (9to5toys 06/09.11, Tom's Guide, NBC Select 09.11, Fox/Nexstar Walmart roundup 09.11, thetechhacker 09.11, Jennifer Jolly 06.11).
   Rows that could no longer be confirmed are removed. Optional 8th field = last valid day (YYYY-MM-DD); main.js hides a row after that day.
   Upcoming events (Walmart 12-15 Nov, Amazon 19-30 Nov, Best Buy 19 Nov, Walmart BF 23 Nov) are in calendar.js and are added when they go live.
   Format: [category, name, spec, dealPriceUSD, regularUSD, retailer, searchQuery, validUntil] */
export const US_RAW = [
["Audio","Apple AirPods 4","Open-fit · USB-C · early deal 2026",89,129.99,"walmart","AirPods 4",null],
["Audio","Apple AirPods Max 2","USB-C · early deal 2026",449,549,"amazoncom","AirPods Max 2",null],
["TV","LG 55\" C6 OLED evo (2026)","4K · 120 Hz · Best Buy early deal",999.99,1999.99,"bestbuy","LG C6 55 OLED",null],
["Streaming","Amazon Fire TV Stick 4K (2026 model)","Wi-Fi 6 · Dolby Vision · early deal 2026",24.99,59.99,"amazoncom","Fire TV Stick 4K",null],
["Computers","Apple MacBook Air 13\" M5","16 GB · 512 GB SSD · early deal 2026",1099,1299,"amazoncom","MacBook Air 13 M5 16GB 512GB",null],
["Computers","Apple MacBook Air 13\" M5","16 GB · 1 TB SSD · early deal 2026",1349,1599,"amazoncom","MacBook Air 13 M5 16GB 1TB",null],
["Computers","Apple MacBook Air 15\" M5","16 GB · 512 GB SSD · early deal 2026",1299.99,1499,"amazoncom","MacBook Air 15 M5 16GB 512GB",null],
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
