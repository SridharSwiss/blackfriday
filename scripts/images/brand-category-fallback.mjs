/* Builds a brand+category fallback photo table from the licensed photos we already have in
   images.js. Rationale: a generic "stock photo of a TV" (the approach tried and rejected earlier)
   or an AI illustration (blocked - no image-gen credits) are both worse than reusing a REAL photo
   we already licensed for one Samsung TV on another Samsung TV that has no exact-match photo of
   its own. Same brand + same product category is a much tighter, safer match than category alone:
   a Samsung Galaxy Watch never gets a Samsung TV's photo, only another Samsung watch/wearable would.

   For every (brand, category) pair that has at least one real photo in images.js, every other
   product of that same brand+category with no photo of its own falls back to it - so nothing is
   left with just the generated SVG icon unless its brand+category combination has zero real
   photos anywhere in the catalogue yet.

   Output: BRAND_CAT_IMAGES in category-images.js, keyed "Brand|Category" -> photo URL.
   Usage: node scripts/images/brand-category-fallback.mjs */
import fs from "fs";

const ROOT = new URL("../../", import.meta.url);
const IMAGES_PATH = new URL("src/data/images.js", ROOT);
const CATEGORY_IMAGES_PATH = new URL("src/data/category-images.js", ROOT);
const SOURCES = [
  { path: new URL("src/data/live-ch.js", ROOT), re: /"name":"((?:[^"\\]|\\.)*)"/g, catRe: /"cat":"((?:[^"\\]|\\.)*)"/g },
  { path: new URL("src/data/catalogue.js", ROOT), re: /\["([^"]+)","((?:[^"\\]|\\.)*)"/g }, // [cat, name, ...]
  { path: new URL("src/data/top100.js", ROOT), re: /\["([^"]+)","((?:[^"\\]|\\.)*)"/g },
];

// Same brand-detection list as src/lib/thumb.js, kept in sync by hand (small, rarely changes).
const TWO = ["The Ordinary","La Roche-Posay","Ultimate Ears","Bowers & Wilkins","Black Diamond","The North Face","Under Armour","Hugo Boss","Calvin Klein","Polo Ralph Lauren","Ralph Lauren","Tommy Hilfiger","Fred Perry","Le Creuset","Big Green Egg","Home Assistant","Peak Design","Dr. Martens","New Balance","Paco Rabanne","Jean Paul Gaultier","Giorgio Armani","Carolina Herrera","Estée Lauder","Charlotte Tilbury","Rare Beauty","Beauty of Joseon","Paula's Choice","Caran d'Ache","Brändi Dog","Hot Wheels","Fisher-Price","Hans im Glück","Bang & Olufsen","Maison Francis Kurkdjian","Le Labo","Kuhn Rikon","Betty Bossi","Amazon Basics","Amazon Essentials","Concept2","Sea to Summit","Fjällräven","Viktor & Rolf","Thierry Mugler","Narciso Rodriguez","Jil Sander","Daniel Wellington","Herman Miller","Secretlab","Lian Li","be quiet!","Western Digital","Bambu Lab","Tour de Suisse","Busch & Müller","Pegasus Spiele","Lululemon"];
const brandOf = n => (TWO.find(b => n.startsWith(b + " ")) || n.split(" ")[0]).replace(/[–:]$/, "");

function collectNameCat() {
  // name -> category, first occurrence wins
  const out = new Map();
  // live-ch.js: {"cat":"X",...,"name":"Y",...} objects, not necessarily in a fixed field order -
  // scan each object's slice between consecutive "name": matches isn't reliable, so pair the two
  // regexes by nearest preceding "cat" for each "name" within the same object literal.
  const liveSrc = fs.readFileSync(SOURCES[0].path, "utf8");
  const objRe = /\{[^{}]*"name":"((?:[^"\\]|\\.)*)"[^{}]*\}/g;
  let m;
  while ((m = objRe.exec(liveSrc)) !== null) {
    const obj = m[0];
    const nameM = obj.match(/"name":"((?:[^"\\]|\\.)*)"/);
    const catM = obj.match(/"cat":"((?:[^"\\]|\\.)*)"/);
    if (nameM && catM && !out.has(nameM[1])) out.set(nameM[1].replace(/\\"/g, '"'), catM[1].replace(/\\"/g, '"'));
  }
  for (const { path, re } of SOURCES.slice(1)) {
    const src = fs.readFileSync(path, "utf8");
    const tupleRe = new RegExp(re.source, re.flags);
    let t;
    while ((t = tupleRe.exec(src)) !== null) {
      const [, cat, name] = t;
      const n = name.replace(/\\"/g, '"');
      if (!out.has(n)) out.set(n, cat);
    }
  }
  return out;
}

async function main() {
  const { IMAGES } = await import(IMAGES_PATH.href);
  const nameCat = collectNameCat();

  const table = {}; // "Brand|Category" -> url, first real photo found wins
  let used = 0, skippedNoCat = 0;
  for (const [name, url] of Object.entries(IMAGES)) {
    const cat = nameCat.get(name);
    if (!cat) { skippedNoCat++; continue; }
    const key = `${brandOf(name)}|${cat}`;
    if (!table[key]) { table[key] = url; used++; }
  }
  console.log(`${Object.keys(IMAGES).length} licensed photos -> ${used} distinct brand+category fallback entries (${skippedNoCat} photos had no matching product/category in our data).`);

  const body = Object.entries(table).sort((a, b) => a[0].localeCompare(b[0]))
    .map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`).join("\n");

  const header = `/* BRAND_CAT_IMAGES: for a product with no exact licensed photo of its own (images.js), a REAL
   photo of another product from the SAME brand and SAME category - e.g. any other Samsung TV's
   photo for a Samsung TV that has none of its own. Built from the photos already in images.js
   (see scripts/images/brand-category-fallback.mjs) - never a different brand, never a different
   category, so a watch never gets a TV's photo. Regenerate by re-running that script after adding
   more photos to images.js.
   CATEGORY_IMAGES: kept as a last-resort generic-category fallback (used only when nothing of the
   same brand+category exists yet); empty for now since AI-generated category art is blocked on
   Gamma workspace credits. */
export const BRAND_CAT_IMAGES = {
${body}
};
export const CATEGORY_IMAGES = {
};
`;
  fs.writeFileSync(CATEGORY_IMAGES_PATH, header);
  console.log(`Wrote ${Object.keys(table).length} entries to src/data/category-images.js`);
}

main();
