import { defineConfig } from "vite";
import { PAGES, LOCALE, HREFLANG, KEYWORDS } from "./src/config/pages.js";
import { STRINGS } from "./src/i18n.js";

/* SEO build step
   - one static HTML file per landing page (src/config/pages.js) with its own title, description,
     canonical, hreflang, Open Graph, visible H1 + intro and JSON-LD (rendered without JavaScript)
   - robots.txt and sitemap.xml (with hreflang alternates)
   Production URL: SITE_URL, else https://aktions.ch. */

const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const ld = o => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, "\\u003c")}</script>`;

async function loadData() {
  const [{ TOP, DEALS }, { US_RAW }, { EVENTS, FAQ, FAQ_I18N }, { WINTER_TYRES }] = await Promise.all([
    import("./src/data/products.js"), import("./src/data/us.js"), import("./src/data/calendar.js"), import("./src/data/winter-tyres.js")
  ]);
  const { LIVE_CH } = await import("./src/data/live-ch.js");
  const today = new Date().toISOString().slice(0, 10);
  const US = US_RAW.filter(r => !r[7] || r[7] >= today);
  const plus3 = iso => { const t = new Date(iso + "T12:00:00Z"); t.setUTCDate(t.getUTCDate() + 3); return t.toISOString().slice(0, 10); };
  const LIVE = LIVE_CH.filter(r => (!r.from || r.from <= today) && today <= (r.until || plus3(r.checked)));
  return { LIVE, TOP, DEALS, US, US_RAW: US, EVENTS, FAQ, FAQ_I18N, WINTER_TYRES, today };
}

/* ---- static, crawlable content (read by search engines and AI crawlers that don't run JavaScript; the app replaces it on load) ---- */
const SITE = "Aktion.ch";
const L = {
  en: { today: "Today", low: "Record low", reg: "Regular", upd: "Prices checked", list: "Deals on this page", loc: "en-GB" },
  de: { today: "Heute", low: "Tiefstpreis", reg: "Regulär", upd: "Preise geprüft am", list: "Angebote auf dieser Seite", loc: "de-CH" },
  fr: { today: "Aujourd'hui", low: "Prix le plus bas", reg: "Prix normal", upd: "Prix vérifiés le", list: "Offres sur cette page", loc: "fr-CH" },
  it: { today: "Oggi", low: "Prezzo minimo", reg: "Prezzo normale", upd: "Prezzi verificati il", list: "Offerte su questa pagina", loc: "it-CH" }
};
const chf = n => "CHF " + (Number.isInteger(n) ? n.toLocaleString("de-CH") : n.toLocaleString("de-CH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
const eur = n => "€ " + n.toLocaleString("de-CH", { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 });
const usd = n => "$" + n.toLocaleString("en-US", { minimumFractionDigits: Number.isInteger(n) ? 0 : 2 });
const faqFor = (lang, d) => (d.FAQ_I18N && d.FAQ_I18N[lang]) || d.FAQ;
const dateStr = (iso, lang) => new Date(iso + "T12:00:00Z").toLocaleDateString(L[lang].loc, { day: "numeric", month: "long", year: "numeric" });

function itemsFull(p, d) {
  if (p.tab === "live" || p.tab === "best") {
    const l = d.LIVE.map(r => ({ name: r.name, spec: [r.spec, r.shop, r.percent && r.price == null ? `−${r.percent}%` : "", r.code ? "Code " + r.code : "", r.until ? "bis " + r.until.split("-").reverse().join(".") : ""].filter(Boolean).join(" · "), price: r.price, reg: r.was, cur: r.cur || "CHF" }));
    return p.tab === "best" ? l.filter(x => x.price != null && x.reg && x.price <= x.reg * 0.75) : l;
  }
  if (p.tab === "us") return d.US.map(r => ({ name: r[1], spec: r[2], price: r[3], reg: r[4], cur: "USD" }));
  if (p.tab === "categories" && p.cat === "Winter tyres") return d.WINTER_TYRES.map(r => ({ name: r[1], spec: r[2] || "" }));
  if (p.tab === "categories") return d.DEALS.filter(x => !x.top && x.cat === p.cat).map(x => ({ name: x.name, spec: x.spec, price: x.now, cur: "CHF" }));
  if (p.tab === "top" || p.tab === "list") {
    const l = p.q ? d.TOP.filter(x => x.name.toLowerCase().includes(p.q.toLowerCase())) : d.TOP;
    return l.map(x => ({ name: x.name, spec: x.spec, price: x.now, bw: x.bw25, low: x.best ? x.best.p : null, cur: "CHF", status: x.status }));
  }
  return [];
}
function staticGrid(p, d) {
  const S = STRINGS[p.lang] || STRINGS.en, l = L[p.lang] || L.en;
  const st = { buy: S.statusBuy, wait: S.statusWaitS, track: S.statusTrack, check: S.statusCheck };
  const items = itemsFull(p, d).slice(0, p.tab === "live" ? 100 : 40);
  if (!items.length) return "";
  const li = items.map(x => {
    const m = x.cur === "USD" ? usd : x.cur === "EUR" ? eur : chf;
    const parts = [];
    if (x.price != null) parts.push(`${l.today}: <strong>${m(x.price)}</strong>`);
    if (x.reg != null) parts.push(`${l.reg}: ${m(x.reg)}`);
    if (x.low != null) parts.push(`${l.low}: ${m(x.low)}`);
    if (x.status && st[x.status]) parts.push(esc(st[x.status]));
    return `<li><b>${esc(x.name)}</b>${x.spec ? ` <span>${esc(x.spec)}</span>` : ""}${parts.length ? ` – ${parts.join(" · ")}` : ""}</li>`;
  }).join("");
  return `<section class="seo-static"><h2>${esc(l.list)}</h2><p>${esc(l.upd)} <time datetime="${d.today}">${dateStr(d.today, p.lang)}</time></p><ol>${li}</ol></section>`;
}
const staticCal = d => d.EVENTS.slice().sort((a, b) => a.date.localeCompare(b.date)).map(e =>
  `<li><time datetime="${e.date}">${e.date.split("-").reverse().join(".")}</time> <span class="reg">${esc(e.region)}</span> <strong>${esc(e.title)}</strong><p>${esc(e.text)}</p></li>`).join("");
const staticFaq = (lang, d) => faqFor(lang, d).map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("");
function daysToBF() { return Math.max(0, Math.ceil((new Date("2026-11-27T00:00:00+01:00") - Date.now()) / 864e5)); }

function itemsFor(p, d) {
  if (p.tab === "us") return US_names(d);
  if (p.tab === "categories" && p.cat === "Winter tyres") return d.WINTER_TYRES.map(r => r[1]);
  if (p.tab === "categories") return d.DEALS.filter(x => !x.top && x.cat === p.cat).map(x => x.name);
  if (p.tab === "top") {
    const l = p.q ? d.TOP.filter(x => x.name.toLowerCase().includes(p.q.toLowerCase())) : d.TOP;
    return l.map(x => x.name);
  }
  return [];
}
const US_names = d => d.US_RAW.map(r => r[1]);

function jsonLd(p, url, base, d) {
  const org = { "@type": "Organization", "@id": base + "/#org", name: SITE, url: base + "/", logo: base + "/icons/icon-512.png",
    description: "Independent Black Friday price tracker for Switzerland: CHF prices, price history and buy-or-wait advice." };
  const out = [{ "@context": "https://schema.org", "@graph": [org, { "@type": "WebSite", "@id": base + "/#website", name: SITE, url: base + "/",
    inLanguage: ["de-CH", "fr-CH", "it-CH", "en"], publisher: { "@id": base + "/#org" } }] }, {
    "@context": "https://schema.org", "@type": "WebPage", name: p.h1, description: p.description, url, inLanguage: HREFLANG[p.lang],
    dateModified: d.today, keywords: (KEYWORDS[p.path] || []).join(", "), publisher: { "@id": base + "/#org" },
    primaryImageOfPage: base + "/og-image.png",
    about: { "@type": "Event", name: "Black Friday 2026", startDate: "2026-11-27", location: { "@type": "Country", name: "Switzerland" } },
    isPartOf: { "@type": "WebSite", name: "Aktion.ch", url: base + "/" },
    breadcrumb: { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Aktion.ch", item: base + "/" },
      ...(p.path === "/" ? [] : [{ "@type": "ListItem", position: 2, name: p.h1, item: url }])] }
  }];
  const items = itemsFull(p, d).slice(0, 30);
  if (items.length) out.push({ "@context": "https://schema.org", "@type": "ItemList", name: p.h1, numberOfItems: items.length,
    itemListElement: items.map((x, i) => ({ "@type": "ListItem", position: i + 1,
      item: x.price != null ? { "@type": "Product", name: x.name, description: x.spec || undefined,
        offers: { "@type": "AggregateOffer", lowPrice: x.price, priceCurrency: x.cur, offerCount: 1, availability: "https://schema.org/InStock" } }
        : { "@type": "Thing", name: x.name } })) });
  if (p.tab === "calendar") out.push({ "@context": "https://schema.org", "@type": "ItemList", name: "Black Friday 2026 dates",
    itemListElement: d.EVENTS.map((e, i) => ({ "@type": "ListItem", position: i + 1, item: {
      "@type": "Event", name: e.title, startDate: e.date, endDate: e.date, description: e.text,
      eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode", eventStatus: "https://schema.org/EventScheduled",
      location: { "@type": "VirtualLocation", url } } })) });
  if (["guide", "calendar"].includes(p.tab) || p.group === "home") out.push({ "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faqFor(p.lang, d).map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) });
  return out.map(ld).join("\n");
}

function pageHtml(tpl, p, base, d) {
  const url = base + p.path;
  const alts = p.group ? PAGES.filter(x => x.group === p.group && x.path !== "/") : [];
  const head = [
    `<link rel="canonical" href="${url}">`,
    ...alts.map(a => `<link rel="alternate" hreflang="${HREFLANG[a.lang]}" href="${base + a.path}">`),
    alts.length ? `<link rel="alternate" hreflang="x-default" href="${base}/">` : "",
    `<meta property="og:url" content="${url}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta property="og:site_name" content="${SITE}">`,
    `<meta property="og:image" content="${base}/og-image.png">`, `<meta property="og:image:width" content="1200">`, `<meta property="og:image:height" content="630">`,
    `<meta property="og:image:alt" content="Black Friday Schweiz 2026 – Aktion.ch">`, `<meta name="twitter:image" content="${base}/og-image.png">`,
    KEYWORDS[p.path] ? `<meta name="keywords" content="${esc(KEYWORDS[p.path].join(", "))}">` : "",
    `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">`,
    `<link rel="alternate" type="text/plain" title="LLM summary" href="${base}/llms.txt">`,
    `<script>window.__PAGE__=${JSON.stringify({ path: p.path, lang: p.lang, tab: p.tab, cat: p.cat || null, q: p.q || null })}</script>`,
    jsonLd(p, url, base, d)
  ].filter(Boolean).join("\n");
  return tpl
    .replace(/<html lang="[^"]*">/, `<html lang="${HREFLANG[p.lang]}">`)
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(p.title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${esc(p.description)}`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${esc(p.title)}`)
    .replace(/(<meta property="og:description" content=")[^"]*/, `$1${esc(p.description)}`)
    .replace(/(<meta property="og:locale" content=")[^"]*/, `$1${LOCALE[p.lang]}`)
    .replace("</head>", head + "\n</head>")
    .replace(/<h1 id="ph1">[^<]*<\/h1>/, `<h1 id="ph1">${esc(p.h1)}</h1>`)
    .replace(/<p id="pintro">[^<]*<\/p>/, `<p id="pintro">${esc(p.intro)}</p>`)
    .replace('<div class="grid" id="grid"></div>', `<div class="grid" id="grid">${staticGrid(p, d)}</div>`)
    .replace('<ol class="cal" id="cal"></ol>', `<ol class="cal" id="cal">${staticCal(d)}</ol>`)
    .replace(/<div class="faq" id="faq"><\/div>|<div id="faq"[^>]*><\/div>/, m => m.replace("></div>", `>${staticFaq(p.lang, d)}</div>`))
    .replace(/(<h2 class="lead" id="lead">)[\s\S]*?(<\/h2>)/, (m, o, c) => {
      const S = STRINGS[p.lang] || STRINGS.en;
      const k = { live: "leadLive", best: "leadBest", top: "leadTop", list: "leadList", us: "leadUS", categories: "leadCat" }[p.tab];
      return k && S[k] ? o + S[k] + c : m;
    })
    .replace(/<b id="cd-d">\d+<\/b>/, `<b id="cd-d">${daysToBF()}</b>`)
    .replace(/(<input id="q" type="search" placeholder=")[^"]*/, `$1${esc((STRINGS[p.lang] || STRINGS.en).searchPlaceholder)}`)
    .replace(/(<button class="tab"[^>]*id="t-(\w+)"[^>]*>)([^<]*)/g, (m, open, id, label) => {
      const k = { live: "tabLive", best: "tabBest", top: "tabTop", categories: "tabCat", us: "tabUS", list: "tabList", calendar: "tabCal", retailers: "tabRetailers", guide: "tabGuide" }[id];
      const S = STRINGS[p.lang] || STRINGS.en; return open + esc((k && S[k]) || label);
    });
}

/* llms.txt (https://llmstxt.org): a plain-text summary AI assistants can read and cite. llms-full.txt adds all deals and FAQ. */
function llmsTxt(base, d) {
  const ev = d.EVENTS.slice().sort((a, b) => a.date.localeCompare(b.date));
  const pages = PAGES.map(p => `- [${p.h1}](${base + p.path}): ${p.description}`).join("\n");
  const facts = `## Key facts (updated ${d.today})

- Black Friday 2026: Friday 27 November 2026 (day after US Thanksgiving, 26 November).
- Black Week in Switzerland: Monday 23 – Sunday 29 November 2026. Cyber Monday: 30 November 2026. Singles Day: 11 November.
- Digitec and Galaxus Black Friday weeks: 16 – 30 November 2026 (1,000+ offers, all live from 16 November).
- Amazon US Black Friday Week and Cyber Monday: 19 – 30 November 2026. Amazon.de delivers many products to Switzerland; Swiss VAT (8.1%) is charged at checkout.
- Swiss shops tracked: Digitec, Galaxus, MediaMarkt, Interdiscount, Fust, Brack, Manor, fnac, Amazon.de, Samsung, Apple and others.
- Method: live deals are checked on the shop page or in dated deal reports and expire automatically. For the top 100 products we compare today's Swiss price with the 2026 record low. "Buy now" = today's price is within 3% of the best known price; "Wait" = it was cheaper before.
- Disclosure: shop links are affiliate links; rankings do not depend on commissions.`;
  const llms = `# ${SITE} – Black Friday Switzerland 2026

> Independent Black Friday 2026 price tracker for Switzerland (Schweiz, Suisse, Svizzera): live Swiss deals checked this week, the 100 most-wanted products with CHF prices, record low and a buy-or-wait call, plus 2,400+ products by category, a deal calendar, a retailer guide and live US deals. Languages: German, French, Italian, English.

${facts}

## Pages

${pages}

## More

- [All deals, dates and FAQ as text](${base}/llms-full.txt)
- [Sitemap](${base}/sitemap.xml)
`;
  const top = d.TOP.map((x, i) => `${i + 1}. ${x.name} (${x.spec})${x.now != null ? ` – today ${chf(x.now)}` : ""}${x.best ? `, record low ${chf(x.best.p)}` : ""} – ${{ buy: "Buy now", wait: "Wait for Black Friday", track: "Tracking", check: "Check price" }[x.status]}`).join("\n");
  const us = d.US.map(r => `- ${r[1]} (${r[2]}): ${usd(r[3])} instead of ${usd(r[4])} at ${r[5]}`).join("\n");
  const cal = ev.map(e => `- ${e.date} (${e.region}) ${e.title}: ${e.text}`).join("\n");
  const faq = ["en", "de", "fr", "it"].map(l => faqFor(l, d).map(([q, a]) => `**${q}**\n${a}`).join("\n\n")).join("\n\n");
  const live = d.LIVE.map(r => `- ${r.name} (${r.spec}) at ${r.shop}: ${r.price != null ? (r.cur === "EUR" ? eur(r.price) : chf(r.price)) + (r.was ? ` instead of ${r.cur === "EUR" ? eur(r.was) : chf(r.was)}` : "") : r.percent ? `−${r.percent}%` : r.type || "offer"}${r.code ? `, code ${r.code}` : ""}${r.until ? `, until ${r.until}` : ""}${r.note ? ` – ${r.note}` : ""}`).join("\n");
  const full = llms + `
## Live deals in Switzerland (checked ${d.today})

${live}

## Top 100 Black Friday products in Switzerland (prices checked ${d.today})

${top}

## Live US Black Friday deals (USD)

${us}

## Deal calendar 2026

${cal}

## FAQ

${faq}
`;
  return { llms, full };
}

function seoPages() {
  return {
    name: "seo-pages",
    enforce: "post",
    async generateBundle(_, bundle) {
      const host = process.env.SITE_URL || "https://aktions.ch";
      const base = host.replace(/\/$/, "");
      const tplAsset = bundle["index.html"];
      const tpl = String(tplAsset.source);
      const d = await loadData();
      for (const p of PAGES) {
        const html = pageHtml(tpl, p, base, d);
        if (p.path === "/") tplAsset.source = html;
        else this.emitFile({ type: "asset", fileName: p.path.replace(/^\//, "") + "index.html", source: html });
      }
      const aiBots = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User",
        "Google-Extended", "Applebot-Extended", "Bingbot", "DuckAssistBot", "Meta-ExternalAgent", "MistralAI-User", "CCBot"];
      this.emitFile({ type: "asset", fileName: "robots.txt", source:
        `# Search engines and AI assistants are welcome to read and cite this site.\nUser-agent: *\nAllow: /\nDisallow: /admin\n\n`
        + aiBots.map(b => `User-agent: ${b}\nAllow: /\n`).join("\n") + `\nSitemap: ${base}/sitemap.xml\n` });
      const { llms, full } = llmsTxt(base, d);
      this.emitFile({ type: "asset", fileName: "llms.txt", source: llms });
      this.emitFile({ type: "asset", fileName: "llms-full.txt", source: full });
      const today = new Date().toISOString().slice(0, 10);
      const urls = PAGES.map(p => {
        const alts = p.group ? PAGES.filter(x => x.group === p.group && x.path !== "/") : [];
        const links = alts.map(a => `\n    <xhtml:link rel="alternate" hreflang="${HREFLANG[a.lang]}" href="${base + a.path}"/>`).join("")
          + (alts.length ? `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${base}/"/>` : "");
        return `  <url>\n    <loc>${base + p.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>${p.priority.toFixed(1)}</priority>${links}\n  </url>`;
      }).join("\n");
      this.emitFile({ type: "asset", fileName: "sitemap.xml", source:
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
` });
    }
  };
}

export default defineConfig({
  plugins: [seoPages()],
  build: { target: "es2020", sourcemap: false, rollupOptions: { input: { main: "index.html", admin: "admin.html" } } }
});
