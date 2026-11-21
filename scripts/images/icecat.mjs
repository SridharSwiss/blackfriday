/* Fetches real, licensed product photos from Icecat (icecat.biz) - a free, open product-content
   syndication service manufacturers publish to specifically so shops/affiliates can use real photos
   and specs. Unlike scraping a retailer's own product photography, this is content brands have
   explicitly released for exactly this purpose (see the licensing note at the top of images.js).

   Covers products that: (a) belong to a recognised brand, and (b) have an extractable manufacturer
   model code (MPN) in their name/spec - which is a MINORITY of this catalogue. A dry run over all
   4552 product rows (TOP + category list + live-ch, including variants) found a brand+code match for
   only ~435 of them (~9.5%) BEFORE even checking whether Icecat actually has that exact MPN. This is
   an honest ceiling, not a bug: most entries here are generic marketing names ("Lenovo IdeaPad Slim 3,
   14\", 512 GB, 16 GB") without a real catalogued SKU, and no free, legitimate source can conjure an
   accurate photo for a product it can't identify. Expect real coverage well under half of what this
   script even attempts to look up.

   ----------------------------------------------------------------------------------------------------
   REQUIREMENTS BEFORE THIS CAN RUN
   ----------------------------------------------------------------------------------------------------
   1. Network: live.icecat.biz (and live-origin.icecat.biz for bulk/server use) must be reachable - this
      sandbox's egress proxy blocks it by default. Add it under claude.ai Settings > Capabilities (same
      step already done for webservices.amazon.de).
   2. Credentials - two tiers:
      - Free/testing: the public demo account "openicecat-live" works with no signup, but only returns
        data for "Open Icecat" brands (the subset of manufacturers that publish freely) and is flagged
        DemoAccount:true. Fine for a first real run.
      - Full coverage: register a free Icecat Channel Partner account (icecat.biz) and set
        ICECAT_SHOPNAME to your own shopname, or generate an API token under MyIcecat > Access Tokens
        and set ICECAT_API_TOKEN (+ optionally ICECAT_CONTENT_TOKEN) for Full Icecat brands.

   Usage:  node scripts/images/icecat.mjs            (uses the demo account unless env vars are set)
   Respects Icecat's Fair Use Policy: this is a one-shot batch job (not continuous scraping/crawling),
   paced well under their stated limits, and stores only the returned image URLs - not a copy of their
   catalogue. */

import fs from "fs";
import { ProxyAgent, setGlobalDispatcher } from "undici";

const proxyUrl = process.env.HTTPS_PROXY || process.env.https_proxy;
if (proxyUrl) setGlobalDispatcher(new ProxyAgent(proxyUrl));

const BRAND_FILTER = (process.argv[2] || "").toLowerCase() || null; // optional: node icecat.mjs "Anker" - look up just one brand
const SHOPNAME = process.env.ICECAT_SHOPNAME || "openicecat-live"; // public demo account if nothing is set
const API_TOKEN = process.env.ICECAT_API_TOKEN || null;
const CONTENT_TOKEN = process.env.ICECAT_CONTENT_TOKEN || null;
const LANG = process.env.ICECAT_LANG || "EN";

const IMAGES_PATH = new URL("../../src/data/images.js", import.meta.url);
// live-ch.js stores products as {"name":"..."} objects; catalogue.js/top100.js store them as
// ["category","name","spec",...] tuples - each file needs its own name-extraction regex, and
// products.js itself is skipped since it only *computes* these at runtime (no literal "name":"...").
const SOURCES = [
  { path: new URL("../../src/data/live-ch.js", import.meta.url), re: /"name":"((?:[^"\\]|\\.)*)"/g },
  { path: new URL("../../src/data/catalogue.js", import.meta.url), re: /\["[^"]+","((?:[^"\\]|\\.)*)"/g },
  { path: new URL("../../src/data/top100.js", import.meta.url), re: /\["[^"]+","((?:[^"\\]|\\.)*)"/g },
];

/* Recognised brands worth looking up (mirrors the BRANDS regex already used in src/main.js for
   "known brand" scoring, extended with a few store-marketplace brands seen in live-ch.js). */
const BRANDS = [
  "Apple", "Samsung", "Sony", "LG", "Philips", "Dyson", "Nespresso", "DeLonghi", "Bosch", "Miele",
  "Siemens", "LEGO", "Bose", "JBL", "Garmin", "Nike", "Adidas", "Lenovo", "HP", "Dell", "Logitech",
  "Sonos", "Roborock", "iRobot", "Braun", "Oral-B", "Ninja", "Kärcher", "Karcher", "IKEA", "Nintendo",
  "Xbox", "Microsoft", "Asus", "Acer", "Blaupunkt", "Yaber", "Sharp", "Canon", "Nikon", "Fitbit",
  "Kindle", "Xiaomi", "DJI", "GoPro", "Panasonic", "Hisense", "TCL", "Epson", "Brother", "AEG",
  "Electrolux", "Gaggia", "Jura", "WMF", "Tefal", "Rowenta", "Kenwood", "KitchenAid",
  "Anker", "Amazon", "Google", "Dreame", "Novamatic", "Liebeskind",
];
// Words that look like codes but are units/specs, not model numbers - exclude these false positives.
const NOT_A_CODE = /^(GB|TB|MB|KB|CHF|USD|EUR|WH|KWH|MAH|INCH|CM|MM|HZ|FPS|MP|OLED|LED|UHD|QLED|4K|8K|5G|WIFI|USB|HDMI)$/i;

function extractBrandCode(name) {
  // De'Longhi is written with an apostrophe in our data but Icecat's own brand name has none -
  // allow an optional apostrophe between "De" and "Longhi" when matching, while still sending
  // the apostrophe-free brand name ("DeLonghi") to the API.
  const brand = BRANDS.find(b => {
    const pat = b === "DeLonghi" ? "De'?Longhi" : b.replace(/[äÄ]/g, "[äÄ]");
    return new RegExp(`\\b${pat}\\b`, "i").test(name);
  });
  if (!brand) return null;
  // A model code: alnum token, 4+ chars, mixes letters and digits, not a unit/spec word.
  const tokens = name.match(/\b[A-Za-z0-9][A-Za-z0-9-]{3,}\b/g) || [];
  const code = tokens.find(t => /[A-Za-z]/.test(t) && /\d/.test(t) && !NOT_A_CODE.test(t) && t.toLowerCase() !== brand.toLowerCase());
  return code ? { brand, code } : null;
}

function collectCandidates() {
  const seen = new Set();
  const out = [];
  for (const { path, re } of SOURCES) {
    const src = fs.readFileSync(path, "utf8");
    const nameRe = new RegExp(re.source, re.flags);
    let m;
    while ((m = nameRe.exec(src)) !== null) {
      const name = m[1].replace(/\\"/g, '"');
      if (seen.has(name)) continue;
      const hit = extractBrandCode(name);
      if (hit) { seen.add(name); out.push({ name, ...hit }); }
    }
  }
  return BRAND_FILTER ? out.filter(c => c.brand.toLowerCase() === BRAND_FILTER) : out;
}

async function lookup(brand, code) {
  const params = new URLSearchParams({ lang: LANG, Brand: brand, ProductCode: code });
  const headers = {};
  if (API_TOKEN) { headers["api-token"] = API_TOKEN; if (CONTENT_TOKEN) headers["content-token"] = CONTENT_TOKEN; }
  else params.set("shopname", SHOPNAME);
  const res = await fetch(`https://live.icecat.biz/api?${params.toString()}`, { headers });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (json?.statusCode && json.statusCode !== 200) throw new Error(`Icecat error ${json.statusCode}: ${json.msg || json.message || "unknown"}`);
  const img = json?.data?.Image;
  return img?.Pic500x500 || img?.HighPic || img?.LowPic || img?.ThumbPic || null;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  const candidates = collectCandidates();
  console.log(`Found ${candidates.length} products with a recognised brand + extractable model code (out of a much larger catalogue - see the comment at the top of this file for why most entries can't be looked up this way).`);
  if (!candidates.length) return;

  const found = {};
  let ok = 0, miss = 0, err = 0;
  for (const [i, c] of candidates.entries()) {
    try {
      const url = await lookup(c.brand, c.code);
      if (url) { found[c.name] = url; ok++; } else { miss++; }
    } catch (e) {
      miss++;
      if (!/error 8/i.test(e.message)) { err++; console.log(`  ${c.brand} ${c.code} (${c.name}): ${e.message}`); }
    }
    if (i < candidates.length - 1) await sleep(350); // stay well under Icecat's fair-use request pace
  }
  console.log(`\nLooked up ${candidates.length}: ${ok} images found, ${miss} not in Icecat's catalogue, ${err} request errors.`);
  if (!ok) { console.log("Nothing to write - leaving images.js untouched."); return; }

  const imagesSrc = fs.readFileSync(IMAGES_PATH, "utf8");
  const objStart = imagesSrc.indexOf("export const IMAGES");
  const braceStart = imagesSrc.indexOf("{", objStart);
  const braceEnd = imagesSrc.lastIndexOf("};");
  const objBody = imagesSrc.slice(braceStart + 1, braceEnd);
  const existing = {};
  const assignRe = /"((?:[^"\\]|\\.)*)":\s*"((?:[^"\\]|\\.)*)"/g;
  let m;
  while ((m = assignRe.exec(objBody)) !== null) existing[m[1].replace(/\\"/g, '"')] = m[2];
  const merged = { ...existing, ...found };
  const body = Object.entries(merged).map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`).join("\n");
  const header = imagesSrc.slice(0, objStart);
  fs.writeFileSync(IMAGES_PATH, `${header}export const IMAGES = {\n${body}\n};\n`);
  console.log(`Wrote ${Object.keys(merged).length} total image entries to src/data/images.js (${ok} new/updated this run).`);
}

main().catch(e => { console.error("FATAL:", e); process.exit(1); });
