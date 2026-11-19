/* Retry broken URLs with GET method and longer timeout */

import fs from "fs";
import path from "path";
import { globalLimiter } from "./rate-limiter.mjs";

const LIVE_CH_PATH = path.resolve("src/data/live-ch.js");

const BROKEN_URLS = [
  { shop: "digitec", name: "LG OLED65C67LA 65\" C6 OLED 4K 2026", url: "https://www.digitec.ch/en/s1/product/lg-oled65c67la-65-c6-oled-4k-2026-ch-tv-69071882" },
  { shop: "digitec", name: "Dreame L50 Ultra AE (white)", url: "https://www.digitec.ch/en/s1/product/dreame-l50-ultra-ae-28000-pa-wiping-pads-rotating-robot-vacuum-cleaners-68597155" },
  { shop: "digitec", name: "Sony Alpha 7 IV Kit II ILCE-7M4K 28-70mm", url: "https://www.digitec.ch/en/s1/product/sony-alpha-7-iv-kit-ii-28-70-mm-33-mpx-full-frame-cameras-69584626" },
  { shop: "hp", name: "HP LaserJet Tank 1504w", url: "https://www.hp.com/ch-de/shop/products/printers/hp-laserjet-tank-1504w-drucker-2r7f3a-baz" },
  { shop: "coop", name: "Coop Mobile Swiss S", url: "https://www.coop-mobile.ch/" },
  { shop: "lenovo", name: "Lenovo ThinkPad X1 Carbon Gen 13", url: "https://www.lenovo.com/ch/de/search?text=ThinkPad%20X1%20Carbon" },
];

export async function retryBroken() {
  const working = [];
  const stillBroken = [];

  for (const d of BROKEN_URLS) {
    await globalLimiter.acquire();
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 30000);
      const res = await fetch(d.url, {
        method: "GET",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml",
        },
        redirect: "follow", signal: controller.signal,
      });
      clearTimeout(timer);
      const ok = res.status >= 200 && res.status < 400;
      if (ok) {
        working.push({ ...d, status: res.status });
        console.log(`✓ [${d.shop}] ${d.name} (${res.status}) - NOW WORKING`);
      } else {
        stillBroken.push({ ...d, status: res.status });
        console.log(`✗ [${d.shop}] ${d.name} -> ${d.url} (${res.status}) - STILL BROKEN`);
      }
    } catch (e) {
      stillBroken.push({ ...d, status: 0, error: e.message });
      console.log(`✗ [${d.shop}] ${d.name} - ERROR: ${e.message}`);
    }
  }

  console.log(`\n=== RETRY SUMMARY ===`);
  console.log(`Now working: ${working.length}`);
  console.log(`Still broken: ${stillBroken.length}`);
  return { working, stillBroken };
}

retryBroken().catch(e => console.error("ERROR:", e));
