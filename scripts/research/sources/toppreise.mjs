/* Toppreise.ch Black Friday source agent - Swiss price comparison site */
import { SourceAgent, cleanText } from "../source-agent.mjs";
import { extractLinks, extractText, extractPriceInfo, extractTitle } from "../html-helper.mjs";

const BASE = "https://blackfriday.toppreise.ch/";

export class ToppreiseAgent extends SourceAgent {
  constructor() {
    super({
      name: "Toppreise",
      baseUrl: BASE,
      dealPathPatterns: ["/produkt/", "/deal/"],
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
    const name = cleanText(title || "") || "Deal from Toppreise";
    const info = extractPriceInfo(text);
    const untilMatch = text.match(/bis\s*(\d{1,2}\.\d{1,2}\.\d{4})/i);

    return {
      name: name || "Deal from Toppreise",
      price: info.price,
      was: info.was,
      cur: "CHF",
      percent: info.percent,
      until: untilMatch ? this.parseDeDate(untilMatch[1]) : null,
      note: "Confirmed by Toppreise.ch",
      src: [url, BASE],
    };
  }

  parseDeDate(s) {
    const m = s.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
    if (!m) return null;
    return `${m[3]}-${String(m[2]).padStart(2, "0")}-${String(m[1]).padStart(2, "0")}`;
  }
}
