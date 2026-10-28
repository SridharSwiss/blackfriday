import "./styles.css";
import { affLink } from "./config/affiliates.js";
import { PARTNER_LINKS } from "./config/partners.js";
import { SHOPS } from "./config/shops.js";
import { WINTER_TYRES } from "./data/winter-tyres.js";
import { SHOPINFO } from "./data/retailers.js";
import { DEALS, isTyre } from "./data/products.js";
import { US_RAW, US_SHOPINFO } from "./data/us.js";
import { EVENTS, FAQ } from "./data/calendar.js";
import { fmt, esc, ext } from "./lib/format.js";
import { thumb } from "./lib/thumb.js";
import { STRINGS, detectLang, LANG_PATHS } from "./i18n.js";

/* ---------------- i18n ---------------- */
const PAGE = window.__PAGE__ || null;
const LANG = (PAGE?.lang) || detectLang();
const S = STRINGS[LANG] || STRINGS.en;
const T = key => S[key] ?? STRINGS.en[key] ?? key;

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
DEALS.forEach(d => { d.region = "ch"; d.cur = "CHF"; d.id = "ch-" + slug(d.name); d.pick = d.top && d.status === "buy"; });

// US products: last year's Black Friday price vs regular price, in USD
const US = US_RAW.map(([cat, name, spec, bf, reg, retailer, q], i) => {
  const others = ["amazoncom", "bestbuy", "walmart", "target"].filter(s => s !== retailer);
  return { region: "us", cur: "USD", id: "us-" + slug(name), rank: i + 1, top: false, cat, name, spec, q,
    now: null, bw25: bf, reg, low: null, lowAt: null, best: { p: bf, where: "Black Friday 2025" }, show: bf,
    save: reg - bf, off: Math.round((1 - bf / reg) * 100), status: /2026/.test(spec) ? "early" : "lastyear", note: null, pick: (1 - bf / reg) >= 0.35,
    shops: [retailer, ...others.slice(0, 2)] };
});
const ALL = DEALS.concat(US);
const BY_ID = new Map(ALL.map(d => [d.id, d]));
const POOLS = {
  top: DEALS.filter(d => d.top),
  categories: DEALS.filter(d => !d.top),
  us: US
};
const CAT_ORDER = cats => [...new Set(cats)].sort((a, b) => a === WINTER ? -1 : b === WINTER ? 1 : a.localeCompare(b));
const LABEL = { buy: T("statusBuy"), wait: T("statusWait"), track: T("statusTrack"), check: T("statusCheck"), live: T("statusLive"), lastyear: T("statusLY"), early: T("statusEarly") };

/* ---------------- state ---------------- */
const PRODUCT_TABS = ["top", "categories", "us", "list"];
const TABS = [...PRODUCT_TABS, "calendar", "retailers", "guide"];
const defaults = { tab: "top", cat: "All", q: "", status: "all", sort: "rank", store: "all", price: "all", page: 0 };
let state = { ...defaults, watch: [], theme: "" };
try { Object.assign(state, JSON.parse(localStorage.getItem("bf26v5") || "{}")); } catch (e) {}
state.watch = Array.isArray(state.watch) ? state.watch.filter(id => BY_ID.has(id)) : [];
const save = () => { try { localStorage.setItem("bf26v5", JSON.stringify(state)); } catch (e) {} };
const $ = id => document.getElementById(id);
const mobile = () => matchMedia("(max-width: 760px), (max-height: 560px)").matches;
let perPage = 12, mobileShown = 12;

/* ---------------- helpers ---------------- */
const money = (n, cur) => cur === "USD" ? "$" + (Number.isInteger(n) ? n.toLocaleString("en-US") : n.toLocaleString("en-US", { minimumFractionDigits: 2 })) : "CHF " + fmt(n);
const heartSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-9-8.7C1.5 7.8 4 4.5 7.3 4.5c2 0 3.5 1.1 4.7 2.7 1.2-1.6 2.7-2.7 4.7-2.7 3.3 0 5.8 3.3 4.3 6.8-2 4.3-9 8.7-9 8.7z"/></svg>';
const watched = d => state.watch.includes(d.id);
function toast(msg) {
  const t = $("toast"); t.textContent = msg; t.hidden = false;
  clearTimeout(toast.t); toast.t = setTimeout(() => t.hidden = true, 2200);
}
function shopBtn(s, d, primary) {
  return `<a class="shop${primary ? " primary" : ""}" href="${affLink(s, SHOPS[s].search(d.q))}" target="_blank" rel="sponsored nofollow noopener">${SHOPS[s].name} ${ext}</a>`;
}
function cardShops(d) {
  const s = d.shops.slice(0, 4), first = s[0];
  const second = d.region === "ch" && s.includes("amazon") && first !== "amazon" ? "amazon" : s[1];
  return [first, second].filter(Boolean);
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
  const l = (global ? ALL : pool()).filter(d =>
    (global || state.cat === "All" || d.cat === state.cat || state.tab === "top" || state.tab === "list") &&
    (state.status === "all" || d.status === state.status) &&
    (state.store === "all" || d.shops.includes(state.store)) &&
    inRange(d) &&
    (!term || (d.name + " " + d.spec + " " + d.cat).toLowerCase().includes(term)));
  const by = {
    rank: (a, b) => (a.region === b.region ? a.rank - b.rank : a.region === "ch" ? -1 : 1),
    save: (a, b) => (b.off ?? (b.now ? b.save / b.now * 100 : 0)) - (a.off ?? (a.now ? a.save / a.now * 100 : 0)) || a.rank - b.rank,
    low: (a, b) => (a.show ?? 1e9) - (b.show ?? 1e9) || a.rank - b.rank,
    high: (a, b) => (b.show ?? -1) - (a.show ?? -1) || a.rank - b.rank,
    az: (a, b) => a.name.localeCompare(b.name)
  };
  return l.sort(by[state.sort] || by.rank);
}
function priceLine(d) {
  if (d.show == null) return `<span class="price live">${d.status === "live" ? T("statusLive") : T("statusCheck")}</span>`;
  let extra = "";
  if (d.region === "us") extra = `<span class="was">${money(d.reg, "USD")}</span>`;
  else if (d.best && d.now != null && d.best.p < d.now) extra = `<span class="best">best ${fmt(d.best.p)}</span>`;
  else if (d.now == null && d.best) extra = `<span class="best">${esc(d.best.where)}</span>`;
  return `<span class="price">${money(d.show, d.cur)}</span>${extra}`;
}
function card(d) {
  const badge = d.off ? `<span class="off">−${d.off}%</span>` : d.pick ? `<span class="off pick">Pick</span>` : "";
  return `<article class="card${d.pick ? " is-pick" : ""}">
    <div class="tw">${thumb(d)}${badge}<button class="heart${watched(d) ? " on" : ""}" type="button" data-w="${d.id}" aria-pressed="${watched(d)}" aria-label="Save ${esc(d.name)} to My list">${heartSvg}</button></div>
    <div class="body">
      <div class="top"><span class="r">${d.top ? `#<b>${d.rank}</b>`  : ""}</span><span class="c">${esc(d.cat)}</span><span class="pill ${d.status}">${LABEL[d.status]}</span></div>
      <button class="name" type="button" data-d="${d.id}">${esc(d.name)}</button>
      <div class="priceline">${priceLine(d)}</div>
      <div class="btns">${cardShops(d).map((s, k) => shopBtn(s, d, k === 0)).join("")}<button class="shop ghost info" type="button" data-d="${d.id}" aria-label="Details for ${esc(d.name)}">i</button></div>
    </div></article>`;
}
function fit() {
  const g = $("grid"), cs = getComputedStyle(document.documentElement);
  const cw = parseFloat(cs.getPropertyValue("--card-w")) || 300, ch = parseFloat(cs.getPropertyValue("--card-h")) || 156, gap = parseFloat(cs.getPropertyValue("--gap")) || 10;
  const cols = Math.max(1, Math.floor(((g.clientWidth || 900) + gap) / (cw + gap)));
  const vh = window.innerHeight || 800;
  const rows = mobile() ? 6 : Math.max(3, Math.floor((vh * 0.65 + gap) / (ch + gap)));
  g.style.setProperty("--cols", cols);
  perPage = cols * rows;
}
function emptyState() {
  if (state.tab === "list" && !state.watch.length)
    return `<div class="empty"><b>${T("emptyList")}</b>${T("emptyListSub")}</div>`;
  return `<div class="empty"><b>${T("emptySearch")}</b>${T("emptySearchSub")} <button class="linkbtn" type="button" data-reset>${T("resetFilters")}</button></div>`;
}
function renderGrid() {
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
  const filtered = state.q || state.store !== "all" || state.price !== "all" || state.status !== "all" || (state.cat !== "All" && state.tab === "categories") || (state.cat !== "All" && state.tab === "us");
  $("reset").hidden = !filtered;
}
function renderFilters() {
  const t = state.tab, p = pool();
  const catVis = t === "categories" || t === "us";
  $("catSel").hidden = !catVis;
  if (catVis) {
    const cats = CAT_ORDER(p.map(d => d.cat));
    if (!cats.includes(state.cat)) state.cat = "All";
    const n = c => c === "All" ? p.length : p.filter(d => d.cat === c).length;
    $("catSel").innerHTML = ["All", ...cats].map(c => `<option value="${esc(c)}"${c === state.cat ? " selected" : ""}>${c === "All" ? T("allCats") : esc(c)}${c === WINTER ? " ❄" : ""} (${n(c).toLocaleString(LANG === "en" ? "en-US" : LANG)})</option>`).join("");
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
  $("clear-list").hidden = !(t === "list" && state.watch.length);
  const locN = n => n.toLocaleString(LANG === "en" ? "en-US" : LANG);
  const lead = {
    top: [T("leadTop"), T("leadTopSub")],
    categories: [state.cat === "All" ? T("leadCat") : esc(state.cat), S.leadCatSub(locN(POOLS.categories.length))],
    us: [state.cat === "All" ? T("leadUS") : `US · ${esc(state.cat)}`, T("leadUSSub")],
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
  $("b-more").classList.toggle("on", ["calendar", "retailers", "guide"].includes(t));
  const products = PRODUCT_TABS.includes(t);
  $("p-products").hidden = !products;
  ["calendar", "retailers", "guide"].forEach(x => $("p-" + x).hidden = x !== t);
  if (products) { renderFilters(); renderGrid(); }
  if (!opts.noHash) { try { history.replaceState(null, "", "#" + (t === "categories" && state.cat === WINTER ? "winter" : t)); } catch (e) {} }
  $("moresheet").hidden = true;
  if (mobile()) window.scrollTo({ top: 0 });
}

/* ---------------- details pop-up ---------------- */
function chart(d) {
  const pts = [];
  if (d.reg) pts.push(["Regular price", d.reg]);
  if (d.bw25 != null) pts.push([d.region === "us" ? (d.status === "early" ? "Early deal 2026" : "Black Friday 2025") : "Black Week 2025", d.bw25]);
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
  if (d.region === "us") {
    rows.push(`<dt>${d.status === "early" ? T("earlyDeal") : T("bfPrice")}</dt><dd>${money(d.bw25, "USD")}</dd>`, `<dt>${T("regularPrice")}</dt><dd>${money(d.reg, "USD")}</dd>`, `<dt>${T("saving")}</dt><dd class="target">−${d.off}%</dd>`);
  } else {
    if (d.best && d.status !== "check") rows.push(`<dt>${T("targetPrice")}</dt><dd class="target">CHF ${fmt(d.best.p)}</dd>`);
    if (d.lowAt) rows.push(`<dt>${T("recordLowAt")}</dt><dd>${esc(d.lowAt)}</dd>`);
  }
  rows.push(`<dt>${T("status")}</dt><dd>${LABEL[d.status]}</dd>`);
  const shops = d.shops.map((s, k) => shopBtn(s, d, k === 0)).join("");
  const hist = d.region === "ch" ? `<a class="shop ghost" href="${affLink("toppreise", SHOPS.toppreise.search(d.q))}" target="_blank" rel="sponsored nofollow noopener">${T("swissPriceHist")} ${ext}</a>` : "";
  $("sheet").innerHTML = `${thumb(d)}<div class="in">
    <button class="close" type="button" id="m-close" aria-label="Close">×</button>
    <div class="eyebrow">${d.top ? `#${d.rank} · ` : ""}${d.region === "us" ? "US deal · " : ""}${esc(d.cat)}</div>
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
}
function renderStatic() {
  $("winter-cta").innerHTML = PARTNER_LINKS.map((l, i) => `<a class="${i === 0 ? "primary" : ""}" href="${esc(l.url)}" target="_blank" rel="sponsored nofollow noopener">${esc(l.label)} ${ext}</a>`).join("");
  $("faq").innerHTML = FAQ.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("");
  $("n-cat").textContent = POOLS.categories.length.toLocaleString("en-US");
  $("n-us").textContent = US.length;
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
const resetFilters = () => { Object.assign(state, { q: "", store: "all", price: "all", status: "all", cat: state.tab === "top" || state.tab === "list" ? "All" : "All" }); $("q").value = ""; renderFilters(); refresh(); };
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
    showTab(d.top ? "top" : d.region === "us" ? "us" : "categories", { noHash: true, cat: d.top || d.region === "us" ? undefined : d.cat });
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
  const tabMap = { "t-top": "tabTop", "t-categories": "tabCat", "t-us": "tabUS",
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
  const bnMap = { "b-top": "tabTop", "b-categories": "tabCat", "b-us": "tabUS", "b-list": "tabList", "b-more": "moreLabel" };
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
// PAGE already declared at top (i18n block) — reuse it here
$("pmore").onclick = () => { const o = $("pagehead").classList.toggle("open"); $("pmore").setAttribute("aria-expanded", o); $("pmore").textContent = o ? T("showLess") : T("showMore"); };
if (location.hash) route();
else if (PAGE && PAGE.path !== "/") {
  state.q = PAGE.q || ""; $("q").value = state.q;
  showTab(PAGE.tab, { cat: PAGE.cat || undefined, noHash: true });
} else showTab(state.tab, { keep: true });
