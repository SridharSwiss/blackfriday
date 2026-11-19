# Browser scrape brief — aktions.ch, 19 Nov 2026 (Black Friday 27 Nov)

You work in the user's REAL Chrome via the claude-in-chrome tools (shell/WebFetch cannot reach most shops; Chrome can). Other agents use the same Chrome in parallel: ALWAYS open your OWN tab (tabs_create_mcp), never touch other tabs, close your tab(s) at the end.
Load tools first with ONE ToolSearch: "select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__tabs_create_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__javascript_tool,mcp__claude-in-chrome__get_page_text,mcp__claude-in-chrome__tabs_close_mcp,mcp__claude-in-chrome__find". Call tabs_context_mcp once first.
Never click buy/cart/login/consent-accept beyond declining cookies; no forms; no downloads.

## EFFICIENT METHOD (important — saves tokens)
1. Navigate your tab to one page of the shop's domain. Inspect ONE product page with javascript_tool to learn where price/struck price/availability live (JSON-LD `script[type="application/ld+json"]` Product.offers.price, meta, or DOM selectors). Don't dump HTML; return only small extracted values.
2. Then run ONE async javascript_tool call that `fetch(url,{credentials:'include'})`s many same-origin URLs in the page (concurrency 4–6, 150–300 ms gaps, ≤60 URLs per call), parses each with DOMParser, and returns a COMPACT array like [id,status,price,was,avail]. Never return raw HTML. If fetch returns a bot-wall/empty/JS-only shell, fall back to navigate + javascript_tool per URL for a sample, then mark the rest "ok_sample" only if the sample passes.
3. Write results incrementally to your output file with Write/Bash (append JSONL). The Write tool is available; Bash is in the container (fine for file writing).
If the page shows a CAPTCHA / "access denied", stop that shop and report "blocked".

## TASK TYPE V — verify/update rows
Input: JSON array of {id,shop,name,price,was,url}. Output JSONL, one line per id, exactly:
{"id":N,"v":"ok|updated|no_deal|broken|blocked|soldout","price_now":num|null,"was_now":num|null}
- ok: page loads, same product, current price == row price (±1) and a higher struck/regular price still shown.
- updated: still discounted at a different price → price_now/was_now (both required, was_now>price_now).
- no_deal: price shown without discount (or discount <10%). broken: 404/redirect to other product/home. soldout: unavailable online. blocked: can't read.
Amazon.de: price == buy-box price, was == "UVP"/"Statt" struck list price (Typ. Preis). Missing struck price → no_deal.
Every id gets one line.

## TASK TYPE D — discover NEW deals
Output JSONL rows (candidates format) — one per product:
{"shop":"<key>","cat":"<category>","name":"<Brand Model>","spec":"<≤40 chars>","price":num,"was":num,"cur":"CHF","until":"YYYY-MM-DD"|null,"type":"Black Week|Deal of the day|Sale","url":"<exact product page>","src":["<url of page where seen>"]}
Rules: price and struck "was" both shown on the retailer's own page today; discount ≥10%; CHF (EUR only for amazon.de); live today; url = exact product page that opens that product (not a search/category page — except shop-wide telecom plans); real names/prices only, never guess. Allowed categories: TV, Audio, Phones, Tablets, Computers, Monitors, PC Components, Gaming, Cameras, Wearables, Smart Home, Networking, Printers, Accessories, Appliances, Kitchen, Coffee, Robot vacuums, Home, Furniture, Garden, Tools, Fashion, Shoes, Sport, Outdoor, Beauty, Toys, Baby, Pets, Books, Travel, Telecom, Mobility, Food, Health. Shop keys: use the existing key if one exists (galaxus digitec brack interdiscount mediamarkt fust nettoshop daydeal blickdeal coop manor zalando jumbo ochsner transa pfister ikea douglas livique decathlon sonos lenovo salt wingo yallo swisscom lebara aldi amazon) otherwise a lowercase shop slug. Go page by page through the shop's sale / Black Week / Aktion listing pages incl. pagination or "load more"/scrolling and extract every discounted product with JS from the listing DOM (name, href, price, struck price). Be exhaustive: hundreds of rows per big shop is fine. Dedupe by url. Append as you go.

FINAL REPLY (one line): counts per verdict (V) or "<N> rows written" (D), plus ≤2 lines of caveats.
