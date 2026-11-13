# Growth plan: reels, posters, on-site engagement (Black Friday 2026)

Honest note: nobody can promise "viral". This plan maximises the odds with a daily rhythm, formats that Swiss feeds reward, and measurement. Measure first (see "Next"): the site has no analytics yet.

## 1. Content engine (automated where possible)
| Format | Cadence | How |
|---|---|---|
| Top 5 poster (feed, 1080x1350) + story/reel cover (1080x1920) | daily, 07:00 | `npm run social` builds both plus DE/FR/IT/EN captions from the live data (`marketing/<date>-top5/`) |
| Reel "Top 5 countdown" (15-20 s) | Mon / Thu / Black Friday | reuse the HTML reel templates in `marketing/2026-11-11-singles-day/`, swap the deal list, trending sound added in the app |
| Reel "Preis-Check" (is it really a deal? old price vs. shop price) | 2 per week | one deal, 12 s, hook: "−60 %? Wir haben nachgerechnet." (trust is the differentiator) |
| Story poll / countdown sticker | daily | "Welches Gerät soll ich checken?" feeds tomorrow's content |
| Carousel "Kategorie des Tages" | daily | one of the 51 categories, 5 slides, last slide = link in bio |

## 2. Hooks that fit this site (live, verified, price-checked)
- "Heute bis Mitternacht" (expiring deals first), "Die 3 grössten Ersparnisse in CHF", "Fehlpreis-Alarm" only when two sources agree.
- Language split: DE main, FR/IT variants on Tue/Thu to reach 40 % of Switzerland that competitors ignore.
- Always show regular price, deal price and end date. No fake urgency.

## 3. Site features to retain and share
Done: Top deals pop-up, price-drop memory, deal calendar with reminders, Featured picks strip, WhatsApp share (top 3), per-deal share button, installable app.
Next (in order of effect): (1) Vercel Web Analytics + affiliate-click events per shop and deal; (2) email/WhatsApp-channel sign-up for "Deal of the day" (needs your accounts); (3) "Preis-Check" page per deal with price history once we have 2+ weeks of data; (4) "Submit a deal" form with moderation; (5) Black Friday bingo / saved-list sharing for family.

## 4. Channels
Instagram Reels + Stories (primary), TikTok (same reel), WhatsApp Channel (daily top 3), Pinterest pins (posters, evergreen), Facebook groups on Swiss deals (post value, not links only), Reddit r/Switzerland deal threads (read rules), Preispirat/mydealz community posts when a deal is verified.

## 5. Rules
Label ads ("Anzeige: Affiliate-Links"), never post a deal without a check date, remove expired deals the same day (the site does it automatically).

## 6. KPIs (once analytics is on)
Visitors per source, affiliate clicks per post, click-through per category, returning visitors (price-drop users), Associates orders per tracking ID.
