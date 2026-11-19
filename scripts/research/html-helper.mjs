/* Lightweight HTML helpers for Node.js (no DOMParser available).
   Uses regex-based extraction for link URLs and text content. */

export function extractLinks(html, baseUrl) {
  const urls = [];
  const linkRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = linkRegex.exec(html)) !== null) {
    let href = m[1];
    const text = m[2].replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    try {
      if (href.startsWith("/")) href = new URL(href, baseUrl).href;
      else if (!href.startsWith("http")) href = new URL(href, baseUrl).href;
    } catch (e) { continue; }
    urls.push({ url: href, text });
  }
  return urls;
}

export function extractText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function cleanText(s) {
  return String(s || "").replace(/\s+/g, " ").trim();
}

export function parseMoney(s) {
  if (s == null) return null;
  const m = String(s).match(/([\d  ]+[.,]?\d*)/);
  if (!m) return null;
  return parseFloat(m[1].replace(/ | /g, "").replace(/,/, "."));
}

/* Extract price + was-price pairs from text. Returns {price, was, percent} */
export function extractPriceInfo(text) {
  const result = { price: null, was: null, percent: null };

  // CHF prices: CHF 1299, CHF 1'299.95
  const chfPrices = [];
  for (const m of text.matchAll(/CHF\s*([\d'.,]+)/gi)) {
    const v = parseMoney(m[1]);
    if (v != null && v > 5 && v < 100000) chfPrices.push(v);
  }
  if (chfPrices.length >= 2) {
    result.price = chfPrices[0];
    result.was = chfPrices[1];
  } else if (chfPrices.length === 1) {
    result.price = chfPrices[0];
  }

  // Percent discount: -30%, 30% rabatt, −41% RABATT
  const pctMatch = text.match(/−?\s*(\d{1,3})\s*%/);
  if (pctMatch) {
    const pct = parseInt(pctMatch[1]);
    if (pct >= 1 && pct <= 90) result.percent = pct;
  }

  return result;
}

export function extractTitle(html) {
  const m = html.match(/<title>([\s\S]*?)<\/title>/i);
  return m ? cleanText(m[1]) : null;
}

export function parseDeDate(s) {
  const m = s.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if (!m) return null;
  return `${m[3]}-${String(m[2]).padStart(2, "0")}-${String(m[1]).padStart(2, "0")}`;
}
