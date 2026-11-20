import "./styles.css";
import { affLink } from "./config/affiliates.js";
import { PARTNER_LINKS } from "./config/partners.js";
import { SHOPS } from "./config/shops.js";
import { WINTER_TYRES } from "./data/winter-tyres.js";
import { SHOPINFO } from "./data/retailers.js";
import { DEALS, isTyre } from "./data/products.js";
import { US_RAW, US_SHOPINFO } from "./data/us.js";
import CAT_US from "./data/catalogue-us.js";
import { AWIN_TYRES, AWIN_SHOP } from "./data/awin-picks.js";
import { LIVE_CH, SHOWCASES } from "./data/live-ch.js";
import { EVENTS, FAQ as FAQ_EN, FAQ_I18N } from "./data/calendar.js";
import { fmt, esc, ext } from "./lib/format.js";
import { thumb } from "./lib/thumb.js";
import { ENABLED } from "./config/backend.js";
import { initConsent, getConsent, onConsent } from "./lib/consent.js";
import { track } from "./lib/track.js";
import { initAuth, pullWatch, pushWatch, user as authUser } from "./lib/auth.js";
import { initAccountUi } from "./lib/account-ui.js";
import { STRINGS, detectLang, LANG_PATHS } from "./i18n.js";
import * as INT from "./interest.js";
import { artFor } from "./lib/art.js";

/* ---------------- i18n ---------------- */
const PAGE = (() => { try { const d = document.documentElement.dataset.page; return d ? JSON.parse(d) : null; } catch (e) { return null; } })();
const LANG = (PAGE?.lang) || detectLang();
const S = STRINGS[LANG] || STRINGS.en;
const T = key => S[key] ?? STRINGS.en[key] ?? key;
const FAQ = FAQ_I18N[LANG] || FAQ_EN;

/* Language switcher paths (for SEO pages that have equivalents) */
function buildLangSwitcher() {
  const path = location.pathname;
  // Find the matching paths map — walk LANG_PATHS keys for a match
  const map = LANG_PATHS[path];
  if (!map) return ""; // root or unknown: always map to homepage variants
  const langs = ["en", "de", "fr", "it"];
  const labels = { en: "EN", de: "DE", fr: "FR", it: "IT" };
  return langs.map(l => {
    const href = (map[l]) || (LANG_PATHS["/"] || {})[l] || "/";
    const cur = l === LANG;
    return `<a class="lang-sw${cur ? " cur" : ""}" href="${href}" hreflang="${l}"${cur ? ' aria-current="true"' : ""}>${labels[l]}</a>`;
  }).join("");
}

/* ---------------- data model ---------------- */
const WINTER = "Winter tyres";
const slug = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

// Swiss products: tyres move into "Winter tyres" and link to reifen-online.ch
DEALS.forEach(d => { if (!d.top && isTyre(d.name)) { d.cat = WINTER; d.shops = ["reifenonline"]; } });
WINTER_TYRES.forEach(([t, n, s]) => {
  if (DEALS.some(d => d.name === n)) return;
  DEALS.push({ rank: DEALS.length + 1, top: false, cat: WINTER, name: n, spec: `${t} tyre · ${s}`, now: null, bw25: null, low: null, lowAt: null,
    best: null, status: "live", save: 0, show: null, q: n, note: "Pick your size at reifen-online.ch; delivery across Switzerland, often to a fitting garage.", shops: ["reifenonline"] });
});
const IDS = new Map(); // same slug for different products (e.g. "Galaxy S26" / "Galaxy S26+") → -2, -3, …
const uid = b => { const n = (IDS.get(b) || 0) + 1; IDS.set(b, n); return n > 1 ? `${b}-${n}` : b; };
DEALS.forEach(d => { d.region = "ch"; d.cur = "CHF"; d.id = uid("ch-" + slug(d.name)); d.pick = d.top && d.status === "buy"; });

// US products: live 2026 deal price vs regular price, in USD
const plusDays = (iso, n) => { const t = new Date(iso + "T12:00:00Z"); t.setUTCDate(t.getUTCDate() + n); return t.toISOString().slice(0, 10); };
const TODAY = new Date().toISOString().slice(0, 10);
const usId = name => uid("us-" + slug(name));
const US = US_RAW.filter(r => r[7] ? r[7] >= TODAY : (r[8] ? plusDays(r[8], 3) >= TODAY : false)).map(([cat, name, spec, bf, reg, retailer, q, until, checked, extra], i) => {
  const others = ["amazoncom", "bestbuy", "walmart", "target"].filter(s => s !== retailer);
  return { region: "us", cur: "USD", id: usId(name), rank: i + 1, top: false, cat, name, spec, q,
    now: null, bw25: bf, reg, low: null, lowAt: null, best: { p: bf, where: "Live deal" }, show: bf,
    save: reg - bf, off: Math.round((1 - bf / reg) * 100), status: "live", note: extra?.note || null, pick: (1 - bf / reg) >= 0.35,
    until: until || null, checked: checked || null, src: extra?.src || [], shop: retailer, url: extra?.url || null,
    shops: [retailer, ...others.slice(0, 2)] };
});
// Product lines without a price: shops to compare, no invented prices
const LINE_SHOPS = {
  us: { def: ["amazoncom", "walmart", "target"], TV: ["amazoncom", "bestbuy", "walmart"], Computers: ["amazoncom", "bestbuy", "walmart"], Phones: ["amazoncom", "bestbuy", "walmart"], Tablets: ["amazoncom", "bestbuy", "target"], Audio: ["amazoncom", "bestbuy", "target"], Gaming: ["amazoncom", "bestbuy", "walmart"], Wearables: ["amazoncom", "bestbuy", "target"], "Smart Home": ["amazoncom", "bestbuy", "walmart"], Cameras: ["amazoncom", "bestbuy", "walmart"], "Video Games": ["amazoncom", "bestbuy", "walmart"] },
  in: { def: ["amazonin", "flipkart", "tatacliq"], "Fashion & Western Wear": ["myntra", "ajio", "amazonin"], "Winter Wear": ["myntra", "ajio", "amazonin"], "Footwear & Sneakers": ["myntra", "ajio", "flipkart"], "Beauty & Skincare": ["nykaa", "amazonin", "tatacliq"], Makeup: ["nykaa", "amazonin", "myntra"], Fragrance: ["nykaa", "amazonin", "ajio"], "Men's Grooming": ["nykaa", "amazonin", "flipkart"], Smartphones: ["amazonin", "flipkart", "croma"], "Earbuds & Audio": ["amazonin", "flipkart", "croma"], Smartwatches: ["amazonin", "flipkart", "croma"], "Laptops & Gaming": ["amazonin", "flipkart", "reliancedigital"], "Kitchen Appliances": ["amazonin", "flipkart", "croma"], "Home & Decor": ["amazonin", "flipkart", "tatacliq"], "Healthy Foods & Nutrition": ["amazonin", "flipkart", "tatacliq"] }
};
const LINES = (rows, region, cur) => rows.map(([cat, name, spec], i) => ({ region, cur, id: uid(region + "l-" + slug(name + " " + cat)), rank: 1000 + i, top: false, cat, name, spec: spec || "", q: name,
  now: null, reg: null, low: null, best: null, show: null, off: null, save: 0, status: "check", pick: false, line: true, shops: (LINE_SHOPS[region][cat] || LINE_SHOPS[region].def).slice() }));
const US_LINES = LINES(CAT_US, "us", "USD");
// Live Swiss deals: shown from `from` until `until` (or 3 days after the check date), then dropped automatically
const LIVE = LIVE_CH.filter(r => (!r.from || r.from <= TODAY) && TODAY <= (r.until || plusDays(r.checked, 3))).map((r, i) => {
  const off = r.price != null && r.was ? Math.round((1 - r.price / r.was) * 100) : (r.percent || null);
  return { region: "live", cur: r.cur || "CHF", id: uid("live-" + slug(r.shop + " " + r.name)), rank: i + 1, top: false, cat: r.cat, name: r.name, spec: r.spec || "",
    q: r.q || r.name, now: r.price ?? null, reg: r.was ?? null, low: null, best: null, show: r.price ?? null, off, save: r.was && r.price != null ? r.was - r.price : 0,
    status: "live", img: r.img || null, note: r.note || null, rating: r.rating || null, reviews: r.reviews || null, pick: (off || 0) >= 30, shops: [r.shop], shop: r.shop, url: r.url || null, until: r.until || null, from: r.from || null,
    checked: r.checked, code: r.code || null, percent: r.percent || null, type: r.type || null, src: r.src || [] };
});
// Most valuable live deals: at least 25 % off, ranked by the amount saved (EUR converted at an approximate rate, for ranking only)
const EUR_CHF = 0.94;
const chfSave = d => (d.save || 0) * (d.cur === "EUR" ? EUR_CHF : 1);
const BEST = LIVE.filter(d => d.show != null && d.reg && d.off >= 25).sort((a, b) => chfSave(b) - chfSave(a)).slice(0, 24);
BEST.forEach((d, i) => { d.bestRank = i + 1; });
/* Buy score (0–100): how likely a shopper is to buy this deal. A transparent heuristic, not measured conversion data:
   discount depth 35 · CHF saved (log) 15 · impulse-friendly price 15 · category demand 10 · known brand 10 · delivery/trust 10 · urgency 5. */
const HOT_CAT = { Phones: 10, TV: 10, Audio: 9, Gaming: 10, Appliances: 8, Coffee: 9, "Robot vacuums": 9, Computers: 8, Tablets: 8, Wearables: 8, Kitchen: 7, Fashion: 8, Shoes: 8, Sport: 7, Beauty: 8, Toys: 8, "Smart Home": 7, Telecom: 6, Home: 6, Furniture: 5 };
const BRANDS = /\b(apple|iphone|ipad|macbook|airpods|samsung|galaxy|sony|playstation|ps5|nintendo|xbox|lg|philips|dyson|nespresso|de'?longhi|bosch|miele|siemens|lego|bose|jbl|garmin|nike|adidas|on running|\bon\b|lenovo|hp|dell|logitech|sonos|roborock|irobot|braun|oral-b|ninja|k[aä]rcher|ikea|north face|levi|asics|puma|hugo boss|google|pixel|xiaomi|dji|gopro|canon|nikon|fitbit|kindle)\b/i;
const TRUST = { galaxus: 10, digitec: 10, brack: 10, fust: 10, mediamarkt: 10, interdiscount: 10, manor: 10, ikea: 10, pfister: 9, zalando: 10, decathlon: 9, coop: 9, daydeal: 7, blickdeal: 6, lenovo: 8, sonos: 9, amazon: 6 };
function buyScore(d) {
  if (d.show == null || !d.off) return d.percent ? Math.min(60, 20 + d.percent / 2) : 25;
  const chf = (d.save || 0) * (d.cur === "EUR" ? 0.94 : d.cur === "USD" ? 0.8 : 1), p = d.show * (d.cur === "EUR" ? 0.94 : d.cur === "USD" ? 0.8 : 1);
  const depth = Math.min(d.off, 50) / 50 * 35;
  const saved = Math.min(15, Math.log10(1 + chf) / Math.log10(1 + 500) * 15);
  const price = p <= 30 ? 15 : p <= 150 ? 13 : p <= 400 ? 10 : p <= 900 ? 7 : p <= 1800 ? 4 : 2;
  const cat = HOT_CAT[d.cat] ?? 5, brand = BRANDS.test(d.name) ? 10 : 3;
  const trust = d.region === "us" ? 3 : (TRUST[d.shop] ?? 6);
  const days = d.until ? (new Date(d.until + "T12:00:00Z") - Date.now()) / 864e5 : 99;
  const urg = days <= 3 ? 5 : days <= 7 ? 3 : 0;
  // social proof (Amazon rows carry rating + review count): up to +8
  const proof = d.rating && d.reviews ? Math.min(8, Math.max(0, (d.rating - 3.5) / 1.5) * Math.min(1, Math.log10(1 + d.reviews) / 3.5) * 8) : 0;
  return Math.round(Math.min(100, depth + saved + price + cat + brand + trust + urg + proof));
}
[...LIVE, ...US].forEach(d => { d.buy = buyScore(d); });
// The 25 hottest Galaxus/Digitec deals: best buy score among rows re-verified in the last 2 days (not listing-only rows), max 4 per category so the set is mixed
const HOT = new Set();
{
  const cut = new Date(Date.now() - 2 * 864e5).toISOString().slice(0, 10), per = {};
  for (const d of LIVE.filter(x => (x.shop === "galaxus" || x.shop === "digitec") && x.checked >= cut && !/sale listing/.test(x.note || "") && x.off >= 15).sort((a, b) => b.buy - a.buy)) {
    if (HOT.size >= 25) break;
    if ((per[d.cat] = (per[d.cat] || 0) + 1) > 4) continue;
    HOT.add(d.id);
  }
}
// "Recommended" order: buy-score ranked deals with Amazon (affiliate) deals and the hot Galaxus/Digitec picks woven in: 2 regular, 1 Amazon, 1 hot pick, repeat
function mixRecommended(l) {
  const bs = d => (d.buy ?? 0) + Math.min(18, INT.score(d) * 1.5);
  const by = (a, b) => bs(b) - bs(a) || (b.off || 0) - (a.off || 0);
  const amz = l.filter(d => d.shop === "amazon").sort(by), hot = l.filter(d => HOT.has(d.id)).sort(by);
  const used = new Set([...amz, ...hot].map(d => d.id)), rest = l.filter(d => !used.has(d.id)).sort(by);
  const out = [], q = [[rest, 2], [amz, 1], [hot, 1]];
  while (out.length < l.length) { let moved = false; for (const [a, n] of q) for (let i = 0; i < n && a.length; i++) { out.push(a.shift()); moved = true; } if (!moved) break; }
  return out;
}
// Only discounted / deal items are shown: verified live CH deals + priced US deals. The old Top-100 tracker, the undiscounted catalogue and price-less lines are no longer listed.
const ALL = LIVE.concat(US);
const BY_ID = new Map(ALL.map(d => [d.id, d]));

/* Price memory: each visit stores today's prices. A visit more than 6 h after the last one compares against it,
   so cards can show "↓ CHF x since your last visit" and "New". Stored only in this browser. */
const MEM = (() => {
  const key = "bf26-mem", now = Date.now(), snap = {};
  ALL.forEach(d => { if (d.show != null) snap[d.id] = d.show; });
  let m = {}; try { m = JSON.parse(localStorage.getItem(key) || "{}") || {}; } catch (e) {}
  if (!m.cur || !m.cur.p) m = { cur: { t: now, p: snap } };
  else if (now - m.cur.t > 6 * 36e5) m = { base: m.cur, cur: { t: now, p: snap } };
  else m.cur.p = snap;
  try { localStorage.setItem(key, JSON.stringify(m)); } catch (e) {}
  const base = m.base;
  if (base && base.p) ALL.forEach(d => {
    const old = base.p[d.id];
    if (d.show == null) return;
    if (old == null) d.isNew = true;
    else if (d.show < old - 0.004) { d.drop = +(old - d.show).toFixed(2); d.was0 = old; }
  });
  return base || null;
})();
const POOLS = {
  live: LIVE.concat(US),
  best: BEST,
  top: [],
  categories: [],
  us: US
};
const CAT_ORDER = cats => [...new Set(cats)].sort((a, b) => a === WINTER ? -1 : b === WINTER ? 1 : a.localeCompare(b));
const LABEL = { buy: T("statusBuy"), wait: T("statusWaitS"), track: T("statusTrack"), check: T("statusCheck"), live: T("statusLive"), lastyear: T("statusLY"), early: T("statusEarly") };

/* ---------------- state ---------------- */
const PRODUCT_TABS = ["live", "list"];
const TABS = [...PRODUCT_TABS, "tyres", "sodeal", "calendar", "retailers", "guide"];
// Old tabs now live inside the Live deals page as filter presets
const LEGACY = { top: {}, categories: {}, best: { minOff: 25, sort: "save" }, us: { region: "us" } };
const defaults = { tab: "live", cat: "All", q: "", status: "all", sort: "rank", store: "all", price: "all", region: "all", minOff: 0, type: "all", page: 0, drops: false };
let state = { ...defaults, watch: [], theme: "" };
try { Object.assign(state, JSON.parse(localStorage.getItem("bf26v5") || "{}")); } catch (e) {}
state.watch = Array.isArray(state.watch) ? state.watch.filter(id => BY_ID.has(id)) : [];
if (!MEM) state.drops = false;
if (!TABS.includes(state.tab)) state.tab = "live";
state.minOff = +state.minOff || 0; state.status = "all";
const save = () => { try { localStorage.setItem("bf26v5", JSON.stringify(state)); } catch (e) {} };
const $ = id => document.getElementById(id);
const mobile = () => matchMedia("(max-width: 760px), (max-height: 560px)").matches;
let perPage = 12, mobileShown = 12, deskShown = 0, deskTotal = 0, gridSig = "";

/* ---------------- helpers ---------------- */
const money = (n, cur) => cur === "EUR" ? "€ " + n.toLocaleString("de-CH", { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 }) : cur === "INR" ? "₹" + n.toLocaleString("en-IN") : cur === "USD" ? "$" + (Number.isInteger(n) ? n.toLocaleString("en-US") : n.toLocaleString("en-US", { minimumFractionDigits: 2 })) : "CHF " + fmt(n);
const heartSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-9-8.7C1.5 7.8 4 4.5 7.3 4.5c2 0 3.5 1.1 4.7 2.7 1.2-1.6 2.7-2.7 4.7-2.7 3.3 0 5.8 3.3 4.3 6.8-2 4.3-9 8.7-9 8.7z"/></svg>';
const watched = d => state.watch.includes(d.id);
const waSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-2.9-.4-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.6-.3z"/></svg>';
// WhatsApp share link for one deal: name, price, discount, shop and a deep link back to this deal on the site
const dealWa = d => {
  const shop = d.shop && SHOPS[d.shop] ? SHOPS[d.shop].name : "";
  const price = d.show != null ? money(d.show, d.cur) + (d.reg ? " (" + T("waWas") + " " + money(d.reg, d.cur) + (d.off ? ", −" + d.off + "%" : "") + ")" : "") : (d.percent ? "−" + d.percent + "%" : "");
  const txt = "🔥 " + d.name + "\n" + [price, shop].filter(Boolean).join(" · ") + "\n" + location.origin + location.pathname + "#p-" + d.id;
  return "https://wa.me/?text=" + encodeURIComponent(txt);
};
const fmtDay = (iso, full) => new Date(iso + "T12:00:00Z").toLocaleDateString(LANG === "en" ? "en-GB" : LANG + "-CH", { day: "numeric", month: "short", ...(full ? { year: "numeric" } : {}) });
function toast(msg) {
  const t = $("toast"); t.textContent = msg; t.hidden = false;
  clearTimeout(toast.t); toast.t = setTimeout(() => t.hidden = true, 2200);
}
function shopBtn(s, d, primary) {
  const cls = ["shop", primary ? "primary" : ""].filter(Boolean).join(" ");
  const href = (d.region === "live" || d.region === "us" || d.region === "in") && s === d.shop && d.url ? d.url : SHOPS[s] ? SHOPS[s].search(d.q) : d.url;
  if (!href) return "";
  return `<a class="${cls}" href="${affLink(s, href)}" target="_blank" rel="sponsored nofollow noopener"><span class="sn">${SHOPS[s] ? SHOPS[s].name : esc(s)}</span> ${ext}</a>`;
}
function cardShops(d) {
  const s = d.shops.slice(0, 6);
  // Amazon.de first for CH products (affiliate revenue + widest CH-deliverable range)
  if (d.region === "ch" && s.includes("amazon") && s[0] !== "amazon") return ["amazon", ...s.filter(x => x !== "amazon")];
  return s;
}
function inRange(d) {
  if (state.price === "all") return true;
  if (d.show == null) return false;
  const [a, b] = state.price.split("-").map(Number);
  return d.show >= a && d.show < b;
}

/* ---------------- product grid ---------------- */
function pool() {
  if (state.tab === "list") return state.watch.map(id => BY_ID.get(id)).filter(Boolean);
  return POOLS[state.tab] || POOLS.top;
}
function list() {
  const term = state.q.trim().toLowerCase();
  const global = term && state.tab !== "list";
  const l = (global || state.drops ? ALL : pool()).filter(d =>
    (global || state.drops || state.cat === "All" || d.cat === state.cat || state.tab === "list") &&
    (state.status === "all" || d.status === state.status) &&
    (state.store === "all" || d.shops.includes(state.store)) &&
    (state.region === "all" || (state.region === "us") === (d.region === "us")) &&
    (!state.minOff || (d.off || 0) >= state.minOff) &&
    (state.type === "all" || d.type === state.type) &&
    inRange(d) &&
    (!state.drops || d.drop || d.isNew) &&
    (!term || (d.name + " " + d.spec + " " + d.cat).toLowerCase().includes(term)));
  const by = {
    buy: (a, b) => (b.buy ?? 0) - (a.buy ?? 0) || (b.off || 0) - (a.off || 0),
    rank: state.tab === "best" && !term ? (a, b) => a.bestRank - b.bestRank : (a, b) => (a.region === b.region ? a.rank - b.rank : a.region === "ch" ? -1 : 1),
    save: (a, b) => (b.off ?? (b.now ? b.save / b.now * 100 : 0)) - (a.off ?? (a.now ? a.save / a.now * 100 : 0)) || a.rank - b.rank,
    low: (a, b) => (a.show ?? 1e9) - (b.show ?? 1e9) || a.rank - b.rank,
    high: (a, b) => (b.show ?? -1) - (a.show ?? -1) || a.rank - b.rank,
    az: (a, b) => a.name.localeCompare(b.name),
    ends: (a, b) => (a.until || "9999").localeCompare(b.until || "9999") || (b.off || 0) - (a.off || 0)
  };
  if (state.sort === "rank" && state.tab === "live" && !term) return mixRecommended(l);
  return l.sort(by[state.sort] || by.rank);
}
function priceLine(d) {
  if (d.region === "live") {
    const until = d.until ? `<span class="until">${S.untilLabel(fmtDay(d.until))}</span>` : "";
    if (d.show == null) return `<span class="price">${d.percent ? "−" + d.percent + "%" : esc(d.type || T("statusLive"))}</span>${d.code ? `<span class="code">${T("codeLabel")} <b>${esc(d.code)}</b></span>` : ""}${until}`;
    return `<span class="price">${money(d.show, d.cur)}</span>${d.reg ? `<span class="was">${money(d.reg, d.cur)}</span>` : ""}${until}`;
  }
  if (d.show == null) return `<span class="price live">${d.status === "live" ? T("statusLive") : T("statusCheck")}</span>`;
  let extra = "";
  if (d.region === "us" || d.region === "in") extra = `<span class="was">${money(d.reg, d.cur)}</span>`;
  else if (d.best && d.now != null && d.best.p < d.now) extra = `<span class="best" title="${esc(d.best.where || "")}"><span class="lo">${T("lowLabel")} ${fmt(d.best.p)}</span> <b>−${Math.round((d.now - d.best.p) / d.now * 100)}%</b></span>`;
  else if (d.now == null && d.best) extra = `<span class="best">${esc(d.best.where)}</span>`;
  const drop = d.drop ? `<span class="drop" title="${esc(S.dropTitle(money(d.was0, d.cur)))}">↓ ${money(d.drop, d.cur)}</span>` : "";
  return `<span class="price">${money(d.show, d.cur)}</span>${drop}${extra}`;
}
/* Category identity: emoji + hue per category so shoppers recognise the kind of deal at a glance */
const CATUI = { TV: ["📺", 215], "Robot vacuums": ["🤖", 170], Cameras: ["📷", 265], Kitchen: ["🍳", 25], Home: ["🏠", 35], Beauty: ["💄", 330], "Mobile Plans & Internet": ["📶", 200], Telecom: ["📶", 200], Wearables: ["⌚", 185], Monitors: ["🖥️", 230], Computers: ["💻", 225], "PC Components": ["🧩", 240], Gaming: ["🎮", 285], Sports: ["🏃", 140], Sport: ["🏃", 140], Audio: ["🎧", 255], Appliances: ["🧺", 195], Coffee: ["☕", 20], Phones: ["📱", 205], Tablets: ["📲", 210], "Smart Home": ["💡", 50], Fashion: ["👗", 345], "Personal Care": ["🧴", 320], Accessories: ["👜", 300], Car: ["🚗", 5], LEGO: ["🧱", 55], "Baby & Kids": ["🧸", 40], Baby: ["🧸", 40], "Tools & DIY": ["🔧", 30], Tools: ["🔧", 30], Furniture: ["🛋️", 28], Pets: ["🐾", 120], Toys: ["🎲", 48], Shoes: ["👟", 355], "Bikes & E-mobility": ["🚲", 150], Networking: ["🌐", 215], Garden: ["🌿", 130], Health: ["❤️‍🩹", 350], Printers: ["🖨️", 235], Outdoor: ["⛺", 110], Travel: ["✈️", 195], Books: ["📚", 25], Food: ["🍽️", 15] };
const catUI = c => CATUI[c] || ["🏷️", [...String(c)].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) % 360, 7)];
const fmtN0 = n => n >= 100 ? Math.round(n).toLocaleString("de-CH") : n.toFixed(2);
function card(d) {
  const badge = d.off ? `<span class="off${d.off > 70 ? " mega" : ""}">−${d.off}%</span>` : d.pick ? `<span class="off pick">Pick</span>` : "";
  const [cI, cH] = catUI(d.cat);
  return `<article class="card${d.pick ? " is-pick" : ""}" style="--cc:${cH}">
    <div class="tw">${thumb(d)}${badge}<button class="heart${watched(d) ? " on" : ""}" type="button" data-w="${d.id}" aria-pressed="${watched(d)}" aria-label="Save ${esc(d.name)} to My list">${heartSvg}</button><a class="wa" data-wa="${d.id}" href="${dealWa(d)}" target="_blank" rel="noopener" aria-label="${esc(T("waShare"))}: ${esc(d.name)}" title="${esc(T("waShare"))}">${waSvg}</a></div>
    <div class="body">
      <div class="top"><span class="r">${d.top ? `#<b>${d.rank}</b>`  : ""}</span><span class="c"><i aria-hidden="true">${cI}</i>${esc(d.cat)}</span>${d.buy != null && d.buy >= 75 ? `<span class="pill buy">👍 ${T("likesPill")}</span>` : ""}${d.isNew ? `<span class="pill new">${T("newBadge")}</span>` : ""}<span class="pill ${d.status}">${d.region === "live" ? esc(SHOPS[d.shop] ? SHOPS[d.shop].name : d.shop) : LABEL[d.status]}</span></div>
      <button class="name" type="button" data-d="${d.id}">${esc(d.name)}</button>
      <div class="priceline">${priceLine(d)}</div>${d.reg && d.show != null && d.reg > d.show && d.cur === "CHF" ? `<span class="save">${T("saveAmt").replace("{x}", fmtN0(d.reg - d.show))}</span>` : ""}
      <div class="btns">${(() => { const all = cardShops(d), vis = all.slice(0, 2), more = all.length - vis.length;
        return vis.map((s, k) => shopBtn(s, d, k === 0)).join("") + `<button class="shop ghost info" type="button" data-d="${d.id}" aria-label="${T("allSellers")}: ${esc(d.name)}">${more > 0 ? "+" + more : "i"}</button>`; })()}</div>
    </div></article>`;
}
function fit() {
  const g = $("grid");
  if (!g) return;
  const gap = 10;
  const mob = mobile();

  // Width: panel always has correct width from the outer CSS grid
  const panel = g.closest(".panel") || g.parentElement;
  const vw = (panel ? panel.clientWidth : 0) || window.innerWidth || 900;

  // Viewport height: use visualViewport to handle mobile browser chrome
  const vh = (window.visualViewport ? window.visualViewport.height : 0) || window.innerHeight || 800;

  // Column count from width breakpoints
  let targetCols;
  // aim for cards of at least ~310px so names, prices and buttons never truncate
  targetCols = Math.max(1, Math.min(8, Math.floor((vw + gap) / (310 + gap))));

  // Card width: fill available width with gap between columns
  const cardW = Math.max(160, Math.floor((vw - gap * (targetCols - 1)) / targetCols));

  // Card height: aspect ratio ~2:1, clamped for readability
  const cardH = vh < 760 ? 156 : vh > 1200 ? 184 : 168;

  // On mobile: infinite scroll, perPage not used for layout — use generous default
  if (mob) {
    const root = document.documentElement;
    root.style.setProperty("--card-w", cardW + "px");
    root.style.setProperty("--card-h", cardH + "px");
    root.style.setProperty("--gap", gap + "px");
    g.style.setProperty("--cols", targetCols);
    g.style.maxHeight = "";
    perPage = targetCols * 6;
    return;
  }

  // Desktop: measure actual chrome heights from DOM for precise row calculation
  const barEl = document.querySelector(".bar");
  const pageheadEl = document.querySelector(".pagehead");
  const tabsEl = document.querySelector(".tabs");
  const headEl = panel ? panel.querySelector(".head") : null;
  const pagerEl = $("pager");
  const featEl = $("featured"); if (featEl) featEl.classList.remove("squeezed");

  const barH = barEl ? barEl.offsetHeight : 52;
  const pageheadH = (pageheadEl && !pageheadEl.hidden) ? pageheadEl.offsetHeight : 0;
  const tabsH = (tabsEl && getComputedStyle(tabsEl).display !== "none") ? tabsEl.offsetHeight : 0;
  const headH = headEl ? headEl.offsetHeight : 0;
  const featH = (featEl && !featEl.hidden && getComputedStyle(featEl).display !== "none") ? featEl.offsetHeight + 10 : 0;
  const pagerH = (pagerEl && !pagerEl.hidden) ? pagerEl.offsetHeight + 8 : 0;
  const panelPad = 36; // padding-block sum for desktop

  // Available height for the grid
  const availH = Math.max(cardH + gap, vh - barH - pageheadH - tabsH - headH - featH - pagerH - panelPad);
  let rows = Math.floor((availH + gap) / (cardH + gap));
  if (rows < 2 && featH) { // not enough height for two card rows plus the featured strip: tuck the strip away, keep the grid whole
    featEl.classList.add("squeezed");
    rows = Math.floor((availH + featH + gap) / (cardH + gap));
  }
  rows = Math.max(2, rows);

  // Apply CSS custom properties
  const root = document.documentElement;
  root.style.setProperty("--card-w", cardW + "px");
  root.style.setProperty("--card-h", cardH + "px");
  root.style.setProperty("--gap", gap + "px");
  g.style.setProperty("--cols", targetCols);

  perPage = targetCols * rows;
  g.style.maxHeight = "";
}
function emptyState() {
  if (state.tab === "list" && !state.watch.length)
    return `<div class="empty"><b>${T("emptyList")}</b>${T("emptyListSub")}</div>`;
  return `<div class="empty"><b>${T("emptySearch")}</b>${T("emptySearchSub")} <button class="linkbtn" type="button" data-reset>${T("resetFilters")}</button></div>`;
}

/* ---- Sponsored slots: Lyca (Awin) + top-10 Amazon.de by buy score. Only rows verified today/yesterday are used. ---- */
const FRESH = plusDays(TODAY, -1);
const fresh = x => x.checked && x.checked >= FRESH;
const AD_LYCA = (() => {
  const base = LIVE.filter(x => x.shop === "lyca" && fresh(x));
  if (!base.length) return [];
  const tu = base.find(x => /Truly/i.test(x.name)) || base[0], mx = base.find(x => /Max/i.test(x.name)) || base[0];
  return [
    { k: "lyca", t: "Lyca Mobile", h: T("adLy1"), r: tu }, { k: "lyca", t: "Lyca Mobile", h: T("adLy2"), r: mx }, { k: "lyca", t: "Lyca Mobile", h: T("adLy3"), r: tu }
  ];
})();
const AD_AMZ = LIVE.filter(x => x.shop === "amazon" && fresh(x) && x.now != null && x.reg && x.off >= 20 && x.rating >= 4.3 && x.reviews >= 1000).sort((a, b) => b.buy - a.buy).slice(0, 20).map(r => ({ k: "amz", t: "Amazon.de", h: "", r }));
const AD_SHOP = AWIN_SHOP.map(r => ({ k: "shop", t: "SODEAL", h: "", r }));
const adF = n => Number(n).toFixed(2);
function adHTML(a, cls) {
  if (a.k === "shop") {
    const r = a.r;
    return `<a class="adc shop ${cls || ""}" href="${r.url}" target="_blank" rel="sponsored nofollow noopener" data-ad="partner"><img src="${esc(r.img)}" alt="" loading="lazy" decoding="async"><span class="an">${esc(r.name)}</span><span class="ap"><strong>CHF ${adF(r.price)}</strong></span>${r.ship ? `<span class="sh">${T("shipFee").replace("{s}", adF(r.ship))}</span>` : ""}<u>${T("tyreGo")} →</u></a>`;
  }
  if (a.k === "tyre") {
    const r = a.r;
    return `<a class="adc tyre ${cls || ""}" href="${r.url}" target="_blank" rel="sponsored nofollow noopener" data-ad="tyre"><span class="at">${esc(r.m)}.ch · Partner</span><b class="ah">${T("tyreH")} ${esc(r.size)}</b><span class="an">${esc(r.brand + " " + r.model)}</span><span class="ap"><strong>CHF ${adF(r.price)}</strong><i class="pt">${T("tyrePer")}</i></span><u>${T("tyreGo")} →</u></a>`;
  }
  const r = a.r, href = affLink(a.k === "lyca" ? "lyca" : "amazon", r.url);
  const stars = a.k === "amz" ? `<span class="st">★ ${r.rating}</span>` : "";
  return `<a class="adc ${cls || ""} ${a.k}" href="${href}" target="_blank" rel="sponsored nofollow noopener" data-ad="${a.k}">${r.img ? `<img class="pimg" src="${esc(r.img)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.remove()">` : `<span class="aart" aria-hidden="true"><svg viewBox="0 0 64 64">${artFor(a.k === "lyca" ? "Telecom" : r.cat)}</svg></span>`}<span class="at">${a.t}</span>${a.h ? `<b class="ah">${esc(a.h)}</b>` : ""}<span class="an">${esc(r.name.replace(/\(.*?\)/g, "").trim().slice(0, 70))}</span><span class="ap"><strong>CHF ${adF(r.now)}</strong><s>${adF(r.reg)}</s><i class="${r.off > 70 ? "mega" : ""}">−${r.off}%</i></span>${stars}<u>${a.k === "lyca" ? T("lyGo") : T("amzGo")} →</u></a>`;
}
/* mobile: after every 5 deal cards insert an ad, alternating Lyca / Amazon (cycling through the top 10) */
function withInlineAds(cards) {
  const seq = ["lyca", "amz"], idx = { lyca: 0, amz: 0 }, pools = { lyca: AD_LYCA, amz: AD_AMZ };
  if (!seq.some(k => pools[k].length)) return cards;
  const out = []; let n = 0;
  cards.forEach((c, i) => {
    out.push(c);
    if ((i + 1) % 5 === 0) {
      const k = seq[n++ % seq.length], pool = pools[k];
      if (pool.length) out.push(`<article class="card adcard">${adHTML(pool[idx[k]++ % pool.length], "inline t" + (n % 4))}</article>`);
    }
  });
  return out;
}
/* desktop (≥1500px): two side rails. A pinned Lyca ad on top, below it the Amazon.de deals most likely to be bought,
   scrolling slowly and endlessly: left rail top→bottom, right rail bottom→top. Pauses on hover; static with reduced motion. */
(() => {
  if (!AD_LYCA.length && !AD_AMZ.length) return;
  const mk = (side, lyIdx) => {
    const el = document.createElement("aside"); el.className = "rail rail-" + side; el.setAttribute("aria-label", T("lyAd"));
    const base = side === "l" ? AD_AMZ : AD_AMZ.slice().reverse();
    const ly = AD_LYCA.length ? AD_LYCA[lyIdx] : null;
    const pool = ly ? [ly, ...base.slice(0, 4), AD_LYCA[1 - lyIdx] || ly, ...base.slice(4)] : base;
    const one = (a, i, hide) => adHTML(a, "rail-ad t" + (i % 5)).replace("<a ", hide ? '<a tabindex="-1" aria-hidden="true" ' : "<a ");
    el.innerHTML = pool.length ? `<div class="marq"><div class="track" style="--n:${pool.length}">${pool.map((a, i) => one(a, i)).join("")}${pool.map((a, i) => one(a, i, 1)).join("")}</div></div>` : "";
    document.body.appendChild(el);
  };
  mk("l", 0); mk("r", 1);
  document.addEventListener("click", e => { const q = e.target.closest && e.target.closest("[data-tc],[data-sc]"); if (q) INT.bumpKey("x", q.dataset.tc ? "t:" + q.dataset.tc : "s:" + q.dataset.sc, 3); const a = e.target.closest && e.target.closest("[data-ad]"); if (a) track("ad_click", { ad: a.dataset.ad }); });
})();

function renderGrid() {
  const sig = [state.tab, state.q, state.store, state.price, state.status, state.region, state.minOff, state.type, state.drops, state.cat, state.sort].join("|");
  const gridEl = $("grid");
  if (sig !== gridSig) { gridSig = sig; deskShown = 0; mobileShown = 12; window.scrollTo({ top: 0 }); }
  fit();
  const l = list(), m = mobile();
  let vis;
  if (m) {
    vis = l.slice(0, mobileShown);
    $("more-wrap").hidden = l.length <= mobileShown;
    $("info-m").textContent = `${vis.length} of ${l.length.toLocaleString("en-US")}`;
    $("pager").hidden = true;
  } else {
    const want = Math.max(deskShown, perPage * 2);
    vis = l.slice(0, want);
    $("pager").hidden = false; $("more-wrap").hidden = true;
    deskTotal = l.length;
    $("info").textContent = l.length ? `${vis.length.toLocaleString(LANG === "en" ? "en-US" : LANG)} ${T("ofWord")} ${l.length.toLocaleString(LANG === "en" ? "en-US" : LANG)}` : `0 ${T("deals")}`;
    $("pager").style.setProperty("--p", l.length ? Math.round(vis.length / l.length * 100) + "%" : "0%");
  }
  let html = vis.map(card);
  $("grid").innerHTML = vis.length ? (m ? withInlineAds(html) : html).join("") : emptyState();
  $("count").textContent = `${l.length.toLocaleString(LANG === "en" ? "en-US" : LANG)} ${T("deals")}`;
  const filtered = state.region !== "all" || state.minOff > 0 || state.type !== "all" || state.drops || state.q || state.store !== "all" || state.price !== "all" || state.status !== "all" || (state.cat !== "All" && (state.tab === "categories" || state.tab === "top")) || (state.cat !== "All" && (state.tab === "us" || state.tab === "live"));
  $("reset").hidden = !filtered;
}
function renderFilters() {
  const t = state.tab, p = pool();
  const catVis = t === "categories" || t === "us" || t === "live";
  $("catSel").hidden = !catVis;
  if (catVis) {
    const cats = CAT_ORDER(p.map(d => d.cat));
    if (!cats.includes(state.cat)) state.cat = "All";
    const n = c => c === "All" ? p.length : p.filter(d => d.cat === c).length;
    $("catSel").innerHTML = ["All", ...cats].map(c => `<option value="${esc(c)}"${c === state.cat ? " selected" : ""}>${c === "All" ? T("allCats") : esc(c)}${c === WINTER ? " ❄" : ""} (${n(c).toLocaleString(LANG === "en" ? "en-US" : LANG)})</option>`).join("");
  }
  const cc = $("catChips");
  if (cc) {
    cc.hidden = t !== "top";
    if (t === "top") {
      const cats = CAT_ORDER(p.map(d => d.cat));
      if (!cats.includes(state.cat)) state.cat = "All";
      cc.innerHTML = ["All", ...cats].map(c => `<button class="chip" type="button" data-chip="${esc(c)}" aria-pressed="${c === state.cat}">${c === "All" ? T("allCats") : esc(c)}</button>`).join("");
    }
  }
  const stores = [...new Set(p.flatMap(d => d.shops))].filter(s => SHOPS[s]);
  if (state.store !== "all" && !stores.includes(state.store)) state.store = "all";
  $("store").innerHTML = `<option value="all">${T("allShops")}</option>` + stores.sort((a, b) => SHOPS[a].name.localeCompare(SHOPS[b].name)).map(s => `<option value="${s}"${s === state.store ? " selected" : ""}>${SHOPS[s].name}</option>`).join("");
  $("status").hidden = t !== "top";
  const priced = t !== "categories";
  $("price").hidden = !priced;
  if (!priced) state.price = "all";
  if (t !== "top") state.status = "all";
  $("status").value = state.status; $("price").value = state.price; $("sort").value = state.sort;
  $("winterbar").hidden = !(t === "categories" && state.cat === WINTER);
  $("usbar").hidden = !(t === "live" && state.region === "us");
  $("region").innerHTML = [["all", "regionAll"], ["ch", "regionCH"], ["us", "regionUS"]].map(([v, k]) => `<option value="${v}">${T(k)}</option>`).join("");
  $("minoff").innerHTML = `<option value="0">${T("offAny")}</option>` + [10, 20, 30, 50].map(n => `<option value="${n}">${n} ${T("offSuffix")}</option>`).join("");
  $("region").value = state.region; $("minoff").value = String(state.minOff);
  const types = [...new Set(p.map(d => d.type).filter(Boolean))].sort();
  if (state.type !== "all" && !types.includes(state.type)) state.type = "all";
  $("type").innerHTML = `<option value="all">${T("typeAll")}</option>` + types.map(x => `<option value="${esc(x)}"${x === state.type ? " selected" : ""}>${esc(x)}</option>`).join("");
  $("region").hidden = $("minoff").hidden = $("type").hidden = t !== "live";
  $("clear-list").hidden = !(t === "list" && state.watch.length);
  const locN = n => n.toLocaleString(LANG === "en" ? "en-US" : LANG);
  const lead = {
    top: [T("leadTop"), T("leadTopSub")],
    categories: [state.cat === "All" ? T("leadCat") : esc(state.cat), S.leadCatSub(locN(POOLS.categories.length))],
    us: [state.cat === "All" ? T("leadUS") : `US · ${esc(state.cat)}`, T("leadUSSub")],
    best: [T("leadBest"), S.leadBestSub(BEST.length)],
    live: [state.cat === "All" ? T("leadLive") : esc(state.cat), S.leadLiveSub(locN(LIVE.length), fmtDay(LIVE.reduce((m, d) => d.checked > m ? d.checked : m, "") || TODAY))],
    list: [T("leadList"), S.leadListSub(state.watch.length)]
  }[t];
  if (state.q.trim() && t !== "list") { lead[0] = `${T("leadSearchPrefix")}${esc(state.q.trim())}${T("leadSearchSuffix")}`; lead[1] = T("leadSearchSub"); }
  $("lead").innerHTML = lead[0]; $("leadsub").textContent = lead[1];
  const upd = $("pupd"); if (upd) { const latest = LIVE.reduce((m, d) => d.checked > m ? d.checked : m, ""); upd.innerHTML = latest ? T("updatedLabel") + " <b>" + esc(fmtDay(latest, true)) + "</b>" : ""; }
  $("p-products").setAttribute("aria-labelledby", "t-" + t);
}
function updateCounts() {
  const n = state.watch.length;
  $("n-list").textContent = n; $("list-count").textContent = n; $("list-count").hidden = !n;
  $("go-list").setAttribute("aria-label", `My list (${n} saved)`);
  $("b-count").hidden = !n; $("b-count").textContent = n;
}

/* ---------------- tabs ---------------- */
function showTab(t, opts = {}) {
  if (LEGACY[t]) { const m = LEGACY[t]; t = "live"; if (m.minOff) state.minOff = m.minOff; if (m.sort) state.sort = m.sort; state.region = m.region || "all"; if (!m.region) state.store = state.store; }
  if (!TABS.includes(t)) t = "live";
  if (state.tab !== t && !opts.keep) { state.page = 0; mobileShown = 12; if (!opts.cat) state.cat = "All"; }
  if (opts.cat) state.cat = opts.cat;
  state.tab = t; save();
  track("tab", { tab: t });
  TABS.forEach(x => { const b = $("t-" + x); b.setAttribute("aria-selected", x === t); b.tabIndex = x === t ? 0 : -1; });
  document.querySelectorAll(".bottomnav [data-tab]").forEach(b => b.classList.toggle("on", b.dataset.tab === t));
  $("b-more").classList.toggle("on", ["categories", "us", "tyres", "sodeal", "calendar", "retailers", "guide"].includes(t));
  const products = PRODUCT_TABS.includes(t);
  $("p-products").hidden = !products;
  ["tyres", "sodeal", "calendar", "retailers", "guide"].forEach(x => $("p-" + x).hidden = x !== t);
  if (t === "tyres") renderTyres(); if (t === "sodeal") renderSodeal();
  if (products) { renderPulse(); renderFilters(); renderGrid(); }
  if (!opts.noHash) { try { history.replaceState(null, "", "#" + (t === "categories" && state.cat === WINTER ? "winter" : t)); } catch (e) {} }
  $("moresheet").hidden = true;
  if (mobile()) window.scrollTo({ top: 0 });
}

/* ---------------- details pop-up ---------------- */
function chart(d) {
  const pts = [];
  if (d.reg) pts.push(["Regular price", d.reg]);
  if (d.bw25 != null && (d.region === "us" || d.region === "in")) pts.push(["Live deal", d.bw25]);
  if (d.low != null) pts.push(["Record low", d.low]);
  if (d.now != null) pts.push(["Today", d.now]);
  if (pts.length < 2) return "";
  const max = Math.max(...pts.map(p => p[1]));
  const min = Math.min(...pts.map(p => p[1]));
  return `<div class="chart" aria-label="${T("priceHistory")}"><div class="eyebrow">${T("priceHistory")}</div>${pts.map(([l, v]) =>
    `<div class="bar-row"><span>${l}</span><span class="pbar"><i style="width:${Math.max(6, v / max * 100)}%" class="${v === min ? "lo" : ""}"></i></span><b>${money(v, d.cur)}</b></div>`).join("")}</div>`;
}
let opener = null;
function openDetails(d, push = true) {
  INT.bumpDeal(d, 2);
  if ($("modal").hidden) opener = document.activeElement;
  const rows = [];
  if (d.region === "live") {
    if (d.reg) rows.push(`<dt>${T("regularPrice")}</dt><dd>${money(d.reg, d.cur)}</dd>`);
    if (d.off) rows.push(`<dt>${T("saving")}</dt><dd class="target">−${d.off}%</dd>`);
    if (d.code) rows.push(`<dt>${T("codeLabel")}</dt><dd><b>${esc(d.code)}</b></dd>`);
    rows.push(`<dt>${T("validLabel")}</dt><dd>${d.until ? S.untilLabel(fmtDay(d.until)) : T("whileStock")}</dd>`);
    rows.push(`<dt>${T("checkedLabel")}</dt><dd>${fmtDay(d.checked)} · ${d.src.map((u, k) => `<a href="${esc(u)}" target="_blank" rel="noopener nofollow">${T("sourceLabel")} ${k + 1}</a>`).join(", ")}</dd>`);
  } else if ((d.region === "us" || d.region === "in") && !d.line) {
    rows.push(`<dt>${T("statusLive")}</dt><dd>${money(d.bw25, d.cur)}</dd>`, `<dt>${T("regularPrice")}</dt><dd>${money(d.reg, d.cur)}</dd>`, `<dt>${T("saving")}</dt><dd class="target">−${d.off}%</dd>`);
    if (d.until) rows.push(`<dt>${T("validLabel")}</dt><dd>${S.untilLabel(fmtDay(d.until))}</dd>`);
    if (d.checked) rows.push(`<dt>${T("checkedLabel")}</dt><dd>${fmtDay(d.checked)}${d.src.length ? " · " + d.src.map((u, k) => `<a href="${esc(u)}" target="_blank" rel="noopener nofollow">${T("sourceLabel")} ${k + 1}</a>`).join(", ") : ""}</dd>`);
  } else {
    if (d.best && d.status !== "check") rows.push(`<dt>${T("targetPrice")}</dt><dd class="target">CHF ${fmt(d.best.p)}</dd>`);
    if (d.lowAt) rows.push(`<dt>${T("recordLowAt")}</dt><dd>${esc(d.lowAt)}</dd>`);
  }
  if (d.region !== "live") rows.push(`<dt>${T("status")}</dt><dd>${LABEL[d.status]}</dd>`);
  const shops = d.shops.map((s, k) => shopBtn(s, d, k === 0)).join("");
  const hist = d.region === "ch" ? `<a class="shop ghost" href="${affLink("toppreise", SHOPS.toppreise.search(d.q))}" target="_blank" rel="sponsored nofollow noopener">${T("swissPriceHist")} ${ext}</a>` : "";
  $("sheet").innerHTML = `${thumb(d)}<div class="in">
    <button class="close" type="button" id="m-close" aria-label="Close">×</button>
    <div class="eyebrow">${d.top ? `#${d.rank} · ` : ""}${d.region === "us" ? (d.line ? "US · " : "US deal · ") : d.region === "live" ? T("liveEyebrow") + " · " : ""}${esc(d.cat)}</div>
    <h3 id="m-title">${esc(d.name)}</h3><div class="spec">${esc(d.spec)}</div>
    <div class="priceline big">${priceLine(d)}<span class="pill ${d.status}">${LABEL[d.status]}</span></div>
    ${chart(d)}
    <dl>${rows.join("")}</dl>
    ${d.note ? `<p class="note">${esc(d.note)}</p>` : ""}
    <div class="btns wrap">${shops}${hist}</div>
    <div class="actions">
      <a class="act wa-act" data-wa="${d.id}" href="${dealWa(d)}" target="_blank" rel="noopener">${waSvg}<span>${T("waShare")}</span></a>
      <button class="act" type="button" id="m-watch" aria-pressed="${watched(d)}">${heartSvg}<span>${watched(d) ? T("savedToList") : T("saveToList")}</span></button>
      <button class="act" type="button" id="m-share"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 12h.01M4 12a8 8 0 1 0 16 0 8 8 0 0 0-16 0"/><path d="M15 8l-6 4 6 4"/></svg><span>${T("share")}</span></button>
    </div>
  </div>`;
  $("modal").hidden = false; document.body.classList.add("locked"); document.querySelector(".app").inert = true; $("m-close").focus();
  $("m-close").onclick = closeDetails;
  $("m-watch").onclick = () => { toggleWatch(d.id); openDetails(d, false); };
  $("m-share").onclick = () => share(d);
  if (push) { try { history.replaceState(null, "", "#p-" + d.id); } catch (e) {} }
}
function closeDetails() {
  document.querySelector(".app").inert = false;
  if (opener && document.contains(opener)) opener.focus(); opener = null;
  $("modal").hidden = true; document.body.classList.remove("locked");
  try { history.replaceState(null, "", "#" + state.tab); } catch (e) {}
}
async function share(d) {
  const url = location.href.split("#")[0] + "#p-" + d.id;
  const text = `${d.name}${d.show != null ? " – " + money(d.show, d.cur) : ""}`;
  try { if (navigator.share) { await navigator.share({ title: d.name, text, url }); return; } } catch (e) { return; }
  try { await navigator.clipboard.writeText(url); toast(T("linkCopied")); }
  catch (e) { toast(url); }
}
function toggleWatch(id) {
  const i = state.watch.indexOf(id);
  if (i >= 0) state.watch.splice(i, 1); else state.watch.unshift(id);
  save(); updateCounts();
  if (i < 0) { track("watch", { deal: id }); INT.bumpDeal(BY_ID.get(id), 4); }
  pushWatch(id, i < 0);
  toast(i >= 0 ? T("removedToast") : T("savedToast"));
  if (PRODUCT_TABS.includes(state.tab)) { if (state.tab === "list") renderFilters(); renderGrid(); }
}

/* ---------------- static sections ---------------- */
function ics(e) {
  const d = e.date.replace(/-/g, ""), next = new Date(e.date + "T12:00:00Z"); next.setUTCDate(next.getUTCDate() + 1);
  const d2 = next.toISOString().slice(0, 10).replace(/-/g, "");
  const body = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Aktions.ch//Black Friday 2026//EN", "BEGIN:VEVENT", `UID:${d}-${slug(e.title)}@aktions.ch`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`, `DTSTART;VALUE=DATE:${d}`, `DTEND;VALUE=DATE:${d2}`,
    `SUMMARY:${e.title} (${e.region})`, `DESCRIPTION:${e.text.replace(/[,;]/g, m => "\\" + m)}`, "BEGIN:VALARM", "TRIGGER:-PT12H", "ACTION:DISPLAY", `DESCRIPTION:${e.title}`, "END:VALARM", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  return "data:text/calendar;charset=utf-8," + encodeURIComponent(body);
}
function renderCalendar() {
  const now = Date.now();
  const days = d => Math.ceil((new Date(d + "T00:00:00+01:00") - now) / 864e5);
  const de = d => new Date(d + "T12:00:00").toLocaleDateString("de-CH", { weekday: "short", day: "2-digit", month: "2-digit" });
  $("cal").innerHTML = EVENTS.map(e => {
    const n = days(e.date);
    return `<li class="${e.peak ? "peak" : ""}${n < 0 ? " past" : ""}"><time datetime="${e.date}">${de(e.date)}</time>
      <span class="reg">${e.region}</span><strong>${esc(e.title)}</strong><p>${esc(e.text)}</p>
      <span class="in-days">${n > 1 ? S.inDays(n) : n === 1 ? T("tomorrow") : n === 0 ? T("today") : T("done")}</span>
      ${n >= 0 ? `<a class="ics" href="${ics(e)}" download="${slug(e.title)}.ics">${T("addToCal")}</a>` : ""}</li>`;
  }).join("");
}
function renderRetailers() {
  const row = ([k, n, best, pat, warn, home]) => `<tr><td class="nm">${n}</td><td>${best}</td><td>${pat}</td><td>${warn}</td><td><a class="go" href="${affLink(k, home)}" target="_blank" rel="sponsored nofollow noopener">${T("visitShop")} ${ext}</a></td></tr>`;
  $("shopRows").innerHTML = SHOPINFO.map(row).join("");
  $("usShopRows").innerHTML = US_SHOPINFO.map(row).join("");
  $("showRows").innerHTML = SHOWCASES.map(x => `<tr><td class="nm">${esc(x.name)}</td><td>${esc(x.covers)}</td><td><a class="go" href="${esc(x.url)}" target="_blank" rel="noopener">${T("visitShop")} ${ext}</a></td></tr>`).join("");
}
function renderStatic() {
  $("winter-cta").innerHTML = PARTNER_LINKS.map((l, i) => `<a class="${i === 0 ? "primary" : ""}" href="${esc(l.url)}" target="_blank" rel="sponsored nofollow noopener">${esc(l.label)} ${ext}</a>`).join("");
  $("faq").innerHTML = FAQ.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("");
  $("n-live").textContent = POOLS.live.length;
  renderCalendar(); renderRetailers();
}
function tick() {
  const ms = Math.max(0, new Date("2026-11-27T00:00:00+01:00").getTime() - Date.now());
  const p = n => String(n).padStart(2, "0");
  $("cd-d").textContent = Math.floor(ms / 864e5);
  $("cd-h").textContent = p(Math.floor(ms % 864e5 / 36e5));
  $("cd-m").textContent = p(Math.floor(ms % 36e5 / 6e4));
}
function applyTheme() {
  document.documentElement.setAttribute("data-theme", state.theme || "dark");
}

/* ---------------- events ---------------- */
const refresh = () => { state.page = 0; mobileShown = 12; save(); renderGrid(); };
document.querySelectorAll("[data-tab]").forEach(b => b.addEventListener("click", () => showTab(b.dataset.tab)));
document.querySelectorAll("[data-cat]").forEach(b => b.addEventListener("click", () => showTab("live", { cat: b.dataset.cat })));
$("go-list").onclick = () => showTab("list");
document.addEventListener("click", e => { const a = e.target.closest && e.target.closest("[data-wa]"); if (a) track("share", { via: "whatsapp", id: a.dataset.wa }); });
$("b-more").onclick = e => { e.stopPropagation(); $("moresheet").hidden = !$("moresheet").hidden; };
$("moresheet").onclick = e => { if (e.target.id === "moresheet") $("moresheet").hidden = true; };
$("catChips").onclick = e => { const b = e.target.closest("[data-chip]"); if (!b) return; state.cat = b.dataset.chip; if (state.cat !== "All") INT.bumpKey("c", state.cat, 2); state.page = 0; mobileShown = 12; renderFilters(); renderGrid(); save(); };
$("catSel").onchange = e => { state.cat = e.target.value; if (state.cat !== "All") INT.bumpKey("c", state.cat, 2); state.page = 0; mobileShown = 12; renderFilters(); renderGrid(); save(); try { history.replaceState(null, "", "#" + (state.cat === WINTER ? "winter" : state.tab)); } catch (er) {} };
$("store").onchange = e => { state.store = e.target.value; refresh(); };
$("price").onchange = e => { state.price = e.target.value; refresh(); };
$("region").onchange = e => { state.region = e.target.value; refresh(); };
$("minoff").onchange = e => { state.minOff = +e.target.value; refresh(); };
$("type").onchange = e => { state.type = e.target.value; refresh(); };
$("status").onchange = e => { state.status = e.target.value; refresh(); };
$("sort").onchange = e => { state.sort = e.target.value; refresh(); };
$("q").oninput = e => {
  state.q = e.target.value;
  if (!PRODUCT_TABS.includes(state.tab)) showTab("live", { keep: true });
  renderFilters();
  refresh();
};
const resetFilters = () => { Object.assign(state, { q: "", store: "all", price: "all", status: "all", region: "all", minOff: 0, type: "all", drops: false, cat: state.tab === "top" || state.tab === "list" ? "All" : "All" }); $("q").value = ""; renderFilters(); refresh(); };
$("reset").onclick = resetFilters;
$("clear-list").onclick = () => { state.watch = []; save(); updateCounts(); renderFilters(); renderGrid(); toast(T("clearedToast")); };
$("prev").onclick = () => { state.page--; save(); renderGrid(); };
$("next").onclick = () => { state.page++; save(); renderGrid(); };
$("more").onclick = () => { mobileShown += 12; renderGrid(); };
$("grid").onclick = e => {
  const w = e.target.closest("[data-w]"); if (w) return toggleWatch(w.dataset.w);
  const d = e.target.closest("[data-d]"); if (d) return openDetails(BY_ID.get(d.dataset.d));
  if (e.target.closest("[data-reset]")) return resetFilters();
  const c = e.target.closest(".card");
  if (c && !e.target.closest("a,button,select,input,label")) { const id = c.querySelector("[data-d]")?.dataset.d; if (id && BY_ID.get(id)) openDetails(BY_ID.get(id)); }
};
$("modal").onclick = e => { if (e.target.id === "modal") closeDetails(); };
$("theme").onclick = () => {
  const dark = (state.theme || "dark") === "dark";
  state.theme = dark ? "light" : "dark"; save(); applyTheme();
};
document.addEventListener("keydown", e => {
  const typing = /INPUT|SELECT|TEXTAREA/.test(document.activeElement?.tagName || "");
  if (e.key === "Escape") { if (!$("modal").hidden) return closeDetails(); $("moresheet").hidden = true; return; }
  if (e.key === "/" && !typing) { e.preventDefault(); $("q").focus(); return; }
  if (typing || !$("modal").hidden || $("p-products").hidden || mobile()) return;
  if (e.key === "ArrowRight" && !$("next").disabled) $("next").click();
  if (e.key === "ArrowLeft" && !$("prev").disabled) $("prev").click();
});
$("tabs").addEventListener("keydown", e => {
  const i = TABS.indexOf(state.tab), k = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: TABS.length - 1 }[e.key];
  if (k == null) return; e.preventDefault();
  const t = TABS[(k + TABS.length) % TABS.length]; showTab(t); $("t-" + t).focus();
});
let rt; window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { if (!$("p-products").hidden) renderGrid(); }, 120); });
window.addEventListener("hashchange", route);

/* ---------------- routing + init ---------------- */
function route() {
  const h = location.hash.replace("#", "");
  if (h.startsWith("p-") && BY_ID.has(h.slice(2))) {
    const d = BY_ID.get(h.slice(2));
    if (!$("modal").hidden) return openDetails(d, false);
    showTab("live", { noHash: true });
    return openDetails(d, false);
  }
  if (h === "winter") return showTab("live");
  if (TABS.includes(h)) return showTab(h, { keep: h === state.tab });
}
applyTheme();
$("q").value = state.q;
$("q").placeholder = T("searchPlaceholder");
// Inject language switcher into header
const langHtml = buildLangSwitcher();
if (langHtml) {
  const sw = document.createElement("div");
  sw.className = "lang-switcher";
  sw.innerHTML = langHtml;
  $("theme").insertAdjacentElement("beforebegin", sw);
}
// Translate static HTML labels when not English
if (LANG !== "en") {
  // Tab bar
  const tabMap = { "t-live": "tabLive", "t-best": "tabBest", "t-top": "tabTop", "t-categories": "tabCat", "t-tyres": "tabTyres", "t-sodeal": "tabSodeal", "t-us": "tabUS",
    "t-list": "tabList", "t-calendar": "tabCal", "t-retailers": "tabRetailers", "t-guide": "tabGuide" };
  for (const [id, key] of Object.entries(tabMap)) {
    const el = $(id); if (!el) continue;
    const badge = el.querySelector(".n");
    el.childNodes[0].textContent = T(key);
    if (badge) el.appendChild(badge);
  }
  // Price select
  const priceEl = $("price");
  if (priceEl) priceEl.innerHTML = `<option value="all">${T("anyPrice")}</option>
    <option value="0-50">${T("under50")}</option>
    <option value="50-200">${T("price50_200")}</option>
    <option value="200-500">${T("price200_500")}</option>
    <option value="500-1000">${T("price500_1000")}</option>
    <option value="1000-1e9">${T("over1000")}</option>`;
  // Status select
  const statusEl = $("status");
  if (statusEl) statusEl.innerHTML = `<option value="all">${T("allDeals")}</option>
    <option value="buy">${T("buyNow")}</option>
    <option value="wait">${T("waitBW")}</option>
    <option value="track">${T("tracking")}</option>
    <option value="check">${T("checkPrice")}</option>`;
  // Sort select
  const sortEl = $("sort");
  if (sortEl) sortEl.innerHTML = `<option value="rank">${T("sortRec")}</option>
    <option value="save">${T("sortSave")}</option>
    <option value="low">${T("sortLow")}</option>
    <option value="high">${T("sortHigh")}</option>
    <option value="az">${T("sortAZ")}</option>
    <option value="ends">${T("sortEnds")}</option>
    <option value="buy">${T("sortBuy")}</option>`;
  // Bottom nav text nodes
  const bnMap = { "b-live": "tabLive", "b-best": "bestTag", "b-top": "tabTop", "b-categories": "tabCat", "b-us": "tabUS", "b-list": "tabList", "b-more": "moreLabel" };
  for (const [id, key] of Object.entries(bnMap)) {
    const el = $(id); if (!el) continue;
    const dot = el.querySelector(".dot");
    const svg = el.querySelector("svg");
    // Replace text node after svg
    for (const n of [...el.childNodes]) {
      if (n.nodeType === 3) n.textContent = T(key);
    }
    if (dot) el.appendChild(dot);
  }
  // Moresheet buttons
  const msButtons = document.querySelectorAll(".ms-in [data-tab]");
  const msTabKeys = { calendar: "tabCal", retailers: "tabRetailers", guide: "tabGuide" };
  msButtons.forEach(btn => { const k = msTabKeys[btn.dataset.tab]; if (k) btn.textContent = T(k); });
  const msWinter = document.querySelector(".ms-in [data-cat='Winter tyres']");
  if (msWinter) msWinter.textContent = T("winterMore");
  // More button
  const moreBtn = $("more"); if (moreBtn) moreBtn.textContent = T("showMore");
  // Prev/Next pager
  const prevBtn = $("prev"); if (prevBtn) prevBtn.textContent = T("prevPage");
  const nextBtn = $("next"); if (nextBtn) nextBtn.textContent = T("nextPage");
  // pmore initial label
  $("pmore").textContent = T("showMore");
}
renderStatic(); updateCounts(); tick(); setInterval(tick, 30000);

/* ---------------- return-visit bar: price drops since last visit + next deal date ---------------- */
let installEvt = null;
function nextEvent() {
  return EVENTS.filter(e => e.date >= TODAY).sort((a, b) => a.date.localeCompare(b.date))[0] || null;
}
function renderPulse() {
  const el = $("pulse"); if (!el) return;
  const loc = LANG === "en" ? "en-GB" : LANG + "-CH";
  let left;
  if (MEM) {
    const date = new Date(MEM.t).toLocaleDateString(loc, { day: "numeric", month: "short" });
    const drops = ALL.filter(d => d.drop), news = ALL.filter(d => d.isNew);
    const mine = drops.filter(watched).length;
    left = drops.length || news.length
      ? `<span>${S.pulseBack(date, drops.length, mine, news.length)}</span><button class="pbtn" type="button" data-drops>${state.drops ? T("pulseShowAll") : T("pulseShow")}</button>`
      : `<span>${S.pulseSame(date)}</span>`;
  } else left = `<span>${T("pulseFirst")}</span>`;
  const e = nextEvent();
  let right = "";
  if (e) {
    const n = Math.ceil((new Date(e.date + "T00:00:00+01:00") - Date.now()) / 864e5);
    const when = n > 1 ? S.inDays(n) : n === 1 ? T("tomorrow") : T("today");
    right = `<span class="nxt"><span class="eyebrow">${T("pulseNext")}</span> <b>${esc(e.title)}</b> · ${when}</span><a class="pbtn" href="${ics(e)}" download="${slug(e.title)}.ics"><svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg> ${T("remindMe")}</a>`;
  }
  const inst = installEvt ? `<button class="pbtn solid" type="button" data-install>${T("installApp")}</button>` : "";
  el.innerHTML = `<div class="pl">${left}</div><div class="pr">${right}${inst}</div>`;
  el.hidden = false;
}
$("pulse").onclick = async e => {
  if (e.target.closest("[data-drops]")) { state.drops = !state.drops; state.page = 0; mobileShown = 12; save(); renderPulse(); renderFilters(); renderGrid(); return; }
  if (e.target.closest("[data-install]") && installEvt) {
    installEvt.prompt(); const r = await installEvt.userChoice.catch(() => null);
    installEvt = null; renderPulse(); if (r && r.outcome === "accepted") toast(T("installed"));
  }
};
window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); installEvt = e; renderPulse(); });
if ("serviceWorker" in navigator && location.protocol === "https:") {
  window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));
}
{ const mine = ALL.filter(d => d.drop && watched(d)).length; if (mine) setTimeout(() => toast(S.dropsToast(mine)), 900); }

// Top deals banner: the most valuable live deals, shown as soon as the site opens (once a day; closing is remembered for the day)
function topDealsBanner() {
  const key = "bf26-topbanner";
  if (BEST.length < 3 || PAGE?.tab === "best") return;
  try { if (localStorage.getItem(key) === TODAY) return; } catch (e) {}
  const el = document.createElement("aside");
  el.className = "dotd top5"; el.setAttribute("role", "dialog"); el.setAttribute("aria-labelledby", "top5-h");
  el.innerHTML = `<button class="dotd-x" type="button" aria-label="${T("dotdClose")}">×</button>
    <div class="dotd-tag"><span>${T("bestTag")}</span> ${S.bestChecked(fmtDay(TODAY))}</div>
    <h2 id="top5-h">${T("bestTitle")}</h2>
    <ol class="t5">${BEST.slice(0, 5).map(d => `<li><button type="button" data-d="${d.id}"><span class="t5n">${esc(d.name)}<small>${esc(SHOPS[d.shop] ? SHOPS[d.shop].name : d.shop)}${d.until ? " · " + S.untilLabel(fmtDay(d.until)) : ""}</small></span><span class="t5p"><b>${money(d.show, d.cur)}</b><s>${money(d.reg, d.cur)}</s></span><span class="t5o">−${d.off}%</span></button></li>`).join("")}</ol>
    <button class="dotd-cta" type="button" data-all>${T("bestAll")} →</button>`;
  const close = () => { el.classList.remove("in"); try { localStorage.setItem(key, TODAY); } catch (e) {} setTimeout(() => el.remove(), 250); };
  el.querySelector(".dotd-x").onclick = close;
  el.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  el.addEventListener("click", e => {
    const b = e.target.closest("[data-d]"); if (b) { close(); return openDetails(BY_ID.get(b.dataset.d)); }
    if (e.target.closest("[data-all]")) { close(); showTab("best"); }
  });
  document.body.appendChild(el);
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("in")));
}
getConsent() ? topDealsBanner() : onConsent(() => setTimeout(topDealsBanner, 500));


// Reactive layout: re-fit + re-render when viewport size changes
let _fitTimer;
function debouncedRefit() {
  clearTimeout(_fitTimer);
  _fitTimer = setTimeout(() => { fit(); renderGrid(); }, 80);
}
if (typeof ResizeObserver !== "undefined") {
  const ro = new ResizeObserver(debouncedRefit);
  const g = $("grid");
  if (g) ro.observe(g.parentElement || g);
  const fe = $("featured"); if (fe) ro.observe(fe);
}
window.addEventListener("resize", debouncedRefit, { passive: true });
window.addEventListener("orientationchange", debouncedRefit, { passive: true });
if (window.visualViewport) window.visualViewport.addEventListener("resize", debouncedRefit, { passive: true });
// PAGE already declared at top (i18n block) — reuse it here
$("pmore").onclick = () => { const o = $("pagehead").classList.toggle("open"); $("pmore").setAttribute("aria-expanded", o); $("pmore").textContent = o ? T("showLess") : T("showMore"); };
if (location.hash) route();
else if (PAGE && PAGE.path !== "/") {
  state.q = PAGE.q || ""; $("q").value = state.q;
  showTab(PAGE.tab, { cat: PAGE.cat || undefined, noHash: true });
} else showTab(state.tab, { keep: true });

/* ---------------- consent, analytics, login ---------------- */
document.addEventListener("click", e => {
  const a = e.target.closest('a[rel~="sponsored"]'); if (!a) return;
  const deal = (a.closest(".card") || a.closest(".sheet") || document).querySelector("[data-d]")?.dataset.d || null;
  let shop = a.querySelector(".sn")?.textContent || a.querySelector(".fp-shop")?.textContent || ""; if (!shop) { try { shop = new URL(a.href).hostname; } catch (x) {} }
  track("outbound", { deal, shop: shop.slice(0, 40) });
  if (deal) INT.bumpDeal(BY_ID.get(deal), 3);
});
initConsent(LANG);
track("pageview");
if (ENABLED) {
  const sync = async () => {
    const ids = await pullWatch(); if (!ids) return;
    const merged = [...new Set([...state.watch, ...ids])].filter(id => BY_ID.has(id));
    state.watch.filter(id => !ids.includes(id)).forEach(id => pushWatch(id, true));
    state.watch = merged; save(); updateCounts();
    if (PRODUCT_TABS.includes(state.tab)) { renderFilters(); renderGrid(); }
  };
  const openAccount = initAccountUi(LANG, () => { $("acct").classList.toggle("on", !!authUser()); });
  initAuth().then(u => { $("acct").classList.toggle("on", !!u); if (u) { sync(); if (u.fresh) track("login"); if (u.recovery) openAccount(true); } });
}

/* Top banner: rotates every 15 s through affiliate deals only. Lyca (Awin) has priority: it opens the rotation and returns after every
   Amazon slide; Amazon slides are the highest buy-score deals verified today/yesterday. Dismissible per session, pauses on hover. */
(() => {
  const ly = [...new Map(AD_LYCA.map(a => [a.r.url, a.r])).values()];
  const amz = AD_AMZ.slice(0, 5).map(a => a.r);
  if (!ly.length && !amz.length) return;
  try { if (sessionStorage.getItem("lyca-bn") === "1") return; } catch (e) {}
  const f = n => Number(n).toFixed(2);
  const seq = [];
  if (amz.length) amz.forEach((r, j) => seq.push([["lyca", ly[j % Math.max(1, ly.length)]], ["amz", r]]));
  else for (let j = 0; j < ly.length; j += 2) seq.push([["lyca", ly[j]], ["lyca", ly[(j + 1) % ly.length]]]);
  if (!seq.length) return;
  const slide = ([k, r]) => k === "lyca"
    ? { href: affLink("lyca", r.url), ev: "lyca_banner", html: `<b>${/Truly/i.test(r.name) ? T("lyTxt").replace("{p}", f(r.now)) : "Lyca Mobile " + esc(r.name.replace(/^Lyca Mobile\s*/i, "")) + " · CHF " + f(r.now)}</b>${r.reg ? `<s>${T("lyWas").replace("{w}", f(r.reg))}</s>` : ""}<u>${T("lyGo")} →</u>`, cls: "" }
    : { href: affLink("amazon", r.url), ev: "amazon_banner", html: `<b>${esc(r.name.replace(/\(.*?\)/g, "").trim().slice(0, 48))} · CHF ${f(r.now)}</b><s>${f(r.reg)}</s><i>−${r.off}%</i><u>${T("amzGo")} →</u>`, cls: " amzs" };
  const el = document.createElement("div");
  el.className = "lyca-bn";
  let i = 0, hold = false;
  const paint = () => {
    el.innerHTML = seq[i].map(pr => { const sl = slide(pr); return `<a class="lyca-go${sl.cls}" href="${sl.href}" target="_blank" rel="sponsored nofollow noopener" data-bn="${sl.ev}" data-p="${pr[1].now}">${sl.html}</a>`; }).join("") + `<button type="button" class="lyca-x" aria-label="${T("lyClose")}">×</button>`;
    el.querySelector(".lyca-x").addEventListener("click", () => { clearInterval(tm); el.remove(); try { sessionStorage.setItem("lyca-bn", "1"); } catch (e) {} });
    el.classList.remove("in"); void el.offsetWidth; el.classList.add("in");
  };
  paint();
  const app = document.querySelector(".app");
  app.insertBefore(el, app.firstChild);
  el.addEventListener("mouseenter", () => hold = true); el.addEventListener("mouseleave", () => hold = false);
  const tm = setInterval(() => { if (hold || document.hidden || seq.length < 2) return; i = (i + 1) % seq.length; paint(); }, 15000);
  el.addEventListener("click", e => { const a = e.target.closest("[data-bn]"); if (a) track(a.dataset.bn, { price: a.dataset.p }); });
})();

/* Bottom banner: the Amazon.de deal with the highest buy score (affiliate-tagged), placed above the footer */
(() => {
  const r = LIVE.filter(x => x.shop === "amazon" && x.now != null && x.reg && x.off >= 20 && x.rating >= 4.3 && x.reviews >= 1000).sort((a, b) => b.buy - a.buy)[0];
  const foot = document.querySelector("footer.legal");
  if (!r || !foot) return;
  const f = n => Number(n).toFixed(2);
  const el = document.createElement("aside");
  el.className = "amz-bn";
  el.innerHTML = `<a href="${affLink("amazon", r.url)}" target="_blank" rel="sponsored nofollow noopener" data-amz><span class="tx"><b>${esc(r.name)}</b><small>${T("amzTop")} · ★ ${r.rating} · CHF ${f(r.now)} <s>${f(r.reg)}</s> −${r.off}%</small></span><u>${T("amzGo")} →</u></a><p>${T("amzNote")}</p>`;
  foot.parentNode.insertBefore(el, foot);
  el.addEventListener("click", e => { if (e.target.closest("[data-amz]")) track("amazon_banner", { id: r.id }); });
})();

/* Mobile and desktop: load the next deals automatically when the end of the list nears. Uses scroll position (works on every browser,
   including iOS Safari / body scrollers) plus an IntersectionObserver; mobile keeps a "Show more" button as a last fallback. */
const loadMore = () => {
  if (!PRODUCT_TABS.includes(state.tab) || !$("p-products") || $("p-products").hidden) return false;
  if (mobile()) { if (list().length > mobileShown) { mobileShown += 12; renderGrid(); return true; } }
  else if (Math.max(deskShown, perPage * 2) < deskTotal) { deskShown = Math.max(deskShown, perPage * 2) + perPage * 2; renderGrid(); return true; }
  return false;
};
const nearEnd = () => { const se = document.scrollingElement || document.documentElement; return se.scrollHeight - (se.scrollTop + window.innerHeight) < 1400; };
let pend = false;
const check = () => { if (pend) return; pend = true; requestAnimationFrame(() => { pend = false; let n = 0; while (nearEnd() && n++ < 6 && loadMore()); }); };
window.addEventListener("scroll", check, { passive: true });
document.addEventListener("scroll", check, { passive: true, capture: true });
window.addEventListener("touchmove", check, { passive: true });
window.addEventListener("touchend", check, { passive: true });
window.addEventListener("resize", check);
setInterval(check, 1500);
(() => {
  const sent = document.getElementById("sentinel");
  if (!sent || !("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(es => { if (es[0].isIntersecting) loadMore(); io.unobserve(sent); setTimeout(() => io.observe(sent), 150); }, { rootMargin: "900px 0px" });
  io.observe(sent);
})();

/* ---------------- Awin partner sections (kept separate from the deal list) ---------------- */
const fmtN = n => Number(n).toFixed(2);
const tyreCard = r => `<a class="adc tyre tcard c-${r.c}" data-tc="${r.c}" href="${r.url}" target="_blank" rel="sponsored nofollow noopener" data-ad="tyre">${r.img ? `<img class="pimg" src="${esc(r.img)}" alt="${esc(r.brand + " " + r.model)}" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.outerHTML='<span class=aart><svg viewBox=\'0 0 64 64\'>'+window.__tyreArt+'</svg></span>'">` : ""}${r.best ? `<span class="best">${T("tyreBest")}</span>` : ""}<span class="at">${esc(r.m)}.ch · Partner</span><b class="ah">${esc(r.size)}</b><span class="an">${esc(r.brand + " " + r.model)}</span><span class="ap"><strong>CHF ${fmtN(r.price)}</strong><i class="pt">${r.c === "alloy" || r.c === "steel" ? T("tyrePerWheel") : T("tyrePer")}</i></span><u>${T("tyreGo")} →</u></a>`;
window.__tyreArt = artFor("Winter tyres");
const BESTW = { en: "Cheapest for size", de: "Günstigster dieser Grösse", fr: "Moins cher pour cette taille", it: "Più economico per misura" };
const ALLW = { en: "All", de: "Alle", fr: "Tous", it: "Tutti" };
const rimOf = r => (r.size.match(/R\s?(\d+)/) || r.size.match(/(\d+)"/) || [])[1] || "?";
const TCAT = [
  ["winter", "❄️", { en: "Winter tyres", de: "Winterreifen", fr: "Pneus hiver", it: "Pneumatici invernali" }],
  ["suv", "🏔️", { en: "Winter SUV / 4x4", de: "Winter SUV / 4x4", fr: "Hiver SUV / 4x4", it: "Invernali SUV / 4x4" }],
  ["allseason", "🌦️", { en: "All-season", de: "Ganzjahresreifen", fr: "Toutes saisons", it: "Quattro stagioni" }],
  ["alloy", "✨", { en: "Alloy wheels", de: "Alufelgen", fr: "Jantes alu", it: "Cerchi in lega" }],
  ["steel", "🔩", { en: "Steel wheels", de: "Stahlfelgen", fr: "Jantes acier", it: "Cerchi in acciaio" }],
];
const gKey = r => r.c + "|" + (r.c === "alloy" || r.c === "steel" ? rimOf(r) + '"' : r.size);
const chipRow = (el, items, cur, on) => {
  el.innerHTML = items.map(([v, label, n]) => `<button type="button" data-v="${esc(v)}" aria-pressed="${cur === v}">${label}${n != null ? `<i>${n}</i>` : ""}</button>`).join("");
  el.onclick = e => { const b = e.target.closest("button"); if (b) on(b.dataset.v === cur ? "" : b.dataset.v); };
};
let tyreRim = "", tyreBrand = "", tyreCat = INT.topKey("x").startsWith("t:") ? INT.topKey("x").slice(2) : "winter";
function renderTyres() {
  $("tyre-h").textContent = T("tabTyres"); $("tyre-intro").textContent = T("tyreIntro");
  const ss = $("tyre-size");
  if (!ss.options.length) { ss.onchange = () => renderTyres(); $("tyre-sort").onchange = () => renderTyres(); }
  const inCat = AWIN_TYRES.filter(r => r.c === tyreCat);
  const sizes = [...new Set(inCat.map(r => r.size))].sort();
  const keep = sizes.includes(ss.value) ? ss.value : "";
  ss.innerHTML = `<option value="">${T("tyreAll")}</option>` + sizes.map(x => `<option${x === keep ? " selected" : ""}>${esc(x)}</option>`).join("");
  const sizeSel = ss.value, sort = $("tyre-sort").value;
  const minBy = {}; inCat.forEach(r => { const k = gKey(r); if (!minBy[k] || r.price < minBy[k]) minBy[k] = r.price; });
  const cnt = (k, f) => inCat.filter(r => f(r) === k).length;
  chipRow($("tyre-cats"), TCAT.map(([k, e, n]) => [k, `${e} ${n[LANG] || n.en}`, AWIN_TYRES.filter(r => r.c === k).length]), tyreCat, v => { if (v) { tyreCat = v; tyreRim = tyreBrand = ""; $("tyre-size").value = ""; renderTyres(); } });
  const rims = [...new Set(inCat.map(rimOf))].sort((a, b) => a - b);
  const brands = [...new Set(inCat.map(r => r.brand))].sort();
  chipRow($("tyre-rims"), [["", ALLW[LANG] || ALLW.en, inCat.length], ...rims.map(x => [x, `${T("tyreRim") || "Rim"} ${x}"`, cnt(x, rimOf)])], tyreRim, v => { tyreRim = v; renderTyres(); });
  chipRow($("tyre-brands"), [["", ALLW[LANG] || ALLW.en], ...brands.map(x => [x, x, cnt(x, r => r.brand)])], tyreBrand, v => { tyreBrand = v; renderTyres(); });
  const list = inCat.filter(r => (!tyreRim || rimOf(r) === tyreRim) && (!tyreBrand || r.brand === tyreBrand) && (!sizeSel || r.size === sizeSel))
    .map(r => ({ ...r, best: r.price === minBy[gKey(r)] }));
  if (sort) list.sort((a, b) => sort === "low" ? a.price - b.price : b.price - a.price);
  else list.sort((a, b) => rimOf(a) - rimOf(b) || gKey(a).localeCompare(gKey(b)) || a.price - b.price);
  let html = "", last = "";
  list.forEach(r => { const k = gKey(r); if (!sort && k !== last) { last = k; html += `<div class="tyrehead">${esc(k.split("|")[1])}<small>${list.filter(x => gKey(x) === k).length} · ${T("tyreFrom")} CHF ${fmtN(minBy[k])}</small></div>`; } html += tyreCard(r); });
  $("tyre-grid").innerHTML = html;
  $("tyre-info").textContent = `${list.length} ${T("deals")}`;
}
/* SODEAL categories: keyword classifier on the German product name (first match wins) */
const SCAT = [
  ["xmas", "🎄", { en: "Christmas & lights", de: "Weihnachten & Licht", fr: "Noël & lumière", it: "Natale & luci" }, /weihnacht|girlande|led-lampe|laser|solar|leucht|lampe|licht|nachtlicht|kamin/i],
  ["beauty", "💈", { en: "Beauty & grooming", de: "Beauty & Pflege", fr: "Beauté & soin", it: "Bellezza & cura" }, /remington|haarschneid|haarglätt|rasier|trimmer|epilier|lockenstab|haartrockn|multistyler|gesichts|bartschn|ohrrein|mitesser|spiegel/i],
  ["kitchen", "🍳", { en: "Kitchen & appliances", de: "Küche & Geräte", fr: "Cuisine & appareils", it: "Cucina & elettrodomestici" }, /russell|toaster|wasserkocher|kocher|mixer|dampf|sushi|fritteuse|air fryer|küche|messer|korkenzieher|wein|grill|fondue|crêpe|zitrus|mühle|bügeleisen|staubsauger|mahlzeit|getränk|seifenspender|eier|aperitif|koch|auftau/i],
  ["health", "💆", { en: "Health & relaxation", de: "Gesundheit & Entspannung", fr: "Santé & détente", it: "Salute & relax" }, /massage|kissen|nacken|kompress|bandage|knie|relief|schlaf|sitz|akupressur|migräne|wärm|heizdecke|gel-|orthop|fuss|fuß|sohle|pflaster|nasensauger|polster/i],
  ["fashion", "🧣", { en: "Winter & clothing", de: "Winter & Kleidung", fr: "Hiver & vêtements", it: "Inverno & abbigliamento" }, /handschuh|schal|socken|leggings|boxershorts|hose|fleece|bademantel|decke|plaid|sweatshirt|hausschuh|plüsch/i],
  ["outdoor", "🥾", { en: "Outdoor, travel & car", de: "Outdoor, Reisen & Auto", fr: "Outdoor, voyage & auto", it: "Outdoor, viaggio & auto" }, /wander|camping|reise|koffer|auto|kofferraum|strand|poncho|stock|stühle|mücken|fliegen|insekt|pumpe|sonnen|tasche|rucksack|wasserpistole|bewässerung/i],
  ["fitness", "💪", { en: "Fitness", de: "Fitness", fr: "Fitness", it: "Fitness" }, /sport|widerstand|training/i],
];
const sodCat = r => { for (const [k, , , re] of SCAT) if (re.test(r.name + " " + (r.brand || ""))) return k; return "home"; };
const SCAT_ALL = [...SCAT.map(([k, e, n]) => [k, e, n]), ["home", "🏠", { en: "Home & gadgets", de: "Haushalt & Gadgets", fr: "Maison & gadgets", it: "Maison & gadgets" }]];
const SOD_CAT = new Map(AWIN_SHOP.map(r => [r, sodCat(r)]));
let sodCatSel = "";
const sodCard = r => adHTML({ k: "shop", r }, "sodc").replace("<a ", `<a data-sc="${SOD_CAT.get(r)}" `);
let sodShown = 48;
function renderSodeal() {
  $("sod-h").textContent = T("tabSodeal"); $("sod-intro").textContent = T("sodealIntro");
  const q = ($("sod-q").value || "").trim().toLowerCase(), sort = $("sod-sort").value;
  chipRow($("sod-cats"), [["", ALLW[LANG] || ALLW.en, AWIN_SHOP.length], ...SCAT_ALL.map(([k, e, n]) => [k, `${e} ${n[LANG] || n.en}`, [...SOD_CAT.values()].filter(v => v === k).length]).filter(x => x[2])], sodCatSel, v => { sodCatSel = v; sodShown = 48; renderSodeal(); });
  const list = AWIN_SHOP.filter(r => (!sodCatSel || SOD_CAT.get(r) === sodCatSel) && (!q || r.name.toLowerCase().includes(q) || (r.brand || "").toLowerCase().includes(q)));
  if (!sort && !q) list.sort((a, b) => INT.get("x", "s:" + SOD_CAT.get(b)) - INT.get("x", "s:" + SOD_CAT.get(a)));
  if (sort === "low") list.sort((a, b) => a.price - b.price); else if (sort === "high") list.sort((a, b) => b.price - a.price);
  $("sod-grid").innerHTML = list.slice(0, sodShown).map(sodCard).join("");
  $("sod-info").textContent = `${Math.min(sodShown, list.length)} ${T("ofWord")} ${list.length}`;
  $("sod-more").hidden = list.length <= sodShown;
}
$("sod-q").oninput = () => { sodShown = 48; renderSodeal(); };
$("sod-sort").onchange = () => { sodShown = 48; renderSodeal(); };
$("sod-more").onclick = () => { sodShown += 48; renderSodeal(); };
const sodIO = "IntersectionObserver" in window && new IntersectionObserver(es => { if (es[0].isIntersecting && !$("sod-more").hidden) { sodShown += 48; renderSodeal(); } }, { rootMargin: "600px" });
if (sodIO) sodIO.observe($("sod-end"));

/* ---------------- "Picked for you" shelf (on-device interest profile) ---------------- */
function renderForYou() {
  const el = $("foryou"); if (!el) return;
  const on = state.tab === "live" && state.cat === "All" && !state.q && state.store === "all" && state.price === "all" && !state.drops && state.type === "all" && state.minOff === 0 && state.region === "all";
  if (!on || INT.total() < 3) { el.hidden = true; el.innerHTML = ""; return; }
  const cats = Object.entries(JSON.parse(localStorage.getItem("bf_interest_v1") || "{}").c || {}).sort((a, b) => b[1] - a[1]).slice(0, 2).map(x => x[0]);
  const picks = LIVE.filter(d => d.show != null && d.off >= 15 && cats.includes(d.cat) && !INT.seen(d.id) && !state.watch.includes(d.id))
    .sort((a, b) => ((b.buy ?? 0) + INT.score(b) * 2) - ((a.buy ?? 0) + INT.score(a) * 2)).slice(0, 12);
  if (picks.length < 4) { el.hidden = true; el.innerHTML = ""; return; }
  el.hidden = false;
  el.innerHTML = `<div class="fy-h"><b>${T("fyH")}</b><span>${T("fyWhy").replace("{c}", esc(cats.join(" · ")))}</span><button type="button" class="fy-x">${T("fyClear")}</button></div><div class="fy-row">${picks.map(card).join("")}</div>`;
  el.querySelector(".fy-x").onclick = () => { INT.reset(); renderForYou(); renderGrid(); };
}
$("foryou").onclick = e => $("grid").onclick(e);
const _rg = renderGrid; renderGrid = function () { _rg.apply(this, arguments); renderForYou(); };

/* mobile header: collapsible menu (search, updated, language, theme, account) */
(() => {
  const bar = document.querySelector("header.bar"), btn = $("hmenu"); if (!bar || !btn) return;
  const set = o => { bar.classList.toggle("open", o); btn.setAttribute("aria-expanded", String(o)); };
  btn.onclick = e => { e.stopPropagation(); set(!bar.classList.contains("open")); if (bar.classList.contains("open")) setTimeout(() => $("q")?.focus(), 50); };
  document.addEventListener("click", e => { if (bar.classList.contains("open") && !bar.contains(e.target)) set(false); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") set(false); });
  $("q").addEventListener("keydown", e => { if (e.key === "Enter" && matchMedia("(max-width:760px)").matches) setTimeout(() => set(false), 50); });
})();
