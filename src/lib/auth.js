/* Passwordless email-link login on Supabase Auth (GoTrue REST, no SDK). Session lives in localStorage only after the visitor signs in. */
import { BACKEND, ENABLED } from "../config/backend.js";
const K = "bf-auth";
const H = extra => ({ apikey: BACKEND.key, "Content-Type": "application/json", ...extra });
let S = null;
const load = () => { try { S = JSON.parse(localStorage.getItem(K) || "null"); } catch (e) { S = null; } };
const store = s => { S = s; try { s ? localStorage.setItem(K, JSON.stringify(s)) : localStorage.removeItem(K); } catch (e) {} };
export const user = () => (S ? { id: S.id, email: S.email } : null);
export const token = () => (S && S.exp * 1000 > Date.now() + 5000 ? S.access : null);

async function whoami(access) {
  const r = await fetch(BACKEND.url + "/auth/v1/user", { headers: H({ Authorization: "Bearer " + access }) });
  return r.ok ? r.json() : null;
}
async function refresh() {
  if (!S || !S.refresh) return false;
  const r = await fetch(BACKEND.url + "/auth/v1/token?grant_type=refresh_token", { method: "POST", headers: H(), body: JSON.stringify({ refresh_token: S.refresh }) }).catch(() => null);
  if (!r || !r.ok) { store(null); return false; }
  const j = await r.json(); store({ ...S, access: j.access_token, refresh: j.refresh_token, exp: Math.floor(Date.now() / 1000) + (j.expires_in || 3600) });
  return true;
}
/* Call once at startup: finishes a magic-link return (#access_token=...) or refreshes a stored session. Returns the user or null. */
export async function initAuth() {
  if (!ENABLED) return null;
  load();
  const h = new URLSearchParams(location.hash.replace(/^#/, ""));
  if (h.get("access_token") && h.get("refresh_token")) {
    const access = h.get("access_token"), u = await whoami(access);
    try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {}
    if (u) { store({ id: u.id, email: u.email, access, refresh: h.get("refresh_token"), exp: Math.floor(Date.now() / 1000) + Number(h.get("expires_in") || 3600) }); return { ...user(), fresh: true }; }
  }
  if (S && !token()) await refresh();
  return user();
}
export async function sendLink(email) {
  try {
    const r = await fetch(BACKEND.url + "/auth/v1/otp?redirect_to=" + encodeURIComponent(location.origin + location.pathname), { method: "POST", headers: H(), body: JSON.stringify({ email: email.trim().toLowerCase(), create_user: true }) });
    if (r.ok) return "";
    const j = await r.json().catch(() => ({}));
    return j.msg || j.message || j.error_description || ("Error " + r.status);
  } catch (e) { return "Network error"; }
}
export function signOut() { store(null); }
const api = (path, opt = {}) => fetch(BACKEND.url + "/rest/v1/" + path, { ...opt, headers: H({ Authorization: "Bearer " + token(), Prefer: "return=minimal", ...(opt.headers || {}) }) });
export async function pullWatch() {
  if (!token()) return null;
  const r = await api("watchlist?select=deal_id&order=created_at.desc", { headers: { Prefer: "" } }).catch(() => null);
  return r && r.ok ? (await r.json()).map(x => x.deal_id) : null;
}
export async function pushWatch(id, on) {
  if (!token()) return;
  if (on) await api("watchlist?on_conflict=user_id,deal_id", { method: "POST", headers: { Prefer: "resolution=ignore-duplicates,return=minimal" }, body: JSON.stringify({ deal_id: id }) }).catch(() => {});
  else await api("watchlist?deal_id=eq." + encodeURIComponent(id), { method: "DELETE" }).catch(() => {});
}
export async function deleteAccount() {
  if (!token()) return false;
  const r = await api("rpc/delete_my_account", { method: "POST", body: "{}" }).catch(() => null);
  if (r && r.ok) { store(null); return true; }
  return false;
}
