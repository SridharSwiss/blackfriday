/* Admin dashboard. Access is enforced in the database (public.is_admin); this page only displays what the RPC returns. */
import { BACKEND, ENABLED } from "./config/backend.js";
import { initAuth, token, user, sendLink, signOut, signInPassword, resetPassword } from "./lib/auth.js";
const app = document.getElementById("app");
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const n = x => Number(x || 0).toLocaleString("en-US");
const msg = (t, extra = "") => { app.innerHTML = `<div class="msg"><h1>AKTIONS.CH admin</h1><p class="muted" id="m">${t}</p>${extra}</div>`; };
async function rpc(name, body) {
  const r = await fetch(BACKEND.url + "/rest/v1/rpc/" + name, { method: "POST", headers: { apikey: BACKEND.key, Authorization: "Bearer " + token(), "Content-Type": "application/json" }, body: JSON.stringify(body || {}) });
  if (!r.ok) { const e = new Error("rpc " + r.status); e.status = r.status; throw e; }
  return r.json();
}
const bars = rows => { const max = Math.max(1, ...rows.map(r => r.n)); return rows.length ? rows.map(r => `<div class="bar"><div class="t"><i class="f" style="width:${Math.round(r.n / max * 100)}%"></i><span title="${esc(r.k)}">${esc(r.k || "unknown")}${r.shop ? " · " + esc(r.shop) : ""}</span></div><em>${n(r.n)}</em></div>`).join("") : `<p class="muted">No data yet.</p>`; };
function spark(daily, key) {
  if (!daily.length) return `<p class="muted">No data yet.</p>`;
  const W = 600, H = 110, max = Math.max(1, ...daily.map(d => d[key])), bw = W / daily.length;
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="${key} per day">${daily.map((d, i) => { const h = Math.max(1, d[key] / max * (H - 6)); return `<rect x="${(i * bw + 1).toFixed(1)}" y="${(H - h).toFixed(1)}" width="${Math.max(1, bw - 2).toFixed(1)}" height="${h.toFixed(1)}" rx="2" fill="var(--red)" opacity=".85"><title>${d.day}: ${d[key]}</title></rect>`; }).join("")}</svg>`;
}
async function dash(days) {
  const d = await rpc("admin_dashboard", { days }), t = d.totals, c = d.consent;
  const rate = c.decisions ? Math.round(c.accepted / c.decisions * 100) + "%" : "–";
  const tile = (v, l) => `<div class="tile"><b>${v}</b><span>${l}</span></div>`;
  app.innerHTML = `<header><h1>AKTIONS.CH admin</h1><div class="row"><select id="days">${[7, 30, 90, 365].map(x => `<option value="${x}"${x === days ? " selected" : ""}>Last ${x} days</option>`).join("")}</select><button id="rf">Refresh</button><span class="muted">${esc(user().email)}</span><button id="so">Sign out</button></div></header>
  <div class="tiles">${tile(n(t.visitors), "Visitors")}${tile(n(t.sessions), "Sessions")}${tile(n(t.pageviews), "Page views")}${tile(n(t.shop_clicks), "Shop clicks")}${tile(n(t.saves), "Saves")}${tile(n(d.users) + " (+" + n(d.new_users) + ")", "Accounts (new)")}${tile(rate, "Consent accepted (" + n(c.decisions) + ")")}</div>
  <div class="grid"><div class="card"><h2>Visitors per day</h2>${spark(d.daily, "visitors")}</div><div class="card"><h2>Shop clicks per day</h2>${spark(d.daily, "clicks")}</div>
  <div class="card"><h2>Top shop clicks (deal · shop)</h2>${bars(d.deals)}</div><div class="card"><h2>Clicks by shop</h2>${bars(d.shops)}</div>
  <div class="card"><h2>Tabs viewed</h2>${bars(d.tabs)}</div><div class="card"><h2>Traffic sources (sessions)</h2>${bars(d.sources)}</div>
  <div class="card"><h2>Devices</h2>${bars(d.devices)}</div><div class="card"><h2>Languages</h2>${bars(d.langs)}</div>
  <div class="card"><h2>Newest accounts</h2>${d.recent_users.length ? d.recent_users.map(u => `<div class="bar"><div class="t">${esc(u.email)}</div><em class="muted">${esc(String(u.created_at).slice(0, 10))}</em></div>`).join("") : `<p class="muted">None yet.</p>`}</div></div>`;
  document.getElementById("days").onchange = e => dash(Number(e.target.value));
  document.getElementById("rf").onclick = () => dash(days);
  document.getElementById("so").onclick = () => { signOut(); start(); };
}
function login() {
  msg("Sign in with the admin account.", `<form id="f"><input type="email" required placeholder="Email address" autocomplete="email"><input type="password" placeholder="Password (or leave empty for an email link)" autocomplete="current-password"><button class="solid">Sign in</button></form><p><button type="button" id="fg" style="border:0;background:none;text-decoration:underline;color:inherit;cursor:pointer">Forgot password?</button></p>`);
  const m = () => document.getElementById("m"), em = () => document.querySelector("#f input[type=email]");
  document.getElementById("f").onsubmit = async e => {
    e.preventDefault(); m().textContent = "…"; const pw = e.target.querySelector("input[type=password]").value;
    if (pw) { const r = await signInPassword(em().value, pw); if (r) m().textContent = /invalid|credentials/i.test(r) ? "Wrong email or password." : r; else start(); return; }
    const r = await sendLink(em().value); m().textContent = r ? "Could not send the link: " + r : "Check your inbox and open the link.";
  };
  document.getElementById("fg").onclick = async () => { if (!em().reportValidity()) return; m().textContent = "…"; const r = await resetPassword(em().value); m().textContent = r ? "Could not send: " + r : "Check your inbox for the reset link."; };
}
async function start() {
  if (!ENABLED) return msg("Backend not configured.");
  await initAuth();
  if (!user()) return login();
  try { await dash(30); }
  catch (e) {
    if (e.status === 401 || e.status === 403 || e.status === 400) return msg(`Signed in as ${esc(user().email)}, but this account is not an admin.`, `<form><button type="button" id="so">Sign out</button></form>`) || (document.getElementById("so").onclick = () => { signOut(); start(); });
    msg("Could not load data. Make sure supabase/admin.sql has been run.");
  }
}
start();
