import "./styles.css";
import { affLink } from "./config/affiliates.js";
import { PARTNER_LINKS } from "./config/partners.js";
import { SHOPS } from "./config/shops.js";
import { WINTER_TYRES } from "./data/winter-tyres.js";
import { SHOPINFO } from "./data/retailers.js";
import { DEALS, isTyre } from "./data/products.js";
import { fmt, esc, ext, LABEL } from "./lib/format.js";
import { thumb } from "./lib/thumb.js";

/* ===================== UI: tabs + paged grid (fits the screen) ===================== */
const TABS = ["top","categories","retailers","guide"];
const WINTER = "Winter tyres";
/* tyre products live in the "Winter tyres" category and link to reifen-online.ch */
DEALS.forEach(d=>{ if(!d.top && isTyre(d.name)){ d.cat = WINTER; d.shops = ["reifenonline"]; } });
WINTER_TYRES.forEach(([t,n,s])=>{
  if (DEALS.some(d=>d.name===n)) return;
  DEALS.push({rank:DEALS.length+1, top:false, cat:WINTER, name:n, spec:`${t} tyre · ${s}`, now:null, bw25:null, low:null, lowAt:null, best:null, status:"live", save:0, show:null, q:n, note:"Pick your size at reifen-online.ch; delivery across Switzerland, often to a fitting garage.", shops:["reifenonline"]});
});
const OTHERS = DEALS.filter(d=>!d.top);
const CAT_ORDER = [WINTER, ...[...new Set(OTHERS.map(d=>d.cat))].filter(c=>c!==WINTER).sort((a,b)=>a.localeCompare(b))];
let state = {tab:"top", cat:"All", q:"", status:"all", sort:"rank", page:0};
try{ Object.assign(state, JSON.parse(localStorage.getItem("bf26v4")||"{}")); }catch(e){}
const save = () => { try{ localStorage.setItem("bf26v4", JSON.stringify(state)); }catch(e){} };
const $ = id => document.getElementById(id);
let perPage = 12;

function shopBtn(s, d, primary){
  return `<a class="shop${primary?" primary":""}" href="${affLink(s, SHOPS[s].search(d.q))}" target="_blank" rel="sponsored noopener">${SHOPS[s].name} ${ext}</a>`;
}
/* card shows 2 shops; Amazon stays visible when the product links to it */
function cardShops(d){
  const s = d.shops.slice(0,4);
  const first = s[0];
  const second = s.includes("amazon") && first!=="amazon" ? "amazon" : s[1];
  return [first, second].filter(Boolean);
}
function priceLine(d){
  if (d.show==null) return `<span class="price live">${d.status==="live"?"Live price at the shops":"Price to be confirmed"}</span>`;
  const best = d.best && d.now!=null && d.best.p < d.now ? `<span class="best">best ${fmt(d.best.p)}</span>` : (d.now==null && d.best ? `<span class="best">${esc(d.best.where)}</span>` : "");
  return `<span class="price">CHF ${fmt(d.show)}</span>${best}`;
}
function card(d){
  const i = DEALS.indexOf(d);
  return `<article class="card">${thumb(d)}<div class="body">
    <div class="top"><span class="r">${d.top?`#<b>${d.rank}</b>`:""}</span><span class="c">${esc(d.cat)}</span><span class="pill ${d.status}">${LABEL[d.status]}</span></div>
    <button class="name" type="button" data-i="${i}" title="Details">${esc(d.name)}</button>
    <div class="priceline">${priceLine(d)}</div>
    <div class="btns">${cardShops(d).map((s,k)=>shopBtn(s,d,k===0)).join("")}<button class="shop ghost info" type="button" data-i="${i}" aria-label="Details" title="Details">i</button></div>
  </div></article>`;
}
function list(){
  const term = state.q.trim().toLowerCase();
  let l = (state.tab==="top" ? DEALS.filter(d=>d.top) : OTHERS)
    .filter(d => (state.tab==="top" || state.cat==="All" || d.cat===state.cat)
      && (state.status==="all" || d.status===state.status)
      && (!term || (d.name+" "+d.spec+" "+d.cat).toLowerCase().includes(term)));
  const by = {rank:(a,b)=>a.rank-b.rank, save:(a,b)=>b.save-a.save||a.rank-b.rank,
    low:(a,b)=>(a.show??1e9)-(b.show??1e9)||a.rank-b.rank, high:(a,b)=>(b.show??-1)-(a.show??-1)||a.rank-b.rank,
    az:(a,b)=>a.name.localeCompare(b.name)};
  return l.sort(by[state.sort]||by.rank);
}
function fit(){
  const g = $("grid"), cs = getComputedStyle(document.documentElement);
  const cw = parseFloat(cs.getPropertyValue("--card-w"))||300, ch = parseFloat(cs.getPropertyValue("--card-h"))||150, gap = parseFloat(cs.getPropertyValue("--gap"))||10;
  const W = g.clientWidth || 900, H = g.clientHeight;
  const cols = Math.max(1, Math.floor((W+gap)/(cw+gap)));
  const scrolling = getComputedStyle(document.body).overflowY !== "hidden" || !H;
  const rows = scrolling ? 6 : Math.max(1, Math.floor((H+gap)/(ch+gap)));
  g.style.setProperty("--cols", cols);
  perPage = cols*rows;
}
function renderGrid(){
  fit();
  const l = list(), pages = Math.max(1, Math.ceil(l.length/perPage));
  state.page = Math.min(Math.max(0,state.page), pages-1);
  const vis = l.slice(state.page*perPage, (state.page+1)*perPage);
  $("grid").innerHTML = vis.length ? vis.map(card).join("") : `<div class="empty">No products match. Clear the search or choose another category.</div>`;
  $("info").textContent = l.length ? `Page ${state.page+1} / ${pages} · ${l.length.toLocaleString("en-US")} products` : "0 products";
  $("prev").disabled = state.page===0; $("next").disabled = state.page>=pages-1;
}
function renderCats(){
  const s = $("catSel");
  s.hidden = state.tab!=="categories";
  $("winterbar").hidden = !(state.tab==="categories" && state.cat===WINTER);
  if (s.hidden) return;
  const n = cat => cat==="All" ? OTHERS.length : OTHERS.filter(d=>d.cat===cat).length;
  s.innerHTML = ["All",...CAT_ORDER].map(cat=>`<option value="${esc(cat)}"${cat===state.cat?" selected":""}>${cat==="All"?"All categories":esc(cat)}${cat===WINTER?" ❄":""} (${n(cat).toLocaleString("en-US")})</option>`).join("");
}
function showTab(t, push){
  if (!TABS.includes(t)) t = "top";
  state.tab = t; save();
  TABS.forEach(x=>$("t-"+x).setAttribute("aria-selected", x===t));
  const products = t==="top"||t==="categories";
  $("p-products").hidden = !products; $("p-retailers").hidden = t!=="retailers"; $("p-guide").hidden = t!=="guide";
  if (products){
    $("lead").innerHTML = t==="top" ? "Top <em>100</em> offers" : (state.cat==="All" ? "All <em>categories</em>" : esc(state.cat));
    $("status").hidden = t!=="top";
    if (t!=="top") state.status = "all";
    $("status").value = state.status;
    renderCats(); renderGrid();
  }
  if (push){ try{ history.replaceState(null,"","#"+t); }catch(e){} }
}
function openDetails(d){
  const rows = [];
  if (d.now!=null) rows.push(`<dt>Today in CH</dt><dd>CHF ${fmt(d.now)}</dd>`);
  if (d.bw25!=null) rows.push(`<dt>Black Week 2025</dt><dd>CHF ${fmt(d.bw25)}</dd>`);
  if (d.low!=null) rows.push(`<dt>Record low</dt><dd>CHF ${fmt(d.low)}${d.lowAt?` · ${esc(d.lowAt)}`:""}</dd>`);
  if (d.best && d.status!=="check") rows.push(`<dt>Buy at or below</dt><dd class="target">CHF ${fmt(d.best.p)}</dd>`);
  rows.push(`<dt>Status</dt><dd>${LABEL[d.status]}</dd>`);
  $("sheet").innerHTML = `${thumb(d)}<div class="in">
    <button class="close" type="button" id="m-close" aria-label="Close">×</button>
    <div class="eyebrow">${d.top?`#${d.rank} · `:""}${esc(d.cat)}</div>
    <h3 id="m-title">${esc(d.name)}</h3><div class="spec">${esc(d.spec)}</div>
    <dl>${rows.join("")}</dl>
    ${d.note?`<p class="note">${esc(d.note)}</p>`:""}
    <div class="btns">${d.shops.map((s,k)=>shopBtn(s,d,k===0)).join("")}<a class="shop ghost" href="${affLink("toppreise", SHOPS.toppreise.search(d.q))}" target="_blank" rel="sponsored noopener">Price history ${ext}</a></div>
  </div>`;
  $("modal").hidden = false; $("m-close").focus();
  $("m-close").onclick = closeDetails;
}
function closeDetails(){ $("modal").hidden = true; }
function renderShops(){
  $("shopRows").innerHTML = SHOPINFO.map(([k,n,best,pat,warn,home])=>
    `<tr><td class="nm">${n}</td><td>${best}</td><td>${pat}</td><td>${warn}</td><td><a class="go" href="${affLink(k,home)}" target="_blank" rel="sponsored noopener">Visit ${ext}</a></td></tr>`).join("");
}
function renderWinter(){
  $("winter-cta").innerHTML = PARTNER_LINKS.map((l,i)=>`<a class="${i===0?"primary":""}" href="${esc(l.url)}" target="_blank" rel="sponsored noopener">${esc(l.label)} ${ext}</a>`).join("");
  return; $("tyres").innerHTML = WINTER_TYRES.map(([t,n,d])=>`<article class="tyre"><span class="t">${t}</span><h3>${esc(n)}</h3><p>${esc(d)}</p><a href="${esc(PARTNER_LINKS[0].url)}" target="_blank" rel="sponsored noopener">Check sizes at reifen-online.ch ${ext}</a></article>`).join("");
}
function tick(){
  const ms = Math.max(0, new Date("2026-11-27T00:00:00+01:00").getTime() - Date.now());
  const p = n => String(n).padStart(2,"0");
  $("cd-d").textContent = Math.floor(ms/864e5);
  $("cd-h").textContent = p(Math.floor(ms%864e5/36e5));
  $("cd-m").textContent = p(Math.floor(ms%36e5/6e4));
}

/* events */
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{ state.page=0; showTab(b.dataset.tab,true); });
$("catSel").onchange = e=>{ state.cat=e.target.value; state.page=0; save(); showTab("categories"); };
$("q").oninput = e=>{ state.q=e.target.value; state.page=0; save(); renderGrid(); };
$("status").onchange = e=>{ state.status=e.target.value; state.page=0; save(); renderGrid(); };
$("sort").onchange = e=>{ state.sort=e.target.value; state.page=0; save(); renderGrid(); };
$("prev").onclick = ()=>{ state.page--; save(); renderGrid(); };
$("next").onclick = ()=>{ state.page++; save(); renderGrid(); };
$("grid").onclick = e=>{ const b=e.target.closest("[data-i]"); if(b) openDetails(DEALS[+b.dataset.i]); };
$("modal").onclick = e=>{ if(e.target.id==="modal") closeDetails(); };
document.addEventListener("keydown", e=>{
  if (e.key==="Escape" && !$("modal").hidden) return closeDetails();
  if (!$("modal").hidden || /INPUT|SELECT|TEXTAREA/.test(document.activeElement?.tagName||"") || $("p-products").hidden) return;
  if (e.key==="ArrowRight" && !$("next").disabled) $("next").click();
  if (e.key==="ArrowLeft" && !$("prev").disabled) $("prev").click();
});
let rt; window.addEventListener("resize", ()=>{ clearTimeout(rt); rt=setTimeout(()=>{ if(!$("p-products").hidden) renderGrid(); },120); });

/* init */
$("q").value = state.q; $("sort").value = state.sort;
$("n-cat").textContent = OTHERS.length.toLocaleString("en-US");
renderShops(); renderWinter(); tick(); setInterval(tick, 30000);
const h0 = location.hash.replace("#","");
if (h0==="winter"){ state.cat = WINTER; state.page = 0; showTab("categories"); }
else showTab(TABS.includes(h0) ? h0 : state.tab);
