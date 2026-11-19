/* Orchestrator: runs all source agents, aggregates, deduplicates, verifies URLs,
   applies the two-source confirmation rule, and updates src/data/live-ch.js.
   Rate limit: 40 RPM (1 request per 1.5s) shared across all agents. */

import fs from "fs";
import path from "path";
import { globalLimiter } from "./rate-limiter.mjs";
import { PreispiratAgent } from "./sources/preispirat.mjs";
import { ToppreiseAgent } from "./sources/toppreise.mjs";
import { BlackFridayDealsAgent } from "./sources/blackfridaydeals.mjs";
import { BlackFridayChAgent } from "./sources/blackfriday-ch.mjs";
import { DayDealAgent } from "./sources/daydeal.mjs";
import { BlickDealAgent } from "./sources/blickdeal.mjs";
import { FustAgent } from "./sources/fust.mjs";

const TODAY = new Date().toISOString().slice(0, 10);
const LIVE_CH_PATH = path.resolve("src/data/live-ch.js");

const HOST_TO_SHOP = {
  digitec: "digitec", galaxus: "galaxus", mediamarkt: "mediamarkt", interdiscount: "interdiscount",
  fust: "fust", lenovo: "lenovo", hp: "hp", apple: "apple", samsung: "samsung", sony: "sony",
  bose: "bose", jbl: "jbl", nike: "nike", adidas: "adidas", zalando: "zalando", manor: "manor",
  coop: "coop", migros: "migros", denner: "denner", aldi: "aldi", lidl: "lidl", kaufland: "kaufland",
  otto: "otto", aboutyou: "aboutyou", yoox: "yoox", farfetch: "farfetch", matches: "matches",
  "net-a-porter": "net-a-porter", mytheresa: "mytheresa", zara: "zara", hm: "hm", uniqlo: "uniqlo",
  cos: "cos", boohoo: "boohoo", asos: "asos", next: "next", johnlewis: "johnlewis", argos: "argos",
  tesco: "tesco", sainsbury: "sainsbury", ocado: "ocado", waitrose: "waitrose", marks: "marks",
  debenhams: "debenhams", houseoffraser: "houseoffraser", selfridges: "selfridges", harrods: "harrods",
  liberty: "liberty", fenwick: "fenwick", bloomingdales: "bloomingdales", nordstrom: "nordstrom",
  macys: "macys", saksoff5th: "saksoff5th", neimanmarcus: "neimanmarcus", bergdorf: "bergdorf",
  barneys: "barneys", lordandtaylor: "lordandtaylor", dillards: "dillards", belk: "belk",
  jcpenney: "jcpenney", kmart: "kmart", sears: "sears", target: "target", walmart: "walmart",
  costco: "costco", meijer: "meijer", kroger: "kroger", albertsons: "albertsons", safeway: "safeway",
  wegmans: "wegmans", wingo: "wingo", yallo: "yallo", sunrise: "sunrise", salt: "salt",
  swisscom: "swisscom",
};

function deriveShopKey(url) {
  try {
    const host = new URL(url).hostname.toLowerCase().replace(/^www\./, "");
    for (const [key, shop] of Object.entries(HOST_TO_SHOP)) {
      if (host.includes(key)) return shop;
    }
    return "other";
  } catch (e) {
    return "other";
  }
}

export async function verifyUrl(url, timeoutMs = 15000) {
  await globalLimiter.acquire();
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, {
      method: "HEAD",
      headers: { "User-Agent": "Aktions.ch Deal Verification Bot 1.0 (+https://aktions.ch)" },
      redirect: "follow", signal: controller.signal,
    });
    clearTimeout(timer);
    return { url, working: res.status >= 200 && res.status < 400, status: res.status };
  } catch (e) {
    try {
      await globalLimiter.acquire();
      const controller2 = new AbortController();
      const timer2 = setTimeout(() => controller2.abort(), timeoutMs);
      const res = await fetch(url, {
        method: "GET",
        headers: { "User-Agent": "Aktions.ch Deal Verification Bot 1.0 (+https://aktions.ch)" },
        redirect: "follow", signal: controller2.signal,
      });
      clearTimeout(timer2);
      return { url, working: res.status >= 200 && res.status < 400, status: res.status };
    } catch (e2) {
      return { url, working: false, status: 0, error: e2.message };
    }
  }
}

const normalizeName = s => String(s || "").toLowerCase()
  .replace(/[^a-z0-9äöüß]/g, "")
  .replace(/ä/g, "a").replace(/ö/g, "o").replace(/ü/g, "u").replace(/ß/g, "s");

const BRAND_KEYWORDS = [
  "lenovo", "hp", "apple", "samsung", "sony", "lg", "dyson", "philips", "fust",
  "mediamarkt", "interdiscount", "digitec", "galaxus", "coop", "sunrise", "swisscom",
  "wingo", "yallo", "salt", "ikea", "bosch", "siemens", "miele", "jura", "roborock",
  "nintendo", "microsoft", "acer", "asus", "dell", "canon", "nikon", "garmin",
  "jbl", "bose", "adidas", "nike", "zalando", "manor", "decathlon",
];

const keywordOverlap = (a, b) => {
  const aw = new Set(a.toLowerCase().split(/\s+/).filter(w => w.length > 2));
  const bw = new Set(b.toLowerCase().split(/\s+/).filter(w => w.length > 2));
  if (aw.size === 0 || bw.size === 0) return 0;
  const overlap = [...aw].filter(w => bw.has(w)).length;
  const base = overlap / Math.min(aw.size, bw.size);
  // Brand-level boost: if both mention the same brand, boost score
  const aBrands = BRAND_KEYWORDS.filter(b => a.toLowerCase().includes(b));
  const bBrands = BRAND_KEYWORDS.filter(b => b.toLowerCase().includes(b));
  const brandOverlap = aBrands.filter(b => bBrands.includes(b)).length > 0 ? 0.5 : 0;
  return Math.min(1, base + brandOverlap);
};

function parseExistingLiveCh(content) {
  const deals = [];
  const arrMatch = content.match(/export\s+const\s+LIVE_CH\s*=\s*\[([\s\S]*?)\];/);
  if (!arrMatch) return deals;
  const arrContent = arrMatch[1];
  const objStrs = arrContent.split(/\},\s*\{/);
  for (const objStr of objStrs) {
    const clean = objStr.replace(/^\{/, "").replace(/\}$/, "");
    const deal = {};
    const fieldRegex = /("shop"|"cat"|"name"|"spec"|"price"|"was"|"cur"|"percent"|"code"|"from"|"until"|"type"|"url"|"q"|"checked"|"note"|"src")\s*:\s*((?:"(?:[^"\\]|\\.)*"|true|false|null|[\d.]+))/g;
    let m;
    while ((m = fieldRegex.exec(clean)) !== null) {
      let val = m[2];
      if (val.startsWith('"')) val = val.slice(1, -1).replace(/\\"/g, '"');
      else if (val === "true") val = true;
      else if (val === "false") val = false;
      else if (val === "null") val = null;
      else val = parseFloat(val);
      deal[m[1].replace(/"/g, "")] = val;
    }
    if (deal.name) deals.push(deal);
  }
  return deals;
}

async function runAllSources() {
  const agents = [
    new PreispiratAgent(), new ToppreiseAgent(), new BlackFridayDealsAgent(),
    new BlackFridayChAgent(), new DayDealAgent(), new BlickDealAgent(), new FustAgent(),
  ];
  const allResults = [];
  for (const agent of agents) {
    try {
      const results = await agent.run();
      allResults.push(...results);
    } catch (e) {
      console.log(`[Orchestrator] ${agent.name} failed: ${e.message}`);
    }
  }
  return allResults;
}

function deduplicateAndValidate(results) {
  // Group by similar names using keyword overlap
  const groups = [];
  for (const r of results) {
    let matched = false;
    for (const group of groups) {
      if (keywordOverlap(r.name, group.representative.name) > 0.4) {
        group.entries.push(r);
        matched = true;
        break;
      }
    }
    if (!matched) groups.push({ representative: r, entries: [r] });
  }

  const validated = [];
  for (const group of groups) {
    const sources = [...new Set(group.entries.map(e => e.source))];
    const urls = [...new Set(group.entries.map(e => e.url))];
    const srcs = [...new Set(group.entries.flatMap(e => e.src || []))];

    const base = group.entries.reduce((a, b) => {
      const aScore = (a.price != null && a.price > 5 ? 1 : 0) + (a.was != null && a.was > 5 ? 1 : 0) + (a.until != null ? 1 : 0);
      const bScore = (b.price != null && b.price > 5 ? 1 : 0) + (b.was != null && b.was > 5 ? 1 : 0) + (b.until != null ? 1 : 0);
      return bScore > aScore ? b : a;
    });

    // Validate: need a real price (>= 5 CHF) or valid percent (1-90) with was
    const hasValidPrice = base.price != null && base.price >= 5 && base.price < 100000;
    const hasValidWas = base.was != null && base.was > base.price && base.was < 100000;
    const hasValidPercent = base.percent != null && base.percent >= 1 && base.percent <= 90;

    const isValid = hasValidPrice || (hasValidWas && hasValidPercent);

    validated.push({
      ...base,
      sources, sourceCount: sources.length,
      confirmed: sources.length >= 2 && isValid,
      allUrls: urls, allSrcs: srcs,
    });
  }
  return validated;
}

function formatDealEntry(d, shopKey) {
  const until = d.until ? `,"until":"${d.until}"` : "";
  const code = d.code ? `,"code":"${d.code}"` : "";
  const q = d.q ? `,"q":"${d.q}"` : "";
  const type = d.type ? `,"type":"${d.type}"` : "";
  const note = d.note ? `,"note":"${d.note.replace(/"/g, '\\"')}"` : "";
  const src = d.allSrcs.length > 0 ? `,"src":[${d.allSrcs.map(s => `"${s}"`).join(",")}]` : "";
  const percent = d.percent != null ? `,"percent":${d.percent}` : "";
  const was = d.was != null ? `,"was":${d.was}` : "";
  const price = d.price != null ? `,"price":${d.price}` : "";
  const cur = d.cur || "CHF";
  const cat = d.cat ? `,"cat":"${d.cat}"` : "";
  const spec = d.spec ? `,"spec":"${d.spec.replace(/"/g, '\\"')}"` : "";
  return `{"shop":"${shopKey}"${cat}${spec}${price}${was},"cur":"${cur}"${percent}${code}${until}${type}${q}${note}${src}}`;
}

function updateLiveChFile(newDeals) {
  const content = fs.readFileSync(LIVE_CH_PATH, "utf8");
  const existing = parseExistingLiveCh(content);
  const existingNames = new Set(existing.map(d => normalizeName(d.name)));

  const additions = [];
  for (const d of newDeals) {
    if (!d.confirmed) continue;
    if (existingNames.has(normalizeName(d.name))) continue;
    const shopKey = deriveShopKey(d.url);
    additions.push(formatDealEntry(d, shopKey));
  }

  if (additions.length === 0) {
    console.log("[Orchestrator] No new confirmed deals to add.");
    return { added: 0, total: existing.length };
  }

  const newContent = content.replace(/\];\s*$/, `,\n${additions.join(",\n")}\n];`);
  fs.writeFileSync(LIVE_CH_PATH, newContent);
  console.log(`[Orchestrator] Added ${additions.length} new confirmed deals to live-ch.js`);
  return { added: additions.length, total: existing.length + additions.length };
}

export async function runResearch() {
  console.log("========================================");
  console.log("Agentic Black Friday Deal Research");
  console.log("Date:", TODAY, "| Rate limit: 40 RPM");
  console.log("========================================\n");

  const results = await runAllSources();
  console.log(`\n[Orchestrator] Total raw results: ${results.length}`);

  const validated = deduplicateAndValidate(results);
  const confirmed = validated.filter(v => v.confirmed);
  console.log(`[Orchestrator] Confirmed (2+ sources): ${confirmed.length} / ${validated.length}`);

  console.log("\n[Orchestrator] Verifying URLs...");
  const verified = [];
  for (const d of confirmed) {
    const check = await verifyUrl(d.url);
    d.urlWorking = check.working;
    d.urlStatus = check.status;
    if (check.working) {
      verified.push(d);
      console.log(`[Orchestrator] ✓ URL working: ${d.url} (${check.status})`);
    } else {
      // Lenient: if confirmed by 2+ sources, still include but flag
      console.log(`[Orchestrator] ⚠ URL verification failed: ${d.url} (${check.status}) - including anyway (${d.sourceCount} sources)`);
      verified.push(d);
    }
  }
  console.log(`[Orchestrator] URLs verified/accepted: ${verified.length} / ${confirmed.length}`);

  const updateResult = updateLiveChFile(verified);

  const report = {
    date: TODAY, totalRaw: results.length, totalValidated: validated.length,
    confirmed: confirmed.length, urlsWorking: verified.length,
    addedToWebpage: updateResult.added, totalDeals: updateResult.total,
    deals: verified.map(d => ({
      name: d.name, shop: d.source, price: d.price, was: d.was,
      percent: d.percent, url: d.url, sources: d.sources, until: d.until,
      urlWorking: d.urlWorking,
    })),
  };

  fs.writeFileSync(path.resolve("scripts/research/results/latest.json"), JSON.stringify(report, null, 2));
  console.log("\n========================================");
  console.log("Research complete. Report saved to scripts/research/results/latest.json");
  console.log("========================================");
  return report;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runResearch().catch(e => console.error("FATAL:", e));
}
