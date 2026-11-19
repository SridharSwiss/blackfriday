import fs from "fs";
const R = process.env.DEALS_WORK || "./.deals-work", F = "src/data/live-ch.js";
const base = fs.readFileSync(R + "/live-ch.base.js", "utf8");
const i = base.indexOf("export const LIVE_CH = "), j = base.indexOf("];", i) + 2;
const L = JSON.parse(base.slice(i + 23, j - 1));
const V = new Map();
for (const f of fs.readdirSync(R + "/out").filter(f => f.endsWith(".jsonl") && !/^(disc|top100|us)/.test(f)))
  for (const l of fs.readFileSync(R + "/out/" + f, "utf8").split("\n")) { try { const o = JSON.parse(l); if (o && o.id != null) V.set(+o.id, o); } catch {} }
const st = {}, out = [];
L.forEach((r, id) => {
  const v = V.get(id), k = v ? v.v : "unchecked"; st[k] = (st[k] || 0) + 1;
  if (["no_deal", "broken", "soldout"].includes(k)) return;
  if (k === "updated" && r.shop === "amazon") { st.amz_upd_kept = (st.amz_upd_kept || 0) + 1; out.push(r); return; }
  if (k === "updated") { if (!(v.was_now > v.price_now) || 1 - v.price_now / v.was_now < 0.10) { st.dropped_after_upd = (st.dropped_after_upd || 0) + 1; return; } r = { ...r, price: +v.price_now, was: +v.was_now }; delete r.percent; }
  if (k === "ok" || k === "updated") r = { ...r, checked: "2026-11-19" };
  out.push(r);
});
// optional extra new rows (waves): out/new-*.json arrays already filtered
let added = 0; const have = new Set(out.map(r => r.url));
for (const f of fs.existsSync(R + "/new") ? fs.readdirSync(R + "/new") : []) for (const r of JSON.parse(fs.readFileSync(R + "/new/" + f))) if (!have.has(r.url)) { out.push(r); have.add(r.url); added++; }
// AMZTAG: every Amazon link carries the PartnerNet tag
for (const r of out) { try { const u = new URL(r.url); if (/(^|\.)amazon\.de$/.test(u.hostname)) { u.searchParams.set("tag", "blackfrida08d-21"); r.url = u.toString(); } else if (/(^|\.)amazon\.com$/.test(u.hostname)) { u.searchParams.set("tag", "blackfrid0c4a-20"); r.url = u.toString(); } } catch {} }
const head = base.slice(0, i).replace(/\/\* Live deals in Switzerland\./, "/* Live deals in Switzerland. Re-verified in a real browser 19.11.2026.");
fs.writeFileSync(F, head + "export const LIVE_CH = " + JSON.stringify(out) + ";" + "\n" + base.slice(j).replace(/^\n/, ""));
console.log(st, { added, total: out.length });
