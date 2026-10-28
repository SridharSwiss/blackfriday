import { defineConfig } from "vite";
import { PAGES, LOCALE, HREFLANG } from "./src/config/pages.js";

/* SEO build step
   - one static HTML file per landing page (src/config/pages.js) with its own title, description,
     canonical, hreflang, Open Graph, visible H1 + intro and JSON-LD (rendered without JavaScript)
   - robots.txt and sitemap.xml (with hreflang alternates)
   Production URL: SITE_URL, else VERCEL_PROJECT_PRODUCTION_URL (set by Vercel). */

const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const ld = o => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, "\\u003c")}</script>`;

async function loadData() {
  const [{ TOP, DEALS }, { US_RAW }, { EVENTS, FAQ }, { WINTER_TYRES }] = await Promise.all([
    import("./src/data/products.js"), import("./src/data/us.js"), import("./src/data/calendar.js"), import("./src/data/winter-tyres.js")
  ]);
  return { TOP, DEALS, US_RAW, EVENTS, FAQ, WINTER_TYRES };
}

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
  const out = [{
    "@context": "https://schema.org", "@type": "WebPage", name: p.h1, description: p.description, url, inLanguage: HREFLANG[p.lang],
    dateModified: new Date().toISOString().slice(0, 10),
    isPartOf: { "@type": "WebSite", name: "Aktion.ch", url: base + "/" },
    breadcrumb: { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Aktion.ch", item: base + "/" },
      ...(p.path === "/" ? [] : [{ "@type": "ListItem", position: 2, name: p.h1, item: url }])] }
  }];
  const names = itemsFor(p, d).slice(0, 30);
  if (names.length) out.push({ "@context": "https://schema.org", "@type": "ItemList", name: p.h1, numberOfItems: names.length,
    itemListElement: names.map((n, i) => ({ "@type": "ListItem", position: i + 1, name: n })) });
  if (p.tab === "calendar") out.push({ "@context": "https://schema.org", "@type": "ItemList", name: "Black Friday 2026 dates",
    itemListElement: d.EVENTS.map((e, i) => ({ "@type": "ListItem", position: i + 1, item: {
      "@type": "Event", name: e.title, startDate: e.date, endDate: e.date, description: e.text,
      eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode", eventStatus: "https://schema.org/EventScheduled",
      location: { "@type": "VirtualLocation", url } } })) });
  if (p.tab === "guide") out.push({ "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: d.FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) });
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
    `<meta name="twitter:card" content="summary">`,
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
    .replace(/<p id="pintro">[^<]*<\/p>/, `<p id="pintro">${esc(p.intro)}</p>`);
}

function seoPages() {
  return {
    name: "seo-pages",
    enforce: "post",
    async generateBundle(_, bundle) {
      const host = process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "https://aktion.ch");
      const base = host.replace(/\/$/, "");
      const tplAsset = bundle["index.html"];
      const tpl = String(tplAsset.source);
      const d = await loadData();
      for (const p of PAGES) {
        const html = pageHtml(tpl, p, base, d);
        if (p.path === "/") tplAsset.source = html;
        else this.emitFile({ type: "asset", fileName: p.path.replace(/^\//, "") + "index.html", source: html });
      }
      this.emitFile({ type: "asset", fileName: "robots.txt", source: `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n` });
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
  build: { target: "es2020", sourcemap: false }
});
