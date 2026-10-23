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

## Updating deals

Edit the `DEALS` array: `ref` (typical CHF), `low` (record low), `target` (buy-at price), `status` (`buy` / `wait` / `check`), and `shops` (retailer keys from `SHOPS`).

## Compliance

The page shows an "Anzeige" affiliate disclosure banner and a footer disclosure (Swiss UWG transparency). Re-check prices before publishing: Black Friday 2026 offers are not yet announced.
