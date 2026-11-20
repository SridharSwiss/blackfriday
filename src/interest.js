/* On-device interest profile. Learns from clicks, saves and category choices; never leaves this browser.
   Used to re-rank "Recommended", fill the "Picked for you" shelf and order the partner tabs. */
const K = "bf_interest_v1";
let P = { c: {}, s: {}, x: {}, v: [], t: Date.now() };
try { const j = JSON.parse(localStorage.getItem(K)); if (j && j.c) P = { ...P, ...j }; } catch (e) {}
// gentle decay so old interests fade (once per 12 h)
if (Date.now() - (P.t || 0) > 432e5) { for (const g of ["c", "s", "x"]) for (const k in P[g]) { P[g][k] *= 0.85; if (P[g][k] < 0.3) delete P[g][k]; } P.t = Date.now(); }
const persist = () => { try { localStorage.setItem(K, JSON.stringify(P)); } catch (e) {} };
const add = (g, k, w) => { if (k) P[g][k] = Math.min(40, (P[g][k] || 0) + w); };
export const bumpDeal = (d, w) => { if (!d) return; add("c", d.cat, w); add("s", d.shop, w / 2); if (w >= 2) { P.v = [d.id, ...P.v.filter(x => x !== d.id)].slice(0, 80); } persist(); };
export const bumpKey = (g, k, w) => { add(g, k, w); persist(); };
export const get = (g, k) => P[g][k] || 0;
export const score = d => (P.c[d.cat] || 0) + 0.5 * (P.s[d.shop] || 0);
export const seen = id => P.v.includes(id);
export const total = () => Object.values(P.c).reduce((a, b) => a + b, 0);
export const topCat = () => Object.entries(P.c).sort((a, b) => b[1] - a[1])[0]?.[0] || "";
export const topKey = g => Object.entries(P[g]).sort((a, b) => b[1] - a[1])[0]?.[0] || "";
export const reset = () => { P = { c: {}, s: {}, x: {}, v: [], t: Date.now() }; persist(); };
