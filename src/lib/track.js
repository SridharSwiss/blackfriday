/* First-party anonymous analytics. Sends nothing unless the backend is configured AND the visitor accepted analytics. */
import { BACKEND, ENABLED, POLICY_VERSION } from "../config/backend.js";
import { getConsent, visitorId, onConsent } from "./consent.js";
import { token } from "./auth.js";

/* Owner/internal testing exclusion: visiting the site once with ?notrack=1 sets a persistent flag in this
   browser so none of its future visits are sent to analytics, however consent is answered - real visitor
   stats stay clean while testing. ?notrack=0 removes the flag again. */
(() => {
  try {
    const v = new URLSearchParams(location.search).get("notrack");
    if (v === "1") localStorage.setItem("bf-notrack", "1");
    else if (v === "0") localStorage.removeItem("bf-notrack");
  } catch (e) {}
})();
const isExcluded = () => { try { return localStorage.getItem("bf-notrack") === "1"; } catch (e) { return false; } };
let q = [], timer = null, first = true;
const sid = () => { try { let s = sessionStorage.getItem("bf-sid"); if (!s) { s = crypto.randomUUID(); sessionStorage.setItem("bf-sid", s); } return s; } catch (e) { return null; } };
const device = () => (matchMedia("(max-width: 760px)").matches ? "mobile" : matchMedia("(max-width: 1100px)").matches ? "tablet" : "desktop");
const post = (path, body, keep) => fetch(BACKEND.url + "/rest/v1/" + path, { method: "POST", keepalive: !!keep,
  headers: { apikey: BACKEND.key, "Content-Type": "application/json", Prefer: "return=minimal", ...(token() ? { Authorization: "Bearer " + token() } : {}) }, body: JSON.stringify(body) }).catch(() => {});
function flush(keep) { clearTimeout(timer); timer = null; if (!q.length) return; const b = q; q = []; post("events", b, keep); }
export function track(type, d = {}) {
  if (isExcluded()) return;
  const c = getConsent(); if (!ENABLED || !c || !c.a) return;
  const v = visitorId(), s = sid(); if (!v || !s) return;
  const u = new URLSearchParams(location.search);
  let ref = null; if (first && document.referrer) { try { const r = new URL(document.referrer); if (r.origin !== location.origin) ref = r.origin; } catch (e) {} }
  q.push({ visitor_id: v, session_id: s, type, tab: d.tab || null, deal_id: d.deal || null, shop: d.shop || null, path: location.pathname, referrer: first ? ref : null,
    utm_source: first ? u.get("utm_source") : null, utm_medium: first ? u.get("utm_medium") : null, utm_campaign: first ? u.get("utm_campaign") : null,
    lang: document.documentElement.lang || null, device: device() });
  first = false;
  if (!timer) timer = setTimeout(() => flush(false), 4000);
}
/* Consent log: records the choice, policy version and time (random ID if the visitor declined analytics). */
onConsent(c => { if (!ENABLED || isExcluded()) return; post("consents", [{ visitor_id: c.a ? visitorId() : crypto.randomUUID(), policy_version: POLICY_VERSION, analytics: c.a, lang: document.documentElement.lang || null }]); if (c.a) track("pageview"); });
addEventListener("pagehide", () => flush(true));
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") flush(true); });
