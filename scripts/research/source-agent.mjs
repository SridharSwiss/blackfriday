/* Base source research agent.
   Each source agent:
   - Has a unique source name and base URL
   - Uses the shared RateLimiter (40 RPM)
   - Fetches the source page, extracts candidate deal URLs
   - Visits each deal URL to extract deal details
   - Returns structured deal records
   - Must be confirmed by TWO independent dated sources (per site compliance rule README.md:102) */

import { globalLimiter, RateLimiter } from "./rate-limiter.mjs";
import { extractLinks, extractText, cleanText, parseMoney } from "./html-helper.mjs";

const fetchWithLimit = async (url, opts = {}) => {
  await globalLimiter.acquire();
  const res = await fetch(url, { headers: { "User-Agent": "Aktions.ch Deal Research Bot 1.0 (+https://aktions.ch)" }, ...opts });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
};

export class SourceAgent {
  constructor({ name, baseUrl, dealPathPatterns, selectors, rateRpm = 40 }) {
    this.name = name;
    this.baseUrl = baseUrl;
    this.dealPathPatterns = dealPathPatterns; // array of path substrings that indicate a deal page
    this.selectors = selectors; // {name, price, was, cur, percent, code, until, note}
    this.rateLimiter = new RateLimiter(rateRpm);
  }

  async acquire() { await this.rateLimiter.acquire(); await globalLimiter.acquire(); }

  async fetch(url, opts = {}) {
    await this.acquire();
    const res = await fetch(url, { headers: { "User-Agent": "Aktions.ch Deal Research Bot 1.0 (+https://aktions.ch)" }, ...opts });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return res.text();
  }

  /* Override in subclass to extract deal links from the listing page */
  async extractDealUrls(html) {
    throw new Error("extractDealUrls not implemented");
  }

  /* Override in subclass to extract deal fields from a deal page */
  async extractDealFields(html, url) {
    throw new Error("extractDealFields not implemented");
  }

  /* Main run: fetch listing, extract URLs, visit each, return deal records */
  async run() {
    console.log(`[${this.name}] Starting research at ${this.baseUrl}`);
    const results = [];
    try {
      const listingHtml = await this.fetch(this.baseUrl);
      const urls = await this.extractDealUrls(listingHtml);
      console.log(`[${this.name}] Found ${urls.length} candidate deal URLs`);
      for (const url of urls) {
        try {
          const dealHtml = await this.fetch(url);
          const fields = await this.extractDealFields(dealHtml, url);
          if (fields && fields.name && (fields.price != null || fields.percent != null)) {
            results.push({
              source: this.name,
              url,
              checked: new Date().toISOString().slice(0, 10),
              ...fields,
            });
            console.log(`[${this.name}] ✓ ${fields.name} ${fields.price != null ? fields.price : fields.percent}%`);
          } else {
            console.log(`[${this.name}] ✗ ${url} - no price/name found`);
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
}

export { parseMoney, cleanText, fetchWithLimit };
