/* Fust.ch source agent - direct retailer deal pages */
import { SourceAgent, cleanText, parseMoney } from "../source-agent.mjs";
import { extractLinks, extractText } from "../html-helper.mjs";

export class FustAgent extends SourceAgent {
  constructor() {
    super({
      name: "Fust",
      baseUrl: "https://www.fust.ch/",
      dealPathPatterns: ["/p/"],
      selectors: { name: "h1", price: ".price", was: ".was", percent: "-%" },
    });
  }

  async extractDealUrls(html) {
    const urls = [];
    const links = extractLinks(html, "https://www.fust.ch/");
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
    const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
    const name = cleanText(titleMatch ? titleMatch[1] : "") || "Deal from Fust";
    const priceMatch = text.match(/CHF\s*([\d'.,]+)/);
    const wasMatch = text.match(/statt\s*CHF\s*([\d'.,]+)/i) || text.match(/regulär\s*CHF\s*([\d'.,]+)/i);
    const percentMatch = text.match(/−?(\d+)%/) || text.match(/(\d+)%\s*rabatt/i);
    const untilMatch = text.match(/bis\s*(\d{1,2}\.\d{1,2}\.\d{4})/i);

    return {
      name: name || "Deal from Fust",
      price: priceMatch ? parseMoney(priceMatch[1]) : null,
      was: wasMatch ? parseMoney(wasMatch[1]) : null,
      cur: "CHF",
      percent: percentMatch ? parseInt(percentMatch[1]) : null,
      until: untilMatch ? this.parseDeDate(untilMatch[1]) : null,
      note: "Confirmed by Fust.ch",
      src: [url, "https://www.fust.ch/"],
    };
  }

  parseDeDate(s) {
    const m = s.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
    if (!m) return null;
    return `${m[3]}-${String(m[2]).padStart(2, "0")}-${String(m[1]).padStart(2, "0")}`;
  }
}
