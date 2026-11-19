/* Blick Deal source agent - Blick's daily/weekly deals */
import { SourceAgent, cleanText, parseMoney } from "../source-agent.mjs";
import { extractLinks, extractText } from "../html-helper.mjs";

const BASE = "https://box.blick.ch/";

export class BlickDealAgent extends SourceAgent {
  constructor() {
    super({
      name: "Blick Deal",
      baseUrl: BASE,
      dealPathPatterns: ["/deals/", "/deal/"],
      selectors: { name: "h1", price: ".price", was: ".was", percent: "-%" },
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
    const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
    const name = cleanText(titleMatch ? titleMatch[1] : "") || "Deal from Blick Deal";
    const priceMatch = text.match(/CHF\s*([\d'.,]+)/);
    const wasMatch = text.match(/statt\s*CHF\s*([\d'.,]+)/i) || text.match(/regulär\s*CHF\s*([\d'.,]+)/i);
    const percentMatch = text.match(/−?(\d+)%/) || text.match(/(\d+)%\s*rabatt/i);
    const untilMatch = text.match(/bis\s*(\d{1,2}\.\d{1,2}\.\d{4})/i);

    return {
      name: name || "Deal from Blick Deal",
      price: priceMatch ? parseMoney(priceMatch[1]) : null,
      was: wasMatch ? parseMoney(wasMatch[1]) : null,
      cur: "CHF",
      percent: percentMatch ? parseInt(percentMatch[1]) : null,
      until: untilMatch ? this.parseDeDate(untilMatch[1]) : null,
      note: "Confirmed by Blick Deal",
      src: [url, BASE],
    };
  }

  parseDeDate(s) {
    const m = s.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
    if (!m) return null;
    return `${m[3]}-${String(m[2]).padStart(2, "0")}-${String(m[1]).padStart(2, "0")}`;
  }
}
