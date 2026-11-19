/* Verify all new deal URLs are working */

import { globalLimiter } from "./rate-limiter.mjs";

const URLS = [
  { shop: "salt", name: "Salt Europe Surf Call", url: "https://www.salt.ch/" },
  { shop: "mediamarkt", name: "Nintendo Switch 2 Bundle", url: "https://www.mediamarkt.ch/de/campaign/black-friday" },
  { shop: "mediamarkt", name: "Sony BRAVIA 8A OLED", url: "https://www.mediamarkt.ch/de/campaign/black-friday" },
  { shop: "mediamarkt", name: "Ninja Siebträgermaschine", url: "https://www.mediamarkt.ch/de/campaign/black-friday" },
  { shop: "mediamarkt", name: "BEASTCOM Q5 Pro", url: "https://www.mediamarkt.ch/de/campaign/black-friday" },
  { shop: "fust", name: "Philips 65OLED760 TV", url: "https://www.fust.ch/" },
  { shop: "daydeal", name: "Govee Neon Rope Light", url: "https://www.daydeal.ch/de/category/tagesdeal" },
  { shop: "daydeal", name: "Raclette-Fondue", url: "https://www.daydeal.ch/de/category/haushalt-wohnen" },
  { shop: "daydeal", name: "Targus Dockingstation", url: "https://www.daydeal.ch/de/category/it-multimedia" },
  { shop: "daydeal", name: "Kospet Smartwatch", url: "https://www.daydeal.ch/de/category/sport-freizeit" },
  { shop: "daydeal", name: "Tea box collection", url: "https://www.daydeal.ch/de/category/supermarkt-drogerie" },
  { shop: "blickdeal", name: "NordVPN", url: "https://box.blick.ch/" },
  { shop: "blickdeal", name: "HAMMER Rowing Machine", url: "https://box.blick.ch/" },
  { shop: "interdiscount", name: "Apple AirPods 5", url: "https://www.interdiscount.ch/" },
  { shop: "livique", name: "billerbeck Pillow", url: "https://www.livique.ch/de" },
  { shop: "coop", name: "Coop Mobile Swiss S", url: "https://www.coop-mobile.ch/" },
];

export async function verifyDeals() {
  console.log(`Verifying ${URLS.length} URLs...\n`);
  const working = [];
  const broken = [];

  for (const d of URLS) {
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
        working.push({ ...d, status: res.status });
        console.log(`✓ [${d.shop}] ${d.name} (${res.status})`);
      } else {
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
          working.push({ ...d, status: res2.status });
          console.log(`✓ [${d.shop}] ${d.name} (${res2.status})`);
        } else {
          broken.push({ ...d, status: res2.status });
          console.log(`✗ [${d.shop}] ${d.name} -> ${d.url} (${res2.status})`);
        }
      }
    } catch (e) {
      broken.push({ ...d, status: 0, error: e.message });
      console.log(`✗ [${d.shop}] ${d.name} - ERROR: ${e.message}`);
    }
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`Working: ${working.length}`);
  console.log(`Broken: ${broken.length}`);
  return { working, broken };
}

verifyDeals().catch(e => console.error("ERROR:", e));
