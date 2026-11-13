# Aktion.ch – Black Friday Schweiz 2026

A fast, dependency-light web app listing Black Friday 2026 offers for Switzerland:

- **Live deals** (first tab): ~100 offers live in Switzerland, researched from retailer pages and dated Swiss deal reports (`src/data/live-ch.js`); each shows price, was-price, discount, shop, valid-until, voucher code and sources, and expires automatically
- **🔥 Top deals**: the most valuable live deals (≥25 % off, ranked by amount saved), shown in a pop-up when the site opens (once a day) and as its own tab / phone menu item
- **Top 100 offers** with researched CHF prices (today, 2026 record low) and an automatic *Buy now / Wait* call
- **2,400+ products** in 33 general categories, including **Winter tyres** (reifen-online.ch partner links)
- **US deals** tab: live US early Black Friday deals (USD deal price vs regular price, % off), each confirmed by two sources linking to Amazon.com, Best Buy, Walmart, Target
- **My list** watchlist (heart on every card, saved in the browser), **share** links per product, price-history bars in the details pop-up
- **Deal calendar** (CH + US dates with countdown), **Retailers** (CH + US), **Guide & FAQ**
- Global search (press `/`), filters for shop, price range, status and category, sort by rank / biggest saving / price / A–Z
- One-screen desktop layout: the card grid sizes itself to the window and pages with Prev/Next (← →). Phones get a bottom tab bar, a "More" sheet, "Show more" loading and bottom-sheet details
- **Return visits:** prices are remembered in the browser. On a later visit (6 h+), cards show "↓ CHF x" price drops and "New" badges, a "Welcome back" bar counts drops (and those on My list) with a one-tap "Show them" filter, and a toast flags cheaper saved deals. The same bar shows the next deal date with a "Remind me" calendar file
- **Installable app (PWA):** `public/manifest.webmanifest`, icons, network-first `public/sw.js` (never serves stale prices when online), "Install app" button when the browser offers it
- Light/dark theme toggle (follows the system by default)
- **SEO landing pages** (static HTML, readable without JavaScript): 22 pages in DE/FR/IT/EN, e.g. `/de/black-friday-schweiz-2026/`, `/fr/black-friday-suisse-2026/`, `/de/black-week-schweiz-2026/`, `/de/black-friday-fernseher-schweiz/`, `/de/black-friday-usa-schweiz/`. Each has its own title, description, canonical, hreflang, H1, intro and JSON-LD (WebPage, ItemList, Event, FAQPage) and opens the matching view. Add or edit them in `src/config/pages.js`.
- **SEO + AI search (GEO):** each landing page ships its deals (live deals or name, spec, CHF price, record low, buy/wait), the deal calendar and a localized FAQ as static HTML, so crawlers that don't run JavaScript (GPTBot, ClaudeBot, PerplexityBot …) can read and cite them. Also: per-page keywords incl. question-style AI queries (`KEYWORDS` in `src/config/pages.js`), Organization/WebSite/WebPage/ItemList(Product+AggregateOffer)/Event/FAQPage JSON-LD, Open Graph image (`public/og-image.png`), robots.txt that explicitly allows AI crawlers, and `/llms.txt` + `/llms-full.txt` (key facts, all top-100 prices, US deals, calendar, FAQ in 4 languages) generated at build time
- Deep links: `#top`, `#categories`, `#us`, `#list`, `#calendar`, `#retailers`, `#guide`, `#winter`, and `#p-<product-id>` (opens a product)
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

`robots.txt`, `sitemap.xml` (with hreflang alternates) and the landing pages' canonical URLs are generated at build time from `SITE_URL`, else `https://aktions.ch` (the live domain). Add the live URL to Amazon PartnerNet and Awin as your promotional site.

`vercel.json` also sets long-term caching for hashed assets and basic security headers.

## Project structure

```
index.html                  page markup (tabs, panels, modal)
src/main.js                 UI: tabs, paged grid, filters, details pop-up
src/styles.css              design tokens (light/dark) and layout
src/config/affiliates.js    affiliate IDs + affLink()          ← edit IDs here
src/config/partners.js      featured partner links (reifen-online.ch)
src/config/pages.js         SEO landing pages (DE/FR/IT/EN)
src/config/shops.js         shop search URLs + default shops per category
src/data/top100.js          top 100 products with researched prices
src/data/catalogue.js       products 101+ (GENERATED, do not edit by hand)
src/data/winter-tyres.js    winter tyre models
src/data/us.js              US deals (USD) + US retailer rows
src/data/calendar.js        deal calendar events + FAQ
src/data/retailers.js       retailer guide rows
src/data/images.js          licensed product photo URLs (optional)
src/lib/thumb.js            product pictures (photo or illustration)
src/lib/format.js           CHF formatting, labels
content/catalogue.txt       source list for the catalogue
scripts/build-catalogue.mjs content/catalogue.txt → src/data/catalogue.js
public/                     favicon and static files
```

## Editing

**Affiliate IDs** – `src/config/affiliates.js`. Amazon: `tag`. Awin: set `network: "awin"`, `mid` (merchant ID, e.g. MediaMarkt CH = 14040) and `affid` (your publisher ID). Tradedoubler: `programId` + `siteId`. Shops without an ID link directly with UTM tags. **US links:** Amazon.com needs its own Associates tag (the .de tag `blackfrida08d-21` does not work on amazon.com) – set `amazoncom.tag` once you have it; Best Buy/Walmart/Target can be added via Impact.

**US deals** – `src/data/us.js`. Each row: `[category, name, spec, dealPriceUSD, regularUSD, mainRetailer, searchQuery, validUntil]`.

**Calendar & FAQ** – `src/data/calendar.js`.

**Top 100** – `src/data/top100.js`. Each row: `[category, name, spec, todayCHF, null (unused), recordLowCHF, recordLowNote, searchQuery, note, shops?]`. Status is computed: *Buy now* if today is within 3% of the best known price, *Wait* if it was cheaper before, *Tracking* without history, *Check* without a verified CHF price.

**Catalogue** – edit `content/catalogue.txt` (`## Category`, then `Name | spec` or `Name | spec | priceCHF`) and run `npm run catalogue`. Tyres are moved into *Winter tyres* automatically and link to reifen-online.ch.

**Winter tyres / partner links** – `src/data/winter-tyres.js` and `src/config/partners.js`. Direct link to the category: `/#winter`.

**Product photos** – add licensed image URLs to `src/data/images.js` (`"Exact product name": "https://…"`). Without a photo, each product shows an illustration drawn from its category and brand; books render as covers. Licensed sources: Amazon Product Advertising API (after 3 qualifying PartnerNet sales), Awin/Tradedoubler product feeds, brand press kits. Do not copy photos from shop pages.

## Data sources

Live deals: retailer pages and dated Swiss deal reports (Preispirat, Toppreise, BlackFridayDeals.ch, Black-Friday.ch, delamar, PCGH), checked 10.11.2026. Top 100 today prices: Digitec/Galaxus product pages, November 2026; record lows: verified 2026 Swiss-deliverable prices. No 2025 data is used.

## Compliance

The page shows an "Anzeige" affiliate disclosure, the Amazon partner statement ("Als Amazon-Partner verdienen wir an qualifizierten Verkäufen") and a disclosure section in the Buying guide tab (Swiss UWG transparency). Re-check prices before Black Week: Black Friday 2026 offers are not announced yet.

## Data files for the scheduled updates (daily/hourly)
- `src/data/live-ch.js` Swiss live deals · `src/data/us.js` US live deals.
- Product lines without prices: `content/catalogue.txt` (CH), `catalogue-us.txt`; run `npm run catalogue` after editing.
- Rule: publish a live row only when two independent dated sources confirm it; expired rows hide automatically. India events not yet announced by retailers stay out of the calendar.

## Login, analytics and cookie consent (built, switched off until a database exists)
- Code: `src/lib/consent.js` (banner, policy EN/DE, consent cookie `bf_consent` + localStorage), `track.js` (anonymous events, only after analytics consent), `auth.js` + `account-ui.js` (email-link login, synced saved list, delete account).
- Switch on: create a NEW dedicated Supabase project (not the courses/Indiaspora ones), run `supabase/schema.sql`, then fill `url` and `key` in `src/config/backend.js`, enable Email auth with redirect URL = site origin, and push to `main`.
- Reports: SQL views `analytics_daily`, `analytics_top_deals`, `analytics_sources`, `consent_rate` (owner only). No IP, search text or fingerprint is stored.

## Admin dashboard
`/admin` (noindex). Run `supabase/admin.sql` once in the dedicated project. Admins are listed in `public.admins`; sign in with the email link, access is enforced by `public.is_admin()` in the database. Add another admin: `insert into public.admins values ('name@example.com');`
