/* BlackFridayDeals.ch source agent - two-level crawl */
import { SourceAgent, cleanText, parseMoney } from "../source-agent.mjs";
import { extractLinks, extractText, extractPriceInfo, extractTitle } from "../html-helper.mjs";

const BASE = "https://www.blackfridaydeals.ch/";

export class BlackFridayDealsAgent extends SourceAgent {
  constructor() {
    super({
      name: "BlackFridayDeals.ch",
      baseUrl: BASE,
      dealPathPatterns: ["/shop/", "/deal/", "/angebot/"],
    });
  }

  async run() {
    console.log(`[${this.name}] Starting research at ${this.baseUrl}`);
    const results = [];
    try {
      const listingHtml = await this.fetch(this.baseUrl);
      const urls = await this.extractDealUrls(listingHtml);
      console.log(`[${this.name}] Found ${urls.length} candidate URLs`);

      for (const url of urls.slice(0, 25)) {
        try {
          const html = await this.fetch(url);
          const fields = await this.extractDealFields(html, url);
          if (fields && fields.name && (fields.price != null || fields.percent != null)) {
            results.push({ source: this.name, url, checked: new Date().toISOString().slice(0, 10), ...fields });
            console.log(`[${this.name}] ✓ ${fields.name} ${fields.price != null ? fields.price : fields.percent}%`);
          }
        } catch (e) {
          console.log(`[${this.name}] ✗ ${url} - ${e.message}`);
        }
      }
    } catch (e) {
      console.log(`[${this.name}] ERROR: ${e.message}`);
    }
    console.log(`[${this.name}] Complete: ${results.length} deals extracted`);
    return results;
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
    return urls;
  }

  async extractDealFields(html, url) {
    const text = extractText(html);
    const title = extractTitle(html);
    const name = cleanText(title || "") || "Deal from BlackFridayDeals.ch";
    const info = extractPriceInfo(text);
    const untilMatch = text.match(/bis\s*(\d{1,2}\.\d{1,2}\.\d{4})/i);

    return {
      name,
      price: info.price,
      was: info.was,
      cur: "CHF",
      percent: info.percent,
      until: untilMatch ? this.parseDeDate(untilMatch[1]) : null,
      note: "Confirmed by BlackFridayDeals.ch",
      src: [url, BASE],
    };
  }

  parseDeDate(s) {
    const m = s.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
    if (!m) return null;
    return `${m[3]}-${String(m[2]).padStart(2, "0")}-${String(m[1]).padStart(2, "0")}`;
  }
}
