/* Black-Friday.ch source agent - two-level crawl:
   1. Visit shop category pages (/shops/*)
   2. Extract individual product URLs from those pages
   3. Visit each product page for real prices */
import { SourceAgent, cleanText, parseMoney } from "../source-agent.mjs";
import { extractLinks, extractText, extractPriceInfo, extractTitle } from "../html-helper.mjs";

const BASE = "https://www.black-friday.ch/";

export class BlackFridayChAgent extends SourceAgent {
  constructor() {
    super({
      name: "Black-Friday.ch",
      baseUrl: BASE,
      dealPathPatterns: ["/shops/"],
    });
  }

  async extractDealUrls(html) {
    const urls = [];
    const links = extractLinks(html, BASE);
    const seen = new Set();
    for (const { url, text } of links) {
      const matches = this.dealPathPatterns.some(p => url.includes(p));
      if (matches && text.length > 3 && !seen.has(url)) {
        seen.add(url);
        urls.push(url);
      }
    }
    return urls.slice(0, 40);
  }

  /* Second-level crawl: visit each shop page, extract product URLs, then visit each product */
  async run() {
    console.log(`[${this.name}] Starting research at ${this.baseUrl}`);
    const results = [];
    try {
      const listingHtml = await this.fetch(this.baseUrl);
      const shopUrls = await this.extractDealUrls(listingHtml);
      console.log(`[${this.name}] Found ${shopUrls.length} shop category URLs`);

      for (const shopUrl of shopUrls) {
        try {
          const shopHtml = await this.fetch(shopUrl);
          const productUrls = this.extractProductUrls(shopHtml, shopUrl);
          console.log(`[${this.name}] ${shopUrl} → ${productUrls.length} product URLs`);

          for (const pUrl of productUrls.slice(0, 15)) {
            try {
              const pHtml = await this.fetch(pUrl);
              const fields = await this.extractDealFields(pHtml, pUrl);
              if (fields && fields.name && (fields.price != null || fields.percent != null)) {
                results.push({
                  source: this.name,
                  url: pUrl,
                  checked: new Date().toISOString().slice(0, 10),
                  ...fields,
                });
                console.log(`[${this.name}] ✓ ${fields.name} ${fields.price != null ? fields.price : fields.percent}%`);
              }
            } catch (e) {
              console.log(`[${this.name}] ✗ ${pUrl} - ${e.message}`);
            }
          }
        } catch (e) {
          console.log(`[${this.name}] ✗ Shop page ${shopUrl} - ${e.message}`);
        }
      }
    } catch (e) {
      console.log(`[${this.name}] ERROR: ${e.message}`);
    }
    console.log(`[${this.name}] Complete: ${results.length} deals extracted`);
    return results;
  }

  extractProductUrls(html, baseUrl) {
    const urls = [];
    const links = extractLinks(html, baseUrl);
    const seen = new Set();
    for (const { url, text } of links) {
      // Product URLs typically have specific patterns
      const isProduct = /(p\/\d+|product|item|dp\/|article)/i.test(url) && text.length > 3;
      if (isProduct && !seen.has(url)) {
        seen.add(url);
        urls.push(url);
      }
    }
    return urls;
  }

  async extractDealFields(html, url) {
    const text = extractText(html);
    const title = extractTitle(html);
    const name = cleanText(title || "") || "Deal from Black-Friday.ch";
    const info = extractPriceInfo(text);
    const untilMatch = text.match(/bis\s*(\d{1,2}\.\d{1,2}\.\d{4})/i);
    const codeMatch = text.match(/Code[:\s]+([A-Z0-9]{3,})/i);

    return {
      name,
      price: info.price,
      was: info.was,
      cur: "CHF",
      percent: info.percent,
      code: codeMatch ? codeMatch[1] : null,
      until: untilMatch ? this.parseDeDate(untilMatch[1]) : null,
      note: "Confirmed by Black-Friday.ch",
      src: [url, BASE],
    };
  }

  parseDeDate(s) {
    const m = s.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
    if (!m) return null;
    return `${m[3]}-${String(m[2]).padStart(2, "0")}-${String(m[1]).padStart(2, "0")}`;
  }
}
