/* Daily social kit: node scripts/social.mjs  ->  marketing/<date>-top5/ (poster 1080x1350, story/reel cover 1080x1920, captions DE/FR/IT/EN).
   Uses only live rows (same expiry rule as the site) with at least 30 % off, one per category, ranked by CHF saved. */
import fs from "fs"; import path from "path"; import { createRequire } from "module"; import { execSync } from "child_process";
const req = createRequire(import.meta.url);
const { chromium } = (() => { try { return req("playwright"); } catch { return createRequire(path.join(execSync("npm root -g").toString().trim(), "x.js"))("playwright"); } })();
import { LIVE_CH } from "../src/data/live-ch.js";
import { SHOPS } from "../src/config/shops.js";
const T = new Date().toISOString().slice(0, 10);
const plus = (s, n) => { const d = new Date(s + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const rate = c => c === "EUR" ? 0.94 : 1;
const live = LIVE_CH.filter(r => (!r.from || r.from <= T) && T <= (r.until || plus(r.checked, 3)) && r.price != null && r.was && 1 - r.price / r.was >= 0.3)
  .sort((a, b) => (b.was - b.price) * rate(b.cur) - (a.was - a.price) * rate(a.cur));
const seen = new Set(), top = [];
for (const r of live) { if (!seen.has(r.cat) && top.length < 5) { seen.add(r.cat); top.push(r); } }
if (top.length < 3) { console.log("fewer than 3 live deals, nothing generated"); process.exit(0); }
const f = (n, c) => (c === "EUR" ? "€ " : "CHF ") + n.toLocaleString("de-CH", { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 });
const off = r => Math.round((1 - r.price / r.was) * 100);
const dir = `marketing/${T}-top5`; fs.mkdirSync(dir, { recursive: true });
const rows = top.map((r, i) => `<div class="row"><b class="n">${i + 1}</b><div class="t"><div class="nm">${r.name}</div><div class="sh">${SHOPS[r.shop]?.name || r.shop}${r.until ? " · bis " + r.until.slice(8) + "." + r.until.slice(5, 7) + "." : ""}</div></div><div class="p"><div class="now">${f(r.price, r.cur)}</div><s>${f(r.was, r.cur)}</s></div><span class="off">−${off(r)}%</span></div>`).join("");
const html = h => `<!doctype html><meta charset=utf-8><style>*{box-sizing:border-box}body{margin:0;width:1080px;height:${h}px;background:#fff7f2;font-family:Inter,Helvetica,Arial,sans-serif;color:#15151a;padding:64px;display:flex;flex-direction:column}
.k{color:#d62b1f;font-weight:800;letter-spacing:.14em;font-size:30px}h1{font-size:${h > 1500 ? 108 : 88}px;line-height:1;margin:14px 0 8px;font-weight:900}h1 em{color:#d62b1f;font-style:normal}.sub{font-size:30px;color:#555;margin-bottom:34px}
.row{display:flex;align-items:center;gap:20px;background:#fff;border-radius:26px;padding:${h > 1500 ? 30 : 22}px 26px;margin-bottom:${h > 1500 ? 22 : 14}px;box-shadow:0 4px 18px #0001;position:relative}.n{font-size:54px;color:#d62b1f;width:56px}.t{flex:1;min-width:0}.nm{font-size:32px;font-weight:700;line-height:1.15}.sh{font-size:24px;color:#777;margin-top:4px}
.p{text-align:right}.now{font-size:38px;font-weight:900;background:#ffd400;padding:2px 12px;border-radius:10px}s{font-size:24px;color:#888}.off{position:absolute;top:-12px;right:18px;background:#d62b1f;color:#fff;font-weight:800;font-size:26px;border-radius:99px;padding:3px 14px}
.cta{margin-top:auto;background:#d62b1f;color:#fff;border-radius:26px;padding:26px;text-align:center;font-size:38px;font-weight:800}.fine{font-size:20px;color:#777;margin-top:14px;text-align:center}</style>
<div class="k">AKTIONS.CH · LIVE · ${T.split("-").reverse().join(".")}</div><h1>Top 5 <em>Deals</em> heute</h1><div class="sub">Geprüft, nur was du jetzt kaufen kannst</div>${rows}
<div class="cta">Alle Live-Deals: aktions.ch → Link in Bio</div><div class="fine">Preise Stand ${T.split("-").reverse().join(".")}, können sich ändern. Affiliate-Links.</div>`;
const b = await chromium.launch();
for (const [name, h] of [["poster-1080x1350", 1350], ["story-1080x1920", 1920]]) {
  const p = await b.newPage({ viewport: { width: 1080, height: h } }); await p.setContent(html(h)); await p.screenshot({ path: path.join(dir, name + ".png") }); await p.close();
}
await b.close();
const L = (r, d = 0) => `${r.name}: ${f(r.price, r.cur)} ${d ? "statt" : "statt"} ${f(r.was, r.cur)} (−${off(r)}%)`;
const cap = {
 DE: `🔥 Die 5 besten Schweizer Deals von heute (geprüft ${T.split("-").reverse().join(".")}):\n\n${top.map((r, i) => `#${i + 1} ${L(r)}`).join("\n")}\n\nAlle Live-Deals: 👉 Link in Bio\n\n*Anzeige: Affiliate-Links. Preise können sich ändern.\n#blackfridayschweiz #schnäppchen #dealdestages #aktionsch #sparen #schweiz`,
 FR: `🔥 Les 5 meilleures offres du jour en Suisse (vérifiées le ${T.split("-").reverse().join(".")}):\n\n${top.map((r, i) => `#${i + 1} ${L(r).replace("statt", "au lieu de")}`).join("\n")}\n\nToutes les offres en direct: 👉 lien en bio\n\n*Publicité: liens affiliés.\n#blackfriday #bonsplans #suisse #aktionsch`,
 IT: `🔥 Le 5 migliori offerte di oggi in Svizzera (verificate il ${T.split("-").reverse().join(".")}):\n\n${top.map((r, i) => `#${i + 1} ${L(r).replace("statt", "invece di")}`).join("\n")}\n\nTutte le offerte live: 👉 link in bio\n\n*Pubblicità: link affiliati.\n#blackfriday #offerte #svizzera #aktionsch`,
 EN: `🔥 Today's top 5 Swiss deals (checked ${T}):\n\n${top.map((r, i) => `#${i + 1} ${L(r).replace("statt", "was")}`).join("\n")}\n\nAll live deals: 👉 link in bio\n\n*Ad: affiliate links.\n#blackfriday #deals #switzerland #aktionsch`
};
fs.writeFileSync(path.join(dir, "CAPTIONS.md"), `# Top 5 deals ${T}\n\nFiles: poster-1080x1350.png (feed post), story-1080x1920.png (story / reel cover). Re-run with \`node scripts/social.mjs\`.\n\n` + Object.entries(cap).map(([k, v]) => `## ${k}\n\n${v}\n`).join("\n"));
console.log(dir, top.map(r => r.name));
