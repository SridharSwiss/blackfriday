/* Fetches ONE free-license, generic (non-exact-product) photo per deal category from Wikimedia Commons -
   a photo everyone sees as a representative picture of the category, not a claim that it depicts the
   exact SKU on that card. This is a deliberate, declared fallback: licensed product photos (Amazon PA API,
   Icecat - see amazon-pa-api.mjs / icecat.mjs) always win when an exact match exists; this file only fills
   in for the products neither of those could identify, so every deal still shows a real picture instead of
   (or alongside, as a last resort) its generated illustration.

   Source: Wikimedia Commons (commons.wikimedia.org search API + upload.wikimedia.org for the files
   themselves). Every image returned is public domain or Creative-Commons licensed for reuse including
   commercial use - that's what makes this different from scraping a retailer's product page. We store
   only the thumbnail URL, not a copy of the file, and identify the client with a descriptive User-Agent
   per Wikimedia's API etiquette (https://meta.wikimedia.org/wiki/User-Agent_policy).

   Usage: node scripts/images/category-stock.mjs
   Requires: commons.wikimedia.org and upload.wikimedia.org reachable (sandbox egress allowlist). */

import fs from "fs";
import { ProxyAgent, setGlobalDispatcher } from "undici";

const proxyUrl = process.env.HTTPS_PROXY || process.env.https_proxy;
if (proxyUrl) setGlobalDispatcher(new ProxyAgent(proxyUrl));

const UA = "AktionsCH-BlackFriday/1.0 (https://aktions.ch; non-commercial research/affiliate deals site; contact via GitHub SridharSwiss/blackfriday)";
const OUT_PATH = new URL("../../src/data/category-images.js", import.meta.url);

/* Every distinct category string used across live-ch.js, catalogue.js and top100.js, mapped to a clear,
   unambiguous Wikimedia Commons search term. A handful share a term on purpose (e.g. "Sport"/"Sports"/
   "Sports & Outdoor" all search "sporting goods") since they're the same idea under different labels. */
const QUERY = {
  "Accessories": "phone case accessories",
  "Apparel": "clothing rack apparel",
  "Appliances": "kitchen appliance",
  "Audio": "bluetooth speaker",
  "Baby": "baby stroller",
  "Baby & Kids": "baby stroller",
  "Bags & Luggage": "travel suitcase",
  "Beauty": "cosmetics skincare",
  "Bikes & E-mobility": "electric bicycle",
  "Books": "stack of books",
  "Cameras": "digital camera",
  "Car": "car interior dashboard",
  "Car & Motorbike Accessories": "car accessories",
  "Coffee": "espresso machine",
  "Computers": "laptop computer",
  "Drones & Action Cameras": "quadcopter drone",
  "E-Readers": "e-reader ebook",
  "Eyewear & Sunglasses": "sunglasses",
  "Fashion": "clothing rack apparel",
  "Fitness & Home Gym": "home gym dumbbells",
  "Food": "grocery food",
  "Fragrance & Beauty": "perfume bottle",
  "Furniture": "living room furniture",
  "Gaming": "video game controller",
  "Garden": "garden tools",
  "Gift Cards & Travel": "gift card",
  "Health": "first aid health",
  "Health & Sports Nutrition": "protein powder supplement",
  "Home": "home interior",
  "Kitchen": "kitchen utensils",
  "LEGO": "lego bricks",
  "LEGO & Collectibles": "lego bricks",
  "Lighting & Decor": "pendant lamp lighting",
  "Mattresses & Sleep": "mattress bedroom",
  "Mobile Plans & Internet": "smartphone sim card",
  "Monitors": "computer monitor",
  "Musical Instruments": "acoustic guitar",
  "Networking": "wifi router",
  "Outdoor": "camping tent outdoor",
  "Office & Furniture": "office desk furniture",
  "PC Components": "computer graphics card",
  "Personal Care": "electric toothbrush",
  "Pets": "dog cat pet",
  "Phones": "smartphone",
  "Printers": "inkjet printer",
  "Robot Vacuums & Cleaning": "robot vacuum cleaner",
  "Robot vacuums": "robot vacuum cleaner",
  "Shoes": "sneakers shoes",
  "Shoes & Sneakers": "sneakers shoes",
  "Ski & Winter Sports": "ski snowboard",
  "Smart Home": "smart home hub",
  "Software & VPN": "computer security padlock",
  "Solar & Power Stations": "solar panel power station",
  "Sport": "sporting goods",
  "Sports": "sporting goods",
  "Sports & Outdoor": "sporting goods",
  "TV": "flat screen television",
  "Tablets": "tablet computer",
  "Telecom": "smartphone sim card",
  "Tools": "hand tools toolbox",
  "Tools & DIY": "hand tools toolbox",
  "Toys": "children toys",
  "Toys & Games": "children toys",
  "Travel": "suitcase travel",
  "Travel & Car": "road trip car",
  "Travel & Holidays": "suitcase travel",
  "Watches & Jewellery": "wristwatch",
  "Wearables": "smartwatch fitness tracker",
};

const LIVE_CH_PATH = new URL("../../src/data/live-ch.js", import.meta.url);
const CATALOGUE_PATH = new URL("../../src/data/catalogue.js", import.meta.url);
const TOP100_PATH = new URL("../../src/data/top100.js", import.meta.url);

function collectCategories() {
  const cats = new Set();
  const liveSrc = fs.readFileSync(LIVE_CH_PATH, "utf8");
  for (const m of liveSrc.matchAll(/"cat":"([^"]+)"/g)) cats.add(m[1]);
  // catalogue.js rows look like ["Category","Name","Spec", ...] - grab the first string of each row.
  const catSrc = fs.readFileSync(CATALOGUE_PATH, "utf8");
  for (const m of catSrc.matchAll(/\["([^"]+)","/g)) cats.add(m[1]);
  const topSrc = fs.readFileSync(TOP100_PATH, "utf8");
  for (const m of topSrc.matchAll(/\["([^"]+)","/g)) cats.add(m[1] === "Beauty" ? "Fragrance & Beauty" : m[1]);
  return [...cats].sort();
}

const sleep = ms => new Promise(res => setTimeout(res, ms));

async function lookup(term) {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    generator: "search",
    gsrsearch: `filetype:bitmap ${term}`,
    gsrnamespace: "6",
    gsrlimit: "6",
    prop: "imageinfo",
    iiprop: "url|mime|size",
    iiurlwidth: "800",
  });
  const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params.toString()}`, {
    headers: { "User-Agent": UA },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const pages = json?.query?.pages;
  if (!pages) return null;
  for (const page of Object.values(pages)) {
    const info = page?.imageinfo?.[0];
    if (!info) continue;
    if (!/^image\/(jpeg|png|webp)$/.test(info.mime || "")) continue;
    if ((info.width || 0) < 300 || (info.height || 0) < 200) continue; // skip tiny icons/logos
    return info.thumburl || info.url;
  }
  return null;
}

async function main() {
  const categories = collectCategories();
  console.log(`Found ${categories.length} distinct category strings across the data files.`);
  const found = {};
  let ok = 0, miss = 0;
  for (const [i, cat] of categories.entries()) {
    const term = QUERY[cat] || cat.replace(/&/g, " ").replace(/\s+/g, " ").trim();
    try {
      const url = await lookup(term);
      if (url) { found[cat] = url; ok++; } else { miss++; console.log(`  no usable image for "${cat}" (query: ${term})`); }
    } catch (e) {
      miss++;
      console.log(`  ${cat} (query: ${term}): ${e.message}`);
    }
    if (i < categories.length - 1) await sleep(300);
  }
  console.log(`\nLooked up ${categories.length} categories: ${ok} images found, ${miss} missed.`);
  if (!ok) { console.log("Nothing to write."); return; }

  const header = `/* One free-license, generic photo per deal category, used as a fallback picture when a product has
   no exact licensed photo in images.js: it shows a real photo of "a TV" / "a coffee machine" / etc., not a
   claim that it's the exact SKU on that card. Source: Wikimedia Commons (public domain / CC-licensed for
   reuse including commercial use) - never a retailer's own product photography. See
   scripts/images/category-stock.mjs for how this is generated. A category without an entry here just
   keeps the generated SVG illustration. */\n`;
  const body = Object.entries(found).map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`).join("\n");
  fs.writeFileSync(OUT_PATH, `${header}export const CATEGORY_IMAGES = {\n${body}\n};\n`);
  console.log(`Wrote ${ok} category images to src/data/category-images.js`);
}

main().catch(e => { console.error("FATAL:", e); process.exit(1); });
