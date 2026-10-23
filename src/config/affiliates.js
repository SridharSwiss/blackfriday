/* Affiliate IDs. Every outbound shop link goes through affLink(). */
/* ============ AFFILIATE CONFIG — fill in your IDs here ============
   Every outbound link goes through affLink(). Until an ID is set, the link
   goes straight to the retailer with UTM tags so nothing breaks.
   network: "amazon" (PartnerNet tag) | "awin" | "tradedoubler" | null      */
export const AFF = {
  site: "aktion-ch",
  amazon:       { network:"amazon", tag:"blackfrida08d-21" },  // Amazon.de PartnerNet
  amazoncom:    { network:"amazon", tag:"" },                 // Amazon.com Associates (US) — separate tag needed
  bestbuy:      { network:null },                             // Best Buy (Impact)
  walmart:      { network:null },                             // Walmart (Impact)
  target:       { network:null },                             // Target (Impact)
  galaxus:      { network:null, programId:"", siteId:"" },    // Digitec Galaxus partner programme
  digitec:      { network:null, programId:"", siteId:"" },
  brack:        { network:null, mid:"", affid:"" },
  interdiscount:{ network:null, mid:"", affid:"" },
  mediamarkt:   { network:null, mid:"", affid:"" },
  fnac:         { network:null, mid:"", affid:"" },
  daydeal:      { network:null, mid:"", affid:"" },
  samsung:      { network:null, mid:"", affid:"" },
  manor:        { network:null, mid:"", affid:"" },
  fust:         { network:null, mid:"", affid:"" },
  zalando:      { network:null, mid:"", affid:"" },
  jumbo:        { network:null, mid:"", affid:"" },
  keepa:        { network:"none" },
  reifenonline: { network:"none" },                           // Awin tracked short link (tidd.ly)                           // price tracker, not a shop
  orellfuessli: { network:null, mid:"", affid:"" },
  toppreise:    { network:null }
};
export function affLink(shop, url){
  const c = AFF[shop] || {};
  if (c.network === "none") return url;
  const u = new URL(url);
  if (c.network === "amazon" && c.tag){ u.searchParams.set("tag", c.tag); return u.toString(); }
  if (c.network === "awin" && c.mid && c.affid)
    return `https://www.awin1.com/cread.php?awinmid=${c.mid}&awinaffid=${c.affid}&ued=${encodeURIComponent(url)}`;
  if (c.network === "tradedoubler" && c.programId && c.siteId)
    return `https://clk.tradedoubler.com/click?p=${c.programId}&a=${c.siteId}&url=${encodeURIComponent(url)}`;
  u.searchParams.set("utm_source", AFF.site); u.searchParams.set("utm_medium","affiliate"); u.searchParams.set("utm_campaign","blackfriday2026");
  return u.toString();
}
