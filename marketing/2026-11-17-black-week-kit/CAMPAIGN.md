# AKTIONS.CH: Black Week campaign kit (17–30 Nov 2026)

The goal is to grow followers and site visits in the 10 days before Black Friday with **trust content** (dates, anti-fake-discount tips) that stays valid for the whole campaign. Daily price posters keep coming from `npm run social` (`marketing/<date>-top5/`) and the deal reels from `scripts/campaign.mjs`. This kit is the frame around them.

Facts used (from the site's verified calendar, checked 17.11.2026): Digitec & Galaxus Black Friday weeks 16–30 Nov (1,000+ offers, all from day 1) · Black Week from Mon 23 Nov · Black Friday Fri 27 Nov · Cyber Monday 30 Nov. No product prices are shown, so nothing in the kit expires before 30 Nov.

## Files (`export/`)

| Asset | Files | Format |
|---|---|---|
| Carousel "Der Black-Friday-Fahrplan 2026" | `carousel-1…6-1080x1350.png` | Feed, 4:5, 6 slides |
| Reel "4 Termine, die du kennen musst" | `reel-dates-1080x1920.mp4` + `reel-dates-cover-1080x1920.png` | 9:16, 15 s |
| Reel "3 Tricks gegen Fake-Rabatte" | `reel-tricks-1080x1920.mp4` + `reel-tricks-cover-1080x1920.png` | 9:16, 15 s |
| Stories | `story-1-countdown` · `story-2-galaxus` · `story-3-blackweek` · `story-4-poll` · `story-5-link` (1080x1920) | Dashed boxes show where to place the Instagram sticker |
| Highlight covers | `highlight-deals` · `-termine` · `-tipps` · `-usa` · `-top5` (1080x1080) | Upload as highlight cover, Instagram crops to a circle |

Sources: `kit.html` (all stills) and `reels.html` (both reels). Edit the text, then run:

```bash
node scripts/render-kit.cjs marketing/2026-11-17-black-week-kit
```

Reels have a silent audio track, so add a trending sound in the Instagram app.

## Posting calendar

| Day | Feed / Reel (07:00 or 18:30) | Stories | Notes |
|---|---|---|---|
| Tue 17.11. | **Carousel** "Fahrplan" | story-1 countdown + countdown sticker «Black Friday 27.11.» · story-5 link | Pin the carousel to the profile |
| Wed 18.11. | Daily Top 5 poster | story-2 Galaxus + link | |
| Thu 19.11. | **Reel "4 Termine"** | story-4 poll (TV/Handy/Küche/Konsole/Mode) | Amazon US Black Friday Week starts |
| Fri 20.11. | Daily Top 5 poster | Answer the poll: 1 "Preis-Check" story | |
| Sat 21.11. | Deal reel from `scripts/campaign.mjs` | story-5 link | |
| Sun 22.11. | **Reel "3 Tricks"** | story-3 Black Week + reminder sticker | Best reach on Sunday evening |
| Mon 23.11. | Daily Top 5 + "Black Week ist da" story | story-1 (re-render countdown: 4 days) | Re-render with the new number |
| Tue 24.11. | Carousel again as a story share | story-4 poll | FR captions |
| Wed 25.11. | Deal reel | story-2 / story-5 | |
| Thu 26.11. | Daily Top 5 | "Morgen ist Black Friday" story-1 (1 day) | IT captions |
| **Fri 27.11.** | 07:00 Top 5 · 12:00 deal reel · 18:00 "Was noch läuft" | stories every 2–3 h, link sticker in each | Main day |
| Sat 28.11. | Daily Top 5 | story-5 | |
| Mon 30.11. | Cyber Monday Top 5 + "Letzte Chance" | story-1 (0 days: "Heute") | Wrap-up |

## Tracking links (from `campaign/links.txt`)

- Bio: `https://aktions.ch/?utm_source=instagram&utm_medium=bio&utm_campaign=blackfriday2026`
- Story link sticker: `https://aktions.ch/?utm_source=instagram&utm_medium=story&utm_campaign=blackfriday2026`
- Feed post (if a link is used elsewhere): `https://aktions.ch/?utm_source=instagram&utm_medium=post&utm_campaign=blackfriday2026`

## Captions

### Carousel "Fahrplan"

**DE:** 🗓️ Der Black-Friday-Fahrplan 2026 für die Schweiz – speichern, bevor du zuschlägst!
16.11. Digitec & Galaxus (1000+ Deals, bis 30.11.) · 23.11. Black Week · 27.11. Black Friday · 30.11. Cyber Monday.
Plus 3 Tricks, wie du Fake-Rabatte erkennst 👉 wischen.
Alle geprüften Live-Deals mit Enddatum: Link in Bio.
*Anzeige: Affiliate-Links.*

**FR:** 🗓️ Le calendrier Black Friday 2026 en Suisse : 16.11 Digitec & Galaxus (1000+ offres jusqu'au 30.11) · 23.11 Black Week · 27.11 Black Friday · 30.11 Cyber Monday. + 3 astuces contre les faux rabais 👉 swipe. Toutes les offres vérifiées : lien en bio. *Publicité : liens affiliés.*

**IT:** 🗓️ Il calendario Black Friday 2026 in Svizzera: 16.11 Digitec & Galaxus (1000+ offerte fino al 30.11) · 23.11 Black Week · 27.11 Black Friday · 30.11 Cyber Monday. + 3 trucchi contro i falsi sconti 👉 scorri. Tutte le offerte verificate: link in bio. *Pubblicità: link di affiliazione.*

**EN:** 🗓️ Black Friday 2026 in Switzerland, all the dates: 16 Nov Digitec & Galaxus (1,000+ deals to 30 Nov) · 23 Nov Black Week · 27 Nov Black Friday · 30 Nov Cyber Monday. Plus 3 tricks to spot fake discounts 👉 swipe. All checked live deals: link in bio. *Ad: affiliate links.*

### Reel "4 Termine"

**DE:** 4 Daten, die dir am Black Friday Geld sparen 📅 Speichern & mit deinen Shopping-Buddies teilen! Alle Live-Deals: Link in Bio. *Anzeige: Affiliate-Links.*
**FR:** 4 dates à retenir pour le Black Friday 📅 Enregistre et partage ! Lien en bio. *Publicité.*

### Reel "3 Tricks gegen Fake-Rabatte"

**DE:** −60 %? Wir haben nachgerechnet. 🧮 3 Tricks, mit denen Shops Rabatte grösser aussehen lassen, und wie du sie erkennst. Auf aktions.ch siehst du bei jedem Deal Preis, alten Preis, Tiefstpreis und Enddatum. Link in Bio. *Anzeige: Affiliate-Links.*
**FR:** −60 % ? On a vérifié. 🧮 3 astuces pour repérer les faux rabais. Lien en bio. *Publicité.*
**IT:** −60 %? Abbiamo controllato. 🧮 3 trucchi per riconoscere i falsi sconti. Link in bio. *Pubblicità.*

### Hashtags (pick 8–12)

DE: #blackfridayschweiz #blackfriday2026 #blackweek #cybermonday #schnäppchen #sparen #rabatt #deals #schweiz #zürich #bern #basel #luzern #aktionsch
FR: #blackfridaysuisse #bonplan #promo #suisse #genève #lausanne
IT: #blackfridaysvizzera #offerte #ticino #lugano

## Alt texts

- Carousel 1: «Rote Grafik von AKTIONS.CH: Der Black-Friday-Fahrplan 2026, alle Daten für die Schweiz und wie du echte Deals von Fake-Rabatten unterscheidest.»
- Carousel 2: «Termine: 16.11. Digitec und Galaxus, 23.11. Black Week, 27.11. Black Friday, 30.11. Cyber Monday.»
- Reels: «Animierte Grafik mit den vier Black-Friday-Terminen 2026 in der Schweiz» / «Animierte Grafik: drei Tricks gegen Fake-Rabatte».

## Rules

- Keep "Anzeige" or Instagram's paid-partnership label on every post (Swiss UWG).
- Countdown story: re-render `story-1` with the right number (edit `10` in `kit.html`), or use the Instagram countdown sticker alone.
- No fake urgency: only say "nur heute" when a deal really ends today (the site shows the end date).
- Track per format: compare `utm_medium=story` vs `bio` clicks to decide what to post more of in the final week.
