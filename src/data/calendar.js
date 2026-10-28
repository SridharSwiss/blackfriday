/* Deal calendar 2026 (checked 28.10.2026). "expected" = retailer has not announced yet; timing follows its 2025 pattern.
   Sources: Hip2Save (Walmart, Target), Slickdeals (Best Buy), Digitec 2025 Black Week page, MediaMarkt CH campaign page. */
export const EVENTS = [
  { date:"2026-11-05", region:"US", title:"Target early Black Friday", text:"Target's Early Black Friday Deals event, 5–7 November; Holiday Price Match runs to 24 December." },
  { date:"2026-11-11", region:"CH", title:"Singles Day", text:"Smaller discounts in Switzerland; some shops test codes early." },
  { date:"2026-11-12", region:"US", title:"Walmart early Black Friday", text:"Walmart+ members get early access on 12 November; deals open to everyone on 13 November." },
  { date:"2026-11-19", region:"CH+US", title:"Amazon Black Friday Week (expected)", text:"Not announced yet. In 2025 Amazon.de and Amazon US ran their Black Friday Week from 20 November to 1 December; Best Buy is also expected to start around 19 November." },
  { date:"2026-11-23", region:"CH", title:"Black Week starts", text:"Expected start at Digitec, Galaxus, Brack and Interdiscount (Digitec released 500+ daily deals at midnight in 2025). Walmart's Black Friday deals start the same day." },
  { date:"2026-11-26", region:"US", title:"Thanksgiving", text:"Target's Black Friday deals go live online today; many US stores open doorbusters online." },
  { date:"2026-11-27", region:"CH+US", title:"Black Friday", text:"Peak day, confirmed by MediaMarkt CH. Swiss deals go live at midnight; limited stock sells out early.", peak:true },
  { date:"2026-11-28", region:"US", title:"Small Business Saturday", text:"Independent US shops run their own offers." },
  { date:"2026-11-30", region:"CH+US", title:"Cyber Monday", text:"Online deals; Swiss shops mostly extend Black Friday prices. Walmart's Cyber Monday deals run to 2 December." },
  { date:"2026-12-01", region:"US", title:"Giving Tuesday", text:"Charity day; deal season winds down." }
];

export const FAQ = [
  ["When is Black Friday 2026?", "Friday, 27 November 2026. Black Week in Switzerland runs from Monday 23 November, and Cyber Monday is 30 November."],
  ["Is everything really cheaper on Black Friday?", "No. Some shops raise prices shortly before. Compare with last Black Week's price and the record low shown on each product."],
  ["What does \"Buy now\" mean?", "Today's price is within 3% of the best price we know for that product, so waiting is unlikely to save much."],
  ["Can I order US deals to Switzerland?", "Rarely. Most US shops don't ship abroad and Amazon.com ships few items here. If they do, Swiss import VAT (8.1%) and fees apply, US devices may have different plugs, and warranties are often US-only."],
  ["How do you make money?", "Shop links are affiliate links. If you buy, the shop may pay us a commission; your price stays the same and rankings don't depend on it."],
  ["How does My list work?", "Tap the heart on any product. Your list is stored only in this browser and shows when a product reaches its target price."]
];
