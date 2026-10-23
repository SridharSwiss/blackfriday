# blackfriday — Aktion.ch Black Friday Schweiz 2026

A dependency-free static site with the **Top 2,000** Black Friday products for Switzerland across 33 general categories. The top 100 carry researched CHF prices (today, Black Week 2025, record low) and a buy/wait call; products 101–2000 are a curated catalogue linked to live shop prices and Toppreise history. Every outbound link goes through the affiliate layer.

- Black Friday: **Fr 27.11.2026** · Black Week from Mo 23.11. · Cyber Monday Mo 30.11.
- Prices researched up to 23.10.2026 from Swiss price trackers (Preispirat, Toppreise) and retailer listings.

## Deploy

It is a static `index.html`. Enable GitHub Pages (Settings → Pages → Deploy from branch → `main` / root) or drop it on Vercel/Netlify.

## Affiliate links

Every outbound link goes through `affLink()` in `index.html`. Fill in the `AFF` config at the top of the `<script>`:

| Retailer | Network | Fields |
|---|---|---|
| Amazon.de | Amazon PartnerNet | `tag` |
| Galaxus / Digitec | partner programme (apply via Digitec Galaxus) | `network`, `programId`, `siteId` |
| Brack, Interdiscount, MediaMarkt, fnac, Fust, Manor, DayDeal, Samsung | set `network: "awin"` or `"tradedoubler"` once approved | `mid` + `affid` (Awin) or `programId` + `siteId` (Tradedoubler) |

Until an ID is set, links go directly to the retailer with UTM tags, so nothing breaks.

## Updating deals (Top 100)

Products live in the `RAW` array, ordered by demand rank. Each row is:

`[category, name, spec, todayCHF, blackWeek2025CHF, recordLowCHF, recordLowNote, searchQuery, note, shops?]`

- **today**: lowest Swiss price (Black-Friday.ch price feed, 23.10.2026)
- **blackWeek2025**: price from Preispirat's Black Week 2025 roundups
- **recordLow**: other verified Swiss-deliverable lows (Preispirat / Toppreise)

Status is computed automatically: **Buy now** if today is within 3% of the best known price, **Wait** if it was cheaper before, **Tracking** if there is no history yet, **Check** if no CHF price is verified. Retailer buttons default per category (`CAT_SHOPS`); pass a `shops` list to override. Search, category, status and sort controls work client-side.

## Catalogue (products 101–2000)

- Source list: `data/catalogue.txt` (`## Category` headers, then `Name | spec`); built file `data/catalogue.js` (`window.CATALOGUE = [[category, name, spec, priceCHF?], ...]`).
- Includes the products Swiss shoppers commonly order from Amazon.de (books, toys & games, beauty, accessories, household, DIY), mixed into the general categories. Every catalogue product links to Amazon.de as well, except large appliances.
- Add today's CHF price as a 4th value to switch a card from "Live price" to "Tracking".
- Retailer buttons per category: `CAT_SHOPS` in `index.html`.

## Product pictures

Every product shows a picture. By default it is an illustration drawn from its category and brand (books render as a cover with title and author), so the page never shows an empty slot. To show real photos, add licensed image URLs to `data/images.js`:

```js
window.IMAGES["Apple AirPods Pro 3"] = "https://…/image.jpg";
```

Licensed sources: Amazon Product Advertising API (after 3 qualifying PartnerNet sales), Awin/Tradedoubler product feeds, brand press kits. Do not copy photos from retailer pages. A broken image URL falls back to the illustration automatically.

## Compliance

The page shows an "Anzeige" affiliate disclosure banner and a footer disclosure (Swiss UWG transparency). Re-check prices before publishing: Black Friday 2026 offers are not yet announced.
