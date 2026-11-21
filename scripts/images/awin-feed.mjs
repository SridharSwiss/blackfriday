/* Matches our own deals against a downloaded Awin product data feed (a CSV export from the Awin publisher
   platform for a merchant/brand you're approved for - see https://help.awin.com/developers/docs/product-feed-publisher-guide-intro)
   and pulls ONLY the image URL from a matched row into images.js.

   This is deliberately narrow: we do NOT use the feed's price, currency or deep link, because the feed
   usually comes from a different merchant/country (e.g. a German retailer) than the Swiss retailer our own
   deal actually links to and is priced at. Using its image is fine - that's exactly what an Awin product
   feed is published for (see images.js's licensing policy) - but swapping in its price or link would send
   a CH shopper to the wrong store at the wrong price, so this script only ever touches images.js.

   Matching is conservative on purpose: a candidate is accepted only when the feed row's product name
   contains the same model line (e.g. "Galaxy S26 Ultra") AND, if our product name states a storage size
   (128/256/512 GB etc.), the feed row states the SAME storage size. A model-only match with a different
   storage variant is rejected rather than guessed, since different storage variants look identical but are
   different SKUs with different (sometimes very different) photos.

   Usage: node scripts/images/awin-feed.mjs <path-to-feed.csv> [brandFilter]
   e.g.:  node scripts/images/awin-feed.mjs .feeds/samsung-awin.csv Samsung */

import fs from "fs";
import { parse } from "csv-parse/sync";

const [, , csvPathArg, brandFilterArg] = process.argv;
if (!csvPathArg) {
  console.error("Usage: node scripts/images/awin-feed.mjs <path-to-feed.csv> [brandFilter]");
  process.exit(1);
}
const BRAND_FILTER = (brandFilterArg || "").toLowerCase();

const IMAGES_PATH = new URL("../../src/data/images.js", import.meta.url);
const SOURCES = [
  new URL("../../src/data/live-ch.js", import.meta.url),
  new URL("../../src/data/products.js", import.meta.url), // pulls in catalogue.js + top100.js via its own imports
];

function collectOurNames() {
  const names = new Set();
  const liveSrc = fs.readFileSync(new URL("../../src/data/live-ch.js", import.meta.url), "utf8");
  for (const m of liveSrc.matchAll(/"name":"((?:[^"\\]|\\.)*)"/g)) names.add(m[1].replace(/\\"/g, '"'));
  const catSrc = fs.readFileSync(new URL("../../src/data/catalogue.js", import.meta.url), "utf8");
  for (const m of catSrc.matchAll(/\["[^"]+","((?:[^"\\]|\\.)*)"/g)) names.add(m[1].replace(/\\"/g, '"'));
  const topSrc = fs.readFileSync(new URL("../../src/data/top100.js", import.meta.url), "utf8");
  for (const m of topSrc.matchAll(/\["[^"]+","((?:[^"\\]|\\.)*)"/g)) names.add(m[1].replace(/\\"/g, '"'));
  return [...names];
}

// Pull out a storage size token like "512 GB" / "512GB" -> "512gb", if present.
function storageOf(s) {
  const m = s.match(/(\d{2,4})\s*gb\b/i);
  return m ? `${m[1]}gb` : null;
}

// Strip noise (screen size "6.9 Zoll", EEK energy rating, colour-ish filler) and lowercase, so two names
// describing the same model line - even with different wording around it - share the same core tokens.
function modelTokens(s) {
  return s
    .toLowerCase()
    .replace(/\d+([.,]\d+)?\s*(cm|zoll|inch|")/gi, " ")
    .replace(/eek\s*[a-g]\s*\([a-g]\s*-\s*[a-g]\)/gi, " ")
    .replace(/[(),/]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function brandAndLine(s) {
  // e.g. "Samsung Galaxy S26 Ultra 512 GB Blau ..." -> brand "samsung", line tokens incl. "galaxy s26 ultra"
  const t = modelTokens(s);
  const brand = t.split(" ")[0];
  return { brand, tokens: t };
}

function main() {
  const csvRaw = fs.readFileSync(csvPathArg, "utf8");
  const rows = parse(csvRaw, { columns: true, skip_empty_lines: true, relax_quotes: true, relax_column_count: true });
  console.log(`Loaded ${rows.length} rows from ${csvPathArg}`);

  const ourNames = collectOurNames();
  const ourCandidates = ourNames
    .map(name => ({ name, ...brandAndLine(name), storage: storageOf(name) }))
    .filter(c => !BRAND_FILTER || c.brand === BRAND_FILTER);
  console.log(`${ourCandidates.length} of our own product names match brand filter "${brandFilterArg || "(none)"}"`);

  const found = {};
  let matched = 0;
  for (const row of rows) {
    const name = row.product_name;
    const img = row.aw_image_url || row.large_image || row.merchant_image_url;
    // reject the feed's own "no photo available" placeholders - these are not real product photos
    if (!name || !img || /noimage\.gif|(\/|%2F)null(\/|%2F)null\.|no[-_]?image/i.test(img)) continue;
    const feedBrand = (row.brand_name || "").toLowerCase();
    if (BRAND_FILTER && feedBrand && feedBrand !== BRAND_FILTER) continue;
    const feedStorage = storageOf(name);
    const feedTokens = modelTokens(name);

    for (const c of ourCandidates) {
      if (found[c.name]) continue; // already matched by an earlier, equally valid row
      // require the full "brand + model line" phrase (everything before any storage/colour tail) to appear
      const modelPhrase = c.tokens.replace(/\s*\d{2,4}\s*gb.*$/, "").trim();
      if (!modelPhrase || modelPhrase.length < 6) continue; // too short/generic to match safely
      if (!feedTokens.includes(modelPhrase)) continue;
      if (c.storage && feedStorage && c.storage !== feedStorage) continue; // different storage SKU - reject
      if (c.storage && !feedStorage) continue; // our name is storage-specific but this row doesn't say - too risky
      found[c.name] = img;
      matched++;
    }
  }
  console.log(`Matched ${matched} of our products to a feed image.`);
  if (!matched) { console.log("Nothing to write."); return; }

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
  console.log(`Wrote ${Object.keys(merged).length} total image entries to src/data/images.js (${matched} new/updated this run).`);

  console.log("\nMatches:");
  for (const [name, url] of Object.entries(found)) console.log(`  ${name} -> ${url}`);
}

main();
