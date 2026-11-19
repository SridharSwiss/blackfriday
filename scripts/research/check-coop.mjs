/* Check Coop Mobile deal pages for working URLs */

import { globalLimiter } from "./rate-limiter.mjs";

const COOP_URLS = [
  "https://www.coop-mobile.ch/",
  "https://www.coop-mobile.ch/de/abos/swiss-s",
  "https://www.coop-mobile.ch/de/abos/",
  "https://www.coop-mobile.ch/de/",
  "https://www.coop-mobile.ch/privat/abos/",
];

export async function checkCoop() {
  for (const url of COOP_URLS) {
    await globalLimiter.acquire();
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 20000);
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml",
        },
        redirect: "follow", signal: controller.signal,
      });
      clearTimeout(timer);
      const text = await res.text();
      const hasBlackFriday = /black.?friday/i.test(text);
      const hasSwissS = /swiss.?s/i.test(text);
      console.log(`${res.status >= 200 && res.status < 400 ? "✓" : "✗"} ${url} (${res.status}) BF:${hasBlackFriday} SwissS:${hasSwissS}`);
    } catch (e) {
      console.log(`✗ ${url} - ERROR: ${e.message}`);
    }
  }
}

checkCoop().catch(e => console.error("ERROR:", e));
