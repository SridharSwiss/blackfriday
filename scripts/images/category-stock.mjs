/* Fetches ONE free-license, generic (non-exact-product) photo per deal category from Wikimedia Commons -
   a photo everyone sees as a representative picture of the category, not a claim that it depicts the
   exact SKU on that card. This is a deliberate, declared fallback: licensed product photos (Amazon PA API,
   Icecat - see amazon-pa-api.mjs / icecat.mjs) always win when an exact match exists; this file only fills
   in for the products neither of those could identify, so every deal still shows a real picture instead of
   just its generated illustration.

   Source: Wikimedia Commons (commons.wikimedia.org search API + upload.wikimedia.org for the files
   themselves). Every image returned is public domain or Creative-Commons licensed for reuse including
   commercial use - that's what makes this different from scraping a retailer's product page. We store
   only the thumbnail URL, not a copy of the file, and identify the client with a descriptive User-Agent
   per Wikimedia's API etiquette (https://meta.wikimedia.org/wiki/User-Agent_policy). Requests are paced
   well below their rate limit and retry with backoff on 429, never hammering the API.

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
   "Sports & Outdoor" all search "sporting goods") since they're the same idea under different labels.
   Negative keywords (-painting -portrait etc.) keep fine-art search results (Commons is full of digitised
   paintings/photographs tagged with everyday nouns) from being picked for product categories. */
const NEG = "-painting -portrait -drawing -illustration -sculpture -museum -artwork -engraving -postage -stamp -poster -map -coat_of_arms -coin -currency -banknote";
const QUERY = {
  "Accessories": "phone case",
  "Apparel": "folded clothes retail",
  "Appliances": "kitchen appliance",
  "Audio": "bluetooth speaker",
  "Baby": "baby stroller product",
  "Baby & Kids": "baby stroller product",
  "Bags & Luggage": "suitcase luggage",
  "Beauty": "cosmetics skincare bottles",
  "Bikes & E-mobility": "electric bicycle",
  "Books": "stack of books",
  "Cameras": "digital camera",
  "Car": "car interior dashboard",
  "Car & Motorbike Accessories": "car accessories",
  "Coffee": "espresso machine",
  "Computers": "laptop computer",
  "Drones & Action Cameras": "quadcopter drone",
  "E-Readers": "e-reader ebook device",
  "Eyewear & Sunglasses": "sunglasses product",
  "Fashion": "folded clothes retail",
  "Fitness & Home Gym": "home gym dumbbells",
  "Food": "grocery food products",
  "Fragrance & Beauty": "perfume bottle",
  "Furniture": "living room furniture",
  "Gaming": "video game controller",
  "Garden": "garden tools",
  "Gift Cards & Travel": "gift card",
  "Health": "first aid kit",
  "Health & Sports Nutrition": "protein powder supplement",
  "Home": "home interior",
  "Kitchen": "kitchen utensils",
  "LEGO": "lego bricks",
  "LEGO & Collectibles": "lego bricks",
  "Lighting & Decor": "pendant lamp",
  "Mattresses & Sleep": "mattress bedroom",
  "Mobile Plans & Internet": "smartphone sim card",
  "Monitors": "computer monitor",
  "Musical Instruments": "acoustic guitar",
  "Networking": "wifi router",
  "Outdoor": "camping tent",
  "Office & Furniture": "office desk furniture",
  "PC Components": "computer graphics card",
  "Personal Care": "electric toothbrush",
  "Pets": "dog cat pet product",
  "Phones": "smartphone product",
  "Printers": "inkjet printer",
  "Robot Vacuums & Cleaning": "robot vacuum cleaner",
  "Robot vacuums": "robot vacuum cleaner",
  "Shoes": "sneakers shoes product",
  "Shoes & Sneakers": "sneakers shoes product",
  "Ski & Winter Sports": "ski snowboard equipment",
  "Smart Home": "smart home hub",
  "Software & VPN": "computer security padlock",
  "Solar & Power Stations": "solar panel power station",
  "Sport": "sporting goods equipment",
  "Sports": "sporting goods equipment",
  "Sports & Outdoor": "sporting goods equipment",
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
  "Watches & Jewellery": "wristwatch product",
  "Wearables": "smartwatch fitness tracker",
};

const LIVE_CH_PATH = new URL("../../src/data/live-ch.js", import.meta.url);
const CATALOGUE_PATH = new URL("../../src/data/catalogue.js", import.meta.url);
const TOP100_PATH = new URL("../../src/data/top100.js", import.meta.url);

async function collectCategories() {
  const cats = new Set();
  const { LIVE_CH } = await import(LIVE_CH_PATH);
  for (const d of LIVE_CH) cats.add(d.cat);
  const CATALOGUE = (await import(CATALOGUE_PATH)).default;
  for (const row of CATALOGUE) cats.add(row[0]);
  const { RAW } = await import(TOP100_PATH);
  for (const row of RAW) cats.add(row[0] === "Beauty" ? "Fragrance & Beauty" : row[0]);
  return [...cats].sort();
}

const sleep = ms => new Promise(res => setTimeout(res, ms));

// Filenames that are almost always the wrong kind of result for a product-category photo, even once
// they pass the mime/size check (Commons files a lot of fine-art photography under everyday nouns).
const BAD_TITLE = /painting|portrait|drawing|illustration|sculpture|museum|artwork|engraving|postage|stamp\b|\bmap\b|coat.of.arms|\bcoin\b|currency|banknote|logo|icon|diagram|flag.of|emblem/i;

async function lookup(term, attempt = 1) {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    generator: "search",
    gsrsearch: `filetype:bitmap ${term} ${NEG}`,
    gsrnamespace: "6",
    gsrlimit: "8",
    prop: "imageinfo",
    iiprop: "url|mime|size",
    iiurlwidth: "800",
  });
  const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params.toString()}`, {
    headers: { "User-Agent": UA },
  });
  if (res.status === 429 && attempt <= 4) {
    await sleep(attempt * 3000);
    return lookup(term, attempt + 1);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const pages = json?.query?.pages;
  if (!pages) return null;
  for (const page of Object.values(pages)) {
    const info = page?.imageinfo?.[0];
    if (!info) continue;
    if (!/^image\/(jpeg|png|webp)$/.test(info.mime || "")) continue;
    if ((info.width || 0) < 300 || (info.height || 0) < 200) continue; // skip tiny icons/logos
    if (BAD_TITLE.test(page.title || "")) continue; // skip fine art / flags / diagrams mis-tagged with the term
    return info.thumburl || info.url;
  }
  return null;
}

function loadExisting() {
  try {
    const src = fs.readFileSync(OUT_PATH, "utf8");
    const objStart = src.indexOf("export const CATEGORY_IMAGES");
    const braceStart = src.indexOf("{", objStart);
    const braceEnd = src.lastIndexOf("};");
    if (objStart < 0 || braceStart < 0 || braceEnd < 0) return {};
    const body = src.slice(braceStart + 1, braceEnd);
    const existing = {};
    const re = /"((?:[^"\\]|\\.)*)":\s*"((?:[^"\\]|\\.)*)"/g;
    let m;
    while ((m = re.exec(body)) !== null) existing[m[1].replace(/\\"/g, '"')] = m[2];
    return existing;
  } catch {
    return {};
  }
}

async function main() {
  const categories = await collectCategories();
  console.log(`Found ${categories.length} distinct category strings across the data files.`);
  const existing = loadExisting();
  const found = { ...existing };
  let ok = 0, miss = 0, kept = 0;
  for (const [i, cat] of categories.entries()) {
    if (existing[cat]) { kept++; continue; } // already have a good one from a previous run
    const term = QUERY[cat] || cat.replace(/&/g, " ").replace(/\s+/g, " ").trim();
    try {
      const url = await lookup(term);
      if (url) { found[cat] = url; ok++; } else { miss++; console.log(`  no usable image for "${cat}" (query: ${term})`); }
    } catch (e) {
      miss++;
      console.log(`  ${cat} (query: ${term}): ${e.message}`);
    }
    await sleep(1500); // stay well under Commons' anonymous rate limit
  }
  console.log(`\nLooked up ${categories.length - kept} new categories (${kept} already had an image): ${ok} found, ${miss} missed.`);
  if (!ok && !kept) { console.log("Nothing to write."); return; }

  const header = `/* One free-license, generic photo per deal category, used as a fallback picture when a product has
   no exact licensed photo in images.js: it shows a real photo of "a TV" / "a coffee machine" / etc., not a
   claim that it's the exact SKU on that card. Source: Wikimedia Commons (public domain / CC-licensed for
   reuse including commercial use) - never a retailer's own product photography. See
   scripts/images/category-stock.mjs for how this is generated. A category without an entry here just
   keeps the generated SVG illustration. */\n`;
  const body = Object.entries(found).map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`).join("\n");
  fs.writeFileSync(OUT_PATH, `${header}export const CATEGORY_IMAGES = {\n${body}\n};\n`);
  console.log(`Wrote ${Object.keys(found).length} total category images to src/data/category-images.js (${ok} new this run).`);
}

main().catch(e => { console.error("FATAL:", e); process.exit(1); });
