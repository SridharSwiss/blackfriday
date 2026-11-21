/* Fetches REAL, licensed product photos from the official Amazon Product Advertising API (PA API 5.0)
   for every live-ch.js deal whose shop is "amazon" (204 at last count, each already has a /dp/ASIN URL),
   and writes them into src/data/images.js so the cards show the actual product photo instead of the
   generic category illustration.

   This is the only Amazon image source allowed on this site (see the licensing note at the top of
   src/data/images.js) — it is Amazon's own API, built for affiliates, and returns images you are
   explicitly licensed to use on your site in exchange for using your affiliate tag.

   ----------------------------------------------------------------------------------------------------
   REQUIREMENTS BEFORE THIS CAN RUN
   ----------------------------------------------------------------------------------------------------
   1. PA API access only unlocks once your Associates/PartnerNet account has 3 qualifying sales in the
      trailing 180 days. Until then Amazon's API returns "TooManyRequests"/"AccessDenied" for every call.
   2. Once unlocked, create API credentials in your Associates Central account (Tools > Product
      Advertising API) and set these as environment variables (never hard-code them in this file):
        AMAZON_PA_ACCESS_KEY   - your PA API access key
        AMAZON_PA_SECRET_KEY   - your PA API secret key
        AMAZON_PA_PARTNER_TAG  - defaults to "blackfrida08d-21" (your Amazon.de PartnerNet tag)
        AMAZON_PA_HOST         - defaults to "webservices.amazon.de"
        AMAZON_PA_REGION       - defaults to "eu-west-1"
        AMAZON_PA_MARKETPLACE  - defaults to "www.amazon.de"
   3. This process also needs to actually reach webservices.amazon.de over HTTPS. Claude's own sandboxed
      sessions run behind an egress allowlist that blocks this host by default — the account owner can
      add it under claude.ai Settings > Capabilities (or run this script from any machine/CI job that has
      normal internet access, since it's a one-shot fetch, not a running service).

   Usage:  node scripts/images/amazon-pa-api.mjs
   Rate limit: Amazon requires >=1 request/second for new accounts (more opens up with sales volume) -
   this script sleeps 1.2s between batches of 10 ASINs, which is the API's per-request item cap. */

import fs from "fs";
import crypto from "node:crypto";
import { ProxyAgent, setGlobalDispatcher } from "undici";

const proxyUrl = process.env.HTTPS_PROXY || process.env.https_proxy;
if (proxyUrl) setGlobalDispatcher(new ProxyAgent(proxyUrl));

const ACCESS_KEY = process.env.AMAZON_PA_ACCESS_KEY;
const SECRET_KEY = process.env.AMAZON_PA_SECRET_KEY;
const PARTNER_TAG = process.env.AMAZON_PA_PARTNER_TAG || "blackfrida08d-21";
const HOST = process.env.AMAZON_PA_HOST || "webservices.amazon.de";
const REGION = process.env.AMAZON_PA_REGION || "eu-west-1";
const MARKETPLACE = process.env.AMAZON_PA_MARKETPLACE || "www.amazon.de";
const SERVICE = "ProductAdvertisingAPI";
const LIVE_CH_PATH = new URL("../../src/data/live-ch.js", import.meta.url);
const IMAGES_PATH = new URL("../../src/data/images.js", import.meta.url);

if (!ACCESS_KEY || !SECRET_KEY) {
  console.error(
    "Missing AMAZON_PA_ACCESS_KEY / AMAZON_PA_SECRET_KEY environment variables.\n" +
    "This script needs real Amazon Product Advertising API credentials - see the comment at the top of this file for how to get them.\n" +
    "Nothing was fetched or changed."
  );
  process.exit(1);
}

function sha256Hex(s) { return crypto.createHash("sha256").update(s, "utf8").digest("hex"); }
function hmac(key, s) { return crypto.createHmac("sha256", key).update(s, "utf8").digest(); }

function signedHeaders(payload, target) {
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);
  const canonicalHeaders =
    `content-encoding:amz-1.0\ncontent-type:application/json; charset=utf-8\nhost:${HOST}\n` +
    `x-amz-date:${amzDate}\nx-amz-target:${target}\n`;
  const signedHeaderNames = "content-encoding;content-type;host;x-amz-date;x-amz-target";
  const canonicalRequest = [
    "POST", "/paapi5/getitems", "", canonicalHeaders, signedHeaderNames, sha256Hex(payload),
  ].join("\n");
  const credentialScope = `${dateStamp}/${REGION}/${SERVICE}/aws4_request`;
  const stringToSign = ["AWS4-HMAC-SHA256", amzDate, credentialScope, sha256Hex(canonicalRequest)].join("\n");
  const kDate = hmac(`AWS4${SECRET_KEY}`, dateStamp);
  const kRegion = hmac(kDate, REGION);
  const kService = hmac(kRegion, SERVICE);
  const kSigning = hmac(kService, "aws4_request");
  const signature = crypto.createHmac("sha256", kSigning).update(stringToSign, "utf8").digest("hex");
  const authorization =
    `AWS4-HMAC-SHA256 Credential=${ACCESS_KEY}/${credentialScope}, SignedHeaders=${signedHeaderNames}, Signature=${signature}`;
  return {
    "content-encoding": "amz-1.0",
    "content-type": "application/json; charset=utf-8",
    host: HOST,
    "x-amz-date": amzDate,
    "x-amz-target": target,
    authorization,
  };
}

async function getItems(asins) {
  const target = "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems";
  const body = {
    ItemIds: asins,
    Resources: ["Images.Primary.Medium", "Images.Primary.Large", "ItemInfo.Title"],
    PartnerTag: PARTNER_TAG,
    PartnerType: "Associates",
    Marketplace: MARKETPLACE,
  };
  const payload = JSON.stringify(body);
  const headers = signedHeaders(payload, target);
  const res = await fetch(`https://${HOST}/paapi5/getitems`, { method: "POST", headers, body: payload });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = json?.Errors?.[0]?.Message || res.statusText;
    throw new Error(`PA API ${res.status}: ${msg}`);
  }
  return json;
}

function extractAmazonEntries(liveChSource) {
  const re = /\{[^{}]*"shop":"amazon"[^{}]*\}/g;
  const out = [];
  for (const m of liveChSource.match(re) || []) {
    const name = m.match(/"name":"((?:[^"\\]|\\.)*)"/)?.[1];
    const url = m.match(/"url":"((?:[^"\\]|\\.)*)"/)?.[1];
    const asin = url && url.match(/\/dp\/([A-Z0-9]{10})/)?.[1];
    if (name && asin) out.push({ name: name.replace(/\\"/g, '"'), asin });
  }
  return out;
}

function chunk(arr, n) { const out = []; for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n)); return out; }
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  const liveCh = fs.readFileSync(LIVE_CH_PATH, "utf8");
  const entries = extractAmazonEntries(liveCh);
  console.log(`Found ${entries.length} live-ch.js deals with shop:"amazon" and a /dp/ASIN URL.`);
  if (!entries.length) { console.log("Nothing to fetch."); return; }

  const asinToNames = new Map(); // one ASIN can back more than one card (rare, but names must all get the image)
  for (const e of entries) {
    if (!asinToNames.has(e.asin)) asinToNames.set(e.asin, []);
    asinToNames.get(e.asin).push(e.name);
  }
  const asins = [...asinToNames.keys()];
  const batches = chunk(asins, 10); // GetItems allows at most 10 ItemIds per request
  const found = {}; // name -> image URL
  let okBatches = 0, failedBatches = 0;

  for (const [i, batch] of batches.entries()) {
    try {
      const res = await getItems(batch);
      for (const item of res.ItemsResult?.Items || []) {
        const url = item.Images?.Primary?.Medium?.URL || item.Images?.Primary?.Large?.URL;
        if (!url) continue;
        for (const name of asinToNames.get(item.ASIN) || []) found[name] = url;
      }
      okBatches++;
      console.log(`Batch ${i + 1}/${batches.length}: ok (${res.ItemsResult?.Items?.length || 0} items)`);
    } catch (e) {
      failedBatches++;
      console.log(`Batch ${i + 1}/${batches.length}: FAILED - ${e.message}`);
    }
    if (i < batches.length - 1) await sleep(1200); // stay under the 1 req/sec minimum rate limit
  }

  console.log(`\nBatches ok: ${okBatches}, failed: ${failedBatches}. Images found: ${Object.keys(found).length}/${asins.length} ASINs.`);
  if (!Object.keys(found).length) { console.log("No images to write - leaving images.js untouched."); return; }

  // Merge into the existing IMAGES map rather than overwriting it. Only parse inside the actual
  // `export const IMAGES = { ... }` object - the file's leading comment also contains an example
  // "key": "value" pair that must NOT be picked up as a real entry.
  const imagesSrc = fs.readFileSync(IMAGES_PATH, "utf8");
  const objStart = imagesSrc.indexOf("export const IMAGES");
  const braceStart = imagesSrc.indexOf("{", objStart);
  const braceEnd = imagesSrc.lastIndexOf("};");
  const objBody = imagesSrc.slice(braceStart + 1, braceEnd);
  const existing = {};
  const assignRe = /"((?:[^"\\]|\\.)*)":\s*"((?:[^"\\]|\\.)*)"/g;
  let m;
  while ((m = assignRe.exec(objBody)) !== null) existing[m[1].replace(/\\"/g, '"')] = m[2];
  const merged = { ...existing, ...found };
  const body = Object.entries(merged)
    .map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`)
    .join("\n");
  const header = imagesSrc.slice(0, objStart);
  fs.writeFileSync(IMAGES_PATH, `${header}export const IMAGES = {\n${body}\n};\n`);
  console.log(`Wrote ${Object.keys(merged).length} total image entries to src/data/images.js (${Object.keys(found).length} new/updated this run).`);
}

main().catch(e => { console.error("FATAL:", e); process.exit(1); });
