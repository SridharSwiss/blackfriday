/* Verify all existing deal URLs in live-ch.js are working.
   Reports which URLs are broken so they can be removed/updated. */

import fs from "fs";
import path from "path";
import { globalLimiter } from "./rate-limiter.mjs";

const LIVE_CH_PATH = path.resolve("src/data/live-ch.js");

const normalizeName = s => String(s || "").toLowerCase()
  .replace(/[^a-z0-9äöüß]/g, "")
  .replace(/ä/g, "a").replace(/ö/g, "o").replace(/ü/g, "u").replace(/ß/g, "s");

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

export async function verifyExisting() {
  const content = fs.readFileSync(LIVE_CH_PATH, "utf8");
  const deals = parseExistingLiveCh(content);
  console.log(`Verifying ${deals.length} existing deal URLs...\n`);

  const working = [];
  const broken = [];

  for (const d of deals) {
    if (!d.url) continue;
    await globalLimiter.acquire();
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(d.url, {
        method: "HEAD",
        headers: { "User-Agent": "Aktions.ch Deal Verification Bot 1.0 (+https://aktions.ch)" },
        redirect: "follow", signal: controller.signal,
      });
      clearTimeout(timer);
      const ok = res.status >= 200 && res.status < 400;
      if (ok) {
        working.push({ name: d.name, shop: d.shop, url: d.url, status: res.status });
        console.log(`✓ [${d.shop}] ${d.name} (${res.status})`);
      } else {
        // Try GET as fallback
        await globalLimiter.acquire();
        const controller2 = new AbortController();
        const timer2 = setTimeout(() => controller2.abort(), 15000);
        const res2 = await fetch(d.url, {
          method: "GET",
          headers: { "User-Agent": "Aktions.ch Deal Verification Bot 1.0 (+https://aktions.ch)" },
          redirect: "follow", signal: controller2.signal,
        });
        clearTimeout(timer2);
        const ok2 = res2.status >= 200 && res2.status < 400;
        if (ok2) {
          working.push({ name: d.name, shop: d.shop, url: d.url, status: res2.status });
          console.log(`✓ [${d.shop}] ${d.name} (${res2.status})`);
        } else {
          broken.push({ name: d.name, shop: d.shop, url: d.url, status: res2.status });
          console.log(`✗ [${d.shop}] ${d.name} -> ${d.url} (${res2.status})`);
        }
      }
    } catch (e) {
      broken.push({ name: d.name, shop: d.shop, url: d.url, status: 0, error: e.message });
      console.log(`✗ [${d.shop}] ${d.name} - ERROR: ${e.message}`);
    }
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`Working: ${working.length}`);
  console.log(`Broken: ${broken.length}`);
  if (broken.length > 0) {
    console.log(`\nBroken URLs:`);
    for (const b of broken) console.log(`  ${b.shop}: ${b.name} -> ${b.url} (${b.status})`);
  }

  return { working, broken, total: deals.length };
}

verifyExisting().catch(e => console.error("ERROR:", e));
