/* Campaign kit: node scripts/campaign.mjs  ->  marketing/<date>-campaign/
   5 posters (1080x1350) + 5 reels (1080x1920 MP4, ~13 s) built from the LIVE deals (same expiry rule as the site),
   with real screenshots of the website. Needs the site on http://localhost:4174 (vite preview) and ffmpeg. */
import fs from "fs"; import path from "path"; import { createRequire } from "module"; import { execSync, spawn } from "child_process";
const req = createRequire(import.meta.url);
const { chromium } = (() => { try { return req("playwright"); } catch { return createRequire(path.join(execSync("npm root -g").toString().trim(), "x.js"))("playwright"); } })();
import { LIVE_CH } from "../src/data/live-ch.js";
import { US_RAW } from "../src/data/us.js";
import { SHOPS } from "../src/config/shops.js";
const T = new Date().toISOString().slice(0, 10);
const plus = (s, n) => { const d = new Date(s + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const dmy = s => s.slice(8) + "." + s.slice(5, 7) + ".";
const out = `marketing/${T}-campaign`; fs.mkdirSync(out + "/assets", { recursive: true });
const rate = c => (c === "EUR" ? 0.94 : 1);
const ch = LIVE_CH.filter(r => (!r.from || r.from <= T) && T <= (r.until || plus(r.checked, 3)) && r.price != null && r.was)
  .map(r => ({ name: r.name, shop: SHOPS[r.shop]?.name || r.shop, cat: r.cat, now: r.price, was: r.was, cur: r.cur || "CHF", until: r.until || null, off: Math.round((1 - r.price / r.was) * 100), save: (r.was - r.price) * rate(r.cur) }));
const us = US_RAW.filter(r => (r[7] ? r[7] >= T : plus(r[8], 3) >= T)).map(r => ({ name: r[1], shop: SHOPS[r[5]]?.name || r[5], cat: r[0], now: r[3], was: r[4], cur: "USD", until: r[7] || null, off: Math.round((1 - r[3] / r[4]) * 100), save: r[4] - r[3] }));
const best = (arr, n, min = 25, used = new Set()) => { const o = []; for (const d of arr.filter(d => d.off >= min).sort((a, b) => b.save - a.save)) { if (o.length >= n) break; if (used.has(d.name)) continue; used.add(d.name); o.push(d); } return o; };
const used = new Set();
const SETS = [
  { id: "1-top5", title: "Die 5 grössten", em: "Live-Deals", sub: "Heute in der Schweiz geprüft", deals: best(ch, 5, 30, used), shot: "best" },
  { id: "2-tv-audio", title: "TV & Sound", em: "zum Bestpreis", sub: "Fernseher, Soundbars, Kopfhörer", deals: best(ch.filter(d => ["TV", "Audio"].includes(d.cat)), 5, 25, used), shot: "live" },
  { id: "3-computer-phone", title: "Computer, Handy", em: "& Tablet", sub: "Laptops, Smartphones, Tablets", deals: best(ch.filter(d => ["Computers", "Phones", "Tablets", "Gaming"].includes(d.cat)), 5, 25, used), shot: "best" },
  { id: "4-home-kitchen", title: "Küche & Zuhause", em: "stark reduziert", sub: "Haushalt, Küche, Möbel", deals: best(ch.filter(d => ["Kitchen", "Home", "Appliances", "Furniture", "Small home appliances"].includes(d.cat)), 5, 25, used), shot: "live2" },
  { id: "5-us", title: "US Black Friday", em: "Live-Deals in USD", sub: "Amazon.com, Walmart & Co.", deals: best(us, 5, 25, new Set()), shot: "us", us: true }
].filter(s => s.deals.length >= 3);
if (SETS.length < 5) console.log("note: only", SETS.length, "sets have 3+ deals");
const f = (n, c) => (c === "USD" ? "$" + n.toLocaleString("en-US") : (c === "EUR" ? "€ " : "CHF ") + n.toLocaleString("de-CH", { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 }));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const BASE = `*{box-sizing:border-box;margin:0}body{font-family:Inter,"Helvetica Neue",Arial,sans-serif;background:#151314;color:#fff;overflow:hidden}
.logo{display:flex;align-items:center;gap:14px}.cx{width:62px;height:62px;border-radius:14px;background:#fff;position:relative}.cx:before,.cx:after{content:"";position:absolute;background:#D52B1E;border-radius:3px}.cx:before{left:16px;right:16px;top:25px;bottom:25px}.cx:after{top:16px;bottom:16px;left:25px;right:25px}
.logo b{font-size:44px;font-weight:900;letter-spacing:2px}.logo b i{font-style:normal;color:#FFD200}
.card{background:#fff;color:#151314;border-radius:24px;display:flex;align-items:center;gap:20px;padding:20px 26px;position:relative}
.rk{width:56px;height:56px;flex:none;border-radius:50%;background:#D52B1E;color:#fff;font-weight:900;font-size:30px;display:grid;place-items:center}
.t{flex:1;min-width:0}.nm{font-size:30px;font-weight:800;line-height:1.15;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.sh{font-size:22px;color:#6B6465;margin-top:4px;font-weight:600}
.pr{text-align:right;flex:none}.now{display:inline-block;font-size:40px;font-weight:900;background:#FFD200;padding:2px 14px;border-radius:10px;white-space:nowrap}.was{display:block;font-size:23px;color:#8a8384;text-decoration:line-through;margin-top:4px}
.off{position:absolute;top:-14px;right:22px;background:#D52B1E;color:#fff;font-weight:900;font-size:24px;padding:4px 14px;border-radius:999px}
.url{display:inline-block;background:#D52B1E;color:#fff;font-weight:900;border-radius:999px;padding:16px 44px;font-size:44px;letter-spacing:1px}`;
const cardHtml = (d, i) => `<div class="card"><div class="rk">${i + 1}</div><div class="t"><div class="nm">${esc(d.name)}</div><div class="sh">${esc(d.shop)} · ${d.until ? "bis " + dmy(d.until) : "solange Vorrat"}</div></div><div class="pr"><span class="now">${f(d.now, d.cur)}</span><span class="was">${f(d.was, d.cur)}</span></div><span class="off">−${d.off}%</span></div>`;
const fine = s => s.us ? "US-Shops liefern meist nicht in die Schweiz (Einfuhr-MwSt. 8.1 % möglich). Preise in USD vor Steuern." : "Preise Stand " + T.split("-").reverse().join(".") + " · solange Vorrat · Preise können sich ändern.";

const posterHtml = s => `<!doctype html><meta charset=utf-8><style>${BASE}
body{width:1080px;height:1350px;background:#151314;padding:56px;display:flex;flex-direction:column;position:relative}
.bg{position:absolute;right:-260px;top:-300px;width:900px;height:760px;background:#D52B1E;transform:rotate(-14deg)}.bg2{position:absolute;left:-300px;bottom:-420px;width:900px;height:640px;background:#FFD200;transform:rotate(-14deg);opacity:.95}
.in{position:relative;display:flex;flex-direction:column;height:100%}.hd{display:flex;justify-content:space-between;align-items:center}.chip{background:#151314;border:2px solid #FFD200;color:#FFD200;font-weight:900;font-size:26px;padding:8px 18px;border-radius:12px}
h1{font-size:92px;line-height:1;font-weight:900;margin-top:34px;letter-spacing:-1px}h1 em{display:block;color:#FFD200;font-style:normal}.sub{font-size:32px;margin:14px 0 26px;font-weight:600;opacity:.95}
.list{display:flex;flex-direction:column;gap:20px}.ft{margin-top:auto;display:flex;align-items:center;justify-content:space-between;gap:20px}.ft .l{color:#151314;font-size:25px;font-weight:700;max-width:420px;line-height:1.3}.fn{position:absolute;bottom:-34px;left:0;font-size:19px;color:#fff;background:#151314;padding:6px 14px;border-radius:8px}</style>
<div class="bg"></div><div class="bg2"></div><div class="in"><div class="hd"><div class="logo"><div class="cx"></div><b>AKTIONS<i>.CH</i></b></div><div class="chip">${dmy(T)}2026 geprüft</div></div>
<h1>${esc(s.title)}<em>${esc(s.em)}</em></h1><div class="sub">${esc(s.sub)}</div><div class="list">${s.deals.map(cardHtml).join("")}</div>
<div class="ft"><div class="l">Täglich geprüfte Live-Preise.<br>Black Friday: 27.11.2026</div><div class="url">aktions.ch</div></div><div class="fn">${fine(s)} Affiliate-Links.</div></div>`;

const reelHtml = (s, shotFile) => `<!doctype html><meta charset=utf-8><style>${BASE}
body{width:1080px;height:1920px;position:relative;background:#151314}
.bg{position:absolute;left:-300px;top:-420px;width:1500px;height:1100px;background:#D52B1E;transform:rotate(-14deg)}.bg2{position:absolute;right:-420px;bottom:-520px;width:1200px;height:800px;background:#FFD200;transform:rotate(-14deg)}
.top{position:absolute;left:64px;top:90px}.hook{position:absolute;left:64px;right:64px;top:230px}
.hook h1{font-size:104px;line-height:1;font-weight:900;letter-spacing:-1px}.hook h1 em{display:block;color:#FFD200;font-style:normal}.hook p{font-size:38px;font-weight:600;margin-top:16px}
.deals{position:absolute;left:56px;right:56px;top:640px;display:flex;flex-direction:column;gap:30px}.deals .card{padding:26px 30px}.deals .nm{font-size:34px}.deals .now{font-size:46px}
.phone{position:absolute;left:50%;top:420px;width:640px;height:1300px;margin-left:-320px;background:#0b0a0a;border-radius:70px;padding:18px;box-shadow:0 30px 80px #000a}
.scr{width:100%;height:100%;border-radius:54px;overflow:hidden;background:#fff;position:relative}.scr img{width:100%;display:block}
.cap{position:absolute;left:0;right:0;top:1740px;text-align:center}.cap b{font-size:50px;font-weight:900;background:#151314;padding:6px 22px;border-radius:14px}
.end{position:absolute;left:0;right:0;top:700px;text-align:center}.end h2{font-size:96px;font-weight:900;line-height:1.05;padding:0 60px}.end h2 em{color:#FFD200;font-style:normal;display:block}.end .url{margin-top:50px;font-size:76px;padding:26px 70px}.end p{font-size:38px;font-weight:600;margin-top:40px}
.fn{position:absolute;left:50px;right:50px;bottom:40px;text-align:center;font-size:22px;color:#fff;background:#151314;border-radius:12px;padding:10px 16px}</style>
<div class="bg" id="bg"></div><div class="bg2"></div>
<div class="top logo" id="top"><div class="cx"></div><b>AKTIONS<i>.CH</i></b></div>
<div class="hook" id="hook"><h1>${esc(s.title)}<em>${esc(s.em)}</em></h1><p>${esc(s.sub)}</p></div>
<div class="deals" id="deals">${s.deals.map(cardHtml).join("")}</div>
<div class="phone" id="phone"><div class="scr"><img id="shot" src="${shotFile}"></div></div><div class="cap" id="cap"><b>Alle Deals live auf aktions.ch</b></div>
<div class="end" id="end"><h2>Jeden Tag<em>neu geprüft.</em></h2><div class="url">aktions.ch</div><p>Black Friday: 27.11.2026</p></div>
<div class="fn">${fine(s)} Affiliate-Links.</div>
<script>
const ease={out:"cubic-bezier(.16,1,.3,1)",io:"ease-in-out",pop:"cubic-bezier(.34,1.56,.64,1)"};
const A=[];const add=(el,kf,start,dur,easing,out)=>{const a=el.animate(kf,{duration:dur*1000,delay:start*1000,fill:out?"forwards":"both",easing:easing||ease.out});a.pause();A.push(a)};
const $=id=>document.getElementById(id);
add($("top"),[{opacity:0,transform:"translateY(-30px)"},{opacity:1,transform:"none"}],0,.6);
add($("hook"),[{opacity:0,transform:"translateY(60px)"},{opacity:1,transform:"none"}],.2,.8);
add($("hook"),[{opacity:1,transform:"none"},{opacity:0,transform:"translateY(-40px)"}],6.6,.5,ease.io,1);
const cards=[...document.querySelectorAll("#deals .card")];
cards.forEach((c,i)=>{add(c,[{opacity:0,transform:"translateX(180px) scale(.9)"},{opacity:1,transform:"none"}],1.3+i*.9,.55,ease.pop);add(c,[{opacity:1,transform:"none"},{opacity:0,transform:"translateX(-200px)"}],7.2+i*.05,.5,ease.io,1)});
add($("phone"),[{opacity:0,transform:"translateY(900px) rotate(4deg)"},{opacity:1,transform:"none"}],7.6,.9);
add($("phone"),[{opacity:1,transform:"none"},{opacity:0,transform:"translateY(-100px) scale(.9)"}],11.4,.5,ease.io,1);
add($("shot"),[{transform:"translateY(0)"},{transform:"translateY(-420px)"}],8.3,3,ease.io);
add($("cap"),[{opacity:0,transform:"translateY(40px)"},{opacity:1,transform:"none"}],8.6,.6);
add($("cap"),[{opacity:1},{opacity:0}],11.3,.4,ease.io,1);
add($("end"),[{opacity:0,transform:"scale(.85)"},{opacity:1,transform:"none"}],11.8,.7,ease.pop);
window.seek=t=>{A.forEach(a=>a.currentTime=t*1000)};
</script>`;

/* ---- site screenshots (real website) ---- */
async function siteShots(browser) {
  try { await fetch("http://localhost:4174/"); } catch { spawn("npx", ["vite", "preview", "--port", "4174"], { stdio: "ignore", detached: true }).unref(); await new Promise(r => setTimeout(r, 4000)); }
  const ctx = await browser.newContext({ viewport: { width: 390, height: 1500 }, deviceScaleFactor: 2, colorScheme: "light" });
  await ctx.addInitScript(([t]) => { try { localStorage.setItem("bf-consent", JSON.stringify({ v: "2026-11-13", a: false, t: "x" })); localStorage.setItem("bf26-topbanner", t); } catch (e) {} }, [T]);
  const pg = await ctx.newPage(); const files = {};
  for (const [k, hash] of [["live", "live"], ["best", "best"], ["categories", "categories"], ["us", "us"], ["live2", "live"]]) {
    await pg.goto("http://localhost:4174/#" + hash); await pg.reload(); await pg.waitForTimeout(900);
    await pg.evaluate(() => { document.querySelectorAll(".cb,.dotd,#toast").forEach(e => e.remove()); window.scrollTo(0, 0); });
    if (k === "live2") await pg.evaluate(() => window.scrollTo(0, 700));
    const fn = `${out}/assets/site-${k}.png`; await pg.screenshot({ path: fn, clip: { x: 0, y: 0, width: 390, height: 1100 } }); files[k] = path.resolve(fn);
  }
  await ctx.close(); return files;
}

const browser = await chromium.launch();
const shots = await siteShots(browser);
const cap = [];
const tasks = SETS.map(async s => {
  const pg = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
  await pg.setContent(posterHtml(s)); await pg.waitForTimeout(300);
  await pg.screenshot({ path: `${out}/poster-${s.id}-1080x1350.png` }); await pg.close();
  const rp = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  fs.writeFileSync(`${out}/assets/reel-${s.id}.html`, reelHtml(s, "site-" + s.shot + ".png"));
  await rp.goto("file://" + path.resolve(`${out}/assets/reel-${s.id}.html`)); await rp.waitForTimeout(400);
  const FPS = 25, DUR = 13.6, dir = `${out}/assets/frames-${s.id}`; fs.mkdirSync(dir, { recursive: true });
  for (let i = 0; i < FPS * DUR; i++) { await rp.evaluate(t => window.seek(t), i / FPS); await rp.screenshot({ path: `${dir}/f${String(i).padStart(4, "0")}.jpg`, type: "jpeg", quality: 90 }); }
  await rp.close();
  execSync(`ffmpeg -y -loglevel error -framerate ${FPS} -i ${dir}/f%04d.jpg -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p -movflags +faststart ${out}/reel-${s.id}-1080x1920.mp4`);
  fs.rmSync(dir, { recursive: true, force: true });
  console.log("done", s.id);
});
await Promise.all(tasks); await browser.close();
const md = ["# Campaign " + T + "\nPosters: poster-*.png (1080x1350). Reels: reel-*.mp4 (1080x1920). Prices checked " + T + "; copy below is DE, EN under it.\n"];
for (const s of SETS) {
  const lines = s.deals.map((d, i) => `${i + 1}. ${d.name}: ${f(d.now, d.cur)} (statt ${f(d.was, d.cur)}, −${d.off}%) · ${d.shop}`).join("\n");
  md.push(`## ${s.id}\n**DE**\n🔥 ${s.title} ${s.em} (geprüft ${dmy(T)})\n\n${lines}\n\nAlle Live-Deals: aktions.ch (Link in Bio)\n${s.us ? "Hinweis: US-Shops liefern meist nicht in die Schweiz.\n" : ""}Mit Affiliate-Links. Preise können sich ändern.\n#BlackFriday #Schweiz #Deals #Angebote #aktionsch\n\n**EN**\n🔥 Live Swiss deals checked ${T}: ${s.deals.slice(0, 3).map(d => d.name + " " + f(d.now, d.cur)).join(" · ")} … all at aktions.ch (link in bio). Affiliate links; prices can change.\n`);
}
fs.writeFileSync(`${out}/CAPTIONS.md`, md.join("\n"));
console.log("sets:", SETS.map(s => s.id + "(" + s.deals.length + ")").join(", "));
