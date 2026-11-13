import "./styles.css";
import { affLink } from "./config/affiliates.js";
import { PARTNER_LINKS } from "./config/partners.js";
import { SHOPS } from "./config/shops.js";
import { WINTER_TYRES } from "./data/winter-tyres.js";
import { SHOPINFO } from "./data/retailers.js";
import { DEALS, isTyre } from "./data/products.js";
import { US_RAW, US_SHOPINFO } from "./data/us.js";
import CAT_US from "./data/catalogue-us.js";
import { LIVE_CH, SHOWCASES } from "./data/live-ch.js";
import { EVENTS, FAQ as FAQ_EN, FAQ_I18N } from "./data/calendar.js";
import { fmt, esc, ext } from "./lib/format.js";
import { thumb } from "./lib/thumb.js";
import { STRINGS, detectLang, LANG_PATHS } from "./i18n.js";

/* ---------------- i18n ---------------- */
const PAGE = window.__PAGE__ || null;
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
    status: "live", note: r.note || null, pick: (off || 0) >= 30, shops: [r.shop], shop: r.shop, url: r.url || null, until: r.until || null, from: r.from || null,
    checked: r.checked, code: r.code || null, percent: r.percent || null, type: r.type || null, src: r.src || [] };
});
// Most valuable live deals: at least 25 % off, ranked by the amount saved (EUR converted at an approximate rate, for ranking only)
const EUR_CHF = 0.94;
const chfSave = d => (d.save || 0) * (d.cur === "EUR" ? EUR_CHF : 1);
const BEST = LIVE.filter(d => d.show != null && d.reg && d.off >= 25).sort((a, b) => chfSave(b) - chfSave(a)).slice(0, 24);
BEST.forEach((d, i) => { d.bestRank = i + 1; });
const ALL = LIVE.concat(DEALS, US, US_LINES);
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
  live: LIVE,
  best: BEST,
  top: DEALS.filter(d => d.top),
  categories: DEALS.filter(d => !d.top),
  us: US.concat(US_LINES)
};
const CAT_ORDER = cats => [...new Set(cats)].sort((a, b) => a === WINTER ? -1 : b === WINTER ? 1 : a.localeCompare(b));
const LABEL = { buy: T("statusBuy"), wait: T("statusWaitS"), track: T("statusTrack"), check: T("statusCheck"), live: T("statusLive"), lastyear: T("statusLY"), early: T("statusEarly") };

/* ---------------- state ---------------- */
const PRODUCT_TABS = ["live", "best", "top", "categories", "us", "list"];
const TABS = [...PRODUCT_TABS, "calendar", "retailers", "guide"];
const defaults = { tab: LIVE.length ? "live" : "top", cat: "All", q: "", status: "all", sort: "rank", store: "all", price: "all", page: 0, drops: false };
let state = { ...defaults, watch: [], theme: "" };
try { Object.assign(state, JSON.parse(localStorage.getItem("bf26v5") || "{}")); } catch (e) {}
state.watch = Array.isArray(state.watch) ? state.watch.filter(id => BY_ID.has(id)) : [];
if (!MEM) state.drops = false;
const save = () => { try { localStorage.setItem("bf26v5", JSON.stringify(state)); } catch (e) {} };
const $ = id => document.getElementById(id);
const mobile = () => matchMedia("(max-width: 760px), (max-height: 560px)").matches;
let perPage = 12, mobileShown = 12;

/* ---------------- helpers ---------------- */
const money = (n, cur) => cur === "EUR" ? "€ " + n.toLocaleString("de-CH", { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 }) : cur === "INR" ? "₹" + n.toLocaleString("en-IN") : cur === "USD" ? "$" + (Number.isInteger(n) ? n.toLocaleString("en-US") : n.toLocaleString("en-US", { minimumFractionDigits: 2 })) : "CHF " + fmt(n);
const heartSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-9-8.7C1.5 7.8 4 4.5 7.3 4.5c2 0 3.5 1.1 4.7 2.7 1.2-1.6 2.7-2.7 4.7-2.7 3.3 0 5.8 3.3 4.3 6.8-2 4.3-9 8.7-9 8.7z"/></svg>';
const watched = d => state.watch.includes(d.id);
const fmtDay = iso => new Date(iso + "T12:00:00Z").toLocaleDateString(LANG === "en" ? "en-GB" : LANG + "-CH", { day: "numeric", month: "short" });
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
    inRange(d) &&
    (!state.drops || d.drop || d.isNew) &&
    (!term || (d.name + " " + d.spec + " " + d.cat).toLowerCase().includes(term)));
  const by = {
    rank: state.tab === "best" && !term ? (a, b) => a.bestRank - b.bestRank : (a, b) => (a.region === b.region ? a.rank - b.rank : a.region === "ch" ? -1 : 1),
    save: (a, b) => (b.off ?? (b.now ? b.save / b.now * 100 : 0)) - (a.off ?? (a.now ? a.save / a.now * 100 : 0)) || a.rank - b.rank,
    low: (a, b) => (a.show ?? 1e9) - (b.show ?? 1e9) || a.rank - b.rank,
    high: (a, b) => (b.show ?? -1) - (a.show ?? -1) || a.rank - b.rank,
    az: (a, b) => a.name.localeCompare(b.name)
  };
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
function card(d) {
  const badge = d.off ? `<span class="off">−${d.off}%</span>` : d.pick ? `<span class="off pick">Pick</span>` : "";
  return `<article class="card${d.pick ? " is-pick" : ""}">
    <div class="tw">${thumb(d)}${badge}<button class="heart${watched(d) ? " on" : ""}" type="button" data-w="${d.id}" aria-pressed="${watched(d)}" aria-label="Save ${esc(d.name)} to My list">${heartSvg}</button></div>
    <div class="body">
      <div class="top"><span class="r">${d.top ? `#<b>${d.rank}</b>`  : ""}</span><span class="c">${esc(d.cat)}</span>${d.isNew ? `<span class="pill new">${T("newBadge")}</span>` : ""}<span class="pill ${d.status}">${d.region === "live" ? esc(SHOPS[d.shop] ? SHOPS[d.shop].name : d.shop) : LABEL[d.status]}</span></div>
      <button class="name" type="button" data-d="${d.id}">${esc(d.name)}</button>
      <div class="priceline">${priceLine(d)}</div>
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
  targetCols = Math.max(1, Math.min(5, Math.floor((vw + gap) / (310 + gap))));

  // Card width: fill available width with gap between columns
  const cardW = Math.max(160, Math.floor((vw - gap * (targetCols - 1)) / targetCols));

  // Card height: aspect ratio ~2:1, clamped for readability
  const cardH = vh < 760 ? 156 : 168;

  // On mobile: infinite scroll, perPage not used for layout — use generous default
  if (mob) {
    const root = document.documentElement;
    root.style.setProperty("--card-w", cardW + "px");
    root.style.setProperty("--card-h", cardH + "px");
    root.style.setProperty("--gap", gap + "px");
    g.style.setProperty("--cols", targetCols);
    perPage = targetCols * 6;
    return;
  }

  // Desktop: measure actual chrome heights from DOM for precise row calculation
  const barEl = document.querySelector(".bar");
  const pageheadEl = document.querySelector(".pagehead");
  const tabsEl = document.querySelector(".tabs");
  const headEl = panel ? panel.querySelector(".head") : null;
  const pagerEl = $("pager");

  const barH = barEl ? barEl.offsetHeight : 52;
  const pageheadH = (pageheadEl && !pageheadEl.hidden) ? pageheadEl.offsetHeight : 0;
  const tabsH = (tabsEl && getComputedStyle(tabsEl).display !== "none") ? tabsEl.offsetHeight : 0;
  const headH = headEl ? headEl.offsetHeight : 0;
  const pagerH = (pagerEl && !pagerEl.hidden) ? pagerEl.offsetHeight + 8 : 0;
  const panelPad = 22; // padding-block sum for desktop

  // Available height for the grid
  const availH = Math.max(cardH + gap, vh - barH - pageheadH - tabsH - headH - pagerH - panelPad);
  const rows = Math.max(2, Math.floor((availH + gap) / (cardH + gap)));

  // Apply CSS custom properties
  const root = document.documentElement;
  root.style.setProperty("--card-w", cardW + "px");
  root.style.setProperty("--card-h", cardH + "px");
  root.style.setProperty("--gap", gap + "px");
  g.style.setProperty("--cols", targetCols);

  perPage = targetCols * rows;
}
function emptyState() {
  if (state.tab === "list" && !state.watch.length)
    return `<div class="empty"><b>${T("emptyList")}</b>${T("emptyListSub")}</div>`;
  return `<div class="empty"><b>${T("emptySearch")}</b>${T("emptySearchSub")} <button class="linkbtn" type="button" data-reset>${T("resetFilters")}</button></div>`;
}

/* Featured picks: best live deals, one per category, Amazon first when it has a strong deal. Shown above the list on the Live and US tabs. */
function featuredPicks(pool) {
  const ok = pool.filter(d => d.show != null && d.reg && d.off >= 30 && d.shop).sort((a, b) => chfSave(b) - chfSave(a));
  const seen = new Set(), out = [];
  const take = d => { if (!d || seen.has(d.cat) || out.length >= 6) return; seen.add(d.cat); out.push(d); };
  take(ok.find(d => /^amazon/.test(d.shop)));
  ok.forEach(take);
  return out;
}
const FEATURED = { live: featuredPicks(LIVE), us: featuredPicks(US) };
function waLink(f) {
  const txt = "🔥 " + S.featTitle + "\n" + f.slice(0, 3).map(d => `• ${d.name}: ${money(d.show, d.cur)} (−${d.off}%)`).join("\n") + "\n" + location.origin + "/?utm_source=whatsapp&utm_medium=share&utm_campaign=featured";
  return "https://wa.me/?text=" + encodeURIComponent(txt);
}
function renderFeatured() {
  const el = $("featured"), f = FEATURED[state.tab];
  const plain = !state.q && state.cat === "All" && state.store === "all" && state.price === "all" && state.status === "all" && !state.drops && state.page === 0;
  if (!f || !f.length || !plain) { el.hidden = true; return; }
  el.hidden = false;
  el.innerHTML = `<div class="fp-h"><b>${S.featTitle}</b><span>${S.featSub}</span><a class="fp-wa" href="${waLink(f)}" target="_blank" rel="noopener">WhatsApp</a></div><div class="fp-row">` + f.map(d => {
    const href = d.url || (SHOPS[d.shop] ? SHOPS[d.shop].search(d.q) : null);
    const inner = `<span class="fp-off">−${d.off}%</span><span class="fp-name">${esc(d.name)}</span><span class="fp-price"><b>${money(d.show, d.cur)}</b> <s>${money(d.reg, d.cur)}</s></span><span class="fp-shop">${SHOPS[d.shop] ? SHOPS[d.shop].name : esc(d.shop)}${d.until ? " · " + S.untilLabel(fmtDay(d.until)) : ""}</span>`;
    return href ? `<a class="fp" href="${affLink(d.shop, href)}" target="_blank" rel="sponsored nofollow noopener">${inner}</a>` : `<div class="fp">${inner}</div>`;
  }).join("") + "</div>";
}
function renderGrid() {
  renderFeatured();
  fit();
  const l = list(), m = mobile();
  let vis;
  if (m) {
    vis = l.slice(0, mobileShown);
    $("more-wrap").hidden = l.length <= mobileShown;
    $("info-m").textContent = `${vis.length} of ${l.length.toLocaleString("en-US")}`;
    $("pager").hidden = true;
  } else {
    const pages = Math.max(1, Math.ceil(l.length / perPage));
    state.page = Math.min(Math.max(0, state.page), pages - 1);
    vis = l.slice(state.page * perPage, (state.page + 1) * perPage);
    $("pager").hidden = false; $("more-wrap").hidden = true;
    $("info").textContent = l.length ? S.pageInfo(state.page + 1, pages, l.length.toLocaleString(LANG === "en" ? "en-US" : LANG)) : `0 ${T("deals")}`;
    $("prev").disabled = state.page === 0; $("next").disabled = state.page >= pages - 1;
  }
  $("grid").innerHTML = vis.length ? vis.map(card).join("") : emptyState();
  $("count").textContent = `${l.length.toLocaleString(LANG === "en" ? "en-US" : LANG)} ${T("deals")}`;
  const filtered = state.drops || state.q || state.store !== "all" || state.price !== "all" || state.status !== "all" || (state.cat !== "All" && (state.tab === "categories" || state.tab === "top")) || (state.cat !== "All" && (state.tab === "us" || state.tab === "live"));
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
  $("usbar").hidden = t !== "us";
  $("livebar").hidden = t !== "live" && t !== "best";
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
  if (!TABS.includes(t)) t = "top";
  if (state.tab !== t && !opts.keep) { state.page = 0; mobileShown = 12; if (!opts.cat) state.cat = "All"; }
  if (opts.cat) state.cat = opts.cat;
  state.tab = t; save();
  TABS.forEach(x => { const b = $("t-" + x); b.setAttribute("aria-selected", x === t); b.tabIndex = x === t ? 0 : -1; });
  document.querySelectorAll(".bottomnav [data-tab]").forEach(b => b.classList.toggle("on", b.dataset.tab === t));
  $("b-more").classList.toggle("on", ["categories", "us", "calendar", "retailers", "guide"].includes(t));
  const products = PRODUCT_TABS.includes(t);
  $("p-products").hidden = !products;
  ["calendar", "retailers", "guide"].forEach(x => $("p-" + x).hidden = x !== t);
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
  toast(i >= 0 ? T("removedToast") : T("savedToast"));
  if (PRODUCT_TABS.includes(state.tab)) { if (state.tab === "list") renderFilters(); renderGrid(); }
}

/* ---------------- static sections ---------------- */
function ics(e) {
  const d = e.date.replace(/-/g, ""), next = new Date(e.date + "T12:00:00Z"); next.setUTCDate(next.getUTCDate() + 1);
  const d2 = next.toISOString().slice(0, 10).replace(/-/g, "");
  const body = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Aktion.ch//Black Friday 2026//EN", "BEGIN:VEVENT", `UID:${d}-${slug(e.title)}@aktion.ch`,
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
  $("n-cat").textContent = POOLS.categories.length.toLocaleString("en-US");
  $("n-live").textContent = LIVE.length;
  $("n-best").textContent = BEST.length;
  $("n-us").textContent = US.length + US_LINES.length;
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
  if (state.theme) document.documentElement.setAttribute("data-theme", state.theme);
  else document.documentElement.removeAttribute("data-theme");
}

/* ---------------- events ---------------- */
const refresh = () => { state.page = 0; mobileShown = 12; save(); renderGrid(); };
document.querySelectorAll("[data-tab]").forEach(b => b.addEventListener("click", () => showTab(b.dataset.tab)));
document.querySelectorAll("[data-cat]").forEach(b => b.addEventListener("click", () => showTab("categories", { cat: b.dataset.cat })));
$("go-list").onclick = () => showTab("list");
$("b-more").onclick = e => { e.stopPropagation(); $("moresheet").hidden = !$("moresheet").hidden; };
$("moresheet").onclick = e => { if (e.target.id === "moresheet") $("moresheet").hidden = true; };
$("catChips").onclick = e => { const b = e.target.closest("[data-chip]"); if (!b) return; state.cat = b.dataset.chip; state.page = 0; mobileShown = 12; renderFilters(); renderGrid(); save(); };
$("catSel").onchange = e => { state.cat = e.target.value; state.page = 0; mobileShown = 12; renderFilters(); renderGrid(); save(); try { history.replaceState(null, "", "#" + (state.cat === WINTER ? "winter" : state.tab)); } catch (er) {} };
$("store").onchange = e => { state.store = e.target.value; refresh(); };
$("price").onchange = e => { state.price = e.target.value; refresh(); };
$("status").onchange = e => { state.status = e.target.value; refresh(); };
$("sort").onchange = e => { state.sort = e.target.value; refresh(); };
$("q").oninput = e => {
  state.q = e.target.value;
  if (!PRODUCT_TABS.includes(state.tab)) showTab("top", { keep: true });
  renderFilters();
  refresh();
};
const resetFilters = () => { Object.assign(state, { q: "", store: "all", price: "all", status: "all", drops: false, cat: state.tab === "top" || state.tab === "list" ? "All" : "All" }); $("q").value = ""; renderFilters(); refresh(); };
$("reset").onclick = resetFilters;
$("clear-list").onclick = () => { state.watch = []; save(); updateCounts(); renderFilters(); renderGrid(); toast(T("clearedToast")); };
$("prev").onclick = () => { state.page--; save(); renderGrid(); };
$("next").onclick = () => { state.page++; save(); renderGrid(); };
$("more").onclick = () => { mobileShown += 12; renderGrid(); };
$("grid").onclick = e => {
  const w = e.target.closest("[data-w]"); if (w) return toggleWatch(w.dataset.w);
  const d = e.target.closest("[data-d]"); if (d) return openDetails(BY_ID.get(d.dataset.d));
  if (e.target.closest("[data-reset]")) resetFilters();
};
$("modal").onclick = e => { if (e.target.id === "modal") closeDetails(); };
$("theme").onclick = () => {
  const dark = state.theme ? state.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
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
    showTab(d.top ? "top" : d.region === "us" ? "us" : d.region === "live" ? "live" : "categories", { noHash: true, cat: d.top || d.region === "us" || d.region === "live" ? undefined : d.cat });
    return openDetails(d, false);
  }
  if (h === "winter") return showTab("categories", { cat: WINTER });
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
  const tabMap = { "t-live": "tabLive", "t-best": "tabBest", "t-top": "tabTop", "t-categories": "tabCat", "t-us": "tabUS",
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
    <option value="az">${T("sortAZ")}</option>`;
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
topDealsBanner();


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
