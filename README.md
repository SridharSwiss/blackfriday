# blackfriday — Aktion.ch Black Friday Schweiz 2026

A single-page, dependency-free site curating the most-wanted Black Friday products for Switzerland, with record-low CHF prices, target buy prices and affiliate links to retailers that deliver in Switzerland.

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

## Compliance

The page shows an "Anzeige" affiliate disclosure banner and a footer disclosure (Swiss UWG transparency). Re-check prices before publishing: Black Friday 2026 offers are not yet announced.
