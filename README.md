# Aktion.ch – Black Friday Schweiz 2026

A fast, dependency-light web app listing Black Friday 2026 offers for Switzerland:

- **Top 100 offers** with researched CHF prices (today, Black Week 2025, record low) and an automatic *Buy now / Wait* call
- **2,000+ products** in 33 general categories, including **Winter tyres** (reifen-online.ch partner links)
- **Retailer guide** and **buying guide**
- One-screen layout: tabs plus a card grid that sizes itself to the window and pages with Prev/Next (← →); phones scroll normally
- Every outbound shop link goes through the affiliate layer (Amazon PartnerNet tag active; Awin/Tradedoubler ready)

Black Friday: **Fr 27.11.2026** · Black Week from Mo 23.11. · Cyber Monday Mo 30.11.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview    # serve dist/
```

Requires Node 18+.

## Deploy to Vercel

**Dashboard:** vercel.com → Add New → Project → import `SridharSwiss/blackfriday` → Deploy. Settings are read from `vercel.json` (Vite, `npm run build`, output `dist`).

**CLI:**

```bash
npm i -g vercel
vercel          # preview deployment
vercel --prod   # production
```

`robots.txt` and `sitemap.xml` are generated at build time from `VERCEL_PROJECT_PRODUCTION_URL` (set by Vercel automatically). For a custom domain, set the environment variable `SITE_URL=https://your-domain.ch`. Then add the live URL to Amazon PartnerNet and Awin as your promotional site.

`vercel.json` also sets long-term caching for hashed assets and basic security headers.

## Project structure

```
index.html                  page markup (tabs, panels, modal)
src/main.js                 UI: tabs, paged grid, filters, details pop-up
src/styles.css              design tokens (light/dark) and layout
src/config/affiliates.js    affiliate IDs + affLink()          ← edit IDs here
src/config/partners.js      featured partner links (reifen-online.ch)
src/config/shops.js         shop search URLs + default shops per category
src/data/top100.js          top 100 products with researched prices
src/data/catalogue.js       products 101+ (GENERATED, do not edit by hand)
src/data/winter-tyres.js    winter tyre models
src/data/retailers.js       retailer guide rows
src/data/images.js          licensed product photo URLs (optional)
src/lib/thumb.js            product pictures (photo or illustration)
src/lib/format.js           CHF formatting, labels
content/catalogue.txt       source list for the catalogue
scripts/build-catalogue.mjs content/catalogue.txt → src/data/catalogue.js
public/                     favicon and static files
```

## Editing

**Affiliate IDs** – `src/config/affiliates.js`. Amazon: `tag`. Awin: set `network: "awin"`, `mid` (merchant ID, e.g. MediaMarkt CH = 14040) and `affid` (your publisher ID). Tradedoubler: `programId` + `siteId`. Shops without an ID link directly with UTM tags.

**Top 100** – `src/data/top100.js`. Each row: `[category, name, spec, todayCHF, blackWeek2025CHF, recordLowCHF, recordLowNote, searchQuery, note, shops?]`. Status is computed: *Buy now* if today is within 3% of the best known price, *Wait* if it was cheaper before, *Tracking* without history, *Check* without a verified CHF price.

**Catalogue** – edit `content/catalogue.txt` (`## Category`, then `Name | spec` or `Name | spec | priceCHF`) and run `npm run catalogue`. Tyres are moved into *Winter tyres* automatically and link to reifen-online.ch.

**Winter tyres / partner links** – `src/data/winter-tyres.js` and `src/config/partners.js`. Direct link to the category: `/#winter`.

**Product photos** – add licensed image URLs to `src/data/images.js` (`"Exact product name": "https://…"`). Without a photo, each product shows an illustration drawn from its category and brand; books render as covers. Licensed sources: Amazon Product Advertising API (after 3 qualifying PartnerNet sales), Awin/Tradedoubler product feeds, brand press kits. Do not copy photos from shop pages.

## Data sources

Today's prices: Black-Friday.ch price feed (23.10.2026). Black Week 2025 prices and record lows: Preispirat deal reports, Toppreise comparisons. Winter tyre rules: TCS. Products 101+ are a curated list without researched prices; their buttons open live shop listings.

## Compliance

The page shows an "Anzeige" affiliate disclosure, the Amazon partner statement ("Als Amazon-Partner verdienen wir an qualifizierten Verkäufen") and a disclosure section in the Buying guide tab (Swiss UWG transparency). Re-check prices before Black Week: Black Friday 2026 offers are not announced yet.
