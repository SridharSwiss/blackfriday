/* BlackFridayDeals.ch source agent - Swiss Black Friday aggregator */
import { SourceAgent, cleanText } from "../source-agent.mjs";
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

  async extractDealUrls(html) {
    const urls = [];
    const links = extractLinks(html, BASE);
    const seen = new Set();
    for (const { url, text } of links) {
      const matches = this.dealPathPatterns.some(p => url.includes(p));
      if (matches && text.length > 5 && !seen.has(url)) {
        seen.add(url);
        urls.push(url);
      }
    }
    return urls.slice(0, 30);
  }

  async extractDealFields(html, url) {
    const text = extractText(html);
    const title = extractTitle(html);
    const name = cleanText(title || "") || "Deal from BlackFridayDeals.ch";
    const info = extractPriceInfo(text);
    const untilMatch = text.match(/bis\s*(\d{1,2}\.\d{1,2}\.\d{4})/i);

    return {
      name: name || "Deal from BlackFridayDeals.ch",
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
