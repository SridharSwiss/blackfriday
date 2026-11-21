/* Builds brand+category and cross-brand "subtype" fallback photo pools from the licensed photos we
   already have in images.js. Rationale: a generic stock photo (tried and rejected earlier) or an AI
   illustration (blocked - no image-gen credits) are both worse than reusing a REAL photo we already
   licensed for one product on another product that has none of its own.

   Two tiers, checked in order by src/lib/thumb.js:
   1) BRAND_CAT_POOLS["Brand|Category"] - same brand AND same category. Tight and safe: a Samsung
      Galaxy Watch never gets a Samsung TV's photo, only another Samsung watch/wearable would.
   2) SUBTYPE_POOLS["subtype"] - same VISUAL SUBTYPE, any brand - e.g. a Samsung earbuds photo for an
      Apple earbuds product, or any sneaker's photo for any other sneaker with none of its own
      ("shoes are shoes"). Deliberately coarse only where it's visually safe: subtypeOf() below first
      splits any category that mixes genuinely different-looking products (e.g. "Audio" mixes
      soundbars, earbuds, headphones and speakers) so a soundbar can never get an earbuds photo.

   Each pool can hold several photos (not just one): src/lib/thumb.js picks one per product with a
   STABLE hash of the product's own name, so the same product always shows the same picture (no
   flicker across reloads) while different products in the same bucket get visual variety instead of
   all showing the identical borrowed photo.

   normCat() below folds together category labels that mean the same thing but differ across our
   three data sources (live-ch.js, catalogue.js, top100.js grew independently) - e.g. "Shoes" (used
   in live-ch.js) and "Shoes & Sneakers" (used in catalogue.js) are the same real-world category, so
   a Nike photo sourced under one label now also backs sneakers listed under the other.

   Usage: node scripts/images/brand-category-fallback.mjs */
import fs from "fs";

const ROOT = new URL("../../", import.meta.url);
const IMAGES_PATH = new URL("src/data/images.js", ROOT);
const CATEGORY_IMAGES_PATH = new URL("src/data/category-images.js", ROOT);
const SOURCES = [
  { path: new URL("src/data/catalogue.js", ROOT), re: /\["([^"]+)","((?:[^"\\]|\\.)*)"/g }, // [cat, name, ...]
  { path: new URL("src/data/top100.js", ROOT), re: /\["([^"]+)","((?:[^"\\]|\\.)*)"/g },
];

// Same brand-detection list as src/lib/thumb.js, kept in sync by hand (small, rarely changes).
const TWO = ["The Ordinary","La Roche-Posay","Ultimate Ears","Bowers & Wilkins","Black Diamond","The North Face","Under Armour","Hugo Boss","Calvin Klein","Polo Ralph Lauren","Ralph Lauren","Tommy Hilfiger","Fred Perry","Le Creuset","Big Green Egg","Home Assistant","Peak Design","Dr. Martens","New Balance","Paco Rabanne","Jean Paul Gaultier","Giorgio Armani","Carolina Herrera","Estée Lauder","Charlotte Tilbury","Rare Beauty","Beauty of Joseon","Paula's Choice","Caran d'Ache","Brändi Dog","Hot Wheels","Fisher-Price","Hans im Glück","Bang & Olufsen","Maison Francis Kurkdjian","Le Labo","Kuhn Rikon","Betty Bossi","Amazon Basics","Amazon Essentials","Concept2","Sea to Summit","Fjällräven","Viktor & Rolf","Thierry Mugler","Narciso Rodriguez","Jil Sander","Daniel Wellington","Herman Miller","Secretlab","Lian Li","be quiet!","Western Digital","Bambu Lab","Tour de Suisse","Busch & Müller","Pegasus Spiele","Lululemon"];
const brandOf = n => (TWO.find(b => n.startsWith(b + " ")) || n.split(" ")[0]).replace(/[–:]$/, "");

// Category labels that mean the same real-world category but differ by source file. Keep in sync
// with the identical NORM_CAT in src/lib/thumb.js.
const NORM_CAT = {
  "Shoes & Sneakers": "Shoes",
  "Baby & Kids": "Baby",
  "Robot Vacuums & Cleaning": "Robot vacuums",
  "Tools & DIY": "Tools",
  "Toys & Games": "Toys",
  "Sports": "Sport",
  "Sports & Outdoor": "Sport",
  "Apparel": "Fashion",
  "Fragrance & Beauty": "Beauty",
};
const normCat = cat => NORM_CAT[cat] || cat;

// A single "cat" is sometimes a mix of visually very different products (e.g. "Audio" covers both
// soundbars and earbuds) - a soundbar must never fall back to an earbuds photo, or vice versa. This
// splits the handful of mixed categories into tighter visual buckets, used ONLY for the cross-brand
// subtype tier, not for the brand+category tier, which already keys on the (normalised) category and
// is tight enough on its own (same brand narrows it plenty).
function subtypeOf(name, cat) {
  const c = normCat(cat);
  if (c === "Audio") {
    if (/sound ?bar|\bLG\s+DS[A-Z]*\d/i.test(name)) return "Audio:soundbar"; // LG's "DS..." model-code line is its soundbar family - no literal "soundbar" word in the name
    // Checked before earbuds: "AirPods Max" and Sony's "WH-" line are over-ear/on-ear headphones, not
    // earbuds, even though "AirPods" would otherwise match the earbuds pattern below.
    if (/headphone|over-ear|on-ear|airpods max|\bwh-/i.test(name)) return "Audio:headphones";
    // "buds" with no trailing word-boundary requirement, so it still matches "Buds3"/"Buds4 Pro" (a
    // digit immediately follows with no boundary) - a plain /buds\b/ silently misses those, and misses
    // "AirPods"/"LinkBuds" entirely (no "ear"/"buds" substring at all in "AirPods"), so both brands'
    // most common products were falling through to the generic "other" bucket undetected.
    if (/ear ?(buds|phones)|kopfhörer|in-ear|buds|airpods|\bwf-/i.test(name)) return "Audio:earbuds";
    if (/lautsprecher|speaker|boombox|homepod|\bsrs-|ult field|^logitech z\d{3}/i.test(name)) return "Audio:speaker";
    return "Audio:other";
  }
  // Personal-care devices are sometimes labelled "Appliances" instead of "Beauty"/"Personal Care"
  // across our three sources (same real product type, inconsistent category) - check these name
  // patterns regardless of which of the three raw cats it landed under, so a toothbrush, a shaver
  // and a hair-styling tool never land in the same bucket as each other or as a fridge.
  if (c === "Beauty" || c === "Personal Care" || c === "Appliances") {
    if (/toothbrush|zahnbürste|zahnbuerste/i.test(name)) return "PersonalCare:toothbrush";
    if (/\bipl\b|epilat/i.test(name)) return "PersonalCare:ipl";
    if (/trimmer|grooming kit|beard/i.test(name)) return "PersonalCare:trimmer";
    if (/shaver|razor|rasierer/i.test(name)) return "PersonalCare:shaver";
    if (/curler|airwrap|hair ?dryer|haartrockner|styler|hairwrap|multistyler|airstyler|dampfbuerste|dampfbuegel|ironing|\biron\b/i.test(name)) return "PersonalCare:styling";
    if (/thermometer/i.test(name)) return "PersonalCare:thermometer";
    if (/eau de |parfum|cologne|fragrance/i.test(name)) return "Beauty:fragrance";
    if (/adventskalender|advent calendar/i.test(name)) return "Beauty:giftset";
  }
  if (c === "Appliances") {
    if (/\bset\b.+\+/i.test(name) || /waschtrockner|washer-dryer|washer dryer/i.test(name)) return "Appliances:washerdryer";
    if (/kühlschrank|kuehlschrank|gefrier|freezer|fridge|food ?center|weinkühl|weinkuehl/i.test(name)) return "Appliances:fridge";
    if (/trockner|tumble dryer|\bdryer\b/i.test(name)) return "Appliances:dryer";
    if (/waschmaschine|washing machine/i.test(name)) return "Appliances:washer";
    // Samsung's own model-code prefixes (WW=washer, DV=dryer, RF/RS/RB=fridge) - these entries have
    // no literal English/German word for their type in our data, only the manufacturer code.
    if (/\bWW\d/i.test(name)) return "Appliances:washer";
    if (/\bDV\d/i.test(name)) return "Appliances:dryer";
    if (/\b(RF|RS|RB)\d/i.test(name)) return "Appliances:fridge";
    if (/geschirrspüler|geschirrspueler|dishwasher/i.test(name)) return "Appliances:dishwasher";
    if (/vacuum|staubsauger/i.test(name)) return "Appliances:vacuum";
    if (/coffee machine|kaffeevollautomat|bean-to-cup/i.test(name)) return "Appliances:coffee";
    if (/kettle|wasserkocher/i.test(name)) return "Appliances:kettle";
    if (/mower|rasenmäher|rasenmaeher/i.test(name)) return "Appliances:mower";
    if (/radiator|heater|heizung/i.test(name)) return "Appliances:heater";
    if (/treadmill|laufband/i.test(name)) return "Appliances:treadmill";
    if (/\boven\b|backofen|\bherd\b/i.test(name)) return "Appliances:oven";
    return "Appliances:other";
  }
  if (c === "Beauty" || c === "Personal Care") return "Beauty:other";
  if (c === "Cameras") {
    if (/\d+\s?-?\s?\d*mm|\blens\b/i.test(name)) return "Cameras:lens";
    return "Cameras:body";
  }
  if (c === "Gaming") {
    // "Gaming" is the single widest grab-bag category in our data: consoles, handhelds, controllers,
    // VR headsets, gaming mice/keyboards/headsets, driving wheels, chairs/desks, capture cards/webcams/
    // lighting, small accessories (cases, screen protectors, microSD cards, charging docks), and
    // intangible digital codes (games, subscriptions, points) that should never get a product photo at
    // all. Checked most-specific-first so a keyboard or headset can never fall through to the
    // default "console" bucket and pollute it for an actual console. Logitech's G-series model codes
    // (e.g. "G502 HERO", "G305 Lightspeed") carry no literal "mouse" word, so they're matched by their
    // known product-line pattern instead.
    if (/^(ps5|pc|xbox|nintendo switch)\s*[–-]\s/i.test(name)) return "Gaming:digital"; // a game title tied to a platform, not a hardware product
    if (/game pass|\bpoints\b|\b\d+ months?\b/i.test(name)) return "Gaming:digital"; // subscriptions/currency, intangible
    if (/controller|dualsense/i.test(name)) return "Gaming:controller";
    if (/\bvr\d?\b|vr headset|psvr|quest \d/i.test(name)) return "Gaming:vr";
    if (/facecam|capture|hd60|key light/i.test(name)) return "Gaming:capture";
    if (/\bcamera\b/i.test(name)) return "Gaming:camera";
    if (/headset|\barctis\b|stealth \d|recon \d|\bkraken\b|inzone h/i.test(name)) return "Gaming:headset";
    if (/keyboard|\bk70\b|\bk213\b|blackwidow|apex pro/i.test(name)) return "Gaming:keyboard";
    if (/driving force|\bwheel\b|shift lever|\bhotas\b|flightdeck/i.test(name)) return "Gaming:wheel";
    if (/gaming-stuhl|racing chair|\bdesk\b|ultradesk/i.test(name)) return "Gaming:furniture";
    if (/carrying case|screen protector|microsd|charging station|disc drive|console cover/i.test(name)) return "Gaming:accessory";
    if (/\bg\d{3}\b|lightspeed|\bhero\b|deathadder|viper v\d/i.test(name)) return "Gaming:mouse";
    if (/switch|rog ally|legion go|steam deck|\bclaw\b/i.test(name)) return "Gaming:handheld";
    return "Gaming:console";
  }
  if (c === "Computers") {
    if (/\bmouse\b/i.test(name)) return "Computers:mouse";
    if (/\bdisplay\b/i.test(name)) return "Computers:monitor";
    if (/\bnuc\b|mini[- ]pc\b/i.test(name)) return "Computers:minipc";
    if (/\btower\b/i.test(name)) return "Computers:tower";
    return "Computers:laptop";
  }
  if (c === "Accessories") {
    // Ordered most-specific-first: Logitech's model-code conventions (K-series=keyboard, C-series/
    // Brio=webcam, H-series/"Zone"=headset, M-series/MX Anywhere|Master|Vertical/Lift/Pebble=mouse,
    // "MX Ergo"=trackball) carry no literal descriptive word, so each is matched by its known code.
    if (/airtag/i.test(name)) return "Accessories:tracker";
    if (/crayon|\bpencil\b/i.test(name)) return "Accessories:stylus";
    if (/\bcase\b|folio/i.test(name)) return "Accessories:case";
    if (/power adapter|\bcharger\b/i.test(name)) return "Accessories:charger";
    if (/\bmk\d{3}\b/i.test(name)) return "Accessories:combo";
    if (/mx ergo|trackball/i.test(name)) return "Accessories:trackball";
    if (/keyboard|\bk\d{3}\b|mx keys|mx mechanical/i.test(name)) return "Accessories:keyboard";
    if (/webcam|\bc9\d{2}\b|\bc2\d{2}\b|\bbrio\b/i.test(name)) return "Accessories:webcam";
    if (/headset|zone vibe|\bh\d{3}\b/i.test(name)) return "Accessories:headset";
    if (/\bmouse\b|mx anywhere|mx master|mx vertical|\blift\b|pebble|\bm\d{3}\b/i.test(name)) return "Accessories:mouse";
    if (/\b\d+\s?(gb|tb)\b/i.test(name)) return "Accessories:storage";
    return "Accessories:other";
  }
  if (c === "PC Components") {
    if (/motherboard|mainboard|\bstrix b\d/i.test(name)) return "PCComponents:motherboard";
    if (/\bssd\b|\b\d+\s?(gb|tb)\b/i.test(name)) return "PCComponents:storage";
    return "PCComponents:other";
  }
  if (c === "Phones") {
    if (/\bz ?flip\d?|\bz ?fold\d?|\bfold\d\b|\bflip\d\b/i.test(name)) return "Phones:foldable";
    return "Phones:slab";
  }
  if (c === "Home") {
    if (/vacuum/i.test(name)) return "Home:vacuum";
    if (/purifier/i.test(name)) return "Home:purifier";
    if (/humidifier/i.test(name)) return "Home:humidifier";
    return "Home:other";
  }
  if (c === "Printers") {
    if (/selphy|photo printer/i.test(name)) return "Printers:photo";
    return "Printers:office";
  }
  if (c === "TV") {
    if (/projector|home cinema|\bEH-/i.test(name)) return "TV:projector";
    return `TV:${sizeBucket(tvSizeOf(name))}`;
  }
  return c;
}

// Best-effort inch size for a TV from its model name - our three sources encode it differently per
// brand (Samsung/LG use a size-prefixed model code, Sony/Samsung "The Frame" spell it out with a
// literal inch mark) so this tries, in order: an explicit inch mark; a leading number right after the
// brand (Philips/TCL/Hisense/most LG models: "Philips 48OLED901", "TCL 98C8L"); Samsung's QE/UE/QN/MRE
// prefix; LG's OLED-then-size convention ("LG OLED65C67LA"); Sony's "K-55XR5" code. Used only to keep
// a 32" and an 85" from being treated as visually interchangeable - a loose bucket is fine here, since
// getting it slightly wrong is a far smaller miss than the category mixups this whole file exists for.
function tvSizeOf(name) {
  let m = name.match(/(\d{2,3})\s*(?:"|inch|zoll)\b/i);
  if (m) return +m[1];
  const parts = name.split(" ");
  if (parts[1] && /^\d{2,3}/.test(parts[1])) return +parts[1].match(/^\d{2,3}/)[0];
  if ((m = name.match(/\b(?:QE|UE|QN|MRE)(\d{2})/i))) return +m[1];
  if ((m = name.match(/OLED(\d{2})/i))) return +m[1];
  if ((m = name.match(/K-(\d{2})/i))) return +m[1];
  return null;
}
function sizeBucket(inches) {
  if (inches == null) return "unknown";
  if (inches <= 43) return "small";
  if (inches <= 75) return "medium";
  return "large";
}

function collectNameCat() {
  // name -> category (normalised to the raw label it occurred with first; normCat() is applied at
  // lookup time, not here, so the printed diagnostics below still show real source labels)
  const out = new Map();
  // live-ch.js: {"cat":"X",...,"name":"Y",...} objects, fields not in a fixed order - pair each
  // "name" with the "cat" inside the SAME object literal rather than assuming adjacency.
  const liveSrc = fs.readFileSync(new URL("src/data/live-ch.js", ROOT), "utf8");
  const objRe = /\{[^{}]*"name":"((?:[^"\\]|\\.)*)"[^{}]*\}/g;
  let m;
  while ((m = objRe.exec(liveSrc)) !== null) {
    const obj = m[0];
    const nameM = obj.match(/"name":"((?:[^"\\]|\\.)*)"/);
    const catM = obj.match(/"cat":"((?:[^"\\]|\\.)*)"/);
    if (nameM && catM && !out.has(nameM[1])) out.set(nameM[1].replace(/\\"/g, '"'), catM[1].replace(/\\"/g, '"'));
  }
  for (const { path, re } of SOURCES) {
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

function push(pools, key, url) {
  const arr = pools[key] || (pools[key] = []);
  if (!arr.includes(url)) arr.push(url);
}

async function main() {
  const { IMAGES } = await import(IMAGES_PATH.href);
  const nameCat = collectNameCat();

  const bcPools = {}; // "Brand|Subtype" -> [url, ...]
  const subtypePools = {}; // "subtype" -> [url, ...]
  let skippedNoCat = 0;
  for (const [name, url] of Object.entries(IMAGES)) {
    const rawCat = nameCat.get(name);
    if (!rawCat) { skippedNoCat++; continue; }
    // Keyed by SUBTYPE, not raw/normalised category: the brand+category tier runs before the
    // subtype tier below, so if it only matched on category it could reintroduce exactly the
    // mismatch subtype-splitting exists to prevent (e.g. a same-brand soundbar getting a same-brand
    // earbuds photo via the brand+cat tier, bypassing the subtype split entirely).
    push(bcPools, `${brandOf(name)}|${subtypeOf(name, rawCat)}`, url);
    push(subtypePools, subtypeOf(name, rawCat), url);
  }
  const bcTotal = Object.values(bcPools).reduce((n, a) => n + a.length, 0);
  const stTotal = Object.values(subtypePools).reduce((n, a) => n + a.length, 0);
  console.log(`${Object.keys(IMAGES).length} licensed photos -> ${Object.keys(bcPools).length} brand+category buckets (${bcTotal} photos total), ${Object.keys(subtypePools).length} subtype buckets (${stTotal} photos total). ${skippedNoCat} photos had no matching product/category in our data.`);

  const poolBody = pools => Object.entries(pools).sort((a, b) => a[0].localeCompare(b[0]))
    .map(([k, urls]) => `  ${JSON.stringify(k)}: [${urls.map(u => JSON.stringify(u)).join(", ")}],`).join("\n");

  const header = `/* BRAND_CAT_POOLS: for a product with no exact licensed photo of its own (images.js), a REAL
   photo of another product from the SAME brand and SAME visual SUBTYPE (see subtypeOf() in
   scripts/images/brand-category-fallback.mjs) - e.g. any other Samsung TV's photo for a Samsung TV
   that has none of its own. Keyed by subtype, not just raw/normalised category, so this tier can
   never reintroduce a cross-subtype mismatch within one brand (a Samsung soundbar must never get a
   Samsung earbuds photo just because both are "Audio"; a Bauknecht dryer must never get a fridge
   photo just because both are "Appliances").

   SUBTYPE_POOLS: when even that fails, a REAL photo of the same VISUAL SUBTYPE from ANY brand - e.g.
   a Samsung earbuds photo for an Apple earbuds product, or any sneaker's photo for any other sneaker
   ("shoes are shoes"). Deliberately coarse only where it's visually safe: subtypeOf() in this build
   script splits any category that mixes genuinely different-looking products - "Audio" (soundbar vs.
   earbuds vs. headphones vs. speaker), "Appliances" (fridge vs. washer vs. dryer vs. washer-dryer vs.
   dishwasher vs. vacuum vs. coffee machine vs. kettle vs. oven vs. mower vs. heater vs. treadmill),
   "Beauty"/"Personal Care" (toothbrush vs. shaver/razor vs. trimmer vs. IPL/epilator vs. hair-styling
   vs. thermometer vs. fragrance vs. gift sets - checked regardless of which of those two raw category
   labels, or even "Appliances", a product happened to be filed under, since our source data is
   inconsistent about it), and "Cameras" (lens vs. body) - so none of these can cross into each other.

   Both are POOLS (one or more photos per bucket), not single picks: src/lib/thumb.js chooses one per
   product with a stable hash of that product's own name, so the same product always shows the same
   picture (no flicker on reload) while different products in the same bucket get visual variety.

   CATEGORY_IMAGES: kept as the final, raw-category fallback slot for future AI-generated category
   art if that becomes available again; empty for now.

   Regenerate all three by re-running scripts/images/brand-category-fallback.mjs after adding more
   photos to images.js. */
export const NORM_CAT = ${JSON.stringify(NORM_CAT, null, 2).replace(/\n/g, "\n")};
export const BRAND_CAT_POOLS = {
${poolBody(bcPools)}
};
export const SUBTYPE_POOLS = {
${poolBody(subtypePools)}
};
export const CATEGORY_IMAGES = {
};
`;
  fs.writeFileSync(CATEGORY_IMAGES_PATH, header);
  console.log(`Wrote ${Object.keys(bcPools).length} brand+category and ${Object.keys(subtypePools).length} subtype pools to src/data/category-images.js`);
}

main();
